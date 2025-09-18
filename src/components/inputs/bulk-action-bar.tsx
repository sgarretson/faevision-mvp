/**
 * Bulk Action Bar Component
 * Floating action bar for bulk operations on selected inputs
 */

'use client';

import {
  useInputSelection,
  getInputSelectionSummary,
} from '@/store/input-selection';
import { cn } from '@/lib/utils';
import { Brain, X, Users, Tag, AlertTriangle } from 'lucide-react';

interface BulkActionBarProps {
  readonly className?: string;
}

export function BulkActionBar({ className }: BulkActionBarProps) {
  const {
    selectionMode,
    getSelectedInputsArray,
    getSelectedCount,
    clearSelection,
    createIdeaFromSelection,
    isCreatingIdea,
  } = useInputSelection();

  const selectedInputs = getSelectedInputsArray();
  const selectedCount = getSelectedCount();

  // Don't render if not in selection mode or no inputs selected
  if (!selectionMode || selectedCount === 0) {
    return null;
  }

  const summary = getInputSelectionSummary(selectedInputs);

  const handleCreateIdea = async () => {
    await createIdeaFromSelection();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    return severity === 'CRITICAL' || severity === 'HIGH' ? (
      <AlertTriangle className="h-4 w-4" />
    ) : (
      <Tag className="h-4 w-4" />
    );
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform',
        'rounded-xl border border-gray-200 bg-white shadow-lg',
        'animate-in slide-in-from-bottom-4 duration-300',
        className
      )}
    >
      <div className="flex items-center space-x-6 px-6 py-4">
        {/* Selection Summary */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <span className="text-sm font-semibold text-blue-700">
                {selectedCount}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {selectedCount === 1 ? 'input' : 'inputs'} selected
            </span>
          </div>

          {/* Department Summary */}
          {summary.departments.length > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {summary.departments.length === 1
                  ? summary.departments[0]
                  : `${summary.departments.length} departments`}
              </span>
            </div>
          )}

          {/* Severity Summary */}
          <div
            className={cn(
              'flex items-center space-x-1 text-sm',
              getSeverityColor(summary.highestSeverity)
            )}
          >
            {getSeverityIcon(summary.highestSeverity)}
            <span className="capitalize">
              {summary.highestSeverity.toLowerCase()} priority
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateIdea}
            disabled={isCreatingIdea}
            className={cn(
              'flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              isCreatingIdea && 'cursor-not-allowed opacity-50'
            )}
          >
            <Brain className="h-4 w-4" />
            <span>{isCreatingIdea ? 'Creating Idea...' : 'Create Idea'}</span>
          </button>

          <button
            onClick={clearSelection}
            disabled={isCreatingIdea}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selection Preview */}
      {selectedCount > 1 && (
        <div className="border-t border-gray-100 px-6 py-3">
          <div className="text-xs text-gray-500">
            Selected inputs: {summary.titles.slice(0, 2).join(', ')}
            {summary.titles.length > 2 && ` +${summary.titles.length - 2} more`}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Selection Status Indicator
 * Shows selection state in the page header
 */
export function SelectionStatusIndicator() {
  const { selectionMode, getSelectedCount } = useInputSelection();
  const selectedCount = getSelectedCount();

  if (!selectionMode) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-blue-50 px-3 py-1 text-sm text-blue-700">
      <span className="font-medium">Selection Mode</span>
      {selectedCount > 0 && (
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium">
          {selectedCount}
        </span>
      )}
    </div>
  );
}
