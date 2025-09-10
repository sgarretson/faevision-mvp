# 🎯 FAEVision MVP - Cursor Control & Enforcement Strategy

**Version**: 1.0  
**Date**: December 9, 2024  
**Lead**: Jordan Lee (Cursor Expert)  
**Status**: COMPREHENSIVE ANALYSIS & CONFIGURATION  
**Objective**: Strict AI-driven development control preventing scope creep and ensuring process adherence

---

## 🧠 **DEEP ANALYSIS: CURSOR CONTROL REQUIREMENTS**

### **Critical Control Points Identified**

After analyzing our complete documentation, I've identified **5 critical control areas** where Cursor must enforce strict rules:

1. **MVP Scope Enforcement**: Prevent features outside our agreed 6-feature scope
2. **Quality Standards Adherence**: Enforce our design, code, and accessibility standards
3. **Expert Assignment Logic**: Route work to appropriate team members based on expertise
4. **Process Compliance**: Ensure Linear workflow, GitHub standards, and review processes
5. **Performance & Security**: Maintain our executive-focused performance and security requirements

---

## 🔧 **CURSOR CONFIGURATION STRATEGY**

### **Primary Tools for Control**

#### **1. .cursorrules (Primary Enforcement)**
- **Purpose**: Strict project-wide rules that AI cannot violate
- **Scope**: Code standards, architecture patterns, quality gates
- **Enforcement**: Every AI interaction must comply

#### **2. Cursor Composer (Multi-File Control)**
- **Purpose**: Complex feature implementation with scope validation
- **Scope**: Feature-level development with cross-file consistency
- **Enforcement**: Pre-implementation scope and expert validation

#### **3. Custom Prompt Templates (Guided Development)**
- **Purpose**: Structured prompts ensuring process compliance
- **Scope**: Feature development, bug fixes, code reviews
- **Enforcement**: Mandatory prompt structure with validation checkpoints

#### **4. Background Agents (Continuous Monitoring)**
- **Purpose**: Real-time code quality and scope monitoring
- **Scope**: Ongoing code analysis and improvement suggestions
- **Enforcement**: Automatic alerts for violations and deviations

---

## 📋 **COMPREHENSIVE .CURSORRULES CONFIGURATION**

### **FAEVision MVP Control Rules**

