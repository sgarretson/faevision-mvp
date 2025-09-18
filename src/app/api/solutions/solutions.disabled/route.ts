import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSolutionSuggestions } from '@/lib/ai/signal-processing';

/**
 * Solutions API Endpoint
 *
 * RESTful API for solution management:
 * - GET: List solutions with filtering and pagination
 * - POST: Create new solution (from hotspot or manual)
 * - Executive-focused solution workflow
 *
 * Expert: Alex Thompson (Lead Developer)
 * Support: Maya Rodriguez (UX Expert)
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const hotspotId = searchParams.get('hotspotId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (hotspotId) {
      where.hotspotId = hotspotId;
    }

    const [solutions, totalCount] = await Promise.all([
      (prisma as any).solutions.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          hotspot: {
            select: {
              id: true,
              title: true,
              summary: true,
              confidence: true,
              signalCount: true,
            },
          },
          input: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
          initiative: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        orderBy: [
          { status: 'asc' }, // Draft, In Progress, etc. first
          { updatedAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      (prisma as any).solutions.count({ where }),
    ]);

    const formattedSolutions = solutions.map((solution: any) => ({
      id: solution.id,
      title: solution.title,
      description: solution.description,
      status: solution.status,
      progress: solution.progress,
      targetDate: solution.targetDate?.toISOString(),
      actualCompletionDate: solution.actualCompletionDate?.toISOString(),

      // Business Impact
      estimatedEffort: solution.estimatedEffort,
      businessValue: solution.businessValue,
      successMetrics: solution.successMetrics,
      expectedImpactJson: solution.expectedImpactJson,
      actualImpactJson: solution.actualImpactJson,

      // Relationships
      creator: solution.creator,
      hotspot: solution.hotspot,
      input: solution.input,
      initiative: solution.initiative,

      // Metadata
      createdAt: solution.createdAt.toISOString(),
      updatedAt: solution.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      solutions: formattedSolutions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching solutions:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch solutions',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      hotspotId,
      inputId,
      initiativeId,
      estimatedEffort,
      businessValue,
      targetDate,
      successMetrics,
      expectedImpactJson,
      priority = 'MEDIUM',
      createdBy,
    } = body;

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and description are required',
        },
        { status: 400 }
      );
    }

    if (!createdBy) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creator ID is required',
        },
        { status: 400 }
      );
    }

    // Verify creator exists
    const creator = await (prisma as any).users.findUnique({
      where: { id: createdBy },
    });

    if (!creator) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid creator ID',
        },
        { status: 400 }
      );
    }

    // Create solution
    const solution = await (prisma as any).solutions.create({
      data: {
        title,
        description,
        status: 'DRAFT',
        progress: 0.0,
        hotspotId,
        inputId,
        initiativeId,
        estimatedEffort,
        businessValue,
        successMetrics,
        expectedImpactJson,
        targetDate: targetDate ? new Date(targetDate) : null,
        createdBy,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        hotspot: {
          select: {
            id: true,
            title: true,
            summary: true,
            confidence: true,
          },
        },
      },
    });

    // If created from hotspot, generate AI solution suggestions
    let aiSuggestions = null;
    if (hotspotId) {
      try {
        const hotspot = await (prisma as any).hotspot?.findUnique({
          where: { id: hotspotId },
          include: {
            signals: {
              include: {
                signal: true,
              },
            },
          },
        });

        if (hotspot && hotspot.signals) {
          aiSuggestions = await generateSolutionSuggestions(
            hotspot.summary,
            hotspot.signals.map((hs: any) => hs.signal)
          );
        }
      } catch (aiError) {
        console.error('Error generating AI suggestions:', aiError);
        // Continue without AI suggestions
      }
    }

    return NextResponse.json({
      success: true,
      solution: {
        id: solution.id,
        title: solution.title,
        description: solution.description,
        status: solution.status,
        progress: solution.progress,
        targetDate: solution.targetDate?.toISOString(),
        estimatedEffort: solution.estimatedEffort,
        businessValue: solution.businessValue,
        successMetrics: solution.successMetrics,
        expectedImpactJson: solution.expectedImpactJson,
        creator: solution.creator,
        hotspot: solution.hotspot,
        createdAt: solution.createdAt.toISOString(),
        updatedAt: solution.updatedAt.toISOString(),
      },
      aiSuggestions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating solution:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create solution',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
