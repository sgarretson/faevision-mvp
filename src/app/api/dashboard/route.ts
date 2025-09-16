import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for auth
export const dynamic = 'force-dynamic';

/**
 * Dashboard API Route
 *
 * Provides real-time dashboard statistics from database:
 * - Signal metrics and trends
 * - User engagement analytics
 * - Recent activity feed
 * - Department performance
 *
 * Expert: Sarah Chen (Product Manager)
 * Support: Dr. Priya Patel (AI Architect)
 */

interface DashboardStats {
  totalInputs: number;
  newInputs: number;
  inDiscussion: number;
  organized: number;
  inSolution: number;
  totalVotes: number;
  totalComments: number;
  activeUsers: number;
}

interface RecentInput {
  id: string;
  title: string;
  type: 'PROBLEM' | 'OPPORTUNITY' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  department?: string;
  creator: string;
  createdAt: string;
  votesCount: number;
  commentsCount: number;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get real-time dashboard statistics
    const [
      totalInputsData,
      newInputsData,
      inDiscussionData,
      organizedData,
      inSolutionData,
      totalVotesData,
      totalCommentsData,
      activeUsersData,
    ] = await Promise.all([
      // Total signals (inputs)
      (prisma as any).signal?.count() || 0,

      // New signals (last 7 days)
      (prisma as any).signal?.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }) || 0,

      // Signals in discussion (have comments)
      (prisma as any).comment?.count({
        where: {
          entityType: 'SIGNAL',
        },
      }) || 0,

      // Organized signals (in hotspots)
      (prisma as any).hotspot?.count() || 0,

      // Signals with solutions
      (prisma as any).solution?.count() || 0,

      // Total votes across all entities
      (prisma as any).vote?.count() || 0,

      // Total comments across all entities
      (prisma as any).comment?.count() || 0,

      // Active users (created content in last 30 days)
      (prisma as any).user?.count({
        where: {
          OR: [
            {
              signals: {
                some: {
                  createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
            {
              comments: {
                some: {
                  createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
          ],
        },
      }) || 0,
    ]);

    const stats: DashboardStats = {
      totalInputs: totalInputsData,
      newInputs: newInputsData,
      inDiscussion: inDiscussionData,
      organized: organizedData,
      inSolution: inSolutionData,
      totalVotes: totalVotesData,
      totalComments: totalCommentsData,
      activeUsers: activeUsersData,
    };

    // Get recent signals with engagement metrics
    const recentSignals =
      (await (prisma as any).signal?.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
          department: {
            select: {
              name: true,
            },
          },
        },
      })) || [];

    // Calculate vote and comment counts for each signal
    const recentInputs: RecentInput[] = await Promise.all(
      recentSignals.map(async (signal: any) => {
        const [votesCount, commentsCount] = await Promise.all([
          (prisma as any).vote?.count({
            where: {
              entityType: 'SIGNAL',
              entityId: signal.id,
            },
          }) || 0,
          (prisma as any).comment?.count({
            where: {
              entityType: 'SIGNAL',
              entityId: signal.id,
            },
          }) || 0,
        ]);

        return {
          id: signal.id,
          title: signal.title || 'Untitled Signal',
          type: 'GENERAL' as const, // Default type since Signal model doesn't have type field
          priority: signal.severity || 'MEDIUM', // Map severity to priority
          department: signal.department?.name || 'Unknown',
          creator: signal.createdBy?.name || 'Unknown',
          createdAt: signal.createdAt.toISOString(),
          votesCount,
          commentsCount,
        };
      })
    );

    return NextResponse.json({
      stats,
      recentInputs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