```typescript
// .cursorrules - STRICT MVP CONTROL CONFIGURATION
// Jordan Lee (Cursor Expert) - FAEVision MVP Team

/*
=== FAEVISION MVP CONTROL SYSTEM ===
This configuration enforces strict adherence to our MVP scope, quality standards, and team processes.
ANY deviation from these rules must be explicitly approved by the appropriate expert.
*/

// === MVP SCOPE ENFORCEMENT ===
/*
CRITICAL: The FAEVision MVP has EXACTLY 6 features. NO additional features allowed.
F1: Input Capture (Problems/Opportunities/General with strategic tagging)
F2: Collaborative Engagement (Voting, commenting, @mentions, notifications)
F3: Intelligent Organization (Manual grouping with AI suggestions)
F4: Solution Execution (Solution creation, task breakdown, progress tracking)
F5: Executive Requirements (Requirements management with collaboration and approval)
F6: AI-Generated FRD Handoff (Document generation and executive review)

OUT OF SCOPE (FORBIDDEN):
- Advanced AI clustering beyond simple suggestions
- Initiative management beyond basic solutions
- Complex approval workflows beyond executive approval
- Advanced reporting beyond basic analytics
- Mobile native applications (responsive web only)
- External system integrations
- Complex resource planning and budgeting
*/

SCOPE_VALIDATION: {
  BEFORE_IMPLEMENTING: "Always validate that the requested feature is within our 6-feature MVP scope",
  SCOPE_CREEP_PREVENTION: "If request is outside scope, respond with: 'This feature is outside our MVP scope. Please refer to docs/mvp-consensus/FAEVision-MVP-Final-Consensus.md for approved features.'",
  EXPERT_ESCALATION: "For scope questions, escalate to Product Manager (Sarah Chen) or Strategic Consultant (Marcus Rodriguez)"
}

// === EXPERT ASSIGNMENT ENFORCEMENT ===
/*
Each type of work must be assigned to the appropriate expert based on their specialization:
*/

EXPERT_ROUTING: {
  // Frontend & UI Development
  FRONTEND_WORK: "Assign to Lead Developer (Alex Thompson) or UX Expert (Maya Rodriguez)",
  UI_COMPONENTS: "Assign to Visual Designer (David Chen) with UX Expert (Maya Rodriguez) review",
  
  // Backend & API Development  
  BACKEND_API: "Assign to Lead Developer (Alex Thompson) or AI Architect (Dr. Priya Patel)",
  DATABASE_WORK: "MUST assign to Database Architect (Morgan Smith) - no exceptions",
  
  // AI Feature Development
  AI_FEATURES: "MUST assign to AI Architect (Dr. Priya Patel) with Cursor Expert (Jordan Lee) support",
  AI_TAGGING: "AI Architect (Dr. Priya Patel) primary, Lead Developer secondary",
  DOCUMENT_GENERATION: "AI Architect (Dr. Priya Patel) primary, Visual Designer for templates",
  
  // Infrastructure & Deployment
  VERCEL_CONFIG: "MUST assign to Vercel Engineer (Jordan Kim) - platform expertise required",
  GITHUB_WORKFLOW: "MUST assign to GitHub Expert (Taylor Morgan) - workflow expertise required",
  
  // Project Management
  LINEAR_CONFIG: "MUST assign to Linear Expert (Alex Johnson) - project management expertise",
  
  // Business & Strategy
  REQUIREMENTS: "Strategic Consultant (Marcus Rodriguez) primary, Product Manager secondary",
  EXECUTIVE_FEATURES: "Product Manager (Sarah Chen) primary, Strategic Consultant secondary"
}

// === ARCHITECTURE PATTERNS (STRICT ENFORCEMENT) ===

ARCHITECTURE: {
  FRAMEWORK: "Next.js 14 with App Router ONLY - no other frameworks allowed",
  LANGUAGE: "TypeScript in strict mode - JavaScript not allowed for new code",
  STYLING: "Tailwind CSS with our design system - no custom CSS without approval",
  STATE_MANAGEMENT: "Zustand for global state, SWR for server state - no Redux or other solutions",
  DATABASE: "Prisma with PostgreSQL - no other ORM or database solutions",
  AUTHENTICATION: "NextAuth.js v5 - no custom auth solutions",
  AI_INTEGRATION: "Vercel AI SDK with OpenAI - no other AI providers without approval"
}

// === USER ROLES & PERMISSIONS (STRICT) ===
/*
FAEVision has EXACTLY 3 user roles - no additional roles allowed:
*/

USER_ROLES: {
  ADMIN: "Full system access, user management, configuration, data export",
  EXECUTIVE: "All operational features, input organization, solution creation, requirements approval",
  CONTRIBUTOR: "Input creation, voting, commenting, task execution"
}

ROLE_ENFORCEMENT: {
  PERMISSION_CHECKS: "Every feature MUST check user role and enforce permissions",
  NO_ROLE_MIXING: "Features cannot blur role boundaries - strict separation required",
  EXECUTIVE_FOCUS: "Executive features must be optimized for executive use patterns"
}

// === ENTITY MODEL (LOCKED) ===
/*
Our entity model is FINAL - no additional entities allowed:
*/

ENTITIES: {
  CORE_ENTITIES: ["User", "Input", "Comment", "Vote", "Group", "Solution", "Task", "Requirement", "FRDDocument"],
  NO_NEW_ENTITIES: "Cannot create new entities without Product Manager and AI Architect approval",
  RELATIONSHIP_LIMITS: "Keep relationships simple - avoid complex many-to-many beyond what's defined"
}

// === QUALITY STANDARDS (NON-NEGOTIABLE) ===

QUALITY_ENFORCEMENT: {
  TEST_COVERAGE: "Minimum 85% code coverage - no exceptions",
  ACCESSIBILITY: "WCAG 2.1 AA compliance required for ALL user interfaces",
  PERFORMANCE: {
    PAGE_LOAD: "Must be under 2 seconds",
    API_RESPONSE: "Must be under 500ms",
    AI_PROCESSING: "Must be under 15 seconds with progress indicators"
  },
  SECURITY: {
    INPUT_VALIDATION: "All inputs must use Zod schema validation",
    AUTHENTICATION: "All protected routes must verify JWT tokens",
    AUTHORIZATION: "All operations must check user permissions"
  }
}

// === DESIGN SYSTEM ENFORCEMENT ===

DESIGN_STANDARDS: {
  COLOR_SYSTEM: "Use ONLY colors defined in docs/design/FAEVision-Design-Standards.md",
  TYPOGRAPHY: "Follow executive typography hierarchy - no custom font sizes",
  COMPONENTS: "Use existing component patterns - create new components only with Visual Designer approval",
  RESPONSIVE: "All interfaces must work on mobile, tablet, desktop",
  EXECUTIVE_PATTERNS: "Follow executive-focused design patterns for business users"
}

// === AI FEATURE CONSTRAINTS ===

AI_FEATURE_RULES: {
  AI_SCOPE: "AI features limited to: tagging, duplicate detection, similarity suggestions, requirements generation, FRD generation",
  NO_ADVANCED_AI: "No machine learning models, complex clustering, or predictive analytics in MVP",
  CONFIDENCE_THRESHOLDS: "All AI suggestions must include confidence scores",
  HUMAN_OVERRIDE: "All AI features must allow executive override",
  FALLBACK_REQUIRED: "All AI features must work when AI service unavailable"
}

// === DEVELOPMENT PROCESS ENFORCEMENT ===

PROCESS_COMPLIANCE: {
  LINEAR_INTEGRATION: "All work must start from Linear issue with proper Epic assignment",
  GITHUB_WORKFLOW: "Must follow feature branch → PR → review → merge workflow",
  CODE_REVIEW: "All code must be reviewed by appropriate expert before merge",
  TESTING_REQUIRED: "All features must include comprehensive tests",
  DOCUMENTATION: "All public APIs and complex logic must be documented"
}

// === PERFORMANCE BUDGETS (STRICT) ===

PERFORMANCE_BUDGETS: {
  BUNDLE_SIZE: "JavaScript bundles must be under 200KB gzipped",
  IMAGE_OPTIMIZATION: "All images must use Next.js Image component with optimization",
  DATABASE_QUERIES: "All queries must be optimized and indexed",
  REAL_TIME_FEATURES: "Real-time updates must not impact page performance"
}

// === SECURITY REQUIREMENTS (NON-NEGOTIABLE) ===

SECURITY_ENFORCEMENT: {
  INPUT_SANITIZATION: "All user inputs must be sanitized against XSS",
  SQL_INJECTION: "All database queries must use parameterized queries or Prisma",
  AUTHENTICATION: "All protected routes must verify authentication",
  AUTHORIZATION: "All operations must verify user permissions",
  AUDIT_LOGGING: "All user actions must be logged for audit trail"
}

// === PROMPT GUIDANCE SYSTEM ===

PROMPT_REQUIREMENTS: {
  CONTEXT_INJECTION: "Always include relevant project context in prompts",
  QUALITY_CHECKLIST: "Include quality validation checklist in all prompts",
  EXPERT_ASSIGNMENT: "Specify which expert should review the generated code",
  TESTING_REQUIREMENTS: "Include testing requirements in all feature prompts",
  DOCUMENTATION_NEEDS: "Specify documentation requirements for generated code"
}
```

