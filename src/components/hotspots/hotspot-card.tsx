'use client';

import { useState } from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  MessageSquare,
  ThumbsUp,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ClusterAnalysisHeader } from './cluster-analysis-header';
import { SignalSelectionGrid } from './signal-selection-grid';

/**
 * Executive Hotspot Card Component
 *
 * Mobile-optimized card for hotspot display:
 * - Executive scanning optimized layout
 * - One-click actions for busy executives
 * - Progressive disclosure design
 * - A&E industry context highlighting
 *
 * Expert: Maya Rodriguez (UX Expert)
 * Design: David Chen (Visual Designer)
 */

interface HotspotCardProps {
  hotspot: {
    id: string;
    title: string;
    summary: string;
    status: string;
    rankScore: number;
    confidence: number;
    signalCount: number;
    linkedEntities: any[];
    signals: any[];
    clusteringMethod?: string;
    similarityThreshold?: number;
    clusterAnalysis?: {
      totalSignals: number;
      coreSignals: number;
      outlierSignals: number;
      avgMembershipStrength: number;
      clusterQuality: number;
    };
    // Add engagement metrics like Strategic Inputs
    _count?: {
      comments?: number;
      votes?: number;
      ideas?: number;
    };
  };
  isSelected: boolean;
  onSelect: () => void;
  onAction: (action: string) => void;
}

