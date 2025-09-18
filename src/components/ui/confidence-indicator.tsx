'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  BusinessConfidenceIndicator,
  calculateBusinessConfidence,
  CreationOrigin,
} from '@/types/origin-confidence';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  Bot,
  Users,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

interface ConfidenceIndicatorProps {
  aiConfidence?: number | null;
  qualityScore?: number | null;
  origin?: CreationOrigin;
  showDetails?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'compact' | 'detailed' | 'executive';
}

/**
 * Executive-Friendly Confidence Indicator Component
 * 
 * Implements the team consensus on business confidence translation:
 * - Traffic light system for immediate visual assessment
 * - Progressive disclosure for technical details
 * - Mobile-first responsive design
 * - WCAG 2.1 AA accessibility compliance
 */
export function ConfidenceIndicator({
  aiConfidence,
  qualityScore,
  origin,
  showDetails = false,
  className,
  size = 'md',
  variant = 'detailed',
}: ConfidenceIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  
  const businessConfidence = calculateBusinessConfidence(
    aiConfidence,
    qualityScore,
    origin
  );

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Primary Confidence Display */}
      <div className="flex items-center gap-2 flex-wrap">
        <TrafficLightIndicator
          color={businessConfidence.trafficLight}
          size={size}
        />
        
        <OriginBadge origin={origin} size={size} />
        
        <RiskLevelBadge
          riskLevel={businessConfidence.riskLevel}
          size={size}
        />

        {businessConfidence.actionRequired && (
          <ActionRequiredBadge size={size} />
        )}

        {variant !== 'compact' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'p-1 h-auto text-gray-500 hover:text-gray-700',
              sizeClasses[size]
            )}
            aria-label={isExpanded ? 'Hide details' : 'Show details'}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Executive Recommendation */}
      <div className={cn('text-gray-700', sizeClasses[size])}>
        {businessConfidence.executiveRecommendation}
      </div>

      {/* Progressive Disclosure - Technical Details */}
      {isExpanded && variant !== 'compact' && (
        <Card className="border-gray-200">
          <CardContent className="p-3 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Confidence Level:</span>
                <div className="flex items-center gap-1 mt-1">
                  <ConfidenceMeter level={businessConfidence.level} />
                  <span className="text-gray-600">
                    {businessConfidence.level}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Quality Trend:</span>
                <div className="flex items-center gap-1 mt-1">
                  <QualityTrendIcon trend={businessConfidence.qualityTrend} />
                  <span className="text-gray-600">
                    {businessConfidence.qualityTrend}
                  </span>
                </div>
              </div>
              
              {(aiConfidence !== null && aiConfidence !== undefined) && (
                <div>
                  <span className="font-medium text-gray-700">AI Confidence:</span>
                  <span className="text-gray-600 ml-2">
                    {Math.round((aiConfidence || 0) * 100)}%
                  </span>
                </div>
              )}
              
              {(qualityScore !== null && qualityScore !== undefined) && (
                <div>
                  <span className="font-medium text-gray-700">Quality Score:</span>
                  <span className="text-gray-600 ml-2">
                    {Math.round((qualityScore || 0) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {businessConfidence.humanValidated && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>Human validated content</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Traffic Light Visual Indicator
 */
function TrafficLightIndicator({
  color,
  size,
}: {
  color: 'GREEN' | 'YELLOW' | 'RED';
  size: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const colorClasses = {
    GREEN: 'text-green-500',
    YELLOW: 'text-yellow-500',
    RED: 'text-red-500',
  };

  const Icon = color === 'GREEN' ? CheckCircle : 
              color === 'YELLOW' ? AlertTriangle : XCircle;

  return (
    <Icon
      className={cn(sizeClasses[size], colorClasses[color])}
      aria-label={`${color.toLowerCase()} confidence indicator`}
    />
  );
}

/**
 * Origin Badge Component
 */
function OriginBadge({
  origin,
  size,
}: {
  origin?: CreationOrigin;
  size: 'sm' | 'md' | 'lg';
}) {
  if (!origin) return null;

  const config = {
    [CreationOrigin.AI]: {
      icon: Bot,
      label: 'AI',
      className: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    [CreationOrigin.HUMAN]: {
      icon: User,
      label: 'Expert',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    [CreationOrigin.HYBRID]: {
      icon: Users,
      label: 'AI + Expert',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
  };

  const { icon: Icon, label, className } = config[origin];
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1',
  };

  return (
    <Badge
      variant="outline"
      className={cn(className, sizeClasses[size], 'flex items-center gap-1')}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

/**
 * Risk Level Badge Component
 */
function RiskLevelBadge({
  riskLevel,
  size,
}: {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  size: 'sm' | 'md' | 'lg';
}) {
  const config = {
    LOW: {
      label: 'Low Risk',
      className: 'bg-green-50 text-green-700 border-green-200',
    },
    MEDIUM: {
      label: 'Medium Risk',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    HIGH: {
      label: 'High Risk',
      className: 'bg-red-50 text-red-700 border-red-200',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1',
  };

  return (
    <Badge
      variant="outline"
      className={cn(config[riskLevel].className, sizeClasses[size])}
    >
      {config[riskLevel].label}
    </Badge>
  );
}

/**
 * Action Required Badge
 */
function ActionRequiredBadge({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1',
  };

  return (
    <Badge
      variant="destructive"
      className={cn(sizeClasses[size], 'animate-pulse')}
    >
      Action Required
    </Badge>
  );
}

/**
 * Confidence Level Meter
 */
function ConfidenceMeter({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const bars = 3;
  const activeBars = level === 'HIGH' ? 3 : level === 'MEDIUM' ? 2 : 1;

  return (
    <div className="flex gap-0.5 items-end">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1.5 h-3 rounded-sm',
            i < activeBars
              ? level === 'HIGH'
                ? 'bg-green-500'
                : level === 'MEDIUM'
                ? 'bg-yellow-500'
                : 'bg-red-500'
              : 'bg-gray-200'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Quality Trend Icon
 */
function QualityTrendIcon({
  trend,
}: {
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}) {
  const config = {
    IMPROVING: { icon: TrendingUp, className: 'text-green-500' },
    STABLE: { icon: Minus, className: 'text-gray-500' },
    DECLINING: { icon: TrendingDown, className: 'text-red-500' },
  };

  const { icon: Icon, className } = config[trend];

  return <Icon className={cn('h-4 w-4', className)} />;
}
