/**
 * EMERGENCY Schema Fix API
 * Expert: Morgan Smith (Database Architect) + Jordan Kim (Vercel Engineer)
 * 
 * Manually apply clustering features migration when automatic migration fails
 * Route: POST /api/admin/apply-schema-fix
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route since it uses auth() which requires headers
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user - only admins can run schema fixes
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    // Admin check (in production, check for admin role)
    if (session.user.email !== 'sarah.executive@faevision.com') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    console.log('🔧 Emergency schema fix initiated by:', session.user.email);

    // Test if columns already exist
    let columnsExist = false;
    try {
      await prisma.$queryRaw`
        SELECT clusteringFeaturesJson 
        FROM signals 
        LIMIT 1
      `;
      columnsExist = true;
    } catch (error: any) {
      if (error.code === 'P2022' || error.message.includes('does not exist')) {
        columnsExist = false;
      } else {
        throw error;
      }
    }

    if (columnsExist) {
      return NextResponse.json({
        success: true,
        message: 'Schema columns already exist - no fix needed',
        timestamp: new Date().toISOString()
      });
    }

    console.log('📋 Applying clustering features columns...');

    // Apply the migration SQL directly
    await prisma.$executeRaw`
      ALTER TABLE "public"."signals" 
      ADD COLUMN IF NOT EXISTS "clusteringFeaturesJson" JSONB,
      ADD COLUMN IF NOT EXISTS "lastFeaturesGeneratedAt" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "featuresVersion" TEXT,
      ADD COLUMN IF NOT EXISTS "featuresQualityScore" DOUBLE PRECISION
    `;

    await prisma.$executeRaw`
      ALTER TABLE "public"."hotspots"
      ADD COLUMN IF NOT EXISTS "clusteringResults" JSONB,
      ADD COLUMN IF NOT EXISTS "lastClusteredAt" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "clusteringVersion" TEXT,
      ADD COLUMN IF NOT EXISTS "clusteringQualityScore" DOUBLE PRECISION
    `;

    console.log('✅ Schema fix applied successfully');

    // Verify the fix worked
    try {
      await prisma.$queryRaw`
        SELECT clusteringFeaturesJson, clusteringResults 
        FROM signals s
        LEFT JOIN hotspots h ON true
        LIMIT 1
      `;
      
      return NextResponse.json({
        success: true,
        message: 'Schema columns added successfully - AI analysis should now work',
        applied: [
          'signals.clusteringFeaturesJson',
          'signals.lastFeaturesGeneratedAt', 
          'signals.featuresVersion',
          'signals.featuresQualityScore',
          'hotspots.clusteringResults',
          'hotspots.lastClusteredAt',
          'hotspots.clusteringVersion',
          'hotspots.clusteringQualityScore'
        ],
        timestamp: new Date().toISOString()
      });
    } catch (verifyError) {
      throw new Error(`Schema fix failed verification: ${verifyError}`);
    }

  } catch (error: any) {
    console.error('❌ Schema fix failed:', error);
    
    return NextResponse.json(
      {
        error: 'Schema fix failed',
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
