'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Activity,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Database,
  Server,
  Brain,
  Users,
  BarChart3,
  Gauge,
  RefreshCw,
  Settings,
} from 'lucide-react';

/**
 * Sprint 3 Story 3: Performance Monitoring & Optimization
 * Expert Lead: Jordan Kim (Vercel Engineer)
 * Support: Alex Thompson (Lead Developer), Morgan Smith (Database Architect)
 *
 * Comprehensive performance monitoring ensuring <2s response times for executive workflows
 * with special focus on hybrid clustering performance from Sprint 2
 */

interface PerformanceMetrics {
  timestamp: string;
  pageLoad: {
    average: number;
    p95: number;
    p99: number;
    target: number;
  };
  apiResponse: {
    average: number;
    p95: number;
    p99: number;
    target: number;
  };
  clustering: {
    processingTime: number;
    efficiency: number;
    lastRun: string;
    target: number;
  };
  database: {
    queryTime: number;
    connectionPool: number;
    slowQueries: number;
    target: number;
  };
  ai: {
    taggingTime: number;
    confidence: number;
    availability: number;
    target: number;
  };
  userExperience: {
    satisfaction: number;
    errorRate: number;
    bounceRate: number;
    timeToInteractive: number;
  };
  infrastructure: {
    cpuUsage: number;
    memoryUsage: number;
    networkLatency: number;
    uptime: number;
  };
}

interface AlertThreshold {
  metric: string;
  threshold: number;
  current: number;
  status: 'healthy' | 'warning' | 'critical';
  message: string;
}

