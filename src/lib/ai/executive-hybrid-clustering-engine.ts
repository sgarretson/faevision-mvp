/**
 * Executive-Optimized Hybrid Clustering Engine - FAE-135
 * Expert Lead: Dr. Emily Chen (Advanced Clustering Specialist)
 * AI Architecture: Dr. Priya Patel (AI Architect)
 * Business Intelligence: Marcus Rodriguez (Strategic Consultant)
 *
 * Revolutionary 3-stage clustering designed for business intelligence:
 * Stage 1: Domain pre-clustering using A&E business rules
 * Stage 2: Semantic refinement with confidence weighting
 * Stage 3: Executive optimization for 4-6 actionable clusters
 *
 * Target: 85%+ executive satisfaction, <30s processing, 4-6 clusters
 */

import type { ClusteringFeatures } from './multi-dimensional-feature-engine';
import type { RootCauseType } from './domain-classification-engine';

export interface HybridClusteringRequest {
  signalIds?: string[]; // Optional, defaults to all signals with features
  forceRegenerate?: boolean;
  targetClusterCount?: number; // 4-6 range
  executiveOptimization?: {
    prioritizeByImpact: boolean;
    mergeSmallClusters: boolean;
    splitLargeClusters: boolean;
  };
}

export interface BusinessImpact {
  costImpact: 'LOW' | 'MEDIUM' | 'HIGH';
  timelineRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  clientSatisfaction: 'LOW' | 'MEDIUM' | 'HIGH';
  overallScore: number; // 0.0-1.0
}

export interface RecommendedAction {
  action: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframe: string;
  owner: string;
  rationale: string;
}

export interface ExecutiveCluster {
  id: string;
  title: string;
  executiveSummary: string;

  // Business Intelligence
  rootCause: RootCauseType;
  businessImpact: BusinessImpact;

  // Executive Actions
  recommendedActions: RecommendedAction[];

  // Signal Details
  signalIds: string[];
  signalCount: number;
  affectedDepartments: string[];
  avgConfidence: number;

  // Quality Metrics
  clusterQuality: number;
  executiveActionability: number;
  businessRelevance: number;

  // Metadata
  createdAt: Date;
  lastAnalyzed: Date;
  processingTime: number;
}

export interface HybridClusteringResult {
  success: boolean;
  clusters: ExecutiveCluster[];

  processingMetrics: {
    totalSignals: number;
    clustersGenerated: number;
    avgClusterSize: number;
    processingTime: number;
    qualityScore: number;
  };

  executiveSummary: {
    topPriorities: string[];
    criticalActions: string[];
    resourceRequirements: string[];
    timeline: string;
  };

  stageMetrics: {
    stage1Time: number; // Domain pre-clustering
    stage2Time: number; // Semantic refinement
    stage3Time: number; // Executive optimization
  };
}

// Intermediate clustering types
interface DomainCluster {
  id: string;
  rootCause: RootCauseType;
  department: string;
  features: ClusteringFeatures[];
  confidence: number;
  businessContext: {
    urgencyLevel: string;
    projectPhase: string;
    clientTier: string;
  };
}

interface RefinedCluster {
  id: string;
  features: ClusteringFeatures[];
  centroid: number[]; // 89-dimension centroid
  cohesion: number; // Semantic similarity within cluster
  separation: number; // Distance from other clusters
  businessRelevance: number;
}

/**
 * A&E Domain Clustering Rules
 * Curated by Marcus Rodriguez for business-relevant clustering
 */
const AE_DOMAIN_CLUSTERING_RULES = {
  PROCESS: {
    keywords: [
      'workflow',
      'approval',
      'coordination',
      'scheduling',
      'procedure',
    ],
    departments: ['PROJECT_MGMT', 'ADMIN'],
    mergePriority: 'HIGH', // Process issues often interconnected
    splitThreshold: 8, // Split large process clusters
  },
  RESOURCE: {
    keywords: ['staff', 'equipment', 'budget', 'capacity', 'shortage'],
    departments: ['STRUCTURAL', 'ARCHITECTURAL', 'MEP'],
    mergePriority: 'MEDIUM',
    splitThreshold: 6, // Resource clusters more specific
  },
  COMMUNICATION: {
    keywords: ['client', 'coordination', 'meeting', 'feedback', 'clarity'],
    departments: ['PROJECT_MGMT', 'CLIENT'],
    mergePriority: 'HIGH', // Communication issues cascade
    splitThreshold: 10,
  },
  TECHNOLOGY: {
    keywords: ['software', 'CAD', 'system', 'integration', 'automation'],
    departments: ['STRUCTURAL', 'ARCHITECTURAL', 'MEP'],
    mergePriority: 'LOW', // Tech issues often specific
    splitThreshold: 5,
  },
  TRAINING: {
    keywords: [
      'knowledge',
      'skills',
      'competency',
      'certification',
      'learning',
    ],
    departments: ['STRUCTURAL', 'ARCHITECTURAL', 'MEP', 'QC'],
    mergePriority: 'MEDIUM',
    splitThreshold: 7,
  },
  QUALITY: {
    keywords: ['standards', 'compliance', 'review', 'inspection', 'defects'],
    departments: ['QC', 'STRUCTURAL', 'ARCHITECTURAL'],
    mergePriority: 'HIGH', // Quality issues systemic
    splitThreshold: 9,
  },
} as const;

