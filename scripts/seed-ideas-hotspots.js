#!/usr/bin/env node

/**
 * FAEVision Ideas & Hotspots Seed Data
 * Creates sample hotspots and ideas for demonstration
 * Expert: Scott Garrettson (Data Architecture)
 */

const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

const HOTSPOTS_DATA = [
  {
    title: 'Foundation & Structural Conflicts',
    summary:
      'Multiple signals indicate foundation elevation and structural conflicts across residential projects',
    status: 'OPEN',
    confidence: 0.85,
    clusteringMethod: 'HDBSCAN',
    primaryCategoryId: null,
  },
  {
    title: 'MEP Coordination Issues',
    summary:
      'HVAC, electrical, and plumbing systems showing routing conflicts in commercial buildings',
    status: 'OPEN',
    confidence: 0.78,
    clusteringMethod: 'HDBSCAN',
    primaryCategoryId: null,
  },
  {
    title: 'Code Compliance & Accessibility',
    summary:
      'Fire access, ADA compliance, and building code violations identified across multiple sites',
    status: 'OPEN',
    confidence: 0.92,
    clusteringMethod: 'HDBSCAN',
    primaryCategoryId: null,
  },
];

const IDEAS_DATA = [
  {
    title: 'Implement BIM Clash Detection Protocol',
    description:
      'Establish standardized BIM coordination workflow with weekly clash detection reviews and automated reporting to prevent MEP conflicts before construction begins.',
    origin: 'hybrid',
    votes: 12,
    status: 'approved',
    confidence: 0.88,
    evidenceJson: {
      supportingSignals: ['MEP Routing Clash', 'HVAC ductwork conflicts'],
      estimatedImpact: '25% reduction in field rework',
      implementationCost: '$15,000 setup + $5,000/month',
    },
    tagsJson: ['BIM', 'coordination', 'prevention', 'efficiency'],
  },
  {
    title: 'Digital Foundation Verification System',
    description:
      'Create mobile app for real-time foundation elevation verification with GPS integration and automated comparison against as-built drawings.',
    origin: 'ai',
    votes: 8,
    status: 'review',
    confidence: 0.76,
    evidenceJson: {
      supportingSignals: [
        'Foundation Elevation Conflict',
        'elevation discrepancies',
      ],
      estimatedImpact: '40% reduction in foundation rework',
      implementationCost: '$25,000 development + $2,000/month',
    },
    tagsJson: ['mobile', 'foundation', 'verification', 'GPS'],
  },
  {
    title: 'Automated Code Compliance Checker',
    description:
      'AI-powered system to automatically scan drawings and specifications against current building codes and accessibility requirements.',
    origin: 'human',
    votes: 15,
    status: 'developing',
    confidence: 0.91,
    evidenceJson: {
      supportingSignals: [
        'Fire Department Access Road',
        'ADA compliance issues',
      ],
      estimatedImpact: '60% faster code review process',
      implementationCost: '$35,000 development + $8,000/month',
    },
    tagsJson: ['AI', 'compliance', 'automation', 'code-review'],
  },
  {
    title: 'Field Issue Reporting Mobile App',
    description:
      'Mobile application for field teams to instantly report issues with photos, GPS location, and automatic categorization.',
    origin: 'human',
    votes: 22,
    status: 'approved',
    confidence: 0.95,
    evidenceJson: {
      supportingSignals: [
        'Field coordination issues',
        'Quality control problems',
      ],
      estimatedImpact: '50% faster issue resolution',
      implementationCost: '$20,000 development + $3,000/month',
    },
    tagsJson: ['mobile', 'field-reporting', 'photos', 'GPS'],
  },
  {
    title: 'Predictive Quality Control System',
    description:
      'Machine learning system to predict potential quality issues based on historical data and current project parameters.',
    origin: 'ai',
    votes: 6,
    status: 'draft',
    confidence: 0.68,
    evidenceJson: {
      supportingSignals: ['Quality control patterns', 'Rework trends'],
      estimatedImpact: '30% reduction in quality-related delays',
      implementationCost: '$45,000 development + $12,000/month',
    },
    tagsJson: ['AI', 'predictive', 'quality-control', 'machine-learning'],
  },
];

async function createHotspotsAndIdeas() {
  console.log('🔄 Creating Hotspots and Ideas seed data...');

  try {
    // First, get some existing signals to link to hotspots
    const signals = await prisma.signal.findMany({
      take: 10,
      select: { id: true },
    });

    console.log(`📊 Found ${signals.length} signals in database`);

    if (signals.length === 0) {
      console.log(
        '❌ No signals found - cannot create hotspots without signals'
      );
      return;
    }

    // Create hotspots
    const createdHotspots = [];
    for (let i = 0; i < HOTSPOTS_DATA.length; i++) {
      const hotspotData = HOTSPOTS_DATA[i];

      const hotspot = await prisma.hotspot.create({
        data: {
          title: hotspotData.title,
          summary: hotspotData.summary,
          status: hotspotData.status,
          confidence: hotspotData.confidence,
          clusteringMethod: hotspotData.clusteringMethod,
          primaryCategoryId: hotspotData.primaryCategoryId,
        },
      });

      console.log(`✅ Created hotspot: ${hotspot.title}`);

      // Link some signals to this hotspot
      const signalsToLink = signals.slice(i * 2, (i + 1) * 2); // 2 signals per hotspot
      for (const signal of signalsToLink) {
        await prisma.hotspotSignal.create({
          data: {
            hotspotId: hotspot.id,
            signalId: signal.id,
            membershipStrength: 0.8 + Math.random() * 0.2, // 0.8-1.0
            isOutlier: false,
          },
        });
      }

      createdHotspots.push(hotspot);
    }

    // Get a user for createdById
    const user = await prisma.user.findFirst({
      select: { id: true },
    });

    if (!user) {
      console.log('❌ No users found - cannot create ideas without users');
      return;
    }

    // Create ideas linked to hotspots
    for (let i = 0; i < IDEAS_DATA.length; i++) {
      const ideaData = IDEAS_DATA[i];
      const hotspot = createdHotspots[i % createdHotspots.length]; // Cycle through hotspots

      const idea = await prisma.idea.create({
        data: {
          hotspotId: hotspot.id,
          title: ideaData.title,
          description: ideaData.description,
          origin: ideaData.origin,
          votes: ideaData.votes,
          status: ideaData.status,
          confidence: ideaData.confidence,
          evidenceJson: ideaData.evidenceJson,
          tagsJson: ideaData.tagsJson,
          createdById: user.id,
        },
      });

      console.log(`💡 Created idea: ${idea.title} (${idea.votes} votes)`);
    }

    console.log('🎉 Successfully created hotspots and ideas!');

    // Verify the data
    const finalCounts = await Promise.all([
      prisma.hotspot.count(),
      prisma.idea.count(),
      prisma.hotspotSignal.count(),
    ]);

    console.log('📊 Final counts:');
    console.log(`  - Hotspots: ${finalCounts[0]}`);
    console.log(`  - Ideas: ${finalCounts[1]}`);
    console.log(`  - Hotspot-Signal links: ${finalCounts[2]}`);
  } catch (error) {
    console.error('❌ Error creating seed data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
createHotspotsAndIdeas()
  .then(() => {
    console.log('✅ Seed data creation completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Seed data creation failed:', error);
    process.exit(1);
  });
