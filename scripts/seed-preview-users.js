#!/usr/bin/env node

/**
 * Preview Database User Seeding Script
 * Creates test users with hashed passwords
 */

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedPreviewUsers() {
  console.log('🌱 Seeding Preview Database Users...');

  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('FAEVision2025!', 12);
    const executivePassword = await bcrypt.hash('Executive2025!', 12);
    const contributorPassword = await bcrypt.hash('Contributor2025!', 12);

    // Create users
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'admin@faevision.com' },
        update: {},
        create: {
          email: 'admin@faevision.com',
          name: 'FAE Admin',
          role: 'ADMIN',
          passwordHash: adminPassword,
        },
      }),

      prisma.user.upsert({
        where: { email: 'sarah.executive@faevision.com' },
        update: {},
        create: {
          email: 'sarah.executive@faevision.com',
          name: 'Sarah Chen',
          role: 'EXECUTIVE',
          passwordHash: executivePassword,
        },
      }),

      prisma.user.upsert({
        where: { email: 'alex.contributor@faevision.com' },
        update: {},
        create: {
          email: 'alex.contributor@faevision.com',
          name: 'Alex Thompson',
          role: 'CONTRIBUTOR',
          passwordHash: contributorPassword,
        },
      }),
    ]);

    console.log(`✅ Created ${users.length} users successfully`);
    console.log('Users:', users.map(u => u.email).join(', '));

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedPreviewUsers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
