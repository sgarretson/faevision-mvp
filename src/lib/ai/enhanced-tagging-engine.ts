/**
 * Enhanced AI Tagging Engine - Sprint 1
 * Expert: Dr. Rachel Kim (AI Tagging Specialist)
 * Supporting: Dr. James Park (Semantic Analysis)
 *
 * A&E Domain Classification Model with construction industry expertise
 */

import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import type {
  EnhancedTagging,
  TagGenerationMeta,
  AEDomainClassification,
  RootCause,
  BusinessImpact,
  Urgency,
  CostImpact,
  EntityType,
} from '@/types/enhanced-tagging';

// Zod schemas for AI-generated content validation
const RootCauseSchema = z.enum([
  'PROCESS',
  'RESOURCE',
  'COMMUNICATION',
  'TECHNOLOGY',
  'TRAINING',
  'QUALITY',
  'EXTERNAL',
]);

const BusinessImpactSchema = z.enum([
  'MINIMAL',
  'MODERATE',
  'SIGNIFICANT',
  'SEVERE',
]);
const UrgencySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
const CostImpactSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'UNKNOWN']);

const EntitySchema = z.object({
  type: z.enum([
    'PROJECT',
    'CLIENT',
    'VENDOR',
    'LOCATION',
    'PERSON',
    'DOCUMENT',
    'SYSTEM',
  ]),
  value: z.string(),
  confidence: z.number().min(0).max(1),
  context: z.string().optional(),
  normalized: z.string().optional(),
});

const EnhancedTaggingSchema = z.object({
  rootCause: z.object({
    primary: RootCauseSchema,
    confidence: z.number().min(0).max(1),
    alternatives: z.array(
      z.object({
        cause: RootCauseSchema,
        confidence: z.number().min(0).max(1),
        reasoning: z.string().optional(),
      })
    ),
  }),
  issueType: z.object({
    primary: z.string(),
    confidence: z.number().min(0).max(1),
    hierarchy: z.array(z.string()),
    description: z.string().optional(),
  }),
  businessContext: z.object({
    urgency: UrgencySchema,
    impact: BusinessImpactSchema,
    department: z.string(),
    estimatedCost: CostImpactSchema,
    timeToResolve: z.string().optional(),
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  }),
  extractedEntities: z.array(EntitySchema),
  aeSpecific: z.object({
    projectPhase: z
      .enum(['DESIGN', 'PERMITTING', 'CONSTRUCTION', 'CLOSEOUT', 'WARRANTY'])
      .optional(),
    discipline: z
      .enum([
        'ARCHITECTURE',
        'STRUCTURAL',
        'MEP',
        'CIVIL',
        'LANDSCAPE',
        'INTERIORS',
      ])
      .optional(),
    buildingType: z
      .enum([
        'RESIDENTIAL',
        'COMMERCIAL',
        'INDUSTRIAL',
        'MIXED_USE',
        'INFRASTRUCTURE',
      ])
      .optional(),
    qualityCategory: z
      .enum([
        'DESIGN_ERROR',
        'CONSTRUCTION_DEFECT',
        'CODE_COMPLIANCE',
        'SAFETY',
        'COORDINATION',
      ])
      .optional(),
  }),
  processContext: z.object({
    affectedWorkflows: z.array(z.string()).optional(),
    stakeholders: z.array(z.string()).optional(),
    dependencies: z.array(z.string()).optional(),
    blockers: z.array(z.string()).optional(),
  }),
});

/**
 * A&E Domain Knowledge Base
 * Expert-curated terminology and patterns for construction industry
 */
