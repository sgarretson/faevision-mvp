# Comprehensive Workflow Seeding Strategy

## FAEVision MVP - Complete Test Data Plan

**Version**: 1.0  
**Date**: September 18, 2025  
**Lead**: Morgan Smith (Database Architect)  
**Support**: Dr. Priya Patel (AI Architect), Sarah Chen (Product Manager)

---

## 🎯 Seeding Objectives

### Primary Goals

1. **Fix AI Clustering**: Provide properly tagged signals for accurate clustering
2. **Test Complete Workflow**: End-to-end validation from signals to requirements
3. **Executive Validation**: Realistic scenarios for 150-person A&E firm
4. **Performance Testing**: Sufficient data volume for performance validation

### Success Criteria

- **3-5 distinct hotspots** from AI clustering (not single cluster)
- **5 complete ideas** generated from hotspots
- **2 full solutions** with business planning and task breakdown
- **Complete metadata coverage** (departments, teams, root causes, issue types)
- **>80% confidence** in AI tagging across all signals

---

## 📊 Data Architecture Strategy

### Stage 1: Clean Database Foundation

```sql
-- Reset Preview Database
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Re-run migrations
npx prisma migrate deploy
```

### Stage 2: Core Organizational Data

```typescript
// Departments (A&E Firm Structure)
const departments = [
  { name: 'Architecture', description: 'Building design and planning' },
  {
    name: 'Structural Engineering',
    description: 'Structural design and analysis',
  },
  { name: 'MEP Engineering', description: 'Mechanical, Electrical, Plumbing' },
  {
    name: 'Project Management',
    description: 'Project coordination and delivery',
  },
  { name: 'Quality Control', description: 'QC and quality assurance' },
  { name: 'Business Development', description: 'Client relations and sales' },
  { name: 'Field Services', description: 'Construction support and oversight' },
];

// Teams (Cross-functional groups)
const teams = [
  { name: 'Residential Design Team', departmentId: 'architecture' },
  { name: 'Commercial Projects', departmentId: 'architecture' },
  { name: 'Structural Analysis', departmentId: 'structural' },
  { name: 'MEP Systems', departmentId: 'mep' },
  { name: 'Project Delivery', departmentId: 'pm' },
  { name: 'Field Support', departmentId: 'field' },
];
```

### Stage 3: Enhanced Strategic Inputs (50 Signals)

#### **Cluster 1: Communication & Coordination Issues (15 signals)**

**Root Causes**: Communication, Process  
**Departments**: Project Management, Field Services, Architecture

```typescript
const communicationSignals = [
  {
    title: 'Field team not receiving updated drawings',
    description:
      'Construction crew working from outdated architectural drawings, causing rework and delays. Third incident this month.',
    severity: 'HIGH',
    departmentId: 'field-services',
    teamId: 'field-support',
    enhancedTagsJson: {
      rootCauses: ['Communication', 'Process'],
      issueTypes: ['Documentation', 'Field Coordination'],
      businessImpact: ['Schedule Delay', 'Rework Cost'],
      departments: ['Field Services', 'Architecture'],
      confidence: 0.92,
    },
  },
  {
    title: 'Client approval delays causing project bottlenecks',
    description:
      'Residential client taking 2+ weeks to approve design changes, impacting critical path and team availability.',
    severity: 'MEDIUM',
    departmentId: 'project-management',
    teamId: 'project-delivery',
    enhancedTagsJson: {
      rootCauses: ['Communication', 'Client Process'],
      issueTypes: ['Approval Workflow', 'Schedule Management'],
      businessImpact: ['Schedule Delay', 'Resource Utilization'],
      departments: ['Project Management', 'Business Development'],
      confidence: 0.88,
    },
  },
  // ... 13 more communication-related signals
];
```

#### **Cluster 2: Quality Control & Technical Issues (15 signals)**

**Root Causes**: Technology, Training, Process  
**Departments**: Quality Control, MEP Engineering, Structural Engineering

