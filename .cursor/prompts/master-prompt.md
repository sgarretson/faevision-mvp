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
2. **Wait for router analysis** before proceeding with implementation
3. **Follow expert assignment** - never proceed without proper expert approval
4. **Respect scope boundaries** - escalate scope creep to Product Manager
5. **Use specialized templates** as directed by the router
6. **Complete quality gates** before considering work done

---

**Quick Start**: Copy the master prompt template above, fill in your specific task details, and let the intelligent router guide you to the right expert and implementation approach.
