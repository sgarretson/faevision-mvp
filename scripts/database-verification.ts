#!/usr/bin/env tsx
/**
 * Database Verification Script
 *
 * Verifies current state of Vercel Prisma database and identifies issues
 *
 * Expert: Morgan Smith (Database Architect)
 * Support: Dr. Priya Patel (AI Architect)
 */

import { PrismaClient } from '../src/generated/prisma';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
});

async function main() {
  console.log('🔍 Database Verification - Vercel Prisma Database...\n');
  console.log('🔗 Using Prisma Accelerate connection...\n');

  try {
    // Test basic connection
    console.log('📡 Step 1: Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Check table record counts
    console.log('📊 Step 2: Analyzing table record counts...');
    const stats = await getDatabaseStats();

    console.log('📋 Database Record Summary:');
    Object.entries(stats).forEach(([table, count]) => {
      const status = count > 0 ? '✅' : '⚠️';
      console.log(`  ${status} ${table}: ${count}`);
    });

    // Analyze AI processing state
    console.log('\n🤖 Step 3: AI Processing Analysis...');
    await analyzeAIProcessingState();

    // Check data quality
    console.log('\n📈 Step 4: Data Quality Assessment...');
    await analyzeDataQuality();

    console.log('\n✅ Database verification complete!');
  } catch (error) {
    console.error('❌ Database verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function getDatabaseStats() {
  const tableQueries = [
    { name: 'users', query: () => prisma.users.count() },
    { name: 'departments', query: () => prisma.departments.count() },
    { name: 'teams', query: () => prisma.teams.count() },
    { name: 'categories', query: () => prisma.categories.count() },
    { name: 'initiatives', query: () => prisma.initiatives.count() },
    {
      name: 'strategic_inputs',
      query: () => (prisma as any).strategic_inputs.count(),
    },
    { name: 'signals', query: () => (prisma as any).signals.count() },
    { name: 'hotspots', query: () => (prisma as any).hotspots.count() },
    { name: 'ideas', query: () => (prisma as any).ideas.count() },
    { name: 'solutions', query: () => (prisma as any).solutions.count() },
    { name: 'votes', query: () => (prisma as any).votes.count() },
    { name: 'comments', query: () => (prisma as any).comments.count() },
  ];

  const stats: Record<string, number> = {};

  for (const table of tableQueries) {
    try {
      stats[table.name] = await table.query();
    } catch (error) {
      console.warn(`⚠️ Error counting ${table.name}:`, error);
      stats[table.name] = -1; // Indicate error
    }
  }

  return stats;
}

async function analyzeAIProcessingState() {
  try {
    const totalSignals = await (prisma as any).signals.count();

    if (totalSignals === 0) {
      console.log('⚠️ No signals found in database');
      return;
    }

    // Check domain classification progress
    const domainClassified = await (prisma as any).signals.count({
      where: {
        domainClassification: {
          not: null,
        },
      },
    });

    // Check feature engineering progress
    const featureEngineered = await (prisma as any).signals.count({
      where: {
        clusteringFeaturesJson: {
          not: null,
        },
      },
    });

    // Check AI processing flags
    const aiProcessed = await (prisma as any).signals.count({
      where: {
        aiProcessed: true,
      },
    });

    console.log(`📊 AI Processing Progress:`);
    console.log(`  📈 Total Signals: ${totalSignals}`);
    console.log(
      `  🧠 Domain Classified: ${domainClassified}/${totalSignals} (${((domainClassified / totalSignals) * 100).toFixed(1)}%)`
    );
    console.log(
      `  ⚙️ Feature Engineered: ${featureEngineered}/${totalSignals} (${((featureEngineered / totalSignals) * 100).toFixed(1)}%)`
    );
    console.log(
      `  🤖 AI Processed: ${aiProcessed}/${totalSignals} (${((aiProcessed / totalSignals) * 100).toFixed(1)}%)`
    );

    // Sample a signal to check data structure
    const sampleSignal = await (prisma as any).signals.findFirst({
      include: {
        departments: true,
        teams: true,
        categories: true,
      },
    });

    if (sampleSignal) {
      console.log(`\n🔍 Sample Signal Analysis (${sampleSignal.id}):`);
      console.log(`  Title: "${sampleSignal.title}"`);
      console.log(
        `  Description Length: ${sampleSignal.description?.length || 0} chars`
      );
      console.log(`  Department: ${sampleSignal.departments?.name || 'None'}`);
      console.log(`  Severity: ${sampleSignal.severity}`);
      console.log(
        `  Domain Classification: ${sampleSignal.domainClassification ? 'Present' : 'Missing'}`
      );
      console.log(
        `  Clustering Features: ${sampleSignal.clusteringFeaturesJson ? 'Present' : 'Missing'}`
      );
    }
  } catch (error) {
    console.warn('⚠️ AI processing analysis failed:', error);
  }
}

async function analyzeDataQuality() {
  try {
    // Check input-signal relationship
    const inputsWithSignals = await (prisma as any).strategic_inputs.count({
      where: {
        signals: {
          some: {},
        },
      },
    });

    const totalInputs = await (prisma as any).strategic_inputs.count();

    // Check hotspot-signal relationships
    const hotspotsWithSignals = await (prisma as any).hotspots.count({
      where: {
        hotspot_signals: {
          some: {},
        },
      },
    });

    const totalHotspots = await (prisma as any).hotspots.count();

    console.log(`📋 Data Quality Metrics:`);
    console.log(
      `  🔗 Inputs with Signals: ${inputsWithSignals}/${totalInputs}`
    );
    console.log(
      `  🔥 Hotspots with Signals: ${hotspotsWithSignals}/${totalHotspots}`
    );

    // Check for orphaned records
    const orphanedSignals = await (prisma as any).signals.count({
      where: {
        strategic_inputs: null,
      },
    });

    if (orphanedSignals > 0) {
      console.log(`  ⚠️ Orphaned Signals: ${orphanedSignals}`);
    }
  } catch (error) {
    console.warn('⚠️ Data quality analysis failed:', error);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export default main;
