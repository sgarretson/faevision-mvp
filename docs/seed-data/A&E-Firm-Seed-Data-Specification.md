# FAEVision MVP - A&E Firm Comprehensive Seed Data

## 🏗️ Architecture & Engineering Firm Context

**Target**: 50-person MVP representing scaled-down 150-person residential A&E firm  
**Focus**: Large builder partnerships (design, engineering, construction field services)  
**PHQ Standard**: Fully compliant with PHQ Vision Input Standard

---

## 👥 Organizational Structure (50-person MVP)

### **Executive Team (4 people)**

```typescript
{
  name: "Michael Harrison",
  email: "michael.harrison@faevision.com",
  role: "EXECUTIVE",
  department: "Executive",
  title: "CEO/President",
  expertise: "Strategic Leadership, Client Relations"
},
{
  name: "Sarah Mitchell",
  email: "sarah.mitchell@faevision.com",
  role: "EXECUTIVE",
  department: "Design",
  title: "VP Design",
  expertise: "Residential Architecture, Design Standards"
},
{
  name: "David Chen",
  email: "david.chen@faevision.com",
  role: "EXECUTIVE",
  department: "Engineering",
  title: "VP Engineering",
  expertise: "Structural Engineering, Code Compliance"
},
{
  name: "Lisa Rodriguez",
  email: "lisa.rodriguez@faevision.com",
  role: "EXECUTIVE",
  department: "Construction",
  title: "VP Construction Services",
  expertise: "Field Operations, Quality Control"
}
```

### **Design Department (15 people)**

```typescript
// Senior Staff (5)
('Senior Architect - Custom Homes',
  'Senior Architect - Production Homes',
  'Design Coordinator',
  'BIM Manager',
  'Design Standards Manager');

// Project Staff (10)
('Project Architect'(3), 'Architectural Designer'(4), 'CAD Technician'(3));
```

### **Engineering Department (12 people)**

```typescript
// Senior Staff (4)
('Principal Structural Engineer',
  'Senior Civil Engineer',
  'MEP Coordinator',
  'Engineering Manager');

// Project Staff (8)
('Structural Engineer'(3),
  'Civil Engineer'(2),
  'MEP Engineer'(2),
  'Engineering Technician'(1));
```

### **Construction Services (10 people)**

```typescript
// Management (3)
('Construction Manager - Production',
  'Construction Manager - Custom',
  'Quality Control Manager');

// Field Staff (7)
('Field Engineer'(3), 'Construction Coordinator'(2), 'Quality Inspector'(2));
```

### **Administrative (9 people)**

```typescript
// Project Management (4)
('Project Manager - Custom'(2), 'Project Manager - Production'(2));

// Support (5)
('Finance Manager', 'HR Manager', 'IT Manager', 'Admin Coordinator'(2));
```

---

## 🏘️ Project Context (Residential Focus)

### **Client Profiles**

```typescript
// Large Builder Clients
{
  name: "Sunrise Homes",
  type: "Production Builder",
  projects: "Single-family subdivisions, 200-500 units/year",
  focus: "Affordable housing, standardized designs"
},
{
  name: "Premier Custom Builders",
  type: "Custom Builder",
  projects: "High-end custom homes, 50-80 units/year",
  focus: "Luxury residential, unique designs"
},
{
  name: "Valley Development Group",
  type: "Mixed Builder",
  projects: "Townhomes, condos, single-family",
  focus: "Urban infill, mixed-use residential"
}
```

### **Project Types & Phases**

```typescript
// Design Phase Signals
('Zoning approval delays',
  'Design revision requests',
  'Code compliance issues',
  'Client scope changes',
  'Design coordination conflicts');

// Engineering Phase Signals
('Structural calculation errors',
  'Geotechnical report delays',
  'Utility coordination issues',
  'Permit submission problems',
  'Code review feedback');

// Construction Phase Signals
('Foundation issues',
  'Framing inspection failures',
  'Material delivery delays',
  'Subcontractor quality issues',
  'Weather impact delays');
```

---

## 📊 Realistic Signal Categories

### **High-Volume Signals (Weekly)**

```json
{
  "schema_version": "1.0",
  "input_id": "SIG-001",
  "timestamp": "2025-09-16T09:30:00Z",
  "received_at": "2025-09-16T09:31:00Z",
  "source": {
    "type": "app",
    "id": "Procore_SunrisePhase2",
    "system_name": "Procore",
    "details": { "module": "Quality Control" }
  },
  "description": "Framing inspection failed - improper joist spacing in unit 24B",
  "severity": "high",
  "severity_score": 4,
  "process_context": {
    "process_type": "construction_qa",
    "process_id": "PROJ-SH-P2",
    "step_id": "framing_inspection"
  },
  "department": "Construction",
  "team": "Quality Control",
  "metrics": [
    { "name": "rework_hours", "value": 16, "unit": "hours" },
    { "name": "delay_days", "value": 2, "unit": "days" }
  ],
  "baseline_metrics": [
    { "name": "expected_rework", "value": 0, "unit": "hours" }
  ],
  "impact_estimate": { "financial": 2400, "schedule": 2 },
  "related_entities": [
    { "type": "project", "id": "PROJ-SH-P2" },
    { "type": "subcontractor", "id": "SUB-015" },
    { "type": "unit", "id": "24B" }
  ],
  "tags": {
    "category": "quality_issue",
    "trade": "framing",
    "severity_impact": "schedule_financial"
  },
  "privacy_level": "internal"
}
```

### **Medium-Volume Signals (Daily)**

