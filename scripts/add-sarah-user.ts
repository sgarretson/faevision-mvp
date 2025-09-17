#!/usr/bin/env npx tsx

/**
 * Add Sarah Martinez user for Preview testing
 * Database Architect: Morgan Smith
 */

import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Adding Sarah Martinez user for Preview testing...');

  // Create hashed password
  const hashedPassword = await bcrypt.hash('demo123', 12);

  // Add Sarah Martinez as an Executive user
  const sarah = await prisma.user.upsert({
    where: { email: 'sarah.martinez@aetech.com' },
    update: {},
    create: {
      email: 'sarah.martinez@aetech.com',
      name: 'Sarah Martinez',
      role: 'EXECUTIVE',
      department: 'Executive Leadership',
      title: 'Chief Executive Officer',
      passwordHash: hashedPassword,
      isActive: true,
      profileJson: {
        bio: 'Chief Executive Officer focused on strategic vision and operational excellence',
        expertise: [
          'Strategic Planning',
          'Business Development',
          'Team Leadership',
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
  console.log('🚀 Sarah can now login to the Preview environment!');
}

main()
  .catch(e => {
    console.error('❌ Error adding user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
