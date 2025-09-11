# 🚀 FAEVision Deployment Setup Instructions

## CRITICAL: VERCEL_TOKEN Configuration Required

### Issue Identified
- GitHub Actions are failing to deploy to Vercel because `VERCEL_TOKEN` secret is missing
- Legacy workflow conflicts have been resolved
- Deployment automation requires proper token configuration

### Required Action: Create Vercel Token

#### Step 1: Create Vercel Token (Manual)
1. Go to [Vercel Dashboard > Settings > Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name: `GitHub-Actions-Automated-Deploy`
4. Scope: Select your team/organization
5. Copy the generated token (it will only be shown once!)

#### Step 2: Add GitHub Secret
```bash
# Option 1: Using GitHub CLI (if authenticated)
gh secret set VERCEL_TOKEN --body "your-vercel-token-here"

# Option 2: Via GitHub Web Interface
# 1. Go to GitHub Repository > Settings > Secrets and variables > Actions
# 2. Click "New repository secret"
# 3. Name: VERCEL_TOKEN
# 4. Value: [paste your Vercel token]
# 5. Click "Add secret"
```

#### Step 3: Verify Deployment Configuration
Current secrets configured:
- ✅ VERCEL_ORG_ID: `team_ZdDMQikx8oG4hMXauGvc25UV`
- ✅ VERCEL_PROJECT_ID: `prj_Mm6YyWqX5AYRWtNBTiDTNel7xIU5`
- ❌ VERCEL_TOKEN: **MISSING - REQUIRED**

## Cleanup Completed ✅

### Legacy Workflows Removed
- Moved 11 legacy workflows to `docs/legacy-workflows/`
- Eliminated deployment conflicts
- Clean workflow structure now in place

### Active Workflows (3)
1. **vercel-deploy.yml**: Production/Preview deployments
2. **quality-pipeline.yml**: Quality gates and testing
3. **linear-sync.yml**: Linear integration

### Current Status
- ✅ Code quality: All checks passing
- ✅ Build process: Working correctly
- ✅ Workflow structure: Clean and compliant
- ❌ Automated deployment: Blocked by missing VERCEL_TOKEN

## Next Steps

1. **IMMEDIATE**: Add VERCEL_TOKEN secret to GitHub
2. **TEST**: Push a small change to trigger deployment
3. **VERIFY**: Confirm deployment appears in Vercel dashboard
4. **VALIDATE**: Test both Preview and Production environments

## Contact
- **GitHub Expert**: Taylor Morgan
- **Vercel Engineer**: Jordan Kim
- **Lead Developer**: Alex Thompson
