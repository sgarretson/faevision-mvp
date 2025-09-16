#!/usr/bin/env node

/**
 * FAEVision: Vercel Preview Environment ONLY Configuration
 *
 * CRITICAL: Only Preview environment exists - no Development/Production
 * USER CONFIRMED: Use Prisma Accelerate URLs for Preview environment
 */

console.log('🎯 FAEVision: Preview Environment ONLY Configuration');
console.log('==================================================\n');

console.log('✅ CONFIRMED SETUP:');
console.log('- ONLY Preview environment exists');
console.log('- NO Development or Production environments');
console.log('- Prisma Accelerate is the ONLY database\n');

console.log('📋 VERCEL DASHBOARD CONFIGURATION:');
console.log('==================================\n');

console.log('1. Go to: https://vercel.com/dashboard');
console.log('2. Select project: faevision-simplified');
console.log('3. Navigate: Settings → Environment Variables');
console.log('4. ENSURE these variables for PREVIEW environment ONLY:\n');

console.log('   Variable: POSTGRES_URL');
console.log(
  '   Value: postgres://f279b9e46e7c0166b4949c4f910079cd6f0cbb7ae03a783a14b933638f1ba0ce:sk_paIQiDGXmKNC6q0ngZD0i@db.prisma.io:5432/postgres?sslmode=require'
);
console.log('   Environment: Preview\n');

console.log('   Variable: PRISMA_DATABASE_URL');
console.log(
  '   Value: prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19wYUlRaURHWG1LTkM2cTBuZ1pEMGkiLCJhcGlfa2V5IjoiMDFLNTgzMTM1QUgwWDBHODdDQTNaUjBYMTIiLCJ0ZW5hbnRfaWQiOiJmMjc5YjllNDZlN2MwMTY2YjQ5NDljNGY5MTAwNzljZDZmMGNiYjdhZTAzYTc4M2ExNGI5MzM2MzhmMWJhMGNlIiwiaW50ZXJuYWxfc2VjcmV0IjoiZDEzYmE2ZGEtMzZmYS00NTUzLTk4OGEtNDVhZDViZDRjZjc4In0.VK-wEODGJVTE81IxhZ1kEfwPyB4M14blC_3XoJbrYDE'
);
console.log('   Environment: Preview\n');

console.log('   Variable: NEXTAUTH_URL');
console.log(
  '   Value: https://faevision-simplified-git-preview-scott-garretsons-projects.vercel.app'
);
console.log('   Environment: Preview\n');

console.log('   Variable: NEXTAUTH_SECRET');
console.log('   Value: preview-secret-faevision-separate-2025');
console.log('   Environment: Preview\n');

console.log('   Variable: OPENAI_API_KEY');
console.log('   Value: [Your OpenAI API key]');
console.log('   Environment: Preview\n');

console.log('🚨 CRITICAL CORRECTIONS:');
console.log('========================\n');
console.log('❌ DELETE any variables pointing to:');
console.log('   - ep-round-frost-aecda5ou (Neon Postgres - WRONG)');
console.log('   - ep-lingering-queen-ae13d5gh (Neon Postgres - WRONG)');
console.log('   - Any DATABASE_URL variables (schema uses POSTGRES_URL)\n');

console.log('✅ ONLY KEEP variables pointing to:');
console.log('   - db.prisma.io:5432 (Prisma Accelerate - CORRECT)');
console.log(
  '   - accelerate.prisma-data.net (Prisma Accelerate proxy - CORRECT)\n'
);

console.log('🎯 SCHEMA ALIGNMENT:');
console.log('===================');
console.log('✅ Prisma schema uses: env("POSTGRES_URL")');
console.log('✅ Vercel should have: POSTGRES_URL variable');
console.log('✅ Value: Your Prisma Accelerate URL\n');

console.log('🔄 DEPLOYMENT:');
console.log('==============');
console.log('After setting variables, force redeploy:');
console.log('git push origin preview --force-with-lease\n');

console.log('✅ EXPECTED RESULTS:');
console.log('===================');
console.log('✓ All APIs connect to your Prisma Accelerate database');
console.log('✓ Ideas API returns 5 AI-generated ideas');
console.log('✓ Hotspots API returns 3 clustered hotspots');
console.log('✓ Dashboard shows real metrics from 20 signals');
console.log('✓ Complete V2 functionality working\n');

process.exit(0);
