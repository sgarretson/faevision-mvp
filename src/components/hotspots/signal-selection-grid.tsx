'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Zap,
  X,
  Filter,
} from 'lucide-react';

/**
 * Signal Selection Grid Component
 *
 * Executive workflow for selecting signals within clusters:
 * - Visual signal classification (core/peripheral/outlier)
 * - Multi-selection for targeted idea creation
 * - Membership strength visualization
 * - Bulk actions for cluster management
 *
 * Expert: Maya Rodriguez (UX Expert) + Alex Thompson (Lead Developer)
 * Design: David Chen (Visual Designer)
 */

interface Signal {
  id: string;
  title: string;
  description: string;
  severity: string;
  membershipStrength: number;
  isOutlier: boolean;
  signalStatus: 'core' | 'peripheral' | 'outlier';
  departmentName?: string;
  teamName?: string;
  createdAt: string;
  signal?: {
    id: string;
    title: string;
    description: string;
    severity: string;
    createdAt: string;
  };
}

interface SignalSelectionGridProps {
  signals: Signal[];
  hotspotId: string;
  hotspotTitle: string;
  onCreateIdea?: (selectedSignals: Signal[]) => void;
  onSignalAction?: (action: string, signalIds: string[]) => void;
}

export function SignalSelectionGrid({
  signals,
  hotspotId,
  hotspotTitle,
  onCreateIdea,
  onSignalAction,
}: SignalSelectionGridProps) {
  const [selectedSignals, setSelectedSignals] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('all');
  const [isCreatingIdea, setIsCreatingIdea] = useState(false);

  // Filter signals based on selected filter
  const filteredSignals = signals.filter((signal) => {
    if (filterType === 'all') return true;
    if (filterType === 'core') return signal.signalStatus === 'core';
    if (filterType === 'peripheral') return signal.signalStatus === 'peripheral';
    if (filterType === 'outlier') return signal.signalStatus === 'outlier';
    return true;
  });

  const handleSelectSignal = (signalId: string) => {
    const newSelected = new Set(selectedSignals);
    if (newSelected.has(signalId)) {
      newSelected.delete(signalId);
    } else {
      newSelected.add(signalId);
    }
    setSelectedSignals(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSignals.size === filteredSignals.length) {
      setSelectedSignals(new Set());
    } else {
      setSelectedSignals(new Set(filteredSignals.map((signal) => signal.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedSignals(new Set());
  };

  const handleCreateIdea = async () => {
    if (selectedSignals.size === 0 || isCreatingIdea) return;

    try {
      setIsCreatingIdea(true);
      const selectedSignalObjects = signals.filter((signal) =>
        selectedSignals.has(signal.id)
      );

      if (onCreateIdea) {
        await onCreateIdea(selectedSignalObjects);
      } else {
        // Default behavior - create idea via API
        const response = await fetch('/api/ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Idea from ${hotspotTitle} Cluster`,
            description: `Generated from ${selectedSignals.size} selected signals in hotspot cluster`,
            hotspotId,
            origin: 'human',
            status: 'draft',
            selectedSignalIds: Array.from(selectedSignals),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Navigate to the new idea
          window.open(`/ideas/${data.idea.id}`, '_blank');
          // Clear selection
          setSelectedSignals(new Set());
        }
      }
    } catch (error) {
      console.error('Error creating idea:', error);
    } finally {
      setIsCreatingIdea(false);
    }
  };

  const selectedCount = selectedSignals.size;
  const coreSignals = signals.filter((s) => s.signalStatus === 'core');
  const peripheralSignals = signals.filter((s) => s.signalStatus === 'peripheral');
  const outlierSignals = signals.filter((s) => s.signalStatus === 'outlier');

  return (
    <div className="space-y-6">
      {/* Filter and Selection Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        {/* Signal Type Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All Signals ({signals.length})
          </Button>
          <Button
            variant={filterType === 'core' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('core')}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Core ({coreSignals.length})
          </Button>
          <Button
            variant={filterType === 'peripheral' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('peripheral')}
            className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
          >
            <Filter className="mr-1 h-3 w-3" />
            Peripheral ({peripheralSignals.length})
          </Button>
          <Button
            variant={filterType === 'outlier' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('outlier')}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            <AlertTriangle className="mr-1 h-3 w-3" />
            Outliers ({outlierSignals.length})
          </Button>
        </div>

        {/* Selection Controls */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedCount === filteredSignals.length && filteredSignals.length > 0}
            onCheckedChange={handleSelectAll}
            className="h-5 w-5"
          />
          <span className="text-sm font-medium text-gray-700">
            {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
          </span>
          {selectedCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearSelection}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Signal Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSignals.map((signal) => {
          const isSelected = selectedSignals.has(signal.id);
          const actualSignal = signal.signal || signal;

          return (
            <Card
              key={signal.id}
              className={`transition-all duration-200 ${
                isSelected
                  ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-500'
                  : 'hover:shadow-md'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSelectSignal(signal.id)}
                    className="mt-1 h-5 w-5"
                  />

                  {/* Signal Content */}
                  <div className="flex-1 min-w-0">
                    {/* Signal Status & Strength */}
                    <div className="mb-2 flex items-center space-x-2">
                      <SignalStatusBadge
                        status={signal.signalStatus}
                        membershipStrength={signal.membershipStrength}
                      />
                      <SeverityBadge severity={actualSignal.severity} />
                    </div>

                    {/* Signal Title */}
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                      {actualSignal.title}
                    </h4>

                    {/* Signal Description */}
                    <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                      {actualSignal.description}
                    </p>

                    {/* Membership Strength Indicator */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Cluster Confidence</span>
                        <span>{Math.round(signal.membershipStrength * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            signal.membershipStrength >= 0.8
                              ? 'bg-green-500'
                              : signal.membershipStrength >= 0.6
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{
                            width: `${Math.max(signal.membershipStrength * 100, 10)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Signal Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        {signal.departmentName && (
                          <Badge variant="outline" className="text-xs">
                            {signal.departmentName}
                          </Badge>
                        )}
                      </div>
                      <span>
                        {new Date(actualSignal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSignals.length === 0 && (
        <div className="py-12 text-center">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No signals match this filter
          </h3>
          <p className="mt-2 text-gray-600">
            Try selecting a different signal type or clear your filters.
          </p>
        </div>
      )}

      {/* Floating Action Bar */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">
                  {selectedCount} signal{selectedCount !== 1 ? 's' : ''} selected
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>

                <Button
                  onClick={handleCreateIdea}
                  disabled={isCreatingIdea}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {isCreatingIdea
                    ? 'Creating Idea...'
                    : `Create Idea from ${selectedCount} Signal${selectedCount !== 1 ? 's' : ''}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Signal status badge component
 */
function SignalStatusBadge({
  status,
  membershipStrength,
}: {
  status: 'core' | 'peripheral' | 'outlier';
  membershipStrength: number;
}) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'core':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Core',
        };
      case 'peripheral':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Filter className="h-3 w-3" />,
          label: 'Peripheral',
        };
      case 'outlier':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertTriangle className="h-3 w-3" />,
          label: 'Outlier',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Zap className="h-3 w-3" />,
          label: 'Unknown',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={config.color}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </Badge>
  );
}

/**
 * Severity badge component
 */
function SeverityBadge({ severity }: { severity: string }) {
  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getSeverityColor(severity)}>
      {severity?.toUpperCase() || 'MEDIUM'}
    </Badge>
  );
}
