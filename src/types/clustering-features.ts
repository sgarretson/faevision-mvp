/**
 * Clustering Features Types - Sprint 2 Task 1
 * Expert: Dr. Elena Rodriguez (Advanced Clustering Specialist)
 * Supporting: Dr. James Park (Semantic Analysis), Dr. Rachel Kim (AI Tagging)
 *
 * Multi-dimensional feature engineering for hybrid clustering algorithm
 */

import type { EnhancedTagging } from './enhanced-tagging';

// Root cause categories for one-hot encoding
export type RootCauseCategory =
  | 'PROCESS' // Workflow, coordination, procedural issues
  | 'RESOURCE' // Capacity, staffing, equipment limitations
  | 'COMMUNICATION' // Information flow, client interaction problems
  | 'TECHNOLOGY' // Software, hardware, infrastructure issues
  | 'TRAINING' // Skills gaps, competency needs
  | 'QUALITY' // QC issues, code compliance, standards
  | 'EXTERNAL'; // Client, vendor, regulatory factors

// Department categories for involvement mapping
export type DepartmentCategory =
  | 'ARCHITECTURE'
  | 'FIELD_SERVICES'
  | 'PROJECT_MANAGEMENT'
  | 'EXECUTIVE'
  | 'OTHER';

// A&E project phases
export type ProjectPhase =
  | 'DESIGN'
  | 'PERMITTING'
  | 'CONSTRUCTION'
  | 'CLOSEOUT'
  | 'WARRANTY'
  | 'OPERATIONS';

// Building types for construction context
export type BuildingType =
  | 'RESIDENTIAL'
  | 'COMMERCIAL'
  | 'INDUSTRIAL'
  | 'MIXED_USE'
  | 'INFRASTRUCTURE';

/**
 * Domain Features - Business expertise (60% weight)
 * Captures A&E industry knowledge and business context
 */
export interface DomainFeatures {
  // Root Cause One-Hot Encoding (7 dimensions)
  rootCauseVector: number[]; // [PROCESS, RESOURCE, COMMUNICATION, TECHNOLOGY, TRAINING, QUALITY, EXTERNAL]
  rootCauseConfidence: number; // Confidence score from enhanced tagging

  // Department Involvement (5 dimensions)
  departmentVector: number[]; // [Architecture, Field Services, Project Management, Executive, Other]
  departmentComplexity: number; // Cross-department coordination complexity (0-1)

  // Business Impact Scoring (4 dimensions)
  businessImpactVector: number[]; // [Severity, Urgency, Cost, Client Impact] normalized 0-1
  overallImpactScore: number; // Weighted composite impact score

  // A&E Domain Context (6 dimensions)
  aeDomainVector: number[]; // [Project Phase, Building Type, Quality Category, Compliance Risk, Schedule Impact, Budget Impact]
  domainRelevance: number; // How relevant to A&E industry (0-1)

  // Temporal and Context Features
  timelineUrgency: number; // Timeline pressure factor (0-1)
  stakeholderCount: number; // Number of stakeholders involved (normalized)
  processComplexity: number; // Workflow complexity assessment (0-1)
}

/**
 * Semantic Features - AI-powered analysis (40% weight)
 * Captures semantic meaning and contextual understanding
 */
export interface SemanticFeatures {
  // Text Embeddings (768 dimensions each)
  titleEmbedding: number[]; // Semantic representation of signal title
  descriptionEmbedding: number[]; // Semantic representation of description

  // Business Context Embeddings (384 dimensions)
  businessContextVector: number[]; // Extracted entities, stakeholders, processes

  // A&E Terminology Embeddings (256 dimensions)
  domainTerminologyVector: number[]; // Construction industry specific terms

  // Semantic Metrics
  textComplexity: number; // Complexity of the signal content (0-1)
  domainTerminologyDensity: number; // Density of A&E specific terms (0-1)
  semanticClarity: number; // How clear/well-structured the content is (0-1)

  // Entity Embeddings
  entityEmbeddings: Array<{
    type: string; // Entity type (PROJECT, CLIENT, etc.)
    embedding: number[]; // Entity-specific embedding
    importance: number; // Importance to clustering (0-1)
  }>;
}

/**
 * Unified Clustering Features
 * Combines domain expertise with semantic analysis
 */
export interface ClusteringFeatures {
  // Signal identification
  signalId: string;

  // Feature components
  domainFeatures: DomainFeatures; // 22+ dimensions, 60% weight
  semanticFeatures: SemanticFeatures; // ~1400+ dimensions, 40% weight

  // Combined feature vector
  combinedVector: number[]; // Weighted combination of all features

  // Metadata
  featureVersion: string; // Feature engineering version
  generatedAt: Date; // When features were generated
  confidence: number; // Overall feature quality confidence (0-1)

  // Performance metrics
  generationTime: number; // Time taken to generate features (ms)
  qualityScore: number; // Feature quality assessment (0-1)

  // Precomputed similarities (for performance optimization)
  precomputedSimilarities?: Map<string, number>;

  // Source data reference
  sourceTagging: EnhancedTagging; // Enhanced tagging that generated these features
}

/**
 * Feature Engineering Configuration
 */
export interface FeatureEngineeringConfig {
  // Weighting configuration
  domainWeight: number; // Default: 0.6
  semanticWeight: number; // Default: 0.4

  // Domain feature weights
  rootCauseWeight: number; // Default: 0.3
  departmentWeight: number; // Default: 0.2
  businessImpactWeight: number; // Default: 0.3
  aeDomainWeight: number; // Default: 0.2

