/**
 * Manual Idea Form Component
 *
 * Executive-friendly form for creating strategic ideas manually.
 * Features AI enhancement suggestions and comprehensive validation.
 *
 * Expert: Maya Rodriguez (UX Expert)
 * Support: Alex Thompson (Lead Developer), David Chen (Visual Designer)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Lightbulb, Loader2, Plus, X, Info } from 'lucide-react';

// Form validation schema
const manualIdeaSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),
  ideaType: z.enum(['problem', 'opportunity', 'innovation', 'improvement']),
  department: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  businessImpact: z
    .string()
    .min(5, 'Please describe the business impact')
    .max(500, 'Business impact too long'),
  successMetrics: z.string().optional(),
  stakeholders: z.string().optional(),
  timeline: z.string().optional(),
  resources: z.string().optional(),
});

type ManualIdeaFormData = z.infer<typeof manualIdeaSchema>;

interface ManualIdeaFormProps {
  readonly onSubmissionStart: () => void;
  readonly onSubmissionError: (error: string) => void;
  readonly onIdeaCreated: (ideaId: string) => void;
  readonly isSubmitting: boolean;
}

interface AISuggestion {
  readonly type: 'tag' | 'category' | 'similar' | 'enhancement';
  readonly content: string;
  readonly confidence: number;
}

export function ManualIdeaForm({
  onSubmissionStart,
  onSubmissionError,
  onIdeaCreated,
  isSubmitting,
}: ManualIdeaFormProps) {
  const { data: session } = useSession();
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ManualIdeaFormData>({
    resolver: zodResolver(manualIdeaSchema),
    mode: 'onChange',
  });

  const watchedTitle = watch('title', '');
  const watchedDescription = watch('description', '');

  // AI Enhancement - Get suggestions based on title and description
  const getAISuggestions = useCallback(
    async (title: string, description: string) => {
      if (!title.trim() || title.length < 10) return;

      try {
        setIsLoadingAI(true);
        const response = await fetch('/api/ideas/ai-suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            type: 'manual_idea_creation',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAiSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error('Error getting AI suggestions:', error);
      } finally {
        setIsLoadingAI(false);
      }
    },
    []
  );

  // Debounced AI suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (watchedTitle && watchedDescription) {
        getAISuggestions(watchedTitle, watchedDescription);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [watchedTitle, watchedDescription, getAISuggestions]);

  const handleAddTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCustomTags(customTags.filter((tag: string) => tag !== tagToRemove));
  };

  const onSubmit = async (data: ManualIdeaFormData) => {
    try {
      onSubmissionStart();

      if (!session?.user?.id) {
        onSubmissionError('Authentication required');
        return;
      }

      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          origin: 'human',
          evidenceJson: {
            ideaType: data.ideaType,
            businessImpact: data.businessImpact,
            successMetrics: data.successMetrics,
            stakeholders: data.stakeholders
              ? data.stakeholders.split(',').map((s: string) => s.trim())
              : [],
            timeline: data.timeline,
            resources: data.resources,
            customTags,
            aiSuggestions: aiSuggestions.map((suggestion: AISuggestion) => ({
              type: suggestion.type,
              content: suggestion.content,
              confidence: suggestion.confidence,
            })),
          },
          tagsJson: [...customTags],
          createdBy: session.user.id,
          priority: data.priority,
          department: data.department,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        onSubmissionError(result.error || 'Failed to create idea');
        return;
      }

      onIdeaCreated(result.idea.id);
    } catch (error) {
      console.error('Error creating idea:', error);
      onSubmissionError('Failed to create idea. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-900"
          >
            Idea Title *
          </label>
          <Input
            {...register('title')}
            placeholder="Enter a clear, concise title for your strategic idea..."
            className="mt-1"
            autoFocus
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-900"
          >
            Detailed Description *
          </label>
          <Textarea
            {...register('description')}
            placeholder="Provide a comprehensive description of your idea, including context, rationale, and expected outcomes..."
            rows={6}
            className="mt-1"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ideaType"
              className="block text-sm font-medium text-gray-900"
            >
              Idea Type *
            </label>
            <select
              {...register('ideaType')}
              id="ideaType"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">Select type...</option>
              <option value="problem">Problem to Solve</option>
              <option value="opportunity">Business Opportunity</option>
              <option value="innovation">Innovation Initiative</option>
              <option value="improvement">Process Improvement</option>
            </select>
            {errors.ideaType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ideaType.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-900"
            >
              Priority Level *
            </label>
            <select
              {...register('priority')}
              id="priority"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">Select priority...</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">
                {errors.priority.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-900"
          >
            Primary Department
          </label>
          <Input
            {...register('department')}
            placeholder="e.g., Engineering, Marketing, Operations..."
            className="mt-1"
          />
        </div>
      </div>

      {/* Business Context */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Business Context
        </h3>

        <div>
          <label
            htmlFor="businessImpact"
            className="block text-sm font-medium text-gray-900"
          >
            Expected Business Impact *
          </label>
          <Textarea
            {...register('businessImpact')}
            placeholder="Describe the expected business impact, benefits, and value creation..."
            rows={4}
            className="mt-1"
          />
          {errors.businessImpact && (
            <p className="mt-1 text-sm text-red-600">
              {errors.businessImpact.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="successMetrics"
              className="block text-sm font-medium text-gray-900"
            >
              Success Metrics
            </label>
            <Textarea
              {...register('successMetrics')}
              placeholder="How will success be measured? KPIs, metrics, outcomes..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="timeline"
              className="block text-sm font-medium text-gray-900"
            >
              Estimated Timeline
            </label>
            <Input
              {...register('timeline')}
              placeholder="e.g., 3-6 months, Q2 2024..."
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="stakeholders"
            className="block text-sm font-medium text-gray-900"
          >
            Key Stakeholders
          </label>
          <Input
            {...register('stakeholders')}
            placeholder="Comma-separated list of departments, teams, or individuals..."
            className="mt-1"
          />
        </div>

        <div>
          <label
            htmlFor="resources"
            className="block text-sm font-medium text-gray-900"
          >
            Required Resources
          </label>
          <Textarea
            {...register('resources')}
            placeholder="Personnel, budget, technology, or other resources needed..."
            rows={3}
            className="mt-1"
          />
        </div>
      </div>

      {/* Custom Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Tags & Categorization
        </h3>

        <div>
          <label
            htmlFor="customTags"
            className="block text-sm font-medium text-gray-900"
          >
            Custom Tags
          </label>
          <div className="mt-1 flex space-x-2">
            <Input
              id="customTags"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Add custom tags..."
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {customTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {customTags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestions */}
      {(aiSuggestions.length > 0 || isLoadingAI) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>AI Enhancement Suggestions</span>
              {isLoadingAI && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAI ? (
              <div className="py-4 text-center text-gray-600">
                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                <p className="mt-2">
                  Analyzing your idea for enhancement suggestions...
                </p>
              </div>
            ) : aiSuggestions.length > 0 ? (
              <div className="space-y-3">
                {aiSuggestions.map(
                  (suggestion: AISuggestion, index: number) => (
                    <Alert
                      key={`suggestion-${suggestion.type}-${index}`}
                      className="border-purple-200 bg-purple-50"
                    >
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-start justify-between">
                          <div>
                            <strong className="capitalize">
                              {suggestion.type}:
                            </strong>{' '}
                            {suggestion.content}
                          </div>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {Math.round(suggestion.confidence * 100)}%
                            confidence
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-600">
                Continue writing your idea description to receive AI enhancement
                suggestions.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Idea...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4" />
              Create Strategic Idea
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
