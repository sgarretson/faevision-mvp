import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Support both Input voting and Idea voting schemas
const inputVoteSchema = z.object({
  inputId: z.string().cuid(),
  type: z.enum(['UP', 'DOWN']),
});

const ideaVoteSchema = z.object({
  entityType: z.enum(['IDEA', 'SIGNAL']),
  entityId: z.string().cuid(),
  value: z.enum(['UP', 'DOWN']),
});

// Combined schema - try both formats
const voteSchema = z.union([inputVoteSchema, ideaVoteSchema]);

// Helper function to convert type to value (V2 uses direct enum values)
const typeToValue = (type: 'UP' | 'DOWN'): 'UP' | 'DOWN' => type;
const valueToType = (value: 'UP' | 'DOWN'): 'UP' | 'DOWN' => value;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = voteSchema.parse(body);

    // Normalize data - handle both Input and Idea voting formats
    let entityType: string;
    let entityId: string;
    let voteValue: 'UP' | 'DOWN';

    if ('inputId' in validatedData) {
      // Input voting format
      entityType = 'SIGNAL';
      entityId = validatedData.inputId;
      voteValue = validatedData.type;
    } else {
      // Idea voting format
      entityType = validatedData.entityType;
      entityId = validatedData.entityId;
      voteValue = validatedData.value;
    }

    // Check if user already voted on this entity
    const existingVote = await (prisma as any).vote.findFirst({
      where: {
        entityType,
        entityId,
        createdBy: session.user.id,
      },
    });

    let vote;
    let action = '';

    const newValue = typeToValue(voteValue);

    if (existingVote) {
      if (existingVote.value === newValue) {
        // Remove vote if clicking same type
        await (prisma as any).vote.delete({
          where: { id: existingVote.id },
        });
        action = 'removed';
        vote = null;
      } else {
        // Update vote type if clicking different type
        vote = await (prisma as any).vote.update({
          where: { id: existingVote.id },
          data: { value: newValue },
        });
        action = 'updated';
      }
    } else {
      // Create new vote
      vote = await (prisma as any).vote.create({
        data: {
          value: newValue,
          entityType,
          entityId,
          createdBy: session.user.id,
        },
      });
      action = 'created';
    }

    // Get updated vote counts
    const votes = await (prisma as any).vote.findMany({
      where: {
        entityType,
        entityId,
      },
      select: { value: true },
    });

    const upVotes = votes.filter((v: any) => v.value === 'UP').length;
    const downVotes = votes.filter((v: any) => v.value === 'DOWN').length;

    // Log the action for audit
    await (prisma as any).auditLog.create({
      data: {
        userId: session.user.id,
        action: `VOTE_${action.toUpperCase()}`,
        entityType: 'vote',
        entityId: vote?.id || existingVote?.id || '',
        changes: {
          entityType,
          entityId,
          voteType: voteValue,
          action,
        },
      },
    });

    // Return compatible response for both Input and Idea components
    const voteResponse = {
      success: true,
      vote: vote ? { ...vote, type: valueToType(vote.value) } : null,
      action,
      voteCounts: {
        up: upVotes,
        down: downVotes,
        total: upVotes + downVotes,
      },
      // Ideas component expects these fields
      votes: {
        up: upVotes,
        down: downVotes,
        total: upVotes + downVotes,
      },
      userVote: vote ? valueToType(vote.value) : null,
    };

    return NextResponse.json(voteResponse);
  } catch (error) {
    console.error('Vote operation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid vote data',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const inputId = searchParams.get('inputId');

    if (!inputId) {
      return NextResponse.json({ error: 'Input ID required' }, { status: 400 });
    }

    // Get vote counts for the input
    const votes = await (prisma as any).vote.findMany({
      where: {
        entityType: 'SIGNAL',
        entityId: inputId,
      },
      select: { value: true, createdBy: true },
    });

    // Get current user's vote if any
    const userVote = votes.find((v: any) => v.createdBy === session.user.id);

    const upVotes = votes.filter((v: any) => v.value === 'UP').length;
    const downVotes = votes.filter((v: any) => v.value === 'DOWN').length;

    return NextResponse.json({
      voteCounts: {
        up: upVotes,
        down: downVotes,
        total: upVotes + downVotes,
      },
      userVote: userVote ? valueToType(userVote.value) : null,
    });
  } catch (error) {
    console.error('Vote fetch error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { entityType, entityId } = body;

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Entity type and ID required' },
        { status: 400 }
      );
    }

    // Find and delete user's vote
    const existingVote = await (prisma as any).vote.findFirst({
      where: {
        entityType,
        entityId,
        createdBy: session.user.id,
      },
    });

    if (existingVote) {
      await (prisma as any).vote.delete({
        where: { id: existingVote.id },
      });
    }

    // Get updated vote counts
    const votes = await (prisma as any).vote.findMany({
      where: {
        entityType,
        entityId,
      },
      select: { value: true },
    });

    const upVotes = votes.filter((v: any) => v.value === 'UP').length;
    const downVotes = votes.filter((v: any) => v.value === 'DOWN').length;

    // Log the action for audit
    await (prisma as any).auditLog.create({
      data: {
        userId: session.user.id,
        action: 'VOTE_REMOVED',
        entityType: 'vote',
        entityId: existingVote?.id || '',
        changes: {
          entityType,
          entityId,
          action: 'removed',
        },
      },
    });

    return NextResponse.json({
      success: true,
      votes: {
        up: upVotes,
        down: downVotes,
        total: upVotes + downVotes,
      },
    });
  } catch (error) {
    console.error('Vote removal error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
