#!/usr/bin/env node

/**
 * Preview Database Setup Script
 * Sets up the new Preview database with schema and seed data
 */

require('dotenv').config({ path: '.env' });
const { execSync } = require('child_process');

// Preview database connection details
const PREVIEW_DATABASE_URL =
  'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
const PREVIEW_DIRECT_URL =
  'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

console.log('🚀 Setting up Preview Database...');
console.log('Database:', PREVIEW_DATABASE_URL.replace(/:[^:]*@/, ':***@'));

// Set environment variables for this script
process.env.DATABASE_URL = PREVIEW_DATABASE_URL;
process.env.DIRECT_URL = PREVIEW_DIRECT_URL;

try {
  console.log('\n📝 Step 1: Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('\n🏗️ Step 2: Deploying Database Schema...');
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' });

  console.log('\n🌱 Step 3: Seeding Database...');
  execSync('node scripts/seed-preview-users.js', { stdio: 'inherit' });

  console.log('\n✅ Preview Database Setup Complete!');
  console.log('🔐 Test Accounts Created:');
  console.log('  Admin: admin@faevision.com / FAEVision2025!');
  console.log('  Executive: sarah.executive@faevision.com / Executive2025!');
  console.log(
    '  Contributor: alex.contributor@faevision.com / Contributor2025!'
  );
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
