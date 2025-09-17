/**
 * Hybrid Clustering API - Sprint 2 Task 2
 * Expert: Dr. Elena Rodriguez (Advanced Clustering Specialist)
 *
 * Generate hybrid clusters for signal intelligence
 * Route: POST /api/signals/clustering/generate
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route since it uses auth() which requires headers
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { hybridClusteringEngine } from '@/lib/clustering/hybrid-clustering-engine';
import { featureEngineeringEngine } from '@/lib/clustering/feature-engineering';
import { validateClusteringFeatures } from '@/types/clustering-features';
import { z } from 'zod';

// Request validation schema
const GenerateClusteringRequestSchema = z.object({
  signalIds: z.array(z.string()).optional(), // If not provided, use all signals
  forceRegenerate: z.boolean().optional().default(false),
  clusteringConfig: z
    .object({
      targetClusterCount: z.number().min(3).max(8).optional(),
      domainWeight: z.number().min(0).max(1).optional(),
      semanticWeight: z.number().min(0).max(1).optional(),
      minClusterSize: z.number().min(1).optional(),
      maxClusterSize: z.number().min(5).optional(),
    })
    .optional(),
  includeMetrics: z.boolean().optional().default(true),
  asyncProcessing: z.boolean().optional().default(false),
});

/**
 * POST /api/signals/clustering/generate
 * Generate executive-actionable clusters from signals
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let session: any = null;

  try {
    // Authenticate user
    session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedRequest = GenerateClusteringRequestSchema.parse(body);

    console.log(`🔧 Hybrid clustering request from ${session.user.name}...`);

    // Get signals with clustering features
    const whereClause = validatedRequest.signalIds
      ? { id: { in: validatedRequest.signalIds } }
      : {}; // Use all signals if no specific IDs provided

    // Try to query with clustering features first, fallback to all signals if column doesn't exist
    let signals: any[] = [];
    try {
      signals = await (prisma as any).signal.findMany({
        where: {
          ...whereClause,
          clusteringFeaturesJson: { not: null }, // Only signals with features
        },
        include: {
          department: true,
          team: true,
          createdBy: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error: any) {
      // If clustering features column doesn't exist, get all signals and generate features on-the-fly
      if (error.code === 'P2022' && error.message.includes('clusteringFeaturesJson')) {
        console.log('⚠️  Clustering features column missing, using basic signal data...');
        signals = await (prisma as any).signal.findMany({
          where: whereClause,
          include: {
            department: true,
            team: true,
            createdBy: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
        });
      } else {
        throw error; // Re-throw if it's a different error
      }
    }

    if (signals.length === 0) {
      return NextResponse.json(
        {
          error: 'No signals with clustering features found',
          suggestion:
            'Generate clustering features first using /api/signals/[id]/generate-features',
        },
        { status: 400 }
      );
    }

    if (signals.length < 2) {
      return NextResponse.json(
        {
          error: 'Need at least 2 signals for clustering',
          currentCount: signals.length,
        },
        { status: 400 }
      );
    }

    console.log(
      `📊 Processing ${signals.length} signals for hybrid clustering...`
    );

    // Extract and validate clustering features
    const clusteringFeatures = [];
    for (const signal of signals) {
      if (signal.clusteringFeaturesJson && validateClusteringFeatures(signal.clusteringFeaturesJson)) {
        clusteringFeatures.push(signal.clusteringFeaturesJson);
      } else {
        // Generate features on-the-fly for signals without pre-generated features
        console.log(`🔧 Generating clustering features for signal ${signal.id}...`);
        const generatedFeatures = generateBasicClusteringFeatures(signal);
        if (validateClusteringFeatures(generatedFeatures)) {
          clusteringFeatures.push(generatedFeatures);
        } else {
          console.warn(
            `Signal ${signal.id} could not generate valid clustering features, skipping`
          );
        }
      }
    }

    if (clusteringFeatures.length < 2) {
      return NextResponse.json(
        {
          error: 'Insufficient valid clustering features',
          validFeatures: clusteringFeatures.length,
          totalSignals: signals.length,
        },
        { status: 400 }
      );
    }

    // Check for existing clustering results (unless force regenerate)
    if (!validatedRequest.forceRegenerate) {
      const existingClustering = await (prisma as any).hotspot.findFirst({
        where: {
          clusteringResults: { not: null },
          // Add timestamp check here for recent clustering
        },
        orderBy: { lastClusteredAt: 'desc' },
      });

      if (existingClustering && existingClustering.clusteringResults) {
        console.log('✅ Returning cached clustering results');

        return NextResponse.json({
          success: true,
          cached: true,
          result: existingClustering.clusteringResults,
          processingTime: Date.now() - startTime,
          message: 'Using cached clustering results',
        });
      }
    }

    // Configure clustering engine if custom config provided
    let engineConfig = {};
    if (validatedRequest.clusteringConfig) {
      engineConfig = {
        executiveOptimization: {
          targetClusterCount:
            validatedRequest.clusteringConfig.targetClusterCount || 5,
          minClusterSize: validatedRequest.clusteringConfig.minClusterSize || 2,
          maxClusterSize:
            validatedRequest.clusteringConfig.maxClusterSize || 12,
        },
        performance: {
          enableCaching: true,
          parallelProcessing: true,
        },
      };
    }

    // Generate job ID for status tracking
    const jobId = `cluster_${Date.now()}_${session.user.id}`;

    // Handle async processing
    if (validatedRequest.asyncProcessing) {
      // Start clustering in background
      hybridClusteringEngine
        .generateHybridClusters(clusteringFeatures, jobId)
        .then(async result => {
          await saveClusteringResults(
            result,
            signals.map((s: any) => s.id),
            session.user.id
          );
        })
        .catch(error => {
          console.error('Background clustering failed:', error);
        });

      return NextResponse.json({
        success: true,
        async: true,
        jobId,
        message: 'Clustering started in background',
        statusUrl: `/api/signals/clustering/status?jobId=${jobId}`,
        estimatedCompletionTime: '30-60 seconds',
      });
    }

    // Synchronous clustering
    console.log('🚀 Starting hybrid clustering algorithm...');

    const clusteringResult =
      await hybridClusteringEngine.generateHybridClusters(
        clusteringFeatures,
        jobId
      );

    if (!clusteringResult.success) {
      throw new Error('Clustering algorithm failed');
    }

    // Save clustering results to database
    const hotspotId = await saveClusteringResults(
      clusteringResult,
      signals.map((s: any) => s.id),
      session.user.id
    );

    // Log clustering activity with hotspot reference
    await logClusteringActivity(session.user.id, clusteringResult, hotspotId);

    const processingTime = Date.now() - startTime;

    console.log(`🎉 Hybrid clustering completed successfully!`);
    console.log(
      `   Transformation: ${clusteringResult.inputSignalCount} signals → ${clusteringResult.outputClusterCount} executive clusters`
    );
    console.log(`   Processing time: ${processingTime}ms`);

    // Prepare response
    const response: any = {
      success: true,
      cached: false,
      result: clusteringResult,
      processingTime,
      transformation: {
        inputSignals: clusteringResult.inputSignalCount,
        outputClusters: clusteringResult.outputClusterCount,
        efficiency: clusteringResult.clusteringEfficiency,
      },
      executiveSummary: generateExecutiveSummary(clusteringResult),
      recommendations: generateClusteringRecommendations(clusteringResult),
    };

    // Add detailed metrics if requested
    if (validatedRequest.includeMetrics) {
      response.metrics = {
        qualityScores: {
          overall: clusteringResult.overallQuality,
          businessRelevance: clusteringResult.businessRelevanceScore,
          executiveActionability: clusteringResult.executiveActionability,
          silhouetteScore: clusteringResult.silhouetteScore,
        },
        performance: {
          totalTime: processingTime,
          stageBreakdown: clusteringResult.stageProcessingTimes,
          efficiency: clusteringResult.clusteringEfficiency,
        },
        clusterBreakdown: clusteringResult.finalClusters.map(cluster => ({
          id: cluster.id,
          name: cluster.name,
          signalCount: cluster.signals.length,
          actionability: cluster.actionability,
          urgencyScore: cluster.urgencyScore,
          businessRelevance: cluster.businessRelevance,
        })),
      };
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Hybrid clustering failed:', error);

    // Log error for debugging (skip audit due to missing required fields)
    await logClusteringError(error.message, session?.user?.id);

    return NextResponse.json(
      {
        error: 'Clustering generation failed',
        message: error.message,
        processingTime: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/signals/clustering/generate
 * Get latest clustering results
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Get latest clustering results
    const latestClustering = await (prisma as any).hotspot.findFirst({
      where: {
        clusteringResults: { not: null },
      },
      select: {
        id: true,
        clusteringResults: true,
        lastClusteredAt: true,
        clusteringVersion: true,
        clusteringQualityScore: true,
      },
      orderBy: { lastClusteredAt: 'desc' },
    });

    if (!latestClustering) {
      return NextResponse.json({
        success: false,
        message: 'No clustering results found',
        suggestion:
          'Generate clustering first using POST /api/signals/clustering/generate',
      });
    }

    return NextResponse.json({
      success: true,
      result: latestClustering.clusteringResults,
      metadata: {
        lastGenerated: latestClustering.lastClusteredAt,
        version: latestClustering.clusteringVersion,
        qualityScore: latestClustering.clusteringQualityScore,
      },
    });
  } catch (error: any) {
    console.error('Failed to retrieve clustering results:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve clustering results',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Save clustering results to database
 */
