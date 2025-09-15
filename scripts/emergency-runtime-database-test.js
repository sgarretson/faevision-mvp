#!/usr/bin/env node

/**
 * EMERGENCY RUNTIME DATABASE TEST
 * Test exact database state that Vercel Preview is using
 */

const { PrismaClient } = require('../src/generated/prisma');

async function testRuntimeDatabase() {
  console.log('🚨 EMERGENCY RUNTIME DATABASE TEST');
  console.log('=====================================');
  
  // Use same environment as Vercel Preview
  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
  
  console.log(`📊 Testing database: ${DATABASE_URL.replace(/:[^@]+@/, ':***@')}`);
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: { url: DATABASE_URL }
    }
  });

  try {
    console.log('\n🔍 1. TESTING DATABASE CONNECTION...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    console.log('\n🔍 2. TESTING TABLE STRUCTURE...');
    // Test if users table exists and has correct structure
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('📋 Users table structure:');
    console.table(result);
    
    console.log('\n🔍 3. TESTING USER COUNT...');
    const userCount = await prisma.user.count();
    console.log(`👥 Total users in database: ${userCount}`);

    console.log('\n🔍 4. LISTING ALL USERS...');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        createdAt: true
      }
    });
    
    console.log('👥 All users in database:');
    allUsers.forEach(user => {
      console.log(`  📧 ${user.email}`);
      console.log(`     👤 Name: ${user.name}`);
      console.log(`     🔑 Role: ${user.role}`);
      console.log(`     🔒 Has Password Hash: ${!!user.passwordHash}`);
      console.log(`     📅 Created: ${user.createdAt}`);
      console.log('');
    });

    console.log('\n🔍 5. TESTING ADMIN USER SPECIFICALLY...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@faevision.com' }
    });
    
    if (adminUser) {
      console.log('✅ Admin user found!');
      console.log(`   🆔 ID: ${adminUser.id}`);
      console.log(`   👤 Name: ${adminUser.name}`);
      console.log(`   🔑 Role: ${adminUser.role}`);
      console.log(`   🔒 Has Password Hash: ${!!adminUser.passwordHash}`);
    } else {
      console.log('❌ Admin user NOT found!');
    }

    console.log('\n🔍 6. TESTING CASE SENSITIVITY...');
    const adminLowercase = await prisma.user.findUnique({
      where: { email: 'admin@faevision.com' }
    });
    const adminUppercase = await prisma.user.findUnique({
      where: { email: 'ADMIN@FAEVISION.COM' }
    });
    
    console.log(`Admin lowercase search: ${adminLowercase ? 'FOUND' : 'NOT FOUND'}`);
    console.log(`Admin uppercase search: ${adminUppercase ? 'FOUND' : 'NOT FOUND'}`);

    console.log('\n🎯 SUMMARY:');
    console.log(`Database URL: ${DATABASE_URL.includes('ep-round-frost-aecda5ou') ? '✅ Preview DB' : '❌ Wrong DB'}`);
    console.log(`Users table exists: ${result.length > 0 ? '✅ Yes' : '❌ No'}`);
    console.log(`Total users: ${userCount}`);
    console.log(`Admin user exists: ${adminUser ? '✅ Yes' : '❌ No'}`);

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRuntimeDatabase().catch(console.error);
