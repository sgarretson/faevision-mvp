# FAEVision Feature Implementation Template

## 🎯 Scope Validation

**CRITICAL**: Before proceeding, confirm this feature is within our approved F1-F6 scope:

- F1: Input Capture (with strategic tagging)
- F2: Collaborative Engagement (voting, commenting, notifications)
- F3: Intelligent Organization (manual grouping, AI suggestions)
- F4: Solution Execution (creation, tasks, progress tracking)
- F5: Executive Requirements (management with collaboration)
- F6: AI-Generated FRD Handoff (document generation and review)

**If outside scope**: STOP and escalate to Product Manager (Sarah Chen)

## 👥 Expert Assignment Verification

**Required Expert**: [SPECIFY_EXPERT_BASED_ON_WORK_TYPE]

- Database work → Database Architect (Morgan Smith)
- AI features → AI Architect (Dr. Priya Patel) + Cursor Expert (Jordan Lee)
- Executive interfaces → Product Manager (Sarah Chen) + Strategic Consultant (Marcus Rodriguez)
- Frontend UI → Lead Developer (Alex Thompson) + UX Expert (Maya Rodriguez) + Visual Designer (David Chen)
- Infrastructure → Vercel Engineer (Jordan Kim) or GitHub Expert (Taylor Morgan)

**Current Expert**: [CONFIRM_ASSIGNMENT]
**Linear Issue**: FAE-[XXX] - [ISSUE_TITLE]
**Epic Alignment**: Epic [X] - [EPIC_NAME]

## 🔧 Implementation Requirements

### Core Functionality

**Feature**: [FEATURE_NAME]
**User Story**: As a [USER_ROLE], I want [FUNCTIONALITY] so that [BUSINESS_VALUE]

**Acceptance Criteria**:

1. [SPECIFIC_REQUIREMENT_1]
2. [SPECIFIC_REQUIREMENT_2]
3. [SPECIFIC_REQUIREMENT_3]

### Technical Specifications

**Tech Stack Compliance** (LOCKED):

- Frontend: Next.js 14 (App Router), TypeScript strict mode, Tailwind CSS
- State: Zustand (global), SWR (server state)
- Forms: React Hook Form + Zod validation
- Backend: Next.js API Routes, Prisma, Vercel Postgres
- Auth: NextAuth.js v5
- AI: Vercel AI SDK + OpenAI (if applicable)

### Executive UX Requirements

**Executive User Patterns**:

- Dashboard-first information architecture
- F-pattern layout for scanning behavior
- Mobile meeting-friendly (44px touch targets)
- Professional aesthetic building stakeholder confidence
- Quick decision-making support

### Quality Standards (NON-NEGOTIABLE)

**Performance**:

- Page load < 2 seconds
- API response < 500ms
- AI processing < 15 seconds (with progress indicators)
- Mobile performance < 2.5 seconds

**Accessibility**:

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- 4.5:1 color contrast minimum

**Security**:

- Zod validation for all inputs
- JWT token verification for protected routes
- Role-based authorization (Admin/Executive/Contributor)
- Audit logging for all user actions

**Testing**:

- Unit tests with >85% coverage
- Integration tests for API endpoints
- Accessibility testing with axe-core
- Performance testing with Lighthouse

## 🎨 Design System Implementation

### Executive Color System

```css
primary: #3b82f6     /* Executive Blue - trust building */
success: #10b981     /* Professional Green - positive outcomes */
warning: #f59e0b     /* Executive Gold - attention required */
critical: #ef4444    /* Executive Red - urgent issues */
ai-features: #a855f7 /* AI Purple - AI-generated content */
neutral: #6b7280     /* Professional Gray - supporting content */
```

### Component Patterns

- Use Headless UI for accessible components
- Follow executive typography hierarchy
- Implement mobile-first responsive design
- Include loading states and error boundaries
- Add proper ARIA labels and semantic HTML

## 🔄 Implementation Process

### 1. Pre-Implementation Checklist

- [ ] Scope validated against F1-F6 features
- [ ] Appropriate expert assigned and available
- [ ] Linear issue (FAE-XXX) exists and configured
- [ ] Epic alignment confirmed
- [ ] Dependencies identified and coordinated
- [ ] Design review completed (if UI work)

### 2. Development Standards

- [ ] TypeScript strict mode compliance
- [ ] ESLint and Prettier formatting
- [ ] Component and API documentation
- [ ] Error handling and edge cases
- [ ] Loading states and user feedback
- [ ] Responsive design implementation

### 3. Testing Requirements

- [ ] Unit tests written (>85% coverage)
- [ ] Integration tests for APIs
- [ ] Accessibility tests passing
- [ ] Performance benchmarks met
- [ ] Cross-browser compatibility verified

### 4. Quality Gates

- [ ] TypeScript compilation clean
- [ ] All tests passing
- [ ] Accessibility validation (WCAG 2.1 AA)
- [ ] Performance requirements met
- [ ] Security scan clean
- [ ] Expert review approved

### 5. Deployment Readiness

- [ ] PR created with proper description
- [ ] Expert review completed
- [ ] All CI/CD checks passing
- [ ] Documentation updated
- [ ] Linear issue status updated

## 🚨 Common Pitfalls to Avoid

### Scope Creep Indicators

- Adding features not in F1-F6
- "Quick enhancements" outside scope
- Complex business logic beyond MVP needs
- Advanced analytics or reporting
- External system integrations

### Technical Violations

- Using non-approved tech stack
- Skipping TypeScript strict mode
- Missing accessibility compliance
- Performance degradation
- Security vulnerabilities

### Process Violations

- Missing Linear issue tracking
- Wrong expert assignment
- Skipping quality gates
- Incomplete testing coverage
- Missing documentation

## 📋 Implementation Template

```typescript
// Feature: [FEATURE_NAME]
// Expert: [EXPERT_NAME]
// Linear: FAE-[XXX]
// Epic: [EPIC_NUMBER]

/**
 * [FEATURE_DESCRIPTION]
 *
 * @implements F[X]_[FEATURE_SCOPE]
 * @requires [DEPENDENCIES]
 * @accessibility WCAG 2.1 AA compliant
 * @performance <2s page load, <500ms API response
 */

// Implementation follows...
```

**Next Steps**:

1. Confirm all pre-implementation requirements met
2. Implement feature following technical specifications
3. Include comprehensive testing and documentation
4. Submit for expert review and quality validation
5. Deploy following approved workflow

**Remember**: Quality and scope compliance are non-negotiable. When in doubt, escalate to appropriate expert or Product Manager.
