# FAEVision Vercel Environment Variables Setup Guide

## 🎯 Overview

This guide provides step-by-step instructions for configuring environment variables in Vercel for FAEVision's multi-environment architecture.

## 📊 Environment Architecture

```yaml
🔵 PREVIEW Environment:
  Branch: preview
  URL: https://faevision-simplified-git-preview.vercel.app
  Database: ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech
  Purpose: Testing and stakeholder preview

🟢 DEVELOPMENT Environment:
  Branch: develop  
  URL: https://faevision-simplified-git-develop.vercel.app
  Database: ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech
  Purpose: Active development and testing

🟡 PRODUCTION Environment:
  Branch: main
  URL: https://faevision-simplified.vercel.app
  Database: (to be created separately)
  Purpose: Live production environment
```

## 🔧 Vercel Dashboard Configuration

### Step 1: Access Vercel Dashboard
1. Navigate to: https://vercel.com/dashboard
2. Select project: **faevision-simplified**
3. Go to: **Settings** → **Environment Variables**

### Step 2: Configure Preview Environment Variables

**Environment Scope:** `Preview`  
**Branch Pattern:** `preview`

#### Required Variables:
```bash
DATABASE_URL=postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

DIRECT_URL=postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

NEXTAUTH_URL=https://faevision-simplified-git-preview.vercel.app

NEXTAUTH_SECRET=preview-secret-faevision-separate-2025

NODE_ENV=preview

NEXT_PUBLIC_STACK_PROJECT_ID=07f3285f-f2a7-4cdb-8b1b-2e16717632c8

NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_qh3h88mk87agj6mhsbez7hmjdg2a6bqjjpmf6e7t1hmrr

STACK_SECRET_SERVER_KEY=ssk_egev41977wwdrark62zba0xh6p3hd5cwat88s124xez0g
```

#### Optional Variables (copy from production):
```bash
OPENAI_API_KEY=your-openai-api-key-here
RESEND_API_KEY=your-resend-api-key-here
```

### Step 3: Configure Development Environment Variables

**Environment Scope:** `Development`  
**Branch Pattern:** `develop`

#### Required Variables:
```bash
DATABASE_URL=postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

DIRECT_URL=postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

NEXTAUTH_URL=https://faevision-simplified-git-develop.vercel.app

NEXTAUTH_SECRET=development-secret-faevision-2025

NODE_ENV=development

NEXT_PUBLIC_STACK_PROJECT_ID=89ec937b-347e-4022-98b2-95d6793c97c4

NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_eg6nm35shw8z4psp0sz7xykam4n6smcgybxqke7b33dj0

STACK_SECRET_SERVER_KEY=ssk_ap4fbn6qv8v9ee72hxg6cj3cm2g197m5k42xhjzq14hjg

# Additional Postgres Variables
POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

POSTGRES_URL=postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
```

#### Optional Variables (copy from production):
```bash
OPENAI_API_KEY=your-openai-api-key-here
RESEND_API_KEY=your-resend-api-key-here
```

## ✅ Verification Checklist

### After Configuration:
- [ ] All environment variables added to Vercel
- [ ] Environment scopes set correctly (Preview/Development)
- [ ] Branch patterns configured (preview/develop)
- [ ] Trigger new deployments to test

### Testing URLs:
- [ ] **Preview**: https://faevision-simplified-git-preview.vercel.app
- [ ] **Development**: https://faevision-simplified-git-develop.vercel.app

### Database Verification:
- [ ] Check Vercel deployment logs for database connection
- [ ] Verify authentication works on both environments
- [ ] Test user creation and login functionality

## 🚨 Important Notes

### Database Isolation:
- **Preview** and **Development** use separate Neon databases
- Each environment has unique database credentials
- **Production** will have its own separate database (to be configured)

### Environment Separation:
- Different `NEXTAUTH_SECRET` for each environment
- Unique `NEXT_PUBLIC_STACK_PROJECT_ID` per environment
- Separate Neon Auth integration per environment

### Security:
- Never mix production credentials with preview/development
- Each environment should be completely isolated
- Use environment-specific secrets

## 🔧 Troubleshooting

### If Deployment Fails:
1. Check Vercel deployment logs
2. Verify all required environment variables are set
3. Ensure database credentials are correct
4. Check branch patterns match exactly

### If Database Connection Fails:
1. Verify `DATABASE_URL` is correct for the environment
2. Check `DIRECT_URL` matches the database
3. Ensure Neon database is accessible
4. Test database connection locally with the same credentials

### If Authentication Fails:
1. Verify `NEXTAUTH_URL` matches the deployment URL
2. Check `NEXTAUTH_SECRET` is set and unique per environment
3. Ensure Neon Auth variables are correct for the environment

## 📊 Environment Status Dashboard

| Environment | Status | Database | Branch | URL |
|-------------|--------|----------|---------|-----|
| 🔵 Preview | ✅ Configured | ep-round-frost-aecda5ou | preview | faevision-simplified-git-preview.vercel.app |
| 🟢 Development | ✅ Configured | ep-lingering-queen-ae13d5gh | develop | faevision-simplified-git-develop.vercel.app |
| 🟡 Production | 🔄 Pending | (to be created) | main | faevision-simplified.vercel.app |

## 🎯 Next Steps

1. **Configure Vercel Environment Variables** (manual step in dashboard)
2. **Trigger Deployments** for preview and develop branches
3. **Test Both Environments** with provided URLs
4. **Create Production Database** when ready
5. **Configure Production Environment Variables**

---

Generated by FAEVision Expert Team - Vercel Engineer (Jordan Kim) & Database Architect (Morgan Smith)
