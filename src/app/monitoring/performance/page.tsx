import { Suspense } from 'react';
import { ExecutivePerformanceDashboard } from '@/components/monitoring/executive-performance-dashboard';

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic';

/**
 * Executive Performance Monitoring Page
 * Sprint 3 Story 3: Performance Monitoring & Optimization
 * Expert: Jordan Kim (Vercel Engineer) + Alex Thompson (Lead Developer)
 *
 * Comprehensive performance monitoring ensuring <2s response times for executive workflows
 */

export default function PerformanceMonitoringPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Performance Monitoring
              </h1>
              <p className="mt-1 text-blue-100">
                Real-time system performance and optimization insights
              </p>
            </div>

            {/* Performance Status */}
            <div className="hidden items-center space-x-6 text-sm sm:flex">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
                System Healthy
              </div>
              <div className="text-blue-100">
                Monitoring:{' '}
                <span className="font-medium text-white">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<PerformanceMonitoringSkeleton />}>
          <ExecutivePerformanceDashboard />
        </Suspense>
      </div>
    </div>
  );
}

function PerformanceMonitoringSkeleton() {
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
            key={`perf-metric-skeleton-${i}`}
            className="h-32 rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={`perf-chart-skeleton-${i}`}
            className="h-64 rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>

      {/* Recommendations Skeleton */}
      <div className="h-32 rounded-lg bg-gray-200"></div>
    </div>
  );
}

export const metadata = {
  title: 'Performance Monitoring - FAEVision',
  description:
    'Real-time performance monitoring and optimization for executive workflows',
};
