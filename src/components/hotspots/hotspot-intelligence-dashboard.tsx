'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  TrendingUp,
  AlertTriangle,
  Target,
  Brain,
  ChevronRight,
  Zap,
  Building,
  FileText,
} from 'lucide-react';

/**
 * Sprint 3 Story 1: Hotspot Intelligence Dashboard Enhancement
 * Expert Lead: Maya Rodriguez (UX Expert)
 * Support: David Chen (Visual Designer), Sarah Chen (Product Manager)
 *
 * Transform Sprint 2's revolutionary hybrid clustering results into
 * executive-friendly business intelligence dashboard
 */

interface ClusterIntelligence {
  id: string;
  name: string;
  type: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  signalCount: number;
  signals?: { id: string; title?: string }[]; // associated signals (optional)
  businessImpact: {
    costImpact: number;
    timelineImpact: number;
    qualityRisk: number;
    clientSatisfaction: number;
  };
  rootCauseBreakdown?: {
    category: string;
    percentage: number;
    confidence: number;
  }[];
  affectedDepartments?: string[];
  departmentsInvolved?: string[]; // Alternative field name from clustering engine
  actionability: number;
  urgencyScore: number;
  businessRelevance: number;
  recommendedActions?: string[];
  estimatedResolution: {
    timeframe: string;
    resources: string[];
    cost: string;
  };
}

interface ClusteringResults {
  success: boolean;
  inputSignalCount: number;
  outputClusterCount: number;
  clusteringEfficiency: number;
  businessRelevanceScore: number;
  executiveActionability: number;
  finalClusters: ClusterIntelligence[];
  processingTime: number;
  lastGenerated: string;
}

interface ExecutiveMetrics {
  totalClusters: number;
  criticalClusters: number;
  readyForAction: number;
  avgBusinessRelevance: number;
  estimatedTotalCost: number;
  highestImpactCluster: string;
}

