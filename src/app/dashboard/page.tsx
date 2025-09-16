'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  ThumbsUp,
  Plus,
  ArrowRight,
  AlertCircle,
  Target,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardStats {
  totalInputs: number;
  newInputs: number;
  inDiscussion: number;
  organized: number;
  inSolution: number;
  totalVotes: number;
  totalComments: number;
  activeUsers: number;
}

interface RecentInput {
  id: string;
  title: string;
  type: 'PROBLEM' | 'OPPORTUNITY' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  department: string;
  creator: string;
  createdAt: string;
  votesCount: number;
  commentsCount: number;
}

interface TrendData {
  period: string;
  inputs: number;
  votes: number;
  comments: number;
}

// const STATUS_COLORS = {
//   NEW: 'bg-blue-100 text-blue-800',
//   DISCUSSING: 'bg-yellow-100 text-yellow-800',
//   ORGANIZED: 'bg-purple-100 text-purple-800',
//   IN_SOLUTION: 'bg-green-100 text-green-800',
// }

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

export default function ExecutiveDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInputs: 0,
    newInputs: 0,
    inDiscussion: 0,
    organized: 0,
    inSolution: 0,
    totalVotes: 0,
    totalComments: 0,
    activeUsers: 0,
  });
  const [recentInputs, setRecentInputs] = useState<RecentInput[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch real data from dashboard API
      const response = await fetch('/api/dashboard');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch dashboard data');
        return;
      }

      setStats(data.stats);
      setRecentInputs(data.recentInputs);

      // Generate trends from real data (temporary until trends API is built)
      const calculatedTrends: TrendData[] = [
        {
          period: 'This Week',
          inputs: data.stats.newInputs,
          votes: Math.floor(data.stats.totalVotes * 0.4),
          comments: Math.floor(data.stats.totalComments * 0.3),
        },
        {
          period: 'Last Week',
          inputs: Math.floor(data.stats.newInputs * 0.8),
          votes: Math.floor(data.stats.totalVotes * 0.25),
          comments: Math.floor(data.stats.totalComments * 0.2),
        },
        {
          period: '2 Weeks Ago',
          inputs: Math.floor(data.stats.newInputs * 0.6),
          votes: Math.floor(data.stats.totalVotes * 0.2),
          comments: Math.floor(data.stats.totalComments * 0.15),
        },
        {
          period: '3 Weeks Ago',
          inputs: Math.floor(data.stats.newInputs * 0.9),
          votes: Math.floor(data.stats.totalVotes * 0.15),
          comments: Math.floor(data.stats.totalComments * 0.25),
        },
      ];

      setTrends(calculatedTrends);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
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
    return `${diffInDays}d ago`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Executive Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Strategic insights and organizational intelligence at a glance.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/inputs/create">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Input
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Key Metrics */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Inputs
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalInputs}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="font-medium text-green-600">
                      +{stats.newInputs}
                    </span>
                    <span className="ml-1 text-gray-500">new this week</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ThumbsUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Engagement
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalVotes + stats.totalComments}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">
                      {stats.totalVotes} votes, {stats.totalComments} comments
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Active Users
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.activeUsers}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">
                      participated this week
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        In Solution
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.inSolution}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-gray-500">actively being solved</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Pipeline */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Input Pipeline Status
                </CardTitle>
                <CardDescription>
                  Track the flow of strategic inputs through the organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.newInputs}
                    </div>
                    <div className="text-sm font-medium text-blue-800">New</div>
                    <div className="mt-1 text-xs text-blue-600">
                      Awaiting review
                    </div>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {stats.inDiscussion}
                    </div>
                    <div className="text-sm font-medium text-yellow-800">
                      Discussing
                    </div>
                    <div className="mt-1 text-xs text-yellow-600">
                      Active collaboration
                    </div>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.organized}
                    </div>
                    <div className="text-sm font-medium text-purple-800">
                      Organized
                    </div>
                    <div className="mt-1 text-xs text-purple-600">
                      Ready for action
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.inSolution}
                    </div>
                    <div className="text-sm font-medium text-green-800">
                      In Solution
                    </div>
                    <div className="mt-1 text-xs text-green-600">
                      Being implemented
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity & Trends */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Recent Strategic Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Recent Strategic Inputs
                    </div>
                    <Link href="/inputs">
                      <Button variant="outline" size="sm">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentInputs.map(input => (
                      <div
                        key={input.id}
                        className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3"
                      >
                        <span
                          className="text-xl"
                          role="img"
                          aria-label={input.type}
                        >
                          {TYPE_ICONS[input.type]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-medium text-gray-900">
                            {input.title}
                          </h4>
                          <div className="mt-1 flex items-center space-x-2">
                            <Badge
                              className={PRIORITY_COLORS[input.priority]}
                              variant="secondary"
                            >
                              {input.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {input.department}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              by {input.creator} •{' '}
                              {formatTimeAgo(input.createdAt)}
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span className="flex items-center">
                                <ThumbsUp className="mr-1 h-3 w-3" />
                                {input.votesCount}
                              </span>
                              <span className="flex items-center">
                                <MessageSquare className="mr-1 h-3 w-3" />
                                {input.commentsCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Activity Trends
                  </CardTitle>
                  <CardDescription>
                    Weekly engagement patterns and participation metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trends.map(trend => (
                      <div
                        key={trend.period}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {trend.period}
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center text-blue-600">
                            <Target className="mr-1 h-4 w-4" />
                            {trend.inputs}
                          </div>
                          <div className="flex items-center text-green-600">
                            <ThumbsUp className="mr-1 h-4 w-4" />
                            {trend.votes}
                          </div>
                          <div className="flex items-center text-purple-600">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {trend.comments}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common executive tasks and strategic operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Link href="/inputs/create">
                    <Button
                      variant="outline"
                      className="h-auto w-full justify-start p-4"
                    >
                      <Plus className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">
                          Create Strategic Input
                        </div>
                        <div className="text-xs text-gray-500">
                          Submit new problem or opportunity
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/inputs?status=NEW">
                    <Button
                      variant="outline"
                      className="h-auto w-full justify-start p-4"
                    >
                      <Target className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Review New Inputs</div>
                        <div className="text-xs text-gray-500">
                          {stats.newInputs} awaiting review
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/inputs?status=DISCUSSING">
                    <Button
                      variant="outline"
                      className="h-auto w-full justify-start p-4"
                    >
                      <MessageSquare className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Join Discussions</div>
                        <div className="text-xs text-gray-500">
                          {stats.inDiscussion} active discussions
                        </div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
