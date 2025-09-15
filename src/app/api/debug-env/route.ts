import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Only allow in non-production environments
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Debug endpoint disabled in production' }, { status: 403 })
  }

  const environmentInfo = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
    },
    auth_variables: {
      NEXTAUTH_SECRET_exists: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_SECRET_length: process.env.NEXTAUTH_SECRET?.length || 0,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
    database_variables: {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DATABASE_URL_length: process.env.DATABASE_URL?.length || 0,
      DIRECT_URL_exists: !!process.env.DIRECT_URL,
    },
    ai_variables: {
      OPENAI_API_KEY_exists: !!process.env.OPENAI_API_KEY,
    }
  }

  console.log('🔍 Environment Debug Info:', environmentInfo)

  return Response.json({
    success: true,
    message: 'Environment variables check complete',
    ...environmentInfo
  })
}