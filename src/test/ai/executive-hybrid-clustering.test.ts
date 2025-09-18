/**
 * Executive-Optimized Hybrid Clustering Tests - FAE-135
 * Expert: Dr. Emily Chen (Advanced Clustering Specialist)
 * AI Architecture: Dr. Priya Patel (AI Architect)
 *
 * Comprehensive test suite for 3-stage hybrid clustering
 * Target: 4-6 clusters, 85%+ executive satisfaction, <30s execution
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { ExecutiveHybridClusteringEngine } from '@/lib/ai/executive-hybrid-clustering-engine';
import { MultiDimensionalFeatureEngine } from '@/lib/ai/multi-dimensional-feature-engine';
import { AEDomainClassificationEngine } from '@/lib/ai/domain-classification-engine';
import { AIPipelineIntegrator } from '@/lib/ai/ai-pipeline-integration';
import type {
  HybridClusteringRequest,
  ExecutiveCluster,
} from '@/lib/ai/executive-hybrid-clustering-engine';
import type { ClusteringFeatures } from '@/lib/ai/multi-dimensional-feature-engine';

/**
 * Executive Clustering Test Dataset
 * Designed to test 4-6 cluster generation with diverse A&E scenarios
 */
const EXECUTIVE_CLUSTERING_TEST_CASES = [
  // PROCESS cluster signals (3 signals)
  {
    signalId: 'exec-process-1',
    title: 'Design Review Workflow Delays',
    description:
      'Client approval process creating timeline delays in architectural review cycle.',
    rootCause: 'PROCESS',
    department: 'ARCHITECTURAL',
    urgency: 'HIGH',
  },
  {
    signalId: 'exec-process-2',
    title: 'Submittal Coordination Issues',
    description:
      'MEP submittal coordination causing delays in project milestone delivery.',
    rootCause: 'PROCESS',
    department: 'MEP',
    urgency: 'HIGH',
  },
  {
    signalId: 'exec-process-3',
    title: 'Approval Workflow Bottlenecks',
    description:
      'Project management approval workflow creating coordination bottlenecks.',
    rootCause: 'PROCESS',
    department: 'PROJECT_MGMT',
    urgency: 'MEDIUM',
  },

  // RESOURCE cluster signals (4 signals)
  {
    signalId: 'exec-resource-1',
    title: 'Structural Engineering Capacity',
    description:
      'Senior structural engineer shortage affecting project delivery timelines.',
    rootCause: 'RESOURCE',
    department: 'STRUCTURAL',
    urgency: 'CRITICAL',
  },
  {
    signalId: 'exec-resource-2',
    title: 'CAD Workstation Limitations',
    description:
      'Insufficient CAD workstations limiting design team productivity.',
    rootCause: 'RESOURCE',
    department: 'ARCHITECTURAL',
    urgency: 'HIGH',
  },
  {
    signalId: 'exec-resource-3',
    title: 'MEP Design Team Capacity',
    description: 'MEP design team overloaded with current project portfolio.',
    rootCause: 'RESOURCE',
    department: 'MEP',
    urgency: 'HIGH',
  },
  {
    signalId: 'exec-resource-4',
    title: 'Project Management Bandwidth',
    description:
      'Project managers stretched across too many concurrent projects.',
    rootCause: 'RESOURCE',
    department: 'PROJECT_MGMT',
    urgency: 'MEDIUM',
  },

  // TECHNOLOGY cluster signals (3 signals)
  {
    signalId: 'exec-tech-1',
    title: 'BIM Model Synchronization',
    description: 'Revit central model corruption during team synchronization.',
    rootCause: 'TECHNOLOGY',
    department: 'ARCHITECTURAL',
    urgency: 'HIGH',
  },
  {
    signalId: 'exec-tech-2',
    title: 'Software Integration Issues',
    description:
      'CAD software compatibility issues between structural and architectural.',
    rootCause: 'TECHNOLOGY',
    department: 'STRUCTURAL',
    urgency: 'MEDIUM',
  },
  {
    signalId: 'exec-tech-3',
    title: 'Design Automation Opportunities',
    description: 'Manual design processes that could benefit from automation.',
    rootCause: 'TECHNOLOGY',
    department: 'MEP',
    urgency: 'LOW',
  },

  // QUALITY cluster signals (4 signals)
  {
    signalId: 'exec-quality-1',
    title: 'Building Code Compliance',
    description:
      'Plan review comments indicating code violations requiring rework.',
    rootCause: 'QUALITY',
    department: 'ARCHITECTURAL',
    urgency: 'CRITICAL',
  },
  {
    signalId: 'exec-quality-2',
    title: 'QC Review Process Gaps',
    description: 'Quality control review process missing key checkpoints.',
    rootCause: 'QUALITY',
    department: 'QC',
    urgency: 'HIGH',
  },
  {
    signalId: 'exec-quality-3',
    title: 'Design Standard Adherence',
    description:
      'Inconsistent adherence to company design standards across projects.',
    rootCause: 'QUALITY',
    department: 'STRUCTURAL',
    urgency: 'MEDIUM',
  },
  {
    signalId: 'exec-quality-4',
    title: 'Construction Document Quality',
    description:
      'Field questions indicating construction document clarity issues.',
    rootCause: 'QUALITY',
    department: 'MEP',
    urgency: 'MEDIUM',
  },

  // COMMUNICATION cluster signals (3 signals)
  {
    signalId: 'exec-comm-1',
    title: 'Client Feedback Integration',
    description:
      'Client feedback not effectively integrated into design process.',
    rootCause: 'COMMUNICATION',
    department: 'CLIENT',
    urgency: 'HIGH',
  },
  {
    signalId: 'exec-comm-2',
    title: 'Cross-Team Coordination',
    description: 'Communication gaps between structural and MEP design teams.',
    rootCause: 'COMMUNICATION',
    department: 'PROJECT_MGMT',
    urgency: 'MEDIUM',
  },
  {
    signalId: 'exec-comm-3',
    title: 'Stakeholder Meeting Effectiveness',
    description: 'Project stakeholder meetings not achieving desired outcomes.',
    rootCause: 'COMMUNICATION',
    department: 'PROJECT_MGMT',
    urgency: 'MEDIUM',
  },

  // TRAINING cluster signals (3 signals)
  {
    signalId: 'exec-training-1',
    title: 'Advanced BIM Skills Gap',
    description: 'Team members need advanced BIM modeling skills training.',
    rootCause: 'TRAINING',
    department: 'ARCHITECTURAL',
    urgency: 'MEDIUM',
  },
  {
    signalId: 'exec-training-2',
    title: 'Code Knowledge Updates',
    description: 'Staff need training on latest building code updates.',
    rootCause: 'TRAINING',
    department: 'STRUCTURAL',
    urgency: 'MEDIUM',
  },
  {
    signalId: 'exec-training-3',
    title: 'Project Management Certification',
    description: 'Project managers need advanced certification training.',
    rootCause: 'TRAINING',
    department: 'PROJECT_MGMT',
    urgency: 'LOW',
  },
];

