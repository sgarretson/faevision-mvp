# Expert Assignment Validation and Automation

## 🎯 Expert Assignment Control System
**Mission**: Ensure all FAEVision MVP work is assigned to the appropriate expert based on work type, complexity, and specialization requirements.

## 👥 Expert Team Roster and Specializations

### Database & Backend Specialists
```typescript
const DATABASE_EXPERT = {
  name: "Morgan Smith",
  role: "Database Architect", 
  mandatory_for: [
    "Schema design and migrations",
    "Database performance optimization",
    "Complex query development", 
    "Data modeling and relationships",
    "PostgreSQL and Prisma expertise"
  ],
  trigger_keywords: ["prisma", "schema", "migration", "query", "database", "postgres", "sql"],
  assignment_rule: "MANDATORY for ALL database-related work - NO EXCEPTIONS"
};

const LEAD_DEVELOPER = {
  name: "Alex Thompson",
  role: "Lead Developer",
  primary_for: [
    "Frontend component development",
    "API endpoint implementation", 
    "Application architecture",
    "Code quality and standards",
    "Team technical leadership"
  ],
  trigger_keywords: ["component", "api", "frontend", "react", "nextjs", "typescript"],
  assignment_rule: "Primary for frontend/API implementation work"
};
```

### AI & Architecture Specialists  
```typescript
const AI_ARCHITECT = {
  name: "Dr. Priya Patel",
  role: "AI Architect",
  mandatory_for: [
    "AI feature design and implementation",
    "OpenAI integration and optimization",
    "AI performance and accuracy",
    "AI user experience design",
    "AI security and compliance"
  ],
  support_expert: "Jordan Lee (Cursor Expert)",
  trigger_keywords: ["ai", "gpt", "openai", "tagging", "suggestions", "generation", "machine learning"],
  assignment_rule: "MANDATORY leadership for ALL AI features"
};

const STRATEGIC_CONSULTANT = {
  name: "Marcus Rodriguez", 
  role: "Strategic Consultant",
  primary_for: [
    "Business process optimization",
    "Executive workflow design",
    "Architecture firm operations",
    "Strategic business requirements",
    "Executive user behavior analysis"
  ],
  trigger_keywords: ["business", "process", "workflow", "executive", "strategy", "operations"],
  assignment_rule: "Required for executive-facing business logic"
};
```

### Design & User Experience Specialists
```typescript
const UX_EXPERT = {
  name: "Maya Rodriguez",
  role: "IA/UX Expert",
  primary_for: [
    "Information architecture design",
    "User experience optimization", 
    "Executive interface patterns",
    "Accessibility compliance",
    "User workflow design"
  ],
  collaboration_with: ["David Chen (Visual Designer)", "Alex Thompson (Lead Developer)"],
  trigger_keywords: ["ux", "interface", "accessibility", "workflow", "navigation", "usability"],
  assignment_rule: "Required for all UX and accessibility work"
};

const VISUAL_DESIGNER = {
  name: "David Chen",
  role: "Visual Designer", 
  primary_for: [
    "Executive-focused visual design",
    "Design system implementation",
    "Professional aesthetics",
    "Brand consistency",
    "Visual hierarchy optimization"
  ],
  collaboration_with: ["Maya Rodriguez (UX Expert)", "Alex Thompson (Lead Developer)"],
  trigger_keywords: ["design", "visual", "aesthetic", "branding", "color", "typography"],
  assignment_rule: "Required for visual design and aesthetics"
};
```

### Platform & DevOps Specialists
```typescript
const VERCEL_ENGINEER = {
  name: "Jordan Kim",
  role: "Vercel Engineer",
  mandatory_for: [
    "Vercel platform optimization",
    "Deployment configuration",
    "Performance monitoring",
    "Platform-specific features",
    "Infrastructure scaling"
  ],
  trigger_keywords: ["vercel", "deployment", "platform", "infrastructure", "scaling", "performance"],
  assignment_rule: "MANDATORY for Vercel platform and deployment work"
};

const GITHUB_EXPERT = {
  name: "Taylor Morgan",
  role: "GitHub Expert",
  primary_for: [
    "Git workflow optimization",
    "GitHub Actions CI/CD",
    "Branch protection setup",
    "Code review processes",
    "Repository management"
  ],
  trigger_keywords: ["github", "git", "ci/cd", "workflow", "actions", "repository"],
  assignment_rule: "Required for source control and CI/CD work"
};
```

