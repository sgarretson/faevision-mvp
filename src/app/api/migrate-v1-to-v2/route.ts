import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

/**
 * Emergency V1 to V2 Schema Migration API
 *
 * This endpoint handles the data migration from V1 to V2 schema
 * by updating existing data to match new enum values before
 * applying the new schema.
 *
 * Expert: Database Architect (Morgan Smith)
 * Support: Vercel Engineer (Jordan Kim)
 */

export async function POST() {
  try {
    // Use raw Prisma client (not generated) for migration
    const prisma = new PrismaClient();

    console.log('🔄 Starting V1 to V2 migration...');

    // Step 1: Update Input status values to match V2 enum
    const statusUpdates = await prisma.$executeRaw`
      UPDATE inputs 
      SET status = 'ACTIVE' 
      WHERE status IN ('NEW', 'DISCUSSING', 'ORGANIZED')
    `;

    const resolvedUpdates = await prisma.$executeRaw`
      UPDATE inputs 
      SET status = 'RESOLVED' 
      WHERE status = 'IN_SOLUTION'
    `;

    console.log(`✅ Updated ${statusUpdates} inputs to ACTIVE status`);
    console.log(`✅ Updated ${resolvedUpdates} inputs to RESOLVED status`);

    // Step 2: Clean up any orphaned data
    const cleanupResult = await prisma.$executeRaw`
      DELETE FROM inputs WHERE status NOT IN ('ACTIVE', 'RESOLVED', 'DUPLICATE')
    `;

    console.log(`🧹 Cleaned up ${cleanupResult} orphaned records`);

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'V1 to V2 migration completed successfully',
      updates: {
        statusUpdates: Number(statusUpdates),
        resolvedUpdates: Number(resolvedUpdates),
        cleanupResult: Number(cleanupResult),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Migration error:', error);

    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    info: 'V1 to V2 Migration Endpoint',
    usage: 'POST to this endpoint to migrate data from V1 to V2 schema',
    status: 'Ready for migration',
  });
}
