/**
 * Feature Engineering Engine - Sprint 2 Task 1
 * Expert: Dr. Elena Rodriguez (Advanced Clustering Specialist)
 * Supporting: Dr. James Park (Semantic Analysis), Dr. Rachel Kim (AI Tagging)
 *
 * Multi-dimensional feature engineering combining domain expertise with semantic analysis
 */

import type {
  ClusteringFeatures,
  DomainFeatures,
  SemanticFeatures,
  FeatureEngineeringConfig,
  FeatureEngineeringResult,
  FeatureSimilarity,
  RootCauseCategory,
  DepartmentCategory,
} from '@/types/clustering-features';
import {
  DEFAULT_FEATURE_CONFIG,
  ROOT_CAUSE_MAPPING,
  DEPARTMENT_MAPPING,
  FEATURE_ENGINEERING_CONSTANTS,
} from '@/types/clustering-features';
import type { EnhancedTagging } from '@/types/enhanced-tagging';

/**
 * Advanced Feature Engineering Engine
 * Transforms enhanced tagging data into multi-dimensional clustering features
 */
export class FeatureEngineeringEngine {
  private config: FeatureEngineeringConfig;
  private version = '2.0.0';
  private similarityCache = new Map<string, number>();

  constructor(config: Partial<FeatureEngineeringConfig> = {}) {
    this.config = { ...DEFAULT_FEATURE_CONFIG, ...config };
  }

  /**
   * Generate comprehensive clustering features from enhanced tagging
   */
  async generateClusteringFeatures(
    signalId: string,
    enhancedTagging: EnhancedTagging,
    signalMetadata?: {
      title?: string;
      description?: string;
      department?: string;
      severity?: string;
      [key: string]: any;
    }
  ): Promise<FeatureEngineeringResult> {
    const startTime = Date.now();
    const warnings: string[] = [];

    try {
      // Generate domain features (60% weight)
      const domainFeatures = this.generateDomainFeatures(
        enhancedTagging,
        signalMetadata
      );

      // Generate semantic features (40% weight)
      const semanticFeatures = await this.generateSemanticFeatures(
        enhancedTagging,
        signalMetadata
      );

      // Combine features with weighted approach
      const combinedVector = this.combineFeatures(
        domainFeatures,
        semanticFeatures
      );

      // Calculate overall confidence and quality
      const confidence = this.calculateOverallConfidence(
        domainFeatures,
        semanticFeatures
      );
      const qualityScore = this.calculateQualityScore(
        domainFeatures,
        semanticFeatures
      );

      const processingTime = Date.now() - startTime;

      // Validate performance requirements
      if (
        processingTime >
        FEATURE_ENGINEERING_CONSTANTS.MAX_FEATURE_GENERATION_TIME
      ) {
        warnings.push(
          `Feature generation took ${processingTime}ms, exceeding ${FEATURE_ENGINEERING_CONSTANTS.MAX_FEATURE_GENERATION_TIME}ms target`
        );
      }

      const features: ClusteringFeatures = {
        signalId,
        domainFeatures,
        semanticFeatures,
        combinedVector,
        featureVersion: this.version,
        generatedAt: new Date(),
        confidence,
        generationTime: processingTime,
        qualityScore,
        sourceTagging: enhancedTagging,
      };

      // Calculate quality metrics
      const qualityMetrics = {
        domainFeatureQuality: this.assessDomainFeatureQuality(domainFeatures),
        semanticFeatureQuality:
          this.assessSemanticFeatureQuality(semanticFeatures),
        overallQuality: qualityScore,
        consistencyScore: confidence,
      };

      return {
        features,
        success: true,
        warnings,
        qualityMetrics,
      };
    } catch (error: any) {
      console.error('Feature engineering failed:', error);

      return {
        features: {} as ClusteringFeatures,
        success: false,
        error: error.message,
        warnings,
        qualityMetrics: {
          domainFeatureQuality: 0,
          semanticFeatureQuality: 0,
          overallQuality: 0,
          consistencyScore: 0,
        },
      };
    }
  }

