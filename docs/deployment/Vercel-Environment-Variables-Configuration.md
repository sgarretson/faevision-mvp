# Vercel Environment Variables Configuration Guide

## 🎯 Overview

This document provides the exact environment variables configuration for FAEVision's multi-environment setup in Vercel Dashboard.

## 📊 Environment Architecture

```yaml
🔵 PREVIEW Environment:
  Database: ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech
  Branch: preview
  URL: https://faevision-simplified-git-preview.vercel.app

🟢 DEVELOPMENT Environment:
  Database: ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech
  Branch: develop
  URL: https://faevision-simplified-git-develop.vercel.app

🟡 PRODUCTION Environment:
  Database: (to be created separately)
  Branch: main
  URL: https://faevision-simplified.vercel.app
```

## 🔧 Vercel Dashboard Configuration

### Navigation Steps:

1. Go to: https://vercel.com/dashboard
2. Select: `faevision-simplified` project
3. Navigate to: **Settings** → **Environment Variables**
4. Click **"Add"** for each variable below

### 🔵 Preview Environment Variables

**Environment Scope:** `Preview`  
**Branch Pattern:** `preview`

| Variable                                   | Value                                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                             | `postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL`                               | `postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require`        |
| `NEXTAUTH_SECRET`                          | `preview-secret-faevision-separate-2025`                                                                                       |
| `NEXTAUTH_URL`                             | `https://faevision-simplified-git-preview.vercel.app`                                                                          |
| `NODE_ENV`                                 | `preview`                                                                                                                      |
| `NEXT_PUBLIC_STACK_PROJECT_ID`             | `07f3285f-f2a7-4cdb-8b1b-2e16717632c8`                                                                                         |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | `pck_qh3h88mk87agj6mhsbez7hmjdg2a6bqjjpmf6e7t1hmrr`                                                                            |
| `STACK_SECRET_SERVER_KEY`                  | `ssk_egev41977wwdrark62zba0xh6p3hd5cwat88s124xez0g`                                                                            |
| `OPENAI_API_KEY`                           | `[Copy from production .env file - OpenAI API key]`                                                                            |
| `RESEND_API_KEY`                           | `your-resend-api-key-here`                                                                                                     |

### 🟢 Development Environment Variables

**Environment Scope:** `Development`  
**Branch Pattern:** `develop`

| Variable                                   | Value                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                             | `postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL`                               | `postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require`        |
| `NEXTAUTH_SECRET`                          | `development-secret-faevision-2025`                                                                                                |
| `NEXTAUTH_URL`                             | `https://faevision-simplified-git-develop.vercel.app`                                                                              |
| `NODE_ENV`                                 | `development`                                                                                                                      |
| `NEXT_PUBLIC_STACK_PROJECT_ID`             | `89ec937b-347e-4022-98b2-95d6793c97c4`                                                                                             |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | `pck_eg6nm35shw8z4psp0sz7xykam4n6smcgybxqke7b33dj0`                                                                                |
| `STACK_SECRET_SERVER_KEY`                  | `ssk_ap4fbn6qv8v9ee72hxg6cj3cm2g197m5k42xhjzq14hjg`                                                                                |
| `OPENAI_API_KEY`                           | `[Copy from production .env file - OpenAI API key]`                                                                                |
| `RESEND_API_KEY`                           | `your-resend-api-key-here`                                                                                                         |

## ✅ Configuration Verification Checklist

### Database Verification:

- [ ] Preview `DATABASE_URL` contains: `ep-round-frost-aecda5ou`
- [ ] Development `DATABASE_URL` contains: `ep-lingering-queen-ae13d5gh`
- [ ] Each environment has unique database credentials

### URL Verification:

- [ ] Preview `NEXTAUTH_URL` ends with: `-git-preview.vercel.app`
- [ ] Development `NEXTAUTH_URL` ends with: `-git-develop.vercel.app`

### Environment Scope Verification:

- [ ] All Preview variables have Environment Scope: `Preview`
- [ ] All Development variables have Environment Scope: `Development`
- [ ] Different `NEXT_PUBLIC_STACK_PROJECT_ID` for each environment

### API Keys Verification:

- [ ] `OPENAI_API_KEY` is the same for both environments (shared production key)
- [ ] `RESEND_API_KEY` configured (currently placeholder - needs real key)

## 🚀 Post-Configuration Testing

After configuring all environment variables in Vercel Dashboard:

### 1. Force Redeploy Environments

```bash
# Force redeploy Preview
git push origin preview --force-with-lease

# Force redeploy Development
git push origin develop --force-with-lease
```

### 2. Test Environment URLs

- **Preview**: https://faevision-simplified-git-preview.vercel.app
- **Development**: https://faevision-simplified-git-develop.vercel.app

### 3. Verify Database Connections

- Each environment should connect to its dedicated database
- Test user authentication in both environments
- Verify AI features work with shared OpenAI key

### 4. Test Account Credentials

Both environments should have these test accounts:

- **Admin**: `admin@faevision.com` / `admin123`
- **Executive**: `sarah.executive@faevision.com` / `executive123`
- **Contributor**: `contributor@faevision.com` / `contributor123`

## 🔧 Troubleshooting

### Common Issues:

1. **Environment Scope Mismatch**: Ensure variables are scoped to correct environment
2. **Database Connection Errors**: Verify `DATABASE_URL` and `DIRECT_URL` are correct
3. **Authentication Issues**: Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL` configuration
4. **Build Failures**: Ensure all required environment variables are set

### Debug Steps:

1. Check Vercel deployment logs for specific errors
2. Verify environment variable names are exactly as specified (case-sensitive)
3. Confirm Environment Scope is set correctly for each variable
4. Test database connections independently

## 📋 Next Steps

1. **User Action Required**: Configure variables in Vercel Dashboard manually
2. **Team Testing**: Force redeploy and test both environments
3. **Production Setup**: Create separate production database when ready
4. **Documentation**: Update any additional configuration as needed

---

**Generated**: 2025-09-11  
**Team**: FAEVision Expert Team  
**Status**: Ready for Vercel Dashboard configuration
