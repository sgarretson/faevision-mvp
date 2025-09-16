'use client';

/**
 * Hotspot Dashboard Loading Skeleton
 *
 * Loading state optimized for executive impatience:
 * - Realistic content structure preview
 * - Smooth animation for perceived performance
 * - Mobile-responsive skeleton layout
 * - Executive-friendly loading indicators
 *
 * Expert: Maya Rodriguez (UX Expert)
 * Performance psychology for executive users
 */

export function HotspotSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="mb-1 h-4 w-24 rounded bg-gray-200"></div>
              <div className="h-3 w-20 rounded bg-gray-200"></div>
            </div>
            <div className="h-4 w-16 rounded bg-gray-200 sm:hidden"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-11 w-28 rounded-lg bg-gray-200"></div>
            <div className="h-11 w-20 rounded-lg bg-gray-200"></div>
            <div className="h-11 w-20 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Clustering Controls Skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-2 h-6 w-40 rounded bg-gray-200"></div>
            <div className="h-4 w-64 rounded bg-gray-200"></div>
          </div>
          <div className="h-4 w-16 rounded bg-gray-200"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PresetCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Hotspot Cards Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 rounded bg-gray-200"></div>
          <div className="h-4 w-32 rounded bg-gray-200"></div>
        </div>

        <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <HotspotCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Metric card skeleton
 */
function MetricCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 w-1/3 rounded bg-gray-200"></div>
        <div className="h-3 w-2/3 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}

/**
 * Preset card skeleton
 */
function PresetCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <div className="mb-2 flex items-center">
        <div className="mr-3 h-8 w-8 rounded bg-gray-200"></div>
        <div className="h-5 w-20 rounded bg-gray-200"></div>
      </div>
      <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
      <div className="h-3 w-3/4 rounded bg-gray-200"></div>
    </div>
  );
}

/**
 * Hotspot card skeleton
 */
function HotspotCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center space-x-3">
              <div className="h-5 w-16 rounded-full bg-gray-200"></div>
              <div className="h-5 w-12 rounded-full bg-gray-200"></div>
            </div>
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
          </div>
          <div className="h-6 w-6 rounded bg-gray-200"></div>
        </div>

        {/* Metrics row */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-1 h-4 w-4 rounded bg-gray-200"></div>
              <div className="mx-auto mb-1 h-5 w-8 rounded bg-gray-200"></div>
              <div className="mx-auto h-3 w-12 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mb-4 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200"></div>
          <div className="h-4 w-4/6 rounded bg-gray-200"></div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="h-9 w-28 rounded bg-gray-200"></div>
            <div className="h-9 w-20 rounded bg-gray-200"></div>
          </div>
          <div className="h-4 w-20 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state skeleton for when no hotspots exist
 */
export function EmptyHotspotSkeleton() {
  return (
    <div className="animate-pulse py-12 text-center">
      <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-200"></div>
      <div className="mx-auto mb-2 h-6 w-48 rounded bg-gray-200"></div>
      <div className="mb-6 space-y-2">
        <div className="mx-auto h-4 w-64 rounded bg-gray-200"></div>
        <div className="mx-auto h-4 w-56 rounded bg-gray-200"></div>
      </div>
      <div className="mx-auto h-12 w-40 rounded bg-gray-200"></div>
    </div>
  );
}
