/**
 * Enhanced Solution Creation Dialog
 *
 * AI-powered dialog for converting ideas into comprehensive solutions.
 * Features business planning, risk assessment, and resource estimation.
 *
 * Expert: Dr. Priya Patel (AI Architect)
 * Support: Jordan Lee (Cursor Expert), Alex Thompson (Lead Developer)
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Target,
  Brain,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Users,
  Lightbulb,
  TrendingUp,
  Shield,
} from 'lucide-react';

interface Idea {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly origin: 'ai' | 'human' | 'hybrid';
  readonly status: string;
  readonly evidenceJson?: any;
  readonly tagsJson?: any;
  readonly hotspot?: {
    readonly id: string;
    readonly title: string;
    readonly summary: string;
  };
}

interface EnhancedSolutionDialogProps {
  readonly idea: Idea;
  readonly trigger?: React.ReactNode;
  readonly onSolutionCreated?: (solutionId: string) => void;
}

interface SolutionPlan {
  readonly solution: {
    readonly title: string;
    readonly description: string;
    readonly businessValue: string;
    readonly estimatedEffort: string;
    readonly priority: string;
    readonly targetDate?: string;
  };
  readonly businessImpact: {
    readonly expectedOutcome: string;
    readonly roiProjection: string;
    readonly successMetrics: readonly string[];
    readonly stakeholderImpact: readonly string[];
  };
  readonly riskAssessment: {
    readonly identifiedRisks: readonly string[];
    readonly mitigationStrategies: readonly string[];
    readonly riskLevel: string;
    readonly contingencyPlans: readonly string[];
  };
  readonly resourcePlanning: {
    readonly requiredSkills: readonly string[];
    readonly estimatedTeamSize: string;
    readonly budgetEstimate: string;
    readonly timelineEstimate: string;
    readonly dependencies: readonly string[];
  };
  readonly implementationPlan: {
    readonly phases: readonly any[];
    readonly tasks: readonly any[];
    readonly milestones: readonly any[];
  };
  readonly executiveRecommendations: readonly string[];
  readonly confidence: number;
}

const EFFORT_COLORS = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  VERY_HIGH: 'bg-red-100 text-red-800',
};

const PRIORITY_COLORS = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-purple-100 text-purple-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

const RISK_COLORS = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

export function EnhancedSolutionDialog({
  idea,
  trigger,
  onSolutionCreated,
}: EnhancedSolutionDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [customRequirements, setCustomRequirements] = useState('');
  const [aiPlan, setAiPlan] = useState<SolutionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/solutions/from-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: idea.id,
          customRequirements: customRequirements.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate solution plan');
      }

      setAiPlan(data.aiPlan);
    } catch (error) {
      console.error('Error generating solution plan:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to generate plan'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateSolution = async () => {
    if (!aiPlan) return;

    try {
      setIsCreating(true);
      setError(null);

      const response = await fetch('/api/solutions/from-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: idea.id,
          customRequirements: customRequirements.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create solution');
      }

      // Close dialog and redirect
      setIsOpen(false);
      onSolutionCreated?.(data.solution.id);
      router.push(`/solutions/${data.solution.id}`);
    } catch (error) {
      console.error('Error creating solution:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to create solution'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleReset = () => {
    setAiPlan(null);
    setCustomRequirements('');
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Target className="mr-2 h-4 w-4" />
            Create Solution
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI-Powered Solution Creation</span>
          </DialogTitle>
          <DialogDescription>
            Convert "{idea.title}" into a comprehensive solution with AI
            assistance for business planning, risk assessment, and resource
            estimation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Idea Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Lightbulb className="h-4 w-4" />
                <span>Source Idea</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {idea.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{idea.origin} origin</Badge>
                  <Badge variant="outline">{idea.status}</Badge>
                  {idea.hotspot && (
                    <Badge variant="outline">
                      Hotspot: {idea.hotspot.title}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Additional Requirements (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customRequirements}
                onChange={e => setCustomRequirements(e.target.value)}
                placeholder="Specify any additional requirements, constraints, or considerations for the solution..."
                rows={3}
                disabled={isGenerating || isCreating}
              />
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* AI Plan Display */}
          {aiPlan && (
            <div className="space-y-4">
              {/* Solution Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Solution Overview</span>
                    <Badge variant="outline">
                      {Math.round(aiPlan.confidence * 100)}% confidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {aiPlan.solution.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {aiPlan.solution.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className={
                          EFFORT_COLORS[
                            aiPlan.solution
                              .estimatedEffort as keyof typeof EFFORT_COLORS
                          ]
                        }
                      >
                        {aiPlan.solution.estimatedEffort} Effort
                      </Badge>
                      <Badge
                        className={
                          PRIORITY_COLORS[
                            aiPlan.solution
                              .priority as keyof typeof PRIORITY_COLORS
                          ]
                        }
                      >
                        {aiPlan.solution.priority} Priority
                      </Badge>
                      <Badge variant="outline">
                        Value: {aiPlan.solution.businessValue}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Business Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-900">
                        Expected Outcome
                      </h5>
                      <p className="text-sm text-gray-600">
                        {aiPlan.businessImpact.expectedOutcome}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">
                        ROI Projection
                      </h5>
                      <p className="text-sm text-gray-600">
                        {aiPlan.businessImpact.roiProjection}
                      </p>
                    </div>
                    {aiPlan.businessImpact.successMetrics.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Success Metrics
                        </h5>
                        <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                          {aiPlan.businessImpact.successMetrics.map(
                            (metric: string, index: number) => (
                              <li key={`metric-${index}`}>{metric}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Risk Assessment</span>
                    <Badge
                      className={
                        RISK_COLORS[
                          aiPlan.riskAssessment
                            .riskLevel as keyof typeof RISK_COLORS
                        ]
                      }
                    >
                      {aiPlan.riskAssessment.riskLevel} Risk
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h5 className="font-medium text-gray-900">
                        Identified Risks
                      </h5>
                      <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                        {aiPlan.riskAssessment.identifiedRisks.map(
                          (risk: string, index: number) => (
                            <li key={`risk-${index}`}>{risk}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">
                        Mitigation Strategies
                      </h5>
                      <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                        {aiPlan.riskAssessment.mitigationStrategies.map(
                          (strategy: string, index: number) => (
                            <li key={`strategy-${index}`}>{strategy}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Planning */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Resource Planning</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-900">Team Size</h5>
                        <p className="text-sm text-gray-600">
                          {aiPlan.resourcePlanning.estimatedTeamSize}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">Timeline</h5>
                        <p className="text-sm text-gray-600">
                          {aiPlan.resourcePlanning.timelineEstimate}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Budget Estimate
                        </h5>
                        <p className="text-sm text-gray-600">
                          {aiPlan.resourcePlanning.budgetEstimate}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Required Skills
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {aiPlan.resourcePlanning.requiredSkills.map(
                            (skill: string, index: number) => (
                              <Badge
                                key={`skill-${index}`}
                                variant="outline"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Executive Recommendations */}
              {aiPlan.executiveRecommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Executive Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                      {aiPlan.executiveRecommendations.map(
                        (recommendation: string, index: number) => (
                          <li key={`recommendation-${index}`}>
                            {recommendation}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            {!aiPlan ? (
              <div className="flex w-full space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate AI Plan
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex w-full space-x-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isCreating}
                >
                  Regenerate Plan
                </Button>
                <Button
                  onClick={handleCreateSolution}
                  disabled={isCreating}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Solution...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Create Solution
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
