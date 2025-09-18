#!/usr/bin/env tsx
/**
 * Test Dashboard Metrics with Current Seed Data
 *
 * Verifies Dashboard API fix shows real data instead of 0s
 * Tests with existing minimal seed data (3 signals, 3 hotspots, etc.)
 */

import { prisma } from '../src/lib/prisma';

async function testDashboardMetrics() {
  console.log('📊 TESTING DASHBOARD METRICS WITH EXISTING SEED DATA\n');

  try {
    // Simulate Dashboard API queries (now with correct table names)
    console.log('🔍 Testing Dashboard API queries...\n');

    const [
      totalSignals,
      totalHotspots,
      totalIdeas,
      totalSolutions,
      totalVotes,
      totalComments,
      totalUsers,
    ] = await Promise.all([
      (prisma as any).signals?.count() || 0,
      (prisma as any).hotspots?.count() || 0,
      (prisma as any).ideas?.count() || 0,
      (prisma as any).solutions?.count() || 0,
      (prisma as any).votes?.count() || 0,
      (prisma as any).comments?.count() || 0,
      (prisma as any).users?.count() || 0,
    ]);

    console.log('📈 DASHBOARD METRICS RESULTS:');
    console.log(`   📊 Total Inputs (Signals): ${totalSignals}`);
    console.log(`   🔥 Total Hotspots: ${totalHotspots}`);
    console.log(`   💡 Total Ideas: ${totalIdeas}`);
    console.log(`   🛠️ Total Solutions: ${totalSolutions}`);
    console.log(`   👍 Total Votes: ${totalVotes}`);
    console.log(`   💬 Total Comments: ${totalComments}`);
    console.log(`   👥 Total Users: ${totalUsers}\n`);

    // Test engagement calculation
    const totalEngagement = totalVotes + totalComments;
    console.log(
      `🎯 CALCULATED ENGAGEMENT: ${totalEngagement} (votes + comments)\n`
    );

    // Test recent signals query
    console.log('🕒 Testing Recent Signals Query...');
    const recentSignals =
      (await (prisma as any).signals?.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          createdBy: {
            select: { name: true, email: true },
          },
        },
      })) || [];

    console.log(`   📋 Recent Signals Found: ${recentSignals.length}`);
    recentSignals.forEach((signal: any, index: number) => {
      console.log(
        `   ${index + 1}. ${signal.title || 'Untitled'} - ${signal.createdBy?.name || 'Unknown'}`
      );
    });

    console.log('\n✅ DASHBOARD METRICS TEST COMPLETE!');

    if (totalSignals > 0) {
      console.log('🚀 Dashboard should now show REAL DATA instead of 0s');
    } else {
      console.log('⚠️ No signals found - Dashboard will still show 0s');
    }
  } catch (error) {
    console.error('❌ Dashboard metrics test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testDashboardMetrics().catch(console.error);
}

export default testDashboardMetrics;
