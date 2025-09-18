import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Ideas API Route
 *
 * Manages strategic ideas generated from hotspots:
 * - GET: Fetch ideas with filtering and pagination
 * - POST: Create new ideas from hotspots
 *
 * Expert: Sarah Chen (Product Manager)
 * Support: Dr. Priya Patel (AI Architect)
 */

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const origin = searchParams.get('origin');

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (origin) where.origin = origin;

    console.log('🔍 Ideas API - Starting query...');

    // Fetch ideas with basic fields (fix schema alignment)
    const [ideas, totalCount] = await Promise.all([
      (prisma as any).ideas?.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          hotspotId: true,
          origin: true,
          evidenceJson: true,
          tagsJson: true,
          aiConfidence: true,
          aiMetadata: true,
          qualityScore: true,
          createdById: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          { createdAt: 'desc' }, // Most recent first
        ],
        take: limit,
        skip: offset,
      }) || [],
      (prisma as any).ideas?.count({ where }) || 0,
    ]);

    console.log('🔍 Ideas API - Query results:', {
      ideasFound: ideas.length,
      totalCount,
      firstIdea: ideas[0]
        ? {
            id: ideas[0].id,
            title: ideas[0].title,
            hotspotId: ideas[0].hotspotId,
            hasHotspot: !!ideas[0].hotspot,
            hasCreatedBy: !!ideas[0].createdBy,
          }
        : null,
    });

    // Add computed vote and comment counts for each idea
    const ideasWithCounts = await Promise.all(
      ideas.map(async (idea: any) => {
        const [commentCount, upVotes, downVotes] = await Promise.all([
          (prisma as any).comments?.count?.({
            where: {
              entityType: 'IDEA',
              entityId: idea.id,
            },
          }) || 0,
          (prisma as any).votes?.count?.({
            where: {
              entityType: 'IDEA',
              entityId: idea.id,
              value: 'UP',
            },
          }) || 0,
          (prisma as any).votes?.count?.({
            where: {
              entityType: 'IDEA',
              entityId: idea.id,
              value: 'DOWN',
            },
          }) || 0,
        ]);

        return {
          ...idea,
          _count: {
            comments: commentCount,
            upVotes,
            downVotes,
          },
        };
      })
    );

    const responseData = {
      ideas: ideasWithCounts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('🔍 Ideas API - Final response:', {
      ideasCount: ideasWithCounts.length,
      totalCount,
      pagination: responseData.pagination,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Ideas fetch error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      hotspotId,
      title,
      description,
      origin = 'human',
      evidenceJson,
      tagsJson,
      createdBy,
    } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // For manual ideas, hotspotId is optional
    // For bulk creation from inputs, hotspotId is required
    let hotspot = null;
    let finalHotspotId = hotspotId;

    if (hotspotId) {
      // Verify hotspot exists
      hotspot = await (prisma as any).hotspot?.findUnique({
        where: { id: hotspotId },
      });

      if (!hotspot) {
        return NextResponse.json(
          { error: 'Hotspot not found' },
          { status: 404 }
        );
      }
    } else if (origin === 'human') {
      // For manual ideas, create or find a general hotspot
      const generalHotspot = await (prisma as any).hotspot?.findFirst({
        where: { id: 'manual_ideas_hotspot' },
      });

      if (generalHotspot) {
        finalHotspotId = generalHotspot.id;
      } else {
        // Create a general hotspot for manual ideas
        hotspot = await (prisma as any).hotspot?.create({
          data: {
            id: 'manual_ideas_hotspot',
            title: 'Manual Strategic Ideas',
            summary:
              'Collection of manually created strategic ideas from executives',
            status: 'OPEN',
            confidence: 1.0,
            rankScore: 0.5,
          },
        });
        finalHotspotId = hotspot.id;
      }
    }

    // Create the idea
    const idea = await (prisma as any).idea.create({
      data: {
        hotspotId: finalHotspotId,
        title,
        description,
        origin,
        evidenceJson,
        tagsJson,
        confidence: origin === 'human' ? 1.0 : undefined,
        createdById: createdBy || session.user.id,
        status: 'draft',
        votes: 0,
      },
      include: {
        hotspots: {
          select: {
            id: true,
            title: true,
            summary: true,
            status: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      idea,
      message: 'Idea created successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Idea creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create idea',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
