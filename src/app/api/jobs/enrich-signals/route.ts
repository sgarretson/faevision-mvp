import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  generateEmbedding,
  extractEntities,
  generateTags,
} from '@/lib/ai/signal-processing';

/**
 * Signal Enrichment Background Job
 *
 * Runs every 5 minutes to process new signals with AI enhancement:
 * - Generate OpenAI embeddings for clustering
 * - Extract entities (vendors, clients, etc.)
 * - Generate AI tags and confidence scoring
 *
 * Expert: Dr. Priya Patel (AI Architect)
 * Support: Jordan Kim (Vercel Engineer)
 */

export async function POST(request: NextRequest) {
  console.log('🤖 Starting Signal Enrichment Job...');

  try {
    // Check if this is a cron job or manual trigger
    const cronSecret = request.headers.get('authorization');
    if (
      process.env.VERCEL_ENV === 'production' &&
      cronSecret !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find unprocessed signals (V2 model if available, fallback to legacy)
    let unprocessedSignals;
    try {
      // Try V2 Signal model
      unprocessedSignals = await (prisma as any).signal.findMany({
        where: {
          aiProcessed: false,
          confidence: null,
        },
        take: 10, // Process in batches for performance
        orderBy: { receivedAt: 'asc' },
      });
    } catch (error) {
      console.warn('Signal model not available, skipping enrichment');
      return NextResponse.json({
        success: false,
        message: 'Signal model not available - V2 migration required',
        processed: 0,
      });
    }

    if (unprocessedSignals.length === 0) {
      console.log('  ✅ No signals to process');
      return NextResponse.json({
        success: true,
        processed: 0,
        message: 'No signals requiring enrichment',
      });
    }

    console.log(`  📊 Processing ${unprocessedSignals.length} signals...`);

    let processedCount = 0;

    for (const signal of unprocessedSignals) {
      try {
        // Generate OpenAI embedding for clustering
        const embedding = await generateEmbedding(signal.description);

        // Extract entities (vendors, clients, departments, etc.)
        const entities = await extractEntities(signal.description);

        // Generate AI tags with confidence
        const aiTags = await generateTags(signal.description, entities);

        // Calculate overall confidence score
        const confidence = calculateOverallConfidence(signal, entities, aiTags);

        // Update signal with AI processing results
        if ('aiProcessed' in signal) {
          // V2 Signal model
          await (prisma as any).signal.update({
            where: { id: signal.id },
            data: {
              embedding: Buffer.from(new Float32Array(embedding)),
              entitiesJson: entities,
              aiTagsJson: aiTags,
              confidence: confidence,
              aiProcessed: true,
            },
          });
        } else {
          console.warn('Unknown signal model type - skipping');
        }

        processedCount++;
        console.log(`    ✅ Processed signal: ${signal.id}`);
      } catch (error) {
        console.error(`    ❌ Error processing signal ${signal.id}:`, error);
        // Continue processing other signals
      }
    }

    const duration = Date.now();
    console.log(
      `  🎉 Signal enrichment complete: ${processedCount} signals processed`
    );

    return NextResponse.json({
      success: true,
      processed: processedCount,
      total: unprocessedSignals.length,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Signal Enrichment Job failed:', error);

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
 * Calculate overall confidence score based on AI processing results
 */
function calculateOverallConfidence(
  signal: any,
  entities: any[],
  aiTags: any
): number {
  let confidence = 0.5; // Base confidence

  // Increase confidence based on description quality
  if (signal.description && signal.description.length > 50) {
    confidence += 0.1;
  }

  // Increase confidence based on entity extraction
  if (entities && entities.length > 0) {
    confidence += Math.min(entities.length * 0.05, 0.2);
  }

  // Increase confidence based on AI tag quality
  if (aiTags && aiTags.confidence) {
    confidence += aiTags.confidence * 0.3;
  }

  // Cap at 0.95 (never 100% confident)
  return Math.min(confidence, 0.95);
}

// Allow manual triggering for testing
export async function GET() {
  return POST(
    new NextRequest('http://localhost/api/jobs/enrich-signals', {
      method: 'POST',
    })
  );
}
