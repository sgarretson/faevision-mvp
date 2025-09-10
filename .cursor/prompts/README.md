# FAEVision MVP - Cursor Control System

## 🎯 Complete Cursor Configuration Overview

This directory contains the comprehensive Cursor AI development control system for FAEVision MVP, designed to enforce scope compliance, ensure quality standards, and optimize expert coordination throughout our 11-week delivery timeline.

## 📁 Configuration Files

### Core Configuration
- **`.cursorrules`** - Master configuration file with scope enforcement, quality gates, and process compliance
- **`README.md`** - This overview and usage guide

### Intelligent Routing System
- **`master-prompt.md`** - **START HERE** - Quick master prompt for all development tasks
- **`intelligent-task-router.md`** - Advanced AI router that analyzes tasks and assigns experts

### Specialized Prompt Templates
- **`feature-implementation.md`** - General feature development template with scope validation
- **`ai-feature-development.md`** - AI-specific development with mandatory AI Architect leadership
- **`database-development.md`** - Database work requiring Database Architect approval
- **`expert-assignment-validation.md`** - Expert assignment automation and validation rules
- **`background-agent-monitoring.md`** - Continuous monitoring and quality assurance configuration

## 🚀 Quick Start Guide

### 1. Configuration Activation
The `.cursorrules` file is automatically active in this workspace. All Cursor AI interactions will follow these rules.

### 2. Start with Master Prompt
**Always begin with the master prompt for ANY development task:**
```
@master-prompt    # USE THIS FIRST - Routes to appropriate expert and template
```

### 3. Intelligent Routing System
The system automatically:
1. **Analyzes your task** for scope, complexity, and work type
2. **Validates against F1-F6 scope** and prevents scope creep
3. **Assigns appropriate expert** based on work requirements
4. **Routes to specialized template** for detailed implementation
5. **Sets up quality gates** and success criteria

### 4. Specialized Templates (Auto-Selected)
```
@feature-implementation    # General feature development
@ai-feature-development   # AI features (requires AI Architect)
@database-development     # Database work (requires Database Architect)
@expert-assignment        # Expert assignment validation
@background-monitoring    # Continuous quality monitoring
@intelligent-task-router  # Advanced task analysis and routing
```

### 5. Development Workflow
1. **Start with Master Prompt**: Use @master-prompt for all tasks
2. **Follow Router Guidance**: Let the intelligent router analyze and assign
3. **Use Assigned Template**: Follow the specialized template provided
4. **Complete Quality Gates**: Meet all performance, accessibility, security standards
5. **Expert Review Required**: Mandatory expert review before merge

## 🎯 Control System Features

### Scope Creep Prevention
- ✅ **Automatic Scope Validation** against approved F1-F6 features
- ✅ **Real-Time Monitoring** for unauthorized enhancements
- ✅ **Immediate Halt** on scope violations with escalation to Product Manager
- ✅ **Enhancement Documentation** for Phase 2 consideration

### Expert Assignment Automation
- ✅ **Mandatory Expert Routing** for specialized work
- ✅ **Workload Monitoring** preventing expert overload
- ✅ **Cross-Expert Coordination** for complex features
- ✅ **Quality Review Assignment** ensuring appropriate expertise

### Quality Gate Enforcement
- ✅ **Performance Standards** (<2s page load, <500ms API response)
- ✅ **Accessibility Compliance** (WCAG 2.1 AA)
- ✅ **Security Validation** (Zod validation, JWT tokens, audit logging)
- ✅ **Test Coverage** (>85% code coverage requirement)

### Executive UX Optimization
- ✅ **Dashboard-First Architecture** for executive scanning behavior
- ✅ **Professional Aesthetics** building stakeholder confidence
- ✅ **Mobile Executive Patterns** for meeting-friendly capture
- ✅ **AI Transparency** with confidence scoring and human override

## 🔒 Locked Technical Standards

### Frontend (NON-NEGOTIABLE)
```typescript
framework: "Next.js 14 with App Router ONLY"
language: "TypeScript strict mode ONLY"
styling: "Tailwind CSS with FAEVision design system ONLY"
state: "Zustand for global, SWR for server state ONLY"
forms: "React Hook Form with Zod validation ONLY"
```

### Backend (NON-NEGOTIABLE)
```typescript
api: "Next.js API Routes ONLY"
database: "Prisma ORM with Vercel Postgres ONLY"
auth: "NextAuth.js v5 ONLY"
ai: "Vercel AI SDK with OpenAI ONLY"
email: "Resend ONLY"
```

### Deployment (NON-NEGOTIABLE)
```typescript
platform: "Vercel ONLY"
monitoring: "Vercel Analytics + Sentry ONLY"
ci_cd: "GitHub Actions with Vercel integration ONLY"
```

## 👥 Expert Assignment Matrix

