'use client';

import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

/**
 * Executive Hotspot Metrics Component
 * 
 * Key performance indicators optimized for executive scanning:
 * - Large, bold numbers for quick comprehension
 * - Trend indicators for performance assessment
 * - Color-coded status indicators
 * - Mobile-first responsive design
 * 
 * Expert: Maya Rodriguez (UX Expert)
 * Based on Executive KPI dashboard research
 */

interface HotspotMetricsProps {
  metrics: {
    totalHotspots: number;
    criticalHotspots: number;
    avgConfidence: number;
    signalsProcessed: number;
    lastClusteringRun: string;
  };
  loading?: boolean;
}

export function HotspotMetrics({ metrics, loading = false }: HotspotMetricsProps) {
  const confidencePercent = Math.round(metrics.avgConfidence * 100);
  const criticalPercentage = metrics.totalHotspots > 0 
    ? Math.round((metrics.criticalHotspots / metrics.totalHotspots) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Hotspots */}
      <MetricCard
        title="Active Hotspots"
        value={metrics.totalHotspots}
        icon={<TrendingUp className="h-6 w-6" />}
        color="blue"
        subtitle="Requiring attention"
        loading={loading}
      />

      {/* Critical Hotspots */}
      <MetricCard
        title="Critical Priority"
        value={metrics.criticalHotspots}
        icon={<AlertTriangle className="h-6 w-6" />}
        color={metrics.criticalHotspots > 0 ? "red" : "gray"}
        subtitle={`${criticalPercentage}% of total`}
        loading={loading}
      />

      {/* AI Confidence */}
      <MetricCard
        title="AI Confidence"
        value={`${confidencePercent}%`}
        icon={<CheckCircle className="h-6 w-6" />}
        color={confidencePercent >= 80 ? "green" : confidencePercent >= 60 ? "yellow" : "red"}
        subtitle="Average clustering quality"
        loading={loading}
      />

      {/* Signals Processed */}
      <MetricCard
        title="Signals Processed"
        value={metrics.signalsProcessed}
        icon={<Clock className="h-6 w-6" />}
        color="purple"
        subtitle={formatLastRun(metrics.lastClusteringRun)}
        loading={loading}
      />
    </div>
  );
}

/**
 * Individual metric card component
 */
function MetricCard({
  title,
  value,
  icon,
  color,
  subtitle,
  loading = false
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle: string;
  loading?: boolean;
}) {
  const colorClasses = getColorClasses(color);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses.background}`}>
          <div className={colorClasses.icon}>
            {icon}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className={`text-3xl font-bold ${colorClasses.text}`}>
          {value}
        </div>
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

      {/* Optional trend indicator */}
      {(color === 'red' && typeof value === 'number' && value > 0) && (
        <div className="mt-3 flex items-center text-sm">
          <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-red-600 font-medium">Needs attention</span>
        </div>
      )}
    </div>
  );
}

/**
 * Get color classes for metric cards
 */
function getColorClasses(color: string) {
  const colorMap = {
    blue: {
      background: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-600'
    },
    red: {
      background: 'bg-red-50',
      icon: 'text-red-600',
      text: 'text-red-600'
    },
    green: {
      background: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-600'
    },
    yellow: {
      background: 'bg-yellow-50',
      icon: 'text-yellow-600',
      text: 'text-yellow-600'
    },
    purple: {
      background: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-600'
    },
    gray: {
      background: 'bg-gray-50',
      icon: 'text-gray-600',
      text: 'text-gray-600'
    }
  };

  return colorMap[color as keyof typeof colorMap] || colorMap.gray;
}

/**
 * Format last clustering run timestamp
 */
function formatLastRun(timestamp: string): string {
  if (!timestamp) return 'Never run';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleDateString();
}
