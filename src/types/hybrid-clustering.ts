/**
 * Hybrid Clustering Types - Sprint 2 Task 2
 * Expert: Dr. Elena Rodriguez (Advanced Clustering Specialist)
 * Supporting: Dr. Priya Patel (AI Architect), Dr. Maria Santos (Vector DB)
 *
 * Revolutionary three-stage hybrid clustering algorithm types
 */

import type { ClusteringFeatures } from './clustering-features';

// Root cause categories for domain pre-clustering
export type DomainClusterType =
  | 'QUALITY_CONTROL' // Construction defects, compliance, inspections
  | 'COMMUNICATION_ISSUES' // Client approvals, coordination delays
  | 'TECHNOLOGY_PROBLEMS' // Software crashes, infrastructure issues
  | 'PROCESS_OPTIMIZATION' // Workflow, resource coordination
  | 'CAPACITY_MANAGEMENT'; // Staffing, training, consulting

// Business relevance categories
export type BusinessRelevance =
  | 'HIGH' // Critical executive attention required
  | 'MEDIUM' // Important but manageable
  | 'LOW' // Minor operational issue
  | 'NOISE'; // Should be filtered out

/**
 * Domain Cluster - Stage 1 output
 * Business rule-based pre-clustering by root cause
 */
export interface DomainCluster {
  id: string;
  type: DomainClusterType;
  signalIds: string[];
  signals: ClusteringFeatures[];

  // Domain clustering metadata
  dominantRootCause: string;
  departmentSpread: string[];
  urgencyDistribution: Record<string, number>;
  businessImpactScore: number;

  // Cluster characteristics
  size: number;
  coherence: number; // How well signals fit together (0-1)
  businessRelevance: BusinessRelevance;

  // A&E domain context
  projectPhases: string[];
  buildingTypes: string[];
  qualityCategories: string[];

  createdAt: Date;
  confidence: number;
}

/**
 * Refined Cluster - Stage 2 output
 * AI-powered semantic refinement within domain groups
 */
export interface RefinedCluster {
  id: string;
  parentDomainCluster: string;
  signalIds: string[];
  signals: ClusteringFeatures[];

  // Semantic refinement results
  semanticCoherence: number; // Semantic similarity score (0-1)
  departmentAlignment: number; // Department consistency (0-1)
  urgencyAlignment: number; // Urgency consistency (0-1)

  // Sub-clustering details
  subClusters: SubCluster[];
  mergedFromSubClusters: string[];

  // Executive optimization
  executiveActionability: number; // How actionable for executives (0-1)
  decisionComplexity: number; // Decision-making complexity (0-1)

  // Quality metrics
  clusterQuality: number;
  silhouetteScore: number;
  inertia: number;

  refinedAt: Date;
  processingTime: number;
}

/**
 * Sub Cluster - Intermediate clustering unit
 * Used within semantic refinement stage
 */
export interface SubCluster {
  id: string;
  parentRefinedCluster: string;
  signalIds: string[];

  // Sub-cluster characteristics
  theme: string; // Descriptive theme/pattern
  keyTerms: string[]; // Most representative terms
  department: string; // Primary department
  urgencyLevel: string; // Primary urgency level

  // Similarity metrics
  internalSimilarity: number; // Avg similarity within cluster
  separationScore: number; // How distinct from other clusters

  size: number;
  confidence: number;
}

/**
 * Final Cluster - Stage 3 output
 * Executive-ready actionable business intelligence clusters
 */
export interface FinalCluster {
  id: string;
  name: string; // Executive-friendly cluster name
  description: string; // Business problem description

  signalIds: string[];
  signals: ClusteringFeatures[];

  // Executive intelligence
  businessProblemType: DomainClusterType;
  executiveSummary: string;
  recommendedActions: string[];
  stakeholders: string[];
  estimatedImpact: BusinessImpact;

  // Cluster quality for executives
  actionability: number; // How actionable (0-1)
  urgencyScore: number; // Overall urgency (0-1)
  complexity: number; // Solution complexity (0-1)
  resourceRequirement: ResourceRequirement;

  // A&E business context
  departmentsInvolved: string[];
  projectsAffected: string[];
  clientsImpacted: string[];

  // Cluster lineage
  sourceRefinedClusters: string[];
  sourceDomainClusters: string[];
  mergedClusters: string[];

  // Validation
  businessRelevance: BusinessRelevance;
  executiveValidation: ExecutiveValidation;
  expertReview: ExpertReview;

  finalizedAt: Date;
  version: string;
}

/**
 * Business Impact Assessment
 */
export interface BusinessImpact {
  financial: {
    costImpact: number; // Estimated cost impact ($)
    revenueRisk: number; // Revenue at risk ($)
    budgetVariance: number; // Budget variance (%)
  };

  operational: {
    scheduleDelay: number; // Schedule delay (days)
    qualityRisk: number; // Quality risk score (0-1)
    safetyRisk: number; // Safety risk score (0-1)
    productivityImpact: number; // Productivity impact (%)
  };

  strategic: {
    clientSatisfaction: number; // Client satisfaction risk (0-1)
    reputationRisk: number; // Reputation risk (0-1)
    competitiveAdvantage: number; // Competitive impact (0-1)
  };

  overall: number; // Overall business impact score (0-1)
  confidence: number; // Confidence in assessment (0-1)
}

/**
 * Resource Requirement Assessment
 */
export interface ResourceRequirement {
  personnel: {
    count: number; // Number of people required
    skillLevels: string[]; // Required skill levels
    departments: string[]; // Departments needed
    externalConsultants: boolean; // Need external help
  };

  timeline: {
    estimatedDuration: number; // Duration in days
    urgency: string; // IMMEDIATE, URGENT, NORMAL, DEFERRED
    dependencies: string[]; // Blocking dependencies
  };

  budget: {
    estimatedCost: number; // Estimated cost ($)
    budgetCategory: string; // Budget category/source
    approvalRequired: boolean; // Needs budget approval
  };

  technology: {
    systemsInvolved: string[]; // Technology systems
    softwareNeeded: string[]; // Software requirements
    infrastructureChanges: boolean; // Infrastructure changes needed
  };
}

/**
 * Executive Validation
 */
export interface ExecutiveValidation {
  validated: boolean;
  validatedBy: string[];
  validationDate: Date;

  scores: {
    clarity: number; // Problem clarity (0-1)
    actionability: number; // How actionable (0-1)
    priority: number; // Priority score (0-1)
    resourceRealism: number; // Resource estimate realism (0-1)
  };

  feedback: string[];
  recommendedChanges: string[];
  approvalStatus: 'APPROVED' | 'NEEDS_REVISION' | 'REJECTED';
}

/**
 * Expert Review
 */
export interface ExpertReview {
  reviewed: boolean;
  reviewedBy: string[]; // Expert names/IDs
  reviewDate: Date;

  technicalAccuracy: number; // Technical accuracy (0-1)
  domainRelevance: number; // A&E domain relevance (0-1)
  solutionFeasibility: number; // Solution feasibility (0-1)

  expertComments: string[];
  technicalRecommendations: string[];
  domainInsights: string[];
}

/**
 * Clustering Algorithm Configuration
 */
export interface HybridClusteringConfig {
  // Stage 1: Domain Pre-clustering
  domainRules: {
    enforceMinimumSeparation: boolean; // Force separation of key domains
    qualityAlwaysSeparate: boolean; // Always separate QUALITY issues
    communicationAlwaysSeparate: boolean; // Always separate COMMUNICATION issues
    technologyAlwaysSeparate: boolean; // Always separate TECHNOLOGY issues
    mergeThreshold: number; // When to merge small clusters
  };

  // Stage 2: Semantic Refinement
  semanticParams: {
    similarityThreshold: number; // Similarity threshold for grouping
    departmentWeight: number; // Weight for department consistency
    urgencyWeight: number; // Weight for urgency consistency
    maxSubClusters: number; // Max sub-clusters per domain
  };

  // Stage 3: Final Optimization
  executiveOptimization: {
    targetClusterCount: number; // Target number of final clusters (4-6)
    minClusterSize: number; // Minimum cluster size
    maxClusterSize: number; // Maximum cluster size
    actionabilityThreshold: number; // Minimum actionability score
  };

  // Performance settings
  performance: {
    enableCaching: boolean; // Enable result caching
    cacheExpiry: number; // Cache expiry time (minutes)
    parallelProcessing: boolean; // Enable parallel processing
    maxProcessingTime: number; // Max processing time (seconds)
  };

