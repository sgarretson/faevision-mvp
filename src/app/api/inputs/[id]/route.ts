import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Input Detail API Route
 *
 * Provides detailed information about a specific input/signal:
 * - Signal details with creator information
 * - Vote and comment counts
 * - Department and metadata
 *
 * Expert: Alex Thompson (Lead Developer)
 * Support: Morgan Smith (Database Architect)
 */

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

    // Get signal with creator information
    const signal = await (prisma as any).signals?.findUnique({
      where: { id },
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
        departments: {
          select: {
            id: true,
            name: true,
          },
        },
        teams: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!signal) {
      return NextResponse.json({ error: 'Input not found' }, { status: 404 });
    }

    // Get vote and comment counts
    const [votesCount, commentsCount] = await Promise.all([
      (prisma as any).votes?.count({
        where: {
          entityType: 'SIGNAL',
          entityId: signal.id,
        },
      }) || 0,
      (prisma as any).comments?.count({
        where: {
          entityType: 'SIGNAL',
          entityId: signal.id,
        },
      }) || 0,
    ]);

    // Map Signal model fields to frontend interface
    const mappedInput = {
      id: signal.id,
      title: signal.title || 'Untitled Signal',
      description: signal.description,
      type: 'GENERAL' as const, // Default type since Signal model doesn't have type field
      status: 'ACTIVE' as const, // Default status
      department: signal.departments?.name,
      issueType: signal.categories?.name || 'General',
      rootCause: '',
      priority:
        signal.severity === 'HIGH'
          ? 'HIGH'
          : signal.severity === 'LOW'
            ? 'LOW'
            : 'MEDIUM',
      createdAt: signal.receivedAt.toISOString(),
      creator: signal.users
        ? {
            id: signal.users.id,
            name: signal.users.name,
            email: signal.users.email,
            role: signal.users.role,
            department: signal.users.department,
          }
        : null,
      _count: {
        votes: votesCount,
        comments: commentsCount,
      },
    };

    return NextResponse.json({
      input: mappedInput,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Input detail API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
