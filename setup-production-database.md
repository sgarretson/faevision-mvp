# FAEVision Production Database Setup

## 🗄️ Manual Vercel Postgres Setup Required

**Current Status**: Application deployed without database configuration

**Action Required**: Manual database creation in Vercel Dashboard

### Step 1: Create Postgres Database in Vercel

1. Visit: https://vercel.com/dashboard/scott-garretsons-projects/faevision-simplified
2. Navigate to **Storage** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Configure:
   - **Name**: `faevision-production`
   - **Region**: `US East (iad1)` 
   - **Plan**: `Hobby` (free tier)
6. Click **"Create"**

### Step 2: Verify Environment Variables

After database creation, Vercel will automatically add these environment variables:

```bash
POSTGRES_URL="postgres://username:password@host:port/database"
POSTGRES_PRISMA_URL="postgres://username:password@host:port/database?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://username:password@host:port/database"
POSTGRES_DATABASE="verceldb"
POSTGRES_HOST="hostname.postgres.vercel-storage.com"
POSTGRES_PASSWORD="generated_password"
POSTGRES_USER="default"
```

### Step 3: Deploy Database Schema

Once database is created, run these commands:

```bash
# Pull production environment variables
npx vercel env pull .env.production

# Deploy database migrations to production
DATABASE_URL=$(grep POSTGRES_PRISMA_URL .env.production | cut -d '=' -f2- | tr -d '"') npx prisma migrate deploy

# Seed production database with executive test data
DATABASE_URL=$(grep POSTGRES_PRISMA_URL .env.production | cut -d '=' -f2- | tr -d '"') npm run db:seed

# Verify deployment
npx vercel --prod
```

### Step 4: Verify Production Features

After setup, test these URLs:

- **Landing Page**: https://faevision-simplified-[hash].vercel.app
- **Dashboard**: https://faevision-simplified-[hash].vercel.app/dashboard  
- **Inputs**: https://faevision-simplified-[hash].vercel.app/inputs
- **Login**: https://faevision-simplified-[hash].vercel.app/login

### Executive Test Accounts

Once database is seeded:

- **Admin**: admin@faevision.com / admin123
- **Executive**: sarah.executive@faevision.com / exec123  
- **Executive**: marcus.executive@faevision.com / exec123
- **Contributor**: alex.contributor@faevision.com / contrib123
- **Contributor**: maya.contributor@faevision.com / contrib123

### Expected Features After Setup

✅ **F1 Input Capture**: Strategic input creation with tagging
✅ **F2 Collaboration**: Real-time voting, commenting, @mentions  
✅ **F3 Organization**: Executive dashboard with analytics
✅ **Authentication**: Role-based access control
✅ **Database**: Full CRUD operations with seeded test data

### Troubleshooting

If you encounter issues:

1. **Environment Variables**: Check Vercel project settings
2. **Database Connection**: Verify POSTGRES_PRISMA_URL is set
3. **Migrations**: Ensure migrations ran successfully
4. **Seeding**: Check if sample data was created

**Next Steps**: After manual database creation, FAEVision will be fully operational for executive testing!

