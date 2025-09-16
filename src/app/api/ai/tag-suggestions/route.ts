import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';

// ============================================================================
// F1: AI AUTO-TAGGING FOR INPUT CREATION
// ============================================================================
// Expert: AI Architect (Dr. Priya Patel) + Lead Developer (Alex Thompson)
// Purpose: AI-powered auto-tagging and duplicate detection for strategic inputs

const tagSuggestionsSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  userDepartment: z.string().optional(),
  checkDuplicates: z.boolean().default(true),
  confidenceThreshold: z.number().min(0).max(1).default(0.7),
});

const aiTaggingResponseSchema = z.object({
  suggestions: z.object({
    department: z.object({
      value: z.string().describe('Most relevant department for this input'),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .describe('Confidence score for department suggestion'),
      autoAccept: z
        .boolean()
        .describe('Whether to auto-apply this suggestion (>80% confidence)'),
    }),
    issueType: z.object({
      value: z
        .enum([
          'Process Inefficiency',
          'Communication Gap',
          'Resource Constraint',
          'Quality Issue',
          'Timeline Challenge',
          'Client Concern',
          'Technology Problem',
          'Cost Overrun',
          'Regulatory Compliance',
        ])
        .describe('Type of issue or opportunity'),
      confidence: z.number().min(0).max(1),
      autoAccept: z.boolean(),
    }),
    rootCause: z.object({
      value: z
        .enum([
          'Lack of Documentation',
          'Insufficient Training',
          'Tool Limitations',
          'Communication Breakdown',
          'Resource Shortage',
          'Process Gaps',
          'Technology Issues',
          'External Dependencies',
          'Unclear Requirements',
        ])
        .describe('Likely root cause of the issue'),
      confidence: z.number().min(0).max(1),
      autoAccept: z.boolean(),
    }),
    priority: z.object({
      value: z
        .enum(['Critical', 'High', 'Medium', 'Low'])
        .describe('Suggested priority level'),
      confidence: z.number().min(0).max(1),
      autoAccept: z.boolean(),
    }),
    businessImpact: z.object({
      value: z.string().describe('Brief assessment of business impact'),
      confidence: z.number().min(0).max(1),
      autoAccept: z.boolean(),
    }),
    suggestedTags: z.array(z.string()).describe('Additional relevant tags'),
    stakeholders: z
      .array(z.string())
      .describe('Key stakeholders who should be involved'),
  }),
  duplicateCheck: z.object({
    isDuplicate: z.boolean().describe('Whether this appears to be a duplicate'),
    confidence: z
      .number()
      .min(0)
      .max(1)
      .describe('Confidence in duplicate assessment'),
    similarInputs: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          similarity: z.number().min(0).max(100),
          department: z.string().optional(),
          status: z.string(),
        })
      )
      .describe('List of similar existing inputs'),
    recommendation: z
      .string()
      .describe('Recommendation for handling potential duplicates'),
  }),
});

// ============================================================================
// POST /api/ai/tag-suggestions - Generate AI tags and check duplicates
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = tagSuggestionsSchema.parse(body);

    const { title, description, userDepartment, checkDuplicates } =
      validatedData;

    const startTime = Date.now();

    // Prepare context for AI analysis
    const availableDepartments = [
      'Architecture',
      'Engineering',
      'Design',
      'Project Management',
      'Business Development',
      'Operations',
      'Finance',
      'HR',
      'IT',
    ];

    // Get similar inputs for duplicate detection if requested
    let similarInputs: Array<{
      id: string;
      title: string;
      description: string;
      department: string | null;
      status: string;
    }> = [];
    if (checkDuplicates) {
      // Simple similarity search based on title keywords
      const titleWords = title
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 3);
      if (titleWords.length > 0) {
        similarInputs = await (prisma as any).input.findMany({
          where: {
            OR: titleWords.map(word => ({
              OR: [
                { title: { contains: word, mode: 'insensitive' as const } },
                {
                  description: { contains: word, mode: 'insensitive' as const },
                },
              ],
            })),
          },
          select: {
            id: true,
            title: true,
            description: true,
            department: true,
            status: true,
          },
          take: 10, // Limit to prevent overwhelming AI analysis
        });
      }
    }

    const similarInputsContext = similarInputs.map(input => ({
      id: input.id,
      title: input.title,
      description: input.description.substring(0, 200), // Truncate for AI efficiency
      department: input.department,
      status: input.status,
    }));

    const aiPrompt = `
You are an expert AI assistant helping executives categorize strategic business inputs for an Architecture & Engineering firm.

Analyze the following input and provide strategic tagging suggestions:

INPUT TO ANALYZE:
Title: "${title}"
Description: "${description}"
User Department: ${userDepartment || 'Unknown'}

AVAILABLE DEPARTMENTS: ${availableDepartments.join(', ')}

ANALYSIS CONTEXT:
- This is for an A&E firm focusing on residential builders
- Executives need clear categorization for strategic decision-making
- Tags should help identify patterns and enable effective grouping
- Priority should reflect business impact and urgency

${
  checkDuplicates && similarInputsContext.length > 0
    ? `
