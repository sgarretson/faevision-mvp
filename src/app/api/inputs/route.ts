import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
  issueType: z
    .enum(['PROCESS', 'TECHNOLOGY', 'COMMUNICATION', 'RESOURCE', 'OTHER'])
    .optional(),
  rootCause: z
    .string()
    .max(500, 'Root cause must be less than 500 characters')
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input data
    const validatedData = createInputSchema.parse(body);

    // Create the signal (V2 model)
    const input = await (prisma as any).signal.create({
      data: {
        inputId: `AE-SIGNAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        title: validatedData.title,
        description: validatedData.description,
        severity:
          validatedData.priority === 'HIGH'
            ? 'HIGH'
            : validatedData.priority === 'LOW'
              ? 'LOW'
              : 'MEDIUM',
        severityScore:
          validatedData.priority === 'HIGH'
            ? 4
            : validatedData.priority === 'LOW'
              ? 2
              : 3,
        sourceType: 'manual',
        createdById: session.user.id,
        // Note: AI processing will be triggered via background job
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
    });

    // Log the creation for audit
    await (prisma as any).auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_SIGNAL',
        entityType: 'SIGNAL',
        entityId: input.id,
        changes: {
          title: input.title,
          severity: input.severity,
          description: input.description,
        },
      },
    });

    // Map Signal model fields to frontend interface
    const mappedInput = {
      id: input.id,
      title: input.title || 'Untitled Signal',
      description: input.description,
      type: 'GENERAL',
      status: 'ACTIVE',
      department: input.department?.name,
      issueType: input.category?.name || 'General',
      rootCause: '',
      priority:
        input.severity === 'HIGH'
          ? 'HIGH'
          : input.severity === 'LOW'
            ? 'LOW'
            : 'MEDIUM',
      createdAt: input.receivedAt.toISOString(),
      creator: input.createdBy
        ? {
            id: input.createdBy.id,
            name: input.createdBy.name,
            email: input.createdBy.email,
            role: input.createdBy.role,
            department: input.createdBy.department,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      input: mappedInput,
      message: 'Strategic input created successfully',
    });
  } catch (error) {
    console.error('Input creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const department = searchParams.get('department');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (department) where.department = department;

    // Get signals (V2 model) with creator info
    const inputs =
      (await (prisma as any).signal?.findMany({
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
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      })) || [];

    // Add computed counts for comments and votes (polymorphic relationships)
    const inputsWithCounts = await Promise.all(
      inputs.map(async (signal: any) => {
        const [commentCount, voteCount] = await Promise.all([
          (prisma as any).comment?.count?.({
            where: {
              entityType: 'SIGNAL',
              entityId: signal.id,
            },
          }) || 0,
          (prisma as any).vote?.count?.({
            where: {
              entityType: 'SIGNAL',
              entityId: signal.id,
            },
          }) || 0,
        ]);

        // Map Signal model fields to frontend interface
        return {
          id: signal.id,
          title: signal.title || 'Untitled Signal',
          description: signal.description,
          type: 'GENERAL', // Map severity to type for now
          status: 'ACTIVE', // Default status
          department: signal.department?.name,
          issueType: signal.category?.name || 'General',
          rootCause: '',
          priority:
            signal.severity === 'HIGH'
              ? 'HIGH'
              : signal.severity === 'LOW'
                ? 'LOW'
                : 'MEDIUM',
          createdAt: signal.receivedAt.toISOString(),
          creator: signal.createdBy
            ? {
                id: signal.createdBy.id,
                name: signal.createdBy.name,
                email: signal.createdBy.email,
                role: signal.createdBy.role,
                department: signal.createdBy.department,
              }
            : null,
          _count: {
            comments: commentCount,
            votes: voteCount,
          },
        };
      })
    );

    // Get total count for pagination
    const totalCount = (await (prisma as any).signal?.count({ where })) || 0;

    return NextResponse.json({
      inputs: inputsWithCounts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error('Input fetch error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