export function HotspotIntelligenceDashboard() {
  const { status } = useSession();
  const [clusteringResults, setClusteringResults] =
    useState<ClusteringResults | null>(null);
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [apiRequestInProgress, setApiRequestInProgress] = useState(false);

  // Debug loading state changes
  useEffect(() => {
    console.log('🔧 Loading state changed to:', loading);
  }, [loading]);

  // Debug API request state changes
  useEffect(() => {
    console.log('🌐 API request state changed to:', apiRequestInProgress);
  }, [apiRequestInProgress]);

  const loadClusteringResults = useCallback(async () => {
    // Prevent multiple simultaneous API requests
    if (apiRequestInProgress) {
      console.log(
        '🔄 API request already in progress, skipping duplicate call'
      );
      return;
    }

    try {
      console.log('🔍 Loading clustering results...');
      setApiRequestInProgress(true);
      setLoading(true);
      const response = await fetch('/api/signals/clustering/generate');

      console.log(`📊 API Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log('📋 API Response data:', {
          success: data.success,
          hasResult: !!data.result,
          resultType: typeof data.result,
          finalClusters: data.result?.finalClusters?.length || 0,
        });
        console.log('🔍 Full API Response:', data);
        console.log('🔍 Result object:', data.result);

        if (data.success && data.result) {
          // Normalize cluster shape to the expected ClusterIntelligence interface
          const rawClusters: any[] = data.result.finalClusters || [];
          const normalizedClusters: ClusterIntelligence[] = rawClusters.map(
            (c: any, idx: number) => {
              const id = c.id || c.clusterId || `cluster-${idx}`;
              const name =
                c.name || c.label || c.category || 'Process & Workflow';
              const urgencyScore: number =
                c.urgencyScore ?? c.priorityScore ?? 0;
              const type: ClusterIntelligence['type'] =
                urgencyScore > 0.85
                  ? 'CRITICAL'
                  : urgencyScore > 0.7
                    ? 'HIGH'
                    : urgencyScore > 0.4
                      ? 'MEDIUM'
                      : 'LOW';
              const signalCount: number =
                c.signalCount ||
                (c.signals ? c.signals.length : 0) ||
                c.memberCount ||
                0;
              const businessRelevance: number =
                c.businessRelevance ??
                c.businessRelevanceScore ??
                c.executiveRelevance ??
                0;
              const actionability: number =
                c.actionability ?? c.executiveActionability ?? 0;

              const affectedDepartments: string[] =
                c.affectedDepartments || c.departmentsInvolved || [];

              const rootCauseBreakdown =
                c.rootCauseBreakdown || c.rootCauses || [];

              const recommendedActions: string[] =
                c.recommendedActions || c.recommendations || [];

              // Associated signals if provided by backend
              const signals: { id: string; title?: string }[] =
                c.signals ||
                (Array.isArray(c.signalIds)
                  ? c.signalIds.map((sid: string) => ({ id: sid }))
                  : []);

              const businessImpact = {
                costImpact:
                  (c.businessImpact && c.businessImpact.costImpact) ||
                  c.estimatedCost ||
                  0,
                timelineImpact:
                  (c.businessImpact && c.businessImpact.timelineImpact) ||
                  c.scheduleImpact ||
                  0,
                qualityRisk:
                  (c.businessImpact && c.businessImpact.qualityRisk) || 0,
                clientSatisfaction:
                  (c.businessImpact && c.businessImpact.clientSatisfaction) ??
                  0.5,
              };

              return {
                id,
                name,
                type,
                signalCount,
                businessImpact,
                signals,
                rootCauseBreakdown,
                affectedDepartments,
                departmentsInvolved: c.departmentsInvolved,
                actionability,
                urgencyScore,
                businessRelevance,
                recommendedActions,
                estimatedResolution: c.estimatedResolution || {
                  timeframe: '2–4 weeks',
                  resources: [],
                  cost: '$0',
                },
              };
            }
          );

          // Map the hybrid clustering results to the expected ClusteringResults interface
          const mappedResults: ClusteringResults = {
            success: data.result.success || true,
            inputSignalCount: data.result.inputSignalCount || 0,
            outputClusterCount:
              data.result.outputClusterCount || normalizedClusters.length,
            clusteringEfficiency: data.result.clusteringEfficiency || 1.0,
            businessRelevanceScore: data.result.businessRelevanceScore || 0,
            executiveActionability: data.result.executiveActionability || 0,
            finalClusters: normalizedClusters,
            processingTime: data.result.processingTime || 0,
            lastGenerated: data.result.generatedAt || new Date().toISOString(),
          };

          console.log('🔄 Mapped clustering results:', mappedResults);
          setClusteringResults(mappedResults);

          // Generate metrics directly inline to prevent re-renders
          const clusters = mappedResults.finalClusters || [];
          if (clusters.length === 0) {
            setMetrics({
              totalClusters: 0,
              criticalClusters: 0,
              readyForAction: 0,
              avgBusinessRelevance: 0,
              estimatedTotalCost: 0,
              highestImpactCluster: 'No clusters available',
            });
          } else {
            const criticalClusters = clusters.filter(
              (c: any) => c.type === 'CRITICAL'
            ).length;
            const readyForAction = clusters.filter(
              (c: any) => c.actionability && c.actionability > 0.7
            ).length;
            const avgBusinessRelevance =
              clusters.reduce(
                (sum: number, c: any) => sum + (c.businessRelevance || 0),
                0
              ) / clusters.length;
            const totalCost = clusters.reduce(
              (sum: number, c: any) =>
                sum + (c.businessImpact?.costImpact || 0),
              0
            );
            const highestImpactCluster =
              clusters.sort(
                (a: any, b: any) =>
                  (b.businessImpact?.costImpact || 0) -
                  (a.businessImpact?.costImpact || 0)
              )[0]?.name || 'N/A';

            setMetrics({
              totalClusters: clusters.length,
              criticalClusters,
              readyForAction,
              avgBusinessRelevance,
              estimatedTotalCost: totalCost,
              highestImpactCluster,
            });
          }

          console.log('✅ Clustering results loaded successfully');
        } else {
          console.warn('⚠️ API response missing success or result:', data);
          // Set empty results to avoid infinite loading
          setClusteringResults({
            success: false,
            inputSignalCount: 0,
            outputClusterCount: 0,
            clusteringEfficiency: 0,
            businessRelevanceScore: 0,
            executiveActionability: 0,
            finalClusters: [],
            processingTime: 0,
            lastGenerated: new Date().toISOString(),
          });
        }
      } else {
        const errorText = await response.text();
        console.error(
          `❌ API Error: ${response.status} ${response.statusText}`,
          errorText
        );
        // Set empty results to avoid infinite loading
        setClusteringResults({
          success: false,
          inputSignalCount: 0,
          outputClusterCount: 0,
          clusteringEfficiency: 0,
          businessRelevanceScore: 0,
          executiveActionability: 0,
          finalClusters: [],
          processingTime: 0,
          lastGenerated: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('❌ Failed to load clustering results:', error);
      // Set empty results to avoid infinite loading
      setClusteringResults({
        success: false,
        inputSignalCount: 0,
        outputClusterCount: 0,
        clusteringEfficiency: 0,
        businessRelevanceScore: 0,
        executiveActionability: 0,
        finalClusters: [],
        processingTime: 0,
        lastGenerated: new Date().toISOString(),
      });
    } finally {
      console.log('🔚 Setting loading to false and clearing API request flag');
      setLoading(false);
      setApiRequestInProgress(false);
      // Debug state after loading
      setTimeout(() => {
        console.log(
          '🔍 Component state after load: loading=false, apiRequestInProgress=false'
        );
      }, 100);
    }
  }, [apiRequestInProgress]);

  useEffect(() => {
    console.log(`🔐 Auth status changed to: ${status}`);
    if (
      status === 'authenticated' &&
      !clusteringResults &&
      !apiRequestInProgress
    ) {
      console.log('✅ User authenticated, loading clustering results...');
      loadClusteringResults();
    } else if (status === 'unauthenticated') {
      console.log('❌ User not authenticated');
      setLoading(false);
      setApiRequestInProgress(false);
    } else if (status === 'loading') {
      console.log('⏳ Auth still loading...');
      // Reset states when auth is loading
      setLoading(true);
      setApiRequestInProgress(false);
    }
  }, [status, loadClusteringResults, clusteringResults, apiRequestInProgress]);

  const generateExecutiveMetrics = (results: ClusteringResults) => {
    console.log('📊 Generating executive metrics from results:', results);
    const clusters = results.finalClusters || [];

    if (clusters.length === 0) {
      console.log('⚠️ No clusters found, setting empty metrics');
      const emptyMetrics: ExecutiveMetrics = {
        totalClusters: 0,
        criticalClusters: 0,
        readyForAction: 0,
        avgBusinessRelevance: 0,
        estimatedTotalCost: 0,
        highestImpactCluster: 'No clusters available',
      };
      setMetrics(emptyMetrics);
      return;
    }

    const metrics: ExecutiveMetrics = {
      totalClusters: clusters.length,
      criticalClusters: clusters.filter(
        c => c.type === 'CRITICAL' || c.urgencyScore > 0.8
      ).length,
      readyForAction: clusters.filter(c => c.actionability > 0.7).length,
      avgBusinessRelevance:
        clusters.reduce((acc, c) => acc + c.businessRelevance, 0) /
        clusters.length,
      estimatedTotalCost: clusters.reduce(
        (acc, c) => acc + (c.businessImpact?.costImpact || 0),
        0
      ),
      highestImpactCluster:
        clusters.sort(
          (a, b) =>
            (b.businessImpact?.costImpact || 0) -
            (a.businessImpact?.costImpact || 0)
        )[0]?.name || 'N/A',
    };

    console.log('📈 Generated metrics:', metrics);
    setMetrics(metrics);
  };

  const triggerClustering = async () => {
    try {
      setGenerating(true);
      const response = await fetch('/api/signals/clustering/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forceRegenerate: true,
          includeMetrics: true,
          clusteringConfig: {
            targetClusterCount: 5,
            domainWeight: 0.6,
            semanticWeight: 0.4,
            minClusterSize: 2,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.result) {
          setClusteringResults(data.result);
          generateExecutiveMetrics(data.result);
        }
      }
    } catch (error) {
      console.error('Clustering generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const createSolutionFromCluster = async (clusterId: string) => {
    try {
      const response = await fetch('/api/solutions/from-cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clusterId }),
      });

      if (response.ok) {
        // Navigate to new solution or show success
        console.log('Solution created from cluster');
      }
    } catch (error) {
      console.error('Failed to create solution:', error);
    }
  };

  const shouldShowSkeleton =
    ((status === 'loading' && !clusteringResults) || loading) &&
    !clusteringResults;

  console.log('🎨 Render check:', {
    authStatus: status,
    authStatusType: typeof status,
    loading: loading,
    loadingType: typeof loading,
    apiRequestInProgress: apiRequestInProgress,
    shouldShowSkeleton,
    hasResults: !!clusteringResults,
    hasMetrics: !!metrics,
  });

  if (shouldShowSkeleton) {
    console.log('🔄 Showing skeleton because:', {
      authStatus: status,
      authLoading: status === 'loading',
      componentLoading: loading,
      combinedCondition: shouldShowSkeleton,
    });
    return <IntelligenceDashboardSkeleton />;
  }

  if (status === 'unauthenticated') {
    return <AuthenticationRequired />;
  }

  return (
    <div className="space-y-8">
      {/* Executive Summary Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">
              Hotspot Intelligence Dashboard
            </h1>
            <p className="text-blue-100">
              AI-powered business intelligence from{' '}
              {clusteringResults?.inputSignalCount || 0} operational signals
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-blue-100">Last Analysis</div>
              <div className="font-semibold">
                {clusteringResults?.lastGenerated
                  ? new Date(
                      clusteringResults.lastGenerated
                    ).toLocaleDateString()
                  : 'Never'}
              </div>
            </div>
            <button
              onClick={triggerClustering}
              disabled={generating}
              className="flex items-center space-x-2 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
            >
              <Brain className="h-5 w-5" />
              <span>{generating ? 'Analyzing...' : 'Run AI Analysis'}</span>
            </button>
          </div>
        </div>

        {/* Executive Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            <ExecutiveMetricCard
              icon={<Target className="h-6 w-6" />}
              label="Business Clusters"
              value={metrics.totalClusters.toString()}
              description="Actionable insights"
              trend="positive"
            />
            <ExecutiveMetricCard
              icon={<AlertTriangle className="h-6 w-6" />}
              label="Critical Issues"
              value={metrics.criticalClusters.toString()}
              description="Require immediate attention"
              trend="critical"
            />
            <ExecutiveMetricCard
              icon={<Zap className="h-6 w-6" />}
              label="Ready for Action"
              value={metrics.readyForAction.toString()}
              description="Clear next steps defined"
              trend="positive"
            />
            <ExecutiveMetricCard
              icon={<TrendingUp className="h-6 w-6" />}
              label="Business Relevance"
              value={`${Math.round(metrics.avgBusinessRelevance * 100)}%`}
              description="AI confidence score"
              trend="neutral"
            />
            <ExecutiveMetricCard
              icon={<Building className="h-6 w-6" />}
              label="Estimated Impact"
              value="$50k+"
              description="Potential cost savings"
              trend="positive"
            />
          </div>
        )}
      </div>

      {/* Cluster Intelligence Grid */}
      {clusteringResults?.finalClusters &&
      clusteringResults.finalClusters.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Business Intelligence Clusters
            </h2>
            <div className="text-sm text-gray-500">
              Sorted by business impact • Updated{' '}
              {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
            {clusteringResults.finalClusters.map(cluster => (
              <ClusterIntelligenceCard
                key={cluster.id}
                cluster={cluster}
                isSelected={selectedCluster === cluster.id}
                onSelect={() =>
                  setSelectedCluster(
                    selectedCluster === cluster.id ? null : cluster.id
                  )
                }
                onCreateSolution={() => createSolutionFromCluster(cluster.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyClusteringState
          onGenerate={triggerClustering}
          generating={generating}
        />
      )}

      {/* Performance Insights */}
      {clusteringResults && (
        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            AI Performance Insights
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4">
              <div className="text-sm text-gray-500">Processing Efficiency</div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(clusteringResults.clusteringEfficiency * 100)}%
              </div>
              <div className="text-sm text-gray-600">
                {clusteringResults.processingTime}ms processing time
              </div>
            </div>
            <div className="rounded-lg bg-white p-4">
              <div className="text-sm text-gray-500">Business Relevance</div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(clusteringResults.businessRelevanceScore * 100)}%
              </div>
              <div className="text-sm text-gray-600">
                AI confidence in business value
              </div>
            </div>
            <div className="rounded-lg bg-white p-4">
              <div className="text-sm text-gray-500">
                Executive Actionability
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(clusteringResults.executiveActionability * 100)}%
              </div>
              <div className="text-sm text-gray-600">
                Ready for decision-making
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ExecutiveMetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  trend: 'positive' | 'negative' | 'neutral' | 'critical';
}

function ExecutiveMetricCard({
  icon,
  label,
  value,
  description,
  trend,
}: ExecutiveMetricCardProps) {
  const trendColors = {
    positive: 'text-green-100',
    negative: 'text-red-100',
    neutral: 'text-blue-100',
    critical: 'text-yellow-100',
  };

  return (
    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center">
        <div className={`${trendColors[trend]} mr-2`}>{icon}</div>
        <div className="text-sm text-blue-100">{label}</div>
      </div>
      <div className="mb-1 text-2xl font-bold">{value}</div>
      <div className="text-sm text-blue-100">{description}</div>
    </div>
  );
}

interface ClusterIntelligenceCardProps {
  cluster: ClusterIntelligence;
  isSelected: boolean;
  onSelect: () => void;
  onCreateSolution: () => void;
}

function ClusterIntelligenceCard({
  cluster,
  isSelected,
  onSelect,
  onCreateSolution,
}: ClusterIntelligenceCardProps) {
  const typeColors = {
    CRITICAL: 'border-red-500 bg-red-50',
    HIGH: 'border-orange-500 bg-orange-50',
    MEDIUM: 'border-yellow-500 bg-yellow-50',
    LOW: 'border-blue-500 bg-blue-50',
  };

  const typeTextColors = {
    CRITICAL: 'text-red-700',
    HIGH: 'text-orange-700',
    MEDIUM: 'text-yellow-700',
    LOW: 'text-blue-700',
  };

  return (
    <div
      className={`cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${typeColors[cluster.type]}`}
      onClick={onSelect}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Cluster: ${cluster.name}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center space-x-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${typeTextColors[cluster.type]} bg-white`}
            >
              {cluster.type}
            </span>
            <span className="text-sm text-gray-500">
              {cluster.signalCount} signals
            </span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            {cluster.name}
          </h3>
        </div>
        <ChevronRight
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isSelected ? 'rotate-90' : ''
          }`}
        />
      </div>

      {/* Business Impact Metrics */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">Business Impact</div>
          <div className="text-lg font-semibold text-gray-900">
            {Math.round(cluster.businessRelevance * 100)}%
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Actionability</div>
          <div className="text-lg font-semibold text-gray-900">
            {Math.round(cluster.actionability * 100)}%
          </div>
        </div>
      </div>

      {/* Affected Departments */}
      <div className="mb-4">
        <div className="mb-1 text-sm text-gray-500">Affected Departments</div>
        <div className="flex flex-wrap gap-1">
          {(cluster.affectedDepartments || cluster.departmentsInvolved || [])
            .slice(0, 3)
            .map(dept => (
              <span
                key={dept}
                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
              >
                {dept}
              </span>
            ))}
          {(cluster.affectedDepartments || cluster.departmentsInvolved || [])
            .length > 3 && (
            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
              +
              {(
                cluster.affectedDepartments ||
                cluster.departmentsInvolved ||
                []
              ).length - 3}{' '}
              more
            </span>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isSelected && (
        <div className="mt-4 space-y-4 border-t pt-4">
          {/* Root Cause Breakdown */}
          <div>
            <div className="mb-2 text-sm font-medium text-gray-700">
              Root Cause Analysis
            </div>
            <div className="space-y-2">
              {(cluster.rootCauseBreakdown || []).slice(0, 3).map(cause => (
                <div
                  key={`${cluster.id}-${cause.category}`}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">
                    {cause.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-16 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${cause.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      {cause.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div>
            <div className="mb-2 text-sm font-medium text-gray-700">
              Recommended Actions
            </div>
            <ul className="space-y-1">
              {(cluster.recommendedActions || []).slice(0, 2).map(action => (
                <li
                  key={`${cluster.id}-action-${action.substring(0, 20)}`}
                  className="flex items-start text-sm text-gray-600"
                >
                  <span className="mr-2 text-blue-500">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={e => {
                e.stopPropagation();
                onCreateSolution();
              }}
              className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              <Target className="h-4 w-4" />
              <span>Create Solution</span>
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                if (cluster.id && typeof window !== 'undefined') {
                  window.location.href = `/hotspots/${cluster.id}`;
                } else {
                  // Fallback: expand the card if no routable id
                  onSelect();
                }
              }}
              className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              aria-label={`View details for ${cluster.name}`}
            >
              <FileText className="h-4 w-4" />
              <span>Details</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyClusteringState({
  onGenerate,
  generating,
}: {
  onGenerate: () => void;
  generating: boolean;
}) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
        <Brain className="h-12 w-12 text-blue-600" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        AI-Powered Business Intelligence Ready
      </h3>
      <p className="mx-auto mb-8 max-w-md text-gray-500">
        Transform your operational signals into executive-actionable business
        intelligence clusters using our revolutionary hybrid clustering
        algorithm.
      </p>
      <button
        onClick={onGenerate}
        disabled={generating}
        className="mx-auto flex items-center space-x-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        <Brain className="h-5 w-5" />
        <span>
          {generating
            ? 'Generating Intelligence...'
            : 'Generate Business Intelligence'}
        </span>
      </button>
    </div>
  );
}

function AuthenticationRequired() {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
      <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-600" />
      <h3 className="mb-2 text-lg font-semibold text-red-800">
        Authentication Required
      </h3>
      <p className="text-red-600">
        Please log in to access the Hotspot Intelligence Dashboard.
      </p>
    </div>
  );
}

function IntelligenceDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="h-48 rounded-lg bg-gray-200"></div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`metric-skeleton-${i}`}
            className="h-24 rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>

      {/* Clusters Skeleton */}
      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`cluster-skeleton-${i}`}
            className="h-64 rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>
    </div>
  );
}
