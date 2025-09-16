import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Hotspot Detail API Route
 *
 * Handles individual hotspot details:
 * - GET: Retrieve detailed hotspot information
 * - Includes related signals and generated ideas
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
        { error: 'Hotspot ID is required' },
        { status: 400 }
      );
    }

    // Get hotspot with related data
    const hotspot = await (prisma as any).hotspot?.findUnique({
      where: { id },
      include: {
        signals: {
          include: {
            signal: {
              select: {
                id: true,
                title: true,
                description: true,
                severity: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            signal: {
              createdAt: 'desc',
            },
          },
        },
        ideas: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            confidence: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            signals: true,
            ideas: true,
            solutions: true,
          },
        },
      },
    });

    if (!hotspot) {
      return NextResponse.json({ error: 'Hotspot not found' }, { status: 404 });
    }

    // Format the response
    const formattedHotspot = {
      id: hotspot.id,
      title: hotspot.title,
      summary: hotspot.summary,
      status: hotspot.status || 'active',
      confidence: hotspot.confidence || 0.8,
      priority: hotspot.priority || 'MEDIUM',
      createdAt: hotspot.createdAt.toISOString(),
      updatedAt: hotspot.updatedAt.toISOString(),
      _count: hotspot._count,
      signals: hotspot.signals || [],
      ideas: hotspot.ideas || [],
    };

    return NextResponse.json({
      success: true,
      hotspot: formattedHotspot,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get hotspot detail error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
