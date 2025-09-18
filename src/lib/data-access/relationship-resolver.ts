/**
 * Relationship Resolver Utility
 *
 * Provides robust data access with proper relationship resolution
 * for full Preview functionality restoration
 *
 * Expert: Morgan Smith (Database Architect)
 * Support: TypeScript Expert
 */

import { prisma } from '@/lib/prisma';

export interface SignalWithRelations {
  id: string;
  title: string;
  description: string;
  severity: string;
  severityScore: number;
  departmentId: string | null;
  teamId: string | null;
  categoryId: string | null;
  department?: { id: string; name: string } | null;
  team?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
  aiProcessed: boolean;
  aiTagsJson: any;
  enhancedTagsJson: any;
  domainClassification: any;
  clusteringFeaturesJson: any;
  receivedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
  } | null;
}

export interface HotspotWithSignals {
  id: string;
  title: string;
  summary: string;
  status: string;
  rankScore: number;
  confidence: number;
  signalCount: number;
  linkedEntities: any[];
  clusteringMethod: string;
  similarityThreshold: number | null;
  clusterAnalysis: {
    totalSignals: number;
    coreSignals: number;
    outlierSignals: number;
    avgMembershipStrength: number;
    clusterQuality: number;
  };
  rcaBreakdownJson: any;
  solutionSuggestionsJson: any;
  clusteringResults: any;
  createdAt: string;
  updatedAt: string;
  signals: Array<{
    id: string;
    title: string;
    description: string;
    severity: string;
    membershipStrength: number;
    isOutlier: boolean;
    departmentName?: string;
    teamName?: string;
    signalStatus: 'core' | 'peripheral' | 'outlier';
  }>;
}

/**
 * Get signals with full relationship resolution
 */
