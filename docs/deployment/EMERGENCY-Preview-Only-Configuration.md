# 🚨 EMERGENCY PREVIEW-ONLY CONFIGURATION

## CRITICAL: Clean Vercel Environment Variables

**Problem**: Too many duplicate database environment variables causing conflicts.

**Solution**: Use ONLY these essential variables for Preview environment:

## ✅ MINIMAL PREVIEW ENVIRONMENT VARIABLES

**Environment Scope**: `Preview` only  
**Branch Pattern**: `preview`

### Essential Variables ONLY:

```bash
# Database (Use ONLY this one)
DATABASE_URL=postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# Auth (Essential)
NEXTAUTH_SECRET=preview-secret-faevision-separate-2025
NEXTAUTH_URL=https://faevision-simplified-git-preview.vercel.app

# AI (Essential) 
OPENAI_API_KEY=[Your OpenAI key]
```

## ❌ REMOVE ALL THESE DUPLICATES:

**Delete these conflicting variables from Vercel Dashboard:**

```bash
# Remove these duplicates/conflicts:
DATABASE_URL_UNPOOLED
PGHOST
PGHOST_UNPOOLED
PGUSER
PGDATABASE  
PGPASSWORD
POSTGRES_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
POSTGRES_URL_NO_SSL
POSTGRES_PRISMA_URL
NEXT_PUBLIC_STACK_PROJECT_ID
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
STACK_SECRET_SERVER_KEY
```

## 🔧 MANUAL VERCEL CLEANUP STEPS:

1. **Go to Vercel Dashboard** → Settings → Environment Variables
2. **Delete ALL database variables** except `DATABASE_URL`  
3. **Keep only** the 4 essential variables above
4. **Verify Environment Scope** is set to "Preview"
5. **Redeploy** the Preview branch

## 🎯 EXPECTED RESULT:

With clean environment variables, Prisma will use the correct `DATABASE_URL` without conflicts, and authentication should work.
