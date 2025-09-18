import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Solution Detail API
 *
 * Handles fetching individual solution details with comprehensive data
 * including source context, AI planning data, and related entities.
 *
 * Expert: Alex Thompson (Lead Developer)
 * Support: Morgan Smith (Database Architect)
 */

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

    // Fetch solution with full context
    const solution = await (prisma as any).solution.findUnique({
      where: { id: solutionId },
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
        idea: {
          select: {
            id: true,
            title: true,
            description: true,
            origin: true,
            evidenceJson: true,
            tagsJson: true,
          },
        },
        hotspot: {
          select: {
            id: true,
            title: true,
            summary: true,
            confidence: true,
            _count: {
              select: {
                signals: true,
              },
            },
          },
        },
        initiative: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        _count: {
          select: {
            // comments: true, // Will be calculated separately for polymorphic comments
            // tasks: true, // Uncomment when tasks are implemented
          },
        },
      },
    });

    if (!solution) {
      return NextResponse.json(
        { success: false, error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Get comment count using polymorphic model
    const commentCount = await (prisma as any).comments.count({
      where: {
        entityType: 'SOLUTION',
        entityId: solutionId,
      },
    });

    // Add comment count to solution data
    const solutionWithCounts = {
      ...solution,
      _count: {
        ...solution._count,
        comments: commentCount,
        tasks: 0, // TODO: Implement when tasks are added
      },
    };

    return NextResponse.json({
      success: true,
      solution: solutionWithCounts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching solution:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch solution',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const {
      title,
      description,
      status,
      progress,
      estimatedEffort,
      businessValue,
      targetDate,
      successMetrics,
    } = body;

    // Verify solution exists and user has permission
    const existingSolution = await (prisma as any).solution.findUnique({
      where: { id: solutionId },
      select: {
        id: true,
        createdBy: true,
      },
    });

    if (!existingSolution) {
      return NextResponse.json(
        { success: false, error: 'Solution not found' },
        { status: 404 }
      );
    }

    // For now, only allow creator to edit (can be expanded for team permissions)
    if (existingSolution.createdBy !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Update solution
    const updatedSolution = await (prisma as any).solution.update({
      where: { id: solutionId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(progress !== undefined && { progress }),
        ...(estimatedEffort && { estimatedEffort }),
        ...(businessValue && { businessValue }),
        ...(targetDate && { targetDate: new Date(targetDate) }),
        ...(successMetrics && { successMetrics }),
        updatedAt: new Date(),
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

    return NextResponse.json({
      success: true,
      solution: updatedSolution,
      message: 'Solution updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating solution:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to update solution',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Verify solution exists and user has permission
    const existingSolution = await (prisma as any).solution.findUnique({
      where: { id: solutionId },
      select: {
        id: true,
        createdBy: true,
        title: true,
      },
    });

    if (!existingSolution) {
      return NextResponse.json(
        { success: false, error: 'Solution not found' },
        { status: 404 }
      );
    }

    // For now, only allow creator to delete (can be expanded for admin permissions)
    if (existingSolution.createdBy !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Delete solution (this will cascade to comments via database constraints)
    await (prisma as any).solution.delete({
      where: { id: solutionId },
    });

    return NextResponse.json({
      success: true,
      message: `Solution "${existingSolution.title}" deleted successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting solution:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete solution',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
