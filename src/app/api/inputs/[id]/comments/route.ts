import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * Input Comments API Route
 *
 * Handles comments for specific inputs/signals:
 * - GET: Retrieve comments for an input
 * - POST: Create a new comment on an input
 *
 * Expert: Alex Thompson (Lead Developer)
 * Support: Morgan Smith (Database Architect)
 */

const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(2000),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Input ID is required' },
        { status: 400 }
      );
    }

    // Verify the signal exists
    const signal = await (prisma as any).signal?.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!signal) {
      return NextResponse.json({ error: 'Input not found' }, { status: 404 });
    }

    // Get comments for this signal
    const comments = await (prisma as any).comment?.findMany({
      where: {
        entityType: 'SIGNAL',
        entityId: id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      comments: comments || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Input ID is required' },
        { status: 400 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = createCommentSchema.parse(body);

    // Verify the signal exists
    const signal = await (prisma as any).signal?.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!signal) {
      return NextResponse.json({ error: 'Input not found' }, { status: 404 });
    }

    // Create the comment
    const comment = await (prisma as any).comments.create({
      data: {
        content: validatedData.content,
        entityType: 'SIGNAL',
        entityId: id,
        createdBy: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Log the comment creation for audit
    await (prisma as any).auditLog?.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_COMMENT',
        entityType: 'SIGNAL',
        entityId: id,
        changes: {
          content: validatedData.content,
        },
      },
    });

    return NextResponse.json({
      comment,
      message: 'Comment created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Create comment error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
