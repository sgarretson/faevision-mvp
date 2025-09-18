'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Eye,
  Settings,
  BarChart3,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';

/**
 * Sprint 3 Story 2: AI Insights Integration
 * Expert Lead: Dr. Priya Patel (AI Architect)
 * Support: Alex Thompson (Lead Developer), Dr. Elena Rodriguez (Clustering)
 *
 * Surface AI analysis insights from Sprint 1 (Enhanced Tagging) and Sprint 2 (Hybrid Clustering)
 * directly into executive interfaces with transparent AI decision support
 */

interface AIInsight {
  id: string;
  type: 'CONFIDENCE' | 'RECOMMENDATION' | 'WARNING' | 'SUCCESS' | 'INFO';
  source: 'TAGGING' | 'CLUSTERING' | 'RCA' | 'BUSINESS_INTELLIGENCE';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata: {
    modelVersion?: string;
    processingTime?: number;
    dataPoints?: number;
    lastGenerated?: string;
  };
  executiveOverride?: {
    enabled: boolean;
    overridden: boolean;
    reason?: string;
    timestamp?: string;
  };
}

interface AIInsightsPanelProps {
  entityType: 'signal' | 'hotspot' | 'solution' | 'cluster';
  entityId: string;
  insights?: AIInsight[];
  showAdvanced?: boolean;
  allowOverrides?: boolean;
  onInsightOverride?: (insightId: string, reason: string) => void;
  onRefreshInsights?: () => void;
}

