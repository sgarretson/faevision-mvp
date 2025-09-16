#!/usr/bin/env node

/**
 * VERCEL PRISMA EXPERT: Direct Database Connection Test
 *
 * Dr. Elena Rodriguez - Vercel Prisma Postgres Specialist
 *
 * Test direct connection to Prisma Accelerate with all possible configurations
 */

const { PrismaClient } = require('../src/generated/prisma');
const { withAccelerate } = require('@prisma/extension-accelerate');

console.log('🧪 VERCEL PRISMA EXPERT: Direct Database Connection Test');
console.log('========================================================\n');

// Test all possible environment variable configurations
const testConfigurations = [
  {
    name: 'DATABASE_URL (Standard)',
    url: process.env.DATABASE_URL,
  },
  {
    name: 'POSTGRES_URL (Alternative)',
    url: process.env.POSTGRES_URL,
  },
  {
    name: 'PRISMA_DATABASE_URL (Accelerate)',
    url: process.env.PRISMA_DATABASE_URL,
  },
  {
    name: 'User Provided URL (Direct)',
    url: 'postgres://f279b9e46e7c0166b4949c4f910079cd6f0cbb7ae03a783a14b933638f1ba0ce:sk_paIQiDGXmKNC6q0ngZD0i@db.prisma.io:5432/postgres?sslmode=require',
  },
];

async function testConfiguration(config) {
  console.log(`🔍 Testing: ${config.name}`);
  console.log(
    `URL: ${config.url ? config.url.substring(0, 50) + '...' : 'NOT SET'}`
  );

  if (!config.url) {
    console.log('❌ SKIP: Environment variable not set\n');
    return false;
  }

  try {
    // Test with Prisma Accelerate extension
    const prisma = new PrismaClient({
      datasources: {
        db: { url: config.url },
      },
      log: ['error', 'warn'],
    }).$extends(withAccelerate());

    console.log('🔌 Attempting connection...');
    await prisma.$connect();
    console.log('✅ Connection successful!');

    console.log('🧪 Testing basic query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query successful:', result);

    console.log('👥 Testing user count...');
    const userCount = await prisma.user.count();
    console.log(`✅ User count: ${userCount}`);

    await prisma.$disconnect();
    console.log(`✅ ${config.name}: WORKING\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${config.name}: FAILED`);
    console.log(`Error: ${error.message}`);
    console.log(`Code: ${error.code || 'Unknown'}\n`);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive database connection tests...\n');

  const results = [];
  for (const config of testConfigurations) {
    const success = await testConfiguration(config);
    results.push({ name: config.name, success });
  }

  console.log('📊 TEST RESULTS SUMMARY:');
  console.log('========================');
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}`);
  });

  const workingConfigs = results.filter(r => r.success);
  if (workingConfigs.length > 0) {
    console.log(
      `\n🎉 ${workingConfigs.length} working configuration(s) found!`
    );
    console.log(
      'Use the working configuration for Vercel environment variables.'
    );
  } else {
    console.log('\n🚨 NO working configurations found!');
    console.log('Database may be suspended or URLs may be incorrect.');
  }
}

runAllTests().catch(console.error);
