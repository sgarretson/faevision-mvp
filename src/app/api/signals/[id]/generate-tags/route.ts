/**
 * Enhanced Tag Generation API - Sprint 1
 * Expert: Dr. Rachel Kim (AI Tagging Specialist)
 *
 * Real-time tag generation endpoint with confidence scoring
 * Route: POST /api/signals/[id]/generate-tags
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route since it uses auth() which requires headers
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { enhancedTaggingEngine } from '@/lib/ai/enhanced-tagging-engine';
import { validateEnhancedTagging } from '@/types/enhanced-tagging';
import { z } from 'zod';

// Request validation schema
const GenerateTagsRequestSchema = z.object({
  forceRegenerate: z.boolean().optional().default(false),
  includeConfidenceMetrics: z.boolean().optional().default(true),
  validateConsistency: z.boolean().optional().default(true),
});

/**
 * POST /api/signals/[id]/generate-tags
 * Generate enhanced tags for a specific signal
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();

  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedRequest = GenerateTagsRequestSchema.parse(body);

    // Get signal from database
    const signal = await (prisma as any).signals.findUnique({
      where: { id: params.id },
      include: {
        department: true,
        team: true,
        category: true,
        createdBy: true,
      },
    });

    if (!signal) {
      return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
    }

    // Check if tags already exist and regeneration is not forced
    if (signal.enhancedTagsJson && !validatedRequest.forceRegenerate) {
      const existingTags = signal.enhancedTagsJson;
      const existingMeta = signal.tagGenerationMeta;

      return NextResponse.json({
        success: true,
        cached: true,
        tags: existingTags,
        metadata: existingMeta,
        processingTime: Date.now() - startTime,
      });
    }

    // Prepare context for tag generation
    const existingContext = {
      department: signal.department?.name || signal.department,
      team: signal.team?.name,
      category: signal.category?.name,
      severity: signal.severity,
      severityScore: signal.severityScore,
      sourceType: signal.sourceType,
      createdBy: signal.createdBy?.name,
    };

    // Generate enhanced tags using AI
    console.log(`🏷️  Generating enhanced tags for signal ${params.id}...`);

    const { tags, metadata, domainClassification } =
      await enhancedTaggingEngine.generateEnhancedTags(
        signal.title || 'Untitled Signal',
        signal.description,
        existingContext
      );

    // Validate generated tags
    if (!validateEnhancedTagging(tags)) {
      throw new Error('Generated tags failed validation');
    }

    // Optional: Validate consistency with similar signals
    let consistencyScore = 0.8; // Default
    if (validatedRequest.validateConsistency) {
      consistencyScore = await calculateConsistencyScore(tags, signal);
    }

    // Update metadata with consistency score
    metadata.qualityMetrics.consistencyScore = consistencyScore;

    // Save enhanced tags to database
    const updatedSignal = await (prisma as any).signals.update({
      where: { id: params.id },
      data: {
        enhancedTagsJson: tags,
        tagGenerationMeta: metadata,
        domainClassification: domainClassification,
        lastTaggedAt: new Date(),
        tagModelVersion: metadata.modelVersion,
        aiProcessed: true,
      },
    });

    // Log tagging activity for audit
    await logTaggingActivity(session.user.id, params.id, metadata);

    const processingTime = Date.now() - startTime;

    console.log(
      `✅ Enhanced tags generated for signal ${params.id} in ${processingTime}ms`
    );

    return NextResponse.json({
      success: true,
      cached: false,
      tags,
      metadata,
      domainClassification,
      processingTime,
      consistencyScore,
      recommendations: generateRecommendations(metadata, tags),
    });
  } catch (error: any) {
    console.error('Enhanced tag generation failed:', error);

    // Log error for debugging
    await logTaggingError(params.id, error.message);

    return NextResponse.json(
      {
        error: 'Tag generation failed',
        message: error.message,
        processingTime: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/signals/[id]/generate-tags
 * Retrieve existing enhanced tags for a signal
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // Get signal with enhanced tags
    const signal = await (prisma as any).signals.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        enhancedTagsJson: true,
        tagGenerationMeta: true,
        domainClassification: true,
        lastTaggedAt: true,
        tagModelVersion: true,
      },
    });

    if (!signal) {
      return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      signalId: signal.id,
      title: signal.title,
      tags: signal.enhancedTagsJson,
      metadata: signal.tagGenerationMeta,
      domainClassification: signal.domainClassification,
      lastTaggedAt: signal.lastTaggedAt,
      modelVersion: signal.tagModelVersion,
      hasEnhancedTags: !!signal.enhancedTagsJson,
    });
  } catch (error: any) {
    console.error('Failed to retrieve enhanced tags:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve tags',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate consistency score with similar signals
 */
