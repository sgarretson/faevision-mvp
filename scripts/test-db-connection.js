#!/usr/bin/env node

/**
 * 🚨 EMERGENCY DATABASE CONNECTION TEST
 * Test database connectivity to identify 500 error source
 */

import { PrismaClient } from '@prisma/client';

console.log('🚨 DB TEST: Starting database connection test');

try {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  console.log('🚨 DB TEST: Prisma client created');

  // Test basic connection
  await prisma.$connect();
  console.log('🚨 DB TEST: Database connected successfully');

  // Test user query
  const userCount = await prisma.user.count();
  console.log(`🚨 DB TEST: Found ${userCount} users in database`);

  if (userCount > 0) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
      take: 3,
    });
    console.log('🚨 DB TEST: Sample users:', users);
  }

  // Test input query
  const inputCount = await prisma.input.count();
  console.log(`🚨 DB TEST: Found ${inputCount} inputs in database`);

  await prisma.$disconnect();
  console.log('🚨 DB TEST: Database connection test PASSED');
} catch (error) {
  console.error('🚨 DB TEST: Database connection test FAILED');
  console.error('🚨 DB TEST: Error details:', error);
  process.exit(1);
}
