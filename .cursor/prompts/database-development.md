# FAEVision Database Development Template

## 🗄️ Database Architecture Control
**MANDATORY DATABASE ARCHITECT LEADERSHIP**: Morgan Smith (NO EXCEPTIONS)

### Locked Database Architecture
```typescript
// LOCKED DATABASE STACK - NO DEVIATIONS PERMITTED
database: "PostgreSQL via Vercel Postgres ONLY"
orm: "Prisma ONLY - no other database libraries"
migrations: "Prisma Migrate ONLY"
connection: "Prisma Client with connection pooling"
hosting: "Vercel Postgres ONLY - no other database hosts"
backup: "Vercel automated backups"
monitoring: "Prisma query monitoring + Vercel analytics"
```

**CRITICAL**: All database changes require Database Architect (Morgan Smith) approval before implementation.

## 📊 Approved Database Schema (LOCKED)

### Core Entity Model
```prisma
// FAEVision MVP Database Schema v1.0
// Database Architect: Morgan Smith
// Last Updated: September 2025

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Core Entities (F1-F6 Features)
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  role        UserRole @default(CONTRIBUTOR)
  department  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationships
  inputs      Input[]
  solutions   Solution[]
  comments    Comment[]
  votes       Vote[]
  requirements Requirement[]
  frd_documents FRDDocument[]
  audit_logs  AuditLog[]
  
  @@map("users")
}

model Input {
  id          String    @id @default(cuid())
  title       String
  description String
  type        InputType @default(GENERAL)
  
  // Strategic Tagging (F1)
  department    String?
  issue_type    String?
  root_cause    String?
  priority      Priority @default(MEDIUM)
  
  // AI Enhancement
  ai_tags       Json?     // AI-suggested tags
  ai_confidence Float?    // AI confidence score
  
  // Metadata
  status        InputStatus @default(ACTIVE)
  created_by    String
  created_at    DateTime    @default(now())
  updated_at    DateTime    @updatedAt
  
  // Relationships
  creator       User        @relation(fields: [created_by], references: [id])
  comments      Comment[]
  votes         Vote[]
  solutions     Solution[]
  groups        InputGroup[]
  
  @@map("inputs")
}

model Solution {
  id            String   @id @default(cuid())
  title         String
  description   String
  status        SolutionStatus @default(DRAFT)
  
  // Task Management (F4)
  tasks         Json?    // Task breakdown structure
  progress      Float    @default(0.0) // 0.0 to 1.0
  target_date   DateTime?
  
  // Relationships
  input_id      String
  created_by    String
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  
  input         Input    @relation(fields: [input_id], references: [id])
  creator       User     @relation(fields: [created_by], references: [id])
  comments      Comment[]
  votes         Vote[]
  requirements  Requirement[]
  frd_documents FRDDocument[]
  
  @@map("solutions")
}

model Requirement {
  id            String   @id @default(cuid())
  title         String
  description   String
  acceptance_criteria Json // Array of criteria
  priority      Priority @default(MEDIUM)
  status        RequirementStatus @default(DRAFT)
  
  // Executive Requirements (F5)
  estimated_effort String?
  dependencies     Json?   // Array of dependencies
  business_value   String?
  
  // Relationships
  solution_id   String
  created_by    String
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  
  solution      Solution @relation(fields: [solution_id], references: [id])
  creator       User     @relation(fields: [created_by], references: [id])
  comments      Comment[]
  votes         Vote[]
  
  @@map("requirements")
}

model FRDDocument {
  id               String   @id @default(cuid())
  title            String
  content          Json     // Full FRD structure
  ai_generated     Boolean  @default(false)
  ai_confidence    Float?
  
  // Document Management (F6)
  version          String   @default("1.0")
  status           FRDStatus @default(DRAFT)
  executive_approved Boolean @default(false)
  export_formats   Json?    // Available export formats
  
  // Relationships
  solution_id      String
  created_by       String
  approved_by      String?
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt
  
  solution         Solution @relation(fields: [solution_id], references: [id])
  creator          User     @relation(fields: [created_by], references: [id])
  approver         User?    @relation("FRDApprover", fields: [approved_by], references: [id])
  
  @@map("frd_documents")
}

// Collaboration Features (F2)
model Comment {
  id          String    @id @default(cuid())
  content     String
  entity_type EntityType // input, solution, requirement
  entity_id   String
  
  // Metadata
  created_by  String
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt
  
  // Relationships
  creator     User      @relation(fields: [created_by], references: [id])
  
  @@map("comments")
}

model Vote {
  id          String    @id @default(cuid())
  value       VoteValue // UP, DOWN
  entity_type EntityType
  entity_id   String
  
  // Metadata
  created_by  String
  created_at  DateTime  @default(now())
  
  // Relationships
  creator     User      @relation(fields: [created_by], references: [id])
  
  @@unique([entity_type, entity_id, created_by])
  @@map("votes")
}

// Organization Features (F3)
model InputGroup {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String?  // Hex color for visual organization
  
  // AI Enhancement
  ai_suggested Boolean @default(false)
  ai_confidence Float?
  
  // Metadata
  created_by  String
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  
  // Relationships
  creator     User     @relation(fields: [created_by], references: [id])
  inputs      Input[]
  
  @@map("input_groups")
}

// System Management
model AuditLog {
  id          String   @id @default(cuid())
  action      String   // CREATE, UPDATE, DELETE, etc.
  entity_type String   // input, solution, etc.
  entity_id   String
  changes     Json?    // What was changed
  
  // Metadata
  user_id     String
  ip_address  String?
  user_agent  String?
  created_at  DateTime @default(now())
  
  // Relationships
  user        User     @relation(fields: [user_id], references: [id])
  
  @@map("audit_logs")
}

// Enums
enum UserRole {
  ADMIN
  EXECUTIVE
  CONTRIBUTOR
}

enum InputType {
  PROBLEM
  OPPORTUNITY
  GENERAL
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum InputStatus {
  ACTIVE
  RESOLVED
  ARCHIVED
}

enum SolutionStatus {
  DRAFT
  IN_PROGRESS
  IMPLEMENTED
  CANCELLED
}

enum RequirementStatus {
  DRAFT
  APPROVED
  REJECTED
  IMPLEMENTED
}

enum FRDStatus {
  DRAFT
  REVIEW
  APPROVED
  DELIVERED
}

enum EntityType {
  INPUT
  SOLUTION
  REQUIREMENT
}

enum VoteValue {
  UP
  DOWN
}
```

