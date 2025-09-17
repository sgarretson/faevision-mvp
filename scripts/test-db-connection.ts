/**
 * Test Database Connection - Sprint 1 Fix
 * Expert: Morgan Smith (Database Architect)
 *
 * Test connection to Prisma Accelerate and existing signals
 */

import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🔍 Testing Database Connection...\n');

  try {
    // Test basic connection
    console.log('📡 Testing Prisma connection...');
    const connectionTest = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('✅ Database connection successful:', connectionTest);

    // Count existing signals
    console.log('\n📊 Checking existing signals...');
    const signalCount = await (prisma as any).signal.count();
    console.log(`✅ Found ${signalCount} signals in database`);

    // Get sample signal data
    if (signalCount > 0) {
      console.log('\n📋 Sample signal data:');
      const sampleSignals = await (prisma as any).signal.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          description: true,
          severity: true,
          department: true,
          enhancedTagsJson: true,
          lastTaggedAt: true,
        },
      });

      sampleSignals.forEach((signal: any, index: number) => {
        console.log(`\n   Signal ${index + 1}:`);
        console.log(`   ID: ${signal.id}`);
        console.log(`   Title: ${signal.title || 'Untitled'}`);
        console.log(`   Severity: ${signal.severity}`);
        console.log(`   Department: ${signal.department}`);
        console.log(
          `   Has Enhanced Tags: ${signal.enhancedTagsJson ? 'YES' : 'NO'}`
        );
        console.log(`   Last Tagged: ${signal.lastTaggedAt || 'Never'}`);
      });
    }

    // Test enhanced tagging schema fields
    console.log('\n🏷️ Testing enhanced tagging schema...');
    const enhancedTagsTest = await (prisma as any).signal.findFirst({
      where: {
        enhancedTagsJson: { not: null },
      },
      select: {
        enhancedTagsJson: true,
        tagGenerationMeta: true,
        domainClassification: true,
      },
    });

    if (enhancedTagsTest) {
      console.log('✅ Enhanced tagging fields are available and contain data');
    } else {
      console.log(
        '⚠️  Enhanced tagging fields exist but no tagged signals found'
      );
    }

    console.log('\n🎉 Database connection test completed successfully!');
    console.log('✅ Ready to proceed with enhanced tagging operations');
  } catch (error: any) {
    console.error('\n❌ Database connection test failed:', error.message);
    console.error('Stack trace:', error.stack);

    if (error.message.includes('Environment variable not found')) {
      console.log(
        '\n💡 SOLUTION: The database connection needs proper environment variables'
      );
      console.log(
        '   This should work automatically in the Vercel Preview environment'
      );
      console.log(
        '   The connection string uses Prisma Accelerate as seen in build logs'
      );
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
