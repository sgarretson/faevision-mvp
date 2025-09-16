# 🚀 VERCEL PRISMA POSTGRES MIGRATION PLAN

## 🎯 STRATEGIC MIGRATION APPROACH

**Lead Expert**: Morgan Smith (Database Architect)  
**Support Team**: Jordan Kim (Vercel Engineer), Jordan Lee (Cursor Expert)  
**Timeline**: 3-Phase Rollout (Preview → Development → Production)  
**Risk Level**: LOW (Preview first, proven rollback)  

## 📊 CURRENT STATE vs TARGET STATE

### Current Legacy Configuration
```bash
# ❌ LEGACY NEON DATABASE (TO BE REMOVED)
DATABASE_URL=postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# ❌ 15+ DUPLICATE VARIABLES (TO BE REMOVED)
DATABASE_URL_UNPOOLED, POSTGRES_URL, POSTGRES_PRISMA_URL, PGHOST, PGUSER, etc.
```

### Target Vercel Prisma Postgres Configuration
```bash
# ✅ CLEAN VERCEL PRISMA POSTGRES
DATABASE_URL="postgres://f279b9e46e7c0166b4949c4f910079cd6f0cbb7ae03a783a14b933638f1ba0ce:sk_paIQiDGXmKNC6q0ngZD0i@db.prisma.io:5432/postgres?sslmode=require"
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19wYUlRaURHWG1LTkM2cTBuZ1pEMGkiLCJhcGlfa2V5IjoiMDFLNTgzMTM1QUgwWDBHODdDQTNaUjBYMTIiLCJ0ZW5hbnRfaWQiOiJmMjc5YjllNDZlN2MwMTY2YjQ5NDljNGY5MTAwNzljZDZmMGNiYjdhZTAzYTc4M2ExNGI5MzM2MzhmMWJhMGNlIiwiaW50ZXJuYWxfc2VjcmV0IjoiZDEzYmE2ZGEtMzZmYS00NTUzLTk4OGEtNDVhZDViZDRjZjc4In0.VK-wEODGJVTE81IxhZ1kEfwPyB4M14blC_3XoJbrYDE"

# ✅ ESSENTIAL AUTH VARIABLES
NEXTAUTH_SECRET=preview-secret-faevision-separate-2025
NEXTAUTH_URL=https://faevision-simplified-git-preview.vercel.app

# ✅ AI INTEGRATION
OPENAI_API_KEY=[Your OpenAI Key]
```

## 🔄 PHASE 1: PREVIEW MIGRATION (START HERE)

### Step 1: Prepare Vercel Prisma Postgres Schema
```bash
# 1.1: Update Prisma schema for Vercel compatibility
# Location: prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}
```

### Step 1.2: Update Prisma Client Configuration
```typescript
// Location: src/lib/prisma.ts

import { PrismaClient } from '../generated/prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: { url: process.env.DATABASE_URL }
    }
  }).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Step 1.3: Environment Variable Cleanup
```bash
# REMOVE ALL LEGACY VARIABLES from Vercel Preview Environment:
DATABASE_URL_UNPOOLED
POSTGRES_URL
POSTGRES_URL_NON_POOLING  
POSTGRES_PRISMA_URL
POSTGRES_URL_NO_SSL
PGHOST
PGHOST_UNPOOLED
PGUSER
PGPASSWORD
PGDATABASE
DIRECT_URL
NEXT_PUBLIC_STACK_PROJECT_ID
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
STACK_SECRET_SERVER_KEY

# ADD ONLY ESSENTIAL VARIABLES:
DATABASE_URL=postgres://f279b9e46e7c0166b4949c4f910079cd6f0cbb7ae03a783a14b933638f1ba0ce:sk_paIQiDGXmKNC6q0ngZD0i@db.prisma.io:5432/postgres?sslmode=require
NEXTAUTH_SECRET=preview-secret-faevision-separate-2025
NEXTAUTH_URL=https://faevision-simplified-git-preview.vercel.app  
OPENAI_API_KEY=[Your OpenAI Key]
```

### Step 1.4: Migration and Seeding
```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Push schema to Vercel Prisma Postgres
npx prisma db push

# 3. Seed with admin user
npx prisma db seed
```

## 🔄 PHASE 2: DEVELOPMENT MIGRATION

### Step 2.1: Local Development Setup
```bash
# Connect to Vercel project for development
vercel link

# Pull Vercel Prisma Postgres URL for development
vercel env pull .env.development.local

