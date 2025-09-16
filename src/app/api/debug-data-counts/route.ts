import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Debug Data Counts - Check what data exists in database
 * Emergency diagnostic endpoint to verify seed data deployment
 */

export async function GET(request: NextRequest) {
  try {
    // V1 models are deprecated - all data should be V2
    const v1Counts = {
      inputs: 0, // V1 Input model deprecated - use Signal
      solutions: 0, // V1 Solution model deprecated - use V2 Solution
      comments: 0, // V1 Comment model deprecated - use V2 Comment
      votes: 0, // V1 Vote model deprecated - use V2 Vote
      users: (await (prisma as any).user?.count()) || 0, // User model still used
    };

    // Check V2 model counts (Signal, Hotspot, Idea, etc.)
    const v2Counts = {
      signals: (await (prisma as any).signal?.count()) || 0,
      hotspots: (await (prisma as any).hotspot?.count()) || 0,
      ideas: (await (prisma as any).idea?.count()) || 0,
      departments: (await (prisma as any).department?.count()) || 0,
      teams: (await (prisma as any).team?.count()) || 0,
      categories: (await (prisma as any).category?.count()) || 0,
      initiatives: (await (prisma as any).initiative?.count()) || 0,
    };

    // Sample some data
    const sampleUsers =
      (await (prisma as any).user?.findMany({
        take: 3,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      })) || [];

    const sampleSignals =
      (await (prisma as any).signal?.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          description: true,
          severity: true,
          createdAt: true,
        },
      })) || [];

    // V1 Input model deprecated - no sample data needed
    const sampleInputs: any[] = [];

    return NextResponse.json({
      success: true,
      environment: process.env.VERCEL_ENV || 'development',
      database: process.env.POSTGRES_URL ? 'Connected' : 'Not configured',
      v1Counts,
      v2Counts,
      totalCounts: {
        v1Total: Object.values(v1Counts).reduce(
          (sum: number, count: any) => sum + (count || 0),
          0
        ),
        v2Total: Object.values(v2Counts).reduce(
          (sum: number, count: any) => sum + (count || 0),
          0
        ),
      },
      samples: {
        users: sampleUsers,
        signals: sampleSignals,
        inputs: sampleInputs,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug data counts error:', error);
    return NextResponse.json(
      {
        error: 'Database access error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
