/**
 * Feature Engineering Demo - Sprint 2 Task 1
 * Expert: Dr. Elena Rodriguez (Advanced Clustering Specialist)
 *
 * Demonstrate multi-dimensional feature engineering for hybrid clustering
 */

import { featureEngineeringEngine } from '../src/lib/clustering/feature-engineering';
import type { EnhancedTagging } from '../src/types/enhanced-tagging';

// Sample enhanced tagging data representing what's in the database
const sampleEnhancedTagging: EnhancedTagging[] = [
  {
    rootCause: {
      primary: 'QUALITY',
      confidence: 0.85,
      alternatives: [{ cause: 'PROCESS', confidence: 0.3 }],
    },
    businessContext: {
      department: 'Field Services',
      urgency: 'HIGH',
      impact: 'SIGNIFICANT',
      estimatedCost: 'HIGH',
    },
    aeSpecific: {
      projectPhase: 'CONSTRUCTION',
      buildingType: 'COMMERCIAL',
      qualityCategory: 'CONSTRUCTION_DEFECT',
    },
    processContext: {
      stakeholders: ['Project Manager', 'Structural Engineer', 'Client'],
      affectedWorkflows: ['Quality Control', 'Remediation'],
      dependencies: ['Engineer Approval'],
      blockers: ['Weather Delay'],
    },
    extractedEntities: [
      { type: 'PROJECT', value: 'Office Building Phase 2', confidence: 0.9 },
      { type: 'CLIENT', value: 'Metro Development', confidence: 0.8 },
    ],
    confidence: 0.85,
    modelVersion: '1.0.0-enhanced',
    generatedAt: new Date().toISOString(),
    processingTime: 150,
  },
  {
    rootCause: {
      primary: 'COMMUNICATION',
      confidence: 0.75,
      alternatives: [{ cause: 'EXTERNAL', confidence: 0.4 }],
    },
    businessContext: {
      department: 'Architecture',
      urgency: 'MEDIUM',
      impact: 'MODERATE',
      estimatedCost: 'MEDIUM',
    },
    aeSpecific: {
      projectPhase: 'DESIGN',
      buildingType: 'RESIDENTIAL',
      qualityCategory: 'COORDINATION',
    },
    processContext: {
      stakeholders: ['Client', 'Architect', 'City Planner'],
      affectedWorkflows: ['Design Review', 'Approval Process'],
      dependencies: ['Client Response'],
      blockers: ['Permit Delay'],
    },
    extractedEntities: [
      { type: 'PROJECT', value: 'Residential Development', confidence: 0.9 },
      { type: 'CLIENT', value: 'Sunrise Homes', confidence: 0.8 },
    ],
    confidence: 0.75,
    modelVersion: '1.0.0-enhanced',
    generatedAt: new Date().toISOString(),
    processingTime: 120,
  },
  {
    rootCause: {
      primary: 'TECHNOLOGY',
      confidence: 0.9,
      alternatives: [{ cause: 'RESOURCE', confidence: 0.2 }],
    },
    businessContext: {
      department: 'Architecture',
      urgency: 'HIGH',
      impact: 'MODERATE',
      estimatedCost: 'LOW',
    },
    aeSpecific: {
      projectPhase: 'DESIGN',
      buildingType: 'COMMERCIAL',
      qualityCategory: 'COORDINATION',
    },
    processContext: {
      stakeholders: ['Design Team', 'IT Support'],
      affectedWorkflows: ['CAD Design', 'File Management'],
      dependencies: ['Software Update'],
      blockers: ['System Downtime'],
    },
    extractedEntities: [
      { type: 'SOFTWARE', value: 'Revit 2024', confidence: 0.95 },
      { type: 'SYSTEM', value: 'Design Workstation', confidence: 0.8 },
    ],
    confidence: 0.9,
    modelVersion: '1.0.0-enhanced',
    generatedAt: new Date().toISOString(),
    processingTime: 90,
  },
  {
    rootCause: {
      primary: 'PROCESS',
      confidence: 0.8,
      alternatives: [{ cause: 'TRAINING', confidence: 0.5 }],
    },
    businessContext: {
      department: 'Project Management',
      urgency: 'MEDIUM',
      impact: 'MODERATE',
      estimatedCost: 'MEDIUM',
    },
    aeSpecific: {
      projectPhase: 'CONSTRUCTION',
      buildingType: 'MIXED_USE',
      qualityCategory: 'COORDINATION',
    },
    processContext: {
      stakeholders: ['Project Manager', 'Subcontractors', 'Owner'],
      affectedWorkflows: ['Schedule Management', 'Resource Allocation'],
      dependencies: ['Material Delivery'],
      blockers: ['Permit Pending'],
    },
    extractedEntities: [
      { type: 'PROJECT', value: 'Mixed-Use Development', confidence: 0.9 },
      { type: 'VENDOR', value: 'Construction Supply Co', confidence: 0.7 },
    ],
    confidence: 0.8,
    modelVersion: '1.0.0-enhanced',
    generatedAt: new Date().toISOString(),
    processingTime: 110,
  },
];

