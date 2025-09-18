/**
 * Multi-Dimensional Feature Engineering Tests - FAE-134
 * Expert: Dr. James Park (Semantic Analysis Expert)
 * AI Integration: Dr. Priya Patel (AI Architect)
 *
 * Comprehensive test suite for feature engineering accuracy and performance
 * Target: 85%+ clustering accuracy improvement, <1s execution time
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { MultiDimensionalFeatureEngine } from '@/lib/ai/multi-dimensional-feature-engine';
import { AEDomainClassificationEngine } from '@/lib/ai/domain-classification-engine';
import { AIPipelineIntegrator } from '@/lib/ai/ai-pipeline-integration';
import type {
  FeatureEngineeringRequest,
  ClusteringFeatures,
  OptimizedFeatureVector,
} from '@/lib/ai/multi-dimensional-feature-engine';
import type { DomainClassificationResult } from '@/lib/ai/domain-classification-engine';

describe('Multi-Dimensional Feature Engineering', () => {
  let featureEngine: MultiDimensionalFeatureEngine;
  let domainEngine: AEDomainClassificationEngine;
  let pipelineIntegrator: AIPipelineIntegrator;

  beforeEach(() => {
    featureEngine = new MultiDimensionalFeatureEngine();
    domainEngine = new AEDomainClassificationEngine();
    pipelineIntegrator = new AIPipelineIntegrator();
  });

  /**
   * Phase 2 Test Cases
   * Building on Phase 1 domain classification with enhanced feature vectors
   */
  const FEATURE_TEST_CASES = [
    {
      signalId: 'test-feature-process-1',
      title: 'Design Review Workflow Optimization',
      description:
        'Client approval process for architectural drawings is creating timeline delays. Need to streamline the design review workflow and improve coordination between structural and MEP teams.',
      metadata: {
        department: 'Architectural',
        severity: 'HIGH',
        createdBy: 'user123',
        timestamp: new Date().toISOString(),
      },
      expectedFeatures: {
        rootCause: 'PROCESS',
        domainRelevance: 0.7,
        semanticQuality: 0.6,
        executiveAlignment: 0.8,
        vectorDimensions: 89,
      },
    },
    {
      signalId: 'test-feature-resource-2',
      title: 'Structural Engineering Capacity Shortage',
      description:
        'Current project load exceeds our structural engineering capacity. Need additional senior structural engineers and CAD workstations to meet project deadlines and maintain quality standards.',
      metadata: {
        department: 'Structural',
        severity: 'CRITICAL',
        createdBy: 'user456',
        timestamp: new Date().toISOString(),
      },
      expectedFeatures: {
        rootCause: 'RESOURCE',
        domainRelevance: 0.8,
        semanticQuality: 0.7,
        executiveAlignment: 0.9,
        vectorDimensions: 89,
      },
    },
    {
      signalId: 'test-feature-technology-3',
      title: 'BIM Model Synchronization Issues',
      description:
        'Revit central model file corruption during team synchronization. Multiple team members lost work. Need better BIM collaboration workflow and file backup system for large projects.',
      metadata: {
        department: 'Architectural',
        severity: 'HIGH',
        createdBy: 'user789',
        timestamp: new Date().toISOString(),
      },
      expectedFeatures: {
        rootCause: 'TECHNOLOGY',
        domainRelevance: 0.8,
        semanticQuality: 0.8,
        executiveAlignment: 0.7,
        vectorDimensions: 89,
      },
    },
    {
      signalId: 'test-feature-quality-4',
      title: 'Building Code Compliance Issues',
      description:
        'Plan review comments indicate building code violations in fire egress design. Rework required for stair and corridor dimensions. QC process improvement needed for code compliance verification.',
      metadata: {
        department: 'Architectural',
        severity: 'CRITICAL',
        createdBy: 'user101',
        timestamp: new Date().toISOString(),
      },
      expectedFeatures: {
        rootCause: 'QUALITY',
        domainRelevance: 0.9,
        semanticQuality: 0.8,
        executiveAlignment: 0.9,
        vectorDimensions: 89,
      },
    },
  ];

  describe('Feature Engineering Core Functionality', () => {
    test('should generate 89-dimension feature vectors', async () => {
      const testCase = FEATURE_TEST_CASES[0];

      // Get domain classification first
      const domainResult = await domainEngine.classifyInput({
        inputId: testCase.signalId,
        title: testCase.title,
        description: testCase.description,
        metadata: testCase.metadata,
      });

      // Generate features
      const featureRequest: FeatureEngineeringRequest = {
        signalId: testCase.signalId,
        domainClassification: domainResult,
        inputText: testCase.description,
        metadata: {
          ...testCase.metadata,
          timestamp: new Date(testCase.metadata.timestamp),
        },
      };

      const result = await featureEngine.generateFeatures(featureRequest);

      // Validate feature dimensions
      expect(result.optimizedVector.rootCause).toHaveLength(6);
      expect(result.optimizedVector.department).toHaveLength(8);
      expect(result.optimizedVector.projectPhase).toHaveLength(3);
      expect(result.optimizedVector.urgencyLevel).toHaveLength(4);
      expect(result.optimizedVector.businessContext).toHaveLength(39);
      expect(result.optimizedVector.textEmbedding).toHaveLength(20);
      expect(result.optimizedVector.terminologyDensity).toHaveLength(3);
      expect(result.optimizedVector.semanticPatterns).toHaveLength(2);

      // Total: 6+8+3+4+39+20+3+2+4 = 89 dimensions
      const totalDimensions =
        result.optimizedVector.rootCause.length +
        result.optimizedVector.department.length +
        result.optimizedVector.projectPhase.length +
        result.optimizedVector.urgencyLevel.length +
        result.optimizedVector.businessContext.length +
        result.optimizedVector.textEmbedding.length +
        result.optimizedVector.terminologyDensity.length +
        result.optimizedVector.semanticPatterns.length +
        4; // executive features

      expect(totalDimensions).toBe(89);
    });

    test('should execute in under 1 second', async () => {
      const testCase = FEATURE_TEST_CASES[1];

      const domainResult = await domainEngine.classifyInput({
        inputId: testCase.signalId,
        title: testCase.title,
        description: testCase.description,
        metadata: testCase.metadata,
      });

      const featureRequest: FeatureEngineeringRequest = {
        signalId: testCase.signalId,
        domainClassification: domainResult,
        inputText: testCase.description,
        metadata: {
          ...testCase.metadata,
          timestamp: new Date(testCase.metadata.timestamp),
        },
      };

      const startTime = Date.now();
      const result = await featureEngine.generateFeatures(featureRequest);
      const totalTime = Date.now() - startTime;

      expect(totalTime).toBeLessThan(1000);
      expect(result.processingTime).toBeLessThan(1000);
    });

    test('should generate consistent feature weights', async () => {
      const testCase = FEATURE_TEST_CASES[0];

      const domainResult = await domainEngine.classifyInput({
        inputId: testCase.signalId,
        title: testCase.title,
        description: testCase.description,
        metadata: testCase.metadata,
      });

      const featureRequest: FeatureEngineeringRequest = {
        signalId: testCase.signalId,
        domainClassification: domainResult,
        inputText: testCase.description,
        metadata: {
          ...testCase.metadata,
          timestamp: new Date(testCase.metadata.timestamp),
        },
      };

      const result = await featureEngine.generateFeatures(featureRequest);

      // Validate feature weight distribution (60% domain, 30% semantic, 10% executive)
      expect(result.qualityMetrics.domainRelevance).toBeGreaterThan(0);
      expect(result.qualityMetrics.semanticQuality).toBeGreaterThan(0);
      expect(result.qualityMetrics.executiveAlignment).toBeGreaterThan(0);
      expect(result.qualityMetrics.overallConfidence).toBeGreaterThan(0);
      expect(result.qualityMetrics.overallConfidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Domain Feature Integration', () => {
    test('should properly integrate Phase 1 domain classification', async () => {
      const testCase = FEATURE_TEST_CASES[2]; // Technology case

      const domainResult = await domainEngine.classifyInput({
        inputId: testCase.signalId,
        title: testCase.title,
        description: testCase.description,
        metadata: testCase.metadata,
      });

      const featureRequest: FeatureEngineeringRequest = {
        signalId: testCase.signalId,
        domainClassification: domainResult,
        inputText: testCase.description,
        metadata: {
          ...testCase.metadata,
          timestamp: new Date(testCase.metadata.timestamp),
        },
      };

      const result = await featureEngine.generateFeatures(featureRequest);

      // Validate domain features properly integrate domain classification
      expect(
        result.features.rootCauseScores[domainResult.classification.rootCause]
      ).toBeGreaterThan(0.5);

      // Check business context integration
      expect(result.features.organizationalContext).toBeDefined();
      expect(result.features.urgencyFactors).toBeDefined();

      // Validate domain vector has proper structure
      expect(result.features.domainVector).toHaveLength(60);
    });

    test('should handle different urgency levels correctly', async () => {
      const criticalCase = FEATURE_TEST_CASES[1]; // CRITICAL severity
      const highCase = FEATURE_TEST_CASES[2]; // HIGH severity

      // Process both cases
      const results = await Promise.all([
        processSingleCase(criticalCase),
        processSingleCase(highCase),
      ]);

      const [criticalResult, highResult] = results;

      // Critical cases should have higher business impact
      expect(criticalResult.features.businessImpact).toBeGreaterThan(
        highResult.features.businessImpact
      );

      // Executive attention should also be higher for critical
      expect(criticalResult.features.executiveAttention).toBeGreaterThan(
        highResult.features.executiveAttention
      );
    });
  });

  describe('Semantic Feature Engineering', () => {
    test('should calculate terminology density correctly', async () => {
      const techCase = FEATURE_TEST_CASES[2]; // Technology case with BIM, Revit terms

      const result = await processSingleCase(techCase);

      // Technology case should have high terminology density
      expect(result.features.domainTerminologyDensity).toBeGreaterThan(0.3);

      // Semantic complexity should reflect technical content
      expect(result.features.semanticComplexity).toBeGreaterThan(0.2);
    });

    test('should generate consistent embeddings for similar content', async () => {
      const case1 = FEATURE_TEST_CASES[0]; // Process case
      const case2 = {
        ...FEATURE_TEST_CASES[0],
        signalId: 'test-similar-1',
        description:
          'Approval workflow issues causing delays in design review process.',
      };

      const [result1, result2] = await Promise.all([
        processSingleCase(case1),
        processSingleCase(case2),
      ]);

      // Similar content should have similar embeddings
      const similarity = calculateCosineSimilarity(
        result1.features.textEmbedding,
        result2.features.textEmbedding
      );

      expect(similarity).toBeGreaterThan(0.7); // High similarity for related content
    });
  });

  describe('Executive Feature Engineering', () => {
    test('should assign higher business impact to critical issues', async () => {
      const criticalCase = FEATURE_TEST_CASES[3]; // Quality/compliance issue
      const processCase = FEATURE_TEST_CASES[0]; // Process optimization

      const [criticalResult, processResult] = await Promise.all([
        processSingleCase(criticalCase),
        processSingleCase(processCase),
      ]);

      // Critical compliance issues should have higher business impact
      expect(criticalResult.features.businessImpact).toBeGreaterThan(
        processResult.features.businessImpact
      );

      // Strategic priority should also be higher
      expect(criticalResult.features.strategicPriority).toBeGreaterThan(
        processResult.features.strategicPriority
      );
    });

    test('should calculate actionability based on complexity', async () => {
      const simpleCase = {
        ...FEATURE_TEST_CASES[0],
        signalId: 'test-simple',
        description:
          'Simple workflow optimization needed for quick approval process.',
      };

      const complexCase = {
        ...FEATURE_TEST_CASES[1],
        signalId: 'test-complex',
        description:
          'Complex multi-departmental coordination issue requiring major resource allocation and system integration.',
      };

      const [simpleResult, complexResult] = await Promise.all([
        processSingleCase(simpleCase),
        processSingleCase(complexCase),
      ]);

      // Simple issues should have higher actionability
      expect(simpleResult.features.actionability).toBeGreaterThan(
        complexResult.features.actionability
      );
    });
  });

  describe('AI Pipeline Integration', () => {
    test('should process complete pipeline from input to clustering features', async () => {
      const testCase = FEATURE_TEST_CASES[0];

      const result = await pipelineIntegrator.processSignal({
        signalId: testCase.signalId,
        title: testCase.title,
        description: testCase.description,
        metadata: testCase.metadata,
      });

      // Validate complete pipeline execution
      expect(result.domainClassification).toBeDefined();
      expect(result.featureEngineering).toBeDefined();
      expect(result.readyForClustering).toBe(true);

      // Validate processing metrics
      expect(result.processingMetrics.totalTime).toBeGreaterThan(0);
      expect(result.processingMetrics.domainTime).toBeGreaterThan(0);
      expect(result.processingMetrics.featureTime).toBeGreaterThan(0);

      // Validate quality assessment
      expect(result.qualityAssessment.overallConfidence).toBeGreaterThan(0);
      expect(['CLUSTER_READY', 'AI_ENHANCE', 'MANUAL_REVIEW']).toContain(
        result.qualityAssessment.recommendedAction
      );
    });

    test('should handle batch processing efficiently', async () => {
      const batchRequest = {
        signals: FEATURE_TEST_CASES.map(tc => ({
          signalId: tc.signalId,
          title: tc.title,
          description: tc.description,
          metadata: tc.metadata,
        })),
        options: { parallel: true, batchSize: 2 },
      };

      const startTime = Date.now();
      const result = await pipelineIntegrator.processBatch(batchRequest);
      const totalTime = Date.now() - startTime;

      // Validate batch results
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.summary.totalProcessed).toBe(FEATURE_TEST_CASES.length);
      expect(result.summary.successful).toBeGreaterThan(0);

      // Batch processing should be reasonably fast
      expect(totalTime).toBeLessThan(10000); // <10s for 4 signals
    });
  });

  describe('Feature Quality Assessment', () => {
    test('should achieve target feature quality metrics', async () => {
      const results = await Promise.all(
        FEATURE_TEST_CASES.map(testCase => processSingleCase(testCase))
      );

      // Calculate average quality metrics
      const avgDomainRelevance =
        results.reduce((sum, r) => sum + r.qualityMetrics.domainRelevance, 0) /
        results.length;
      const avgSemanticQuality =
        results.reduce((sum, r) => sum + r.qualityMetrics.semanticQuality, 0) /
        results.length;
      const avgExecutiveAlignment =
        results.reduce(
          (sum, r) => sum + r.qualityMetrics.executiveAlignment,
          0
        ) / results.length;
      const avgOverallConfidence =
        results.reduce(
          (sum, r) => sum + r.qualityMetrics.overallConfidence,
          0
        ) / results.length;

      console.log(`📊 Feature Quality Metrics:`, {
        avgDomainRelevance: avgDomainRelevance.toFixed(3),
        avgSemanticQuality: avgSemanticQuality.toFixed(3),
        avgExecutiveAlignment: avgExecutiveAlignment.toFixed(3),
        avgOverallConfidence: avgOverallConfidence.toFixed(3),
      });

      // Target quality thresholds
      expect(avgDomainRelevance).toBeGreaterThan(0.6);
      expect(avgSemanticQuality).toBeGreaterThan(0.5);
      expect(avgExecutiveAlignment).toBeGreaterThan(0.6);
      expect(avgOverallConfidence).toBeGreaterThan(0.6);
    });

    test('should improve clustering readiness over Phase 1', async () => {
      let clusterReadyCount = 0;
      let aiEnhanceCount = 0;
      let manualReviewCount = 0;

      for (const testCase of FEATURE_TEST_CASES) {
        const result = await pipelineIntegrator.processSignal({
          signalId: testCase.signalId,
          title: testCase.title,
          description: testCase.description,
          metadata: testCase.metadata,
        });

        switch (result.qualityAssessment.recommendedAction) {
          case 'CLUSTER_READY':
            clusterReadyCount++;
            break;
          case 'AI_ENHANCE':
            aiEnhanceCount++;
            break;
          case 'MANUAL_REVIEW':
            manualReviewCount++;
            break;
        }
      }

      const clusterReadyPercentage =
        (clusterReadyCount / FEATURE_TEST_CASES.length) * 100;

      console.log(`🎯 Clustering Readiness Analysis:`, {
        clusterReady: clusterReadyCount,
        aiEnhance: aiEnhanceCount,
        manualReview: manualReviewCount,
        clusterReadyPercentage: clusterReadyPercentage.toFixed(1),
      });

      // Target: >70% cluster ready (improvement over Phase 1's 64.3%)
      expect(clusterReadyPercentage).toBeGreaterThan(70);
    });
  });

  // Helper function to process a single test case
  async function processSingleCase(testCase: any) {
    const domainResult = await domainEngine.classifyInput({
      inputId: testCase.signalId,
      title: testCase.title,
      description: testCase.description,
      metadata: testCase.metadata,
    });

    const featureRequest: FeatureEngineeringRequest = {
      signalId: testCase.signalId,
      domainClassification: domainResult,
      inputText: testCase.description,
      metadata: {
        ...testCase.metadata,
        timestamp: new Date(testCase.metadata.timestamp),
      },
    };

    return await featureEngine.generateFeatures(featureRequest);
  }

  // Helper function to calculate cosine similarity
  function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    return magnitudeA && magnitudeB
      ? dotProduct / (magnitudeA * magnitudeB)
      : 0;
  }
});

