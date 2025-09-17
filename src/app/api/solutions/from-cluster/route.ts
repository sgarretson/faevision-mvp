/**
 * Solution Creation from Clustering Results API
 * Sprint 3 Story 1: Hotspot Intelligence Dashboard Enhancement
 * Expert: Maya Rodriguez (UX Expert) + Alex Thompson (Lead Developer)
 *
 * Create executive-ready solutions from hybrid clustering intelligence
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Request validation schema
const CreateSolutionFromClusterSchema = z.object({
  clusterId: z.string().min(1, 'Cluster ID is required'),
  solutionTitle: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  assignedDepartments: z.array(z.string()).optional(),
  customDescription: z.string().optional(),
  estimatedBudget: z.number().optional(),
  targetTimeline: z.string().optional(),
});

/**
 * POST /api/solutions/from-cluster
 * Create a solution from clustering intelligence
 */
export async function POST(request: NextRequest) {
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
    const validatedRequest = CreateSolutionFromClusterSchema.parse(body);

    console.log(
      `🎯 Creating solution from cluster ${validatedRequest.clusterId} by ${session.user.name}...`
    );

    // Get the clustering results to find the specific cluster
    const hotspotWithClustering = await (prisma as any).hotspot.findFirst({
      where: {
        clusteringResults: { not: null },
      },
      select: {
        id: true,
        clusteringResults: true,
        signalIds: true,
      },
      orderBy: { lastClusteredAt: 'desc' },
    });

    if (!hotspotWithClustering || !hotspotWithClustering.clusteringResults) {
      return NextResponse.json(
        {
          error: 'No clustering results found',
          suggestion:
            'Generate clustering results first using /api/signals/clustering/generate',
        },
        { status: 404 }
      );
    }

    const clusteringResults = hotspotWithClustering.clusteringResults as any;
    const targetCluster = clusteringResults.finalClusters?.find(
      (cluster: any) => cluster.id === validatedRequest.clusterId
    );

    if (!targetCluster) {
      return NextResponse.json(
        {
          error: `Cluster ${validatedRequest.clusterId} not found in clustering results`,
          availableClusters:
            clusteringResults.finalClusters?.map((c: any) => c.id) || [],
        },
        { status: 404 }
      );
    }

    // Get related signals for the cluster
    const clusterSignalIds = targetCluster.signals?.map((s: any) => s.id) || [];
    const relatedSignals = await (prisma as any).signal.findMany({
      where: {
        id: { in: clusterSignalIds },
      },
      include: {
        department: true,
        team: true,
        createdBy: true,
      },
    });

    // Generate solution data from cluster intelligence
    const solutionData = generateSolutionFromCluster(
      targetCluster,
      relatedSignals,
      validatedRequest
    );

    // Create the solution
    const newSolution = await (prisma as any).solution.create({
      data: {
        title: solutionData.title,
        description: solutionData.description,
        status: 'PLANNING',
        priority: solutionData.priority,
        assignedTo: session.user.id,
        createdBy: session.user.id,
        estimatedBudget: solutionData.estimatedBudget,
        estimatedTimeline: solutionData.estimatedTimeline,
        businessImpact: solutionData.businessImpact,

        // AI-generated metadata
        aiGenerated: true,
        aiConfidence: targetCluster.businessRelevance || 0.8,
        sourceData: {
          clusterId: validatedRequest.clusterId,
          clusterName: targetCluster.name,
          signalCount: targetCluster.signalCount,
          businessRelevance: targetCluster.businessRelevance,
          actionability: targetCluster.actionability,
          urgencyScore: targetCluster.urgencyScore,
          rootCauseBreakdown: targetCluster.rootCauseBreakdown,
          affectedDepartments: targetCluster.affectedDepartments,
          generatedAt: new Date().toISOString(),
        },

        // Connect to related signals
        connectedSignalIds: clusterSignalIds,

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create initial tasks based on cluster recommendations
    const tasks = await createTasksFromCluster(
      newSolution.id,
      targetCluster,
      session.user.id
    );

    // Log solution creation activity
    await logSolutionCreationActivity(
      session.user.id,
      newSolution.id,
      targetCluster
    );

    console.log(
      `✅ Solution created successfully from cluster: ${newSolution.id}`
    );

    return NextResponse.json({
      success: true,
      solution: {
        id: newSolution.id,
        title: newSolution.title,
        description: newSolution.description,
        priority: newSolution.priority,
        status: newSolution.status,
        estimatedBudget: newSolution.estimatedBudget,
        businessImpact: newSolution.businessImpact,
        aiGenerated: true,
        aiConfidence: newSolution.aiConfidence,
      },
      cluster: {
        id: targetCluster.id,
        name: targetCluster.name,
        signalCount: targetCluster.signalCount,
        businessRelevance: targetCluster.businessRelevance,
      },
      tasks: tasks.length,
      relatedSignals: relatedSignals.length,
      redirectUrl: `/solutions/${newSolution.id}`,
      message: `Solution created from ${targetCluster.name} cluster with ${tasks.length} initial tasks`,
    });
  } catch (error: any) {
    console.error('Solution creation from cluster failed:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Solution creation failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Generate solution data from cluster intelligence
 */
function generateSolutionFromCluster(
  cluster: any,
  signals: any[],
  request: any
) {
  // Use custom title or generate from cluster
  const title = request.solutionTitle || `${cluster.name} - Strategic Solution`;

  // Generate comprehensive description
  const description = generateSolutionDescription(cluster, signals);

  // Determine priority based on cluster urgency
  const priority = request.priority || determinePriorityFromCluster(cluster);

  // Estimate budget based on cluster business impact
  const estimatedBudget =
    request.estimatedBudget || estimateBudgetFromCluster(cluster);

  // Generate timeline estimate
  const estimatedTimeline =
    request.targetTimeline || generateTimelineFromCluster(cluster);

  // Calculate business impact
  const businessImpact = calculateBusinessImpact(cluster, signals);

  return {
    title,
    description,
    priority,
    estimatedBudget,
    estimatedTimeline,
    businessImpact,
  };
}

/**
 * Generate comprehensive solution description
 */
function generateSolutionDescription(cluster: any, signals: any[]): string {
  const signalTitles = signals
    .slice(0, 3)
    .map(s => s.title)
    .join(', ');
  const rootCauses =
    cluster.rootCauseBreakdown
      ?.slice(0, 2)
      .map((rc: any) => rc.category)
      .join(' and ') || 'operational issues';
  const departments =
    cluster.affectedDepartments?.slice(0, 2).join(' and ') ||
    'multiple departments';

  return `Strategic solution addressing ${cluster.name.toLowerCase()} identified through AI clustering analysis.

**Problem Analysis:**
This solution targets critical issues including: ${signalTitles}${signals.length > 3 ? ` and ${signals.length - 3} additional related signals` : ''}.

**Root Cause Focus:**
Primary drivers identified as ${rootCauses}, requiring coordinated response across ${departments}.

**AI Intelligence Insights:**
- Business Relevance: ${Math.round((cluster.businessRelevance || 0) * 100)}%
- Actionability Score: ${Math.round((cluster.actionability || 0) * 100)}%
- Urgency Rating: ${Math.round((cluster.urgencyScore || 0) * 100)}%

**Recommended Approach:**
${
  cluster.recommendedActions
    ?.slice(0, 2)
    .map((action: string, i: number) => `${i + 1}. ${action}`)
    .join('\n') ||
  'Comprehensive analysis and systematic resolution of identified issues.'
}

This solution was generated through advanced hybrid clustering analysis combining domain expertise with AI-powered pattern recognition.`;
}

/**
 * Determine priority from cluster data
 */
function determinePriorityFromCluster(cluster: any): string {
  const urgency = cluster.urgencyScore || 0;
  const impact = cluster.businessImpact?.costImpact || 0;

  if (urgency > 0.8 || impact > 50000) return 'CRITICAL';
  if (urgency > 0.6 || impact > 25000) return 'HIGH';
  if (urgency > 0.4 || impact > 10000) return 'MEDIUM';
  return 'LOW';
}

/**
 * Estimate budget from cluster business impact
 */
function estimateBudgetFromCluster(cluster: any): number {
  const costImpact = cluster.businessImpact?.costImpact || 0;
  const signalCount = cluster.signalCount || 1;

  // Base budget on potential cost savings and complexity
  const baseBudget = Math.max(costImpact * 0.2, signalCount * 2000);

  // Cap the budget estimate
  return Math.min(baseBudget, 100000);
}

/**
 * Generate timeline estimate
 */
function generateTimelineFromCluster(cluster: any): string {
  const complexity = cluster.signalCount || 1;
  const urgency = cluster.urgencyScore || 0.5;

  if (urgency > 0.8) return '2-4 weeks';
  if (complexity > 8) return '8-12 weeks';
  if (complexity > 4) return '4-8 weeks';
  return '2-6 weeks';
}

/**
 * Calculate business impact metrics
 */
function calculateBusinessImpact(cluster: any, signals: any[]): any {
  return {
    potentialSavings: cluster.businessImpact?.costImpact || 0,
    timeImpact: cluster.businessImpact?.timelineImpact || 0,
    qualityImprovement: cluster.businessImpact?.qualityRisk || 0,
    customerSatisfaction: cluster.businessImpact?.clientSatisfaction || 0,
    departmentCount: cluster.affectedDepartments?.length || 1,
    signalCount: signals.length,
  };
}

/**
 * Create initial tasks from cluster recommendations
 */
async function createTasksFromCluster(
  solutionId: string,
  cluster: any,
  userId: string
): Promise<any[]> {
  const tasks = [];

  // Create tasks from cluster recommendations
  if (cluster.recommendedActions) {
    for (let i = 0; i < Math.min(cluster.recommendedActions.length, 5); i++) {
      const action = cluster.recommendedActions[i];

      const task = await (prisma as any).task.create({
        data: {
          title: action.length > 50 ? action.substring(0, 50) + '...' : action,
          description: action,
          status: 'TODO',
          priority: i === 0 ? 'HIGH' : 'MEDIUM',
          solutionId: solutionId,
          assignedTo: userId,
          createdBy: userId,
          order: i + 1,
          aiGenerated: true,
          estimatedHours: Math.max(4, Math.min(40, action.length / 5)), // Rough estimate
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      tasks.push(task);
    }
  }

  // Add standard analysis and planning tasks
  const standardTasks = [
    'Stakeholder Analysis and Alignment',
    'Detailed Implementation Planning',
    'Resource Allocation and Budgeting',
    'Risk Assessment and Mitigation',
    'Success Metrics Definition',
  ];

  for (let i = 0; i < 3; i++) {
    const task: any = await (prisma as any).task.create({
      data: {
        title: standardTasks[i],
        description: `Standard solution development task: ${standardTasks[i]}`,
        status: 'TODO',
        priority: 'MEDIUM',
        solutionId: solutionId,
        assignedTo: userId,
        createdBy: userId,
        order: tasks.length + i + 1,
        aiGenerated: false,
        estimatedHours: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    tasks.push(task);
  }

  return tasks;
}

/**
 * Log solution creation activity for audit purposes
 */
async function logSolutionCreationActivity(
  userId: string,
  solutionId: string,
  cluster: any
): Promise<void> {
  try {
    await (prisma as any).aIAnalysisAudit.create({
      data: {
        userId,
        analysisType: 'SOLUTION_CREATION',
        modelVersion: 'cluster_v1',
        confidence: cluster.businessRelevance || 0.8,
        resultJson: {
          solutionId,
          clusterId: cluster.id,
          clusterName: cluster.name,
          signalCount: cluster.signalCount,
          businessRelevance: cluster.businessRelevance,
          actionability: cluster.actionability,
          urgencyScore: cluster.urgencyScore,
        },
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log solution creation activity:', error);
    // Don't fail the main operation for logging errors
  }
}
