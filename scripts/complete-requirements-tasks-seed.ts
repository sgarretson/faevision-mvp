#!/usr/bin/env tsx
/**
 * Complete Requirements & Tasks Seed Data
 * 
 * Creates realistic F5 Requirements and F4 Tasks aligned with existing Solutions
 * 
 * Expert: Morgan Smith (Database Architect)
 * Support: Sarah Chen (Product Manager), Marcus Rodriguez (Strategic Consultant)
 */

import { PrismaClient } from '../src/generated/prisma';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
});

async function main() {
  console.log('🎯 Completing F5 Requirements & F4 Tasks Seed Data...\n');
  console.log('🔗 Using Prisma Accelerate connection...\n');

  try {
    // Step 1: Get existing solutions
    console.log('📊 Step 1: Analyzing existing solutions...');
    const solutions = await (prisma as any).solutions.findMany({
      include: {
        ideas: true
      }
    });

    console.log(`✅ Found ${solutions.length} solutions to enhance\n`);

    // Step 2: Create Requirements for each solution
    console.log('📋 Step 2: Creating F5 Requirements...');
    let totalRequirements = 0;

    for (const solution of solutions) {
      const requirements = await createRequirementsForSolution(solution);
      totalRequirements += requirements.length;
      console.log(`  ✅ ${solution.id}: Created ${requirements.length} requirements`);
    }

    console.log(`✅ Created ${totalRequirements} total requirements\n`);

    // Step 3: Create Tasks for each solution via requirements
    console.log('📝 Step 3: Creating F4 Tasks...');
    let totalTasks = 0;

    const allRequirements = await (prisma as any).requirements.findMany({
      include: {
        solutions: true
      }
    });

    for (const requirement of allRequirements) {
      const tasks = await createTasksForRequirement(requirement);
      totalTasks += tasks.length;
      console.log(`  ✅ ${requirement.id}: Created ${tasks.length} tasks`);
    }

    console.log(`✅ Created ${totalTasks} total tasks\n`);

    // Step 4: Verify complete workflow
    console.log('🔍 Step 4: Verifying complete F1-F6 workflow...');
    await verifyCompleteWorkflow();

    console.log('\n🎉 F5 Requirements & F4 Tasks Seed Data Complete!');
    console.log('✅ Complete F1-F6 workflow ready for executive demonstration');

  } catch (error) {
    console.error('❌ Requirements & Tasks seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createRequirementsForSolution(solution: any) {
  const requirements = [];

  if (solution.id === 'solution_001') {
    // CAD Infrastructure Upgrade & Optimization Requirements
    const cadRequirements = [
      {
        id: 'req_001_001',
        title: 'Hardware Infrastructure Assessment',
        description: 'Conduct comprehensive assessment of current CAD workstation hardware capabilities and identify upgrade requirements for optimal performance.',
        type: 'TECHNICAL',
        priority: 'HIGH',
        status: 'APPROVED',
        solutionId: solution.id,
        acceptanceCriteria: 'Complete hardware audit report with specific upgrade recommendations and cost analysis.',
        businessValue: 'Ensures CAD upgrade investments are properly targeted for maximum ROI.',
        estimatedHours: 40,
        dueDate: new Date('2025-10-15'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: 'req_001_002', 
        title: 'Software Licensing & Compatibility',
        description: 'Verify software licensing requirements and ensure compatibility between upgraded hardware and existing CAD software suite.',
        type: 'BUSINESS',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        solutionId: solution.id,
        acceptanceCriteria: 'All software licenses validated and compatibility matrix completed.',
        businessValue: 'Prevents costly licensing issues and ensures seamless CAD operations during transition.',
        estimatedHours: 24,
        dueDate: new Date('2025-10-01'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: 'req_001_003',
        title: 'Data Migration & Backup Strategy',
        description: 'Develop comprehensive data migration plan and backup strategy to ensure zero data loss during CAD system upgrades.',
        type: 'TECHNICAL',
        priority: 'CRITICAL',
        status: 'DRAFT',
        solutionId: solution.id,
        acceptanceCriteria: 'Complete data migration plan with tested backup and recovery procedures.',
        businessValue: 'Protects critical design data and minimizes business disruption during upgrades.',
        estimatedHours: 32,
        dueDate: new Date('2025-09-30'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: 'req_001_004',
        title: 'Staff Training & Change Management',
        description: 'Design and implement training program for staff on upgraded CAD systems and new workflow procedures.',
        type: 'BUSINESS',
        priority: 'MEDIUM',
        status: 'DRAFT',
        solutionId: solution.id,
        acceptanceCriteria: 'Training program delivered to 100% of CAD users with competency verification.',
        businessValue: 'Ensures rapid adoption and maximizes productivity benefits of CAD upgrades.',
        estimatedHours: 56,
        dueDate: new Date('2025-11-15'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      }
    ];

    for (const req of cadRequirements) {
      const created = await (prisma as any).requirements.create({ data: req });
      requirements.push(created);
    }
  }

  if (solution.id === 'solution_002') {
    // Junior Staff Development Program Requirements
    const developmentRequirements = [
      {
        id: 'req_002_001',
        title: 'Competency Assessment Framework',
        description: 'Develop comprehensive competency assessment framework to evaluate junior staff skills and identify specific development needs.',
        type: 'BUSINESS',
        priority: 'HIGH',
        status: 'APPROVED',
        solutionId: solution.id,
        acceptanceCriteria: 'Standardized assessment framework with clear competency metrics and evaluation criteria.',
        businessValue: 'Enables targeted training investments and objective career progression tracking.',
        estimatedHours: 48,
        dueDate: new Date('2025-10-01'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: 'req_002_002',
        title: 'Mentorship Program Structure',
        description: 'Design formal mentorship program pairing junior staff with senior professionals for knowledge transfer and career guidance.',
        type: 'BUSINESS',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        solutionId: solution.id,
        acceptanceCriteria: 'Mentorship program guidelines with defined roles, expectations, and success metrics.',
        businessValue: 'Accelerates junior staff development while preserving institutional knowledge.',
        estimatedHours: 36,
        dueDate: new Date('2025-10-15'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: 'req_002_003',
        title: 'Technical Skills Development Curriculum',
        description: 'Create structured curriculum for technical skills development covering CAD, design standards, and engineering principles.',
        type: 'TECHNICAL',
        priority: 'MEDIUM',
        status: 'DRAFT',
        solutionId: solution.id,
        acceptanceCriteria: 'Complete curriculum with learning objectives, materials, and competency checkpoints.',
        businessValue: 'Ensures consistent skill development and reduces time to productive contribution.',
        estimatedHours: 72,
        dueDate: new Date('2025-11-01'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: 'req_002_004',
        title: 'Performance Tracking & Career Progression',
        description: 'Implement performance tracking system and clear career progression pathways for junior staff development.',
        type: 'BUSINESS',
        priority: 'MEDIUM',
        status: 'DRAFT',
        solutionId: solution.id,
        acceptanceCriteria: 'Performance tracking system with defined career progression milestones and criteria.',
        businessValue: 'Improves retention and provides clear advancement opportunities for junior staff.',
        estimatedHours: 40,
        dueDate: new Date('2025-12-01'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: 'req_002_005',
        title: 'Project Assignment & Responsibility Framework',
        description: 'Establish framework for progressive project assignments that build junior staff capabilities while maintaining quality standards.',
        type: 'BUSINESS',
        priority: 'HIGH',
        status: 'DRAFT',
        solutionId: solution.id,
        acceptanceCriteria: 'Project assignment framework with complexity levels and supervision requirements.',
        businessValue: 'Optimizes junior staff utilization while maintaining project quality and client satisfaction.',
        estimatedHours: 28,
        dueDate: new Date('2025-10-30'),
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      }
    ];

    for (const req of developmentRequirements) {
      const created = await (prisma as any).requirements.create({ data: req });
      requirements.push(created);
    }
  }

  return requirements;
}

async function createTasksForRequirement(requirement: any) {
  const tasks = [];

  // Create 2-3 tasks per requirement
  const taskTemplates = generateTasksForRequirement(requirement);

  for (const taskData of taskTemplates) {
    try {
      const created = await (prisma as any).tasks.create({ data: taskData });
      tasks.push(created);
    } catch (error) {
      console.warn(`⚠️ Failed to create task for requirement ${requirement.id}:`, error.message);
    }
  }

  return tasks;
}

function generateTasksForRequirement(requirement: any) {
  const baseTasks = [];
  const requirementId = requirement.id;
  const solutionId = requirement.solutionId;

  // Get users for realistic assignments
  const assignees = [
    'user_alex_thompson',    // Lead Developer
    'user_maya_rodriguez',   // UX Expert  
    'user_marcus_rodriguez', // Strategic Consultant
    'user_morgan_smith',     // Database Architect
    'user_sarah_martinez'    // Product Manager
  ];

  if (requirement.type === 'TECHNICAL') {
    baseTasks.push(
      {
        id: `task_${requirementId}_001`,
        title: `Technical Analysis for ${requirement.title}`,
        description: `Conduct detailed technical analysis and create implementation specifications for ${requirement.title.toLowerCase()}.`,
        status: 'OPEN',
        priority: requirement.priority,
        requirementId: requirementId,
        solutionId: solutionId,
        assignedTo: assignees[0], // Lead Developer
        estimatedHours: Math.floor(requirement.estimatedHours * 0.4),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: `task_${requirementId}_002`,
        title: `Implementation Planning for ${requirement.title}`,
        description: `Develop detailed implementation plan including timeline, resources, and risk mitigation strategies.`,
        status: 'OPEN',
        priority: requirement.priority,
        requirementId: requirementId,
        solutionId: solutionId,
        assignedTo: assignees[4], // Product Manager
        estimatedHours: Math.floor(requirement.estimatedHours * 0.3),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: `task_${requirementId}_003`,
        title: `Quality Assurance for ${requirement.title}`,
        description: `Design and execute quality assurance procedures to validate requirement implementation.`,
        status: 'OPEN',
        priority: 'MEDIUM',
        requirementId: requirementId,
        solutionId: solutionId,
        assignedTo: assignees[3], // Database Architect
        estimatedHours: Math.floor(requirement.estimatedHours * 0.3),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      }
    );
  }

  if (requirement.type === 'BUSINESS') {
    baseTasks.push(
      {
        id: `task_${requirementId}_001`,
        title: `Stakeholder Analysis for ${requirement.title}`,
        description: `Identify and analyze stakeholder needs and requirements for successful implementation.`,
        status: 'OPEN',
        priority: requirement.priority,
        requirementId: requirementId,
        solutionId: solutionId,
        assignedTo: assignees[2], // Strategic Consultant
        estimatedHours: Math.floor(requirement.estimatedHours * 0.3),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: `task_${requirementId}_002`,
        title: `Process Design for ${requirement.title}`,
        description: `Design business processes and workflows to support requirement implementation.`,
        status: 'OPEN',
        priority: requirement.priority,
        requirementId: requirementId,
        solutionId: solutionId,
        assignedTo: assignees[1], // UX Expert
        estimatedHours: Math.floor(requirement.estimatedHours * 0.4),
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      },
      {
        id: `task_${requirementId}_003`,
        title: `Training & Communication for ${requirement.title}`,
        description: `Develop training materials and communication plan for requirement rollout.`,
        status: 'OPEN',
        priority: 'MEDIUM',
        requirementId: requirementId,
        solutionId: solutionId,
        assignedTo: assignees[4], // Product Manager
        estimatedHours: Math.floor(requirement.estimatedHours * 0.3),
        dueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
        origin: 'HUMAN',
        createdById: 'user_sarah_martinez',
        updatedAt: new Date()
      }
    );
  }

  return baseTasks;
}

async function verifyCompleteWorkflow() {
  const stats = {
    solutions: await (prisma as any).solutions.count(),
    requirements: await (prisma as any).requirements.count(),
    tasks: await (prisma as any).tasks.count(),
    ideas: await (prisma as any).ideas.count(),
    hotspots: await (prisma as any).hotspots.count(),
    signals: await (prisma as any).signals.count()
  };

  console.log('📊 Complete F1-F6 Workflow Verification:');
  console.log(`  🎯 F4 Solutions: ${stats.solutions}`);
  console.log(`  📋 F5 Requirements: ${stats.requirements}`);
  console.log(`  📝 F4 Tasks: ${stats.tasks}`);
  console.log(`  💡 F3 Ideas: ${stats.ideas}`);
  console.log(`  🔥 F3 Hotspots: ${stats.hotspots}`);
  console.log(`  📊 F1 Signals: ${stats.signals}`);

  // Check linking integrity
  const requirementsWithSolutions = await (prisma as any).requirements.count({
    where: {
      solutionId: { not: null }
    }
  });

  const tasksWithRequirements = await (prisma as any).tasks.count({
    where: {
      requirementId: { not: null }
    }
  });

  console.log('\n🔗 Workflow Linking Verification:');
  console.log(`  ✅ Requirements linked to Solutions: ${requirementsWithSolutions}/${stats.requirements}`);
  console.log(`  ✅ Tasks linked to Requirements: ${tasksWithRequirements}/${stats.tasks}`);

  const workflowComplete = stats.solutions > 0 && stats.requirements > 0 && stats.tasks > 0 && 
                           requirementsWithSolutions === stats.requirements && 
                           tasksWithRequirements === stats.tasks;

  console.log(`\n🎯 F1-F6 Workflow Status: ${workflowComplete ? '✅ COMPLETE' : '⚠️ INCOMPLETE'}`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export default main;
