/**
 * Emergency Schema Fix Script - Direct Prisma Connection
 * Database Architect: Morgan Smith + Vercel Engineer: Jordan Kim
 *
 * Applies missing clustering features to Preview database
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.preview
function loadPreviewEnv() {
  const envPath = path.join(process.cwd(), '.env.preview');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = envFile
      .split('\n')
      .filter(line => line.includes('=') && !line.startsWith('#'));

    for (const line of envVars) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=');
        // Remove quotes and handle multiline values
        value = value.replace(/^["']|["']$/g, '').replace(/\\n$/, '');
        process.env[key] = value;
      }
    }

    console.log('✅ Loaded Preview environment variables');
    console.log(
      `🔗 Using database: ${process.env.PRISMA_DATABASE_URL ? 'Prisma Accelerate' : 'Direct connection'}`
    );
  } else {
    console.log('⚠️  .env.preview not found, using default environment');
  }
}

// Load environment first
loadPreviewEnv();

// Debug environment variables
console.log('🔍 Environment check:');
console.log(
  `   DATABASE_URL: ${process.env.DATABASE_URL?.substring(0, 50)}...`
);
console.log(
  `   PRISMA_DATABASE_URL: ${process.env.PRISMA_DATABASE_URL?.substring(0, 50)}...`
);

// Initialize Prisma client with explicit URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

async function applyClusteringSchemaFix() {
  console.log('🔧 Emergency Schema Fix - Adding Clustering Features');
  console.log(
    '📋 Database Architect: Morgan Smith + Vercel Engineer: Jordan Kim'
  );
  console.log('');

  try {
    console.log('🔍 Testing current database connection...');
    await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log('✅ Database connection successful');
    console.log('');

    // Test if columns already exist
    let columnsExist = false;
    try {
      console.log('🔍 Checking if clustering columns already exist...');
      await prisma.$queryRaw`
        SELECT clusteringFeaturesJson, clusteringResults 
        FROM signals s
        LEFT JOIN hotspots h ON true
        LIMIT 1
      `;
      columnsExist = true;
      console.log('✅ Clustering columns already exist - no fix needed');
    } catch (error: any) {
      if (error.code === 'P2022' || error.message.includes('does not exist')) {
        console.log('⚠️  Clustering columns missing - applying fix...');
        columnsExist = false;
      } else {
        throw error;
      }
    }

    if (columnsExist) {
      console.log('🎉 Schema is already up to date!');
      return;
    }

    console.log('');
    console.log('📋 Applying clustering features migration...');

    // Apply signals table columns
    console.log('📝 Adding clustering features to signals table...');
    await prisma.$executeRaw`
      ALTER TABLE "public"."signals" 
      ADD COLUMN IF NOT EXISTS "clusteringFeaturesJson" JSONB,
      ADD COLUMN IF NOT EXISTS "lastFeaturesGeneratedAt" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "featuresVersion" TEXT,
      ADD COLUMN IF NOT EXISTS "featuresQualityScore" DOUBLE PRECISION
    `;
    console.log('✅ signals table updated');

    // Apply hotspots table columns
    console.log('📝 Adding clustering results to hotspots table...');
    await prisma.$executeRaw`
      ALTER TABLE "public"."hotspots"
      ADD COLUMN IF NOT EXISTS "clusteringResults" JSONB,
      ADD COLUMN IF NOT EXISTS "lastClusteredAt" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "clusteringVersion" TEXT,
      ADD COLUMN IF NOT EXISTS "clusteringQualityScore" DOUBLE PRECISION
    `;
    console.log('✅ hotspots table updated');

    console.log('');
    console.log('🔍 Verifying schema fix...');

    // Verify the fix worked
    await prisma.$queryRaw`
      SELECT clusteringFeaturesJson, clusteringResults 
      FROM signals s
      LEFT JOIN hotspots h ON true
      LIMIT 1
    `;

    console.log('✅ Schema verification successful');
    console.log('');
    console.log('🎉 CLUSTERING SCHEMA FIX COMPLETE!');
    console.log('');
    console.log('✅ Added to signals table:');
    console.log('   - clusteringFeaturesJson (JSONB)');
    console.log('   - lastFeaturesGeneratedAt (TIMESTAMP)');
    console.log('   - featuresVersion (TEXT)');
    console.log('   - featuresQualityScore (DOUBLE PRECISION)');
    console.log('');
    console.log('✅ Added to hotspots table:');
    console.log('   - clusteringResults (JSONB)');
    console.log('   - lastClusteredAt (TIMESTAMP)');
    console.log('   - clusteringVersion (TEXT)');
    console.log('   - clusteringQualityScore (DOUBLE PRECISION)');
    console.log('');
    console.log('🚀 AI Analysis should now work properly!');
  } catch (error: any) {
    console.error('❌ Schema fix failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    if (error.code === 'P1001') {
      console.error('');
      console.error('🔗 Database connection failed. Please check:');
      console.error('   - DATABASE_URL environment variable is set');
      console.error('   - Network connectivity to Vercel Postgres');
      console.error('   - Database credentials are correct');
    }

    throw error;
  }
}

async function main() {
  try {
    await applyClusteringSchemaFix();
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(async e => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
