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
    <div className="space-y-8 animate-pulse">
      {/* Metrics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="sm:hidden h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-11 bg-gray-200 rounded-lg w-28"></div>
            <div className="h-11 bg-gray-200 rounded-lg w-20"></div>
            <div className="h-11 bg-gray-200 rounded-lg w-20"></div>
          </div>
        </div>
      </div>

      {/* Clustering Controls Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <PresetCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Hotspot Cards Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

/**
 * Preset card skeleton
 */
function PresetCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-gray-300 bg-white">
      <div className="flex items-center mb-2">
        <div className="h-8 w-8 bg-gray-200 rounded mr-3"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
  );
}

/**
 * Hotspot card skeleton
 */
function HotspotCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-5 bg-gray-200 rounded-full w-16"></div>
              <div className="h-5 bg-gray-200 rounded-full w-12"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          </div>
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-4 w-4 bg-gray-200 rounded mx-auto mb-1"></div>
              <div className="h-5 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="h-9 bg-gray-200 rounded w-28"></div>
            <div className="h-9 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
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
    <div className="text-center py-12 animate-pulse">
      <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-56 mx-auto"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded w-40 mx-auto"></div>
    </div>
  );
}
