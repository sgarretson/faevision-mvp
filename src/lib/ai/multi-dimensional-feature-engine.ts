/**
 * Multi-Dimensional Feature Engineering Engine - FAE-134
 * Expert Lead: Dr. James Park (Semantic Analysis Expert)
 * AI Integration: Dr. Priya Patel (AI Architect)
 * Infrastructure: Jordan Kim (Vercel Engineer)
 *
 * Combines domain classification (60%) + semantic embeddings (30%) + executive factors (10%)
 * Target: 85%+ clustering accuracy, <1s execution time, <200MB memory
 */

import type {
  DomainClassificationResult,
  RootCauseType,
} from './domain-classification-engine';

export interface FeatureEngineeringRequest {
  signalId: string;
  domainClassification: DomainClassificationResult;
  inputText: string;
  metadata: {
    department?: string;
    severity?: string;
    createdBy?: string;
    timestamp: Date;
  };
}

export interface ClusteringFeatures {
  signalId: string;

  // Domain Features (60% weight - from Phase 1)
  domainVector: number[]; // 19 dimensions
  rootCauseScores: Record<RootCauseType, number>;
  organizationalContext: number[];
  urgencyFactors: number[];

  // Semantic Features (30% weight - Phase 2 enhancement)
  textEmbedding: number[]; // 20 dimensions (PCA reduced from 1536)
  domainTerminologyDensity: number;
  semanticComplexity: number;

  // Executive Features (10% weight - business intelligence)
  businessImpact: number;
  actionability: number;
  strategicPriority: number;
  executiveAttention: number;

  // Metadata
  confidence: number;
  generatedAt: Date;
  modelVersion: string;
  processingTime: number;
}

export interface OptimizedFeatureVector {
  // Domain Features (60 dimensions total)
  rootCause: number[]; // 6 dimensions: PROCESS, RESOURCE, COMMUNICATION, TECHNOLOGY, TRAINING, QUALITY
  department: number[]; // 8 dimensions: Structural, Architectural, MEP, PM, QC, Admin, External, Client
  projectPhase: number[]; // 3 dimensions: Design, Construction, Closeout
  urgencyLevel: number[]; // 4 dimensions: Low, Medium, High, Critical
  businessContext: number[]; // 39 dimensions: A&E domain-specific factors

  // Semantic Features (25 dimensions total)
  textEmbedding: number[]; // 20 dimensions: PCA-reduced OpenAI embeddings
  terminologyDensity: number[]; // 3 dimensions: Technical, Business, Client terminology
  semanticPatterns: number[]; // 2 dimensions: Known issue patterns, novel patterns

  // Executive Features (4 dimensions total)
  businessImpact: number; // 0.0-1.0 normalized
  actionability: number; // 0.0-1.0 normalized
  strategicPriority: number; // 0.0-1.0 normalized
  executiveAttention: number; // 0.0-1.0 normalized
}

export interface FeatureEngineeringResult {
  signalId: string;
  features: ClusteringFeatures;
  optimizedVector: OptimizedFeatureVector;
  qualityMetrics: {
    domainRelevance: number;
    semanticQuality: number;
    executiveAlignment: number;
    overallConfidence: number;
  };
  processingTime: number;
  modelVersion: string;
}

/**
 * A&E Department Mapping
 * Based on Marcus Rodriguez's organizational expertise
 */
const AE_DEPARTMENT_MAPPING = {
  STRUCTURAL: 0,
  ARCHITECTURAL: 1,
  MEP: 2,
  PROJECT_MGMT: 3,
  QC: 4,
  ADMIN: 5,
  CLIENT: 6,
  UNKNOWN: 7,
} as const;

/**
 * Project Phase Mapping
 * Based on A&E project lifecycle
 */
const PROJECT_PHASE_MAPPING = {
  DESIGN: 0,
  CONSTRUCTION: 1,
  CLOSEOUT: 2,
  UNKNOWN: 3,
} as const;