---

## 🎯 **CURSOR COMPOSER CONTROL STRATEGY**

### **Composer Session Templates**

#### **Feature Development Session Template**
```markdown
# FAEVision MVP Feature Development Session

## SCOPE VALIDATION (MANDATORY)
Before starting, confirm this feature is in our approved MVP scope:
✅ F1: Input Capture
✅ F2: Collaborative Engagement  
✅ F3: Intelligent Organization
✅ F4: Solution Execution
✅ F5: Executive Requirements
✅ F6: AI-Generated FRD Handoff

❌ If not in scope, STOP and escalate to Product Manager

## EXPERT ASSIGNMENT VALIDATION
Confirm the right expert is assigned:
- Frontend/UI: Lead Developer + UX Expert + Visual Designer
- Backend/API: Lead Developer + AI Architect (if AI involved)
- Database: Database Architect (REQUIRED for schema changes)
- AI Features: AI Architect (REQUIRED) + Cursor Expert
- Infrastructure: Vercel Engineer or GitHub Expert
- Requirements: Strategic Consultant + Product Manager

## LINEAR ISSUE CONTEXT
Linear Issue ID: [FAE-XXX]
Epic: [Epic Name and Number]
Assigned Expert: [Expert Name]
Business Value: [High/Medium/Low]
Technical Complexity: [Simple/Medium/Complex]

## IMPLEMENTATION REQUIREMENTS
1. Follow .cursorrules configuration strictly
2. Implement for user roles: Admin, Executive, Contributor
3. Include comprehensive error handling
4. Add TypeScript types for all interfaces
5. Implement WCAG 2.1 AA accessibility
6. Include unit tests with >85% coverage
7. Follow executive-focused design patterns
8. Optimize for <2s page load, <500ms API response

## QUALITY VALIDATION CHECKLIST
Before completing implementation:
- [ ] Code follows .cursorrules standards
- [ ] TypeScript compilation without errors
- [ ] ESLint and Prettier checks pass
- [ ] Unit tests written and passing
- [ ] Accessibility compliance verified
- [ ] Performance requirements met
- [ ] Security validation completed
- [ ] Expert review completed

## SCOPE CREEP PREVENTION
If during development you identify "nice-to-have" features or improvements:
1. STOP implementation
2. Document the idea for Phase 2
3. Focus ONLY on MVP requirements
4. Escalate to Product Manager if unclear
```

#### **Bug Fix Session Template**
```markdown
# FAEVision MVP Bug Fix Session

## BUG CLASSIFICATION (MANDATORY)
Severity Level:
- [ ] Critical (P0): Fix within 4 hours - Application crashes, security issues
- [ ] High (P1): Fix within 24 hours - Major dysfunction, user workflow blocked  
- [ ] Medium (P2): Fix within 1 week - Minor issues, workaround available
- [ ] Low (P3): Fix within 2 weeks - Cosmetic, edge cases

## EXPERT ASSIGNMENT VALIDATION
Bug Type → Required Expert:
- Frontend issues → Lead Developer or UX Expert
- Backend issues → Lead Developer or AI Architect
- Database issues → Database Architect (REQUIRED)
- AI feature issues → AI Architect (REQUIRED)
- Infrastructure issues → Vercel Engineer or GitHub Expert
- Process issues → Linear Expert

## ROOT CAUSE ANALYSIS
1. Identify the underlying cause (not just symptoms)
2. Determine if bug indicates larger architectural issue
3. Assess impact on other features or systems
4. Plan minimal, safe fix approach

## FIX IMPLEMENTATION RULES
1. Minimal code changes to reduce risk
2. Add specific regression tests
3. Follow existing code patterns and conventions
4. Include logging for future debugging
5. Update documentation if behavior changes
6. Test fix thoroughly before PR creation

## REGRESSION PREVENTION
- [ ] Regression tests added for this specific bug
- [ ] Related functionality tested for side effects
- [ ] Performance impact assessed
- [ ] Security implications reviewed
- [ ] Accessibility not compromised by fix
```

### **Scope Creep Detection Prompts**