### Project Management & Process Specialists
```typescript
const PRODUCT_MANAGER = {
  name: "Sarah Chen",
  role: "Product Manager",
  mandatory_for: [
    "Scope boundary decisions",
    "Feature prioritization",
    "Executive requirements validation",
    "Business value assessment",
    "MVP scope enforcement"
  ],
  escalation_authority: "Final authority on scope and priority decisions",
  trigger_keywords: ["scope", "priority", "requirements", "business", "executive", "mvp"],
  assignment_rule: "MANDATORY consultation for scope and priority decisions"
};

const LINEAR_EXPERT = {
  name: "Alex Johnson", 
  role: "Linear Expert",
  primary_for: [
    "Linear configuration and optimization",
    "Issue tracking and workflow",
    "Sprint planning and management",
    "Team coordination automation",
    "Progress tracking optimization"
  ],
  trigger_keywords: ["linear", "issue", "sprint", "tracking", "workflow", "coordination"],
  assignment_rule: "Required for project management and tracking work"
};

const CURSOR_EXPERT = {
  name: "Jordan Lee",
  role: "Cursor Expert", 
  primary_for: [
    "AI development optimization",
    "Code quality enforcement",
    "Development workflow enhancement",
    "Prompt engineering excellence",
    "Team productivity optimization"
  ],
  support_for: "All technical experts needing AI development assistance",
  trigger_keywords: ["cursor", "ai development", "productivity", "quality", "workflow"],
  assignment_rule: "Support role for all AI-enhanced development"
};
```

## 🚨 Expert Assignment Validation Rules

### Mandatory Expert Assignment
```typescript
const MANDATORY_EXPERT_RULES = {
  database_work: {
    expert: "Database Architect (Morgan Smith)",
    rule: "NO database work without Database Architect leadership",
    validation: "Halt development if Database Architect not assigned",
    keywords: ["prisma", "schema", "migration", "query", "database", "postgres"]
  },
  
  ai_features: {
    expert: "AI Architect (Dr. Priya Patel)",
    support: "Cursor Expert (Jordan Lee)", 
    rule: "ALL AI features require AI Architect leadership",
    validation: "Block AI development without AI Architect assignment",
    keywords: ["ai", "gpt", "openai", "tagging", "suggestions", "generation"]
  },
  
  executive_interfaces: {
    expert: "Product Manager (Sarah Chen) OR Strategic Consultant (Marcus Rodriguez)",
    rule: "Executive features require business expertise validation", 
    validation: "Require business expert review for executive-facing features",
    keywords: ["executive", "dashboard", "analytics", "requirements", "approval"]
  },
  
  platform_infrastructure: {
    vercel: "Vercel Engineer (Jordan Kim)",
    github: "GitHub Expert (Taylor Morgan)",
    rule: "Infrastructure changes require platform expert approval",
    validation: "Block infrastructure changes without platform expert",
    keywords: ["deployment", "ci/cd", "infrastructure", "platform", "vercel", "github"]
  }
};
```

### Assignment Validation Prompt
```markdown
# 🔍 EXPERT ASSIGNMENT VALIDATION

**CRITICAL**: Before ANY development work, validate expert assignment:

## Step 1: Work Type Analysis
Analyze the work request and identify:
- [ ] Primary work type (database, AI, frontend, design, infrastructure, etc.)
- [ ] Complexity level (simple, moderate, complex, critical)
- [ ] Cross-expert dependencies
- [ ] Executive impact level

## Step 2: Mandatory Expert Check
Check if work requires MANDATORY expert assignment:

### Database Work → Morgan Smith (Database Architect)
- Schema changes, migrations, complex queries
- Keywords: prisma, schema, migration, query, database, postgres
- **RULE**: NO database work without Database Architect

### AI Features → Dr. Priya Patel (AI Architect) + Jordan Lee (Cursor Expert)
- AI implementation, OpenAI integration, AI UX
- Keywords: ai, gpt, openai, tagging, suggestions, generation
- **RULE**: ALL AI features require AI Architect leadership

### Executive Interfaces → Sarah Chen (Product Manager) OR Marcus Rodriguez (Strategic Consultant)
- Executive-facing features, business logic, requirements
- Keywords: executive, dashboard, analytics, requirements, approval
- **RULE**: Executive features require business expertise

### Infrastructure → Jordan Kim (Vercel Engineer) OR Taylor Morgan (GitHub Expert)
- Platform configuration, deployment, CI/CD
- Keywords: deployment, infrastructure, platform, vercel, github
- **RULE**: Infrastructure changes require platform expert

## Step 3: Current Assignment Validation
- [ ] Is appropriate expert currently assigned to Linear issue?
- [ ] Is assigned expert available and not overloaded?
- [ ] Are cross-expert dependencies identified and coordinated?
- [ ] Does Linear issue reflect proper expert assignment?

## Step 4: Assignment Correction Protocol
If wrong expert assigned:
1. **PAUSE** current development immediately
2. **ESCALATE** to Linear Expert (Alex Johnson) for reassignment
3. **COORDINATE** handoff with originally assigned expert
4. **UPDATE** Linear issue with correct expert assignment
5. **RESUME** only after proper expert assignment confirmed

## Step 5: Scope and Expert Alignment
- [ ] Does work align with expert's core competencies?
- [ ] Is work within approved F1-F6 MVP scope?
- [ ] Does expert have capacity for quality delivery?
- [ ] Are success criteria clear and achievable?

**NEVER PROCEED** without proper expert assignment validation.
```

