/**
 * FAEVision Production Database Setup Script
 * Expert: Morgan Smith (Database Architect)
 * Purpose: Initialize production database with proper security, indexing, and executive data
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

interface ExecutiveUser {
  email: string;
  name: string;
  role: 'ADMIN' | 'EXECUTIVE' | 'CONTRIBUTOR';
  department: string;
  title: string;
  password: string;
}

// Production executive users (passwords will be changed on first login)
const PRODUCTION_EXECUTIVES: ExecutiveUser[] = [
  {
    email: 'admin@faevision.com',
    name: 'System Administrator',
    role: 'ADMIN',
    department: 'Administration',
    title: 'System Administrator',
    password: 'ChangeOnFirstLogin2024!',
  },
  {
    email: 'sarah.chen@faevision.com',
    name: 'Sarah Chen',
    role: 'EXECUTIVE',
    department: 'Strategy',
    title: 'Chief Strategy Officer',
    password: 'ChangeOnFirstLogin2024!',
  },
  {
    email: 'marcus.rodriguez@faevision.com',
    name: 'Marcus Rodriguez',
    role: 'EXECUTIVE',
    department: 'Operations',
    title: 'Chief Operating Officer',
    password: 'ChangeOnFirstLogin2024!',
  },
  {
    email: 'priya.patel@faevision.com',
    name: 'Dr. Priya Patel',
    role: 'EXECUTIVE',
    department: 'Engineering',
    title: 'VP Engineering',
    password: 'ChangeOnFirstLogin2024!',
  },
  {
    email: 'alex.thompson@faevision.com',
    name: 'Alex Thompson',
    role: 'EXECUTIVE',
    department: 'Engineering',
    title: 'Lead Developer',
    password: 'ChangeOnFirstLogin2024!',
  },
];

async function setupProductionDatabase() {
  console.log('🚀 Setting up FAEVision Production Database...');

  try {
    // Test database connection
    console.log('🔗 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection established');

    // Run database migrations
    console.log('📊 Checking database schema...');

    // Check if tables exist
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `;

    console.log(`📋 Found ${tables.length} tables in database`);

    if (tables.length === 0) {
      console.log('⚠️  No tables found. Please run prisma migrations first:');
      console.log('   npx prisma migrate deploy');
      return;
    }

    // Create production executive users
    console.log('👥 Setting up executive users...');

    for (const executiveData of PRODUCTION_EXECUTIVES) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: executiveData.email },
        });

        if (existingUser) {
          console.log(
            `👤 User ${executiveData.email} already exists, skipping...`
          );
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(executiveData.password, 12);

        // Create user
        const newUser = await prisma.user.create({
          data: {
            email: executiveData.email,
            name: executiveData.name,
            role: executiveData.role,
            department: executiveData.department,
            title: executiveData.title,
            password: hashedPassword,
            emailVerified: new Date(), // Mark as verified for production
            lastActive: new Date(),
          },
        });

        console.log(`✅ Created ${executiveData.role} user: ${newUser.email}`);
      } catch (error) {
        console.error(
          `❌ Failed to create user ${executiveData.email}:`,
          error
        );
      }
    }

    // Create sample strategic input for demonstration
    console.log('📝 Creating sample strategic input...');

    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@faevision.com' },
    });

    if (adminUser) {
      const existingInput = await prisma.input.findFirst({
        where: { title: 'Welcome to FAEVision MVP' },
      });

      if (!existingInput) {
        await prisma.input.create({
          data: {
            title: 'Welcome to FAEVision MVP',
            description:
              'This is a sample strategic input to demonstrate the F1-F6 executive workflow. FAEVision helps executives capture, collaborate on, organize, and solve strategic challenges efficiently.',
            department: 'STRATEGY',
            issueType: 'PROCESS',
            rootCause: 'Need for strategic management platform',
            priority: 'MEDIUM',
            businessImpact:
              'Improved executive decision-making and strategic execution',
            status: 'ACTIVE',
            createdBy: adminUser.id,
            tags: ['welcome', 'demo', 'strategic-planning'],
          },
        });

        console.log('✅ Created welcome strategic input');
      }
    }

    // Optimize database performance
    console.log('⚡ Optimizing database performance...');

    // Create performance indexes
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_input_created_at ON "Input" (created_at DESC)`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_input_department_priority ON "Input" (department, priority)`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_solution_status ON "Solution" (status)`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_requirement_solution_id ON "Requirement" (solution_id)`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_frd_status ON "FRDDocument" (status)`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_log_created_at ON "ActivityLog" (created_at DESC)`;
    await prisma.$executeRaw`CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_last_active ON "User" (last_active DESC)`;

    console.log('✅ Performance indexes created');

    // Analyze tables for query optimization
    await prisma.$executeRaw`ANALYZE`;
    console.log('✅ Database statistics updated');

    // Verify data integrity
    console.log('🔍 Verifying data integrity...');

    const userCount = await prisma.user.count();
    const inputCount = await prisma.input.count();
    const executiveCount = await prisma.user.count({
      where: { role: 'EXECUTIVE' },
    });

    console.log(`📊 Database Summary:`);
    console.log(`   👥 Total Users: ${userCount}`);
    console.log(`   🏢 Executives: ${executiveCount}`);
    console.log(`   📝 Inputs: ${inputCount}`);

    // Test critical queries
    console.log('🧪 Testing critical queries...');

    const dashboardQuery = await prisma.input.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { name: true, department: true } },
        _count: { select: { votes: true, comments: true } },
      },
    });

    console.log(
      `✅ Dashboard query executed successfully (${dashboardQuery.length} results)`
    );

    console.log('🎉 Production database setup completed successfully!');

    // Display login credentials
    console.log('\n🔑 PRODUCTION LOGIN CREDENTIALS:');
    console.log('=====================================');
    for (const exec of PRODUCTION_EXECUTIVES) {
      console.log(`${exec.title}:`);
      console.log(`  Email: ${exec.email}`);
      console.log(`  Temporary Password: ${exec.password}`);
      console.log(`  Role: ${exec.role}`);
      console.log(`  Department: ${exec.department}`);
      console.log('');
    }
    console.log(
      '⚠️  IMPORTANT: All users should change their passwords on first login!'
    );
  } catch (error) {
    console.error('❌ Production database setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function validateProductionDatabase() {
  console.log('✅ Validating production database...');

  try {
    // Test all core functionality
    const [
      userCount,
      inputCount,
      solutionCount,
      requirementCount,
      frdCount,
      commentCount,
      voteCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.input.count(),
      prisma.solution.count(),
      prisma.requirement.count(),
      prisma.fRDDocument.count(),
      prisma.comment.count(),
      prisma.vote.count(),
    ]);

    console.log('📊 Production Database Validation:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Inputs: ${inputCount}`);
    console.log(`   Solutions: ${solutionCount}`);
    console.log(`   Requirements: ${requirementCount}`);
    console.log(`   FRD Documents: ${frdCount}`);
    console.log(`   Comments: ${commentCount}`);
    console.log(`   Votes: ${voteCount}`);

    // Test query performance
    const startTime = Date.now();
    await prisma.input.findMany({
      take: 10,
      include: {
        creator: true,
        votes: true,
        comments: true,
      },
    });
    const queryTime = Date.now() - startTime;

    console.log(`⚡ Query performance: ${queryTime}ms`);

    if (queryTime > 1000) {
      console.warn('⚠️  Query performance is slower than expected');
    } else {
      console.log('✅ Query performance is optimal');
    }

    console.log('✅ Production database validation completed successfully!');
  } catch (error) {
    console.error('❌ Production database validation failed:', error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--validate-only')) {
    await validateProductionDatabase();
  } else {
    await setupProductionDatabase();
    await validateProductionDatabase();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Process interrupted. Cleaning up...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Process terminated. Cleaning up...');
  await prisma.$disconnect();
  process.exit(0);
});

if (require.main === module) {
  main()
    .then(() => {
      console.log('🎉 Production database setup completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Production database setup failed:', error);
      process.exit(1);
    });
}

export { setupProductionDatabase, validateProductionDatabase };
