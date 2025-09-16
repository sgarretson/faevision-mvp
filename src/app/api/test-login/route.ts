import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔍 Direct login test for:', email);

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password required',
      }, { status: 400 });
    }

    // Test database connection and user lookup
    const user = await (prisma as any).user.findUnique({
      where: { email: String(email).toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        email: email,
      }, { status: 404 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({
        success: false,
        error: 'User has no password hash - run /api/setup-test-users',
        userInfo: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }, { status: 400 });
    }

    // Test password comparison
    const isValid = await compare(String(password), user.passwordHash);

    return NextResponse.json({
      success: isValid,
      message: isValid ? 'Credentials valid' : 'Invalid password',
      userInfo: isValid ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      } : undefined,
      debug: {
        environment: process.env.VERCEL_ENV,
        timestamp: new Date().toISOString(),
        passwordHashLength: user.passwordHash?.length,
      },
    });

  } catch (error) {
    console.error('Direct login test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        environment: process.env.VERCEL_ENV,
        timestamp: new Date().toISOString(),
      },
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Direct login test endpoint - POST with email/password to test authentication',
    testCredentials: [
      { email: 'admin@faevision.com', password: 'admin123', role: 'ADMIN' },
      { email: 'exec@faevision.com', password: 'exec123', role: 'EXECUTIVE' },
      { email: 'user@faevision.com', password: 'user123', role: 'CONTRIBUTOR' },
    ],
    instructions: 'POST to this endpoint with {"email": "user@example.com", "password": "password123"}',
  });
}
