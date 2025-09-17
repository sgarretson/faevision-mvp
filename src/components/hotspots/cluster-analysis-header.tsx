'use client';

import { Badge } from '@/components/ui/badge';
import {
  Brain,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Filter,
  Settings,
} from 'lucide-react';

/**
 * Cluster Analysis Header Component
 *
 * Executive-optimized display of clustering intelligence:
 * - Clustering method transparency (HDBSCAN/manual/hybrid)
 * - Signal quality analysis (core vs outliers)
 * - Cluster strength and confidence metrics
 * - Executive decision support indicators
 *
 * Expert: Maya Rodriguez (UX Expert) + David Chen (Visual Designer)
 * Implementation: Alex Thompson (Lead Developer)
 */

interface ClusterAnalysisHeaderProps {
  clusteringMethod?: string;
  similarityThreshold?: number;
  confidence: number;
  clusterAnalysis: {
    totalSignals: number;
    coreSignals: number;
    outlierSignals: number;
    avgMembershipStrength: number;
    clusterQuality: number;
  };
  linkedEntities?: any[];
}

export function ClusterAnalysisHeader({
  clusteringMethod = 'HDBSCAN',
  similarityThreshold = 0.5,
  confidence,
  clusterAnalysis,
  linkedEntities = [],
}: ClusterAnalysisHeaderProps) {
  const getClusterQualityColor = (quality: number) => {
    if (quality >= 80) return 'bg-green-100 text-green-800';
    if (quality >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'hdbscan':
        return <Brain className="h-3 w-3" />;
      case 'manual':
        return <Users className="h-3 w-3" />;
      case 'hybrid':
        return <Settings className="h-3 w-3" />;
      default:
        return <Brain className="h-3 w-3" />;
    }
  };

  const getMethodDescription = (method: string) => {
    switch (method.toLowerCase()) {
      case 'hdbscan':
        return 'AI-powered density-based clustering';
      case 'manual':
        return 'Executive-curated grouping';
      case 'hybrid':
        return 'AI-assisted manual refinement';
      default:
        return 'Automated clustering analysis';
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      {/* Clustering Method Section */}
      <div className="mb-4 flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-purple-100 text-purple-800">
              {getMethodIcon(clusteringMethod)}
              <span className="ml-1">{clusteringMethod.toUpperCase()}</span>
            </Badge>
            {similarityThreshold && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                <Filter className="mr-1 h-3 w-3" />
                {Math.round(similarityThreshold * 100)}% threshold
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {getMethodDescription(clusteringMethod)}
          </span>
        </div>

        {/* Overall Confidence */}
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className={
              confidence >= 0.8
                ? 'bg-green-100 text-green-800'
                : confidence >= 0.6
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }
          >
            <TrendingUp className="mr-1 h-3 w-3" />
            {Math.round(confidence * 100)}% confidence
          </Badge>
        </div>
      </div>

      {/* Cluster Quality Metrics */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {/* Total Signals */}
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center text-blue-500">
            <Users className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {clusterAnalysis.totalSignals}
          </div>
          <div className="text-xs text-gray-500">Total Signals</div>
        </div>

        {/* Core Signals */}
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center text-green-500">
            <CheckCircle className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {clusterAnalysis.coreSignals}
          </div>
          <div className="text-xs text-gray-500">Core Signals</div>
        </div>

        {/* Outliers */}
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center text-orange-500">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {clusterAnalysis.outlierSignals}
          </div>
          <div className="text-xs text-gray-500">Outliers</div>
        </div>

        {/* Cluster Quality */}
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center text-purple-500">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(clusterAnalysis.clusterQuality)}%
          </div>
          <div className="text-xs text-gray-500">Quality Score</div>
        </div>
      </div>

      {/* Cluster Strength Indicator */}
      <div className="mt-4 rounded-lg bg-white/60 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Cluster Strength
          </span>
          <Badge
            className={getClusterQualityColor(clusterAnalysis.clusterQuality)}
          >
            {clusterAnalysis.clusterQuality >= 80
              ? 'Excellent'
              : clusterAnalysis.clusterQuality >= 60
                ? 'Good'
                : 'Weak'}
          </Badge>
        </div>

        {/* Visual strength indicator */}
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              clusterAnalysis.avgMembershipStrength >= 0.8
                ? 'bg-green-500'
                : clusterAnalysis.avgMembershipStrength >= 0.6
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
            style={{
              width: `${Math.max(clusterAnalysis.avgMembershipStrength * 100, 10)}%`,
            }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">
          Average membership strength:{' '}
          {Math.round(clusterAnalysis.avgMembershipStrength * 100)}%
        </div>
      </div>

      {/* Key Entities Preview */}
      {linkedEntities.length > 0 && (
        <div className="mt-4 rounded-lg bg-white/60 p-3">
          <div className="mb-2 text-sm font-medium text-gray-700">
            Key Entities in This Cluster
          </div>
          <div className="flex flex-wrap gap-2">
            {linkedEntities.slice(0, 6).map((entity: any, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="max-w-full truncate bg-white text-gray-700"
              >
                <span className="truncate">{entity.name}</span>
                {entity.importance && (
                  <span className="ml-1 text-xs opacity-75">
                    ({Math.round(entity.importance * 100)}%)
                  </span>
                )}
              </Badge>
            ))}
            {linkedEntities.length > 6 && (
              <Badge variant="outline" className="bg-white text-gray-500">
                +{linkedEntities.length - 6} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Executive Insights */}
      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="mb-1 text-sm font-medium text-blue-900">
          Executive Insights
        </div>
        <div className="text-xs text-blue-800">
          {clusterAnalysis.clusterQuality >= 80
            ? '✅ Strong cluster with clear patterns. High confidence for idea generation.'
            : clusterAnalysis.clusterQuality >= 60
              ? '⚠️ Moderate cluster strength. Review outliers before creating ideas.'
              : '❌ Weak clustering detected. Consider manual review or re-clustering.'}
        </div>
      </div>
    </div>
  );
}
