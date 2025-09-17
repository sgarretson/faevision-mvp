#!/usr/bin/env npx tsx

/**
 * Check Enhanced Tagging Status
 * Expert: Dr. Rachel Kim (AI Tagging Specialist)
 * Check if signals have been processed through enhanced tagging system
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🏷️ Checking Enhanced Tagging Status...\n');

  try {
    // Get total signal count
    const totalSignals = await (prisma as any).signal?.count() || 0;
    console.log(`📊 Total Signals: ${totalSignals}`);

    if (totalSignals === 0) {
      console.log('❌ No signals found in database');
      return;
    }

    // Check enhanced tagging fields
    const enhancedTaggedSignals = await (prisma as any).signal?.count({
      where: {
        enhancedTagsJson: { not: null }
      }
    }) || 0;

    const lastTaggedSignals = await (prisma as any).signal?.count({
      where: {
        lastTaggedAt: { not: null }
      }
    }) || 0;

    const domainClassifiedSignals = await (prisma as any).signal?.count({
      where: {
        domainClassification: { not: null }
      }
    }) || 0;

    // Get sample of signals with enhanced tagging
    const sampleSignals = await (prisma as any).signal?.findMany({
      take: 3,
      where: {
        enhancedTagsJson: { not: null }
      },
      select: {
        id: true,
        title: true,
        enhancedTagsJson: true,
        domainClassification: true,
        lastTaggedAt: true,
        tagModelVersion: true
      }
    }) || [];

    console.log('\n🏷️ ENHANCED TAGGING STATUS:');
    console.log(`   Enhanced Tags Applied: ${enhancedTaggedSignals}/${totalSignals} (${((enhancedTaggedSignals/totalSignals)*100).toFixed(1)}%)`);
    console.log(`   Last Tagged: ${lastTaggedSignals}/${totalSignals} (${((lastTaggedSignals/totalSignals)*100).toFixed(1)}%)`);
    console.log(`   Domain Classified: ${domainClassifiedSignals}/${totalSignals} (${((domainClassifiedSignals/totalSignals)*100).toFixed(1)}%)`);

    if (sampleSignals.length > 0) {
      console.log('\n📝 SAMPLE ENHANCED TAGS:');
      sampleSignals.forEach((signal, i) => {
        console.log(`   ${i+1}. "${signal.title}"`);
        console.log(`      Domain: ${signal.domainClassification || 'Not classified'}`);
        console.log(`      Tagged: ${signal.lastTaggedAt ? signal.lastTaggedAt.toISOString() : 'Never'}`);
        console.log(`      Model: ${signal.tagModelVersion || 'Unknown'}`);
        if (signal.enhancedTagsJson) {
          const tags = signal.enhancedTagsJson as any;
          console.log(`      Tags: ${JSON.stringify(tags, null, 8)}`);
        }
        console.log('');
      });
    }

    // Check database schema capabilities
    console.log('\n🗄️ DATABASE SCHEMA CHECK:');
    try {
      const schemaCheck = await (prisma as any).signal?.findFirst({
        select: {
          clusteringFeaturesJson: true,
          lastFeaturesGeneratedAt: true,
          featuresVersion: true,
          featuresQualityScore: true
        }
      });
      console.log('✅ Clustering features columns exist');
    } catch (error: any) {
      if (error.code === 'P2022') {
        console.log('❌ Clustering features columns MISSING');
        console.log(`   Error: ${error.message}`);
      } else {
        console.log(`⚠️  Database schema check failed: ${error.message}`);
      }
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (enhancedTaggedSignals === 0) {
      console.log('❗ Run batch tagging: POST /api/signals/batch-tag-generation');
    } else if (enhancedTaggedSignals < totalSignals) {
      console.log(`❗ ${totalSignals - enhancedTaggedSignals} signals need enhanced tagging`);
      console.log('  Run: POST /api/signals/batch-tag-generation');
    } else {
      console.log('✅ All signals have enhanced tagging applied');
    }

  } catch (error) {
    console.error('❌ Error checking enhanced tagging status:', error);
  }
}

main()
  .catch(e => {
    console.error('❌ Script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
