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
      const dbInputs = await (prisma as any).signal.findMany({
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
    const aiIdea = await generateObject({
      model: openai('gpt-4-turbo'),
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

    // Create the idea in database
    console.log('💾 Saving idea to database...');
    const createdIdea = await (prisma as any).idea.create({
      data: {
        title: finalIdea.title,
        description: finalIdea.description,
        priority: finalIdea.priority,
        status: 'DRAFT',
        estimatedEffort: finalIdea.estimatedEffort,
        expectedOutcome: finalIdea.expectedOutcome,
        implementationApproach: finalIdea.implementationApproach,
        successMetrics: JSON.stringify(finalIdea.successMetrics),
        riskConsiderations: JSON.stringify(finalIdea.riskConsiderations),
        keyStakeholders: JSON.stringify(finalIdea.keyStakeholders),
        affectedDepartments: JSON.stringify(affectedDepartments),
        relatedCategories: JSON.stringify(relatedCategories),
        sourceInputCount: fullInputs.length,
        createdById: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create relationships to source inputs
    console.log('🔗 Creating input-idea relationships...');
    const inputRelationships = inputIds.map(inputId => ({
      ideaId: createdIdea.id,
      inputId: inputId,
      relationshipType: 'SOURCE',
      createdAt: new Date(),
    }));

    await (prisma as any).ideaInput.createMany({
      data: inputRelationships,
    });

    // Log successful creation
    console.log(`🎉 Idea created successfully: ${createdIdea.id}`);
    console.log(`📊 Linked to ${inputIds.length} source inputs`);

    return NextResponse.json({
      success: true,
      idea: {
        id: createdIdea.id,
        title: createdIdea.title,
        description: createdIdea.description,
        priority: createdIdea.priority,
        status: createdIdea.status,
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
