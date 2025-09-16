import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const HOTSPOTS_DATA = [
  {
    title: 'Foundation & Structural Conflicts',
    summary:
      'Multiple signals indicate foundation elevation and structural conflicts across residential projects',
    status: 'OPEN',
    confidence: 0.85,
    clusteringMethod: 'HDBSCAN',
  },
  {
    title: 'MEP Coordination Issues',
    summary:
      'HVAC, electrical, and plumbing systems showing routing conflicts in commercial buildings',
    status: 'OPEN',
    confidence: 0.78,
    clusteringMethod: 'HDBSCAN',
  },
  {
    title: 'Code Compliance & Accessibility',
    summary:
      'Fire access, ADA compliance, and building code violations identified across multiple sites',
    status: 'OPEN',
    confidence: 0.92,
    clusteringMethod: 'HDBSCAN',
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
  },
  {
    title: 'Digital Foundation Verification System',
    description:
      'Create mobile app for real-time foundation elevation verification with GPS integration and automated comparison against as-built drawings.',
    origin: 'ai',
    votes: 8,
    status: 'review',
    confidence: 0.76,
  },
  {
    title: 'Automated Code Compliance Checker',
    description:
      'AI-powered system to automatically scan drawings and specifications against current building codes and accessibility requirements.',
    origin: 'human',
    votes: 15,
    status: 'developing',
    confidence: 0.91,
  },
  {
    title: 'Field Issue Reporting Mobile App',
    description:
      'Mobile application for field teams to instantly report issues with photos, GPS location, and automatic categorization.',
    origin: 'human',
    votes: 22,
    status: 'approved',
    confidence: 0.95,
  },
  {
    title: 'Predictive Quality Control System',
    description:
      'Machine learning system to predict potential quality issues based on historical data and current project parameters.',
    origin: 'ai',
    votes: 6,
    status: 'draft',
    confidence: 0.68,
  },
];

export async function POST() {
  console.log('🔄 Starting Ideas & Hotspots seeding...');

  try {
    // Check if data already exists
    const existingIdeas = await prisma.idea.count();
    const existingHotspots = await prisma.hotspot.count();

    if (existingIdeas > 0 || existingHotspots > 0) {
      return NextResponse.json({
        success: false,
        message: `Data already exists: ${existingHotspots} hotspots, ${existingIdeas} ideas`,
      });
    }

    // Get existing signals
    const signals = await prisma.signal.findMany({
      take: 10,
      select: { id: true },
    });

    if (signals.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No signals found - cannot create hotspots without signals',
      });
    }

    console.log(`📊 Found ${signals.length} signals to link to hotspots`);

    // Create hotspots
    const createdHotspots = [];
    for (let i = 0; i < HOTSPOTS_DATA.length; i++) {
      const hotspotData = HOTSPOTS_DATA[i];

      const hotspot = await prisma.hotspot.create({
        data: {
          title: hotspotData.title,
          summary: hotspotData.summary,
          status: hotspotData.status as any,
          confidence: hotspotData.confidence,
          clusteringMethod: hotspotData.clusteringMethod,
        },
      });

      // Link signals to hotspot
      const signalsToLink = signals.slice(i * 2, (i + 1) * 2);
      for (const signal of signalsToLink) {
        await prisma.hotspotSignal.create({
          data: {
            hotspotId: hotspot.id,
            signalId: signal.id,
            membershipStrength: 0.8 + Math.random() * 0.2,
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
      return NextResponse.json({
        success: false,
        message: 'No users found - cannot create ideas without users',
      });
    }

    // Create ideas
    const createdIdeas = [];
    for (let i = 0; i < IDEAS_DATA.length; i++) {
      const ideaData = IDEAS_DATA[i];
      const hotspot = createdHotspots[i % createdHotspots.length];

      const idea = await prisma.idea.create({
        data: {
          hotspotId: hotspot.id,
          title: ideaData.title,
          description: ideaData.description,
          origin: ideaData.origin,
          votes: ideaData.votes,
          status: ideaData.status,
          confidence: ideaData.confidence,
          createdById: user.id,
        },
      });

      createdIdeas.push(idea);
    }

    // Get final counts
    const [finalHotspots, finalIdeas, finalLinks] = await Promise.all([
      prisma.hotspot.count(),
      prisma.idea.count(),
      prisma.hotspotSignal.count(),
    ]);

    console.log('🎉 Successfully seeded database!');

    return NextResponse.json({
      success: true,
      message: `Created ${createdHotspots.length} hotspots and ${createdIdeas.length} ideas`,
      data: {
        hotspots: finalHotspots,
        ideas: finalIdeas,
        links: finalLinks,
      },
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
