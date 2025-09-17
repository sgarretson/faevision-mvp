'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  AlertCircle,
  User,
  Calendar,
  Tag,
  Building,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VoteButtons } from '@/components/inputs/vote-buttons';
import { AIInsightsPanel } from '@/components/ai/ai-insights-panel';

interface InputDetail {
  id: string;
  title: string;
  description: string;
  type: 'PROBLEM' | 'OPPORTUNITY' | 'GENERAL';
  status: 'NEW' | 'DISCUSSING' | 'ORGANIZED' | 'IN_SOLUTION' | 'ARCHIVED';
  department?: string;
  issueType?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
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

export default function InputDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const inputId = params.id as string;

  const [input, setInput] = useState<InputDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInputDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/inputs/${inputId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch input details');
        return;
      }

      setInput(data.input);
    } catch (error) {
      console.error('Fetch input detail error:', error);
      setError('Failed to load input details');
    } finally {
      setIsLoading(false);
    }
  }, [inputId]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/inputs/${inputId}/comments`);
      const data = await response.json();

      if (response.ok) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
    }
  }, [inputId]);

  useEffect(() => {
    if (status === 'authenticated' && inputId) {
      fetchInputDetail();
      fetchComments();
    }
  }, [status, inputId, fetchInputDetail, fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);

      const response = await fetch(`/api/inputs/${inputId}/comments`, {
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
        throw new Error(data.error || 'Failed to post comment');
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
            <p className="mt-4 text-gray-600">Loading input details...</p>
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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to view input details.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/inputs">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inputs
              </Button>
            </Link>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!input) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/inputs">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inputs
              </Button>
            </Link>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Input not found.</AlertDescription>
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
          <Link href="/inputs">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inputs
            </Button>
          </Link>
        </div>

        {/* Input Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-3xl" role="img" aria-label={input.type}>
                  {TYPE_ICONS[input.type]}
                </span>
                <div>
                  <CardTitle className="text-2xl">
                    {input.title || 'Untitled Input'}
                  </CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className={STATUS_COLORS[input.status]}>
                      {input.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={PRIORITY_COLORS[input.priority]}>
                      {input.priority}
                    </Badge>
                    {input.department && (
                      <Badge variant="outline">{input.department}</Badge>
                    )}
                    {input.issueType && (
                      <Badge variant="outline">{input.issueType}</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <VoteButtons
                  inputId={input.id}
                  initialVoteCounts={{
                    up: 0,
                    down: 0,
                    total: input._count.votes,
                  }}
                />
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
                  {input.description || 'No description available'}
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* Metadata */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Created by{' '}
                    {input.creator?.name ||
                      input.creator?.email ||
                      'Unknown User'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formatDate(input.createdAt)}
                  </span>
                </div>
                {input.creator?.department && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {input.creator.department}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {input.type.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        <AIInsightsPanel
          entityType="signal"
          entityId={input.id}
          showAdvanced={true}
          allowOverrides={true}
          onInsightOverride={(insightId, reason) => {
            console.log(`AI insight ${insightId} overridden: ${reason}`);
          }}
          onRefreshInsights={() => {
            console.log('Refreshing AI insights...');
          }}
        />

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea
                  placeholder="Add your comment..."
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
                {comments.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="rounded-lg bg-gray-50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
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
