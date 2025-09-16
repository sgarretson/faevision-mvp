#!/usr/bin/env node

/**
 * Emergency script to diagnose Preview authentication issues
 * Database Architect (Morgan Smith) + Lead Developer (Alex Thompson)
 */

require('dotenv').config({ path: '.env.preview' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function checkPreviewAuth() {
  console.log('🔍 PREVIEW AUTHENTICATION DIAGNOSIS');
  console.log('=====================================');

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    // Check database connection
    console.log('\n📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if users table exists and has data
    console.log('\n👥 Checking users table...');
    const userCount = await prisma.user.count();
    console.log(`📊 Total users: ${userCount}`);

    if (userCount === 0) {
      console.log('❌ NO USERS FOUND - Database appears to be empty');
      console.log('🔧 SOLUTION: Need to seed the database');
      return;
    }

    // Check for admin and test users
    console.log('\n🔍 Checking for test accounts...');
    const testUsers = await prisma.user.findMany({
      where: {
        email: {
          in: [
            'admin@faevision.com',
            'sarah.executive@faevision.com',
            'alex.contributor@faevision.com',
          ],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
      },
    });

    console.log(`📋 Found ${testUsers.length} test accounts:`);

    for (const user of testUsers) {
      console.log(`\n👤 ${user.email}:`);
      console.log(`   - Name: ${user.name || 'Not set'}`);
      console.log(`   - Role: ${user.role}`);
      console.log(
        `   - Password Hash: ${user.passwordHash ? '✅ Present' : '❌ Missing'}`
      );

      if (user.passwordHash) {
        // Test password verification for known passwords
        const testPasswords = {
          'admin@faevision.com': 'FAEVision2025!',
          'sarah.executive@faevision.com': 'Executive2025!',
          'alex.contributor@faevision.com': 'Contributor2025!',
        };

        const testPassword = testPasswords[user.email];
        if (testPassword) {
          const isValid = await bcrypt.compare(testPassword, user.passwordHash);
          console.log(
            `   - Password Test: ${isValid ? '✅ Valid' : '❌ Invalid'}`
          );
        }
      }
    }

    // Check for any users without password hashes
    console.log('\n🔐 Checking for users without passwords...');
    const usersWithoutPasswords = await prisma.user.count({
      where: {
        passwordHash: null,
      },
    });

    if (usersWithoutPasswords > 0) {
      console.log(
        `⚠️  ${usersWithoutPasswords} users found without password hashes`
      );
    } else {
      console.log('✅ All users have password hashes');
    }

    console.log('\n📋 DIAGNOSIS COMPLETE');
    console.log('====================');

    if (userCount === 0) {
      console.log('🎯 ISSUE: Database is empty');
      console.log('🔧 SOLUTION: Run database seeding');
    } else if (testUsers.length === 0) {
      console.log('🎯 ISSUE: Test accounts missing');
      console.log('🔧 SOLUTION: Create test user accounts');
    } else if (testUsers.some(u => !u.passwordHash)) {
      console.log('🎯 ISSUE: Users missing password hashes');
      console.log('🔧 SOLUTION: Update user passwords');
    } else {
      console.log('✅ Database appears correctly configured');
      console.log('🔍 NEXT: Check NextAuth configuration');
    }
  } catch (error) {
    console.error('❌ Error during diagnosis:', error.message);
    console.error('📋 Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPreviewAuth().catch(console.error);