export function AIInsightsPanel({
  entityType,
  entityId,
  insights: initialInsights,
  showAdvanced = false,
  allowOverrides = true,
  onInsightOverride,
  onRefreshInsights,
}: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>(initialInsights || []);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [overrideMode, setOverrideMode] = useState<string | null>(null);

  // Sequentially process tagging and feature generation for signals
  const processSignalForAI = useCallback(async () => {
    if (entityType !== 'signal') return;
    try {
      setProcessing(true);
      // 1) Enhanced tagging
      await fetch(`/api/signals/${entityId}/generate-tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRegenerate: false }),
      });

      // 2) Feature generation for clustering
      await fetch(`/api/signals/${entityId}/generate-features`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRegenerate: false }),
      });
    } catch (err) {
      console.error('AI processing pipeline failed:', err);
    } finally {
      setProcessing(false);
    }
  }, [entityType, entityId]);

  const loadInsights = useCallback(async () => {
    if (initialInsights && initialInsights.length > 0) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/${entityType}s/${entityId}/ai-insights`
      );

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);

        // If the signal hasn't been processed yet, trigger processing automatically
        if (
          entityType === 'signal' &&
          data?.metadata &&
          (data.metadata.aiProcessed === false ||
            (data.insights || []).length === 0)
        ) {
          await processSignalForAI();
          // Re-fetch insights after processing
          const refetch = await fetch(
            `/api/${entityType}s/${entityId}/ai-insights`
          );
          if (refetch.ok) {
            const refreshed = await refetch.json();
            setInsights(refreshed.insights || []);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, initialInsights, processSignalForAI]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const handleInsightOverride = async (insightId: string, reason: string) => {
    try {
      const response = await fetch(
        `/api/${entityType}s/${entityId}/ai-insights/${insightId}/override`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason }),
        }
      );

      if (response.ok) {
        // Update local state
        setInsights(prev =>
          prev.map(insight =>
            insight.id === insightId
              ? {
                  ...insight,
                  executiveOverride: {
                    enabled: true,
                    overridden: true,
                    reason,
                    timestamp: new Date().toISOString(),
                  },
                }
              : insight
          )
        );

        // Notify parent component
        onInsightOverride?.(insightId, reason);
        setOverrideMode(null);
      }
    } catch (error) {
      console.error('Failed to override insight:', error);
    }
  };

  const handleRefresh = () => {
    loadInsights();
    onRefreshInsights?.();
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'CONFIDENCE':
        return <Brain className="h-4 w-4" />;
      case 'RECOMMENDATION':
        return <Lightbulb className="h-4 w-4" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4" />;
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4" />;
      case 'INFO':
        return <Info className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColors = (type: AIInsight['type']) => {
    switch (type) {
      case 'CONFIDENCE':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'RECOMMENDATION':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'WARNING':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'SUCCESS':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'INFO':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const criticalInsights = insights.filter(
    i => i.priority === 'CRITICAL' || i.priority === 'HIGH'
  );
  const generalInsights = insights.filter(
    i => i.priority === 'MEDIUM' || i.priority === 'LOW'
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700">
            {insights.length} insights
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {showAdvanced && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Toggle advanced view"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            title="Refresh insights"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && insights.length === 0 ? (
        <AIInsightsSkeleton />
      ) : insights.length === 0 ? (
        <div>
          <EmptyInsights entityType={entityType} />
          {entityType === 'signal' && (
            <div className="mt-3">
              <button
                onClick={processSignalForAI}
                disabled={processing}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {processing ? 'Running AI Analysis…' : 'Run AI Analysis'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Critical/High Priority Insights */}
          {criticalInsights.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center text-sm font-medium text-gray-700">
                <AlertTriangle className="mr-1 h-4 w-4 text-orange-500" />
                Requires Attention
              </h4>
              <div className="space-y-2">
                {criticalInsights.map(insight => (
                  <AIInsightCard
                    key={insight.id}
                    insight={insight}
                    expanded={expanded}
                    allowOverrides={allowOverrides}
                    onOverride={handleInsightOverride}
                    overrideMode={overrideMode}
                    setOverrideMode={setOverrideMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* General Insights */}
          {generalInsights.length > 0 && (
            <div>
              {criticalInsights.length > 0 && (
                <h4 className="mb-2 flex items-center text-sm font-medium text-gray-700">
                  <Eye className="mr-1 h-4 w-4 text-blue-500" />
                  Additional Insights
                </h4>
              )}
              <div className="space-y-2">
                {generalInsights.map(insight => (
                  <AIInsightCard
                    key={insight.id}
                    insight={insight}
                    expanded={expanded}
                    allowOverrides={allowOverrides}
                    onOverride={handleInsightOverride}
                    overrideMode={overrideMode}
                    setOverrideMode={setOverrideMode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* AI Performance Summary */}
          {expanded && <AIPerformanceSummary insights={insights} />}
        </div>
      )}
    </div>
  );
}

interface AIInsightCardProps {
  insight: AIInsight;
  expanded: boolean;
  allowOverrides: boolean;
  onOverride: (insightId: string, reason: string) => void;
  overrideMode: string | null;
  setOverrideMode: (mode: string | null) => void;
}

function AIInsightCard({
  insight,
  expanded,
  allowOverrides,
  onOverride,
  overrideMode,
  setOverrideMode,
}: AIInsightCardProps) {
  const [overrideReason, setOverrideReason] = useState('');

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'CONFIDENCE':
        return <Brain className="h-4 w-4" />;
      case 'RECOMMENDATION':
        return <Lightbulb className="h-4 w-4" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4" />;
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4" />;
      case 'INFO':
        return <Info className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColors = (type: AIInsight['type']) => {
    switch (type) {
      case 'CONFIDENCE':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'RECOMMENDATION':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'WARNING':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'SUCCESS':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'INFO':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`rounded-lg border p-3 ${getInsightColors(insight.type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center space-x-2">
            {getInsightIcon(insight.type)}
            <span className="text-sm font-medium">{insight.title}</span>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-3 w-3" />
              <span
                className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}
              >
                {Math.round(insight.confidence * 100)}%
              </span>
            </div>
          </div>

          <p className="mb-2 text-sm opacity-90">{insight.description}</p>

          {expanded && (
            <div className="space-y-1 text-xs opacity-75">
              <div>Source: {insight.source}</div>
              {insight.metadata.modelVersion && (
                <div>Model: {insight.metadata.modelVersion}</div>
              )}
              {insight.metadata.processingTime && (
                <div>Processing: {insight.metadata.processingTime}ms</div>
              )}
            </div>
          )}

          {insight.executiveOverride?.overridden && (
            <div className="mt-2 rounded bg-white/50 p-2 text-xs">
              <div className="font-medium text-gray-700">
                Executive Override
              </div>
              <div className="text-gray-600">
                {insight.executiveOverride.reason}
              </div>
            </div>
          )}
        </div>

        {allowOverrides && !insight.executiveOverride?.overridden && (
          <div className="ml-2">
            {overrideMode === insight.id ? (
              <div className="w-48 space-y-2">
                <textarea
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  placeholder="Reason for override..."
                  className="w-full rounded border p-2 text-xs"
                  rows={2}
                />
                <div className="flex space-x-1">
                  <button
                    onClick={() => onOverride(insight.id, overrideReason)}
                    disabled={!overrideReason.trim()}
                    className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Override
                  </button>
                  <button
                    onClick={() => setOverrideMode(null)}
                    className="rounded bg-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setOverrideMode(insight.id)}
                className="rounded p-1 text-gray-400 hover:bg-white/50 hover:text-gray-600"
                title="Override AI recommendation"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AIPerformanceSummary({ insights }: { insights: AIInsight[] }) {
  const avgConfidence =
    insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length;
  const sourceBreakdown = insights.reduce(
    (acc, insight) => {
      acc[insight.source] = (acc[insight.source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="mb-3 text-sm font-medium text-gray-700">
        AI Performance Summary
      </h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Overall Confidence */}
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="mb-1 text-xs text-gray-500">Overall Confidence</div>
          <div className="text-lg font-semibold text-gray-900">
            {Math.round(avgConfidence * 100)}%
          </div>
          <div className="text-xs text-gray-500">
            Average across {insights.length} insights
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="mb-2 text-xs text-gray-500">AI Source Breakdown</div>
          <div className="space-y-1">
            {Object.entries(sourceBreakdown).map(([source, count]) => (
              <div key={source} className="flex justify-between text-xs">
                <span className="text-gray-600">{source}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Items */}
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="mb-1 text-xs text-gray-500">Actionable Items</div>
          <div className="text-lg font-semibold text-gray-900">
            {insights.filter(i => i.actionable).length}
          </div>
          <div className="text-xs text-gray-500">
            of {insights.length} total insights
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyInsights({ entityType }: { entityType: string }) {
  return (
    <div className="py-8 text-center">
      <Brain className="mx-auto mb-4 h-12 w-12 text-gray-300" />
      <h3 className="mb-2 text-sm font-medium text-gray-900">
        No AI Insights Available
      </h3>
      <p className="text-sm text-gray-500">
        AI analysis will appear here once this {entityType} has been processed
        by our enhanced tagging and clustering algorithms.
      </p>
    </div>
  );
}

function AIInsightsSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={`insight-skeleton-${i}`} className="rounded-lg border p-3">
          <div className="mb-2 flex items-center space-x-2">
            <div className="h-4 w-4 rounded bg-gray-200"></div>
            <div className="h-4 w-32 rounded bg-gray-200"></div>
            <div className="h-3 w-8 rounded bg-gray-200"></div>
          </div>
          <div className="mb-1 h-3 w-full rounded bg-gray-200"></div>
          <div className="h-3 w-3/4 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}
