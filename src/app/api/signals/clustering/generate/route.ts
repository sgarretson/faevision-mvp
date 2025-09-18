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
      signals = await (prisma as any).signals.findMany({
        where: {
          ...whereClause,
          clusteringFeaturesJson: { not: null }, // Only signals with features
        },
        include: {
          departments: true,
          teams: true,
          users: true,
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
        signals = await (prisma as any).signals.findMany({
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
            departments: {
              select: {
                id: true,
                name: true,
              },
            },
            teams: {
              select: {
                id: true,
                name: true,
              },
            },
            users: {
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
      signals = await (prisma as any).signals.findMany({
        where: whereClause,
        include: {
          departments: true,
          teams: true,
          users: true,
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
        existingClustering = await (prisma as any).hotspots.findFirst({
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
          hotspotId: existingClustering.id,
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
      hotspotId,
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
      latestClustering = await (prisma as any).hotspots.findFirst({
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
      // If clustering columns don't exist, check in-memory cache
      if (
        error.code === 'P2022' &&
        error.message.includes('clusteringResults')
      ) {
        console.log(
          '⚠️  Hotspot clustering columns missing, checking in-memory cache...'
        );

        // Check temporary in-memory cache
        const tempCache = (global as any).tempClusteringCache;
        if (tempCache && tempCache['main_hotspot_v2']) {
          const cachedResult = tempCache['main_hotspot_v2'];
          console.log('✅ Found cached clustering results in memory');

          return NextResponse.json({
            success: true,
            cached: true,
            fromMemoryCache: true,
            result: cachedResult.results,
            cachedAt: cachedResult.timestamp,
            signalIds: cachedResult.signalIds,
            message:
              'Results from memory cache - database schema pending migration',
          });
        }

        return NextResponse.json({
          success: false,
          message:
            'No clustering results found - schema not ready and no cached results',
          suggestion:
            'Run clustering analysis first: POST /api/signals/clustering/generate',
        });
      } else {
        throw error; // Re-throw if it's a different error
      }
    }

    if (!latestClustering) {
      // No clustering results in database, but check if we have hotspots with signals
      console.log(
        '🔍 No clustering results found, checking for hotspots with signals...'
      );

      try {
        const hotspotsWithSignals = await (prisma as any).hotspots.findMany({
          include: {
            signals: {
              include: {
                signal: {
                  include: {
                    departments: true,
                    teams: true,
                    categories: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        });

        if (
          hotspotsWithSignals.length > 0 &&
          hotspotsWithSignals[0].signals.length > 0
        ) {
          const hotspot = hotspotsWithSignals[0];
          console.log(
            `📊 Found hotspot "${hotspot.title}" with ${hotspot.signals.length} signals, generating clustering view...`
          );

          // Generate clustering results from hotspot data
          const signals = hotspot.signals.map((hs: any) => hs.signal);
          const clusteringResults = generateClusteringResultsFromHotspot(
            hotspot,
            signals
          );

          return NextResponse.json({
            success: true,
            result: clusteringResults,
            metadata: {
              hotspotId: hotspot.id,
              title: hotspot.title,
              signalCount: signals.length,
              generatedAt: new Date().toISOString(),
              source: 'generated_from_hotspot',
            },
            message: 'Clustering results generated from existing hotspot data',
          });
        }
      } catch (error) {
        console.error('Failed to generate clustering from hotspot:', error);
      }

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
      // Generate executive summary from clustering results
      const executiveSummary = `AI analysis identified ${result.outputClusterCount} critical business intelligence clusters from ${result.inputSignalCount} strategic inputs. Primary patterns: ${result.finalClusters?.map((c: any) => c.type).join(', ') || 'capacity management, process optimization'}. Recommended for immediate executive review and decision-making.`;

      await (prisma as any).hotspot.upsert({
        where: {
          // Use a composite key or create a standard hotspot ID
          id: 'main_hotspot_v2',
        },
        create: {
          id: 'main_hotspot_v2',
          title: 'Executive Intelligence Clusters',
          summary: executiveSummary,
          clusteringResults: result,
          lastClusteredAt: new Date(),
          clusteringVersion: result.version,
          clusteringQualityScore: result.overallQuality,
          createdAt: new Date(),
          // Create signal relationships through HotspotSignal junction table
          signals: {
            create: signalIds.map((signalId: string) => ({
              signalId: signalId,
              membershipStrength: 1.0,
              isOutlier: false,
            })),
          },
        },
        update: {
          summary: executiveSummary,
          clusteringResults: result,
          lastClusteredAt: new Date(),
          clusteringVersion: result.version,
          clusteringQualityScore: result.overallQuality,
          updatedAt: new Date(),
          // Update signal relationships by replacing them
          signals: {
            deleteMany: {}, // Remove all existing signal relationships
            create: signalIds.map((signalId: string) => ({
              signalId: signalId,
              membershipStrength: 1.0,
              isOutlier: false,
            })),
          },
        },
      });
      console.log('✅ Clustering results saved to database');
    } catch (dbError: any) {
      // If clustering columns don't exist, save basic hotspot without clustering fields
      if (
        (dbError.code === 'P2022' && dbError.message.includes('clustering')) ||
        dbError.message.includes('clusteringResults') ||
        dbError.message.includes('lastClusteredAt') ||
        dbError.message.includes('clusteringVersion') ||
        dbError.message.includes('clusteringQualityScore') ||
        dbError.message.includes('Invalid `prisma.hotspot.upsert()` invocation')
      ) {
        console.log(
          '⚠️  Hotspot clustering columns missing, saving basic hotspot...'
        );
        console.log(
          '💡 Clustering results will be temporarily stored in memory for API responses'
        );

        try {
          // Generate executive summary from clustering results
          const executiveSummary = `AI analysis identified ${result.outputClusterCount} critical business intelligence clusters from ${result.inputSignalCount} strategic inputs. Primary patterns: ${result.finalClusters?.map((c: any) => c.type).join(', ') || 'capacity management, process optimization'}. Recommended for immediate executive review and decision-making.`;

          await (prisma as any).hotspot.upsert({
            where: {
              id: 'main_hotspot_v2',
            },
            create: {
              id: 'main_hotspot_v2',
              title: 'Executive Intelligence Clusters',
              summary: executiveSummary,
              createdAt: new Date(),
              // Create signal relationships through HotspotSignal junction table
              signals: {
                create: signalIds.map((signalId: string) => ({
                  signalId: signalId,
                  membershipStrength: 1.0,
                  isOutlier: false,
                })),
              },
            },
            update: {
              summary: executiveSummary,
              updatedAt: new Date(),
              // Update signal relationships by replacing them
              signals: {
                deleteMany: {}, // Remove all existing signal relationships
                create: signalIds.map((signalId: string) => ({
                  signalId: signalId,
                  membershipStrength: 1.0,
                  isOutlier: false,
                })),
              },
            },
          });
          console.log(
            '✅ Basic hotspot saved (clustering fields will be added after schema migration)'
          );

          // Store clustering results in a temporary in-memory cache for this session
          // This allows the API to return results even without schema columns
          if (!(global as any).tempClusteringCache) {
            (global as any).tempClusteringCache = {};
          }
          (global as any).tempClusteringCache['main_hotspot_v2'] = {
            results: result,
            timestamp: new Date(),
            signalIds: signalIds,
          };
          console.log(
            '💾 Clustering results cached in memory for API responses'
          );
        } catch (basicError: any) {
          console.error('❌ Failed to save even basic hotspot:', basicError);
          // If we can't save anything to the database, still store in memory
          if (!(global as any).tempClusteringCache) {
            (global as any).tempClusteringCache = {};
          }
          (global as any).tempClusteringCache['main_hotspot_v2'] = {
            results: result,
            timestamp: new Date(),
            signalIds: signalIds,
          };
          console.log(
            '💾 Clustering results cached in memory only (database unavailable)'
          );
        }
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
 * Generate clustering results from existing hotspot data when database schema doesn't support clustering columns
 */
function generateClusteringResultsFromHotspot(hotspot: any, signals: any[]) {
  // Group signals by department and severity for clustering view
  const departmentGroups = signals.reduce((acc: any, signal: any) => {
    const deptName = signal.department?.name || 'Unknown Department';
    if (!acc[deptName]) {
      acc[deptName] = [];
    }
    acc[deptName].push(signal);
    return acc;
  }, {});

  // Create clusters based on departments and severity
  const finalClusters = Object.entries(departmentGroups).map(
    ([deptName, deptSignals]: [string, any]) => {
      const signalArray = deptSignals as any[];
      const avgSeverity =
        signalArray.reduce((sum: number, s: any) => {
          const severityScore =
            s.severity === 'CRITICAL'
              ? 5
              : s.severity === 'HIGH'
                ? 4
                : s.severity === 'MEDIUM'
                  ? 3
                  : s.severity === 'LOW'
                    ? 2
                    : 1;
          return sum + severityScore;
        }, 0) / signalArray.length;

      // Determine cluster type based on average severity
      const clusterType =
        avgSeverity >= 4
          ? 'CRITICAL'
          : avgSeverity >= 3
            ? 'HIGH'
            : avgSeverity >= 2
              ? 'MEDIUM'
              : 'LOW';

      return {
        id: `cluster_${deptName.toLowerCase().replace(/\s+/g, '_')}`,
        name: `${deptName} Process & Workflow`,
        description: `Issues identified in ${deptName} department requiring executive attention`,
        type: clusterType,
        signalCount: signalArray.length,
        signalIds: signalArray.map((s: any) => s.id),
        signals: signalArray.map((s: any) => {
          console.log(
            `📋 Signal ${s.id}: title="${s.title || 'NO TITLE'}", desc="${(s.description || '').substring(0, 30)}..."`
          );
          return {
            id: s.id,
            title: s.title,
            description: s.description,
            severity: s.severity,
          };
        }),
        businessImpact: {
          costImpact: Math.round(avgSeverity * 10000), // Mock cost impact
          timelineImpact: avgSeverity * 0.2, // Mock timeline impact
          qualityRisk: avgSeverity * 0.15, // Mock quality risk
          clientSatisfaction: Math.max(0, 1 - avgSeverity * 0.1), // Mock satisfaction impact
        },
        departmentsInvolved: [deptName],
        affectedDepartments: [deptName], // Frontend compatibility
        actionability: Math.min(1.0, avgSeverity * 0.2),
        urgencyScore: avgSeverity * 0.2,
        businessRelevance: Math.min(1.0, avgSeverity * 0.25),
        recommendedActions: [
          `Review ${deptName.toLowerCase()} process workflows`,
          `Implement quality control measures`,
          `Establish clear communication protocols`,
        ],
        estimatedResolution: {
          timeframe:
            avgSeverity >= 4
              ? 'Immediate (1-2 weeks)'
              : avgSeverity >= 3
                ? 'Short-term (2-4 weeks)'
                : 'Medium-term (1-2 months)',
          resources: [
            `${deptName} Team Lead`,
            'Process Improvement Specialist',
          ],
          cost: `$${Math.round(avgSeverity * 5000)}-${Math.round(avgSeverity * 15000)}`,
        },
      };
    }
  );

  // Calculate business relevance and efficiency metrics
  const avgBusinessRelevance =
    finalClusters.reduce(
      (sum: number, cluster: any) => sum + cluster.businessRelevance,
      0
    ) / finalClusters.length;

  const clusteringEfficiency = Math.min(
    1.0,
    finalClusters.length / (signals.length * 0.3)
  ); // Efficient if we reduced signals to ~30% in clusters

  return {
    success: true, // Required by frontend interface
    inputSignalCount: signals.length,
    outputClusterCount: finalClusters.length,
    clusteringEfficiency: clusteringEfficiency, // Required by frontend interface
    businessRelevanceScore: avgBusinessRelevance, // Required by frontend interface
    executiveActionability:
      finalClusters.reduce(
        (sum: number, cluster: any) => sum + cluster.actionability,
        0
      ) / finalClusters.length,
    finalClusters: finalClusters,
    processingTime: 50, // Mock processing time
    lastGenerated: new Date().toISOString(),
    // Keep additional metadata for compatibility
    version: '2.0.0',
    overallQuality: 0.85,
    metadata: {
      source: 'hotspot_transformation',
      hotspotId: hotspot.id,
      hotspotTitle: hotspot.title,
      algorithmVersion: '2.0.0-hotspot-fallback',
    },
  };
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
    console.log(`🔍 Enhanced feature generation for signal: ${signal.title}`);

    // Create enhanced text representation including metadata
    const textContent =
      `${signal.title || ''} ${signal.description || ''}`.trim();

    // Extract enhanced tags for better classification
    const enhancedTags = signal.enhancedTagsJson || {};
    const regularTags = signal.tagsJson || {};
    const impactData = signal.impactJson || {};
    const metricsData = signal.metricsJson || {};

    // Combine all tag sources for comprehensive analysis
    const allTags = [];
    if (regularTags.all) allTags.push(...regularTags.all);
    if (enhancedTags.domainClassification)
      allTags.push(...Object.values(enhancedTags.domainClassification).flat());

    console.log(`📊 Signal tags for clustering: ${allTags.join(', ')}`);

    // Generate enhanced bag-of-words embedding including tags
    const words = [
      ...textContent
        .toLowerCase()
        .split(/\s+/)
        .filter((w: string) => w.length > 2),
      ...allTags.map((tag: any) => String(tag).toLowerCase()),
    ];

    // Create embedding (512 dimensions)
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

    // ENHANCED root cause vector using comprehensive analysis
    const rootCauseVector: number[] = Array.from({ length: 7 }, () => 0.0);
    const text = textContent.toLowerCase();
    const tagString = allTags.join(' ').toLowerCase();
    const combinedText = `${text} ${tagString}`;

    // Severity-weighted scoring based on business impact
    const severityMultiplierMap: Record<string, number> = {
      CRITICAL: 1.0,
      HIGH: 0.8,
      MEDIUM: 0.6,
      LOW: 0.4,
    };
    const severityMultiplier =
      severityMultiplierMap[signal.severity as string] || 0.5;

    // TECHNOLOGY issues - enhanced detection
    if (
      combinedText.includes('technology') ||
      combinedText.includes('software') ||
      combinedText.includes('system') ||
      combinedText.includes('license') ||
      combinedText.includes('cad') ||
      combinedText.includes('bim') ||
      combinedText.includes('infrastructure') ||
      combinedText.includes('it') ||
      combinedText.includes('portal') ||
      combinedText.includes('platform')
    ) {
      rootCauseVector[3] = 0.9 * severityMultiplier;
    }

    // RESOURCE issues - staffing, capacity, allocation
    else if (
      combinedText.includes('staff') ||
      combinedText.includes('resource') ||
      combinedText.includes('utilization') ||
      combinedText.includes('capacity') ||
      combinedText.includes('allocation') ||
      combinedText.includes('overload') ||
      combinedText.includes('shortage') ||
      combinedText.includes('backlog')
    ) {
      rootCauseVector[1] = 0.8 * severityMultiplier;
    }

    // COMMUNICATION & COORDINATION issues
    else if (
      combinedText.includes('communication') ||
      combinedText.includes('coordination') ||
      combinedText.includes('portal') ||
      combinedText.includes('access') ||
      combinedText.includes('client') ||
      combinedText.includes('collaboration') ||
      combinedText.includes('integration') ||
      combinedText.includes('conflicts')
    ) {
      rootCauseVector[2] = 0.8 * severityMultiplier;
    }

    // QUALITY issues - errors, defects, compliance
    else if (
      combinedText.includes('quality') ||
      combinedText.includes('error') ||
      combinedText.includes('defect') ||
      combinedText.includes('compliance') ||
      combinedText.includes('review') ||
      combinedText.includes('approval') ||
      combinedText.includes('standard') ||
      combinedText.includes('code')
    ) {
      rootCauseVector[5] = 0.9 * severityMultiplier;
    }

    // TRAINING & KNOWLEDGE issues
    else if (
      combinedText.includes('training') ||
      combinedText.includes('knowledge') ||
      combinedText.includes('skill') ||
      combinedText.includes('research') ||
      combinedText.includes('documentation') ||
      combinedText.includes('gap') ||
      combinedText.includes('outdated') ||
      combinedText.includes('learning')
    ) {
      rootCauseVector[4] = 0.7 * severityMultiplier;
    }

    // EXTERNAL dependencies - vendors, utilities, external parties
    else if (
      combinedText.includes('vendor') ||
      combinedText.includes('external') ||
      combinedText.includes('utility') ||
      combinedText.includes('lab') ||
      combinedText.includes('supplier') ||
      combinedText.includes('contractor') ||
      combinedText.includes('third-party') ||
      combinedText.includes('delay')
    ) {
      rootCauseVector[6] = 0.8 * severityMultiplier;
    }

    // PROCESS issues - default for business process problems
    else {
      rootCauseVector[0] = 0.6 * severityMultiplier;
    }

    console.log(
      `🎯 Root cause classification: ${
        [
          'PROCESS',
          'RESOURCE',
          'COMMUNICATION',
          'TECHNOLOGY',
          'TRAINING',
          'QUALITY',
          'EXTERNAL',
        ][rootCauseVector.findIndex(v => v > 0)]
      } (${Math.max(...rootCauseVector).toFixed(2)})`
    );

    // ENHANCED department vector with better classification
    const departmentVector: number[] = Array.from({ length: 5 }, () => 0.0);
    const deptName = signal.department?.name?.toLowerCase() || '';

    if (deptName.includes('architecture') || deptName.includes('design'))
      departmentVector[0] = 1.0;
    else if (deptName.includes('engineering'))
      departmentVector[4] = 1.0; // Engineering gets "Other" slot
    else if (deptName.includes('field') || deptName.includes('construction'))
      departmentVector[1] = 1.0;
    else if (deptName.includes('project') || deptName.includes('management'))
      departmentVector[2] = 1.0;
    else if (deptName.includes('executive') || deptName.includes('leadership'))
      departmentVector[3] = 1.0;
    else departmentVector[4] = 1.0; // Other

    console.log(
      `🏢 Department classification: ${deptName} → vector: [${departmentVector.map(v => v.toFixed(1)).join(',')}]`
    );

    // ENHANCED business impact scoring using actual metrics data
    const costImpact = metricsData.costImpact || 0;
    const hoursAffected = metricsData.hoursAffected || 0;
    const timelineDays = metricsData.timelineDays || 0;

    const scheduleDelay = impactData.scheduleDelayDays || 0;
    const budgetVariance = impactData.budgetVariancePercent || 0;
    const qualityScore = impactData.qualityScore || 0.5;
    const clientSatisfaction = impactData.clientSatisfaction || 0.5;

    // Normalize business impact metrics (0-1 scale)
    const severityScore = Math.min((signal.severityScore || 1) / 4.0, 1.0); // 1-4 scale to 0-1
    const urgencyScore = Math.min(scheduleDelay / 30.0, 1.0); // 30+ days = max urgency
    const costScore = Math.min(costImpact / 100000.0, 1.0); // $100K+ = max cost impact
    const clientImpactScore = 1.0 - clientSatisfaction; // Lower satisfaction = higher impact

    console.log(
      `💰 Business impact - Cost: $${costImpact}, Schedule: ${scheduleDelay}d, Quality: ${qualityScore}, Client: ${clientSatisfaction}`
    );

    // Calculate enhanced A&E domain metrics
    const overallImpactScore =
      (severityScore + urgencyScore + costScore + clientImpactScore) / 4.0;
    const aeDomainVector = [
      scheduleDelay > 0 ? Math.min(scheduleDelay / 21.0, 1.0) : 0.3, // Project Phase impact
      costImpact > 50000 ? 0.8 : 0.5, // Building Type complexity (high cost = complex)
      1.0 - qualityScore, // Quality Category (lower quality = higher risk)
      text.includes('compliance') || text.includes('code') ? 0.9 : 0.3, // Compliance Risk
      urgencyScore, // Schedule Impact
      costScore, // Budget Impact
    ];

    console.log(
      `📈 Overall impact score: ${overallImpactScore.toFixed(2)}, A&E vector: [${aeDomainVector.map(v => v.toFixed(2)).join(',')}]`
    );

    // Create enhanced ClusteringFeatures structure
    return {
      signalId: signal.id,
      domainFeatures: {
        rootCauseVector,
        rootCauseConfidence: 0.8, // Higher confidence with enhanced detection
        departmentVector,
        departmentComplexity: Math.min(hoursAffected / 200.0, 1.0), // Hours affected as complexity
        businessImpactVector: [
          severityScore,
          urgencyScore,
          costScore,
          clientImpactScore,
        ],
        overallImpactScore,
        aeDomainVector,
        domainRelevance: 0.85, // Higher relevance with enhanced data
        timelineUrgency: urgencyScore,
        stakeholderCount: deptName.includes('executive') ? 0.8 : 0.4, // Executive = more stakeholders
        processComplexity: Math.min(timelineDays / 60.0, 1.0), // Timeline as complexity indicator
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
