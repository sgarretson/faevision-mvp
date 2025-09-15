import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export async function POST(request: NextRequest) {
  // Only allow in non-production Vercel environments (preview, development)
  // Note: Vercel Preview has NODE_ENV=production but VERCEL_ENV=preview
  if (process.env.VERCEL_ENV === 'production') {
    return Response.json({ error: 'Test endpoint disabled in production' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { email, password } = body

    console.log('🧪 Testing auth for:', email)

    // Test database connection
    console.log('🗄️ Testing database connection...')
    const userCount = await prisma.user.count()
    console.log('📊 Total users in database:', userCount)

    // Find specific user
    console.log('👤 Looking up user:', email)
    const user = await prisma.user.findUnique({
      where: { email: email?.toLowerCase() }
    })

    if (!user) {
      return Response.json({
        success: false,
        error: 'User not found',
        debug: {
          email_searched: email?.toLowerCase(),
          total_users: userCount,
          database_connected: true
        }
      })
    }

    // Test password comparison
    console.log('🔒 Testing password comparison...')
    const isValid = await compare(password, user.passwordHash || '')

    return Response.json({
      success: isValid,
      debug: {
        user_found: true,
        user_email: user.email,
        user_role: user.role,
        has_password_hash: !!user.passwordHash,
        password_valid: isValid,
        database_connected: true,
        total_users: userCount,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_ENV: process.env.VERCEL_ENV,
          DATABASE_URL_exists: !!process.env.DATABASE_URL,
          NEXTAUTH_SECRET_exists: !!process.env.NEXTAUTH_SECRET,
        }
      }
    })

  } catch (error) {
    console.error('💥 Test auth error:', error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        database_connected: false,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_ENV: process.env.VERCEL_ENV,
          DATABASE_URL_exists: !!process.env.DATABASE_URL,
          NEXTAUTH_SECRET_exists: !!process.env.NEXTAUTH_SECRET,
        }
      }
    })
  }
}
