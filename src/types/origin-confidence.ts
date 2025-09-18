/**
 * Standardized Origin & Confidence Tracking Types
 *
 * Implements the team consensus on AI/Human/Hybrid creation patterns
 * with business confidence indicators for executive decision-making.
 */

export enum CreationOrigin {
  AI = 'AI',
  HUMAN = 'HUMAN',
  HYBRID = 'HYBRID',
}

export interface OriginConfidenceFields {
  origin: CreationOrigin;
  aiConfidence?: number | null;
  aiMetadata?: any | null;
  qualityScore?: number | null;
}

export interface AIMetadata {
  model?: string;
  prompt?: string;
  processingTime?: number;
  temperature?: number;
  tokens?: {
    input: number;
    output: number;
  };
  confidence?: number;
  reasoning?: string;
}

export interface BusinessConfidenceIndicator {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  humanValidated: boolean;
  qualityTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  trafficLight: 'GREEN' | 'YELLOW' | 'RED';
  executiveRecommendation: string;
  actionRequired: boolean;
}

export interface CreationAuditTrail {
  origin: CreationOrigin;
  createdAt: Date;
  createdBy: string;
  aiMetadata?: AIMetadata;
  humanOverrides?: Array<{
    field: string;
    originalValue: any;
    newValue: any;
    reason: string;
    timestamp: Date;
    userId: string;
  }>;
}

// Type guards for runtime validation
export function isValidCreationOrigin(value: any): value is CreationOrigin {
  return Object.values(CreationOrigin).includes(value);
}

export function isAIGenerated(origin: CreationOrigin): boolean {
  return origin === CreationOrigin.AI || origin === CreationOrigin.HYBRID;
}

export function isHumanValidated(origin: CreationOrigin): boolean {
  return origin === CreationOrigin.HUMAN || origin === CreationOrigin.HYBRID;
}

// Business confidence calculation utilities
export function calculateBusinessConfidence(
  aiConfidence?: number | null,
  qualityScore?: number | null,
  origin?: CreationOrigin
): BusinessConfidenceIndicator {
  const confidence = Math.max(aiConfidence || 0, qualityScore || 0);

  let level: 'LOW' | 'MEDIUM' | 'HIGH';
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';

  if (confidence >= 0.8) {
    level = 'HIGH';
    riskLevel = 'LOW';
  } else if (confidence >= 0.6) {
    level = 'MEDIUM';
    riskLevel = 'MEDIUM';
  } else {
    level = 'LOW';
    riskLevel = 'HIGH';
  }

  // Human validation reduces risk
  if (origin && isHumanValidated(origin)) {
    if (riskLevel === 'HIGH') riskLevel = 'MEDIUM';
    else if (riskLevel === 'MEDIUM') riskLevel = 'LOW';
  }

  // Determine traffic light and executive recommendation
  const trafficLight = getTrafficLightColor(riskLevel, origin);
  const { recommendation, actionRequired } = getExecutiveRecommendation(
    level,
    riskLevel,
    origin
  );

  return {
    level,
    riskLevel,
    confidence,
    humanValidated: origin ? isHumanValidated(origin) : false,
    qualityTrend: 'STABLE', // TODO: Implement trend calculation
    trafficLight,
    executiveRecommendation: recommendation,
    actionRequired,
  };
}

// Traffic light system for immediate visual assessment
export function getTrafficLightColor(
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
  origin?: CreationOrigin
): 'GREEN' | 'YELLOW' | 'RED' {
  // Human validation always improves confidence
  if (origin === CreationOrigin.HUMAN) return 'GREEN';
  if (origin === CreationOrigin.HYBRID && riskLevel !== 'HIGH') return 'GREEN';

  switch (riskLevel) {
    case 'LOW':
      return 'GREEN';
    case 'MEDIUM':
      return 'YELLOW';
    case 'HIGH':
      return 'RED';
    default:
      return 'RED';
  }
}

// Executive-friendly recommendations
export function getExecutiveRecommendation(
  level: 'LOW' | 'MEDIUM' | 'HIGH',
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
  origin?: CreationOrigin
): { recommendation: string; actionRequired: boolean } {
  if (origin === CreationOrigin.HUMAN) {
    return {
      recommendation: 'Expert-validated content. Ready for implementation.',
      actionRequired: false,
    };
  }

  if (origin === CreationOrigin.HYBRID) {
    return {
      recommendation: 'AI-assisted with human validation. High confidence recommendation.',
      actionRequired: false,
    };
  }

  // AI-generated content recommendations
  switch (riskLevel) {
    case 'LOW':
      return {
        recommendation: 'AI recommendation with high confidence. Consider for approval.',
        actionRequired: false,
      };
    case 'MEDIUM':
      return {
        recommendation: 'AI recommendation requires expert review before implementation.',
        actionRequired: true,
      };
    case 'HIGH':
      return {
        recommendation: 'AI recommendation needs significant expert validation and refinement.',
        actionRequired: true,
      };
    default:
      return {
        recommendation: 'Manual review required before proceeding.',
        actionRequired: true,
      };
  }
}

// Extended types for each model
export interface IdeaWithOriginConfidence extends OriginConfidenceFields {
  id: string;
  title?: string | null;
  description: string;
  hotspotId: string;
  status: string;
  votes: number;
  evidenceJson?: any | null;
  tagsJson?: any | null;
  createdById?: string | null;
  initiativeId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SolutionWithOriginConfidence extends OriginConfidenceFields {
  id: string;
  title: string;
  description: string;
  status: string;
  estimatedEffort?: string | null;
  businessValue?: string | null;
  createdBy: string;
  hotspotId?: string | null;
  ideaId?: string | null;
  initiativeId?: string | null;
  progress: number;
  targetDate?: Date | null;
  tasks?: any | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequirementWithOriginConfidence
  extends OriginConfidenceFields {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: any;
  status: string;
  estimatedEffort?: string | null;
  dependencies?: any | null;
  businessValue?: string | null;
  riskAssessment?: string | null;
  stakeholders?: any | null;
  solutionId: string;
  createdBy: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FRDDocumentWithOriginConfidence
  extends OriginConfidenceFields {
  id: string;
  title: string;
  content: any;
  aiPromptUsed?: string | null;
  version: string;
  status: string;
  executiveApproved: boolean;
  solutionId: string;
  createdBy: string;
  approvedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
