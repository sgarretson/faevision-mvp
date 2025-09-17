#!/usr/bin/env npx tsx

/**
 * Add Sarah Executive user for Preview testing
 * Database Architect: Morgan Smith
 */

import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Adding Sarah Executive user for Preview testing...');

  // Create hashed password
  const hashedPassword = await bcrypt.hash('demo123', 12);

  // Add Sarah Executive as an Executive user
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
        bio: 'Senior Executive focused on strategic operations and team leadership',
        expertise: [
          'Strategic Planning',
          'Operations Management',
          'Executive Leadership',
        ],
        location: 'Austin, TX',
      },
    },
  });

  console.log('✅ User created successfully:');
  console.log(`   Email: ${sarah.email}`);
  console.log(`   Name: ${sarah.name}`);
  console.log(`   Role: ${sarah.role}`);
  console.log(`   Password: demo123`);
  console.log('');
  console.log('🚀 Sarah Executive can now login to the Preview environment!');
}

main()
  .catch(e => {
    console.error('❌ Error adding user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
