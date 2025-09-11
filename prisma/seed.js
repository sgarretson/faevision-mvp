#!/usr/bin/env node

/**
 * FAEVision Database Seeding Script
 * Environment-aware seeding for Production, Preview, and Development
 */

import { PrismaClient } from '../src/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Environment-specific seeding configuration
const environment = process.env.NODE_ENV || 'development';

console.log(`🌱 Seeding FAEVision database for: ${environment.toUpperCase()}`);

// Core users for all environments
const coreUsers = [
  {
    email: 'admin@faevision.com',
    name: 'System Administrator',
    role: 'ADMIN',
    password: 'admin123', // Will be hashed
  },
  {
    email: 'sarah.executive@faevision.com', 
    name: 'Sarah Chen',
    role: 'EXECUTIVE',
    password: 'executive123', // Will be hashed
  }
];

// Additional test users for non-production environments
const testUsers = [
  {
    email: 'contributor@faevision.com',
    name: 'Test Contributor',
    role: 'CONTRIBUTOR', 
    password: 'contributor123',
  },
  {
    email: 'executive2@faevision.com',
    name: 'Marcus Rodriguez',
    role: 'EXECUTIVE',
    password: 'executive123',
  }
];

// Sample inputs for demonstration
const sampleInputs = [
  {
    title: 'Improve Client Communication Workflow',
    description: 'Our current client communication process has multiple touchpoints that create confusion and delays. We need a centralized approach.',
    department: 'OPERATIONS',
    issueType: 'PROCESS',
    rootCause: 'WORKFLOW',
    priority: 'HIGH',
  },
  {
    title: 'Enhance Project Delivery Timeline Accuracy', 
    description: 'Project timelines are consistently underestimated, leading to client dissatisfaction and resource strain.',
    department: 'PROJECT_MANAGEMENT',
    issueType: 'RESOURCE',
    rootCause: 'PLANNING',
    priority: 'MEDIUM',
  },
  {
    title: 'Standardize Design Quality Assurance',
    description: 'Inconsistent design quality across projects due to varying review processes and standards.',
    department: 'DESIGN',
    issueType: 'QUALITY',
    rootCause: 'TRAINING',
    priority: 'HIGH',
  }
];

async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

async function seedUsers() {
  console.log('👥 Seeding users...');
  
  const usersToSeed = environment === 'production' 
    ? coreUsers 
    : [...coreUsers, ...testUsers];
    
  for (const userData of usersToSeed) {
    const hashedPassword = await hashPassword(userData.password);
    
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        role: userData.role,
      },
      create: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });
    
    console.log(`  ✅ ${userData.name} (${userData.role})`);
  }
}

async function seedInputs() {
  if (environment === 'production') {
    console.log('📝 Skipping sample inputs for production environment');
    return;
  }
  
  console.log('📝 Seeding sample inputs...');
  
  // Get the first executive user for input creation
  const executive = await prisma.user.findFirst({
    where: { role: 'EXECUTIVE' }
  });
  
  if (!executive) {
    console.log('  ⚠️  No executive user found, skipping input seeding');
    return;
  }
  
  for (const inputData of sampleInputs) {
    await prisma.input.upsert({
      where: { 
        title_createdById: {
          title: inputData.title,
          createdById: executive.id
        }
      },
      update: {
        description: inputData.description,
        department: inputData.department,
        issueType: inputData.issueType,
        rootCause: inputData.rootCause,
        priority: inputData.priority,
      },
      create: {
        title: inputData.title,
        description: inputData.description,
        department: inputData.department,
        issueType: inputData.issueType,
        rootCause: inputData.rootCause,
        priority: inputData.priority,
        createdById: executive.id,
      },
    });
    
    console.log(`  ✅ ${inputData.title}`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting FAEVision database seeding...');
    console.log(`📊 Environment: ${environment}`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'Unknown'}`);
    
    await seedUsers();
    await seedInputs();
    
    // Get final counts
    const userCount = await prisma.user.count();
    const inputCount = await prisma.input.count();
    
    console.log('\n🎉 Seeding completed successfully!');
    console.log(`📊 Final counts:`);
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📝 Inputs: ${inputCount}`);
    
    if (environment !== 'production') {
      console.log('\n🔐 Test Credentials:');
      console.log('   Admin: admin@faevision.com / admin123');
      console.log('   Executive: sarah.executive@faevision.com / executive123');
      console.log('   Contributor: contributor@faevision.com / contributor123');
    }
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