  // Quality controls
  quality: {
    minBusinessRelevance: BusinessRelevance; // Minimum business relevance
    requireExpertReview: boolean; // Require expert review
    requireExecutiveValidation: boolean; // Require executive validation
    qualityScoreThreshold: number; // Minimum quality score
  };
}

/**
 * Clustering Result
 */
export interface HybridClusteringResult {
  success: boolean;
  processingTime: number;

  // Stage results
  domainClusters: DomainCluster[];
  refinedClusters: RefinedCluster[];
  finalClusters: FinalCluster[];

  // Transformation metrics
  inputSignalCount: number;
  outputClusterCount: number;
  clusteringEfficiency: number; // Signals properly clustered / total signals

  // Quality metrics
  overallQuality: number; // Overall clustering quality (0-1)
  businessRelevanceScore: number; // Business relevance (0-1)
  executiveActionability: number; // Executive actionability (0-1)
  silhouetteScore: number; // Clustering silhouette score

  // Performance metrics
  stageProcessingTimes: {
    domainPreClustering: number;
    semanticRefinement: number;
    qualityValidation: number;
  };

  // Warnings and recommendations
  warnings: string[];
  recommendations: string[];

  // Metadata
  algorithm: string;
  version: string;
  generatedAt: Date;
  config: HybridClusteringConfig;
}

/**
 * Clustering Status for real-time monitoring
 */
export interface ClusteringStatus {
  id: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  currentStage:
    | 'DOMAIN_PRECLUSTERING'
    | 'SEMANTIC_REFINEMENT'
    | 'QUALITY_VALIDATION'
    | 'FINISHED';

  progress: {
    currentStage: number; // Current stage (1-3)
    totalStages: number; // Total stages (3)
    stageProgress: number; // Progress within current stage (0-1)
    overallProgress: number; // Overall progress (0-1)
  };

  stageProgress?: number; // Compatibility field for updates
  overallProgress?: number; // Compatibility field for updates

  timing: {
    startedAt: Date;
    estimatedCompletion?: Date;
    completedAt?: Date;
  };

  intermediate: {
    signalCount: number;
    domainClustersGenerated?: number;
    refinedClustersGenerated?: number;
    finalClustersGenerated?: number;
  };

  error?: string;
  warnings: string[];
}

/**
 * Clustering Cache Entry
 */
export interface ClusteringCacheEntry {
  key: string; // Cache key based on signal IDs and config
  result: HybridClusteringResult;
  cachedAt: Date;
  expiresAt: Date;
  hitCount: number;
  lastAccessed: Date;
}

/**
 * Default configuration
 */
export const DEFAULT_HYBRID_CLUSTERING_CONFIG: HybridClusteringConfig = {
  domainRules: {
    enforceMinimumSeparation: true,
    qualityAlwaysSeparate: true,
    communicationAlwaysSeparate: true,
    technologyAlwaysSeparate: true,
    mergeThreshold: 0.3,
  },
  semanticParams: {
    similarityThreshold: 0.7,
    departmentWeight: 0.3,
    urgencyWeight: 0.2,
    maxSubClusters: 3,
  },
  executiveOptimization: {
    targetClusterCount: 5,
    minClusterSize: 2,
    maxClusterSize: 12,
    actionabilityThreshold: 0.7,
  },
  performance: {
    enableCaching: true,
    cacheExpiry: 30,
    parallelProcessing: true,
    maxProcessingTime: 120,
  },
  quality: {
    minBusinessRelevance: 'MEDIUM',
    requireExpertReview: false,
    requireExecutiveValidation: false,
    qualityScoreThreshold: 0.7,
  },
};

/**
 * Validation functions
 */
export const validateHybridClusteringResult = (
  result: any
): result is HybridClusteringResult => {
  return (
    result &&
    typeof result === 'object' &&
    typeof result.success === 'boolean' &&
    Array.isArray(result.finalClusters) &&
    typeof result.processingTime === 'number'
  );
};

export const validateFinalCluster = (cluster: any): cluster is FinalCluster => {
  return (
    cluster &&
    typeof cluster === 'object' &&
    typeof cluster.id === 'string' &&
    typeof cluster.name === 'string' &&
    Array.isArray(cluster.signalIds) &&
    typeof cluster.actionability === 'number'
  );
};
