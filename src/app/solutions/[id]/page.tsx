/**
 * Solution Detail Page
 *
 * Comprehensive solution management interface with progress tracking,
 * task management, timeline visualization, and executive oversight.
 *
 * Expert: Alex Thompson (Lead Developer)
 * Support: Maya Rodriguez (UX Expert), David Chen (Visual Designer)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Edit,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  Lightbulb,
  Shield,
  DollarSign,
  Zap,
  Brain,
} from 'lucide-react';

interface SolutionDetail {
  id: string;
  title: string;
  description: string;
  status:
    | 'DRAFT'
    | 'PLANNING'
    | 'ACTIVE'
    | 'ON_HOLD'
    | 'COMPLETED'
    | 'CANCELLED';
  progress: number;
  estimatedEffort?: string;
  businessValue?: string;
  targetDate?: string;
  successMetrics?: string[];
  expectedImpactJson?: any;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
  };
  idea?: {
    id: string;
    title: string;
    description: string;
    origin: 'ai' | 'human' | 'hybrid';
    evidenceJson?: any;
  };
  hotspot?: {
    id: string;
    title: string;
    summary: string;
    confidence: number;
    _count: {
      signals: number;
    };
  };
  initiative?: {
    id: string;
    name: string;
    description: string;
  };
  _count: {
    comments: number;
    tasks: number;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PLANNING: 'bg-purple-100 text-purple-800',
  ACTIVE: 'bg-blue-100 text-blue-800',
  ON_HOLD: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUS_ICONS = {
  DRAFT: '📝',
  PLANNING: '🎯',
  ACTIVE: '🚀',
  ON_HOLD: '⏸️',
  COMPLETED: '✅',
  CANCELLED: '❌',
};

const EFFORT_COLORS = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  VERY_HIGH: 'bg-red-100 text-red-800',
};

const RISK_COLORS = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

export default function SolutionDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const solutionId = params.id as string;

  const [solution, setSolution] = useState<SolutionDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSolutionDetail = useCallback(async () => {
    if (status !== 'authenticated' || !solutionId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [solutionResponse, commentsResponse] = await Promise.all([
        fetch(`/api/solutions/${solutionId}`),
        fetch(`/api/solutions/${solutionId}/comments`),
      ]);

      if (!solutionResponse.ok) {
        const errorData = await solutionResponse.json();
        throw new Error(errorData.error || 'Failed to fetch solution');
      }

      const solutionData = await solutionResponse.json();
      setSolution(solutionData.solution);

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        setComments(commentsData.comments || []);
      }
    } catch (error) {
      console.error('Fetch solution error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to load solution'
      );
    } finally {
      setIsLoading(false);
    }
  }, [solutionId, status]);

  useEffect(() => {
    fetchSolutionDetail();
  }, [fetchSolutionDetail]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session?.user?.id || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);

      const response = await fetch(`/api/solutions/${solutionId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          createdBy: session.user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit comment');
      }

      // Add new comment to list
      setComments(prev => [data.comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Submit comment error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to submit comment'
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  // Handle loading authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading solution...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Solution not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const aiPlan = solution.expectedImpactJson;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Link
              href="/solutions"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Solutions
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <span className="text-3xl" aria-label={solution.status}>
                      {STATUS_ICONS[solution.status]}
                    </span>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {solution.title}
                      </h1>
                      <p className="mt-2 text-gray-600">
                        {solution.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className={STATUS_COLORS[solution.status]}>
                      {solution.status}
                    </Badge>
                    {solution.estimatedEffort && (
                      <Badge
                        className={
                          EFFORT_COLORS[
                            solution.estimatedEffort as keyof typeof EFFORT_COLORS
                          ]
                        }
                      >
                        {solution.estimatedEffort} Effort
                      </Badge>
                    )}
                    {solution.businessValue && (
                      <Badge variant="outline">
                        <DollarSign className="mr-1 h-3 w-3" />
                        {solution.businessValue}
                      </Badge>
                    )}
                    {solution.targetDate && (
                      <Badge variant="outline">
                        <Calendar className="mr-1 h-3 w-3" />
                        Due {formatDate(solution.targetDate)}
                      </Badge>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">
                        Progress: {Math.round(solution.progress)}%
                      </span>
                      <span className="text-gray-600">
                        {solution.status === 'COMPLETED'
                          ? 'Completed'
                          : solution.status === 'CANCELLED'
                            ? 'Cancelled'
                            : 'In Progress'}
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                          solution.progress
                        )}`}
                        style={{ width: `${solution.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-3 lg:ml-6 lg:mt-0">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  {solution.status === 'ACTIVE' ? (
                    <Button variant="outline" size="sm">
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  ) : solution.status === 'ON_HOLD' ? (
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                  ) : (
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Source Context */}
            {(solution.idea || solution.hotspot || solution.initiative) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5" />
                    <span>Source Context</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {solution.idea && (
                      <div className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              Source Idea: {solution.idea.title}
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              {solution.idea.description}
                            </p>
                            <Badge variant="outline" className="mt-2">
                              {solution.idea.origin} origin
                            </Badge>
                          </div>
                          <Link href={`/ideas/${solution.idea.id}`}>
                            <Button variant="outline" size="sm">
                              View Idea
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    {solution.hotspot && (
                      <div className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              Related Hotspot: {solution.hotspot.title}
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              {solution.hotspot.summary}
                            </p>
                            <div className="mt-2 flex space-x-2">
                              <Badge variant="outline">
                                {Math.round(solution.hotspot.confidence * 100)}%
                                confidence
                              </Badge>
                              <Badge variant="outline">
                                {solution.hotspot._count.signals} signals
                              </Badge>
                            </div>
                          </div>
                          <Link href={`/hotspots/${solution.hotspot.id}`}>
                            <Button variant="outline" size="sm">
                              View Hotspot
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    {solution.initiative && (
                      <div className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              Initiative: {solution.initiative.name}
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              {solution.initiative.description}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Initiative
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Business Plan */}
            {aiPlan && (
              <div className="space-y-6">
                {/* Business Impact */}
                {aiPlan.businessImpact && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Business Impact Assessment</span>
                        {aiPlan.aiConfidence && (
                          <Badge variant="outline">
                            {Math.round(aiPlan.aiConfidence * 100)}% AI
                            confidence
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiPlan.businessImpact.expectedOutcome && (
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Expected Outcome
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              {aiPlan.businessImpact.expectedOutcome}
                            </p>
                          </div>
                        )}

                        {aiPlan.businessImpact.roiProjection && (
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              ROI Projection
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              {aiPlan.businessImpact.roiProjection}
                            </p>
                          </div>
                        )}

                        {aiPlan.businessImpact.successMetrics?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Success Metrics
                            </h4>
                            <ul className="mt-2 space-y-1">
                              {aiPlan.businessImpact.successMetrics.map(
                                (metric: string, index: number) => (
                                  <li
                                    key={`success-metric-${index}-${metric.slice(0, 20)}`}
                                    className="flex items-start space-x-2 text-sm text-gray-600"
                                  >
                                    <CheckCircle className="mt-0.5 h-3 w-3 text-green-500" />
                                    <span>{metric}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {aiPlan.businessImpact.stakeholderImpact?.length >
                          0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Stakeholder Impact
                            </h4>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {aiPlan.businessImpact.stakeholderImpact.map(
                                (stakeholder: string, index: number) => (
                                  <Badge
                                    key={`stakeholder-${index}-${stakeholder.slice(0, 10)}`}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {stakeholder}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Risk Assessment */}
                {aiPlan.riskAssessment && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
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
                        {aiPlan.riskAssessment.identifiedRisks?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Identified Risks
                            </h4>
                            <ul className="mt-2 space-y-1">
                              {aiPlan.riskAssessment.identifiedRisks.map(
                                (risk: string, index: number) => (
                                  <li
                                    key={`risk-${index}-${risk.slice(0, 15)}`}
                                    className="flex items-start space-x-2 text-sm text-gray-600"
                                  >
                                    <AlertTriangle className="mt-0.5 h-3 w-3 text-orange-500" />
                                    <span>{risk}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {aiPlan.riskAssessment.mitigationStrategies?.length >
                          0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Mitigation Strategies
                            </h4>
                            <ul className="mt-2 space-y-1">
                              {aiPlan.riskAssessment.mitigationStrategies.map(
                                (strategy: string, index: number) => (
                                  <li
                                    key={`strategy-${index}-${strategy.slice(0, 15)}`}
                                    className="flex items-start space-x-2 text-sm text-gray-600"
                                  >
                                    <CheckCircle className="mt-0.5 h-3 w-3 text-green-500" />
                                    <span>{strategy}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Resource Planning */}
                {aiPlan.resourcePlanning && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Resource Planning</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          {aiPlan.resourcePlanning.estimatedTeamSize && (
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Team Size
                              </h4>
                              <p className="text-sm text-gray-600">
                                {aiPlan.resourcePlanning.estimatedTeamSize}
                              </p>
                            </div>
                          )}

                          {aiPlan.resourcePlanning.timelineEstimate && (
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Timeline
                              </h4>
                              <p className="text-sm text-gray-600">
                                {aiPlan.resourcePlanning.timelineEstimate}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          {aiPlan.resourcePlanning.budgetEstimate && (
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Budget Estimate
                              </h4>
                              <p className="text-sm text-gray-600">
                                {aiPlan.resourcePlanning.budgetEstimate}
                              </p>
                            </div>
                          )}

                          {aiPlan.resourcePlanning.requiredSkills?.length >
                            0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Required Skills
                              </h4>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {aiPlan.resourcePlanning.requiredSkills.map(
                                  (skill: string, index: number) => (
                                    <Badge
                                      key={`skill-${index}-${skill.slice(0, 10)}`}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Executive Recommendations */}
                {aiPlan.executiveRecommendations?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="h-5 w-5" />
                        <span>Executive Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {aiPlan.executiveRecommendations.map(
                          (recommendation: string, index: number) => (
                            <li
                              key={`recommendation-${index}-${recommendation.slice(0, 20)}`}
                              className="flex items-start space-x-2 text-sm text-gray-600"
                            >
                              <Zap className="mt-0.5 h-3 w-3 text-purple-500" />
                              <span>{recommendation}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Success Metrics */}
            {solution.successMetrics && solution.successMetrics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Success Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {solution.successMetrics.map((metric, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-sm"
                      >
                        <CheckCircle className="mt-0.5 h-3 w-3 text-green-500" />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Comments ({comments.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add Comment Form */}
                  <form onSubmit={handleSubmitComment}>
                    <div className="space-y-3">
                      <Textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Add a comment or update..."
                        rows={3}
                        disabled={isSubmittingComment}
                      />
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={!newComment.trim() || isSubmittingComment}
                          size="sm"
                        >
                          {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                        </Button>
                      </div>
                    </div>
                  </form>

                  {/* Comments List */}
                  {comments.length === 0 ? (
                    <p className="py-8 text-center text-gray-600">
                      No comments yet. Be the first to add one!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {comments.map(comment => (
                        <div
                          key={comment.id}
                          className="rounded-lg border bg-gray-50 p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 text-sm">
                                <span className="font-medium text-gray-900">
                                  {comment.creator.name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {comment.creator.role}
                                </Badge>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-600">
                                  {formatTimeAgo(comment.createdAt)}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-gray-700">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Solution Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Solution Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Created
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {formatDate(solution.createdAt)}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Last Updated
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {formatDate(solution.updatedAt)}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Created By
                    </h4>
                    <div className="mt-1">
                      <p className="text-sm text-gray-900">
                        {solution.creator.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {solution.creator.role}
                        {solution.creator.department &&
                          ` • ${solution.creator.department}`}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Activity
                    </h4>
                    <div className="mt-1 space-y-1 text-sm text-gray-600">
                      <p>{solution._count.comments} comments</p>
                      <p>{solution._count.tasks || 0} tasks</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Assign Team
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Review
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