export function ExecutivePerformanceDashboard() {
  const { data: session, status } = useSession();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<AlertThreshold[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  const loadPerformanceMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/monitoring/executive-performance');

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to load performance metrics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      loadPerformanceMetrics();
    }
  }, [status, loadPerformanceMetrics]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadPerformanceMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadPerformanceMetrics]);

  const getStatusColor = (current: number, target: number, inverse = false) => {
    const ratio = inverse ? target / current : current / target;
    if (ratio >= 0.9) return 'text-green-600';
    if (ratio >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (current: number, target: number, inverse = false) => {
    const ratio = inverse ? target / current : current / target;
    if (ratio >= 0.9) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (ratio >= 0.7)
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const criticalAlerts = alerts.filter(a => a.status === 'critical');
  const warningAlerts = alerts.filter(a => a.status === 'warning');

  if (status === 'loading' || loading) {
    return <PerformanceDashboardSkeleton />;
  }

  if (status === 'unauthenticated') {
    return <AuthenticationRequired />;
  }

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Executive Performance Dashboard
          </h2>
          <p className="text-gray-600">
            Real-time monitoring of system performance and user experience
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Auto-refresh:</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`rounded-lg px-3 py-1 text-sm ${
                autoRefresh
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {autoRefresh ? 'ON' : 'OFF'}
            </button>
          </div>

          <button
            onClick={loadPerformanceMetrics}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="mb-3 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">
              Critical Performance Issues
            </h3>
          </div>
          <div className="space-y-2">
            {criticalAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-red-700">{alert.message}</span>
                <span className="text-sm font-medium text-red-600">
                  {alert.current.toFixed(2)} / {alert.threshold}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executive Performance Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Page Load Performance */}
          <PerformanceMetricCard
            title="Page Load Time"
            icon={<Clock className="h-6 w-6" />}
            value={`${(metrics.pageLoad.average * 1000).toFixed(0)}ms`}
            target={`<${metrics.pageLoad.target * 1000}ms`}
            status={getStatusIcon(
              metrics.pageLoad.target,
              metrics.pageLoad.average,
              true
            )}
            trend={
              metrics.pageLoad.average < metrics.pageLoad.target
                ? 'positive'
                : 'negative'
            }
            details={[
              `P95: ${(metrics.pageLoad.p95 * 1000).toFixed(0)}ms`,
              `P99: ${(metrics.pageLoad.p99 * 1000).toFixed(0)}ms`,
            ]}
          />

          {/* API Response Time */}
          <PerformanceMetricCard
            title="API Response"
            icon={<Server className="h-6 w-6" />}
            value={`${(metrics.apiResponse.average * 1000).toFixed(0)}ms`}
            target={`<${metrics.apiResponse.target * 1000}ms`}
            status={getStatusIcon(
              metrics.apiResponse.target,
              metrics.apiResponse.average,
              true
            )}
            trend={
              metrics.apiResponse.average < metrics.apiResponse.target
                ? 'positive'
                : 'negative'
            }
            details={[
              `P95: ${(metrics.apiResponse.p95 * 1000).toFixed(0)}ms`,
              `P99: ${(metrics.apiResponse.p99 * 1000).toFixed(0)}ms`,
            ]}
          />

          {/* AI Clustering Performance */}
          <PerformanceMetricCard
            title="AI Clustering"
            icon={<Brain className="h-6 w-6" />}
            value={`${metrics.clustering.processingTime.toFixed(0)}ms`}
            target={`<${metrics.clustering.target}ms`}
            status={getStatusIcon(
              metrics.clustering.target,
              metrics.clustering.processingTime,
              true
            )}
            trend={
              metrics.clustering.processingTime < metrics.clustering.target
                ? 'positive'
                : 'negative'
            }
            details={[
              `Efficiency: ${(metrics.clustering.efficiency * 100).toFixed(1)}%`,
              `Last run: ${new Date(metrics.clustering.lastRun).toLocaleTimeString()}`,
            ]}
          />

          {/* Database Performance */}
          <PerformanceMetricCard
            title="Database Query"
            icon={<Database className="h-6 w-6" />}
            value={`${(metrics.database.queryTime * 1000).toFixed(0)}ms`}
            target={`<${metrics.database.target * 1000}ms`}
            status={getStatusIcon(
              metrics.database.target,
              metrics.database.queryTime,
              true
            )}
            trend={
              metrics.database.queryTime < metrics.database.target
                ? 'positive'
                : 'negative'
            }
            details={[
              `Pool: ${metrics.database.connectionPool}/10`,
              `Slow queries: ${metrics.database.slowQueries}`,
            ]}
          />
        </div>
      )}

      {/* Detailed Performance Charts */}
      {metrics && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Executive User Experience */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <Users className="mr-2 h-5 w-5" />
              Executive User Experience
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Satisfaction Score</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-32 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{
                        width: `${metrics.userExperience.satisfaction}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {metrics.userExperience.satisfaction}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Error Rate</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-32 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-red-600"
                      style={{ width: `${metrics.userExperience.errorRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {metrics.userExperience.errorRate.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Time to Interactive</span>
                <span className="text-sm font-medium">
                  {(metrics.userExperience.timeToInteractive * 1000).toFixed(0)}
                  ms
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <Activity className="mr-2 h-5 w-5" />
              Infrastructure Health
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">CPU Usage</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-32 rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        metrics.infrastructure.cpuUsage > 80
                          ? 'bg-red-600'
                          : metrics.infrastructure.cpuUsage > 60
                            ? 'bg-yellow-600'
                            : 'bg-green-600'
                      }`}
                      style={{ width: `${metrics.infrastructure.cpuUsage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {metrics.infrastructure.cpuUsage}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Memory Usage</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-32 rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        metrics.infrastructure.memoryUsage > 80
                          ? 'bg-red-600'
                          : metrics.infrastructure.memoryUsage > 60
                            ? 'bg-yellow-600'
                            : 'bg-green-600'
                      }`}
                      style={{
                        width: `${metrics.infrastructure.memoryUsage}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {metrics.infrastructure.memoryUsage}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="text-sm font-medium">
                  {metrics.infrastructure.uptime.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Alerts */}
      {warningAlerts.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="mb-3 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">
              Performance Warnings
            </h3>
          </div>
          <div className="space-y-2">
            {warningAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-yellow-700">{alert.message}</span>
                <span className="text-sm font-medium text-yellow-600">
                  {alert.current.toFixed(2)} / {alert.threshold}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Recommendations */}
      {metrics && <PerformanceRecommendations metrics={metrics} />}
    </div>
  );
}

interface PerformanceMetricCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  target: string;
  status: React.ReactNode;
  trend: 'positive' | 'negative' | 'neutral';
  details: string[];
}

function PerformanceMetricCard({
  title,
  icon,
  value,
  target,
  status,
  trend,
  details,
}: PerformanceMetricCardProps) {
  const trendIcon =
    trend === 'positive' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : trend === 'negative' ? (
      <TrendingDown className="h-4 w-4 text-red-600" />
    ) : null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-blue-600">{icon}</div>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        {status}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {trendIcon}
        </div>

        <div className="text-sm text-gray-500">Target: {target}</div>

        <div className="space-y-1">
          {details.map((detail, index) => (
            <div key={index} className="text-xs text-gray-500">
              {detail}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerformanceRecommendations({
  metrics,
}: {
  metrics: PerformanceMetrics;
}) {
  const recommendations: string[] = [];

  // Generate recommendations based on metrics
  if (metrics.pageLoad.average > metrics.pageLoad.target) {
    recommendations.push(
      'Consider implementing code splitting for faster page loads'
    );
  }

  if (metrics.apiResponse.average > metrics.apiResponse.target) {
    recommendations.push('Optimize database queries and add caching layers');
  }

  if (metrics.clustering.processingTime > metrics.clustering.target) {
    recommendations.push(
      'Scale clustering infrastructure or optimize algorithm'
    );
  }

  if (metrics.database.slowQueries > 5) {
    recommendations.push('Review and optimize slow database queries');
  }

  if (metrics.userExperience.errorRate > 1) {
    recommendations.push('Investigate and resolve application errors');
  }

  if (recommendations.length === 0) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
          <span className="font-medium text-green-800">
            All performance metrics are within acceptable ranges
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="mb-3 flex items-center">
        <Gauge className="mr-2 h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-800">
          Performance Recommendations
        </h3>
      </div>
      <ul className="space-y-2">
        {recommendations.map((recommendation, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 text-blue-600">•</span>
            <span className="text-blue-700">{recommendation}</span>
          </li>
        ))}
      </ul>
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
        Please log in to access the Performance Dashboard.
      </p>
    </div>
  );
}

function PerformanceDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 h-8 w-64 rounded bg-gray-200"></div>
          <div className="h-4 w-96 rounded bg-gray-200"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-8 w-24 rounded bg-gray-200"></div>
          <div className="h-8 w-8 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`metric-skeleton-${i}`}
            className="h-32 rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={`chart-skeleton-${i}`}
            className="h-64 rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>
    </div>
  );
}
