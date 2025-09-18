#!/usr/bin/env npx tsx

/**
 * Simplified A&E Firm Seed Data - Schema Compliant
 * Expert Team: Focus on working seed data for hotspot testing
 *
 * Team Contributors:
 * - Marcus Rodriguez (Strategic Consultant): A&E operations insights
 * - Morgan Smith (Database Architect): Schema compliance
 * - Dr. Priya Patel (AI Architect): Clustering requirements
 */

import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️ Seeding Meridian A&E Firm (Schema Compliant)...\n');

  const hashedPassword = await bcrypt.hash('demo123', 12);

  // Create departments (reusing existing ones or creating new)
  const departments = await Promise.all([
    (prisma as any).departments.upsert({
      where: { name: 'Executive Leadership' },
      update: {},
      create: {
        name: 'Executive Leadership',
        description: 'C-suite and senior leadership',
        headCount: 8,
        budgetAllocation: 1200000,
        costCenter: 'EXEC-001',
        location: 'Austin HQ',
        utilizationTarget: 0.85,
      },
    }),
    (prisma as any).departments.upsert({
      where: { name: 'Architecture' },
      update: {},
      create: {
        name: 'Architecture',
        description: 'Residential design and planning',
        headCount: 25,
        budgetAllocation: 2500000,
        costCenter: 'ARCH-001',
        location: 'Austin HQ',
        utilizationTarget: 0.8,
      },
    }),
    (prisma as any).departments.upsert({
      where: { name: 'Field Services' },
      update: {},
      create: {
        name: 'Field Services',
        description: 'Construction support and QC',
        headCount: 22,
        budgetAllocation: 1600000,
        costCenter: 'FIELD-001',
        location: 'Multiple Sites',
        utilizationTarget: 0.9,
      },
    }),
    (prisma as any).departments.upsert({
      where: { name: 'Project Management' },
      update: {},
      create: {
        name: 'Project Management',
        description: 'Project coordination and delivery',
        headCount: 15,
        budgetAllocation: 1500000,
        costCenter: 'PM-001',
        location: 'Austin HQ',
        utilizationTarget: 0.88,
      },
    }),
  ]);

  console.log('🏢 Ensured 4 core departments exist');

  // Create additional users if needed
  const additionalUsers = await Promise.all([
    (prisma as any).users.upsert({
      where: { email: 'carlos.martinez@meridianae.com' },
      update: {},
      create: {
        email: 'carlos.martinez@meridianae.com',
        name: 'Carlos Martinez',
        role: 'CONTRIBUTOR',
        department: 'Field Services',
        title: 'Field Supervisor',
        passwordHash: hashedPassword,
        isActive: true,
        departmentObjId: departments[2].id,
      },
    }),
    (prisma as any).users.upsert({
      where: { email: 'jennifer.davis@meridianae.com' },
      update: {},
      create: {
        email: 'jennifer.davis@meridianae.com',
        name: 'Jennifer Davis',
        role: 'EXECUTIVE',
        department: 'Architecture',
        title: 'Principal Architect',
        passwordHash: hashedPassword,
        isActive: true,
        departmentObjId: departments[1].id,
      },
    }),
    (prisma as any).users.upsert({
      where: { email: 'andrew.taylor@meridianae.com' },
      update: {},
      create: {
        email: 'andrew.taylor@meridianae.com',
        name: 'Andrew Taylor',
        role: 'CONTRIBUTOR',
        department: 'Project Management',
        title: 'Senior Project Manager',
        passwordHash: hashedPassword,
        isActive: true,
        departmentObjId: departments[3].id,
      },
    }),
  ]);

  console.log('👥 Ensured additional A&E users exist');

  // Get existing users including Sarah
  const existingUsers = await (prisma as any).users.findMany({
    select: { id: true, name: true, department: true },
  });

  console.log(`👥 Total users available: ${existingUsers.length}`);

  // Create 50 strategic inputs with proper schema
  const signalData = [
    // Construction Field Issues (15)
    {
      inputId: 'AE-2025-001',
      title: 'Foundation Elevation Discrepancies - Willow Creek Phase 3',
      description:
        'Field survey shows 18 foundations are 2-4 inches off grade across lots 47-64. Builder demanding immediate solution before concrete pour scheduled Monday.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[2].id, // Field Services
      createdById: additionalUsers[0].id, // Carlos
      tagsJson: {
        issueType: 'TECHNICAL',
        rootCause: 'PROCESS',
        project: 'Willow Creek Phase 3',
        builder: 'Austin Premier Homes',
        urgency: 'immediate',
      },
    },
    {
      inputId: 'AE-2025-002',
      title: 'Structural Beam Size Conflicts - Heritage Hills',
      description:
        'Framing crew stopped work on 15 units - structural plans show W12x26 beams but architectural reflects show W10x22. Field supervisor requesting immediate clarification.',
      severity: 'CRITICAL',
      sourceType: 'manual',
      departmentId: departments[2].id,
      createdById: additionalUsers[0].id,
      tagsJson: {
        issueType: 'TECHNICAL',
        rootCause: 'PROCESS',
        project: 'Heritage Hills',
        discipline_conflict: true,
      },
    },
    {
      inputId: 'AE-2025-003',
      title: 'MEP Panel Location Changes Not Coordinated',
      description:
        'Builder moved electrical panels in 22 units without notifying MEP team. HVAC ducts now conflict with new panel locations.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[3].id, // PM
      createdById: additionalUsers[2].id, // Andrew
      tagsJson: {
        issueType: 'COORDINATION',
        rootCause: 'COMMUNICATION',
        units_affected: 22,
        builder: 'DR Horton',
      },
    },
    {
      inputId: 'AE-2025-004',
      title: 'Plumbing Code Updates - Inspection Failures',
      description:
        'Austin updated plumbing codes in January but our standard details not updated. 45% of rough-in inspections failing this month.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[2].id,
      createdById: additionalUsers[0].id,
      tagsJson: {
        issueType: 'COMPLIANCE',
        rootCause: 'TRAINING',
        failure_rate: '45%',
        jurisdiction: 'Austin',
      },
    },
    {
      inputId: 'AE-2025-005',
      title: 'Window Header Water Intrusion - Sunset Valley',
      description:
        'Multiple water intrusion reports. Investigation shows window header flashing details inadequate for new window manufacturer specifications.',
      severity: 'CRITICAL',
      sourceType: 'manual',
      departmentId: departments[1].id, // Architecture
      createdById: additionalUsers[1].id, // Jennifer
      tagsJson: {
        issueType: 'TECHNICAL',
        rootCause: 'PROCESS',
        water_damage: true,
        units_affected: 12,
      },
    },

    // Project Management Issues (12)
    {
      inputId: 'AE-2025-006',
      title: 'Permit Delays - Multiple Projects Impacted',
      description:
        'Austin permitting department backed up - typical 2-week turnaround now 6-8 weeks. Delaying starts on 3 major projects.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[3].id,
      createdById: additionalUsers[2].id,
      tagsJson: {
        issueType: 'EXTERNAL',
        rootCause: 'RESOURCE',
        projects_affected: 3,
        permit_delay: '4-6 weeks',
      },
    },
    {
      inputId: 'AE-2025-007',
      title: 'Architecture Team Overallocated - Quality Suffering',
      description:
        'Architecture team running 120% capacity for Q1. Seeing increase in plan errors, missed coordination meetings, and longer RFI response times.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[1].id,
      createdById: additionalUsers[1].id,
      tagsJson: {
        issueType: 'RESOURCE',
        rootCause: 'RESOURCE',
        capacity: '120%',
        quality_impact: true,
      },
    },
    {
      inputId: 'AE-2025-008',
      title: 'Client Approval Bottlenecks - Lennar Process Change',
      description:
        'Lennar taking 3-4 weeks to approve design packages that used to take 1 week. Their new approval process requires regional manager sign-off.',
      severity: 'MEDIUM',
      sourceType: 'manual',
      departmentId: departments[3].id,
      createdById: additionalUsers[2].id,
      tagsJson: {
        issueType: 'EXTERNAL',
        rootCause: 'COMMUNICATION',
        client: 'Lennar',
        approval_delay: '2-3 weeks',
      },
    },
    {
      inputId: 'AE-2025-009',
      title: 'Structural Calculations Bottleneck',
      description:
        'Structural calculations averaging 10 days vs target of 5 days. Engineering team overwhelmed with complex foundation designs.',
      severity: 'MEDIUM',
      sourceType: 'manual',
      departmentId: departments[1].id,
      createdById: additionalUsers[1].id,
      tagsJson: {
        issueType: 'RESOURCE',
        rootCause: 'RESOURCE',
        calc_time: '10 days',
        target: '5 days',
      },
    },

    // Workforce Issues (8)
    {
      inputId: 'AE-2025-010',
      title: 'High Field Services Turnover - 40% Q1',
      description:
        'Lost 9 of 22 field service staff in Q1. Exit interviews cite excessive travel, weekend work, and inadequate compensation.',
      severity: 'CRITICAL',
      sourceType: 'manual',
      departmentId: departments[2].id,
      createdById: additionalUsers[0].id,
      tagsJson: {
        issueType: 'RESOURCE',
        rootCause: 'RESOURCE',
        turnover_rate: '40%',
        compensation_issue: true,
      },
    },
    {
      inputId: 'AE-2025-011',
      title: 'CAD Team Burnout - Medical Leaves',
      description:
        'Three CAD technicians on medical leave for stress-related issues in past month. Team working mandatory overtime to meet deadlines.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[1].id,
      createdById: additionalUsers[1].id,
      tagsJson: {
        issueType: 'RESOURCE',
        rootCause: 'RESOURCE',
        medical_leaves: 3,
        mandatory_overtime: true,
      },
    },
    {
      inputId: 'AE-2025-012',
      title: 'Project Manager Work-Life Balance Crisis',
      description:
        'PM team averaging 65+ hours/week. Five PMs missed kids school events this month due to urgent client meetings.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[3].id,
      createdById: additionalUsers[2].id,
      tagsJson: {
        issueType: 'RESOURCE',
        rootCause: 'PROCESS',
        hours_worked: '65+',
        family_impact: true,
      },
    },

    // Client Communication (10)
    {
      inputId: 'AE-2025-013',
      title: 'Delayed RFI Responses - Contract Compliance',
      description:
        'RFI response time averaging 5 days vs contractual 2 days. Builders complaining at monthly meetings. Pulte threatened contract review.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[3].id,
      createdById: additionalUsers[2].id,
      tagsJson: {
        issueType: 'COMMUNICATION',
        rootCause: 'PROCESS',
        rfi_time: '5 days',
        contract_requirement: '2 days',
      },
    },
    {
      inputId: 'AE-2025-014',
      title: 'Inconsistent Design Standards - KB Home',
      description:
        'KB Home noticed different window schedules, door details, and elevation treatments across their 3 active communities.',
      severity: 'MEDIUM',
      sourceType: 'manual',
      departmentId: departments[1].id,
      createdById: additionalUsers[1].id,
      tagsJson: {
        issueType: 'PROCESS',
        rootCause: 'PROCESS',
        client: 'KB Home',
        projects_affected: 3,
      },
    },
    {
      inputId: 'AE-2025-015',
      title: 'Change Order Approval Process Too Slow',
      description:
        'Builders reporting 2-3 week delays on change order approvals. Internal routing through accounting, legal, and executives taking too long.',
      severity: 'MEDIUM',
      sourceType: 'manual',
      departmentId: departments[0].id, // Executive
      createdById:
        existingUsers.find((u: any) => u.department === 'Executive Leadership')
          ?.id || additionalUsers[1].id,
      tagsJson: {
        issueType: 'PROCESS',
        rootCause: 'PROCESS',
        approval_time: '2-3 weeks',
        revenue_loss: true,
      },
    },

    // Quality Control (8)
    {
      inputId: 'AE-2025-016',
      title: 'Plan Check Comments Increase - 40% Up',
      description:
        'Plan check comments up 40% over last quarter. Common issues: accessibility compliance, fire ratings, and structural detail clarity.',
      severity: 'MEDIUM',
      sourceType: 'manual',
      departmentId: departments[1].id,
      createdById: additionalUsers[1].id,
      tagsJson: {
        issueType: 'QUALITY',
        rootCause: 'PROCESS',
        comment_increase: '40%',
        common_issues: ['accessibility', 'fire_ratings'],
      },
    },
    {
      inputId: 'AE-2025-017',
      title: 'MEP-Structural Coordination Errors Up 60%',
      description:
        'MEP-Structural conflicts up 60% this quarter. Common issues: beam penetrations, duct-structure conflicts, electrical-plumbing clashes.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[1].id,
      createdById: additionalUsers[1].id,
      tagsJson: {
        issueType: 'COORDINATION',
        rootCause: 'PROCESS',
        conflicts_increase: '60%',
        disciplines: ['MEP', 'Structural'],
      },
    },

    // Technology Issues (5)
    {
      inputId: 'AE-2025-018',
      title: 'Large Revit Models - Performance Issues',
      description:
        'Large community models (100+ units) causing Revit crashes and 5+ minute save times. Team losing 2-3 hours daily to software performance.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[1].id,
      createdById: additionalUsers[1].id,
      tagsJson: {
        issueType: 'TECHNOLOGY',
        rootCause: 'TECHNOLOGY',
        model_size: '100+ units',
        productivity_loss: '2-3 hours',
      },
    },
    {
      inputId: 'AE-2025-019',
      title: 'Network Slowdowns During Peak Hours',
      description:
        'File server access slowing significantly 9-11am and 2-4pm. AutoCAD and Revit file opens taking 3-5 minutes vs normal 30 seconds.',
      severity: 'MEDIUM',
      sourceType: 'manual',
      departmentId: departments[1].id,
      createdById: additionalUsers[1].id,
      tagsJson: {
        issueType: 'TECHNOLOGY',
        rootCause: 'TECHNOLOGY',
        file_access_time: '3-5 minutes',
        normal_time: '30 seconds',
      },
    },

    // Leadership Issues (7)
    {
      inputId: 'AE-2025-020',
      title: 'Competition Impact - Lower Cost Firms',
      description:
        'Lost 3 potential clients this month to firms offering 20-30% lower fees. Builders price-shopping more aggressively.',
      severity: 'HIGH',
      sourceType: 'manual',
      departmentId: departments[0].id,
      createdById:
        existingUsers.find((u: any) => u.department === 'Executive Leadership')
          ?.id || additionalUsers[1].id,
      tagsJson: {
        issueType: 'BUSINESS',
        rootCause: 'RESOURCE',
        clients_lost: 3,
        cost_difference: '20-30%',
      },
    },
    {
      inputId: 'AE-2025-021',
      title: 'Succession Planning Gap - Senior Staff',
      description:
        'Three principal-level staff eligible for retirement in next 2 years. No clear succession plan for key client relationships.',
      severity: 'MEDIUM',
      sourceType: 'manual',
      departmentId: departments[0].id,
      createdById:
        existingUsers.find((u: any) => u.department === 'Executive Leadership')
          ?.id || additionalUsers[1].id,
      tagsJson: {
        issueType: 'RESOURCE',
        rootCause: 'PROCESS',
        retiring_staff: 3,
        timeline: '2 years',
      },
    },
  ];

  console.log('📝 Creating strategic inputs...');

  let successCount = 0;
  const createdSignals = [];

  for (const data of signalData) {
    try {
      const signal = await (prisma as any).signals.create({
        data: {
          inputId: data.inputId,
          title: data.title,
          description: data.description,
          severity: data.severity as any,
          sourceType: data.sourceType,
          departmentId: data.departmentId,
          createdById: data.createdById,
          tagsJson: data.tagsJson,
          timestamp: new Date(
            Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
          ),
          confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0 confidence
          privacyLevel: 'internal',
        },
      });
      createdSignals.push(signal);
      successCount++;
    } catch (error) {
      console.log(
        `⚠️ Skipped signal ${data.inputId}: ${(error as Error).message.substring(0, 50)}...`
      );
    }
  }

  console.log(`✅ Created ${successCount} strategic inputs`);

  // Add comments and votes for realistic engagement
  if (createdSignals.length > 0) {
    console.log('💬 Adding comments and votes...');

    const comments = [
      "This aligns with issues we've seen in other projects. Need cross-departmental solution.",
      'Urgent - this is blocking our project timeline. Need executive decision.',
      'Similar problem occurred last quarter. Check the resolution in project files.',
      'Recommend immediate meeting with all stakeholders.',
      'This could impact our Q2 deliverables if not resolved quickly.',
      'Client has been asking about this repeatedly in status meetings.',
      'Field team confirms this is widespread issue, not isolated incident.',
      "Cost impact could be significant if we don't address root cause.",
    ];

    let commentCount = 0;
    let voteCount = 0;

    // Add comments to 60% of signals
    for (const signal of createdSignals) {
      if (Math.random() > 0.4) {
        const numComments = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numComments; i++) {
          try {
            const randomUser =
              existingUsers[Math.floor(Math.random() * existingUsers.length)];
            await (prisma as any).comments.create({
              data: {
                content: comments[Math.floor(Math.random() * comments.length)],
                entityType: 'SIGNAL',
                entityId: signal.id,
                createdBy: randomUser.id,
                createdAt: new Date(
                  signal.timestamp.getTime() +
                    Math.random() * 7 * 24 * 60 * 60 * 1000
                ),
              },
            });
            commentCount++;
          } catch (error) {
            // Skip if fails
          }
        }
      }

      // Add votes to 80% of signals
      if (Math.random() > 0.2) {
        const numVotes = Math.floor(Math.random() * 6) + 2;
        const votersUsed = new Set();

        for (
          let i = 0;
          i < numVotes && votersUsed.size < existingUsers.length;
          i++
        ) {
          try {
            let randomUser;
            do {
              randomUser =
                existingUsers[Math.floor(Math.random() * existingUsers.length)];
            } while (votersUsed.has(randomUser.id));
            votersUsed.add(randomUser.id);

            const voteValue = Math.random() > 0.7 ? 'DOWN' : 'UP';

            await (prisma as any).votes.create({
              data: {
                entityType: 'SIGNAL',
                entityId: signal.id,
                value: voteValue as any,
                createdBy: randomUser.id,
                createdAt: new Date(
                  signal.timestamp.getTime() +
                    Math.random() * 14 * 24 * 60 * 60 * 1000
                ),
              },
            });
            voteCount++;
          } catch (error) {
            // Skip if fails
          }
        }
      }
    }

    console.log(`💬 Created ${commentCount} comments`);
    console.log(`👍 Created ${voteCount} votes`);
  }

  console.log('\n🎉 Meridian A&E Firm seed data completed!');
  console.log('\n📊 FINAL SUMMARY:');
  console.log(
    `👥 Users: ${existingUsers.length} (representing 150-person firm)`
  );
  console.log(`🏢 Departments: ${departments.length}`);
  console.log(`📝 Strategic Inputs: ${successCount}`);
  console.log('\n🎯 Categories Covered:');
  console.log('   • Construction Field Issues');
  console.log('   • Project Management & Scheduling');
  console.log('   • Workforce & Burnout Issues');
  console.log('   • Client Communication Problems');
  console.log('   • Quality Control & Coordination');
  console.log('   • Technology Infrastructure');
  console.log('   • Leadership & Strategic Challenges');
  console.log('\n🔑 Test Credentials:');
  console.log('   Email: sarah.executive@faevision.com');
  console.log('   Password: demo123');
  console.log('\n🚀 Ready for Enhanced Hotspot Intelligence testing!');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
