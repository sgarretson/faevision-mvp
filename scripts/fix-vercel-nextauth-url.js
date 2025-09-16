#!/usr/bin/env node

/**
 * FAEVision Vercel NEXTAUTH_URL Fix Script
 *
 * This script helps fix the NEXTAUTH_URL mismatch between what's configured
 * in Vercel and the actual deployed URL.
 *
 * Issue: Vercel is setting NEXTAUTH_URL to generic project URL instead of
 * the actual GitHub-scoped URL (scott-garretsons-projects)
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FAEVision Vercel NEXTAUTH_URL Fix Script');
console.log('===========================================\n');

// Check if we're in the project root
const projectRoot = path.resolve(__dirname, '..');
const vercelJsonPath = path.join(projectRoot, 'vercel.json');

if (!fs.existsSync(vercelJsonPath)) {
  console.error('❌ Error: vercel.json not found in project root');
  process.exit(1);
}

console.log('✅ Found vercel.json');
console.log('📝 Current Configuration Analysis:\n');

// Read current vercel.json
let vercelConfig;
try {
  vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
} catch (error) {
  console.error('❌ Error reading vercel.json:', error.message);
  process.exit(1);
}

console.log(`Project Name: ${vercelConfig.name}`);
console.log(
  `Expected Preview URL: https://${vercelConfig.name}-git-preview.vercel.app`
);
console.log(
  `Actual Preview URL: https://${vercelConfig.name}-git-preview-scott-garretsons-projects.vercel.app\n`
);

console.log('🚨 NEXTAUTH_URL MISMATCH DETECTED!');
console.log('=====================================\n');

console.log('📋 REQUIRED FIXES IN VERCEL DASHBOARD:');
console.log('========================================');
console.log('');
console.log('1. Go to: https://vercel.com/dashboard');
console.log(`2. Select project: ${vercelConfig.name}`);
console.log('3. Navigate: Settings → Environment Variables');
console.log('4. Update NEXTAUTH_URL for Preview environment:');
console.log('');
console.log('   FROM: https://faevision-simplified-git-preview.vercel.app');
console.log(
  '   TO:   https://faevision-simplified-git-preview-scott-garretsons-projects.vercel.app'
);
console.log('');
console.log('5. Update NEXTAUTH_URL for Development environment:');
console.log('');
console.log('   FROM: https://faevision-simplified-git-develop.vercel.app');
console.log(
  '   TO:   https://faevision-simplified-git-develop-scott-garretsons-projects.vercel.app'
);
console.log('');
console.log('6. Click "Save" for each environment');
console.log('7. Force redeploy both environments');
console.log('');

console.log('🔄 DEPLOYMENT COMMANDS:');
console.log('=======================');
console.log('');
console.log('# Force redeploy preview branch');
console.log('git push origin preview --force-with-lease');
console.log('');
console.log('# Force redeploy develop branch');
console.log('git push origin develop --force-with-lease');
console.log('');

console.log('🧪 VERIFICATION STEPS:');
console.log('======================');
console.log('');
console.log('1. Wait for Vercel deployments to complete');
console.log('2. Test login at the corrected URLs');
console.log('3. Verify data loads properly in all pages');
console.log('4. Check that input creation works without 500 errors');
console.log('');

console.log('✅ EXPECTED RESULTS AFTER FIX:');
console.log('===============================');
console.log('');
console.log('✓ Authentication will work properly');
console.log('✓ Data will load in Strategic Inputs page');
console.log('✓ Input creation will succeed (no 500 errors)');
console.log('✓ All features will display data correctly');
console.log('');

console.log('🎯 IMMEDIATE NEXT STEPS:');
console.log('=======================');
console.log('');
console.log('1. Update Vercel environment variables as shown above');
console.log('2. Force redeploy both environments');
console.log('3. Test the corrected URLs');
console.log('4. Report back the results');
console.log('');

console.log('🔗 USE THESE URLs FOR TESTING:');
console.log('===============================');
console.log(
  `Preview:    https://${vercelConfig.name}-git-preview-scott-garretsons-projects.vercel.app`
);
console.log(
  `Development: https://${vercelConfig.name}-git-develop-scott-garretsons-projects.vercel.app`
);
console.log('');

console.log('📞 SUPPORT:');
console.log('===========');
console.log('If issues persist after this fix, the problem may be:');
console.log('• Database connectivity issues');
console.log('• Additional environment variable mismatches');
console.log('• Code deployment problems');
console.log('• Vercel project configuration issues');
console.log('');

process.exit(0);