#### **Feature Request Validator**
```markdown
# Scope Creep Detection System

You are a strict MVP scope validator for FAEVision. Before implementing ANY feature request:

## SCOPE VALIDATION PROTOCOL
1. **Check against approved features**: Is this request part of F1-F6?
2. **Identify scope creep**: Does this add functionality beyond MVP scope?
3. **Escalation requirement**: If outside scope, require Product Manager approval

## APPROVED MVP FEATURES ONLY:
**F1: Input Capture**
- Input creation form with title, description, type
- Strategic tagging (department, issue type, root cause)
- AI auto-tagging and duplicate detection
- Mobile-responsive capture

**F2: Collaborative Engagement**
- Voting system (upvote/downvote)
- Threaded commenting with @mentions
- Real-time updates and notifications
- Activity feeds

**F3: Intelligent Organization**
- Manual grouping with drag-and-drop
- AI similarity suggestions
- Group insights and themes
- Executive dashboard views

**F4: Solution Execution**
- Solution creation from inputs/groups
- Task breakdown and assignment
- Progress tracking and reporting
- Solution collaboration

**F5: Executive Requirements**
- Requirements creation and management
- Requirements collaboration (voting, commenting)
- Executive approval workflow
- AI-assisted requirements generation

**F6: AI-Generated FRD Handoff**
- Document generation from solution + requirements
- Professional templates
- Executive review and approval
- Multi-format export

## SCOPE CREEP INDICATORS:
❌ "Advanced analytics" or "predictive insights"
❌ "Complex approval workflows" beyond executive approval
❌ "Mobile native app" (responsive web only)
❌ "External integrations" with other systems
❌ "Advanced AI clustering" beyond similarity suggestions
❌ "Initiative management" beyond basic solutions
❌ "Complex resource planning" beyond basic task assignment
❌ "Advanced reporting" beyond basic dashboards

## RESPONSE PROTOCOL:
If request is scope creep, respond:
"🚫 SCOPE VALIDATION FAILED
This request appears to be outside our MVP scope. Our approved features are F1-F6 as defined in docs/mvp-consensus/FAEVision-MVP-Final-Consensus.md.

Suggested Actions:
1. Review if this can be simplified to fit within existing features
2. Document as Phase 2 enhancement
3. Escalate to Product Manager (Sarah Chen) for scope clarification

Would you like me to help implement this within our current MVP scope instead?"
```

---

## 🏗️ **EXPERT ASSIGNMENT AUTOMATION**

### **Intelligent Work Routing System**

```typescript
// Cursor Expert Assignment Logic
const EXPERT_ASSIGNMENT_RULES = {
  // === FRONTEND DEVELOPMENT ===
  FRONTEND_PATTERNS: {
    keywords: ["component", "ui", "interface", "form", "button", "layout", "responsive"],
    primaryExpert: "Lead Developer (Alex Thompson)",
    secondaryExpert: "UX Expert (Maya Rodriguez)",
    reviewRequired: "Visual Designer (David Chen)",
    cursorPrompt: `
      You are implementing frontend features for FAEVision MVP.
      Primary Expert: Lead Developer (Alex Thompson)
      Design Review Required: Visual Designer (David Chen)
      
      REQUIREMENTS:
      - Use Next.js 14 App Router patterns
      - Follow executive-focused design standards
      - Implement WCAG 2.1 AA accessibility
      - Use Tailwind CSS with design system colors
      - Ensure mobile responsiveness (320px-1440px+)
      - Include TypeScript interfaces
      - Add comprehensive error handling
    `
  },

  // === AI FEATURE DEVELOPMENT ===
  AI_FEATURES: {
    keywords: ["ai", "gpt", "openai", "tagging", "suggestions", "similarity", "document generation"],
    primaryExpert: "AI Architect (Dr. Priya Patel)",
    secondaryExpert: "Cursor Expert (Jordan Lee)",
    reviewRequired: "Lead Developer (Alex Thompson)",
    cursorPrompt: `
      You are implementing AI features for FAEVision MVP.
      Primary Expert: AI Architect (Dr. Priya Patel)
      AI Development Support: Cursor Expert (Jordan Lee)
      
      REQUIREMENTS:
      - Use Vercel AI SDK with OpenAI integration
      - Include confidence scoring for all AI suggestions
      - Implement graceful fallback when AI unavailable
      - Add human override capabilities
      - Include performance monitoring (<15s processing)
      - Follow AI transparency design patterns
      - Add comprehensive error handling for AI failures
    `
  },

  // === DATABASE DEVELOPMENT ===
  DATABASE_WORK: {
    keywords: ["prisma", "schema", "migration", "database", "query", "sql", "postgres"],
    primaryExpert: "Database Architect (Morgan Smith)",
    secondaryExpert: "Lead Developer (Alex Thompson)",
    reviewRequired: "AI Architect (Dr. Priya Patel) if AI data involved",
    cursorPrompt: `
      You are implementing database features for FAEVision MVP.
      PRIMARY EXPERT REQUIRED: Database Architect (Morgan Smith)
      
      CRITICAL REQUIREMENTS:
      - ALL database changes must be reviewed by Database Architect
      - Use Prisma ORM with TypeScript generation
      - Follow our entity model: Input, Comment, Vote, Group, Solution, Task, Requirement, FRDDocument
      - Include proper indexing for performance
      - Add migration scripts for schema changes
      - Include connection pooling and optimization
      - Follow security patterns for data protection
    `
  },

  // === EXECUTIVE FEATURES ===
  EXECUTIVE_FEATURES: {
    keywords: ["executive", "dashboard", "analytics", "requirements", "approval", "reporting"],
    primaryExpert: "Product Manager (Sarah Chen)",
    secondaryExpert: "Strategic Consultant (Marcus Rodriguez)",
    reviewRequired: "UX Expert (Maya Rodriguez)",
    cursorPrompt: `
      You are implementing executive-focused features for FAEVision MVP.
      Primary Expert: Product Manager (Sarah Chen)
      Business Context: Strategic Consultant (Marcus Rodriguez)
      
      EXECUTIVE REQUIREMENTS:
      - Optimize for executive user patterns (quick scanning, decision-making)
      - Use executive color system and typography
      - Include trend visualization and status indicators
      - Implement dashboard-first information architecture
      - Add business intelligence and analytics
      - Follow professional aesthetics and trust-building design
      - Include mobile executive patterns for efficiency
    `
  }
};

// === AUTOMATIC EXPERT DETECTION ===
function detectRequiredExpert(issueDescription, codeContext, labels) {
  const content = `${issueDescription} ${codeContext} ${labels.join(' ')}`.toLowerCase();
  
  // Database work detection (CRITICAL)
  if (content.includes('prisma') || content.includes('schema') || content.includes('migration') || content.includes('database')) {
    return {
      primaryExpert: "Database Architect (Morgan Smith)",
      mandatory: true,
      reason: "Database changes require Database Architect expertise"
    };
  }
  
  // AI feature detection (CRITICAL)
  if (content.includes('ai') || content.includes('gpt') || content.includes('openai') || content.includes('tagging') || content.includes('suggestions')) {
    return {
      primaryExpert: "AI Architect (Dr. Priya Patel)",
      mandatory: true,
      reason: "AI features require AI Architect expertise"
    };
  }
  
  // Executive feature detection
  if (content.includes('executive') || content.includes('dashboard') || content.includes('requirements') || content.includes('approval')) {
    return {
      primaryExpert: "Product Manager (Sarah Chen)",
      secondaryExpert: "Strategic Consultant (Marcus Rodriguez)",
      reason: "Executive features require business expertise"
    };
  }
  
  // Continue for other patterns...
}
```

