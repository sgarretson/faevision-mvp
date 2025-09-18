#!/usr/bin/env ts-node

/**
 * Emergency Schema Validation Test
 * Expert: Database Architect (Morgan Smith)
 *
 * Tests the specific Prisma queries that were failing in production
 * to ensure schema relationship corrections are working correctly.
 */

import { prisma } from '../src/lib/prisma';

async function testDashboardQueries() {
  console.log('🔍 Testing Dashboard API queries...');

  try {
    // Test the corrected signals query from dashboard API
    const recentSignals = await (prisma as any).signals?.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        severity: true,
        createdAt: true,
        createdById: true, // Using ID field instead of relationship
        departmentId: true, // Using ID field instead of relationship
      },
    });

    console.log(
      `  ✅ Dashboard signals query successful - found ${recentSignals?.length || 0} signals`
    );
    return true;
  } catch (error) {
    console.error('  ❌ Dashboard signals query failed:', error);
    return false;
  }
}

async function testSolutionsQueries() {
  console.log('🔍 Testing Solutions API queries...');

  try {
    // Test the corrected solutions query
    const solution = await (prisma as any).solutions.findFirst({
      include: {
        users: {
          // Corrected from 'creator'
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
        ideas: {
          // Corrected from 'idea'
          select: {
            id: true,
            title: true,
            description: true,
            origin: true,
          },
        },
        hotspots: {
          // Corrected from 'hotspot'
          select: {
            id: true,
            title: true,
            summary: true,
            confidence: true,
          },
        },
        initiatives: {
          // Corrected from 'initiative'
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    console.log(
      `  ✅ Solutions query successful - solution found: ${!!solution}`
    );
    return true;
  } catch (error) {
    console.error('  ❌ Solutions query failed:', error);
    return false;
  }
}

async function testCommentsQueries() {
  console.log('🔍 Testing Comments API queries...');

  try {
    // Test the corrected comments query
    const comments = await (prisma as any).comments.findMany({
      take: 5,
      include: {
        users: {
          // Corrected from 'creator'
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(
      `  ✅ Comments query successful - found ${comments?.length || 0} comments`
    );
    return true;
  } catch (error) {
    console.error('  ❌ Comments query failed:', error);
    return false;
  }
}

async function testClusteringQueries() {
  console.log('🔍 Testing Clustering API queries...');

  try {
    // Test the corrected clustering signals query
    const signals = await (prisma as any).signals.findMany({
      take: 5,
      include: {
        departments: true, // Corrected from 'department'
        teams: true, // Corrected from 'team'
        users: true, // Corrected from 'createdBy'
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(
      `  ✅ Clustering signals query successful - found ${signals?.length || 0} signals`
    );
    return true;
  } catch (error) {
    console.error('  ❌ Clustering signals query failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 EMERGENCY SCHEMA VALIDATION TEST');
  console.log('=' + '='.repeat(60) + '\n');
  console.log(
    'Testing all problematic Prisma queries identified in Vercel logs...\n'
  );

  const tests = [
    { name: 'Dashboard API', test: testDashboardQueries },
    { name: 'Solutions API', test: testSolutionsQueries },
    { name: 'Comments API', test: testCommentsQueries },
    { name: 'Clustering API', test: testClusteringQueries },
  ];

  const results = [];

  for (const { name, test } of tests) {
    const success = await test();
    results.push({ name, success });
    console.log(); // Add spacing
  }

  console.log('📊 VALIDATION RESULTS:');
  console.log('=' + '='.repeat(40));

  let allPassed = true;
  for (const { name, success } of results) {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${status} ${name}`);
    if (!success) allPassed = false;
  }

  console.log('\n🎯 SUMMARY:');
  if (allPassed) {
    console.log('✅ ALL SCHEMA CORRECTIONS VALIDATED SUCCESSFULLY');
    console.log('🚀 Ready for deployment to Vercel Preview');
  } else {
    console.log('❌ SCHEMA ISSUES STILL EXIST');
    console.log('🔧 Additional fixes required before deployment');
  }

  // Clean up
  await prisma.$disconnect();

  process.exit(allPassed ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Schema validation test failed:', error);
    process.exit(1);
  });
}
