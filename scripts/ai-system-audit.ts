/**
 * AI System Comprehensive Audit Script
 * Expert Team: Dr. Priya Patel, Dr. Elena Rodriguez, Dr. James Park, Dr. Rachel Kim
 *
 * Audit all AI components, dependencies, and workflow alignment
 */

import { prisma } from '@/lib/prisma';

interface AIAuditReport {
  signalAnalysis: {
    totalSignals: number;
    withEnhancedTagging: number;
    withClusteringFeatures: number;
    tagDistribution: {
      rootCauses: Record<string, number>;
      departments: Record<string, number>;
      issueTypes: Record<string, number>;
      urgencies: Record<string, number>;
    };
  };

  clusteringAnalysis: {
    totalHotspots: number;
    averageSignalsPerHotspot: number;
    clusteringEfficiency: number;
    lastClusteredAt?: Date;
  };

  aiWorkflowAlignment: {
    f1TaggingCoverage: number;
    f3ClusteringSuccess: number;
    confidenceScoring: {
      averageConfidence: number;
      lowConfidenceCount: number;
    };
  };

  criticalIssues: string[];
  recommendations: string[];
}

async function auditAISystem(): Promise<AIAuditReport> {
  console.log('🧠 Starting comprehensive AI system audit...');

  const report: AIAuditReport = {
    signalAnalysis: {
      totalSignals: 0,
      withEnhancedTagging: 0,
      withClusteringFeatures: 0,
      tagDistribution: {
        rootCauses: {},
        departments: {},
        issueTypes: {},
        urgencies: {},
      },
    },
    clusteringAnalysis: {
      totalHotspots: 0,
      averageSignalsPerHotspot: 0,
      clusteringEfficiency: 0,
    },
    aiWorkflowAlignment: {
      f1TaggingCoverage: 0,
      f3ClusteringSuccess: 0,
      confidenceScoring: {
        averageConfidence: 0,
        lowConfidenceCount: 0,
      },
    },
    criticalIssues: [],
    recommendations: [],
  };

  try {
    // 1. Signal Analysis
    console.log('📊 Auditing signal tagging...');

    const signals = await (prisma as any).signals.findMany({
      select: {
        id: true,
        enhancedTagsJson: true,
        clusteringFeaturesJson: true,
        aiConfidence: true,
        qualityScore: true,
      },
    });

    report.signalAnalysis.totalSignals = signals.length;

    const confidenceScores: number[] = [];

    for (const signal of signals) {
      // Enhanced tagging analysis
      if (signal.enhancedTagsJson) {
        report.signalAnalysis.withEnhancedTagging++;

        const tags = signal.enhancedTagsJson;

        // Root cause distribution
        if (tags.rootCause?.primary) {
          const cause = tags.rootCause.primary;
          report.signalAnalysis.tagDistribution.rootCauses[cause] =
            (report.signalAnalysis.tagDistribution.rootCauses[cause] || 0) + 1;
        }

        // Department distribution
        if (tags.department) {
          report.signalAnalysis.tagDistribution.departments[tags.department] =
            (report.signalAnalysis.tagDistribution.departments[
              tags.department
            ] || 0) + 1;
        }

        // Issue type distribution
        if (tags.issueType?.primary) {
          report.signalAnalysis.tagDistribution.issueTypes[
            tags.issueType.primary
          ] =
            (report.signalAnalysis.tagDistribution.issueTypes[
              tags.issueType.primary
            ] || 0) + 1;
        }

        // Urgency distribution
        if (tags.urgency) {
          report.signalAnalysis.tagDistribution.urgencies[tags.urgency] =
            (report.signalAnalysis.tagDistribution.urgencies[tags.urgency] ||
              0) + 1;
        }
      }

      // Clustering features analysis
      if (signal.clusteringFeaturesJson) {
        report.signalAnalysis.withClusteringFeatures++;
      }

      // Confidence analysis
      if (signal.aiConfidence !== null && signal.aiConfidence !== undefined) {
        confidenceScores.push(signal.aiConfidence);
      }
      if (signal.qualityScore !== null && signal.qualityScore !== undefined) {
        confidenceScores.push(signal.qualityScore);
      }
    }

    // Calculate confidence metrics
    if (confidenceScores.length > 0) {
      report.aiWorkflowAlignment.confidenceScoring.averageConfidence =
        confidenceScores.reduce((sum, score) => sum + score, 0) /
        confidenceScores.length;

      report.aiWorkflowAlignment.confidenceScoring.lowConfidenceCount =
        confidenceScores.filter(score => score < 0.6).length;
    }

    // 2. Clustering Analysis
    console.log('🔗 Auditing clustering system...');

    const hotspots = await (prisma as any).hotspots.findMany({
      include: {
        _count: {
          select: {
            hotspot_signals: true,
          },
        },
      },
    });

    report.clusteringAnalysis.totalHotspots = hotspots.length;

    if (hotspots.length > 0) {
      const totalSignalsInHotspots = hotspots.reduce(
        (sum: number, hotspot: any) =>
          sum + (hotspot._count?.hotspot_signals || 0),
        0
      );

      report.clusteringAnalysis.averageSignalsPerHotspot =
        totalSignalsInHotspots / hotspots.length;

      // Find most recent clustering
      const mostRecentHotspot = hotspots
        .filter((h: any) => h.lastClusteredAt)
        .sort(
          (a: any, b: any) =>
            new Date(b.lastClusteredAt).getTime() -
            new Date(a.lastClusteredAt).getTime()
        )[0];

      if (mostRecentHotspot) {
        report.clusteringAnalysis.lastClusteredAt =
          mostRecentHotspot.lastClusteredAt;
      }
    }

    // 3. Calculate workflow coverage
    report.aiWorkflowAlignment.f1TaggingCoverage =
      signals.length > 0
        ? (report.signalAnalysis.withEnhancedTagging / signals.length) * 100
        : 0;

    report.aiWorkflowAlignment.f3ClusteringSuccess =
      signals.length > 0
        ? report.clusteringAnalysis.averageSignalsPerHotspot > 1
          ? 100
          : 0
        : 0;

    // 4. Identify critical issues
    console.log('🚨 Identifying critical issues...');

    // Root cause diversity check
    const rootCauseCount = Object.keys(
      report.signalAnalysis.tagDistribution.rootCauses
    ).length;
    if (rootCauseCount <= 2) {
      report.criticalIssues.push(
        `LOW ROOT CAUSE DIVERSITY: Only ${rootCauseCount} different root causes detected. Need 4-6 for effective clustering.`
      );
    }

    // Single hotspot problem
    if (report.clusteringAnalysis.totalHotspots === 1 && signals.length > 10) {
      report.criticalIssues.push(
        `SINGLE HOTSPOT PROBLEM: ${signals.length} signals collapsed into 1 hotspot. Clustering algorithm failure.`
      );
    }

    // Low tagging coverage
    if (report.aiWorkflowAlignment.f1TaggingCoverage < 90) {
      report.criticalIssues.push(
        `LOW TAGGING COVERAGE: Only ${report.aiWorkflowAlignment.f1TaggingCoverage.toFixed(1)}% of signals have enhanced tagging.`
      );
    }

    // Low confidence scores
    if (report.aiWorkflowAlignment.confidenceScoring.averageConfidence < 0.7) {
      report.criticalIssues.push(
        `LOW AI CONFIDENCE: Average confidence ${report.aiWorkflowAlignment.confidenceScoring.averageConfidence.toFixed(2)}. Target: >0.8`
      );
    }

    // 5. Generate recommendations
    console.log('💡 Generating recommendations...');

    if (rootCauseCount <= 2) {
      report.recommendations.push(
        'ENHANCE SEED DATA: Create signals with diverse root causes (PROCESS, RESOURCE, COMMUNICATION, TECHNOLOGY, TRAINING)'
      );
    }

    if (report.clusteringAnalysis.totalHotspots <= 1) {
      report.recommendations.push(
        'FIX CLUSTERING ALGORITHM: Implement domain-aware pre-clustering with A&E business rules'
      );
    }

    if (report.aiWorkflowAlignment.f1TaggingCoverage < 90) {
      report.recommendations.push(
        'FORCE REPROCESS ALL SIGNALS: Run batch tagging to ensure all signals have enhanced tags'
      );
    }

    if (
      report.signalAnalysis.withClusteringFeatures <
      report.signalAnalysis.withEnhancedTagging
    ) {
      report.recommendations.push(
        'REGENERATE CLUSTERING FEATURES: Enhanced tags are not properly converted to clustering features'
      );
    }
  } catch (error) {
    console.error('Error during AI system audit:', error);
    report.criticalIssues.push(
      `AUDIT ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return report;
}

// Main execution
async function main() {
  try {
    const report = await auditAISystem();

    console.log('\n' + '='.repeat(80));
    console.log('🧠 AI SYSTEM COMPREHENSIVE AUDIT REPORT');
    console.log('='.repeat(80));

    console.log('\n📊 SIGNAL ANALYSIS:');
    console.log(`   Total Signals: ${report.signalAnalysis.totalSignals}`);
    console.log(
      `   With Enhanced Tagging: ${report.signalAnalysis.withEnhancedTagging} (${report.aiWorkflowAlignment.f1TaggingCoverage.toFixed(1)}%)`
    );
    console.log(
      `   With Clustering Features: ${report.signalAnalysis.withClusteringFeatures}`
    );

    console.log('\n🎯 TAG DISTRIBUTION:');
    console.log(
      '   Root Causes:',
      JSON.stringify(report.signalAnalysis.tagDistribution.rootCauses, null, 4)
    );
    console.log(
      '   Departments:',
      JSON.stringify(report.signalAnalysis.tagDistribution.departments, null, 4)
    );
    console.log(
      '   Issue Types:',
      JSON.stringify(report.signalAnalysis.tagDistribution.issueTypes, null, 4)
    );

    console.log('\n🔗 CLUSTERING ANALYSIS:');
    console.log(
      `   Total Hotspots: ${report.clusteringAnalysis.totalHotspots}`
    );
    console.log(
      `   Average Signals per Hotspot: ${report.clusteringAnalysis.averageSignalsPerHotspot.toFixed(1)}`
    );
    console.log(
      `   Last Clustered: ${report.clusteringAnalysis.lastClusteredAt || 'Never'}`
    );

    console.log('\n🎭 AI WORKFLOW ALIGNMENT:');
    console.log(
      `   F1 Tagging Coverage: ${report.aiWorkflowAlignment.f1TaggingCoverage.toFixed(1)}%`
    );
    console.log(
      `   F3 Clustering Success: ${report.aiWorkflowAlignment.f3ClusteringSuccess.toFixed(1)}%`
    );
    console.log(
      `   Average AI Confidence: ${report.aiWorkflowAlignment.confidenceScoring.averageConfidence.toFixed(2)}`
    );
    console.log(
      `   Low Confidence Count: ${report.aiWorkflowAlignment.confidenceScoring.lowConfidenceCount}`
    );

    if (report.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      report.criticalIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    }

    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      report.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎯 AUDIT COMPLETE');
    console.log('='.repeat(80));
  } catch (error) {
    console.error('Failed to run AI audit:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