const AE_DOMAIN_KNOWLEDGE = {
  // Construction industry terminology patterns
  TERMINOLOGY: {
    DESIGN_TERMS: [
      'drawing',
      'plan',
      'elevation',
      'section',
      'detail',
      'specification',
      'schedule',
      'rendering',
    ],
    CONSTRUCTION_TERMS: [
      'concrete',
      'steel',
      'framing',
      'foundation',
      'roofing',
      'electrical',
      'plumbing',
      'hvac',
    ],
    QUALITY_TERMS: [
      'defect',
      'rework',
      'inspection',
      'compliance',
      'code',
      'standard',
      'tolerance',
      'variance',
    ],
    PROJECT_TERMS: [
      'milestone',
      'deliverable',
      'submittal',
      'rfi',
      'change order',
      'schedule',
      'budget',
      'scope',
    ],
    CLIENT_TERMS: [
      'approval',
      'review',
      'feedback',
      'meeting',
      'presentation',
      'walkthrough',
      'punch list',
    ],
  },

  // Common root cause patterns in A&E firms
  ROOT_CAUSE_INDICATORS: {
    PROCESS: [
      'workflow',
      'procedure',
      'coordination',
      'handoff',
      'sequence',
      'timing',
      'scheduling',
    ],
    RESOURCE: [
      'capacity',
      'staffing',
      'workload',
      'overtime',
      'equipment',
      'software',
      'budget',
    ],
    COMMUNICATION: [
      'miscommunication',
      'unclear',
      'missing information',
      'meeting',
      'email',
      'phone call',
    ],
    TECHNOLOGY: [
      'software',
      'hardware',
      'system',
      'crash',
      'bug',
      'performance',
      'compatibility',
    ],
    TRAINING: [
      'knowledge',
      'skill',
      'experience',
      'training',
      'certification',
      'competency',
    ],
    QUALITY: [
      'error',
      'mistake',
      'defect',
      'standard',
      'requirement',
      'specification',
      'compliance',
    ],
    EXTERNAL: [
      'client',
      'vendor',
      'contractor',
      'regulatory',
      'permit',
      'approval',
      'weather',
    ],
  },

  // Department classification patterns
  DEPARTMENT_INDICATORS: {
    Architecture: [
      'design',
      'aesthetic',
      'layout',
      'space planning',
      'zoning',
      'code compliance',
    ],
    Structural: [
      'load',
      'foundation',
      'beam',
      'column',
      'seismic',
      'wind load',
      'structural analysis',
    ],
    MEP: [
      'mechanical',
      'electrical',
      'plumbing',
      'hvac',
      'lighting',
      'power',
      'utilities',
    ],
    Civil: [
      'site',
      'grading',
      'drainage',
      'utilities',
      'traffic',
      'parking',
      'landscaping',
    ],
    'Project Management': [
      'schedule',
      'budget',
      'coordination',
      'meeting',
      'client',
      'deliverable',
    ],
    'Quality Control': [
      'inspection',
      'review',
      'compliance',
      'standard',
      'defect',
      'rework',
    ],
  },
};

/**
 * Enhanced AI Tagging Engine
 */
export class EnhancedTaggingEngine {
  private modelVersion = '1.0.0';

  /**
   * Generate comprehensive tags for a signal using A&E domain expertise
   */
  async generateEnhancedTags(
    title: string,
    description: string,
    existingContext?: {
      department?: string;
      severity?: string;
      [key: string]: any;
    }
  ): Promise<{
    tags: EnhancedTagging;
    metadata: TagGenerationMeta;
    domainClassification: AEDomainClassification;
  }> {
    const startTime = Date.now();

    try {
      // Analyze text complexity and domain terminology
      const textAnalysis = this.analyzeTextComplexity(title, description);

      // Generate enhanced tags using AI with domain context
      const aiResponse = await generateObject({
        model: openai('gpt-4'),
        schema: EnhancedTaggingSchema,
        prompt: this.buildDomainAwarePrompt(
          title,
          description,
          existingContext,
          textAnalysis
        ),
      });

      const processingTime = Date.now() - startTime;

      // Calculate overall confidence based on AI confidence scores
      const overallConfidence = this.calculateOverallConfidence(
        aiResponse.object
      );

      // Generate domain-specific classification
      const domainClassification = await this.generateDomainClassification(
        title,
        description,
        aiResponse.object
      );

      // Create metadata
      const metadata: TagGenerationMeta = {
        generatedAt: new Date().toISOString(),
        modelVersion: this.modelVersion,
        processingTime,
        overallConfidence,
        qualityMetrics: {
          textComplexity: textAnalysis.complexity,
          domainTerminologyCount: textAnalysis.domainTermCount,
          entityExtractionCount: aiResponse.object.extractedEntities.length,
          consistencyScore: 0.8, // Placeholder - would be calculated against existing signals
        },
        flags: {
          requiresHumanReview: overallConfidence < 0.7,
          potentialDuplicate: false, // Would be calculated against existing signals
          highBusinessImpact:
            aiResponse.object.businessContext.impact === 'SIGNIFICANT' ||
            aiResponse.object.businessContext.impact === 'SEVERE',
          missingContext: textAnalysis.complexity < 0.3,
        },
      };

      return {
        tags: aiResponse.object,
        metadata,
        domainClassification,
      };
    } catch (error) {
      console.error('Enhanced tagging generation failed:', error);

      // Fallback to rule-based tagging
      return this.generateFallbackTags(title, description, existingContext);
    }
  }