```typescript
const qualitySignals = [
  {
    title: 'CAD software crashes during large model operations',
    description:
      'AutoCAD freezing when working with complex 3D models, causing work loss and deadline pressure. IT says hardware is adequate.',
    severity: 'HIGH',
    departmentId: 'architecture',
    teamId: 'residential-design',
    enhancedTagsJson: {
      rootCauses: ['Technology', 'Infrastructure'],
      issueTypes: ['Software Performance', 'Productivity'],
      businessImpact: ['Work Loss', 'Deadline Risk'],
      departments: ['Architecture', 'IT Support'],
      confidence: 0.95,
    },
  },
  {
    title: 'Structural calculations requiring multiple revisions',
    description:
      "New engineer's calculations consistently require 2-3 revision cycles, impacting project timelines and senior engineer availability.",
    severity: 'MEDIUM',
    departmentId: 'structural-engineering',
    teamId: 'structural-analysis',
    enhancedTagsJson: {
      rootCauses: ['Training', 'Process'],
      issueTypes: ['Quality Assurance', 'Knowledge Transfer'],
      businessImpact: ['Schedule Delay', 'Resource Burden'],
      departments: ['Structural Engineering', 'Quality Control'],
      confidence: 0.91,
    },
  },
  // ... 13 more quality-related signals
];
```

#### **Cluster 3: Resource & Workload Management (10 signals)**

**Root Causes**: Resource Allocation, Process, Management  
**Departments**: Project Management, Business Development

```typescript
const resourceSignals = [
  {
    title: 'Senior architects overloaded, junior staff underutilized',
    description:
      'Senior architects working 60+ hour weeks while junior staff waiting for assignments. Project delivery suffering.',
    severity: 'CRITICAL',
    departmentId: 'architecture',
    teamId: 'residential-design',
    enhancedTagsJson: {
      rootCauses: ['Resource Allocation', 'Management Process'],
      issueTypes: ['Workload Distribution', 'Staff Development'],
      businessImpact: ['Burnout Risk', 'Project Delay', 'Cost Overrun'],
      departments: ['Architecture', 'Project Management'],
      confidence: 0.94,
    },
  },
  // ... 9 more resource-related signals
];
```

#### **Cluster 4: Client Relations & Business Process (10 signals)**

**Root Causes**: Communication, Process, Client Management  
**Departments**: Business Development, Project Management

```typescript
const clientSignals = [
  {
    title: 'Scope creep on residential projects without change orders',
    description:
      'Clients requesting additional features without formal change orders, causing budget overruns and team frustration.',
    severity: 'HIGH',
    departmentId: 'business-development',
    teamId: 'client-relations',
    enhancedTagsJson: {
      rootCauses: ['Process', 'Communication', 'Contract Management'],
      issueTypes: ['Scope Management', 'Change Control'],
      businessImpact: ['Budget Overrun', 'Profit Margin'],
      departments: ['Business Development', 'Project Management'],
      confidence: 0.89,
    },
  },
  // ... 9 more client-related signals
];
```

---

## 🔄 Complete Workflow Implementation

### Stage 4: AI Processing Pipeline

```typescript
// 1. Enhanced Tagging for All Signals
POST /api/signals/batch-tag-generation
{
  signalIds: [...all50SignalIds],
  forceReprocess: true
}

// 2. Feature Generation for Clustering
POST /api/signals/batch-feature-generation
{
  signalIds: [...all50SignalIds]
}

// 3. Execute Clustering
POST /api/signals/clustering/generate
{
  minClusterSize: 3,
  algorithm: "hybrid"
}
```

### Stage 5: Hotspot-to-Idea Pipeline (5 Ideas)

```typescript
// Create 5 distinct ideas from the 4 hotspots
const ideas = [
  {
    title: 'Implement Real-Time Drawing Distribution System',
    description:
      'Digital system to ensure field teams always have current drawings',
    hotspotId: 'communication-cluster',
    origin: 'ai',
    evidenceJson: {
      supportingSignals: [...communicationSignalIds],
      businessCase: 'Reduce rework costs by 40%',
      impactAssessment: 'High cost savings, medium implementation effort',
    },
  },
  {
    title: 'CAD Performance Optimization Initiative',
    description:
      'Upgrade hardware and optimize software for complex 3D modeling',
    hotspotId: 'quality-cluster',
    origin: 'ai',
    evidenceJson: {
      supportingSignals: [...qualitySignalIds],
      businessCase: 'Increase productivity by 25%',
      impactAssessment: 'High ROI, one-time investment',
    },
  },
  // ... 3 more ideas
];
```

### Stage 6: Solution Implementation (2 Complete Solutions)

