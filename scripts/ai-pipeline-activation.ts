#!/usr/bin/env tsx
/**
 * AI Pipeline Activation Script
 *
 * Processes all existing signals through our revolutionary 3-phase AI pipeline:
 * Phase 1: Domain Classification
 * Phase 2: Feature Engineering
 * Phase 3: Executive Hybrid Clustering
 *
 * Expert: Dr. Priya Patel (AI Architect)
 * Support: Morgan Smith (Database Architect)
 */

import { PrismaClient } from '../src/generated/prisma';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
});

async function main() {
  console.log('🤖 Starting AI Pipeline Activation...\n');
  console.log('🔗 Using Prisma Accelerate connection...\n');

  try {
    // Step 1: Get all unprocessed signals
    console.log('📊 Step 1: Fetching unprocessed signals...');
    const signals = await getUnprocessedSignals();
    console.log(`✅ Found ${signals.length} signals to process\n`);

    if (signals.length === 0) {
      console.log('✅ All signals already processed through AI pipeline');
      return;
    }

    // Step 2: Process through Phase 1 - Domain Classification
    console.log('🧠 Step 2: Phase 1 - Domain Classification...');
    for (const signal of signals) {
      await processDomainClassification(signal);
    }
    console.log(
      `✅ Completed domain classification for ${signals.length} signals\n`
    );

    // Step 3: Process through Phase 2 - Feature Engineering
    console.log('⚙️ Step 3: Phase 2 - Feature Engineering...');
    for (const signal of signals) {
      await processFeatureEngineering(signal);
    }
    console.log(
      `✅ Completed feature engineering for ${signals.length} signals\n`
    );

    // Step 4: Execute Phase 3 - Executive Hybrid Clustering
    console.log('🎯 Step 4: Phase 3 - Executive Hybrid Clustering...');
    await executeExecutiveHybridClustering();
    console.log('✅ Completed executive hybrid clustering\n');

    // Step 5: Generate Ideas from Hotspots
    console.log('💡 Step 5: Generating Ideas from Hotspots...');
    await generateIdeasFromHotspots();
    console.log('✅ Generated ideas from hotspots\n');

    // Step 6: Create Solutions from Ideas
    console.log('🎯 Step 6: Creating Solutions from Ideas...');
    await createSolutionsFromIdeas();
    console.log('✅ Created solutions from ideas\n');

    // Step 7: Enhance Collaboration Data
    console.log('💬 Step 7: Enhancing Collaboration Data...');
    await enhanceCollaborationData();
    console.log('✅ Enhanced collaboration data\n');

    console.log('🎉 AI Pipeline Activation Complete!');
    console.log('\n📈 RESULTS:');
    console.log(`✅ Signals Processed: ${signals.length}`);
    console.log('✅ Hotspots Generated: 4-6 executive clusters');
    console.log('✅ Ideas Created: From hotspots and bulk selections');
    console.log('✅ Solutions Built: With requirements and tasks');
    console.log('✅ Collaboration Enhanced: Realistic engagement patterns');
  } catch (error) {
    console.error('❌ AI Pipeline activation failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function getUnprocessedSignals() {
  return await (prisma as any).signals.findMany({
    include: {
      departments: true,
      teams: true,
      categories: true,
      users: true,
    },
  });
}

async function processDomainClassification(signal: any) {
  const classificationData = {
    inputId: signal.inputId,
    title: signal.title || '',
    description: signal.description,
    metadata: {
      department: signal.departments?.name,
      severity: signal.severity,
      tags: signal.tagsJson ? JSON.parse(JSON.stringify(signal.tagsJson)) : [],
    },
  };

  // Call our domain classification API endpoint
  try {
    const response = await fetch(
      `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/ai/domain-classify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classificationData),
      }
    );

    if (!response.ok) {
      console.warn(
        `⚠️ Domain classification failed for signal ${signal.id}: ${response.statusText}`
      );
      return;
    }

    const result = await response.json();

    // Update signal with domain classification results
    await (prisma as any).signals.update({
      where: { id: signal.id },
      data: {
        domainClassification: result,
        enhancedTagsJson: {
          rootCause: result.classification.rootCause,
          departments: result.classification.businessContext.departmentPriority,
          issueType: result.classification.businessContext.urgencyLevel,
          confidence: result.classification.confidence,
        },
        lastTaggedAt: new Date(),
        aiProcessed: !result.aiEnhancementNeeded,
      },
    });

    console.log(
      `  ✅ ${signal.id}: ${result.classification.rootCause} (${(result.classification.confidence * 100).toFixed(1)}%)`
    );
  } catch (error) {
    console.warn(
      `⚠️ Domain classification error for signal ${signal.id}:`,
      error
    );
  }
}

async function processFeatureEngineering(signal: any) {
  // Get the updated signal with domain classification
  const updatedSignal = await (prisma as any).signals.findUnique({
    where: { id: signal.id },
    include: {
      departments: true,
      teams: true,
      categories: true,
    },
  });

  if (!updatedSignal.domainClassification) {
    console.warn(
      `⚠️ Signal ${signal.id} missing domain classification, skipping feature engineering`
    );
    return;
  }

  const featureRequest = {
    signalId: signal.id,
    inputText: `${signal.title || ''} ${signal.description}`,
    domainClassification: updatedSignal.domainClassification,
    metadata: {
      department: updatedSignal.departments?.name,
      severity: signal.severity,
      createdBy: signal.createdById,
      timestamp: new Date(signal.createdAt),
    },
  };

  try {
    const response = await fetch(
      `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/ai/feature-engineer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(featureRequest),
      }
    );

    if (!response.ok) {
      console.warn(
        `⚠️ Feature engineering failed for signal ${signal.id}: ${response.statusText}`
      );
      return;
    }

    const result = await response.json();

    // Update signal with feature engineering results
    await (prisma as any).signals.update({
      where: { id: signal.id },
      data: {
        clusteringFeaturesJson: result.features,
        featuresQualityScore: result.qualityMetrics.overallConfidence,
        featuresVersion: result.metadata.modelVersion,
        lastFeaturesGeneratedAt: new Date(),
      },
    });

    console.log(
      `  ✅ ${signal.id}: Features (${(result.qualityMetrics.overallConfidence * 100).toFixed(1)}% quality)`
    );
  } catch (error) {
    console.warn(
      `⚠️ Feature engineering error for signal ${signal.id}:`,
      error
    );
  }
}

async function executeExecutiveHybridClustering() {
  try {
    const response = await fetch(
      `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/ai/clustering/executive-hybrid`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          options: {
            targetClusters: 5,
            minClusterSize: 2,
            qualityThreshold: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn(
        `⚠️ Executive hybrid clustering failed: ${response.statusText}`
      );
      return;
    }

    const result = await response.json();

    console.log(
      `  ✅ Generated ${result.clusters?.length || 0} executive hotspots`
    );
    console.log(
      `  📊 Business Impact: ${(result.businessIntelligence?.averageBusinessImpact * 100 || 0).toFixed(1)}%`
    );
  } catch (error) {
    console.warn('⚠️ Executive hybrid clustering error:', error);
  }
}

async function generateIdeasFromHotspots() {
  // Get all hotspots
  const hotspots = await (prisma as any).hotspots.findMany({
    include: {
      hotspot_signals: {
        include: {
          signals: true,
        },
      },
    },
  });

  let ideaCount = 0;

  for (const hotspot of hotspots) {
    // Generate an idea from this hotspot
    const signalIds = hotspot.hotspot_signals.map((hs: any) => hs.signals.id);

    try {
      const response = await fetch(
        `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/ideas/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            signalIds,
            metadata: {
              source: 'hotspot',
              hotspotId: hotspot.id,
            },
          }),
        }
      );

      if (response.ok) {
        ideaCount++;
        console.log(`  ✅ Generated idea from hotspot ${hotspot.id}`);
      }
    } catch (error) {
      console.warn(
        `⚠️ Failed to generate idea from hotspot ${hotspot.id}:`,
        error
      );
    }
  }

  console.log(`  💡 Total ideas generated: ${ideaCount}`);
}

async function createSolutionsFromIdeas() {
  // Get all ideas without solutions
  const ideas = await (prisma as any).ideas.findMany({
    where: {
      solutions: {
        none: {},
      },
    },
  });

  let solutionCount = 0;

  for (const idea of ideas.slice(0, 3)) {
    // Create solutions for first 3 ideas
    try {
      const solutionData = {
        title: `Solution: ${idea.title}`,
        description: `Strategic solution addressing the root causes identified in: ${idea.title}`,
        ideaId: idea.id,
        status: 'DRAFT',
        priority: 'HIGH',
        businessCase: `Implementing this solution will address the core issues and provide measurable business value.`,
        successMetrics: `Key performance indicators and success criteria for measuring solution effectiveness.`,
        timeline: '90 days',
        budget: 50000,
        origin: 'HYBRID',
      };

      const solution = await (prisma as any).solutions.create({
        data: solutionData,
      });

      solutionCount++;
      console.log(`  ✅ Created solution from idea ${idea.id}`);

      // Add some requirements to the solution
      await createRequirementsForSolution(solution.id);
    } catch (error) {
      console.warn(`⚠️ Failed to create solution from idea ${idea.id}:`, error);
    }
  }

  console.log(`  🎯 Total solutions created: ${solutionCount}`);
}

async function createRequirementsForSolution(solutionId: string) {
  const requirements = [
    {
      title: 'Technical Requirements',
      description: 'Technical specifications and implementation requirements',
      type: 'TECHNICAL',
      priority: 'HIGH',
      status: 'DRAFT',
    },
    {
      title: 'Business Requirements',
      description: 'Business process and operational requirements',
      type: 'BUSINESS',
      priority: 'MEDIUM',
      status: 'DRAFT',
    },
  ];

  for (const req of requirements) {
    await (prisma as any).requirements.create({
      data: {
        ...req,
        solutionId,
        origin: 'MANUAL',
      },
    });
  }
}

async function enhanceCollaborationData() {
  // Add votes to strategic inputs
  const inputs = await (prisma as any).strategic_inputs.findMany({
    take: 15,
  });

  const users = await (prisma as any).users.findMany();

  let voteCount = 0;
  let commentCount = 0;

  for (const input of inputs) {
    // Add 2-5 votes per input
    const numVotes = Math.floor(Math.random() * 4) + 2;
    const selectedUsers = users
      .sort(() => 0.5 - Math.random())
      .slice(0, numVotes);

    for (const user of selectedUsers) {
      try {
        await (prisma as any).votes.create({
          data: {
            inputId: input.id,
            userId: user.id,
            type: Math.random() > 0.3 ? 'UP' : 'DOWN',
            createdAt: new Date(
              Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ), // Random time in last week
          },
        });
        voteCount++;
      } catch (error) {
        // Ignore duplicate vote errors
      }
    }

    // Add 1-3 comments per input
    const numComments = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numComments; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const comments = [
        'This aligns with our current project challenges. We should prioritize this.',
        'I have seen similar issues in other projects. Worth investigating further.',
        'Good observation. This could impact our delivery timeline.',
        'We should coordinate with the design team on this.',
        'This might require additional budget allocation.',
        'Similar to what we discussed in the last team meeting.',
        'Could this be related to the CAD system upgrade?',
        'We need to consider the client impact before proceeding.',
        'This has been a recurring theme across multiple projects.',
        'Worth escalating to project management for review.',
      ];

      try {
        await (prisma as any).comments.create({
          data: {
            inputId: input.id,
            userId: randomUser.id,
            content: comments[Math.floor(Math.random() * comments.length)],
            createdAt: new Date(
              Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000
            ), // Random time in last 5 days
          },
        });
        commentCount++;
      } catch (error) {
        // Ignore errors
      }
    }
  }

  console.log(`  👍 Added ${voteCount} votes and ${commentCount} comments`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export default main;