---

## 🔍 **QUALITY GATE ENFORCEMENT SYSTEM**

### **Pre-Implementation Validation**

```markdown
# Quality Gate Checkpoint System

Before generating ANY code, Cursor must validate:

## SCOPE COMPLIANCE CHECK
1. ✅ Feature is within approved MVP scope (F1-F6)
2. ✅ No scope creep or unauthorized enhancements
3. ✅ Aligns with current Epic and Sprint goals
4. ✅ Appropriate expert assigned and available

## TECHNICAL VALIDATION CHECK
1. ✅ Uses approved technology stack only
2. ✅ Follows established architecture patterns
3. ✅ Meets performance requirements
4. ✅ Includes security considerations
5. ✅ Accessibility compliance planned

## DESIGN COMPLIANCE CHECK
1. ✅ Follows executive-focused design standards
2. ✅ Uses approved color system and typography
3. ✅ Implements responsive design patterns
4. ✅ Includes proper status indicators
5. ✅ Optimized for executive user patterns

## PROCESS COMPLIANCE CHECK
1. ✅ Linear issue exists and is properly configured
2. ✅ GitHub branch created from Linear issue
3. ✅ Appropriate expert assigned and notified
4. ✅ Testing strategy defined
5. ✅ Review process planned

## QUALITY ASSURANCE CHECK
1. ✅ Test coverage strategy defined (>85%)
2. ✅ Error handling approach planned
3. ✅ Performance impact assessed
4. ✅ Security implications reviewed
5. ✅ Documentation requirements identified

ONLY PROCEED if ALL checks pass. If any check fails, escalate to appropriate expert.
```

### **Real-Time Quality Monitoring**

```typescript
// Background Agent Configuration
const QUALITY_MONITORING = {
  CONTINUOUS_CHECKS: {
    codeQuality: {
      trigger: "on_file_save",
      validations: [
        "typescript_compilation",
        "eslint_compliance", 
        "prettier_formatting",
        "test_coverage_maintained",
        "performance_impact_assessed"
      ]
    },
    
    scopeCompliance: {
      trigger: "on_feature_addition",
      validations: [
        "feature_in_approved_scope",
        "no_unauthorized_entities",
        "no_complex_workflows",
        "executive_focus_maintained"
      ]
    },
    
    expertAssignment: {
      trigger: "on_work_assignment",
      validations: [
        "appropriate_expert_assigned",
        "required_reviews_planned",
        "expertise_match_validated",
        "workload_balance_maintained"
      ]
    }
  }
};
```

---

## 📚 **PROMPT TEMPLATE LIBRARY**

### **Scope-Controlled Prompt Templates**

#### **Input Feature Development**
```markdown
# Input Capture Feature Implementation (F1)

You are implementing the Input Capture feature for FAEVision MVP.

## SCOPE BOUNDARIES (STRICT)
✅ ALLOWED: Input creation form, strategic tagging, AI auto-tagging, duplicate detection, mobile capture
❌ FORBIDDEN: Advanced analytics, complex workflows, external integrations

## EXPERT ASSIGNMENT
Primary: AI Architect (Dr. Priya Patel) - AI features
Secondary: UX Expert (Maya Rodriguez) - form design
Review: Lead Developer (Alex Thompson) - technical implementation

## IMPLEMENTATION REQUIREMENTS
1. **Form Structure**: Title (5-100 chars), Description (10-2000 chars), Type (Problem/Opportunity/General)
2. **Strategic Tagging**: Department (auto-suggested), Issue Type (dropdown), Root Cause (AI-suggested)
3. **AI Features**: Auto-tagging with >80% accuracy, duplicate detection >85% prevention
4. **Performance**: Form submission <90 seconds, AI processing <5 seconds
5. **Mobile**: Responsive design, touch-friendly (44px targets), offline capability

## TECHNICAL STACK (ENFORCED)
- Next.js 14 App Router with TypeScript
- Tailwind CSS with executive design system
- Prisma for database operations
- Vercel AI SDK for AI features
- Zod for form validation
- React Hook Form for form management

## QUALITY REQUIREMENTS
- TypeScript strict mode compliance
- 85%+ test coverage with Vitest
- WCAG 2.1 AA accessibility compliance
- Executive-focused design patterns
- Comprehensive error handling
- Performance optimization for Core Web Vitals

Generate the implementation following these strict requirements.
```

