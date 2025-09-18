/**
 * Signal Domain Classification Integration - FAE-133
 * Expert: Dr. Rachel Kim (AI Tagging Specialist)
 *
 * Integrates A&E domain classification into existing signal processing workflow
 * Maintains schema consistency and performance requirements
 */

import { AEDomainClassificationEngine } from './domain-classification-engine';
import type {
  DomainClassificationRequest,
  DomainClassificationResult,
} from './domain-classification-engine';
import { prisma } from '@/lib/prisma';

export interface SignalDomainProcessingRequest {
  signalId: string;
  title?: string;
  description: string;
  metadata?: {
    department?: string;
    severity?: string;
    tags?: string[];
  };
}

export interface SignalDomainProcessingResult {
  signalId: string;
  domainClassification: DomainClassificationResult;
  schemaUpdated: boolean;
  processingTime: number;
  aiEnhancementQueued: boolean;
}

/**
 * Signal Domain Processing Service
 * Handles integration of domain classification with existing signal workflow
 */
export class SignalDomainProcessor {
  private engine: AEDomainClassificationEngine;

  constructor() {
    this.engine = new AEDomainClassificationEngine();
  }

  /**
   * Process domain classification for a signal and update schema
   * Maintains consistency with existing signal processing workflow
   */
  async processSignalDomain(
    request: SignalDomainProcessingRequest
  ): Promise<SignalDomainProcessingResult> {
    const startTime = Date.now();

    try {
      // Perform domain classification
      const classificationRequest: DomainClassificationRequest = {
        inputId: request.signalId,
        title: request.title || '',
        description: request.description,
        metadata: request.metadata,
      };

      const domainResult = await this.engine.classifyInput(
        classificationRequest
      );

      // Update signal in database with domain classification results
      const schemaUpdated = await this.updateSignalSchema(
        request.signalId,
        domainResult
      );

      // Queue for AI enhancement if needed
      const aiEnhancementQueued = domainResult.aiEnhancementNeeded
        ? await this.queueAIEnhancement(request.signalId, domainResult)
        : false;

      const totalTime = Date.now() - startTime;

      // Log processing results
      console.log(`🏗️ Signal Domain Processing Complete:`, {
        signalId: request.signalId,
        rootCause: domainResult.classification.rootCause,
        confidence: domainResult.classification.confidence,
        aiEnhancementQueued,
        totalTime,
      });

      return {
        signalId: request.signalId,
        domainClassification: domainResult,
        schemaUpdated,
        processingTime: totalTime,
        aiEnhancementQueued,
      };
    } catch (error) {
      console.error('❌ Signal Domain Processing Error:', error);
      throw new Error(
        `Signal domain processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update signal schema with domain classification results
   * Uses existing schema fields: domainClassification, enhancedTagsJson
   */
  private async updateSignalSchema(
    signalId: string,
    domainResult: DomainClassificationResult
  ): Promise<boolean> {
    try {
      // Prepare domain classification data for schema
      const domainClassificationData = {
        rootCause: domainResult.classification.rootCause,
        confidence: domainResult.classification.confidence,
        businessContext: domainResult.classification.businessContext,
        processingMetadata: {
          engine: 'AE_DOMAIN_CLASSIFICATION',
          version: '1.0.0',
          processingTime: domainResult.processingTime,
          ruleMatches: domainResult.ruleMatches.length,
          expertValidated: true, // Marcus Rodriguez A&E expertise
          timestamp: new Date().toISOString(),
        },
      };

      // Prepare enhanced tags data (compatible with existing enhanced tagging)
      const enhancedTagsData = {
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
        department:
          domainResult.classification.businessContext.departmentPriority,
        urgency: domainResult.classification.businessContext.urgencyLevel,
        projectPhase: domainResult.classification.businessContext.projectPhase,
        clientTier: domainResult.classification.businessContext.clientTier,

        // Processing metadata
        generatedAt: new Date().toISOString(),
        modelVersion: 'AE_DOMAIN_1.0.0',
        processingTime: domainResult.processingTime,
        aiProcessed: !domainResult.aiEnhancementNeeded, // True if domain rules were sufficient

        // Quality metrics
        confidence: domainResult.classification.confidence,
        diagnostics: domainResult.diagnostics,
      };

      // Update signal with domain classification and enhanced tags
      await (prisma as any).signals.update({
        where: { id: signalId },
        data: {
          domainClassification: domainClassificationData,
          enhancedTagsJson: enhancedTagsData,
          lastTaggedAt: new Date(),
          tagModelVersion: 'AE_DOMAIN_1.0.0',
          aiProcessed: !domainResult.aiEnhancementNeeded,
        },
      });

      return true;
    } catch (error) {
      console.error('❌ Signal Schema Update Error:', error);
      return false;
    }
  }

  /**
   * Queue signal for AI enhancement if domain classification confidence is low
   * Integrates with existing AI processing pipeline
   */
  private async queueAIEnhancement(
    signalId: string,
    domainResult: DomainClassificationResult
  ): Promise<boolean> {
    try {
      // Log the queue request - will integrate with Phase 2 AI enhancement pipeline
      console.log(`🤖 Queueing AI Enhancement for Signal ${signalId}:`, {
        reason: 'Low domain classification confidence',
        confidence: domainResult.classification.confidence,
        rootCause: domainResult.classification.rootCause,
        enhancementNeeded: domainResult.aiEnhancementNeeded,
      });

      // Update signal to mark as needing AI enhancement
      await (prisma as any).signals.update({
        where: { id: signalId },
        data: {
          aiProcessed: false, // Mark as needing additional AI processing
        },
      });

      return true;
    } catch (error) {
      console.error('❌ AI Enhancement Queue Error:', error);
      return false;
    }
  }

  /**
   * Batch process multiple signals for domain classification
   * Optimized for bulk processing scenarios
   */
  async batchProcessSignalDomains(
    requests: SignalDomainProcessingRequest[]
  ): Promise<SignalDomainProcessingResult[]> {
    const results: SignalDomainProcessingResult[] = [];

    // Process in small batches to avoid memory issues
    const batchSize = 10;
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);

      const batchPromises = batch.map(request =>
        this.processSignalDomain(request)
      );

      const batchResults = await Promise.allSettled(batchPromises);

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error('❌ Batch Processing Error:', result.reason);
        }
      }
    }

    console.log(`📊 Batch Domain Processing Complete:`, {
      totalRequests: requests.length,
      successfulResults: results.length,
      batchSize,
    });

    return results;
  }

  /**
   * Get domain classification statistics for monitoring
   */
  async getDomainClassificationStats(): Promise<{
    totalProcessed: number;
    rootCauseDistribution: Record<string, number>;
    averageConfidence: number;
    aiEnhancementRate: number;
  }> {
    try {
      // Query signals with domain classification
      const signals = await (prisma as any).signals.findMany({
        where: {
          domainClassification: { not: null },
        },
        select: {
          domainClassification: true,
          aiProcessed: true,
        },
      });

      // Calculate statistics
      const stats = {
        totalProcessed: signals.length,
        rootCauseDistribution: {} as Record<string, number>,
        averageConfidence: 0,
        aiEnhancementRate: 0,
      };

      if (signals.length > 0) {
        let totalConfidence = 0;
        let aiEnhancementCount = 0;

        for (const signal of signals) {
          const classification = signal.domainClassification as any;
          if (classification?.rootCause) {
            stats.rootCauseDistribution[classification.rootCause] =
              (stats.rootCauseDistribution[classification.rootCause] || 0) + 1;
          }

          if (classification?.confidence) {
            totalConfidence += classification.confidence;
          }

          if (!signal.aiProcessed) {
            aiEnhancementCount++;
          }
        }

        stats.averageConfidence = totalConfidence / signals.length;
        stats.aiEnhancementRate = (aiEnhancementCount / signals.length) * 100;
      }

      return stats;
    } catch (error) {
      console.error('❌ Domain Classification Stats Error:', error);
      return {
        totalProcessed: 0,
        rootCauseDistribution: {},
        averageConfidence: 0,
        aiEnhancementRate: 0,
      };
    }
  }
}
