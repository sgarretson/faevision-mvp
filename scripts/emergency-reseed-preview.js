#!/usr/bin/env node

/**
 * EMERGENCY PREVIEW DATABASE RE-SEEDING
 * Force seed the exact database URL that Vercel Preview is using
 */

const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

// EXACT Preview database URL (the one Vercel should be using)
const PREVIEW_DB_URL = 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function emergencyReseedPreview() {
  console.log('🚨 EMERGENCY PREVIEW DATABASE RE-SEEDING');
  console.log('=========================================');
  console.log(`🎯 Target: ${PREVIEW_DB_URL.replace(/:[^@]+@/, ':***@')}`);

  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: { url: PREVIEW_DB_URL }
    }
  });

  try {
    console.log('\n🔍 1. Testing connection...');
    await prisma.$connect();
    console.log('✅ Connected successfully');

    console.log('\n🔍 2. Checking current users...');
    const currentUsers = await prisma.user.findMany({
      select: { email: true, name: true, role: true }
    });
    console.log(`📊 Current users: ${currentUsers.length}`);
    currentUsers.forEach(user => {
      console.log(`  📧 ${user.email} (${user.role}) - ${user.name}`);
    });

    console.log('\n🔍 3. Deleting existing admin user...');
    await prisma.user.deleteMany({
      where: { email: 'admin@faevision.com' }
    });
    console.log('✅ Cleared existing admin user');

    console.log('\n🔍 4. Creating fresh admin user...');
    const adminPassword = await bcrypt.hash('FAEVision2025!', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@faevision.com',
        name: 'System Administrator',
        role: 'ADMIN',
        passwordHash: adminPassword,
      }
    });
    
    console.log('✅ Created fresh admin user:');
    console.log(`   🆔 ID: ${adminUser.id}`);
    console.log(`   📧 Email: ${adminUser.email}`);
    console.log(`   👤 Name: ${adminUser.name}`);
    console.log(`   🔑 Role: ${adminUser.role}`);

    console.log('\n🔍 5. Verifying admin user...');
    const verifyAdmin = await prisma.user.findUnique({
      where: { email: 'admin@faevision.com' }
    });
    
    if (verifyAdmin) {
      console.log('✅ Admin user verified in database');
      const passwordCheck = await bcrypt.compare('FAEVision2025!', verifyAdmin.passwordHash);
      console.log(`🔒 Password verification: ${passwordCheck ? '✅ VALID' : '❌ INVALID'}`);
    } else {
      console.log('❌ Admin user verification FAILED');
    }

    console.log('\n🎯 EMERGENCY RE-SEEDING COMPLETE');
    console.log('================================');
    console.log('✅ Admin user created with credentials:');
    console.log('   📧 Email: admin@faevision.com');
    console.log('   🔒 Password: FAEVision2025!');

  } catch (error) {
    console.error('💥 Emergency re-seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

emergencyReseedPreview().catch(console.error);
