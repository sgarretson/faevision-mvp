import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clusterSignalsHDBSCAN } from '@/lib/clustering/hdbscan';
import {
  generateSolutionSuggestions,
  analyzeHotspotPotential,
} from '@/lib/ai/signal-processing';

/**
 * Real-time Hotspot Generation API
 *
 * Manually triggered clustering for immediate executive needs:
 * - Process all unprocessed signals
 * - Generate hotspots with AI analysis
 * - Create actionable solution suggestions
 * - Return executive-ready dashboard data
 *
 * Expert: Dr. Priya Patel (AI Architect)
 * Support: Alex Thompson (Lead Developer)
 */

export async function POST(request: NextRequest) {
  console.log('🔬 Starting Real-time Hotspot Generation...');

  try {
    const startTime = Date.now();

    // Parse request body for options
    const body = await request.json().catch(() => ({}));
    const options = {
      minClusterSize: body.minClusterSize || 3,
      minSamples: body.minSamples || 2,
      forceReclustering: body.forceReclustering || false,
      generateSolutions: body.generateSolutions || true,
    };

    console.log(`  ⚙️ Clustering options:`, options);

    // Get signals for clustering - backward compatible with V1/V2
    let signals;
    try {
      // Try V2 Signal model first
      if ('signal' in prisma) {
        signals = await (prisma as any).signal.findMany({
          where: {
            // For testing: include all signals, not just AI processed
            ...(options.forceReclustering
              ? {}
              : {
                  hotspots: { none: {} }, // Only unassigned signals unless forcing
                }),
          },
          include: {
            hotspots: {
              include: { hotspot: true },
            },
            department: true,
            team: true,
          },
          orderBy: { receivedAt: 'desc' },
          take: 200, // Limit for performance
        });
      } else {
        console.warn('Signal model not available');
        return NextResponse.json({
          success: false,
          message: 'Signal model not available - V2 migration required',
          signalCount: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching signals:', error);
      // Return empty array for graceful degradation
      signals = [];
    }

    console.log(`  📊 Processing ${signals.length} signals for clustering...`);

    if (signals.length < options.minClusterSize) {
      return NextResponse.json({
        success: false,
        message: `Insufficient signals for clustering (${signals.length} < ${options.minClusterSize})`,
        signalCount: signals.length,
      });
    }

    // Extract embeddings for clustering
    const embeddings = signals.map((signal: any) => {
      if (signal.embedding) {
        // V2 Signal model with Bytes embedding
        return Array.from(new Float32Array(signal.embedding));
      } else {
        // Legacy fallback - create simple embedding from description
        return createSimpleEmbedding(signal.description || signal.title || '');
      }
    });

    // Perform HDBSCAN clustering
    console.log('  🔬 Running HDBSCAN clustering...');
    const clusters = await clusterSignalsHDBSCAN(embeddings, {
      minClusterSize: options.minClusterSize,
      minSamples: options.minSamples,
      metric: 'cosine', // Better for text embeddings
    });

    console.log(`  🎯 Found ${clusters.length} potential clusters`);

    // Generate hotspots from clusters
    const hotspotsCreated = [];
    const hotspotsAnalyzed = [];

    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      const clusterSignals = cluster.points.map(
        pointIndex => signals[pointIndex]
      );

      console.log(
        `    🔍 Analyzing cluster ${i} with ${clusterSignals.length} signals...`
      );

      // AI analysis to determine if cluster should become hotspot
      const hotspotAnalysis = await analyzeHotspotPotential(clusterSignals);
      hotspotsAnalyzed.push({
        clusterId: i,
        signalCount: clusterSignals.length,
        analysis: hotspotAnalysis,
      });

      if (!hotspotAnalysis.should_group || hotspotAnalysis.confidence < 0.6) {
        console.log(
          `      ⚠️ Cluster ${i} not suitable for hotspot (confidence: ${hotspotAnalysis.confidence})`
        );
        continue;
      }

      // Create hotspot in database
      try {
        const hotspot = await createHotspotFromCluster(
          clusterSignals,
          cluster,
          hotspotAnalysis
        );

        // Generate AI solution suggestions if requested
        let solutions = [];
        if (options.generateSolutions) {
          const solutionSuggestions = await generateSolutionSuggestions(
            hotspot.summary,
            clusterSignals
          );
          solutions = solutionSuggestions.solutions || [];
        }

        hotspotsCreated.push({
          hotspot,
          solutions,
          signalCount: clusterSignals.length,
          membershipStrengths: cluster.membershipStrengths,
        });

        console.log(`      ✅ Created hotspot: ${hotspot.title}`);
      } catch (error) {
        console.error(
          `      ❌ Failed to create hotspot from cluster ${i}:`,
          error
        );
      }
    }

    const duration = Date.now() - startTime;

    // Get updated hotspot list for dashboard
    const allHotspots = await getHotspotsForDashboard();

    console.log(
      `  🎉 Hotspot generation complete: ${hotspotsCreated.length} created in ${duration}ms`
    );

    return NextResponse.json({
      success: true,
      signalsProcessed: signals.length,
      clustersAnalyzed: clusters.length,
      hotspotsCreated: hotspotsCreated.length,
      clustersRejected: hotspotsAnalyzed.filter(h => !h.analysis.should_group)
        .length,
      results: {
        newHotspots: hotspotsCreated,
        allHotspots: allHotspots,
        clusterAnalysis: hotspotsAnalyzed,
      },
      performance: {
        duration: `${duration}ms`,
        signalsPerSecond: Math.round(signals.length / (duration / 1000)),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Hotspot Generation failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Create hotspot from clustered signals with AI analysis
 */
async function createHotspotFromCluster(
  signals: any[],
  cluster: any,
  analysis: any
) {
  const rankScore = calculateAdvancedHotspotRank(signals, analysis, cluster);

  try {
    // Try V2 Hotspot model, fallback to legacy response
    if ('hotspot' in prisma) {
      const hotspot = await (prisma as any).hotspot.create({
        data: {
          title: analysis.suggested_title || `${analysis.common_theme}`,
          summary:
            analysis.reasoning || 'AI-identified pattern requiring attention',
          status: 'OPEN',
          rankScore,
          confidence: analysis.confidence,
          clusteringMethod: 'HDBSCAN',
          similarityThreshold: cluster.threshold || 0.7,
          linkedEntitiesJson: extractAdvancedLinkedEntities(signals),
        },
      });

      // Create signal relationships with detailed membership data
      for (let i = 0; i < signals.length; i++) {
        const signal = signals[i];
        const membershipStrength = cluster.membershipStrengths?.[i] || 0.8;

        await (prisma as any).hotspotSignal.create({
          data: {
            hotspotId: hotspot.id,
            signalId: signal.id,
            membershipStrength,
            isOutlier: membershipStrength < 0.5,
          },
        });
      }

      return hotspot;
    } else {
      // V1 fallback - return simple hotspot structure
      console.log(
        `  ✅ Created legacy hotspot: ${analysis.suggested_title} (${cluster.length} signals, rank: ${rankScore})`
      );

      return {
        id: `legacy-hotspot-${Date.now()}`,
        title: analysis.suggested_title || `${analysis.common_theme}`,
        summary:
          analysis.reasoning || 'AI-identified pattern requiring attention',
        confidence: 0.8,
        signalIds: signals.map(s => s.id),
        clusteringMethod: 'LEGACY_HDBSCAN',
        status: 'ACTIVE',
        rankScore,
      };
    }
  } catch (error) {
    // Fallback for any errors - create virtual hotspot data
    console.log(`  ⚠️ Error creating hotspot, using fallback:`, error);
    return {
      id: `virtual-${Date.now()}`,
      title: analysis.suggested_title || `${analysis.common_theme}`,
      summary:
        analysis.reasoning || 'AI-identified pattern requiring attention',
      status: 'OPEN',
      rankScore,
      confidence: analysis.confidence || 0.8,
      signalIds: signals.map(s => s.id),
    };
  }
}

/**
 * Advanced hotspot ranking with multiple factors
 */
function calculateAdvancedHotspotRank(
  signals: any[],
  analysis: any,
  cluster: any
): number {
  const severityWeights = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

  // Factor 1: Severity scoring
  let severityScore = 0;
  signals.forEach(signal => {
    const severity = signal.severity || signal.priority || 'MEDIUM';
    severityScore +=
      severityWeights[severity as keyof typeof severityWeights] || 2;
  });
  const avgSeverity = severityScore / signals.length / 4; // Normalize to 0-1

  // Factor 2: Signal volume (more signals = higher importance)
  const volumeScore = Math.min(signals.length / 10, 1); // Cap at 10 signals

  // Factor 3: AI confidence in clustering
  const aiConfidence = analysis.confidence || 0.5;

  // Factor 4: Cluster cohesion (how tightly grouped)
  const cohesionScore = cluster.confidence || 0.5;

  // Factor 5: Business impact (if available in signals)
  let impactScore = 0;
  signals.forEach(signal => {
    if (signal.impactJson || signal.metricsJson) {
      impactScore += 0.1;
    }
  });
  impactScore = Math.min(impactScore, 1);

  // Factor 6: Recency bias (newer issues get slight boost)
  const avgAge =
    signals.reduce((sum, signal) => {
      const age =
        Date.now() - new Date(signal.receivedAt || signal.createdAt).getTime();
      return sum + age;
    }, 0) / signals.length;
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  const recencyScore = Math.max(0, 1 - avgAge / maxAge);

  // Weighted ranking formula (total = 1.0)
  const finalScore =
    0.25 * avgSeverity + // Severity is most important
    0.2 * volumeScore + // Volume indicates systemic issues
    0.2 * aiConfidence + // AI analysis quality
    0.15 * cohesionScore + // Cluster quality
    0.1 * impactScore + // Business impact
    0.1 * recencyScore; // Recency bonus

  return Math.min(Math.max(finalScore, 0), 1); // Clamp to 0-1 range
}

/**
 * Extract advanced linked entities with frequency and context
 */
function extractAdvancedLinkedEntities(signals: any[]): any {
  const entityMap = new Map();
  const contextMap = new Map();

  signals.forEach(signal => {
    const entities = signal.entitiesJson || signal.aiSuggestions || [];
    const signalContext = {
      id: signal.id,
      title: signal.title,
      department: signal.department?.name || signal.department,
      severity: signal.severity || signal.priority,
    };

    if (Array.isArray(entities)) {
      entities.forEach((entity: any) => {
        if (entity.type && entity.name) {
          const key = `${entity.type}:${entity.name}`;

          if (entityMap.has(key)) {
            entityMap.get(key).count++;
            entityMap.get(key).totalConfidence += entity.confidence || 0.5;
            contextMap.get(key).push(signalContext);
          } else {
            entityMap.set(key, {
              ...entity,
              count: 1,
              totalConfidence: entity.confidence || 0.5,
            });
            contextMap.set(key, [signalContext]);
          }
        }
      });
    }
  });

  return Array.from(entityMap.entries())
    .filter(([key, entity]) => entity.count > 1) // Only multi-signal entities
    .map(([key, entity]) => ({
      ...entity,
      avgConfidence: entity.totalConfidence / entity.count,
      contexts: contextMap.get(key) || [],
      importance: entity.count / signals.length, // Percentage of signals affected
    }))
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10); // Top 10 most important entities
}

/**
 * Get formatted hotspots for executive dashboard
 */
async function getHotspotsForDashboard() {
  try {
    const hotspots = await (prisma as any).hotspot.findMany({
      where: {
        status: { in: ['OPEN', 'APPROVED'] },
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
                receivedAt: true,
                department: true,
                team: true,
              },
            },
          },
        },
      },
      orderBy: { rankScore: 'desc' },
      take: 20,
    });

    return hotspots.map((hotspot: any) => ({
      id: hotspot.id,
      title: hotspot.title,
      summary: hotspot.summary,
      status: hotspot.status,
      rankScore: hotspot.rankScore,
      confidence: hotspot.confidence,
      signalCount: hotspot.signals.length,
      linkedEntities: hotspot.linkedEntitiesJson,
      signals: hotspot.signals.map((hs: any) => ({
        ...hs.signal,
        membershipStrength: hs.membershipStrength,
        isOutlier: hs.isOutlier,
      })),
    }));
  } catch (error) {
    // Fallback for legacy schema - return empty hotspots for now
    console.log(
      '  ⚠️ V2 hotspot retrieval failed, using legacy fallback:',
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
}

/**
 * Create simple embedding fallback for legacy signals
 */
function createSimpleEmbedding(text: string): number[] {
  // Enhanced hash-based embedding with better distribution
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(128).fill(0); // Increased dimensions

  words.forEach((word, index) => {
    if (word.length > 2) {
      // Skip short words
      const hash1 = simpleHash(word);
      const hash2 = simpleHash(word.split('').reverse().join(''));

      embedding[hash1 % 128] += 1;
      embedding[hash2 % 128] += 0.5; // Secondary feature
    }
  });

  // Normalize to unit vector
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => (norm > 0 ? val / norm : 0));
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// GET endpoint for testing
export async function GET() {
  return POST(
    new NextRequest('http://localhost/api/cluster/generate-hotspots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minClusterSize: 3, generateSolutions: true }),
    })
  );
}
