import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Idea Detail API Route
 *
 * Provides detailed information about a specific idea:
 * - Idea details with hotspot and creator information
 * - Vote and comment counts
 * - Evidence and tags data
 *
 * Expert: Alex Thompson (Lead Developer)
 * Support: Dr. Priya Patel (AI Architect)
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Idea ID is required' },
        { status: 400 }
      );
    }

    // Get idea with hotspot and creator information
    const idea = await (prisma as any).ideas?.findUnique({
      where: { id },
      include: {
        hotspots: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Get vote and comment counts
    const [upVotes, downVotes, commentsCount] = await Promise.all([
      (prisma as any).votes?.count({
        where: {
          entityType: 'IDEA',
          entityId: idea.id,
          value: 'UP',
        },
      }) || 0,
      (prisma as any).votes?.count({
        where: {
          entityType: 'IDEA',
          entityId: idea.id,
          value: 'DOWN',
        },
      }) || 0,
      (prisma as any).comments?.count({
        where: {
          entityType: 'IDEA',
          entityId: idea.id,
        },
      }) || 0,
    ]);

    // Map Idea model fields to frontend interface
    const mappedIdea = {
      id: idea.id,
      title: idea.title || 'Untitled Idea',
      description: idea.description,
      origin: idea.origin || 'ai',
      status: idea.status || 'draft',
      votes: idea.votes || 0,
      confidence: idea.confidence || 0,
      evidenceJson: idea.evidenceJson,
      tagsJson: idea.tagsJson,
      createdAt: idea.createdAt.toISOString(),
      hotspot: idea.hotspot,
      creator: idea.users,
      _count: {
        upVotes,
        downVotes,
        comments: commentsCount,
      },
    };

    return NextResponse.json({
      idea: mappedIdea,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Idea detail API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
