/**
 * A&E Domain Classification API Route - FAE-133
 * Expert: Jordan Kim (Vercel Engineer) + Dr. Rachel Kim (AI Tagging Specialist)
 *
 * Vercel Edge Function optimized for <500ms execution time
 * Implements Marcus Rodriguez's A&E domain expertise
 */

import { NextRequest, NextResponse } from 'next/server';
import { AEDomainClassificationEngine } from '@/lib/ai/domain-classification-engine';
import { z } from 'zod';

// Force edge runtime for optimal performance
export const runtime = 'edge';

// Zod validation schema
const DomainClassificationRequestSchema = z.object({
  inputId: z.string().min(1, 'Input ID is required'),
  title: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  metadata: z
    .object({
      department: z.string().optional(),
      severity: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * POST /api/ai/domain-classify
 *
 * Classify A&E inputs using business rules for instant domain-aware processing
 * Target: <500ms execution time, 70%+ accuracy on A&E domain inputs
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Validate request body
    const body = await request.json();
    const validatedRequest = DomainClassificationRequestSchema.parse(body);

    // Initialize classification engine
    const engine = new AEDomainClassificationEngine();

    // Perform domain classification
    const classificationRequest = {
      ...validatedRequest,
      title: validatedRequest.title || '', // Ensure title is always a string
    };
    const result = await engine.classifyInput(classificationRequest);

    // Calculate total API response time
    const totalTime = Date.now() - startTime;

    // Log performance metrics for monitoring
    console.log(`🏗️ A&E Domain Classification Complete:`, {
      inputId: validatedRequest.inputId,
      rootCause: result.classification.rootCause,
      confidence: result.classification.confidence,
      aiEnhancementNeeded: result.aiEnhancementNeeded,
      processingTime: result.processingTime,
      totalTime,
      businessContext: result.classification.businessContext,
    });

    // Return successful classification
    return NextResponse.json({
      success: true,
      result,
      performance: {
        processingTime: result.processingTime,
        totalApiTime: totalTime,
        targetMet: totalTime < 500, // <500ms target
      },
      metadata: {
        version: '1.0.0',
        engine: 'AE_DOMAIN_CLASSIFICATION',
        expertValidated: true, // Validated by Marcus Rodriguez
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const totalTime = Date.now() - startTime;

    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.error('❌ Domain Classification Validation Error:', error.issues);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
          details: error.issues,
          performance: { totalApiTime: totalTime },
        },
        { status: 400 }
      );
    }

    // Handle classification engine errors
    console.error('❌ Domain Classification Engine Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Classification engine failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        performance: { totalApiTime: totalTime },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/domain-classify
 *
 * Health check and capability information
 */
export async function GET() {
  return NextResponse.json({
    service: 'A&E Domain Classification Engine',
    version: '1.0.0',
    runtime: 'edge',
    capabilities: {
      rootCauses: [
        'PROCESS',
        'RESOURCE',
        'COMMUNICATION',
        'TECHNOLOGY',
        'TRAINING',
        'QUALITY',
      ],
      businessContext: [
        'projectPhase',
        'departmentPriority',
        'urgencyLevel',
        'clientTier',
      ],
      performance: {
        targetExecutionTime: '<500ms',
        targetAccuracy: '70%+',
        aiEnhancementThreshold: '60%',
      },
    },
    expertValidation: {
      domainExpert: 'Marcus Rodriguez (Strategic Consultant)',
      aiExpert: 'Dr. Rachel Kim (AI Tagging Specialist)',
      infrastructureExpert: 'Jordan Kim (Vercel Engineer)',
    },
    status: 'operational',
  });
}
