#!/usr/bin/env node

/**
 * FAEVision Environment Variable Diagnostic Tool
 * Expert: Jordan Kim (Vercel Engineer) + Alex Thompson (Lead Developer)
 *
 * This script helps diagnose environment variable issues in Vercel deployment
 */

console.log('🔍 FAEVision Environment Variable Diagnostic Tool\n');

// Required environment variables for Auth.js v5
const requiredEnvVars = {
  NEXTAUTH_SECRET: {
    description: 'Secret key for NextAuth.js JWT signing',
    example: 'your-nextauth-secret-here-32-chars-minimum',
    critical: true,
    generate: () => require('crypto').randomBytes(32).toString('hex'),
  },
  NEXTAUTH_URL: {
    description: 'The canonical URL of your deployment',
    example: 'https://faevision-simplified.vercel.app',
    critical: true,
    production: 'https://faevision-simplified.vercel.app',
  },
  DATABASE_URL: {
    description: 'Vercel Postgres connection string with pooling',
    example: 'postgresql://user:pass@host:port/db?sslmode=require',
    critical: true,
    note: 'Must include pooler endpoint for Vercel serverless',
  },
  DIRECT_URL: {
    description: 'Direct database connection for migrations',
    example: 'postgresql://user:pass@host:port/db?sslmode=require',
    critical: true,
    note: 'Direct endpoint (no pooler) for Prisma migrations',
  },
  OPENAI_API_KEY: {
    description: 'OpenAI API key for AI features',
    example: 'sk-...',
    critical: false,
    note: 'Required for F1 auto-tagging features',
  },
};

// Generate secure values
function generateSecureValues() {
  console.log('🔐 Generated Secure Values for Production:\n');

  console.log('NEXTAUTH_SECRET (copy this to Vercel):');
  console.log(`"${requiredEnvVars.NEXTAUTH_SECRET.generate()}"`);
  console.log('');

  console.log('NEXTAUTH_URL (copy this to Vercel):');
  console.log(`"${requiredEnvVars.NEXTAUTH_URL.production}"`);
  console.log('');
}

// Provide step-by-step Vercel configuration
function showVercelConfiguration() {
  console.log('⚙️ Vercel Dashboard Configuration Steps:\n');
  console.log('1. Go to: https://vercel.com/dashboard');
  console.log('2. Find: "faevision-simplified" project');
  console.log('3. Navigate: Settings → Environment Variables');
  console.log('4. Add each variable below:\n');

  Object.entries(requiredEnvVars).forEach(([key, config]) => {
    console.log(`📌 ${key}`);
    console.log(`   Description: ${config.description}`);
    if (config.critical) {
      console.log(`   ⚠️  CRITICAL: Required for authentication to work`);
    }
    if (config.production) {
      console.log(`   Production Value: "${config.production}"`);
    } else if (key === 'NEXTAUTH_SECRET') {
      console.log(`   Production Value: Use generated value above`);
    } else {
      console.log(`   Example: "${config.example}"`);
    }
    if (config.note) {
      console.log(`   Note: ${config.note}`);
    }
    console.log('');
  });
}

// Test endpoint after configuration
function showTestingSteps() {
  console.log('🧪 Testing Steps After Configuration:\n');
  console.log('1. Save all environment variables in Vercel');
  console.log('2. Trigger a new deployment by pushing to main branch');
  console.log('3. Test endpoints:');
  console.log(
    '   curl -s "https://faevision-simplified.vercel.app/api/auth/providers"'
  );
  console.log('   Should return: {"credentials":{"name":"credentials"}}');
  console.log('');
  console.log('4. Test login page:');
  console.log('   Visit: https://faevision-simplified.vercel.app/login');
  console.log('   Should load without errors');
  console.log('');
  console.log('5. Test authentication flow:');
  console.log('   - Use demo credentials on login page');
  console.log('   - Should redirect to dashboard after successful login');
}

// Main diagnostic flow
function main() {
  console.log(
    'Current Issue: 500 Internal Server Error on /api/auth/providers\n'
  );
  console.log(
    'Root Cause: Missing or incorrect environment variables in Vercel\n'
  );
  console.log('Solution: Configure required environment variables manually\n');
  console.log('=' * 60 + '\n');

  generateSecureValues();
  showVercelConfiguration();
  showTestingSteps();

  console.log('🎯 Expert Assignment:');
  console.log(
    '- Jordan Kim (Vercel Engineer): Environment variable configuration'
  );
  console.log('- Alex Thompson (Lead Developer): Authentication testing');
  console.log(
    '- Morgan Smith (Database Architect): Database connection verification'
  );
}

if (require.main === module) {
  main();
}

module.exports = {
  requiredEnvVars,
  generateSecureValues,
  showVercelConfiguration,
  showTestingSteps,
};
