#!/usr/bin/env npx tsx

/**
 * Add sarah.executive@faevision.com user
 * Database Architect: Morgan Smith
 */

import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Adding sarah.executive@faevision.com user...');

  const hashedPassword = await bcrypt.hash('demo123', 12);

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah.executive@faevision.com' },
    update: {},
    create: {
      email: 'sarah.executive@faevision.com',
      name: 'Sarah Executive',
      role: 'EXECUTIVE',
      department: 'Executive Leadership',
      title: 'Senior Executive',
      passwordHash: hashedPassword,
      isActive: true,
      profileJson: {
        bio: 'Senior Executive focused on strategic decision making',
        expertise: [
          'Strategic Planning',
          'Executive Management',
          'Decision Making',
        ],
        location: 'Austin, TX',
      },
    },
  });

  console.log('✅ User created successfully:');
  console.log(`   Email: ${sarah.email}`);
  console.log(`   Password: demo123`);
}

main()
  .catch(e => {
    console.error('❌ Error adding user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