  /**
   * Build domain-aware prompt for A&E industry context
   */
  private buildDomainAwarePrompt(
    title: string,
    description: string,
    context?: any,
    textAnalysis?: any
  ): string {
    return `
You are an expert AI system specializing in Architecture & Engineering firm operations. 
Analyze the following signal and provide comprehensive, accurate tagging.

SIGNAL TO ANALYZE:
Title: "${title}"
Description: "${description}"
${context ? `Existing Context: ${JSON.stringify(context)}` : ''}

ARCHITECTURE & ENGINEERING DOMAIN EXPERTISE:
You have deep knowledge of:
- Construction industry workflows and processes
- Project management in A&E firms (design, permitting, construction, closeout)
- Quality control and compliance requirements
- Common issues in residential and commercial building projects
- Interdisciplinary coordination (Architecture, Structural, MEP, Civil)
- Client relationship management and communication patterns
- Industry-specific terminology and classification systems

ROOT CAUSE ANALYSIS GUIDELINES:
- PROCESS: Workflow issues, coordination problems, procedural failures
- RESOURCE: Staffing shortages, capacity constraints, equipment/software limitations  
- COMMUNICATION: Information gaps, unclear requirements, client/team miscommunication
- TECHNOLOGY: Software/hardware problems, system integration issues
- TRAINING: Knowledge gaps, skill deficiencies, certification needs
- QUALITY: Design errors, construction defects, compliance violations
- EXTERNAL: Client changes, vendor issues, regulatory requirements, external dependencies

BUSINESS IMPACT ASSESSMENT:
Consider the signal's impact on:
- Project schedule and milestones
- Budget and cost implications  
- Client satisfaction and relationship
- Regulatory compliance and risk
- Team productivity and workflow
- Quality deliverables and standards

ENTITY EXTRACTION FOCUS:
Extract and classify these A&E-specific entities:
- PROJECT: Project names, phases, building types
- CLIENT: Client organizations, decision makers
- VENDOR: Contractors, suppliers, consultants  
- LOCATION: Sites, buildings, specific areas
- PERSON: Team members, contacts, stakeholders
- DOCUMENT: Drawings, specs, reports, submittals
- SYSTEM: Software platforms, equipment, tools

Provide detailed, accurate analysis with high confidence scores for clear classifications 
and lower confidence scores when ambiguous. Include specific reasoning for complex decisions.
`;
  }

  /**
   * Analyze text complexity and domain terminology
   */
  private analyzeTextComplexity(
    title: string,
    description: string
  ): {
    complexity: number;
    domainTermCount: number;
  } {
    const fullText = `${title} ${description}`.toLowerCase();
    const words = fullText.split(/\s+/);

    // Count domain-specific terminology
    let domainTermCount = 0;
    Object.values(AE_DOMAIN_KNOWLEDGE.TERMINOLOGY)
      .flat()
      .forEach(term => {
        if (fullText.includes(term.toLowerCase())) {
          domainTermCount++;
        }
      });

    // Calculate complexity based on length, terminology density, and structure
    const lengthScore = Math.min(words.length / 50, 1); // Normalize to 0-1
    const terminologyDensity = domainTermCount / Math.max(words.length, 1);
    const complexity = (lengthScore + terminologyDensity) / 2;

    return {
      complexity: Math.min(complexity, 1),
      domainTermCount,
    };
  }

  /**
   * Calculate overall confidence from individual tag confidence scores
   */
  private calculateOverallConfidence(tags: EnhancedTagging): number {
    const confidenceScores = [
      tags.rootCause.confidence,
      tags.issueType.confidence,
      ...tags.extractedEntities.map(e => e.confidence),
    ];

    return (
      confidenceScores.reduce((sum, score) => sum + score, 0) /
      confidenceScores.length
    );
  }

