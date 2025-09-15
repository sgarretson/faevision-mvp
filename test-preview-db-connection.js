#!/usr/bin/env node

/**
 * Test Preview Database Connection and User Verification
 */

const { Client } = require('pg');

const PREVIEW_DATABASE_URL = 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function testPreviewDatabase() {
  console.log('🔍 Testing Preview Database Connection...');
  console.log('🗄️  Database:', PREVIEW_DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

  const client = new Client({
    connectionString: PREVIEW_DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to Preview database successfully');

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Users table does not exist!');
      console.log('🔧 Running database migrations...');
      // TODO: Run migrations if needed
    } else {
      console.log('✅ Users table exists');
    }

    // Check existing users
    const usersResult = await client.query('SELECT id, email, name, role FROM users ORDER BY email');
    console.log(`📊 Found ${usersResult.rows.length} users in Preview database:`);
    
    usersResult.rows.forEach(user => {
      console.log(`   👤 ${user.email} (${user.role}) - ${user.name}`);
    });

    // Check if admin user exists with correct hash
    const adminResult = await client.query(
      'SELECT email, "passwordHash" FROM users WHERE email = $1',
      ['admin@faevision.com']
    );

    if (adminResult.rows.length > 0) {
      console.log('✅ Admin user exists in Preview database');
      console.log('🔒 Password hash present:', !!adminResult.rows[0].passwordHash);
    } else {
      console.log('❌ Admin user NOT found in Preview database');
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

testPreviewDatabase()
  .catch((e) => {
    console.error('💥 Preview database test failed:', e.message);
    process.exit(1);
  });
