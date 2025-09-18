#!/usr/bin/env tsx
/**
 * Emergency Schema Validation Test
 *
 * Tests the specific queries that were failing in production logs
 *
 * MORGAN SMITH (DATABASE ARCHITECT) - Critical Error Resolution
 */

import { prisma } from '../src/lib/prisma';

async function testDashboardQueries() {
  console.log('🚨 TESTING DASHBOARD API QUERIES');
  console.log('='.repeat(80));

  try {
    // Test the exact query from the error logs
    console.log('🔍 Testing signals query with relationships...');

    const signals = await (prisma as any).signals.findMany({
      take: 2,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        severity: true,
        createdAt: true,
        users: {
          // Fixed: use users instead of createdBy
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        departments: {
          // Fixed: use departments instead of department
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log('✅ Dashboard signals query works:', signals.length, 'records');
    console.log('Sample result:', JSON.stringify(signals[0] || {}, null, 2));
  } catch (error) {
    console.error('❌ Dashboard signals query failed:', error);
  }
}

async function testSolutionsQueries() {
  console.log('\n🚨 TESTING SOLUTIONS API QUERIES');
  console.log('='.repeat(80));

  try {
    console.log('🔍 Testing solutions query with relationships...');

    const solutions = await (prisma as any).solutions.findUnique({
      where: { id: 'solution_002' },
      include: {
        users: {
          // Fixed: use users instead of creator
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
        idea: {
          select: {
            id: true,
            title: true,
            description: true,
            origin: true,
            evidenceJson: true,
            tagsJson: true,
          },
        },
        hotspot: {
          select: {
            id: true,
            title: true,
            summary: true,
            confidence: true,
            _count: {
              select: {
                signals: true,
              },
            },
          },
        },
        initiative: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        _count: {
          select: {},
        },
      },
    });

    console.log('✅ Solutions query works:', solutions ? 'Found' : 'Not found');
    if (solutions) {
      console.log(
        'Sample result:',
        JSON.stringify(solutions, null, 2).substring(0, 500) + '...'
      );
    }
  } catch (error) {
    console.error('❌ Solutions query failed:', error);
  }
}

async function testCommentsQueries() {
  console.log('\n🚨 TESTING COMMENTS API QUERIES');
  console.log('='.repeat(80));

  try {
    console.log('🔍 Testing comments query with relationships...');

    const comments = await (prisma as any).comments.findMany({
      where: {
        entityType: 'SOLUTION',
        entityId: 'solution_002',
      },
      include: {
        users: {
          // Fixed: use users instead of creator
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('✅ Comments query works:', comments.length, 'records');
  } catch (error) {
    console.error('❌ Comments query failed:', error);
  }
}

async function testClusteringQueries() {
  console.log('\n🚨 TESTING CLUSTERING API QUERIES');
  console.log('='.repeat(80));

  try {
    console.log('🔍 Testing clustering signals query...');

    const signals = await (prisma as any).signals.findMany({
      where: {
        clusteringFeaturesJson: { not: null },
      },
      include: {
        departments: true, // Fixed: use departments instead of department
        teams: true, // Fixed: use teams instead of team
        users: true, // Fixed: use users instead of createdBy
      },
      orderBy: { createdAt: 'desc' },
      take: 2,
    });

    console.log(
      '✅ Clustering signals query works:',
      signals.length,
      'records'
    );
  } catch (error) {
    console.error('❌ Clustering signals query failed:', error);
  }
}

async function main() {
  console.log('🚨 EMERGENCY SCHEMA VALIDATION TEST');
  console.log(
    'Morgan Smith (Database Architect) - Critical Error Verification'
  );
  console.log('='.repeat(80));

  await testDashboardQueries();
  await testSolutionsQueries();
  await testCommentsQueries();
  await testClusteringQueries();

  console.log('\n🎯 SCHEMA VALIDATION COMPLETE');
  console.log('All critical relationship fixes tested');
  console.log('Ready for deployment if all tests pass');
}

if (require.main === module) {
  main().catch(console.error);
}

export default main;
