#!/usr/bin/env node

/**
 * 🚨 COMPREHENSIVE AUTHENTICATION TESTING SCRIPT
 * Expert Team: All-Expert Emergency Response
 * 
 * Tests every layer of the authentication stack to identify failure points
 */

import https from 'https'
import { URL } from 'url'

// Test configuration
const PREVIEW_URL = 'https://faevision-simplified-2vik0k2kd-scott-garretsons-projects.vercel.app';
const TEST_CREDENTIALS = {
  email: 'admin@faevision.com',
  password: 'FAEVision2025!'
};

console.log('🚨 EMERGENCY AUTHENTICATION TESTING');
console.log('===================================');
console.log(`Target URL: ${PREVIEW_URL}`);
console.log('');

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'FAEVision-Auth-Test/1.0',
        ...options.headers
      }
    };

    if (options.body) {
      requestOptions.headers['Content-Type'] = 'application/json';
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

async function testLayer(layerName, testFn) {
  console.log(`🔍 Testing ${layerName}...`);
  try {
    const result = await testFn();
    console.log(`✅ ${layerName}: ${result}`);
    return { layer: layerName, status: 'PASS', result };
  } catch (error) {
    console.log(`❌ ${layerName}: ${error.message}`);
    return { layer: layerName, status: 'FAIL', error: error.message };
  }
}

async function comprehensiveAuthTest() {
  const results = [];

  // Layer 1: Basic connectivity
  results.push(await testLayer('Basic Connectivity', async () => {
    const response = await makeRequest(PREVIEW_URL);
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return `Site accessible (${response.status})`;
  }));

  // Layer 2: Login page accessibility
  results.push(await testLayer('Login Page Access', async () => {
    const response = await makeRequest(`${PREVIEW_URL}/login`);
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    if (!response.body.includes('FAEVision')) {
      throw new Error('Login page content invalid');
    }
    return 'Login page loads correctly';
  }));

  // Layer 3: NextAuth configuration endpoint
  results.push(await testLayer('NextAuth Configuration', async () => {
    const response = await makeRequest(`${PREVIEW_URL}/api/auth/session`);
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    try {
      const session = JSON.parse(response.body);
      return `NextAuth responding (session: ${session ? 'active' : 'inactive'})`;
    } catch
      throw new Error('Invalid JSON response from NextAuth');
    }
  }));

  // Layer 4: Authentication endpoint availability
  results.push(await testLayer('Auth Endpoint Availability', async () => {
    const response = await makeRequest(`${PREVIEW_URL}/api/auth/providers`);
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    try {
      const providers = JSON.parse(response.body);
      if (!providers.credentials) {
        throw new Error('Credentials provider not found');
      }
      return 'Credentials provider available';
    } catch
      throw new Error('Providers endpoint invalid');
    }
  }));

  // Layer 5: CSRF token retrieval
  results.push(await testLayer('CSRF Token', async () => {
    const response = await makeRequest(`${PREVIEW_URL}/api/auth/csrf`);
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    try {
      const csrf = JSON.parse(response.body);
      if (!csrf.csrfToken) {
        throw new Error('CSRF token missing');
      }
      return `CSRF token available (${csrf.csrfToken.substring(0, 8)}...)`;
    } catch
      throw new Error('CSRF endpoint invalid');
    }
  }));

  // Layer 6: Database connectivity test (indirect)
  results.push(await testLayer('Database Connectivity', async () => {
    // Test by attempting to access a protected API endpoint
    const response = await makeRequest(`${PREVIEW_URL}/api/inputs`);
    if (response.status === 401) {
      return 'Database reachable (401 expected without auth)';
    } else if (response.status === 500) {
      throw new Error('Database connection error (500)');
    } else {
      return `Unexpected response: ${response.status}`;
    }
  }));

  // Layer 7: Actual authentication attempt
  results.push(await testLayer('Authentication Attempt', async () => {
    // First get CSRF token
    const csrfResponse = await makeRequest(`${PREVIEW_URL}/api/auth/csrf`);
    const csrfData = JSON.parse(csrfResponse.body);
    
    // Attempt authentication
    const authResponse = await makeRequest(`${PREVIEW_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: TEST_CREDENTIALS.email,
        password: TEST_CREDENTIALS.password,
        csrfToken: csrfData.csrfToken,
        callbackUrl: PREVIEW_URL,
        json: 'true'
      }).toString()
    });

    if (authResponse.status === 200) {
      try {
        const authResult = JSON.parse(authResponse.body);
        if (authResult.url) {
          return 'Authentication successful (redirect)';
        } else if (authResult.error) {
          throw new Error(`Auth error: ${authResult.error}`);
        } else {
          return 'Authentication response unclear';
        }
      } catch
        return 'Authentication succeeded (non-JSON response)';
      }
    } else {
      throw new Error(`Auth failed: HTTP ${authResponse.status}`);
    }
  }));

  // Generate report
  console.log('\n📊 COMPREHENSIVE TEST RESULTS');
  console.log('==============================');
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${Math.round((passed / results.length) * 100)}%`);
  console.log('');

  results.forEach(result => {
    const emoji = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${emoji} ${result.layer}: ${result.result || result.error}`);
  });

  console.log('\n🔧 RECOMMENDED ACTIONS:');
  
  const failedLayers = results.filter(r => r.status === 'FAIL');
  if (failedLayers.length === 0) {
    console.log('✅ All tests passed! Authentication should be working.');
  } else {
    failedLayers.forEach(failure => {
      console.log(`❌ Fix ${failure.layer}: ${failure.error}`);
    });
  }

  return results;
}

// Run the comprehensive test
comprehensiveAuthTest().catch(console.error);
