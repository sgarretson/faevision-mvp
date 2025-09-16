import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 RUNTIME DATABASE DEBUG');
    
    // Check environment
    const environment = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DATABASE_URL_partial: process.env.DATABASE_URL?.substring(0, 50) + '...',
      DIRECT_URL_exists: !!process.env.DIRECT_URL,
    };
    
    console.log('📊 Environment:', environment);
    
    // Test database connection
    const userCount = await prisma.user.count();
    console.log(`👥 Total users in runtime: ${userCount}`);
    
    // Check for admin user specifically
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@faevision.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });
    
    console.log('🔍 Admin user lookup result:', adminUser);
    
    // List all users
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });
    
    console.log('👥 All users in runtime database:', allUsers);
    
    return Response.json({
      success: true,
      environment,
      userCount,
      adminFound: !!adminUser,
      adminUser,
      allUsers,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('💥 Runtime database error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        DATABASE_URL_exists: !!process.env.DATABASE_URL,
      }
    }, { status: 500 });
  }
}
