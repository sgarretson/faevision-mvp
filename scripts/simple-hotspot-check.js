const { PrismaClient } = require('@prisma/client');
const { loadEnvConfig } = require('@next/env');

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function checkHotspots() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
      },
    },
  });

  try {
    console.log('🔍 Checking hotspots...');

    // Check all hotspots
    const hotspots = await prisma.hotspot.findMany({
      select: {
        id: true,
        title: true,
        summary: true,
        createdAt: true,
        signals: {
          select: {
            signal: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    console.log(`📋 Hotspots found: ${hotspots.length}`);
    hotspots.forEach(hotspot => {
      console.log(`  - ${hotspot.id}: ${hotspot.title}`);
      console.log(`    Summary: ${hotspot.summary?.substring(0, 100)}...`);
      console.log(`    Signals: ${hotspot.signals.length}`);
      console.log(`    Created: ${hotspot.createdAt}`);
      console.log('');
    });

    // Check signals
    const signalCount = await prisma.signal.count();
    console.log(`📊 Total signals: ${signalCount}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHotspots();
