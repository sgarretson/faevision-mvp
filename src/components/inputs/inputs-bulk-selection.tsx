'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Lightbulb,
  X,
  CheckSquare,
  Square,
  Plus,
  Users,
  Target,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Strategic Inputs Bulk Selection Component
 *
 * Executive multi-select interface for creating ideas from strategic inputs:
 * - Multi-select checkboxes on input cards
 * - Bulk action floating bar
 * - Manual idea creation workflow
 * - Executive-optimized UX
 *
 * Expert: Alex Thompson (Lead Developer)
 * Support: Maya Rodriguez (UX Expert), David Chen (Visual Designer)
 */

interface Input {
  id: string;
  title: string;
  description: string;
  type: 'PROBLEM' | 'OPPORTUNITY' | 'GENERAL' | string;
  status:
    | 'NEW'
    | 'DISCUSSING'
    | 'ORGANIZED'
    | 'IN_SOLUTION'
    | 'ARCHIVED'
    | string;
  department?: string;
  issueType?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  createdAt: string;
  creator?: {
    id: string;
    name?: string;
    email: string;
    role: string;
    department?: string;
  } | null;
  _count: {
    comments: number;
    votes: number;
  };
}

interface InputsBulkSelectionProps {
  inputs: Input[];
  onCreateIdea?: (selectedInputs: Input[]) => void;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  DISCUSSING: 'bg-yellow-100 text-yellow-800',
  ORGANIZED: 'bg-green-100 text-green-800',
  IN_SOLUTION: 'bg-purple-100 text-purple-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
  submitted: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  implemented: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const TYPE_ICONS: Record<string, string> = {
  PROBLEM: '⚠️',
  OPPORTUNITY: '📈',
  GENERAL: '💡',
  strategic_input: '🎯',
  improvement_suggestion: '💡',
  issue_report: '⚠️',
  feature_request: '✨',
  process_optimization: '⚡',
  cost_reduction: '💰',
  quality_enhancement: '🏆',
  compliance_requirement: '📋',
  market_opportunity: '📈',
  risk_mitigation: '🛡️',
};

export function InputsBulkSelection({
  inputs,
  onCreateIdea,
}: InputsBulkSelectionProps) {
  const [selectedInputs, setSelectedInputs] = useState<Set<string>>(new Set());
  const [isCreatingIdea, setIsCreatingIdea] = useState(false);

  const handleSelectInput = (inputId: string) => {
    const newSelected = new Set(selectedInputs);
    if (newSelected.has(inputId)) {
      newSelected.delete(inputId);
    } else {
      newSelected.add(inputId);
    }
    setSelectedInputs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedInputs.size === inputs.length) {
      setSelectedInputs(new Set());
    } else {
      setSelectedInputs(new Set(inputs.map(input => input.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedInputs(new Set());
  };

  const handleCreateIdea = async () => {
    if (selectedInputs.size === 0 || isCreatingIdea) return;

    try {
      setIsCreatingIdea(true);
      const selectedInputObjects = inputs.filter(input =>
        selectedInputs.has(input.id)
      );

      if (onCreateIdea) {
        await onCreateIdea(selectedInputObjects);
      } else {
        // Default behavior - navigate to idea creation with context
        const inputIds = Array.from(selectedInputs).join(',');
        window.location.href = `/ideas/create?from_inputs=${inputIds}`;
      }

      setSelectedInputs(new Set());
    } catch (error) {
      console.error('Create idea error:', error);
      // TODO: Show error toast
    } finally {
      setIsCreatingIdea(false);
    }
  };

  const selectedCount = selectedInputs.size;
  const isAllSelected = selectedCount === inputs.length && inputs.length > 0;

  return (
    <div className="relative">
      {/* Selection Header */}
      {inputs.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              className="h-5 w-5"
            />
            <span className="text-sm font-medium text-gray-700">
              {isAllSelected ? 'Deselect All' : 'Select All'}
              {selectedCount > 0 && ` (${selectedCount} selected)`}
            </span>
          </div>

          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-white">
                <Users className="mr-1 h-3 w-3" />
                {selectedCount} input{selectedCount !== 1 ? 's' : ''}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Inputs List with Selection */}
      <div className="space-y-4">
        {inputs.map(input => {
          const isSelected = selectedInputs.has(input.id);

          return (
            <Card
              key={input.id}
              className={`transition-all duration-200 ${
                isSelected
                  ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-500'
                  : 'hover:shadow-md'
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSelectInput(input.id)}
                    className="mt-1 h-5 w-5"
                  />

                  {/* Input Content */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <span
                        className="text-2xl"
                        role="img"
                        aria-label={input.type}
                      >
                        {TYPE_ICONS[input.type]}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                          <Link href={`/inputs/${input.id}`}>
                            {input.title || 'Untitled Input'}
                          </Link>
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                          {input.description || 'No description available'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className={STATUS_COLORS[input.status]}>
                        {input.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={PRIORITY_COLORS[input.priority]}>
                        {input.priority}
                      </Badge>
                      {input.department && (
                        <Badge variant="outline">{input.department}</Badge>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Created by{' '}
                        {input.creator?.name ||
                          input.creator?.email ||
                          'Unknown User'}
                      </span>
                      <span>
                        {new Date(input.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">
                  {selectedCount} input{selectedCount !== 1 ? 's' : ''} selected
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
                    : `Create Idea from ${selectedCount} Input${selectedCount !== 1 ? 's' : ''}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