```json
{
  "input_id": "SIG-002",
  "description": "AutoCAD drawing coordination error - plumbing conflicts with HVAC in master bath",
  "severity": "medium",
  "department": "Design",
  "team": "MEP Coordination",
  "process_context": {
    "process_type": "design_coordination",
    "step_id": "clash_detection"
  },
  "related_entities": [
    { "type": "drawing", "id": "DWG-M101" },
    { "type": "project", "id": "PROJ-PC-15" }
  ],
  "tags": {
    "category": "design_conflict",
    "trade": "plumbing_hvac",
    "phase": "design_development"
  }
}
```

### **Low-Volume Signals (Monthly)**

```json
{
  "input_id": "SIG-003",
  "description": "City planning department introduced new stormwater requirements affecting all pending projects",
  "severity": "critical",
  "department": "Engineering",
  "impact_estimate": { "financial": 50000, "projects_affected": 8 },
  "related_entities": [
    { "type": "regulation", "id": "CITY-SW-2025" },
    { "type": "authority", "id": "City Planning" }
  ],
  "tags": {
    "category": "regulatory_change",
    "scope": "multi_project",
    "urgency": "immediate_action"
  }
}
```

---

## 🎯 Hotspot Scenarios (AI Clustering)

### **Recurring Quality Issues**

```typescript
// Cluster: "Framing Quality Control"
signals: [
  "Joist spacing violations (5 instances)",
  "Header sizing errors (3 instances)",
  "Beam placement issues (4 instances)",
  "Code compliance failures (6 instances)"
],
confidence: 0.85,
primaryCause: "Subcontractor training gap",
suggestedSolution: "Enhanced QC checklist + training program"
```

### **Design Coordination Problems**

```typescript
// Cluster: "MEP Design Conflicts"
signals: [
  "HVAC/plumbing clashes (8 instances)",
  "Electrical/structural conflicts (4 instances)",
  "Drawing coordination delays (12 instances)"
],
confidence: 0.78,
primaryCause: "BIM coordination process gaps",
suggestedSolution: "Enhanced clash detection workflow"
```

### **Permit & Approval Delays**

```typescript
// Cluster: "Municipal Review Issues"
signals: [
  "Plan review delays (6 instances)",
  "Code interpretation questions (4 instances)",
  "Resubmission requirements (8 instances)"
],
confidence: 0.82,
primaryCause: "Changing municipal requirements",
suggestedSolution: "Enhanced pre-submission review process"
```

---

## 📈 Initiative & ROI Context

### **Strategic Initiatives**

```typescript
{
  name: "Quality Excellence Program",
  owner: "VP Construction Services",
  goalJson: {
    "reduce_rework": "50% reduction",
    "improve_satisfaction": "90% client satisfaction",
    "timeline": "Q2 2025"
  },
  roiJson: {
    "target_savings": 150000,
    "investment": 50000,
    "payback_months": 8
  }
},
{
  name: "Design Coordination Optimization",
  owner: "VP Design",
  goalJson: {
    "reduce_conflicts": "75% fewer clashes",
    "faster_reviews": "25% faster approvals"
  }
},
{
  name: "Permit Process Streamlining",
  owner: "VP Engineering",
  goalJson: {
    "faster_approvals": "30% faster permits",
    "fewer_revisions": "50% fewer resubmissions"
  }
}
```

### **Realistic Outcomes**

```typescript
// Success Stories
{
  outcome_id: "OUT-001",
  solution_id: "SOL-QC-001",
  metric: "rework_reduction",
  baseline: 24, // hours/week
  actual: 8,   // hours/week
  delta: -16,  // 67% improvement
  confidence: 0.9,
  roi_value: 28800 // annual savings
}
```

---

## 🔄 Learning Repository Examples

### **Decision Path Examples**

```json
{
  "decision_path": {
    "hotspot_id": "HOT-FRAMING-001",
    "signals": ["SIG-001", "SIG-045", "SIG-067"],
    "ideas_generated": ["Enhanced QC checklist", "Subcontractor training"],
    "solution_chosen": "SOL-QC-001",
    "executive_approval": "Lisa Rodriguez",
    "handoff_target": "Quality Control Team",
    "implementation_duration": 14, // days
    "final_status": "resolved",
    "success_metrics": { "rework_reduction": 0.67 }
  }
}
```

### **Reinforcement Signals**

```json
{
  "reinforcement_signal": {
    "hotspot_id": "HOT-FRAMING-001",
    "executive_approval": true,
    "modifications_made": "Added photo documentation requirement",
    "outcome_success": true,
    "roi_value": 28800,
    "lessons_learned": "Photo documentation critical for subcontractor accountability",
    "future_applications": ["Apply to electrical QC", "Extend to all trades"]
  }
}
```

---

## 📋 Implementation Notes

### **Seed Data Volume (50-person MVP)**

- **Users**: 50 (across 4 departments)
- **Departments**: 4 (Executive, Design, Engineering, Construction, Admin)
- **Teams**: 12 (specialized sub-teams)
- **Initiatives**: 3-5 (strategic focus areas)
- **Signals**: 200-300 (3-6 months of realistic activity)
- **Hotspots**: 8-12 (clustered signal groups)
- **Solutions**: 15-20 (approved resolutions)
- **Outcomes**: 5-8 (measured results)

### **Data Relationships**

- **70% of signals** cluster into 8-12 hotspots
- **80% of hotspots** have associated solutions
- **60% of solutions** have measured outcomes
- **Executive engagement**: 90%+ on critical/high severity
- **Cross-department issues**: 30% of hotspots

### **Realistic Timing**

- **Signal frequency**: 5-15 per week
- **Hotspot formation**: 2-3 weeks for clustering
- **Solution development**: 1-2 weeks average
- **Implementation**: 2-4 weeks average
- **Outcome measurement**: 4-8 weeks post-implementation

This seed data provides a comprehensive, realistic foundation for demonstrating FAEVision's value in the A&E industry context while maintaining the 50-person MVP scope.
