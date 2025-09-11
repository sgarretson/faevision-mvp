import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createInputSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  type: z.enum(['PROBLEM', 'OPPORTUNITY', 'GENERAL']),
  department: z.string().optional(),
  issueType: z.enum(['PROCESS', 'TECHNOLOGY', 'COMMUNICATION', 'RESOURCE', 'OTHER']).optional(),
  rootCause: z.string().max(500, 'Root cause must be less than 500 characters').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate input data
    const validatedData = createInputSchema.parse(body)

    // Create the input
    const input = await prisma.input.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        status: 'NEW', // All new inputs start as NEW
        department: validatedData.department,
        issueType: validatedData.issueType,
        rootCause: validatedData.rootCause,
        priority: validatedData.priority,
        aiProcessed: false, // Will be processed later by AI
        createdBy: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
      },
    })

    // Log the creation for audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_INPUT',
        entityType: 'input',
        entityId: input.id,
        metadata: {
          title: input.title,
          type: input.type,
          department: input.department,
        },
      },
    })

    return NextResponse.json({
      success: true,
      input,
      message: 'Input created successfully',
    })
  } catch (error) {
    console.error('Input creation error:', error)

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
    const type = searchParams.get('type')
    const department = searchParams.get('department')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (type) where.type = type
    if (department) where.department = department

    // Get inputs with creator info
    const inputs = await prisma.input.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
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
    const totalCount = await prisma.input.count({ where })

    return NextResponse.json({
      inputs,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('Input fetch error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