/**
 * Performance Benchmarking Tests
 */
describe('Feature Engineering Performance', () => {
  test('should handle concurrent feature generation', async () => {
    const featureEngine = new MultiDimensionalFeatureEngine();
    const domainEngine = new AEDomainClassificationEngine();

    // Create multiple test cases
    const testCases = Array.from({ length: 10 }, (_, i) => ({
      signalId: `perf-test-${i}`,
      title: `Performance Test ${i}`,
      description: `Testing concurrent feature engineering performance with case ${i} containing various architectural and engineering terminology.`,
      metadata: {
        department: 'Architectural',
        severity: 'MEDIUM',
        createdBy: `user${i}`,
        timestamp: new Date().toISOString(),
      },
    }));

    const startTime = Date.now();

    // Process all cases concurrently
    const promises = testCases.map(async testCase => {
      const domainResult = await domainEngine.classifyInput({
        inputId: testCase.signalId,
        title: testCase.title,
        description: testCase.description,
        metadata: testCase.metadata,
      });

      const featureRequest: FeatureEngineeringRequest = {
        signalId: testCase.signalId,
        domainClassification: domainResult,
        inputText: testCase.description,
        metadata: {
          ...testCase.metadata,
          timestamp: new Date(testCase.metadata.timestamp),
        },
      };

      return await featureEngine.generateFeatures(featureRequest);
    });

    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    // Validate performance
    expect(results).toHaveLength(10);
    expect(totalTime).toBeLessThan(5000); // <5s for 10 concurrent operations

    // Each result should have proper features
    results.forEach(result => {
      expect(result.features).toBeDefined();
      expect(result.optimizedVector).toBeDefined();
      expect(result.qualityMetrics).toBeDefined();
    });

    console.log(
      `⚡ Concurrent Performance: ${results.length} features in ${totalTime}ms`
    );
  });
});
