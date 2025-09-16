# FAEVision Master Development Prompt

## 🎯 Quick Task Router
**Use this prompt for ALL FAEVision development tasks**

---

## Master Prompt Template
```
I need to work on: [DESCRIBE YOUR TASK]

Please use the @intelligent-task-router to:
1. Validate this task is within our approved F1-F6 MVP scope
2. Assign the appropriate expert based on work type  
3. Route to the correct specialized prompt template
4. Set up required quality gates and success criteria
5. Provide clear next steps for implementation

Current context:
- Linear Issue: [FAE-XXX or "needs creation"]
- Sprint: [Current sprint number]
- Epic: [Current epic or "unknown"]
- Assigned Expert: [Current assignment or "unassigned"]

Task Details:
[PROVIDE SPECIFIC DETAILS ABOUT WHAT YOU WANT TO ACCOMPLISH]
```

---

## Quick Expert Reference
| Work Type | Required Expert | Template |
|-----------|----------------|----------|
| Database changes | Morgan Smith (Database Architect) | @database-development |
| AI features | Dr. Priya Patel (AI Architect) + Jordan Lee (Cursor) | @ai-feature-development |
| Executive interfaces | Sarah Chen (Product) + Marcus Rodriguez (Strategic) | @feature-implementation |
| Frontend/UI | Alex Thompson (Lead Dev) + Maya Rodriguez (UX) + David Chen (Design) | @feature-implementation |
| Infrastructure | Jordan Kim (Vercel) + Taylor Morgan (GitHub) | @feature-implementation |
| Process/Linear | Alex Johnson (Linear Expert) | @expert-assignment-validation |

---

## Scope Quick Check
✅ **APPROVED (F1-F6)**: Input Capture, Collaboration, Organization, Solutions, Requirements, FRD Generation  
❌ **SCOPE CREEP**: Advanced analytics, external integrations, complex workflows, additional user roles

---

## Usage Examples

### Example 1: Simple Feature
```
I need to work on: Create a voting component for input collaboration

Please use the @intelligent-task-router to analyze this task.

Current context:
- Linear Issue: FAE-234
- Sprint: Sprint 2
- Epic: Epic 3 (Collaboration Features)
- Assigned Expert: Alex Thompson (Lead Developer)

Task Details:
Need to implement thumbs up/down voting for inputs with real-time updates and vote count display. Should work on both desktop and mobile interfaces.
```

### Example 2: AI Feature
```
I need to work on: Add AI-powered duplicate detection for input creation

Please use the @intelligent-task-router to analyze this task.

Current context:
- Linear Issue: Needs creation
- Sprint: Sprint 2
- Epic: Epic 2 (Input Capture)
- Assigned Expert: Unassigned

Task Details:
When users create new inputs, check existing inputs for similarity and warn about potential duplicates. Should show confidence score and allow user to proceed or modify.
```

### Example 3: Database Work
```
I need to work on: Add comments table for collaborative features

Please use the @intelligent-task-router to analyze this task.

Current context:
- Linear Issue: FAE-156
- Sprint: Sprint 2
- Epic: Epic 3 (Collaboration)
- Assigned Expert: Morgan Smith (Database Architect)

Task Details:
Need to create comments table with polymorphic relationships to support comments on inputs, solutions, and requirements. Include threading support and @mention functionality.
```

---

## 🚨 Critical Reminders

1. **Always start with this master prompt** for any FAEVision development work
2. **IMPLEMENT ACTUAL CODE** - not just planning or Linear management
3. **Follow expert assignment** - never proceed without proper expert approval
4. **Respect scope boundaries** - escalate scope creep to Product Manager
5. **Use specialized templates** as directed by the router
6. **Complete quality gates** before considering work done
7. **🆕 V2 MANDATORY**: Always use GitHub/Vercel/Linear MCP servers for all operations
8. **🆕 V2 TYPESCRIPT**: Follow strict TypeScript patterns - (prisma as any).modelName for V2 schema
9. **🆕 V2 FEATURES**: Signal/Hotspot/Idea models with PHQ Vision compliance

## ⚠️ DEVELOPMENT FOCUS MANDATE

**PRIMARY GOAL**: Write actual code, create real files, implement features
- ❌ **AVOID**: Only updating Linear issues or creating plans
- ✅ **DO**: Write TypeScript/React code, create components, implement features
- ✅ **DO**: Use search_replace, write, MultiEdit tools to create actual code
- ✅ **DO**: Implement user stories with real, functional code
- ✅ **🆕 V2 DO**: Use explicit type annotations for all array methods (map, reduce, filter)
- ✅ **🆕 V2 DO**: Access V2 models via (prisma as any).modelName pattern for compatibility
- ✅ **🆕 V2 DO**: Track all work via Linear MCP server integration

## 🚨 REGRESSION PREVENTION PROTOCOL

**CRITICAL**: Never delete or remove working code without proper escalation
- ✅ **PRESERVE**: Always backup working code before attempting fixes
- ✅ **BRANCH**: Create experimental branches for risky changes
- ✅ **ESCALATE**: Create Linear issue for technical problems after 1 hour
- ✅ **CONSULT**: Engage Expert Consultants for specialized technical issues
- ✅ **PARALLEL**: Continue Sprint development while solving technical issues
- ❌ **NEVER**: Remove working features to fix build/config issues
- ❌ **NEVER**: Spend >2 hours on non-critical technical configuration

## 🆕 V2 TYPESCRIPT STRICT MODE PATTERNS

**MANDATORY PATTERNS** to prevent build failures:

**1. Array Method Type Annotations:**
```typescript
// ❌ WRONG - Causes implicit 'any' errors
.map(item => ...)
.reduce((acc, item) => ...)
.filter(item => ...)

// ✅ CORRECT - Explicit type annotations
.map((item: any) => ...)
.reduce((acc: Type, item: any) => ...)
.filter((item: any) => ...)
```

**2. V2 Schema Model Access:**
```typescript
// ❌ WRONG - TypeScript compilation errors
await prisma.signal.findMany(...)
await prisma.hotspot.create(...)

// ✅ CORRECT - V2 schema compatibility
await (prisma as any).signal.findMany(...)
await (prisma as any).hotspot.create(...)
```

**3. MCP Server Integration:**
```typescript
// ✅ MANDATORY for all operations
mcp_linear_create_issue(...)
mcp_vercel_list_deployments(...)
mcp_github_check_status(...)
```

---

**Quick Start**: Copy the master prompt template above, fill in your specific task details, and let the intelligent router guide you to the right expert and implementation approach.
