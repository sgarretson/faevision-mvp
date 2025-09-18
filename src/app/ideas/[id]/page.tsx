'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  AlertCircle,
  User,
  Calendar,
  Lightbulb,
  Zap,
  Target,
} from 'lucide-react';
import { IdeaVoting } from '@/components/ideas/idea-voting';
import { IdeaApproval } from '@/components/ideas/idea-approval';
import { SupportingEvidenceDisplay } from '@/components/ideas/supporting-evidence-display';
import { EnhancedSolutionDialog } from '@/components/solutions/enhanced-solution-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface IdeaDetail {
  id: string;
  title: string;
  description: string;
  origin: 'ai' | 'human' | 'hybrid';
  status:
    | 'draft'
    | 'review'
    | 'approved'
    | 'developing'
    | 'implemented'
    | 'rejected';
  votes: number;
  confidence: number;
  evidenceJson?: any;
  tagsJson?: any;
  createdAt: string;
  hotspot?: {
    id: string;
    title: string;
    summary?: string;
    status: string;
  } | null;
  creator?: {
    id: string;
    name?: string;
    email: string;
    role: string;
  } | null;
  _count: {
    comments: number;
    upVotes: number;
    downVotes: number;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  createdBy?: {
    id: string;
    name?: string;
    email: string;
    role: string;
  } | null;
}

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  developing: 'bg-blue-100 text-blue-800',
  implemented: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
};

const ORIGIN_COLORS = {
  ai: 'bg-purple-100 text-purple-800',
  human: 'bg-blue-100 text-blue-800',
  hybrid: 'bg-indigo-100 text-indigo-800',
};

const ORIGIN_ICONS = {
  ai: '🤖',
  human: '👤',
  hybrid: '🧠',
};

