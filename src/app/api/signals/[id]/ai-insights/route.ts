/**
 * AI Insights API for Signals
 * Sprint 3 Story 2: AI Insights Integration
 * Expert: Dr. Priya Patel (AI Architect) + Alex Thompson (Lead Developer)
 *
 * Surface AI analysis insights with transparency and executive override capabilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route since it uses auth() which requires headers
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/signals/[id]/ai-insights
 * Get AI insights for a specific signal
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const signalId = params.id;

    // Get signal with AI data
    const signal = await (prisma as any).signal.findUnique({
      where: { id: signalId },
      select: {
        id: true,
        title: true,
        description: true,
        severity: true,
        aiProcessed: true,
        aiTagsJson: true,
        enhancedTagsJson: true,
        tagGenerationMeta: true,
        domainClassification: true,
        lastTaggedAt: true,
        tagModelVersion: true,
        clusteringFeaturesJson: true,
        lastFeaturesGeneratedAt: true,
        featuresVersion: true,
        featuresQualityScore: true,
        confidence: true,
        createdAt: true,
        department: { select: { name: true } },
        team: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    if (!signal) {
      return NextResponse.json({ error: 'Signal not found' }, { status: 404 });
    }

    // Generate AI insights from signal data
    const insights = generateSignalInsights(signal);

    return NextResponse.json({
      success: true,
      insights,
      metadata: {
        signalId: signal.id,
        aiProcessed: signal.aiProcessed,
        lastAnalyzed: signal.lastTaggedAt || signal.lastFeaturesGeneratedAt,
        totalInsights: insights.length,
        highPriorityInsights: insights.filter(
          (i: any) => i.priority === 'HIGH' || i.priority === 'CRITICAL'
        ).length,
      },
    });
  } catch (error: any) {
    console.error('Failed to get AI insights:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve AI insights',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Generate comprehensive AI insights from signal data
 */
