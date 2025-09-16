'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { HotspotCard } from './hotspot-card';
import { ClusteringControls } from './clustering-controls';
import { HotspotMetrics } from './hotspot-metrics';
import { QuickActions } from './quick-actions';
import { PerformanceDashboard } from '@/components/monitoring/performance-dashboard';
import {
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
} from 'lucide-react';

/**
 * Executive Hotspot Dashboard Component
 *
 * Single-pane interface designed for executive scanning behavior:
 * - F-pattern layout optimization
 * - Real-time clustering controls
 * - Mobile-first responsive design
 * - One-click actions for busy executives
 *
 * Expert: Maya Rodriguez (UX Expert)
 * Based on Executive UX research and A&E industry patterns
 */

interface Hotspot {
  id: string;
  title: string;
  summary: string;
  status: string;
  rankScore: number;
  confidence: number;
  signalCount: number;
  linkedEntities: any[];
  signals: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface DashboardMetrics {
  totalHotspots: number;
  criticalHotspots: number;
  avgConfidence: number;
  signalsProcessed: number;
  lastClusteringRun: string;
}

export function HotspotDashboard() {
  const { data: session, status } = useSession();
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [clustering, setClustering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [showPerformance, setShowPerformance] = useState(false);

  // Load initial data
  useEffect(() => {
    if (status === 'authenticated' && session) {
      loadHotspots();
      loadMetrics();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, session]);

  const loadHotspots = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hotspots');

      if (!response.ok) {
        throw new Error('Failed to load hotspots');
      }

      const data = await response.json();
      setHotspots(data.hotspots || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load hotspots');
      console.error('Error loading hotspots:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/hotspots/metrics');

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Error loading metrics:', err);
    }
  };

  const handleRunClustering = async (options: any) => {
    try {
      setClustering(true);
      setError(null);

      const response = await fetch('/api/cluster/generate-hotspots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        throw new Error('Clustering failed');
      }

      const result = await response.json();

      if (result.success) {
        // Refresh hotspots with new results
        setHotspots(result.results.allHotspots || []);
        loadMetrics();

        // Show success feedback
        console.log(
          `✅ Clustering complete: ${result.hotspotsCreated} new hotspots created`
        );
      } else {
        throw new Error(result.error || 'Clustering failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Clustering failed');
      console.error('Clustering error:', err);
    } finally {
      setClustering(false);
    }
  };

  const handleHotspotAction = async (hotspotId: string, action: string) => {
    try {
      const response = await fetch(`/api/hotspots/${hotspotId}/${action}`, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh hotspots
        loadHotspots();
        loadMetrics();
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
    }
  };

  // Handle loading authentication
  if (status === 'loading') {
    return <HotspotDashboardSkeleton />;
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
          <span className="font-medium text-red-800">
            Please log in to view hotspots.
          </span>
        </div>
      </div>
    );
  }

  if (loading && hotspots.length === 0) {
    return <HotspotDashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Executive Summary Metrics */}
      {metrics && <HotspotMetrics metrics={metrics} loading={clustering} />}

      {/* Quick Actions Bar */}
      <QuickActions
        onRunClustering={handleRunClustering}
        clustering={clustering}
        hotspotCount={hotspots.length}
      />

      {/* Clustering Controls */}
      <ClusteringControls
        onRunClustering={handleRunClustering}
        clustering={clustering}
      />

      {/* Performance Monitoring Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowPerformance(!showPerformance)}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <BarChart3 className="mr-1 h-4 w-4" />
          {showPerformance ? 'Hide Performance' : 'Show Performance'}
        </button>
      </div>

      {/* Performance Dashboard */}
      {showPerformance && (
        <div className="rounded-lg bg-gray-50 p-6">
          <PerformanceDashboard />
        </div>
      )}

      {/* Main Hotspot Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Hotspots ({hotspots.length})
          </h2>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <TrendingUp className="mr-1 h-4 w-4" />
              Sorted by Priority
            </span>
          </div>
        </div>

        {hotspots.length === 0 ? (
          <EmptyState
            onRunClustering={() => handleRunClustering({ minClusterSize: 3 })}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
            {hotspots.map(hotspot => (
              <HotspotCard
                key={hotspot.id}
                hotspot={hotspot}
                isSelected={selectedHotspot === hotspot.id}
                onSelect={() =>
                  setSelectedHotspot(
                    selectedHotspot === hotspot.id ? null : hotspot.id
                  )
                }
                onAction={action => handleHotspotAction(hotspot.id, action)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile-optimized bottom actions */}
      <div className="fixed bottom-4 left-4 right-4 lg:hidden">
        <div className="rounded-lg border bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {hotspots.length} hotspots
            </span>
            <button
              onClick={() => handleRunClustering({ minClusterSize: 3 })}
              disabled={clustering}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {clustering ? 'Processing...' : 'Run Clustering'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state component encouraging first clustering run
 */
function EmptyState({ onRunClustering }: { onRunClustering: () => void }) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <Users className="h-12 w-12 text-gray-400" />
      </div>

      <h3 className="mb-2 text-lg font-medium text-gray-900">
        No Hotspots Detected Yet
      </h3>

      <p className="mx-auto mb-6 max-w-md text-gray-500">
        Run AI clustering to identify patterns in your signals and generate
        actionable hotspots for executive attention.
      </p>

      <button
        onClick={onRunClustering}
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Generate First Hotspots
      </button>
    </div>
  );
}

/**
 * Loading skeleton for dashboard
 */
function HotspotDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-6">
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
            <div className="h-8 w-1/3 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>

      {/* Controls skeleton */}
      <div className="rounded-lg border bg-white p-6">
        <div className="mb-4 h-6 w-1/4 rounded bg-gray-200"></div>
        <div className="flex space-x-4">
          <div className="h-10 w-32 rounded bg-gray-200"></div>
          <div className="h-10 w-32 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Hotspot cards skeleton */}
      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-6">
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
            <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
