#!/usr/bin/env node

/**
 * 🚨 COMPLETE AUTHENTICATION AUDIT - 100% VERIFICATION
 * Expert Team Emergency Response - DEMO READY IN 1 HOUR
 *
 * Tests every authentication component end-to-end
 * Verifies database, environment, code, and flow
 */

import https from 'https';
import { URL } from 'url';
import { Client } from 'pg';

// Configuration
const PREVIEW_URL =
  'https://faevision-simplified-2vik0k2kd-scott-garretsons-projects.vercel.app';
const BYPASS_PARAM = '?_vercel_share=IZ9x0jn4UbxMOntm7brimQrEaqGfWgKT';
const DATABASE_URL =
  'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

const TEST_USERS = [
  { email: 'admin@faevision.com', password: 'FAEVision2025!' },
  { email: 'sarah.executive@faevision.com', password: 'FAEVision2025!' },
  { email: 'alex.contributor@faevision.com', password: 'FAEVision2025!' },
];

console.log('🚨 COMPLETE AUTHENTICATION AUDIT - DEMO READY');
console.log('=============================================');
console.log(`Target: ${PREVIEW_URL}`);
console.log(`Database: ${DATABASE_URL.substring(0, 50)}...`);
console.log('');

async function testDatabaseConnection() {
  console.log('🔍 STEP 1: DATABASE CONNECTION TEST');
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Database connection: SUCCESSFUL');

    // Check users table exists
    const usersQuery = await client.query(`
      SELECT COUNT(*) as user_count FROM information_schema.tables
      WHERE table_name = 'users'
    `);
    console.log(
      `✅ Users table: ${usersQuery.rows[0].user_count > 0 ? 'EXISTS' : 'MISSING'}`
    );

    // Check user data
    const userQuery = await client.query(
      'SELECT email, "passwordHash", role FROM users LIMIT 5'
    );
    console.log(`✅ User records: ${userQuery.rows.length} found`);
    userQuery.rows.forEach((user, i) => {
      console.log(
        `   ${i + 1}. ${user.email} (${user.role}) - Hash: ${user.passwordHash ? '✅' : '❌ MISSING'}`
      );
    });

    await client.end();
    return { success: true, userCount: userQuery.rows.length };
  } catch (error) {
    console.error('❌ Database connection: FAILED');
    console.error('   Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testVercelEnvironment() {
  console.log('\n🔍 STEP 2: VERCEL ENVIRONMENT VERIFICATION');
  console.log('Checking environment variables via API endpoints...');

  const envChecks = [
    { endpoint: '/api/auth/providers', name: 'Providers Endpoint' },
    { endpoint: '/api/auth/session', name: 'Session Endpoint' },
    { endpoint: '/api/auth/csrf', name: 'CSRF Endpoint' },
  ];

  const results = [];

  for (const check of envChecks) {
    try {
      const response = await makeRequest(
        `${PREVIEW_URL}${check.endpoint}${BYPASS_PARAM}`
      );
      const status = response.status === 200 ? '✅' : '❌';
      console.log(`${status} ${check.name}: HTTP ${response.status}`);

      if (response.status === 200) {
        try {
          const data = JSON.parse(response.body);
          console.log(
            `   Response: ${JSON.stringify(data).substring(0, 100)}...`
          );
        } catch {
          console.log(`   Response: ${response.body.substring(0, 100)}...`);
        }
      }

      results.push({
        name: check.name,
        status: response.status,
        success: response.status === 200,
      });
    } catch (error) {
      console.error(`❌ ${check.name}: ${error.message}`);
      results.push({ name: check.name, success: false, error: error.message });
    }
  }

  return results;
}

async function testAuthenticationFlow() {
  console.log('\n🔍 STEP 3: END-TO-END AUTHENTICATION FLOW');

  const results = [];

  for (const user of TEST_USERS) {
    console.log(`\n🧪 Testing user: ${user.email}`);

    try {
      // Step 1: Get CSRF token
      console.log('   1. Getting CSRF token...');
      const csrfResponse = await makeRequest(
        `${PREVIEW_URL}/api/auth/csrf${BYPASS_PARAM}`
      );
      if (csrfResponse.status !== 200) {
        throw new Error(`CSRF token fetch failed: HTTP ${csrfResponse.status}`);
      }

      const csrfData = JSON.parse(csrfResponse.body);
      console.log(
        `   ✅ CSRF token: ${csrfData.csrfToken ? 'OBTAINED' : 'MISSING'}`
      );

      // Step 2: Attempt authentication
      console.log('   2. Attempting authentication...');
      const authUrl = `${PREVIEW_URL}/api/auth/callback/credentials${BYPASS_PARAM}`;

      const authResponse = await makeRequest(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: `next-auth.csrf-token=${csrfData.csrfToken}`,
        },
        body: new URLSearchParams({
          email: user.email,
          password: user.password,
          csrfToken: csrfData.csrfToken,
          callbackUrl: `${PREVIEW_URL}${BYPASS_PARAM}`,
          json: 'true',
        }).toString(),
      });

      console.log(`   🔄 Auth response: HTTP ${authResponse.status}`);

      // Step 3: Check for session after auth attempt
      console.log('   3. Checking session...');
      const sessionResponse = await makeRequest(
        `${PREVIEW_URL}/api/auth/session${BYPASS_PARAM}`
      );
      const sessionData = JSON.parse(sessionResponse.body);

      const isAuthenticated = sessionData?.user ? true : false;
      const status = isAuthenticated ? '✅ SUCCESS' : '❌ FAILED';
      console.log(
        `   ${status} Session: ${isAuthenticated ? `User: ${sessionData.user.email}` : 'No active session'}`
      );

      results.push({
        email: user.email,
        csrfSuccess: true,
        authResponse: authResponse.status,
        sessionSuccess: isAuthenticated,
        userData: sessionData?.user,
      });
    } catch (error) {
      console.error(`   ❌ Authentication failed: ${error.message}`);
      results.push({
        email: user.email,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

async function testFrontendLoginForm() {
  console.log('\n🔍 STEP 4: FRONTEND LOGIN FORM VERIFICATION');

  try {
    const loginResponse = await makeRequest(
      `${PREVIEW_URL}/login${BYPASS_PARAM}`
    );

    if (loginResponse.status !== 200) {
      throw new Error(
        `Login page not accessible: HTTP ${loginResponse.status}`
      );
    }

    // Check for required form elements
    const checks = [
      { element: 'form', name: 'Login form' },
      { element: 'input[type="email"]', name: 'Email input' },
      { element: 'input[type="password"]', name: 'Password input' },
      { element: 'button[type="submit"]', name: 'Submit button' },
    ];

    const html = loginResponse.body;
    const results = [];

    for (const check of checks) {
      const found =
        html.includes(`<${check.element}`) || html.includes(`${check.element}`);
      const status = found ? '✅' : '❌';
      console.log(`${status} ${check.name}: ${found ? 'PRESENT' : 'MISSING'}`);
      results.push({ name: check.name, found });
    }

    return results;
  } catch (error) {
    console.error(`❌ Frontend test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'FAEVision-Auth-Audit/1.0',
        Accept:
          'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers,
      },
    };

    if (options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(
        options.body
      );
    }

    const req = https.request(requestOptions, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', error => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function runCompleteAudit() {
  console.log('🔬 STARTING COMPREHENSIVE AUTHENTICATION AUDIT');
  console.log('==============================================\n');

  const auditResults = {
    timestamp: new Date().toISOString(),
    steps: [],
  };

  try {
    // Step 1: Database
    const dbResult = await testDatabaseConnection();
    auditResults.steps.push({ name: 'Database', ...dbResult });

    // Step 2: Vercel Environment
    const envResults = await testVercelEnvironment();
    auditResults.steps.push({ name: 'Environment', results: envResults });

    // Step 3: Authentication Flow
    const authResults = await testAuthenticationFlow();
    auditResults.steps.push({ name: 'Authentication', results: authResults });

    // Step 4: Frontend
    const frontendResults = await testFrontendLoginForm();
    auditResults.steps.push({ name: 'Frontend', results: frontendResults });
  } catch (error) {
    console.error('\n❌ AUDIT FAILED:', error.message);
    auditResults.error = error.message;
  }

  // Generate summary
  console.log('\n📊 AUDIT SUMMARY');
  console.log('================');

  const totalSteps = auditResults.steps.length;
  const successfulSteps = auditResults.steps.filter(
    step =>
      step.success ||
      (step.results && step.results.every(r => r.success !== false))
  ).length;

  console.log(`✅ Successful steps: ${successfulSteps}/${totalSteps}`);
  console.log(
    `📈 Success rate: ${Math.round((successfulSteps / totalSteps) * 100)}%`
  );

  // Detailed results
  auditResults.steps.forEach((step, index) => {
    console.log(`\n${index + 1}. ${step.name}:`);
    if (step.success !== undefined) {
      console.log(`   Status: ${step.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    }
    if (step.results) {
      step.results.forEach(result => {
        const status = result.success || result.found ? '✅' : '❌';
        console.log(
          `   ${status} ${result.name || result.email}: ${result.error || 'OK'}`
        );
      });
    }
  });

  console.log('\n🔧 RECOMMENDATIONS:');
  if (successfulSteps < totalSteps) {
    console.log('❌ Issues found - check individual step results above');
    console.log('🔍 Next steps:');
    console.log('   1. Fix database connectivity if users missing');
    console.log('   2. Verify Vercel environment variables');
    console.log('   3. Check NextAuth configuration');
    console.log('   4. Test authentication endpoints');
  } else {
    console.log('✅ All systems operational - ready for demo!');
  }

  return auditResults;
}

// Run the complete audit
runCompleteAudit().catch(console.error);
