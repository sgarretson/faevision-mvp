import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check what users exist and their authentication setup
    const users = await (prisma as any).user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        createdAt: true,
      },
      take: 10,
    });

    const userSummary = users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      hasPasswordHash: !!user.passwordHash,
      passwordHashLength: user.passwordHash?.length || 0,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({
      success: true,
      userCount: users.length,
      users: userSummary,
      environment: process.env.VERCEL_ENV || 'development',
      databaseUrl: process.env.POSTGRES_URL ? 'Set' : 'Not set',
    });
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.VERCEL_ENV || 'development',
    });
  }
}
