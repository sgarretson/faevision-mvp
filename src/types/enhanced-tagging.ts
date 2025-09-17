/**
 * Enhanced AI Tagging System - Sprint 1
 * Expert: Dr. Rachel Kim (AI Tagging Specialist)
 *
 * Comprehensive tagging structure to fix clustering algorithm
 * by providing consistent, domain-aware classification
 */

// Core root cause categories for A&E firms
export type RootCause =
  | 'PROCESS' // Workflow, procedure, coordination issues
  | 'RESOURCE' // Capacity, staffing, equipment limitations
  | 'COMMUNICATION' // Information flow, client interaction problems
  | 'TECHNOLOGY' // Software, hardware, infrastructure issues
  | 'TRAINING' // Skills, knowledge, competency gaps
  | 'QUALITY' // QC, standards, compliance issues
  | 'EXTERNAL'; // Client, vendor, regulatory factors

// Business impact levels for executive prioritization
export type BusinessImpact =
  | 'MINIMAL' // Minor inconvenience, easily worked around
  | 'MODERATE' // Noticeable impact, some workarounds available
  | 'SIGNIFICANT' // Major impact, limited workarounds
  | 'SEVERE'; // Critical impact, no viable workarounds

// Urgency levels for timeline assessment
export type Urgency =
  | 'LOW' // Can be addressed in normal planning cycle
  | 'MEDIUM' // Should be addressed within current sprint
  | 'HIGH' // Needs attention within days
  | 'CRITICAL'; // Immediate attention required

// Cost impact estimation for budget planning
export type CostImpact =
  | 'LOW' // < $5,000 estimated resolution cost
  | 'MEDIUM' // $5,000 - $25,000 estimated cost
  | 'HIGH' // $25,000+ estimated cost
  | 'UNKNOWN'; // Cannot estimate without further analysis

// Entity types extracted from signal content
export type EntityType =
  | 'PROJECT' // Project names, codes, phases
  | 'CLIENT' // Client names, organizations
  | 'VENDOR' // Vendor names, suppliers, contractors
  | 'LOCATION' // Sites, buildings, addresses
  | 'PERSON' // Staff names, contacts
  | 'DOCUMENT' // Plans, specs, reports
  | 'SYSTEM'; // Software, platforms, tools

/**
 * Primary Enhanced Tagging Structure
 * Stored in Signal.enhancedTagsJson field
 */
export interface EnhancedTagging {
  // Root Cause Analysis with Confidence
  rootCause: {
    primary: RootCause;
    confidence: number; // 0.0-1.0 confidence score
    alternatives: Array<{
      cause: RootCause;
      confidence: number;
      reasoning?: string; // Why this alternative was considered
    }>;
  };

  // Issue Type Classification with Hierarchy
  issueType: {
    primary: string; // Main issue category
    confidence: number; // 0.0-1.0 confidence score
    hierarchy: string[]; // e.g., ['TECHNICAL', 'STRUCTURAL', 'FOUNDATION']
    description?: string; // Human-readable description
  };

  // Business Context Assessment
  businessContext: {
    urgency: Urgency;
    impact: BusinessImpact;
    department: string; // Primary affected department
    estimatedCost: CostImpact;
    timeToResolve?: string; // Estimated resolution timeline
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };

  // Automatically Extracted Entities
  extractedEntities: Array<{
    type: EntityType;
    value: string; // Entity value/name
    confidence: number; // 0.0-1.0 extraction confidence
    context?: string; // Where in text this was found
    normalized?: string; // Standardized form of entity
  }>;

  // A&E Domain-Specific Classifications
  aeSpecific: {
    projectPhase?:
      | 'DESIGN'
      | 'PERMITTING'
      | 'CONSTRUCTION'
      | 'CLOSEOUT'
      | 'WARRANTY';
    discipline?:
      | 'ARCHITECTURE'
      | 'STRUCTURAL'
      | 'MEP'
      | 'CIVIL'
      | 'LANDSCAPE'
      | 'INTERIORS';
    buildingType?:
      | 'RESIDENTIAL'
      | 'COMMERCIAL'
      | 'INDUSTRIAL'
      | 'MIXED_USE'
      | 'INFRASTRUCTURE';
    qualityCategory?:
      | 'DESIGN_ERROR'
      | 'CONSTRUCTION_DEFECT'
      | 'CODE_COMPLIANCE'
      | 'SAFETY'
      | 'COORDINATION';
  };

  // Workflow and Process Context
  processContext: {
    affectedWorkflows?: string[]; // Which business processes are impacted
    stakeholders?: string[]; // Who needs to be involved in resolution
    dependencies?: string[]; // What other items depend on this
    blockers?: string[]; // What is blocking resolution
  };
}

/**
 * Tag Generation Metadata
 * Stored in Signal.tagGenerationMeta field
 */
