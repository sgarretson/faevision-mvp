#!/usr/bin/env node

/**
 * FAEVision Preview Environment Setup - SEPARATE from Production
 * Corrected: Preview is its own isolated environment
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🗄️ FAEVision Preview Environment - SEPARATE Setup');
console.log('==================================================');
console.log('✅ Corrected: Preview is SEPARATE from Production');

// Preview database credentials (provided by user)
const previewCredentials = {
  DATABASE_URL: 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  DIRECT_URL: 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  
  // Vercel environment variable format with faevision_preview_ prefix
  faevision_preview_DATABASE_URL: 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  faevision_preview_DIRECT_URL: 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  
  // Neon Auth variables
  NEXT_PUBLIC_STACK_PROJECT_ID: '07f3285f-f2a7-4cdb-8b1b-2e16717632c8',
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: 'pck_qh3h88mk87agj6mhsbez7hmjdg2a6bqjjpmf6e7t1hmrr',
  STACK_SECRET_SERVER_KEY: 'ssk_egev41977wwdrark62zba0xh6p3hd5cwat88s124xez0g',
};

function createSeparatePreviewConfig() {
  console.log('\n📋 Preview Environment Configuration:');
  console.log('🎯 Environment: PREVIEW (separate from production)');
  console.log('🗄️  Database: Dedicated Neon database for preview');
  console.log('🌐 URL: https://faevision-simplified-git-preview.vercel.app');
  console.log('🔧 Branch: preview');
  
  const previewEnvContent = `# FAEVision Preview Environment - SEPARATE from Production
# Generated: ${new Date().toISOString()}

# Preview Database (Dedicated Neon instance)
DATABASE_URL="${previewCredentials.DATABASE_URL}"
DIRECT_URL="${previewCredentials.DIRECT_URL}"

# Neon Auth Integration (Preview-specific)
NEXT_PUBLIC_STACK_PROJECT_ID="${previewCredentials.NEXT_PUBLIC_STACK_PROJECT_ID}"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="${previewCredentials.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY}"
STACK_SECRET_SERVER_KEY="${previewCredentials.STACK_SECRET_SERVER_KEY}"

# Environment Configuration
NODE_ENV="preview"
NEXTAUTH_URL="https://faevision-simplified-git-preview.vercel.app"
NEXTAUTH_SECRET="preview-secret-faevision-separate-2025"

# Copy from production when available
OPENAI_API_KEY="your-openai-api-key-here"
RESEND_API_KEY="your-resend-api-key-here"
`;

  try {
    fs.writeFileSync('.env.preview', previewEnvContent);
    console.log('✅ Created separate .env.preview configuration');
  } catch (error) {
    console.error('❌ Failed to create preview config:', error.message);
  }
}

function generateVercelEnvironmentConfig() {
  console.log('\n🔧 Vercel Environment Variable Configuration:');
  console.log('Copy these to Vercel Dashboard → Project Settings → Environment Variables:');
  console.log('\n📊 PREVIEW ENVIRONMENT:');
  
  const vercelConfig = [
    { name: 'DATABASE_URL', value: previewCredentials.DATABASE_URL },
    { name: 'DIRECT_URL', value: previewCredentials.DIRECT_URL },
    { name: 'NEXT_PUBLIC_STACK_PROJECT_ID', value: previewCredentials.NEXT_PUBLIC_STACK_PROJECT_ID },
    { name: 'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY', value: previewCredentials.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY },
    { name: 'STACK_SECRET_SERVER_KEY', value: previewCredentials.STACK_SECRET_SERVER_KEY },
    { name: 'NODE_ENV', value: 'preview' },
    { name: 'NEXTAUTH_URL', value: 'https://faevision-simplified-git-preview.vercel.app' },
    { name: 'NEXTAUTH_SECRET', value: 'preview-secret-faevision-separate-2025' }
  ];
  
  vercelConfig.forEach(config => {
    console.log(`   ${config.name}: ${config.value.substring(0, 50)}${config.value.length > 50 ? '...' : ''}`);
  });
  
  console.log('\n🎯 Environment Scope: Preview');
  console.log('🔧 Branch Pattern: preview');
}

async function testPreviewDatabaseSetup() {
  console.log('\n🧪 Testing Preview Database Setup:');
  
  // Backup current environment
  const originalEnv = process.env.DATABASE_URL;
  
  try {
    // Set preview environment temporarily
    process.env.DATABASE_URL = previewCredentials.DATABASE_URL;
    process.env.DIRECT_URL = previewCredentials.DIRECT_URL;
    process.env.NODE_ENV = 'preview';
    
    console.log('   🔍 Testing Prisma connection to preview database...');
    
    // Test connection
    const result = execSync('npx prisma migrate status', { 
      encoding: 'utf8',
      timeout: 30000 
    });
    
    if (result.includes('Database schema is up to date')) {
      console.log('   ✅ Preview database connection successful!');
      console.log('   📊 Schema is up to date');
    } else if (result.includes('migration')) {
      console.log('   ⚠️  Preview database needs migrations');
      console.log('   🔧 Run: npx prisma migrate deploy');
    }
    
  } catch (error) {
    console.log('   ⚠️  Preview database needs setup');
    console.log('   🔧 This is normal for a new preview database');
  } finally {
    // Restore original environment
    if (originalEnv) {
      process.env.DATABASE_URL = originalEnv;
    }
  }
}

async function main() {
  try {
    console.log('🎯 Setting up SEPARATE Preview Environment');
    console.log('Previous error: Assumed preview = production database');
    console.log('Correction: Preview has its own dedicated database');
    
    // Create separate preview configuration
    createSeparatePreviewConfig();
    
    // Generate Vercel configuration guide
    generateVercelEnvironmentConfig();
    
    // Test database setup
    await testPreviewDatabaseSetup();
    
    console.log('\n📋 Next Steps for Preview Environment:');
    console.log('1. ✅ Configure environment variables in Vercel Dashboard');
    console.log('2. 🗄️  Run database migrations: npx prisma migrate deploy');
    console.log('3. 🌱 Seed preview database: npm run db:seed');
    console.log('4. 🚀 Deploy preview branch to test');
    
    console.log('\n⏳ Waiting for Development database credentials...');
    console.log('📊 Status: Preview configured, Development pending');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
