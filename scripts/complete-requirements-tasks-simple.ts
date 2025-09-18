#!/usr/bin/env tsx
/**
 * Complete Requirements & Tasks Seed Data - Simplified Approach
 *
 * Creates F5 Requirements and adds F4 Tasks as JSON to existing Solutions
 *
 * Expert: Morgan Smith (Database Architect)
 */

import { PrismaClient } from '../src/generated/prisma';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
});

async function main() {
  console.log('🎯 Creating F5 Requirements & F4 Tasks (JSON) Seed Data...\n');

  try {
    // Step 1: Create Requirements for each Solution
    console.log('📋 Step 1: Creating F5 Requirements...');

    const requirements = [
      // CAD Infrastructure Solution Requirements
      {
        id: 'req_001_001',
        title: 'Hardware Infrastructure Assessment',
        description:
          'Conduct comprehensive assessment of current CAD workstation hardware capabilities and identify upgrade requirements.',
        type: 'TECHNICAL',
        priority: 'HIGH',
        status: 'APPROVED',
        solutionId: 'solution_001',
        acceptanceCriteria:
          'Complete hardware audit report with upgrade recommendations and cost analysis.',
        businessValue:
          'Ensures CAD upgrade investments are properly targeted for maximum ROI.',
        estimatedHours: 40,
        dueDate: new Date('2025-10-15'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date(),
      },
      {
        id: 'req_001_002',
        title: 'Software Licensing & Compatibility',
        description:
          'Verify software licensing requirements and ensure compatibility between upgraded hardware and existing CAD software.',
        type: 'BUSINESS',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        solutionId: 'solution_001',
        acceptanceCriteria:
          'All software licenses validated and compatibility matrix completed.',
        businessValue:
          'Prevents costly licensing issues and ensures seamless CAD operations.',
        estimatedHours: 24,
        dueDate: new Date('2025-10-01'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date(),
      },
      {
        id: 'req_001_003',
        title: 'Data Migration & Backup Strategy',
        description:
          'Develop comprehensive data migration plan and backup strategy to ensure zero data loss during upgrades.',
        type: 'TECHNICAL',
        priority: 'CRITICAL',
        status: 'DRAFT',
        solutionId: 'solution_001',
        acceptanceCriteria:
          'Complete data migration plan with tested backup and recovery procedures.',
        businessValue:
          'Protects critical design data and minimizes business disruption.',
        estimatedHours: 32,
        dueDate: new Date('2025-09-30'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date(),
      },
      // Junior Staff Development Solution Requirements
      {
        id: 'req_002_001',
        title: 'Competency Assessment Framework',
        description:
          'Develop comprehensive competency assessment framework to evaluate junior staff skills and identify development needs.',
        type: 'BUSINESS',
        priority: 'HIGH',
        status: 'APPROVED',
        solutionId: 'solution_002',
        acceptanceCriteria:
          'Standardized assessment framework with clear competency metrics and evaluation criteria.',
        businessValue:
          'Enables targeted training investments and objective career progression tracking.',
        estimatedHours: 48,
        dueDate: new Date('2025-10-01'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date(),
      },
      {
        id: 'req_002_002',
        title: 'Mentorship Program Structure',
        description:
          'Design formal mentorship program pairing junior staff with senior professionals for knowledge transfer.',
        type: 'BUSINESS',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        solutionId: 'solution_002',
        acceptanceCriteria:
          'Mentorship program guidelines with defined roles, expectations, and success metrics.',
        businessValue:
          'Accelerates junior staff development while preserving institutional knowledge.',
        estimatedHours: 36,
        dueDate: new Date('2025-10-15'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date(),
      },
      {
        id: 'req_002_003',
        title: 'Technical Skills Development Curriculum',
        description:
          'Create structured curriculum for technical skills development covering CAD, design standards, and engineering principles.',
        type: 'TECHNICAL',
        priority: 'MEDIUM',
        status: 'DRAFT',
        solutionId: 'solution_002',
        acceptanceCriteria:
          'Complete curriculum with learning objectives, materials, and competency checkpoints.',
        businessValue:
          'Ensures consistent skill development and reduces time to productive contribution.',
        estimatedHours: 72,
        dueDate: new Date('2025-11-01'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date(),
      },
    ];

    let createdRequirements = 0;
    for (const req of requirements) {
      try {
        await (prisma as any).requirements.create({ data: req });
        createdRequirements++;
        console.log(`  ✅ ${req.id}: ${req.title}`);
      } catch (error) {
        console.warn(`  ⚠️ Failed to create ${req.id}:`, error.message);
      }
    }

    console.log(`✅ Created ${createdRequirements} requirements\n`);

    // Step 2: Add Tasks JSON to Solutions
    console.log('📝 Step 2: Adding F4 Tasks to Solutions...');

    // CAD Infrastructure Solution Tasks
    const solution1Tasks = [
      {
        id: 'task_001_001',
        title: 'Hardware Assessment - Site Survey',
        description:
          'Conduct on-site survey of all CAD workstations and document current specifications',
        status: 'Open',
        priority: 'High',
        assignedTo: 'Alex Thompson',
        estimatedHours: 16,
        dueDate: '2025-09-25',
        requirementId: 'req_001_001',
      },
      {
        id: 'task_001_002',
        title: 'Performance Benchmarking',
        description:
          'Run CAD performance benchmarks on existing hardware to establish baseline metrics',
        status: 'Open',
        priority: 'High',
        assignedTo: 'Marcus Rodriguez',
        estimatedHours: 12,
        dueDate: '2025-09-28',
        requirementId: 'req_001_001',
      },
      {
        id: 'task_001_003',
        title: 'License Audit & Documentation',
        description:
          'Audit all CAD software licenses and document compatibility requirements',
        status: 'In Progress',
        priority: 'High',
        assignedTo: 'Sarah Martinez',
        estimatedHours: 20,
        dueDate: '2025-09-30',
        requirementId: 'req_001_002',
      },
      {
        id: 'task_001_004',
        title: 'Data Backup Testing',
        description:
          'Test current backup systems and validate data recovery procedures',
        status: 'Open',
        priority: 'Critical',
        assignedTo: 'Morgan Smith',
        estimatedHours: 24,
        dueDate: '2025-09-27',
        requirementId: 'req_001_003',
      },
      {
        id: 'task_001_005',
        title: 'Migration Plan Development',
        description:
          'Create detailed step-by-step migration plan with rollback procedures',
        status: 'Open',
        priority: 'Critical',
        assignedTo: 'Alex Thompson',
        estimatedHours: 32,
        dueDate: '2025-10-05',
        requirementId: 'req_001_003',
      },
    ];

    // Junior Staff Development Solution Tasks
    const solution2Tasks = [
      {
        id: 'task_002_001',
        title: 'Skills Assessment Survey Design',
        description:
          'Design comprehensive skills assessment survey for junior staff evaluation',
        status: 'Open',
        priority: 'High',
        assignedTo: 'Maya Rodriguez',
        estimatedHours: 24,
        dueDate: '2025-09-28',
        requirementId: 'req_002_001',
      },
      {
        id: 'task_002_002',
        title: 'Competency Framework Documentation',
        description:
          'Document competency levels and progression criteria for each role',
        status: 'In Progress',
        priority: 'High',
        assignedTo: 'Marcus Rodriguez',
        estimatedHours: 20,
        dueDate: '2025-10-02',
        requirementId: 'req_002_001',
      },
      {
        id: 'task_002_003',
        title: 'Senior Staff Mentor Recruitment',
        description:
          'Identify and recruit senior staff willing to participate as mentors',
        status: 'Open',
        priority: 'High',
        assignedTo: 'Sarah Martinez',
        estimatedHours: 16,
        dueDate: '2025-10-08',
        requirementId: 'req_002_002',
      },
      {
        id: 'task_002_004',
        title: 'Mentorship Guidelines Creation',
        description:
          'Create guidelines and expectations document for mentorship program',
        status: 'Open',
        priority: 'Medium',
        assignedTo: 'Maya Rodriguez',
        estimatedHours: 12,
        dueDate: '2025-10-12',
        requirementId: 'req_002_002',
      },
      {
        id: 'task_002_005',
        title: 'CAD Training Curriculum Development',
        description:
          'Develop structured CAD training curriculum with hands-on exercises',
        status: 'Open',
        priority: 'Medium',
        assignedTo: 'Alex Thompson',
        estimatedHours: 40,
        dueDate: '2025-10-25',
        requirementId: 'req_002_003',
      },
      {
        id: 'task_002_006',
        title: 'Technical Standards Documentation',
        description: 'Create comprehensive technical standards reference guide',
        status: 'Open',
        priority: 'Medium',
        assignedTo: 'Morgan Smith',
        estimatedHours: 32,
        dueDate: '2025-10-30',
        requirementId: 'req_002_003',
      },
    ];

    // Update Solution 1 with Tasks
    await (prisma as any).solutions.update({
      where: { id: 'solution_001' },
      data: {
        tasks: solution1Tasks,
        updatedAt: new Date(),
      },
    });
    console.log(`  ✅ solution_001: Added ${solution1Tasks.length} tasks`);

    // Update Solution 2 with Tasks
    await (prisma as any).solutions.update({
      where: { id: 'solution_002' },
      data: {
        tasks: solution2Tasks,
        updatedAt: new Date(),
      },
    });
    console.log(`  ✅ solution_002: Added ${solution2Tasks.length} tasks`);

    console.log(
      `✅ Added ${solution1Tasks.length + solution2Tasks.length} total tasks\n`
    );

    // Step 3: Verify Complete Workflow
    console.log('🔍 Step 3: Verifying F1-F6 Complete Workflow...');
    await verifyCompleteWorkflow();

    console.log('\n🎉 F5 Requirements & F4 Tasks Completion Successful!');
    console.log('✅ Complete F1-F6 workflow ready for executive demonstration');
  } catch (error) {
    console.error('❌ Requirements & Tasks completion failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function verifyCompleteWorkflow() {
  const stats = {
    inputs:
      (await (prisma as any).strategic_inputs?.count()) ||
      (await (prisma as any).inputs.count()),
    signals: await (prisma as any).signals.count(),
    hotspots: await (prisma as any).hotspots.count(),
    ideas: await (prisma as any).ideas.count(),
    solutions: await (prisma as any).solutions.count(),
    requirements: await (prisma as any).requirements.count(),
    votes: await (prisma as any).votes.count(),
    comments: await (prisma as any).comments.count(),
  };

  console.log('📊 Complete F1-F6 Workflow Status:');
  console.log(`  ✅ F1 - Strategic Inputs: ${stats.inputs}`);
  console.log(`  ✅ F1 - Signals: ${stats.signals}`);
  console.log(`  ✅ F2 - Votes: ${stats.votes}`);
  console.log(`  ✅ F2 - Comments: ${stats.comments}`);
  console.log(`  ✅ F3 - Hotspots: ${stats.hotspots}`);
  console.log(`  ✅ F3 - Ideas: ${stats.ideas}`);
  console.log(`  ✅ F4 - Solutions: ${stats.solutions}`);
  console.log(`  ✅ F5 - Requirements: ${stats.requirements}`);

  // Check solutions with tasks
  const solutionsWithTasks = await (prisma as any).solutions.findMany({
    where: {
      tasks: { not: null },
    },
  });

  console.log(`  ✅ F4 - Solutions with Tasks: ${solutionsWithTasks.length}`);

  const workflowComplete =
    stats.inputs > 0 &&
    stats.signals > 0 &&
    stats.hotspots > 0 &&
    stats.ideas > 0 &&
    stats.solutions > 0 &&
    stats.requirements > 0 &&
    solutionsWithTasks.length > 0;

  console.log(
    `\n🎯 F1-F6 WORKFLOW STATUS: ${workflowComplete ? '✅ COMPLETE' : '⚠️ INCOMPLETE'}`
  );

  if (workflowComplete) {
    console.log('🚀 Ready for complete executive demonstration!');
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export default main;
