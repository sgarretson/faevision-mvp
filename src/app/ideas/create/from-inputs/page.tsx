'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Lightbulb,
  Target,
  AlertCircle,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Manual Idea Creation from Strategic Inputs
 *
 * Executive workflow for creating ideas from selected strategic inputs:
 * - Display selected inputs with context
 * - AI-assisted idea generation from input patterns
 * - Manual idea creation with preserved context
 * - Executive approval workflow integration
 *
 * Expert: Dr. Priya Patel (AI Architect)
 * Support: Alex Thompson (Lead Developer), Maya Rodriguez (UX Expert)
 */

interface StrategicInput {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  department: string;
  type: string;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface AIAnalysis {
  suggestedTitle: string;
  suggestedDescription: string;
  commonThemes: string[];
  priorityRecommendation: string;
  confidenceScore: number;
}

function CreateIdeaFromInputsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedInputs, setSelectedInputs] = useState<StrategicInput[]>([]);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const inputIds = useMemo(
    () => searchParams.get('from_inputs')?.split(',') || [],
    [searchParams]
  );

  const fetchSelectedInputs = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/inputs/bulk?ids=${inputIds.join(',')}`
      );
      const data = await response.json();

      if (response.ok) {
        setSelectedInputs(data.inputs);
        // Trigger AI analysis once inputs are loaded
        analyzeInputsWithAI(data.inputs);
      } else {
        setError(data.error || 'Failed to fetch inputs');
      }
    } catch (error) {
      console.error('Fetch inputs error:', error);
      setError('Failed to load selected inputs');
    }
  }, [inputIds]);

  useEffect(() => {
    if (inputIds.length > 0) {
      fetchSelectedInputs();
    }
  }, [inputIds, fetchSelectedInputs]);

  const analyzeInputsWithAI = async (inputs: StrategicInput[]) => {
    if (inputs.length === 0) return;

    try {
      setIsAnalyzing(true);

      const response = await fetch('/api/ai/analyze-inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: inputs.map(input => ({
            id: input.id,
            title: input.title,
            description: input.description,
            type: input.type,
            priority: input.priority,
            department: input.department,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiAnalysis(data.analysis);
        // Pre-populate form with AI suggestions
        setIdeaTitle(data.analysis.suggestedTitle);
        setIdeaDescription(data.analysis.suggestedDescription);
      } else {
        console.error('AI analysis failed:', data.error);
        // Continue without AI assistance
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      // Continue without AI assistance
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateIdea = async () => {
    if (!ideaTitle.trim() || !ideaDescription.trim() || isCreating) return;

    try {
      setIsCreating(true);
      setError('');

      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaTitle.trim(),
          description: ideaDescription.trim(),
          sourceInputIds: selectedInputs.map(input => input.id),
          priority: aiAnalysis?.priorityRecommendation || 'medium',
          status: 'draft', // Start as draft for executive review
          origin: 'manual_creation',
          aiAssisted: !!aiAnalysis,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/ideas/${data.idea.id}`);
      } else {
        setError(data.error || 'Failed to create idea');
      }
    } catch (error) {
      console.error('Create idea error:', error);
      setError('Failed to create idea');
    } finally {
      setIsCreating(false);
    }
  };

  if (inputIds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No strategic inputs selected. Please go back to the Strategic
              Inputs page and select inputs to create an idea.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href="/inputs">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Strategic Inputs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/inputs">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Strategic Inputs
            </Button>
          </Link>

          <div className="flex items-center space-x-3">
            <Lightbulb className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create Idea from Strategic Inputs
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Transform selected strategic inputs into an actionable idea
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Selected Inputs Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>
                    Selected Strategic Inputs ({selectedInputs.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedInputs.map(input => (
                  <div
                    key={input.id}
                    className="rounded-r-lg border-l-4 border-blue-200 bg-blue-50 p-4"
                  >
                    <h4 className="font-semibold text-gray-900">
                      {input.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {input.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {input.department}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {input.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Analysis Panel */}
            {(isAnalyzing || aiAnalysis) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span>AI Analysis</span>
                    {isAnalyzing && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyzing && (
                    <p className="text-gray-600">Analyzing input patterns...</p>
                  )}
                  {!isAnalyzing && aiAnalysis && (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Common Themes:
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {aiAnalysis.commonThemes.map(theme => (
                            <Badge
                              key={theme}
                              variant="outline"
                              className="text-xs"
                            >
                              {theme}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Recommended Priority:
                        </h4>
                        <Badge className="mt-1">
                          {aiAnalysis.priorityRecommendation}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Analysis Confidence:
                        </h4>
                        <div className="mt-1 flex items-center space-x-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-green-600"
                              style={{
                                width: `${aiAnalysis.confidenceScore}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {aiAnalysis.confidenceScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Idea Creation Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <span>New Idea Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Idea Title *
                  </label>
                  <Input
                    id="title"
                    value={ideaTitle}
                    onChange={e => setIdeaTitle(e.target.value)}
                    placeholder="Enter a compelling title for your idea..."
                    className="w-full"
                  />
                  {aiAnalysis && (
                    <p className="mt-1 text-xs text-purple-600">
                      <Sparkles className="mr-1 inline h-3 w-3" />
                      AI-suggested title (you can modify)
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Idea Description *
                  </label>
                  <Textarea
                    id="description"
                    value={ideaDescription}
                    onChange={e => setIdeaDescription(e.target.value)}
                    placeholder="Describe your idea in detail..."
                    rows={8}
                    className="w-full"
                  />
                  {aiAnalysis && (
                    <p className="mt-1 text-xs text-purple-600">
                      <Sparkles className="mr-1 inline h-3 w-3" />
                      AI-suggested description (you can modify)
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleCreateIdea}
                    disabled={
                      !ideaTitle.trim() || !ideaDescription.trim() || isCreating
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isCreating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating Idea...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Create Idea
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Next Steps:</strong> Your idea will be created in
                    draft status for executive review. You can then collaborate,
                    vote, and approve it before converting to a solution.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateIdeaFromInputsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-64 items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span className="text-lg text-gray-600">
                  Loading idea creation form...
                </span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CreateIdeaFromInputsContent />
    </Suspense>
  );
}
