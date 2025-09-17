/**
 * Apply clustering features migration to Preview database
 * Expert: Morgan Smith (Database Architect)
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('📊 Connected to Preview database');

    // Read migration SQL
    const migrationPath = path.join(
      __dirname,
      '../prisma/migrations/20250917165000_add_clustering_features/migration.sql'
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔧 Applying clustering features migration...');
    console.log('Migration SQL:', migrationSQL);

    // Execute migration
    await client.query(migrationSQL);

    console.log('✅ Migration applied successfully!');

    // Verify columns exist
    const signalColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'signals' 
      AND column_name IN ('clusteringFeaturesJson', 'lastFeaturesGeneratedAt', 'featuresVersion', 'featuresQualityScore')
      ORDER BY column_name;
    `);

    const hotspotColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'hotspots' 
      AND column_name IN ('clusteringResults', 'lastClusteredAt', 'clusteringVersion', 'clusteringQualityScore')
      ORDER BY column_name;
    `);

    console.log(
      '📊 Signal columns added:',
      signalColumns.rows.map(r => r.column_name)
    );
    console.log(
      '📊 Hotspot columns added:',
      hotspotColumns.rows.map(r => r.column_name)
    );
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