  /**
   * Generate A&E domain-specific classification
   */
  private async generateDomainClassification(
    title: string,
    description: string,
    tags: EnhancedTagging
  ): Promise<AEDomainClassification> {
    // Rule-based classification using domain knowledge
    const fullText = `${title} ${description}`.toLowerCase();

    return {
      constructionContext: {
        phase: this.classifyConstructionPhase(fullText),
        trade: this.classifyTrade(fullText) as any,
        system: this.extractBuildingSystem(fullText),
        component: this.extractComponent(fullText),
      },
      projectContext: {
        deliverableType: this.classifyDeliverableType(fullText) as any,
        scheduleImpact: this.assessScheduleImpact(tags),
        budgetImpact: this.assessBudgetImpact(tags),
        qualityImpact: this.assessQualityImpact(tags),
      },
      clientContext: {
        communicationType: this.classifyCommunicationType(fullText) as any,
        clientSatisfactionRisk: this.assessClientRisk(tags),
        relationshipImpact: this.assessRelationshipImpact(tags),
      },
      complianceContext: {
        regulatoryBody: this.identifyRegulatoryBody(fullText) as any,
        complianceRisk: this.assessComplianceRisk(tags),
        codeReferences: this.extractCodeReferences(fullText),
      },
    };
  }

  // Domain classification helper methods
  private classifyConstructionPhase(
    text: string
  ): 'PRECONSTRUCTION' | 'CONSTRUCTION' | 'POSTCONSTRUCTION' | 'OPERATIONS' {
    if (
      text.includes('design') ||
      text.includes('plan') ||
      text.includes('permit')
    )
      return 'PRECONSTRUCTION';
    if (
      text.includes('construction') ||
      text.includes('build') ||
      text.includes('install')
    )
      return 'CONSTRUCTION';
    if (
      text.includes('closeout') ||
      text.includes('warranty') ||
      text.includes('punch list')
    )
      return 'POSTCONSTRUCTION';
    return 'OPERATIONS';
  }

  private classifyTrade(text: string): string | undefined {
    const trades = [
      'GENERAL',
      'ELECTRICAL',
      'PLUMBING',
      'HVAC',
      'STRUCTURAL',
      'FINISHES',
    ];
    for (const trade of trades) {
      if (text.includes(trade.toLowerCase())) return trade;
    }
    return undefined;
  }

  private extractBuildingSystem(text: string): string | undefined {
    const systems = [
      'structural',
      'electrical',
      'plumbing',
      'hvac',
      'fire protection',
      'security',
    ];
    return systems.find(system => text.includes(system));
  }

  private extractComponent(text: string): string | undefined {
    const components = [
      'foundation',
      'beam',
      'column',
      'wall',
      'roof',
      'window',
      'door',
    ];
    return components.find(component => text.includes(component));
  }

  private classifyDeliverableType(text: string): string | undefined {
    const types = [
      'DRAWINGS',
      'SPECIFICATIONS',
      'REPORTS',
      'SUBMITTALS',
      'RFI',
      'CHANGE_ORDER',
    ];
    for (const type of types) {
      if (text.includes(type.toLowerCase().replace('_', ' '))) return type;
    }
    return undefined;
  }

  private assessScheduleImpact(
    tags: EnhancedTagging
  ): 'NONE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL' {
    if (tags.businessContext.urgency === 'CRITICAL') return 'CRITICAL';
    if (tags.businessContext.urgency === 'HIGH') return 'MAJOR';
    if (tags.businessContext.urgency === 'MEDIUM') return 'MODERATE';
    return 'MINOR';
  }

  private assessBudgetImpact(
    tags: EnhancedTagging
  ): 'NONE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL' {
    if (tags.businessContext.estimatedCost === 'HIGH') return 'MAJOR';
    if (tags.businessContext.estimatedCost === 'MEDIUM') return 'MODERATE';
    return 'MINOR';
  }

  private assessQualityImpact(
    tags: EnhancedTagging
  ): 'NONE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL' {
    if (tags.rootCause.primary === 'QUALITY') return 'MAJOR';
    if (tags.businessContext.impact === 'SEVERE') return 'CRITICAL';
    return 'MODERATE';
  }

