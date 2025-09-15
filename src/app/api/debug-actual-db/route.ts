import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Only allow in Preview environment
  if (process.env.VERCEL_ENV !== 'preview') {
    return Response.json({ error: 'Debug endpoint only for preview' }, { status: 403 })
  }

  try {
    // Show ALL database-related environment variables
    const dbEnvVars = {
      DATABASE_URL: process.env.DATABASE_URL?.substring(0, 80) + '...',
      DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED?.substring(0, 80) + '...',
      POSTGRES_URL: process.env.POSTGRES_URL?.substring(0, 80) + '...',
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL?.substring(0, 80) + '...',
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING?.substring(0, 80) + '...',
      PGHOST: process.env.PGHOST,
      PGUSER: process.env.PGUSER,
      PGDATABASE: process.env.PGDATABASE,
      PGPASSWORD: process.env.PGPASSWORD ? '***' : undefined,
    }

    // Filter out undefined values
    const actualEnvVars = Object.fromEntries(
      Object.entries(dbEnvVars).filter(([_, value]) => value !== undefined)
    )

    console.log('🔍 ALL DATABASE ENV VARS:', actualEnvVars)

    // Show which URL Prisma would use by default
    const prismaUrl = process.env.DATABASE_URL || 
                      process.env.POSTGRES_PRISMA_URL || 
                      process.env.POSTGRES_URL

    return Response.json({
      success: true,
      environment: process.env.VERCEL_ENV,
      databaseEnvVars: actualEnvVars,
      prismaWouldUse: prismaUrl?.substring(0, 80) + '...',
      conflictCount: Object.keys(actualEnvVars).length,
      recommendation: Object.keys(actualEnvVars).length > 1 ? 
        'TOO MANY DB VARS - Remove duplicates!' : 
        'Clean configuration'
    })

  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
