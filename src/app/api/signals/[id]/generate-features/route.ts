/**
 * Feature Generation API - Sprint 2 Task 1
 * Expert: Dr. Elena Rodriguez (Advanced Clustering Specialist)
 *
 * Generate clustering features for individual signals
 * Route: POST /api/signals/[id]/generate-features
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { featureEngineeringEngine } from '@/lib/clustering/feature-engineering';
import { validateEnhancedTagging } from '@/types/enhanced-tagging';
import { z } from 'zod';

// Request validation schema
const GenerateFeaturesRequestSchema = z.object({
  forceRegenerate: z.boolean().optional().default(false),
  includePrecomputedSimilarities: z.boolean().optional().default(false),
  featureConfig: z
    .object({
      domainWeight: z.number().min(0).max(1).optional(),
      semanticWeight: z.number().min(0).max(1).optional(),
      enablePrecomputation: z.boolean().optional(),
    })
    .optional(),
});

/**
 * POST /api/signals/[id]/generate-features
 * Generate clustering features for a specific signal
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
    const validatedRequest = GenerateFeaturesRequestSchema.parse(body);

    // Get signal with enhanced tagging from database
    const signal = await (prisma as any).signal.findUnique({
      where: { id: params.id },
      include: {
        department: true,
        team: true,
        createdBy: true,
      },
    });

    if (!signal) {
      return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
    }

    // Check if signal has enhanced tagging
    if (!signal.enhancedTagsJson) {
      return NextResponse.json(
        {
          error: 'Signal missing enhanced tagging',
          suggestion:
            'Run enhanced tagging generation first using /api/signals/[id]/generate-tags',
        },
        { status: 400 }
      );
    }

    // Validate enhanced tagging
    if (!validateEnhancedTagging(signal.enhancedTagsJson)) {
      return NextResponse.json(
        { error: 'Invalid enhanced tagging format' },
        { status: 400 }
      );
    }

    // Check if features already exist and regeneration is not forced
    if (signal.clusteringFeaturesJson && !validatedRequest.forceRegenerate) {
      const existingFeatures = signal.clusteringFeaturesJson;

      return NextResponse.json({
        success: true,
        cached: true,
        features: existingFeatures,
        processingTime: Date.now() - startTime,
        message: 'Using cached clustering features',
      });
    }

    console.log(`🔧 Generating clustering features for signal ${params.id}...`);

    // Prepare signal metadata
    const signalMetadata = {
      title: signal.title,
      description: signal.description,
      department: signal.department?.name || signal.department,
      team: signal.team?.name,
      severity: signal.severity,
      sourceType: signal.sourceType,
      createdBy: signal.createdBy?.name,
    };

    // Configure feature engineering engine if custom config provided
    let engineConfig = {};
    if (validatedRequest.featureConfig) {
      engineConfig = validatedRequest.featureConfig;
    }

    // Generate clustering features
    const result = await featureEngineeringEngine.generateClusteringFeatures(
      signal.id,
      signal.enhancedTagsJson,
      signalMetadata
    );

    if (!result.success) {
      throw new Error(result.error || 'Feature generation failed');
    }

    const { features, qualityMetrics, warnings } = result;

    // Save features to database
    await (prisma as any).signal.update({
      where: { id: params.id },
      data: {
        clusteringFeaturesJson: features,
        lastFeaturesGeneratedAt: new Date(),
        featuresVersion: features.featureVersion,
        featuresQualityScore: features.qualityScore,
      },
    });

    // Log feature generation activity
    await logFeatureGenerationActivity(session.user.id, params.id, result);

    const processingTime = Date.now() - startTime;

    console.log(
      `✅ Clustering features generated for signal ${params.id} in ${processingTime}ms`
    );

    return NextResponse.json({
      success: true,
      cached: false,
      features,
      qualityMetrics,
      warnings,
      processingTime,
      recommendations: generateFeatureRecommendations(result),
    });
  } catch (error: any) {
    console.error('Feature generation failed:', error);

    // Log error for debugging
    await logFeatureGenerationError(params.id, error.message);

    return NextResponse.json(
      {
        error: 'Feature generation failed',
        message: error.message,
        processingTime: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/signals/[id]/generate-features
 * Retrieve existing clustering features for a signal
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

    // Get signal with clustering features
    const signal = await (prisma as any).signal.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        clusteringFeaturesJson: true,
        lastFeaturesGeneratedAt: true,
        featuresVersion: true,
        featuresQualityScore: true,
        enhancedTagsJson: true,
      },
    });

    if (!signal) {
      return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      signalId: signal.id,
      title: signal.title,
      features: signal.clusteringFeaturesJson,
      lastGeneratedAt: signal.lastFeaturesGeneratedAt,
      featuresVersion: signal.featuresVersion,
      qualityScore: signal.featuresQualityScore,
      hasFeatures: !!signal.clusteringFeaturesJson,
      hasEnhancedTags: !!signal.enhancedTagsJson,
    });
  } catch (error: any) {
    console.error('Failed to retrieve clustering features:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve features',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Generate recommendations based on feature analysis
 */
function generateFeatureRecommendations(result: any): string[] {
  const recommendations: string[] = [];
  const { features, qualityMetrics } = result;

  // Quality-based recommendations
  if (qualityMetrics.overallQuality < 0.7) {
    recommendations.push(
      'Consider improving signal description for better feature quality'
    );
  }

  // Domain feature recommendations
  if (qualityMetrics.domainFeatureQuality < 0.8) {
    recommendations.push(
      'Enhanced tagging may need improvement for better domain classification'
    );
  }

  // Semantic feature recommendations
  if (qualityMetrics.semanticFeatureQuality < 0.8) {
    recommendations.push(
      'Signal content could be more detailed for better semantic analysis'
    );
  }

  // Performance recommendations
  if (features.generationTime > 100) {
    recommendations.push(
      'Feature generation time exceeds target - consider optimization'
    );
  }

  // Clustering readiness
  if (features.qualityScore > 0.8) {
    recommendations.push(
      'High-quality features ready for clustering algorithm'
    );
  }

  return recommendations;
}

/**
 * Log feature generation activity for audit purposes
 */
async function logFeatureGenerationActivity(
  userId: string,
  signalId: string,
  result: any
): Promise<void> {
  try {
    await (prisma as any).aIAnalysisAudit.create({
      data: {
        userId,
        signalId,
        analysisType: 'CLUSTERING_FEATURES',
        modelVersion: result.features?.featureVersion || 'unknown',
        processingTime: result.features?.generationTime || 0,
        confidence: result.features?.confidence || 0,
        resultJson: {
          qualityMetrics: result.qualityMetrics,
          warnings: result.warnings,
          success: result.success,
        },
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log feature generation activity:', error);
    // Don't fail the main operation for logging errors
  }
}

/**
 * Log feature generation errors for debugging
 */
async function logFeatureGenerationError(
  signalId: string,
  errorMessage: string
): Promise<void> {
  try {
    await (prisma as any).aIAnalysisAudit.create({
      data: {
        signalId,
        analysisType: 'CLUSTERING_FEATURES',
        modelVersion: 'ERROR',
        processingTime: 0,
        confidence: 0,
        resultJson: { error: errorMessage },
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log feature generation error:', error);
  }
}
