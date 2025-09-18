/**
 * AI Pipeline Integration - FAE-134
 * Expert Lead: Dr. Priya Patel (AI Architect)
 *
 * Orchestrates Phase 1 (Domain Classification) + Phase 2 (Feature Engineering)
 * Prepares for Phase 3 (Executive Hybrid Clustering)
 */

import { AEDomainClassificationEngine } from './domain-classification-engine';
import { MultiDimensionalFeatureEngine } from './multi-dimensional-feature-engine';
import { SignalDomainProcessor } from './signal-domain-integration';
import type {
  DomainClassificationRequest,
  DomainClassificationResult,
} from './domain-classification-engine';
import type {
  FeatureEngineeringRequest,
  FeatureEngineeringResult,
  ClusteringFeatures,
} from './multi-dimensional-feature-engine';
import { prisma } from '@/lib/prisma';

export interface PipelineProcessingRequest {
  signalId: string;
  title?: string;
  description: string;
  metadata?: {
    department?: string;
    severity?: string;
    createdBy?: string;
    tags?: string[];
  };
}

export interface PipelineProcessingResult {
  signalId: string;
  domainClassification: DomainClassificationResult;
  featureEngineering: FeatureEngineeringResult;
  schemaUpdated: boolean;
  readyForClustering: boolean;
  processingMetrics: {
    totalTime: number;
    domainTime: number;
    featureTime: number;
    schemaTime: number;
  };
  qualityAssessment: {
    overallConfidence: number;
    domainRelevance: number;
    semanticQuality: number;
    executiveAlignment: number;
    recommendedAction: 'CLUSTER_READY' | 'AI_ENHANCE' | 'MANUAL_REVIEW';
  };
}

export interface BatchPipelineRequest {
  signals: PipelineProcessingRequest[];
  options?: {
    parallel?: boolean;
    batchSize?: number;
    updateSchema?: boolean;
  };
}

export interface BatchPipelineResult {
  results: PipelineProcessingResult[];
  summary: {
    totalProcessed: number;
    successful: number;
    failed: number;
    clusterReady: number;
    needsEnhancement: number;
    needsReview: number;
    averageConfidence: number;
    totalProcessingTime: number;
  };
}

/**
 * AI Pipeline Orchestrator
 * Manages the complete flow from raw input to clustering-ready features
 */
export class AIPipelineIntegrator {
  private domainEngine: AEDomainClassificationEngine;
  private featureEngine: MultiDimensionalFeatureEngine;
  private signalProcessor: SignalDomainProcessor;

  constructor() {
    this.domainEngine = new AEDomainClassificationEngine();
    this.featureEngine = new MultiDimensionalFeatureEngine();
    this.signalProcessor = new SignalDomainProcessor();
  }