#### **Collaboration Feature Development**
```markdown
# Collaborative Engagement Feature Implementation (F2)

You are implementing real-time collaboration features for FAEVision MVP.

## SCOPE BOUNDARIES (STRICT)
✅ ALLOWED: Voting, commenting, @mentions, notifications, real-time updates
❌ FORBIDDEN: Advanced analytics, complex approval workflows, external notifications

## EXPERT ASSIGNMENT
Primary: Lead Developer (Alex Thompson) - real-time features
Secondary: UX Expert (Maya Rodriguez) - collaboration UX
Review: AI Architect (Dr. Priya Patel) - if AI involved

## REAL-TIME REQUIREMENTS
1. **Voting System**: Upvote/downvote with real-time updates <3 seconds
2. **Comment System**: Threaded comments (2 levels max), @mentions, real-time updates
3. **Notifications**: In-app and email notifications with user preferences
4. **Performance**: Real-time updates without page refresh, optimistic UI updates

## TECHNICAL IMPLEMENTATION (ENFORCED)
- Server-Sent Events for real-time updates (no WebSockets)
- Zustand for real-time state management
- React Hook Form for comment creation
- Vercel Functions for background processing
- Resend for email notifications

## COLLABORATION PATTERNS
- Executive-focused commenting interface
- Professional notification templates
- Mobile-optimized collaboration patterns
- Clear visual feedback for all interactions

Generate the implementation following these strict collaboration requirements.
```

#### **AI Feature Development**
```markdown
# AI Feature Implementation (AI Components Only)

You are implementing AI features for FAEVision MVP.

## MANDATORY EXPERT ASSIGNMENT
PRIMARY EXPERT REQUIRED: AI Architect (Dr. Priya Patel)
SUPPORT EXPERT: Cursor Expert (Jordan Lee)
REVIEW REQUIRED: Lead Developer (Alex Thompson)

## AI SCOPE BOUNDARIES (STRICT)
✅ ALLOWED: Auto-tagging, duplicate detection, similarity suggestions, requirements generation, FRD generation
❌ FORBIDDEN: Machine learning models, complex clustering, predictive analytics, advanced AI

## AI IMPLEMENTATION REQUIREMENTS
1. **Vercel AI SDK Only**: No other AI frameworks or direct API calls
2. **OpenAI Models**: GPT-4 for documents, GPT-3.5-turbo for tagging
3. **Confidence Scoring**: All suggestions include confidence levels
4. **Human Override**: All AI features allow executive override
5. **Fallback Systems**: Graceful degradation when AI unavailable
6. **Performance**: AI processing <15 seconds with progress indicators

## AI TRANSPARENCY REQUIREMENTS
- Clear indication of AI-generated content
- Confidence indicators for all suggestions
- Executive control over AI suggestions
- Learning from user feedback
- Error handling for AI service failures

## SECURITY & PRIVACY
- Input sanitization before AI processing
- No PII sent to AI services without encryption
- Audit logging for all AI operations
- Rate limiting to prevent abuse

Generate AI features following these strict requirements.
```

---

## 🎛️ **CURSOR COMPOSER CONTROL FRAMEWORK**

### **Multi-File Feature Development Control**

#### **Composer Session Initialization**
```markdown
# Cursor Composer Session Control

Before starting any multi-file development session:

## SESSION VALIDATION PROTOCOL
1. **Scope Check**: Confirm feature is within approved MVP scope
2. **Expert Check**: Verify appropriate expert is leading the session
3. **Epic Check**: Confirm work aligns with current Epic goals
4. **Quality Check**: Ensure all quality requirements understood

## COMPOSER CONTROL RULES
1. **File Modification Limits**: Only modify files related to assigned Linear issue
2. **Architecture Compliance**: Follow established patterns and conventions
3. **Quality Gates**: Include testing and validation in all changes
4. **Documentation**: Update relevant documentation for changes
5. **Review Planning**: Identify required expert reviews before starting

## MULTI-FILE COORDINATION
When working across multiple files:
- Maintain consistency in naming conventions
- Follow established import/export patterns
- Update related tests and documentation
- Consider impact on other features and experts
- Plan integration testing approach

## SCOPE CREEP PREVENTION IN COMPOSER
During multi-file sessions, resist temptation to:
❌ Add "quick improvements" outside scope
❌ Implement "obvious enhancements" 
❌ Fix "related issues" not in current Linear issue
❌ Add "helpful features" beyond requirements

✅ STAY FOCUSED on specific Linear issue requirements
✅ Document additional ideas for future phases
✅ Maintain strict adherence to MVP scope
```

#### **Feature Integration Validation**
```markdown
# Multi-File Feature Integration Control

When implementing features that span multiple files:

## INTEGRATION CHECKPOINTS
1. **Component Integration**: Ensure components work together correctly
2. **State Management**: Validate state flows and updates
3. **API Integration**: Confirm frontend-backend integration
4. **Database Integration**: Validate data persistence and retrieval
5. **Real-Time Integration**: Test real-time updates and synchronization

## CROSS-EXPERT COORDINATION
Before modifying files that impact other experts:
- **Database Files**: Get Database Architect approval
- **AI Features**: Get AI Architect review
- **Executive UI**: Get UX Expert and Visual Designer input
- **Infrastructure**: Get Vercel Engineer or GitHub Expert approval

## QUALITY ASSURANCE FOR INTEGRATION
- All integration points must include error handling
- Cross-component communication must be typed
- State updates must be optimistic with fallback
- API calls must include loading states and error handling
- Real-time features must handle connection failures
```