// Signal metadata samples
const signalMetadata = [
  {
    id: 'signal-1',
    title: 'Foundation Pour Quality Control Failure',
    description:
      'Concrete foundation pour failed quality inspection due to improper rebar placement and insufficient concrete strength. Requires structural engineer review and remediation plan before proceeding with framing work.',
    department: 'Field Services',
    severity: 'HIGH',
  },
  {
    id: 'signal-2',
    title: 'Client Design Approval Delay - Residential Plans',
    description:
      'Residential client has not responded to architectural plan submissions for 3 weeks. Project schedule at risk of delay. Need to schedule expedited review meeting to maintain construction timeline.',
    department: 'Architecture',
    severity: 'MEDIUM',
  },
  {
    id: 'signal-3',
    title: 'Revit Software Performance Issues',
    description:
      'Revit 2024 crashing frequently during large model manipulation affecting entire design team productivity. Need immediate IT support for hardware/software optimization or alternative solution.',
    department: 'Architecture',
    severity: 'HIGH',
  },
  {
    id: 'signal-4',
    title: 'Subcontractor Coordination Bottleneck',
    description:
      'Multiple subcontractor schedules conflicting causing construction delays. Project management workflow needs optimization for better resource coordination and timeline management.',
    department: 'Project Management',
    severity: 'MEDIUM',
  },
];

