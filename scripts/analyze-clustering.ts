#!/usr/bin/env npx tsx

/**
 * Analyze Current Clustering Results
 * AI Architect: Dr. Priya Patel
 * Purpose: Examine why all 21 signals clustered into 1 hotspot
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Analyzing Current Clustering Results...\n');

  // Get all signals with their tags
  const signals = await prisma.signal.findMany({
    select: {
      id: true,
      inputId: true,
      title: true,
      severity: true,
      tagsJson: true,
      departmentId: true,
      department: {
        select: { name: true },
      },
    },
    orderBy: { inputId: 'asc' },
  });

  console.log(`📊 Total Signals: ${signals.length}\n`);

  // Get all hotspots and their signals
  const hotspots = await prisma.hotspot.findMany({
    include: {
      signals: {
        include: {
          signal: {
            select: {
              id: true,
              inputId: true,
              title: true,
              tagsJson: true,
            },
          },
        },
      },
    },
  });

  console.log(`🌟 Total Hotspots: ${hotspots.length}\n`);

  // Analyze each hotspot
  hotspots.forEach((hotspot, index) => {
    console.log(`🌟 Hotspot ${index + 1}: ${hotspot.title}`);
    console.log(`   ID: ${hotspot.id}`);
    console.log(`   Status: ${hotspot.status}`);
    console.log(`   Confidence: ${hotspot.confidence}`);
    console.log(
      `   Clustering Method: ${hotspot.clusteringMethod || 'Not specified'}`
    );
    console.log(`   Signals Count: ${hotspot.signals.length}`);
    console.log('   Signals:');

    hotspot.signals.forEach((hs, i) => {
      const signal = hs.signal;
      const tags = signal.tagsJson as any;
      console.log(
        `     ${i + 1}. ${signal.inputId}: ${signal.title?.substring(0, 50)}...`
      );
      console.log(`        Root Cause: ${tags?.rootCause || 'Unknown'}`);
      console.log(`        Issue Type: ${tags?.issueType || 'Unknown'}`);
    });
    console.log('');
  });

  // Analyze root cause distribution
  console.log('📊 ROOT CAUSE ANALYSIS:');
  const rootCauses: Record<string, number> = {};
  const issueTypes: Record<string, number> = {};
  const departments: Record<string, number> = {};

  signals.forEach(signal => {
    const tags = signal.tagsJson as any;
    const rootCause = tags?.rootCause || 'Unknown';
    const issueType = tags?.issueType || 'Unknown';
    const dept = signal.department?.name || 'Unknown';

    rootCauses[rootCause] = (rootCauses[rootCause] || 0) + 1;
    issueTypes[issueType] = (issueTypes[issueType] || 0) + 1;
    departments[dept] = (departments[dept] || 0) + 1;
  });

  console.log('\n🎯 Root Cause Distribution:');
  Object.entries(rootCauses).forEach(([cause, count]) => {
    console.log(`   ${cause}: ${count} signals`);
  });

  console.log('\n🏷️ Issue Type Distribution:');
  Object.entries(issueTypes).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} signals`);
  });

  console.log('\n🏢 Department Distribution:');
  Object.entries(departments).forEach(([dept, count]) => {
    console.log(`   ${dept}: ${count} signals`);
  });

  // Analysis of why clustering failed
  console.log('\n🚨 CLUSTERING ANALYSIS:');
  console.log('❌ PROBLEM: All 21 signals clustered into 1 hotspot');
  console.log('\n🔍 POTENTIAL CAUSES:');

  if (Object.keys(rootCauses).length <= 2) {
    console.log('   • Too few distinct root causes for meaningful clustering');
  }

  if (signals.length < 30) {
    console.log('   • Insufficient data volume for statistical clustering');
  }

  console.log('   • Similarity threshold may be too permissive');
  console.log('   • Text embeddings may be too generic');
  console.log('   • HDBSCAN parameters not optimized for this domain');

  console.log('\n💡 RECOMMENDATIONS:');
  console.log(
    '   1. Implement semantic text analysis for root cause detection'
  );
  console.log('   2. Use structured tagging for better clustering features');
  console.log('   3. Adjust clustering parameters (min_cluster_size, eps)');
  console.log('   4. Consider supervised pre-clustering by domain experts');
  console.log('   5. Implement multi-dimensional similarity scoring');

  console.log('\n🎯 IDEAL CLUSTERING OUTPUT:');
  console.log(
    `   • Expected: 4-6 clusters based on ${Object.keys(rootCauses).length} root causes`
  );
  console.log('   • Process Issues (5-7 signals)');
  console.log('   • Resource Issues (4-6 signals)');
  console.log('   • Communication Issues (3-5 signals)');
  console.log('   • Technology Issues (2-4 signals)');
}

main()
  .catch(e => {
    console.error('❌ Error analyzing clustering:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
