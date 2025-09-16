import { Suspense } from 'react';
import { IdeasDashboard } from '@/components/ideas/ideas-dashboard';

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic';

/**
 * Ideas Dashboard Page
 *
 * Executive ideas management interface:
 * - Ideas generated from hotspots
 * - Solution development pipeline
 * - Executive approval workflow
 * - Progress tracking and metrics
 *
 * Expert: Sarah Chen (Product Manager)
 * Support: Dr. Priya Patel (AI Architect)
 */

export default function IdeasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Strategic Ideas
              </h1>
              <p className="mt-1 text-purple-100">
                Transform hotspots into actionable strategic initiatives
              </p>
            </div>

            {/* Real-time Status */}
            <div className="hidden items-center space-x-6 text-sm sm:flex">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
                Ideas Pipeline Active
              </div>
              <div className="text-purple-100">
                Last updated:{' '}
                <span className="font-medium text-white">Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading ideas dashboard...</p>
            </div>
          }
        >
          <IdeasDashboard />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Strategic Ideas - FAEVision',
  description:
    'Transform signal hotspots into actionable strategic initiatives',
};
