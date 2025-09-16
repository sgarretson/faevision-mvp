#!/usr/bin/env node

/**
 * FAEVision Demo Database Setup Script
 * Sets up database schema and comprehensive demo data
 * Usage: npm run setup:demo
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 FAEVision Demo Database Setup');
console.log('='.repeat(50));

// Check if we're in the right directory
const prismaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
if (!fs.existsSync(prismaPath)) {
  console.error('❌ Error: prisma/schema.prisma not found');
  console.error('Please run this script from the project root directory');
  process.exit(1);
}

// Check environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable not set');
  console.error('Please check your .env.local file');
  process.exit(1);
}

async function setupDatabase() {
  try {
    console.log('📋 Step 1: Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated');

    console.log('\n🔄 Step 2: Pushing database schema...');
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
    console.log('✅ Database schema updated');

    console.log('\n🌱 Step 3: Running comprehensive demo data seeding...');

    // Check if comprehensive seed file exists
    const comprehensiveSeedPath = path.join(
      process.cwd(),
      'prisma',
      'comprehensive-seed.ts'
    );
    if (fs.existsSync(comprehensiveSeedPath)) {
      execSync('npx tsx prisma/comprehensive-seed.ts', { stdio: 'inherit' });
    } else {
      console.log('Running standard seed...');
      execSync('npx prisma db seed', { stdio: 'inherit' });
    }
    console.log('✅ Demo data seeded successfully');

    console.log('\n🎯 Setup Complete!');
    console.log('='.repeat(50));
    console.log('FAEVision MVP is ready for testing with:');
    console.log('');
    console.log('📊 DEMO ACCOUNTS (Password: demo123):');
    console.log('   🔑 admin@faevision.com (Administrator)');
    console.log('   👔 sarah.chen@faevision.com (Executive - Engineering)');
    console.log('   👔 marcus.rodriguez@faevision.com (Executive - Sales)');
    console.log('   👔 priya.patel@faevision.com (Executive - Strategy)');
    console.log('   👔 jordan.kim@faevision.com (Executive - Finance)');
    console.log('   👔 maya.rodriguez@faevision.com (Executive - HR)');
    console.log('   🧑‍💼 10+ Contributor accounts across departments');
    console.log('');
    console.log('🚀 Features Ready:');
    console.log('   ✅ F1: Input Capture with strategic tagging');
    console.log('   ✅ F2: Collaboration (voting, comments)');
    console.log('   ✅ F3: Organization & analytics dashboard');
    console.log('   ✅ F4: Solution management with task tracking');
    console.log('   ✅ Authentication & role-based access control');
    console.log('   ✅ Comprehensive demo data for all workflows');
    console.log('');
    console.log('🔗 Start the development server:');
    console.log('   npm run dev');
    console.log('');
    console.log('📱 Test the executive workflow:');
    console.log('   1. Login as any executive user');
    console.log('   2. Review strategic inputs on dashboard');
    console.log('   3. Create solutions from high-priority inputs');
    console.log('   4. Assign and track tasks');
    console.log('   5. Collaborate through voting and comments');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check DATABASE_URL in .env.local');
    console.error('   2. Ensure database is accessible');
    console.error('   3. Verify all dependencies are installed (npm install)');
    console.error('   4. Check for TypeScript compilation errors');
    process.exit(1);
  }
}

setupDatabase();
