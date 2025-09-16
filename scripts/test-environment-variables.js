#!/usr/bin/env node

/**
 * FAEVision Environment Variables Testing Script
 * Test database connections and configurations for each environment
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🧪 FAEVision Environment Variables Testing');
console.log('==========================================');

// Environment configurations to test
const environments = {
  preview: {
    name: 'Preview',
    color: '🔵',
    envFile: '.env.preview.updated',
    url: 'https://faevision-simplified-git-preview.vercel.app',
    expectedHost: 'ep-round-frost-aecda5ou',
  },
  development: {
    name: 'Development',
    color: '🟢',
    envFile: '.env.development.updated',
    url: 'https://faevision-simplified-git-develop.vercel.app',
    expectedHost: 'ep-lingering-queen-ae13d5gh',
  },
  production: {
    name: 'Production',
    color: '🟡',
    envFile: '.env',
    url: 'https://faevision-simplified.vercel.app',
    expectedHost: 'ep-round-frost-aecda5ou', // Current production
  },
};

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const vars = {};

  content.split('\n').forEach(line => {
    const match = line.match(/^([^#][^=]+)=(.+)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      vars[key] = value;
    }
  });

  return vars;
}

function validateDatabaseUrl(envName, databaseUrl, expectedHost) {
  console.log(`   📊 Database URL: ${databaseUrl.substring(0, 60)}...`);

  if (databaseUrl.includes(expectedHost)) {
    console.log(`   ✅ Host verification: Contains expected ${expectedHost}`);
    return true;
  } else {
    console.log(
      `   ❌ Host verification: Expected ${expectedHost}, but not found`
    );
    return false;
  }
}

function validateEnvironmentVariables(envName, envVars) {
  console.log(`   🔍 Checking required variables...`);

  const requiredVars = [
    'DATABASE_URL',
    'DIRECT_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NODE_ENV',
    'OPENAI_API_KEY',
  ];

  const results = {};

  requiredVars.forEach(varName => {
    if (envVars[varName]) {
      console.log(`   ✅ ${varName}: Present`);
      results[varName] = true;
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      results[varName] = false;
    }
  });

  return results;
}

async function testDatabaseConnection(envName, envVars) {
  console.log(`   🗄️  Testing database connection...`);

  // Backup current environment
  const originalDbUrl = process.env.DATABASE_URL;
  const originalDirectUrl = process.env.DIRECT_URL;

  try {
    // Set test environment
    process.env.DATABASE_URL = envVars.DATABASE_URL;
    process.env.DIRECT_URL = envVars.DIRECT_URL;

    // Test Prisma connection
    const result = execSync('npx prisma migrate status', {
      encoding: 'utf8',
      timeout: 10000,
      stdio: 'pipe',
    });

    if (result.includes('Database schema is up to date')) {
      console.log(`   ✅ Database connection: Successful`);
      console.log(`   📊 Schema status: Up to date`);
      return { success: true, message: 'Connected and schema current' };
    } else if (result.includes('migration')) {
      console.log(
        `   ⚠️  Database connection: Successful but needs migrations`
      );
      return { success: true, message: 'Connected but needs migration' };
    } else {
      console.log(`   ⚠️  Database connection: Unclear status`);
      return { success: false, message: 'Unclear status' };
    }
  } catch (error) {
    console.log(`   ❌ Database connection: Failed`);
    console.log(`   🔧 Error: ${error.message.split('\n')[0]}`);
    return { success: false, message: error.message.split('\n')[0] };
  } finally {
    // Restore original environment
    if (originalDbUrl) process.env.DATABASE_URL = originalDbUrl;
    if (originalDirectUrl) process.env.DIRECT_URL = originalDirectUrl;
  }
}

async function testEnvironmentUrl(envName, url) {
  console.log(`   🌐 Testing deployment URL...`);

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      timeout: 10000,
    });

    if (response.ok) {
      console.log(
        `   ✅ URL accessible: ${response.status} ${response.statusText}`
      );
      return { success: true, status: response.status };
    } else {
      console.log(
        `   ⚠️  URL response: ${response.status} ${response.statusText}`
      );
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.log(`   ❌ URL test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testEnvironment(envKey, envConfig) {
  console.log(
    `\n${envConfig.color} ${envConfig.name.toUpperCase()} ENVIRONMENT TEST`
  );
  console.log('='.repeat(40));

  // Load environment variables
  const envVars = parseEnvFile(envConfig.envFile);

  if (!envVars) {
    console.log(`   ❌ Environment file not found: ${envConfig.envFile}`);
    return { success: false, reason: 'Environment file missing' };
  }

  console.log(`   📁 Environment file: ${envConfig.envFile}`);

  // Test 1: Validate required variables
  const varResults = validateEnvironmentVariables(envConfig.name, envVars);

  // Test 2: Validate database URL
  const dbValid = validateDatabaseUrl(
    envConfig.name,
    envVars.DATABASE_URL || 'MISSING',
    envConfig.expectedHost
  );

  // Test 3: Test database connection
  const dbConnection = await testDatabaseConnection(envConfig.name, envVars);

  // Test 4: Test deployment URL
  const urlTest = await testEnvironmentUrl(envConfig.name, envConfig.url);

  // Calculate overall success
  const requiredVarsCount = Object.values(varResults).filter(Boolean).length;
  const totalRequiredVars = Object.keys(varResults).length;

  const overallSuccess =
    requiredVarsCount === totalRequiredVars &&
    dbValid &&
    dbConnection.success &&
    urlTest.success;

  console.log(`\n   📊 ${envConfig.name} Environment Summary:`);
  console.log(`   Variables: ${requiredVarsCount}/${totalRequiredVars} ✓`);
  console.log(`   Database URL: ${dbValid ? '✅' : '❌'}`);
  console.log(`   DB Connection: ${dbConnection.success ? '✅' : '❌'}`);
  console.log(`   Deployment URL: ${urlTest.success ? '✅' : '❌'}`);
  console.log(`   Overall: ${overallSuccess ? '✅ PASS' : '❌ ISSUES FOUND'}`);

  return {
    success: overallSuccess,
    variables: varResults,
    database: { valid: dbValid, connection: dbConnection },
    url: urlTest,
  };
}

async function generateTestReport(results) {
  console.log('\n📋 COMPREHENSIVE TEST REPORT');
  console.log('============================');

  let overallPass = true;

  Object.entries(results).forEach(([envKey, result]) => {
    const envConfig = environments[envKey];
    console.log(
      `${envConfig.color} ${envConfig.name}: ${result.success ? '✅ PASS' : '❌ FAIL'}`
    );

    if (!result.success) {
      overallPass = false;
    }
  });

  console.log(
    `\n🎯 Overall Status: ${overallPass ? '✅ ALL ENVIRONMENTS PASS' : '❌ ISSUES DETECTED'}`
  );

  if (!overallPass) {
    console.log('\n🔧 Troubleshooting Recommendations:');
    console.log(
      '1. Check Vercel environment variables are correctly configured'
    );
    console.log(
      '2. Verify Environment Scope is set properly for each variable'
    );
    console.log('3. Ensure database URLs match expected hosts');
    console.log('4. Force redeploy environments after fixing variables');
  } else {
    console.log('\n🎉 All environments are correctly configured!');
    console.log('✅ Database connections working');
    console.log('✅ Environment variables present');
    console.log('✅ Deployment URLs accessible');
  }
}

async function main() {
  try {
    console.log('🎯 Testing all environment configurations...');
    console.log(
      '📊 Checking: Variables, Database Connections, Deployment URLs'
    );

    const results = {};

    // Test each environment
    for (const [envKey, envConfig] of Object.entries(environments)) {
      results[envKey] = await testEnvironment(envKey, envConfig);
    }

    // Generate comprehensive report
    await generateTestReport(results);

    console.log('\n📋 Next Steps:');
    console.log('1. Fix any failing tests above');
    console.log('2. Configure missing variables in Vercel Dashboard');
    console.log('3. Force redeploy environments if needed');
    console.log('4. Re-run this test to verify fixes');
  } catch (error) {
    console.error('❌ Testing failed:', error.message);
    process.exit(1);
  }
}

main();
