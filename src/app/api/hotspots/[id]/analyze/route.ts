import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateEnhancedRCA } from '@/lib/ai/signal-processing';

/**
 * Enhanced Hotspot Analysis API (FAE-101)
 *
 * Generates enhanced RCA analysis for hotspots with granular 5-category breakdown
 *
 * Expert: Dr. Priya Patel (AI Architect)
 * Support: Alex Thompson (Lead Developer)
 */

// ============================================================================
// POST /api/hotspots/[id]/analyze - Generate Enhanced RCA Analysis
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hotspotId = params.id;
    if (!hotspotId) {
      return NextResponse.json(
        { error: 'Hotspot ID required' },
        { status: 400 }
      );
    }

    console.log(`🔬 Starting enhanced RCA analysis for hotspot: ${hotspotId}`);
    const startTime = Date.now();

    // Fetch hotspot with related signals
    const hotspot = await (prisma as any).hotspots.findUnique({
      where: { id: hotspotId },
      include: {
        signals: {
          include: {
            signal: {
              include: {
                departments: { select: { id: true, name: true } },
                teams: { select: { id: true, name: true } },
                categories: { select: { id: true, name: true } },
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
            },
          },
        },
      },
    });

    if (!hotspot) {
      return NextResponse.json({ error: 'Hotspot not found' }, { status: 404 });
    }

    // Extract signals for analysis
    const signals = hotspot.signals.map((hs: any) => ({
      id: hs.signal.id,
      title: hs.signal.title,
      description: hs.signal.description,
      severity: hs.signal.severity,
      department: hs.signal.department?.name,
      team: hs.signal.team?.name,
      category: hs.signal.category?.name,
      membershipStrength: hs.membershipStrength,
      createdAt: hs.signal.receivedAt,
    }));

    if (signals.length === 0) {
      return NextResponse.json(
        {
          error: 'No signals found for analysis',
        },
        { status: 400 }
      );
    }

    console.log(`  📊 Analyzing ${signals.length} signals with enhanced RCA`);

    // Generate enhanced RCA analysis
    const rcaAnalysis = await generateEnhancedRCA(signals);

    const processingTime = Date.now() - startTime;
    console.log(`  ✅ Enhanced RCA complete in ${processingTime}ms`);

    // Store analysis results in hotspot
    await (prisma as any).hotspots.update({
      where: { id: hotspotId },
      data: {
        rcaBreakdownJson: rcaAnalysis,
        lastAnalysisAt: new Date(),
      },
    });

    // Create audit log for AI analysis
    await (prisma as any).aIAnalysisAudit.create({
      data: {
        hotspotId,
        analysisType: 'rca',
        userId: session.user.id,
        requestData: {
          signalCount: signals.length,
          analysisType: 'enhanced_rca',
          timestamp: new Date().toISOString(),
        },
        responseData: rcaAnalysis,
        processingTime,
        confidence: rcaAnalysis.overallConfidence || 0,
        status: rcaAnalysis.error ? 'error' : 'success',
        errorMessage: rcaAnalysis.error || null,
      },
    });

    // Prepare response
    const response = {
      success: true,
      hotspotId,
      analysisType: 'enhanced_rca',
      processingTime,
      analysis: {
        ...rcaAnalysis,
        metadata: {
          signalCount: signals.length,
          analysisTimestamp: new Date().toISOString(),
          confidence: rcaAnalysis.overallConfidence,
          version: rcaAnalysis.version || '1.0',
        },
      },
      recommendations: {
        primaryFocus: rcaAnalysis.primaryCategory,
        confidence: rcaAnalysis.overallConfidence,
        nextSteps: [
          `Focus on ${rcaAnalysis.primaryCategory} improvements`,
          'Review specific examples provided in analysis',
          'Consider multi-solution approach for complex patterns',
        ],
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Enhanced RCA analysis error:', error);

    return NextResponse.json(
      {
        error: 'Enhanced RCA analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/hotspots/[id]/analyze - Retrieve Cached Analysis
// ============================================================================

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

    const hotspotId = params.id;
    if (!hotspotId) {
      return NextResponse.json(
        { error: 'Hotspot ID required' },
        { status: 400 }
      );
    }

    // Fetch hotspot with cached analysis
    const hotspot = await (prisma as any).hotspots.findUnique({
      where: { id: hotspotId },
      select: {
        id: true,
        title: true,
        rcaBreakdownJson: true,
        lastAnalysisAt: true,
        confidence: true,
        _count: {
          select: { signals: true },
        },
      },
    });

    if (!hotspot) {
      return NextResponse.json({ error: 'Hotspot not found' }, { status: 404 });
    }

    // Check if analysis exists
    if (!hotspot.rcaBreakdownJson) {
      return NextResponse.json(
        {
          error: 'No RCA analysis found',
          message: 'Run POST /api/hotspots/{id}/analyze to generate analysis',
        },
        { status: 404 }
      );
    }

    const response = {
      success: true,
      hotspotId,
      analysisType: 'enhanced_rca',
      cached: true,
      lastAnalyzedAt: hotspot.lastAnalysisAt,
      analysis: {
        ...hotspot.rcaBreakdownJson,
        metadata: {
          signalCount: hotspot._count.signals,
          lastAnalyzed: hotspot.lastAnalysisAt,
          cached: true,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Enhanced RCA retrieval error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve RCA analysis',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
