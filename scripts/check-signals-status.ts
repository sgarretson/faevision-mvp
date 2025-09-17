/**
 * Check Signals Status - Database Diagnostic
 * Database Architect: Morgan Smith
 *
 * Check the current state of signals and clustering features
 */

import { PrismaClient } from '../src/generated/prisma';
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
        value = value.replace(/^["']|["']$/g, '').replace(/\\n$/, '');
        process.env[key] = value;
      }
    }
    console.log('✅ Loaded Preview environment variables');
  } else {
    console.log('⚠️  .env.preview not found, using default environment');
  }
}

// Load environment first
loadPreviewEnv();

// Initialize Prisma client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

async function checkSignalsStatus() {
  try {
    console.log('🔍 Checking signals status in Preview database...');
    console.log('');

    // Count total signals
    const totalSignals = await (prisma as any).signal.count();
    console.log(`📊 Total signals in database: ${totalSignals}`);

    if (totalSignals === 0) {
      console.log('❌ No signals found in database!');
      console.log('💡 You need to seed the database with signals first.');
      return;
    }

    // Count signals with clustering features
    let signalsWithFeatures = 0;
    try {
      signalsWithFeatures = await (prisma as any).signal.count({
        where: {
          clusteringFeaturesJson: { not: null },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2022') {
        console.log('⚠️  clusteringFeaturesJson column still missing!');
        return;
      }
      throw error;
    }

    console.log(`🎯 Signals with clustering features: ${signalsWithFeatures}`);
    console.log(
      `📈 Signals missing clustering features: ${totalSignals - signalsWithFeatures}`
    );
    console.log('');

    // Sample a few signals to check their status
    const sampleSignals = await (prisma as any).signal.findMany({
      take: 3,
      select: {
        id: true,
        title: true,
        clusteringFeaturesJson: true,
        enhancedTagsJson: true,
        aiTagsJson: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('📋 Sample signals status:');
    for (const signal of sampleSignals) {
      console.log(`   📄 ${signal.title.substring(0, 50)}...`);
      console.log(`      - ID: ${signal.id}`);
      console.log(
        `      - Has clustering features: ${signal.clusteringFeaturesJson ? '✅' : '❌'}`
      );
      console.log(
        `      - Has enhanced tags: ${signal.enhancedTagsJson ? '✅' : '❌'}`
      );
      console.log(`      - Has AI tags: ${signal.aiTagsJson ? '✅' : '❌'}`);
      console.log('');
    }

    // Check if clustering can proceed
    if (signalsWithFeatures >= 2) {
      console.log(
        '✅ Ready for clustering! You have enough signals with features.'
      );
    } else if (totalSignals >= 2) {
      console.log(
        '⚠️  Need to generate clustering features for existing signals.'
      );
      console.log('💡 Run the batch feature generation API first.');
    } else {
      console.log('❌ Need more signals in the database for clustering.');
    }
  } catch (error: any) {
    console.error('❌ Failed to check signals status:', error);
    console.error('Error code:', error.code);
  }
}

async function main() {
  try {
    await checkSignalsStatus();
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(async e => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
