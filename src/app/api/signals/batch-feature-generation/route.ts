/**
 * Batch Feature Generation API - Sprint 2
 * Expert: Dr. Elena Rodriguez (Clustering)
 *
 * Route: POST /api/signals/batch-feature-generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const start = Date.now();
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'EXECUTIVE'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or Executive role required' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const max = Number(body?.maxSignals ?? 500);
    const force = Boolean(body?.forceRegenerate ?? false);

    const where: any = {};
    if (!force) {
      where.clusteringFeaturesJson = null;
    }

    const signals = await (prisma as any).signals.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        severity: true,
        department: { select: { name: true } },
        team: { select: { name: true } },
        category: { select: { name: true } },
        metricsJson: true,
        impactJson: true,
        tagsJson: true,
        enhancedTagsJson: true,
      },
      orderBy: { createdAt: 'desc' },
      take: max,
    });

    let ok = 0;
    const failed: any[] = [];

    for (const s of signals) {
      try {
        await fetch(
          `${process.env.NEXTAUTH_URL || ''}/api/signals/${s.id}/generate-features`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ forceRegenerate: force }),
          }
        );
        ok++;
      } catch (e: any) {
        failed.push({ id: s.id, error: e?.message || 'request failed' });
      }
    }

    return NextResponse.json({
      success: true,
      processed: ok,
      failed,
      totalCandidates: signals.length,
      processingTime: Date.now() - start,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
