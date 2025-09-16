'use client';

import { useState, useEffect } from 'react';
import { Activity, Clock, TrendingUp, Zap, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Performance Monitoring Dashboard
 * 
 * Real-time system performance monitoring for executives:
 * - AI processing performance metrics
 * - Clustering efficiency tracking
 * - System health indicators
 * - Mobile-optimized display
 * 
 * Expert: Jordan Kim (Vercel Engineer)
 * Support: Maya Rodriguez (UX Expert)
 */

interface PerformanceMetrics {
  clustering: {
    avgProcessingTime: number;
    lastRunTime: string;
    successRate: number;
    hotspotsGenerated: number;
  };
  ai: {
    embeddingLatency: number;
    tagProcessingTime: number;
    confidenceScore: number;
    dailyProcessed: number;
  };
  system: {
    uptime: number;
    memoryUsage: number;
    responseTime: number;
    errorRate: number;
  };
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadMetrics();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/performance');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PerformanceDashboardSkeleton />;
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Performance data unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            System Performance
          </h2>
          <p className="text-sm text-gray-500">
            Last updated: {formatTime(lastUpdate)}
          </p>
        </div>
        
        <SystemStatusBadge metrics={metrics.system} />
      </div>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Clustering Performance */}
        <PerformanceCard
          title="Clustering Speed"
          value={`${metrics.clustering.avgProcessingTime}s`}
          subtitle="Average processing time"
          icon={<Clock className="h-5 w-5" />}
          status={getPerformanceStatus(metrics.clustering.avgProcessingTime, 15)}
          trend={metrics.clustering.successRate}
        />

        {/* AI Processing */}
        <PerformanceCard
          title="AI Processing"
          value={`${metrics.ai.embeddingLatency}ms`}
          subtitle="Embedding generation"
          icon={<Zap className="h-5 w-5" />}
          status={getPerformanceStatus(metrics.ai.embeddingLatency, 1000)}
          trend={metrics.ai.confidenceScore * 100}
        />

        {/* System Response */}
        <PerformanceCard
          title="Response Time"
          value={`${metrics.system.responseTime}ms`}
          subtitle="API response time"
          icon={<Activity className="h-5 w-5" />}
          status={getPerformanceStatus(metrics.system.responseTime, 500)}
          trend={100 - metrics.system.errorRate}
        />

        {/* Daily Throughput */}
        <PerformanceCard
          title="Daily Processed"
          value={metrics.ai.dailyProcessed.toString()}
          subtitle="Signals today"
          icon={<TrendingUp className="h-5 w-5" />}
          status="good"
          trend={metrics.clustering.hotspotsGenerated}
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Performance Details */}
        <DetailedMetricsCard
          title="AI Performance"
          metrics={[
            {
              label: 'Embedding Generation',
              value: `${metrics.ai.embeddingLatency}ms`,
              status: getPerformanceStatus(metrics.ai.embeddingLatency, 1000)
            },
            {
              label: 'Tag Processing',
              value: `${metrics.ai.tagProcessingTime}ms`,
              status: getPerformanceStatus(metrics.ai.tagProcessingTime, 2000)
            },
            {
              label: 'AI Confidence',
              value: `${Math.round(metrics.ai.confidenceScore * 100)}%`,
              status: metrics.ai.confidenceScore > 0.8 ? 'good' : 'warning'
            },
            {
              label: 'Daily Processing',
              value: `${metrics.ai.dailyProcessed} signals`,
              status: 'good'
            }
          ]}
        />

        {/* System Health Details */}
        <DetailedMetricsCard
          title="System Health"
          metrics={[
            {
              label: 'System Uptime',
              value: `${Math.round(metrics.system.uptime)}%`,
              status: metrics.system.uptime > 99 ? 'good' : 'warning'
            },
            {
              label: 'Memory Usage',
              value: `${Math.round(metrics.system.memoryUsage)}%`,
              status: metrics.system.memoryUsage < 80 ? 'good' : 'warning'
            },
            {
              label: 'Error Rate',
              value: `${metrics.system.errorRate.toFixed(2)}%`,
              status: metrics.system.errorRate < 1 ? 'good' : 'critical'
            },
            {
              label: 'Response Time',
              value: `${metrics.system.responseTime}ms`,
              status: getPerformanceStatus(metrics.system.responseTime, 500)
            }
          ]}
        />
      </div>
    </div>
  );
}

/**
 * Individual performance card component
 */
function PerformanceCard({
  title,
  value,
  subtitle,
  icon,
  status,
  trend
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'critical';
  trend?: number;
}) {
  const statusColors = {
    good: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    critical: 'text-red-600 bg-red-50'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <div className={`p-2 rounded-lg ${statusColors[status]}`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className="text-sm text-gray-500">{subtitle}</p>
        
        {trend !== undefined && (
          <div className="flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">
              {typeof trend === 'number' ? `${Math.round(trend)}%` : trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * System status badge
 */
function SystemStatusBadge({ metrics }: { metrics: PerformanceMetrics['system'] }) {
  const isHealthy = metrics.uptime > 99 && metrics.errorRate < 1 && metrics.responseTime < 500;
  
  return (
    <div className={`
      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
      ${isHealthy 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800'
      }
    `}>
      {isHealthy ? (
        <CheckCircle className="h-4 w-4 mr-1" />
      ) : (
        <AlertCircle className="h-4 w-4 mr-1" />
      )}
      {isHealthy ? 'Healthy' : 'Degraded'}
    </div>
  );
}

/**
 * Detailed metrics card
 */
function DetailedMetricsCard({
  title,
  metrics
}: {
  title: string;
  metrics: Array<{
    label: string;
    value: string;
    status: 'good' | 'warning' | 'critical';
  }>;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{metric.label}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {metric.value}
              </span>
              <StatusIndicator status={metric.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Status indicator component
 */
function StatusIndicator({ status }: { status: 'good' | 'warning' | 'critical' }) {
  const colors = {
    good: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500'
  };

  return (
    <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
  );
}

/**
 * Loading skeleton
 */
function PerformanceDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Utility functions
function getPerformanceStatus(value: number, threshold: number): 'good' | 'warning' | 'critical' {
  if (value <= threshold * 0.7) return 'good';
  if (value <= threshold) return 'warning';
  return 'critical';
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
}
