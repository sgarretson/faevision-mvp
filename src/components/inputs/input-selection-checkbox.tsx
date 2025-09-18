/**
 * Input Selection Checkbox Component
 * Handles individual input selection for bulk operations
 */

'use client';

import { useInputSelection, type SelectedInput } from '@/store/input-selection';
import { cn } from '@/lib/utils';

interface InputSelectionCheckboxProps {
  readonly input: SelectedInput;
  readonly className?: string;
}

export function InputSelectionCheckbox({
  input,
  className,
}: InputSelectionCheckboxProps) {
  const { isInputSelected, toggleSelection, selectionMode } =
    useInputSelection();

  const isSelected = isInputSelected(input.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSelection(input);
  };

  // Only show checkbox when in selection mode or when this input is selected
  if (!selectionMode && !isSelected) {
    return null;
  }

  return (
    <button
      className={cn(
        'absolute left-3 top-3 z-10 flex h-5 w-5 items-center justify-center rounded border-2 bg-white shadow-sm transition-all duration-200',
        isSelected
          ? 'border-blue-600 bg-blue-600'
          : 'border-gray-300 hover:border-blue-400',
        className
      )}
      onClick={handleToggle}
      type="button"
      aria-pressed={isSelected}
      aria-label={`Select input: ${input.title}`}
    >
      {isSelected && (
        <svg
          className="h-3 w-3 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
}

/**
 * Selection Mode Toggle Button
 * Allows users to enter/exit selection mode
 */
interface SelectionModeToggleProps {
  readonly className?: string;
}

export function SelectionModeToggle({ className }: SelectionModeToggleProps) {
  const {
    selectionMode,
    enterSelectionMode,
    exitSelectionMode,
    getSelectedCount,
    clearSelection,
  } = useInputSelection();

  const selectedCount = getSelectedCount();

  const handleToggle = () => {
    if (selectionMode) {
      exitSelectionMode();
    } else {
      enterSelectionMode();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearSelection();
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <button
        onClick={handleToggle}
        className={cn(
          'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          selectionMode
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        {selectionMode ? 'Exit Selection' : 'Select Multiple'}
      </button>

      {selectionMode && selectedCount > 0 && (
        <button
          onClick={handleClear}
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Clear ({selectedCount})
        </button>
      )}
    </div>
  );
}
