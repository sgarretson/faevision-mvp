#!/usr/bin/env npx tsx

/**
 * List all users in the Preview database
 * Database Architect: Morgan Smith
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('👥 Listing all users in Preview database...\n');

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      department: true,
      title: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      email: 'asc',
    },
  });

  if (users.length === 0) {
    console.log('❌ No users found in database');
    return;
  }

  console.log(`✅ Found ${users.length} users:\n`);

  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name || 'No Name'}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🔑 Password: demo123 (all users have same password)`);
    console.log(`   👤 Role: ${user.role}`);
    console.log(`   🏢 Department: ${user.department || 'Not specified'}`);
    console.log(`   💼 Title: ${user.title || 'Not specified'}`);
    console.log(`   ✅ Active: ${user.isActive ? 'Yes' : 'No'}`);
    console.log(`   📅 Created: ${user.createdAt.toLocaleDateString()}`);
    console.log('');
  });

  console.log('🔐 All users use password: demo123');
}

main()
  .catch(e => {
    console.error('❌ Error listing users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
