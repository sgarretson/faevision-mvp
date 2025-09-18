import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  calculateBusinessConfidence,
  CreationOrigin,
} from '@/types/origin-confidence';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Executive Workflow Metrics API
 *
 * Provides comprehensive metrics for F1-F6 workflow validation:
 * - End-to-end completion rates
 * - Confidence scoring analysis
 * - Performance benchmarks
 * - Executive decision support data
 *
 * Expert: Strategic Consultant (Marcus Rodriguez)
 * Support: Product Manager (Sarah Chen)
 */

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || '30d';
    const includeDetails = searchParams.get('details') === 'true';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (timeframe) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Fetch F1-F6 workflow data
    const [
      inputs,
      signals,
      hotspots,
      ideas,
      solutions,
      requirements,
      frdDocuments,
    ] = await Promise.all([
      // F1: Strategic Inputs
      (prisma as any).inputs.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          signal: true,
        },
      }),

      // F1: Enhanced Signals
      (prisma as any).signals.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // F3: Hotspots
      (prisma as any).hotspots.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // F4: Ideas
      (prisma as any).ideas.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // F5: Solutions
      (prisma as any).solutions.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // F5: Requirements
      (prisma as any).requirements.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // F6: FRD Documents
      (prisma as any).frd_documents.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    // Calculate workflow completion metrics
    const workflowMetrics = {
      f1_inputs: {
        total: inputs.length,
        withSignals: inputs.filter((input: any) => input.signal).length,
        avgConfidence: calculateAverageConfidence(
          inputs.map((input: any) => input.signal).filter(Boolean)
        ),
      },
      f2_collaboration: {
        // Mock collaboration metrics - would come from votes/comments tables
        totalVotes: inputs.length * 2.3, // Mock average votes per input
        totalComments: inputs.length * 1.8, // Mock average comments per input
      },
      f3_clustering: {
        total: hotspots.length,
        avgSignalsPerHotspot:
          hotspots.length > 0 ? signals.length / hotspots.length : 0,
        avgConfidence: calculateAverageConfidence(hotspots),
      },
      f4_ideas: {
        total: ideas.length,
        fromHotspots: ideas.filter((idea: any) => idea.hotspotId).length,
        avgConfidence: calculateAverageConfidence(ideas),
      },
      f5_solutions: {
        total: solutions.length,
        fromIdeas: solutions.filter((solution: any) => solution.ideaId).length,
        withRequirements: requirements.length,
        avgConfidence: calculateAverageConfidence(solutions),
      },
      f6_handoff: {
        total: frdDocuments.length,
        fromSolutions: frdDocuments.filter((frd: any) => frd.solutionId).length,
        avgConfidence: calculateAverageConfidence(frdDocuments),
      },
    };

    // Calculate end-to-end completion rates
    const completionRates = {
      inputToSignal:
        workflowMetrics.f1_inputs.total > 0
          ? (workflowMetrics.f1_inputs.withSignals /
              workflowMetrics.f1_inputs.total) *
            100
          : 0,
      signalToHotspot:
        signals.length > 0
          ? (workflowMetrics.f3_clustering.avgSignalsPerHotspot /
              signals.length) *
            100
          : 0,
      hotspotToIdea:
        hotspots.length > 0
          ? (workflowMetrics.f4_ideas.fromHotspots / hotspots.length) * 100
          : 0,
      ideaToSolution:
        ideas.length > 0
          ? (workflowMetrics.f5_solutions.fromIdeas / ideas.length) * 100
          : 0,
      solutionToFRD:
        solutions.length > 0
          ? (workflowMetrics.f6_handoff.fromSolutions / solutions.length) * 100
          : 0,
    };

    // Calculate confidence distribution
    const allItems = [
      ...signals.map((s: any) => ({ ...s, type: 'signal' })),
      ...hotspots.map((h: any) => ({ ...h, type: 'hotspot' })),
      ...ideas.map((i: any) => ({ ...i, type: 'idea' })),
      ...solutions.map((s: any) => ({ ...s, type: 'solution' })),
      ...frdDocuments.map((f: any) => ({ ...f, type: 'frd' })),
    ];

    const confidenceDistribution = allItems.reduce(
      (acc: any, item: any) => {
        const confidence = calculateBusinessConfidence(
          item.aiConfidence,
          item.qualityScore,
          item.origin as CreationOrigin
        );

        acc[confidence.trafficLight.toLowerCase()]++;
        if (confidence.actionRequired) acc.actionRequired++;
        if (confidence.humanValidated) acc.humanValidated++;

        return acc;
      },
      { green: 0, yellow: 0, red: 0, actionRequired: 0, humanValidated: 0 }
    );

    // Executive summary
    const executiveSummary = {
      totalWorkflowItems: allItems.length,
      overallHealthScore: Math.round(
        (confidenceDistribution.green / allItems.length) * 100
      ),
      actionRequiredItems: confidenceDistribution.actionRequired,
      humanValidatedItems: confidenceDistribution.humanValidated,
      endToEndCompletionRate: Math.round(
        Object.values(completionRates).reduce(
          (sum: number, rate: number) => sum + rate,
          0
        ) / Object.values(completionRates).length
      ),
    };

    const response = {
      timeframe,
      dateRange: { startDate, endDate },
      executiveSummary,
      workflowMetrics,
      completionRates,
      confidenceDistribution,
      performance: {
        avgProcessingTime: calculateAverageProcessingTime(allItems),
        peakUsageHours: calculatePeakUsage(allItems),
      },
      ...(includeDetails && {
        detailedBreakdown: {
          byOrigin: calculateOriginBreakdown(allItems),
          byConfidenceLevel: calculateConfidenceBreakdown(allItems),
          byWorkflowStage: calculateStageBreakdown(workflowMetrics),
        },
      }),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching workflow metrics:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch workflow metrics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateAverageConfidence(items: any[]): number {
  if (items.length === 0) return 0;

  const confidences = items
    .map(item => Math.max(item.aiConfidence || 0, item.qualityScore || 0))
    .filter(conf => conf > 0);

  return confidences.length > 0
    ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length
    : 0;
}

function calculateAverageProcessingTime(items: any[]): number {
  // Mock processing time calculation
  return Math.floor(Math.random() * 2000) + 500;
}

function calculatePeakUsage(items: any[]): number[] {
  // Mock peak usage hours (0-23)
  return [9, 10, 11, 14, 15, 16]; // Typical business hours
}

function calculateOriginBreakdown(items: any[]) {
  return items.reduce((acc: any, item: any) => {
    const origin = item.origin || 'UNKNOWN';
    acc[origin] = (acc[origin] || 0) + 1;
    return acc;
  }, {});
}

function calculateConfidenceBreakdown(items: any[]) {
  return items.reduce((acc: any, item: any) => {
    const confidence = calculateBusinessConfidence(
      item.aiConfidence,
      item.qualityScore,
      item.origin as CreationOrigin
    );

    const level = confidence.level.toLowerCase();
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});
}

function calculateStageBreakdown(metrics: any) {
  return {
    inputs: metrics.f1_inputs.total,
    signals: metrics.f1_inputs.withSignals,
    hotspots: metrics.f3_clustering.total,
    ideas: metrics.f4_ideas.total,
    solutions: metrics.f5_solutions.total,
    requirements: metrics.f5_solutions.withRequirements,
    frds: metrics.f6_handoff.total,
  };
}