export async function getSignalsWithRelations(options: {
  where?: any;
  limit?: number;
  offset?: number;
  includeCreator?: boolean;
}): Promise<SignalWithRelations[]> {
  const { where = {}, limit = 50, offset = 0, includeCreator = true } = options;

  // Get signals with available relationships
  const signals = await (prisma as any).signals.findMany({
    where,
    include: {
      departments: true, // This should work based on audit
      teams: true, // This should work based on audit
      categories: true, // This should work based on audit
      ...(includeCreator && {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
  });

  // Map to consistent interface with fallback resolution
  return Promise.all(
    signals.map(async (signal: any) => {
      // Resolve relationships manually if includes fail
      let department = signal.departments;
      let team = signal.teams;
      let category = signal.categories;
      let creator = signal.users;

      // Fallback resolution if relationships aren't included
      if (!department && signal.departmentId) {
        try {
          department = await prisma.departments.findUnique({
            where: { id: signal.departmentId },
          });
        } catch (e) {
          console.warn('Failed to resolve department:', (e as Error).message);
        }
      }

      if (!team && signal.teamId) {
        try {
          team = await prisma.teams.findUnique({
            where: { id: signal.teamId },
          });
        } catch (e) {
          console.warn('Failed to resolve team:', (e as Error).message);
        }
      }

      if (!category && signal.categoryId) {
        try {
          category = await prisma.categories.findUnique({
            where: { id: signal.categoryId },
          });
        } catch (e) {
          console.warn('Failed to resolve category:', (e as Error).message);
        }
      }

      if (!creator && signal.createdById) {
        try {
          creator = await prisma.users.findUnique({
            where: { id: signal.createdById },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              department: true,
            },
          });
        } catch (e) {
          console.warn('Failed to resolve creator:', (e as Error).message);
        }
      }

      return {
        id: signal.id,
        title: signal.title || 'Untitled Signal',
        description: signal.description || '',
        severity: signal.severity || 'MEDIUM',
        severityScore: signal.severityScore || 3,
        departmentId: signal.departmentId,
        teamId: signal.teamId,
        categoryId: signal.categoryId,
        department: department
          ? { id: department.id, name: department.name }
          : null,
        team: team ? { id: team.id, name: team.name } : null,
        category: category ? { id: category.id, name: category.name } : null,
        aiProcessed: signal.aiProcessed || false,
        aiTagsJson: signal.aiTagsJson,
        enhancedTagsJson: signal.enhancedTagsJson,
        domainClassification: signal.domainClassification,
        clusteringFeaturesJson: signal.clusteringFeaturesJson,
        receivedAt: signal.receivedAt || signal.createdAt,
        createdAt: signal.createdAt,
        updatedAt: signal.updatedAt,
        createdBy: creator,
      } as SignalWithRelations;
    })
  );
}

/**
 * Get hotspots with full signal relationships and clustering analysis
 */
export async function getHotspotsWithSignals(options: {
  where?: any;
  limit?: number;
  offset?: number;
}): Promise<HotspotWithSignals[]> {
  const { where = {}, limit = 20, offset = 0 } = options;

  // Get hotspots with junction table relationships
  const hotspots = await (prisma as any).hotspots.findMany({
    where,
    include: {
      hotspot_signals: {
        include: {
          signals: {
            include: {
              departments: true,
              teams: true,
            },
          },
        },
      },
    },
    orderBy: [{ rankScore: 'desc' }, { updatedAt: 'desc' }],
    take: limit,
    skip: offset,
  });

  return hotspots.map((hotspot: any) => {
    // Process signal relationships
    const hotspotSignals = hotspot.hotspot_signals || [];
    const signals = hotspotSignals.map((hs: any) => {
      const signal = hs.signals;
      const membershipStrength = hs.membershipStrength || 0;
      const isOutlier = hs.isOutlier || false;

      return {
        id: signal.id,
        title: signal.title || 'Untitled Signal',
        description: signal.description || '',
        severity: signal.severity || 'MEDIUM',
        membershipStrength,
        isOutlier,
        departmentName: signal.departments?.name,
        teamName: signal.teams?.name,
        signalStatus: isOutlier
          ? 'outlier'
          : membershipStrength > 0.7
            ? 'core'
            : 'peripheral',
      };
    });

    // Calculate clustering analysis
    const membershipStrengths = signals.map((s: any) => s.membershipStrength);
    const coreSignals = signals.filter((s: any) => s.signalStatus === 'core');
    const outlierSignals = signals.filter(
      (s: any) => s.signalStatus === 'outlier'
    );

    const clusterAnalysis = {
      totalSignals: signals.length,
      coreSignals: coreSignals.length,
      outlierSignals: outlierSignals.length,
      avgMembershipStrength:
        membershipStrengths.length > 0
          ? membershipStrengths.reduce(
              (sum: number, strength: number) => sum + strength,
              0
            ) / membershipStrengths.length
          : 0,
      clusterQuality:
        signals.length > 0 ? (coreSignals.length / signals.length) * 100 : 0,
    };

    return {
      id: hotspot.id,
      title: hotspot.title,
      summary: hotspot.summary,
      status: hotspot.status,
      rankScore: hotspot.rankScore,
      confidence: hotspot.confidence,
      signalCount: signals.length,
      linkedEntities: hotspot.linkedEntitiesJson || [],
      clusteringMethod: hotspot.clusteringMethod,
      similarityThreshold: hotspot.similarityThreshold,
      clusterAnalysis,
      rcaBreakdownJson: hotspot.rcaBreakdownJson,
      solutionSuggestionsJson: hotspot.solutionSuggestionsJson,
      clusteringResults: hotspot.clusteringResults,
      createdAt: hotspot.createdAt.toISOString(),
      updatedAt: hotspot.updatedAt.toISOString(),
      signals,
    } as HotspotWithSignals;
  });
}

/**
 * Get total count for pagination
 */
export async function getSignalsCount(where: any = {}): Promise<number> {
  return (await (prisma as any).signals.count({ where })) || 0;
}

/**
 * Get hotspots count for pagination
 */
export async function getHotspotsCount(where: any = {}): Promise<number> {
  return (await (prisma as any).hotspots.count({ where })) || 0;
}

/**
 * Get comments and votes count for any entity
 */
export async function getEntityCounts(entityType: string, entityId: string) {
  const [commentCount, voteCount] = await Promise.all([
    (prisma as any).comments?.count?.({
      where: {
        entityType,
        entityId,
      },
    }) || 0,
    (prisma as any).votes?.count?.({
      where: {
        entityType,
        entityId,
      },
    }) || 0,
  ]);

  return { commentCount, voteCount };
}
