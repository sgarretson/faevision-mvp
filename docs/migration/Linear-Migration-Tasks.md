# 📋 LINEAR TASKS - VERCEL PRISMA POSTGRES MIGRATION

## 🎯 EPIC: Database Migration to Vercel Prisma Postgres

**Epic Owner**: Morgan Smith (Database Architect)  
**Timeline**: 3-5 days  
**Risk**: Medium (Database migration)  
**Dependencies**: Vercel project access, environment variable management

---

## 🚀 PHASE 1: PREVIEW ENVIRONMENT MIGRATION

### **FAE-301: Update Prisma Schema for Vercel Compatibility**

**Assignee**: Morgan Smith (Database Architect)  
**Priority**: High  
**Sprint**: Current  
**Story Points**: 3

**Description**: Update the Prisma schema to be fully compatible with Vercel Prisma Postgres, removing Neon-specific configurations.

**Acceptance Criteria**:

- [ ] Remove `directUrl` from Prisma schema
- [ ] Update generator client output path to `../src/generated/prisma`
- [ ] Ensure schema is compatible with Vercel Prisma Postgres
- [ ] Update datasource to use single `DATABASE_URL`
- [ ] Verify schema generates correctly with `npx prisma generate`

**Technical Notes**:

```prisma
// Target configuration
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}
```

---

### **FAE-302: Update Prisma Client Configuration for Vercel**

**Assignee**: Jordan Kim (Vercel Engineer)  
**Priority**: High  
**Sprint**: Current  
**Story Points**: 2  
**Depends On**: FAE-301

**Description**: Update `src/lib/prisma.ts` to use Vercel Prisma Postgres with Accelerate extension.

**Acceptance Criteria**:

- [ ] Import from `../generated/prisma` instead of `@prisma/client`
- [ ] Add `withAccelerate` extension for performance
- [ ] Remove Neon-specific connection configuration
- [ ] Simplify client instantiation for serverless
- [ ] Test connection works in Vercel Preview environment

**Technical Notes**:

```typescript
import { PrismaClient } from '../generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient().$extends(withAccelerate());
```

---

### **FAE-303: Clean Vercel Preview Environment Variables**

**Assignee**: Jordan Kim (Vercel Engineer)  
**Priority**: Critical  
**Sprint**: Current  
**Story Points**: 2

**Description**: Remove all legacy Neon database environment variables and configure clean Vercel Prisma Postgres setup.

**Acceptance Criteria**:

- [ ] Delete 15+ duplicate/legacy environment variables from Vercel Preview
- [ ] Set only essential variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `OPENAI_API_KEY`
- [ ] Use provided Vercel Prisma Postgres connection string
- [ ] Verify Preview environment has clean configuration
- [ ] Test environment variables are correctly loaded

**Variables to Remove**:

```
DATABASE_URL_UNPOOLED, POSTGRES_URL, POSTGRES_URL_NON_POOLING,
POSTGRES_PRISMA_URL, POSTGRES_URL_NO_SSL, PGHOST, PGHOST_UNPOOLED,
PGUSER, PGPASSWORD, PGDATABASE, DIRECT_URL, NEXT_PUBLIC_STACK_PROJECT_ID,
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY, STACK_SECRET_SERVER_KEY
```

---

### **FAE-304: Migrate Preview Database Schema and Seed Data**

**Assignee**: Morgan Smith (Database Architect)  
**Priority**: High  
**Sprint**: Current  
**Story Points**: 3  
**Depends On**: FAE-301, FAE-302, FAE-303

**Description**: Push schema to Vercel Prisma Postgres and seed with initial admin user data.

**Acceptance Criteria**:

- [ ] Run `npx prisma db push` to create schema in Vercel Prisma Postgres
- [ ] Create TypeScript seed script replacing legacy JavaScript version
- [ ] Seed admin user: `admin@faevision.com` / `FAEVision2025!`
- [ ] Verify database tables created correctly
- [ ] Test admin login works in Preview environment

**Deliverables**:

- Updated `prisma/seed.ts` (TypeScript version)
- Verified admin user in Preview database
- Database schema matching current requirements

---

### **FAE-305: Update Auth.js Configuration for Vercel Prisma Postgres**

**Assignee**: Dr. Priya Patel (AI Architect) + Jordan Lee (Cursor Expert)  
**Priority**: High  
**Sprint**: Current  
**Story Points**: 2  
**Depends On**: FAE-304

**Description**: Simplify Auth.js configuration to use standard Prisma client without dedicated instances.

**Acceptance Criteria**:

- [ ] Remove dedicated `authPrisma` client from `src/lib/auth.ts`
- [ ] Use standard Prisma client with Vercel Prisma Postgres
- [ ] Remove excessive debugging logs (keep essential only)
- [ ] Test authentication flow works in Preview
- [ ] Verify session persistence

**Technical Notes**:

- Remove complex Prisma client instantiation within Auth.js
- Use singleton Prisma client for consistency
- Maintain error handling but reduce verbosity