export function HotspotCard({
  hotspot,
  isSelected,
  onSelect,
  onAction,
}: HotspotCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCreatingIdea, setIsCreatingIdea] = useState(false);

  const priorityLevel = getPriorityLevel(hotspot.rankScore);
  const priorityColor = getPriorityColor(priorityLevel);
  const statusColor = getStatusColor(hotspot.status);

  const handleCreateIdea = async () => {
    if (isCreatingIdea) return;

    try {
      setIsCreatingIdea(true);

      // Create idea from hotspot
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Idea: ${hotspot.title}`,
          description: `Generated from hotspot: ${hotspot.summary}`,
          hotspotId: hotspot.id,
          origin: 'human', // Executive-initiated from hotspot
          status: 'draft',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to the new idea detail page
        window.open(`/ideas/${data.idea.id}`, '_blank');
        onAction('idea-created');
      } else {
        throw new Error('Failed to create idea');
      }
    } catch (error) {
      console.error('Error creating idea:', error);
      // TODO: Show error toast
    } finally {
      setIsCreatingIdea(false);
    }
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-lg border bg-white transition-all duration-200 hover:shadow-md ${isSelected ? 'border-blue-200 ring-2 ring-blue-500' : 'border-gray-200'} `}
    >
      {/* Card Header - Executive Summary */}
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center space-x-3">
              <PriorityBadge priority={priorityLevel} color={priorityColor} />
              <StatusBadge status={hotspot.status} color={statusColor} />
            </div>

            <h3 className="mb-2 line-clamp-2 break-words text-lg font-semibold leading-6 text-gray-900">
              {hotspot.title}
            </h3>
          </div>

          <button
            onClick={onSelect}
            className="ml-4 p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            {isSelected ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Enhanced Metrics Row - Matching Strategic Input Cards */}
        <div className="mb-4">
          {/* Hot Topic Indicator */}
          {(hotspot._count?.comments && hotspot._count.comments > 5) ||
          (hotspot._count?.votes && hotspot._count.votes > 10) ? (
            <div className="mb-3">
              <Badge className="border-red-200 bg-red-100 text-red-800">
                <TrendingUp className="mr-1 h-3 w-3" />
                Hot Cluster
              </Badge>
            </div>
          ) : null}

          {/* Engagement Metrics Row */}
          <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center space-x-1 text-sm">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-gray-700">
                {hotspot._count?.comments || 0}
              </span>
              <span className="hidden text-gray-500 sm:inline">
                discussions
              </span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <span className="font-medium text-gray-700">
                {hotspot._count?.votes || 0}
              </span>
              <span className="hidden text-gray-500 sm:inline">votes</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Lightbulb className="h-4 w-4 text-purple-500" />
              <span className="font-medium text-gray-700">
                {hotspot._count?.ideas || 0}
              </span>
              <span className="hidden text-gray-500 sm:inline">ideas</span>
            </div>
            {/* Active discussion indicator */}
            {((hotspot._count?.comments || 0) > 3 ||
              (hotspot._count?.votes || 0) > 5) && (
              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 text-blue-700"
              >
                <Users className="mr-1 h-3 w-3" />
                <span className="hidden sm:inline">Active Discussion</span>
                <span className="sm:hidden">Active</span>
              </Badge>
            )}
          </div>

          {/* Traditional Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <MetricItem
              icon={<Users className="h-4 w-4" />}
              label="Signals"
              value={hotspot.signalCount}
            />
            <MetricItem
              icon={<TrendingUp className="h-4 w-4" />}
              label="Confidence"
              value={`${Math.round(hotspot.confidence * 100)}%`}
            />
            <MetricItem
              icon={<AlertTriangle className="h-4 w-4" />}
              label="Priority"
              value={priorityLevel}
            />
          </div>

          {/* Cluster Quality Indicator */}
          {hotspot.clusterAnalysis && (
            <div className="mt-3 rounded bg-gray-50 p-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Cluster Quality</span>
                <span
                  className={`font-medium ${
                    hotspot.clusterAnalysis.clusterQuality >= 80
                      ? 'text-green-600'
                      : hotspot.clusterAnalysis.clusterQuality >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {Math.round(hotspot.clusterAnalysis.clusterQuality)}%
                </span>
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-gray-200">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    hotspot.clusterAnalysis.clusterQuality >= 80
                      ? 'bg-green-500'
                      : hotspot.clusterAnalysis.clusterQuality >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.max(hotspot.clusterAnalysis.clusterQuality, 10)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <p className="mb-4 line-clamp-3 break-words text-sm leading-relaxed text-gray-600">
          {hotspot.summary}
        </p>

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <QuickActionButton
              icon={<Plus className="h-4 w-4" />}
              label={isCreatingIdea ? 'Creating...' : 'Create Idea'}
              onClick={() => handleCreateIdea()}
              variant="primary"
              disabled={isCreatingIdea}
            />
            <QuickActionButton
              icon={<CheckCircle className="h-4 w-4" />}
              label="Approve"
              onClick={() => onAction('approve')}
              variant="secondary"
            />
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {showDetails ? 'Less Details' : 'More Details'}
          </button>
        </div>
      </div>

      {/* Expandable Details Section */}
      {(isSelected || showDetails) && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="space-y-6 p-6">
            {/* Enhanced Cluster Analysis */}
            {hotspot.clusterAnalysis && (
              <ClusterAnalysisHeader
                clusteringMethod={hotspot.clusteringMethod}
                similarityThreshold={hotspot.similarityThreshold}
                confidence={hotspot.confidence}
                clusterAnalysis={hotspot.clusterAnalysis}
                linkedEntities={hotspot.linkedEntities}
              />
            )}

            {/* Signal Selection Grid */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-900">
                Select Signals for Idea Creation
              </h4>
              <SignalSelectionGrid
                signals={hotspot.signals.map((signal: any) => ({
                  ...signal,
                  // Map signal data structure
                  id: signal.id || signal.signal?.id,
                  title: signal.title || signal.signal?.title,
                  description: signal.description || signal.signal?.description,
                  severity:
                    signal.severity || signal.signal?.severity || 'MEDIUM',
                  membershipStrength: signal.membershipStrength || 1.0,
                  isOutlier: signal.isOutlier || false,
                  signalStatus:
                    signal.signalStatus ||
                    (signal.isOutlier
                      ? 'outlier'
                      : (signal.membershipStrength || 1.0) > 0.7
                        ? 'core'
                        : 'peripheral'),
                  departmentName: signal.departmentName,
                  teamName: signal.teamName,
                  createdAt: signal.createdAt || signal.signal?.createdAt,
                }))}
                hotspotId={hotspot.id}
                hotspotTitle={hotspot.title}
                onCreateIdea={selectedSignals => {
                  console.log(
                    'Creating idea from selected signals:',
                    selectedSignals
                  );
                  onAction('idea-created');
                }}
              />
            </div>

            {/* Linked Entities */}
            {hotspot.linkedEntities && hotspot.linkedEntities.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900">
                  Key Entities Affected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(hotspot.linkedEntities || [])
                    .slice(0, 5)
                    .map((entity, index) => (
                      <EntityBadge key={index} entity={entity} />
                    ))}
                  {(hotspot.linkedEntities || []).length > 5 && (
                    <span className="px-2 py-1 text-xs text-gray-500">
                      +{(hotspot.linkedEntities || []).length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action History */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-xs text-gray-500">
                Created {formatTimeAgo((hotspot as any).createdAt)} • Last
                updated {formatTimeAgo((hotspot as any).updatedAt)}
              </div>

              <div className="flex space-x-2">
                <ActionButton
                  label="Archive"
                  onClick={() => onAction('archive')}
                  variant="outline"
                />
                <ActionButton
                  label="Re-cluster"
                  onClick={() => onAction('re-cluster')}
                  variant="outline"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Priority badge component
 */
function PriorityBadge({
  priority,
  color,
}: {
  priority: string;
  color: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color} `}
    >
      {priority}
    </span>
  );
}

/**
 * Status badge component
 */
function StatusBadge({ status, color }: { status: string; color: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color} `}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

/**
 * Metric item component
 */
function MetricItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="text-center">
      <div className="mb-1 flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

/**
 * Quick action button component
 */
function QuickActionButton({
  icon,
  label,
  onClick,
  variant = 'secondary',
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}) {
  const baseClasses =
    'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors';
  const variantClasses =
    variant === 'primary'
      ? disabled
        ? 'bg-blue-400 text-white cursor-not-allowed'
        : 'bg-blue-600 text-white hover:bg-blue-700'
      : disabled
        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
}

/**
 * Action button component
 */
function ActionButton({
  label,
  onClick,
  variant = 'outline',
}: {
  label: string;
  onClick: () => void;
  variant?: 'outline' | 'solid';
}) {
  const baseClasses =
    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors';
  const variantClasses =
    variant === 'outline'
      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
      : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {label}
    </button>
  );
}

/**
 * Entity badge component
 */
function EntityBadge({ entity }: { entity: any }) {
  const typeColors = {
    vendor: 'bg-yellow-100 text-yellow-800',
    project: 'bg-blue-100 text-blue-800',
    client: 'bg-green-100 text-green-800',
    trade: 'bg-purple-100 text-purple-800',
    material: 'bg-orange-100 text-orange-800',
    default: 'bg-gray-100 text-gray-800',
  };

  const colorClass =
    typeColors[entity.type as keyof typeof typeColors] || typeColors.default;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass} `}
    >
      {entity.name}
      {entity.importance && (
        <span className="ml-1 text-xs opacity-75">
          ({Math.round(entity.importance * 100)}%)
        </span>
      )}
    </span>
  );
}

