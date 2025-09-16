# 🎯 EPIC FAE-300: Vercel Prisma Postgres Migration

## Epic Overview

**Epic ID**: FAE-300  
**Title**: Migrate from Neon to Vercel Prisma Postgres  
**Owner**: Morgan Smith (Database Architect)  
**Timeline**: 3-5 days  
**Status**: In Progress  
**Priority**: High

**Description**: Complete migration from legacy Neon PostgreSQL to Vercel Prisma Postgres for improved performance, simplified configuration, and better Vercel integration.

**Business Justification**:

- Eliminate environment variable conflicts causing authentication failures
- Improve database performance with Prisma Accelerate
- Simplify deployment and configuration management
- Reduce technical debt from legacy Neon setup

---

## 🚀 Phase 1 Tasks (ACTIVE - Preview Environment)

### ✅ FAE-301: Update Prisma Schema for Vercel Compatibility

**Status**: ✅ COMPLETED  
**Assignee**: Morgan Smith (Database Architect)  
**Completed**: 2025-09-16

**Deliverables**:

- [x] Removed `directUrl` from Prisma schema
- [x] Updated generator client output path to `../src/generated/prisma`
- [x] Verified schema compatibility with Vercel Prisma Postgres
- [x] Maintained all F1-F6 feature requirements

---

### ✅ FAE-302: Update Prisma Client Configuration

**Status**: ✅ COMPLETED  
**Assignee**: Jordan Kim (Vercel Engineer)  
**Completed**: 2025-09-16

**Deliverables**:

- [x] Added `@prisma/extension-accelerate` for performance
- [x] Updated import path to `../generated/prisma`
- [x] Simplified client configuration for serverless
- [x] Removed Neon-specific connection overrides

---

### 🚧 FAE-303: Clean Vercel Preview Environment Variables

**Status**: 🚧 IN PROGRESS  
**Assignee**: Jordan Kim (Vercel Engineer)  
**Priority**: CRITICAL  
**Estimate**: 15 minutes

**Acceptance Criteria**:

- [ ] **MANUAL ACTION**: Delete 15+ legacy environment variables from Vercel Dashboard
- [ ] Set only 4 essential variables for Preview environment
- [ ] Verify clean configuration in Vercel settings
- [ ] Test environment variables load correctly

**Variables to DELETE**:

```
DATABASE_URL_UNPOOLED, POSTGRES_URL, POSTGRES_URL_NON_POOLING,
POSTGRES_PRISMA_URL, POSTGRES_URL_NO_SSL, PGHOST, PGHOST_UNPOOLED,
PGUSER, PGPASSWORD, PGDATABASE, DIRECT_URL,
NEXT_PUBLIC_STACK_PROJECT_ID, NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
STACK_SECRET_SERVER_KEY
```

**Variables to SET**:

```bash
DATABASE_URL=postgres://f279b9e46e7c0166b4949c4f910079cd6f0cbb7ae03a783a14b933638f1ba0ce:sk_paIQiDGXmKNC6q0ngZD0i@db.prisma.io:5432/postgres?sslmode=require
NEXTAUTH_SECRET=preview-secret-faevision-separate-2025
NEXTAUTH_URL=https://faevision-simplified-git-preview.vercel.app
OPENAI_API_KEY=[Your OpenAI Key]
```

---

### 🚧 FAE-304: Deploy Database Schema and Seed Data

**Status**: 🚧 BLOCKED (Waiting for FAE-303)  
**Assignee**: Morgan Smith (Database Architect)  
**Priority**: High  
**Estimate**: 10 minutes

**Acceptance Criteria**:

- [ ] Run schema deployment script: `node scripts/deploy-vercel-prisma-postgres.js`
- [ ] Push schema to Vercel Prisma Postgres with `npx prisma db push`
- [ ] Seed database with TypeScript seed script
- [ ] Verify admin user created: `admin@faevision.com`
- [ ] Confirm database connection and user count

**Commands to Execute**:

```bash
# After FAE-303 is complete
node scripts/deploy-vercel-prisma-postgres.js
```

---

### ✅ FAE-305: Simplify Auth.js Configuration

**Status**: ✅ COMPLETED  
**Assignee**: Dr. Priya Patel (AI Architect) + Jordan Lee (Cursor Expert)  
**Completed**: 2025-09-16

**Deliverables**:

- [x] Removed dedicated `authPrisma` client complexity
- [x] Updated to use singleton Prisma client with Accelerate
- [x] Simplified Auth.js configuration for Vercel
- [x] Maintained all authentication functionality

