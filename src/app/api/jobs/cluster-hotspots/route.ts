import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cosineSimilarity, analyzeHotspotPotential } from '@/lib/ai/signal-processing';
import { clusterSignalsHDBSCAN } from '@/lib/clustering/hdbscan';

/**
 * Hotspot Clustering Background Job
 * 
 * Runs every 10 minutes to cluster signals into hotspots:
 * - In-memory HDBSCAN clustering of embeddings
 * - Create/update hotspots with confidence scoring
 * - Calculate membership strength for each signal
 * - Flag outliers (<0.5 membership strength)
 * 
 * Expert: Dr. Priya Patel (AI Architect)
 * Support: Alex Thompson (Lead Developer)
 */

export async function POST(request: NextRequest) {
  console.log('🔬 Starting Hotspot Clustering Job...');
  
  try {
    // Check authorization for production
    const cronSecret = request.headers.get('authorization');
    if (process.env.VERCEL_ENV === 'production' && cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const startTime = Date.now();

    // Get all processed signals with embeddings
    let processedSignals;
    try {
      // Try V2 Signal model
      processedSignals = await prisma.signal.findMany({
        where: {
          aiProcessed: true,
          embedding: { not: null }
        },
        include: {
          hotspots: true // Include existing hotspot relationships
        },
        orderBy: { receivedAt: 'asc' }
      });
    } catch (error) {
      // Fallback to legacy Input model
      processedSignals = await prisma.input.findMany({
        where: {
          aiProcessed: true
        },
        orderBy: { createdAt: 'asc' }
      });
    }

    if (processedSignals.length < 3) {
      console.log('  ⚠️ Insufficient signals for clustering (minimum 3 required)');
      return NextResponse.json({
        success: true,
        clustered: 0,
        message: 'Insufficient signals for clustering',
        signalCount: processedSignals.length
      });
    }

    console.log(`  📊 Clustering ${processedSignals.length} signals...`);

    // Extract embeddings for clustering
    const embeddings = processedSignals.map((signal: any) => {
      if (signal.embedding) {
        // V2 Signal model with Bytes embedding
        return Array.from(new Float32Array(signal.embedding));
      } else {
        // Legacy fallback - create simple embedding from description
        return createSimpleEmbedding(signal.description);
      }
    });

    // Perform HDBSCAN clustering
    const clusters = await clusterSignalsHDBSCAN(embeddings, {
      minClusterSize: 3,
      minSamples: 2,
      metric: 'euclidean'
    });

    console.log(`  🎯 Found ${clusters.length} potential hotspots`);

    let hotspotsCreated = 0;
    let hotspotsUpdated = 0;

    // Process each cluster
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      const clusterSignals = cluster.points.map(pointIndex => processedSignals[pointIndex]);
      
      if (clusterSignals.length < 3) {
        console.log(`    ⚠️ Cluster ${i} too small (${clusterSignals.length} signals), skipping`);
        continue;
      }

      // Analyze if this cluster should become a hotspot
      const hotspotAnalysis = await analyzeHotspotPotential(clusterSignals);
      
      if (!hotspotAnalysis.should_group || hotspotAnalysis.confidence < 0.6) {
        console.log(`    ⚠️ Cluster ${i} not suitable for hotspot (confidence: ${hotspotAnalysis.confidence})`);
        continue;
      }

      // Check if hotspot already exists for these signals
      let existingHotspot;
      try {
        const signalIds = clusterSignals.map(s => s.id);
        existingHotspot = await prisma.hotspot.findFirst({
          where: {
            signals: {
              some: {
                signalId: { in: signalIds }
              }
            }
          },
          include: {
            signals: true
          }
        });
      } catch (error) {
        // Hotspot model not available in legacy schema
        existingHotspot = null;
      }

      if (existingHotspot) {
        // Update existing hotspot
        try {
          await updateExistingHotspot(existingHotspot, clusterSignals, cluster, hotspotAnalysis);
          hotspotsUpdated++;
          console.log(`    ✅ Updated hotspot: ${existingHotspot.id}`);
        } catch (error) {
          console.error(`    ❌ Failed to update hotspot ${existingHotspot.id}:`, error);
        }
      } else {
        // Create new hotspot
        try {
          const newHotspot = await createNewHotspot(clusterSignals, cluster, hotspotAnalysis);
          hotspotsCreated++;
          console.log(`    ✅ Created hotspot: ${newHotspot.id}`);
        } catch (error) {
          console.error(`    ❌ Failed to create hotspot:`, error);
        }
      }
    }

    const duration = Date.now() - startTime;
    console.log(`  🎉 Clustering complete: ${hotspotsCreated} created, ${hotspotsUpdated} updated in ${duration}ms`);

    return NextResponse.json({
      success: true,
      signalsProcessed: processedSignals.length,
      clustersFound: clusters.length,
      hotspotsCreated,
      hotspotsUpdated,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Hotspot Clustering Job failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * Create a new hotspot from clustered signals
 */
async function createNewHotspot(signals: any[], cluster: any, analysis: any) {
  const rankScore = calculateHotspotRank(signals, analysis);
  
  const hotspot = await prisma.hotspot.create({
    data: {
      title: analysis.suggested_title || `Hotspot: ${analysis.common_theme}`,
      summary: analysis.reasoning || 'AI-identified pattern in related signals',
      status: 'OPEN',
      rankScore,
      confidence: analysis.confidence,
      clusteringMethod: 'HDBSCAN',
      similarityThreshold: cluster.threshold || 0.7,
      linkedEntitiesJson: extractLinkedEntities(signals)
    }
  });

  // Create signal relationships with membership strength
  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i];
    const membershipStrength = cluster.membershipStrengths?.[i] || 0.8;
    
    await prisma.hotspotSignal.create({
      data: {
        hotspotId: hotspot.id,
        signalId: signal.id,
        membershipStrength,
        isOutlier: membershipStrength < 0.5
      }
    });
  }

  return hotspot;
}

/**
 * Update existing hotspot with new clustering results
 */
async function updateExistingHotspot(hotspot: any, signals: any[], cluster: any, analysis: any) {
  const rankScore = calculateHotspotRank(signals, analysis);
  
  await prisma.hotspot.update({
    where: { id: hotspot.id },
    data: {
      confidence: analysis.confidence,
      rankScore,
      linkedEntitiesJson: extractLinkedEntities(signals),
      updatedAt: new Date()
    }
  });

  // Update signal relationships
  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i];
    const membershipStrength = cluster.membershipStrengths?.[i] || 0.8;
    
    await prisma.hotspotSignal.upsert({
      where: {
        hotspotId_signalId: {
          hotspotId: hotspot.id,
          signalId: signal.id
        }
      },
      update: {
        membershipStrength,
        isOutlier: membershipStrength < 0.5
      },
      create: {
        hotspotId: hotspot.id,
        signalId: signal.id,
        membershipStrength,
        isOutlier: membershipStrength < 0.5
      }
    });
  }
}

