#!/usr/bin/env node

/**
 * FAEVision Comprehensive Build Test Framework
 *
 * MISSION: Catch ALL build errors locally before Vercel deployment
 * EXPERT: TypeScript Expert (Morgan Taylor) + Vercel Engineer (Jordan Kim)
 *
 * This script runs the EXACT same validation pipeline as Vercel to prevent
 * deployment failures and catch TypeScript strict mode violations early.
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
};

class BuildTestFramework {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.startTime = Date.now();
  }

  log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  error(message) {
    this.errors.push(message);
    this.log(`❌ ERROR: ${message}`, 'red');
  }

  warning(message) {
    this.warnings.push(message);
    this.log(`⚠️  WARNING: ${message}`, 'yellow');
  }

  success(message) {
    this.log(`✅ ${message}`, 'green');
  }

  info(message) {
    this.log(`ℹ️  ${message}`, 'blue');
  }

  async runCommand(command, description) {
    this.info(`Running: ${description}`);
    this.log(`Command: ${command}`, 'cyan');

    return new Promise((resolve, reject) => {
      exec(
        command,
        { maxBuffer: 1024 * 1024 * 10 },
        (error, stdout, stderr) => {
          if (error) {
            this.error(`${description} failed: ${error.message}`);
            if (stdout) this.log(`STDOUT: ${stdout}`, 'yellow');
            if (stderr) this.log(`STDERR: ${stderr}`, 'red');
            resolve(false);
          } else {
            this.success(`${description} completed successfully`);
            if (stdout) this.log(`OUTPUT: ${stdout}`, 'white');
            resolve(true);
          }
        }
      );
    });
  }

  async runCommandStream(command, description) {
    this.info(`Running: ${description}`);
    this.log(`Command: ${command}`, 'cyan');

    return new Promise((resolve, reject) => {
      const child = spawn('bash', ['-c', command], { stdio: 'pipe' });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', data => {
        stdout += data.toString();
        process.stdout.write(data);
      });

      child.stderr.on('data', data => {
        stderr += data.toString();
        process.stderr.write(data);
      });

      child.on('close', code => {
        if (code !== 0) {
          this.error(`${description} failed with exit code ${code}`);
          resolve(false);
        } else {
          this.success(`${description} completed successfully`);
          resolve(true);
        }
      });
    });
  }

  async checkPrerequisites() {
    this.log('\n🔍 CHECKING PREREQUISITES', 'bold');

    // Check if we're in the right directory
    if (!fs.existsSync('package.json')) {
      this.error(
        'package.json not found. Run this script from the project root.'
      );
      return false;
    }

    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
      this.error('node_modules not found. Run npm install first.');
      return false;
    }

    // Check if .env files exist
    const envFiles = ['.env', '.env.local', '.env.preview', '.env.development'];
    let envFound = false;
    envFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.success(`Found environment file: ${file}`);
        envFound = true;
      }
    });

    if (!envFound) {
      this.warning(
        'No environment files found. This may cause runtime issues.'
      );
    }

    this.success('Prerequisites check completed');
    return true;
  }

  async runTypeScriptStrictAudit() {
    this.log('\n🔬 TYPESCRIPT STRICT MODE COMPREHENSIVE AUDIT', 'bold');

    // Run TypeScript compilation with strict mode
    const tscResult = await this.runCommand(
      'npx tsc --noEmit --strict --project tsconfig.json',
      'TypeScript Strict Mode Compilation'
    );

    if (!tscResult) {
      this.error(
        'TypeScript strict mode compilation failed - BUILD WILL FAIL ON VERCEL'
      );
      return false;
    }

    // Additional TypeScript checks
    await this.runCommand(
      'npx tsc --noEmit --strict --skipLibCheck false',
      'TypeScript Strict Mode with Library Checks'
    );

    return tscResult;
  }

  async runESLintValidation() {
    this.log('\n🔍 ESLINT VALIDATION', 'bold');

    const eslintResult = await this.runCommand(
      'npx eslint src/ --ext .ts,.tsx --max-warnings 0',
      'ESLint Validation'
    );

    return eslintResult;
  }

  async runNextJSBuild() {
    this.log('\n🏗️  NEXT.JS BUILD (VERCEL SIMULATION)', 'bold');

    // Clean any previous builds
    await this.runCommand('rm -rf .next', 'Clean Previous Build');

    // Run exact Next.js build command that Vercel uses
    const buildResult = await this.runCommandStream(
      'npm run build',
      'Next.js Production Build (Vercel Simulation)'
    );

    if (!buildResult) {
      this.error(
        'Next.js build failed - THIS IS EXACTLY WHAT VERCEL EXPERIENCES'
      );
      return false;
    }

    this.success('Next.js build completed successfully');
    return true;
  }

  async runPrismaValidation() {
    this.log('\n🗄️  PRISMA VALIDATION', 'bold');

    // Check Prisma schema
    const schemaResult = await this.runCommand(
      'npx prisma validate',
      'Prisma Schema Validation'
    );

    // Check if Prisma client is generated
    const generateResult = await this.runCommand(
      'npx prisma generate',
      'Prisma Client Generation Check'
    );

    // Check Prisma binary targets for Vercel compatibility
    this.info('Checking Prisma binary targets for Vercel deployment');
    const schemaContent = require('fs').readFileSync(
      'prisma/schema.prisma',
      'utf8'
    );
    if (schemaContent.includes('rhel-openssl-3.0.x')) {
      this.success('Vercel binary target (rhel-openssl-3.0.x) configured');
    } else {
      this.warning(
        'Prisma schema missing Vercel binary target - may cause deployment failures'
      );
      this.info(
        'Add binaryTargets = ["native", "rhel-openssl-3.0.x"] to generator client'
      );
      criticalErrors.push('Prisma schema missing Vercel binary targets');
    }

    // Verify generated client exists and has correct binaries
    this.info('Verifying generated Prisma client binary files');
    try {
      const fs = require('fs');
      const path = require('path');
      
      const clientPath = 'src/generated/prisma';
      const vercelBinary = 'libquery_engine-rhel-openssl-3.0.x.so.node';
      const localBinary = 'libquery_engine-darwin-arm64.dylib.node';
      
      if (!fs.existsSync(clientPath)) {
        this.error('Generated Prisma client directory missing');
        criticalErrors.push('Prisma client not generated - run npx prisma generate');
      } else {
        const clientFiles = fs.readdirSync(clientPath);
        
        if (clientFiles.includes(vercelBinary)) {
          this.success(`Vercel binary found: ${vercelBinary}`);
        } else {
          this.error(`Vercel binary missing: ${vercelBinary}`);
          criticalErrors.push('Vercel-compatible Prisma binary missing');
        }
        
        if (clientFiles.includes(localBinary)) {
          this.success(`Local binary found: ${localBinary}`);
        } else {
          this.warning(`Local binary missing: ${localBinary} (development only)`);
        }
        
        // Check for output path configuration
        const schemaHasOutput = schemaContent.includes('output');
        if (schemaHasOutput) {
          this.success('Prisma output path configured for custom client generation');
        } else {
          this.warning('Prisma output path not configured - may cause import issues');
        }
      }
    } catch (error) {
      this.error(`Prisma client verification failed: ${error.message}`);
      criticalErrors.push('Prisma client verification failed');
    }

    // Schema Migration Compatibility Check
    this.info('Checking V1/V2 schema migration compatibility');
    try {
      const codeReferencesV1 = await this.runCommand(
        'grep -r "prisma\\.input\\." src/ --include="*.ts" --include="*.tsx" | wc -l',
        'V1 Input Model References'
      );
      
      const codeReferencesV2 = await this.runCommand(
        'grep -r "(prisma as any)\\.signal\\." src/ --include="*.ts" --include="*.tsx" | wc -l',
        'V2 Signal Model References'
      );
      
      if (codeReferencesV1.stdout.trim() !== '0') {
        this.warning(`Found ${codeReferencesV1.stdout.trim()} V1 'prisma.input' references that need V2 migration`);
        this.info('Consider updating to (prisma as any).signal for V2 compatibility');
      }
      
      if (codeReferencesV2.stdout.trim() !== '0') {
        this.success(`Found ${codeReferencesV2.stdout.trim()} V2 'signal' model references`);
      }
      
    } catch (error) {
      this.warning(`Schema migration check failed: ${error.message}`);
    }

    return schemaResult && generateResult;
  }

  async runDependencyAudit() {
    this.log('\n📦 DEPENDENCY AUDIT', 'bold');

    // Check for security vulnerabilities
    await this.runCommand(
      'npm audit --audit-level moderate',
      'NPM Security Audit'
    );

    // Check for outdated dependencies
    await this.runCommand('npm outdated', 'Outdated Dependencies Check');

    return true;
  }

  async runVercelSpecificChecks() {
    this.log('\n☁️  VERCEL-SPECIFIC VALIDATION', 'bold');

    // Check for Vercel configuration
    if (fs.existsSync('vercel.json')) {
      this.success('vercel.json configuration found');
    } else {
      this.info('No vercel.json found (using defaults)');
    }

    // Check for .vercelignore
    if (fs.existsSync('.vercelignore')) {
      this.success('.vercelignore found');
      const ignoreContent = fs.readFileSync('.vercelignore', 'utf8');
      this.info(
        `Ignoring: ${ignoreContent.split('\n').filter(l => l.trim()).length} patterns`
      );
    }

    // Check environment variables
    this.info('Environment variables check (preview simulation)');
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'OPENAI_API_KEY',
    ];

    const optionalEnvVars = ['RESEND_API_KEY'];

    requiredEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        this.success(`${envVar} is set`);
      } else {
        this.warning(`${envVar} is not set - may cause runtime issues`);
      }
    });

    optionalEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        this.success(`${envVar} is set (optional)`);
      } else {
        this.info(
          `${envVar} not set (optional - some features may be disabled)`
        );
      }
    });

    return true;
  }

  async runIteratorCompatibilityCheck() {
    this.log('\n🔄 ITERATOR COMPATIBILITY AUDIT', 'bold');

    // Search for potential iterator issues
    const iteratorPatterns = [
      'for (const .* of .*\\.keys\\(\\))',
      'for (const .* of .*\\.values\\(\\))',
      'for (const .* of .*\\.entries\\(\\))',
      'for (const .* of new Set',
      'for (const .* of new Map',
    ];

    for (const pattern of iteratorPatterns) {
      await this.runCommand(
        `grep -r "${pattern}" src/ --include="*.ts" --include="*.tsx" || true`,
        `Check for iterator pattern: ${pattern}`
      );
    }

    return true;
  }

  async generateReport() {
    const duration = Date.now() - this.startTime;

    this.log('\n📊 BUILD TEST FRAMEWORK REPORT', 'bold');
    this.log('═'.repeat(50), 'cyan');

    if (this.errors.length === 0) {
      this.success(`✅ ALL TESTS PASSED - SAFE TO DEPLOY TO VERCEL`);
      this.success(`🚀 Build should succeed on Vercel Preview`);
    } else {
      this.error(`❌ ${this.errors.length} CRITICAL ERRORS FOUND`);
      this.error(`🚨 BUILD WILL FAIL ON VERCEL - DO NOT DEPLOY`);

      this.log('\n🔥 CRITICAL ERRORS TO FIX:', 'red');
      this.errors.forEach((error, index) => {
        this.log(`  ${index + 1}. ${error}`, 'red');
      });
    }

    if (this.warnings.length > 0) {
      this.log(`\n⚠️  ${this.warnings.length} WARNINGS:`, 'yellow');
      this.warnings.forEach((warning, index) => {
        this.log(`  ${index + 1}. ${warning}`, 'yellow');
      });
    }

    this.log(
      `\n⏱️  Total execution time: ${(duration / 1000).toFixed(2)}s`,
      'cyan'
    );
    this.log('═'.repeat(50), 'cyan');

    return this.errors.length === 0;
  }

  async run() {
    this.log('🚀 FAEVision Comprehensive Build Test Framework', 'bold');
    this.log('🎯 Mission: Prevent Vercel deployment failures', 'blue');
    this.log('👨‍💻 Expert: TypeScript Expert + Vercel Engineer', 'magenta');
    this.log('═'.repeat(60), 'cyan');

    try {
      // Run all validation steps
      const prereqs = await this.checkPrerequisites();
      if (!prereqs) return false;

      await this.runTypeScriptStrictAudit();
      await this.runESLintValidation();
      await this.runPrismaValidation();
      await this.runIteratorCompatibilityCheck();
      await this.runVercelSpecificChecks();
      await this.runDependencyAudit();
      await this.runNextJSBuild(); // Final comprehensive test

      return await this.generateReport();
    } catch (error) {
      this.error(`Unexpected error: ${error.message}`);
      return false;
    }
  }
}

// CLI execution
if (require.main === module) {
  const framework = new BuildTestFramework();
  framework.run().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = BuildTestFramework;
