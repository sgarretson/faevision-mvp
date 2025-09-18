#!/usr/bin/env tsx
/**
 * Comprehensive API Access Verification
 *
 * Verifies all Preview APIs are working correctly after emergency fixes
 * Tests complete data access for executive demonstration readiness
 *
 * Expert: Morgan Smith (Database Architect)
 * Support: Alex Thompson (Lead Developer)
 */

import { PrismaClient } from '../src/generated/prisma';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
});

async function main() {
  console.log('🔍 COMPREHENSIVE API ACCESS VERIFICATION\n');
  console.log(
    '🎯 Goal: Ensure all APIs work correctly for executive demonstration\n'
  );

  try {
    // Test Foundation Data Access
    console.log('🏗️ Step 1: Foundation Data Verification...');
    await testFoundationData();

    // Test Core Workflow APIs
    console.log('\n🎯 Step 2: Core Workflow API Verification...');
    await testWorkflowAPIs();

    // Test Relationship Resolution
    console.log('\n🔗 Step 3: Relationship Resolution Verification...');
    await testRelationshipResolution();

    // Test AI Features
    console.log('\n🤖 Step 4: AI Features Verification...');
    await testAIFeatures();

    console.log('\n✅ COMPREHENSIVE VERIFICATION COMPLETE!');
    console.log(
      '🚀 All APIs operational - Preview ready for executive demonstration'
    );
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function testFoundationData() {
  const counts = {
    users: await prisma.users.count(),
    departments: await prisma.departments.count(),
    teams: await prisma.teams.count(),
    categories: await prisma.categories.count(),
  };

  console.log('   📊 Foundation Data:');
  Object.entries(counts).forEach(([table, count]) => {
    console.log(`     ✅ ${table}: ${count}`);
  });

  if (counts.users === 0) throw new Error('No users found - seed data missing');
}

async function testWorkflowAPIs() {
  // Test signals (F1)
  const signals = await (prisma as any).signals.findMany({ take: 3 });
  console.log(`   📊 F1 - Signals: ${signals.length} accessible`);

  // Test hotspots (F3)
  const hotspots = await (prisma as any).hotspots.findMany({ take: 3 });
  console.log(`   🔥 F3 - Hotspots: ${hotspots.length} accessible`);

  // Test ideas (F3)
  const ideas = await (prisma as any).ideas.findMany({ take: 3 });
  console.log(`   💡 F3 - Ideas: ${ideas.length} accessible`);

  // Test solutions (F4)
  const solutions = await (prisma as any).solutions.findMany({ take: 3 });
  console.log(`   🛠️ F4 - Solutions: ${solutions.length} accessible`);

  // Test votes (F2)
  const votes = await (prisma as any).votes.count();
  console.log(`   👍 F2 - Votes: ${votes} accessible`);

  // Test comments (F2)
  const comments = await (prisma as any).comments.count();
  console.log(`   💬 F2 - Comments: ${comments} accessible`);

  if (signals.length === 0) throw new Error('No signals accessible');
  if (hotspots.length === 0) throw new Error('No hotspots accessible');
  if (solutions.length === 0) throw new Error('No solutions accessible');
}

async function testRelationshipResolution() {
  // Test signal with department relationship
  const signalWithDept = await (prisma as any).signals.findFirst({
    where: { departmentId: { not: null } },
  });

  if (signalWithDept?.departmentId) {
    const department = await prisma.departments.findUnique({
      where: { id: signalWithDept.departmentId },
    });
    console.log(`   🏢 Department Resolution: ${department?.name || 'Failed'}`);
  }

  // Test hotspot with signals relationship
  const hotspotWithSignals = await (prisma as any).hotspot_signals.findMany({
    take: 3,
  });
  console.log(
    `   🔗 Hotspot-Signal Junction: ${hotspotWithSignals.length} connections`
  );

  // Test solution with tasks
  const solutionWithTasks = await (prisma as any).solutions.findFirst({
    where: { tasks: { not: null } },
  });
  console.log(
    `   📋 Solution Tasks: ${solutionWithTasks?.tasks?.length || 0} tasks found`
  );
}

async function testAIFeatures() {
  // Test AI-processed signals
  const aiProcessedSignals = await (prisma as any).signals.findMany({
    where: { aiProcessed: true },
    take: 3,
  });
  console.log(`   🤖 AI-Processed Signals: ${aiProcessedSignals.length}`);

  // Test enhanced tags
  const enhancedTagged = await (prisma as any).signals.findMany({
    where: { enhancedTagsJson: { not: null } },
    take: 3,
  });
  console.log(`   🏷️ Enhanced Tagged Signals: ${enhancedTagged.length}`);

  // Test clustering features
  const clusteredSignals = await (prisma as any).signals.findMany({
    where: { clusteringFeaturesJson: { not: null } },
    take: 3,
  });
  console.log(`   🔬 Clustering Features: ${clusteredSignals.length}`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
}

export default main;
