import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Check if we're in a safe environment
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.VERCEL_ENV === 'production'
    ) {
      return NextResponse.json(
        {
          error: 'Cannot create test users in production',
        },
        { status: 403 }
      );
    }

    const testUsers = [
      {
        email: 'admin@faevision.com',
        name: 'Admin User',
        role: 'ADMIN',
        password: 'admin123',
        department: 'Executive',
      },
      {
        email: 'exec@faevision.com',
        name: 'Executive User',
        role: 'EXECUTIVE',
        password: 'exec123',
        department: 'Leadership',
      },
      {
        email: 'user@faevision.com',
        name: 'Test User',
        role: 'CONTRIBUTOR',
        password: 'user123',
        department: 'Engineering',
      },
    ];

    const createdUsers = [];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await (prisma as any).users.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        // Update existing user with password hash if missing
        if (!existingUser.passwordHash) {
          const passwordHash = await hash(userData.password, 12);
          const updatedUser = await (prisma as any).users.update({
            where: { email: userData.email },
            data: { passwordHash },
          });
          createdUsers.push({
            action: 'updated',
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
          });
        } else {
          createdUsers.push({
            action: 'exists',
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role,
          });
        }
      } else {
        // Create new user
        const passwordHash = await hash(userData.password, 12);
        const newUser = await (prisma as any).users.create({
          data: {
            email: userData.email,
            name: userData.name,
            role: userData.role,
            department: userData.department,
            passwordHash,
          },
        });
        createdUsers.push({
          action: 'created',
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Test users setup complete',
      users: createdUsers,
      environment: process.env.VERCEL_ENV || 'development',
      testCredentials: [
        { email: 'admin@faevision.com', password: 'admin123', role: 'ADMIN' },
        { email: 'exec@faevision.com', password: 'exec123', role: 'EXECUTIVE' },
        {
          email: 'user@faevision.com',
          password: 'user123',
          role: 'CONTRIBUTOR',
        },
      ],
    });
  } catch (error) {
    console.error('Setup test users error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