  /**
   * Generate domain features from enhanced tagging (60% weight)
   */
  private generateDomainFeatures(
    tagging: EnhancedTagging,
    metadata?: Record<string, any>
  ): DomainFeatures {
    // Root Cause One-Hot Encoding
    const rootCauseVector = this.generateRootCauseVector(tagging.rootCause);

    // Department Involvement Vector
    const departmentVector = this.generateDepartmentVector(
      tagging.businessContext.department,
      metadata?.department
    );

    // Business Impact Scoring
    const businessImpactVector = this.generateBusinessImpactVector(
      tagging.businessContext
    );

    // A&E Domain Context
    const aeDomainVector = this.generateAEDomainVector(
      tagging.aeSpecific || {}
    );

    // Calculate additional domain metrics
    const departmentComplexity = this.calculateDepartmentComplexity(tagging);
    const overallImpactScore = this.calculateOverallImpactScore(
      tagging.businessContext
    );
    const domainRelevance = this.calculateDomainRelevance(tagging);
    const timelineUrgency = this.mapUrgencyToScore(
      tagging.businessContext.urgency
    );
    const stakeholderCount = this.calculateStakeholderCount(tagging);
    const processComplexity = this.calculateProcessComplexity(tagging);

    return {
      rootCauseVector,
      rootCauseConfidence: tagging.rootCause.confidence,
      departmentVector,
      departmentComplexity,
      businessImpactVector,
      overallImpactScore,
      aeDomainVector,
      domainRelevance,
      timelineUrgency,
      stakeholderCount,
      processComplexity,
    };
  }

  /**
   * Generate semantic features from enhanced tagging (40% weight)
   */
  private async generateSemanticFeatures(
    tagging: EnhancedTagging,
    metadata?: Record<string, any>
  ): Promise<SemanticFeatures> {
    // For now, generate mock embeddings since we don't have OpenAI in local env
    // In production, these would be generated using the enhanced tagging system
    const titleEmbedding = this.generateMockEmbedding(
      metadata?.title || 'Signal Title',
      FEATURE_ENGINEERING_CONSTANTS.TITLE_EMBEDDING_DIMENSIONS
    );

    const descriptionEmbedding = this.generateMockEmbedding(
      metadata?.description || 'Signal Description',
      FEATURE_ENGINEERING_CONSTANTS.DESCRIPTION_EMBEDDING_DIMENSIONS
    );

    const businessContextVector =
      this.generateBusinessContextEmbedding(tagging);
    const domainTerminologyVector =
      this.generateDomainTerminologyEmbedding(tagging);

    // Calculate semantic metrics
    const textComplexity = this.calculateTextComplexity(
      metadata?.description || ''
    );
    const domainTerminologyDensity = this.calculateDomainTerminologyDensity(
      metadata?.title || '',
      metadata?.description || ''
    );
    const semanticClarity = this.calculateSemanticClarity(
      metadata?.description || ''
    );

    // Generate entity embeddings
    const entityEmbeddings = tagging.extractedEntities.map((entity: any) => ({
      type: entity.type,
      embedding: this.generateMockEmbedding(entity.value, 128),
      importance: entity.confidence || 0.5,
    }));

    return {
      titleEmbedding,
      descriptionEmbedding,
      businessContextVector,
      domainTerminologyVector,
      textComplexity,
      domainTerminologyDensity,
      semanticClarity,
      entityEmbeddings,
    };
  }

  /**
   * Generate root cause one-hot vector
   */
  private generateRootCauseVector(rootCause: any): number[] {
    const vector = new Array(
      FEATURE_ENGINEERING_CONSTANTS.ROOT_CAUSE_DIMENSIONS
    ).fill(0);

    // Primary root cause
    const primaryIndex =
      ROOT_CAUSE_MAPPING[rootCause.primary as RootCauseCategory];
    if (primaryIndex !== undefined) {
      vector[primaryIndex] = rootCause.confidence || 0.6;
    }

    // Alternative root causes (weighted by confidence)
    if (rootCause.alternatives) {
      rootCause.alternatives.forEach((alt: any) => {
        const altIndex = ROOT_CAUSE_MAPPING[alt.cause as RootCauseCategory];
        if (altIndex !== undefined) {
          vector[altIndex] += (alt.confidence || 0.3) * 0.5; // Reduced weight for alternatives
        }
      });
    }

    return vector;
  }