function IdeaDetailPageComponent() {
  const { status } = useSession();
  const params = useParams();
  const ideaId = params.id as string;

  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeaDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/ideas/${ideaId}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            'Please log in to view idea details. Use any user email + password: demo123'
          );
        } else if (response.status === 404) {
          setError('Idea not found. Please check the URL and try again.');
        } else {
          setError(data.error || 'Failed to fetch idea details');
        }
        return;
      }

      setIdea(data.idea);
    } catch (error) {
      console.error('Fetch idea detail error:', error);
      setError(
        'Failed to load idea details. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [ideaId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/comments`);
      const data = await response.json();

      if (response.ok) {
        setComments(data.comments || []);
      } else if (response.status === 401) {
        // Don't set error for comments auth failure - idea error will handle it
        setComments([]);
      } else {
        console.warn('Comments fetch failed:', data.error);
        setComments([]);
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
      setComments([]);
    }
  }, [ideaId]);

  useEffect(() => {
    if (status === 'authenticated' && ideaId) {
      fetchIdeaDetail();
      fetchComments();
    } else if (status === 'unauthenticated') {
      setError(
        'Please log in to view idea details. Use any user email + password: demo123'
      );
      setIsLoading(false);
    }
  }, [status, ideaId, fetchIdeaDetail, fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);

      const response = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            'Please log in to post comments. Use any user email + password: demo123'
          );
        } else if (response.status === 404) {
          throw new Error('Idea not found. Cannot post comment.');
        } else {
          throw new Error(data.error || 'Failed to post comment');
        }
      }

      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Submit comment error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to post comment'
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

  // Handle loading authentication
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading idea details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Authentication Required
              </h2>
              <p className="mb-6 text-gray-600">
                Please log in to view idea details. Use any user email +
                password: demo123
              </p>
              <div className="flex justify-center gap-3">
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Go to Login
                  </Button>
                </Link>
                <Link href="/ideas">
                  <Button variant="outline">Back to Ideas</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-lg">
            <CardContent className="p-8 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Unable to Load Idea
              </h2>
              <p className="mb-6 text-gray-600">{error}</p>
              <div className="flex justify-center gap-3">
                {error.includes('log in') ? (
                  <Link href="/login">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Go to Login
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Try Again
                  </Button>
                )}
                <Link href="/ideas">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Ideas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/ideas">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Ideas
              </Button>
            </Link>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Idea not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/ideas">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Ideas
            </Button>
          </Link>
        </div>

        {/* Idea Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span
                  className="text-3xl"
                  aria-label={`${idea.origin || 'unknown'} origin`}
                >
                  {ORIGIN_ICONS[idea.origin as keyof typeof ORIGIN_ICONS] ||
                    '💡'}
                </span>
                <div>
                  <CardTitle className="text-2xl">
                    {idea.title || 'Untitled Idea'}
                  </CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      className={
                        STATUS_COLORS[
                          idea.status as keyof typeof STATUS_COLORS
                        ] || 'bg-gray-100 text-gray-800'
                      }
                    >
                      {(idea.status || 'draft').replace('_', ' ')}
                    </Badge>
                    <Badge
                      className={
                        ORIGIN_COLORS[
                          idea.origin as keyof typeof ORIGIN_COLORS
                        ] || 'bg-gray-100 text-gray-800'
                      }
                    >
                      {idea.origin || 'unknown'} generated
                    </Badge>
                    {idea.confidence && (
                      <Badge variant="outline">
                        {Math.round(idea.confidence * 100)}% confidence
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                {/* Voting Section */}
                <IdeaVoting
                  ideaId={idea.id}
                  initialVotes={{
                    up: idea._count.upVotes,
                    down: idea._count.downVotes,
                    total: idea._count.upVotes + idea._count.downVotes,
                  }}
                />

                {/* Enhanced Solution Creation - Only show if approved */}
                {idea.status === 'approved' && (
                  <EnhancedSolutionDialog
                    idea={{
                      id: idea.id,
                      title: idea.title,
                      description: idea.description,
                      origin: idea.origin,
                      status: idea.status,
                      evidenceJson: idea.evidenceJson,
                      tagsJson: idea.tagsJson,
                      hotspot: idea.hotspot
                        ? {
                            id: idea.hotspot.id,
                            title: idea.hotspot.title,
                            summary: idea.hotspot.summary || '',
                          }
                        : undefined,
                    }}
                    onSolutionCreated={solutionId => {
                      console.log(`Solution created: ${solutionId}`);
                    }}
                  />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Description
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-gray-700">
                  {idea.description || 'No description available'}
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* Hotspot Link */}
              {idea.hotspot && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Related Hotspot
                  </h3>
                  <div className="mt-2">
                    <Link href={`/hotspots/${idea.hotspot.id}`}>
                      <Card className="cursor-pointer transition-shadow hover:shadow-md">
                        <CardContent className="pt-4">
                          <div className="flex items-center space-x-3">
                            <Zap className="h-5 w-5 text-orange-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {idea.hotspot.title}
                              </p>
                              <p className="text-sm text-gray-600">
                                Status: {idea.hotspot.status}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>
              )}

              <hr className="border-gray-200" />

              {/* Approval Workflow */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Approval Status
                </h3>
                <div className="mt-2">
                  <IdeaApproval
                    ideaId={idea.id}
                    currentStatus={
                      (idea.status || 'draft') as
                        | 'draft'
                        | 'review'
                        | 'approved'
                        | 'rejected'
                    }
                    votes={{
                      up: idea._count.upVotes,
                      down: idea._count.downVotes,
                      total: idea._count.upVotes + idea._count.downVotes,
                    }}
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Metadata */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Created by{' '}
                    {idea.creator?.name || idea.creator?.email || 'AI System'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formatDate(idea.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {idea.origin || 'unknown'} origin
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {idea.votes} total votes
                  </span>
                </div>
              </div>

              {/* Supporting Evidence */}
              {idea.evidenceJson && (
                <>
                  <hr className="border-gray-200" />
                  <SupportingEvidenceDisplay evidenceJson={idea.evidenceJson} />
                </>
              )}

              {/* Tags */}
              {idea.tagsJson && (
                <>
                  <hr className="border-gray-200" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tags
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.isArray(idea.tagsJson) && idea.tagsJson.length > 0
                        ? idea.tagsJson.map((tag: string) => (
                            <Badge key={`tag-${tag}`} variant="outline">
                              {tag}
                            </Badge>
                          ))
                        : idea.tagsJson && (
                            <Badge variant="outline">
                              {String(idea.tagsJson)}
                            </Badge>
                          )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Comments ({comments?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts on this idea..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {!comments || comments.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment: any) => (
                    <div key={comment.id} className="rounded-lg bg-gray-50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
                            <span className="text-sm font-medium text-white">
                              {(comment.createdBy?.name ||
                                comment.createdBy?.email ||
                                'U')[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {comment.createdBy?.name ||
                                comment.createdBy?.email ||
                                'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="whitespace-pre-wrap text-gray-700">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Error-Boundary Wrapped Ideas Detail Page
 * **ALEX THOMPSON + MAYA RODRIGUEZ**: Executive-grade error handling
 */
export default function IdeaDetailPage() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to monitoring service
        console.error('Ideas Detail Page Error:', error, errorInfo);

        // Could send to Sentry or similar service
        if (process.env.NODE_ENV === 'production') {
          // Analytics tracking for production errors
          console.error('Production Ideas error:', {
            page: 'idea-detail',
            error: error.message,
            stack: error.stack,
          });
        }
      }}
    >
      <IdeaDetailPageComponent />
    </ErrorBoundary>
  );
}
