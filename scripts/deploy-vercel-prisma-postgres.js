#!/usr/bin/env node

/**
 * Deploy Vercel Prisma Postgres - Phase 1 Migration
 * Run this AFTER cleaning Vercel environment variables
 */

import { execSync } from 'child_process';
import { PrismaClient } from '../src/generated/prisma/index.js';

console.log('🚀 VERCEL PRISMA POSTGRES DEPLOYMENT');
console.log('=====================================');

// Use the actual Prisma Accelerate URL for Preview environment
const PRISMA_ACCELERATE_URL =
  process.env.POSTGRES_URL ||
  'postgres://f279b9e46e7c0166b4949c4f910079cd6f0cbb7ae03a783a14b933638f1ba0ce:sk_paIQiDGXmKNC6q0ngZD0i@db.prisma.io:5432/postgres?sslmode=require';

async function deploySchema() {
  console.log('1. 📊 Pushing schema to Vercel Prisma Postgres...');

  try {
    // Set the POSTGRES_URL for this deployment
    process.env.POSTGRES_URL = PRISMA_ACCELERATE_URL;

    // Push schema to Prisma Accelerate
    execSync('npx prisma db push', {
      stdio: 'inherit',
      env: { ...process.env, POSTGRES_URL: PRISMA_ACCELERATE_URL },
    });

    console.log('✅ Schema pushed successfully!');
  } catch (error) {
    console.error('❌ Schema push failed:', error.message);
    throw error;
  }
}

async function seedDatabase() {
  console.log('2. 🌱 Seeding Vercel Prisma Postgres...');

  try {
    // Set environment for seeding
    process.env.POSTGRES_URL = PRISMA_ACCELERATE_URL;
    process.env.VERCEL_ENV = 'preview';

    // Run TypeScript seed script
    execSync('npx tsx prisma/seed.ts', {
      stdio: 'inherit',
      env: { ...process.env, POSTGRES_URL: PRISMA_ACCELERATE_URL },
    });

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    throw error;
  }
}

async function verifyDeployment() {
  console.log('3. 🔍 Verifying deployment...');

  try {
    const prisma = new PrismaClient({
      datasources: {
        db: { url: PRISMA_ACCELERATE_URL },
      },
    });

    await prisma.$connect();

    // Verify admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@faevision.com' },
    });

    if (!adminUser) {
      throw new Error('Admin user not found in database');
    }

    console.log(
      `✅ Admin user verified: ${adminUser.name} (${adminUser.role})`
    );

    const userCount = await prisma.user.count();
    console.log(`✅ Total users: ${userCount}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🎯 Target: Prisma Accelerate (Preview Only)');
    console.log(
      `🗄️ Database: ${PRISMA_ACCELERATE_URL.split('@')[1]?.split('/')[0]}`
    );
    console.log('');

    await deploySchema();
    await seedDatabase();
    await verifyDeployment();

    console.log('');
    console.log('🎉 PRISMA ACCELERATE DEPLOYMENT COMPLETE!');
    console.log('========================================');
    console.log('');
    console.log('✅ Next Steps:');
    console.log(
      '1. Test Preview environment: https://faevision-simplified-git-preview-scott-garretsons-projects.vercel.app'
    );
    console.log('2. Login with: sarah.martinez@aetech.com');
    console.log(
      '3. Verify all V2 features work (20 signals, 3 hotspots, 5 ideas)'
    );
    console.log('4. Test Ideas "View Details" functionality');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ DEPLOYMENT FAILED!');
    console.error('================');
    console.error(error.message);
    console.error('');
    console.error('🔄 Rollback Options:');
    console.error('1. Revert Vercel environment variables to legacy Neon');
    console.error('2. Check Vercel environment variable configuration');
    console.error('3. Verify DATABASE_URL is correctly set');
    process.exit(1);
  }
}

main();
