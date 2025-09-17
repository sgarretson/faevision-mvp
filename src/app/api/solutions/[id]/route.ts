import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const solutionId = params.id;

    // Get solution with all related data (V2 model)
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
        // V2 relationships
        hotspot: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        initiative: {
          select: {
            id: true,
            title: true,
          },
        },
        idea: {
          select: {
            id: true,
            title: true,
          },
        },
        // Legacy relationships (maintained for backward compatibility)
        input: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        requirements: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        frdDocuments: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            requirements: true,
            frdDocuments: true,
          },
        },
      },
    });

    if (!solution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Map to frontend interface
    const mappedSolution = {
      id: solution.id,
      title: solution.title,
      description: solution.description,
      status: solution.status,
      priority: solution.priority,
      targetDate: solution.targetDate,
      completionDate: solution.completionDate,
      estimatedEffort: solution.estimatedEffort,
      businessValue: solution.businessValue,
      successMetrics: solution.successMetrics,
      expectedImpactJson: solution.expectedImpactJson,
      actualImpactJson: solution.actualImpactJson,
      createdAt: solution.createdAt.toISOString(),
      updatedAt: solution.updatedAt.toISOString(),
      creator: solution.creator,
      // Source information
      input: solution.input,
      hotspot: solution.hotspot,
      initiative: solution.initiative,
      idea: solution.idea,
      // Related entities
      requirements: solution.requirements,
      frdDocuments: solution.frdDocuments,
      _count: solution._count,
    };

    return NextResponse.json({
      solution: mappedSolution,
    });
  } catch (error) {
    console.error('Solution fetch error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const solutionId = params.id;
    const body = await request.json();

    // Check if solution exists and user has permission
    const existingSolution = await (prisma as any).solution.findUnique({
      where: { id: solutionId },
      select: {
        id: true,
        createdBy: true,
      },
    });

    if (!existingSolution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Only creator or admin can update
    if (
      existingSolution.createdBy !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update solution
    const updatedSolution = await (prisma as any).solution.update({
      where: { id: solutionId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        targetDate: body.targetDate ? new Date(body.targetDate) : null,
        completionDate: body.completionDate
          ? new Date(body.completionDate)
          : null,
        estimatedEffort: body.estimatedEffort,
        businessValue: body.businessValue,
        successMetrics: body.successMetrics,
        expectedImpactJson: body.expectedImpactJson,
        actualImpactJson: body.actualImpactJson,
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

    // Log the update for audit
    await (prisma as any).auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_SOLUTION',
        entityType: 'SOLUTION',
        entityId: updatedSolution.id,
        changes: body,
      },
    });

    return NextResponse.json({
      success: true,
      solution: updatedSolution,
      message: 'Solution updated successfully',
    });
  } catch (error) {
    console.error('Solution update error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const solutionId = params.id;

    // Check if solution exists and user has permission
    const existingSolution = await (prisma as any).solution.findUnique({
      where: { id: solutionId },
      select: {
        id: true,
        title: true,
        createdBy: true,
      },
    });

    if (!existingSolution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      );
    }

    // Only admin can delete solutions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete solution (cascade will handle related entities)
    await (prisma as any).solution.delete({
      where: { id: solutionId },
    });

    // Log the deletion for audit
    await (prisma as any).auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE_SOLUTION',
        entityType: 'SOLUTION',
        entityId: solutionId,
        changes: {
          title: existingSolution.title,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Solution deleted successfully',
    });
  } catch (error) {
    console.error('Solution deletion error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