  /**
   * Process a single signal through the complete AI pipeline
   * Phase 1 → Phase 2 → Schema Update → Clustering Preparation
   */
  async processSignal(
    request: PipelineProcessingRequest
  ): Promise<PipelineProcessingResult> {
    const startTime = Date.now();
    let domainTime = 0;
    let featureTime = 0;
    let schemaTime = 0;

    try {
      // Phase 1: Domain Classification
      console.log(
        `🏗️ Phase 1: Domain Classification for Signal ${request.signalId}`
      );
      const domainStart = Date.now();

      const domainRequest: DomainClassificationRequest = {
        inputId: request.signalId,
        title: request.title || '',
        description: request.description,
        metadata: request.metadata,
      };

      const domainResult = await this.domainEngine.classifyInput(domainRequest);
      domainTime = Date.now() - domainStart;

      // Phase 2: Multi-Dimensional Feature Engineering
      console.log(
        `🔧 Phase 2: Feature Engineering for Signal ${request.signalId}`
      );
      const featureStart = Date.now();

      const featureRequest: FeatureEngineeringRequest = {
        signalId: request.signalId,
        domainClassification: domainResult,
        inputText: request.description,
        metadata: {
          department: request.metadata?.department,
          severity: request.metadata?.severity,
          createdBy: request.metadata?.createdBy,
          timestamp: new Date(),
        },
      };

      const featureResult =
        await this.featureEngine.generateFeatures(featureRequest);
      featureTime = Date.now() - featureStart;

      // Schema Update: Store results in database
      console.log(`💾 Schema Update for Signal ${request.signalId}`);
      const schemaStart = Date.now();

      const schemaUpdated = await this.updateSignalSchema(
        request.signalId,
        domainResult,
        featureResult
      );
      schemaTime = Date.now() - schemaStart;

      // Quality Assessment
      const qualityAssessment = this.assessProcessingQuality(
        domainResult,
        featureResult
      );

      const totalTime = Date.now() - startTime;

      // Log pipeline completion
      console.log(`🎯 AI Pipeline Complete for Signal ${request.signalId}:`, {
        domainConfidence: domainResult.classification.confidence,
        featureConfidence: featureResult.qualityMetrics.overallConfidence,
        recommendedAction: qualityAssessment.recommendedAction,
        totalTime,
        phases: { domainTime, featureTime, schemaTime },
      });

      return {
        signalId: request.signalId,
        domainClassification: domainResult,
        featureEngineering: featureResult,
        schemaUpdated,
        readyForClustering:
          qualityAssessment.recommendedAction === 'CLUSTER_READY',
        processingMetrics: {
          totalTime,
          domainTime,
          featureTime,
          schemaTime,
        },
        qualityAssessment,
      };
    } catch (error) {
      console.error(
        `❌ AI Pipeline Error for Signal ${request.signalId}:`,
        error
      );
      throw new Error(
        `Pipeline processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Process multiple signals in batch with optimized performance
   */
  async processBatch(
    request: BatchPipelineRequest
  ): Promise<BatchPipelineResult> {
    const { signals, options = {} } = request;
    const { parallel = true, batchSize = 5, updateSchema = true } = options;

    console.log(`🚀 Starting Batch AI Pipeline Processing:`, {
      totalSignals: signals.length,
      parallel,
      batchSize,
      updateSchema,
    });

    const results: PipelineProcessingResult[] = [];
    const failed: string[] = [];
    const startTime = Date.now();

    if (parallel) {
      // Process in parallel batches
      for (let i = 0; i < signals.length; i += batchSize) {
        const batch = signals.slice(i, i + batchSize);
        console.log(
          `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(signals.length / batchSize)}`
        );

        const batchPromises = batch.map(signal =>
          this.processSignal(signal).catch(error => {
            console.error(
              `❌ Batch Error for Signal ${signal.signalId}:`,
              error
            );
            failed.push(signal.signalId);
            return null;
          })
        );

        const batchResults = await Promise.all(batchPromises);

        for (const result of batchResults) {
          if (result) {
            results.push(result);
          }
        }
      }
    } else {
      // Process sequentially
      for (const signal of signals) {
        try {
          const result = await this.processSignal(signal);
          results.push(result);
        } catch (error) {
          console.error(
            `❌ Sequential Error for Signal ${signal.signalId}:`,
            error
          );
          failed.push(signal.signalId);
        }
      }
    }

    // Generate summary statistics
    const summary = this.generateBatchSummary(
      results,
      signals.length,
      failed.length,
      startTime
    );

    console.log(`✅ Batch AI Pipeline Complete:`, summary);

    return {
      results,
      summary,
    };
  }

  /**
   * Update signal schema with both domain and feature results
   */
  private async updateSignalSchema(
    signalId: string,
    domainResult: DomainClassificationResult,
    featureResult: FeatureEngineeringResult
  ): Promise<boolean> {
    try {
      // Prepare comprehensive schema update
      const updateData = {
        // Domain classification data
        domainClassification: {
          rootCause: domainResult.classification.rootCause,
          confidence: domainResult.classification.confidence,
          businessContext: domainResult.classification.businessContext,
          processingMetadata: {
            engine: 'AE_DOMAIN_CLASSIFICATION',
            version: '1.0.0',
            processingTime: domainResult.processingTime,
            ruleMatches: domainResult.ruleMatches.length,
            expertValidated: true,
            timestamp: new Date().toISOString(),
          },
        },

        // Enhanced tagging with feature integration
        enhancedTagsJson: {
          // Domain classification
          rootCause: {
            primary: domainResult.classification.rootCause,
            confidence: domainResult.classification.confidence,
            alternatives: domainResult.ruleMatches
              .filter(
                match => match.rule !== domainResult.classification.rootCause
              )
              .slice(0, 2)
              .map(match => ({
                cause: match.rule,
                confidence: match.weight,
              })),
          },
          businessContext: domainResult.classification.businessContext,

          // Feature engineering integration
          features: {
            domainRelevance: featureResult.qualityMetrics.domainRelevance,
            semanticQuality: featureResult.qualityMetrics.semanticQuality,
            executiveAlignment: featureResult.qualityMetrics.executiveAlignment,
            overallConfidence: featureResult.qualityMetrics.overallConfidence,
          },

          // Processing metadata
          generatedAt: new Date().toISOString(),
          modelVersion: 'AI_PIPELINE_2.0.0',
          processingTime:
            domainResult.processingTime + featureResult.processingTime,
          aiProcessed: true,
        },

        // Clustering features for Phase 3
        clusteringFeaturesJson: {
          features: featureResult.features,
          optimizedVector: featureResult.optimizedVector,
          qualityMetrics: featureResult.qualityMetrics,
          version: featureResult.modelVersion,
          generatedAt: featureResult.features.generatedAt.toISOString(),
        },

        // Update processing flags
        aiProcessed: true,
        lastTaggedAt: new Date(),
        tagModelVersion: 'AI_PIPELINE_2.0.0',
        featuresQualityScore: featureResult.qualityMetrics.overallConfidence,
        featuresVersion: featureResult.modelVersion,
        lastFeaturesGeneratedAt: new Date(),
      };

      // Update signal in database
      await (prisma as any).signals.update({
        where: { id: signalId },
        data: updateData,
      });

      return true;
    } catch (error) {
      console.error('❌ Schema Update Error:', error);
      return false;
    }
  }

  /**
   * Assess processing quality and determine next steps
   */
  private assessProcessingQuality(
    domainResult: DomainClassificationResult,
    featureResult: FeatureEngineeringResult
  ): PipelineProcessingResult['qualityAssessment'] {
    const overallConfidence = featureResult.qualityMetrics.overallConfidence;
    const domainRelevance = featureResult.qualityMetrics.domainRelevance;
    const semanticQuality = featureResult.qualityMetrics.semanticQuality;
    const executiveAlignment = featureResult.qualityMetrics.executiveAlignment;

    // Determine recommended action based on quality metrics
    let recommendedAction: 'CLUSTER_READY' | 'AI_ENHANCE' | 'MANUAL_REVIEW';

    if (overallConfidence >= 0.75 && domainRelevance >= 0.6) {
      recommendedAction = 'CLUSTER_READY';
    } else if (overallConfidence >= 0.5 && domainRelevance >= 0.4) {
      recommendedAction = 'AI_ENHANCE';
    } else {
      recommendedAction = 'MANUAL_REVIEW';
    }

    return {
      overallConfidence,
      domainRelevance,
      semanticQuality,
      executiveAlignment,
      recommendedAction,
    };
  }

  /**
   * Generate batch processing summary
   */
  private generateBatchSummary(
    results: PipelineProcessingResult[],
    totalRequested: number,
    failedCount: number,
    startTime: number
  ): BatchPipelineResult['summary'] {
    const successful = results.length;
    const clusterReady = results.filter(
      r => r.qualityAssessment.recommendedAction === 'CLUSTER_READY'
    ).length;
    const needsEnhancement = results.filter(
      r => r.qualityAssessment.recommendedAction === 'AI_ENHANCE'
    ).length;
    const needsReview = results.filter(
      r => r.qualityAssessment.recommendedAction === 'MANUAL_REVIEW'
    ).length;

    const averageConfidence =
      successful > 0
        ? results.reduce(
            (sum, r) => sum + r.qualityAssessment.overallConfidence,
            0
          ) / successful
        : 0;

    const totalProcessingTime = Date.now() - startTime;

    return {
      totalProcessed: totalRequested,
      successful,
      failed: failedCount,
      clusterReady,
      needsEnhancement,
      needsReview,
      averageConfidence,
      totalProcessingTime,
    };
  }

  /**
   * Get signals ready for clustering (Phase 3)
   */
  async getClusteringReadySignals(): Promise<ClusteringFeatures[]> {
    try {
      const signals = await (prisma as any).signals.findMany({
        where: {
          clusteringFeaturesJson: { not: null },
          featuresQualityScore: { gte: 0.5 },
        },
        select: {
          id: true,
          clusteringFeaturesJson: true,
          featuresQualityScore: true,
          lastFeaturesGeneratedAt: true,
        },
      });

      const clusteringFeatures: ClusteringFeatures[] = signals
        .map((signal: any) => {
          try {
            const features = signal.clusteringFeaturesJson?.features;
            return features ? { ...features, signalId: signal.id } : null;
          } catch (error) {
            console.error(
              `❌ Error parsing clustering features for signal ${signal.id}:`,
              error
            );
            return null;
          }
        })
        .filter(
          (
            features: ClusteringFeatures | null
          ): features is ClusteringFeatures => features !== null
        );

      console.log(
        `📊 Clustering Ready Signals: ${clusteringFeatures.length}/${signals.length}`
      );

      return clusteringFeatures;
    } catch (error) {
      console.error('❌ Error fetching clustering ready signals:', error);
      return [];
    }
  }

  /**
   * Get pipeline processing statistics
   */
  async getPipelineStatistics(): Promise<{
    totalSignals: number;
    domainClassified: number;
    featureEngineered: number;
    clusteringReady: number;
    averageProcessingTime: number;
    qualityDistribution: Record<string, number>;
  }> {
    try {
      const signals = await (prisma as any).signals.findMany({
        select: {
          id: true,
          domainClassification: true,
          clusteringFeaturesJson: true,
          featuresQualityScore: true,
          enhancedTagsJson: true,
        },
      });

      const stats = {
        totalSignals: signals.length,
        domainClassified: signals.filter((s: any) => s.domainClassification)
          .length,
        featureEngineered: signals.filter((s: any) => s.clusteringFeaturesJson)
          .length,
        clusteringReady: signals.filter(
          (s: any) => s.featuresQualityScore && s.featuresQualityScore >= 0.5
        ).length,
        averageProcessingTime: 0,
        qualityDistribution: {
          high: 0, // >= 0.75
          medium: 0, // 0.5 - 0.75
          low: 0, // < 0.5
        },
      };

      // Calculate quality distribution
      for (const signal of signals) {
        const quality = signal.featuresQualityScore || 0;
        if (quality >= 0.75) {
          stats.qualityDistribution.high++;
        } else if (quality >= 0.5) {
          stats.qualityDistribution.medium++;
        } else {
          stats.qualityDistribution.low++;
        }
      }

      return stats;
    } catch (error) {
      console.error('❌ Error fetching pipeline statistics:', error);
      return {
        totalSignals: 0,
        domainClassified: 0,
        featureEngineered: 0,
        clusteringReady: 0,
        averageProcessingTime: 0,
        qualityDistribution: { high: 0, medium: 0, low: 0 },
      };
    }
  }
}
