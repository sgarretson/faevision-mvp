#!/usr/bin/env node

/**
 * Check environment variables in the deployed application
 */

const https = require('https');
const { URL } = require('url');

const BASE_URL = 'https://faevision-simplified-a5k7uvloo-scott-garretsons-projects.vercel.app';
const BYPASS_PARAM = '?_vercel_share=FjrU8XRCbVHwYlUMyJEMsKgTuR0S9vEt';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      }
    };

    if (options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testEnvironment() {
  console.log('🔍 Checking Environment Configuration...');

  // Test providers endpoint (should return available auth providers)
  console.log('\n1. Testing Auth Providers:');
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/providers${BYPASS_PARAM}`);
    console.log(`   Status: ${response.status}`);
    if (response.status === 200) {
      try {
        const providers = JSON.parse(response.body);
        console.log('   ✅ Providers available:', Object.keys(providers));
      } catch (e) {
        console.log('   ⚠️  Response not JSON:', response.body.substring(0, 100));
      }
    } else {
      console.log('   ❌ Failed to get providers');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test session endpoint (should return current session or null)
  console.log('\n2. Testing Session Check:');
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/session${BYPASS_PARAM}`);
    console.log(`   Status: ${response.status}`);
    if (response.status === 200) {
      try {
        const session = JSON.parse(response.body);
        console.log('   ✅ Session check successful');
        console.log('   Current user:', session.user ? session.user.email : 'None');
      } catch (e) {
        console.log('   ⚠️  Response not JSON:', response.body.substring(0, 100));
      }
    } else {
      console.log('   ❌ Failed to check session');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test CSRF endpoint
  console.log('\n3. Testing CSRF Token:');
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/csrf${BYPASS_PARAM}`);
    console.log(`   Status: ${response.status}`);
    if (response.status === 200) {
      try {
        const csrf = JSON.parse(response.body);
        console.log('   ✅ CSRF token available');
      } catch (e) {
        console.log('   ⚠️  Response not JSON:', response.body.substring(0, 100));
      }
    } else {
      console.log('   ❌ Failed to get CSRF token');
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n📋 ENVIRONMENT CHECK COMPLETE');
  console.log('If all endpoints return 200, environment is configured correctly.');
  console.log('If any return 500, there may be database or config issues.');
}

testEnvironment().catch(console.error);