EXISTING SIMILAR INPUTS:
${JSON.stringify(similarInputsContext, null, 2)}

For duplicate detection:
- Compare content similarity, not just keywords
- Consider if this is truly a duplicate vs. related issue
- Provide clear recommendation for executives
`
    : ''
}

REQUIREMENTS:
1. Suggest the most appropriate department (consider cross-department impact)
2. Classify the issue type based on business impact
3. Identify likely root cause for strategic planning
4. Recommend priority level for executive attention
5. Assess business impact in executive-friendly language
6. ${checkDuplicates ? 'Analyze for potential duplicates and provide executive recommendation' : 'Skip duplicate analysis'}

Focus on strategic value and executive decision-making needs.
    `;

    try {
      const { object: aiResponse } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: aiTaggingResponseSchema,
        prompt: aiPrompt,
        temperature: 0.2, // Lower temperature for consistent categorization
      });

      const processingTime = (Date.now() - startTime) / 1000;

      // Calculate similarity scores for duplicate detection
      const duplicateCheckResults = {
        ...aiResponse.duplicateCheck,
        similarInputs: aiResponse.duplicateCheck.similarInputs
          .map(similar => {
            // Find the actual input to get full details
            const actualInput = similarInputs.find(
              input => input.id === similar.id
            );
            return {
              ...similar,
              description:
                actualInput?.description?.substring(0, 200) ||
                similar.description,
              department: actualInput?.department || similar.department,
              status: actualInput?.status || similar.status,
            };
          })
          .slice(0, 5), // Limit to top 5 most similar
      };

      // Create audit log for AI tagging
      await (prisma as any).auditLog.create({
        data: {
          action: 'AI_AUTO_TAGGING',
          entityType: 'input_suggestion',
          entityId: `suggestion-${Date.now()}`,
          changes: {
            inputTitle: title,
            suggestionsGenerated: true,
            duplicateCheck: checkDuplicates,
            similarInputsFound: duplicateCheckResults.similarInputs.length,
            processingTime,
            departmentSuggested: aiResponse.suggestions.department.value,
            issueTypeSuggested: aiResponse.suggestions.issueType.value,
          },
          userId: session.user.id,
        },
      });

      return NextResponse.json({
        suggestions: aiResponse.suggestions,
        duplicateCheck: duplicateCheckResults,
        processingTime: new Date().toISOString(),
        aiVersion: 'GPT-4o-mini',
        metadata: {
          inputLength: title.length + description.length,
          departmentContext: userDepartment,
          duplicatesChecked: checkDuplicates,
          similarInputsAnalyzed: similarInputsContext.length,
          processingTimeMs: processingTime * 1000,
        },
      });
    } catch (aiError) {
      console.error('AI tagging error:', aiError);

      // Fallback: Simple rule-based tagging
      const fallbackSuggestions = generateFallbackTags(
        title,
        description,
        userDepartment,
        availableDepartments
      );

      const fallbackDuplicateCheck = {
        isDuplicate: similarInputs.length > 0 && checkDuplicates,
        confidence: 0.6,
        similarInputs: similarInputs.slice(0, 3).map(input => ({
          id: input.id,
          title: input.title,
          description: input.description.substring(0, 100),
          similarity: 65, // Fixed similarity for fallback
          department: input.department,
          status: input.status,
        })),
        recommendation:
          similarInputs.length > 0
            ? 'AI analysis unavailable. Please manually review similar inputs before proceeding.'
            : 'No similar inputs found. Safe to proceed with input creation.',
      };

      return NextResponse.json({
        suggestions: fallbackSuggestions,
        duplicateCheck: fallbackDuplicateCheck,
        processingTime: new Date().toISOString(),
        aiVersion: 'Fallback-Rules',
        error:
          'AI service temporarily unavailable - using rule-based suggestions',
        metadata: {
          fallbackMode: true,
          processingTimeMs: Date.now() - startTime,
        },
      });
    }
  } catch (error) {
    console.error('Error in tag suggestions:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate tag suggestions' },
      { status: 500 }
    );
  }
}