# Generate and migrate
npx prisma migrate dev --name init
npx prisma db seed
```

### Step 2.2: Update Development Environment Variables
```bash
# Development environment should use same Vercel Prisma Postgres
# Different database instance but same configuration pattern
DATABASE_URL=[Development Vercel Prisma Postgres URL]
NEXTAUTH_SECRET=development-secret-faevision-separate-2025
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=[Your OpenAI Key]
```

## 🔄 PHASE 3: PRODUCTION MIGRATION

### Step 3.1: Production Environment Setup
```bash
# Production Vercel Prisma Postgres
DATABASE_URL=[Production Vercel Prisma Postgres URL]
NEXTAUTH_SECRET=[Production Secret - 32+ characters]
NEXTAUTH_URL=https://faevision.com
OPENAI_API_KEY=[Your OpenAI Key]
```

### Step 3.2: Data Migration (If Needed)
```bash
# If existing data needs migration from Neon
# 1. Export from Neon
pg_dump [neon_url] > neon_backup.sql

# 2. Import to Vercel Prisma Postgres  
psql [vercel_prisma_url] < neon_backup.sql

# 3. Verify data integrity
npx prisma db seed --verify
```

## 🧹 LEGACY CLEANUP TASKS

### Files to Remove/Update:
- [ ] Remove: `scripts/emergency-reseed-preview.js` (Neon-specific)
- [ ] Remove: `scripts/emergency-runtime-database-test.js` (Neon-specific)
- [ ] Remove: `docs/deployment/EMERGENCY-Preview-Only-Configuration.md` (Legacy)
- [ ] Update: `src/lib/auth.ts` (Remove dedicated Auth.js Prisma client)
- [ ] Update: `src/lib/prisma.ts` (Simplify to Vercel Prisma Postgres)
- [ ] Remove: All debug endpoints in `src/app/api/debug-*`
- [ ] Remove: `prisma/seed.js` (Replace with TypeScript version)
- [ ] Update: `prisma/schema.prisma` (Remove directUrl)

### Environment Variables to Remove:
- [ ] All POSTGRES_* variables (15+ duplicates)
- [ ] All NEON_* variables
- [ ] All STACK_* variables (Neon Auth)
- [ ] DIRECT_URL (Not needed for Vercel Prisma Postgres)
- [ ] DATABASE_URL_UNPOOLED

## ✅ SUCCESS CRITERIA

### Phase 1 (Preview) Success:
- [ ] Preview environment uses Vercel Prisma Postgres
- [ ] Admin login works: admin@faevision.com / FAEVision2025!
- [ ] CSS styling works correctly
- [ ] No environment variable conflicts
- [ ] Database queries perform well (<500ms)

### Phase 2 (Development) Success:
- [ ] Local development connected to Vercel Prisma Postgres
- [ ] Hot reload and development workflow intact
- [ ] Database changes sync properly
- [ ] No legacy Neon dependencies

### Phase 3 (Production) Success:
- [ ] Production environment fully migrated
- [ ] All legacy configurations removed
- [ ] Performance benchmarks met
- [ ] Zero downtime migration completed

## 🚨 ROLLBACK PLAN

### If Migration Issues Occur:
1. **IMMEDIATE**: Revert Vercel environment variables to legacy Neon
2. **PRESERVE**: Keep Vercel Prisma Postgres database for debugging
3. **INVESTIGATE**: Use debug endpoints to identify issues
4. **RETRY**: Fix issues and attempt migration again

### Emergency Contacts:
- **Database Issues**: Morgan Smith (Database Architect)
- **Vercel Issues**: Jordan Kim (Vercel Engineer)  
- **Authentication Issues**: Dr. Priya Patel (AI Architect) + Jordan Lee (Cursor Expert)
- **Overall Coordination**: Sarah Chen (Product Manager)

## 📊 MONITORING & VALIDATION

### Key Metrics to Track:
- Database connection latency
- Authentication success rate
- Page load performance
- Error rates in Vercel logs
- User session persistence

### Validation Scripts:
- Database connectivity test
- Authentication flow test
- Performance benchmark
- Feature functionality test

---

**APPROVAL REQUIRED**: Morgan Smith (Database Architect)  
**IMPLEMENTATION LEAD**: Jordan Kim (Vercel Engineer)  
**QUALITY ASSURANCE**: Jordan Lee (Cursor Expert)  
**PROJECT OVERSIGHT**: Sarah Chen (Product Manager)
