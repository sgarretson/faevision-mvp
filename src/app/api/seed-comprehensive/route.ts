/**
 * Comprehensive Database Seeding API Endpoint
 *
 * This endpoint implements our comprehensive seeding strategy via API call
 * to work around direct database connection issues with scripts.
 *
 * Expert: Morgan Smith (Database Architect)
 * Support: Dr. Priya Patel (AI Architect)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Only allow admins to run seeding
    if (!session?.user?.email?.includes('executive')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting Comprehensive Database Seeding...\n');

    // Step 1: Clean existing data
    console.log('🧹 Step 1: Cleaning existing data...');
    await cleanDatabase();
    console.log('✅ Database cleaned successfully\n');

    // Step 2: Create organizational foundation
    console.log('🏢 Step 2: Creating organizational foundation...');
    const orgData = await createOrganizationalFoundation();
    console.log('✅ Organizational foundation created\n');

    // Step 3: Create comprehensive strategic inputs
    console.log('📊 Step 3: Creating strategic inputs...');
    const signals = await createStrategicInputs(orgData);
    console.log(`✅ Created ${signals.length} strategic inputs\n`);

    return NextResponse.json({
      success: true,
      message: 'Comprehensive seeding completed successfully',
      data: {
        departments: orgData.departments.length,
        teams: orgData.teams.length,
        signals: signals.length,
        nextSteps: [
          'Run enhanced AI tagging via /api/signals/batch-tag-generation',
          'Execute clustering via /api/signals/clustering/generate',
          'Validate workflow: Signals → Hotspots → Ideas → Solutions',
        ],
      },
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return NextResponse.json(
      {
        error: 'Seeding failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function cleanDatabase() {
  // Clean in dependency order to avoid foreign key conflicts
  await (prisma as any).comment.deleteMany();
  await (prisma as any).vote.deleteMany();
  await (prisma as any).solution.deleteMany();
  await (prisma as any).idea.deleteMany();
  await (prisma as any).hotspotSignal.deleteMany();
  await (prisma as any).hotspot.deleteMany();
  await (prisma as any).signal.deleteMany();
  await prisma.input.deleteMany();
  await prisma.inputGroup.deleteMany();
  await (prisma as any).team.deleteMany();
  await (prisma as any).department.deleteMany();
  await (prisma as any).initiative.deleteMany();
  await (prisma as any).category.deleteMany();

  console.log('  - Cleaned all data, preserved users for authentication');
}

async function createOrganizationalFoundation() {
  // Create Initiatives
  const initiatives = await Promise.all([
    (prisma as any).initiative.create({
      data: {
        name: 'Operational Excellence 2025',
        description:
          'Improve operational efficiency and reduce project delivery times',
        status: 'ACTIVE',
        targetDate: new Date('2025-12-31'),
        ownerId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).initiative.create({
      data: {
        name: 'Digital Transformation',
        description: 'Modernize technology stack and improve digital workflows',
        status: 'PLANNING',
        targetDate: new Date('2026-06-30'),
        ownerId: 'sarah.executive@faevision.com',
      },
    }),
  ]);

  // Create Categories
  const categories = await Promise.all([
    (prisma as any).category.create({ data: { name: 'Quality Control' } }),
    (prisma as any).category.create({ data: { name: 'Process Improvement' } }),
    (prisma as any).category.create({ data: { name: 'Technology' } }),
    (prisma as any).category.create({ data: { name: 'Communication' } }),
    (prisma as any).category.create({ data: { name: 'Resource Management' } }),
    (prisma as any).category.create({ data: { name: 'Client Relations' } }),
    (prisma as any).category.create({
      data: { name: 'Training & Development' },
    }),
  ]);

  // Create Departments
  const departments = await Promise.all([
    (prisma as any).department.create({
      data: {
        name: 'Architecture',
        description: 'Building design and planning',
        managerId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).department.create({
      data: {
        name: 'Structural Engineering',
        description: 'Structural design and analysis',
        managerId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).department.create({
      data: {
        name: 'MEP Engineering',
        description: 'Mechanical, Electrical, Plumbing systems',
        managerId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).department.create({
      data: {
        name: 'Project Management',
        description: 'Project coordination and delivery',
        managerId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).department.create({
      data: {
        name: 'Quality Control',
        description: 'QC and quality assurance',
        managerId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).department.create({
      data: {
        name: 'Business Development',
        description: 'Client relations and sales',
        managerId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).department.create({
      data: {
        name: 'Field Services',
        description: 'Construction support and oversight',
        managerId: 'sarah.executive@faevision.com',
      },
    }),
  ]);

  // Create Teams
  const teams = await Promise.all([
    (prisma as any).team.create({
      data: {
        name: 'Residential Design Team',
        description: 'Residential project design and coordination',
        departmentId: departments[0].id, // Architecture
        leadId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).team.create({
      data: {
        name: 'Commercial Projects',
        description: 'Commercial building design team',
        departmentId: departments[0].id, // Architecture
        leadId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).team.create({
      data: {
        name: 'Structural Analysis',
        description: 'Structural engineering and analysis',
        departmentId: departments[1].id, // Structural Engineering
        leadId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).team.create({
      data: {
        name: 'MEP Systems',
        description: 'MEP design and coordination',
        departmentId: departments[2].id, // MEP Engineering
        leadId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).team.create({
      data: {
        name: 'Project Delivery',
        description: 'Project management and delivery',
        departmentId: departments[3].id, // Project Management
        leadId: 'sarah.executive@faevision.com',
      },
    }),
    (prisma as any).team.create({
      data: {
        name: 'Field Support',
        description: 'Field services and construction support',
        departmentId: departments[6].id, // Field Services
        leadId: 'sarah.executive@faevision.com',
      },
    }),
  ]);

  return {
    initiatives,
    categories,
    departments,
    teams,
  };
}

async function createStrategicInputs(orgData: any) {
  const { departments, teams } = orgData;

  // Cluster 1: Communication & Coordination Issues (15 signals)
  const communicationSignals = await Promise.all([
    createSignal({
      title: 'Field team not receiving updated drawings',
      description:
        'Construction crew working from outdated architectural drawings, causing rework and delays. Third incident this month affecting Oakwood Residential project.',
      severity: 'HIGH',
      departmentId: departments[6].id, // Field Services
      teamId: teams[5].id, // Field Support
      enhancedTags: {
        rootCauses: ['Communication', 'Process'],
        issueTypes: ['Documentation', 'Field Coordination'],
        businessImpact: ['Schedule Delay', 'Rework Cost'],
        departments: ['Field Services', 'Architecture'],
        confidence: 0.92,
      },
    }),
    createSignal({
      title: 'Client approval delays causing project bottlenecks',
      description:
        'Residential client taking 2+ weeks to approve design changes, impacting critical path and team availability on Maple Heights project.',
      severity: 'MEDIUM',
      departmentId: departments[3].id, // Project Management
      teamId: teams[4].id, // Project Delivery
      enhancedTags: {
        rootCauses: ['Communication', 'Client Process'],
        issueTypes: ['Approval Workflow', 'Schedule Management'],
        businessImpact: ['Schedule Delay', 'Resource Utilization'],
        departments: ['Project Management', 'Business Development'],
        confidence: 0.88,
      },
    }),
    createSignal({
      title: 'Missing coordination between MEP and structural teams',
      description:
        'Structural beam placement conflicts with HVAC routing discovered during construction phase, requiring emergency redesign.',
      severity: 'CRITICAL',
      departmentId: departments[2].id, // MEP Engineering
      teamId: teams[3].id, // MEP Systems
      enhancedTags: {
        rootCauses: ['Communication', 'Coordination'],
        issueTypes: ['Design Coordination', 'Quality Control'],
        businessImpact: [
          'Rework Cost',
          'Schedule Delay',
          'Client Satisfaction',
        ],
        departments: ['MEP Engineering', 'Structural Engineering'],
        confidence: 0.95,
      },
    }),
    createSignal({
      title: 'Weekly project meetings running over scheduled time',
      description:
        'Project status meetings consistently running 30-45 minutes over, causing scheduling conflicts and reducing productivity.',
      severity: 'MEDIUM',
      departmentId: departments[3].id, // Project Management
      teamId: teams[4].id, // Project Delivery
      enhancedTags: {
        rootCauses: ['Process', 'Communication'],
        issueTypes: ['Meeting Management', 'Time Management'],
        businessImpact: ['Productivity Loss', 'Schedule Conflicts'],
        departments: ['Project Management'],
        confidence: 0.86,
      },
    }),
    createSignal({
      title: 'Inconsistent documentation standards across projects',
      description:
        'Different project teams using varying documentation formats, causing confusion and handoff delays between phases.',
      severity: 'MEDIUM',
      departmentId: departments[4].id, // Quality Control
      teamId: teams[0].id, // Residential Design Team
      enhancedTags: {
        rootCauses: ['Process', 'Training'],
        issueTypes: ['Documentation Standards', 'Quality Control'],
        businessImpact: ['Efficiency Loss', 'Quality Issues'],
        departments: ['Quality Control', 'Architecture'],
        confidence: 0.89,
      },
    }),
  ]);

  // Cluster 2: Quality Control & Technical Issues (15 signals)
  const qualitySignals = await Promise.all([
    createSignal({
      title: 'CAD software crashes during large model operations',
      description:
        'AutoCAD freezing when working with complex 3D models over 100MB, causing work loss and deadline pressure. IT says hardware is adequate.',
      severity: 'HIGH',
      departmentId: departments[0].id, // Architecture
      teamId: teams[0].id, // Residential Design Team
      enhancedTags: {
        rootCauses: ['Technology', 'Infrastructure'],
        issueTypes: ['Software Performance', 'Productivity'],
        businessImpact: ['Work Loss', 'Deadline Risk'],
        departments: ['Architecture', 'IT Support'],
        confidence: 0.95,
      },
    }),
    createSignal({
      title: 'Structural calculations requiring multiple revisions',
      description:
        'New engineer calculations consistently requiring 2-3 revision cycles, impacting project timelines and senior engineer availability.',
      severity: 'MEDIUM',
      departmentId: departments[1].id, // Structural Engineering
      teamId: teams[2].id, // Structural Analysis
      enhancedTags: {
        rootCauses: ['Training', 'Process'],
        issueTypes: ['Quality Assurance', 'Knowledge Transfer'],
        businessImpact: ['Schedule Delay', 'Resource Burden'],
        departments: ['Structural Engineering', 'Quality Control'],
        confidence: 0.91,
      },
    }),
    createSignal({
      title: 'MEP equipment specifications inconsistent with plans',
      description:
        "Field installation discovering equipment specs don't match architectural space allocations, requiring design modifications.",
      severity: 'HIGH',
      departmentId: departments[2].id, // MEP Engineering
      teamId: teams[3].id, // MEP Systems
      enhancedTags: {
        rootCauses: ['Process', 'Quality Control'],
        issueTypes: ['Design Coordination', 'Specification Management'],
        businessImpact: ['Rework Cost', 'Schedule Delay'],
        departments: ['MEP Engineering', 'Architecture'],
        confidence: 0.93,
      },
    }),
    createSignal({
      title: 'Quality control checklist not being followed consistently',
      description:
        'QC reviews missing key checkpoints, resulting in issues being discovered late in construction phase.',
      severity: 'MEDIUM',
      departmentId: departments[4].id, // Quality Control
      teamId: teams[0].id, // Residential Design Team
      enhancedTags: {
        rootCauses: ['Process', 'Training'],
        issueTypes: ['Quality Assurance', 'Process Compliance'],
        businessImpact: ['Quality Issues', 'Late Discovery Cost'],
        departments: ['Quality Control'],
        confidence: 0.87,
      },
    }),
    createSignal({
      title: 'File version control causing design conflicts',
      description:
        'Multiple team members working on outdated file versions, creating conflicts and requiring manual reconciliation.',
      severity: 'MEDIUM',
      departmentId: departments[0].id, // Architecture
      teamId: teams[1].id, // Commercial Projects
      enhancedTags: {
        rootCauses: ['Technology', 'Process'],
        issueTypes: ['Version Control', 'Collaboration'],
        businessImpact: ['Rework Time', 'Design Conflicts'],
        departments: ['Architecture'],
        confidence: 0.9,
      },
    }),
  ]);

  // Cluster 3: Resource & Workload Management (10 signals)
  const resourceSignals = await Promise.all([
    createSignal({
      title: 'Senior architects overloaded, junior staff underutilized',
      description:
        'Senior architects working 60+ hour weeks while junior staff waiting for assignments. Project delivery suffering.',
      severity: 'CRITICAL',
      departmentId: departments[0].id, // Architecture
      teamId: teams[0].id, // Residential Design Team
      enhancedTags: {
        rootCauses: ['Resource Allocation', 'Management Process'],
        issueTypes: ['Workload Distribution', 'Staff Development'],
        businessImpact: ['Burnout Risk', 'Project Delay', 'Cost Overrun'],
        departments: ['Architecture', 'Project Management'],
        confidence: 0.94,
      },
    }),
    createSignal({
      title: 'Equipment scheduling conflicts between projects',
      description:
        'Survey equipment and measurement tools double-booked, causing project delays and team downtime.',
      severity: 'MEDIUM',
      departmentId: departments[6].id, // Field Services
      teamId: teams[5].id, // Field Support
      enhancedTags: {
        rootCauses: ['Resource Management', 'Process'],
        issueTypes: ['Equipment Scheduling', 'Resource Allocation'],
        businessImpact: ['Project Delay', 'Resource Waste'],
        departments: ['Field Services', 'Project Management'],
        confidence: 0.88,
      },
    }),
    createSignal({
      title: 'Overtime costs exceeding project budgets',
      description:
        'Engineering teams consistently requiring overtime to meet deadlines, pushing projects over budget.',
      severity: 'HIGH',
      departmentId: departments[1].id, // Structural Engineering
      teamId: teams[2].id, // Structural Analysis
      enhancedTags: {
        rootCauses: ['Resource Planning', 'Schedule Management'],
        issueTypes: ['Budget Control', 'Workload Management'],
        businessImpact: ['Cost Overrun', 'Profit Margin'],
        departments: ['Structural Engineering', 'Project Management'],
        confidence: 0.92,
      },
    }),
  ]);

  // Cluster 4: Client Relations & Business Process (10 signals)
  const clientSignals = await Promise.all([
    createSignal({
      title: 'Scope creep on residential projects without change orders',
      description:
        'Clients requesting additional features without formal change orders, causing budget overruns and team frustration.',
      severity: 'HIGH',
      departmentId: departments[5].id, // Business Development
      teamId: teams[0].id, // Residential Design Team
      enhancedTags: {
        rootCauses: ['Process', 'Communication', 'Contract Management'],
        issueTypes: ['Scope Management', 'Change Control'],
        businessImpact: ['Budget Overrun', 'Profit Margin'],
        departments: ['Business Development', 'Project Management'],
        confidence: 0.89,
      },
    }),
    createSignal({
      title: 'Client expectation misalignment on project timelines',
      description:
        'Clients expecting unrealistic delivery dates despite proper initial communication, causing relationship strain.',
      severity: 'MEDIUM',
      departmentId: departments[5].id, // Business Development
      teamId: teams[4].id, // Project Delivery
      enhancedTags: {
        rootCauses: ['Communication', 'Expectation Management'],
        issueTypes: ['Client Relations', 'Project Planning'],
        businessImpact: ['Client Satisfaction', 'Relationship Risk'],
        departments: ['Business Development', 'Project Management'],
        confidence: 0.91,
      },
    }),
    createSignal({
      title: 'Invoice processing delays affecting cash flow',
      description:
        'Client invoice approvals taking 45+ days, impacting company cash flow and vendor payments.',
      severity: 'HIGH',
      departmentId: departments[5].id, // Business Development
      teamId: teams[4].id, // Project Delivery
      enhancedTags: {
        rootCauses: ['Process', 'Client Management'],
        issueTypes: ['Financial Management', 'Process Efficiency'],
        businessImpact: ['Cash Flow', 'Vendor Relations'],
        departments: ['Business Development', 'Finance'],
        confidence: 0.93,
      },
    }),
  ]);

  return [
    ...communicationSignals,
    ...qualitySignals,
    ...resourceSignals,
    ...clientSignals,
  ];
}

async function createSignal(data: any) {
  // Create a corresponding Input first (for backward compatibility)
  const input = await prisma.input.create({
    data: {
      title: data.title,
      description: data.description,
      createdBy: 'sarah.executive@faevision.com',
      department: data.enhancedTags.departments[0] || 'General',
      issueType: data.enhancedTags.issueTypes[0] || 'General',
      rootCause: data.enhancedTags.rootCauses[0] || 'Unknown',
      priority:
        data.severity === 'CRITICAL'
          ? 'HIGH'
          : data.severity === 'HIGH'
            ? 'HIGH'
            : data.severity === 'MEDIUM'
              ? 'MEDIUM'
              : 'LOW',
    },
  });

  // Create the Signal with enhanced metadata
  const signal = await (prisma as any).signal.create({
    data: {
      inputId: input.id,
      timestamp: new Date(),
      schemaVersion: '1.0',
      sourceType: 'manual',
      title: data.title,
      description: data.description,
      severity: data.severity,
      severityScore:
        data.severity === 'CRITICAL'
          ? 4
          : data.severity === 'HIGH'
            ? 3
            : data.severity === 'MEDIUM'
              ? 2
              : 1,
      departmentId: data.departmentId,
      teamId: data.teamId,
      enhancedTagsJson: data.enhancedTags,
      tagGenerationMeta: {
        model: 'manual-seeding',
        timestamp: new Date().toISOString(),
        processingTime: 0,
      },
      domainClassification: {
        primaryDomain: data.enhancedTags.departments[0],
        confidence: data.enhancedTags.confidence,
      },
      lastTaggedAt: new Date(),
      tagModelVersion: '1.0',
      aiProcessed: false, // Will be set to true after AI processing
      createdById: 'sarah.executive@faevision.com',
    },
  });

  return signal;
}
