import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Hotspot Metrics API Endpoint
 *
 * Executive dashboard metrics for hotspot performance:
 * - Total and critical hotspot counts
 * - Average AI confidence scoring
 * - Signals processed statistics
 * - Last clustering run timestamp
 *
 * Expert: Sarah Chen (Product Manager)
 * Support: Dr. Priya Patel (AI Architect)
 */

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching hotspot metrics...');

    // Get basic hotspot metrics
    const metrics = await getHotspotMetrics();

    // Get signal processing metrics
    const signalMetrics = await getSignalMetrics();

    // Get clustering performance metrics
    const clusteringMetrics = await getClusteringMetrics();

    const combinedMetrics = {
      ...metrics,
      ...signalMetrics,
      ...clusteringMetrics,
      lastUpdated: new Date().toISOString(),
    };

    console.log('  ✅ Metrics compiled successfully');

    return NextResponse.json({
      success: true,
      metrics: combinedMetrics,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error fetching hotspot metrics:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch metrics',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Get core hotspot metrics
 */
async function getHotspotMetrics() {
  try {
    // Try V2 Hotspot model
    const [totalHotspots, criticalHotspots, hotspotStats] = await Promise.all([
      (prisma as any).hotspot?.count({
        where: { status: { in: ['OPEN', 'APPROVED'] } },
      }),
      (prisma as any).hotspot?.count({
        where: {
          status: { in: ['OPEN', 'APPROVED'] },
          rankScore: { gte: 0.8 }, // Critical threshold
        },
      }),
      (prisma as any).hotspot?.aggregate({
        where: { status: { in: ['OPEN', 'APPROVED'] } },
        _avg: { confidence: true, rankScore: true },
        _count: { id: true },
      }),
    ]);

    return {
      totalHotspots,
      criticalHotspots,
      avgConfidence: hotspotStats._avg.confidence || 0,
      avgRankScore: hotspotStats._avg.rankScore || 0,
    };
  } catch (error) {
    // Fallback for legacy schema
    console.log('  ⚠️ Using fallback metrics (V2 models not available)');

    return {
      totalHotspots: 0,
      criticalHotspots: 0,
      avgConfidence: 0,
      avgRankScore: 0,
    };
  }
}

/**
 * Get signal processing metrics
 */
async function getSignalMetrics() {
  try {
    // Try V2 Signal model first
    const [totalSignals, processedSignals, recentSignals] = await Promise.all([
      (prisma as any).signal?.count() || 0,
      (prisma as any).signal?.count({
        where: { aiProcessed: true },
      }) || 0,
      (prisma as any).signal?.count({
        where: {
          receivedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    const processingRate =
      totalSignals > 0 ? processedSignals / totalSignals : 0;

    return {
      signalsProcessed: totalSignals,
      signalsProcessedToday: recentSignals,
      processingRate: processingRate,
      signalsInPipeline: totalSignals - processedSignals,
    };
  } catch (error) {
    // Fallback to legacy Input model
    try {
      const [totalInputs, recentInputs] = await Promise.all([
        prisma.input.count(),
        prisma.input.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

      return {
        signalsProcessed: totalInputs,
        signalsProcessedToday: recentInputs,
        processingRate: 1.0, // Assume all legacy inputs are "processed"
        signalsInPipeline: 0,
      };
    } catch (legacyError) {
      return {
        signalsProcessed: 0,
        signalsProcessedToday: 0,
        processingRate: 0,
        signalsInPipeline: 0,
      };
    }
  }
}

/**
 * Get clustering performance metrics
 */
async function getClusteringMetrics() {
  try {
    // Check for recent clustering activity by looking at hotspot creation times
    const recentHotspots = await (prisma as any).hotspot?.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
      select: { createdAt: true, clusteringMethod: true },
    });

    const lastClusteringRun =
      recentHotspots.length > 0
        ? recentHotspots[0].createdAt.toISOString()
        : new Date(0).toISOString(); // Epoch if never run

    // Get clustering method distribution
    const clusteringMethods = await (prisma as any).hotspot?.groupBy({
      by: ['clusteringMethod'],
      where: { status: { in: ['OPEN', 'APPROVED'] } },
      _count: { id: true },
    });

    const methodDistribution = clusteringMethods.reduce(
      (acc: Record<string, number>, method: any) => {
        acc[method.clusteringMethod || 'unknown'] = method._count.id;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate clustering efficiency
    const totalSignalsInHotspots =
      (await (prisma as any).hotspotSignal?.count()) || 0;
    const totalSignals = await (prisma as any).signal
      ?.count()
      .catch(() => prisma.input.count().catch(() => 0));

    const clusteringEfficiency =
      totalSignals > 0 ? totalSignalsInHotspots / totalSignals : 0;

    return {
      lastClusteringRun,
      clusteringMethods: methodDistribution,
      clusteringEfficiency,
      totalSignalsInHotspots,
    };
  } catch (error) {
    return {
      lastClusteringRun: new Date(0).toISOString(),
      clusteringMethods: {},
      clusteringEfficiency: 0,
      totalSignalsInHotspots: 0,
    };
  }
}

/**
 * Additional metrics for executive reporting
 */
async function getExecutiveMetrics() {
  try {
    // Resolution rate metrics
    const resolvedHotspots = await (prisma as any).hotspot?.count({
      where: { status: 'RESOLVED' },
    });

    // Time-to-resolution metrics
    const recentResolvedHotspots = await (prisma as any).hotspot?.findMany({
      where: {
        status: 'RESOLVED',
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      select: { createdAt: true, updatedAt: true },
    });

    const avgResolutionTime =
      recentResolvedHotspots.length > 0
        ? recentResolvedHotspots.reduce((sum: number, hotspot: any) => {
            const resolutionTime =
              hotspot.updatedAt.getTime() - hotspot.createdAt.getTime();
            return sum + resolutionTime;
          }, 0) / recentResolvedHotspots.length
        : 0;

    // Convert to days
    const avgResolutionDays = avgResolutionTime / (1000 * 60 * 60 * 24);

    return {
      totalResolved: resolvedHotspots,
      avgResolutionDays: Math.round(avgResolutionDays * 10) / 10,
      recentResolutions: recentResolvedHotspots.length,
    };
  } catch (error) {
    return {
      totalResolved: 0,
      avgResolutionDays: 0,
      recentResolutions: 0,
    };
  }
}
