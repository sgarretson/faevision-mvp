'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Zap,
  TrendingUp,
  AlertCircle,
  Users,
  Calendar,
  Brain,
} from 'lucide-react';
import { ClusterAnalysisHeader } from '@/components/hotspots/cluster-analysis-header';
import { SignalSelectionGrid } from '@/components/hotspots/signal-selection-grid';
import { RCABreakdownVisualization } from '@/components/hotspots/rca-breakdown-visualization';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface HotspotDetail {
  id: string;
  title: string;
  summary: string;
  status: string;
  confidence: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
  clusteringMethod?: string;
  similarityThreshold?: number;
  linkedEntities?: any[];
  clusterAnalysis?: {
    totalSignals: number;
    coreSignals: number;
    outlierSignals: number;
    avgMembershipStrength: number;
    clusterQuality: number;
  };
  _count: {
    signals: number;
    ideas: number;
    solutions: number;
    comments?: number;
    votes?: number;
  };
  signals?: Array<{
    id: string;
    membershipStrength: number;
    isOutlier: boolean;
    signalStatus: 'core' | 'peripheral' | 'outlier';
    addedAt: string;
    signal: {
      id: string;
      title: string;
      description: string;
      severity: string;
      createdAt: string;
    };
  }>;
  ideas?: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    confidence: number;
  }>;
}

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  monitoring: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-gray-100 text-gray-800',
  archived: 'bg-red-100 text-red-800',
};

const PRIORITY_COLORS = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

