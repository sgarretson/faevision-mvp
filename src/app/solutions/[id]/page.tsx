'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Target,
  Building,
  Zap,
  MessageSquare,
  Users,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SolutionDetail {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetDate?: string;
  completionDate?: string;
  estimatedEffort?: string;
  businessValue?: string;
  successMetrics?: any;
  expectedImpactJson?: any;
  actualImpactJson?: any;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
  };
  input?: {
    id: string;
    title: string;
    type: string;
  };
  hotspot?: {
    id: string;
    title: string;
    status: string;
  };
  initiative?: {
    id: string;
    title: string;
  };
  idea?: {
    id: string;
    title: string;
  };
  requirements: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
  }>;
  frdDocuments: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
  _count: {
    requirements: number;
    frdDocuments: number;
  };
}

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  review: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  on_hold: 'bg-red-100 text-red-800',
};

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const STATUS_ICONS = {
  draft: FileText,
  in_progress: Clock,
  review: AlertCircle,
  completed: CheckCircle,
  on_hold: AlertCircle,
};

export default function SolutionDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [solution, setSolution] = useState<SolutionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const solutionId = params.id as string;

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/solutions/${solutionId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Solution not found');
          } else {
            setError('Failed to load solution');
          }
          return;
        }

        const data = await response.json();
        setSolution(data.solution);
      } catch (error) {
        console.error('Error fetching solution:', error);
        setError('Failed to load solution');
      } finally {
        setLoading(false);
      }
    };

    if (solutionId) {
      fetchSolution();
    }
  }, [solutionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-8 h-8 w-32 rounded bg-gray-200"></div>
            <div className="mb-8 h-64 rounded-lg bg-gray-200"></div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-48 rounded-lg bg-gray-200"></div>
              <div className="h-48 rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Solution not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[solution.status] || FileText;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/solutions">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Solutions
            </Button>
          </Link>
        </div>

        {/* Solution Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="rounded-full bg-blue-100 p-2">
                  <Target className="h-6 w-6 text-blue-600" />
                </span>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge className={STATUS_COLORS[solution.status]}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {solution.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={PRIORITY_COLORS[solution.priority]}>
                      {solution.priority} priority
                    </Badge>
                  </div>
                  <h1 className="mb-2 text-2xl font-bold text-gray-900">
                    {solution.title}
                  </h1>
                  <p className="text-gray-600">
                    Created by {solution.creator.name} on{' '}
                    {new Date(solution.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {session?.user?.role === 'ADMIN' && (
                  <Button variant="outline" size="sm">
                    Edit Solution
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Description
                </h3>
                <p className="text-gray-700">{solution.description}</p>
              </div>

              {/* Source Information */}
              {(solution.input ||
                solution.hotspot ||
                solution.initiative ||
                solution.idea) && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Source
                  </h3>
                  <div className="space-y-2">
                    {solution.input && (
                      <Link href={`/inputs/${solution.input.id}`}>
                        <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Strategic Input:</strong>{' '}
                            {solution.input.title}
                          </span>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                      </Link>
                    )}
                    {solution.hotspot && (
                      <Link href={`/hotspots/${solution.hotspot.id}`}>
                        <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50">
                          <Zap className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">
                            <strong>Hotspot:</strong> {solution.hotspot.title}
                          </span>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                      </Link>
                    )}
                    {solution.idea && (
                      <Link href={`/ideas/${solution.idea.id}`}>
                        <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50">
                          <Building className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            <strong>Idea:</strong> {solution.idea.title}
                          </span>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline & Metrics */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Timeline */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Created
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(solution.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {solution.targetDate && (
                      <div className="flex items-center space-x-3">
                        <Target className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Target Date
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(solution.targetDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {solution.completionDate && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Completed
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(
                              solution.completionDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Business Impact
                  </h3>
                  <div className="space-y-3">
                    {solution.estimatedEffort && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Estimated Effort
                        </p>
                        <p className="text-sm text-gray-600">
                          {solution.estimatedEffort}
                        </p>
                      </div>
                    )}
                    {solution.businessValue && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Business Value
                        </p>
                        <p className="text-sm text-gray-600">
                          {solution.businessValue}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements and FRD Documents */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Requirements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Requirements ({solution._count.requirements})
                </h3>
                {session?.user?.role === 'ADMIN' && (
                  <Button variant="outline" size="sm">
                    Add Requirement
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {solution.requirements.length > 0 ? (
                <div className="space-y-3">
                  {solution.requirements.map(requirement => (
                    <div key={requirement.id} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {requirement.title}
                          </p>
                          <div className="mt-1 flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {requirement.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {requirement.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No requirements defined yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* FRD Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  FRD Documents ({solution._count.frdDocuments})
                </h3>
                {session?.user?.role === 'ADMIN' && (
                  <Button variant="outline" size="sm">
                    Generate FRD
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {solution.frdDocuments.length > 0 ? (
                <div className="space-y-3">
                  {solution.frdDocuments.map(frd => (
                    <div key={frd.id} className="rounded-lg border p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {frd.title}
                          </p>
                          <div className="mt-1 flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {frd.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(frd.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No FRD documents generated yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
