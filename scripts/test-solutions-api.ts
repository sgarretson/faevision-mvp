#!/usr/bin/env tsx
/**
 * Test Solutions API with Current Data
 *
 * Diagnose and fix Solutions page Prisma validation error
 * Focus on schema alignment and relationship issues
 */

import { prisma } from '../src/lib/prisma';

async function testSolutionsAPI() {
  console.log('🛠️ TESTING SOLUTIONS API WITH EXISTING DATA\n');

  try {
    // First, check if solutions exist
    console.log('🔍 Step 1: Check solutions count...');
    const solutionsCount = (await (prisma as any).solutions?.count()) || 0;
    console.log(`   Found ${solutionsCount} solutions in database\n`);

    if (solutionsCount === 0) {
      console.log('⚠️ No solutions found - this explains empty page');
      return;
    }

    // Test basic solutions query without relationships
    console.log('🔍 Step 2: Test basic solutions query...');
    const basicSolutions =
      (await (prisma as any).solutions?.findMany({
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          hotspotId: true,
          createdById: true, // Check if this exists instead of 'creator'
          createdAt: true,
        },
      })) || [];

    console.log(`   Basic solutions query: ${basicSolutions.length} results`);
    basicSolutions.forEach((solution: any, index: number) => {
      console.log(
        `   ${index + 1}. ${solution.title || 'Untitled'} (Status: ${solution.status})`
      );
      console.log(`      Created by ID: ${solution.createdById || 'null'}`);
    });
    console.log();

    // Test if 'creator' relationship exists
    console.log('🔍 Step 3: Test relationships...');
    try {
      const testCreator = await (prisma as any).solutions?.findFirst({
        include: {
          creator: { select: { id: true } },
        },
      });
      console.log('   ✅ "creator" relationship exists');
    } catch (error) {
      console.log('   ❌ "creator" relationship DOES NOT exist');
      console.log(`      Error: ${error.message}`);
    }

    // Test if 'createdBy' relationship exists
    try {
      const testCreatedBy = await (prisma as any).solutions?.findFirst({
        include: {
          createdBy: { select: { id: true } },
        },
      });
      console.log('   ✅ "createdBy" relationship exists');
    } catch (error) {
      console.log('   ❌ "createdBy" relationship DOES NOT exist');
      console.log(`      Error: ${error.message}`);
    }
    console.log();

    // Test safe query with only basic fields
    console.log('🔍 Step 4: Test safe query...');
    const safeSolutions =
      (await (prisma as any).solutions?.findMany({
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          progress: true,
          targetDate: true,
          actualCompletionDate: true,
          costEstimate: true,
          impactDescription: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      })) || [];

    console.log(`   Safe query returned ${safeSolutions.length} solutions`);
    console.log('✅ SOLUTIONS API BASIC FUNCTIONALITY VERIFIED\n');

    if (safeSolutions.length > 0) {
      console.log('🚀 Solutions page should work with simplified query');
      console.log(
        '💡 Recommendation: Remove problematic relationships from Solutions API'
      );
    }
  } catch (error) {
    console.error('❌ Solutions API test failed:', error);
    console.log('\n🔧 Recommendation: Investigate schema alignment issues');
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testSolutionsAPI().catch(console.error);
}

export default testSolutionsAPI;