export interface TagGenerationMeta {
  generatedAt: string; // ISO timestamp of generation
  modelVersion: string; // AI model version used
  processingTime: number; // Time taken in milliseconds
  overallConfidence: number; // 0.0-1.0 overall confidence

  // Quality Metrics
  qualityMetrics: {
    textComplexity: number; // 0.0-1.0 how complex the input text was
    domainTerminologyCount: number; // Number of A&E specific terms found
    entityExtractionCount: number; // Number of entities successfully extracted
    consistencyScore: number; // 0.0-1.0 consistency with similar signals
  };

  // Processing Flags
  flags: {
    requiresHumanReview: boolean; // Low confidence, needs expert review
    potentialDuplicate: boolean; // Similar to existing signals
    highBusinessImpact: boolean; // Flagged as high impact
    missingContext: boolean; // Insufficient information for full classification
  };

  // Expert Feedback Integration
  expertFeedback?: {
    reviewedBy?: string; // Expert who reviewed
    reviewedAt?: string; // ISO timestamp of review
    corrections?: Record<string, any>; // Corrections made by expert
    approved?: boolean; // Expert approval status
  };
}

/**
 * A&E Domain Classification
 * Stored in Signal.domainClassification field
 */
export interface AEDomainClassification {
  // Construction Industry Context
  constructionContext: {
    phase:
      | 'PRECONSTRUCTION'
      | 'CONSTRUCTION'
      | 'POSTCONSTRUCTION'
      | 'OPERATIONS';
    trade?:
      | 'GENERAL'
      | 'ELECTRICAL'
      | 'PLUMBING'
      | 'HVAC'
      | 'STRUCTURAL'
      | 'FINISHES';
    system?: string; // Specific building system affected
    component?: string; // Specific component/element
  };

  // Project Management Context
  projectContext: {
    deliverableType?:
      | 'DRAWINGS'
      | 'SPECIFICATIONS'
      | 'REPORTS'
      | 'SUBMITTALS'
      | 'RFI'
      | 'CHANGE_ORDER';
    scheduleImpact?: 'NONE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
    budgetImpact?: 'NONE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
    qualityImpact?: 'NONE' | 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
  };

  // Client Interaction Context
  clientContext: {
    communicationType?:
      | 'ISSUE_REPORT'
      | 'CHANGE_REQUEST'
      | 'STATUS_UPDATE'
      | 'FEEDBACK'
      | 'COMPLAINT';
    clientSatisfactionRisk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    relationshipImpact?:
      | 'POSITIVE'
      | 'NEUTRAL'
      | 'NEGATIVE'
      | 'SEVERELY_NEGATIVE';
  };

  // Regulatory and Compliance Context
  complianceContext: {
    regulatoryBody?:
      | 'LOCAL'
      | 'STATE'
      | 'FEDERAL'
      | 'INDUSTRY'
      | 'CLIENT_SPECIFIC';
    complianceRisk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    codeReferences?: string[]; // Building codes, standards referenced
  };
}

/**
 * Validation schema for enhanced tagging
 */
export const validateEnhancedTagging = (tags: any): tags is EnhancedTagging => {
  return (
    tags &&
    typeof tags === 'object' &&
    tags.rootCause &&
    tags.issueType &&
    tags.businessContext &&
    Array.isArray(tags.extractedEntities)
  );
};

/**
 * Default enhanced tagging structure for new signals
 */
export const getDefaultEnhancedTagging = (): Partial<EnhancedTagging> => ({
  rootCause: {
    primary: 'PROCESS',
    confidence: 0.0,
    alternatives: [],
  },
  issueType: {
    primary: 'General Issue',
    confidence: 0.0,
    hierarchy: [],
  },
  businessContext: {
    urgency: 'MEDIUM',
    impact: 'MODERATE',
    department: 'Unknown',
    estimatedCost: 'UNKNOWN',
  },
  extractedEntities: [],
  aeSpecific: {},
  processContext: {},
});

/**
 * Constants for A&E domain-specific classification
 */
export const AE_DOMAIN_CONSTANTS = {
  PROJECT_PHASES: [
    'DESIGN',
    'PERMITTING',
    'CONSTRUCTION',
    'CLOSEOUT',
    'WARRANTY',
  ] as const,
  DISCIPLINES: [
    'ARCHITECTURE',
    'STRUCTURAL',
    'MEP',
    'CIVIL',
    'LANDSCAPE',
    'INTERIORS',
  ] as const,
  BUILDING_TYPES: [
    'RESIDENTIAL',
    'COMMERCIAL',
    'INDUSTRIAL',
    'MIXED_USE',
    'INFRASTRUCTURE',
  ] as const,
  QUALITY_CATEGORIES: [
    'DESIGN_ERROR',
    'CONSTRUCTION_DEFECT',
    'CODE_COMPLIANCE',
    'SAFETY',
    'COORDINATION',
  ] as const,
} as const;
