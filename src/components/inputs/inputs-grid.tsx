/**
 * Inputs Grid Component
 * Displays strategic inputs in a grid with selection capabilities
 */

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MessageCircle,
  ThumbsUp,
  User,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { InputSelectionCheckbox } from './input-selection-checkbox';
import { useInputSelection, type SelectedInput } from '@/store/input-selection';
import { cn } from '@/lib/utils';

interface InputItem {
  id: string;
  title: string;
  description: string;
  type: 'PROBLEM' | 'OPPORTUNITY' | 'GENERAL';
  status: 'NEW' | 'DISCUSSING' | 'ORGANIZED' | 'IN_SOLUTION' | 'ARCHIVED';
  department?: string;
  issueType?: string;
  rootCause?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  aiTags?: any;
  aiConfidence?: number;
  aiSuggestions?: any;
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

interface InputsGridProps {
  readonly inputs: InputItem[];
}

const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-800',
  DISCUSSING: 'bg-yellow-100 text-yellow-800',
  ORGANIZED: 'bg-purple-100 text-purple-800',
  IN_SOLUTION: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
};

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-red-100 text-red-800',
};

const TYPE_ICONS = {
  PROBLEM: '🚨',
  OPPORTUNITY: '💡',
  GENERAL: '💭',
};

export function InputsGrid({ inputs }: InputsGridProps) {
  const { selectionMode, isInputSelected } = useInputSelection();

  const convertToSelectedInput = (input: InputItem): SelectedInput => ({
    id: input.id,
    title: input.title,
    description: input.description,
    severity: input.priority as any, // Map priority to severity
    departmentName: input.department,
    categoryName: input.issueType,
    createdAt: input.createdAt,
    createdById: input.creator?.id || '',
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (inputs.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {inputs.map(input => {
        const selectedInput = convertToSelectedInput(input);
        const isSelected = isInputSelected(input.id);

        return (
          <Card
            key={input.id}
            className={cn(
              'group relative transition-all duration-200 hover:shadow-md',
              isSelected && 'shadow-md ring-2 ring-blue-500',
              selectionMode && 'cursor-pointer'
            )}
          >
            {/* Selection Checkbox */}
            <InputSelectionCheckbox input={selectedInput} />

            <CardContent className="p-6">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{TYPE_ICONS[input.type]}</span>
                    <Badge
                      variant="secondary"
                      className={STATUS_COLORS[input.status]}
                    >
                      {input.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className={PRIORITY_COLORS[input.priority]}
                  >
                    {input.priority}
                  </Badge>
                </div>

                <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  <Link href={`/inputs/${input.id}`} className="stretched-link">
                    {input.title}
                  </Link>
                </h3>
              </div>

              {/* Description */}
              <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                {input.description}
              </p>

              {/* Metadata */}
              <div className="mb-4 space-y-2">
                {input.department && (
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="mr-1 h-3 w-3" />
                    {input.department}
                  </div>
                )}

                {input.issueType && (
                  <Badge variant="outline" className="text-xs">
                    {input.issueType}
                  </Badge>
                )}

                {input.rootCause && (
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-xs text-orange-700"
                  >
                    {input.rootCause}
                  </Badge>
                )}
              </div>

              {/* AI Tags */}
              {input.aiTags && input.aiConfidence && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-xs text-purple-700"
                    >
                      🤖 AI: {Math.round(input.aiConfidence)}%
                    </Badge>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{input._count.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{input._count.votes}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(input.createdAt)}</span>
                </div>
              </div>

              {/* Creator */}
              {input.creator && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {input.creator.name || input.creator.email} •{' '}
                      {input.creator.role}
                    </span>
                    {input.creator.department && (
                      <span>{input.creator.department}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions (when not in selection mode) */}
              {!selectionMode && (
                <div className="mt-4 flex justify-end">
                  <Link href={`/inputs/${input.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
