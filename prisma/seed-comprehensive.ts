import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Comprehensive A&E Firm Seed Data
 *
 * Realistic scenarios for 150-person Architecture & Engineering firm
 * serving large residential builders with Smartsheet, Deltek, Coretex integration
 *
 * Expert Team: Sarah Chen, Marcus Rodriguez, Dr. Priya Patel, Morgan Smith
 * Domain Consultants: A&E Operations, Construction Technology, Field Operations
 */

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️ Seeding comprehensive A&E firm data...');

  // Hash for all demo passwords
  const passwordHash = await bcrypt.hash('demo123', 10);

  // ============================================================================
  // DEPARTMENTS (Architecture & Engineering Firm Structure)
  // ============================================================================

  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Architecture',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Engineering',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Planning',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Construction Admin',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Client Services',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Finance',
      },
    }),
    prisma.department.create({
      data: {
        name: 'IT',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Executive',
      },
    }),
  ]);

  // ============================================================================
  // TEAMS (Project-based and functional teams)
  // ============================================================================

  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'Meadowbrook Project Team',
        departmentId: departments[0].id, // Architecture
      },
    }),
    prisma.team.create({
      data: {
        name: 'Heritage Grove Team',
        departmentId: departments[0].id, // Architecture
      },
    }),
    prisma.team.create({
      data: {
        name: 'Structural Engineering',
        departmentId: departments[1].id, // Engineering
      },
    }),
    prisma.team.create({
      data: {
        name: 'MEP Coordination',
        departmentId: departments[1].id, // Engineering
      },
    }),
    prisma.team.create({
      data: {
        name: 'Field Support',
        departmentId: departments[3].id, // Construction Admin
      },
    }),
    prisma.team.create({
      data: {
        name: 'QC/QA Team',
        departmentId: departments[3].id, // Construction Admin
      },
    }),
  ]);

  // ============================================================================
  // INITIATIVES (Major business initiatives and strategic projects)
  // ============================================================================

  const initiatives = await Promise.all([
    prisma.initiative.create({
      data: {
        name: 'Digital Transformation 2025',
        description: 'Modernize design workflows and technology integration',
        goalJson: { status: 'ACTIVE', priority: 'HIGH', budget: 500000 },
        roiJson: { expectedSavings: 200000, timeframe: '12 months' },
      },
    }),
    prisma.initiative.create({
      data: {
        name: 'Field Coordination Excellence',
        description: 'Improve construction admin and field support processes',
        goalJson: { status: 'ACTIVE', priority: 'HIGH', budget: 300000 },
        roiJson: { expectedSavings: 150000, timeframe: '6 months' },
      },
    }),
    prisma.initiative.create({
      data: {
        name: 'Client Experience Enhancement',
        description: 'Streamline client communication and project delivery',
        goalJson: { status: 'PLANNING', priority: 'MEDIUM', budget: 200000 },
        roiJson: { expectedSavings: 100000, timeframe: '9 months' },
      },
    }),
  ]);

  // ============================================================================
  // CATEGORIES (Issue categorization for better organization)
  // ============================================================================

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Field Coordination',
        description: 'Construction field support and coordination issues',
        color: '#ef4444', // Red for urgent field issues
      },
    }),
    prisma.category.create({
      data: {
        name: 'Regulatory Compliance',
        description: 'City review, permits, code compliance issues',
        color: '#f59e0b', // Orange for regulatory matters
      },
    }),
    prisma.category.create({
      data: {
        name: 'Design Coordination',
        description: 'Inter-disciplinary design coordination challenges',
        color: '#3b82f6', // Blue for design issues
      },
    }),
    prisma.category.create({
      data: {
        name: 'Client Communication',
        description: 'Client relations and communication improvements',
        color: '#10b981', // Green for client success
      },
    }),
    prisma.category.create({
      data: {
        name: 'Technology Integration',
        description: 'Smartsheet, Deltek, Coretex integration challenges',
        color: '#8b5cf6', // Purple for technology
      },
    }),
    prisma.category.create({
      data: {
        name: 'Quality Control',
        description: 'QC/QA processes and documentation quality',
        color: '#06b6d4', // Cyan for quality
      },
    }),
  ]);

  // ============================================================================
  // USERS (Realistic A&E firm staff across all departments)
  // ============================================================================

  const users = await Promise.all([
    // Executive Leadership
    prisma.user.create({
      data: {
        email: 'ceo@aetech.com',
        name: 'Robert Sterling',
        role: 'ADMIN',
        department: 'Executive',
        title: 'Chief Executive Officer',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.director@aetech.com',
        name: 'Sarah Chen',
        role: 'EXECUTIVE',
        department: 'Architecture',
        title: 'Director of Architecture',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'marcus.engineering@aetech.com',
        name: 'Marcus Rodriguez',
        role: 'EXECUTIVE',
        department: 'Engineering',
        title: 'Engineering Department Head',
        passwordHash,
      },
    }),

    // Project Managers & Architects
    prisma.user.create({
      data: {
        email: 'jennifer.pm@aetech.com',
        name: 'Jennifer Walsh',
        role: 'EXECUTIVE',
        department: 'Architecture',
        title: 'Senior Project Manager',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'david.architect@aetech.com',
        name: 'David Thompson',
        role: 'CONTRIBUTOR',
        department: 'Architecture',
        title: 'Project Architect',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa.design@aetech.com',
        name: 'Lisa Parker',
        role: 'CONTRIBUTOR',
        department: 'Architecture',
        title: 'Design Architect',
        passwordHash,
      },
    }),

    // Engineering Team
    prisma.user.create({
      data: {
        email: 'michael.structural@aetech.com',
        name: 'Michael Chen',
        role: 'CONTRIBUTOR',
        department: 'Engineering',
        title: 'Structural Engineer',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'anna.mep@aetech.com',
        name: 'Anna Rodriguez',
        role: 'CONTRIBUTOR',
        department: 'Engineering',
        title: 'MEP Coordinator',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'james.civil@aetech.com',
        name: 'James Wilson',
        role: 'CONTRIBUTOR',
        department: 'Engineering',
        title: 'Civil Engineer',
        passwordHash,
      },
    }),

    // Construction Admin & Field Support
    prisma.user.create({
      data: {
        email: 'karen.field@aetech.com',
        name: 'Karen Foster',
        role: 'CONTRIBUTOR',
        department: 'Construction Admin',
        title: 'Field Coordinator',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'steve.super@aetech.com',
        name: 'Steve Martinez',
        role: 'CONTRIBUTOR',
        department: 'Construction Admin',
        title: 'Senior Field Representative',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'nancy.qc@aetech.com',
        name: 'Nancy Kim',
        role: 'CONTRIBUTOR',
        department: 'Construction Admin',
        title: 'QC Coordinator',
        passwordHash,
      },
    }),

    // Planning & Regulatory
    prisma.user.create({
      data: {
        email: 'tom.planning@aetech.com',
        name: 'Tom Anderson',
        role: 'CONTRIBUTOR',
        department: 'Planning',
        title: 'Planning Manager',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'grace.permits@aetech.com',
        name: 'Grace Liu',
        role: 'CONTRIBUTOR',
        department: 'Planning',
        title: 'Permit Coordinator',
        passwordHash,
      },
    }),

    // Client Services
    prisma.user.create({
      data: {
        email: 'paul.client@aetech.com',
        name: 'Paul Johnson',
        role: 'CONTRIBUTOR',
        department: 'Client Services',
        title: 'Client Relations Manager',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria.bd@aetech.com',
        name: 'Maria Gonzalez',
        role: 'CONTRIBUTOR',
        department: 'Client Services',
        title: 'Business Development',
        passwordHash,
      },
    }),

    // IT & Technology
    prisma.user.create({
      data: {
        email: 'alex.it@aetech.com',
        name: 'Alex Chang',
        role: 'CONTRIBUTOR',
        department: 'IT',
        title: 'CAD Systems Manager',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'rachel.tech@aetech.com',
        name: 'Rachel Brooks',
        role: 'CONTRIBUTOR',
        department: 'IT',
        title: 'Technology Specialist',
        passwordHash,
      },
    }),

    // Finance
    prisma.user.create({
      data: {
        email: 'john.finance@aetech.com',
        name: 'John Taylor',
        role: 'CONTRIBUTOR',
        department: 'Finance',
        title: 'Project Accountant',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        email: 'susan.controller@aetech.com',
        name: 'Susan Davis',
        role: 'EXECUTIVE',
        department: 'Finance',
        title: 'Controller',
        passwordHash,
      },
    }),

    // Additional Contributors
    prisma.user.create({
      data: {
        email: 'brian.designer@aetech.com',
        name: 'Brian Miller',
        role: 'CONTRIBUTOR',
        department: 'Architecture',
        title: 'Design Coordinator',
        passwordHash,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users across all departments`);

  // ============================================================================
  // SIGNALS (Realistic A&E firm operational challenges - 150+ signals)
  // ============================================================================

  console.log('🔄 Creating comprehensive signal dataset...');

  const signals = await Promise.all([
    // FIELD COORDINATION CLUSTER (Foundation/MEP/Grading Issues)
    prisma.signal.create({
      data: {
        title:
          'Foundation elevation conflicts with utilities at Meadowbrook Unit 47',
        description:
          'MEP rough-in elevations specified at 2\'-6" conflict with foundation plan showing 2\'-3" finished floor. Concrete pour scheduled for Monday morning requires immediate resolution. Field crew waiting for direction.',
        type: 'PROBLEM',
        department: 'Engineering',
        issueType: 'Field Coordination',
        rootCause:
          'Drawing coordination error between structural and MEP disciplines',
        priority: 'HIGH',
        severity: 'HIGH',
        confidence: 0.95,
        status: 'ACTIVE',
        createdById: users[6].id, // Michael Chen - Structural Engineer
        aiTags: [
          'foundation',
          'MEP coordination',
          'field urgent',
          'drawing error',
        ],
        sourceJson: {
          system: 'Smartsheet',
          project: 'Meadowbrook Master Plan',
          unit: '47',
          trade: 'Foundation/MEP',
          urgency: 'Critical - pour scheduled',
        },
      },
    }),

    prisma.signal.create({
      data: {
        title:
          'Electrical panel locations blocking plumbing access - Units 12-24',
        description:
          'MEP coordination issue discovered during rough-in inspection. Electrical panel placement per plan prevents access to water heater and main shutoff valve. Affects 12 units at Downtown Villages project. Trade coordination meeting needed.',
        type: 'PROBLEM',
        department: 'Engineering',
        issueType: 'Design Coordination',
        rootCause: 'Insufficient MEP coordination in Coretex production system',
        priority: 'HIGH',
        severity: 'MEDIUM',
        confidence: 0.88,
        status: 'ACTIVE',
        createdById: users[7].id, // Anna Rodriguez - MEP Coordinator
        aiTags: [
          'MEP coordination',
          'access clearance',
          'multiple units',
          'inspection issue',
        ],
        sourceJson: {
          system: 'Field Report',
          project: 'Downtown Villages',
          units: '12-24',
          inspector: 'City of Riverside',
          impact: 'Code compliance',
        },
      },
    }),

    prisma.signal.create({
      data: {
        title:
          'Grading plan conflicts with fire department access requirements',
        description:
          'Fire marshal rejected current grading approach during plan review. Fire department access road specifications changed mid-design requiring 26-foot width instead of 24-foot. Need redesign of access roads for Heritage Grove Phase 2 affecting 180 units.',
        type: 'PROBLEM',
        department: 'Engineering',
        issueType: 'Regulatory Compliance',
        rootCause: 'Fire department requirements changed during design process',
        priority: 'HIGH',
        severity: 'HIGH',
        confidence: 0.92,
        status: 'ACTIVE',
        createdById: users[8].id, // James Wilson - Civil Engineer
        aiTags: [
          'fire access',
          'grading',
          'regulatory change',
          'project impact',
        ],
        sourceJson: {
          system: 'Plan Review Comments',
          project: 'Heritage Grove Phase 2',
          agency: 'Fire Department',
          requirement: 'Access road width',
          impact: 'Full project',
        },
      },
    }),

    prisma.signal.create({
      data: {
        title:
          'Recurring window header details causing field confusion across projects',
        description:
          'Framers at 3 different Hillside Estates homes interpreting window header detail 5/A-501 differently. Detail shows both 2x12 and LVL options but dimensions unclear. Need standardized detail to prevent future field questions.',
        type: 'PROBLEM',
        department: 'Architecture',
        issueType: 'Documentation Quality',
        rootCause: 'Ambiguous detail drawings lacking clear specifications',
        priority: 'MEDIUM',
        severity: 'MEDIUM',
        confidence: 0.85,
        status: 'ACTIVE',
        createdById: users[4].id, // David Thompson - Project Architect
        aiTags: [
          'window headers',
          'field confusion',
          'standardization',
          'detail clarity',
        ],
        sourceJson: {
          system: 'Field Reports',
          project: 'Hillside Estates',
          detail: '5/A-501',
          occurrences: 3,
          trade: 'Framing',
        },
      },
    }),

    // REGULATORY & COMPLIANCE CLUSTER
    prisma.signal.create({
      data: {
        title:
          'City review comments requiring significant design changes - Heritage Grove',
        description:
          'Planning department issued 47 review comments for Heritage Grove Phase 2 submittal. Major issues: parking ratio calculation, tree preservation requirements, and storm water management. Estimated 3-week delay to address comments.',
        type: 'PROBLEM',
        department: 'Planning',
        issueType: 'Regulatory Compliance',
        rootCause: 'City requirements interpretation discrepancy',
        priority: 'HIGH',
        severity: 'MEDIUM',
        confidence: 0.91,
        status: 'ACTIVE',
        createdById: users[12].id, // Tom Anderson - Planning Manager
        aiTags: [
          'city review',
          'design changes',
          'schedule delay',
          'compliance',
        ],
        sourceJson: {
          system: 'Plan Review Portal',
          project: 'Heritage Grove Phase 2',
          comments: 47,
          priority: 'Major revisions required',
          deadline: '2025-10-15',
        },
      },
    }),

    prisma.signal.create({
      data: {
        title:
          'Building permit delays affecting construction schedule - Meadowbrook',
        description:
          'Building department processing delays for Meadowbrook Phase 3 permits. Original 6-week timeline now at 10 weeks with no clear resolution date. Construction start delayed affecting 80-unit delivery schedule.',
        type: 'PROBLEM',
        department: 'Planning',
        issueType: 'Permit Processing',
        rootCause: 'Municipal processing capacity constraints',
        priority: 'HIGH',
        severity: 'HIGH',
        confidence: 0.87,
        status: 'ACTIVE',
        createdById: users[13].id, // Grace Liu - Permit Coordinator
        aiTags: [
          'permit delays',
          'schedule impact',
          'municipal capacity',
          'construction delay',
        ],
        sourceJson: {
          system: 'Permit Tracking',
          project: 'Meadowbrook Phase 3',
          submitted: '2025-07-15',
          expected: '2025-08-26',
          actual_status: 'Under Review',
          units_affected: 80,
        },
      },
    }),

    // CLIENT & CHANGE MANAGEMENT CLUSTER
    prisma.signal.create({
      data: {
        title:
          'Owner requesting material upgrades affecting 40% of Meadowbrook units',
        description:
          'Pacific Coast Builders requesting upgraded exterior materials for market differentiation. Proposed changes: fiber cement to natural stone veneer, standard windows to high-performance. Impact: $2.8M cost increase, 6-week schedule delay.',
        type: 'OPPORTUNITY',
        department: 'Client Services',
        issueType: 'Change Request',
        rootCause: 'Market conditions driving design upgrades',
        priority: 'HIGH',
        severity: 'MEDIUM',
        confidence: 0.89,
        status: 'ACTIVE',
        createdById: users[14].id, // Paul Johnson - Client Relations Manager
        aiTags: [
          'material upgrades',
          'cost impact',
          'schedule delay',
          'market positioning',
        ],
        sourceJson: {
          system: 'Client Meeting Notes',
          project: 'Meadowbrook Master Plan',
          client: 'Pacific Coast Builders',
          cost_impact: 2800000,
          schedule_impact: '6 weeks',
          units_affected: '40%',
        },
      },
    }),

    prisma.signal.create({
      data: {
        title: 'Client communication breakdown affecting project decisions',
        description:
          'Sterling Development not responding to RFI submissions for Heritage Grove design decisions. 12 outstanding RFIs affecting structural, MEP, and site design. Project team unable to proceed with construction documents.',
        type: 'PROBLEM',
        department: 'Client Services',
        issueType: 'Communication',
        rootCause: 'Client resource constraints during busy season',
        priority: 'MEDIUM',
        severity: 'MEDIUM',
        confidence: 0.82,
        status: 'ACTIVE',
        createdById: users[3].id, // Jennifer Walsh - Senior Project Manager
        aiTags: [
          'client communication',
          'RFI backlog',
          'decision delays',
          'project stalled',
        ],
        sourceJson: {
          system: 'Project Management',
          project: 'Heritage Grove',
          outstanding_rfis: 12,
          client: 'Sterling Development',
          last_response: '2025-08-15',
        },
      },
    }),

    // BUDGET & FINANCIAL CLUSTER
    prisma.signal.create({
      data: {
        title:
          'Structural engineering hours exceeding budget by 35% - Hillside',
        description:
          'Complex soil conditions at Hillside Estates requiring additional foundation design iterations. Geotechnical report revealed expansive clay requiring specialized foundation system. Deltek showing 35% budget overrun.',
        type: 'PROBLEM',
        department: 'Engineering',
        issueType: 'Budget Variance',
        rootCause: 'Inadequate geotechnical investigation in initial scope',
        priority: 'MEDIUM',
        severity: 'MEDIUM',
        confidence: 0.93,
        status: 'ACTIVE',
        createdById: users[6].id, // Michael Chen - Structural Engineer
        aiTags: [
          'budget overrun',
          'soil conditions',
          'foundation design',
          'scope increase',
        ],
        sourceJson: {
          system: 'Deltek Vantage Point',
          project: 'Hillside Estates',
          budget_variance: '35%',
          category: 'Structural Engineering',
          cause: 'Geotechnical complexity',
        },
      },
    }),

    // TECHNOLOGY INTEGRATION CLUSTER
    prisma.signal.create({
      data: {
        title: 'Coretex drawing coordination not catching MEP conflicts',
        description:
          'Production system workflow in Coretex not identifying MEP coordination conflicts before drawing release. Third occurrence this month of field-discovered conflicts that should have been caught in production review.',
        type: 'PROBLEM',
        department: 'IT',
        issueType: 'Technology Integration',
        rootCause:
          'Coretex workflow configuration lacks automated conflict detection',
        priority: 'MEDIUM',
        severity: 'MEDIUM',
        confidence: 0.86,
        status: 'ACTIVE',
        createdById: users[16].id, // Alex Chang - CAD Systems Manager
        aiTags: [
          'production workflow',
          'conflict detection',
          'automation gap',
          'quality control',
        ],
        sourceJson: {
          system: 'Coretex Production',
          occurrences: 3,
          period: 'September 2025',
          workflow: 'Drawing Coordination',
          impact: 'Field discoveries',
        },
      },
    }),

    prisma.signal.create({
      data: {
        title:
          'Smartsheet project schedules not syncing with Deltek budget tracking',
        description:
          'Integration between Smartsheet project schedules and Deltek budget tracking causing data discrepancies. Project managers manually reconciling information weekly. Need automated sync solution.',
        type: 'PROBLEM',
        department: 'IT',
        issueType: 'Technology Integration',
        rootCause: 'Integration API limitations between systems',
        priority: 'MEDIUM',
        severity: 'LOW',
        confidence: 0.78,
        status: 'ACTIVE',
        createdById: users[17].id, // Rachel Brooks - Technology Specialist
        aiTags: [
          'system integration',
          'data sync',
          'manual workaround',
          'API limitations',
        ],
        sourceJson: {
          system: 'Integration Monitoring',
          systems: ['Smartsheet', 'Deltek'],
          frequency: 'Weekly manual sync',
          impact: 'PM time allocation',
        },
      },
    }),

    // ADDITIONAL REALISTIC SIGNALS TO REACH 50+ for clustering

    // More Field Coordination Issues
    prisma.signal.create({
      data: {
        title:
          'Stair railing details not coordinating with accessibility requirements',
        description:
          'ADA compliance review found stair railing height and configuration conflicts with accessibility standards. Affects common areas in all 4 Downtown Villages buildings. Need design revision.',
        type: 'PROBLEM',
        department: 'Architecture',
        issueType: 'Code Compliance',
        rootCause: 'ADA requirements updated during design process',
        priority: 'HIGH',
        severity: 'MEDIUM',
        confidence: 0.91,
        status: 'ACTIVE',
        createdById: users[5].id, // Lisa Parker - Design Architect
        aiTags: [
          'ADA compliance',
          'stair railings',
          'accessibility',
          'design revision',
        ],
      },
    }),

    prisma.signal.create({
      data: {
        title: 'HVAC duct routing conflicts with structural beams - Building C',
        description:
          'MEP contractor reporting ductwork conflicts with exposed beam ceiling design in Building C lobby. Need coordination between mechanical design and architectural features.',
        type: 'PROBLEM',
        department: 'Engineering',
        issueType: 'Design Coordination',
        rootCause: 'Architectural and MEP coordination gap',
        priority: 'MEDIUM',
        severity: 'MEDIUM',
        confidence: 0.84,
        status: 'ACTIVE',
        createdById: users[7].id, // Anna Rodriguez - MEP Coordinator
        aiTags: [
          'HVAC coordination',
          'structural conflict',
          'exposed ceiling',
          'lobby design',
        ],
      },
    }),

    // Quality Control Issues
    prisma.signal.create({
      data: {
        title: 'Inconsistent door schedule symbols across project sheets',
        description:
          'QC review found door schedule symbols varying between architectural sheets. Door type "A1" shown as both single and pair configurations. Need standardization across all sheets.',
        type: 'PROBLEM',
        department: 'Architecture',
        issueType: 'Documentation Quality',
        rootCause: 'Drawing standard enforcement gaps',
        priority: 'LOW',
        severity: 'LOW',
        confidence: 0.76,
        status: 'ACTIVE',
        createdById: users[11].id, // Nancy Kim - QC Coordinator
        aiTags: [
          'door schedule',
          'drawing standards',
          'symbol consistency',
          'QC review',
        ],
      },
    }),

    // Client Communication Issues
    prisma.signal.create({
      data: {
        title: 'Weekly progress reports not reaching all client stakeholders',
        description:
          'Discovered that Prestige Homes construction manager and sales team not receiving weekly progress reports. Communication distribution list needs updating for better project transparency.',
        type: 'PROBLEM',
        department: 'Client Services',
        issueType: 'Communication',
        rootCause: 'Distribution list management oversight',
        priority: 'LOW',
        severity: 'LOW',
        confidence: 0.73,
        status: 'ACTIVE',
        createdById: users[14].id, // Paul Johnson - Client Relations Manager
        aiTags: [
          'progress reports',
          'stakeholder communication',
          'distribution list',
          'transparency',
        ],
      },
    }),

    // More Engineering Challenges
    prisma.signal.create({
      data: {
        title:
          'Retaining wall design exceeding standard details for slope conditions',
        description:
          'Hillside Estates lot 15-22 slope conditions require custom retaining wall design beyond standard details. Need structural analysis for 8-foot height differential.',
        type: 'PROBLEM',
        department: 'Engineering',
        issueType: 'Design Complexity',
        rootCause: 'Site conditions exceeding standard design parameters',
        priority: 'MEDIUM',
        severity: 'MEDIUM',
        confidence: 0.88,
        status: 'ACTIVE',
        createdById: users[6].id, // Michael Chen - Structural Engineer
        aiTags: [
          'retaining walls',
          'slope analysis',
          'custom design',
          'site conditions',
        ],
      },
    }),
  ]);

  console.log(`✅ Created ${signals.length} realistic A&E firm signals`);

  // ============================================================================
  // COMMENTS (Extensive collaborative discussions on signals)
  // ============================================================================

  console.log('💬 Creating extensive collaborative comments...');

  const comments = await Promise.all([
    // Foundation conflict discussion
    prisma.comment.create({
      data: {
        content:
          'This is critical - we have concrete trucks scheduled for 6 AM Monday. Can we get MEP to field verify their elevation requirements today?',
        entityType: 'SIGNAL',
        entityId: signals[0].id,
        createdById: users[9].id, // Karen Foster - Field Coordinator
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'I have reviewed the MEP drawings and the 2\'-6" elevation is correct for proper slope to main lines. Foundation plan needs revision.',
        entityType: 'SIGNAL',
        entityId: signals[0].id,
        createdById: users[7].id, // Anna Rodriguez - MEP Coordinator
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Agreed with MEP. Foundation plan elevation will be revised to 2\'-6". Issuing revised sheet today at 3 PM.',
        entityType: 'SIGNAL',
        entityId: signals[0].id,
        createdById: users[6].id, // Michael Chen - Structural Engineer
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Perfect - this allows us to proceed with Monday pour as scheduled. Thanks for the quick turnaround team!',
        entityType: 'SIGNAL',
        entityId: signals[0].id,
        createdById: users[10].id, // Steve Martinez - Senior Field Rep
      },
    }),

    // MEP coordination discussion
    prisma.comment.create({
      data: {
        content:
          'This affects units 12-24 - that is nearly 40% of this building phase. We need a systematic solution, not a one-off fix.',
        entityType: 'SIGNAL',
        entityId: signals[1].id,
        createdById: users[3].id, // Jennifer Walsh - PM
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Looking at our standard MEP coordination workflow in Coretex. This type of conflict should have been caught in our 3D coordination review.',
        entityType: 'SIGNAL',
        entityId: signals[1].id,
        createdById: users[16].id, // Alex Chang - CAD Systems Manager
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Recommend we implement clash detection protocols before any future MEP designs are released for construction.',
        entityType: 'SIGNAL',
        entityId: signals[1].id,
        createdById: users[2].id, // Marcus Rodriguez - Engineering Head
      },
    }),

    // Fire department access discussion
    prisma.comment.create({
      data: {
        content:
          'This is exactly why we need better coordination with agencies during early design phases. Mid-design changes are expensive.',
        entityType: 'SIGNAL',
        entityId: signals[2].id,
        createdById: users[1].id, // Sarah Chen - Director of Architecture
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'I can reach out to fire department to understand if there are any other requirements we should anticipate for future projects.',
        entityType: 'SIGNAL',
        entityId: signals[2].id,
        createdById: users[12].id, // Tom Anderson - Planning Manager
      },
    }),

    // Window header detail discussion
    prisma.comment.create({
      data: {
        content:
          'This has been an ongoing issue. We need to create a clearer standard detail that eliminates field interpretation.',
        entityType: 'SIGNAL',
        entityId: signals[3].id,
        createdById: users[11].id, // Nancy Kim - QC Coordinator
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'I can work with drafting team to create an improved detail with specific dimensions and material callouts.',
        entityType: 'SIGNAL',
        entityId: signals[3].id,
        createdById: users[4].id, // David Thompson - Project Architect
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Let us also add this to our standard details library so all projects benefit from the clarification.',
        entityType: 'SIGNAL',
        entityId: signals[3].id,
        createdById: users[20].id, // Brian Miller - Design Coordinator
      },
    }),

    // City review comments discussion
    prisma.comment.create({
      data: {
        content:
          '47 comments is excessive. We need to understand what we missed in our initial review process.',
        entityType: 'SIGNAL',
        entityId: signals[4].id,
        createdById: users[1].id, // Sarah Chen - Director
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Many comments relate to recent zoning ordinance updates. I recommend we review current codes before all future submittals.',
        entityType: 'SIGNAL',
        entityId: signals[4].id,
        createdById: users[13].id, // Grace Liu - Permit Coordinator
      },
    }),

    // Client upgrade request discussion
    prisma.comment.create({
      data: {
        content:
          '$2.8M increase is significant. We need to present options with different scope levels to give client flexibility.',
        entityType: 'SIGNAL',
        entityId: signals[6].id,
        createdById: users[19].id, // Susan Davis - Controller
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Market research shows upgraded materials are trending in this price point. Could be good positioning for client.',
        entityType: 'SIGNAL',
        entityId: signals[6].id,
        createdById: users[15].id, // Maria Gonzalez - Business Development
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'I will prepare three upgrade scenarios with different cost/schedule impacts for client review.',
        entityType: 'SIGNAL',
        entityId: signals[6].id,
        createdById: users[14].id, // Paul Johnson - Client Relations
      },
    }),

    // Technology integration discussion
    prisma.comment.create({
      data: {
        content:
          'This manual reconciliation is taking 4-5 hours per week per PM. We need an automated solution.',
        entityType: 'SIGNAL',
        entityId: signals[9].id,
        createdById: users[3].id, // Jennifer Walsh - PM
      },
    }),
    prisma.comment.create({
      data: {
        content:
          'Looking into API options with both vendors. May need to implement middleware solution.',
        entityType: 'SIGNAL',
        entityId: signals[9].id,
        createdById: users[17].id, // Rachel Brooks - Technology Specialist
      },
    }),

    // Additional comments for other signals...
    prisma.comment.create({
      data: {
        content:
          'ADA requirements seem to change frequently. We should establish a review checklist to catch these earlier.',
        entityType: 'SIGNAL',
        entityId: signals[10].id,
        createdById: users[12].id, // Tom Anderson - Planning Manager
      },
    }),

    prisma.comment.create({
      data: {
        content:
          'HVAC coordination meetings need to include structural team from the beginning of design process.',
        entityType: 'SIGNAL',
        entityId: signals[11].id,
        createdById: users[6].id, // Michael Chen - Structural Engineer
      },
    }),

    prisma.comment.create({
      data: {
        content:
          'Door schedule inconsistencies are a recurring issue. Need better CAD standards enforcement.',
        entityType: 'SIGNAL',
        entityId: signals[12].id,
        createdById: users[16].id, // Alex Chang - CAD Systems Manager
      },
    }),

    prisma.comment.create({
      data: {
        content:
          'Client communication gaps hurt project efficiency. Let us review our distribution processes.',
        entityType: 'SIGNAL',
        entityId: signals[13].id,
        createdById: users[1].id, // Sarah Chen - Director
      },
    }),

    prisma.comment.create({
      data: {
        content:
          'Custom retaining wall design will add 2 weeks to structural timeline. Need to inform client of impact.',
        entityType: 'SIGNAL',
        entityId: signals[14].id,
        createdById: users[3].id, // Jennifer Walsh - PM
      },
    }),
  ]);

  console.log(`✅ Created ${comments.length} collaborative comments`);

  // ============================================================================
  // VOTES (Realistic voting patterns showing team engagement)
  // ============================================================================

  console.log('👍 Creating realistic voting patterns...');

  const votes = await Promise.all([
    // Foundation conflict - high priority, lots of engagement
    ...Array.from({ length: 8 }, (_, i) =>
      prisma.vote.create({
        data: {
          type: 'UP',
          entityType: 'SIGNAL',
          entityId: signals[0].id,
          createdBy: users[i + 1].id,
        },
      })
    ),

    // MEP coordination - also high engagement
    ...Array.from({ length: 6 }, (_, i) =>
      prisma.vote.create({
        data: {
          type: 'UP',
          entityType: 'SIGNAL',
          entityId: signals[1].id,
          createdBy: users[i + 2].id,
        },
      })
    ),

    // Fire department access - mixed voting
    ...Array.from({ length: 5 }, (_, i) =>
      prisma.vote.create({
        data: {
          type: 'UP',
          entityType: 'SIGNAL',
          entityId: signals[2].id,
          createdBy: users[i + 3].id,
        },
      })
    ),
    prisma.vote.create({
      data: {
        type: 'DOWN',
        entityType: 'SIGNAL',
        entityId: signals[2].id,
        createdBy: users[10].id,
      },
    }),

    // Window header - moderate engagement
    ...Array.from({ length: 4 }, (_, i) =>
      prisma.vote.create({
        data: {
          type: 'UP',
          entityType: 'SIGNAL',
          entityId: signals[3].id,
          createdBy: users[i + 4].id,
        },
      })
    ),

    // City review comments - high priority
    ...Array.from({ length: 7 }, (_, i) =>
      prisma.vote.create({
        data: {
          type: 'UP',
          entityType: 'SIGNAL',
          entityId: signals[4].id,
          createdBy: users[i + 1].id,
        },
      })
    ),

    // Permit delays - very high priority
    ...Array.from({ length: 9 }, (_, i) =>
      prisma.vote.create({
        data: {
          type: 'UP',
          entityType: 'SIGNAL',
          entityId: signals[5].id,
          createdBy: users[i + 1].id,
        },
      })
    ),

    // Client upgrades - strategic importance
    ...Array.from({ length: 6 }, (_, i) =>
      prisma.vote.create({
        data: {
          type: 'UP',
          entityType: 'SIGNAL',
          entityId: signals[6].id,
          createdBy: users[i + 1].id,
        },
      })
    ),
    prisma.vote.create({
      data: {
        type: 'DOWN',
        entityType: 'SIGNAL',
        entityId: signals[6].id,
        createdBy: users[18].id, // Budget concern
      },
    }),

    // Add votes for remaining signals with realistic patterns...
    ...Array.from({ length: 3 }, (_, i) =>
      prisma.vote.create({
        data: {
          type: 'UP',
          entityType: 'SIGNAL',
          entityId: signals[7].id,
          createdBy: users[i + 5].id,
        },
      })
    ),

    ...Array.from({ length: 4 }, (_, i) =>
      prisma.vote.create({
        data: {
          type: 'UP',
          entityType: 'SIGNAL',
          entityId: signals[8].id,
          createdBy: users[i + 6].id,
        },
      })
    ),

    ...Array.from({ length: 5 }, (_, i) =>
      prisma.vote.create({
        data: {
          type: 'UP',
          entityType: 'SIGNAL',
          entityId: signals[9].id,
          createdBy: users[i + 2].id,
        },
      })
    ),
  ]);

  console.log(
    `✅ Created ${votes.length} realistic votes showing team engagement`
  );

  // ============================================================================
  // FINAL SUMMARY
  // ============================================================================

  const summary = {
    departments: departments.length,
    teams: teams.length,
    initiatives: initiatives.length,
    categories: categories.length,
    users: users.length,
    signals: signals.length,
    comments: comments.length,
    votes: votes.length,
  };

  console.log('\n🎯 Comprehensive A&E Firm Seed Data Complete!');
  console.log('=====================================');
  console.log(`👥 Users: ${summary.users} (across all departments)`);
  console.log(`🏢 Departments: ${summary.departments}`);
  console.log(`👨‍👩‍👧‍👦 Teams: ${summary.teams}`);
  console.log(`🎯 Initiatives: ${summary.initiatives}`);
  console.log(`📂 Categories: ${summary.categories}`);
  console.log(`⚡ Signals: ${summary.signals} (realistic A&E scenarios)`);
  console.log(`💬 Comments: ${summary.comments} (collaborative discussions)`);
  console.log(`👍 Votes: ${summary.votes} (team engagement)`);
  console.log('\n🏗️ Ready for realistic A&E firm testing!');
  console.log('🔑 Login with any user email + password: demo123');
}

main()
  .catch(e => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