---

## 🚀 PHASE 2: LEGACY CLEANUP

### **FAE-306: Remove Legacy Debug Endpoints and Scripts**

**Assignee**: Jordan Lee (Cursor Expert)  
**Priority**: Medium  
**Sprint**: Current + 1  
**Story Points**: 2  
**Depends On**: FAE-305

**Description**: Remove all Neon-specific debug endpoints and emergency scripts that are no longer needed.

**Acceptance Criteria**:

- [ ] Delete `src/app/api/debug-actual-db/route.ts`
- [ ] Delete `src/app/api/debug-env/route.ts`
- [ ] Delete `src/app/api/test-auth/route.ts`
- [ ] Delete `scripts/emergency-reseed-preview.js`
- [ ] Delete `scripts/emergency-runtime-database-test.js`
- [ ] Delete `docs/deployment/EMERGENCY-Preview-Only-Configuration.md`
- [ ] Update `.gitignore` if needed

**Files to Remove**:

```
src/app/api/debug-actual-db/route.ts
src/app/api/debug-env/route.ts
src/app/api/test-auth/route.ts
scripts/emergency-reseed-preview.js
scripts/emergency-runtime-database-test.js
docs/deployment/EMERGENCY-Preview-Only-Configuration.md
```

---

### **FAE-307: Update Documentation for Vercel Prisma Postgres**

**Assignee**: Sarah Chen (Product Manager) + Marcus Rodriguez (Strategic Consultant)  
**Priority**: Medium  
**Sprint**: Current + 1  
**Story Points**: 2

**Description**: Update all documentation to reflect new Vercel Prisma Postgres setup and remove Neon references.

**Acceptance Criteria**:

- [ ] Update `docs/deployment/Vercel-Environment-Variables-Configuration.md`
- [ ] Update `docs/architecture/FAEVision-Technical-Architecture.md`
- [ ] Create new setup guide for Vercel Prisma Postgres
- [ ] Remove Neon-specific documentation
- [ ] Update README with new database setup instructions

---

## 🚀 PHASE 3: DEVELOPMENT & PRODUCTION MIGRATION

### **FAE-308: Migrate Development Environment**

**Assignee**: Jordan Kim (Vercel Engineer) + Alex Thompson (Lead Developer)  
**Priority**: Medium  
**Sprint**: Current + 1  
**Story Points**: 3  
**Depends On**: FAE-305

**Description**: Set up local development environment to use Vercel Prisma Postgres.

**Acceptance Criteria**:

- [ ] Run `vercel link` to connect local project
- [ ] Run `vercel env pull .env.development.local` to get development DATABASE_URL
- [ ] Update local environment configuration
- [ ] Test local development workflow
- [ ] Verify hot reload and database changes work

---

### **FAE-309: Plan Production Migration Strategy**

**Assignee**: Morgan Smith (Database Architect) + Sarah Chen (Product Manager)  
**Priority**: Low  
**Sprint**: Current + 2  
**Story Points**: 5  
**Depends On**: FAE-308

**Description**: Plan and execute production environment migration to Vercel Prisma Postgres.

**Acceptance Criteria**:

- [ ] Create production migration plan
- [ ] Set up production Vercel Prisma Postgres instance
- [ ] Plan data migration from existing production (if any)
- [ ] Create rollback procedures
- [ ] Execute migration with zero downtime
- [ ] Verify production functionality

---

## 📊 TESTING & VALIDATION TASKS

### **FAE-310: Create Migration Validation Suite**

**Assignee**: Alex Thompson (Lead Developer) + Maya Rodriguez (UX Expert)  
**Priority**: Medium  
**Sprint**: Current + 1  
**Story Points**: 3

**Description**: Create comprehensive testing suite to validate migration success across all environments.

**Acceptance Criteria**:

- [ ] Database connectivity tests
- [ ] Authentication flow tests
- [ ] Performance benchmark tests
- [ ] Feature functionality tests
- [ ] Cross-environment validation
- [ ] Rollback procedure tests

---

## 🎯 SUCCESS METRICS

### Definition of Done for Migration:

- [ ] Preview environment fully migrated and functional
- [ ] All legacy Neon configurations removed
- [ ] Authentication works: `admin@faevision.com` / `FAEVision2025!`
- [ ] CSS and styling working correctly
- [ ] No environment variable conflicts
- [ ] Database performance <500ms for queries
- [ ] Zero regression in existing functionality

### Phase Completion Criteria:

- **Phase 1**: Preview environment migration complete and validated
- **Phase 2**: All legacy code and configuration removed
- **Phase 3**: Development and Production environments migrated

---

**EPIC OWNER**: Morgan Smith (Database Architect)  
**PROJECT MANAGER**: Sarah Chen  
**QUALITY ASSURANCE**: Jordan Lee (Cursor Expert)  
**VERCEL SPECIALIST**: Jordan Kim (Vercel Engineer)