async function saveClusteringResults(
  result: any,
  signalIds: string[],
  userId: string
): Promise<string> {
  try {
    // Create or update hotspot with clustering results
    await (prisma as any).hotspot.upsert({
      where: {
        // Use a composite key or create a standard hotspot ID
        id: 'main_hotspot_v2',
      },
      create: {
        id: 'main_hotspot_v2',
        title: 'Executive Intelligence Clusters',
        description: `${result.outputClusterCount} actionable business intelligence clusters`,
        signalIds: signalIds,
        clusteringResults: result,
        lastClusteredAt: new Date(),
        clusteringVersion: result.version,
        clusteringQualityScore: result.overallQuality,
        createdAt: new Date(),
      },
      update: {
        signalIds: signalIds,
        clusteringResults: result,
        lastClusteredAt: new Date(),
        clusteringVersion: result.version,
        clusteringQualityScore: result.overallQuality,
        updatedAt: new Date(),
      },
    });

    console.log('✅ Clustering results saved to database');
    return 'main_hotspot_v2';
  } catch (error) {
    console.error('Failed to save clustering results:', error);
    // Don't fail the main operation for save errors
    throw error; // Re-throw to indicate failure
  }
}

/**
 * Log clustering activity for audit purposes
 */
async function logClusteringActivity(
  userId: string,
  result: any,
  hotspotId?: string
): Promise<void> {
  try {
    // Only log if we have a hotspotId (successful clustering with created hotspot)
    if (!hotspotId) {
      console.log('ℹ️ Skipping audit log - no hotspot created');
      return;
    }

    await (prisma as any).aIAnalysisAudit.create({
      data: {
        hotspotId,
        userId,
        analysisType: 'HYBRID_CLUSTERING',
        requestData: {
          inputSignalCount: result.inputSignalCount,
          clusteringVersion: result.version,
        },
        responseData: {
          outputClusterCount: result.outputClusterCount,
          clusteringEfficiency: result.clusteringEfficiency,
          businessRelevanceScore: result.businessRelevanceScore,
          executiveActionability: result.executiveActionability,
        },
        processingTime: result.processingTime,
        confidence: result.overallQuality,
        status: 'success',
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log clustering activity:', error);
    // Don't fail the main operation for logging errors
  }
}

/**
 * Log clustering errors for debugging
 */
async function logClusteringError(
  errorMessage: string,
  userId?: string,
  hotspotId?: string
): Promise<void> {
  try {
    // Skip logging if we don't have required fields for schema compliance
    if (!userId || !hotspotId) {
      console.log('ℹ️ Skipping error audit log - missing required fields');
      return;
    }

    await (prisma as any).aIAnalysisAudit.create({
      data: {
        hotspotId,
        userId,
        analysisType: 'HYBRID_CLUSTERING',
        requestData: { attemptedAt: new Date().toISOString() },
        responseData: { error: errorMessage },
        processingTime: 0,
        confidence: 0,
        status: 'error',
        errorMessage,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log clustering error:', error);
  }
}

/**
 * Generate executive summary of clustering results
 */
function generateExecutiveSummary(result: any): string {
  const { inputSignalCount, outputClusterCount, finalClusters } = result;

  const highPriorityClusters = finalClusters.filter(
    (c: any) => c.urgencyScore > 0.7
  ).length;
  const actionableClusters = finalClusters.filter(
    (c: any) => c.actionability > 0.7
  ).length;

  return `Successfully transformed ${inputSignalCount} operational signals into ${outputClusterCount} executive-actionable clusters. ${highPriorityClusters} clusters require immediate attention, with ${actionableClusters} clusters ready for executive decision-making.`;
}

/**
 * Generate clustering recommendations
 */
function generateClusteringRecommendations(result: any): string[] {
  const recommendations: string[] = [];

  recommendations.push(
    `Review ${result.outputClusterCount} clusters for executive prioritization`
  );

  if (result.businessRelevanceScore > 0.8) {
    recommendations.push(
      'High business relevance detected - consider immediate action planning'
    );
  }

  if (result.executiveActionability > 0.7) {
    recommendations.push(
      'Clusters are highly actionable - ready for resource allocation'
    );
  }

  if (result.outputClusterCount > 6) {
    recommendations.push(
      'Consider merging similar clusters for simplified executive oversight'
    );
  }

  return recommendations;
}

/**
 * Validate clustering features structure
 */
function validateClusteringFeatures(features: any): boolean {
  if (!features || typeof features !== 'object') return false;
  return Boolean(features.semantic?.embedding?.length > 0);
}

/**
 * Generate basic clustering features on-the-fly for signals without pre-generated features
 */
function generateBasicClusteringFeatures(signal: any): any {
  try {
    // Create a simple text representation for embedding
    const textContent = `${signal.title || ''} ${signal.description || ''}`.trim();
    
    // Generate a basic feature vector (simplified version)
    const words = textContent.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const uniqueWords = [...new Set(words)];
    
    // Create a simple bag-of-words style embedding (128 dimensions)
    const embedding = new Array(128).fill(0);
    uniqueWords.forEach((word, index) => {
      const hash = word.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
      embedding[Math.abs(hash) % 128] += 1;
    });
    
    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    const normalizedEmbedding = magnitude > 0 ? embedding.map(val => val / magnitude) : embedding;
    
    return {
      semantic: {
        embedding: normalizedEmbedding,
        textLength: textContent.length,
        wordCount: words.length,
        uniqueWordCount: uniqueWords.length
      },
      structural: {
        severity: signal.severity || 'MEDIUM',
        department: signal.department?.name || 'Unknown',
        hasMetrics: Boolean(signal.metricsJson),
        hasImpact: Boolean(signal.impactJson)
      },
      generated: {
        onTheFly: true,
        timestamp: new Date().toISOString(),
        method: 'basic_bow_embedding'
      }
    };
  } catch (error) {
    console.error('Error generating basic clustering features:', error);
    return null;
  }
}
