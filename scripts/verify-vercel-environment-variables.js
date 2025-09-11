#!/usr/bin/env node

/**
 * FAEVision Vercel Environment Variables Verification & Configuration
 * Verifies and sets up environment variables for Preview and Development environments
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔧 FAEVision Vercel Environment Variables Audit');
console.log('===============================================');

// Read environment files
function readEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#') && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').replace(/^["']|["']$/g, '');
      }
    });
    return env;
  } catch (error) {
    console.error(`❌ Failed to read ${filePath}:`, error.message);
    return {};
  }
}

const previewEnv = readEnvFile('.env.preview');
const developmentEnv = readEnvFile('.env.development');

// Define required environment variables for each environment
const requiredVars = [
  'DATABASE_URL',
  'DIRECT_URL', 
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'NODE_ENV',
  'NEXT_PUBLIC_STACK_PROJECT_ID',
  'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY',
  'STACK_SECRET_SERVER_KEY'
];

const optionalVars = [
  'OPENAI_API_KEY',
  'RESEND_API_KEY',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING'
];

function displayEnvironmentSummary() {
  console.log('\n📊 Environment Configuration Summary:');
  console.log('=====================================');
  
  console.log('\n🔵 PREVIEW Environment:');
  console.log('   🌐 URL: https://faevision-simplified-git-preview.vercel.app');
  console.log('   🔧 Branch: preview');
  console.log(`   🗄️  Database: ${previewEnv.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'Not configured'}`);
  console.log(`   🔑 Auth URL: ${previewEnv.NEXTAUTH_URL || 'Not configured'}`);
  console.log(`   📊 Node ENV: ${previewEnv.NODE_ENV || 'Not configured'}`);
  
  console.log('\n🟢 DEVELOPMENT Environment:');
  console.log('   🌐 URL: https://faevision-simplified-git-develop.vercel.app');
  console.log('   🔧 Branch: develop');
  console.log(`   🗄️  Database: ${developmentEnv.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'Not configured'}`);
  console.log(`   🔑 Auth URL: ${developmentEnv.NEXTAUTH_URL || 'Not configured'}`);
  console.log(`   📊 Node ENV: ${developmentEnv.NODE_ENV || 'Not configured'}`);
}

function validateEnvironmentVariables() {
  console.log('\n🔍 Environment Variables Validation:');
  console.log('====================================');
  
  const environments = {
    '🔵 Preview': previewEnv,
    '🟢 Development': developmentEnv
  };
  
  Object.entries(environments).forEach(([envName, env]) => {
    console.log(`\n${envName}:`);
    
    // Check required variables
    const missingRequired = requiredVars.filter(varName => !env[varName]);
    const presentRequired = requiredVars.filter(varName => env[varName]);
    
    console.log(`   ✅ Required (${presentRequired.length}/${requiredVars.length}):`);
    presentRequired.forEach(varName => {
      const value = env[varName];
      const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD') 
        ? `${value.substring(0, 8)}...` 
        : value.length > 50 
          ? `${value.substring(0, 50)}...`
          : value;
      console.log(`      ✅ ${varName}: ${displayValue}`);
    });
    
    if (missingRequired.length > 0) {
      console.log(`   ❌ Missing Required (${missingRequired.length}):`);
      missingRequired.forEach(varName => {
        console.log(`      ❌ ${varName}`);
      });
    }
    
    // Check optional variables
    const presentOptional = optionalVars.filter(varName => env[varName]);
    if (presentOptional.length > 0) {
      console.log(`   🔧 Optional (${presentOptional.length}/${optionalVars.length}):`);
      presentOptional.forEach(varName => {
        console.log(`      🔧 ${varName}: Configured`);
      });
    }
  });
}

function generateVercelConfigurationGuide() {
  console.log('\n🎯 Vercel Environment Variable Configuration Guide:');
  console.log('===================================================');
  
  console.log('\n📋 MANUAL STEPS (Vercel Dashboard):');
  console.log('1. Go to: https://vercel.com/dashboard');
  console.log('2. Select: faevision-simplified project');
  console.log('3. Navigate: Settings → Environment Variables');
  console.log('4. Configure environment-specific variables:');
  
  console.log('\n🔵 PREVIEW Environment Variables:');
  console.log('   Environment: Preview');
  console.log('   Branch Pattern: preview');
  
  requiredVars.forEach(varName => {
    if (previewEnv[varName]) {
      const value = previewEnv[varName];
      const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD')
        ? '[REDACTED - Copy from .env.preview]'
        : value.length > 80 
          ? `${value.substring(0, 80)}...`
          : value;
      console.log(`   ${varName}: ${displayValue}`);
    }
  });
  
  console.log('\n🟢 DEVELOPMENT Environment Variables:');
  console.log('   Environment: Development');
  console.log('   Branch Pattern: develop');
  
  requiredVars.forEach(varName => {
    if (developmentEnv[varName]) {
      const value = developmentEnv[varName];
      const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD')
        ? '[REDACTED - Copy from .env.development]'
        : value.length > 80 
          ? `${value.substring(0, 80)}...`
          : value;
      console.log(`   ${varName}: ${displayValue}`);
    }
  });
}

function checkCurrentVercelDeployments() {
  console.log('\n🚀 Current Deployment Status:');
  console.log('==============================');
  
  try {
    // Get recent git commits for context
    const recentCommits = execSync('git log --oneline -3', { encoding: 'utf8' });
    console.log('📊 Recent Commits:');
    recentCommits.split('\n').filter(line => line).forEach(commit => {
      console.log(`   ${commit}`);
    });
    
    // Check GitHub Actions status
    console.log('\n🔧 GitHub Actions Status:');
    const actionsStatus = execSync('gh run list --limit 3 --json conclusion,status,headBranch,displayTitle', { 
      encoding: 'utf8' 
    });
    const runs = JSON.parse(actionsStatus);
    runs.forEach(run => {
      const status = run.conclusion || run.status;
      const icon = status === 'success' ? '✅' : status === 'failure' ? '❌' : '🔄';
      console.log(`   ${icon} ${run.headBranch}: ${run.displayTitle} (${status})`);
    });
    
  } catch (error) {
    console.log('   ⚠️  Could not fetch deployment status');
  }
}

function generateEnvironmentTestScript() {
  console.log('\n🧪 Environment Testing Commands:');
  console.log('=================================');
  
  console.log('\n🔵 Test Preview Environment:');
  console.log('   URL: https://faevision-simplified-git-preview.vercel.app');
  console.log('   Test: curl -s https://faevision-simplified-git-preview.vercel.app');
  console.log('   Database: Verify connection in Vercel logs');
  
  console.log('\n🟢 Test Development Environment:');
  console.log('   URL: https://faevision-simplified-git-develop.vercel.app');
  console.log('   Test: curl -s https://faevision-simplified-git-develop.vercel.app');
  console.log('   Database: Verify connection in Vercel logs');
}

async function main() {
  try {
    console.log('🎯 Starting Vercel Environment Variables Audit...');
    
    // Display summary
    displayEnvironmentSummary();
    
    // Validate variables
    validateEnvironmentVariables();
    
    // Generate configuration guide
    generateVercelConfigurationGuide();
    
    // Check deployment status
    checkCurrentVercelDeployments();
    
    // Generate test commands
    generateEnvironmentTestScript();
    
    console.log('\n✅ Vercel Environment Audit Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. 🔧 Configure environment variables in Vercel Dashboard');
    console.log('2. 🚀 Trigger deployments for preview and develop branches');
    console.log('3. 🧪 Test both environments with provided URLs');
    console.log('4. 🗄️  Verify database connections in Vercel logs');
    console.log('5. 🔐 Test authentication on both environments');
    
    console.log('\n🎯 Priority: Configure DATABASE_URL and NEXTAUTH_URL for each environment');
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
    process.exit(1);
  }
}

main();