## 🔄 Expert Coordination Automation

### Cross-Expert Dependency Management
```typescript
const EXPERT_COORDINATION = {
  database_frontend: {
    scenario: "Frontend needs database schema changes",
    experts: ["Morgan Smith (Database)", "Alex Thompson (Lead Dev)"],
    coordination: "Database Architect designs schema, Lead Developer implements frontend",
    handoff: "Schema design complete → Frontend implementation begins"
  },
  
  ai_ux_design: {
    scenario: "AI features need executive-friendly UX",
    experts: ["Dr. Priya Patel (AI)", "Maya Rodriguez (UX)", "David Chen (Design)"],
    coordination: "AI Architect defines functionality, UX Expert designs workflow, Visual Designer creates interface",
    handoff: "AI requirements → UX design → Visual implementation"
  },
  
  executive_business_technical: {
    scenario: "Executive features with business logic and technical implementation",
    experts: ["Sarah Chen (Product)", "Marcus Rodriguez (Strategic)", "Alex Thompson (Lead Dev)"],
    coordination: "Product Manager validates scope, Strategic Consultant defines business logic, Lead Developer implements",
    handoff: "Business requirements → Technical specification → Implementation"
  },
  
  infrastructure_deployment: {
    scenario: "Platform configuration and deployment",
    experts: ["Jordan Kim (Vercel)", "Taylor Morgan (GitHub)", "Alex Thompson (Lead Dev)"],
    coordination: "GitHub Expert configures CI/CD, Vercel Engineer optimizes platform, Lead Developer validates deployment",
    handoff: "CI/CD setup → Platform optimization → Deployment validation"
  }
};
```

### Expert Workload Monitoring
```typescript
const WORKLOAD_MONITORING = {
  capacity_tracking: {
    database_architect: {
      max_concurrent: 2, // Schema changes and complex queries
      current_load: "Monitor via Linear issue assignments",
      availability: "Flag when approaching capacity limit"
    },
    ai_architect: {
      max_concurrent: 3, // AI feature development and review
      current_load: "Track AI feature development pipeline",
      availability: "Ensure availability for AI feature reviews"
    },
    lead_developer: {
      max_concurrent: 4, // Primary development work coordination
      current_load: "Monitor development velocity and quality",
      availability: "Balance implementation and review responsibilities"
    }
  },
  
  escalation_triggers: {
    overload_detection: "Expert assigned >max_concurrent work items",
    quality_impact: "Expert rushed due to overload affecting quality",
    timeline_risk: "Expert unavailability risking sprint delivery",
    coordination_bottleneck: "Expert delay blocking other experts"
  }
};
```

## 📋 Expert Assignment Checklist

### Pre-Assignment Validation
- [ ] Work type clearly identified and categorized
- [ ] Mandatory expert requirements checked and confirmed
- [ ] Expert availability and workload assessed
- [ ] Cross-expert dependencies identified and planned
- [ ] Linear issue created with proper expert assignment

### Assignment Quality Check
- [ ] Expert assignment matches work complexity and requirements
- [ ] Expert has necessary context and background for the work
- [ ] Success criteria and deliverables clearly defined
- [ ] Timeline realistic for expert availability and workload
- [ ] Handoff procedures defined for cross-expert coordination

### Ongoing Assignment Management  
- [ ] Expert progress tracked and blockers identified quickly
- [ ] Cross-expert coordination facilitated and monitored
- [ ] Quality standards maintained despite timeline pressure
- [ ] Expert feedback collected for process improvement
- [ ] Assignment effectiveness measured and optimized

## 🚨 Expert Assignment Pitfalls to Avoid

### Assignment Errors
- Assigning database work to non-Database Architect
- AI feature development without AI Architect leadership
- Executive interface work without business expertise
- Infrastructure changes without platform specialist

### Process Failures
- Missing expert assignment in Linear issues
- Inadequate cross-expert coordination planning
- Expert overload leading to quality degradation
- Poor handoff communication between experts

### Quality Impacts
- Wrong expert leading to suboptimal technical decisions
- Missing expert review causing quality issues
- Inadequate expertise depth for complex requirements
- Rush assignments compromising thoroughness

**Remember**: Proper expert assignment is critical for MVP success. When in doubt about assignment, escalate to Linear Expert (Alex Johnson) or Product Manager (Sarah Chen) for clarification.