async function calculateConsistencyScore(
  tags: any,
  signal: any
): Promise<number> {
  try {
    // Find similar signals based on root cause and department
    const similarSignals = await (prisma as any).signals.findMany({
      where: {
        id: { not: signal.id },
        departmentId: signal.departmentId,
        enhancedTagsJson: { not: null },
      },
      select: {
        enhancedTagsJson: true,
      },
      take: 10,
    });

    if (similarSignals.length === 0) {
      return 0.8; // Default when no similar signals
    }

    // Calculate consistency score based on root cause matching
    let consistentCount = 0;
    similarSignals.forEach((s: any) => {
      const similarTags = s.enhancedTagsJson;
      if (similarTags?.rootCause?.primary === tags.rootCause.primary) {
        consistentCount++;
      }
    });

    return consistentCount / similarSignals.length;
  } catch (error) {
    console.error('Consistency score calculation failed:', error);
    return 0.8; // Fallback score
  }
}

/**
 * Generate recommendations based on tag analysis
 */
function generateRecommendations(metadata: any, tags: any): string[] {
  const recommendations: string[] = [];

  // Low confidence recommendations
  if (metadata.overallConfidence < 0.7) {
    recommendations.push('Consider human review due to low confidence scores');
  }

  // High business impact recommendations
  if (metadata.flags.highBusinessImpact) {
    recommendations.push(
      'High business impact detected - escalate to management'
    );
  }

  // Missing context recommendations
  if (metadata.flags.missingContext) {
    recommendations.push(
      'Additional context needed for accurate classification'
    );
  }

  // Root cause specific recommendations
  switch (tags.rootCause.primary) {
    case 'PROCESS':
      recommendations.push('Review and update relevant workflow procedures');
      break;
    case 'RESOURCE':
      recommendations.push('Assess resource allocation and capacity planning');
      break;
    case 'COMMUNICATION':
      recommendations.push('Improve communication protocols and documentation');
      break;
    case 'TECHNOLOGY':
      recommendations.push(
        'Technical assessment and potential system upgrade needed'
      );
      break;
    case 'TRAINING':
      recommendations.push(
        'Identify training needs and development opportunities'
      );
      break;
    case 'QUALITY':
      recommendations.push(
        'Quality control review and process improvement required'
      );
      break;
  }

  return recommendations;
}

/**
 * Log tagging activity for audit purposes
 */
async function logTaggingActivity(
  userId: string,
  signalId: string,
  metadata: any
): Promise<void> {
  try {
    await (prisma as any).aIAnalysisAudit.create({
      data: {
        userId,
        signalId,
        analysisType: 'ENHANCED_TAGGING',
        modelVersion: metadata.modelVersion,
        processingTime: metadata.processingTime,
        confidence: metadata.overallConfidence,
        resultJson: {
          qualityMetrics: metadata.qualityMetrics,
          flags: metadata.flags,
        },
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log tagging activity:', error);
    // Don't fail the main operation for logging errors
  }
}

/**
 * Log tagging errors for debugging
 */
async function logTaggingError(
  signalId: string,
  errorMessage: string
): Promise<void> {
  try {
    await (prisma as any).aIAnalysisAudit.create({
      data: {
        signalId,
        analysisType: 'ENHANCED_TAGGING',
        modelVersion: 'ERROR',
        processingTime: 0,
        confidence: 0,
        resultJson: { error: errorMessage },
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log tagging error:', error);
  }
}
