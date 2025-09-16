'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, Plus, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const solutionSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  impact: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  estimatedHours: z.number().positive().optional(),
  targetDate: z.string().optional(),
  inputIds: z.array(z.string()).optional(),
});

type SolutionFormData = z.infer<typeof solutionSchema>;

interface SolutionFormProps {
  onSuccess?: () => void;
}

interface InputOption {
  id: string;
  title: string;
  type: string;
  priority: string;
  department?: string;
}

export function SolutionForm({ onSuccess }: SolutionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [availableInputs, setAvailableInputs] = useState<InputOption[]>([]);
  const [selectedInputs, setSelectedInputs] = useState<InputOption[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SolutionFormData>({
    resolver: zodResolver(solutionSchema),
    defaultValues: {
      priority: 'MEDIUM',
      impact: 'MEDIUM',
      inputIds: [],
    },
  });

  const watchedPriority = watch('priority');
  const watchedImpact = watch('impact');

  const fetchSpecificInput = useCallback(
    async (inputId: string) => {
      try {
        const input = availableInputs.find(i => i.id === inputId);
        if (input) {
          setSelectedInputs([input]);
          setValue('inputIds', [inputId]);
        }
      } catch (error) {
        console.error('Failed to fetch specific input:', error);
      }
    },
    [availableInputs, setValue]
  );

  // Load available inputs on mount
  useEffect(() => {
    fetchAvailableInputs();

    // Check if we're creating a solution from a specific input
    const inputId = searchParams.get('inputId');
    if (inputId) {
      fetchSpecificInput(inputId);
    }
  }, [searchParams, fetchSpecificInput]);

  const fetchAvailableInputs = async () => {
    try {
      const response = await fetch('/api/inputs?limit=100');
      const data = await response.json();

      if (response.ok) {
        setAvailableInputs(data.inputs || []);
      }
    } catch (error) {
      console.error('Failed to fetch inputs:', error);
    }
  };

  const addInput = (input: InputOption) => {
    if (!selectedInputs.find(i => i.id === input.id)) {
      const newSelected = [...selectedInputs, input];
      setSelectedInputs(newSelected);
      setValue(
        'inputIds',
        newSelected.map(i => i.id)
      );
    }
  };

  const removeInput = (inputId: string) => {
    const newSelected = selectedInputs.filter(i => i.id !== inputId);
    setSelectedInputs(newSelected);
    setValue(
      'inputIds',
      newSelected.map(i => i.id)
    );
  };

  const onSubmit = async (data: SolutionFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/solutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          inputIds: selectedInputs.map(i => i.id),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to create solution');
        return;
      }

      setSuccess(true);

      // Redirect to solutions list after success
      setTimeout(() => {
        router.push('/solutions');
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error('Solution creation error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">
              Solution Created Successfully!
            </span>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            Your solution has been created and is ready for task breakdown and
            execution.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Create Strategic Solution
        </CardTitle>
        <CardDescription>
          Transform strategic inputs into actionable solutions with clear
          execution plans and measurable outcomes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Solution Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Clear, actionable solution title"
              className="text-lg"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Solution Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Detailed description of the solution, approach, and expected outcomes..."
              rows={6}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Connected Strategic Inputs */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
              Connected Strategic Inputs
            </h3>

            {/* Selected Inputs */}
            {selectedInputs.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Selected Inputs:
                </p>
                <div className="space-y-2">
                  {selectedInputs.map(input => (
                    <div
                      key={input.id}
                      className="flex items-center justify-between rounded-lg bg-blue-50 p-3"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {input.title}
                        </h4>
                        <div className="mt-1 flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {input.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {input.priority}
                          </Badge>
                          {input.department && (
                            <Badge variant="outline" className="text-xs">
                              {input.department}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInput(input.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Inputs */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Available Inputs:
              </p>
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {availableInputs
                  .filter(input => !selectedInputs.find(s => s.id === input.id))
                  .map(input => (
                    <div
                      key={input.id}
                      className="flex items-center justify-between rounded p-2 hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {input.title}
                        </h4>
                        <div className="mt-1 flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {input.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {input.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addInput(input)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Solution Properties */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">
              Solution Properties
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Priority Level
                </label>
                <select
                  value={watchedPriority}
                  onChange={e =>
                    setValue(
                      'priority',
                      e.target.value as 'LOW' | 'MEDIUM' | 'HIGH'
                    )
                  }
                  className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <option value="LOW">Low - Minor organizational impact</option>
                  <option value="MEDIUM">
                    Medium - Moderate organizational impact
                  </option>
                  <option value="HIGH">
                    High - Significant organizational impact
                  </option>
                </select>
              </div>

              {/* Impact */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Expected Impact
                </label>
                <select
                  value={watchedImpact}
                  onChange={e =>
                    setValue(
                      'impact',
                      e.target.value as 'LOW' | 'MEDIUM' | 'HIGH'
                    )
                  }
                  className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <option value="LOW">Low - Incremental improvement</option>
                  <option value="MEDIUM">
                    Medium - Measurable improvement
                  </option>
                  <option value="HIGH">High - Transformational change</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Estimated Hours */}
              <div className="space-y-2">
                <label
                  htmlFor="estimatedHours"
                  className="text-sm font-medium text-gray-700"
                >
                  Estimated Hours (Optional)
                </label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="1"
                  step="1"
                  {...register('estimatedHours', { valueAsNumber: true })}
                  placeholder="e.g., 40"
                />
                {errors.estimatedHours && (
                  <p className="text-sm text-red-600">
                    {errors.estimatedHours.message}
                  </p>
                )}
              </div>

              {/* Target Date */}
              <div className="space-y-2">
                <label
                  htmlFor="targetDate"
                  className="text-sm font-medium text-gray-700"
                >
                  Target Completion Date (Optional)
                </label>
                <Input
                  id="targetDate"
                  type="date"
                  {...register('targetDate')}
                />
                {errors.targetDate && (
                  <p className="text-sm text-red-600">
                    {errors.targetDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating Solution...' : 'Create Solution'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