describe('Executive-Optimized Hybrid Clustering', () => {
  let clusteringEngine: ExecutiveHybridClusteringEngine;
  let featureEngine: MultiDimensionalFeatureEngine;
  let domainEngine: AEDomainClassificationEngine;
  let pipelineIntegrator: AIPipelineIntegrator;

  beforeEach(() => {
    clusteringEngine = new ExecutiveHybridClusteringEngine();
    featureEngine = new MultiDimensionalFeatureEngine();
    domainEngine = new AEDomainClassificationEngine();
    pipelineIntegrator = new AIPipelineIntegrator();
  });

  describe('Core Clustering Functionality', () => {
    test('should generate 4-6 clusters from 20 test signals', async () => {
      // Generate clustering features for all test signals
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES
      );

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Validate cluster count in executive range
      expect(result.success).toBe(true);
      expect(result.clusters.length).toBeGreaterThanOrEqual(4);
      expect(result.clusters.length).toBeLessThanOrEqual(6);

      console.log(
        `🎯 Generated ${result.clusters.length} executive clusters from ${clusteringFeatures.length} signals`
      );
    });

    test('should execute in under 30 seconds', async () => {
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES
      );

      const startTime = Date.now();
      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);
      const totalTime = Date.now() - startTime;

      expect(totalTime).toBeLessThan(30000); // <30s requirement
      expect(result.processingMetrics.processingTime).toBeLessThan(30000);

      console.log(`⚡ Clustering completed in ${totalTime}ms (target: <30s)`);
    });

    test('should maintain cluster quality above 70%', async () => {
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES
      );

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Validate overall quality
      expect(result.processingMetrics.qualityScore).toBeGreaterThan(0.7);

      // Validate individual cluster quality
      for (const cluster of result.clusters) {
        expect(cluster.clusterQuality).toBeGreaterThan(0.5);
        expect(cluster.businessRelevance).toBeGreaterThan(0.5);
        expect(cluster.executiveActionability).toBeGreaterThan(0.3);
      }

      console.log(
        `📊 Quality Metrics: Overall ${(result.processingMetrics.qualityScore * 100).toFixed(1)}%`
      );
    });
  });

  describe('Stage 1: Domain Pre-Clustering', () => {
    test('should group signals by root cause and department', async () => {
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES
      );

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Verify each cluster has a clear root cause
      for (const cluster of result.clusters) {
        expect([
          'PROCESS',
          'RESOURCE',
          'COMMUNICATION',
          'TECHNOLOGY',
          'TRAINING',
          'QUALITY',
        ]).toContain(cluster.rootCause);

        // Cluster should have reasonable size (not too small or large)
        expect(cluster.signalCount).toBeGreaterThanOrEqual(2);
        expect(cluster.signalCount).toBeLessThanOrEqual(12);

        // Affected departments should be logical
        expect(cluster.affectedDepartments.length).toBeGreaterThan(0);
      }
    });

    test('should apply A&E business rules correctly', async () => {
      // Create specific test case for PROCESS signals (high merge priority)
      const processSignals = EXECUTIVE_CLUSTERING_TEST_CASES.filter(
        s => s.rootCause === 'PROCESS'
      );
      const clusteringFeatures =
        await generateTestClusteringFeatures(processSignals);

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Process signals should be merged into fewer clusters due to high merge priority
      expect(result.clusters.length).toBeLessThanOrEqual(2);

      // At least one cluster should be PROCESS-focused
      const processCluster = result.clusters.find(
        c => c.rootCause === 'PROCESS'
      );
      expect(processCluster).toBeDefined();

      if (processCluster) {
        expect(processCluster.signalCount).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('Stage 2: Semantic Refinement', () => {
    test('should refine clusters based on semantic similarity', async () => {
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES
      );

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Validate semantic cohesion within clusters
      for (const cluster of result.clusters) {
        // Clusters should have reasonable cohesion
        expect(cluster.clusterQuality).toBeGreaterThan(0.3);

        // Executive summary should reflect cluster content
        expect(cluster.executiveSummary).toContain(
          cluster.rootCause.toLowerCase()
        );
        expect(cluster.executiveSummary.length).toBeGreaterThan(50);

        // Title should be descriptive
        expect(cluster.title).toContain(cluster.signalCount.toString());
      }
    });

    test('should split large clusters and merge small ones', async () => {
      // Create test with intentionally large cluster (all RESOURCE signals)
      const resourceSignals = EXECUTIVE_CLUSTERING_TEST_CASES.filter(
        s => s.rootCause === 'RESOURCE'
      );
      const clusteringFeatures =
        await generateTestClusteringFeatures(resourceSignals);

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Should handle large clusters appropriately
      expect(result.clusters.length).toBeGreaterThanOrEqual(1);

      // No cluster should be too large for executive consumption
      for (const cluster of result.clusters) {
        expect(cluster.signalCount).toBeLessThanOrEqual(12);
      }
    });
  });

  describe('Stage 3: Executive Optimization', () => {
    test('should generate actionable business intelligence', async () => {
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES
      );

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Validate executive intelligence quality
      for (const cluster of result.clusters) {
        // Business impact should be calculated
        expect(cluster.businessImpact).toBeDefined();
        expect(['LOW', 'MEDIUM', 'HIGH']).toContain(
          cluster.businessImpact.costImpact
        );
        expect(['LOW', 'MEDIUM', 'HIGH']).toContain(
          cluster.businessImpact.timelineRisk
        );
        expect(['LOW', 'MEDIUM', 'HIGH']).toContain(
          cluster.businessImpact.clientSatisfaction
        );
        expect(cluster.businessImpact.overallScore).toBeGreaterThanOrEqual(0);
        expect(cluster.businessImpact.overallScore).toBeLessThanOrEqual(1);

        // Recommended actions should be present
        expect(cluster.recommendedActions.length).toBeGreaterThan(0);
        expect(cluster.recommendedActions.length).toBeLessThanOrEqual(3);

        for (const action of cluster.recommendedActions) {
          expect(action.action.length).toBeGreaterThan(10);
          expect(['LOW', 'MEDIUM', 'HIGH']).toContain(action.priority);
          expect(['LOW', 'MEDIUM', 'HIGH']).toContain(action.effort);
          expect(action.timeframe.length).toBeGreaterThan(0);
          expect(action.owner.length).toBeGreaterThan(0);
          expect(action.rationale.length).toBeGreaterThan(10);
        }
      }
    });

    test('should prioritize by business impact', async () => {
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES
      );

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Clusters should be ordered by business relevance
      const businessScores = result.clusters.map(c => c.businessRelevance);

      for (let i = 1; i < businessScores.length; i++) {
        // Should be in descending order of business relevance
        expect(businessScores[i]).toBeLessThanOrEqual(
          businessScores[i - 1] + 0.1
        ); // Allow small variance
      }
    });

    test('should generate comprehensive executive summary', async () => {
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES
      );

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Validate executive summary
      expect(result.executiveSummary).toBeDefined();
      expect(result.executiveSummary.topPriorities.length).toBeGreaterThan(0);
      expect(result.executiveSummary.criticalActions.length).toBeGreaterThan(0);
      expect(
        result.executiveSummary.resourceRequirements.length
      ).toBeGreaterThan(0);
      expect(result.executiveSummary.timeline.length).toBeGreaterThan(0);

      // Top priorities should come from high-impact clusters
      const highImpactClusters = result.clusters.filter(
        c => c.businessImpact.overallScore > 0.6
      );
      if (highImpactClusters.length > 0) {
        expect(result.executiveSummary.topPriorities.length).toBeGreaterThan(0);
      }

      console.log(
        `📋 Executive Summary: ${result.executiveSummary.topPriorities.length} priorities, ${result.executiveSummary.criticalActions.length} actions`
      );
    });
  });

  describe('Business Intelligence Quality', () => {
    test('should provide A&E domain-specific recommendations', async () => {
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES
      );

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Validate A&E domain specificity
      const allActions = result.clusters.flatMap(c => c.recommendedActions);

      // Actions should contain A&E-specific terminology
      const aeTerms = [
        'workflow',
        'design',
        'review',
        'coordination',
        'project',
        'team',
        'process',
        'quality',
      ];
      let termMatches = 0;

      for (const action of allActions) {
        for (const term of aeTerms) {
          if (action.action.toLowerCase().includes(term)) {
            termMatches++;
            break;
          }
        }
      }

      // At least 70% of actions should contain A&E terminology
      const aeRelevance = termMatches / allActions.length;
      expect(aeRelevance).toBeGreaterThan(0.7);

      console.log(
        `🏗️ A&E Relevance: ${(aeRelevance * 100).toFixed(1)}% of actions contain domain terminology`
      );
    });

    test('should align with executive decision-making patterns', async () => {
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES
      );

      const result =
        await clusteringEngine.executeHybridClustering(clusteringFeatures);

      // Validate executive alignment
      let highPriorityActions = 0;
      let mediumEffortActions = 0;
      let shortTermActions = 0;

      for (const cluster of result.clusters) {
        for (const action of cluster.recommendedActions) {
          if (action.priority === 'HIGH') highPriorityActions++;
          if (action.effort === 'MEDIUM') mediumEffortActions++;
          if (action.timeframe.includes('week')) shortTermActions++;
        }
      }

      // Should have balance of priorities and efforts
      const totalActions = result.clusters.reduce(
        (sum, c) => sum + c.recommendedActions.length,
        0
      );
      expect(highPriorityActions).toBeGreaterThan(0);
      expect(shortTermActions).toBeGreaterThan(0);

      // Not everything should be high priority (executive realism)
      expect(highPriorityActions / totalActions).toBeLessThan(0.8);

      console.log(
        `⚖️ Executive Balance: ${highPriorityActions}/${totalActions} high priority, ${shortTermActions} short-term`
      );
    });
  });

  describe('Integration with Complete Pipeline', () => {
    test('should integrate with Phase 1 and Phase 2 seamlessly', async () => {
      // Test a smaller subset for integration testing
      const testSignals = EXECUTIVE_CLUSTERING_TEST_CASES.slice(0, 8);

      // Simulate complete pipeline: Domain → Features → Clustering
      const pipelineRequests = testSignals.map(signal => ({
        signalId: signal.signalId,
        title: signal.title,
        description: signal.description,
        metadata: {
          department: signal.department,
          severity: signal.urgency,
          createdBy: 'test-user',
          tags: [signal.rootCause.toLowerCase()],
        },
      }));

      // Execute complete pipeline
      const pipelineResult = await pipelineIntegrator.executeCompletePipeline(
        pipelineRequests.map(r => r.signalId)
      );

      // Validate pipeline integration
      expect(pipelineResult.pipelineResults.length).toBeGreaterThan(0);
      expect(pipelineResult.clusteringResult.success).toBe(true);
      expect(
        pipelineResult.clusteringResult.clusters.length
      ).toBeGreaterThanOrEqual(2);
      expect(
        pipelineResult.clusteringResult.clusters.length
      ).toBeLessThanOrEqual(6);
      expect(pipelineResult.executiveSummary.length).toBeGreaterThan(50);

      console.log(
        `🔗 Pipeline Integration: ${pipelineResult.pipelineResults.length} → ${pipelineResult.clusteringResult.clusters.length} clusters`
      );
    });

    test('should handle automatic clustering triggers', async () => {
      // Test auto-clustering when enough signals are ready
      const triggerResult = await pipelineIntegrator.triggerClusteringIfReady();

      // Should either trigger successfully or provide clear reason why not
      expect(triggerResult.triggered).toBeDefined();
      expect(triggerResult.reason.length).toBeGreaterThan(0);

      if (triggerResult.triggered) {
        expect(triggerResult.clusteringResult).toBeDefined();
        expect(triggerResult.clusteringResult.success).toBe(true);
      }

      console.log(
        `🎯 Auto-trigger: ${triggerResult.triggered ? 'SUCCESS' : 'SKIPPED'} - ${triggerResult.reason}`
      );
    });
  });

  describe('Performance and Scalability', () => {
    test('should handle concurrent clustering requests gracefully', async () => {
      const clusteringFeatures = await generateTestClusteringFeatures(
        EXECUTIVE_CLUSTERING_TEST_CASES.slice(0, 10)
      );

      // Run multiple clustering requests concurrently
      const concurrentPromises = Array.from({ length: 3 }, () =>
        clusteringEngine.executeHybridClustering(clusteringFeatures)
      );

      const results = await Promise.allSettled(concurrentPromises);

      // At least one should succeed
      const successful = results.filter(r => r.status === 'fulfilled').length;
      expect(successful).toBeGreaterThan(0);

      console.log(
        `🔄 Concurrent Processing: ${successful}/3 requests succeeded`
      );
    });

    test('should scale with different signal counts', async () => {
      const signalCounts = [4, 8, 12, 20];

      for (const count of signalCounts) {
        const testCases = EXECUTIVE_CLUSTERING_TEST_CASES.slice(0, count);
        const clusteringFeatures =
          await generateTestClusteringFeatures(testCases);

        const startTime = Date.now();
        const result =
          await clusteringEngine.executeHybridClustering(clusteringFeatures);
        const duration = Date.now() - startTime;

        // Should maintain quality and performance across scales
        expect(result.success).toBe(true);
        expect(result.clusters.length).toBeGreaterThanOrEqual(
          Math.min(4, Math.floor(count / 4))
        );
        expect(result.clusters.length).toBeLessThanOrEqual(6);
        expect(duration).toBeLessThan(30000);

        console.log(
          `📏 Scale Test: ${count} signals → ${result.clusters.length} clusters in ${duration}ms`
        );
      }
    });
  });

  // Helper function to generate clustering features for test cases
  async function generateTestClusteringFeatures(
    testCases: any[]
  ): Promise<ClusteringFeatures[]> {
    const features: ClusteringFeatures[] = [];

    for (const testCase of testCases) {
      // Generate domain classification
      const domainResult = await domainEngine.classifyInput({
        inputId: testCase.signalId,
        title: testCase.title,
        description: testCase.description,
        metadata: {
          department: testCase.department,
          severity: testCase.urgency,
        },
      });

      // Generate multi-dimensional features
      const featureResult = await featureEngine.generateFeatures({
        signalId: testCase.signalId,
        domainClassification: domainResult,
        inputText: testCase.description,
        metadata: {
          department: testCase.department,
          severity: testCase.urgency,
          createdBy: 'test-user',
          timestamp: new Date(),
        },
      });

      features.push(featureResult.features);
    }

    return features;
  }
});