// ============================================================================
// FALLBACK TAGGING LOGIC (when AI is unavailable)
// ============================================================================

function generateFallbackTags(
  title: string,
  description: string,
  userDepartment?: string,
  availableDepartments: string[] = []
) {
  const text = (title + ' ' + description).toLowerCase();

  // Simple keyword-based department detection
  const departmentKeywords: Record<string, string[]> = {
    Engineering: [
      'engineer',
      'technical',
      'code',
      'system',
      'architecture',
      'development',
    ],
    Design: ['design', 'ui', 'ux', 'visual', 'interface', 'user experience'],
    'Project Management': [
      'project',
      'timeline',
      'schedule',
      'deadline',
      'milestone',
      'planning',
    ],
    Operations: ['operation', 'process', 'workflow', 'efficiency', 'procedure'],
    IT: ['technology', 'software', 'hardware', 'network', 'database', 'server'],
    HR: ['team', 'employee', 'staff', 'training', 'hiring', 'performance'],
    Finance: ['budget', 'cost', 'financial', 'expense', 'revenue', 'billing'],
    'Business Development': [
      'client',
      'customer',
      'business',
      'sales',
      'growth',
      'market',
    ],
  };

  // Find best department match
  let suggestedDepartment = userDepartment || 'Operations';
  let departmentConfidence = userDepartment ? 0.8 : 0.4;

  for (const [dept, keywords] of Object.entries(departmentKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > 0 && availableDepartments.includes(dept)) {
      suggestedDepartment = dept;
      departmentConfidence = 0.6 + matches * 0.1;
      break;
    }
  }

  // Simple issue type detection
  const issueKeywords = {
    'Process Inefficiency': [
      'slow',
      'inefficient',
      'waste',
      'bottleneck',
      'delay',
    ],
    'Communication Gap': [
      'communication',
      'unclear',
      'confusion',
      'misunderstanding',
    ],
    'Resource Constraint': [
      'resource',
      'shortage',
      'limited',
      'capacity',
      'budget',
    ],
    'Technology Problem': [
      'technology',
      'system',
      'software',
      'hardware',
      'bug',
    ],
    'Quality Issue': ['quality', 'error', 'mistake', 'defect', 'problem'],
  };

  let suggestedIssueType = 'Process Inefficiency';
  let issueConfidence = 0.5;

  for (const [issue, keywords] of Object.entries(issueKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > 0) {
      suggestedIssueType = issue;
      issueConfidence = 0.6 + matches * 0.1;
      break;
    }
  }

  // Simple priority detection
  const urgencyKeywords = [
    'urgent',
    'critical',
    'asap',
    'emergency',
    'important',
  ];
  const priority = urgencyKeywords.some(keyword => text.includes(keyword))
    ? 'High'
    : 'Medium';

  return {
    department: {
      value: suggestedDepartment,
      confidence: Math.min(departmentConfidence, 1.0),
      autoAccept: departmentConfidence > 0.8,
    },
    issueType: {
      value: suggestedIssueType,
      confidence: Math.min(issueConfidence, 1.0),
      autoAccept: issueConfidence > 0.8,
    },
    rootCause: {
      value: 'Process Gaps',
      confidence: 0.5,
      autoAccept: false,
    },
    priority: {
      value: priority,
      confidence: 0.7,
      autoAccept: false,
    },
    businessImpact: {
      value: 'Requires executive review to assess operational impact',
      confidence: 0.6,
      autoAccept: false,
    },
    suggestedTags: ['fallback-analysis'],
    stakeholders: [],
  };
}