```typescript
// Solution 1: High-impact, well-defined
{
  title: "Digital Drawing Distribution & Version Control",
  ideaId: "drawing-distribution-idea",
  status: "PLANNING",
  expectedImpactJson: {
    businessPlan: {
      problemStatement: "Field teams working from outdated drawings causing $50K+ monthly rework",
      proposedSolution: "Cloud-based real-time drawing distribution with version control",
      successMetrics: ["40% reduction in rework incidents", "20% faster project delivery"]
    },
    riskAssessment: {
      technicalRisks: ["Integration with existing CAD systems"],
      businessRisks: ["User adoption in field environment"],
      mitigationPlans: ["Pilot program with one project team"]
    },
    resourcePlanning: {
      estimatedCost: "$25,000",
      timeline: "8 weeks",
      requiredSkills: ["Cloud infrastructure", "CAD integration", "Mobile development"]
    }
  },
  tasks: {
    items: [
      {
        id: "task-1",
        title: "Evaluate cloud storage solutions",
        assigneeId: "it-manager",
        status: "not_started",
        estimatedHours: 16,
        priority: "high"
      },
      {
        id: "task-2",
        title: "Design mobile field interface",
        assigneeId: "ui-developer",
        status: "not_started",
        estimatedHours: 40,
        dependencies: ["task-1"]
      }
    ],
    progress: { overall: 0 }
  }
}

// Solution 2: Complex, multi-departmental
{
  title: "Comprehensive Junior Staff Development Program",
  ideaId: "resource-optimization-idea",
  status: "PLANNING",
  // ... complete business planning and task breakdown
}
```

---

## 🎯 Data Quality Validation

### AI Clustering Validation Criteria

```typescript
// Expected clustering results:
{
  clusters: [
    {
      id: "communication-coordination",
      title: "Communication & Coordination Issues",
      signalCount: 15,
      primaryRootCause: "Communication",
      confidence: 0.85+
    },
    {
      id: "quality-technical",
      title: "Quality Control & Technical Issues",
      signalCount: 15,
      primaryRootCause: "Technology/Training",
      confidence: 0.85+
    },
    {
      id: "resource-workload",
      title: "Resource & Workload Management",
      signalCount: 10,
      primaryRootCause: "Resource Allocation",
      confidence: 0.80+
    },
    {
      id: "client-business",
      title: "Client Relations & Business Process",
      signalCount: 10,
      primaryRootCause: "Process/Communication",
      confidence: 0.80+
    }
  ]
}
```

### Workflow Validation Checklist

- [ ] **50 signals** properly tagged with >80% confidence
- [ ] **4 distinct hotspots** identified by AI clustering
- [ ] **5 ideas** created from hotspots with complete evidence
- [ ] **2 solutions** with full business planning and task breakdown
- [ ] **Complete metadata** coverage across all entities
- [ ] **End-to-end workflow** functional from signal to requirements

---

## 🚀 Implementation Scripts

### Script 1: Database Reset & Core Data

```bash
# Reset and seed core organizational data
npm run db:reset
npx tsx scripts/seed-organizational-data.ts
```

### Script 2: Strategic Inputs Creation

```bash
# Create 50 properly structured signals
npx tsx scripts/seed-strategic-inputs.ts
```

### Script 3: AI Processing Pipeline

```bash
# Process all signals through AI pipeline
npx tsx scripts/run-complete-ai-processing.ts
```

### Script 4: Workflow Validation

```bash
# Create ideas and solutions for testing
npx tsx scripts/seed-complete-workflow.ts
```

---

## 📊 Expected Results

### Database State After Seeding

- **Users**: 12 (representing different roles and departments)
- **Departments**: 7 (covering A&E firm structure)
- **Teams**: 6 (cross-functional project teams)
- **Signals**: 50 (properly tagged and processed)
- **Hotspots**: 4 (distinct, meaningful clusters)
- **Ideas**: 5 (AI-generated from hotspots)
- **Solutions**: 2 (complete with business planning)
- **Comments**: 25+ (realistic collaboration data)
- **Votes**: 100+ (engagement on signals and ideas)

### Performance Validation

- **Clustering Accuracy**: 4 distinct hotspots (not single cluster)
- **AI Confidence**: >80% average across all signals
- **Workflow Completeness**: End-to-end functional
- **Data Integrity**: All relationships properly linked
- **Executive Experience**: Professional, realistic scenarios

This comprehensive seeding strategy ensures that our AI clustering works correctly, our complete workflow is validated, and executives have realistic data to evaluate the system's capabilities.