async function demonstrateFeatureEngineering() {
  console.log('🔧 Feature Engineering Demo - Sprint 2 Task 1\n');
  console.log('Expert: Dr. Elena Rodriguez (Advanced Clustering Specialist)');
  console.log('Multi-dimensional feature engineering for hybrid clustering\n');
  console.log('='.repeat(80) + '\n');

  const results = [];
  const processingTimes: number[] = [];
  const qualityScores: number[] = [];

  // Generate features for each sample signal
  for (let i = 0; i < sampleEnhancedTagging.length; i++) {
    const tagging = sampleEnhancedTagging[i];
    const metadata = signalMetadata[i];
    const signalNumber = i + 1;

    console.log(
      `🔧 Generating Features for Signal ${signalNumber}/${sampleEnhancedTagging.length}`
    );
    console.log(`   Signal ID: ${metadata.id}`);
    console.log(`   Title: ${metadata.title}`);
    console.log(
      `   Root Cause: ${tagging.rootCause.primary} (${(tagging.rootCause.confidence * 100).toFixed(1)}%)`
    );
    console.log(`   Department: ${tagging.businessContext.department}`);
    console.log(
      `   Business Impact: ${tagging.businessContext.impact} | Urgency: ${tagging.businessContext.urgency}`
    );

    const startTime = Date.now();

    try {
      const result = await featureEngineeringEngine.generateClusteringFeatures(
        metadata.id,
        tagging,
        metadata
      );

      const processingTime = Date.now() - startTime;
      processingTimes.push(processingTime);

      if (result.success) {
        const { features, qualityMetrics } = result;
        qualityScores.push(features.qualityScore);

        console.log(`   ✅ Features Generated Successfully`);
        console.log(
          `   📊 Domain Features (${features.domainFeatures.rootCauseVector.length + features.domainFeatures.departmentVector.length + features.domainFeatures.businessImpactVector.length} dimensions)`
        );
        console.log(
          `      • Root Cause Vector: [${features.domainFeatures.rootCauseVector.map(v => v.toFixed(2)).join(', ')}]`
        );
        console.log(
          `      • Department Vector: [${features.domainFeatures.departmentVector.map(v => v.toFixed(2)).join(', ')}]`
        );
        console.log(
          `      • Business Impact: [${features.domainFeatures.businessImpactVector.map(v => v.toFixed(2)).join(', ')}]`
        );
        console.log(
          `      • A&E Domain Context: [${features.domainFeatures.aeDomainVector.map(v => v.toFixed(2)).join(', ')}]`
        );

        console.log(
          `   🧠 Semantic Features (${features.semanticFeatures.titleEmbedding.length + features.semanticFeatures.descriptionEmbedding.length} embedding dimensions)`
        );
        console.log(
          `      • Title Embedding: ${features.semanticFeatures.titleEmbedding.length} dimensions`
        );
        console.log(
          `      • Description Embedding: ${features.semanticFeatures.descriptionEmbedding.length} dimensions`
        );
        console.log(
          `      • Text Complexity: ${features.semanticFeatures.textComplexity.toFixed(2)}`
        );
        console.log(
          `      • Domain Terminology Density: ${features.semanticFeatures.domainTerminologyDensity.toFixed(2)}`
        );

        console.log(`   ⚡ Performance & Quality:`);
        console.log(`      • Processing Time: ${processingTime}ms`);
        console.log(
          `      • Feature Quality Score: ${features.qualityScore.toFixed(3)}`
        );
        console.log(
          `      • Overall Confidence: ${features.confidence.toFixed(3)}`
        );
        console.log(
          `      • Combined Vector Dimensions: ${features.combinedVector.length}`
        );

        console.log(`   📈 Quality Breakdown:`);
        console.log(
          `      • Domain Feature Quality: ${qualityMetrics.domainFeatureQuality.toFixed(3)}`
        );
        console.log(
          `      • Semantic Feature Quality: ${qualityMetrics.semanticFeatureQuality.toFixed(3)}`
        );
        console.log(
          `      • Consistency Score: ${qualityMetrics.consistencyScore.toFixed(3)}`
        );

        if (result.warnings.length > 0) {
          console.log(`   ⚠️  Warnings: ${result.warnings.join(', ')}`);
        }

        results.push({
          signalId: metadata.id,
          title: metadata.title,
          rootCause: tagging.rootCause.primary,
          features,
          qualityMetrics,
          processingTime,
          success: true,
        });
      } else {
        console.log(`   ❌ Feature Generation Failed: ${result.error}`);
        results.push({
          signalId: metadata.id,
          title: metadata.title,
          success: false,
          error: result.error,
          processingTime,
        });
      }
    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      console.log(`   ❌ Exception: ${error.message}`);
      results.push({
        signalId: metadata.id,
        title: metadata.title,
        success: false,
        error: error.message,
        processingTime,
      });
    }

    console.log('');
  }

  // Calculate and display similarity analysis
  console.log('🎯 Feature Similarity Analysis\n');

  const successfulResults = results.filter((r: any) => r.success);
  if (successfulResults.length >= 2) {
    console.log(
      'Calculating pairwise similarities between generated features...\n'
    );

    for (let i = 0; i < successfulResults.length; i++) {
      for (let j = i + 1; j < successfulResults.length; j++) {
        const result1 = successfulResults[i];
        const result2 = successfulResults[j];

        const similarity = featureEngineeringEngine.calculateSimilarity(
          result1.features,
          result2.features
        );

        console.log(
          `📊 Similarity: ${result1.signalId} ↔ ${result2.signalId}`
        );
        console.log(`   Signals: "${result1.title}" ↔ "${result2.title}"`);
        console.log(
          `   Root Causes: ${result1.rootCause} ↔ ${result2.rootCause}`
        );
        console.log(
          `   Domain Similarity: ${similarity.domainSimilarity.toFixed(3)}`
        );
        console.log(
          `   Semantic Similarity: ${similarity.semanticSimilarity.toFixed(3)}`
        );
        console.log(
          `   Combined Similarity: ${similarity.combinedSimilarity.toFixed(3)}`
        );
        console.log(`   Confidence: ${similarity.confidence.toFixed(3)}`);
        console.log('');
      }
    }
  }

  // Display comprehensive results summary
  console.log('='.repeat(80));
  console.log('📊 FEATURE ENGINEERING RESULTS SUMMARY');
  console.log('='.repeat(80));

  const successCount = results.filter((r: any) => r.success).length;
  const avgProcessingTime =
    processingTimes.reduce((sum, time) => sum + time, 0) /
    processingTimes.length;
  const avgQualityScore =
    qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;

  console.log(`\n📈 PROCESSING SUMMARY:`);
  console.log(`   Total Signals Processed: ${results.length}`);
  console.log(`   Successfully Generated Features: ${successCount}`);
  console.log(`   Failed: ${results.length - successCount}`);
  console.log(
    `   Success Rate: ${((successCount / results.length) * 100).toFixed(1)}%`
  );
  console.log(`   Average Processing Time: ${avgProcessingTime.toFixed(0)}ms`);
  console.log(`   Average Quality Score: ${avgQualityScore.toFixed(3)}`);

  console.log(`\n🎯 FEATURE ENGINEERING CAPABILITIES:`);
  console.log(
    `   ✅ Multi-dimensional feature vectors combining domain + semantic`
  );
  console.log(`   ✅ A&E industry domain expertise integration`);
  console.log(`   ✅ Root cause one-hot encoding for structured clustering`);
  console.log(
    `   ✅ Business impact quantification for executive decision support`
  );
  console.log(`   ✅ Semantic embeddings for contextual similarity`);
  console.log(`   ✅ Quality scoring and confidence metrics`);

  console.log(`\n🔧 TECHNICAL SPECIFICATIONS:`);
  if (successfulResults.length > 0) {
    const sampleFeatures = successfulResults[0].features;
    console.log(
      `   • Domain Features: ${
        sampleFeatures.domainFeatures.rootCauseVector.length +
        sampleFeatures.domainFeatures.departmentVector.length +
        sampleFeatures.domainFeatures.businessImpactVector.length +
        sampleFeatures.domainFeatures.aeDomainVector.length +
        7
      } dimensions (60% weight)`
    );
    console.log(
      `   • Semantic Features: ${
        sampleFeatures.semanticFeatures.titleEmbedding.length +
        sampleFeatures.semanticFeatures.descriptionEmbedding.length
      } embedding dimensions (40% weight)`
    );
    console.log(
      `   • Combined Feature Vector: ${sampleFeatures.combinedVector.length} total dimensions`
    );
    console.log(
      `   • Feature Generation: ${avgProcessingTime.toFixed(0)}ms average (target: <100ms)`
    );
  }

  // Root cause distribution for clustering preview
  console.log(`\n🎯 ROOT CAUSE DISTRIBUTION (Clustering Preview):`);
  const rootCauseDistribution: Record<string, number> = {};
  successfulResults.forEach((result: any) => {
    const rootCause = result.rootCause;
    rootCauseDistribution[rootCause] =
      (rootCauseDistribution[rootCause] || 0) + 1;
  });

  Object.entries(rootCauseDistribution)
    .sort(([, a], [, b]) => b - a)
    .forEach(([rootCause, count]) => {
      const percentage = ((count / successfulResults.length) * 100).toFixed(1);
      console.log(`   ${rootCause}: ${count} signals (${percentage}%)`);
    });

  // Sprint 2 readiness validation
  console.log(`\n✅ SPRINT 2 CLUSTERING READINESS:`);
  const performanceMet = avgProcessingTime < 100;
  console.log(
    `   ✅ Performance target: ${performanceMet ? 'MET' : 'NEEDS OPTIMIZATION'} (${avgProcessingTime.toFixed(0)}ms avg, target: <100ms)`
  );

  const qualityMet = avgQualityScore > 0.7;
  console.log(
    `   ✅ Quality threshold: ${qualityMet ? 'MET' : 'NEEDS IMPROVEMENT'} (${avgQualityScore.toFixed(3)} avg, target: >0.7)`
  );

  const diversityMet = Object.keys(rootCauseDistribution).length >= 3;
  console.log(
    `   ✅ Root cause diversity: ${diversityMet ? 'EXCELLENT' : 'NEEDS MORE VARIETY'} (${Object.keys(rootCauseDistribution).length} categories)`
  );

  const readyForClustering = performanceMet && qualityMet && diversityMet;
  console.log(
    `\n🎉 CLUSTERING ALGORITHM READINESS: ${readyForClustering ? 'READY FOR HYBRID CLUSTERING' : 'NEEDS OPTIMIZATION'}`
  );

  if (readyForClustering) {
    console.log('\n🚀 SPRINT 2 TASK 2 PREPARATION:');
    console.log(
      '   ✅ Feature engineering provides foundation for hybrid clustering'
    );
    console.log(
      '   ✅ Domain features enable rule-based pre-clustering by root cause'
    );
    console.log(
      '   ✅ Semantic features enable AI refinement within domain groups'
    );
    console.log('   ✅ Quality metrics ensure reliable clustering inputs');
    console.log('   ✅ Performance optimized for real-time clustering updates');
    console.log('\n📈 Expected clustering transformation:');
    console.log('   ❌ Current: 1 giant useless cluster');
    console.log('   ✅ Target: 4-6 meaningful business clusters:');
    console.log(
      '     • Quality Control Issues (foundation, compliance, defects)'
    );
    console.log(
      '     • Communication Problems (client approvals, coordination)'
    );
    console.log(
      '     • Technology Infrastructure (software crashes, performance)'
    );
    console.log(
      '     • Process Optimization (workflow, resource coordination)'
    );
  }

  console.log('\n' + '='.repeat(80));
}

// Run the demonstration
demonstrateFeatureEngineering().catch(e => {
  console.error('\n❌ Feature engineering demo failed:', e);
  process.exit(1);
});
