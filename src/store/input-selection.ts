/**
 * Input Selection State Management
 * Handles bulk selection of strategic inputs for idea creation
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface SelectedInput {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  departmentId?: string;
  departmentName?: string;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
  createdById: string;
}

interface InputSelectionState {
  // Selection state
  selectedInputs: Map<string, SelectedInput>;
  selectionMode: boolean;

  // Actions
  toggleSelection: (input: SelectedInput) => void;
  selectInput: (input: SelectedInput) => void;
  deselectInput: (inputId: string) => void;
  clearSelection: () => void;
  selectAll: (inputs: SelectedInput[]) => void;

  // Mode management
  enterSelectionMode: () => void;
  exitSelectionMode: () => void;

  // Computed properties
  getSelectedInputsArray: () => SelectedInput[];
  getSelectedCount: () => number;
  isInputSelected: (inputId: string) => boolean;

  // Idea creation
  createIdeaFromSelection: () => Promise<void>;
  isCreatingIdea: boolean;
}

export const useInputSelection = create<InputSelectionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      selectedInputs: new Map(),
      selectionMode: false,
      isCreatingIdea: false,

      // Selection actions
      toggleSelection: (input: SelectedInput) => {
        const { selectedInputs } = get();
        const newSelection = new Map(selectedInputs);

        if (newSelection.has(input.id)) {
          newSelection.delete(input.id);
        } else {
          newSelection.set(input.id, input);
        }

        set({
          selectedInputs: newSelection,
          selectionMode: newSelection.size > 0,
        });
      },

      selectInput: (input: SelectedInput) => {
        const { selectedInputs } = get();
        const newSelection = new Map(selectedInputs);
        newSelection.set(input.id, input);

        set({
          selectedInputs: newSelection,
          selectionMode: true,
        });
      },

      deselectInput: (inputId: string) => {
        const { selectedInputs } = get();
        const newSelection = new Map(selectedInputs);
        newSelection.delete(inputId);

        set({
          selectedInputs: newSelection,
          selectionMode: newSelection.size > 0,
        });
      },

      clearSelection: () => {
        set({
          selectedInputs: new Map(),
          selectionMode: false,
        });
      },

      selectAll: (inputs: SelectedInput[]) => {
        const newSelection = new Map();
        inputs.forEach(input => {
          newSelection.set(input.id, input);
        });

        set({
          selectedInputs: newSelection,
          selectionMode: true,
        });
      },

      // Mode management
      enterSelectionMode: () => {
        set({ selectionMode: true });
      },

      exitSelectionMode: () => {
        set({
          selectionMode: false,
          selectedInputs: new Map(),
        });
      },

      // Computed properties
      getSelectedInputsArray: () => {
        return Array.from(get().selectedInputs.values());
      },

      getSelectedCount: () => {
        return get().selectedInputs.size;
      },

      isInputSelected: (inputId: string) => {
        return get().selectedInputs.has(inputId);
      },

      // Idea creation
      createIdeaFromSelection: async () => {
        const { selectedInputs } = get();
        const inputsArray = Array.from(selectedInputs.values());

        if (inputsArray.length === 0) {
          console.warn('No inputs selected for idea creation');
          return;
        }

        set({ isCreatingIdea: true });

        try {
          const response = await fetch('/api/ideas/from-inputs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputIds: inputsArray.map(input => input.id),
              inputs: inputsArray, // Include full input data for AI processing
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to create idea: ${response.status}`);
          }

          const result = await response.json();
          console.log('✅ Idea created successfully:', result);

          // Clear selection after successful creation
          get().clearSelection();

          // Navigate to the new idea (will be implemented when we add routing)
          if (result.idea?.id) {
            // Navigate to the new idea
            window.location.href = `/ideas/${result.idea.id}`;
          }
        } catch (error) {
          console.error('❌ Failed to create idea from inputs:', error);
          // Show error to user
          alert('Failed to create idea. Please try again.');
        } finally {
          set({ isCreatingIdea: false });
        }
      },
    }),
    {
      name: 'input-selection-store',
    }
  )
);

// Export utility functions
export const getInputSelectionSummary = (inputs: SelectedInput[]) => {
  const departments = new Set(
    inputs.map((i: SelectedInput) => i.departmentName).filter(Boolean)
  );
  const categories = new Set(
    inputs.map((i: SelectedInput) => i.categoryName).filter(Boolean)
  );
  const severities = inputs.map((i: SelectedInput) => i.severity);

  let highestSeverity = 'LOW';
  if (severities.includes('CRITICAL')) {
    highestSeverity = 'CRITICAL';
  } else if (severities.includes('HIGH')) {
    highestSeverity = 'HIGH';
  } else if (severities.includes('MEDIUM')) {
    highestSeverity = 'MEDIUM';
  }

  return {
    count: inputs.length,
    departments: Array.from(departments),
    categories: Array.from(categories),
    highestSeverity,
    titles: inputs.map((i: SelectedInput) => i.title),
  };
};