/**
 * Signal preview component
 */
function SignalPreview({ signal }: { signal: any }) {
  const severityColor =
    signal.severity === 'CRITICAL'
      ? 'text-red-600'
      : signal.severity === 'HIGH'
        ? 'text-orange-600'
        : signal.severity === 'MEDIUM'
          ? 'text-yellow-600'
          : 'text-gray-600';

  return (
    <div className="flex items-start space-x-3 rounded border bg-white p-3">
      <div
        className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${
          signal.severity === 'CRITICAL'
            ? 'bg-red-500'
            : signal.severity === 'HIGH'
              ? 'bg-orange-500'
              : signal.severity === 'MEDIUM'
                ? 'bg-yellow-500'
                : 'bg-gray-400'
        } `}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          {signal.title}
        </p>
        <p className="line-clamp-2 text-xs text-gray-500">
          {signal.description}
        </p>
        <div className="mt-1 flex items-center space-x-2">
          <span className={`text-xs font-medium ${severityColor}`}>
            {signal.severity}
          </span>
          {signal.membershipStrength && (
            <span className="text-xs text-gray-400">
              {Math.round(signal.membershipStrength * 100)}% match
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Utility functions
function getPriorityLevel(rankScore: number): string {
  if (rankScore >= 0.8) return 'Critical';
  if (rankScore >= 0.6) return 'High';
  if (rankScore >= 0.4) return 'Medium';
  return 'Low';
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'Critical':
      return 'bg-red-100 text-red-800';
    case 'High':
      return 'bg-orange-100 text-orange-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return 'bg-blue-100 text-blue-800';
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'HANDED_OFF':
      return 'bg-purple-100 text-purple-800';
    case 'RESOLVED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'recently';

  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return 'just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return date.toLocaleDateString();
}
