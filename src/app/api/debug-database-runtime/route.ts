import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 RUNTIME DATABASE DEBUG');

    // Check environment
    const environment = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      PRISMA_DATABASE_URL_exists: !!process.env.PRISMA_DATABASE_URL,
      PRISMA_DATABASE_URL_partial:
        process.env.PRISMA_DATABASE_URL?.substring(0, 50) + '...',
      DIRECT_URL_exists: !!process.env.DIRECT_URL,
    };

    console.log('📊 Environment:', environment);

    // Test database connection
    const userCount = await (prisma as any).users.count();
    console.log(`👥 Total users in runtime: ${userCount}`);

    // Check for admin user specifically
    const adminUser = await (prisma as any).users.findUnique({
      where: { email: 'admin@faevision.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    console.log('🔍 Admin user lookup result:', adminUser);

    // List all users
    const allUsers = await (prisma as any).users.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    console.log('👥 All users in runtime database:', allUsers);

    // Check for V2 data counts only (V1 models deprecated)
    const dataCounts = {
      v1: {
        inputs: 0, // V1 Input model deprecated
        solutions: 0, // V1 Solution model deprecated
        comments: 0, // V1 Comment model deprecated
        votes: 0, // V1 Vote model deprecated
      },
      v2: {
        signals: (await (prisma as any).signal?.count()) || 0,
        hotspots: (await (prisma as any).hotspot?.count()) || 0,
        ideas: (await (prisma as any).idea?.count()) || 0,
        departments: (await (prisma as any).department?.count()) || 0,
        teams: (await (prisma as any).team?.count()) || 0,
        categories: (await (prisma as any).category?.count()) || 0,
        initiatives: (await (prisma as any).initiative?.count()) || 0,
      },
    };

    // Get some sample data
    const sampleSignals =
      (await (prisma as any).signal?.findMany({
        take: 2,
        select: {
          id: true,
          title: true,
          description: true,
          severity: true,
          createdAt: true,
        },
      })) || [];

    console.log('📊 Data counts:', dataCounts);
    console.log('📝 Sample signals:', sampleSignals);

    return Response.json({
      success: true,
      environment,
      userCount,
      adminFound: !!adminUser,
      adminUser,
      allUsers,
      dataCounts,
      sampleSignals,
      hasV2Data:
        dataCounts.v2.signals > 0 ||
        dataCounts.v2.hotspots > 0 ||
        dataCounts.v2.ideas > 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('💥 Runtime database error:', error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_ENV: process.env.VERCEL_ENV,
          DATABASE_URL_exists: !!process.env.DATABASE_URL,
        },
      },
      { status: 500 }
    );
  }
}
