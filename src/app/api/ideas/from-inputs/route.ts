/**
 * API Route: Create Idea from Multiple Inputs
 * Handles bulk idea creation with AI assistance
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Request validation schema
const CreateIdeaFromInputsSchema = z.object({
  inputIds: z.array(z.string()).min(1, 'At least one input ID required'),
  inputs: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
        departmentName: z.string().optional(),
        categoryName: z.string().optional(),
      })
    )
    .optional(),
  userOverrides: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
    })
    .optional(),
});

// AI-generated idea schema
const AIIdeaSchema = z.object({
  title: z.string().describe('Concise, actionable title for the idea'),
  description: z
    .string()
    .describe(
      'Comprehensive description explaining the idea and its business value'
    ),
  priority: z
    .enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
    .describe('Overall priority based on input severities'),
  estimatedEffort: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'])
    .describe('Estimated implementation effort'),
  expectedOutcome: z
    .string()
    .describe('Expected business outcome and benefits'),
  keyStakeholders: z
    .array(z.string())
    .describe('Key stakeholders who should be involved'),
  implementationApproach: z
    .string()
    .describe('High-level approach for implementing this idea'),
  successMetrics: z
    .array(z.string())
    .describe('How success should be measured'),
  riskConsiderations: z
    .array(z.string())
    .describe('Potential risks and mitigation strategies'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Creating idea from selected inputs...');

    // Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const { inputIds, inputs, userOverrides } =
      CreateIdeaFromInputsSchema.parse(body);

    console.log(`📊 Processing ${inputIds.length} inputs for idea creation`);

    // Fetch full input data if not provided
    let fullInputs = inputs || [];
    if (fullInputs.length === 0) {
      console.log('🔍 Fetching input data from database...');
      const dbInputs = await (prisma as any).signals.findMany({
        where: {
          id: {
            in: inputIds,
          },
        },
        include: {
          department: true,
          category: true,
          createdBy: true,
        },
      });

      fullInputs = dbInputs.map((input: any) => ({
        id: input.id,
        title: input.title || 'Untitled Input',
        description: input.description || '',
        severity: input.severity || 'MEDIUM',
        departmentName: input.department?.name || 'Unknown Department',
        categoryName: input.category?.name || 'General',
      }));
    }

    // Generate AI-powered idea
    console.log('🤖 Generating AI-powered idea suggestion...');
    const startTime = Date.now();
    const aiIdea = await generateObject({
      model: openai('gpt-4o-2024-08-06'), // Use gpt-4o which supports structured output
      schema: AIIdeaSchema,
      messages: [
        {
          role: 'system',
          content: `You are an expert business analyst helping executives create actionable ideas from strategic inputs. 
          Create a comprehensive, executive-focused idea that addresses the underlying issues identified in the inputs.
          
          Focus on:
          - Business impact and value creation
          - Practical implementation approaches
          - Clear success metrics
          - Risk mitigation strategies
          - Stakeholder alignment
          
          The idea should be strategic, actionable, and aligned with executive decision-making needs.`,
        },
        {
          role: 'user',
          content: `Create a strategic idea from these ${fullInputs.length} business inputs:

${fullInputs
  .map(
    (input, idx) => `
Input ${idx + 1}:
- Title: ${input.title}
- Description: ${input.description}
- Severity: ${input.severity}
- Department: ${input.departmentName || 'Unknown'}
- Category: ${input.categoryName || 'General'}
`
  )
  .join('\n')}

Consider the commonalities, patterns, and root causes across these inputs to create a comprehensive solution.`,
        },
      ],
    });

    console.log('✅ AI idea generated successfully');

    // Apply user overrides if provided
    const finalIdea = {
      ...aiIdea.object,
      ...userOverrides,
    };

    // Determine affected departments and categories
    const affectedDepartments = Array.from(
      new Set(fullInputs.map(i => i.departmentName).filter(Boolean))
    );
    const relatedCategories = Array.from(
      new Set(fullInputs.map(i => i.categoryName).filter(Boolean))
    );

    // Find or create a hotspot for bulk-created ideas
    console.log('🔍 Finding or creating hotspot for bulk ideas...');
    const BULK_HOTSPOT_ID = 'bulk_ideas_hotspot';

    let bulkHotspot = await (prisma as any).hotspots.findFirst({
      where: { id: BULK_HOTSPOT_ID },
    });

    if (!bulkHotspot) {
      console.log('🏗️ Creating new hotspot for bulk ideas...');
      bulkHotspot = await (prisma as any).hotspots.create({
        data: {
          id: BULK_HOTSPOT_ID,
          title: 'Bulk Created Ideas',
          summary:
            'Ideas created from multiple strategic inputs through bulk selection workflow',
          status: 'OPEN', // Valid HotspotStatus enum value
          confidence: 0.9,
          clusteringMethod: 'BULK_INPUT_SELECTION',
        },
      });
    }

    // Create the idea in database
    console.log('💾 Saving idea to database...');

    // Store all AI-generated data in evidenceJson for now
    const evidenceData = {
      estimatedEffort: finalIdea.estimatedEffort,
      expectedOutcome: finalIdea.expectedOutcome,
      implementationApproach: finalIdea.implementationApproach,
      successMetrics: finalIdea.successMetrics,
      riskConsiderations: finalIdea.riskConsiderations,
      keyStakeholders: finalIdea.keyStakeholders,
      affectedDepartments,
      relatedCategories,
      sourceInputCount: fullInputs.length,
      priority: finalIdea.priority,
      sourceInputIds: inputIds, // Store input relationships
      sourceInputs: fullInputs.map(input => ({
        id: input.id,
        title: input.title,
        severity: input.severity,
        departmentName: input.departmentName,
      })),
    };

    const createdIdea = await (prisma as any).ideas.create({
      data: {
        hotspotId: bulkHotspot.id, // Use existing or newly created hotspot
        title: finalIdea.title,
        description: finalIdea.description,
        origin: 'AI', // AI-generated from multiple inputs
        status: 'draft',
        evidenceJson: evidenceData,
        aiConfidence: 0.85, // AI confidence score
        aiMetadata: {
          model: 'gpt-4',
          processingTime: Date.now() - startTime,
          sourceInputCount: inputIds.length,
          prompt: 'Strategic idea generation from bulk input analysis',
        },
        qualityScore: 0.8, // Business confidence score
        createdById: session.user.id,
      },
    });

    // Note: Input relationships are stored in evidenceJson since no direct schema relationship exists

    // Log successful creation
    console.log(`🎉 Idea created successfully: ${createdIdea.id}`);
    console.log(`📊 Linked to ${inputIds.length} source inputs`);

    return NextResponse.json({
      success: true,
      idea: {
        id: createdIdea.id,
        title: createdIdea.title,
        description: createdIdea.description,
        origin: createdIdea.origin,
        status: createdIdea.status,
        confidence: createdIdea.confidence,
        evidence: evidenceData,
        sourceInputCount: fullInputs.length,
        affectedDepartments,
        relatedCategories,
      },
      aiGenerated: true,
      sourceInputs: fullInputs.length,
      message: `Successfully created idea from ${fullInputs.length} strategic inputs`,
    });
  } catch (error) {
    console.error('❌ Failed to create idea from inputs:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create idea from inputs' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
