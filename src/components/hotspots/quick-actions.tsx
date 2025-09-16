'use client';

import { Play, RefreshCw, Download, Settings } from 'lucide-react';

/**
 * Quick Actions Component
 *
 * Executive-focused quick actions bar:
 * - One-click common operations
 * - Mobile-optimized touch targets (44px minimum)
 * - Clear visual feedback
 * - Thumb-friendly positioning
 *
 * Expert: Maya Rodriguez (UX Expert)
 * Optimized for executive mobile usage patterns
 */

interface QuickActionsProps {
  onRunClustering: (options: any) => void;
  clustering: boolean;
  hotspotCount: number;
}

export function QuickActions({
  onRunClustering,
  clustering,
  hotspotCount,
}: QuickActionsProps) {
  const handleQuickCluster = () => {
    onRunClustering({
      minClusterSize: 3,
      minSamples: 2,
      forceReclustering: false,
      generateSolutions: true,
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export hotspots');
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        {/* Left side - Status */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
            <p className="text-xs text-gray-500">
              {hotspotCount} active hotspots
            </p>
          </div>

          {/* Mobile status */}
          <div className="text-sm text-gray-600 sm:hidden">
            {hotspotCount} hotspots
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Quick Cluster Button */}
          <QuickActionButton
            icon={
              clustering ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )
            }
            label={clustering ? 'Processing...' : 'Quick Cluster'}
            onClick={handleQuickCluster}
            disabled={clustering}
            variant="primary"
          />

          {/* Refresh Button */}
          <QuickActionButton
            icon={<RefreshCw className="h-4 w-4" />}
            label="Refresh"
            onClick={handleRefresh}
            variant="secondary"
            hideLabel="sm"
          />

          {/* Export Button */}
          <QuickActionButton
            icon={<Download className="h-4 w-4" />}
            label="Export"
            onClick={handleExport}
            variant="secondary"
            hideLabel="sm"
          />
        </div>
      </div>

      {/* Progress indicator for clustering */}
      {clustering && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
            <span>AI processing signals...</span>
            <span>~15 seconds</span>
          </div>
          <div className="h-1 w-full rounded-full bg-gray-200">
            <div
              className="h-1 animate-pulse rounded-full bg-blue-600"
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Quick action button component with executive-friendly design
 */
function QuickActionButton({
  icon,
  label,
  onClick,
  disabled = false,
  variant = 'secondary',
  hideLabel,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  hideLabel?: 'sm' | 'md' | 'lg';
}) {
  const baseClasses = `
    inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium 
    transition-colors min-h-[44px] touch-manipulation
    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
  `;

  const variantClasses =
    variant === 'primary'
      ? `${
          disabled
            ? 'bg-gray-100 text-gray-400'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
        }`
      : `${
          disabled
            ? 'bg-gray-50 text-gray-400 border border-gray-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100'
        }`;

  const hideLabelClasses = hideLabel ? `${hideLabel}:inline-flex` : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      {icon}
      <span className={`ml-2 ${hideLabel ? `hidden ${hideLabelClasses}` : ''}`}>
        {label}
      </span>
    </button>
  );
}