/**
 * Executive Satisfaction Validation Tests
 * These tests validate business value and executive usability
 */
describe('Executive Satisfaction Validation', () => {
  test('should generate clusters executives can act on immediately', async () => {
    const clusteringEngine = new ExecutiveHybridClusteringEngine();
    const testCases = EXECUTIVE_CLUSTERING_TEST_CASES.slice(0, 12);

    const clusteringFeatures = await generateTestClusteringFeatures(testCases);
    const result =
      await clusteringEngine.executeHybridClustering(clusteringFeatures);

    // Executive actionability validation
    let immediateActions = 0;
    let clearOwnership = 0;
    let reasonableTimeframes = 0;

    for (const cluster of result.clusters) {
      for (const action of cluster.recommendedActions) {
        // Immediate actions (< 4 weeks)
        if (
          action.timeframe.includes('week') &&
          !action.timeframe.includes('12')
        ) {
          immediateActions++;
        }

        // Clear ownership
        if (action.owner !== 'TBD' && action.owner.length > 3) {
          clearOwnership++;
        }

        // Reasonable timeframes (not vague)
        if (
          action.timeframe.includes('week') ||
          action.timeframe.includes('month')
        ) {
          reasonableTimeframes++;
        }
      }
    }

    const totalActions = result.clusters.reduce(
      (sum, c) => sum + c.recommendedActions.length,
      0
    );

    // Executive satisfaction criteria
    expect(immediateActions / totalActions).toBeGreaterThan(0.5); // >50% immediate actions
    expect(clearOwnership / totalActions).toBeGreaterThan(0.8); // >80% clear ownership
    expect(reasonableTimeframes / totalActions).toBeGreaterThan(0.9); // >90% clear timeframes

    console.log(`👔 Executive Satisfaction Metrics:`, {
      immediateActions: `${((immediateActions / totalActions) * 100).toFixed(1)}%`,
      clearOwnership: `${((clearOwnership / totalActions) * 100).toFixed(1)}%`,
      reasonableTimeframes: `${((reasonableTimeframes / totalActions) * 100).toFixed(1)}%`,
    });
  });

  // Helper function for executive satisfaction tests
  async function generateTestClusteringFeatures(
    testCases: typeof EXECUTIVE_CLUSTERING_TEST_CASES
  ): Promise<ClusteringFeatures[]> {
    const domainEngine = new AEDomainClassificationEngine();
    const featureEngine = new MultiDimensionalFeatureEngine();
    const features: ClusteringFeatures[] = [];

    for (const testCase of testCases) {
      const domainResult = await domainEngine.classifyInput({
        inputId: testCase.signalId,
        title: testCase.title,
        description: testCase.description,
        metadata: {
          department: testCase.department,
          severity: testCase.urgency,
        },
      });

      const featureResult = await featureEngine.generateFeatures({
        signalId: testCase.signalId,
        domainClassification: domainResult,
        inputText: testCase.description,
        metadata: {
          department: testCase.department,
          severity: testCase.urgency,
          createdBy: 'test-user',
          timestamp: new Date(),
        },
      });

      features.push(featureResult.features);
    }

    return features;
  }
});
