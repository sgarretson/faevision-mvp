#!/usr/bin/env node

/**
 * Preview Deployment Testing Script
 * 
 * Tests the FAEVision V2 MVP Preview deployment with all Sprint 1-4 features:
 * - Basic connectivity and environment
 * - Core API endpoints functionality
 * - Executive workflow testing
 * - Performance validation
 */

const https = require('https');
const { URL } = require('url');

// Preview URL (will be updated when known)
const PREVIEW_URLS = [
  'https://faevision-simplified-git-preview-scott-garretsons-projects.vercel.app',
  'https://faevision-simplified-git-preview.vercel.app',
  'https://faevision-mvp-git-preview.vercel.app',
  'https://faevision-simplified-preview.vercel.app'
];

class PreviewTester {
  constructor() {
    this.results = [];
    this.baseUrl = null;
  }

  async findWorkingUrl() {
    console.log('🔍 Finding working preview URL...\n');
    
    for (const url of PREVIEW_URLS) {
      try {
        const response = await this.makeRequest(url, '/');
        if (response.statusCode < 400) {
          this.baseUrl = url;
          console.log(`✅ Found working preview URL: ${url}\n`);
          return url;
        }
      } catch (error) {
        console.log(`❌ ${url} - Not accessible`);
      }
    }
    
    throw new Error('No working preview URL found');
  }

  async makeRequest(baseUrl, path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const requestOptions = {
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'FAEVision-Preview-Tester/1.0',
          ...options.headers
        },
        timeout: 15000
      };

      const req = https.request(url, requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));
      req.setTimeout(15000);
      req.end(options.body);
    });
  }

  async testEndpoint(name, path, expectedStatus = 200) {
    const startTime = Date.now();
    
    try {
      const response = await this.makeRequest(this.baseUrl, path);
      const duration = Date.now() - startTime;
      
      const success = response.statusCode === expectedStatus;
      const result = {
        name,
        path,
        success,
        statusCode: response.statusCode,
        duration: `${duration}ms`,
        error: success ? null : `Expected ${expectedStatus}, got ${response.statusCode}`
      };
      
      this.results.push(result);
      
      const status = success ? '✅' : '❌';
      console.log(`${status} ${name}: ${response.statusCode} (${duration}ms)`);
      
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const result = {
        name,
        path,
        success: false,
        statusCode: 'ERROR',
        duration: `${duration}ms`,
        error: error.message
      };
      
      this.results.push(result);
      console.log(`❌ ${name}: ERROR - ${error.message} (${duration}ms)`);
      
      return result;
    }
  }

  async runBasicTests() {
    console.log('📋 Running basic connectivity tests...\n');
    
    await this.testEndpoint('Homepage', '/');
    await this.testEndpoint('Hotspots Page', '/hotspots');
    await this.testEndpoint('Auth Config', '/api/auth/session');
  }

  async runAPITests() {
    console.log('\n🔧 Testing API endpoints...\n');
    
    await this.testEndpoint('Hotspots API', '/api/hotspots');
    await this.testEndpoint('Hotspot Metrics', '/api/hotspots/metrics');
    await this.testEndpoint('Performance Monitoring', '/api/monitoring/performance');
    await this.testEndpoint('Production Readiness', '/api/deploy/production-readiness');
  }

  async runAdvancedTests() {
    console.log('\n🚀 Testing advanced features...\n');
    
    // Test clustering endpoint (POST)
    try {
      const clusterResponse = await this.makeRequest(this.baseUrl, '/api/cluster/generate-hotspots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minClusterSize: 3,
          generateSolutions: false
        })
      });
      
      const success = clusterResponse.statusCode < 400;
      console.log(`${success ? '✅' : '❌'} Clustering API: ${clusterResponse.statusCode}`);
      
    } catch (error) {
      console.log(`❌ Clustering API: ERROR - ${error.message}`);
    }

    // Test production readiness (POST)
    try {
      const readinessResponse = await this.makeRequest(this.baseUrl, '/api/deploy/production-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          includeFullTests: false,
          baseUrl: this.baseUrl
        })
      });
      
      const success = readinessResponse.statusCode < 400;
      console.log(`${success ? '✅' : '❌'} Production Readiness Check: ${readinessResponse.statusCode}`);
      
      if (success) {
        try {
          const data = JSON.parse(readinessResponse.data);
          if (data.readiness && data.readiness.overall) {
            console.log(`    📊 Readiness Score: ${data.readiness.overall.score}%`);
            console.log(`    🎯 Production Ready: ${data.readiness.overall.ready ? 'YES' : 'NO'}`);
          }
        } catch (parseError) {
          console.log('    ⚠️  Could not parse readiness response');
        }
      }
      
    } catch (error) {
      console.log(`❌ Production Readiness Check: ERROR - ${error.message}`);
    }
  }

  async generateReport() {
    console.log('\n📊 PREVIEW DEPLOYMENT TEST REPORT\n');
    console.log('=' .repeat(50));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;
    
    console.log(`Preview URL: ${this.baseUrl}`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Pass Rate: ${passRate}%`);
    console.log(`Overall Status: ${passRate >= 80 ? '✅ GOOD' : passRate >= 60 ? '⚠️  NEEDS ATTENTION' : '❌ CRITICAL ISSUES'}`);
    
    console.log('\nDetailed Results:');
    console.log('-'.repeat(50));
    
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.name}`);
      console.log(`    Path: ${result.path}`);
      console.log(`    Status: ${result.statusCode}`);
      console.log(`    Duration: ${result.duration}`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
      console.log('');
    });
    
    if (passRate >= 80) {
      console.log('🎉 Preview deployment is ready for executive testing!');
      console.log('📱 Test on mobile devices for executive workflow validation.');
      console.log('🔍 All major features appear to be functional.');
    } else if (passRate >= 60) {
      console.log('⚠️  Preview deployment has some issues but core functionality works.');
      console.log('🔧 Review failed tests and fix critical issues before executive testing.');
    } else {
      console.log('❌ Preview deployment has critical issues.');
      console.log('🚨 Do not proceed with executive testing until issues are resolved.');
    }
    
    return passRate;
  }

  async runFullTest() {
    try {
      console.log('🚀 FAEVision V2 MVP Preview Deployment Test\n');
      console.log('Testing all Sprint 1-4 features on Vercel Preview...\n');
      
      await this.findWorkingUrl();
      await this.runBasicTests();
      await this.runAPITests();
      await this.runAdvancedTests();
      
      const passRate = await this.generateReport();
      
      process.exit(passRate >= 80 ? 0 : 1);
      
    } catch (error) {
      console.error('\n❌ Preview testing failed:', error.message);
      console.error('🔧 Check Vercel deployment status and try again.');
      process.exit(1);
    }
  }
}

// Run the test
const tester = new PreviewTester();
tester.runFullTest();
