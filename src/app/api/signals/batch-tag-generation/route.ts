/**
 * Batch Tag Generation API - Sprint 1
 * Expert: Dr. Rachel Kim (AI Tagging Specialist)
 *
 * Batch processing endpoint to re-tag all existing signals
 * Route: POST /api/signals/batch-tag-generation
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
const BatchTagRequestSchema = z.object({
  dryRun: z.boolean().optional().default(false),
  maxSignals: z.number().optional().default(50),
  forceRegenerate: z.boolean().optional().default(false),
  departmentFilter: z.string().optional(),
  parallelProcessing: z.boolean().optional().default(true),
  maxConcurrency: z.number().optional().default(3),
});

interface BatchProcessingResult {
  processedCount: number;
  successCount: number;
  errorCount: number;
  processingTime: number;
  results: Array<{
    signalId: string;
    status: 'success' | 'error' | 'skipped';
    processingTime?: number;
    error?: string;
    tags?: any;
  }>;
  summary: {
    rootCauseDistribution: Record<string, number>;
    averageConfidence: number;
    flaggedForReview: number;
  };
}

/**
 * POST /api/signals/batch-tag-generation
 * Generate enhanced tags for multiple signals in batch
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Authenticate user - require admin or executive role
    const session = await auth();
    if (!session?.user || !['ADMIN', 'EXECUTIVE'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or Executive role required' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedRequest = BatchTagRequestSchema.parse(body);

    console.log(
      `🏷️  Starting batch tag generation for up to ${validatedRequest.maxSignals} signals...`
    );

    // Build query filters
    const whereClause: any = {};
    if (validatedRequest.departmentFilter) {
      whereClause.department = { name: validatedRequest.departmentFilter };
    }
    if (!validatedRequest.forceRegenerate) {
      whereClause.enhancedTagsJson = null; // Only process signals without enhanced tags
    }

    // Get signals to process
    const signalsToProcess = await (prisma as any).signal.findMany({
      where: whereClause,
      include: {
        department: true,
        team: true,
        category: true,
        createdBy: true,
      },
      take: validatedRequest.maxSignals,
      orderBy: { createdAt: 'desc' },
    });

    console.log(`📊 Found ${signalsToProcess.length} signals to process`);

    if (validatedRequest.dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        signalsFound: signalsToProcess.length,
        estimatedProcessingTime: signalsToProcess.length * 2000, // 2s per signal estimate
        signals: signalsToProcess.map((s: any) => ({
          id: s.id,
          title: s.title,
          department: s.department?.name,
          hasExistingTags: !!s.enhancedTagsJson,
        })),
      });
    }

    // Initialize result tracking
    const result: BatchProcessingResult = {
      processedCount: 0,
      successCount: 0,
      errorCount: 0,
      processingTime: 0,
      results: [],
      summary: {
        rootCauseDistribution: {},
        averageConfidence: 0,
        flaggedForReview: 0,
      },
    };

    // Process signals - parallel or sequential based on request
    if (validatedRequest.parallelProcessing) {
      await processSignalsInParallel(
        signalsToProcess,
        validatedRequest.maxConcurrency,
        result,
        session.user.id
      );
    } else {
      await processSignalsSequentially(
        signalsToProcess,
        result,
        session.user.id
      );
    }

    // Calculate final metrics
    const totalProcessingTime = Date.now() - startTime;
    result.processingTime = totalProcessingTime;

    // Calculate summary statistics
    calculateSummaryStatistics(result);

    console.log(
      `✅ Batch processing completed: ${result.successCount}/${result.processedCount} successful`
    );

    return NextResponse.json({
      success: true,
      ...result,
      averageTimePerSignal:
        result.processedCount > 0
          ? totalProcessingTime / result.processedCount
          : 0,
    });
  } catch (error: any) {
    console.error('Batch tag generation failed:', error);

    return NextResponse.json(
      {
        error: 'Batch tag generation failed',
        message: error.message,
        processingTime: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

/**
 * Process signals in parallel with concurrency limit
 */
