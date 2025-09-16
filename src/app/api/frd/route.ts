import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// ============================================================================
// F6: FRD MANAGEMENT API - Basic Implementation
// ============================================================================
// Expert: AI Architect (Dr. Priya Patel) + Strategic Consultant (Marcus Rodriguez)

const createFRDSchema = z.object({
  solutionId: z.string().cuid(),
  title: z.string().min(5).max(200),
  content: z.object({
    sections: z.array(
      z.object({
        title: z.string(),
        content: z.string(),
        order: z.number(),
        type: z.string(),
      })
    ),
  }),
  status: z.enum(['DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED']).default('DRAFT'),
  aiGenerated: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const frdDocuments = await (prisma as any).fRDDocument.findMany({
      include: {
        solution: { select: { id: true, title: true, status: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ frdDocuments });
  } catch (error) {
    console.error('Error fetching FRD documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FRD documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!['EXECUTIVE', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Only executives can create FRD documents' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createFRDSchema.parse(body);

    const newFRD = await (prisma as any).fRDDocument.create({
      data: {
        ...validatedData,
        createdBy: session.user.id,
        version: '1.0',
      },
    });

    return NextResponse.json({ frdDocument: newFRD }, { status: 201 });
  } catch (error) {
    console.error('Error creating FRD document:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid FRD data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create FRD document' },
      { status: 500 }
    );
  }
}
