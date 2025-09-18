import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getHotspotsWithSignals,
  getHotspotsCount,
} from '@/lib/data-access/relationship-resolver';

/**
 * Hotspots API Endpoint
 *
 * RESTful API for hotspot management:
 * - GET: List all active hotspots with filtering
 * - POST: Create new hotspot manually
 * - Optimized for executive dashboard consumption
 *
 * Expert: Alex Thompson (Lead Developer)
 * Support: Dr. Priya Patel (AI Architect)
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Try V2 Hotspot model first
    try {
      const where = status
        ? { status: status.toUpperCase() }
        : {
            status: { in: ['OPEN', 'APPROVED'] },
          };

      // Get hotspots with full signal relationships - RESTORED FUNCTIONALITY
      const hotspotsWithSignals = await getHotspotsWithSignals({
        where,
        limit,
        offset,
      });

      const totalCount = await getHotspotsCount(where);

      // Format for frontend with all robust data
      const formattedHotspots = hotspotsWithSignals;

      return NextResponse.json({
        success: true,
        hotspots: formattedHotspots,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Fallback for legacy schema - return mock data or empty array
      console.log('⚠️ Hotspot model not available, using fallback');

      return NextResponse.json({
        success: true,
        hotspots: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false,
        },
        message:
          'Hotspot clustering not yet configured. Run clustering to generate hotspots.',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error fetching hotspots:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch hotspots',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, summary, signalIds } = body;

    if (!title || !summary) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and summary are required',
        },
        { status: 400 }
      );
    }

    // Try V2 Hotspot model
    try {
      const hotspot = await (prisma as any).hotspots.create({
        data: {
          title,
          summary,
          status: 'OPEN',
          rankScore: 0.5, // Default ranking
          confidence: 0.8, // Manual creation confidence
          clusteringMethod: 'manual',
          similarityThreshold: null,
          linkedEntitiesJson: [],
        },
      });

      // Add signal relationships if provided
      if (signalIds && Array.isArray(signalIds)) {
        await Promise.all(
          signalIds.map((signalId: string) =>
            (prisma as any).hotspotSignal.create({
              data: {
                hotspotId: hotspot.id,
                signalId,
                membershipStrength: 1.0, // Manual assignment = 100% strength
                isOutlier: false,
              },
            })
          )
        );
      }

      return NextResponse.json({
        success: true,
        hotspot: {
          id: hotspot.id,
          title: hotspot.title,
          summary: hotspot.summary,
          status: hotspot.status,
          rankScore: hotspot.rankScore,
          confidence: hotspot.confidence,
          // signalCount is calculated from relationships, not stored
          linkedEntities: [],
          createdAt: hotspot.createdAt.toISOString(),
          updatedAt: hotspot.updatedAt.toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Fallback for legacy schema
      return NextResponse.json(
        {
          success: false,
          error: 'Hotspot creation not available in current schema version',
        },
        { status: 501 }
      );
    }
  } catch (error) {
    console.error('Error creating hotspot:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create hotspot',
      },
      { status: 500 }
    );
  }
}
