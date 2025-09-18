import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

/**
 * AI-Powered Solution Creation from Ideas
 *
 * Converts approved ideas into comprehensive solutions with AI assistance for:
 * - Business impact assessment and ROI analysis
 * - Risk assessment and mitigation strategies
 * - Resource allocation and timeline estimation
 * - Task breakdown and implementation planning
 *
 * Expert: Dr. Priya Patel (AI Architect)
 * Support: Jordan Lee (Cursor Expert), Alex Thompson (Lead Developer)
 */

const solutionPlanningSchema = z.object({
  solution: z.object({
    title: z.string(),
    description: z.string(),
    businessValue: z.string(),
    estimatedEffort: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    targetDate: z.string().optional(),
  }),
  businessImpact: z.object({
    expectedOutcome: z.string(),
    roiProjection: z.string(),
    successMetrics: z.array(z.string()),
    businessValue: z.string(),
    stakeholderImpact: z.array(z.string()),
  }),
  riskAssessment: z.object({
    identifiedRisks: z.array(z.string()),
    mitigationStrategies: z.array(z.string()),
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    contingencyPlans: z.array(z.string()),
  }),
  resourcePlanning: z.object({
    requiredSkills: z.array(z.string()),
    estimatedTeamSize: z.string(),
    budgetEstimate: z.string(),
    timelineEstimate: z.string(),
    dependencies: z.array(z.string()),
  }),
  implementationPlan: z.object({
    phases: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        duration: z.string(),
        deliverables: z.array(z.string()),
        dependencies: z.array(z.string()),
      })
    ),
    tasks: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
        estimatedHours: z.number(),
        assignedRole: z.string(),
        dependencies: z.array(z.string()),
      })
    ),
    milestones: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        targetDate: z.string(),
        criteria: z.array(z.string()),
      })
    ),
  }),
  executiveRecommendations: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ideaId, customRequirements } = body;

    if (!ideaId) {
      return NextResponse.json(
        { success: false, error: 'Idea ID is required' },
        { status: 400 }
      );
    }

    // Fetch the idea with full context
    const idea = await (prisma as any).ideas.findUnique({
      where: { id: ideaId },
      include: {
        hotspot: {
          include: {
            signals: {
              include: {
                signal: {
                  include: {
                    department: true,
                    team: true,
                  },
                },
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
      },
    });

    if (!idea) {
      return NextResponse.json(
        { success: false, error: 'Idea not found' },
        { status: 404 }
      );
    }

    // Only approved ideas can be converted to solutions
    if (idea.status !== 'approved') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only approved ideas can be converted to solutions',
        },
        { status: 400 }
      );
    }

    // Get organizational context for better planning
    const [departments, teams, recentSolutions] = await Promise.all([
      (prisma as any).departments.findMany({
        select: { id: true, name: true },
      }),
      (prisma as any).teams.findMany({
        select: { id: true, name: true, department: true },
      }),
      (prisma as any).solutions.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          title: true,
          description: true,
          estimatedEffort: true,
          businessValue: true,
          status: true,
        },
      }),
    ]);

    // Generate AI-powered solution plan
    const startTime = Date.now();
    const result = await generateObject({
      model: openai('gpt-4o-2024-08-06'),
      temperature: 0.3,
      schema: solutionPlanningSchema,
      prompt: `
You are an AI business consultant helping executives convert strategic ideas into comprehensive, actionable solutions. 

IDEA TO CONVERT:
Title: "${idea.title}"
Description: "${idea.description}"
Origin: ${idea.origin}
Evidence: ${JSON.stringify(idea.evidenceJson || {}, null, 2)}
Tags: ${JSON.stringify(idea.tagsJson || [], null, 2)}

ORGANIZATIONAL CONTEXT:
Departments: ${departments.map((d: any) => d.name).join(', ')}
Teams: ${teams.map((t: any) => `${t.name} (${t.department?.name || 'Unknown'})`).join(', ')}

RELATED SIGNALS:
${idea.hotspot?.signals?.map((hs: any) => `- ${hs.signal?.title}: ${hs.signal?.description?.substring(0, 100)}...`).join('\n') || 'No related signals'}

RECENT SOLUTIONS (for context):
${recentSolutions.map((s: any) => `- ${s.title}: ${s.description?.substring(0, 80)}... (${s.estimatedEffort} effort, ${s.businessValue} value)`).join('\n')}

CUSTOM REQUIREMENTS:
${customRequirements || 'None specified'}

Please create a comprehensive solution plan that includes:

1. SOLUTION OVERVIEW:
   - Clear, actionable title and description
   - Business value proposition and estimated effort
   - Priority level and target completion date

2. BUSINESS IMPACT ANALYSIS:
   - Expected outcomes and ROI projections
   - Success metrics and measurement criteria
   - Stakeholder impact assessment
   - Business value quantification

3. RISK ASSESSMENT:
   - Identified risks and their likelihood/impact
   - Mitigation strategies for each risk
   - Overall risk level assessment
   - Contingency planning recommendations

4. RESOURCE PLANNING:
   - Required skills and team composition
   - Budget estimates and resource allocation
   - Timeline estimation with dependencies
   - External resource requirements

5. IMPLEMENTATION PLAN:
   - Phased approach with clear deliverables
   - Detailed task breakdown with effort estimates
   - Milestones and success criteria
   - Dependencies and critical path analysis

6. EXECUTIVE RECOMMENDATIONS:
   - Key decisions needed from leadership
   - Success factors and potential obstacles
   - Resource approval requirements
   - Strategic alignment considerations

Focus on:
- Executive-level strategic thinking
- Practical implementation guidance
- Risk-aware planning
- Measurable outcomes
- Resource optimization
- Stakeholder consideration

Provide confidence score (0.0-1.0) based on available information quality.
`,
    });

    const solutionPlan = result.object;

    // Create the solution with AI-generated planning
    const solution = await (prisma as any).solutions.create({
      data: {
        title: solutionPlan.solution.title,
        description: solutionPlan.solution.description,
        status: 'DRAFT',
        origin: 'AI', // AI-generated solution
        aiConfidence: 0.85,
        aiMetadata: {
          model: 'gpt-4',
          prompt: 'AI-powered solution planning from idea',
          processingTime: Date.now() - startTime,
          ideaOrigin: idea.origin,
        },
        qualityScore: 0.8,
        progress: 0.0,
        hotspotId: idea.hotspotId,
        ideaId: idea.id,
        estimatedEffort: solutionPlan.solution.estimatedEffort,
        businessValue: solutionPlan.solution.businessValue,
        targetDate: solutionPlan.solution.targetDate
          ? new Date(solutionPlan.solution.targetDate)
          : null,
        successMetrics: solutionPlan.businessImpact.successMetrics,
        expectedImpactJson: {
          businessImpact: solutionPlan.businessImpact,
          riskAssessment: solutionPlan.riskAssessment,
          resourcePlanning: solutionPlan.resourcePlanning,
          implementationPlan: solutionPlan.implementationPlan,
          executiveRecommendations: solutionPlan.executiveRecommendations,
          aiConfidence: solutionPlan.confidence,
          generatedAt: new Date().toISOString(),
        },
        createdBy: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        hotspot: {
          select: {
            id: true,
            title: true,
            summary: true,
            confidence: true,
          },
        },
        idea: {
          select: {
            id: true,
            title: true,
            origin: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      solution,
      aiPlan: solutionPlan,
      message: 'AI-powered solution created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating AI-powered solution:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create AI-powered solution',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
