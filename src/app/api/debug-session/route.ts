import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Force dynamic rendering for auth
export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to check session state
 * For troubleshooting authentication issues
 */
export async function GET() {
  try {
    console.log('🔍 Debug Session - Checking auth state...');

    const session = await auth();

    console.log('📊 Session result:', {
      hasSession: !!session,
      user: session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
          }
        : null,
    });

    return NextResponse.json({
      success: true,
      session: {
        exists: !!session,
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
              role: session.user.role,
            }
          : null,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        vercelEnv: process.env.VERCEL_ENV,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Debug session error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
