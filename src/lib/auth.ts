/**
 * Authentication Configuration - Auth.js v5
 * Pure Auth.js v5 implementation for FAEVision MVP  
 * Expert Team: Alex Thompson (Lead Developer) + Dr. Priya Patel (AI Architect)
 */

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import type { UserRole } from "../generated/prisma"

// ============================================================================
// TYPESCRIPT DECLARATIONS
// ============================================================================

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      department?: string | null
      avatar?: string | null
    }
  }
  
  interface User {
    id: string
    email: string
    name: string
    role: UserRole
    department?: string | null
    avatar?: string | null
  }
}

// ============================================================================
// AUTH.JS V5 CONFIGURATION
// ============================================================================

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "credentials", 
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email).toLowerCase() }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await compare(String(credentials.password), user.passwordHash)
        
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          avatar: user.avatar
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.department = user.department
        token.avatar = user.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.department = token.department as string
        session.user.avatar = token.avatar as string
      }
      return session
    }
  }
})

// ============================================================================
// ROLE-BASED ACCESS CONTROL HELPERS
// ============================================================================

export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole)
}

export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissions: Record<UserRole, string[]> = {
    ADMIN: [
      'read:all',
      'write:all', 
      'delete:all',
      'manage:users',
      'manage:system',
      'approve:all'
    ],
    EXECUTIVE: [
      'read:all',
      'write:solutions',
      'write:requirements',
      'approve:solutions',
      'approve:requirements',
      'manage:assignments'
    ],
    CONTRIBUTOR: [
      'read:assigned',
      'write:inputs',
      'write:comments',
      'vote:inputs',
      'update:assigned_tasks'
    ]
  }

  return permissions[userRole]?.includes(permission) || false
}