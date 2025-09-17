const { PrismaClient } = require('@prisma/client');
const { loadEnvConfig } = require('@next/env');

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function debugClusteringAPIResponse() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
      },
    },
  });

  try {
    console.log('🔍 Testing what our clustering API should return...');

    // Simulate what the GET endpoint does
    console.log('1. Checking for hotspots with signals...');
    const hotspotsWithSignals = await prisma.hotspot.findMany({
      include: {
        signals: {
          include: {
            signal: {
              include: {
                department: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (
      hotspotsWithSignals.length > 0 &&
      hotspotsWithSignals[0].signals.length > 0
    ) {
      const hotspot = hotspotsWithSignals[0];
      console.log(
        `📊 Found hotspot "${hotspot.title}" with ${hotspot.signals.length} signals`
      );

      // Simulate generateClusteringResultsFromHotspot
      const signals = hotspot.signals.map(hs => hs.signal);
      console.log(
        '📋 Signal departments:',
        signals.map(s => s.department?.name || 'Unknown').join(', ')
      );

      // Group signals by department
      const departmentGroups = signals.reduce((acc, signal) => {
        const deptName = signal.department?.name || 'Unknown Department';
        if (!acc[deptName]) {
          acc[deptName] = [];
        }
        acc[deptName].push(signal);
        return acc;
      }, {});

      console.log('🏢 Department groups:', Object.keys(departmentGroups));

      const finalClusters = Object.entries(departmentGroups).map(
        ([deptName, deptSignals]) => {
          const signalArray = deptSignals;
          const avgSeverity =
            signalArray.reduce((sum, s) => {
              const severityScore =
                s.severity === 'CRITICAL'
                  ? 5
                  : s.severity === 'HIGH'
                    ? 4
                    : s.severity === 'MEDIUM'
                      ? 3
                      : s.severity === 'LOW'
                        ? 2
                        : 1;
              return sum + severityScore;
            }, 0) / signalArray.length;

          const clusterType =
            avgSeverity >= 4
              ? 'CRITICAL'
              : avgSeverity >= 3
                ? 'HIGH'
                : avgSeverity >= 2
                  ? 'MEDIUM'
                  : 'LOW';

          return {
            id: `cluster_${deptName.toLowerCase().replace(/\s+/g, '_')}`,
            name: `${deptName} Process & Workflow`,
            description: `Issues identified in ${deptName} department requiring executive attention`,
            type: clusterType,
            signalCount: signalArray.length,
            signalIds: signalArray.map(s => s.id),
            departmentsInvolved: [deptName],
            affectedDepartments: [deptName],
            actionability: Math.min(1.0, avgSeverity * 0.2),
            urgencyScore: avgSeverity * 0.2,
            businessRelevance: Math.min(1.0, avgSeverity * 0.25),
            businessImpact: {
              costImpact: Math.round(avgSeverity * 10000),
              timelineImpact: avgSeverity * 0.2,
              qualityRisk: avgSeverity * 0.15,
              clientSatisfaction: Math.max(0, 1 - avgSeverity * 0.1),
            },
            recommendedActions: [
              `Review ${deptName.toLowerCase()} process workflows`,
              `Implement quality control measures`,
              `Establish clear communication protocols`,
            ],
            estimatedResolution: {
              timeframe:
                avgSeverity >= 4
                  ? 'Immediate (1-2 weeks)'
                  : avgSeverity >= 3
                    ? 'Short-term (2-4 weeks)'
                    : 'Medium-term (1-2 months)',
              resources: [
                `${deptName} Team Lead`,
                'Process Improvement Specialist',
              ],
              cost: `$${Math.round(avgSeverity * 5000)}-${Math.round(avgSeverity * 15000)}`,
            },
          };
        }
      );

      const result = {
        version: '2.0.0',
        inputSignalCount: signals.length,
        outputClusterCount: finalClusters.length,
        executiveActionability:
          finalClusters.reduce(
            (sum, cluster) => sum + cluster.actionability,
            0
          ) / finalClusters.length,
        finalClusters: finalClusters,
        processingTime: 50,
        lastGenerated: new Date().toISOString(),
        overallQuality: 0.85,
      };

      console.log('🎯 Generated clustering result structure:');
      console.log('  - inputSignalCount:', result.inputSignalCount);
      console.log('  - outputClusterCount:', result.outputClusterCount);
      console.log('  - finalClusters length:', result.finalClusters.length);
      console.log('  - finalClusters[0]:', result.finalClusters[0]?.name);

      // Check if this matches the frontend interface
      console.log(
        '\n🔍 Checking against frontend ClusteringResults interface:'
      );
      const requiredFields = [
        'success',
        'inputSignalCount',
        'outputClusterCount',
        'clusteringEfficiency',
        'businessRelevanceScore',
        'executiveActionability',
        'finalClusters',
        'processingTime',
        'lastGenerated',
      ];

      requiredFields.forEach(field => {
        if (result.hasOwnProperty(field)) {
          console.log(
            `  ✅ ${field}: ${typeof result[field]} (${Array.isArray(result[field]) ? `array length ${result[field].length}` : result[field]})`
          );
        } else {
          console.log(`  ❌ Missing: ${field}`);
        }
      });
    } else {
      console.log('❌ No hotspots with signals found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugClusteringAPIResponse();
