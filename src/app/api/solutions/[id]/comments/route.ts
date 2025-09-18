import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * Solution Comments API
 *
 * Handles comments on solution pages for collaboration and updates.
 * Provides executive-friendly commenting with proper attribution.
 *
 * Expert: Alex Thompson (Lead Developer)
 * Support: Morgan Smith (Database Architect)
 */

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(2000, 'Comment too long'),
  createdBy: z.string().min(1, 'Creator ID is required'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const solutionId = params.id;

    if (!solutionId) {
      return NextResponse.json(
        { success: false, error: 'Solution ID is required' },
        { status: 400 }
      );
    }

    // Verify solution exists
    const solution = await (prisma as any).solutions.findUnique({
      where: { id: solutionId },
      select: { id: true },
    });

    if (!solution) {
      return NextResponse.json(
        { success: false, error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Fetch comments using polymorphic Comment model
    const comments = await (prisma as any).comments.findMany({
      where: {
        entityType: 'SOLUTION',
        entityId: solutionId,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      comments,
      total: comments.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching solution comments:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch solution comments',
        timestamp: new Date().toISOString(),
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
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const solutionId = params.id;
    const body = await request.json();

    if (!solutionId) {
      return NextResponse.json(
        { success: false, error: 'Solution ID is required' },
        { status: 400 }
      );
    }

    // Validate request body
    const validationResult = createCommentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { content, createdBy } = validationResult.data;

    // Verify user can comment (must be authenticated user)
    if (createdBy !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Verify solution exists
    const solution = await (prisma as any).solutions.findUnique({
      where: { id: solutionId },
      select: { id: true, title: true },
    });

    if (!solution) {
      return NextResponse.json(
        { success: false, error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Create comment using polymorphic Comment model
    const comment = await (prisma as any).comments.create({
      data: {
        content,
        entityType: 'SOLUTION',
        entityId: solutionId,
        createdBy,
      },
      include: {
        users: {
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

    return NextResponse.json({
      success: true,
      comment,
      message: 'Comment added successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating solution comment:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create solution comment',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