/**
 * Urgency Level Mapping
 * Executive priority classification
 */
const URGENCY_MAPPING = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3,
} as const;

/**
 * A&E Terminology Dictionaries
 * Curated by Marcus Rodriguez for domain density calculation
 */
const AE_TERMINOLOGY = {
  TECHNICAL: [
    'structural',
    'architectural',
    'mechanical',
    'electrical',
    'plumbing',
    'HVAC',
    'beam',
    'column',
    'foundation',
    'concrete',
    'steel',
    'seismic',
    'load',
    'CAD',
    'Revit',
    'AutoCAD',
    'BIM',
    'drawing',
    'specification',
    'detail',
    'code',
    'regulation',
    'compliance',
    'inspection',
    'building code',
    'zoning',
  ],
  BUSINESS: [
    'project',
    'deliverable',
    'milestone',
    'timeline',
    'schedule',
    'budget',
    'consultant',
    'contractor',
    'vendor',
    'client',
    'owner',
    'stakeholder',
    'approval',
    'review',
    'submittal',
    'RFI',
    'change order',
    'coordination',
  ],
  CLIENT: [
    'client',
    'owner',
    'end user',
    'stakeholder',
    'requirement',
    'expectation',
    'feedback',
    'approval',
    'satisfaction',
    'communication',
    'meeting',
    'presentation',
  ],
};

/**
 * Multi-Dimensional Feature Engineering Engine
 * Transforms domain classification + semantic analysis into clustering-ready feature vectors
 */
export class MultiDimensionalFeatureEngine {
  private readonly FEATURE_VERSION = '2.0.0';
  private readonly DOMAIN_WEIGHT = 0.6;
  private readonly SEMANTIC_WEIGHT = 0.3;
  private readonly EXECUTIVE_WEIGHT = 0.1;

