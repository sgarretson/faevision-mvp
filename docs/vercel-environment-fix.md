# 🔧 VERCEL PREVIEW ENVIRONMENT VARIABLE FIX

## Issue Identified
Environment variables in Vercel were created with incorrect prefixes:
- ❌ `faevision_preview_DATABASE_URL`
- ❌ `faevision_preview_DIRECT_URL`
- ❌ `faevision_preview_NEXTAUTH_URL`

## Required Correction
Variables should be named exactly as the application expects:
- ✅ `DATABASE_URL`
- ✅ `DIRECT_URL`
- ✅ `NEXTAUTH_URL`

## Fix Process
1. **Delete prefixed variables** from Vercel Dashboard
2. **Add new variables** with correct names for Preview environment
3. **Trigger new deployment** to apply changes
4. **Test authentication** with corrected configuration

## Values to Use
```bash
DATABASE_URL=postgresql://neondb_owner:npg_CLiPEUv8m3ug@ep-restless-fire-aek6ogsh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://neondb_owner:npg_CLiPEUv8m3ug@ep-restless-fire-aek6ogsh.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://faevision-simplified-preview.vercel.app
```

## Verification
Once fixed, the Preview environment should:
- Connect to dedicated Preview database
- Allow login with test accounts
- Function independently from Production

**Expert**: Jordan Kim (Vercel Engineer)
**Date**: September 10, 2025
