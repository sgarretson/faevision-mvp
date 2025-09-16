'use client';

import { useState } from 'react';
import { Play, Settings, RefreshCw, Info } from 'lucide-react';

/**
 * Clustering Controls Component
 *
 * Executive-friendly controls for AI clustering:
 * - Simple presets for non-technical executives
 * - Advanced options for power users
 * - Real-time feedback and status
 * - Mobile-optimized touch targets
 *
 * Expert: Dr. Priya Patel (AI Architect)
 * UX: Maya Rodriguez (UX Expert)
 */

interface ClusteringControlsProps {
  onRunClustering: (options: ClusteringOptions) => void;
  clustering: boolean;
}

interface ClusteringOptions {
  minClusterSize: number;
  minSamples: number;
  forceReclustering: boolean;
  generateSolutions: boolean;
}

export function ClusteringControls({
  onRunClustering,
  clustering,
}: ClusteringControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState<ClusteringOptions>({
    minClusterSize: 3,
    minSamples: 2,
    forceReclustering: false,
    generateSolutions: true,
  });

  const handleQuickRun = (
    preset: 'conservative' | 'balanced' | 'aggressive'
  ) => {
    const presets = {
      conservative: {
        minClusterSize: 5,
        minSamples: 3,
        forceReclustering: false,
        generateSolutions: true,
      },
      balanced: {
        minClusterSize: 3,
        minSamples: 2,
        forceReclustering: false,
        generateSolutions: true,
      },
      aggressive: {
        minClusterSize: 2,
        minSamples: 1,
        forceReclustering: true,
        generateSolutions: true,
      },
    };

    onRunClustering(presets[preset]);
  };

  const handleAdvancedRun = () => {
    onRunClustering(options);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            AI Clustering Controls
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Generate hotspots from signal patterns using machine learning
          </p>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Settings className="mr-1 h-4 w-4" />
          {showAdvanced ? 'Simple' : 'Advanced'}
        </button>
      </div>

      {/* Quick Presets */}
      {!showAdvanced && (
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-900">
              Quick Clustering Presets
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <PresetCard
                title="Conservative"
                description="Fewer, high-confidence hotspots"
                icon="🎯"
                onClick={() => handleQuickRun('conservative')}
                disabled={clustering}
                details="5+ signals, high confidence threshold"
              />

              <PresetCard
                title="Balanced"
                description="Optimal for most scenarios"
                icon="⚖️"
                onClick={() => handleQuickRun('balanced')}
                disabled={clustering}
                details="3+ signals, balanced sensitivity"
                recommended
              />

              <PresetCard
                title="Aggressive"
                description="More hotspots, including weak patterns"
                icon="🚀"
                onClick={() => handleQuickRun('aggressive')}
                disabled={clustering}
                details="2+ signals, low threshold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Advanced Controls */}
      {showAdvanced && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ControlGroup
              title="Cluster Size"
              description="Minimum signals required per hotspot"
            >
              <input
                type="number"
                min="2"
                max="10"
                value={options.minClusterSize}
                onChange={e =>
                  setOptions(prev => ({
                    ...prev,
                    minClusterSize: parseInt(e.target.value) || 3,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                disabled={clustering}
              />
            </ControlGroup>

            <ControlGroup
              title="Minimum Samples"
              description="Core point density threshold"
            >
              <input
                type="number"
                min="1"
                max="5"
                value={options.minSamples}
                onChange={e =>
                  setOptions(prev => ({
                    ...prev,
                    minSamples: parseInt(e.target.value) || 2,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                disabled={clustering}
              />
            </ControlGroup>
          </div>

          <div className="space-y-3">
            <ToggleOption
              label="Force Re-clustering"
              description="Re-analyze all signals, including those already in hotspots"
              checked={options.forceReclustering}
              onChange={checked =>
                setOptions(prev => ({
                  ...prev,
                  forceReclustering: checked,
                }))
              }
              disabled={clustering}
            />

            <ToggleOption
              label="Generate AI Solutions"
              description="Automatically create solution suggestions for new hotspots"
              checked={options.generateSolutions}
              onChange={checked =>
                setOptions(prev => ({
                  ...prev,
                  generateSolutions: checked,
                }))
              }
              disabled={clustering}
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-center text-sm text-gray-500">
              <Info className="mr-1 h-4 w-4" />
              Processing time: ~5-15 seconds
            </div>

            <button
              onClick={handleAdvancedRun}
              disabled={clustering}
              className={`inline-flex items-center rounded-lg px-4 py-2 font-medium transition-colors ${
                clustering
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } `}
            >
              {clustering ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Clustering
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      {clustering && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center">
            <RefreshCw className="mr-3 h-5 w-5 animate-spin text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                AI Clustering in Progress
              </p>
              <p className="text-sm text-blue-700">
                Analyzing signal patterns and generating hotspots...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Preset card component
 */
function PresetCard({
  title,
  description,
  icon,
  onClick,
  disabled,
  details,
  recommended = false,
}: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  disabled: boolean;
  details: string;
  recommended?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-lg border p-4 text-left transition-all ${
        disabled
          ? 'cursor-not-allowed border-gray-200 bg-gray-50'
          : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
      } ${recommended ? 'border-blue-500 ring-2 ring-blue-500' : ''} `}
    >
      {recommended && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 transform">
          <span className="rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
            Recommended
          </span>
        </div>
      )}

      <div className="mb-2 flex items-center">
        <span className="mr-3 text-2xl">{icon}</span>
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>

      <p className="mb-2 text-sm text-gray-600">{description}</p>
      <p className="text-xs text-gray-500">{details}</p>
    </button>
  );
}

/**
 * Control group component
 */
function ControlGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-900">
        {title}
      </label>
      <p className="mb-2 text-xs text-gray-500">{description}</p>
      {children}
    </div>
  );
}

/**
 * Toggle option component
 */
function ToggleOption({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-start">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
      />
      <div className="ml-3">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}
