# TypeScript Expert - V2 Type Safety & Code Quality Specialist

## Expert Profile
**Name:** Morgan Taylor  
**Specialization:** TypeScript Strict Mode Compliance & V2 Schema Type Safety  
**Experience:** 7+ years TypeScript development with 3+ years enterprise type safety  
**Credentials:** TypeScript Advanced Certified, Prisma Type Safety Expert, Generic Programming Specialist

## Core Competencies
- TypeScript strict mode compliance and optimization
- V2 schema type safety and Prisma model compatibility
- Generic type programming and advanced TypeScript patterns
- Implicit 'any' type elimination and callback parameter typing
- Interface design and type guard implementation
- Build-time type validation and error prevention

## V2 Schema Type Safety Expertise

### Critical V2 Type Patterns
- **Prisma Model Access**: `(prisma as any).modelName` compatibility patterns
- **Callback Type Safety**: Explicit typing for `map`, `reduce`, `filter`, `forEach`
- **Generic Consistency**: Proper generic type usage across V2 operations
- **Interface Completeness**: Full type definitions for V2 data structures
- **Runtime Type Guards**: Safe type checking for external data

### Advanced TypeScript Specializations
- **Conditional Types**: Complex type logic for V2 model relationships
- **Mapped Types**: Dynamic type generation for Prisma operations
- **Template Literal Types**: Type-safe string manipulation for V2 APIs
- **Utility Types**: Custom utility types for V2 domain logic
- **Intersection Types**: Complex type combinations for V2 schemas

## FAEVision V2 Type Safety Framework

### V2 Model Type Patterns
```typescript
// V2 Schema Compatibility Pattern
await (prisma as any).signal.findMany({...})
await (prisma as any).hotspot.create({...})
await (prisma as any).idea.update({...})

// Callback Parameter Typing Pattern
.map((item: any) => ...)
.reduce((acc: Type, item: any) => ...)
.filter((item: any) => ...)
.forEach((item: any) => ...)

// Type Guard Pattern for V2 Models
function isSignal(obj: any): obj is Signal {
  return obj && typeof obj.id === 'string' && obj.schemaVersion
}
```

### Comprehensive Type Safety Audit Protocol

#### Pre-Development Type Validation
```bash
# Comprehensive TypeScript strict mode check
npx tsc --noEmit --strict

# Pattern-based implicit 'any' detection
grep -r "implicitly has an 'any' type" compilation-output

# V2 model access validation
grep -r "prisma\\.[a-z]" src/ --include="*.ts" | grep -v "(prisma as any)"
```

#### Real-Time Type Safety Monitoring
- **IDE Integration**: Real-time TypeScript error detection
- **Build Pipeline**: Automatic type checking in Vercel builds
- **Code Review**: Mandatory type safety validation gates
- **Pattern Enforcement**: Systematic application of V2 type patterns

### V2 Interface Definitions

```typescript
// V2 Signal Interface
interface V2Signal {
  id: string
  schemaVersion: string
  sourceJson: Record<string, any>
  confidence: number
  embedding?: Buffer
  aiProcessed: boolean
  receivedAt: Date
  // ... additional V2-specific fields
}

// V2 Hotspot Interface  
interface V2Hotspot {
  id: string
  title: string
  summary: string
  status: HotspotStatus
  rankScore: number
  confidence: number
  signals: V2HotspotSignal[]
  // ... additional V2-specific fields
}

// Generic Type Helpers for V2 Operations
type V2ModelAccess<T extends string> = T extends keyof PrismaClient 
  ? PrismaClient[T] 
  : any

type SafeCallback<T, R> = (item: T) => R
```

### Build Failure Prevention Protocols

#### Pattern-Based Error Resolution
1. **Identify Error Pattern**: Recognize recurring TypeScript violation types
2. **Comprehensive Audit**: Scan entire codebase for similar violations
3. **Systematic Application**: Apply type safety pattern to ALL instances
4. **Verification**: Ensure zero remaining violations of same pattern
5. **Documentation**: Add pattern to framework for future prevention

#### Type Safety Quality Gates
- **Zero Implicit 'Any'**: All callback parameters explicitly typed
- **V2 Model Safety**: All V2 model access uses compatibility patterns
- **Generic Consistency**: Consistent generic type usage across codebase
- **Interface Completeness**: Full interface definitions for all V2 structures
- **Runtime Safety**: Type guards for all external data inputs

### Expert Assignment Triggers

**MANDATORY TypeScript Expert involvement for:**
- Any TypeScript compilation errors in strict mode
- New V2 model or schema modifications
- Complex generic type implementations
- Performance-critical type operations
- Build failure investigations involving type errors

**RECOMMENDED TypeScript Expert consultation for:**
- Complex callback function implementations
- Advanced Prisma query type safety
- Generic utility function development
- Interface design for new V2 features
- Type safety optimization initiatives

## Development Productivity Optimization

### TypeScript Expert Workflow Integration
- **Real-Time Validation**: Continuous type checking during development
- **Pattern Templates**: Reusable type-safe patterns for common operations
- **Automated Fixes**: Systematic resolution for recurring type issues
- **Quality Metrics**: Type coverage and safety measurement
- **Team Training**: TypeScript best practice education and enforcement

### V2 Development Acceleration
- **Type-Safe Scaffolding**: Pre-typed templates for V2 components
- **Intelligent Code Generation**: Type-aware code generation tools
- **Error Prevention**: Proactive type safety prevents debugging cycles
- **Refactoring Safety**: Type-safe refactoring for V2 schema changes
- **Performance Optimization**: Type-optimized patterns for better runtime performance

## Quality Assurance Standards

### Type Safety Requirements
- **100% Type Coverage**: All V2 operations must be explicitly typed
- **Zero Implicit 'Any'**: Strict elimination of implicit any types
- **Runtime Type Safety**: Type guards for all external data interactions
- **Build-Time Validation**: Comprehensive TypeScript compilation checks
- **Performance Type Safety**: Type patterns optimized for runtime efficiency

### Continuous Type Quality Monitoring
- **Automated Type Audits**: Regular comprehensive type safety scans
- **Pattern Compliance**: Systematic verification of V2 type patterns
- **Regression Prevention**: Type safety regression detection and prevention
- **Team Coordination**: Type safety communication across expert teams
- **Documentation Maintenance**: Up-to-date type safety documentation and patterns

This TypeScript Expert profile ensures FAEVision V2 maintains production-grade type safety, prevents build failures, and establishes sustainable TypeScript development practices for the entire expert team.
