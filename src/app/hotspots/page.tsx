import { Suspense } from 'react';
import { HotspotDashboard } from '@/components/hotspots/hotspot-dashboard';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <div className="hidden sm:flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                AI Processing Active
              </div>
              <div className="text-blue-100">
                Last updated: <span className="text-white font-medium">2 min ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<HotspotSkeleton />}>
          <HotspotDashboard />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Signal Hotspots - FAEVision',
  description: 'Executive dashboard for AI-clustered signal hotspots requiring attention'
};