function generateSignalInsights(signal: any): any[] {
  const insights: any[] = [];

  // Enhanced Tagging Insights
  if (signal.enhancedTagsJson) {
    const enhancedTags = signal.enhancedTagsJson;

    // Confidence insight
    insights.push({
      id: `${signal.id}-tagging-confidence`,
      type: 'CONFIDENCE',
      source: 'TAGGING',
      title: 'AI Tagging Confidence',
      description: `AI tagging analysis completed with ${Math.round(enhancedTags.confidence * 100)}% confidence. ${
        enhancedTags.confidence > 0.8
          ? 'High confidence in automated categorization.'
          : enhancedTags.confidence > 0.6
            ? 'Moderate confidence - executive review recommended.'
            : 'Low confidence - manual review required.'
      }`,
      confidence: enhancedTags.confidence,
      actionable: enhancedTags.confidence < 0.7,
      priority:
        enhancedTags.confidence < 0.6
          ? 'HIGH'
          : enhancedTags.confidence < 0.8
            ? 'MEDIUM'
            : 'LOW',
      metadata: {
        modelVersion: signal.tagModelVersion,
        lastGenerated: signal.lastTaggedAt,
        dataPoints: Object.keys(enhancedTags).length,
      },
      executiveOverride: {
        enabled: true,
        overridden: false,
      },
    });

    // Domain Classification Insight
    if (enhancedTags.domainClassification) {
      const domain = enhancedTags.domainClassification;
      insights.push({
        id: `${signal.id}-domain-classification`,
        type: 'INFO',
        source: 'TAGGING',
        title: 'Domain Classification',
        description: `Classified as ${domain.primaryDomain || 'General'} domain issue. ${
          domain.confidence > 0.8
            ? 'Strong domain match identified.'
            : 'Consider cross-functional review for domain classification.'
        }`,
        confidence: domain.confidence || 0.7,
        actionable: false,
        priority: 'LOW',
        metadata: {
          modelVersion: signal.tagModelVersion,
          lastGenerated: signal.lastTaggedAt,
        },
      });
    }

    // Business Impact Recommendation
    if (enhancedTags.businessImpact) {
      const impact = enhancedTags.businessImpact;
      insights.push({
        id: `${signal.id}-business-impact`,
        type: 'RECOMMENDATION',
        source: 'TAGGING',
        title: 'Business Impact Assessment',
        description: `Estimated ${impact.severity || 'moderate'} business impact. ${
          impact.urgencyScore > 0.7
            ? 'Immediate executive attention recommended.'
            : 'Standard prioritization workflow appropriate.'
        }`,
        confidence: impact.confidence || 0.7,
        actionable: impact.urgencyScore > 0.6,
        priority:
          impact.urgencyScore > 0.7
            ? 'CRITICAL'
            : impact.urgencyScore > 0.5
              ? 'HIGH'
              : 'MEDIUM',
        metadata: {
          modelVersion: signal.tagModelVersion,
          lastGenerated: signal.lastTaggedAt,
        },
      });
    }
  }

  // Legacy AI Tags Insights
  if (signal.aiTagsJson && !signal.enhancedTagsJson) {
    const aiTags = signal.aiTagsJson;
    insights.push({
      id: `${signal.id}-legacy-tagging`,
      type: 'WARNING',
      source: 'TAGGING',
      title: 'Legacy AI Analysis',
      description:
        'This signal uses legacy AI tagging. Consider reprocessing with enhanced tagging system for improved accuracy and insights.',
      confidence: 0.6,
      actionable: true,
      priority: 'MEDIUM',
      metadata: {
        modelVersion: 'legacy',
        lastGenerated: signal.lastTaggedAt,
      },
    });
  }

  // Clustering Features Insights
  if (signal.clusteringFeaturesJson) {
    const features = signal.clusteringFeaturesJson;

    insights.push({
      id: `${signal.id}-clustering-readiness`,
      type: 'SUCCESS',
      source: 'CLUSTERING',
      title: 'Clustering Features Ready',
      description: `Signal prepared for hybrid clustering analysis with quality score of ${Math.round(
        (signal.featuresQualityScore || 0.8) * 100
      )}%. Ready for executive intelligence clustering.`,
      confidence: signal.featuresQualityScore || 0.8,
      actionable: false,
      priority: 'LOW',
      metadata: {
        modelVersion: signal.featuresVersion,
        lastGenerated: signal.lastFeaturesGeneratedAt,
        qualityScore: signal.featuresQualityScore,
      },
    });

    // Feature Quality Warning
    if (signal.featuresQualityScore && signal.featuresQualityScore < 0.6) {
      insights.push({
        id: `${signal.id}-feature-quality-warning`,
        type: 'WARNING',
        source: 'CLUSTERING',
        title: 'Low Feature Quality',
        description:
          'Clustering feature quality is below optimal threshold. Consider manual signal enrichment or reprocessing for better clustering results.',
        confidence: 0.9,
        actionable: true,
        priority: 'HIGH',
        metadata: {
          modelVersion: signal.featuresVersion,
          lastGenerated: signal.lastFeaturesGeneratedAt,
          qualityScore: signal.featuresQualityScore,
        },
      });
    }
  }

  // Processing Status Insights
  if (!signal.aiProcessed) {
    insights.push({
      id: `${signal.id}-not-processed`,
      type: 'WARNING',
      source: 'TAGGING',
      title: 'AI Processing Pending',
      description:
        'This signal has not been processed by AI analysis. Automated insights and clustering features are not available.',
      confidence: 1.0,
      actionable: true,
      priority: 'HIGH',
      metadata: {
        lastGenerated: signal.createdAt,
      },
    });
  }

  // Severity-based Recommendations
  if (signal.severity === 'CRITICAL') {
    insights.push({
      id: `${signal.id}-critical-severity`,
      type: 'RECOMMENDATION',
      source: 'BUSINESS_INTELLIGENCE',
      title: 'Critical Severity Alert',
      description:
        'Signal marked as CRITICAL severity. Immediate executive review and rapid response protocol recommended.',
      confidence: 1.0,
      actionable: true,
      priority: 'CRITICAL',
      metadata: {
        lastGenerated: new Date().toISOString(),
      },
    });
  }

  // Data Completeness Insights
  const completenessScore = calculateDataCompleteness(signal);
  if (completenessScore < 0.7) {
    insights.push({
      id: `${signal.id}-data-completeness`,
      type: 'WARNING',
      source: 'BUSINESS_INTELLIGENCE',
      title: 'Incomplete Signal Data',
      description: `Signal data completeness is ${Math.round(completenessScore * 100)}%. Missing department, team, or category information may impact AI analysis quality.`,
      confidence: 0.9,
      actionable: true,
      priority: 'MEDIUM',
      metadata: {
        completenessScore,
        lastGenerated: new Date().toISOString(),
      },
    });
  }

  return insights.sort((a, b) => {
    // Sort by priority, then confidence
    const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const aPriority =
      priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const bPriority =
      priorityOrder[b.priority as keyof typeof priorityOrder] || 0;

    if (aPriority !== bPriority) return bPriority - aPriority;
    return b.confidence - a.confidence;
  });
}

/**
 * Calculate data completeness score for a signal
 */
function calculateDataCompleteness(signal: any): number {
  const fields = [
    signal.title,
    signal.description,
    signal.department,
    signal.team,
    signal.category,
    signal.severity,
  ];

  const completedFields = fields.filter(
    field => field && field !== null
  ).length;
  return completedFields / fields.length;
}
