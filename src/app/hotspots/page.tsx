import { Suspense } from 'react';
import { HotspotDashboard } from '@/components/hotspots/hotspot-dashboard';

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic';
import { HotspotSkeleton } from '@/components/hotspots/hotspot-skeleton';

/**
 * Executive Hotspot Dashboard Page
 *
 * Single-pane interface for executive hotspot management:
 * - Real-time hotspot ranking and status
 * - Interactive clustering controls
 * - Mobile-optimized executive view
 * - One-click solution promotion
 *
 * Expert: Maya Rodriguez (UX Expert)
 * Support: Alex Thompson (Lead Developer)
 */

export default function HotspotsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Signal Hotspots
              </h1>
              <p className="mt-1 text-blue-100">
                AI-clustered patterns requiring executive attention
              </p>
            </div>

            {/* Real-time Status */}
            <div className="hidden items-center space-x-6 text-sm sm:flex">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
                AI Processing Active
              </div>
              <div className="text-blue-100">
                Last updated:{' '}
                <span className="font-medium text-white">2 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<HotspotSkeleton />}>
          <HotspotDashboard />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Signal Hotspots - FAEVision',
  description:
    'Executive dashboard for AI-clustered signal hotspots requiring attention',
};