/**
 * Calculate hotspot ranking score
 */
function calculateHotspotRank(signals: any[], analysis: any): number {
  const severityWeights = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
  
  let severityScore = 0;
  let impactScore = 0;
  
  signals.forEach(signal => {
    const severity = signal.severity || signal.priority || 'MEDIUM';
    severityScore += severityWeights[severity as keyof typeof severityWeights] || 2;
    
    // Add impact from metrics if available
    if (signal.impactJson || signal.metricsJson) {
      impactScore += 1;
    }
  });

  const avgSeverity = severityScore / signals.length / 4; // Normalize to 0-1
  const signalCount = Math.min(signals.length / 10, 1); // Normalize signal count
  const confidence = analysis.confidence || 0.5;
  
  // Weighted ranking formula
  return (0.4 * avgSeverity) + (0.3 * signalCount) + (0.3 * confidence);
}

/**
 * Extract linked entities across signals
 */
function extractLinkedEntities(signals: any[]): any {
  const entityMap = new Map();
  
  signals.forEach(signal => {
    const entities = signal.entitiesJson || signal.aiSuggestions || [];
    
    if (Array.isArray(entities)) {
      entities.forEach((entity: any) => {
        if (entity.type && entity.name) {
          const key = `${entity.type}:${entity.name}`;
          if (entityMap.has(key)) {
            entityMap.get(key).count++;
          } else {
            entityMap.set(key, { ...entity, count: 1 });
          }
        }
      });
    }
  });
  
  return Array.from(entityMap.values())
    .filter(entity => entity.count > 1) // Only entities appearing in multiple signals
    .sort((a, b) => b.count - a.count);
}

/**
 * Create simple embedding fallback for legacy signals
 */
function createSimpleEmbedding(description: string): number[] {
  // Simple hash-based embedding for backward compatibility
  const words = description.toLowerCase().split(/\s+/);
  const embedding = new Array(100).fill(0);
  
  words.forEach((word, index) => {
    const hash = simpleHash(word);
    embedding[hash % 100] += 1;
  });
  
  // Normalize
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => norm > 0 ? val / norm : 0);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Allow manual triggering for testing
export async function GET() {
  return POST(new NextRequest('http://localhost/api/jobs/cluster-hotspots', { method: 'POST' }));
}
