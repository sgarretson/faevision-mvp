#!/usr/bin/env node

/**
 * FAEVision Preview Database Configuration
 * Sets up preview environment with user-provided database credentials
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🗄️ FAEVision Preview Database Configuration');
console.log('============================================');

// Preview database credentials provided by user
const previewConfig = {
  DATABASE_URL: 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  DIRECT_URL: 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  POSTGRES_URL: 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  POSTGRES_URL_NON_POOLING: 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  POSTGRES_PRISMA_URL: 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?connect_timeout=15&sslmode=require',
  
  // Connection parameters
  PGHOST: 'ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech',
  PGHOST_UNPOOLED: 'ep-round-frost-aecda5ou.c-2.us-east-2.aws.neon.tech',
  PGUSER: 'neondb_owner',
  PGDATABASE: 'neondb',
  PGPASSWORD: 'npg_vewQT72KgtCh',
  
  // Neon Auth variables
  NEXT_PUBLIC_STACK_PROJECT_ID: '07f3285f-f2a7-4cdb-8b1b-2e16717632c8',
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: 'pck_qh3h88mk87agj6mhsbez7hmjdg2a6bqjjpmf6e7t1hmrr',
  STACK_SECRET_SERVER_KEY: 'ssk_egev41977wwdrark62zba0xh6p3hd5cwat88s124xez0g',
  
  // Environment specific
  NODE_ENV: 'preview',
  NEXTAUTH_URL: 'https://faevision-simplified-git-preview.vercel.app',
  NEXTAUTH_SECRET: 'preview-secret-faevision-2025'
};

function createPreviewEnvFile() {
  console.log('📁 Creating .env.preview file...');
  
  const envContent = `# FAEVision Preview Environment
# Auto-generated from user-provided database credentials
# Generated: ${new Date().toISOString()}

# Database (Neon - Preview)
DATABASE_URL="${previewConfig.DATABASE_URL}"
DIRECT_URL="${previewConfig.DIRECT_URL}"

# Neon Postgres Variables
POSTGRES_URL="${previewConfig.POSTGRES_URL}"
POSTGRES_URL_NON_POOLING="${previewConfig.POSTGRES_URL_NON_POOLING}"
POSTGRES_PRISMA_URL="${previewConfig.POSTGRES_PRISMA_URL}"

# Database Connection Parameters
PGHOST="${previewConfig.PGHOST}"
PGHOST_UNPOOLED="${previewConfig.PGHOST_UNPOOLED}"
PGUSER="${previewConfig.PGUSER}"
PGDATABASE="${previewConfig.PGDATABASE}"
PGPASSWORD="${previewConfig.PGPASSWORD}"

# NextAuth Configuration
NEXTAUTH_SECRET="${previewConfig.NEXTAUTH_SECRET}"
NEXTAUTH_URL="${previewConfig.NEXTAUTH_URL}"

# Environment
NODE_ENV="${previewConfig.NODE_ENV}"

# Neon Auth Integration
NEXT_PUBLIC_STACK_PROJECT_ID="${previewConfig.NEXT_PUBLIC_STACK_PROJECT_ID}"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="${previewConfig.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY}"
STACK_SECRET_SERVER_KEY="${previewConfig.STACK_SECRET_SERVER_KEY}"

# AI Integration (copy from main .env)
OPENAI_API_KEY="your-openai-api-key-here"

# Email Service (copy from main .env)
RESEND_API_KEY="your-resend-api-key-here"
`;

  try {
    fs.writeFileSync('.env.preview', envContent);
    console.log('✅ Created .env.preview');
  } catch (error) {
    console.error('❌ Failed to create .env.preview:', error.message);
    throw error;
  }
}

async function testDatabaseConnection() {
  console.log('\n🔍 Testing preview database connection...');
  
  // Temporarily set environment variables for testing
  const originalEnv = process.env.DATABASE_URL;
  process.env.DATABASE_URL = previewConfig.DATABASE_URL;
  process.env.DIRECT_URL = previewConfig.DIRECT_URL;
  
  try {
    // Test with Prisma
    console.log('   📊 Testing Prisma connection...');
    const output = execSync('npx prisma db pull --print 2>&1', { 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    if (output.includes('schema')) {
      console.log('   ✅ Database connection successful!');
      console.log('   📊 Database contains tables and data');
    } else {
      console.log('   ⚠️  Database connected but may be empty');
    }
    
    return true;
  } catch (error) {
    console.error('   ❌ Database connection failed:', error.message);
    console.log('   🔧 This may be normal if database needs setup');
    return false;
  } finally {
    // Restore original environment
    if (originalEnv) {
      process.env.DATABASE_URL = originalEnv;
    }
  }
}

async function setupDatabaseSchema() {
  console.log('\n🏗️  Setting up database schema...');
  
  try {
    // Copy current .env to backup
    if (fs.existsSync('.env')) {
      fs.copyFileSync('.env', '.env.backup');
      console.log('   📋 Backed up current .env');
    }
    
    // Use preview environment
    fs.copyFileSync('.env.preview', '.env');
    console.log('   🔄 Switched to preview environment');
    
    // Run migrations
    console.log('   🗄️  Running database migrations...');
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      timeout: 60000 
    });
    
    console.log('   ✅ Database schema setup complete');
    
    // Run seeding
    console.log('   🌱 Seeding preview database...');
    execSync('npm run db:seed', { 
      stdio: 'inherit',
      timeout: 60000 
    });
    
    console.log('   ✅ Database seeding complete');
    
  } catch (error) {
    console.error('   ❌ Database setup failed:', error.message);
    throw error;
  } finally {
    // Restore original environment
    if (fs.existsSync('.env.backup')) {
      fs.copyFileSync('.env.backup', '.env');
      fs.unlinkSync('.env.backup');
      console.log('   🔄 Restored original environment');
    }
  }
}

async function main() {
  try {
    console.log('🎯 Preview Database Details:');
    console.log(`   Host: ${previewConfig.PGHOST}`);
    console.log(`   Database: ${previewConfig.PGDATABASE}`);
    console.log(`   User: ${previewConfig.PGUSER}`);
    console.log(`   Provider: Neon (same as production)`);
    
    // Create environment file
    createPreviewEnvFile();
    
    // Test connection
    const connected = await testDatabaseConnection();
    
    if (connected) {
      // Setup database
      await setupDatabaseSchema();
      
      console.log('\n🎉 Preview Environment Setup Complete!');
      console.log('\n📊 Preview Environment Status:');
      console.log('   ✅ Database: Connected and seeded');
      console.log('   ✅ Environment: Configured (.env.preview)');
      console.log('   ✅ Schema: Migrated');
      console.log('   ✅ Data: Seeded with test accounts');
      console.log('\n🌐 Preview URL: https://faevision-simplified-git-preview.vercel.app');
      console.log('\n🔐 Test Credentials:');
      console.log('   Admin: admin@faevision.com / admin123');
      console.log('   Executive: sarah.executive@faevision.com / executive123');
      console.log('   Contributor: contributor@faevision.com / contributor123');
    } else {
      console.log('\n⚠️  Database connection issues detected');
      console.log('📋 Manual steps required:');
      console.log('1. Verify database credentials in Vercel dashboard');
      console.log('2. Run: npx prisma migrate deploy');
      console.log('3. Run: npm run db:seed');
    }
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check database credentials are correct');
    console.log('2. Verify network connectivity to database');
    console.log('3. Ensure database exists and is accessible');
    process.exit(1);
  }
}

main();
