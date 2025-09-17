'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Target,
  Brain,
  Lightbulb,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Plus,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Sprint 3 Story 4: Mobile Executive Dashboard
 * Expert Lead: Maya Rodriguez (UX Expert) + David Chen (Visual Designer)
 *
 * Mobile-optimized dashboard with touch-friendly metrics, quick actions,
 * and executive-focused information hierarchy
 */

interface DashboardData {
  metrics: {
    totalSignals: number;
    activeHotspots: number;
    solutions: number;
    ideas: number;
    criticalIssues: number;
    weeklyTrend: number;
  };
  recentActivity: {
    id: string;
    type: 'signal' | 'hotspot' | 'solution' | 'idea';
    title: string;
    description: string;
    timestamp: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    department?: string;
  }[];
  criticalAlerts: {
    id: string;
    title: string;
    description: string;
    severity: 'HIGH' | 'CRITICAL';
    timestamp: string;
    actionRequired: boolean;
  }[];
  performance: {
    responseTime: number;
    systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
    uptime: number;
  };
}

export function MobileExecutiveDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading || !data) {
    return <MobileDashboardSkeleton />;
  }

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signal':
        return <Target className="h-4 w-4" />;
      case 'hotspot':
        return <Zap className="h-4 w-4" />;
      case 'solution':
        return <Lightbulb className="h-4 w-4" />;
      case 'idea':
        return <Brain className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="pb-6">
      {/* Critical Alerts */}
      {data.criticalAlerts.length > 0 && (
        <div className="mb-6">
          <div className="mx-4 rounded-r-lg border-l-4 border-red-400 bg-red-50 p-4">
            <div className="mb-3 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-400" />
              <h3 className="text-sm font-medium text-red-800">
                Critical Issues Requiring Attention
              </h3>
            </div>

            <div className="space-y-3">
              {data.criticalAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-red-200 bg-white p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="mb-1 text-sm font-medium text-gray-900">
                        {alert.title}
                      </h4>
                      <p className="mb-2 text-sm text-gray-600">
                        {alert.description}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                        {alert.actionRequired && (
                          <span className="rounded bg-red-100 px-2 py-1 text-red-800">
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="ml-3 touch-manipulation rounded-lg p-2 text-red-600 hover:bg-red-100">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header with Refresh */}
      <div className="mb-6 flex items-center justify-between px-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Welcome back, {session?.user?.name}
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="touch-manipulation rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <RefreshCw className={cn('h-5 w-5', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="mb-6 px-4">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="Active Hotspots"
            value={data.metrics.activeHotspots}
            icon={<Zap className="h-5 w-5 text-orange-600" />}
            trend={data.metrics.weeklyTrend > 0 ? 'up' : 'down'}
            trendValue={Math.abs(data.metrics.weeklyTrend)}
            href="/hotspots"
            urgent={data.metrics.criticalIssues > 0}
          />

          <MetricCard
            title="Total Signals"
            value={data.metrics.totalSignals}
            icon={<Target className="h-5 w-5 text-blue-600" />}
            trend={data.metrics.totalSignals > 20 ? 'up' : 'down'}
            trendValue={15}
            href="/inputs"
          />

          <MetricCard
            title="Solutions"
            value={data.metrics.solutions}
            icon={<Lightbulb className="h-5 w-5 text-green-600" />}
            trend="up"
            trendValue={8}
            href="/solutions"
          />

          <MetricCard
            title="Ideas"
            value={data.metrics.ideas}
            icon={<Brain className="h-5 w-5 text-purple-600" />}
            trend="up"
            trendValue={3}
            href="/ideas"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 px-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <QuickActionCard
            title="Capture Input"
            description="Report new issue"
            icon={<Plus className="h-6 w-6" />}
            href="/inputs/create"
            color="bg-blue-600 text-white"
          />

          <QuickActionCard
            title="Review Hotspots"
            description="View signal clusters"
            icon={<Eye className="h-6 w-6" />}
            href="/hotspots"
            color="bg-orange-600 text-white"
          />

          <QuickActionCard
            title="Check Performance"
            description="System health"
            icon={<BarChart3 className="h-6 w-6" />}
            href="/monitoring/performance"
            color="bg-green-600 text-white"
          />

          <QuickActionCard
            title="Create Solution"
            description="Address issues"
            icon={<Lightbulb className="h-6 w-6" />}
            href="/solutions/create"
            color="bg-purple-600 text-white"
          />
        </div>
      </div>

      {/* System Health */}
      <div className="mb-6 px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">System Health</h3>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium',
                getSystemHealthColor(data.performance.systemHealth)
              )}
            >
              {data.performance.systemHealth.charAt(0).toUpperCase() +
                data.performance.systemHealth.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Response Time</div>
              <div className="font-medium text-gray-900">
                {data.performance.responseTime}ms
              </div>
            </div>
            <div>
              <div className="text-gray-600">Uptime</div>
              <div className="font-medium text-gray-900">
                {data.performance.uptime}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <Link
            href="/inputs"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {data.recentActivity.slice(0, 5).map(activity => (
            <div
              key={activity.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="truncate text-sm font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    {activity.severity && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs',
                          getSeverityColor(activity.severity)
                        )}
                      >
                        {activity.severity}
                      </span>
                    )}
                  </div>

                  <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                    {activity.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{activity.department}</span>
                    <span>
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="px-4 text-center">
        <p className="text-xs text-gray-500">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  trendValue: number;
  href: string;
  urgent?: boolean;
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  href,
  urgent,
}: MetricCardProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          'touch-manipulation rounded-lg border bg-white p-4 transition-colors',
          urgent
            ? 'border-red-200 bg-red-50'
            : 'border-gray-200 hover:bg-gray-50'
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-600">
            {title}
          </div>
          {icon}
        </div>

        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-gray-900">{value}</div>

          <div
            className={cn(
              'flex items-center text-xs',
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend === 'up' ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {trendValue}%
          </div>
        </div>
      </div>
    </Link>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  color,
}: QuickActionCardProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          'touch-manipulation rounded-lg p-4 transition-transform active:scale-95',
          color
        )}
      >
        <div className="mb-2 flex items-center">{icon}</div>
        <h3 className="mb-1 font-medium">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </Link>
  );
}

function MobileDashboardSkeleton() {
  return (
    <div className="animate-pulse px-4 pb-6">
      {/* Header Skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 h-8 w-40 rounded bg-gray-200"></div>
          <div className="h-4 w-32 rounded bg-gray-200"></div>
        </div>
        <div className="h-11 w-11 rounded-lg bg-gray-200"></div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`metric-skeleton-${i}`}
            className="h-24 rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mb-6">
        <div className="mb-3 h-6 w-32 rounded bg-gray-200"></div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`action-skeleton-${i}`}
              className="h-20 rounded-lg bg-gray-200"
            ></div>
          ))}
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div>
        <div className="mb-3 h-6 w-40 rounded bg-gray-200"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`activity-skeleton-${i}`}
              className="h-20 rounded-lg bg-gray-200"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
