import { openai } from '@ai-sdk/openai';
import { generateText, embed } from 'ai';

/**
 * AI Signal Processing Utilities
 *
 * Handles AI enhancement of signals for FAEVision V2:
 * - OpenAI embeddings for clustering
 * - Entity extraction for A&E industry
 * - Auto-tagging with confidence scoring
 *
 * Expert: Dr. Priya Patel (AI Architect)
 * Vercel AI SDK integration for 100% platform compatibility
 */

// ============================================================================
// EMBEDDING GENERATION (For Clustering)
// ============================================================================

/**
 * Generate OpenAI embedding for signal clustering
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-ada-002'),
      value: text,
    });

    return embedding;
  } catch (error) {
    console.error('Embedding generation failed:', error);
    // Return zero vector as fallback
    return new Array(1536).fill(0);
  }
}

// ============================================================================
// ENTITY EXTRACTION (A&E Industry Specific)
// ============================================================================

/**
 * Extract industry-specific entities from signal description
 */
export async function extractEntities(description: string): Promise<any[]> {
  try {
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant specialized in Architecture & Engineering industry entity extraction.
          
Extract relevant entities from the signal description and return them as a JSON array.

Entity types to look for:
- vendors (subcontractors, suppliers, consultants)
- clients (builders, property developers)
- projects (project names, phases, unit numbers)
- locations (addresses, cities, development names)
- trades (framing, electrical, plumbing, HVAC, etc.)
- materials (concrete, steel, lumber, etc.)
- systems (HVAC systems, electrical panels, etc.)
- codes (building codes, accessibility standards)

Return format:
[
  {"type": "vendor", "name": "ABC Framing", "confidence": 0.9},
  {"type": "project", "name": "Meadowbrook Phase 2", "confidence": 0.85},
  {"type": "trade", "name": "electrical", "confidence": 0.95}
]

If no entities found, return empty array []`,
        },
        {
          role: 'user',
          content: `Extract entities from this A&E signal: "${description}"`,
        },
      ],
      temperature: 0.1, // Low temperature for consistent extraction
    });

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Entity extraction JSON parse failed:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Entity extraction failed:', error);
    return [];
  }
}

// ============================================================================
// AI TAGGING (Strategic & Technical)
// ============================================================================

/**
 * Generate AI tags for strategic categorization
 */
export async function generateTags(
  description: string,
  entities: any[]
): Promise<any> {
  try {
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant specialized in Architecture & Engineering signal classification.

Analyze the signal and generate strategic tags for executive decision-making.

Categories to consider:
- Issue Type: design_error, construction_defect, code_violation, coordination_conflict, material_issue, process_gap, client_change, regulatory_change
- Root Cause: design_coordination, subcontractor_performance, material_quality, code_interpretation, process_workflow, communication_gap, resource_constraint
- Impact Area: schedule, cost, quality, safety, client_satisfaction, regulatory_compliance
- Urgency: immediate_action, urgent_review, scheduled_resolution, monitoring_required
- Department: design, engineering, construction, project_management
- Phase: planning, design, permitting, construction, closeout

Return format:
{
  "issue_type": "construction_defect",
  "root_cause": "subcontractor_performance", 
  "impact_area": ["cost", "schedule"],
  "urgency": "urgent_review",
  "department": "construction",
  "phase": "construction",
  "confidence": 0.85,
  "reasoning": "Clear construction quality issue requiring immediate attention"
}

Consider the extracted entities: ${JSON.stringify(entities)}`,
        },
        {
          role: 'user',
          content: `Classify this A&E signal: "${description}"`,
        },
      ],
      temperature: 0.2, // Low temperature for consistent classification
    });

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('AI tagging JSON parse failed:', parseError);
      return { confidence: 0.3, error: 'Parse failed' };
    }
  } catch (error) {
    console.error('AI tagging failed:', error);
    return { confidence: 0.2, error: 'AI processing failed' };
  }
}

// ============================================================================
// SIMILARITY CALCULATION (For Clustering)
// ============================================================================

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

// ============================================================================
// HOTSPOT ANALYSIS (V2 Feature)
// ============================================================================

/**
 * Analyze signals to suggest hotspot groupings
 */
export async function analyzeHotspotPotential(signals: any[]): Promise<any> {
  if (signals.length < 2) {
    return {
      shouldGroup: false,
      confidence: 0,
      reasoning: 'Insufficient signals',
    };
  }

  try {
    const signalDescriptions = signals.map(s => s.description).join('\n---\n');

    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant specialized in identifying patterns in Architecture & Engineering issues.

Analyze these signals to determine if they should be grouped into a "hotspot" for executive attention.

Consider:
- Do they share common root causes?
- Are they affecting the same project/area?
- Do they indicate a systemic issue?
- Would addressing them together be more effective?

Return format:
{
  "should_group": true/false,
  "confidence": 0.85,
  "common_theme": "Subcontractor quality control issues",
  "reasoning": "Multiple quality issues from same subcontractor indicating training gap",
  "suggested_title": "Framing Quality Control Issues - ABC Construction",
  "impact_assessment": "High - affecting multiple units and timeline"
}`,
        },
        {
          role: 'user',
          content: `Analyze these signals for hotspot potential:\n\n${signalDescriptions}`,
        },
      ],
      temperature: 0.3,
    });

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Hotspot analysis JSON parse failed:', parseError);
      return {
        should_group: false,
        confidence: 0.2,
        reasoning: 'Analysis failed',
      };
    }
  } catch (error) {
    console.error('Hotspot analysis failed:', error);
    return {
      should_group: false,
      confidence: 0.1,
      reasoning: 'AI processing failed',
    };
  }
}

// ============================================================================
// SOLUTION SUGGESTIONS (V2 Feature)
// ============================================================================

/**
 * Generate solution suggestions for hotspots
 */
export async function generateSolutionSuggestions(
  hotspotDescription: string,
  signals: any[]
): Promise<any> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4'),
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant specialized in generating actionable solutions for Architecture & Engineering issues.

Based on the hotspot description and related signals, suggest 3 practical solutions that an executive could approve and implement.

For each solution, include:
- Clear title and description
- Expected impact and benefits
- Implementation timeline estimate
- Required resources
- Success metrics

Return format:
{
  "solutions": [
    {
      "title": "Enhanced Subcontractor Training Program",
      "description": "Implement comprehensive quality training for all framing subcontractors",
      "expected_impact": "50% reduction in framing quality issues",
      "timeline": "4 weeks implementation, 2 weeks to see results",
      "resources": ["Quality Manager time", "$5,000 training budget"],
      "success_metrics": ["Reduced rework hours", "Improved inspection pass rate"],
      "confidence": 0.85
    }
  ],
  "overall_confidence": 0.8
}`,
        },
        {
          role: 'user',
          content: `Generate solutions for this hotspot: "${hotspotDescription}"\n\nRelated signals: ${JSON.stringify(signals.map(s => ({ title: s.title, description: s.description })))}`,
        },
      ],
      temperature: 0.4,
    });

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Solution suggestions JSON parse failed:', parseError);
      return { solutions: [], overall_confidence: 0.2 };
    }
  } catch (error) {
    console.error('Solution generation failed:', error);
    return { solutions: [], overall_confidence: 0.1 };
  }
}
