#!/usr/bin/env node

/**
 * FAEVision Development Environment Setup
 * Configure development database with provided credentials
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🟢 FAEVision Development Environment Setup');
console.log('==========================================');

// Development database credentials (provided by user)
const developmentCredentials = {
  DATABASE_URL: 'postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  DIRECT_URL: 'postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  DATABASE_URL_UNPOOLED: 'postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  
  // Vercel Postgres Template Variables
  POSTGRES_URL: 'postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  POSTGRES_URL_NON_POOLING: 'postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  POSTGRES_PRISMA_URL: 'postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech/neondb?connect_timeout=15&sslmode=require',
  POSTGRES_URL_NO_SSL: 'postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech/neondb',
  
  // Connection Parameters
  PGHOST: 'ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech',
  PGHOST_UNPOOLED: 'ep-lingering-queen-ae13d5gh.c-2.us-east-2.aws.neon.tech',
  PGUSER: 'neondb_owner',
  PGDATABASE: 'neondb',
  PGPASSWORD: 'npg_6vcJmQuOek5X',
  
  // Neon Auth Variables (Development-specific)
  NEXT_PUBLIC_STACK_PROJECT_ID: '89ec937b-347e-4022-98b2-95d6793c97c4',
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: 'pck_eg6nm35shw8z4psp0sz7xykam4n6smcgybxqke7b33dj0',
  STACK_SECRET_SERVER_KEY: 'ssk_ap4fbn6qv8v9ee72hxg6cj3cm2g197m5k42xhjzq14hjg',
  
  // Environment specific
  NODE_ENV: 'development',
  NEXTAUTH_URL: 'https://faevision-simplified-git-develop.vercel.app',
  NEXTAUTH_SECRET: 'development-secret-faevision-2025'
};

function createDevelopmentEnvFile() {
  console.log('📁 Creating .env.development file...');
  
  const developmentEnvContent = `# FAEVision Development Environment
# Generated from user-provided database credentials
# Generated: ${new Date().toISOString()}

# Development Database (Dedicated Neon instance)
DATABASE_URL="${developmentCredentials.DATABASE_URL}"
DIRECT_URL="${developmentCredentials.DIRECT_URL}"
DATABASE_URL_UNPOOLED="${developmentCredentials.DATABASE_URL_UNPOOLED}"

# Vercel Postgres Template Variables
POSTGRES_URL="${developmentCredentials.POSTGRES_URL}"
POSTGRES_URL_NON_POOLING="${developmentCredentials.POSTGRES_URL_NON_POOLING}"
POSTGRES_PRISMA_URL="${developmentCredentials.POSTGRES_PRISMA_URL}"
POSTGRES_URL_NO_SSL="${developmentCredentials.POSTGRES_URL_NO_SSL}"

# Database Connection Parameters  
PGHOST="${developmentCredentials.PGHOST}"
PGHOST_UNPOOLED="${developmentCredentials.PGHOST_UNPOOLED}"
PGUSER="${developmentCredentials.PGUSER}"
PGDATABASE="${developmentCredentials.PGDATABASE}"
PGPASSWORD="${developmentCredentials.PGPASSWORD}"

# NextAuth Configuration
NEXTAUTH_SECRET="${developmentCredentials.NEXTAUTH_SECRET}"
NEXTAUTH_URL="${developmentCredentials.NEXTAUTH_URL}"

# Environment
NODE_ENV="${developmentCredentials.NODE_ENV}"

# Neon Auth Integration (Development-specific)
NEXT_PUBLIC_STACK_PROJECT_ID="${developmentCredentials.NEXT_PUBLIC_STACK_PROJECT_ID}"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="${developmentCredentials.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY}"
STACK_SECRET_SERVER_KEY="${developmentCredentials.STACK_SECRET_SERVER_KEY}"

# AI Integration (copy from main .env)
OPENAI_API_KEY="your-openai-api-key-here"

# Email Service (copy from main .env)
RESEND_API_KEY="your-resend-api-key-here"
`;

  try {
    fs.writeFileSync('.env.development', developmentEnvContent);
    console.log('✅ Created .env.development');
  } catch (error) {
    console.error('❌ Failed to create .env.development:', error.message);
    throw error;
  }
}

function displayEnvironmentSummary() {
  console.log('\n📊 Multi-Environment Database Summary:');
  console.log('=====================================');
  
  console.log('\n🔵 PREVIEW Environment:');
  console.log('   Host: ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech');
  console.log('   Branch: preview');
  console.log('   URL: https://faevision-simplified-git-preview.vercel.app');
  console.log('   Status: ✅ Configured');
  
  console.log('\n🟢 DEVELOPMENT Environment:');
  console.log('   Host: ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech');
  console.log('   Branch: develop');
  console.log('   URL: https://faevision-simplified-git-develop.vercel.app');
  console.log('   Status: ✅ Configuring now');
  
  console.log('\n🟡 PRODUCTION Environment:');
  console.log('   Host: (to be created separately)');
  console.log('   Branch: main');
  console.log('   URL: https://faevision-simplified.vercel.app');
  console.log('   Status: 🔄 Pending separate database creation');
}

function generateVercelEnvironmentConfig() {
  console.log('\n🔧 Vercel Environment Variable Configuration:');
  console.log('Copy these to Vercel Dashboard → Project Settings → Environment Variables:');
  console.log('\n🟢 DEVELOPMENT ENVIRONMENT:');
  
  const vercelConfig = [
    { name: 'DATABASE_URL', value: developmentCredentials.DATABASE_URL },
    { name: 'DIRECT_URL', value: developmentCredentials.DIRECT_URL },
    { name: 'POSTGRES_PRISMA_URL', value: developmentCredentials.POSTGRES_PRISMA_URL },
    { name: 'NEXT_PUBLIC_STACK_PROJECT_ID', value: developmentCredentials.NEXT_PUBLIC_STACK_PROJECT_ID },
    { name: 'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY', value: developmentCredentials.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY },
    { name: 'STACK_SECRET_SERVER_KEY', value: developmentCredentials.STACK_SECRET_SERVER_KEY },
    { name: 'NODE_ENV', value: 'development' },
    { name: 'NEXTAUTH_URL', value: developmentCredentials.NEXTAUTH_URL },
    { name: 'NEXTAUTH_SECRET', value: developmentCredentials.NEXTAUTH_SECRET }
  ];
  
  vercelConfig.forEach(config => {
    console.log(`   ${config.name}: ${config.value.substring(0, 50)}${config.value.length > 50 ? '...' : ''}`);
  });
  
  console.log('\n🎯 Environment Scope: Development');
  console.log('🔧 Branch Pattern: develop');
}

async function testDevelopmentDatabase() {
  console.log('\n🧪 Testing Development Database:');
  
  // Backup current environment
  const originalEnv = process.env.DATABASE_URL;
  const originalDirectUrl = process.env.DIRECT_URL;
  
  try {
    // Set development environment temporarily
    process.env.DATABASE_URL = developmentCredentials.DATABASE_URL;
    process.env.DIRECT_URL = developmentCredentials.DIRECT_URL;
    process.env.NODE_ENV = 'development';
    
    console.log('   🔍 Testing Prisma connection to development database...');
    
    // Test connection
    const result = execSync('npx prisma migrate status', { 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    if (result.includes('Database schema is up to date')) {
      console.log('   ✅ Development database connection successful!');
      console.log('   📊 Schema is up to date');
      return true;
    } else if (result.includes('migration')) {
      console.log('   ⚠️  Development database needs migrations');
      console.log('   🔧 Will set up schema...');
      return false;
    }
    
  } catch (error) {
    console.log('   ⚠️  Development database needs initial setup');
    console.log('   🔧 This is normal for a new database');
    return false;
  } finally {
    // Restore original environment
    if (originalEnv) process.env.DATABASE_URL = originalEnv;
    if (originalDirectUrl) process.env.DIRECT_URL = originalDirectUrl;
  }
}

async function setupDevelopmentDatabase() {
  console.log('\n🏗️  Setting up Development Database...');
  
  try {
    // Backup current environment
    const backupPath = '.env.backup-for-dev-setup';
    if (fs.existsSync('.env')) {
      fs.copyFileSync('.env', backupPath);
      console.log('   📋 Backed up current environment');
    }
    
    // Switch to development environment
    fs.copyFileSync('.env.development', '.env');
    console.log('   🔄 Switched to development environment');
    
    // Run migrations
    console.log('   🗄️  Running database migrations...');
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      timeout: 60000 
    });
    console.log('   ✅ Database schema setup complete');
    
    // Run seeding
    console.log('   🌱 Seeding development database...');
    execSync('NODE_ENV=development npm run db:seed', { 
      stdio: 'inherit',
      timeout: 60000 
    });
    console.log('   ✅ Database seeding complete');
    
    return true;
    
  } catch (error) {
    console.error('   ❌ Database setup failed:', error.message);
    return false;
  } finally {
    // Restore original environment
    const backupPath = '.env.backup-for-dev-setup';
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, '.env');
      fs.unlinkSync(backupPath);
      console.log('   🔄 Restored original environment');
    }
  }
}

async function main() {
  try {
    console.log('🎯 Development Database Details:');
    console.log(`   Host: ${developmentCredentials.PGHOST}`);
    console.log(`   Database: ${developmentCredentials.PGDATABASE}`);
    console.log(`   User: ${developmentCredentials.PGUSER}`);
    console.log(`   Provider: Neon (separate from Preview/Production)`);
    
    // Create environment file
    createDevelopmentEnvFile();
    
    // Display summary
    displayEnvironmentSummary();
    
    // Generate Vercel configuration
    generateVercelEnvironmentConfig();
    
    // Test database connection
    const connected = await testDevelopmentDatabase();
    
    // Setup database if needed
    const setupSuccess = await setupDevelopmentDatabase();
    
    if (setupSuccess) {
      console.log('\n🎉 Development Environment Setup Complete!');
      console.log('\n📊 Development Environment Status:');
      console.log('   ✅ Database: Connected and seeded');
      console.log('   ✅ Environment: Configured (.env.development)');
      console.log('   ✅ Schema: Migrated');
      console.log('   ✅ Data: Seeded with test accounts');
      console.log('\n🌐 Development URL: https://faevision-simplified-git-develop.vercel.app');
      console.log('\n🔐 Test Credentials:');
      console.log('   Admin: admin@faevision.com / admin123');
      console.log('   Executive: sarah.executive@faevision.com / executive123');
      console.log('   Contributor: contributor@faevision.com / contributor123');
    } else {
      console.log('\n⚠️  Development database setup had issues');
      console.log('📋 Manual steps may be required');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. ✅ Configure Vercel environment variables for Development');
    console.log('2. 🚀 Deploy develop branch to test');
    console.log('3. 🔄 Create separate Production database');
    console.log('4. 🎯 Complete multi-environment isolation');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
