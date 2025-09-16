#!/usr/bin/env node

/**
 * FAEVision Enhanced A&E Firm Seed Data
 * Adds comprehensive business data to the existing seed
 */

const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// A&E Firm Professional Users
const PROFESSIONAL_USERS = [
  {
    email: 'sarah.martinez@aetech.com',
    name: 'Sarah Martinez',
    role: 'ADMIN',
    title: 'Chief Executive Officer',
    department: 'Executive',
    billableRate: 450.0,
    targetUtilization: 0.6,
    utilizationRate: 0.65,
  },
  {
    email: 'jessica.kim@aetech.com',
    name: 'Jessica Kim',
    role: 'EXECUTIVE',
    title: 'Principal Architect',
    department: 'Architecture',
    billableRate: 285.0,
    targetUtilization: 0.75,
    utilizationRate: 0.82,
  },
  {
    email: 'robert.garcia@aetech.com',
    name: 'Robert Garcia',
    role: 'EXECUTIVE',
    title: 'Chief Engineer',
    department: 'Engineering',
    billableRate: 275.0,
    targetUtilization: 0.7,
    utilizationRate: 0.75,
  },
  {
    email: 'david.rodriguez@aetech.com',
    name: 'David Rodriguez',
    role: 'CONTRIBUTOR',
    title: 'Senior Architect',
    department: 'Architecture',
    billableRate: 225.0,
    targetUtilization: 0.8,
    utilizationRate: 0.85,
  },
  {
    email: 'lisa.anderson@aetech.com',
    name: 'Lisa Anderson',
    role: 'CONTRIBUTOR',
    title: 'Senior Structural Engineer',
    department: 'Engineering',
    billableRate: 215.0,
    targetUtilization: 0.8,
    utilizationRate: 0.83,
  },
];

// Department Data
const DEPARTMENTS = [
  {
    name: 'Executive',
    description: 'Senior leadership and strategic direction',
    headCount: 4,
    budgetAllocation: 1200000.0,
    costCenter: 'EXEC-001',
    location: 'Austin, TX',
    utilizationTarget: 0.65,
    actualUtilization: 0.67,
  },
  {
    name: 'Architecture',
    description: 'Architectural design and planning services',
    headCount: 45,
    budgetAllocation: 8500000.0,
    costCenter: 'ARCH-001',
    location: 'Austin, TX',
    utilizationTarget: 0.8,
    actualUtilization: 0.83,
  },
  {
    name: 'Engineering',
    description: 'Structural, MEP, and civil engineering services',
    headCount: 38,
    budgetAllocation: 7200000.0,
    costCenter: 'ENG-001',
    location: 'Austin, TX',
    utilizationTarget: 0.8,
    actualUtilization: 0.79,
  },
  {
    name: 'Project Management',
    description: 'Project coordination and delivery management',
    headCount: 18,
    budgetAllocation: 3200000.0,
    costCenter: 'PM-001',
    location: 'Austin, TX',
    utilizationTarget: 0.75,
    actualUtilization: 0.75,
  },
];

// A&E Operational Signals
const AE_SIGNALS = [
  {
    title: 'Foundation Elevation Conflict - Meridian Residential',
    description:
      "Structural drawings show foundation at elevation 100.5', but site survey indicates existing grade at 101.2'. This creates a conflict with proposed basement design and requires immediate coordination with civil engineering team.",
    severity: 'HIGH',
    departmentName: 'Engineering',
    sourceType: 'manual',
    sourceId: 'FIELD-2024-0156',
    systemName: 'Field Reporting System',
    tagsJson: {
      location: 'Meridian Residential Phase 2',
      projectCode: 'MER-2024-02',
      priority: 'immediate',
      disciplines: ['structural', 'civil', 'architecture'],
    },
    metricsJson: {
      elevationDiscrepancy: 0.7,
      affectedUnits: 12,
      potentialDelay: 5,
      estimatedCost: 35000,
    },
  },
  {
    title: 'MEP Routing Clash in Ceiling Plenum',
    description:
      'HVAC ductwork conflicts with electrical conduit routing in Building C, Level 2. Clash detected during BIM coordination review.',
    severity: 'MEDIUM',
    departmentName: 'Engineering',
    sourceType: 'system',
    sourceId: 'BIM-CLASH-789',
    systemName: 'Navisworks Clash Detection',
    tagsJson: {
      building: 'Building C',
      level: 'Level 2',
      systems: ['hvac', 'electrical'],
      clashType: 'hard_clash',
    },
    metricsJson: {
      clashCount: 23,
      affectedArea: 1250,
      resolutionTime: 48,
    },
  },
  {
    title: 'Fire Department Access Road Width Non-Compliance',
    description:
      'City fire marshal identified that proposed access road width of 18 feet does not meet new code requirement of 20 feet minimum.',
    severity: 'HIGH',
    departmentName: 'Architecture',
    sourceType: 'email',
    sourceId: 'FD-REVIEW-2024-08-15',
    systemName: 'City Review Portal',
    tagsJson: {
      codeSection: 'Fire Code 503.2.1',
      reviewer: 'Fire Marshal Johnson',
      project: 'Oakwood Commons',
    },
    metricsJson: {
      roadWidthRequired: 20,
      roadWidthProposed: 18,
      affectedParkingSpaces: 8,
    },
  },
  {
    title: 'Change Request - Additional Conference Rooms',
    description:
      'Client requesting addition of 3 conference rooms to second floor of office building. Requires structural analysis for partition loads.',
    severity: 'MEDIUM',
    departmentName: 'Architecture',
    sourceType: 'email',
    sourceId: 'CR-2024-033',
    systemName: 'Client Communication Portal',
    tagsJson: {
      changeType: 'scope_addition',
      client: 'TechStart Ventures',
      impactedSystems: ['structural', 'mep', 'architectural'],
    },
    metricsJson: {
      additionalSqft: 450,
      estimatedCost: 67500,
      scheduleImpact: 10,
    },
  },
  {
    title: 'Smartsheet Sync Failure - Project Dashboard',
    description:
      'Automated sync between Deltek and Smartsheet has failed for 3 days. Project managers unable to access current budget data.',
    severity: 'CRITICAL',
    departmentName: 'Project Management',
    sourceType: 'system',
    sourceId: 'SYNC-ERROR-2024-156',
    systemName: 'Integration Monitoring',
    tagsJson: {
      systems: ['deltek', 'smartsheet'],
      errorType: 'api_timeout',
      affectedProjects: ['MER-2024-01', 'OAK-2024-03'],
    },
    metricsJson: {
      downtimeDays: 3,
      affectedProjects: 8,
      userImpact: 15,
    },
  },
];