---

## 🔒 **PROCESS ENFORCEMENT AUTOMATION**

### **Linear Integration Enforcement**

```typescript
// Linear Process Compliance Rules
const LINEAR_ENFORCEMENT = {
  ISSUE_VALIDATION: {
    requiredFields: [
      "Epic assignment",
      "Expert assignment", 
      "Business impact",
      "Technical complexity",
      "Acceptance criteria"
    ],
    validation: `
      Before starting work, validate Linear issue has:
      ✅ Proper Epic assignment (0-8)
      ✅ Appropriate expert assigned
      ✅ Clear acceptance criteria
      ✅ Business impact defined
      ✅ Technical complexity assessed
      
      If any missing, escalate to Linear Expert (Alex Johnson)
    `
  },

  WORK_AUTHORIZATION: {
    rule: "No code development without approved Linear issue",
    enforcement: `
      Before generating ANY code:
      1. Confirm Linear issue ID (FAE-XXX format)
      2. Verify issue status is "In Progress"
      3. Confirm you are assigned expert or authorized
      4. Validate issue is within current Epic scope
      
      If unauthorized, respond:
      "❌ WORK AUTHORIZATION FAILED
      This work requires a Linear issue assignment. Please:
      1. Create Linear issue with proper Epic assignment
      2. Get appropriate expert assignment
      3. Set issue status to 'In Progress'
      4. Return with Linear issue ID for authorized development"
    `
  }
};
```

### **GitHub Workflow Enforcement**

```typescript
// GitHub Process Compliance
const GITHUB_ENFORCEMENT = {
  BRANCH_REQUIREMENTS: {
    naming: "feature/FAE-{issue-number}-{description}",
    validation: `
      All development must follow GitHub workflow:
      1. Create feature branch from develop
      2. Follow naming convention: feature/FAE-XXX-description
      3. Implement with comprehensive testing
      4. Create PR with proper template
      5. Get required expert reviews
      6. Pass all quality gates before merge
    `
  },

  COMMIT_STANDARDS: {
    format: "Conventional Commits required",
    enforcement: `
      All commits must follow format:
      type(scope): description
      
      Types: feat, fix, docs, style, refactor, perf, test, chore, ai, design
      
      Examples:
      feat(input): implement AI-powered input creation form
      fix(voting): resolve real-time vote synchronization issue
      ai(tagging): add confidence scoring for tag suggestions
    `
  }
};
```

---

## 🎯 **ADVANCED CONTROL MECHANISMS**

### **Cursor Extensions & Tools**

#### **Recommended Cursor Extensions for Control**
```yaml
Essential Extensions:
  1. Linear Integration Extension:
     - Auto-load Linear issue context
     - Validate issue assignment and status
     - Update Linear progress automatically
     - Enforce Epic and Sprint boundaries
  
  2. GitHub Integration Extension:
     - Enforce branch naming conventions
     - Validate PR requirements
     - Auto-generate commit messages
     - Track code review requirements
  
  3. Quality Gate Extension:
     - Real-time code quality scoring
     - Accessibility validation
     - Performance impact assessment
     - Security vulnerability detection
  
  4. Expert Assignment Extension:
     - Route work to appropriate experts
     - Validate expertise requirements
     - Enforce review assignments
     - Track expert workload and availability
```

#### **Custom Cursor Commands**

```typescript
// Custom Cursor commands for FAEVision MVP
const CURSOR_COMMANDS = {
  // Scope validation command
  "/validate-scope": {
    description: "Validate current work against MVP scope",
    action: "Check current work against approved F1-F6 features",
    response: "Provide scope compliance report with recommendations"
  },
  
  // Expert assignment command
  "/assign-expert": {
    description: "Determine appropriate expert for current work",
    action: "Analyze work type and assign correct expert",
    response: "Provide expert assignment with reasoning"
  },
  
  // Quality check command
  "/quality-check": {
    description: "Comprehensive quality validation",
    action: "Validate code against all quality standards",
    response: "Provide quality score and improvement recommendations"
  },
  
  // MVP progress command
  "/mvp-progress": {
    description: "Check progress against MVP timeline",
    action: "Analyze current Epic and Sprint progress",
    response: "Provide progress report and risk assessment"
  }
};
```

### **Automated Scope Creep Prevention**

#### **Real-Time Scope Monitoring**
```typescript
// Scope creep detection system
const SCOPE_CREEP_DETECTOR = {
  FORBIDDEN_KEYWORDS: [
    "advanced analytics", "machine learning", "predictive", "complex approval",
    "external integration", "mobile app", "native app", "microservices",
    "advanced clustering", "initiative management", "resource planning",
    "complex reporting", "dashboard customization", "user customization"
  ],
  
  SCOPE_VIOLATION_RESPONSE: `
    🚨 SCOPE CREEP DETECTED
    
    The requested feature contains elements outside our MVP scope.
    
    Detected violation: [SPECIFIC_ISSUE]
    
    Our MVP scope is limited to 6 specific features (F1-F6).
    Please review docs/mvp-consensus/FAEVision-MVP-Final-Consensus.md
    
    Options:
    1. Simplify request to fit within current scope
    2. Document as Phase 2 enhancement
    3. Escalate to Product Manager for scope clarification
    
    Would you like me to help implement this within our current MVP boundaries?
  `,
  
  AUTO_ESCALATION: {
    escalateTo: "Product Manager (Sarah Chen)",
    notification: "Scope creep detected and prevented in Cursor session",
    documentation: "Log scope creep attempt for future reference"
  }
};
```

