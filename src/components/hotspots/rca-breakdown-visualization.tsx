'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Brain,
  TrendingUp,
  Users,
  Settings,
  Wifi,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * RCA Breakdown Visualization Component (FAE-102)
 *
 * Executive-optimized visualization of root cause analysis with:
 * - F-pattern layout for scanning behavior
 * - Mobile-responsive design with 44px touch targets
 * - Progressive disclosure for complex data
 * - Professional aesthetic building stakeholder confidence
 *
 * Expert: Maya Rodriguez (UX Expert) + David Chen (Visual Designer)
 * Support: Alex Thompson (Lead Developer)
 */

// Executive Color Palette for RCA Categories
const RCA_COLORS = {
  training: '#3B82F6', // Executive Blue - builds trust
  process: '#10B981', // Professional Green - positive outcomes
  communication: '#F59E0B', // Executive Gold - attention required
  technology: '#8B5CF6', // AI Purple - technical aspects
  resource: '#EF4444', // Executive Red - urgent issues
} as const;

const CONFIDENCE_COLORS = {
  high: '#10B981', // Green for >0.8 confidence
  medium: '#F59E0B', // Yellow for 0.5-0.8 confidence
  low: '#EF4444', // Red for <0.5 confidence
} as const;

// Category Icons for Executive Recognition
const CATEGORY_ICONS = {
  training: Users,
  process: Settings,
  communication: Wifi,
  technology: Brain,
  resource: TrendingUp,
} as const;

interface RCACategory {
  percentage: number;
  confidence: number;
  specifics: string[];
}

interface RCABreakdown {
  version: string;
  generatedAt: string;
  overallConfidence: number;
  primaryCategory: keyof typeof RCA_COLORS;
  categories: Record<keyof typeof RCA_COLORS, RCACategory>;
  reasoning: string;
  signalAnalysis: {
    totalSignals: number;
    categorizedSignals: number;
    confidenceDistribution: Record<string, number>;
  };
}

interface RCABreakdownVisualizationProps {
  hotspotId: string;
  rcaData: RCABreakdown;
  onSolutionCreate: (category: string, signals: string[]) => void;
  className?: string;
}