async function processSignalsInParallel(
  signals: any[],
  maxConcurrency: number,
  result: BatchProcessingResult,
  userId: string
): Promise<void> {
  const semaphore = new Array(maxConcurrency).fill(0);

  const processSignal = async (signal: any, index: number): Promise<void> => {
    const slotIndex = index % maxConcurrency;

    // Wait for slot to be available
    while (semaphore[slotIndex] !== 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    semaphore[slotIndex] = 1; // Acquire slot

    try {
      await processSingleSignal(signal, result, userId);
    } finally {
      semaphore[slotIndex] = 0; // Release slot
    }
  };

  // Start all signal processing
  const processingPromises = signals.map((signal, index) =>
    processSignal(signal, index)
  );

  // Wait for all to complete
  await Promise.all(processingPromises);
}

/**
 * Process signals sequentially
 */
async function processSignalsSequentially(
  signals: any[],
  result: BatchProcessingResult,
  userId: string
): Promise<void> {
  for (const signal of signals) {
    await processSingleSignal(signal, result, userId);
  }
}

/**
 * Process a single signal and update results
 */
async function processSingleSignal(
  signal: any,
  result: BatchProcessingResult,
  userId: string
): Promise<void> {
  const signalStartTime = Date.now();
  result.processedCount++;

  try {
    // Skip if already has enhanced tags and not forcing regeneration
    if (signal.enhancedTagsJson && !signal.forceRegenerate) {
      result.results.push({
        signalId: signal.id,
        status: 'skipped',
        processingTime: Date.now() - signalStartTime,
      });
      return;
    }

    // Prepare context
    const existingContext = {
      department: signal.department?.name || signal.department,
      team: signal.team?.name,
      category: signal.category?.name,
      severity: signal.severity,
      severityScore: signal.severityScore,
      sourceType: signal.sourceType,
      createdBy: signal.createdBy?.name,
    };

    // Generate enhanced tags
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

    // Update signal in database
    await (prisma as any).signal.update({
      where: { id: signal.id },
      data: {
        enhancedTagsJson: tags,
        tagGenerationMeta: metadata,
        domainClassification: domainClassification,
        lastTaggedAt: new Date(),
        tagModelVersion: metadata.modelVersion,
        aiProcessed: true,
      },
    });

    // Log success
    await logBatchTaggingActivity(userId, signal.id, metadata, 'SUCCESS');

    result.successCount++;
    result.results.push({
      signalId: signal.id,
      status: 'success',
      processingTime: Date.now() - signalStartTime,
      tags: tags,
    });

    console.log(
      `✅ Tagged signal ${signal.id} (${result.processedCount}/${result.processedCount + result.errorCount})`
    );
  } catch (error: any) {
    console.error(`❌ Failed to tag signal ${signal.id}:`, error.message);

    // Log error
    await logBatchTaggingActivity(
      userId,
      signal.id,
      null,
      'ERROR',
      error.message
    );

    result.errorCount++;
    result.results.push({
      signalId: signal.id,
      status: 'error',
      processingTime: Date.now() - signalStartTime,
      error: error.message,
    });
  }
}

/**
 * Calculate summary statistics from results
 */
function calculateSummaryStatistics(result: BatchProcessingResult): void {
  const successfulResults = result.results.filter(
    r => r.status === 'success' && r.tags
  );

  if (successfulResults.length === 0) return;

  // Root cause distribution
  successfulResults.forEach(r => {
    const rootCause = r.tags?.rootCause?.primary;
    if (rootCause) {
      result.summary.rootCauseDistribution[rootCause] =
        (result.summary.rootCauseDistribution[rootCause] || 0) + 1;
    }
  });

  // Average confidence
  const confidenceScores = successfulResults
    .map(r => r.tags?.rootCause?.confidence)
    .filter(Boolean);

  if (confidenceScores.length > 0) {
    result.summary.averageConfidence =
      confidenceScores.reduce((sum: number, conf: number) => sum + conf, 0) /
      confidenceScores.length;
  }

  // Flagged for review count
  result.summary.flaggedForReview = successfulResults.filter(
    r => r.tags?.rootCause?.confidence < 0.7
  ).length;
}

/**
 * Log batch tagging activity for audit purposes
 */
async function logBatchTaggingActivity(
  userId: string,
  signalId: string,
  metadata: any,
  status: 'SUCCESS' | 'ERROR',
  errorMessage?: string
): Promise<void> {
  try {
    await (prisma as any).aIAnalysisAudit.create({
      data: {
        userId,
        signalId,
        analysisType: 'BATCH_ENHANCED_TAGGING',
        modelVersion: metadata?.modelVersion || 'ERROR',
        processingTime: metadata?.processingTime || 0,
        confidence: metadata?.overallConfidence || 0,
        resultJson: {
          status,
          error: errorMessage,
          qualityMetrics: metadata?.qualityMetrics,
          flags: metadata?.flags,
        },
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log batch tagging activity:', error);
    // Don't fail the main operation for logging errors
  }
}

/**
 * GET /api/signals/batch-tag-generation
 * Get batch processing status and recent activities
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

    // Get recent batch processing activities
    const recentActivities = await (prisma as any).aIAnalysisAudit.findMany({
      where: {
        analysisType: 'BATCH_ENHANCED_TAGGING',
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Get current tagging statistics
    const totalSignals = await (prisma as any).signal.count();
    const taggedSignals = await (prisma as any).signal.count({
      where: { enhancedTagsJson: { not: null } },
    });

    return NextResponse.json({
      success: true,
      statistics: {
        totalSignals,
        taggedSignals,
        untaggedSignals: totalSignals - taggedSignals,
        taggedPercentage:
          totalSignals > 0
            ? ((taggedSignals / totalSignals) * 100).toFixed(1)
            : 0,
      },
      recentActivities: recentActivities.map((activity: any) => ({
        id: activity.id,
        createdAt: activity.createdAt,
        user: activity.user?.name,
        processingTime: activity.processingTime,
        confidence: activity.confidence,
        status: activity.resultJson?.status,
        error: activity.resultJson?.error,
      })),
    });
  } catch (error: any) {
    console.error('Failed to get batch processing status:', error);

    return NextResponse.json(
      {
        error: 'Failed to get status',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