async function enhanceWithProfessionalData() {
  console.log('🏢 Enhancing seed data with professional A&E firm content...');

  try {
    // Update existing departments with business data
    console.log('📊 Updating departments with business metrics...');
    for (const dept of DEPARTMENTS) {
      await prisma.department.upsert({
        where: { name: dept.name },
        update: dept,
        create: dept,
      });
      console.log(`   ✅ Updated: ${dept.name}`);
    }

    // Create professional users
    console.log('👥 Creating professional users...');
    for (const userData of PROFESSIONAL_USERS) {
      const passwordHash = await bcrypt.hash('demo123', 10);

      await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          ...userData,
          isActive: true,
          lastLoginAt: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ),
        },
        create: {
          ...userData,
          passwordHash,
          isActive: true,
          lastLoginAt: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ),
        },
      });
      console.log(`   ✅ Created: ${userData.name} (${userData.title})`);
    }

    // Create A&E operational signals
    console.log('📡 Creating A&E operational signals...');
    for (let i = 0; i < AE_SIGNALS.length; i++) {
      const signalData = AE_SIGNALS[i];
      const department = await prisma.department.findUnique({
        where: { name: signalData.departmentName },
      });
      const creator = await prisma.user.findFirst({
        where: { department: signalData.departmentName },
      });

      await prisma.signal.create({
        data: {
          inputId: `AE-SIGNAL-${Date.now()}-${String(i + 1).padStart(3, '0')}`,
          timestamp: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ),
          title: signalData.title,
          description: signalData.description,
          severity: signalData.severity,
          severityScore:
            signalData.severity === 'CRITICAL'
              ? 4
              : signalData.severity === 'HIGH'
                ? 3
                : signalData.severity === 'MEDIUM'
                  ? 2
                  : 1,
          departmentId: department?.id,
          sourceType: signalData.sourceType,
          sourceId: signalData.sourceId,
          systemName: signalData.systemName,
          tagsJson: signalData.tagsJson,
          metricsJson: signalData.metricsJson,
          createdById: creator?.id,
          aiProcessed: Math.random() > 0.3,
          confidence: Math.random() * 0.3 + 0.7,
        },
      });
      console.log(`   ✅ Created signal: ${signalData.title}`);
    }

    // Create realistic comments and votes
    console.log('💬 Creating collaborative content...');
    const signals = await prisma.signal.findMany({
      include: { createdBy: true },
    });

    for (const signal of signals) {
      // Create 2-5 comments per signal
      const commentCount = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < commentCount; i++) {
        const commenter =
          PROFESSIONAL_USERS[
            Math.floor(Math.random() * PROFESSIONAL_USERS.length)
          ];
        const user = await prisma.user.findUnique({
          where: { email: commenter.email },
        });

        if (user) {
          await prisma.comment.create({
            data: {
              content: `This is a professional comment about the ${signal.title} issue. We need to coordinate with the relevant teams to resolve this.`,
              entityType: 'SIGNAL',
              entityId: signal.id,
              createdBy: user.id,
              createdAt: new Date(
                signal.createdAt.getTime() + i * 60 * 60 * 1000
              ),
            },
          });
        }
      }

      // Create 3-8 votes per signal (ensuring unique users)
      const voteCount = Math.floor(Math.random() * 6) + 3;
      const usedVoters = new Set();
      for (
        let i = 0;
        i < voteCount && usedVoters.size < PROFESSIONAL_USERS.length;
        i++
      ) {
        const voter =
          PROFESSIONAL_USERS[
            Math.floor(Math.random() * PROFESSIONAL_USERS.length)
          ];
        if (usedVoters.has(voter.email)) continue; // Skip if user already voted

        const user = await prisma.user.findUnique({
          where: { email: voter.email },
        });

        if (user) {
          usedVoters.add(voter.email);
          try {
            await prisma.vote.create({
              data: {
                value: Math.random() > 0.7 ? 'DOWN' : 'UP',
                entityType: 'SIGNAL',
                entityId: signal.id,
                createdBy: user.id,
              },
            });
          } catch (error) {
            // Skip if vote already exists
            if (error.code !== 'P2002') throw error;
          }
        }
      }
    }

    console.log('✅ Professional A&E firm enhancement completed!');
  } catch (error) {
    console.error('❌ Enhancement failed:', error);
    throw error;
  }
}

enhanceWithProfessionalData()
  .catch(e => {
    console.error('❌ Enhancement script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