  // Semantic feature weights
  titleWeight: number; // Default: 0.5
  descriptionWeight: number; // Default: 0.4
  businessContextWeight: number; // Default: 0.1

  // Performance settings
  enablePrecomputation: boolean; // Precompute similarity matrices
  cacheSimilarities: boolean; // Cache similarity calculations
  maxCacheSize: number; // Maximum cached similarities

  // Quality thresholds
  minConfidenceThreshold: number; // Minimum confidence for feature quality
  qualityScoreThreshold: number; // Minimum quality score threshold
}

/**
 * Feature Engineering Result
 */
export interface FeatureEngineeringResult {
  features: ClusteringFeatures;
  success: boolean;
  error?: string;
  warnings: string[];
  qualityMetrics: {
    domainFeatureQuality: number;
    semanticFeatureQuality: number;
    overallQuality: number;
    consistencyScore: number;
  };
}

/**
 * Batch Feature Engineering Result
 */
export interface BatchFeatureEngineeringResult {
  processedCount: number;
  successCount: number;
  errorCount: number;
  features: ClusteringFeatures[];
  processingTime: number;
  averageQuality: number;
  qualityDistribution: Record<string, number>;
  errors: Array<{
    signalId: string;
    error: string;
  }>;
}

/**
 * Feature Similarity Calculation
 */
export interface FeatureSimilarity {
  signalId1: string;
  signalId2: string;
  domainSimilarity: number; // Similarity based on domain features
  semanticSimilarity: number; // Similarity based on semantic features
  combinedSimilarity: number; // Weighted combined similarity
  confidence: number; // Confidence in similarity calculation
  calculatedAt: Date;
}

/**
 * Constants for feature engineering
 */
export const FEATURE_ENGINEERING_CONSTANTS = {
  // Vector dimensions
  ROOT_CAUSE_DIMENSIONS: 7,
  DEPARTMENT_DIMENSIONS: 5,
  BUSINESS_IMPACT_DIMENSIONS: 4,
  AE_DOMAIN_DIMENSIONS: 6,

  // Embedding dimensions
  TITLE_EMBEDDING_DIMENSIONS: 768,
  DESCRIPTION_EMBEDDING_DIMENSIONS: 768,
  BUSINESS_CONTEXT_DIMENSIONS: 384,
  DOMAIN_TERMINOLOGY_DIMENSIONS: 256,

  // Default weights
  DEFAULT_DOMAIN_WEIGHT: 0.6,
  DEFAULT_SEMANTIC_WEIGHT: 0.4,

  // Quality thresholds
  MIN_FEATURE_QUALITY: 0.7,
  MIN_CONFIDENCE_THRESHOLD: 0.6,

  // Performance targets
  MAX_FEATURE_GENERATION_TIME: 100, // milliseconds
  TARGET_SIMILARITY_CALCULATION_TIME: 10, // milliseconds
} as const;

/**
 * Default feature engineering configuration
 */
export const DEFAULT_FEATURE_CONFIG: FeatureEngineeringConfig = {
  domainWeight: 0.6,
  semanticWeight: 0.4,
  rootCauseWeight: 0.3,
  departmentWeight: 0.2,
  businessImpactWeight: 0.3,
  aeDomainWeight: 0.2,
  titleWeight: 0.5,
  descriptionWeight: 0.4,
  businessContextWeight: 0.1,
  enablePrecomputation: true,
  cacheSimilarities: true,
  maxCacheSize: 10000,
  minConfidenceThreshold: 0.6,
  qualityScoreThreshold: 0.7,
};

/**
 * Root cause mapping for one-hot encoding
 */
export const ROOT_CAUSE_MAPPING: Record<RootCauseCategory, number> = {
  PROCESS: 0,
  RESOURCE: 1,
  COMMUNICATION: 2,
  TECHNOLOGY: 3,
  TRAINING: 4,
  QUALITY: 5,
  EXTERNAL: 6,
};

/**
 * Department mapping for involvement vectors
 */
export const DEPARTMENT_MAPPING: Record<DepartmentCategory, number> = {
  ARCHITECTURE: 0,
  FIELD_SERVICES: 1,
  PROJECT_MANAGEMENT: 2,
  EXECUTIVE: 3,
  OTHER: 4,
};

/**
 * Validation functions
 */
export const validateClusteringFeatures = (
  features: any
): features is ClusteringFeatures => {
  return (
    features &&
    typeof features === 'object' &&
    typeof features.signalId === 'string' &&
    features.domainFeatures &&
    features.semanticFeatures &&
    Array.isArray(features.combinedVector) &&
    features.combinedVector.length > 0
  );
};

export const validateDomainFeatures = (
  features: any
): features is DomainFeatures => {
  return (
    features &&
    Array.isArray(features.rootCauseVector) &&
    features.rootCauseVector.length ===
      FEATURE_ENGINEERING_CONSTANTS.ROOT_CAUSE_DIMENSIONS &&
    Array.isArray(features.departmentVector) &&
    features.departmentVector.length ===
      FEATURE_ENGINEERING_CONSTANTS.DEPARTMENT_DIMENSIONS
  );
};

export const validateSemanticFeatures = (
  features: any
): features is SemanticFeatures => {
  return (
    features &&
    Array.isArray(features.titleEmbedding) &&
    Array.isArray(features.descriptionEmbedding) &&
    typeof features.textComplexity === 'number' &&
    typeof features.domainTerminologyDensity === 'number'
  );
};
