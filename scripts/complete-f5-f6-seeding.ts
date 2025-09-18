#!/usr/bin/env tsx
/**
 * Complete F5-F6 Seed Data Implementation
 *
 * Creates missing requirements, tasks, and FRD documents to complete
 * the full F1-F6 workflow for executive testing.
 *
 * Expert: Morgan Smith (Database Architect) + Sarah Chen (Product Manager)
 */

import { PrismaClient } from '../src/generated/prisma';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
});

async function main() {
  console.log('🚀 Starting F5-F6 Complete Seed Data Implementation...\n');

  try {
    // Step 1: Add tasks to existing solutions
    console.log('📋 Step 1: Adding solution tasks...');
    await addSolutionTasks();
    console.log('✅ Solution tasks added\n');

    // Step 2: Create requirements for solutions (F5)
    console.log('📝 Step 2: Creating solution requirements...');
    const requirements = await createSolutionRequirements();
    console.log(`✅ Created ${requirements.length} requirements\n`);

    // Step 3: Create FRD documents (F6)
    console.log('📄 Step 3: Creating FRD documents...');
    const frdDocuments = await createFRDDocuments();
    console.log(`✅ Created ${frdDocuments.length} FRD documents\n`);

    // Step 4: Validate complete F5-F6 workflow
    console.log('🔍 Step 4: Validating F5-F6 workflow...');
    await validateF5F6Workflow();
    console.log('✅ F5-F6 workflow validation successful\n');

    console.log('🎉 F5-F6 Complete Seed Data Implementation Finished!');
    console.log('\n📋 COMPLETE F1-F6 WORKFLOW NOW READY:');
    console.log('✅ F1: Input Capture - 20 strategic inputs');
    console.log('✅ F2: Collaboration - Votes, comments, engagement');
    console.log('✅ F3: Organization - 4 hotspots with AI clustering');
    console.log(
      '✅ F4: Solution Execution - 2 solutions with tasks and progress'
    );
    console.log(
      '✅ F5: Executive Requirements - Requirements with approval workflow'
    );
    console.log('✅ F6: FRD Handoff - AI-generated documents ready for export');
  } catch (error) {
    console.error('❌ F5-F6 seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function addSolutionTasks() {
  // Add tasks to Solution 1: CAD Infrastructure Upgrade
  await (prisma as any).solutions.update({
    where: { id: 'solution_001' },
    data: {
      tasks: {
        phases: [
          {
            id: 'phase_1',
            name: 'Assessment & Planning',
            tasks: [
              {
                id: 'task_001',
                title: 'Current Infrastructure Assessment',
                description:
                  'Evaluate existing CAD hardware and software performance',
                status: 'COMPLETED',
                assignee: 'IT Team',
                estimatedHours: 16,
                actualHours: 14,
                completedAt: new Date('2025-01-15'),
                dependencies: [],
              },
              {
                id: 'task_002',
                title: 'Hardware Requirements Analysis',
                description: 'Define specifications for new CAD workstations',
                status: 'COMPLETED',
                assignee: 'CAD Administrator',
                estimatedHours: 12,
                actualHours: 10,
                completedAt: new Date('2025-01-20'),
                dependencies: ['task_001'],
              },
              {
                id: 'task_003',
                title: 'Budget Approval',
                description:
                  'Secure executive approval for hardware procurement',
                status: 'COMPLETED',
                assignee: 'Project Manager',
                estimatedHours: 8,
                actualHours: 6,
                completedAt: new Date('2025-01-25'),
                dependencies: ['task_002'],
              },
            ],
          },
          {
            id: 'phase_2',
            name: 'Implementation',
            tasks: [
              {
                id: 'task_004',
                title: 'Hardware Procurement',
                description: 'Order and receive new CAD workstations',
                status: 'IN_PROGRESS',
                assignee: 'IT Team',
                estimatedHours: 24,
                actualHours: 18,
                startedAt: new Date('2025-02-01'),
                dependencies: ['task_003'],
              },
              {
                id: 'task_005',
                title: 'Software Configuration',
                description:
                  'Install and configure CAD software on new hardware',
                status: 'PENDING',
                assignee: 'CAD Administrator',
                estimatedHours: 32,
                dependencies: ['task_004'],
              },
              {
                id: 'task_006',
                title: 'Data Migration',
                description: 'Migrate existing CAD files and project data',
                status: 'PENDING',
                assignee: 'IT Team',
                estimatedHours: 20,
                dependencies: ['task_005'],
              },
            ],
          },
          {
            id: 'phase_3',
            name: 'Training & Rollout',
            tasks: [
              {
                id: 'task_007',
                title: 'User Training Program',
                description: 'Train architects on new CAD system features',
                status: 'PENDING',
                assignee: 'Training Coordinator',
                estimatedHours: 40,
                dependencies: ['task_006'],
              },
              {
                id: 'task_008',
                title: 'Performance Monitoring',
                description: 'Monitor system performance and user feedback',
                status: 'PENDING',
                assignee: 'Project Manager',
                estimatedHours: 16,
                dependencies: ['task_007'],
              },
            ],
          },
        ],
        summary: {
          totalTasks: 8,
          completedTasks: 3,
          inProgressTasks: 1,
          pendingTasks: 4,
          totalEstimatedHours: 168,
          totalActualHours: 48,
          overallProgress: 0.375,
        },
      },
      progress: 0.375,
      updatedAt: new Date(),
    },
  });

  // Add tasks to Solution 2: Junior Staff Development
  await (prisma as any).solutions.update({
    where: { id: 'solution_002' },
    data: {
      tasks: {
        phases: [
          {
            id: 'phase_1',
            name: 'Program Design',
            tasks: [
              {
                id: 'task_101',
                title: 'Skills Assessment Framework',
                description:
                  'Develop comprehensive skills assessment for junior staff',
                status: 'COMPLETED',
                assignee: 'HR Manager',
                estimatedHours: 20,
                actualHours: 18,
                completedAt: new Date('2025-01-10'),
                dependencies: [],
              },
              {
                id: 'task_102',
                title: 'Mentorship Program Structure',
                description:
                  'Design mentor-mentee pairing and progress tracking',
                status: 'COMPLETED',
                assignee: 'Training Manager',
                estimatedHours: 16,
                actualHours: 14,
                completedAt: new Date('2025-01-18'),
                dependencies: ['task_101'],
              },
              {
                id: 'task_103',
                title: 'Training Curriculum Development',
                description:
                  'Create technical and soft skills training modules',
                status: 'IN_PROGRESS',
                assignee: 'Senior Architect',
                estimatedHours: 40,
                actualHours: 25,
                startedAt: new Date('2025-01-20'),
                dependencies: ['task_102'],
              },
            ],
          },
          {
            id: 'phase_2',
            name: 'Pilot Program',
            tasks: [
              {
                id: 'task_104',
                title: 'Pilot Group Selection',
                description: 'Select 5 junior staff members for pilot program',
                status: 'PENDING',
                assignee: 'Department Manager',
                estimatedHours: 8,
                dependencies: ['task_103'],
              },
              {
                id: 'task_105',
                title: 'Mentor Assignment',
                description: 'Assign senior mentors to pilot participants',
                status: 'PENDING',
                assignee: 'HR Manager',
                estimatedHours: 12,
                dependencies: ['task_104'],
              },
              {
                id: 'task_106',
                title: 'Pilot Program Execution',
                description: 'Run 8-week pilot program with weekly check-ins',
                status: 'PENDING',
                assignee: 'Training Manager',
                estimatedHours: 64,
                dependencies: ['task_105'],
              },
            ],
          },
          {
            id: 'phase_3',
            name: 'Full Rollout',
            tasks: [
              {
                id: 'task_107',
                title: 'Program Refinement',
                description: 'Refine program based on pilot feedback',
                status: 'PENDING',
                assignee: 'Training Manager',
                estimatedHours: 16,
                dependencies: ['task_106'],
              },
              {
                id: 'task_108',
                title: 'Company-Wide Launch',
                description: 'Launch program for all junior staff members',
                status: 'PENDING',
                assignee: 'HR Manager',
                estimatedHours: 32,
                dependencies: ['task_107'],
              },
            ],
          },
        ],
        summary: {
          totalTasks: 8,
          completedTasks: 2,
          inProgressTasks: 1,
          pendingTasks: 5,
          totalEstimatedHours: 208,
          totalActualHours: 57,
          overallProgress: 0.25,
        },
      },
      progress: 0.25,
      updatedAt: new Date(),
    },
  });
}

async function createSolutionRequirements() {
  const requirements = [];

  // Requirements for Solution 1: CAD Infrastructure Upgrade
  const cadRequirements = [
    {
      id: 'req_001',
      title: 'CAD Performance Improvement',
      description:
        'New CAD system must handle complex 3D models without crashes or performance degradation',
      acceptanceCriteria: {
        criteria: [
          'System can handle 3D models up to 500MB without crashes',
          'Rendering time for complex models reduced by 50%',
          'Zero work loss incidents during 30-day testing period',
          'User satisfaction score of 8/10 or higher',
        ],
        testingProcedures: [
          'Load test with progressively larger model files',
          'Stress test with multiple concurrent users',
          'Performance benchmarking against current system',
          'User acceptance testing with architecture team',
        ],
      },
      status: 'APPROVED',
      estimatedEffort: 'High',
      businessValue: 'High',
      riskAssessment: 'Medium - Hardware integration risks',
      stakeholders: {
        primary: ['Architecture Department', 'IT Department'],
        secondary: ['Project Management', 'Executive Team'],
        approvers: ['Department Head', 'CTO'],
      },
      dependencies: {
        technical: ['Hardware procurement', 'Software licensing'],
        business: ['Budget approval', 'Training schedule'],
      },
      solutionId: 'solution_001',
      createdBy: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
      approvedBy: 'cmfo0ik2h000rw8fmhp7ufiou',
      approvedAt: new Date('2025-01-30'),
      priority: 'HIGH',
      updatedAt: new Date(),
    },
    {
      id: 'req_002',
      title: 'Data Migration Integrity',
      description:
        'All existing CAD files and project data must be migrated without loss or corruption',
      acceptanceCriteria: {
        criteria: [
          '100% of CAD files migrate successfully',
          'All project metadata preserved',
          'File relationships and dependencies maintained',
          'Backup verification passes all checks',
        ],
        testingProcedures: [
          'Automated file integrity checks',
          'Manual verification of critical projects',
          'Version history preservation validation',
          'Rollback procedure testing',
        ],
      },
      status: 'DRAFT',
      estimatedEffort: 'Medium',
      businessValue: 'Critical',
      riskAssessment: 'High - Data loss potential',
      stakeholders: {
        primary: ['Architecture Department', 'IT Department'],
        secondary: ['Project Management'],
        approvers: ['Data Security Officer', 'Department Head'],
      },
      dependencies: {
        technical: ['Backup system validation', 'Migration tools'],
        business: ['Downtime scheduling', 'User communication'],
      },
      solutionId: 'solution_001',
      createdBy: 'cmfo0ik2h000rw8fmhp7ufiou',
      priority: 'HIGH',
      updatedAt: new Date(),
    },
  ];

  // Requirements for Solution 2: Junior Staff Development
  const trainingRequirements = [
    {
      id: 'req_003',
      title: 'Junior Staff Skill Development',
      description:
        'Training program must measurably improve junior staff technical competencies',
      acceptanceCriteria: {
        criteria: [
          '80% of participants show measurable skill improvement',
          'Skills assessment scores increase by average 25%',
          'Junior staff project assignment rate increases to 80%',
          'Program completion rate exceeds 90%',
        ],
        testingProcedures: [
          'Pre and post-training skills assessments',
          'Project assignment tracking',
          'Mentor feedback collection',
          'Participant satisfaction surveys',
        ],
      },
      status: 'APPROVED',
      estimatedEffort: 'Medium',
      businessValue: 'High',
      riskAssessment: 'Low - Well-defined program structure',
      stakeholders: {
        primary: ['HR Department', 'Architecture Department'],
        secondary: ['Training Department', 'Management Team'],
        approvers: ['HR Director', 'Department Head'],
      },
      dependencies: {
        technical: ['Learning management system', 'Assessment tools'],
        business: ['Senior staff time allocation', 'Training budget'],
      },
      solutionId: 'solution_002',
      createdBy: 'cmfo0ik2h000rw8fmhp7ufiou',
      approvedBy: 'cmfo0ik2h000rw8fmhp7ufiou',
      approvedAt: new Date('2025-02-05'),
      priority: 'HIGH',
      updatedAt: new Date(),
    },
    {
      id: 'req_004',
      title: 'Senior Staff Workload Reduction',
      description:
        'Program must demonstrably reduce senior staff overtime and workload pressure',
      acceptanceCriteria: {
        criteria: [
          'Senior staff overtime reduced by 20% within 6 months',
          'Senior staff satisfaction scores improve by 15%',
          'Work distribution metrics show 60% junior staff utilization',
          'Project delivery times maintain or improve',
        ],
        testingProcedures: [
          'Time tracking analysis',
          'Workload distribution monitoring',
          'Staff satisfaction surveys',
          'Project delivery metrics tracking',
        ],
      },
      status: 'REVIEW',
      estimatedEffort: 'Medium',
      businessValue: 'High',
      riskAssessment: 'Medium - Dependent on program effectiveness',
      stakeholders: {
        primary: ['Architecture Department', 'Management Team'],
        secondary: ['HR Department', 'Project Management'],
        approvers: ['Department Head', 'Executive Team'],
      },
      dependencies: {
        technical: ['Performance tracking tools', 'Workload analytics'],
        business: ['Management commitment', 'Cultural change'],
      },
      solutionId: 'solution_002',
      createdBy: 'cmfo0ik2h000rw8fmhp7ufiou',
      priority: 'MEDIUM',
      updatedAt: new Date(),
    },
  ];

  // Create all requirements
  for (const reqData of [...cadRequirements, ...trainingRequirements]) {
    const requirement = await (prisma as any).requirements.create({
      data: reqData,
    });
    requirements.push(requirement);
  }

  return requirements;
}

async function createFRDDocuments() {
  const frdDocuments = [];

  // FRD for Solution 1: CAD Infrastructure Upgrade
  const cadFRD = await (prisma as any).frd_documents.create({
    data: {
      id: 'frd_001',
      title: 'CAD Infrastructure Upgrade - Functional Requirements Document',
      content: {
        executiveSummary:
          'Comprehensive upgrade of CAD infrastructure to improve productivity and eliminate performance issues affecting architectural design workflows.',
        businessObjectives: [
          'Eliminate CAD software crashes and performance degradation',
          'Increase design productivity by 25%',
          'Reduce project delivery times by improving design efficiency',
          'Ensure zero work loss incidents during design phases',
        ],
        functionalRequirements: [
          {
            id: 'FR-001',
            title: 'High-Performance CAD Processing',
            description:
              'System must handle complex 3D models up to 500MB without performance degradation',
            priority: 'High',
            acceptanceCriteria: [
              'Load time < 30 seconds for 500MB models',
              'Rendering frame rate > 30fps',
              'Zero crashes during 8-hour sessions',
            ],
          },
          {
            id: 'FR-002',
            title: 'Seamless Data Migration',
            description:
              'All existing CAD files and project data must migrate without loss',
            priority: 'Critical',
            acceptanceCriteria: [
              '100% file migration success rate',
              'All metadata preserved',
              'Version history maintained',
            ],
          },
          {
            id: 'FR-003',
            title: 'User Training and Adoption',
            description: 'Comprehensive training program for all CAD users',
            priority: 'Medium',
            acceptanceCriteria: [
              '90% training completion rate',
              'User satisfaction > 8/10',
              'Productivity baseline reached within 30 days',
            ],
          },
        ],
        technicalSpecifications: {
          hardware: [
            'High-performance workstations with dedicated graphics cards',
            'Minimum 32GB RAM per workstation',
            'SSD storage for improved file access',
          ],
          software: [
            'Latest CAD software version with enterprise licensing',
            'Performance monitoring tools',
            'Automated backup systems',
          ],
          infrastructure: [
            'Gigabit network connectivity',
            'Redundant power systems',
            'Environmental controls for hardware protection',
          ],
        },
        implementationPlan: {
          phases: [
            {
              name: 'Assessment & Planning',
              duration: '2 weeks',
              deliverables: [
                'Current state analysis',
                'Hardware specifications',
                'Budget approval',
              ],
            },
            {
              name: 'Procurement & Setup',
              duration: '4 weeks',
              deliverables: [
                'Hardware installation',
                'Software configuration',
                'Testing completion',
              ],
            },
            {
              name: 'Migration & Training',
              duration: '3 weeks',
              deliverables: [
                'Data migration',
                'User training',
                'Go-live execution',
              ],
            },
          ],
          totalDuration: '9 weeks',
          criticalPath: [
            'Budget approval',
            'Hardware delivery',
            'Data migration',
          ],
          riskMitigation: [
            'Phased rollout to minimize disruption',
            'Comprehensive backup strategy',
            'Parallel system operation during transition',
          ],
        },
        successMetrics: [
          '25% improvement in design productivity measured by project completion times',
          '95% uptime during large model operations',
          'Zero work loss incidents over 90-day evaluation period',
          'User satisfaction rating of 8/10 or higher',
        ],
        budgetSummary: {
          hardware: 60000,
          software: 15000,
          training: 8000,
          contingency: 7000,
          total: 90000,
        },
      },
      aiGenerated: true,
      aiConfidence: 0.92,
      aiPromptUsed:
        'Generate comprehensive FRD for CAD infrastructure upgrade addressing performance issues and productivity improvements for architecture firm',
      version: '1.0',
      status: 'REVIEW',
      executiveApproved: false,
      templateUsed: 'Enterprise FRD Template v2.1',
      generationTime: 45.7,
      wordCount: 1247,
      exportFormats: {
        available: ['PDF', 'Word', 'HTML'],
        preferences: [
          'PDF for executive review',
          'Word for collaborative editing',
        ],
      },
      solutionId: 'solution_001',
      createdBy: 'cmfo0ik2h000rw8fmhp7ufiou',
      updatedAt: new Date(),
    },
  });

  // FRD for Solution 2: Junior Staff Development
  const trainingFRD = await (prisma as any).frd_documents.create({
    data: {
      id: 'frd_002',
      title:
        'Junior Staff Development Program - Functional Requirements Document',
      content: {
        executiveSummary:
          'Comprehensive training and mentorship program to optimize junior staff utilization and reduce senior staff workload pressure.',
        businessObjectives: [
          'Increase junior staff utilization to 80% of capacity',
          'Reduce senior staff overtime by 20%',
          'Improve overall team productivity and work distribution',
          'Establish sustainable knowledge transfer processes',
        ],
        functionalRequirements: [
          {
            id: 'FR-101',
            title: 'Structured Mentorship Program',
            description:
              'Formal mentor-mentee relationships with defined goals and progress tracking',
            priority: 'High',
            acceptanceCriteria: [
              '1:1 mentor assignment for all participants',
              'Weekly progress meetings',
              'Skill development tracking',
            ],
          },
          {
            id: 'FR-102',
            title: 'Skills Assessment Framework',
            description:
              'Comprehensive evaluation system for technical and soft skills',
            priority: 'High',
            acceptanceCriteria: [
              'Pre/post training assessments',
              'Standardized scoring rubrics',
              'Progress visualization',
            ],
          },
          {
            id: 'FR-103',
            title: 'Training Content Management',
            description:
              'Centralized system for training materials and progress tracking',
            priority: 'Medium',
            acceptanceCriteria: [
              'Digital learning platform',
              'Progress tracking',
              'Content versioning',
            ],
          },
        ],
        technicalSpecifications: {
          platform: [
            'Learning Management System (LMS)',
            'Skills assessment tools',
            'Progress tracking dashboard',
          ],
          content: [
            'Technical skills modules',
            'Soft skills training',
            'Project-based learning exercises',
          ],
          tracking: [
            'Automated progress monitoring',
            'Mentor feedback system',
            'Performance analytics',
          ],
        },
        implementationPlan: {
          phases: [
            {
              name: 'Program Design',
              duration: '3 weeks',
              deliverables: [
                'Skills framework',
                'Training curriculum',
                'Mentor guidelines',
              ],
            },
            {
              name: 'Pilot Program',
              duration: '8 weeks',
              deliverables: [
                'Pilot execution',
                'Feedback collection',
                'Program refinement',
              ],
            },
            {
              name: 'Full Rollout',
              duration: '6 months',
              deliverables: [
                'Company-wide launch',
                'Ongoing monitoring',
                'Continuous improvement',
              ],
            },
          ],
          totalDuration: '7 months',
          criticalPath: [
            'Senior staff commitment',
            'Training material development',
            'Pilot success',
          ],
          riskMitigation: [
            'Gradual skill transfer',
            'Senior staff workload management',
            'Regular program adjustments',
          ],
        },
        successMetrics: [
          '80% junior staff utilization within 6 months',
          '20% reduction in senior staff overtime',
          '90% program completion rate',
          '25% improvement in skills assessment scores',
        ],
        budgetSummary: {
          platform: 12000,
          content: 18000,
          training: 15000,
          ongoing: 10000,
          total: 55000,
        },
      },
      aiGenerated: true,
      aiConfidence: 0.88,
      aiPromptUsed:
        'Generate comprehensive FRD for junior staff development program addressing resource utilization and senior staff workload in architecture firm',
      version: '1.0',
      status: 'DRAFT',
      executiveApproved: false,
      templateUsed: 'Training Program FRD Template v1.3',
      generationTime: 52.3,
      wordCount: 1156,
      exportFormats: {
        available: ['PDF', 'Word', 'Excel'],
        preferences: [
          'PDF for executive approval',
          'Excel for budget tracking',
        ],
      },
      solutionId: 'solution_002',
      createdBy: 'cmfo0ik2h000rw8fmhp7ufiou',
      updatedAt: new Date(),
    },
  });

  frdDocuments.push(cadFRD, trainingFRD);
  return frdDocuments;
}

async function validateF5F6Workflow() {
  const counts = {
    solutions: await (prisma as any).solutions.count(),
    requirements: await (prisma as any).requirements.count(),
    frdDocuments: await (prisma as any).frd_documents.count(),
    solutionsWithTasks: await (prisma as any).solutions.count({
      where: { tasks: { not: null } },
    }),
  };

  console.log('  📊 F5-F6 Workflow Validation:');
  console.log(`    - Solutions: ${counts.solutions}`);
  console.log(`    - Requirements: ${counts.requirements}`);
  console.log(`    - FRD Documents: ${counts.frdDocuments}`);
  console.log(`    - Solutions with Tasks: ${counts.solutionsWithTasks}`);

  // Validate expected data
  if (counts.requirements < 4)
    throw new Error(`Expected 4+ requirements, got ${counts.requirements}`);
  if (counts.frdDocuments < 2)
    throw new Error(`Expected 2+ FRD documents, got ${counts.frdDocuments}`);
  if (counts.solutionsWithTasks < 2)
    throw new Error(
      `Expected 2 solutions with tasks, got ${counts.solutionsWithTasks}`
    );

  console.log('  ✅ F5-F6 workflow validation successful');
  console.log('  📋 Complete Workflow Status:');
  console.log(
    '    ✅ F4: Solutions with detailed task breakdown and progress tracking'
  );
  console.log(
    '    ✅ F5: Requirements with acceptance criteria and approval workflow'
  );
  console.log(
    '    ✅ F6: AI-generated FRDs ready for executive approval and export'
  );
}

// Run the F5-F6 completion
main().catch(e => {
  console.error('❌ F5-F6 Seed Data Implementation Failed:', e);
  process.exit(1);
});