| Work Type | Required Expert | Support Expert | Escalation |
|-----------|----------------|----------------|------------|
| Database Schema/Queries | Morgan Smith (Database Architect) | - | NO EXCEPTIONS |
| AI Features | Dr. Priya Patel (AI Architect) | Jordan Lee (Cursor Expert) | ALL AI WORK |
| Executive Interfaces | Sarah Chen (Product Manager) | Marcus Rodriguez (Strategic) | BUSINESS LOGIC |
| Frontend Components | Alex Thompson (Lead Developer) | Maya Rodriguez (UX) + David Chen (Design) | UI/UX WORK |
| Infrastructure | Jordan Kim (Vercel Engineer) | Taylor Morgan (GitHub Expert) | PLATFORM WORK |
| Project Management | Alex Johnson (Linear Expert) | Sarah Chen (Product Manager) | PROCESS ISSUES |

## 🚨 Critical Success Factors

### Scope Compliance (>98% Target)
- All features must fit within F1-F6 boundaries
- No additional features without Product Manager approval
- Enhancement ideas documented for Phase 2
- Immediate escalation for scope boundary questions

### Quality Standards (100% Compliance)
- Page load times <2 seconds on 3G
- API response times <500ms
- WCAG 2.1 AA accessibility compliance
- Zero security vulnerabilities in production

### Expert Coordination (>95% Accuracy)
- Correct expert assignment for all work types
- Mandatory expert reviews completed
- Cross-expert dependencies identified and managed
- Expert workload balanced and optimized

### Process Adherence (>90% Compliance)
- All work starts from Linear issues (FAE-XXX format)
- GitHub workflow followed (branch → PR → review → merge)
- Quality gates passed before merge
- Documentation maintained and updated

## 📊 Monitoring and Metrics

### Real-Time Monitoring
- **Scope Violations**: Automatic detection and immediate alerts
- **Quality Gate Status**: Continuous validation during development
- **Expert Assignment**: Real-time validation and correction
- **Performance Metrics**: Ongoing monitoring of Core Web Vitals

### Daily Reporting
- **Development Velocity**: Progress against Sprint goals
- **Quality Trends**: Code quality and test coverage metrics
- **Expert Utilization**: Workload distribution and availability
- **Process Compliance**: Workflow adherence and deviation tracking

### Weekly Analysis
- **Scope Creep Trends**: Pattern analysis and prevention optimization
- **Quality Improvements**: Standards enhancement opportunities
- **Expert Coordination**: Collaboration effectiveness and optimization
- **Process Evolution**: Workflow refinement based on learnings

## 🔧 Configuration Customization

### Adjusting Thresholds
Quality and performance thresholds can be adjusted in `.cursorrules`:
```typescript
PERFORMANCE_ENFORCEMENT: {
  page_load: "< 2 seconds", // Adjust as needed
  api_response: "< 500ms",  // Adjust as needed
  ai_processing: "< 15 seconds" // Adjust as needed
}
```

### Adding Expert Specializations
New expert assignments can be added to `expert-assignment-validation.md`:
```typescript
const NEW_EXPERT = {
  name: "Expert Name",
  role: "Expert Role",
  mandatory_for: ["specific work types"],
  trigger_keywords: ["relevant keywords"],
  assignment_rule: "Assignment requirements"
};
```

### Custom Prompt Templates
Create new templates following the established pattern:
1. Scope validation section
2. Expert assignment verification
3. Technical requirements
4. Quality standards
5. Implementation checklist

## 🚀 Success Metrics

### Target Outcomes
- **11-Week Delivery**: On-time MVP delivery for 50 executive users
- **Zero Scope Creep**: 100% compliance with F1-F6 feature boundaries
- **Executive Satisfaction**: >4.5/5 user satisfaction with executive-focused design
- **Quality Excellence**: >95% quality gate pass rate with minimal rework

### Continuous Improvement
- **Weekly Optimization**: Process refinement based on team feedback
- **Monthly Evolution**: Configuration updates based on learnings
- **Quarterly Innovation**: Advanced automation and workflow enhancement
- **Post-MVP Analysis**: Comprehensive review for future project optimization

## 🎯 Getting Started

1. **Review Configuration**: Familiarize yourself with `.cursorrules` requirements
2. **Understand Templates**: Review relevant prompt templates for your work type
3. **Validate Assignment**: Confirm appropriate expert assignment in Linear
4. **Check Scope**: Ensure work fits within approved F1-F6 boundaries
5. **Follow Workflow**: Adhere to Linear → GitHub → Expert Review → Merge process

**Remember**: This control system ensures our 11-expert team delivers a production-ready FAEVision MVP within our timeline while maintaining the highest quality standards for executive users. Trust the system, follow the processes, and escalate when in doubt.

**Success depends on strict adherence to these controls and continuous team collaboration.**