/**
 * Executive Action Templates
 * Business-relevant actions curated by Marcus Rodriguez
 */
const EXECUTIVE_ACTION_TEMPLATES = {
  PROCESS: [
    {
      template:
        'Streamline {processName} workflow to reduce {timeReduction} delays',
      priority: 'HIGH',
      effort: 'MEDIUM',
      timeframe: '2-4 weeks',
      owner: 'Project Manager',
    },
    {
      template: 'Implement automated approval system for {approvalType}',
      priority: 'MEDIUM',
      effort: 'HIGH',
      timeframe: '4-8 weeks',
      owner: 'IT/Operations',
    },
  ],
  RESOURCE: [
    {
      template:
        'Increase {resourceType} capacity by {percentage} to meet demand',
      priority: 'HIGH',
      effort: 'HIGH',
      timeframe: '4-12 weeks',
      owner: 'Department Head',
    },
    {
      template: 'Redistribute workload across {departments} for better balance',
      priority: 'MEDIUM',
      effort: 'LOW',
      timeframe: '1-2 weeks',
      owner: 'Resource Manager',
    },
  ],
  COMMUNICATION: [
    {
      template: 'Establish regular {frequency} meetings with {stakeholders}',
      priority: 'MEDIUM',
      effort: 'LOW',
      timeframe: '1 week',
      owner: 'Project Manager',
    },
    {
      template: 'Implement centralized communication platform for {teams}',
      priority: 'HIGH',
      effort: 'MEDIUM',
      timeframe: '2-4 weeks',
      owner: 'IT/Communications',
    },
  ],
  TECHNOLOGY: [
    {
      template: 'Upgrade {technology} to latest version for {benefits}',
      priority: 'MEDIUM',
      effort: 'HIGH',
      timeframe: '4-8 weeks',
      owner: 'IT Manager',
    },
    {
      template: 'Provide {training} on {software} for {departments}',
      priority: 'MEDIUM',
      effort: 'MEDIUM',
      timeframe: '2-3 weeks',
      owner: 'Training Manager',
    },
  ],
  TRAINING: [
    {
      template: 'Develop {skillSet} training program for {departments}',
      priority: 'MEDIUM',
      effort: 'HIGH',
      timeframe: '6-12 weeks',
      owner: 'HR/Training',
    },
    {
      template:
        'Bring in external {expertise} consultant for knowledge transfer',
      priority: 'HIGH',
      effort: 'MEDIUM',
      timeframe: '2-4 weeks',
      owner: 'Department Head',
    },
  ],
  QUALITY: [
    {
      template: 'Implement enhanced QC checklist for {processArea}',
      priority: 'HIGH',
      effort: 'MEDIUM',
      timeframe: '2-3 weeks',
      owner: 'QC Manager',
    },
    {
      template: 'Conduct comprehensive review of {qualityArea} standards',
      priority: 'HIGH',
      effort: 'HIGH',
      timeframe: '4-8 weeks',
      owner: 'Quality Director',
    },
  ],
} as const;

/**
 * Executive-Optimized Hybrid Clustering Engine
 * Transforms multi-dimensional features into 4-6 actionable business intelligence clusters
 */
export class ExecutiveHybridClusteringEngine {
  private readonly TARGET_CLUSTERS = [4, 5, 6]; // Executive consumption range
  private readonly MIN_CLUSTER_SIZE = 2;
  private readonly MAX_CLUSTER_SIZE = 12;
  private readonly ENGINE_VERSION = '3.0.0';

