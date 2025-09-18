#!/usr/bin/env tsx
/**
 * Comprehensive Schema-Code Audit & Documentation
 *
 * Complete mapping of actual database schema vs expected code interfaces
 * to restore full functionality for robust seed data testing
 *
 * Expert: Morgan Smith (Database Architect)
 * Support: TypeScript Expert
 */

import { PrismaClient } from '../src/generated/prisma';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
});

async function main() {
  console.log('🔍 COMPREHENSIVE SCHEMA-CODE AUDIT & RESTORATION PLAN\n');
  console.log(
    '🎯 Goal: Map actual schema vs expected interfaces for full functionality\n'
  );

  try {
    // Step 1: Document all table structures
    console.log('📊 Step 1: Documenting actual database schema...');
    await documentTableStructures();

    // Step 2: Test all relationships and data access
    console.log('\n🔗 Step 2: Testing relationships and data access...');
    await testDataRelationships();

    // Step 3: Identify schema mismatches
    console.log('\n⚠️ Step 3: Identifying schema-code mismatches...');
    await identifyMismatches();

    // Step 4: Provide restoration recommendations
    console.log('\n🛠️ Step 4: Generating restoration recommendations...');
    await generateRestorationPlan();

    console.log('\n✅ Comprehensive audit complete!');
    console.log('📋 Full restoration plan documented for implementation');
  } catch (error) {
    console.error('❌ Schema audit failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function documentTableStructures() {
  console.log('\n📋 ACTUAL DATABASE SCHEMA DOCUMENTATION:');

  // Core foundation tables
  console.log('\n🏗️ FOUNDATION TABLES:');

  const user = await prisma.users.findFirst();
  if (user) {
    console.log('  👤 users fields:', Object.keys(user));
  }

  const department = await prisma.departments.findFirst();
  if (department) {
    console.log('  🏢 departments fields:', Object.keys(department));
  }

  const team = await prisma.teams.findFirst();
  if (team) {
    console.log('  👥 teams fields:', Object.keys(team));
  }

  const category = await prisma.categories.findFirst();
  if (category) {
    console.log('  📂 categories fields:', Object.keys(category));
  }

  // Workflow tables
  console.log('\n🎯 WORKFLOW TABLES:');

  try {
    const input = await (prisma as any).inputs.findFirst();
    if (input) {
      console.log('  📝 inputs fields:', Object.keys(input));
    }
  } catch (e) {
    console.log('  📝 inputs: Table access error');
  }

  try {
    const signal = await (prisma as any).signals.findFirst();
    if (signal) {
      console.log('  📊 signals fields:', Object.keys(signal));
    }
  } catch (e) {
    console.log('  📊 signals: Table access error');
  }

  try {
    const hotspot = await (prisma as any).hotspots.findFirst();
    if (hotspot) {
      console.log('  🔥 hotspots fields:', Object.keys(hotspot));
    }
  } catch (e) {
    console.log('  🔥 hotspots: Table access error');
  }

  try {
    const idea = await (prisma as any).ideas.findFirst();
    if (idea) {
      console.log('  💡 ideas fields:', Object.keys(idea));
    }
  } catch (e) {
    console.log('  💡 ideas: Table access error');
  }

  try {
    const solution = await (prisma as any).solutions.findFirst();
    if (solution) {
      console.log('  🛠️ solutions fields:', Object.keys(solution));
      console.log('  📋 solutions.tasks type:', typeof solution.tasks);
      if (solution.tasks) {
        console.log(
          '  📋 tasks structure:',
          Object.keys(solution.tasks[0] || {})
        );
      }
    }
  } catch (e) {
    console.log('  🛠️ solutions: Table access error');
  }

  try {
    const vote = await (prisma as any).votes.findFirst();
    if (vote) {
      console.log('  👍 votes fields:', Object.keys(vote));
    }
  } catch (e) {
    console.log('  👍 votes: Table access error');
  }

  try {
    const comment = await (prisma as any).comments.findFirst();
    if (comment) {
      console.log('  💬 comments fields:', Object.keys(comment));
    }
  } catch (e) {
    console.log('  💬 comments: Table access error');
  }
}

async function testDataRelationships() {
  console.log('\n🔗 RELATIONSHIP TESTING:');

  // Test signals with department/team/category relationships
  try {
    console.log('\n📊 Testing signals relationships...');

    const signalWithRelations = await (prisma as any).signals.findFirst({
      where: {
        departmentId: { not: null },
      },
    });

    if (signalWithRelations) {
      console.log(
        '  ✅ Signal with departmentId found:',
        signalWithRelations.departmentId
      );

      // Test if we can resolve the relationship
      if (signalWithRelations.departmentId) {
        const department = await prisma.departments.findUnique({
          where: { id: signalWithRelations.departmentId },
        });
        console.log('  ✅ Department resolved:', department?.name);
      }
    }

    // Test with includes (expected to fail)
    try {
      const signalWithInclude = await (prisma as any).signals.findFirst({
        include: {
          department: true,
        },
      });
      console.log(
        '  ✅ Department include works:',
        !!signalWithInclude.department
      );
    } catch (e) {
      console.log('  ❌ Department include fails:', e.message);
    }
  } catch (error) {
    console.log('  ❌ Signals relationship test failed:', error.message);
  }

  // Test hotspots with signals relationships
  try {
    console.log('\n🔥 Testing hotspots relationships...');

    const hotspot = await (prisma as any).hotspots.findFirst();
    if (hotspot) {
      console.log('  ✅ Hotspot found:', hotspot.id);

      // Try to find related signals (via junction table or direct relationship)
      try {
        const hotspotSignals = await (prisma as any).hotspot_signals.findMany({
          where: { hotspotId: hotspot.id },
        });
        console.log(
          '  ✅ Hotspot signals junction table:',
          hotspotSignals.length
        );
      } catch (e) {
        console.log('  ❌ Hotspot signals junction not accessible:', e.message);
      }

      // Try complex include (expected to fail in current emergency state)
      try {
        const hotspotWithSignals = await (prisma as any).hotspots.findFirst({
          include: {
            signals: {
              include: {
                signal: true,
              },
            },
          },
        });
        console.log('  ✅ Complex hotspot include works');
      } catch (e) {
        console.log('  ❌ Complex hotspot include fails:', e.message);
      }
    }
  } catch (error) {
    console.log('  ❌ Hotspots relationship test failed:', error.message);
  }
}

async function identifyMismatches() {
  console.log('\n⚠️ SCHEMA-CODE MISMATCHES IDENTIFIED:');

  const mismatches = [];

  // API Route Analysis
  console.log('\n🔧 API Route Issues:');

  mismatches.push({
    location: 'src/app/api/inputs/route.ts',
    issue: 'Using (prisma as any).signals vs expected relationships',
    current: 'Field-based access (departmentId, teamId, categoryId)',
    expected: 'Relationship includes (department: { select: { name: true } })',
    impact: 'Department/team names not displayed, limited filtering',
    priority: 'HIGH',
  });

  mismatches.push({
    location: 'src/app/api/hotspots/route.ts',
    issue: 'Simplified clustering analysis, removed signal relationships',
    current: 'Static zeros for all clustering metrics',
    expected:
      'Dynamic calculation from signal relationships and clustering data',
    impact: 'No clustering intelligence, no signal details in hotspots',
    priority: 'CRITICAL',
  });

  mismatches.push({
    location: 'Frontend expectations',
    issue: 'Components expect full department/team/category objects',
    current: 'API returns field IDs or static values',
    expected: 'Full objects with names and metadata',
    impact: 'Limited display data, broken filtering and search',
    priority: 'HIGH',
  });

  mismatches.forEach((mismatch, index) => {
    console.log(`\n  ${index + 1}. ${mismatch.location}`);
    console.log(`     🚨 Issue: ${mismatch.issue}`);
    console.log(`     📊 Current: ${mismatch.current}`);
    console.log(`     🎯 Expected: ${mismatch.expected}`);
    console.log(`     💥 Impact: ${mismatch.impact}`);
    console.log(`     ⚡ Priority: ${mismatch.priority}`);
  });

  return mismatches;
}

async function generateRestorationPlan() {
  console.log('\n🛠️ COMPREHENSIVE RESTORATION PLAN:');

  const plan = {
    immediate: [
      'Fix TypeScript build errors in hotspots API',
      'Create relationship mapping utilities',
      'Test all table access patterns',
    ],
    phase1: [
      'Restore department/team/category name resolution in inputs API',
      'Implement proper hotspot-signal relationship queries',
      'Add clustering analysis calculation functions',
      'Create data access compatibility layer',
    ],
    phase2: [
      'Enhance all API routes with full relationship support',
      'Implement robust error handling and fallbacks',
      'Add comprehensive data validation',
      'Create end-to-end workflow testing',
    ],
    validation: [
      'Test all 20 strategic inputs with complete metadata',
      'Verify all 4 hotspots with signal clustering details',
      'Validate all 5 ideas with supporting evidence',
      'Confirm all 2 solutions with 11 tasks accessible',
      'Execute complete F1-F6 workflow end-to-end',
    ],
  };

  console.log('\n📋 IMPLEMENTATION PHASES:');

  console.log('\n🚨 IMMEDIATE (Fix deployment):');
  plan.immediate.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));

  console.log('\n🔧 PHASE 1 (Restore core functionality):');
  plan.phase1.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));

  console.log('\n🚀 PHASE 2 (Complete enhancement):');
  plan.phase2.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));

  console.log('\n✅ VALIDATION (Confirm full functionality):');
  plan.validation.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));

  console.log('\n📊 ESTIMATED TIMELINE:');
  console.log('  🚨 Immediate: 30 minutes (deployment fix)');
  console.log('  🔧 Phase 1: 2-3 hours (core functionality)');
  console.log('  🚀 Phase 2: 3-4 hours (complete enhancement)');
  console.log('  ✅ Validation: 1 hour (comprehensive testing)');
  console.log('  🎯 Total: ~6-8 hours for complete restoration');

  return plan;
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  });
}

export default main;
