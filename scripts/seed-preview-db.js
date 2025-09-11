#!/usr/bin/env node

/**
 * Preview Database Seeding Script
 * Database Architect (Morgan Smith) + Lead Developer (Alex Thompson)
 * 
 * Seeds the dedicated Preview database with test users and sample data
 */

const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const PREVIEW_DATABASE_URL = 'postgresql://neondb_owner:npg_CLiPEUv8m3ug@ep-restless-fire-aek6ogsh-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function seedPreviewDatabase() {
  console.log('🌱 SEEDING PREVIEW DATABASE');
  console.log('===========================');
  console.log(`📡 Database: ${PREVIEW_DATABASE_URL.split('@')[1].split('/')[0]}`);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: PREVIEW_DATABASE_URL
      }
    }
  });

  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connection established');
    
    // Clear existing data (if any)
    console.log('\n🧹 Cleaning existing data...');
    await prisma.user.deleteMany({});
    console.log('✅ Cleared existing users');
    
    // Create test users with hashed passwords
    console.log('\n👥 Creating test users...');
    
    const testUsers = [
      {
        email: 'admin@faevision.com',
        name: 'System Administrator',
        role: 'ADMIN',
        password: 'FAEVision2025!',
        department: 'IT'
      },
      {
        email: 'sarah.executive@faevision.com',
        name: 'Sarah Chen',
        role: 'EXECUTIVE', 
        password: 'Executive2025!',
        department: 'Executive'
      },
      {
        email: 'alex.contributor@faevision.com',
        name: 'Alex Thompson',
        role: 'CONTRIBUTOR',
        password: 'Contributor2025!',
        department: 'Development'
      }
    ];
    
    for (const userData of testUsers) {
      const passwordHash = await bcrypt.hash(userData.password, 12);
      
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          passwordHash: passwordHash,
          department: userData.department
        }
      });
      
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }
    
    // Verify user creation
    console.log('\n📊 Verification...');
    const userCount = await prisma.user.count();
    console.log(`👥 Total users created: ${userCount}`);
    
    // Test password authentication
    console.log('\n🔐 Testing password authentication...');
    for (const userData of testUsers) {
      const user = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      if (user?.passwordHash) {
        const isValid = await bcrypt.compare(userData.password, user.passwordHash);
        console.log(`🔑 ${userData.email}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      }
    }
    
    console.log('\n🎉 PREVIEW DATABASE SEEDING COMPLETE');
    console.log('====================================');
    console.log('Ready for Preview authentication testing!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding
if (require.main === module) {
  seedPreviewDatabase()
    .then(() => {
      console.log('✅ Preview database seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Preview database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedPreviewDatabase };
