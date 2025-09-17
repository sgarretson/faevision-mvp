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
      if (
        error.code === 'P2022' &&
        error.message.includes('clusteringFeaturesJson')
      ) {
        console.log(
          '⚠️  Clustering features column missing, using basic signal data...'
        );
        signals = await (prisma as any).signal.findMany({
          where: whereClause,
          select: {
            id: true,
            title: true,
            description: true,
            severity: true,
            severityScore: true,
            departmentId: true,
            teamId: true,
            categoryId: true,
            metricsJson: true,
            impactJson: true,
            tagsJson: true,
            aiTagsJson: true,
            enhancedTagsJson: true,
            createdAt: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
            team: {
              select: {
                id: true,
                name: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
        });
      } else {
        throw error; // Re-throw if it's a different error
      }
    }

    // If no signals with existing clustering features, get all signals for on-the-fly processing
    if (signals.length === 0) {
      console.log(
        '⚠️  No signals with pre-generated clustering features, loading all signals for on-the-fly processing...'
      );
      signals = await (prisma as any).signal.findMany({
        where: whereClause,
        include: {
          department: true,
          team: true,
          createdBy: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to prevent overwhelming the system
      });

      if (signals.length === 0) {
        return NextResponse.json(
          {
            error: 'No signals found in database',
            suggestion:
              'Create some signals first before running clustering analysis',
          },
          { status: 400 }
        );
      }
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

    // Extract and validate clustering features, keeping them attached to signals
    const signalsWithFeatures: any[] = [];
    for (const signal of signals) {
      let clusteringFeatures = null;

      if (
        signal.clusteringFeaturesJson &&
        validateClusteringFeatures(signal.clusteringFeaturesJson)
      ) {
        clusteringFeatures = signal.clusteringFeaturesJson;
      } else {
        // Generate features on-the-fly for signals without pre-generated features
        console.log(
          `🔧 Generating clustering features for signal ${signal.id}...`
        );
        const generatedFeatures = generateBasicClusteringFeatures(signal);
        if (validateClusteringFeatures(generatedFeatures)) {
          clusteringFeatures = generatedFeatures;
        } else {
          console.warn(
            `Signal ${signal.id} could not generate valid clustering features, skipping`
          );
          continue; // Skip this signal
        }
      }

      // Create the ClusteringFeatures object that the engine expects
      signalsWithFeatures.push(clusteringFeatures);
    }

    if (signalsWithFeatures.length < 2) {
      return NextResponse.json(
        {
          error: 'Insufficient valid clustering features',
          validFeatures: signalsWithFeatures.length,
          totalSignals: signals.length,
        },
        { status: 400 }
      );
    }

    // Check for existing clustering results (unless force regenerate)
    if (!validatedRequest.forceRegenerate) {
      let existingClustering: any = null;
      try {
        existingClustering = await (prisma as any).hotspot.findFirst({
          where: {
            clusteringResults: { not: null },
            // Add timestamp check here for recent clustering
          },
          orderBy: { lastClusteredAt: 'desc' },
        });
      } catch (error: any) {
        // If clustering columns don't exist, skip cache check and proceed to generate new results
        if (
          error.code === 'P2022' &&
          error.message.includes('clusteringResults')
        ) {
          console.log(
            '⚠️  Hotspot clustering columns missing, skipping cache check'
          );
          existingClustering = null;
        } else {
          throw error; // Re-throw if it's a different error
        }
      }

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
        .generateHybridClusters(signalsWithFeatures, jobId)
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
        signalsWithFeatures,
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

    // Get latest clustering results with schema resilience
    let latestClustering: any = null;
    try {
      latestClustering = await (prisma as any).hotspot.findFirst({
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
    } catch (error: any) {
      // If clustering columns don't exist, return appropriate message
      if (
        error.code === 'P2022' &&
        error.message.includes('clusteringResults')
      ) {
        console.log(
          '⚠️  Hotspot clustering columns missing, no results available'
        );
        return NextResponse.json({
          success: false,
          message: 'No clustering results found - schema not ready',
          suggestion:
            'Run the emergency schema fix API first: POST /api/admin/apply-schema-fix',
        });
      } else {
        throw error; // Re-throw if it's a different error
      }
    }

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
    // Try to create or update hotspot with clustering results
    try {
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
    } catch (dbError: any) {
      // If clustering columns don't exist, save basic hotspot without clustering fields
      if (dbError.code === 'P2022' && dbError.message.includes('clustering')) {
        console.log(
          '⚠️  Hotspot clustering columns missing, saving basic hotspot...'
        );
        await (prisma as any).hotspot.upsert({
          where: {
            id: 'main_hotspot_v2',
          },
          create: {
            id: 'main_hotspot_v2',
            title: 'Executive Intelligence Clusters',
            description: `${result.outputClusterCount} actionable business intelligence clusters`,
            signalIds: signalIds,
            createdAt: new Date(),
          },
          update: {
            signalIds: signalIds,
            description: `${result.outputClusterCount} actionable business intelligence clusters`,
            updatedAt: new Date(),
          },
        });
        console.log(
          '✅ Basic hotspot saved (clustering fields will be added after schema migration)'
        );
      } else {
        throw dbError; // Re-throw if it's a different error
      }
    }

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
 * Local implementation to avoid import conflicts
 */
function validateClusteringFeatures(features: any): boolean {
  if (!features || typeof features !== 'object') return false;

  // Check for proper ClusteringFeatures structure
  return Boolean(
    features.domainFeatures?.rootCauseVector?.length === 7 &&
      features.domainFeatures?.departmentVector?.length === 5 &&
      features.semanticFeatures?.titleEmbedding?.length > 0 &&
      features.semanticFeatures?.descriptionEmbedding?.length > 0 &&
      features.semanticFeatures?.businessContextVector?.length > 0 &&
      features.signalId
  );
}

/**
 * Generate basic clustering features on-the-fly for signals without pre-generated features
 * Matches the expected ClusteringFeatures interface structure
 */
function generateBasicClusteringFeatures(signal: any): any {
  try {
    // Create a simple text representation for embedding
    const textContent =
      `${signal.title || ''} ${signal.description || ''}`.trim();

    // Generate a basic feature vector (simplified version)
    const words = textContent
      .toLowerCase()
      .split(/\s+/)
      .filter((w: string) => w.length > 2);

    // Create a simple bag-of-words style embedding (512 dimensions to match expected structure)
    const embedding = new Array(512).fill(0);
    words.forEach((word: string, index: number) => {
      const hash = word
        .split('')
        .reduce(
          (a: number, b: string) => ((a << 5) - a + b.charCodeAt(0)) | 0,
          0
        );
      embedding[Math.abs(hash) % 512] += 1;
    });

    // Normalize the embedding
    const magnitude = Math.sqrt(
      embedding.reduce((sum: number, val: number) => sum + val * val, 0)
    );
    const normalizedEmbedding =
      magnitude > 0
        ? embedding.map((val: number) => val / magnitude)
        : embedding;

    // Generate basic root cause vector (7 dimensions)
    // Simple heuristic based on keywords - explicitly mutable array
    const rootCauseVector: number[] = Array.from({ length: 7 }, () => 0.0); // [PROCESS, RESOURCE, COMMUNICATION, TECHNOLOGY, TRAINING, QUALITY, EXTERNAL]
    const text = textContent.toLowerCase();

    if (
      text.includes('process') ||
      text.includes('workflow') ||
      text.includes('procedure')
    )
      rootCauseVector[0] = 0.7;
    if (
      text.includes('staff') ||
      text.includes('resource') ||
      text.includes('team')
    )
      rootCauseVector[1] = 0.6;
    if (
      text.includes('communication') ||
      text.includes('coordinate') ||
      text.includes('inform')
    )
      rootCauseVector[2] = 0.6;
    if (
      text.includes('technology') ||
      text.includes('software') ||
      text.includes('system')
    )
      rootCauseVector[3] = 0.6;
    if (
      text.includes('training') ||
      text.includes('knowledge') ||
      text.includes('skill')
    )
      rootCauseVector[4] = 0.6;
    if (
      text.includes('quality') ||
      text.includes('error') ||
      text.includes('defect')
    )
      rootCauseVector[5] = 0.7;
    if (
      text.includes('client') ||
      text.includes('external') ||
      text.includes('vendor')
    )
      rootCauseVector[6] = 0.5;

    // If no specific category detected, default to PROCESS
    if (rootCauseVector.every((val: number) => val === 0.0)) {
      (rootCauseVector as any)[0] = 0.5; // Default to PROCESS - TypeScript strict mode bypass
    }

    // Generate basic department vector (5 dimensions)
    const departmentVector: number[] = Array.from({ length: 5 }, () => 0.0); // [Architecture, Field Services, Project Management, Executive, Other]
    const deptName = signal.department?.name?.toLowerCase() || '';

    if (deptName.includes('architecture') || deptName.includes('design'))
      departmentVector[0] = 1.0;
    else if (deptName.includes('field') || deptName.includes('construction'))
      departmentVector[1] = 1.0;
    else if (deptName.includes('project') || deptName.includes('management'))
      departmentVector[2] = 1.0;
    else if (deptName.includes('executive') || deptName.includes('leadership'))
      departmentVector[3] = 1.0;
    else departmentVector[4] = 1.0; // Other

    // Create ClusteringFeatures structure
    return {
      signalId: signal.id,
      domainFeatures: {
        rootCauseVector,
        rootCauseConfidence: 0.6, // Moderate confidence for basic features
        departmentVector,
        departmentComplexity: 0.3,
        businessImpactVector: [0.5, 0.5, 0.4, 0.4], // [Severity, Urgency, Cost, Client Impact]
        overallImpactScore: 0.4,
        aeDomainVector: [0.5, 0.5, 0.5, 0.3, 0.4, 0.4], // [Project Phase, Building Type, Quality Category, Compliance Risk, Schedule Impact, Budget Impact]
        domainRelevance: 0.7,
        timelineUrgency: 0.5,
        stakeholderCount: 0.3,
        processComplexity: 0.4,
      },
      semanticFeatures: {
        // Split embedding into required components for clustering engine compatibility
        titleEmbedding: normalizedEmbedding.slice(0, 256), // First 256 dimensions for title
        descriptionEmbedding: normalizedEmbedding.slice(256, 512), // Next 256 dimensions for description
        businessContextVector: normalizedEmbedding.slice(0, 128), // First 128 dimensions for business context
        domainTerminologyVector: normalizedEmbedding.slice(384, 512), // Last 128 dimensions for domain terms

        // Semantic metrics
        textComplexity: Math.min(
          (words.length / Math.max(textContent.length, 1)) * 100,
          1.0
        ),
        domainTerminologyDensity: 0.6,
        businessContextDensity: 0.5,

        // Text statistics for backward compatibility
        textStatistics: {
          wordCount: words.length,
          uniqueWordCount: new Set(words).size,
          avgWordLength:
            words.reduce((sum: number, word: string) => sum + word.length, 0) /
            Math.max(words.length, 1),
          textLength: textContent.length,
        },
        semanticDensity: Math.min(
          new Set(words).size / Math.max(words.length, 1),
          1.0
        ),
        contextualRelevance: 0.6,
        embeddingMagnitude: magnitude || 1.0,
      },
      combinedVector: [
        ...rootCauseVector,
        ...departmentVector,
        ...normalizedEmbedding.slice(0, 50),
      ], // Simplified combined vector
      metadata: {
        generatedOnTheFly: true,
        timestamp: new Date().toISOString(),
        method: 'basic_heuristic_features',
        quality: 0.6,
      },
    };
  } catch (error) {
    console.error('Error generating basic clustering features:', error);
    return null;
  }
}
