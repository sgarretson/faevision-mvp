#!/usr/bin/env node

/**
 * Vercel Branch Deployment Diagnostic Tool
 * Expert: Jordan Kim (Vercel Engineer)
 * 
 * Diagnoses why Preview and Development branches aren't deploying
 */

console.log('🔍 Vercel Branch Deployment Diagnostic\n');

const issues = {
  'Environment Variable Placeholders': {
    severity: 'HIGH',
    description: 'Placeholder values instead of real API keys',
    affected: ['Preview', 'Development'],
    details: [
      'OPENAI_API_KEY = "[Copy from production .env file - OpenAI API key]"',
      'RESEND_API_KEY = "your-resend-api-key-here"'
    ],
    fix: 'Replace with actual API key values'
  },
  
  'Branch Deployment Settings': {
    severity: 'CRITICAL',
    description: 'Vercel may not be configured to deploy preview/develop branches',
    affected: ['Preview', 'Development'],
    details: [
      'Git pushes succeed but no deployments created',
      'URLs return DEPLOYMENT_NOT_FOUND',
      'May need manual branch deployment configuration'
    ],
    fix: 'Check Vercel project Git settings'
  },
  
  'Environment Scope Configuration': {
    severity: 'MEDIUM', 
    description: 'Environment variables may be set with wrong scope',
    affected: ['Preview', 'Development'],
    details: [
      'Variables configured but may not apply to correct branches',
      'Environment Scope must exactly match branch patterns'
    ],
    fix: 'Verify Environment Scope settings in Vercel'
  }
};

console.log('🚨 IDENTIFIED ISSUES:\n');

Object.entries(issues).forEach(([issue, details]) => {
  console.log(`${details.severity === 'CRITICAL' ? '🔴' : details.severity === 'HIGH' ? '🟡' : '🟠'} ${issue}`);
  console.log(`   Severity: ${details.severity}`);
  console.log(`   Affected: ${details.affected.join(', ')}`);
  console.log(`   Problem: ${details.description}`);
  console.log(`   Fix: ${details.fix}`);
  if (details.details) {
    console.log(`   Details:`);
    details.details.forEach(detail => console.log(`     - ${detail}`));
  }
  console.log('');
});

console.log('🎯 IMMEDIATE ACTIONS REQUIRED:\n');

console.log('1. ⚠️  Fix Environment Variable Placeholders');
console.log('   Go to Vercel Dashboard → faevision-simplified → Settings → Environment Variables');
console.log('   Update these placeholder values:');
console.log('   - OPENAI_API_KEY: Replace with actual OpenAI API key');
console.log('   - RESEND_API_KEY: Replace with actual Resend API key (or remove if not needed)');
console.log('');

console.log('2. 🔴 Check Branch Deployment Configuration');
console.log('   Go to Vercel Dashboard → faevision-simplified → Settings → Git');
console.log('   Verify these settings:');
console.log('   - Auto-deploy branches: Enabled');
console.log('   - Production branch: main');
console.log('   - Deploy preview for all branches: Enabled');
console.log('');

console.log('3. ⚙️  Verify Environment Scope Settings');
console.log('   Go to Vercel Dashboard → faevision-simplified → Settings → Environment Variables');
console.log('   For each variable, check Environment Scope:');
console.log('   - Preview variables: Environment = "Preview"');
console.log('   - Development variables: Environment = "Development"');
console.log('   - NOT "All Environments" (this can cause conflicts)');
console.log('');

console.log('4. 🚀 Test After Configuration');
console.log('   Force new deployments:');
console.log('   git push origin preview --force-with-lease');
console.log('   git push origin develop --force-with-lease');
console.log('');
console.log('   Wait 2-3 minutes, then test:');
console.log('   curl -I https://faevision-simplified-git-preview.vercel.app');
console.log('   curl -I https://faevision-simplified-git-develop.vercel.app');
console.log('');

console.log('📋 SUCCESS CRITERIA:');
console.log('- Preview URL returns 200 OK (not 404)');
console.log('- Development URL returns 200 OK (not 404)');
console.log('- No placeholder values in environment variables');
console.log('- Branch deployments visible in Vercel dashboard');
console.log('');

console.log('🚨 IF ISSUE PERSISTS:');
console.log('The problem may be that Vercel project lost connection to GitHub branches.');
console.log('Contact Jordan Kim (Vercel Engineer) to check project Git integration settings.');