  /**
   * Generate department involvement vector
   */
  private generateDepartmentVector(
    primaryDept?: string,
    metadataDept?: string
  ): number[] {
    const vector = new Array(
      FEATURE_ENGINEERING_CONSTANTS.DEPARTMENT_DIMENSIONS
    ).fill(0);

    // Map department names to categories
    const deptName = (primaryDept || metadataDept || '').toLowerCase();
    let category: DepartmentCategory = 'OTHER';

    if (deptName.includes('architecture')) category = 'ARCHITECTURE';
    else if (deptName.includes('field') || deptName.includes('construction'))
      category = 'FIELD_SERVICES';
    else if (deptName.includes('project') || deptName.includes('management'))
      category = 'PROJECT_MANAGEMENT';
    else if (deptName.includes('executive') || deptName.includes('leadership'))
      category = 'EXECUTIVE';

    const index = DEPARTMENT_MAPPING[category];
    vector[index] = 1.0;

    return vector;
  }

  /**
   * Generate business impact vector
   */
  private generateBusinessImpactVector(businessContext: any): number[] {
    const severity = this.mapSeverityToScore(businessContext.impact);
    const urgency = this.mapUrgencyToScore(businessContext.urgency);
    const cost = this.mapCostToScore(businessContext.estimatedCost);
    const clientImpact = this.calculateClientImpact(businessContext);

    return [severity, urgency, cost, clientImpact];
  }

  /**
   * Generate A&E domain vector
   */
  private generateAEDomainVector(aeSpecific: any): number[] {
    const projectPhase = this.mapProjectPhaseToScore(aeSpecific.projectPhase);
    const buildingType = this.mapBuildingTypeToScore(aeSpecific.buildingType);
    const qualityCategory = this.mapQualityCategoryToScore(
      aeSpecific.qualityCategory
    );
    const complianceRisk = this.calculateComplianceRisk(aeSpecific);
    const scheduleImpact = this.calculateScheduleImpact(aeSpecific);
    const budgetImpact = this.calculateBudgetImpact(aeSpecific);

    return [
      projectPhase,
      buildingType,
      qualityCategory,
      complianceRisk,
      scheduleImpact,
      budgetImpact,
    ];
  }

  /**
   * Combine domain and semantic features with proper weighting
   */
  private combineFeatures(
    domain: DomainFeatures,
    semantic: SemanticFeatures
  ): number[] {
    // Normalize domain features
    const normalizedDomain = this.normalizeDomainFeatures(domain);

    // Apply weighting
    const weightedDomain = normalizedDomain.map(
      (value: number) => value * this.config.domainWeight
    );

    // For semantic features, use a subset to avoid excessive dimensionality
    const semanticSubset = [
      ...semantic.titleEmbedding
        .slice(0, 64)
        .map(
          (value: number) =>
            value * this.config.semanticWeight * this.config.titleWeight
        ),
      ...semantic.descriptionEmbedding
        .slice(0, 64)
        .map(
          (value: number) =>
            value * this.config.semanticWeight * this.config.descriptionWeight
        ),
      ...semantic.businessContextVector
        .slice(0, 32)
        .map(
          (value: number) =>
            value *
            this.config.semanticWeight *
            this.config.businessContextWeight
        ),
    ];

    return [...weightedDomain, ...semanticSubset];
  }

