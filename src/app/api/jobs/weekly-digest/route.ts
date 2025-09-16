import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendExecutiveDigest } from '@/lib/email/digest';

/**
 * Weekly Executive Digest Background Job
 * 
 * Runs every Monday at 8am to send executive summary:
 * - Top 5 hotspots by ranking
 * - Weekly metrics and trends  
 * - Key performance indicators
 * - Action items requiring executive attention
 * 
 * Expert: Sarah Chen (Product Manager)
 * Support: Dr. Priya Patel (AI Architect)
 */

export async function POST(request: NextRequest) {
  console.log('📧 Starting Weekly Executive Digest Job...');
  
  try {
    // Check authorization for production
    const cronSecret = request.headers.get('authorization');
    if (process.env.VERCEL_ENV === 'production' && cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const startTime = Date.now();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Get executive users
    const executives = await prisma.user.findMany({
      where: { role: 'EXECUTIVE' },
      select: { id: true, email: true, name: true, department: true }
    });

    if (executives.length === 0) {
      console.log('  ⚠️ No executive users found');
      return NextResponse.json({
        success: true,
        sent: 0,
        message: 'No executive users to notify'
      });
    }

    // Gather digest data
    const digestData = await gatherDigestData(weekAgo);
    
    console.log(`  📊 Digest data prepared: ${digestData.topHotspots.length} hotspots, ${digestData.weeklyMetrics.newSignals} new signals`);

    // Send digest to each executive
    let emailsSent = 0;
    const failures: string[] = [];

    for (const executive of executives) {
      try {
        await sendExecutiveDigest({
          ...executive,
          department: executive.department || undefined
        }, digestData);
        emailsSent++;
        console.log(`    ✅ Digest sent to ${executive.email}`);
      } catch (error) {
        failures.push(executive.email);
        console.error(`    ❌ Failed to send digest to ${executive.email}:`, error);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`  🎉 Weekly digest complete: ${emailsSent} sent, ${failures.length} failed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      executivesFound: executives.length,
      emailsSent,
      failures,
      digestData: {
        hotspotsCount: digestData.topHotspots.length,
        newSignals: digestData.weeklyMetrics.newSignals,
        completedSolutions: digestData.weeklyMetrics.completedSolutions
      },
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Weekly Digest Job failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Gather comprehensive digest data for executives
 */
async function gatherDigestData(weekAgo: Date) {
  console.log('  📈 Gathering digest data...');

  // Get top hotspots by ranking
  let topHotspots = [];
  try {
    topHotspots = await (prisma as any).hotspot.findMany({
      take: 5,
      orderBy: { rankScore: 'desc' },
      where: {
        status: { in: ['OPEN', 'APPROVED'] }
      },
      include: {
        signals: {
          include: {
            signal: {
              select: {
                id: true,
                title: true,
                description: true,
                severity: true,
                department: true
              }
            }
          }
        }
      }
    });
  } catch (error) {
    // Fallback for legacy schema
    console.log('    ⚠️ Using legacy schema for hotspot data');
  }

  // Get weekly metrics
  const weeklyMetrics = await gatherWeeklyMetrics(weekAgo);
  
  // Get department breakdown
  const departmentBreakdown = await gatherDepartmentBreakdown(weekAgo);
  
  // Get key trends
  const keyTrends = await identifyKeyTrends(weekAgo);

  return {
    topHotspots,
    weeklyMetrics,
    departmentBreakdown,
    keyTrends,
    generatedAt: new Date().toISOString(),
    period: {
      from: weekAgo.toISOString(),
      to: new Date().toISOString()
    }
  };
}

/**
 * Gather weekly metrics across the platform
 */
async function gatherWeeklyMetrics(weekAgo: Date) {
  try {
    // Try V2 Signal model first
    const [newSignals, totalSignals, processedSignals] = await Promise.all([
      (prisma as any).signal.count({
        where: { receivedAt: { gte: weekAgo } }
      }),
      (prisma as any).signal.count(),
      (prisma as any).signal.count({
        where: { aiProcessed: true }
      })
    ]);

    const [completedSolutions, totalSolutions] = await Promise.all([
      (prisma as any).solution.count({
        where: { 
          status: 'IMPLEMENTED',
          updatedAt: { gte: weekAgo }
        }
      }),
      (prisma as any).solution.count()
    ]);

    return {
      newSignals,
      totalSignals,
      processedSignals,
      processingRate: totalSignals > 0 ? (processedSignals / totalSignals) * 100 : 0,
      completedSolutions,
      totalSolutions,
      completionRate: totalSolutions > 0 ? (completedSolutions / totalSolutions) * 100 : 0
    };
  } catch (error) {
    // Fallback to legacy Input model
    const [newInputs, totalInputs] = await Promise.all([
      prisma.input.count({
        where: { createdAt: { gte: weekAgo } }
      }),
      prisma.input.count()
    ]);

    const [completedSolutions, totalSolutions] = await Promise.all([
      (prisma as any).solution.count({
        where: { 
          status: 'IMPLEMENTED',
          updatedAt: { gte: weekAgo }
        }
      }),
      (prisma as any).solution.count()
    ]);

    return {
      newSignals: newInputs,
      totalSignals: totalInputs,
      processedSignals: totalInputs, // Assume all processed in legacy
      processingRate: 100,
      completedSolutions,
      totalSolutions,
      completionRate: totalSolutions > 0 ? (completedSolutions / totalSolutions) * 100 : 0
    };
  }
}

/**
 * Gather department-wise breakdown
 */
async function gatherDepartmentBreakdown(weekAgo: Date) {
  try {
    // Try V2 Signal model with department relationships
    const departmentStats = await (prisma as any).signal.groupBy({
      by: ['departmentId'],
      where: { receivedAt: { gte: weekAgo } },
      _count: { id: true }
    });

    const departments = await (prisma as any).department.findMany({
      select: { id: true, name: true }
    });

    return departmentStats.map((stat: any) => {
      const dept = departments.find((d: any) => d.id === stat.departmentId);
      return {
        department: dept?.name || 'Unknown',
        signalCount: stat._count.id
      };
    });
  } catch (error) {
    // Fallback to legacy department field
    const departmentStats = await prisma.input.groupBy({
      by: ['department'],
      where: { 
        createdAt: { gte: weekAgo },
        department: { not: null }
      },
      _count: { id: true }
    });

    return departmentStats.map(stat => ({
      department: stat.department || 'Unknown',
      signalCount: stat._count.id
    }));
  }
}

/**
 * Identify key trends for executive attention
 */
async function identifyKeyTrends(weekAgo: Date) {
  const trends = [];

  try {
    // Analyze severity trends
    const severityTrends = await (prisma as any).signal.groupBy({
      by: ['severity'],
      where: { receivedAt: { gte: weekAgo } },
      _count: { id: true }
    });

    const criticalCount = severityTrends.find((t: any) => t.severity === 'CRITICAL')?._count.id || 0;
    const highCount = severityTrends.find((t: any) => t.severity === 'HIGH')?._count.id || 0;
    
    if (criticalCount > 0) {
      trends.push({
        type: 'alert',
        title: 'Critical Issues Detected',
        description: `${criticalCount} critical severity signals this week`,
        priority: 'high'
      });
    }

    if (highCount > 5) {
      trends.push({
        type: 'warning',
        title: 'High Volume of High-Priority Issues',
        description: `${highCount} high severity signals may indicate systemic issues`,
        priority: 'medium'
      });
    }

    // Check for clustering activity
    const activeHotspots = await (prisma as any).hotspot.count({
      where: { 
        status: 'OPEN',
        updatedAt: { gte: weekAgo }
      }
    });

    if (activeHotspots > 3) {
      trends.push({
        type: 'info',
        title: 'Multiple Active Hotspots',
        description: `${activeHotspots} hotspots require executive attention`,
        priority: 'medium'
      });
    }

  } catch (error) {
    // Fallback analysis with legacy data
    console.log('    ⚠️ Using legacy data for trend analysis');
  }

  return trends;
}

// Allow manual triggering for testing
export async function GET() {
  return POST(new NextRequest('http://localhost/api/jobs/weekly-digest', { method: 'POST' }));
}