## 🚀 Database Performance Requirements

### Executive Performance Standards (NON-NEGOTIABLE)
```typescript
const DATABASE_PERFORMANCE = {
  query_response: "< 100ms for simple queries, < 500ms for complex queries",
  page_load: "< 2 seconds including database queries",
  concurrent_users: "50 executive users with no performance degradation",
  data_integrity: "100% ACID compliance for all transactions",
  availability: "99.9% uptime requirement"
};
```

### Required Database Optimizations
```typescript
const OPTIMIZATION_REQUIREMENTS = [
  // Indexing Strategy
  "Composite indexes on frequently queried combinations",
  "Full-text search indexes for input/solution content",
  "Performance indexes on created_at, updated_at columns",
  "Foreign key indexes for relationship queries",
  
  // Query Optimization
  "Prisma query optimization with select/include patterns",
  "Connection pooling for optimal resource usage",
  "Pagination for large dataset queries",
  "Caching strategy for frequently accessed data",
  
  // Data Management
  "Efficient JSON field usage for flexible data",
  "Proper enum usage for constrained values",
  "Audit logging without performance impact",
  "Automated cleanup for old audit logs"
];
```

## 🔒 Database Security Requirements

### Data Protection (MANDATORY)
```typescript
const DATABASE_SECURITY = {
  encryption: {
    at_rest: "All data encrypted at rest via Vercel Postgres",
    in_transit: "SSL/TLS encryption for all connections",
    sensitive_fields: "Additional encryption for PII data"
  },
  
  access_control: {
    authentication: "Database access only via Prisma with JWT validation",
    authorization: "Role-based access control at application layer",
    audit_logging: "All database operations logged with user context",
    connection_security: "Secure connection strings and environment variables"
  },
  
  data_integrity: {
    foreign_keys: "Referential integrity enforced at database level",
    constraints: "Data validation constraints for critical fields",
    transactions: "ACID compliance for multi-table operations",
    backup_strategy: "Automated daily backups with point-in-time recovery"
  }
};
```

## 📝 Database Development Process

