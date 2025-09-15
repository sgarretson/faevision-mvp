#!/usr/bin/env node

/**
 * EMERGENCY DATABASE INVESTIGATION
 * Comprehensive analysis of database connectivity and user data
 */

const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

// Environment databases
const DATABASES = {
  PREVIEW: 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  DEVELOPMENT: 'postgresql://neondb_owner:npg_6vcJmQuOek5X@ep-lingering-queen-ae13d5gh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require',
  CURRENT: process.env.DATABASE_URL
};

async function investigateDatabase(label, databaseUrl) {
  console.log(`\n🔍 INVESTIGATING ${label} DATABASE`);
  console.log(`📊 URL: ${databaseUrl ? databaseUrl.replace(/:[^@]+@/, ':***@') : 'NOT SET'}`);
  
  if (!databaseUrl) {
    console.log('❌ No database URL provided');
    return { error: 'No database URL' };
  }

  const prisma = new PrismaClient({
    datasources: {
      db: { url: databaseUrl }
    }
  });

  try {
    // Test basic connection
    console.log('🔗 Testing connection...');
    const userCount = await prisma.user.count();
    console.log(`✅ Connected! Total users: ${userCount}`);

    // List all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        createdAt: true
      }
    });

    console.log('\n👥 ALL USERS:');
    users.forEach(user => {
      console.log(`  📧 ${user.email} (${user.role})`);
      console.log(`     🆔 ID: ${user.id}`);
      console.log(`     👤 Name: ${user.name}`);
      console.log(`     🔒 Has Password: ${!!user.passwordHash}`);
      console.log(`     📅 Created: ${user.createdAt}`);
      console.log('');
    });

    // Check specific admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@faevision.com' }
    });

    console.log('\n🔍 ADMIN USER LOOKUP:');
    if (adminUser) {
      console.log('✅ Admin user found!');
      console.log(`   🆔 ID: ${adminUser.id}`);
      console.log(`   👤 Name: ${adminUser.name}`);
      console.log(`   🔒 Has Password Hash: ${!!adminUser.passwordHash}`);
      
      // Test password
      if (adminUser.passwordHash) {
        const passwordValid = await bcrypt.compare('FAEVision2025!', adminUser.passwordHash);
        console.log(`   🔑 Password 'FAEVision2025!' valid: ${passwordValid}`);
      }
    } else {
      console.log('❌ Admin user NOT found!');
    }

    await prisma.$disconnect();
    return { success: true, userCount, users, adminFound: !!adminUser };

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    await prisma.$disconnect();
    return { error: error.message };
  }
}

async function main() {
  console.log('🚨 EMERGENCY DATABASE INVESTIGATION');
  console.log('=====================================');
  
  console.log('\n📊 ENVIRONMENT VARIABLES:');
  console.log(`DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
  console.log(`DIRECT_URL exists: ${!!process.env.DIRECT_URL}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`VERCEL_ENV: ${process.env.VERCEL_ENV}`);

  // Investigate all databases
  const results = {};
  
  results.current = await investigateDatabase('CURRENT ENV', DATABASES.CURRENT);
  results.preview = await investigateDatabase('PREVIEW', DATABASES.PREVIEW);
  results.development = await investigateDatabase('DEVELOPMENT', DATABASES.DEVELOPMENT);

  console.log('\n🎯 SUMMARY:');
  console.log('=============');
  Object.entries(results).forEach(([key, result]) => {
    console.log(`${key.toUpperCase()}: ${result.success ? `✅ ${result.userCount} users, admin found: ${result.adminFound}` : `❌ ${result.error}`}`);
  });

  console.log('\n🔧 NEXT STEPS:');
  if (results.current?.adminFound) {
    console.log('✅ Current environment has admin user - auth should work');
  } else {
    console.log('❌ Current environment missing admin user - needs seeding');
    console.log('💡 Run seeding script with correct DATABASE_URL');
  }
}

main().catch(console.error);
