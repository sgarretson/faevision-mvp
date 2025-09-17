/**
 * Clustering Status API - Sprint 2 Task 2
 * Expert: Dr. Elena Rodriguez (Advanced Clustering Specialist)
 *
 * Monitor hybrid clustering job status
 * Route: GET /api/signals/clustering/status
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { hybridClusteringEngine } from '@/lib/clustering/hybrid-clustering-engine';

// Force dynamic rendering for this route since it uses auth() which requires headers
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/signals/clustering/status?jobId=xxx
 * Get clustering job status and progress
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

    // Get jobId from query parameters
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId parameter' },
        { status: 400 }
      );
    }

    // Get status from clustering engine
    const status = hybridClusteringEngine.getClusteringStatus(jobId);

    if (!status) {
      return NextResponse.json(
        {
          error: 'Job not found',
          jobId,
          suggestion: 'Job may have expired or does not exist',
        },
        { status: 404 }
      );
    }

    // Calculate estimated completion time
    const estimatedCompletion = calculateEstimatedCompletion(status);

    return NextResponse.json({
      success: true,
      jobId,
      status: status.status,
      currentStage: status.currentStage,
      progress: status.progress,
      timing: {
        ...status.timing,
        estimatedCompletion,
      },
      intermediate: status.intermediate,
      warnings: status.warnings,
      error: status.error,
      stageDescription: getStageDescription(status.currentStage),
      nextActions: getNextActions(status),
    });
  } catch (error: any) {
    console.error('Failed to get clustering status:', error);

    return NextResponse.json(
      {
        error: 'Failed to get clustering status',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate estimated completion time based on current progress
 */
function calculateEstimatedCompletion(status: any): Date | null {
  if (status.status === 'COMPLETED' || status.status === 'FAILED') {
    return null;
  }

  if (!status.timing.startedAt) {
    return null;
  }

  const elapsed = Date.now() - new Date(status.timing.startedAt).getTime();
  const estimatedTotal =
    elapsed / Math.max(status.progress.overallProgress, 0.01);
  const remaining = estimatedTotal - elapsed;

  return new Date(Date.now() + remaining);
}

/**
 * Get human-readable stage description
 */
function getStageDescription(stage: string): string {
  switch (stage) {
    case 'DOMAIN_PRECLUSTERING':
      return 'Applying business rules to separate signals by root cause categories';
    case 'SEMANTIC_REFINEMENT':
      return 'Using AI to refine clusters based on semantic similarity';
    case 'QUALITY_VALIDATION':
      return 'Optimizing clusters for executive decision-making';
    case 'FINISHED':
      return 'Clustering completed successfully';
    default:
      return 'Processing clusters...';
  }
}

/**
 * Get recommended next actions based on status
 */
function getNextActions(status: any): string[] {
  const actions: string[] = [];

  switch (status.status) {
    case 'QUEUED':
      actions.push('Job is queued and will start processing shortly');
      break;
    case 'PROCESSING':
      actions.push('Job is actively processing, check back in 30 seconds');
      if (status.warnings.length > 0) {
        actions.push('Review warnings for potential quality issues');
      }
      break;
    case 'COMPLETED':
      actions.push(
        'Clustering completed - retrieve results using GET /api/signals/clustering/generate'
      );
      actions.push('Review executive clusters for decision-making');
      break;
    case 'FAILED':
      actions.push('Job failed - check error message and retry if needed');
      actions.push('Consider reducing signal count or adjusting parameters');
      break;
  }

  return actions;
}
