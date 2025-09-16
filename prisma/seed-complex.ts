#!/usr/bin/env node

/**
 * FAEVision Database Seeding Script - TypeScript Version
 * Updated for Vercel Prisma Postgres Migration
 * Database Architect: Morgan Smith
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Environment-specific seeding configuration
const environment =
  process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';

console.log(`🌱 Seeding FAEVision database for: ${environment.toUpperCase()}`);

// Core users for all environments
const coreUsers = [
  {
    email: 'admin@faevision.com',
    name: 'System Administrator',
    role: 'ADMIN' as const,
    password: 'FAEVision2025!', // Updated to match current admin password
  },
  {
    email: 'sarah.executive@faevision.com',
    name: 'Sarah Chen',
    role: 'EXECUTIVE' as const,
    department: 'LEADERSHIP',
    password: 'executive123',
  },
];

// Additional test users for non-production environments
const testUsers = [
  {
    email: 'contributor@faevision.com',
    name: 'Test Contributor',
    role: 'CONTRIBUTOR' as const,
    department: 'ENGINEERING',
    password: 'contributor123',
  },
  {
    email: 'marcus.executive@faevision.com',
    name: 'Marcus Rodriguez',
    role: 'EXECUTIVE' as const,
    department: 'STRATEGY',
    password: 'executive123',
  },
];

// Sample inputs for demonstration (non-production only)
const sampleInputs = [
  {
    title: 'Improve Client Communication Workflow',
    description:
      'Our current client communication process has multiple touchpoints that create confusion and delays. We need a centralized approach.',
    type: 'PROBLEM' as const,
    department: 'Operations',
    issueType: 'PROCESS' as const,
    rootCause:
      'Lack of standardized communication protocols and centralized tracking system',
    priority: 'HIGH' as const,
  },
  {
    title: 'Enhance Project Delivery Timeline Accuracy',
    description:
      'Project timelines are consistently underestimated, leading to client dissatisfaction and resource strain.',
    type: 'PROBLEM' as const,
    department: 'Project Management',
    issueType: 'RESOURCE' as const,
    rootCause:
      'Insufficient historical data analysis and unrealistic scope estimation',
    priority: 'MEDIUM' as const,
  },
  {
    title: 'Standardize Design Quality Assurance',
    description:
      'Inconsistent design quality across projects due to varying review processes and standards.',
    type: 'OPPORTUNITY' as const,
    department: 'Design',
    issueType: 'PROCESS' as const,
    rootCause: 'No formal QA checklist or standardized review criteria',
    priority: 'HIGH' as const,
  },
];

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

async function seedUsers() {
  console.log('👥 Seeding users...');

  const usersToSeed =
    environment === 'production' ? coreUsers : [...coreUsers, ...testUsers];

  for (const userData of usersToSeed) {
    const hashedPassword = await hashPassword(userData.password);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        role: userData.role,
        department: userData.department || null,
      },
      create: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        department: userData.department || null,
        passwordHash: hashedPassword,
      },
    });

    console.log(`  ✅ ${userData.name} (${userData.role}) - ID: ${user.id}`);
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
    where: { role: 'EXECUTIVE' },
  });

  if (!executive) {
    console.log('  ⚠️  No executive user found, skipping input seeding');
    return;
  }

  for (const inputData of sampleInputs) {
    const input = await prisma.input.create({
      data: {
        title: inputData.title,
        description: inputData.description,
        type: inputData.type,
        department: inputData.department,
        issueType: inputData.issueType,
        rootCause: inputData.rootCause,
        priority: inputData.priority,
        createdBy: executive.id,
      },
    });

    console.log(`  ✅ ${inputData.title} - ID: ${input.id}`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting FAEVision database seeding...');
    console.log(`📊 Environment: ${environment}`);
    console.log(
      `🗄️  Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'Unknown'}`
    );

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

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
      console.log('   Admin: admin@faevision.com / FAEVision2025!');
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

main().catch(e => {
  console.error(e);
  process.exit(1);
});
