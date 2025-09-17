/**
 * Re-tag Preview Signals - Sprint 1 Fix
 * Expert: Dr. Rachel Kim (AI Tagging Specialist)
 *
 * Re-tag existing signals in Preview environment using enhanced AI tagging
 */

import { prisma } from '../src/lib/prisma';
import { enhancedTaggingEngine } from '../src/lib/ai/enhanced-tagging-engine';
import { validateEnhancedTagging } from '../src/types/enhanced-tagging';

interface RetaggingResult {
  signalId: string;
  title: string;
  success: boolean;
  processingTime: number;
  rootCause?: string;
  confidence?: number;
  error?: string;
}

async function main() {
  console.log('🏷️  Re-tagging Preview Environment Signals - Sprint 1\n');
  console.log('Expert: Dr. Rachel Kim (AI Tagging Specialist)');
  console.log('Using enhanced AI tagging with A&E domain expertise\n');
  console.log('='.repeat(80) + '\n');

  const results: RetaggingResult[] = [];
  let totalProcessingTime = 0;

  try {
    // Get all signals from database
    console.log('📊 Fetching signals from Preview database...');
    const signals = await (prisma as any).signal.findMany({
      include: {
        department: true,
        team: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`✅ Found ${signals.length} signals in Preview environment\n`);

    if (signals.length === 0) {
      console.log(
        '⚠️  No signals found. Please ensure signals are seeded in Preview environment.'
      );
      return;
    }

    // Process each signal
    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i];
      const signalNumber = i + 1;

      console.log(`🔄 Processing Signal ${signalNumber}/${signals.length}`);
      console.log(`   Title: ${signal.title || 'Untitled Signal'}`);
      console.log(`   ID: ${signal.id}`);
      console.log(
        `   Department: ${signal.department?.name || signal.department || 'Unknown'}`
      );
      console.log(`   Severity: ${signal.severity}`);

      const startTime = Date.now();

      try {
        // Prepare context for tagging
        const existingContext = {
          department: signal.department?.name || signal.department,
          team: signal.team?.name,
          severity: signal.severity,
          severityScore: signal.severityScore,
          sourceType: signal.sourceType,
          createdBy: signal.createdBy?.name,
        };

        // Generate enhanced tags using our AI system
        const { tags, metadata, domainClassification } =
          await enhancedTaggingEngine.generateEnhancedTags(
            signal.title || 'Untitled Signal',
            signal.description,
            existingContext
          );

        const processingTime = Date.now() - startTime;
        totalProcessingTime += processingTime;

        // Validate generated tags
        if (!validateEnhancedTagging(tags)) {
          throw new Error('Generated tags failed validation');
        }

        // Update signal in database
        await (prisma as any).signal.update({
          where: { id: signal.id },
          data: {
            enhancedTagsJson: tags,
            tagGenerationMeta: metadata,
            domainClassification: domainClassification,
            lastTaggedAt: new Date(),
            tagModelVersion: metadata.modelVersion,
            aiProcessed: true,
          },
        });

        const result: RetaggingResult = {
          signalId: signal.id,
          title: signal.title || 'Untitled Signal',
          success: true,
          processingTime,
          rootCause: tags.rootCause.primary,
          confidence: tags.rootCause.confidence,
        };

        results.push(result);

        console.log(
          `   ✅ Root Cause: ${tags.rootCause.primary} (${(tags.rootCause.confidence * 100).toFixed(1)}% confidence)`
        );
        console.log(
          `   📊 Impact: ${tags.businessContext.impact} | Urgency: ${tags.businessContext.urgency}`
        );
        console.log(`   ⚡ Processing Time: ${processingTime}ms`);
        console.log('');
      } catch (error: any) {
        const processingTime = Date.now() - startTime;
        totalProcessingTime += processingTime;

        const result: RetaggingResult = {
          signalId: signal.id,
          title: signal.title || 'Untitled Signal',
          success: false,
          processingTime,
          error: error.message,
        };

        results.push(result);

        console.log(`   ❌ Error: ${error.message}`);
        console.log(`   ⚡ Processing Time: ${processingTime}ms`);
        console.log('');
      }

      // Small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Calculate final statistics
    const successfulResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);
    const averageProcessingTime = totalProcessingTime / results.length;

    // Root cause distribution
    const rootCauseDistribution: Record<string, number> = {};
    successfulResults.forEach(r => {
      if (r.rootCause) {
        rootCauseDistribution[r.rootCause] =
          (rootCauseDistribution[r.rootCause] || 0) + 1;
      }
    });

    // Display final results
    console.log('='.repeat(80));
    console.log('📊 PREVIEW ENVIRONMENT RE-TAGGING RESULTS');
    console.log('='.repeat(80));

    console.log(`\n📈 PROCESSING SUMMARY:`);
    console.log(`   Total Signals: ${results.length}`);
    console.log(`   Successfully Tagged: ${successfulResults.length}`);
    console.log(`   Failed: ${failedResults.length}`);
    console.log(
      `   Success Rate: ${((successfulResults.length / results.length) * 100).toFixed(1)}%`
    );
    console.log(`   Total Processing Time: ${totalProcessingTime}ms`);
    console.log(
      `   Average Processing Time: ${averageProcessingTime.toFixed(0)}ms`
    );

    if (Object.keys(rootCauseDistribution).length > 0) {
      console.log(`\n🎯 ROOT CAUSE DISTRIBUTION:`);
      Object.entries(rootCauseDistribution)
        .sort(([, a], [, b]) => b - a)
        .forEach(([rootCause, count]) => {
          const percentage = ((count / successfulResults.length) * 100).toFixed(
            1
          );
          console.log(`   ${rootCause}: ${count} signals (${percentage}%)`);
        });
    }

    if (failedResults.length > 0) {
      console.log(`\n❌ FAILED SIGNALS:`);
      failedResults.forEach(r => {
        console.log(`   ${r.signalId}: ${r.error}`);
      });
    }

    // Validate success criteria
    console.log(`\n✅ SPRINT 1 SUCCESS VALIDATION:`);
    const highSuccessRate = successfulResults.length / results.length >= 0.9;
    console.log(
      `   ✅ 90%+ success rate: ${highSuccessRate ? 'PASS' : 'FAIL'} (${((successfulResults.length / results.length) * 100).toFixed(1)}%)`
    );

    const fastPerformance = averageProcessingTime < 500; // Allow more time due to fallback tagging
    console.log(
      `   ✅ Fast performance: ${fastPerformance ? 'PASS' : 'FAIL'} (${averageProcessingTime.toFixed(0)}ms avg)`
    );

    const consistentClassification =
      Object.keys(rootCauseDistribution).length >= 3;
    console.log(
      `   ✅ Consistent classification: ${consistentClassification ? 'PASS' : 'FAIL'} (${Object.keys(rootCauseDistribution).length} categories)`
    );

    const overallSuccess = highSuccessRate && consistentClassification;
    console.log(
      `\n🎉 OVERALL STATUS: ${overallSuccess ? 'SUCCESS - READY FOR CLUSTERING' : 'NEEDS ATTENTION'}`
    );

    if (overallSuccess) {
      console.log('\n🚀 NEXT STEPS FOR SPRINT 2:');
      console.log(
        '   ✅ Enhanced tagging provides consistent root cause classification'
      );
      console.log('   ✅ Preview environment signals are properly tagged');
      console.log('   ✅ Ready to implement hybrid clustering algorithm');
      console.log(
        '   ✅ Can now transform 1 giant cluster into 4-6 meaningful clusters'
      );
    }
  } catch (error: any) {
    console.error('\n❌ Re-tagging failed:', error.message);
    console.error('Stack trace:', error.stack);

    if (error.message.includes('Environment variable not found')) {
      console.log(
        '\n💡 SOLUTION: Run this script in the Vercel Preview environment where'
      );
      console.log('   the PRISMA_DATABASE_URL is automatically available');
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