export default function HotspotDetailPage() {
  const { status } = useSession();
  const params = useParams();
  const hotspotId = params.id as string;

  const [hotspot, setHotspot] = useState<HotspotDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rcaData, setRcaData] = useState<any>(null);
  const [rcaLoading, setRcaLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'analysis' | 'signals'
  >('overview');

  const fetchHotspotDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/hotspots/${hotspotId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch hotspot details');
        return;
      }

      setHotspot(data.hotspot);
    } catch (error) {
      console.error('Fetch hotspot detail error:', error);
      setError('Failed to load hotspot details');
    } finally {
      setIsLoading(false);
    }
  }, [hotspotId]);

  // Enhanced RCA Analysis Function (FAE-102)
  const generateRCAAnalysis = useCallback(async () => {
    try {
      setRcaLoading(true);
      console.log(`🔬 Generating enhanced RCA for hotspot: ${hotspotId}`);

      const response = await fetch(`/api/hotspots/${hotspotId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`RCA analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      setRcaData(result.analysis);
      console.log('✅ RCA analysis complete:', result);
    } catch (error) {
      console.error('RCA analysis error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to generate RCA analysis'
      );
    } finally {
      setRcaLoading(false);
    }
  }, [hotspotId]);

  // Fetch cached RCA analysis
  const fetchCachedRCA = useCallback(async () => {
    try {
      const response = await fetch(`/api/hotspots/${hotspotId}/analyze`);
      if (response.ok) {
        const result = await response.json();
        setRcaData(result.analysis);
      }
    } catch (error) {
      // Silently ignore - no cached analysis is expected initially
      console.log('No cached RCA analysis found:', error);
    }
  }, [hotspotId]);

  // Handle solution creation from RCA
  const handleSolutionCreate = useCallback(
    (category: string, signals: string[]) => {
      // For now, log the action - this would integrate with solution creation flow
      console.log(`Creating solution for category: ${category}`, signals);
      // Integration with solution creation workflow will be implemented in Phase 2
      alert(
        `Solution creation for ${category} category will be implemented in Phase 2`
      );
    },
    []
  );

  useEffect(() => {
    if (status === 'authenticated' && hotspotId) {
      fetchHotspotDetail();
      fetchCachedRCA();
    }
  }, [status, hotspotId, fetchHotspotDetail, fetchCachedRCA]);

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
            <p className="mt-4 text-gray-600">Loading hotspot details...</p>
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
              Please log in to view hotspot details.
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
            <Link href="/hotspots">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hotspots
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

  if (!hotspot) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/hotspots">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hotspots
              </Button>
            </Link>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Hotspot not found.</AlertDescription>
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
          <Link href="/hotspots">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hotspots
            </Button>
          </Link>
        </div>

        {/* Hotspot Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Zap className="h-8 w-8 text-orange-600" />
                <div>
                  <CardTitle className="text-2xl">
                    {hotspot.title || 'Untitled Hotspot'}
                  </CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      className={
                        STATUS_COLORS[
                          hotspot.status as keyof typeof STATUS_COLORS
                        ] || 'bg-gray-100 text-gray-800'
                      }
                    >
                      {hotspot.status}
                    </Badge>
                    <Badge
                      className={
                        PRIORITY_COLORS[
                          hotspot.priority as keyof typeof PRIORITY_COLORS
                        ] || 'bg-gray-100 text-gray-800'
                      }
                    >
                      {hotspot.priority} Priority
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(hotspot.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Signals</div>
                  <div className="text-2xl font-bold">
                    {hotspot._count.signals}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Ideas</div>
                  <div className="text-2xl font-bold">
                    {hotspot._count.ideas}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Discussions</div>
                  <div className="text-2xl font-bold">
                    {hotspot._count.comments || 0}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Votes</div>
                  <div className="text-2xl font-bold">
                    {hotspot._count.votes || 0}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
                <p className="mt-2 whitespace-pre-wrap text-gray-700">
                  {hotspot.summary || 'No summary available'}
                </p>
              </div>

              <hr className="border-gray-200" />

              {/* Metadata */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Created {formatDate(hotspot.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Updated {formatDate(hotspot.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {hotspot._count.signals} related signals
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {hotspot._count.ideas} generated ideas
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs - Executive Interface */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === 'analysis'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Brain className="mr-2 inline h-4 w-4" />
                RCA Analysis
              </button>
              <button
                onClick={() => setActiveTab('signals')}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === 'signals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Signal Details
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Enhanced Cluster Analysis */}
            {hotspot.clusterAnalysis && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Cluster Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClusterAnalysisHeader
                    clusteringMethod={hotspot.clusteringMethod}
                    similarityThreshold={hotspot.similarityThreshold}
                    confidence={hotspot.confidence}
                    clusterAnalysis={hotspot.clusterAnalysis}
                    linkedEntities={hotspot.linkedEntities}
                  />
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* RCA Analysis Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <span>Enhanced Root Cause Analysis</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    {rcaData && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateRCAAnalysis}
                        disabled={rcaLoading}
                      >
                        Refresh Analysis
                      </Button>
                    )}
                    {!rcaData && (
                      <Button
                        onClick={generateRCAAnalysis}
                        disabled={rcaLoading}
                        className="min-h-[44px]"
                      >
                        {rcaLoading ? 'Analyzing...' : 'Generate RCA Analysis'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {rcaLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-sm text-gray-600">
                        Analyzing {hotspot._count.signals} signals...
                      </p>
                    </div>
                  </div>
                )}

                {!rcaLoading && !rcaData && (
                  <div className="py-12 text-center">
                    <Brain className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      Enhanced RCA Analysis
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Generate a comprehensive root cause analysis with
                      AI-powered categorization across 5 key areas: Training,
                      Process, Communication, Technology, and Resource.
                    </p>
                    <Button
                      onClick={generateRCAAnalysis}
                      className="min-h-[44px]"
                    >
                      Generate Analysis
                    </Button>
                  </div>
                )}

                {rcaData && (
                  <RCABreakdownVisualization
                    hotspotId={hotspotId}
                    rcaData={rcaData}
                    onSolutionCreate={handleSolutionCreate}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'signals' && (
          <>
            {/* Signal Selection Grid */}
            {hotspot.signals && hotspot.signals.length > 0 ? (
              <SignalSelectionGrid
                signals={hotspot.signals.map((hs: any) => ({
                  ...hs.signal,
                  id: hs.signal.id,
                  membershipStrength: hs.membershipStrength,
                  isOutlier: hs.isOutlier,
                  signalStatus: hs.signalStatus,
                  addedAt: hs.addedAt,
                }))}
                hotspotId={hotspot.id}
                hotspotTitle={hotspot.title}
                onCreateIdea={selectedSignals => {
                  console.log(
                    'Creating idea from selected signals:',
                    selectedSignals
                  );
                  // Could redirect to idea creation page or show success
                }}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">
                    No signals found for this hotspot.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Generated Ideas */}
        {hotspot.ideas && hotspot.ideas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Ideas ({hotspot.ideas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hotspot.ideas.map((idea: any) => (
                  <div key={idea.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {idea.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                          {idea.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <Badge
                            className={
                              STATUS_COLORS[
                                idea.status as keyof typeof STATUS_COLORS
                              ] || 'bg-gray-100 text-gray-800'
                            }
                          >
                            {idea.status}
                          </Badge>
                          <Badge variant="outline">
                            {Math.round(idea.confidence * 100)}% confidence
                          </Badge>
                        </div>
                      </div>
                      <Link href={`/ideas/${idea.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