  /**
   * Main feature engineering function
   * Combines all three feature dimensions into optimized clustering vectors
   */
  async generateFeatures(
    request: FeatureEngineeringRequest
  ): Promise<FeatureEngineeringResult> {
    const startTime = Date.now();

    try {
      // Step 1: Generate domain features (60% weight)
      const domainFeatures = this.generateDomainFeatures(
        request.domainClassification,
        request.metadata
      );

      // Step 2: Generate semantic features (30% weight)
      const semanticFeatures = await this.generateSemanticFeatures(
        request.inputText,
        request.domainClassification
      );

      // Step 3: Generate executive features (10% weight)
      const executiveFeatures = this.generateExecutiveFeatures(
        request.inputText,
        request.domainClassification,
        request.metadata
      );

      // Step 4: Combine into optimized feature vector
      const optimizedVector = this.combineFeatureVectors(
        domainFeatures,
        semanticFeatures,
        executiveFeatures
      );

      // Step 5: Calculate quality metrics
      const qualityMetrics = this.calculateQualityMetrics(
        domainFeatures,
        semanticFeatures,
        executiveFeatures,
        request.domainClassification
      );

      // Step 6: Create final clustering features
      const features: ClusteringFeatures = {
        signalId: request.signalId,
        domainVector: domainFeatures.vector,
        rootCauseScores: domainFeatures.rootCauseScores,
        organizationalContext: domainFeatures.organizationalContext,
        urgencyFactors: domainFeatures.urgencyFactors,
        textEmbedding: semanticFeatures.reducedEmbedding,
        domainTerminologyDensity: semanticFeatures.terminologyDensity,
        semanticComplexity: semanticFeatures.complexity,
        businessImpact: executiveFeatures.businessImpact,
        actionability: executiveFeatures.actionability,
        strategicPriority: executiveFeatures.strategicPriority,
        executiveAttention: executiveFeatures.executiveAttention,
        confidence: qualityMetrics.overallConfidence,
        generatedAt: new Date(),
        modelVersion: this.FEATURE_VERSION,
        processingTime: Date.now() - startTime,
      };

      return {
        signalId: request.signalId,
        features,
        optimizedVector,
        qualityMetrics,
        processingTime: Date.now() - startTime,
        modelVersion: this.FEATURE_VERSION,
      };
    } catch (error) {
      console.error('❌ Feature Engineering Error:', error);
      throw new Error(
        `Feature engineering failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate domain features (60% weight)
   * Based on Phase 1 domain classification results
   */
  private generateDomainFeatures(
    domainClassification: DomainClassificationResult,
    metadata: FeatureEngineeringRequest['metadata']
  ): {
    vector: number[];
    rootCauseScores: Record<RootCauseType, number>;
    organizationalContext: number[];
    urgencyFactors: number[];
  } {
    // Root cause scores (6 dimensions)
    const rootCauseScores: Record<RootCauseType, number> = {
      PROCESS: 0,
      RESOURCE: 0,
      COMMUNICATION: 0,
      TECHNOLOGY: 0,
      TRAINING: 0,
      QUALITY: 0,
    };

    // Set primary root cause confidence
    rootCauseScores[domainClassification.classification.rootCause] =
      domainClassification.classification.confidence;

    // Set alternative scores from rule matches
    for (const match of domainClassification.ruleMatches.slice(0, 2)) {
      if (match.rule !== domainClassification.classification.rootCause) {
        rootCauseScores[match.rule as RootCauseType] = Math.min(
          0.8,
          match.weight * 0.5
        );
      }
    }

    const rootCauseVector = Object.values(rootCauseScores);

    // Department context (8 dimensions)
    const departmentContext = new Array(8).fill(0);
    const deptPriority =
      domainClassification.classification.businessContext.departmentPriority;
    if (deptPriority !== 'UNKNOWN') {
      departmentContext[AE_DEPARTMENT_MAPPING[deptPriority]] = 1.0;
    }

    // Project phase context (3 dimensions)
    const phaseContext = new Array(3).fill(0);
    const projectPhase =
      domainClassification.classification.businessContext.projectPhase;
    if (projectPhase !== 'UNKNOWN') {
      phaseContext[PROJECT_PHASE_MAPPING[projectPhase]] = 1.0;
    }

    // Urgency factors (4 dimensions)
    const urgencyFactors = new Array(4).fill(0);
    const urgencyLevel =
      domainClassification.classification.businessContext.urgencyLevel;
    urgencyFactors[URGENCY_MAPPING[urgencyLevel]] = 1.0;

    // Business context factors (39 dimensions)
    const businessContext = new Array(39).fill(0);

    // Confidence distribution
    businessContext[0] = domainClassification.classification.confidence;

    // Processing time normalized
    businessContext[1] = Math.min(
      1.0,
      domainClassification.processingTime / 500
    );

    // Rule match count
    businessContext[2] = Math.min(
      1.0,
      domainClassification.ruleMatches.length / 6
    );

    // AI enhancement flag
    businessContext[3] = domainClassification.aiEnhancementNeeded ? 1.0 : 0.0;

    // Diagnostic metrics
    const diag = domainClassification.diagnostics;
    businessContext[4] = Math.min(1.0, diag.totalKeywordsFound / 10);
    businessContext[5] = Math.min(1.0, diag.strongMatches / 3);
    businessContext[6] = Math.min(1.0, diag.weakMatches / 3);

    // Fill remaining with normalized random factors based on signal ID
    const signalSeed =
      parseInt(metadata.createdBy?.slice(-4) || '0000', 16) / 65535;
    for (let i = 7; i < 39; i++) {
      businessContext[i] = (signalSeed + i * 0.1) % 1.0;
    }

    // Combine all domain features
    const domainVector = [
      ...rootCauseVector, // 6 dims
      ...departmentContext, // 8 dims
      ...phaseContext, // 3 dims
      ...urgencyFactors, // 4 dims
      ...businessContext, // 39 dims
    ]; // Total: 60 dimensions

    return {
      vector: domainVector,
      rootCauseScores,
      organizationalContext: [...departmentContext, ...phaseContext],
      urgencyFactors,
    };
  }

  /**
   * Generate semantic features (30% weight)
   * Uses simplified embedding simulation for Phase 2 demo
   * TODO: Integrate Vercel AI SDK with OpenAI embeddings in production
   */
  private async generateSemanticFeatures(
    inputText: string,
    domainClassification: DomainClassificationResult
  ): Promise<{
    reducedEmbedding: number[];
    terminologyDensity: number;
    complexity: number;
  }> {
    // Simplified embedding simulation - Production integration ready for Phase 3
    const simulatedEmbedding = this.generateSimulatedEmbedding(
      inputText,
      domainClassification
    );

    // Calculate domain terminology density
    const terminologyDensity = this.calculateTerminologyDensity(inputText);

    // Calculate semantic complexity
    const complexity = this.calculateSemanticComplexity(inputText);

    return {
      reducedEmbedding: simulatedEmbedding,
      terminologyDensity,
      complexity,
    };
  }

  /**
   * Generate simulated embeddings based on text content and domain classification
   * This will be replaced with actual OpenAI embeddings via Vercel AI SDK
   */
  private generateSimulatedEmbedding(
    text: string,
    domainClassification: DomainClassificationResult
  ): number[] {
    const embedding = new Array(20).fill(0);
    const normalizedText = text.toLowerCase();

    // Root cause influence on embedding
    const rootCauseInfluence = {
      PROCESS: [0.8, 0.3, 0.1, 0.9, 0.2],
      RESOURCE: [0.2, 0.9, 0.7, 0.1, 0.4],
      COMMUNICATION: [0.4, 0.1, 0.8, 0.3, 0.9],
      TECHNOLOGY: [0.1, 0.4, 0.2, 0.8, 0.6],
      TRAINING: [0.6, 0.2, 0.4, 0.5, 0.8],
      QUALITY: [0.3, 0.6, 0.9, 0.2, 0.7],
    };

    const influence =
      rootCauseInfluence[domainClassification.classification.rootCause];
    for (let i = 0; i < 5; i++) {
      embedding[i] =
        influence[i] * domainClassification.classification.confidence;
    }

    // Text length and complexity influence
    const textComplexity = Math.min(1.0, normalizedText.length / 1000);
    const wordCount = normalizedText.split(' ').length;
    const avgWordLength = normalizedText.replace(/\s/g, '').length / wordCount;

    embedding[5] = textComplexity;
    embedding[6] = Math.min(1.0, wordCount / 100);
    embedding[7] = Math.min(1.0, avgWordLength / 10);

    // Domain terminology influence
    for (const [category, terms] of Object.entries(AE_TERMINOLOGY)) {
      const categoryIndex =
        category === 'TECHNICAL' ? 8 : category === 'BUSINESS' ? 12 : 16;
      const density =
        terms.reduce((count, term) => {
          return count + (normalizedText.includes(term.toLowerCase()) ? 1 : 0);
        }, 0) / terms.length;

      for (let i = 0; i < 4; i++) {
        embedding[categoryIndex + i] = density * (0.8 + Math.random() * 0.4);
      }
    }

    // Normalize embedding to unit vector
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0)
    );
    return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding;
  }

  /**
   * Calculate A&E domain terminology density
   */
  private calculateTerminologyDensity(text: string): number {
    const normalizedText = text.toLowerCase();
    const densities = [];

    for (const [category, terms] of Object.entries(AE_TERMINOLOGY)) {
      const foundTerms = terms.filter(term =>
        normalizedText.includes(term.toLowerCase())
      ).length;
      densities.push(foundTerms / terms.length);
    }

    return (
      densities.reduce((sum, density) => sum + density, 0) / densities.length
    );
  }

  /**
   * Calculate semantic complexity score
   */
  private calculateSemanticComplexity(text: string): number {
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const avgWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const vocabularyRichness = uniqueWords.size / words.length;

    return Math.min(1.0, (avgWordLength / 10 + vocabularyRichness) / 2);
  }

  /**
   * Generate executive features (10% weight)
   * Business intelligence factors for executive decision making
   */
  private generateExecutiveFeatures(
    inputText: string,
    domainClassification: DomainClassificationResult,
    metadata: FeatureEngineeringRequest['metadata']
  ): {
    businessImpact: number;
    actionability: number;
    strategicPriority: number;
    executiveAttention: number;
  } {
    const normalizedText = inputText.toLowerCase();
    const businessContext = domainClassification.classification.businessContext;

    // Business impact score (cost + timeline + client satisfaction)
    let businessImpact = 0.5; // Base score

    // Cost impact indicators
    if (normalizedText.includes('budget') || normalizedText.includes('cost')) {
      businessImpact += 0.2;
    }

    // Timeline impact indicators
    if (
      normalizedText.includes('delay') ||
      normalizedText.includes('timeline') ||
      normalizedText.includes('deadline')
    ) {
      businessImpact += 0.2;
    }

    // Client satisfaction indicators
    if (
      normalizedText.includes('client') ||
      normalizedText.includes('satisfaction') ||
      normalizedText.includes('complaint')
    ) {
      businessImpact += 0.1;
    }

    // Urgency level influence
    const urgencyMultiplier = {
      LOW: 0.8,
      MEDIUM: 1.0,
      HIGH: 1.2,
      CRITICAL: 1.5,
    };
    businessImpact *= urgencyMultiplier[businessContext.urgencyLevel];

    // Actionability score (effort required + resource availability)
    let actionability = 0.6; // Base score

    // Simple problem indicators increase actionability
    if (
      normalizedText.includes('simple') ||
      normalizedText.includes('quick') ||
      normalizedText.includes('easy')
    ) {
      actionability += 0.2;
    }

    // Complex problem indicators decrease actionability
    if (
      normalizedText.includes('complex') ||
      normalizedText.includes('difficult') ||
      normalizedText.includes('major')
    ) {
      actionability -= 0.2;
    }

    // Resource availability by department
    const departmentActionability = {
      STRUCTURAL: 0.7,
      ARCHITECTURAL: 0.8,
      MEP: 0.6,
      PROJECT_MGMT: 0.9,
      QC: 0.8,
      ADMIN: 0.9,
      CLIENT: 0.4,
      UNKNOWN: 0.5,
    };
    actionability *=
      departmentActionability[businessContext.departmentPriority];

    // Strategic priority (alignment with company goals)
    let strategicPriority = 0.5; // Base score

    // High-value project indicators
    if (
      normalizedText.includes('enterprise') ||
      normalizedText.includes('major') ||
      normalizedText.includes('strategic')
    ) {
      strategicPriority += 0.3;
    }

    // Quality and compliance alignment
    if (domainClassification.classification.rootCause === 'QUALITY') {
      strategicPriority += 0.2;
    }

    // Client tier influence
    const clientTierPriority = {
      ENTERPRISE: 1.4,
      MID_MARKET: 1.1,
      RESIDENTIAL: 0.9,
      UNKNOWN: 1.0,
    };
    strategicPriority *= clientTierPriority[businessContext.clientTier];

    // Executive attention score (visibility + stakeholder interest)
    let executiveAttention = 0.4; // Base score

    // High-visibility keywords
    if (
      normalizedText.includes('executive') ||
      normalizedText.includes('board') ||
      normalizedText.includes('ceo')
    ) {
      executiveAttention += 0.4;
    }

    // Client escalation indicators
    if (
      normalizedText.includes('escalation') ||
      normalizedText.includes('complaint') ||
      normalizedText.includes('urgent')
    ) {
      executiveAttention += 0.3;
    }

    // Root cause attention weighting
    const rootCauseAttention = {
      PROCESS: 0.8,
      RESOURCE: 1.0,
      COMMUNICATION: 1.2,
      TECHNOLOGY: 0.7,
      TRAINING: 0.6,
      QUALITY: 1.3,
    };
    executiveAttention *=
      rootCauseAttention[domainClassification.classification.rootCause];

    // Normalize all scores to 0.0-1.0 range
    return {
      businessImpact: Math.max(0.0, Math.min(1.0, businessImpact)),
      actionability: Math.max(0.0, Math.min(1.0, actionability)),
      strategicPriority: Math.max(0.0, Math.min(1.0, strategicPriority)),
      executiveAttention: Math.max(0.0, Math.min(1.0, executiveAttention)),
    };
  }

  /**
   * Combine all feature vectors into optimized 89-dimension vector
   */
  private combineFeatureVectors(
    domainFeatures: any,
    semanticFeatures: any,
    executiveFeatures: any
  ): OptimizedFeatureVector {
    return {
      // Domain Features (60 dimensions)
      rootCause: Object.values(domainFeatures.rootCauseScores), // 6
      department: domainFeatures.organizationalContext.slice(0, 8), // 8
      projectPhase: domainFeatures.organizationalContext.slice(8, 11), // 3
      urgencyLevel: domainFeatures.urgencyFactors, // 4
      businessContext: domainFeatures.vector.slice(21), // 39

      // Semantic Features (25 dimensions)
      textEmbedding: semanticFeatures.reducedEmbedding, // 20
      terminologyDensity: [
        semanticFeatures.terminologyDensity,
        semanticFeatures.complexity,
        (semanticFeatures.terminologyDensity + semanticFeatures.complexity) / 2,
      ], // 3
      semanticPatterns: [
        Math.random() * 0.5 + 0.25, // Known patterns (simulated)
        Math.random() * 0.3 + 0.1, // Novel patterns (simulated)
      ], // 2

      // Executive Features (4 dimensions)
      businessImpact: executiveFeatures.businessImpact,
      actionability: executiveFeatures.actionability,
      strategicPriority: executiveFeatures.strategicPriority,
      executiveAttention: executiveFeatures.executiveAttention,
    };
  }

  /**
   * Calculate feature quality metrics
   */
  private calculateQualityMetrics(
    domainFeatures: any,
    semanticFeatures: any,
    executiveFeatures: any,
    domainClassification: DomainClassificationResult
  ): {
    domainRelevance: number;
    semanticQuality: number;
    executiveAlignment: number;
    overallConfidence: number;
  } {
    // Domain relevance based on classification confidence
    const domainRelevance = domainClassification.classification.confidence;

    // Semantic quality based on terminology density and complexity
    const semanticQuality =
      (semanticFeatures.terminologyDensity + semanticFeatures.complexity) / 2;

    // Executive alignment based on business factors
    const executiveAlignment =
      (executiveFeatures.businessImpact +
        executiveFeatures.actionability +
        executiveFeatures.strategicPriority +
        executiveFeatures.executiveAttention) /
      4;

    // Overall confidence weighted by feature importance
    const overallConfidence =
      domainRelevance * this.DOMAIN_WEIGHT +
      semanticQuality * this.SEMANTIC_WEIGHT +
      executiveAlignment * this.EXECUTIVE_WEIGHT;

    return {
      domainRelevance,
      semanticQuality,
      executiveAlignment,
      overallConfidence,
    };
  }

  /**
   * Batch process multiple signals for feature engineering
   */
  async batchGenerateFeatures(
    requests: FeatureEngineeringRequest[]
  ): Promise<FeatureEngineeringResult[]> {
    const results: FeatureEngineeringResult[] = [];

    // Process in small batches to avoid memory issues
    const batchSize = 5;
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);

      const batchPromises = batch.map(request =>
        this.generateFeatures(request)
      );

      const batchResults = await Promise.allSettled(batchPromises);

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error('❌ Batch Feature Engineering Error:', result.reason);
        }
      }
    }

    console.log(`📊 Batch Feature Engineering Complete:`, {
      totalRequests: requests.length,
      successfulResults: results.length,
      batchSize,
    });

    return results;
  }
}
