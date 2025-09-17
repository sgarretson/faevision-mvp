import { PrismaClient } from '@prisma/client';
import { loadEnvConfig } from '@next/env';

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
    const signalCount = await (prisma as any).signal.count();
    console.log(`📊 Total signals: ${signalCount}`);

    // Check hotspots
    const hotspotCount = await (prisma as any).hotspot.count();
    console.log(`🔥 Total hotspots: ${hotspotCount}`);

    // Try to get hotspots with clustering results
    try {
      const hotspotsWithClustering = await (prisma as any).hotspot.findMany({
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
        hotspotsWithClustering.forEach((hotspot: any) => {
          console.log(
            `  - ${hotspot.id}: ${hotspot.title} (Quality: ${hotspot.clusteringQualityScore})`
          );
        });
      }
    } catch (error: any) {
      if (error.code === 'P2022') {
        console.log('⚠️  Clustering columns missing from database schema');

        // Check for basic hotspots
        const basicHotspots = await (prisma as any).hotspot.findMany({
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        });

        console.log(`📋 Basic hotspots found: ${basicHotspots.length}`);
        if (basicHotspots.length > 0) {
          basicHotspots.forEach((hotspot: any) => {
            console.log(`  - ${hotspot.id}: ${hotspot.title}`);
          });
        }
      } else {
        throw error;
      }
    }

    // Check global cache
    console.log('🔍 Checking in-memory cache...');
    const tempCache = (global as any).tempClusteringCache;
    if (tempCache) {
      const cacheKeys = Object.keys(tempCache);
      console.log(`💾 In-memory cache entries: ${cacheKeys.length}`);
      cacheKeys.forEach(key => {
        const entry = tempCache[key];
        console.log(
          `  - ${key}: ${entry.results?.outputClusterCount || 'unknown'} clusters, cached at ${entry.timestamp}`
        );
      });
    } else {
      console.log('💾 No in-memory cache found');
    }
  } catch (error) {
    console.error('❌ Error checking clustering status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClusteringStatus();
