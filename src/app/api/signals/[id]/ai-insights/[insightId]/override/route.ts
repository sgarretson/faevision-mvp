/**
 * AI Insight Override API
 * Sprint 3 Story 2: AI Insights Integration
 * Expert: Dr. Priya Patel (AI Architect) + Alex Thompson (Lead Developer)
 *
 * Allow executives to override AI recommendations with audit trail
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route since it uses auth() which requires headers
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { z } from 'zod';

// Request validation schema
const OverrideRequestSchema = z.object({
  reason: z.string().min(10, 'Override reason must be at least 10 characters'),
  newValue: z.any().optional(),
  executiveJustification: z.string().optional(),
});

/**
 * POST /api/signals/[id]/ai-insights/[insightId]/override
 * Override an AI insight with executive decision
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; insightId: string } }
) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Verify executive privileges
    const user = await (prisma as any).user.findUnique({
      where: { id: session.user.id },
      select: { role: true, name: true, email: true },
    });

    if (!user || user.role !== 'EXECUTIVE') {
      return NextResponse.json(
        { error: 'Executive privileges required for AI overrides' },
        { status: 403 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedRequest = OverrideRequestSchema.parse(body);

    const signalId = params.id;
    const insightId = params.insightId;

    // Verify signal exists
    const signal = await (prisma as any).signals.findUnique({
      where: { id: signalId },
      select: { id: true, title: true },
    });

    if (!signal) {
      return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
    }

    // Create AI insight override record
    const override = await (prisma as any).aIInsightOverride.create({
      data: {
        signalId,
        insightId,
        insightType: extractInsightType(insightId),
        originalRecommendation: await getOriginalRecommendation(
          signalId,
          insightId
        ),
        overrideReason: validatedRequest.reason,
        executiveJustification: validatedRequest.executiveJustification,
        newValue: validatedRequest.newValue,
        executiveId: session.user.id,
        executiveName: user.name,
        executiveEmail: user.email,
        overriddenAt: new Date(),
        createdAt: new Date(),
      },
    });

    // Log the override for audit purposes
    await logAIOverrideActivity(
      session.user.id,
      signalId,
      insightId,
      validatedRequest.reason
    );

    console.log(
      `✅ AI insight override recorded: ${insightId} by ${user.name}`
    );

    return NextResponse.json({
      success: true,
      override: {
        id: override.id,
        insightId,
        reason: validatedRequest.reason,
        executiveName: user.name,
        timestamp: override.overriddenAt,
      },
      message: 'AI insight successfully overridden',
    });
  } catch (error: any) {
    console.error('AI insight override failed:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Invalid override request',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Override operation failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/signals/[id]/ai-insights/[insightId]/override
 * Get override history for an insight
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; insightId: string } }
) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const signalId = params.id;
    const insightId = params.insightId;

    // Get override history
    const overrides = await (prisma as any).aIInsightOverride.findMany({
      where: {
        signalId,
        insightId,
      },
      select: {
        id: true,
        overrideReason: true,
        executiveJustification: true,
        newValue: true,
        executiveName: true,
        executiveEmail: true,
        overriddenAt: true,
        originalRecommendation: true,
      },
      orderBy: { overriddenAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      overrides,
      totalOverrides: overrides.length,
      lastOverride: overrides[0] || null,
    });
  } catch (error: any) {
    console.error('Failed to get override history:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve override history',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Extract insight type from insight ID
 */
function extractInsightType(insightId: string): string {
  if (insightId.includes('tagging-confidence')) return 'TAGGING_CONFIDENCE';
  if (insightId.includes('domain-classification'))
    return 'DOMAIN_CLASSIFICATION';
  if (insightId.includes('business-impact')) return 'BUSINESS_IMPACT';
  if (insightId.includes('clustering-readiness')) return 'CLUSTERING_READINESS';
  if (insightId.includes('feature-quality')) return 'FEATURE_QUALITY';
  if (insightId.includes('critical-severity')) return 'CRITICAL_SEVERITY';
  if (insightId.includes('data-completeness')) return 'DATA_COMPLETENESS';
  return 'UNKNOWN';
}

/**
 * Get original AI recommendation for insight
 */
async function getOriginalRecommendation(
  signalId: string,
  insightId: string
): Promise<any> {
  try {
    // Get signal data to reconstruct original recommendation
    const signal = await (prisma as any).signals.findUnique({
      where: { id: signalId },
      select: {
        aiTagsJson: true,
        enhancedTagsJson: true,
        clusteringFeaturesJson: true,
        featuresQualityScore: true,
        severity: true,
      },
    });

    if (!signal) return null;

    // Extract relevant data based on insight type
    const insightType = extractInsightType(insightId);

    switch (insightType) {
      case 'TAGGING_CONFIDENCE':
        return {
          confidence:
            signal.enhancedTagsJson?.confidence ||
            signal.aiTagsJson?.confidence,
          recommendation: 'AI confidence assessment',
        };
      case 'BUSINESS_IMPACT':
        return {
          impact: signal.enhancedTagsJson?.businessImpact,
          recommendation: 'Business impact analysis',
        };
      case 'CLUSTERING_READINESS':
        return {
          qualityScore: signal.featuresQualityScore,
          recommendation: 'Clustering readiness assessment',
        };
      default:
        return { recommendation: 'AI-generated insight' };
    }
  } catch (error) {
    console.error('Failed to get original recommendation:', error);
    return null;
  }
}

/**
 * Log AI override activity for audit purposes
 */
async function logAIOverrideActivity(
  userId: string,
  signalId: string,
  insightId: string,
  reason: string
): Promise<void> {
  try {
    await (prisma as any).aIAnalysisAudit.create({
      data: {
        userId,
        analysisType: 'AI_INSIGHT_OVERRIDE',
        modelVersion: 'executive_override_v1',
        confidence: 1.0,
        resultJson: {
          signalId,
          insightId,
          overrideReason: reason,
          timestamp: new Date().toISOString(),
        },
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log AI override activity:', error);
    // Don't fail the main operation for logging errors
  }
}
