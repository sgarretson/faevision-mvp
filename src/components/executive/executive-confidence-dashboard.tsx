'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  BusinessConfidenceIndicator,
  calculateBusinessConfidence,
  CreationOrigin,
} from '@/types/origin-confidence';
import { ConfidenceIndicator } from '@/components/ui/confidence-indicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface ExecutiveConfidenceDashboardProps {
  items: Array<{
    id: string;
    title: string;
    type: 'idea' | 'solution' | 'requirement' | 'frd';
    aiConfidence?: number | null;
    qualityScore?: number | null;
    origin?: CreationOrigin;
    createdAt: Date;
    status?: string;
  }>;
  className?: string;
}

/**
 * Executive Confidence Dashboard
 *
 * Optimized for executive scanning behavior with:
 * - F-pattern layout for quick information consumption
 * - Dashboard-first architecture with drill-down capability
 * - Clear status indicators and trend visualization
 * - Mobile meeting-friendly interface
 */
export function ExecutiveConfidenceDashboard({
  items,
  className,
}: ExecutiveConfidenceDashboardProps) {
  // Calculate overall confidence metrics
  const metrics = calculateOverallMetrics(items);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Executive Summary - F-Pattern Top Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard
          title="High Confidence"
          value={metrics.highConfidence}
          total={metrics.total}
          color="green"
          icon={CheckCircle2}
        />
        <MetricCard
          title="Needs Review"
          value={metrics.needsReview}
          total={metrics.total}
          color="yellow"
          icon={AlertCircle}
        />
        <MetricCard
          title="Action Required"
          value={metrics.actionRequired}
          total={metrics.total}
          color="red"
          icon={Clock}
        />
        <MetricCard
          title="Human Validated"
          value={metrics.humanValidated}
          total={metrics.total}
          color="blue"
          icon={CheckCircle2}
        />
      </div>

      {/* Content Grid - F-Pattern Left Scanning */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Priority Items - Left Column */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Items Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items
              .filter(item => {
                const confidence = calculateBusinessConfidence(
                  item.aiConfidence,
                  item.qualityScore,
                  item.origin
                );
                return confidence.actionRequired;
              })
              .slice(0, 5)
              .map(item => (
                <ExecutiveItemRow key={item.id} item={item} priority />
              ))}
            {items.filter(item => {
              const confidence = calculateBusinessConfidence(
                item.aiConfidence,
                item.qualityScore,
                item.origin
              );
              return confidence.actionRequired;
            }).length === 0 && (
              <div className="py-6 text-center text-gray-500">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-500" />
                All items have been reviewed
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity - Right Column */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .slice(0, 5)
              .map(item => (
                <ExecutiveItemRow key={item.id} item={item} showTime />
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed List - Full Width for Scanning */}
      <Card>
        <CardHeader>
          <CardTitle>All Items Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map(item => (
              <ExecutiveItemRow key={item.id} item={item} detailed />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Executive Item Row - Optimized for Scanning
 */
function ExecutiveItemRow({
  item,
  priority = false,
  showTime = false,
  detailed = false,
}: {
  item: {
    id: string;
    title: string;
    type: 'idea' | 'solution' | 'requirement' | 'frd';
    aiConfidence?: number | null;
    qualityScore?: number | null;
    origin?: CreationOrigin;
    createdAt: Date;
    status?: string;
  };
  priority?: boolean;
  showTime?: boolean;
  detailed?: boolean;
}) {
  const businessConfidence = calculateBusinessConfidence(
    item.aiConfidence,
    item.qualityScore,
    item.origin
  );

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50',
        priority &&
          businessConfidence.actionRequired &&
          'border-yellow-200 bg-yellow-50'
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Type Badge - Left Anchor */}
        <TypeBadge type={item.type} />

        {/* Title - Main Content */}
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-gray-900">{item.title}</div>
          {(showTime || detailed) && (
            <div className="mt-1 text-xs text-gray-500">
              {showTime && formatRelativeTime(item.createdAt)}
              {detailed && item.status && (
                <>
                  {showTime && ' • '}
                  <span className="capitalize">{item.status}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confidence Indicator - Right Anchor */}
      <div className="flex-shrink-0">
        <ConfidenceIndicator
          aiConfidence={item.aiConfidence}
          qualityScore={item.qualityScore}
          origin={item.origin}
          size="sm"
          variant={detailed ? 'detailed' : 'compact'}
        />
      </div>
    </div>
  );
}

/**
 * Metric Card Component
 */
function MetricCard({
  title,
  value,
  total,
  color,
  icon: Icon,
}: {
  title: string;
  value: number;
  total: number;
  color: 'green' | 'yellow' | 'red' | 'blue';
  icon: any;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      icon: 'text-green-500',
      border: 'border-green-200',
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      icon: 'text-yellow-500',
      border: 'border-yellow-200',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      icon: 'text-red-500',
      border: 'border-red-200',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      icon: 'text-blue-500',
      border: 'border-blue-200',
    },
  };

  const classes = colorClasses[color];

  return (
    <Card className={cn('border', classes.border)}>
      <CardContent className={cn('p-4', classes.bg)}>
        <div className="flex items-center justify-between">
          <div>
            <p className={cn('text-sm font-medium', classes.text)}>{title}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className={cn('text-2xl font-bold', classes.text)}>{value}</p>
              <p className={cn('text-sm', classes.text)}>{percentage}%</p>
            </div>
          </div>
          <Icon className={cn('h-8 w-8', classes.icon)} />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Type Badge Component
 */
function TypeBadge({
  type,
}: {
  type: 'idea' | 'solution' | 'requirement' | 'frd';
}) {
  const config = {
    idea: { label: 'Idea', className: 'bg-purple-100 text-purple-800' },
    solution: { label: 'Solution', className: 'bg-blue-100 text-blue-800' },
    requirement: {
      label: 'Requirement',
      className: 'bg-green-100 text-green-800',
    },
    frd: { label: 'FRD', className: 'bg-orange-100 text-orange-800' },
  };

  return (
    <Badge variant="outline" className={cn('text-xs', config[type].className)}>
      {config[type].label}
    </Badge>
  );
}

/**
 * Utility Functions
 */
function calculateOverallMetrics(items: any[]) {
  const total = items.length;
  let highConfidence = 0;
  let needsReview = 0;
  let actionRequired = 0;
  let humanValidated = 0;

  items.forEach(item => {
    const confidence = calculateBusinessConfidence(
      item.aiConfidence,
      item.qualityScore,
      item.origin
    );

    if (confidence.trafficLight === 'GREEN') highConfidence++;
    if (confidence.trafficLight === 'YELLOW') needsReview++;
    if (confidence.actionRequired) actionRequired++;
    if (confidence.humanValidated) humanValidated++;
  });

  return {
    total,
    highConfidence,
    needsReview,
    actionRequired,
    humanValidated,
  };
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
}
