#!/usr/bin/env tsx
/**
 * Complete Preview Database Seeding Script
 * 
 * Creates comprehensive test data with proper field mapping and feature alignment
 * for complete F1-F6 workflow testing. Uses actual introspected schema.
 * 
 * Expert: Morgan Smith (Database Architect)
 * Support: Dr. Priya Patel (AI Architect), Sarah Chen (Product Manager)
 */

import { PrismaClient } from '../src/generated/prisma';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
});

async function main() {
  console.log('🚀 Starting Complete Preview Database Seeding...\n');
  console.log('🔗 Using Prisma Accelerate connection...\n');

  try {
    // Step 1: Clean existing data
    console.log('🧹 Step 1: Cleaning existing data...');
    await cleanDatabase();
    console.log('✅ Database cleaned successfully\n');

    // Step 2: Create organizational foundation
    console.log('🏢 Step 2: Creating organizational foundation...');
    const orgData = await createOrganizationalFoundation();
    console.log(`✅ Created organizational foundation\n`);

    // Step 3: Create comprehensive strategic inputs with signals
    console.log('📊 Step 3: Creating strategic inputs with signals...');
    const { inputs, signals } = await createStrategicInputsWithSignals(orgData);
    console.log(`✅ Created ${inputs.length} inputs and ${signals.length} signals\n`);

    // Step 4: Create votes and comments for engagement
    console.log('💬 Step 4: Creating collaboration data...');
    await createCollaborationData(inputs);
    console.log('✅ Created collaboration data\n');

    // Step 5: Create hotspots from signals
    console.log('🔥 Step 5: Creating hotspots...');
    const hotspots = await createHotspots(signals);
    console.log(`✅ Created ${hotspots.length} hotspots\n`);

    // Step 6: Create ideas from hotspots
    console.log('💡 Step 6: Creating ideas...');
    const ideas = await createIdeas(hotspots, orgData.initiatives);
    console.log(`✅ Created ${ideas.length} ideas\n`);

    // Step 7: Create solutions from ideas
    console.log('🎯 Step 7: Creating solutions...');
    const solutions = await createSolutions(ideas, inputs);
    console.log(`✅ Created ${solutions.length} solutions\n`);

    // Step 8: Validate complete workflow
    console.log('🔍 Step 8: Validating complete workflow...');
    await validateCompleteWorkflow();
    console.log('✅ Complete workflow validation successful\n');

    console.log('🎉 Complete Preview Database Seeding Finished!');
    console.log('\n📋 COMPLETE WORKFLOW READY:');
    console.log('✅ F1: Input Capture - 20 strategic inputs with tagging');
    console.log('✅ F2: Collaboration - Votes, comments, engagement');
    console.log('✅ F3: Organization - 4 hotspots with AI clustering');
    console.log('✅ F4: Solution Execution - 2 solutions with business planning');
    console.log('✅ F5: Executive Requirements - Ready for requirements creation');
    console.log('✅ F6: FRD Handoff - Ready for document generation');
    console.log('\n🌐 Preview Environment Ready:');
    console.log('URL: https://faevision-simplified-git-preview.vercel.app');
    console.log('Login: sarah.executive@faevision.com');

  } catch (error) {
    console.error('❌ Complete seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanDatabase() {
  // Clean in dependency order to avoid foreign key conflicts
  await (prisma as any).comments.deleteMany();
  await (prisma as any).votes.deleteMany();
  await (prisma as any).solutions.deleteMany();
  await (prisma as any).ideas.deleteMany();
  await (prisma as any).hotspot_signals.deleteMany();
  await (prisma as any).hotspots.deleteMany();
  await (prisma as any).signals.deleteMany();
  await (prisma as any).inputs.deleteMany();
  await (prisma as any).input_groups.deleteMany();
  await (prisma as any).teams.deleteMany();
  await (prisma as any).departments.deleteMany();
  await (prisma as any).initiatives.deleteMany();
  await (prisma as any).categories.deleteMany();
  
  console.log('  - Cleaned all data, preserved users for authentication');
}

async function createOrganizationalFoundation() {
  // Create Initiatives
  const initiatives = await Promise.all([
    (prisma as any).initiatives.create({
      data: {
        id: 'init_001',
        name: 'Operational Excellence 2025',
        description: 'Improve operational efficiency and reduce project delivery times',
        status: 'ACTIVE',
        priority: 'HIGH',
        targetDate: new Date('2025-12-31'),
        ownerId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        budget: 100000,
        expectedROI: 0.25,
        goalJson: {
          objectives: ['Reduce project delivery time by 20%', 'Improve quality metrics by 15%'],
          keyResults: ['Customer satisfaction >90%', 'On-time delivery >95%']
        },
        updatedAt: new Date()
      }
    }),
    (prisma as any).initiatives.create({
      data: {
        id: 'init_002',
        name: 'Digital Transformation',
        description: 'Modernize technology stack and improve digital workflows',
        status: 'PLANNING',
        priority: 'MEDIUM',
        targetDate: new Date('2026-06-30'),
        ownerId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        budget: 150000,
        expectedROI: 0.30,
        goalJson: {
          objectives: ['Implement cloud infrastructure', 'Automate manual processes'],
          keyResults: ['95% cloud migration', '50% reduction in manual tasks']
        },
        updatedAt: new Date()
      }
    })
  ]);

  // Create Categories
  const categories = await Promise.all([
    (prisma as any).categories.create({ data: { id: 'cat_001', name: 'Quality Control', updatedAt: new Date() } }),
    (prisma as any).categories.create({ data: { id: 'cat_002', name: 'Process Improvement', updatedAt: new Date() } }),
    (prisma as any).categories.create({ data: { id: 'cat_003', name: 'Technology', updatedAt: new Date() } }),
    (prisma as any).categories.create({ data: { id: 'cat_004', name: 'Communication', updatedAt: new Date() } }),
    (prisma as any).categories.create({ data: { id: 'cat_005', name: 'Resource Management', updatedAt: new Date() } }),
    (prisma as any).categories.create({ data: { id: 'cat_006', name: 'Client Relations', updatedAt: new Date() } }),
    (prisma as any).categories.create({ data: { id: 'cat_007', name: 'Training & Development', updatedAt: new Date() } })
  ]);

  // Create Departments
  const departments = await Promise.all([
    (prisma as any).departments.create({
      data: {
        id: 'dept_001',
        name: 'Architecture',
        description: 'Building design and planning',
        headCount: 25,
        budgetAllocation: 500000,
        managerId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        utilizationTarget: 0.85,
        updatedAt: new Date()
      }
    }),
    (prisma as any).departments.create({
      data: {
        id: 'dept_002',
        name: 'Structural Engineering',
        description: 'Structural design and analysis',
        headCount: 20,
        budgetAllocation: 400000,
        managerId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        utilizationTarget: 0.80,
        updatedAt: new Date()
      }
    }),
    (prisma as any).departments.create({
      data: {
        id: 'dept_003',
        name: 'MEP Engineering',
        description: 'Mechanical, Electrical, Plumbing systems',
        headCount: 18,
        budgetAllocation: 350000,
        managerId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        utilizationTarget: 0.75,
        updatedAt: new Date()
      }
    }),
    (prisma as any).departments.create({
      data: {
        id: 'dept_004',
        name: 'Project Management',
        description: 'Project coordination and delivery',
        headCount: 15,
        budgetAllocation: 300000,
        managerId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        utilizationTarget: 0.90,
        updatedAt: new Date()
      }
    }),
    (prisma as any).departments.create({
      data: {
        id: 'dept_005',
        name: 'Quality Control',
        description: 'QC and quality assurance',
        headCount: 8,
        budgetAllocation: 200000,
        managerId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        utilizationTarget: 0.70,
        updatedAt: new Date()
      }
    }),
    (prisma as any).departments.create({
      data: {
        id: 'dept_006',
        name: 'Business Development',
        description: 'Client relations and sales',
        headCount: 12,
        budgetAllocation: 250000,
        managerId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        utilizationTarget: 0.85,
        updatedAt: new Date()
      }
    }),
    (prisma as any).departments.create({
      data: {
        id: 'dept_007',
        name: 'Field Services',
        description: 'Construction support and oversight',
        headCount: 22,
        budgetAllocation: 450000,
        managerId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        utilizationTarget: 0.80,
        updatedAt: new Date()
      }
    })
  ]);

  // Create Teams
  const teams = await Promise.all([
    (prisma as any).teams.create({
      data: {
        id: 'team_001',
        name: 'Residential Design Team',
        description: 'Residential project design and coordination',
        departmentId: departments[0].id, // Architecture
        leaderId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        updatedAt: new Date()
      }
    }),
    (prisma as any).teams.create({
      data: {
        id: 'team_002',
        name: 'Commercial Projects',
        description: 'Commercial building design team',
        departmentId: departments[0].id, // Architecture
        leaderId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        updatedAt: new Date()
      }
    }),
    (prisma as any).teams.create({
      data: {
        id: 'team_003',
        name: 'Structural Analysis',
        description: 'Structural engineering and analysis',
        departmentId: departments[1].id, // Structural Engineering
        leaderId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        updatedAt: new Date()
      }
    }),
    (prisma as any).teams.create({
      data: {
        id: 'team_004',
        name: 'MEP Systems',
        description: 'MEP design and coordination',
        departmentId: departments[2].id, // MEP Engineering
        leaderId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        updatedAt: new Date()
      }
    }),
    (prisma as any).teams.create({
      data: {
        id: 'team_005',
        name: 'Project Delivery',
        description: 'Project management and delivery',
        departmentId: departments[3].id, // Project Management
        leaderId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        updatedAt: new Date()
      }
    }),
    (prisma as any).teams.create({
      data: {
        id: 'team_006',
        name: 'Field Support',
        description: 'Field services and construction support',
        departmentId: departments[6].id, // Field Services
        leaderId: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        updatedAt: new Date()
      }
    })
  ]);

  return {
    initiatives,
    categories,
    departments,
    teams
  };
}

async function createStrategicInputsWithSignals(orgData: any) {
  const { departments, teams } = orgData;
  
  const inputsData = [
    // Cluster 1: Communication & Coordination Issues (5 inputs)
    {
      title: 'Field team not receiving updated drawings',
      description: 'Construction crew working from outdated architectural drawings, causing rework and delays. Third incident this month affecting Oakwood Residential project.',
      department: 'Field Services',
      issueType: 'Documentation',
      rootCause: 'Communication',
      priority: 'HIGH',
      departmentId: departments[6].id,
      teamId: teams[5].id,
      enhancedTags: {
        rootCauses: ['Communication', 'Process'],
        issueTypes: ['Documentation', 'Field Coordination'],
        businessImpact: ['Schedule Delay', 'Rework Cost'],
        departments: ['Field Services', 'Architecture'],
        confidence: 0.92
      }
    },
    {
      title: 'Client approval delays causing project bottlenecks',
      description: 'Residential client taking 2+ weeks to approve design changes, impacting critical path and team availability on Maple Heights project.',
      department: 'Project Management',
      issueType: 'Approval Workflow',
      rootCause: 'Communication',
      priority: 'MEDIUM',
      departmentId: departments[3].id,
      teamId: teams[4].id,
      enhancedTags: {
        rootCauses: ['Communication', 'Client Process'],
        issueTypes: ['Approval Workflow', 'Schedule Management'],
        businessImpact: ['Schedule Delay', 'Resource Utilization'],
        departments: ['Project Management', 'Business Development'],
        confidence: 0.88
      }
    },
    {
      title: 'Missing coordination between MEP and structural teams',
      description: 'Structural beam placement conflicts with HVAC routing discovered during construction phase, requiring emergency redesign.',
      department: 'MEP Engineering',
      issueType: 'Design Coordination',
      rootCause: 'Communication',
      priority: 'HIGH',
      departmentId: departments[2].id,
      teamId: teams[3].id,
      enhancedTags: {
        rootCauses: ['Communication', 'Coordination'],
        issueTypes: ['Design Coordination', 'Quality Control'],
        businessImpact: ['Rework Cost', 'Schedule Delay', 'Client Satisfaction'],
        departments: ['MEP Engineering', 'Structural Engineering'],
        confidence: 0.95
      }
    },
    {
      title: 'Weekly project meetings running over scheduled time',
      description: 'Project status meetings consistently running 30-45 minutes over, causing scheduling conflicts and reducing productivity.',
      department: 'Project Management',
      issueType: 'Meeting Management',
      rootCause: 'Process',
      priority: 'MEDIUM',
      departmentId: departments[3].id,
      teamId: teams[4].id,
      enhancedTags: {
        rootCauses: ['Process', 'Communication'],
        issueTypes: ['Meeting Management', 'Time Management'],
        businessImpact: ['Productivity Loss', 'Schedule Conflicts'],
        departments: ['Project Management'],
        confidence: 0.86
      }
    },
    {
      title: 'Inconsistent documentation standards across projects',
      description: 'Different project teams using varying documentation formats, causing confusion and handoff delays between phases.',
      department: 'Quality Control',
      issueType: 'Documentation Standards',
      rootCause: 'Process',
      priority: 'MEDIUM',
      departmentId: departments[4].id,
      teamId: teams[0].id,
      enhancedTags: {
        rootCauses: ['Process', 'Training'],
        issueTypes: ['Documentation Standards', 'Quality Control'],
        businessImpact: ['Efficiency Loss', 'Quality Issues'],
        departments: ['Quality Control', 'Architecture'],
        confidence: 0.89
      }
    },

    // Cluster 2: Quality Control & Technical Issues (5 inputs)
    {
      title: 'CAD software crashes during large model operations',
      description: 'AutoCAD freezing when working with complex 3D models over 100MB, causing work loss and deadline pressure. IT says hardware is adequate.',
      department: 'Architecture',
      issueType: 'Software Performance',
      rootCause: 'Technology',
      priority: 'HIGH',
      departmentId: departments[0].id,
      teamId: teams[0].id,
      enhancedTags: {
        rootCauses: ['Technology', 'Infrastructure'],
        issueTypes: ['Software Performance', 'Productivity'],
        businessImpact: ['Work Loss', 'Deadline Risk'],
        departments: ['Architecture', 'IT Support'],
        confidence: 0.95
      }
    },
    {
      title: 'Structural calculations requiring multiple revisions',
      description: 'New engineer calculations consistently requiring 2-3 revision cycles, impacting project timelines and senior engineer availability.',
      department: 'Structural Engineering',
      issueType: 'Quality Assurance',
      rootCause: 'Training',
      priority: 'MEDIUM',
      departmentId: departments[1].id,
      teamId: teams[2].id,
      enhancedTags: {
        rootCauses: ['Training', 'Process'],
        issueTypes: ['Quality Assurance', 'Knowledge Transfer'],
        businessImpact: ['Schedule Delay', 'Resource Burden'],
        departments: ['Structural Engineering', 'Quality Control'],
        confidence: 0.91
      }
    },
    {
      title: 'MEP equipment specifications inconsistent with plans',
      description: 'Field installation discovering equipment specs don\'t match architectural space allocations, requiring design modifications.',
      department: 'MEP Engineering',
      issueType: 'Design Coordination',
      rootCause: 'Process',
      priority: 'HIGH',
      departmentId: departments[2].id,
      teamId: teams[3].id,
      enhancedTags: {
        rootCauses: ['Process', 'Quality Control'],
        issueTypes: ['Design Coordination', 'Specification Management'],
        businessImpact: ['Rework Cost', 'Schedule Delay'],
        departments: ['MEP Engineering', 'Architecture'],
        confidence: 0.93
      }
    },
    {
      title: 'Quality control checklist not being followed consistently',
      description: 'QC reviews missing key checkpoints, resulting in issues being discovered late in construction phase.',
      department: 'Quality Control',
      issueType: 'Quality Assurance',
      rootCause: 'Process',
      priority: 'MEDIUM',
      departmentId: departments[4].id,
      teamId: teams[0].id,
      enhancedTags: {
        rootCauses: ['Process', 'Training'],
        issueTypes: ['Quality Assurance', 'Process Compliance'],
        businessImpact: ['Quality Issues', 'Late Discovery Cost'],
        departments: ['Quality Control'],
        confidence: 0.87
      }
    },
    {
      title: 'File version control causing design conflicts',
      description: 'Multiple team members working on outdated file versions, creating conflicts and requiring manual reconciliation.',
      department: 'Architecture',
      issueType: 'Version Control',
      rootCause: 'Technology',
      priority: 'MEDIUM',
      departmentId: departments[0].id,
      teamId: teams[1].id,
      enhancedTags: {
        rootCauses: ['Technology', 'Process'],
        issueTypes: ['Version Control', 'Collaboration'],
        businessImpact: ['Rework Time', 'Design Conflicts'],
        departments: ['Architecture'],
        confidence: 0.90
      }
    },

    // Cluster 3: Resource & Workload Management (5 inputs)
    {
      title: 'Senior architects overloaded, junior staff underutilized',
      description: 'Senior architects working 60+ hour weeks while junior staff waiting for assignments. Project delivery suffering.',
      department: 'Architecture',
      issueType: 'Workload Distribution',
      rootCause: 'Resource Allocation',
      priority: 'HIGH',
      departmentId: departments[0].id,
      teamId: teams[0].id,
      enhancedTags: {
        rootCauses: ['Resource Allocation', 'Management Process'],
        issueTypes: ['Workload Distribution', 'Staff Development'],
        businessImpact: ['Burnout Risk', 'Project Delay', 'Cost Overrun'],
        departments: ['Architecture', 'Project Management'],
        confidence: 0.94
      }
    },
    {
      title: 'Equipment scheduling conflicts between projects',
      description: 'Survey equipment and measurement tools double-booked, causing project delays and team downtime.',
      department: 'Field Services',
      issueType: 'Equipment Scheduling',
      rootCause: 'Resource Management',
      priority: 'MEDIUM',
      departmentId: departments[6].id,
      teamId: teams[5].id,
      enhancedTags: {
        rootCauses: ['Resource Management', 'Process'],
        issueTypes: ['Equipment Scheduling', 'Resource Allocation'],
        businessImpact: ['Project Delay', 'Resource Waste'],
        departments: ['Field Services', 'Project Management'],
        confidence: 0.88
      }
    },
    {
      title: 'Overtime costs exceeding project budgets',
      description: 'Engineering teams consistently requiring overtime to meet deadlines, pushing projects over budget.',
      department: 'Structural Engineering',
      issueType: 'Budget Control',
      rootCause: 'Resource Planning',
      priority: 'HIGH',
      departmentId: departments[1].id,
      teamId: teams[2].id,
      enhancedTags: {
        rootCauses: ['Resource Planning', 'Schedule Management'],
        issueTypes: ['Budget Control', 'Workload Management'],
        businessImpact: ['Cost Overrun', 'Profit Margin'],
        departments: ['Structural Engineering', 'Project Management'],
        confidence: 0.92
      }
    },
    {
      title: 'Conference room booking conflicts during peak hours',
      description: 'Meeting rooms overbooked during 9-11am and 2-4pm, forcing important client meetings to be rescheduled.',
      department: 'Project Management',
      issueType: 'Space Management',
      rootCause: 'Resource Management',
      priority: 'MEDIUM',
      departmentId: departments[3].id,
      teamId: teams[4].id,
      enhancedTags: {
        rootCauses: ['Resource Management', 'Process'],
        issueTypes: ['Space Management', 'Scheduling'],
        businessImpact: ['Client Experience', 'Productivity Loss'],
        departments: ['Project Management', 'Administration'],
        confidence: 0.85
      }
    },
    {
      title: 'Specialized software licenses limiting productivity',
      description: 'Only 3 licenses for structural analysis software causing bottlenecks when multiple projects need analysis.',
      department: 'Structural Engineering',
      issueType: 'Software Licensing',
      rootCause: 'Resource Allocation',
      priority: 'HIGH',
      departmentId: departments[1].id,
      teamId: teams[2].id,
      enhancedTags: {
        rootCauses: ['Resource Allocation', 'Technology'],
        issueTypes: ['Software Licensing', 'Productivity'],
        businessImpact: ['Project Delay', 'Resource Bottleneck'],
        departments: ['Structural Engineering', 'IT'],
        confidence: 0.91
      }
    },

    // Cluster 4: Client Relations & Business Process (5 inputs)
    {
      title: 'Scope creep on residential projects without change orders',
      description: 'Clients requesting additional features without formal change orders, causing budget overruns and team frustration.',
      department: 'Business Development',
      issueType: 'Scope Management',
      rootCause: 'Process',
      priority: 'HIGH',
      departmentId: departments[5].id,
      teamId: teams[0].id,
      enhancedTags: {
        rootCauses: ['Process', 'Communication', 'Contract Management'],
        issueTypes: ['Scope Management', 'Change Control'],
        businessImpact: ['Budget Overrun', 'Profit Margin'],
        departments: ['Business Development', 'Project Management'],
        confidence: 0.89
      }
    },
    {
      title: 'Client expectation misalignment on project timelines',
      description: 'Clients expecting unrealistic delivery dates despite proper initial communication, causing relationship strain.',
      department: 'Business Development',
      issueType: 'Client Relations',
      rootCause: 'Communication',
      priority: 'MEDIUM',
      departmentId: departments[5].id,
      teamId: teams[4].id,
      enhancedTags: {
        rootCauses: ['Communication', 'Expectation Management'],
        issueTypes: ['Client Relations', 'Project Planning'],
        businessImpact: ['Client Satisfaction', 'Relationship Risk'],
        departments: ['Business Development', 'Project Management'],
        confidence: 0.91
      }
    },
    {
      title: 'Invoice processing delays affecting cash flow',
      description: 'Client invoice approvals taking 45+ days, impacting company cash flow and vendor payments.',
      department: 'Business Development',
      issueType: 'Financial Management',
      rootCause: 'Process',
      priority: 'HIGH',
      departmentId: departments[5].id,
      teamId: teams[4].id,
      enhancedTags: {
        rootCauses: ['Process', 'Client Management'],
        issueTypes: ['Financial Management', 'Process Efficiency'],
        businessImpact: ['Cash Flow', 'Vendor Relations'],
        departments: ['Business Development', 'Finance'],
        confidence: 0.93
      }
    },
    {
      title: 'Client communication preferences causing missed messages',
      description: 'Some clients prefer email, others phone calls, causing important communications to be missed or delayed.',
      department: 'Business Development',
      issueType: 'Client Relations',
      rootCause: 'Communication',
      priority: 'MEDIUM',
      departmentId: departments[5].id,
      teamId: teams[4].id,
      enhancedTags: {
        rootCauses: ['Communication', 'Process'],
        issueTypes: ['Client Relations', 'Communication Management'],
        businessImpact: ['Client Satisfaction', 'Project Delays'],
        departments: ['Business Development'],
        confidence: 0.87
      }
    },
    {
      title: 'Contract review bottlenecks delaying project starts',
      description: 'Legal review of client contracts taking 2-3 weeks, delaying project kickoffs and impacting team scheduling.',
      department: 'Business Development',
      issueType: 'Contract Management',
      rootCause: 'Process',
      priority: 'HIGH',
      departmentId: departments[5].id,
      teamId: teams[4].id,
      enhancedTags: {
        rootCauses: ['Process', 'Resource Allocation'],
        issueTypes: ['Contract Management', 'Legal Review'],
        businessImpact: ['Project Delay', 'Resource Planning'],
        departments: ['Business Development', 'Legal'],
        confidence: 0.90
      }
    }
  ];

  const inputs = [];
  const signals = [];

  for (const [index, inputData] of inputsData.entries()) {
    // Create Input (for backward compatibility)
    const input = await (prisma as any).inputs.create({
      data: {
        id: `input_${(index + 1).toString().padStart(3, '0')}`,
        title: inputData.title,
        description: inputData.description,
      createdBy: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
      department: inputData.department,
      issueType: inputData.issueType,
      rootCause: inputData.rootCause,
      priority: inputData.priority,
      updatedAt: new Date()
      }
    });

    // Create corresponding Signal with enhanced metadata
    const signal = await (prisma as any).signals.create({
      data: {
        id: `signal_${(index + 1).toString().padStart(3, '0')}`,
        inputId: input.id,
        timestamp: new Date(),
        schemaVersion: '1.0',
        sourceType: 'manual',
        title: inputData.title,
        description: inputData.description,
        severity: inputData.priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
        severityScore: inputData.priority === 'HIGH' ? 3 : 2,
        departmentId: inputData.departmentId,
        teamId: inputData.teamId,
        enhancedTagsJson: inputData.enhancedTags,
        tagGenerationMeta: {
          model: 'comprehensive-seeding-v1',
          timestamp: new Date().toISOString(),
          processingTime: 0
        },
        domainClassification: {
          primaryDomain: inputData.enhancedTags.departments[0],
          confidence: inputData.enhancedTags.confidence
        },
        lastTaggedAt: new Date(),
        tagModelVersion: '1.0',
        aiProcessed: true, // Mark as processed since we have complete metadata
        createdById: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        updatedAt: new Date()
      }
    });

    inputs.push(input);
    signals.push(signal);
  }

  return { inputs, signals };
}

async function createCollaborationData(inputs: any[]) {
  // Create votes for engagement
  const votes = [];
  for (const input of inputs) {
    // One vote per input for realistic engagement
    const vote = await (prisma as any).votes.create({
      data: {
        id: `vote_${input.id}_1`,
        entityId: input.id,
        entityType: 'INPUT',
        createdBy: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        value: 'UP'
      }
    });
    votes.push(vote);
  }

  // Create comments for collaboration
  const comments = [];
  for (let i = 0; i < inputs.length; i += 3) { // Comment on every 3rd input
    const input = inputs[i];
    const comment = await (prisma as any).comments.create({
      data: {
        id: `comment_${input.id}_1`,
        content: `This is a critical issue that needs immediate attention. We've seen similar patterns in other projects.`,
        entityType: 'INPUT',
        entityId: input.id,
        createdBy: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
        parentId: null,
        updatedAt: new Date()
      }
    });
    comments.push(comment);
  }

  return { votes, comments };
}

async function createHotspots(signals: any[]) {
  const hotspots = [];

  // Cluster 1: Communication & Coordination Issues (signals 0-4)
  const hotspot1 = await (prisma as any).hotspots.create({
    data: {
      id: 'hotspot_001',
      title: 'Communication & Coordination Issues',
      summary: 'Critical communication breakdowns across departments causing project delays and rework incidents',
      status: 'OPEN',
      clusteringResults: {
        algorithm: 'comprehensive-seeding',
        confidence: 0.89,
        similarity: 0.92,
        commonThemes: ['Communication', 'Coordination', 'Process'],
        businessImpact: ['Schedule Delay', 'Rework Cost', 'Client Satisfaction']
      },
      updatedAt: new Date()
    }
  });

  // Link signals to hotspot
  for (let i = 0; i < 5; i++) {
    await (prisma as any).hotspot_signals.create({
      data: {
        hotspotId: hotspot1.id,
        signalId: signals[i].id
      }
    });
  }

  // Cluster 2: Quality Control & Technical Issues (signals 5-9)
  const hotspot2 = await (prisma as any).hotspots.create({
    data: {
      id: 'hotspot_002', 
      title: 'Quality Control & Technical Issues',
      summary: 'Technology and process issues impacting quality and productivity across engineering teams',
      status: 'OPEN',
      clusteringResults: {
        algorithm: 'comprehensive-seeding',
        confidence: 0.91,
        similarity: 0.88,
        commonThemes: ['Technology', 'Quality Control', 'Training'],
        businessImpact: ['Quality Issues', 'Productivity Loss', 'Work Loss']
      },
      updatedAt: new Date()
    }
  });

  for (let i = 5; i < 10; i++) {
    await (prisma as any).hotspot_signals.create({
      data: {
        hotspotId: hotspot2.id,
        signalId: signals[i].id
      }
    });
  }

  // Cluster 3: Resource & Workload Management (signals 10-14)
  const hotspot3 = await (prisma as any).hotspots.create({
    data: {
      id: 'hotspot_003',
      title: 'Resource & Workload Management',
      summary: 'Resource allocation and workload distribution challenges affecting team productivity and project delivery',
      status: 'OPEN',
      clusteringResults: {
        algorithm: 'comprehensive-seeding',
        confidence: 0.90,
        similarity: 0.85,
        commonThemes: ['Resource Allocation', 'Workload Management', 'Process'],
        businessImpact: ['Cost Overrun', 'Burnout Risk', 'Project Delay']
      },
      updatedAt: new Date()
    }
  });

  for (let i = 10; i < 15; i++) {
    await (prisma as any).hotspot_signals.create({
      data: {
        hotspotId: hotspot3.id,
        signalId: signals[i].id
      }
    });
  }

  // Cluster 4: Client Relations & Business Process (signals 15-19)
  const hotspot4 = await (prisma as any).hotspots.create({
    data: {
      id: 'hotspot_004',
      title: 'Client Relations & Business Process',
      summary: 'Client management and business process improvement opportunities affecting satisfaction and cash flow',
      status: 'OPEN',
      clusteringResults: {
        algorithm: 'comprehensive-seeding',
        confidence: 0.88,
        similarity: 0.87,
        commonThemes: ['Client Management', 'Process', 'Communication'],
        businessImpact: ['Client Satisfaction', 'Cash Flow', 'Profit Margin']
      },
      updatedAt: new Date()
    }
  });

  for (let i = 15; i < 20; i++) {
    await (prisma as any).hotspot_signals.create({
      data: {
        hotspotId: hotspot4.id,
        signalId: signals[i].id
      }
    });
  }

  hotspots.push(hotspot1, hotspot2, hotspot3, hotspot4);
  return hotspots;
}

async function createIdeas(hotspots: any[], initiatives: any[]) {
  const ideas = [];

  // Idea 1: From Communication Hotspot
  const idea1 = await (prisma as any).ideas.create({
    data: {
      id: 'idea_001',
      title: 'Real-Time Drawing Distribution System',
      description: 'Implement cloud-based system to ensure field teams always have current drawings',
      hotspotId: hotspots[0].id,
      initiativeId: initiatives[1].id, // Digital Transformation
      origin: 'ai',
      status: 'UNDER_REVIEW',
      evidenceJson: {
        supportingSignals: ['signal_001', 'signal_002', 'signal_003'],
        businessCase: 'Reduce rework costs by 40% and improve project delivery times',
        impactAssessment: 'High cost savings, medium implementation effort',
        riskFactors: ['Integration complexity', 'User adoption'],
        successMetrics: ['40% reduction in rework incidents', '20% faster project delivery']
      },
      updatedAt: new Date()
    }
  });

  // Idea 2: From Quality Control Hotspot
  const idea2 = await (prisma as any).ideas.create({
    data: {
      id: 'idea_002',
      title: 'CAD Performance Optimization Initiative',
      description: 'Upgrade hardware and optimize software for complex 3D modeling',
      hotspotId: hotspots[1].id,
      initiativeId: initiatives[1].id, // Digital Transformation
      origin: 'ai',
      status: 'APPROVED',
      evidenceJson: {
        supportingSignals: ['signal_006', 'signal_010'],
        businessCase: 'Increase productivity by 25% and reduce work loss incidents',
        impactAssessment: 'High ROI, one-time investment',
        riskFactors: ['Budget approval', 'Implementation downtime'],
        successMetrics: ['25% productivity increase', '95% uptime during large model operations']
      },
      updatedAt: new Date()
    }
  });

  // Idea 3: From Resource Management Hotspot
  const idea3 = await (prisma as any).ideas.create({
    data: {
      id: 'idea_003',
      title: 'Junior Staff Development Program',
      description: 'Comprehensive training and mentorship program to better utilize junior staff',
      hotspotId: hotspots[2].id,
      initiativeId: initiatives[0].id, // Operational Excellence
      origin: 'ai',
      status: 'APPROVED',
      evidenceJson: {
        supportingSignals: ['signal_011', 'signal_013'],
        businessCase: 'Improve resource utilization and reduce senior staff burnout',
        impactAssessment: 'Medium cost, high long-term benefit',
        riskFactors: ['Training time investment', 'Initial productivity dip'],
        successMetrics: ['80% junior staff utilization', '20% reduction in senior overtime']
      },
      updatedAt: new Date()
    }
  });

  // Idea 4: From Client Relations Hotspot
  const idea4 = await (prisma as any).ideas.create({
    data: {
      id: 'idea_004',
      title: 'Client Communication Standardization',
      description: 'Standardize client communication processes and preferences management',
      hotspotId: hotspots[3].id,
      initiativeId: initiatives[0].id, // Operational Excellence
      origin: 'ai',
      status: 'UNDER_REVIEW',
      evidenceJson: {
        supportingSignals: ['signal_016', 'signal_018'],
        businessCase: 'Improve client satisfaction and reduce project delays',
        impactAssessment: 'Low cost, medium-high impact',
        riskFactors: ['Change management', 'Client adoption'],
        successMetrics: ['90% client satisfaction', '15% reduction in communication delays']
      },
      updatedAt: new Date()
    }
  });

  // Idea 5: Process Improvement Idea
  const idea5 = await (prisma as any).ideas.create({
    data: {
      id: 'idea_005',
      title: 'Integrated Project Management Dashboard',
      description: 'Unified dashboard for real-time project status, resource allocation, and client communication',
      hotspotId: hotspots[0].id, // Could be linked to communication hotspot
      initiativeId: initiatives[1].id, // Digital Transformation
      origin: 'human',
      status: 'DRAFT',
      evidenceJson: {
        supportingSignals: ['signal_004', 'signal_014'],
        businessCase: 'Improve overall project visibility and coordination',
        impactAssessment: 'Medium cost, high strategic value',
        riskFactors: ['Technical complexity', 'Integration challenges'],
        successMetrics: ['Real-time visibility for 100% of projects', '30% improvement in coordination efficiency']
      },
      updatedAt: new Date()
    }
  });

  ideas.push(idea1, idea2, idea3, idea4, idea5);
  return ideas;
}

async function createSolutions(ideas: any[], inputs: any[]) {
  const solutions = [];

  // Solution 1: From Approved Idea (CAD Performance)
  const solution1 = await (prisma as any).solutions.create({
    data: {
      id: 'solution_001',
      title: 'CAD Infrastructure Upgrade & Optimization',
      description: 'Complete CAD hardware upgrade and software optimization for improved performance',
      ideaId: ideas[1].id, // CAD Performance Optimization
      inputId: inputs[5].id, // CAD software crashes input
      status: 'IN_PROGRESS',
      expectedImpactJson: {
        businessPlan: {
          problemStatement: 'CAD software crashes causing productivity loss and deadline pressure',
          proposedSolution: 'Hardware upgrade and software optimization for complex 3D modeling',
          successMetrics: ['25% productivity increase', '95% uptime during large operations', 'Zero work loss incidents'],
          timeline: '8 weeks implementation',
          budget: 75000
        },
        riskAssessment: {
          technicalRisks: ['Hardware compatibility', 'Software integration', 'Data migration'],
          businessRisks: ['Implementation downtime', 'User training', 'Budget approval'],
          mitigationPlans: ['Phased rollout', 'Comprehensive training program', 'Backup systems']
        },
        resourcePlanning: {
          estimatedCost: 75000,
          timeline: '8 weeks',
          requiredSkills: ['IT infrastructure', 'CAD administration', 'Training coordination'],
          teamSize: 5,
          dependencies: ['Budget approval', 'Hardware procurement', 'Training schedule']
        }
      },
      createdBy: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
      updatedAt: new Date()
    }
  });

  // Solution 2: From Approved Idea (Junior Staff Development)
  const solution2 = await (prisma as any).solutions.create({
    data: {
      id: 'solution_002',
      title: 'Comprehensive Junior Staff Development Program',
      description: 'Multi-phased training and mentorship program to optimize resource utilization',
      ideaId: ideas[2].id, // Junior Staff Development Program
      inputId: inputs[10].id, // Senior architects overloaded input
      status: 'APPROVED',
      expectedImpactJson: {
        businessPlan: {
          problemStatement: 'Senior staff overloaded while junior staff underutilized',
          proposedSolution: 'Structured development program with mentorship and skill-building',
          successMetrics: ['80% junior staff utilization', '20% reduction in senior overtime', '90% program completion rate'],
          timeline: '12 weeks implementation, 6 months full program',
          budget: 45000
        },
        riskAssessment: {
          technicalRisks: ['Training material development', 'Progress tracking', 'Skill assessment'],
          businessRisks: ['Initial productivity dip', 'Training time investment', 'Resource allocation'],
          mitigationPlans: ['Gradual skill transfer', 'Paired programming/mentoring', 'Progress milestone tracking']
        },
        resourcePlanning: {
          estimatedCost: 45000,
          timeline: '12 weeks setup + 6 months execution',
          requiredSkills: ['Training development', 'Mentorship coordination', 'Performance tracking'],
          teamSize: 8,
          dependencies: ['Senior staff availability', 'Training materials', 'Mentorship assignments']
        }
      },
      createdBy: 'cmfo0ik2h000rw8fmhp7ufiou', // sarah.executive@faevision.com
      updatedAt: new Date()
    }
  });

  solutions.push(solution1, solution2);
  return solutions;
}

async function validateCompleteWorkflow() {
  const counts = {
    departments: await prisma.departments.count(),
    teams: await prisma.teams.count(),
    initiatives: await prisma.initiatives.count(),
    categories: await prisma.categories.count(),
    inputs: await prisma.inputs.count(),
    signals: await prisma.signals.count(),
    hotspots: await prisma.hotspots.count(),
    hotspot_signals: await prisma.hotspot_signals.count(),
    ideas: await prisma.ideas.count(),
    solutions: await prisma.solutions.count(),
    votes: await prisma.votes.count(),
    comments: await prisma.comments.count()
  };

  console.log('  📊 Complete Workflow Validation:');
  console.log(`    - Departments: ${counts.departments}`);
  console.log(`    - Teams: ${counts.teams}`);
  console.log(`    - Initiatives: ${counts.initiatives}`);
  console.log(`    - Categories: ${counts.categories}`);
  console.log(`    - Inputs: ${counts.inputs}`);
  console.log(`    - Signals: ${counts.signals}`);
  console.log(`    - Hotspots: ${counts.hotspots}`);
  console.log(`    - Hotspot-Signal Links: ${counts.hotspot_signals}`);
  console.log(`    - Ideas: ${counts.ideas}`);
  console.log(`    - Solutions: ${counts.solutions}`);
  console.log(`    - Votes: ${counts.votes}`);
  console.log(`    - Comments: ${counts.comments}`);

  // Validate expected workflow
  if (counts.departments !== 7) throw new Error(`Expected 7 departments, got ${counts.departments}`);
  if (counts.teams !== 6) throw new Error(`Expected 6 teams, got ${counts.teams}`);
  if (counts.inputs !== 20) throw new Error(`Expected 20 inputs, got ${counts.inputs}`);
  if (counts.signals !== 20) throw new Error(`Expected 20 signals, got ${counts.signals}`);
  if (counts.hotspots !== 4) throw new Error(`Expected 4 hotspots, got ${counts.hotspots}`);
  if (counts.hotspot_signals !== 20) throw new Error(`Expected 20 hotspot-signal links, got ${counts.hotspot_signals}`);
  if (counts.ideas !== 5) throw new Error(`Expected 5 ideas, got ${counts.ideas}`);
  if (counts.solutions !== 2) throw new Error(`Expected 2 solutions, got ${counts.solutions}`);

  console.log('  ✅ Complete workflow validation successful');
  console.log('  📋 F1-F6 Feature Alignment:');
  console.log('    ✅ F1: Input Capture - 20 strategic inputs with enhanced tagging');
  console.log('    ✅ F2: Collaboration - Votes, comments, real-time engagement');
  console.log('    ✅ F3: Organization - 4 distinct hotspots with AI clustering');
  console.log('    ✅ F4: Solution Execution - 2 solutions with business planning');
  console.log('    ✅ F5: Executive Requirements - Data ready for requirements creation');
  console.log('    ✅ F6: FRD Handoff - Solutions ready for document generation');
}

// Run the complete seeding
main()
  .catch((e) => {
    console.error('❌ Complete Preview Database Seeding Failed:', e);
    process.exit(1);
  });
