#!/usr/bin/env tsx
/**
 * Emergency Schema Fix - Dashboard API Critical Errors
 *
 * MORGAN SMITH (DATABASE ARCHITECT) - Systematic Relationship Fix
 *
 * Addresses critical Prisma relationship validation failures:
 * 1. Dashboard API: signals.createdBy vs signals.users relationship
 * 2. Dashboard API: signals.department vs signals.departments relationship
 */

import { prisma } from '../src/lib/prisma';

async function diagnoseDashboardSchema() {
  console.log('🚨 EMERGENCY SCHEMA DIAGNOSIS - Dashboard API');
  console.log('='.repeat(80));

  try {
    // Test the actual query that's failing according to logs
    console.log('🔍 Testing problematic signals query...');

    const testQuery = await (prisma as any).signals.findMany({
      take: 1,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        severity: true,
        createdAt: true,
        createdById: true, // Correct field name
        departmentId: true, // Correct field name
      },
    });

    console.log('✅ Query with ID fields works:', testQuery.length, 'records');

    // Test relationship queries to identify the problem
    console.log('\n🔍 Testing relationship queries...');

    try {
      const relationshipQuery = await (prisma as any).signals.findMany({
        take: 1,
        select: {
          id: true,
          users: {
            // Correct relationship name
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      console.log('✅ signals.users relationship works');
    } catch (error) {
      console.log(
        '❌ signals.users relationship failed:',
        (error as Error).message
      );
    }

    try {
      const deptQuery = await (prisma as any).signals.findMany({
        take: 1,
        select: {
          id: true,
          departments: {
            // Correct relationship name
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      console.log('✅ signals.departments relationship works');
    } catch (error) {
      console.log(
        '❌ signals.departments relationship failed:',
        (error as Error).message
      );
    }

    // Show what fields are actually available on signals
    console.log('\n📋 Available signals fields:');
    const signalSample = await (prisma as any).signals.findFirst({
      select: {
        id: true,
        createdById: true,
        departmentId: true,
        teamId: true,
        categoryId: true,
      },
    });
    console.log('Sample signal fields:', Object.keys(signalSample || {}));
  } catch (error) {
    console.error('❌ Schema diagnosis failed:', error);
  }
}

async function identifyDashboardErrorSource() {
  console.log('\n🔍 IDENTIFYING ERROR SOURCE IN DASHBOARD API');
  console.log('='.repeat(80));

  // The error from logs shows this exact query failing:
  const problematicQuery = `
  prisma.signals.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true, 
      description: true,
      severity: true,
      createdAt: true,
      createdBy: {        <-- THIS IS THE PROBLEM
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      department: {       <-- THIS IS ALSO THE PROBLEM
        select: {
          id: true,
          name: true
        }
      }
    }
  })`;

  console.log('❌ PROBLEMATIC QUERY PATTERN:');
  console.log(problematicQuery);

  console.log('\n✅ CORRECT QUERY PATTERN:');
  console.log(`
  prisma.signals.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true, 
      severity: true,
      createdAt: true,
      users: {              <-- CORRECT: uses 'users' relationship
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      departments: {        <-- CORRECT: uses 'departments' relationship
        select: {
          id: true,
          name: true
        }
      }
    }
  })`);
}

async function main() {
  console.log('🚨 EMERGENCY DASHBOARD SCHEMA FIX');
  console.log(
    'Morgan Smith (Database Architect) - Critical Relationship Repair'
  );
  console.log('='.repeat(80));

  await diagnoseDashboardSchema();
  await identifyDashboardErrorSource();

  console.log('\n🎯 NEXT STEPS:');
  console.log(
    '1. ✅ Find the code still using createdBy/department relationships'
  );
  console.log('2. ✅ Replace with users/departments relationships');
  console.log('3. ✅ Fix solutions and comments APIs with same pattern');
  console.log('4. ✅ Deploy fixes to resolve all 500 errors');
}

if (require.main === module) {
  main().catch(console.error);
}

export default diagnoseDashboardSchema;
