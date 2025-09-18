import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

/**
 * AI Suggestions API for Manual Idea Creation
 *
 * Provides real-time AI enhancement suggestions during manual idea creation.
 * Includes tagging, categorization, similar ideas, and enhancement recommendations.
 *
 * Expert: Dr. Priya Patel (AI Architect)
 * Support: Jordan Lee (Cursor Expert)
 */

const aiSuggestionsSchema = z.object({
  suggestions: z.array(
    z.object({
      type: z.enum(['tag', 'category', 'similar', 'enhancement']),
      content: z.string(),
      confidence: z.number().min(0).max(1),
      reasoning: z.string().optional(),
    })
  ),
  overallAssessment: z.string(),
  strategicRecommendations: z.array(z.string()),
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

    // Only executives can create manual ideas
    if (session.user.role !== 'EXECUTIVE' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only executives can create manual ideas' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, type } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Get existing ideas for similarity analysis
    const existingIdeas = await (prisma as any).ideas.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        origin: true,
      },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    // Get existing strategic inputs for context
    const existingInputs = await (prisma as any).inputs.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        department: true,
        issueType: true,
        rootCause: true,
      },
      take: 30,
      orderBy: { createdAt: 'desc' },
    });

    // Generate AI suggestions
    const result = await generateObject({
      model: openai('gpt-4o-2024-08-06'),
      temperature: 0.3,
      schema: aiSuggestionsSchema,
      prompt: `
You are an AI assistant helping executives create strategic ideas for their organization. 
Analyze the following idea and provide enhancement suggestions.

IDEA TO ANALYZE:
Title: "${title}"
Description: "${description}"
Creation Type: ${type}

CONTEXT - EXISTING IDEAS:
${existingIdeas.map((idea: any) => `- ${idea.title}: ${idea.description.substring(0, 100)}...`).join('\n')}

CONTEXT - EXISTING STRATEGIC INPUTS:
${existingInputs.map((input: any) => `- [${input.department}] ${input.title}: ${input.description.substring(0, 80)}...`).join('\n')}

Please provide:

1. TAGS: Suggest relevant strategic tags for categorization
2. CATEGORY: Suggest the most appropriate business category
3. SIMILAR: Identify any similar existing ideas or inputs (if any)
4. ENHANCEMENT: Suggest improvements to make the idea more strategic and actionable

For each suggestion, provide:
- Type: tag, category, similar, or enhancement
- Content: The actual suggestion
- Confidence: 0.0 to 1.0 confidence score
- Reasoning: Brief explanation of why this suggestion is valuable

Focus on:
- Strategic alignment and business value
- Actionability and clarity
- Stakeholder impact
- Implementation feasibility
- Risk mitigation

Provide an overall assessment and strategic recommendations.
`,
    });

    return NextResponse.json({
      success: true,
      suggestions: result.object.suggestions,
      overallAssessment: result.object.overallAssessment,
      strategicRecommendations: result.object.strategicRecommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating AI suggestions:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate AI suggestions',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
