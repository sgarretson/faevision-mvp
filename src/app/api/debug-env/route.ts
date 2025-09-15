import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Only allow in non-production environments
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Debug endpoint disabled in production' }, { status: 403 })
  }

  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
    DATABASE_URL_exists: !!process.env.DATABASE_URL,
    DATABASE_URL_preview: process.env.DATABASE_URL?.includes('ep-round-frost-aecda5ou'),
    NEXTAUTH_SECRET_exists: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL_exists: !!process.env.NEXTAUTH_URL,
    NEXTAUTH_URL_value: process.env.NEXTAUTH_URL,
    timestamp: new Date().toISOString(),
  }

  return Response.json({
    message: 'FAEVision Preview Environment Debug',
    environment: envCheck,
    auth_status: {
      nextauth_configured: !!(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL),
      database_configured: !!process.env.DATABASE_URL,
    }
  })
}