---

### 🔮 FAE-306: Verify Phase 1 Success

**Status**: 🔮 PENDING (Waiting for FAE-304)  
**Assignee**: All Expert Team  
**Priority**: Critical  
**Estimate**: 10 minutes

**Acceptance Criteria**:

- [ ] Preview environment accessible: https://faevision-simplified-git-preview.vercel.app
- [ ] Admin login successful: `admin@faevision.com` / `FAEVision2025!`
- [ ] CSS styling loads correctly (no unstyled pages)
- [ ] No authentication errors in logs
- [ ] Database queries perform well (<500ms)

**Success Metrics**:

- ✅ Authentication success rate: 100%
- ✅ Page load time: <2 seconds
- ✅ Database query time: <500ms
- ✅ Zero environment variable conflicts

---

## 🧹 Phase 2 Tasks (CLEANUP - Legacy Removal)

### FAE-307: Remove Legacy Debug Endpoints

**Status**: 📋 PLANNED  
**Assignee**: Jordan Lee (Cursor Expert)  
**Priority**: Medium  
**Estimate**: 1 hour

**Files to Remove**:

- `src/app/api/debug-actual-db/route.ts`
- `src/app/api/debug-env/route.ts`
- `src/app/api/test-auth/route.ts`
- `scripts/emergency-reseed-preview.js`
- `scripts/emergency-runtime-database-test.js`
- `docs/deployment/EMERGENCY-Preview-Only-Configuration.md`

---

### FAE-308: Update Documentation

**Status**: 📋 PLANNED  
**Assignee**: Sarah Chen (Product Manager) + Marcus Rodriguez (Strategic Consultant)  
**Priority**: Medium  
**Estimate**: 2 hours

**Documentation Updates**:

- Update deployment guides for Vercel Prisma Postgres
- Remove Neon-specific instructions
- Create new setup guide for development environment
- Update architecture documentation

---

## 🌍 Phase 3 Tasks (FULL MIGRATION - Dev & Production)

### FAE-309: Migrate Development Environment

**Status**: 📋 PLANNED  
**Assignee**: Jordan Kim (Vercel Engineer) + Alex Thompson (Lead Developer)  
**Priority**: Medium  
**Estimate**: 3 hours

**Acceptance Criteria**:

- [ ] Set up local development with Vercel Prisma Postgres
- [ ] Configure `vercel link` and `vercel env pull`
- [ ] Test local development workflow
- [ ] Verify hot reload and database changes work

---

### FAE-310: Plan Production Migration

**Status**: 📋 PLANNED  
**Assignee**: Morgan Smith (Database Architect) + Sarah Chen (Product Manager)  
**Priority**: Low  
**Estimate**: 5 hours

**Acceptance Criteria**:

- [ ] Create production migration strategy
- [ ] Set up production Vercel Prisma Postgres instance
- [ ] Plan data migration (if needed)
- [ ] Create rollback procedures
- [ ] Execute zero-downtime migration

---

## 🎯 Epic Success Criteria

### Definition of Done:

- [ ] All environments migrated to Vercel Prisma Postgres
- [ ] Zero legacy Neon configurations remaining
- [ ] Authentication works across all environments
- [ ] Performance benchmarks met or exceeded
- [ ] Documentation updated and accurate

### Key Performance Indicators:

- **Authentication Success Rate**: >99%
- **Database Query Performance**: <500ms average
- **Page Load Performance**: <2 seconds
- **Zero Environment Variable Conflicts**: ✅
- **Technical Debt Reduction**: 80% legacy code removed

---

## 🚨 Risk Management

### High Risk Items:

1. **Environment Variable Cleanup**: Manual process prone to error
   - _Mitigation_: Double-check with environment validation script
2. **Database Data Loss**: Migration could corrupt data
   - _Mitigation_: Backup strategy and rollback procedures ready

### Rollback Plan:

1. Revert Vercel environment variables to Neon configuration
2. Restore previous branch if code issues
3. Use emergency debug endpoints to diagnose issues
4. Escalate to Database Architect for data recovery

---

**Epic Owner**: Morgan Smith (Database Architect)  
**Project Manager**: Sarah Chen  
**Quality Assurance**: Jordan Lee (Cursor Expert)  
**Vercel Specialist**: Jordan Kim (Vercel Engineer)

**Last Updated**: 2025-09-16  
**Next Review**: After Phase 1 completion
