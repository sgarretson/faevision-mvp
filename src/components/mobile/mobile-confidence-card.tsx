'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  calculateBusinessConfidence,
  CreationOrigin,
} from '@/types/origin-confidence';
import { ConfidenceIndicator } from '@/components/ui/confidence-indicator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  Bot,
  Users,
} from 'lucide-react';

interface MobileConfidenceCardProps {
  title: string;
  type: 'idea' | 'solution' | 'requirement' | 'frd';
  aiConfidence?: number | null;
  qualityScore?: number | null;
  origin?: CreationOrigin;
  status?: string;
  createdAt: Date;
  onClick?: () => void;
  className?: string;
}

/**
 * Mobile Confidence Card
 *
 * Optimized for executive mobile usage:
 * - 44px minimum touch targets
 * - Thumb-friendly navigation
 * - Clear visual hierarchy for quick scanning
 * - Meeting-friendly one-handed operation
 */
export function MobileConfidenceCard({
  title,
  type,
  aiConfidence,
  qualityScore,
  origin,
  status,
  createdAt,
  onClick,
  className,
}: MobileConfidenceCardProps) {
  const businessConfidence = calculateBusinessConfidence(
    aiConfidence,
    qualityScore,
    origin
  );

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        'border-l-4',
        businessConfidence.trafficLight === 'GREEN' && 'border-l-green-500',
        businessConfidence.trafficLight === 'YELLOW' && 'border-l-yellow-500',
        businessConfidence.trafficLight === 'RED' && 'border-l-red-500',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="space-y-3 p-4">
        {/* Header Row - Touch-Friendly */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-semibold leading-tight text-gray-900">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <TypeBadge type={type} />
              {status && (
                <Badge variant="outline" className="text-xs capitalize">
                  {status}
                </Badge>
              )}
            </div>
          </div>

          {/* Primary Confidence Indicator */}
          <div className="flex-shrink-0">
            <MobileTrafficLight color={businessConfidence.trafficLight} />
          </div>
        </div>

        {/* Origin and Validation Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <OriginIcon origin={origin} />
            <span className="text-sm text-gray-600">
              {getOriginLabel(origin)}
            </span>
            {businessConfidence.humanValidated && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>

          <div className="text-xs text-gray-500">
            {formatMobileTime(createdAt)}
          </div>
        </div>

        {/* Executive Recommendation */}
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="flex items-start gap-2">
            {businessConfidence.actionRequired && (
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
            )}
            <p className="text-sm leading-relaxed text-gray-700">
              {businessConfidence.executiveRecommendation}
            </p>
          </div>
        </div>

        {/* Action Button Row */}
        {businessConfidence.actionRequired && (
          <div className="border-t border-gray-200 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-600">
                Action Required
              </span>
              <Badge variant="destructive" className="text-xs">
                Review Needed
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Large Mobile Traffic Light for Touch Interfaces
 */
function MobileTrafficLight({ color }: { color: 'GREEN' | 'YELLOW' | 'RED' }) {
  const config = {
    GREEN: { icon: CheckCircle, className: 'text-green-500 bg-green-50' },
    YELLOW: { icon: AlertTriangle, className: 'text-yellow-500 bg-yellow-50' },
    RED: { icon: XCircle, className: 'text-red-500 bg-red-50' },
  };

  const { icon: Icon, className } = config[color];

  return (
    <div className={cn('rounded-full p-2', className)}>
      <Icon className="h-6 w-6" />
    </div>
  );
}

/**
 * Origin Icon Component
 */
function OriginIcon({ origin }: { origin?: CreationOrigin }) {
  if (!origin) return null;

  const config = {
    [CreationOrigin.AI]: { icon: Bot, className: 'text-purple-500' },
    [CreationOrigin.HUMAN]: { icon: User, className: 'text-blue-500' },
    [CreationOrigin.HYBRID]: { icon: Users, className: 'text-green-500' },
  };

  const { icon: Icon, className } = config[origin];

  return <Icon className={cn('h-4 w-4', className)} />;
}

/**
 * Type Badge for Mobile
 */
function TypeBadge({
  type,
}: {
  type: 'idea' | 'solution' | 'requirement' | 'frd';
}) {
  const config = {
    idea: { label: 'Idea', className: 'bg-purple-100 text-purple-800' },
    solution: { label: 'Solution', className: 'bg-blue-100 text-blue-800' },
    requirement: { label: 'Req', className: 'bg-green-100 text-green-800' },
    frd: { label: 'FRD', className: 'bg-orange-100 text-orange-800' },
  };

  return (
    <Badge
      variant="outline"
      className={cn('px-2 py-0.5 text-xs', config[type].className)}
    >
      {config[type].label}
    </Badge>
  );
}

/**
 * Mobile Executive Summary Component
 */
export function MobileExecutiveSummary({
  items,
  className,
}: {
  items: Array<{
    aiConfidence?: number | null;
    qualityScore?: number | null;
    origin?: CreationOrigin;
  }>;
  className?: string;
}) {
  const metrics = items.reduce(
    (acc, item) => {
      const confidence = calculateBusinessConfidence(
        item.aiConfidence,
        item.qualityScore,
        item.origin
      );

      acc.total++;
      if (confidence.trafficLight === 'GREEN') acc.ready++;
      if (confidence.actionRequired) acc.needsAttention++;
      if (confidence.humanValidated) acc.validated++;

      return acc;
    },
    { total: 0, ready: 0, needsAttention: 0, validated: 0 }
  );

  return (
    <Card
      className={cn(
        'border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {metrics.ready}
            </div>
            <div className="text-xs font-medium text-gray-600">Ready</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {metrics.needsAttention}
            </div>
            <div className="text-xs font-medium text-gray-600">Review</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.validated}
            </div>
            <div className="text-xs font-medium text-gray-600">Validated</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Mobile Action Panel
 */
export function MobileActionPanel({
  items,
  onItemClick,
  className,
}: {
  items: Array<{
    id: string;
    title: string;
    type: 'idea' | 'solution' | 'requirement' | 'frd';
    aiConfidence?: number | null;
    qualityScore?: number | null;
    origin?: CreationOrigin;
  }>;
  onItemClick?: (id: string) => void;
  className?: string;
}) {
  const actionItems = items.filter(item => {
    const confidence = calculateBusinessConfidence(
      item.aiConfidence,
      item.qualityScore,
      item.origin
    );
    return confidence.actionRequired;
  });

  if (actionItems.length === 0) {
    return (
      <Card className={cn('border-green-200 bg-green-50', className)}>
        <CardContent className="p-4 text-center">
          <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
          <p className="text-sm font-medium text-green-700">
            All items reviewed
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-yellow-200', className)}>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-900">
            Action Required ({actionItems.length})
          </h3>
        </div>

        <div className="space-y-2">
          {actionItems.slice(0, 3).map(item => (
            <div
              key={item.id}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3 transition-colors hover:bg-yellow-100"
              onClick={() => onItemClick?.(item.id)}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="text-xs capitalize text-gray-600">{item.type}</p>
              </div>
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-yellow-600" />
            </div>
          ))}

          {actionItems.length > 3 && (
            <div className="pt-2 text-center">
              <span className="text-sm text-gray-600">
                +{actionItems.length - 3} more items
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Utility Functions
 */
function getOriginLabel(origin?: CreationOrigin): string {
  if (!origin) return 'Unknown';

  switch (origin) {
    case CreationOrigin.AI:
      return 'AI Generated';
    case CreationOrigin.HUMAN:
      return 'Expert Created';
    case CreationOrigin.HYBRID:
      return 'AI + Expert';
    default:
      return 'Unknown';
  }
}

function formatMobileTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
