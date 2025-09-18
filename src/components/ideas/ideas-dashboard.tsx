'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Clock,
  Users,
  Zap,
  ArrowRight,
  Plus,
} from 'lucide-react';

/**
 * Ideas Dashboard Component
 *
 * Executive interface for managing strategic ideas:
 * - Ideas generated from hotspots
 * - Community voting and prioritization
 * - Path to solution development
 *
 * Expert: Sarah Chen (Product Manager)
 * Support: Maya Rodriguez (UX Expert)
 */

interface Idea {
  id: string;
  title: string;
  description: string;
  origin: 'ai' | 'human' | 'hybrid';
  votes: number;
  status: string;
  confidence?: number;
  hotspot: {
    id: string;
    title: string;
    summary: string;
    status: string;
    confidence: number;
    _count: {
      signals: number;
    };
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  _count: {
    comments: number;
    upVotes: number;
    downVotes: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const ORIGIN_ICONS = {
  ai: '🤖',
  human: '👤',
  hybrid: '🤝',
};

const ORIGIN_COLORS = {
  ai: 'bg-purple-100 text-purple-800',
  human: 'bg-blue-100 text-blue-800',
  hybrid: 'bg-green-100 text-green-800',
};

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  developing: 'bg-blue-100 text-blue-800',
  implemented: 'bg-purple-100 text-purple-800',
};

export function IdeasDashboard() {
  const { data: session, status } = useSession();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug session state
  console.log('🔍 IdeasDashboard - Session Debug:', {
    status,
    hasSession: !!session,
    user: session?.user
      ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
        }
      : null,
    timestamp: new Date().toISOString(),
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [originFilter, setOriginFilter] = useState<string>('');

  const fetchIdeas = useCallback(async () => {
    console.log(
      '🔍 fetchIdeas called with status:',
      status,
      'session:',
      !!session
    );

    // Don't fetch if not authenticated
    if (status !== 'authenticated' || !session) {
      console.log('❌ Not fetching - status:', status, 'session:', !!session);
      setIsLoading(false);
      return;
    }

    console.log('✅ Fetching ideas - authenticated');

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (originFilter) params.append('origin', originFilter);

      console.log('📡 Making request to:', `/api/ideas?${params}`);
      const response = await fetch(`/api/ideas?${params}`);
      console.log('📡 Response status:', response.status);

      const data = await response.json();
      console.log('📡 Response data:', data);
      console.log('📡 Ideas array:', data.ideas);
      console.log('📡 Ideas length:', data.ideas?.length || 'N/A');
      console.log('📡 Pagination:', data.pagination);

      if (!response.ok) {
        setError(data.error || 'Failed to fetch ideas');
        return;
      }

      setIdeas(data.ideas || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Fetch ideas error:', error);
      setError('Failed to load ideas');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, originFilter, session, status]);

  useEffect(() => {
    fetchIdeas();
  }, [statusFilter, originFilter, fetchIdeas]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle loading authentication
  if (status === 'loading') {
    // During build time, show a different message
    if (typeof window === 'undefined') {
      return (
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Building application...</p>
        </div>
      );
    }
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    );
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>Please log in to view ideas.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{pagination?.total || 0}</p>
                <p className="text-sm text-gray-600">Total Ideas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {ideas.filter(i => i.status === 'approved').length}
                </p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {ideas.filter(i => i.status === 'review').length}
                </p>
                <p className="text-sm text-gray-600">In Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {ideas.filter(i => i.origin === 'ai').length}
                </p>
                <p className="text-sm text-gray-600">AI Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="review">In Review</option>
                <option value="approved">Approved</option>
                <option value="developing">Developing</option>
                <option value="implemented">Implemented</option>
              </select>

              <select
                value={originFilter}
                onChange={e => setOriginFilter(e.target.value)}
                className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <option value="">All Origins</option>
                <option value="ai">AI Generated</option>
                <option value="human">Human Created</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Link href="/ideas/create">
                <Button variant="outline" className="w-full lg:w-auto">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Create Manual Idea
                </Button>
              </Link>
              <Button className="w-full lg:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Generate AI Ideas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading ideas...</p>
        </div>
      )}

      {/* Ideas List */}
      {!isLoading && (
        <div className="space-y-4">
          {ideas.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="py-12 text-center">
                  <Brain className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No ideas found
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Ideas will appear here as they're generated from hotspots or
                    created by your team.
                  </p>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Link href="/ideas/create">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Create Manual Idea
                      </Button>
                    </Link>
                    <Button className="w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Generate AI Ideas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            ideas.map(idea => (
              <Card key={idea.id} className="transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {idea.title || 'Untitled Idea'}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                            {idea.description}
                          </p>
                        </div>
                      </div>

                      {/* Origin Hotspot */}
                      <div className="mt-4 flex items-center space-x-2 text-sm">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-gray-600">From hotspot:</span>
                        <Badge variant="outline" className="font-medium">
                          {idea.hotspot.title}
                        </Badge>
                        <span className="text-gray-400">
                          ({idea.hotspot._count.signals} signals)
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge
                          className={
                            STATUS_COLORS[
                              idea.status as keyof typeof STATUS_COLORS
                            ]
                          }
                        >
                          {idea.status}
                        </Badge>
                        <Badge className={ORIGIN_COLORS[idea.origin]}>
                          {ORIGIN_ICONS[idea.origin]} {idea.origin}
                        </Badge>
                        {idea.confidence && (
                          <Badge variant="outline">
                            {Math.round(idea.confidence * 100)}% confidence
                          </Badge>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                        {idea.createdBy && (
                          <span>By {idea.createdBy.name}</span>
                        )}
                        <span>{formatDate(idea.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions & Stats */}
                    <div className="mt-4 flex items-center space-x-4 lg:ml-6 lg:mt-0">
                      {/* Vote Stats */}
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span>{idea._count.upVotes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{idea._count.comments}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link href={`/ideas/${idea.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.hasMore && (
        <div className="mt-8 text-center">
          <Button variant="outline">Load More Ideas</Button>
        </div>
      )}
    </div>
  );
}
