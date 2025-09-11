# 🔧 COMPLETE VERCEL PREVIEW ENVIRONMENT CONFIGURATION

## ✅ Database Setup Status
- ✅ **Preview Database**: Created and schema deployed
- ✅ **Test Users**: Successfully seeded with hashed passwords
- ✅ **Schema**: Complete F1-F6 schema deployed

## 🌍 REQUIRED VERCEL ENVIRONMENT VARIABLES

Set these **exact variables** in Vercel Dashboard for **Preview** environment:

### 📂 Go to: Vercel Dashboard > faevision-simplified > Settings > Environment Variables

### 1. Database Configuration
```bash
# Primary database connection (with connection pooling)
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
Environment: Preview

# Direct connection (for migrations, no pooling)
Name: DIRECT_URL  
Value: postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
Environment: Preview
```

### 2. NextAuth Configuration
```bash
# NextAuth URL for Preview environment
Name: NEXTAUTH_URL
Value: https://faevision-simplified-preview.vercel.app
Environment: Preview

# NextAuth Secret (generate new for Preview)
Name: NEXTAUTH_SECRET
Value: preview-faevision-secret-2025-secure-key
Environment: Preview
```

### 3. AI Integration
```bash
# OpenAI API Key (same as production)
Name: OPENAI_API_KEY
Value: [your-openai-api-key]
Environment: Preview
```

## 🔐 Test Accounts Available

After deploying with the new environment variables:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@faevision.com | FAEVision2025! |
| **Executive** | sarah.executive@faevision.com | Executive2025! |
| **Contributor** | alex.contributor@faevision.com | Contributor2025! |

## 🚀 Next Steps

1. **Set Environment Variables**: Configure all 5 variables above in Vercel
2. **Deploy Preview**: Push any change to `develop` branch or manually deploy
3. **Test Authentication**: Login with admin credentials
4. **Verify Isolation**: Confirm Preview database is separate from Production

## ⚠️ Important Notes

- **Environment Scope**: Ensure all variables are set for **Preview** environment only
- **Variable Names**: Use exact names (no prefixes like `faevision_preview_`)
- **Database Isolation**: Preview uses completely separate database from Production
- **Security**: Preview has its own NextAuth secret for session isolation

## 🔄 Deployment Trigger

After setting environment variables, trigger a new Preview deployment:
- Push to `develop` branch, or
- Manual deployment in Vercel Dashboard

**Expert**: Jordan Kim (Vercel Engineer) + Morgan Smith (Database Architect)
**Date**: September 10, 2025
