#!/usr/bin/env node

/**
 * Simple Preview Database User Seeding Script
 * Creates test users with hashed passwords using direct SQL
 */

const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const PREVIEW_DATABASE_URL = 'postgresql://neondb_owner:npg_vewQT72KgtCh@ep-round-frost-aecda5ou-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function seedPreviewUsers() {
  console.log('🌱 Seeding Preview Database Users...');

  const client = new Client({
    connectionString: PREVIEW_DATABASE_URL,
  });

  try {
    await client.connect();

    // Hash passwords
    const adminPassword = await bcrypt.hash('FAEVision2025!', 12);
    const executivePassword = await bcrypt.hash('Executive2025!', 12);
    const contributorPassword = await bcrypt.hash('Contributor2025!', 12);

    // Insert users using direct SQL
    const insertSQL = `
      INSERT INTO users (id, email, name, role, "passwordHash", "createdAt", "updatedAt")
      VALUES 
        ($1, $2, $3, $4, $5, NOW(), NOW()),
        ($6, $7, $8, $9, $10, NOW(), NOW()),
        ($11, $12, $13, $14, $15, NOW(), NOW())
      ON CONFLICT (email) 
      DO UPDATE SET 
        "passwordHash" = EXCLUDED."passwordHash",
        "updatedAt" = NOW()
    `;

    await client.query(insertSQL, [
      // Admin user
      'admin_001', 'admin@faevision.com', 'FAE Admin', 'ADMIN', adminPassword,
      // Executive user  
      'exec_001', 'sarah.executive@faevision.com', 'Sarah Chen', 'EXECUTIVE', executivePassword,
      // Contributor user
      'contrib_001', 'alex.contributor@faevision.com', 'Alex Thompson', 'CONTRIBUTOR', contributorPassword
    ]);

    console.log('✅ Created 3 users successfully');
    console.log('Users: admin@faevision.com, sarah.executive@faevision.com, alex.contributor@faevision.com');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    await client.end();
  }
}

seedPreviewUsers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