  /**
   * Main clustering function - orchestrates all 3 stages
   */
  async executeHybridClustering(
    features: ClusteringFeatures[],
    options: HybridClusteringRequest = {}
  ): Promise<HybridClusteringResult> {
    const startTime = Date.now();

    try {
      console.log(`🎯 Executive Hybrid Clustering Started:`, {
        signalCount: features.length,
        targetClusters: options.targetClusterCount || '4-6',
        forceRegenerate: options.forceRegenerate || false,
      });

      // Stage 1: Domain Pre-Clustering (Business Rules)
      const stage1Start = Date.now();
      const domainClusters = await this.domainPreClustering(features);
      const stage1Time = Date.now() - stage1Start;

      console.log(
        `🏗️ Stage 1 Complete: ${domainClusters.length} domain clusters`
      );

      // Stage 2: Semantic Refinement (AI Enhancement)
      const stage2Start = Date.now();
      const refinedClusters = await this.semanticRefinement(domainClusters);
      const stage2Time = Date.now() - stage2Start;

      console.log(
        `🔧 Stage 2 Complete: ${refinedClusters.length} refined clusters`
      );

      // Stage 3: Executive Optimization (Business Intelligence)
      const stage3Start = Date.now();
      const executiveClusters = await this.executiveOptimization(
        refinedClusters,
        options
      );
      const stage3Time = Date.now() - stage3Start;

      console.log(
        `🎯 Stage 3 Complete: ${executiveClusters.length} executive clusters`
      );

      // Generate final result
      const result = this.generateExecutiveResult(
        executiveClusters,
        features.length,
        startTime,
        { stage1Time, stage2Time, stage3Time }
      );

      console.log(`✅ Executive Hybrid Clustering Complete:`, {
        clustersGenerated: result.clusters.length,
        avgClusterSize: result.processingMetrics.avgClusterSize,
        qualityScore: result.processingMetrics.qualityScore,
        totalTime: result.processingMetrics.processingTime,
      });

      return result;
    } catch (error) {
      console.error('❌ Executive Hybrid Clustering Error:', error);
      throw new Error(
        `Hybrid clustering failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Stage 1: Domain Pre-Clustering using A&E business rules
   */
  private async domainPreClustering(
    features: ClusteringFeatures[]
  ): Promise<DomainCluster[]> {
    const domainGroups = new Map<string, ClusteringFeatures[]>();

    // Group by root cause + department combinations
    for (const feature of features) {
      const primaryRootCause = this.extractPrimaryRootCause(feature);
      const primaryDepartment = this.extractPrimaryDepartment(feature);
      const urgencyLevel = this.extractUrgencyLevel(feature);

      // Create compound key for business-relevant grouping
      const groupKey = `${primaryRootCause}:${primaryDepartment}:${urgencyLevel}`;

      if (!domainGroups.has(groupKey)) {
        domainGroups.set(groupKey, []);
      }
      domainGroups.get(groupKey)!.push(feature);
    }

    // Convert groups to domain clusters
    const domainClusters: DomainCluster[] = [];
    let clusterId = 1;

    for (const [groupKey, groupFeatures] of Array.from(
      domainGroups.entries()
    )) {
      const [rootCause, department, urgencyLevel] = groupKey.split(':');

      const cluster: DomainCluster = {
        id: `domain-${clusterId++}`,
        rootCause: rootCause as RootCauseType,
        department,
        features: groupFeatures,
        confidence: this.calculateDomainClusterConfidence(groupFeatures),
        businessContext: {
          urgencyLevel,
          projectPhase: this.extractCommonProjectPhase(groupFeatures),
          clientTier: this.extractCommonClientTier(groupFeatures),
        },
      };

      domainClusters.push(cluster);
    }

    // Apply A&E business rules for cluster optimization
    return this.applyAEBusinessRules(domainClusters);
  }

  /**
   * Stage 2: Semantic Refinement using confidence-weighted similarity
   */
  private async semanticRefinement(
    domainClusters: DomainCluster[]
  ): Promise<RefinedCluster[]> {
    const refinedClusters: RefinedCluster[] = [];
    let clusterId = 1;

    for (const domainCluster of domainClusters) {
      // Apply semantic sub-clustering within domain cluster
      const subclusters = await this.semanticSubclustering(
        domainCluster.features,
        `refined-${clusterId++}`
      );

      refinedClusters.push(...subclusters);
    }

    // Optimize cluster sizes (merge small, split large)
    return this.optimizeClusterSizes(refinedClusters);
  }

  /**
   * Stage 3: Executive Optimization for 4-6 actionable clusters
   */
  private async executiveOptimization(
    clusters: RefinedCluster[],
    options: HybridClusteringRequest
  ): Promise<ExecutiveCluster[]> {
    // Target exactly 4-6 clusters for executive consumption
    let optimized = await this.targetClusterCount(
      clusters,
      options.targetClusterCount
    );

    // Prioritize by business impact and actionability
    optimized = this.prioritizeByBusinessImpact(optimized);

    // Generate executive intelligence and recommendations
    return this.generateExecutiveIntelligence(optimized);
  }

  /**
   * Extract primary root cause from feature vector
   */
  private extractPrimaryRootCause(feature: ClusteringFeatures): RootCauseType {
    let maxScore = 0;
    let primaryCause: RootCauseType = 'PROCESS';

    for (const [cause, score] of Object.entries(feature.rootCauseScores)) {
      if (score > maxScore) {
        maxScore = score;
        primaryCause = cause as RootCauseType;
      }
    }

    return primaryCause;
  }

  /**
   * Extract primary department from organizational context
   */
  private extractPrimaryDepartment(feature: ClusteringFeatures): string {
    const departments = [
      'STRUCTURAL',
      'ARCHITECTURAL',
      'MEP',
      'PROJECT_MGMT',
      'QC',
      'ADMIN',
      'CLIENT',
      'UNKNOWN',
    ];

    let maxIndex = 0;
    let maxValue = feature.organizationalContext[0] || 0;

    for (
      let i = 1;
      i < Math.min(departments.length, feature.organizationalContext.length);
      i++
    ) {
      if (feature.organizationalContext[i] > maxValue) {
        maxValue = feature.organizationalContext[i];
        maxIndex = i;
      }
    }

    return departments[maxIndex];
  }

  /**
   * Extract urgency level from urgency factors
   */
  private extractUrgencyLevel(feature: ClusteringFeatures): string {
    const urgencyLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    let maxIndex = 0;
    let maxValue = feature.urgencyFactors[0] || 0;

    for (
      let i = 1;
      i < Math.min(urgencyLevels.length, feature.urgencyFactors.length);
      i++
    ) {
      if (feature.urgencyFactors[i] > maxValue) {
        maxValue = feature.urgencyFactors[i];
        maxIndex = i;
      }
    }

    return urgencyLevels[maxIndex];
  }

  /**
   * Calculate domain cluster confidence
   */
  private calculateDomainClusterConfidence(
    features: ClusteringFeatures[]
  ): number {
    if (features.length === 0) return 0;

    const avgConfidence =
      features.reduce((sum, f) => sum + f.confidence, 0) / features.length;
    const sizeBonus = Math.min(0.2, features.length * 0.05); // Larger clusters more confident

    return Math.min(1.0, avgConfidence + sizeBonus);
  }

  /**
   * Apply A&E business rules to optimize domain clusters
   */
  private applyAEBusinessRules(clusters: DomainCluster[]): DomainCluster[] {
    const optimized: DomainCluster[] = [];

    for (const cluster of clusters) {
      const rule = AE_DOMAIN_CLUSTERING_RULES[cluster.rootCause];

      // Check if cluster should be split
      if (cluster.features.length > rule.splitThreshold) {
        const splitClusters = this.splitDomainCluster(cluster);
        optimized.push(...splitClusters);
      } else {
        optimized.push(cluster);
      }
    }

    // Apply merge rules based on business priorities
    return this.mergeDomainClusters(optimized);
  }

  /**
   * Split large domain cluster into smaller business-relevant clusters
   */
  private splitDomainCluster(cluster: DomainCluster): DomainCluster[] {
    // Split by secondary factors (project phase, client tier)
    const splitGroups = new Map<string, ClusteringFeatures[]>();

    for (const feature of cluster.features) {
      const projectPhase = this.extractProjectPhase(feature);
      const clientTier = this.extractClientTier(feature);
      const splitKey = `${projectPhase}:${clientTier}`;

      if (!splitGroups.has(splitKey)) {
        splitGroups.set(splitKey, []);
      }
      splitGroups.get(splitKey)!.push(feature);
    }

    // Create split clusters
    const splitClusters: DomainCluster[] = [];
    let subId = 1;

    for (const [splitKey, features] of Array.from(splitGroups.entries())) {
      if (features.length >= this.MIN_CLUSTER_SIZE) {
        const [projectPhase, clientTier] = splitKey.split(':');

        splitClusters.push({
          id: `${cluster.id}-split-${subId++}`,
          rootCause: cluster.rootCause,
          department: cluster.department,
          features,
          confidence: this.calculateDomainClusterConfidence(features),
          businessContext: {
            urgencyLevel: cluster.businessContext.urgencyLevel,
            projectPhase,
            clientTier,
          },
        });
      }
    }

    return splitClusters.length > 0 ? splitClusters : [cluster];
  }

  /**
   * Merge domain clusters based on business rules
   */
  private mergeDomainClusters(clusters: DomainCluster[]): DomainCluster[] {
    // Group by root cause for potential merging
    const rootCauseGroups = new Map<RootCauseType, DomainCluster[]>();

    for (const cluster of clusters) {
      if (!rootCauseGroups.has(cluster.rootCause)) {
        rootCauseGroups.set(cluster.rootCause, []);
      }
      rootCauseGroups.get(cluster.rootCause)!.push(cluster);
    }

    const merged: DomainCluster[] = [];

    for (const [rootCause, clusterGroup] of Array.from(
      rootCauseGroups.entries()
    )) {
      const rule = AE_DOMAIN_CLUSTERING_RULES[rootCause as RootCauseType];

      if (rule.mergePriority === 'HIGH' && clusterGroup.length > 1) {
        // Merge small clusters of same root cause
        const largeClusters = clusterGroup.filter(
          (c: DomainCluster) => c.features.length >= this.MIN_CLUSTER_SIZE * 2
        );
        const smallClusters = clusterGroup.filter(
          (c: DomainCluster) => c.features.length < this.MIN_CLUSTER_SIZE * 2
        );

        if (smallClusters.length > 1) {
          const mergedCluster = this.mergeSmallClusters(
            smallClusters,
            rootCause
          );
          merged.push(...largeClusters, mergedCluster);
        } else {
          merged.push(...clusterGroup);
        }
      } else {
        merged.push(...clusterGroup);
      }
    }

    return merged;
  }

  /**
   * Semantic sub-clustering within domain cluster
   */
  private async semanticSubclustering(
    features: ClusteringFeatures[],
    baseId: string
  ): Promise<RefinedCluster[]> {
    if (features.length <= this.MIN_CLUSTER_SIZE) {
      // Too small to split, create single refined cluster
      return [
        {
          id: baseId,
          features,
          centroid: this.calculateCentroid(features),
          cohesion: this.calculateCohesion(features),
          separation: 1.0, // Single cluster, max separation
          businessRelevance: this.calculateBusinessRelevance(features),
        },
      ];
    }

    // Apply semantic similarity clustering
    const similarityMatrix = this.calculateSimilarityMatrix(features);
    const semanticClusters = this.hierarchicalClustering(
      features,
      similarityMatrix
    );

    // Convert to refined clusters
    const refined: RefinedCluster[] = [];
    let subId = 1;

    for (const clusterFeatures of semanticClusters) {
      refined.push({
        id: `${baseId}-sem-${subId++}`,
        features: clusterFeatures,
        centroid: this.calculateCentroid(clusterFeatures),
        cohesion: this.calculateCohesion(clusterFeatures),
        separation: this.calculateSeparation(clusterFeatures, semanticClusters),
        businessRelevance: this.calculateBusinessRelevance(clusterFeatures),
      });
    }

    return refined;
  }

  /**
   * Calculate semantic similarity matrix between features
   */
  private calculateSimilarityMatrix(
    features: ClusteringFeatures[]
  ): number[][] {
    const matrix: number[][] = [];

    for (let i = 0; i < features.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < features.length; j++) {
        if (i === j) {
          matrix[i][j] = 1.0;
        } else {
          matrix[i][j] = this.calculateSemanticSimilarity(
            features[i],
            features[j]
          );
        }
      }
    }

    return matrix;
  }

  /**
   * Calculate semantic similarity between two feature vectors
   */
  private calculateSemanticSimilarity(
    f1: ClusteringFeatures,
    f2: ClusteringFeatures
  ): number {
    // Weighted similarity considering all feature dimensions
    const domainSim =
      this.cosineSimilarity(f1.domainVector, f2.domainVector) * 0.6;
    const semanticSim =
      this.cosineSimilarity(f1.textEmbedding, f2.textEmbedding) * 0.3;
    const executiveSim = this.calculateExecutiveSimilarity(f1, f2) * 0.1;

    return domainSim + semanticSim + executiveSim;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    return magnitudeA && magnitudeB
      ? dotProduct / (magnitudeA * magnitudeB)
      : 0;
  }

  /**
   * Calculate executive feature similarity
   */
  private calculateExecutiveSimilarity(
    f1: ClusteringFeatures,
    f2: ClusteringFeatures
  ): number {
    const impactDiff = Math.abs(f1.businessImpact - f2.businessImpact);
    const actionabilityDiff = Math.abs(f1.actionability - f2.actionability);
    const priorityDiff = Math.abs(f1.strategicPriority - f2.strategicPriority);
    const attentionDiff = Math.abs(
      f1.executiveAttention - f2.executiveAttention
    );

    const avgDiff =
      (impactDiff + actionabilityDiff + priorityDiff + attentionDiff) / 4;
    return 1.0 - avgDiff; // Smaller difference = higher similarity
  }

  /**
   * Simple hierarchical clustering for semantic refinement
   */
  private hierarchicalClustering(
    features: ClusteringFeatures[],
    similarityMatrix: number[][]
  ): ClusteringFeatures[][] {
    // Create initial clusters (each feature is its own cluster)
    let clusters = features.map(f => [f]);
    const indices = features.map((_, i) => i);

    // Merge clusters until we reach desired count or similarity threshold
    while (clusters.length > 2 && clusters.length > features.length / 4) {
      let maxSimilarity = 0;
      let mergeI = -1;
      let mergeJ = -1;

      // Find most similar clusters to merge
      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const similarity = this.calculateClusterSimilarity(
            clusters[i],
            clusters[j],
            similarityMatrix,
            indices
          );

          if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            mergeI = i;
            mergeJ = j;
          }
        }
      }

      // Merge if similarity is high enough
      if (maxSimilarity > 0.7 && mergeI >= 0 && mergeJ >= 0) {
        clusters[mergeI] = [...clusters[mergeI], ...clusters[mergeJ]];
        clusters.splice(mergeJ, 1);
      } else {
        break; // No good merges available
      }
    }

    return clusters;
  }

  /**
   * Target exactly 4-6 clusters for executive consumption
   */
  private async targetClusterCount(
    clusters: RefinedCluster[],
    targetCount?: number
  ): Promise<RefinedCluster[]> {
    const target = targetCount || 5; // Default to 5 clusters
    const targetRange = this.TARGET_CLUSTERS;

    if (
      clusters.length >= targetRange[0] &&
      clusters.length <= targetRange[2]
    ) {
      // Already in target range
      return clusters.slice(0, targetRange[2]); // Cap at max
    }

    if (clusters.length > targetRange[2]) {
      // Too many clusters - merge smallest/least relevant
      return this.mergeToTargetCount(clusters, target);
    } else {
      // Too few clusters - split largest if possible
      return this.splitToTargetCount(clusters, target);
    }
  }

  /**
   * Generate executive intelligence and recommendations
   */
  private async generateExecutiveIntelligence(
    clusters: RefinedCluster[]
  ): Promise<ExecutiveCluster[]> {
    const executiveClusters: ExecutiveCluster[] = [];

    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      const rootCause = this.extractClusterRootCause(cluster);

      const executiveCluster: ExecutiveCluster = {
        id: `executive-${i + 1}`,
        title: this.generateClusterTitle(cluster, rootCause),
        executiveSummary: this.generateExecutiveSummary(cluster, rootCause),
        rootCause,
        businessImpact: this.calculateBusinessImpact(cluster),
        recommendedActions: this.generateRecommendedActions(cluster, rootCause),
        signalIds: cluster.features.map(f => f.signalId),
        signalCount: cluster.features.length,
        affectedDepartments: this.extractAffectedDepartments(cluster),
        avgConfidence:
          cluster.features.reduce((sum, f) => sum + f.confidence, 0) /
          cluster.features.length,
        clusterQuality: cluster.cohesion,
        executiveActionability: this.calculateExecutiveActionability(cluster),
        businessRelevance: cluster.businessRelevance,
        createdAt: new Date(),
        lastAnalyzed: new Date(),
        processingTime: 0, // Will be set later
      };

      executiveClusters.push(executiveCluster);
    }

    return executiveClusters;
  }

  /**
   * Generate executive result with metrics and summary
   */
  private generateExecutiveResult(
    clusters: ExecutiveCluster[],
    totalSignals: number,
    startTime: number,
    stageMetrics: { stage1Time: number; stage2Time: number; stage3Time: number }
  ): HybridClusteringResult {
    const processingTime = Date.now() - startTime;

    // Update cluster processing times
    clusters.forEach(cluster => {
      cluster.processingTime = processingTime;
    });

    const avgClusterSize = totalSignals / clusters.length;
    const qualityScore =
      clusters.reduce((sum, c) => sum + c.clusterQuality, 0) / clusters.length;

    return {
      success: true,
      clusters,
      processingMetrics: {
        totalSignals,
        clustersGenerated: clusters.length,
        avgClusterSize,
        processingTime,
        qualityScore,
      },
      executiveSummary: this.generateOverallExecutiveSummary(clusters),
      stageMetrics,
    };
  }

  // Helper methods for cluster analysis and generation
  private extractProjectPhase(feature: ClusteringFeatures): string {
    // Extract from organizational context - simplified for now
    return 'DESIGN'; // TODO: Implement proper extraction
  }

  private extractClientTier(feature: ClusteringFeatures): string {
    // Extract from business context - simplified for now
    return 'UNKNOWN'; // TODO: Implement proper extraction
  }

  private extractCommonProjectPhase(features: ClusteringFeatures[]): string {
    // Find most common project phase
    return 'DESIGN'; // TODO: Implement proper analysis
  }

  private extractCommonClientTier(features: ClusteringFeatures[]): string {
    // Find most common client tier
    return 'UNKNOWN'; // TODO: Implement proper analysis
  }

  private mergeSmallClusters(
    clusters: DomainCluster[],
    rootCause: RootCauseType
  ): DomainCluster {
    const allFeatures = clusters.flatMap(c => c.features);
    return {
      id: `merged-${rootCause.toLowerCase()}`,
      rootCause,
      department: 'MIXED',
      features: allFeatures,
      confidence: this.calculateDomainClusterConfidence(allFeatures),
      businessContext: clusters[0].businessContext, // Use first cluster's context
    };
  }

  private calculateCentroid(features: ClusteringFeatures[]): number[] {
    if (features.length === 0) return [];

    const vectorLength = features[0].domainVector.length;
    const centroid = new Array(vectorLength).fill(0);

    for (const feature of features) {
      for (let i = 0; i < vectorLength; i++) {
        centroid[i] += feature.domainVector[i];
      }
    }

    return centroid.map(val => val / features.length);
  }

  private calculateCohesion(features: ClusteringFeatures[]): number {
    if (features.length <= 1) return 1.0;

    let totalSimilarity = 0;
    let pairCount = 0;

    for (let i = 0; i < features.length; i++) {
      for (let j = i + 1; j < features.length; j++) {
        totalSimilarity += this.calculateSemanticSimilarity(
          features[i],
          features[j]
        );
        pairCount++;
      }
    }

    return pairCount > 0 ? totalSimilarity / pairCount : 1.0;
  }

  private calculateSeparation(
    features: ClusteringFeatures[],
    allClusters: ClusteringFeatures[][]
  ): number {
    // Simplified separation calculation
    return Math.random() * 0.5 + 0.5; // TODO: Implement proper separation
  }

  private calculateBusinessRelevance(features: ClusteringFeatures[]): number {
    const avgBusinessImpact =
      features.reduce((sum, f) => sum + f.businessImpact, 0) / features.length;
    const avgActionability =
      features.reduce((sum, f) => sum + f.actionability, 0) / features.length;
    const avgPriority =
      features.reduce((sum, f) => sum + f.strategicPriority, 0) /
      features.length;

    return (avgBusinessImpact + avgActionability + avgPriority) / 3;
  }

  private calculateClusterSimilarity(
    clusterA: ClusteringFeatures[],
    clusterB: ClusteringFeatures[],
    similarityMatrix: number[][],
    indices: number[]
  ): number {
    // Average linkage similarity
    let totalSimilarity = 0;
    let pairCount = 0;

    for (const featureA of clusterA) {
      for (const featureB of clusterB) {
        const idxA = indices.findIndex(i => i < similarityMatrix.length);
        const idxB = indices.findIndex(i => i < similarityMatrix.length);
        if (idxA >= 0 && idxB >= 0) {
          totalSimilarity += similarityMatrix[idxA][idxB];
          pairCount++;
        }
      }
    }

    return pairCount > 0 ? totalSimilarity / pairCount : 0;
  }

  private mergeToTargetCount(
    clusters: RefinedCluster[],
    target: number
  ): RefinedCluster[] {
    // Sort by business relevance (keep most relevant)
    const sorted = [...clusters].sort(
      (a, b) => b.businessRelevance - a.businessRelevance
    );
    return sorted.slice(0, target);
  }

  private splitToTargetCount(
    clusters: RefinedCluster[],
    target: number
  ): RefinedCluster[] {
    // For now, just return existing clusters
    // TODO: Implement cluster splitting logic
    return clusters;
  }

  private extractClusterRootCause(cluster: RefinedCluster): RootCauseType {
    // Find most common root cause in cluster
    const rootCauseCounts = new Map<RootCauseType, number>();

    for (const feature of cluster.features) {
      for (const [cause, score] of Object.entries(feature.rootCauseScores)) {
        const current = rootCauseCounts.get(cause as RootCauseType) || 0;
        rootCauseCounts.set(cause as RootCauseType, current + score);
      }
    }

    let maxCause: RootCauseType = 'PROCESS';
    let maxScore = 0;

    for (const [cause, score] of Array.from(rootCauseCounts.entries())) {
      if (score > maxScore) {
        maxScore = score;
        maxCause = cause;
      }
    }

    return maxCause;
  }

  private generateClusterTitle(
    cluster: RefinedCluster,
    rootCause: RootCauseType
  ): string {
    const signalCount = cluster.features.length;
    const department = this.extractPrimaryClusterDepartment(cluster);

    const titleTemplates = {
      PROCESS: `${department} Process Optimization (${signalCount} signals)`,
      RESOURCE: `${department} Resource Allocation (${signalCount} signals)`,
      COMMUNICATION: `${department} Communication Enhancement (${signalCount} signals)`,
      TECHNOLOGY: `${department} Technology Integration (${signalCount} signals)`,
      TRAINING: `${department} Training & Development (${signalCount} signals)`,
      QUALITY: `${department} Quality Assurance (${signalCount} signals)`,
    };

    return titleTemplates[rootCause];
  }

  private generateExecutiveSummary(
    cluster: RefinedCluster,
    rootCause: RootCauseType
  ): string {
    const signalCount = cluster.features.length;
    const department = this.extractPrimaryClusterDepartment(cluster);
    const avgImpact =
      cluster.features.reduce((sum, f) => sum + f.businessImpact, 0) /
      cluster.features.length;

    const impactLevel =
      avgImpact > 0.7 ? 'HIGH' : avgImpact > 0.4 ? 'MEDIUM' : 'LOW';

    const summaryTemplates = {
      PROCESS: `${signalCount} workflow and process issues identified in ${department} with ${impactLevel} business impact. Issues include approval delays, coordination challenges, and procedural inefficiencies affecting project timelines.`,
      RESOURCE: `${signalCount} resource allocation challenges in ${department} with ${impactLevel} business impact. Issues include capacity constraints, staffing shortages, and equipment limitations affecting project delivery.`,
      COMMUNICATION: `${signalCount} communication and coordination issues in ${department} with ${impactLevel} business impact. Issues include client feedback gaps, team coordination challenges, and information flow problems.`,
      TECHNOLOGY: `${signalCount} technology and system issues in ${department} with ${impactLevel} business impact. Issues include software limitations, integration problems, and automation opportunities.`,
      TRAINING: `${signalCount} training and competency gaps in ${department} with ${impactLevel} business impact. Issues include skill shortages, knowledge transfer needs, and professional development requirements.`,
      QUALITY: `${signalCount} quality and compliance issues in ${department} with ${impactLevel} business impact. Issues include standard adherence, review processes, and quality control improvements.`,
    };

    return summaryTemplates[rootCause];
  }

  private calculateBusinessImpact(cluster: RefinedCluster): BusinessImpact {
    const features = cluster.features;
    const avgBusinessImpact =
      features.reduce((sum, f) => sum + f.businessImpact, 0) / features.length;
    const avgActionability =
      features.reduce((sum, f) => sum + f.actionability, 0) / features.length;
    const avgPriority =
      features.reduce((sum, f) => sum + f.strategicPriority, 0) /
      features.length;

    // Convert scores to categorical levels
    const costImpact =
      avgBusinessImpact > 0.7
        ? 'HIGH'
        : avgBusinessImpact > 0.4
          ? 'MEDIUM'
          : 'LOW';
    const timelineRisk =
      avgPriority > 0.7 ? 'HIGH' : avgPriority > 0.4 ? 'MEDIUM' : 'LOW';
    const clientSatisfaction =
      avgActionability > 0.7
        ? 'LOW'
        : avgActionability > 0.4
          ? 'MEDIUM'
          : 'HIGH'; // Inverted

    const overallScore =
      (avgBusinessImpact + avgActionability + avgPriority) / 3;

    return {
      costImpact: costImpact as 'LOW' | 'MEDIUM' | 'HIGH',
      timelineRisk: timelineRisk as 'LOW' | 'MEDIUM' | 'HIGH',
      clientSatisfaction: clientSatisfaction as 'LOW' | 'MEDIUM' | 'HIGH',
      overallScore,
    };
  }

  private generateRecommendedActions(
    cluster: RefinedCluster,
    rootCause: RootCauseType
  ): RecommendedAction[] {
    const templates = EXECUTIVE_ACTION_TEMPLATES[rootCause];
    const actions: RecommendedAction[] = [];

    for (const template of templates.slice(0, 2)) {
      // Top 2 actions per cluster
      const action: RecommendedAction = {
        action: this.customizeActionTemplate(template.template, cluster),
        priority: template.priority as 'LOW' | 'MEDIUM' | 'HIGH',
        effort: template.effort as 'LOW' | 'MEDIUM' | 'HIGH',
        timeframe: template.timeframe,
        owner: template.owner,
        rationale: this.generateActionRationale(cluster, rootCause),
      };

      actions.push(action);
    }

    return actions;
  }

  private customizeActionTemplate(
    template: string,
    cluster: RefinedCluster
  ): string {
    // Simple template customization
    return template
      .replace('{processName}', 'workflow')
      .replace('{timeReduction}', '2-3 week')
      .replace('{approvalType}', 'design review')
      .replace('{resourceType}', 'engineering')
      .replace('{percentage}', '25%')
      .replace('{departments}', 'cross-functional teams')
      .replace('{frequency}', 'weekly')
      .replace('{stakeholders}', 'key project stakeholders')
      .replace('{teams}', 'project teams')
      .replace('{technology}', 'design software')
      .replace('{benefits}', 'improved collaboration')
      .replace('{training}', 'advanced')
      .replace('{software}', 'design tools')
      .replace('{skillSet}', 'technical')
      .replace('{expertise}', 'specialized')
      .replace('{processArea}', 'design review')
      .replace('{qualityArea}', 'design standards');
  }

  private generateActionRationale(
    cluster: RefinedCluster,
    rootCause: RootCauseType
  ): string {
    const signalCount = cluster.features.length;
    return `Based on analysis of ${signalCount} related signals showing patterns in ${rootCause.toLowerCase()} issues. Implementation will address root causes and improve overall efficiency.`;
  }

  private extractAffectedDepartments(cluster: RefinedCluster): string[] {
    const departments = new Set<string>();

    for (const feature of cluster.features) {
      const dept = this.extractPrimaryDepartment(feature);
      departments.add(dept);
    }

    return Array.from(departments);
  }

  private extractPrimaryClusterDepartment(cluster: RefinedCluster): string {
    const deptCounts = new Map<string, number>();

    for (const feature of cluster.features) {
      const dept = this.extractPrimaryDepartment(feature);
      deptCounts.set(dept, (deptCounts.get(dept) || 0) + 1);
    }

    let maxDept = 'UNKNOWN';
    let maxCount = 0;

    for (const [dept, count] of Array.from(deptCounts.entries())) {
      if (count > maxCount) {
        maxCount = count;
        maxDept = dept;
      }
    }

    return maxDept;
  }

  private calculateExecutiveActionability(cluster: RefinedCluster): number {
    return (
      cluster.features.reduce((sum, f) => sum + f.actionability, 0) /
      cluster.features.length
    );
  }

  private optimizeClusterSizes(clusters: RefinedCluster[]): RefinedCluster[] {
    // Remove clusters that are too small
    const filtered = clusters.filter(
      c => c.features.length >= this.MIN_CLUSTER_SIZE
    );

    // Split clusters that are too large
    const optimized: RefinedCluster[] = [];

    for (const cluster of filtered) {
      if (cluster.features.length > this.MAX_CLUSTER_SIZE) {
        // Split large cluster
        const splitClusters = this.splitLargeCluster(cluster);
        optimized.push(...splitClusters);
      } else {
        optimized.push(cluster);
      }
    }

    return optimized;
  }

  private splitLargeCluster(cluster: RefinedCluster): RefinedCluster[] {
    // Simple split by half for now
    const mid = Math.floor(cluster.features.length / 2);
    const firstHalf = cluster.features.slice(0, mid);
    const secondHalf = cluster.features.slice(mid);

    return [
      {
        id: `${cluster.id}-split-1`,
        features: firstHalf,
        centroid: this.calculateCentroid(firstHalf),
        cohesion: this.calculateCohesion(firstHalf),
        separation: cluster.separation,
        businessRelevance: this.calculateBusinessRelevance(firstHalf),
      },
      {
        id: `${cluster.id}-split-2`,
        features: secondHalf,
        centroid: this.calculateCentroid(secondHalf),
        cohesion: this.calculateCohesion(secondHalf),
        separation: cluster.separation,
        businessRelevance: this.calculateBusinessRelevance(secondHalf),
      },
    ];
  }

  private prioritizeByBusinessImpact(
    clusters: RefinedCluster[]
  ): RefinedCluster[] {
    return clusters.sort((a, b) => b.businessRelevance - a.businessRelevance);
  }

  private generateOverallExecutiveSummary(clusters: ExecutiveCluster[]): {
    topPriorities: string[];
    criticalActions: string[];
    resourceRequirements: string[];
    timeline: string;
  } {
    const topPriorities = clusters
      .filter(c => c.businessImpact.overallScore > 0.7)
      .map(c => c.title)
      .slice(0, 3);

    const criticalActions = clusters
      .flatMap(c => c.recommendedActions)
      .filter(a => a.priority === 'HIGH')
      .map(a => a.action)
      .slice(0, 5);

    const resourceRequirements = [
      'Project management coordination',
      'Technical expertise allocation',
      'Quality assurance enhancement',
    ];

    const timeline =
      '2-8 weeks for immediate actions, 3-6 months for strategic improvements';

    return {
      topPriorities,
      criticalActions,
      resourceRequirements,
      timeline,
    };
  }
}
