const { PrismaClient } = require('@prisma/client');
const { loadEnvConfig } = require('@next/env');

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function checkClusteringStatus() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
      },
    },
  });

  try {
    console.log('🔍 Checking clustering status...');

    // Check signals count
    const signalCount = await prisma.signal.count();
    console.log(`📊 Total signals: ${signalCount}`);

    // Check hotspots
    const hotspotCount = await prisma.hotspot.count();
    console.log(`🔥 Total hotspots: ${hotspotCount}`);

    // Try to get hotspots with clustering results
    try {
      const hotspotsWithClustering = await prisma.hotspot.findMany({
        where: {
          clusteringResults: { not: null },
        },
        select: {
          id: true,
          title: true,
          lastClusteredAt: true,
          clusteringQualityScore: true,
        },
      });

      console.log(
        `✅ Hotspots with clustering results: ${hotspotsWithClustering.length}`
      );

      if (hotspotsWithClustering.length > 0) {
        console.log('📋 Hotspots with clustering:');
        hotspotsWithClustering.forEach(hotspot => {
          console.log(
            `  - ${hotspot.id}: ${hotspot.title} (Quality: ${hotspot.clusteringQualityScore})`
          );
        });
      }
    } catch (error) {
      if (error.code === 'P2022') {
        console.log('⚠️  Clustering columns missing from database schema');

        // Check for basic hotspots
        const basicHotspots = await prisma.hotspot.findMany({
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        });

        console.log(`📋 Basic hotspots found: ${basicHotspots.length}`);
        if (basicHotspots.length > 0) {
          basicHotspots.forEach(hotspot => {
            console.log(`  - ${hotspot.id}: ${hotspot.title}`);
          });
        }
      } else {
        throw error;
      }
    }

    // Check recent signals
    const recentSignals = await prisma.signal.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        severity: true,
        createdAt: true,
      },
    });

    console.log(`📋 Recent signals (${recentSignals.length}):`);
    recentSignals.forEach(signal => {
      console.log(`  - ${signal.id}: ${signal.title} (${signal.severity})`);
    });
  } catch (error) {
    console.error('❌ Error checking clustering status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClusteringStatus();
