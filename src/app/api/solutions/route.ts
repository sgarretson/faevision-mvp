import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSolutionSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  inputIds: z.array(z.string().cuid()).optional(), // Solutions can be created from multiple inputs
  estimatedEffort: z.string().optional(),
  targetCompletion: z.string().datetime().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to create solutions (Executive or Admin)
    if (!['ADMIN', 'EXECUTIVE'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createSolutionSchema.parse(body)

    // Create the solution
    const solution = await prisma.solution.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        status: 'PLANNING',
        priority: validatedData.priority,
        estimatedEffort: validatedData.estimatedEffort,
        targetCompletion: validatedData.targetCompletion
          ? new Date(validatedData.targetCompletion)
          : null,
        ownerId: session.user.id,
        // Connect to inputs if provided
        inputs: validatedData.inputIds
          ? {
              connect: validatedData.inputIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
        inputs: {
          select: {
            id: true,
            title: true,
            type: true,
            priority: true,
            department: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    })

    // Log the creation for audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_SOLUTION',
        entityType: 'solution',
        entityId: solution.id,
        metadata: {
          title: solution.title,
          priority: solution.priority,
          estimatedEffort: solution.estimatedEffort,
          inputCount: validatedData.inputIds?.length || 0,
        },
      },
    })

    return NextResponse.json({
      success: true,
      solution,
      message: 'Solution created successfully',
    })
  } catch (error) {
    console.error('Solution creation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const ownerId = searchParams.get('ownerId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (ownerId) where.ownerId = ownerId

    // Get solutions with related data
    const solutions = await prisma.solution.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
        inputs: {
          select: {
            id: true,
            title: true,
            type: true,
            priority: true,
            department: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // Get total count for pagination
    const totalCount = await prisma.solution.count({ where })

    return NextResponse.json({
      solutions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('Solution fetch error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
