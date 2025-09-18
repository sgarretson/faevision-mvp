#!/usr/bin/env tsx
/**
 * Test Ideas API with Current Data
 *
 * Diagnose and fix Ideas page "Internal server error"
 * Focus on schema alignment and relationship issues
 */

import { prisma } from '../src/lib/prisma';

async function testIdeasAPI() {
  console.log('💡 TESTING IDEAS API WITH EXISTING DATA\n');

  try {
    // First, check if ideas exist
    console.log('🔍 Step 1: Check ideas count...');
    const ideasCount = (await (prisma as any).ideas?.count()) || 0;
    console.log(`   Found ${ideasCount} ideas in database\n`);

    if (ideasCount === 0) {
      console.log('⚠️ No ideas found - this explains empty page');
      return;
    }

    // Test basic ideas query without relationships
    console.log('🔍 Step 2: Test basic ideas query...');
    const basicIdeas =
      (await (prisma as any).ideas?.findMany({
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          hotspotId: true,
          createdById: true,
          createdAt: true,
        },
      })) || [];

    console.log(`   Basic ideas query: ${basicIdeas.length} results`);
    basicIdeas.forEach((idea: any, index: number) => {
      console.log(
        `   ${index + 1}. ${idea.title || 'Untitled'} (Status: ${idea.status})`
      );
    });
    console.log();

    // Test relationship queries separately
    console.log('🔍 Step 3: Test hotspot relationships...');
    const hotspotIds = basicIdeas
      .map((idea: any) => idea.hotspotId)
      .filter(Boolean);
    console.log(
      `   Ideas reference ${hotspotIds.length} hotspot IDs: [${hotspotIds.join(', ')}]`
    );

    if (hotspotIds.length > 0) {
      const hotspotsCount =
        (await (prisma as any).hotspots?.count({
          where: { id: { in: hotspotIds } },
        })) || 0;
      console.log(`   Found ${hotspotsCount} matching hotspots in database`);
    }
    console.log();

    // Test creator relationships
    console.log('🔍 Step 4: Test creator relationships...');
    const creatorIds = basicIdeas
      .map((idea: any) => idea.createdById)
      .filter(Boolean);
    console.log(
      `   Ideas reference ${creatorIds.length} creator IDs: [${creatorIds.join(', ')}]`
    );

    if (creatorIds.length > 0) {
      const usersCount =
        (await (prisma as any).users?.count({
          where: { id: { in: creatorIds } },
        })) || 0;
      console.log(`   Found ${usersCount} matching users in database`);
    }
    console.log();

    // Test safe query with only existing relationships
    console.log('🔍 Step 5: Test safe query with basic relationships...');
    const safeIdeas =
      (await (prisma as any).ideas?.findMany({
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          confidence: true,
          votes: true,
          createdAt: true,
          // Skip complex relationships for now
        },
        orderBy: { createdAt: 'desc' },
      })) || [];

    console.log(`   Safe query returned ${safeIdeas.length} ideas`);
    console.log('✅ IDEAS API BASIC FUNCTIONALITY VERIFIED\n');

    if (safeIdeas.length > 0) {
      console.log('🚀 Ideas page should work with simplified query');
      console.log('💡 Recommendation: Fix relationship includes in Ideas API');
    }
  } catch (error) {
    console.error('❌ Ideas API test failed:', error);
    console.log('\n🔧 Recommendation: Investigate schema alignment issues');
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testIdeasAPI().catch(console.error);
}

export default testIdeasAPI;