### Mandatory Process (Database Architect Approval Required)
```typescript
const DATABASE_WORKFLOW = {
  schema_changes: {
    planning: "Database Architect (Morgan Smith) reviews all schema changes",
    migration: "Prisma migrations reviewed and approved before deployment",
    testing: "Migration testing in development environment required",
    rollback: "Rollback plan documented for all schema changes"
  },
  
  query_development: {
    optimization: "All complex queries reviewed for performance impact",
    indexing: "Index strategy evaluated for new query patterns",
    caching: "Caching strategy defined for frequently accessed data",
    monitoring: "Query performance monitoring and alerting configured"
  },
  
  quality_assurance: {
    testing: "Database integration tests for all new functionality",
    performance: "Load testing for new database operations",
    security: "Security review for data access patterns",
    documentation: "Database changes documented in schema documentation"
  }
};
```

## 🧪 Database Testing Requirements

### Comprehensive Database Testing
```typescript
const DATABASE_TESTING = {
  unit_tests: [
    "Prisma model validation and constraints",
    "Database query correctness and results",
    "Migration up/down functionality",
    "Data transformation and serialization"
  ],
  
  integration_tests: [
    "API endpoint database interactions", 
    "Transaction handling and rollback scenarios",
    "Concurrent user database operations",
    "Full-text search functionality"
  ],
  
  performance_tests: [
    "Query performance under load",
    "Database connection pool efficiency",
    "Large dataset pagination performance",
    "Concurrent read/write operations"
  ],
  
  security_tests: [
    "SQL injection prevention validation",
    "Role-based access control testing",
    "Data encryption verification",
    "Audit logging completeness"
  ]
};
```

## 📊 Database Monitoring and Maintenance

### Production Monitoring (REQUIRED)
```typescript
const DATABASE_MONITORING = {
  performance_metrics: [
    "Query execution time tracking",
    "Connection pool utilization",
    "Database CPU and memory usage",
    "Slow query identification and alerting"
  ],
  
  health_monitoring: [
    "Database availability and uptime",
    "Replication lag and data consistency",
    "Backup success and recovery testing",
    "Storage usage and growth trends"
  ],
  
  security_monitoring: [
    "Unauthorized access attempt detection",
    "Unusual query pattern identification",
    "Data access audit trail maintenance",
    "Encryption status and certificate expiry"
  ]
};
```

## 🚨 Database Development Checklist

### Pre-Implementation (MANDATORY)
- [ ] Database Architect (Morgan Smith) assigned and consulted
- [ ] Schema changes reviewed and approved by Database Architect
- [ ] Migration strategy planned and documented
- [ ] Performance impact assessed and optimized
- [ ] Security implications reviewed and addressed

### Implementation Standards
- [ ] Prisma ORM used exclusively (no raw SQL without approval)
- [ ] Proper indexing strategy implemented
- [ ] Query optimization verified and documented
- [ ] Transaction handling implemented correctly
- [ ] Error handling and rollback mechanisms in place

### Quality Validation
- [ ] Database integration tests written and passing
- [ ] Performance benchmarks met (<100ms simple, <500ms complex queries)
- [ ] Security review completed (access control, encryption, audit logging)
- [ ] Migration testing completed in development environment
- [ ] Documentation updated with schema and query changes

### Deployment Readiness
- [ ] Database Architect final approval received
- [ ] Migration rollback plan documented and tested
- [ ] Production monitoring and alerting configured
- [ ] Backup and recovery procedures validated
- [ ] Team training completed for new database features

## 🚨 Database-Specific Pitfalls to Avoid

### Schema Design Pitfalls
- Making schema changes without Database Architect approval
- Missing proper indexing for performance-critical queries
- Inadequate foreign key constraints and data integrity
- Poor JSON field design leading to query inefficiency
- Missing audit logging for compliance requirements

### Performance Pitfalls
- N+1 query problems with Prisma relationships
- Missing pagination for large dataset queries
- Inefficient JSON field querying and filtering
- Inadequate connection pooling configuration
- Missing query performance monitoring

### Security Pitfalls
- Raw SQL queries bypassing Prisma security
- Missing role-based access control validation
- Inadequate audit logging for security compliance
- Unencrypted sensitive data storage
- Missing backup and recovery testing

### Process Pitfalls
- Bypassing Database Architect review for schema changes
- Deploying migrations without proper testing
- Missing rollback plans for database changes
- Inadequate documentation of database decisions
- Skipping performance and security testing

**Remember**: Database integrity and performance are critical for executive user experience. All database work requires Database Architect (Morgan Smith) leadership and approval. When in doubt, consult before proceeding.