export function RCABreakdownVisualization({
  hotspotId,
  rcaData,
  onSolutionCreate,
  className = '',
}: RCABreakdownVisualizationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedInsights, setExpandedInsights] = useState(false);

  // Prepare chart data
  const chartData = Object.entries(rcaData.categories).map(([key, data]) => ({
    category: key.charAt(0).toUpperCase() + key.slice(1),
    percentage: data.percentage,
    confidence: data.confidence,
    color: RCA_COLORS[key as keyof typeof RCA_COLORS],
  }));

  const pieData = chartData.map(item => ({
    name: item.category,
    value: item.percentage,
    color: item.color,
  }));

  // Get confidence level styling
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return CONFIDENCE_COLORS.high;
    if (confidence > 0.5) return CONFIDENCE_COLORS.medium;
    return CONFIDENCE_COLORS.low;
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence > 0.8) return 'High';
    if (confidence > 0.5) return 'Medium';
    return 'Low';
  };

  // Custom tooltip component (extracted to satisfy ESLint)
  const tooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          <p className="font-semibold">{data.category}</p>
          <p className="text-sm text-gray-600">
            Percentage: {data.percentage}%
          </p>
          <p className="text-sm text-gray-600">
            Confidence: {Math.round(data.confidence * 100)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Executive Header - F-Pattern Optimization */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Root Cause Analysis</CardTitle>
                <p className="text-sm text-gray-600">
                  AI-powered analysis of {rcaData.signalAnalysis.totalSignals}{' '}
                  signals
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: getConfidenceColor(
                      rcaData.overallConfidence
                    ),
                  }}
                />
                <span className="text-sm font-medium">
                  {Math.round(rcaData.overallConfidence * 100)}% Confidence
                </span>
              </div>
              <Badge
                variant="outline"
                className="mt-1"
                style={{
                  borderColor: getConfidenceColor(rcaData.overallConfidence),
                  color: getConfidenceColor(rcaData.overallConfidence),
                }}
              >
                {getConfidenceLabel(rcaData.overallConfidence)} Reliability
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Primary Category Highlight */}
          <div
            className="mb-6 rounded-lg border-l-4 bg-gray-50 p-4"
            style={{ borderLeftColor: RCA_COLORS[rcaData.primaryCategory] }}
          >
            <div className="flex items-center space-x-3">
              {React.createElement(CATEGORY_ICONS[rcaData.primaryCategory], {
                className: 'h-5 w-5',
                style: { color: RCA_COLORS[rcaData.primaryCategory] },
              })}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  Primary Root Cause:{' '}
                  {rcaData.primaryCategory.charAt(0).toUpperCase() +
                    rcaData.primaryCategory.slice(1)}
                </h3>
                <p className="text-sm text-gray-600">
                  {rcaData.categories[rcaData.primaryCategory].percentage}% of
                  issues stem from {rcaData.primaryCategory} related factors
                </p>
              </div>
              <Target className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Responsive Chart Section */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Bar Chart - Desktop Priority */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Category Breakdown</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="horizontal">
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="category" type="category" width={100} />
                    <Tooltip content={tooltipContent} />
                    <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                      {chartData.map(entry => (
                        <Cell
                          key={`bar-${entry.category}`}
                          fill={entry.color}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart - Visual Overview */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">
                Distribution Overview
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map(entry => (
                        <Cell key={`pie-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={tooltipContent} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Category Details - Progressive Disclosure */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Detailed Analysis</h4>
            <div className="grid gap-3">
              {Object.entries(rcaData.categories).map(([category, data]) => {
                const Icon =
                  CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
                const isExpanded = selectedCategory === category;

                return (
                  <Card
                    key={category}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isExpanded ? 'ring-2 ring-blue-200' : ''
                    }`}
                    onClick={() =>
                      setSelectedCategory(isExpanded ? null : category)
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="rounded-lg p-2"
                            style={{
                              backgroundColor: `${RCA_COLORS[category as keyof typeof RCA_COLORS]}20`,
                            }}
                          >
                            <Icon
                              className="h-4 w-4"
                              style={{
                                color:
                                  RCA_COLORS[
                                    category as keyof typeof RCA_COLORS
                                  ],
                              }}
                            />
                          </div>
                          <div>
                            <h5 className="font-medium">
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {data.percentage}% contribution
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: getConfidenceColor(data.confidence),
                              color: getConfidenceColor(data.confidence),
                            }}
                          >
                            {Math.round(data.confidence * 100)}%
                          </Badge>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 border-t pt-4">
                          <h6 className="mb-2 text-sm font-medium text-gray-900">
                            Specific Issues Identified:
                          </h6>
                          <ul className="space-y-1">
                            {data.specifics.map((specific, index) => (
                              <li
                                key={`${category}-specific-${index}`}
                                className="flex items-start space-x-2 text-sm text-gray-600"
                              >
                                <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                                <span>{specific}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Quick Action - Mobile Optimized */}
                          <div className="mt-4 flex justify-end">
                            <Button
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                onSolutionCreate(category, []);
                              }}
                              className="min-h-[44px] px-4"
                              style={{
                                backgroundColor:
                                  RCA_COLORS[
                                    category as keyof typeof RCA_COLORS
                                  ],
                                borderColor:
                                  RCA_COLORS[
                                    category as keyof typeof RCA_COLORS
                                  ],
                              }}
                            >
                              Create{' '}
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}{' '}
                              Solution
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Insights - Expandable */}
      <Card>
        <CardHeader>
          <button
            className="flex w-full cursor-pointer items-center justify-between text-left"
            onClick={() => setExpandedInsights(!expandedInsights)}
            type="button"
          >
            <CardTitle className="text-lg">Executive Insights</CardTitle>
            {expandedInsights ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </CardHeader>

        {expandedInsights && (
          <CardContent>
            <div className="space-y-4">
              {/* AI Reasoning */}
              <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div>
                    <h5 className="font-medium text-blue-900">
                      Analysis Summary
                    </h5>
                    <p className="mt-1 text-sm text-blue-800">
                      {rcaData.reasoning}
                    </p>
                  </div>
                </div>
              </div>

              {/* Signal Analysis Stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {rcaData.signalAnalysis.totalSignals}
                  </div>
                  <div className="text-sm text-gray-600">Total Signals</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {rcaData.signalAnalysis.categorizedSignals}
                  </div>
                  <div className="text-sm text-gray-600">Analyzed</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(rcaData.overallConfidence * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Confidence</div>
                </div>
              </div>

              {/* Analysis Timestamp */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>
                  Analysis generated:{' '}
                  {new Date(rcaData.generatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Quick Actions - Mobile Optimized */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="min-h-[44px] flex-1"
              onClick={() => onSolutionCreate(rcaData.primaryCategory, [])}
              style={{
                backgroundColor: RCA_COLORS[rcaData.primaryCategory],
                borderColor: RCA_COLORS[rcaData.primaryCategory],
              }}
            >
              <Target className="mr-2 h-4 w-4" />
              Address Primary Cause (
              {rcaData.primaryCategory.charAt(0).toUpperCase() +
                rcaData.primaryCategory.slice(1)}
              )
            </Button>
            <Button
              variant="outline"
              className="min-h-[44px] flex-1"
              onClick={() => onSolutionCreate('comprehensive', [])}
            >
              <Settings className="mr-2 h-4 w-4" />
              Create Comprehensive Solution
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
