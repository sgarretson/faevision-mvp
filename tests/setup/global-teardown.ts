/**
 * FAEVision Global Test Teardown
 * Expert: Alex Thompson (Lead Developer)
 * Purpose: Cleanup test environment, generate reports, preserve test artifacts
 */

import { FullConfig } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up FAEVision E2E Test Environment...');

  // Generate test summary report
  await generateTestSummary();

  // Clean up test database (optional - keep for debugging)
  if (process.env.CLEANUP_TEST_DB === 'true') {
    await cleanupTestDatabase();
  }

  // Archive test artifacts
  await archiveTestArtifacts();

  console.log('✅ FAEVision E2E Test Environment Cleaned Up!');
}

async function generateTestSummary() {
  console.log('📊 Generating test summary...');

  try {
    const resultsPath = 'test-results/results.json';

    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

      const summary = {
        timestamp: new Date().toISOString(),
        totalTests:
          results.suites?.reduce((acc: number, suite: any) => {
            return acc + (suite.specs?.length || 0);
          }, 0) || 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: results.stats?.duration || 0,
        performance: {
          averagePageLoad: 0,
          averageApiResponse: 0,
          aiProcessingTime: 0,
        },
        coverage: {
          f1InputCapture: false,
          f2Collaboration: false,
          f3Organization: false,
          f4SolutionManagement: false,
          f5Requirements: false,
          f6FRDGeneration: false,
        },
      };

      // Extract test results
      results.suites?.forEach((suite: any) => {
        suite.specs?.forEach((spec: any) => {
          spec.tests?.forEach((test: any) => {
            if (test.results?.[0]?.status === 'passed') {
              summary.passed++;
            } else if (test.results?.[0]?.status === 'failed') {
              summary.failed++;
            } else {
              summary.skipped++;
            }
          });
        });
      });

      // Save enhanced summary
      fs.writeFileSync(
        'test-results/test-summary.json',
        JSON.stringify(summary, null, 2)
      );

      console.log('✅ Test summary generated');
      console.log(
        `📈 Results: ${summary.passed} passed, ${summary.failed} failed, ${summary.skipped} skipped`
      );
    } else {
      console.warn('⚠️  Test results file not found');
    }
  } catch (error) {
    console.error('❌ Failed to generate test summary:', error);
  }
}

async function cleanupTestDatabase() {
  console.log('🗑️  Cleaning up test database...');

  const prisma = new PrismaClient();

  try {
    // Remove test data (preserve structure)
    await prisma.fRDDocument.deleteMany({
      where: {
        title: {
          startsWith: 'Test:',
        },
      },
    });

    await prisma.requirement.deleteMany({
      where: {
        title: {
          startsWith: 'Test:',
        },
      },
    });

    await prisma.solution.deleteMany({
      where: {
        title: {
          startsWith: 'Test:',
        },
      },
    });

    await prisma.input.deleteMany({
      where: {
        title: {
          startsWith: 'Test:',
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          endsWith: '@faevision.com',
        },
      },
    });

    console.log('✅ Test database cleaned up');
  } catch (error) {
    console.error('❌ Test database cleanup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function archiveTestArtifacts() {
  console.log('📦 Archiving test artifacts...');

  try {
    const artifactsDir = 'test-results/artifacts';
    const archiveDir = `test-results/archive/${new Date().toISOString().split('T')[0]}`;

    // Create archive directory
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    // Archive screenshots
    const screenshotsDir = path.join(artifactsDir, 'screenshots');
    if (fs.existsSync(screenshotsDir)) {
      const screenshots = fs.readdirSync(screenshotsDir);
      screenshots.forEach(screenshot => {
        fs.copyFileSync(
          path.join(screenshotsDir, screenshot),
          path.join(archiveDir, screenshot)
        );
      });
    }

    // Archive videos
    const videosDir = path.join(artifactsDir, 'videos');
    if (fs.existsSync(videosDir)) {
      const videos = fs.readdirSync(videosDir);
      videos.forEach(video => {
        fs.copyFileSync(
          path.join(videosDir, video),
          path.join(archiveDir, video)
        );
      });
    }

    // Archive traces
    const tracesDir = path.join(artifactsDir, 'traces');
    if (fs.existsSync(tracesDir)) {
      const traces = fs.readdirSync(tracesDir);
      traces.forEach(trace => {
        fs.copyFileSync(
          path.join(tracesDir, trace),
          path.join(archiveDir, trace)
        );
      });
    }

    console.log('✅ Test artifacts archived');
  } catch (error) {
    console.error('❌ Test artifact archiving failed:', error);
  }
}

export default globalTeardown;
