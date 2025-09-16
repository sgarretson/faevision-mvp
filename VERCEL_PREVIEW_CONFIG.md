# 🔧 VERCEL PREVIEW ENVIRONMENT CONFIGURATION

## URGENT: Manual Vercel Environment Variable Setup Required

### Database Configuration for Preview Environment

You need to manually set these environment variables in Vercel for the **Preview** environment:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `faevision-simplified` project
3. Go to Settings > Environment Variables
4. Add these variables for **Preview** environment only:

```bash
# Primary Database URL (Recommended for most uses)
DATABASE_URL=postgresql://neondb_owner:npg_CLiPEUv8m3ug@ep-restless-fire-aek6ogsh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# Direct URL (For uses requiring a connection without pgbouncer)
DIRECT_URL=postgresql://neondb_owner:npg_CLiPEUv8m3ug@ep-restless-fire-aek6ogsh.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require

# NextAuth URL for Preview
NEXTAUTH_URL=https://faevision-simplified-preview.vercel.app
```

### Database Status

✅ **Preview Database**: Created and seeded
✅ **Test Users**: Created with passwords
✅ **Schema**: Deployed and ready

### Test Accounts Available

- **Admin**: admin@faevision.com / FAEVision2025!
- **Executive**: sarah.executive@faevision.com / Executive2025!
- **Contributor**: alex.contributor@faevision.com / Contributor2025!

### Next Steps

1. ✅ Database created and seeded
2. ⚠️ **MANUAL**: Set Vercel environment variables (above)
3. 🚀 **AUTO**: Deploy new Preview build
4. ✅ **TEST**: Login with test accounts

### Verification

After setting environment variables and deploying:

- Preview URL should load login page
- Test accounts should authenticate successfully
- Database should be isolated from Production