  /**
   * Calculate similarity between two clustering features
   */
  calculateSimilarity(
    features1: ClusteringFeatures,
    features2: ClusteringFeatures
  ): FeatureSimilarity {
    const cacheKey = `${features1.signalId}:${features2.signalId}`;

    // Check cache first
    if (this.config.cacheSimilarities && this.similarityCache.has(cacheKey)) {
      const cachedSimilarity = this.similarityCache.get(cacheKey)!;
      return {
        signalId1: features1.signalId,
        signalId2: features2.signalId,
        domainSimilarity: cachedSimilarity,
        semanticSimilarity: cachedSimilarity,
        combinedSimilarity: cachedSimilarity,
        confidence: 0.9,
        calculatedAt: new Date(),
      };
    }

    // Calculate domain similarity (Euclidean distance for structured features)
    const domainSimilarity = this.calculateDomainSimilarity(
      features1.domainFeatures,
      features2.domainFeatures
    );

    // Calculate semantic similarity (Cosine similarity for embeddings)
    const semanticSimilarity = this.calculateSemanticSimilarity(
      features1.semanticFeatures,
      features2.semanticFeatures
    );

    // Weighted combination
    const combinedSimilarity =
      domainSimilarity * this.config.domainWeight +
      semanticSimilarity * this.config.semanticWeight;

    // Calculate confidence based on feature quality
    const confidence = Math.min(features1.confidence, features2.confidence);

    // Cache result
    if (
      this.config.cacheSimilarities &&
      this.similarityCache.size < this.config.maxCacheSize
    ) {
      this.similarityCache.set(cacheKey, combinedSimilarity);
    }

    return {
      signalId1: features1.signalId,
      signalId2: features2.signalId,
      domainSimilarity,
      semanticSimilarity,
      combinedSimilarity,
      confidence,
      calculatedAt: new Date(),
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private generateMockEmbedding(text: string, dimensions: number): number[] {
    // Generate deterministic mock embedding based on text content
    const hash = this.simpleHash(text);
    const embedding = [];

    for (let i = 0; i < dimensions; i++) {
      const seed = hash + i;
      embedding.push((Math.sin(seed) + 1) / 2); // Normalize to 0-1 range
    }

    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private generateBusinessContextEmbedding(tagging: EnhancedTagging): number[] {
    // Generate embedding based on business context
    const contextText = `${tagging.businessContext.department} ${tagging.businessContext.urgency} ${tagging.businessContext.impact}`;
    return this.generateMockEmbedding(
      contextText,
      FEATURE_ENGINEERING_CONSTANTS.BUSINESS_CONTEXT_DIMENSIONS
    );
  }

  private generateDomainTerminologyEmbedding(
    tagging: EnhancedTagging
  ): number[] {
    // Generate embedding based on A&E terminology
    const aeText = Object.values(tagging.aeSpecific || {}).join(' ');
    return this.generateMockEmbedding(
      aeText,
      FEATURE_ENGINEERING_CONSTANTS.DOMAIN_TERMINOLOGY_DIMENSIONS
    );
  }

  private normalizeDomainFeatures(domain: DomainFeatures): number[] {
    return [
      ...domain.rootCauseVector,
      ...domain.departmentVector,
      ...domain.businessImpactVector,
      ...domain.aeDomainVector,
      domain.rootCauseConfidence,
      domain.departmentComplexity,
      domain.overallImpactScore,
      domain.domainRelevance,
      domain.timelineUrgency,
      domain.stakeholderCount,
      domain.processComplexity,
    ];
  }

  private calculateDomainSimilarity(
    domain1: DomainFeatures,
    domain2: DomainFeatures
  ): number {
    const vector1 = this.normalizeDomainFeatures(domain1);
    const vector2 = this.normalizeDomainFeatures(domain2);

    // Euclidean distance normalized to similarity score
    const distance = this.euclideanDistance(vector1, vector2);
    const maxDistance = Math.sqrt(vector1.length); // Maximum possible distance
    return 1 - distance / maxDistance;
  }

  private calculateSemanticSimilarity(
    semantic1: SemanticFeatures,
    semantic2: SemanticFeatures
  ): number {
    // Cosine similarity for title embeddings
    const titleSimilarity = this.cosineSimilarity(
      semantic1.titleEmbedding,
      semantic2.titleEmbedding
    );

    // Cosine similarity for description embeddings
    const descSimilarity = this.cosineSimilarity(
      semantic1.descriptionEmbedding,
      semantic2.descriptionEmbedding
    );

    // Business context similarity
    const contextSimilarity = this.cosineSimilarity(
      semantic1.businessContextVector,
      semantic2.businessContextVector
    );

    // Weighted combination
    return (
      titleSimilarity * 0.5 + descSimilarity * 0.4 + contextSimilarity * 0.1
    );
  }

  private euclideanDistance(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) {
      throw new Error('Vectors must have the same length');
    }

    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
      const diff = vector1[i] - vector2[i];
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }

  private cosineSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) {
      return 0;
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      norm1 += vector1[i] * vector1[i];
      norm2 += vector2[i] * vector2[i];
    }

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Mapping and calculation helper methods
  private mapSeverityToScore(severity?: string): number {
    switch (severity?.toUpperCase()) {
      case 'SEVERE':
        return 1.0;
      case 'SIGNIFICANT':
        return 0.75;
      case 'MODERATE':
        return 0.5;
      case 'MINIMAL':
        return 0.25;
      default:
        return 0.5;
    }
  }

  private mapUrgencyToScore(urgency?: string): number {
    switch (urgency?.toUpperCase()) {
      case 'CRITICAL':
        return 1.0;
      case 'HIGH':
        return 0.75;
      case 'MEDIUM':
        return 0.5;
      case 'LOW':
        return 0.25;
      default:
        return 0.5;
    }
  }

  private mapCostToScore(cost?: string): number {
    switch (cost?.toUpperCase()) {
      case 'HIGH':
        return 1.0;
      case 'MEDIUM':
        return 0.5;
      case 'LOW':
        return 0.25;
      case 'UNKNOWN':
        return 0.5;
      default:
        return 0.5;
    }
  }

  private calculateClientImpact(businessContext: any): number {
    // Estimate client impact based on urgency and severity
    const urgencyScore = this.mapUrgencyToScore(businessContext.urgency);
    const severityScore = this.mapSeverityToScore(businessContext.impact);
    return (urgencyScore + severityScore) / 2;
  }

  private mapProjectPhaseToScore(phase?: string): number {
    switch (phase?.toUpperCase()) {
      case 'DESIGN':
        return 0.2;
      case 'PERMITTING':
        return 0.4;
      case 'CONSTRUCTION':
        return 0.8;
      case 'CLOSEOUT':
        return 0.9;
      case 'WARRANTY':
        return 1.0;
      default:
        return 0.5;
    }
  }

  private mapBuildingTypeToScore(type?: string): number {
    switch (type?.toUpperCase()) {
      case 'RESIDENTIAL':
        return 0.3;
      case 'COMMERCIAL':
        return 0.6;
      case 'INDUSTRIAL':
        return 0.8;
      case 'MIXED_USE':
        return 0.7;
      case 'INFRASTRUCTURE':
        return 1.0;
      default:
        return 0.5;
    }
  }

  private mapQualityCategoryToScore(category?: string): number {
    switch (category?.toUpperCase()) {
      case 'DESIGN_ERROR':
        return 0.6;
      case 'CONSTRUCTION_DEFECT':
        return 0.8;
      case 'CODE_COMPLIANCE':
        return 1.0;
      case 'SAFETY':
        return 1.0;
      case 'COORDINATION':
        return 0.4;
      default:
        return 0.5;
    }
  }

  private calculateDepartmentComplexity(tagging: EnhancedTagging): number {
    // Estimate complexity based on cross-department coordination needs
    const stakeholders = tagging.processContext?.stakeholders || [];
    return Math.min(stakeholders.length / 5, 1.0);
  }

  private calculateOverallImpactScore(businessContext: any): number {
    const urgency = this.mapUrgencyToScore(businessContext.urgency);
    const impact = this.mapSeverityToScore(businessContext.impact);
    const cost = this.mapCostToScore(businessContext.estimatedCost);
    return (urgency + impact + cost) / 3;
  }

  private calculateDomainRelevance(tagging: EnhancedTagging): number {
    // Calculate how relevant this signal is to A&E industry
    const hasAESpecific =
      Object.keys(tagging.aeSpecific || {}).length > 0 ? 0.5 : 0;
    const hasProcessContext =
      Object.keys(tagging.processContext || {}).length > 0 ? 0.3 : 0;
    const hasEntities = tagging.extractedEntities?.length > 0 ? 0.2 : 0;
    return hasAESpecific + hasProcessContext + hasEntities;
  }

  private calculateStakeholderCount(tagging: EnhancedTagging): number {
    const stakeholders = tagging.processContext?.stakeholders || [];
    return Math.min(stakeholders.length / 10, 1.0);
  }

  private calculateProcessComplexity(tagging: EnhancedTagging): number {
    const workflows = tagging.processContext?.affectedWorkflows || [];
    const dependencies = tagging.processContext?.dependencies || [];
    const blockers = tagging.processContext?.blockers || [];
    const totalComplexity =
      workflows.length + dependencies.length + blockers.length;
    return Math.min(totalComplexity / 10, 1.0);
  }

  private calculateTextComplexity(text: string): number {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / Math.max(sentences, 1);
    return Math.min(avgWordsPerSentence / 20, 1.0);
  }

  private calculateDomainTerminologyDensity(
    title: string,
    description: string
  ): number {
    const text = `${title} ${description}`.toLowerCase();
    const aeTerms = [
      'construction',
      'building',
      'design',
      'architecture',
      'structural',
      'foundation',
      'concrete',
      'steel',
      'permits',
      'inspection',
      'compliance',
      'code',
      'safety',
      'client',
      'project',
      'schedule',
      'budget',
      'quality',
      'rework',
      'coordination',
    ];

    const foundTerms = aeTerms.filter(term => text.includes(term));
    return foundTerms.length / aeTerms.length;
  }

  private calculateSemanticClarity(text: string): number {
    // Simple heuristic for text clarity
    const hasCompleteWords = !/[^\w\s]/.test(text);
    const hasReasonableLength = text.length > 10 && text.length < 1000;
    const hasStructure = text.includes('.') || text.includes(',');

    return (
      (hasCompleteWords ? 0.4 : 0) +
      (hasReasonableLength ? 0.3 : 0) +
      (hasStructure ? 0.3 : 0)
    );
  }

  private calculateComplianceRisk(aeSpecific: any): number {
    return aeSpecific.qualityCategory === 'CODE_COMPLIANCE' ? 1.0 : 0.3;
  }

  private calculateScheduleImpact(aeSpecific: any): number {
    return aeSpecific.projectPhase === 'CONSTRUCTION' ? 0.8 : 0.4;
  }

  private calculateBudgetImpact(aeSpecific: any): number {
    return aeSpecific.qualityCategory === 'CONSTRUCTION_DEFECT' ? 0.9 : 0.3;
  }

  private calculateOverallConfidence(
    domain: DomainFeatures,
    semantic: SemanticFeatures
  ): number {
    return (
      (domain.rootCauseConfidence +
        semantic.semanticClarity +
        semantic.domainTerminologyDensity) /
      3
    );
  }

  private calculateQualityScore(
    domain: DomainFeatures,
    semantic: SemanticFeatures
  ): number {
    const domainQuality = this.assessDomainFeatureQuality(domain);
    const semanticQuality = this.assessSemanticFeatureQuality(semantic);
    return (
      domainQuality * this.config.domainWeight +
      semanticQuality * this.config.semanticWeight
    );
  }

  private assessDomainFeatureQuality(domain: DomainFeatures): number {
    // Assess quality based on completeness and consistency
    const hasRootCause = domain.rootCauseVector.some(v => v > 0) ? 0.3 : 0;
    const hasDepartment = domain.departmentVector.some(v => v > 0) ? 0.3 : 0;
    const hasImpact = domain.overallImpactScore > 0 ? 0.2 : 0;
    const hasRelevance = domain.domainRelevance > 0 ? 0.2 : 0;
    return hasRootCause + hasDepartment + hasImpact + hasRelevance;
  }

  private assessSemanticFeatureQuality(semantic: SemanticFeatures): number {
    // Assess quality based on embedding completeness and metrics
    const hasEmbeddings =
      semantic.titleEmbedding.length > 0 &&
      semantic.descriptionEmbedding.length > 0
        ? 0.4
        : 0;
    const clarityScore = semantic.semanticClarity * 0.3;
    const terminologyScore = semantic.domainTerminologyDensity * 0.3;
    return hasEmbeddings + clarityScore + terminologyScore;
  }
}

// Export singleton instance
export const featureEngineeringEngine = new FeatureEngineeringEngine();