  private classifyCommunicationType(text: string): string | undefined {
    const types = [
      'ISSUE_REPORT',
      'CHANGE_REQUEST',
      'STATUS_UPDATE',
      'FEEDBACK',
      'COMPLAINT',
    ];
    // Rule-based classification logic would go here
    if (text.includes('issue') || text.includes('problem'))
      return 'ISSUE_REPORT';
    if (text.includes('change') || text.includes('modify'))
      return 'CHANGE_REQUEST';
    return undefined;
  }

  private assessClientRisk(
    tags: EnhancedTagging
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (tags.businessContext.impact === 'SEVERE') return 'CRITICAL';
    if (tags.businessContext.urgency === 'CRITICAL') return 'HIGH';
    return 'MEDIUM';
  }

  private assessRelationshipImpact(
    tags: EnhancedTagging
  ): 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'SEVERELY_NEGATIVE' {
    if (tags.rootCause.primary === 'COMMUNICATION') return 'NEGATIVE';
    if (tags.businessContext.impact === 'SEVERE') return 'SEVERELY_NEGATIVE';
    return 'NEUTRAL';
  }

  private identifyRegulatoryBody(text: string): string | undefined {
    if (text.includes('building code') || text.includes('local'))
      return 'LOCAL';
    if (text.includes('state')) return 'STATE';
    if (text.includes('federal')) return 'FEDERAL';
    return undefined;
  }

  private assessComplianceRisk(
    tags: EnhancedTagging
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (
      tags.rootCause.primary === 'QUALITY' ||
      tags.aeSpecific.qualityCategory === 'CODE_COMPLIANCE'
    ) {
      return 'HIGH';
    }
    return 'LOW';
  }

  private extractCodeReferences(text: string): string[] {
    const references: string[] = [];
    const codePatterns = [
      /IBC \d+/gi, // International Building Code
      /ADA/gi, // Americans with Disabilities Act
      /ASCE \d+/gi, // American Society of Civil Engineers
      /NFPA \d+/gi, // National Fire Protection Association
    ];

    codePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) references.push(...matches);
    });

    return references;
  }

  /**
   * Fallback rule-based tagging when AI fails
   */
  private generateFallbackTags(
    title: string,
    description: string,
    context?: any
  ): Promise<{
    tags: EnhancedTagging;
    metadata: TagGenerationMeta;
    domainClassification: AEDomainClassification;
  }> {
    const fullText = `${title} ${description}`.toLowerCase();

    // Rule-based root cause detection
    let rootCause: RootCause = 'PROCESS'; // Default
    for (const [cause, indicators] of Object.entries(
      AE_DOMAIN_KNOWLEDGE.ROOT_CAUSE_INDICATORS
    )) {
      if (indicators.some(indicator => fullText.includes(indicator))) {
        rootCause = cause as RootCause;
        break;
      }
    }

    // Basic entity extraction
    const entities = [];
    if (fullText.includes('project')) {
      entities.push({
        type: 'PROJECT' as EntityType,
        value: 'Unnamed Project',
        confidence: 0.5,
      });
    }

    const fallbackTags: EnhancedTagging = {
      rootCause: {
        primary: rootCause,
        confidence: 0.6,
        alternatives: [],
      },
      issueType: {
        primary: 'General Issue',
        confidence: 0.5,
        hierarchy: ['GENERAL'],
      },
      businessContext: {
        urgency: 'MEDIUM',
        impact: 'MODERATE',
        department: context?.department || 'Unknown',
        estimatedCost: 'UNKNOWN',
      },
      extractedEntities: entities,
      aeSpecific: {},
      processContext: {},
    };

    const metadata: TagGenerationMeta = {
      generatedAt: new Date().toISOString(),
      modelVersion: `${this.modelVersion}-fallback`,
      processingTime: 50,
      overallConfidence: 0.5,
      qualityMetrics: {
        textComplexity: 0.5,
        domainTerminologyCount: 0,
        entityExtractionCount: entities.length,
        consistencyScore: 0.5,
      },
      flags: {
        requiresHumanReview: true,
        potentialDuplicate: false,
        highBusinessImpact: false,
        missingContext: true,
      },
    };

    return Promise.resolve({
      tags: fallbackTags,
      metadata,
      domainClassification: {} as AEDomainClassification,
    });
  }
}

// Export singleton instance
export const enhancedTaggingEngine = new EnhancedTaggingEngine();