---

## 🎯 **IMPLEMENTATION STRATEGY**

### **Phase 1: Core Configuration (Epic 0)**

#### **Essential Cursor Setup Tasks**
```yaml
Week 0 - Epic 0 Implementation:
  
  Day 1: Foundation Setup
    - [ ] Install and configure .cursorrules with strict MVP enforcement
    - [ ] Set up custom prompt templates for each feature type
    - [ ] Configure expert assignment automation
    - [ ] Test scope validation system
  
  Day 2: Integration Configuration  
    - [ ] Configure Linear-Cursor integration
    - [ ] Set up GitHub workflow integration
    - [ ] Configure Vercel deployment tracking
    - [ ] Test automated expert routing
  
  Day 3: Quality Gate Implementation
    - [ ] Configure automated quality validation
    - [ ] Set up real-time scope monitoring
    - [ ] Configure performance and security checks
    - [ ] Test comprehensive quality pipeline
  
  Day 4: Team Training Preparation
    - [ ] Create team-specific training materials
    - [ ] Set up shared prompt libraries
    - [ ] Configure collaborative development workflows
    - [ ] Prepare scope creep prevention training
  
  Day 5: Validation & Team Training
    - [ ] Complete end-to-end workflow testing
    - [ ] Train all 11 experts on Cursor configuration
    - [ ] Validate scope enforcement with test scenarios
    - [ ] Confirm all experts understand and can use system
```

### **Phase 2: Ongoing Monitoring & Optimization**

#### **Continuous Improvement Process**
```yaml
Daily Monitoring:
  - Scope compliance tracking
  - Expert assignment accuracy
  - Quality gate effectiveness
  - Team adoption and satisfaction

Weekly Optimization:
  - Prompt template refinement
  - Quality rule adjustment
  - Integration enhancement
  - Process improvement based on team feedback

Monthly Evolution:
  - Configuration optimization based on usage data
  - New feature integration and testing
  - Team training updates and enhancement
  - Best practice documentation and sharing
```

---

## 🏆 **SUCCESS METRICS & CONTROL VALIDATION**

### **Scope Control Effectiveness**
```yaml
Scope Control KPIs:
  Scope Compliance Rate: >98% (features stay within F1-F6)
  Scope Creep Prevention: 100% of unauthorized features blocked
  Expert Assignment Accuracy: >95% correct expert routing
  Process Compliance: >90% adherence to Linear-GitHub workflow

Quality Control KPIs:
  Code Quality Score: >8.5/10 average
  Test Coverage: >85% maintained across all features
  Accessibility Compliance: 100% WCAG 2.1 AA compliance
  Performance Standards: 100% compliance with <2s page load, <500ms API

Team Productivity KPIs:
  Development Velocity: 40% improvement with AI assistance
  Quality Assurance: 60% reduction in post-development defects
  Expert Utilization: 70-90% optimal capacity utilization
  Team Satisfaction: >4.5/5 with Cursor control system
```

### **Control System Validation**
```markdown
Weekly Control System Health Check:
- [ ] Scope enforcement preventing unauthorized features
- [ ] Expert assignment routing working correctly
- [ ] Quality gates catching issues before merge
- [ ] Process compliance maintaining workflow standards
- [ ] Team productivity meeting velocity targets
- [ ] Quality standards maintained without compromise

Monthly Control System Review:
- [ ] Configuration optimization based on usage patterns
- [ ] Prompt template effectiveness and refinement
- [ ] Integration health and improvement opportunities
- [ ] Team feedback integration and system enhancement
```

---

## ✅ **CURSOR EXPERT RECOMMENDATION**

Based on deep analysis of our FAEVision MVP requirements, I recommend implementing this **comprehensive Cursor control strategy** that:

### **Prevents Scope Creep**
✅ **Automatic Scope Validation**: Every request checked against approved F1-F6 features  
✅ **Scope Creep Detection**: Real-time monitoring for unauthorized enhancements  
✅ **Escalation Procedures**: Automatic routing to Product Manager for scope questions  
✅ **Documentation Integration**: Continuous reference to approved MVP documentation  

### **Ensures Expert Assignment**
✅ **Intelligent Routing**: Automatic expert assignment based on work type and complexity  
✅ **Mandatory Reviews**: Required expert reviews for specialized areas  
✅ **Workload Balancing**: Expert capacity monitoring and assignment optimization  
✅ **Cross-Expert Coordination**: Automated coordination for multi-expert features  

### **Maintains Quality Standards**
✅ **Comprehensive Quality Gates**: Multi-layer validation for all generated code  
✅ **Real-Time Monitoring**: Continuous quality assessment during development  
✅ **Process Enforcement**: Strict adherence to Linear-GitHub-Vercel workflows  
✅ **Performance Optimization**: Built-in performance and accessibility validation  

This configuration transforms Cursor from a code generation tool into a **comprehensive project control system** that ensures our 11-expert team stays strictly within MVP boundaries while maintaining the highest quality standards and optimal expert coordination.

The system is designed to be **helpful rather than restrictive** - guiding the team toward success while preventing costly scope creep and quality issues that could jeopardize our 11-week delivery timeline.
