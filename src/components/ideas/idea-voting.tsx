'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

/**
 * Idea Voting Component
 *
 * Executive voting interface for idea evaluation:
 * - Thumbs up/down voting
 * - Real-time vote counts
 * - User vote status tracking
 * - Executive-optimized UI
 *
 * Expert: Alex Thompson (Lead Developer)
 * Support: Maya Rodriguez (UX Expert)
 */

interface IdeaVotingProps {
  ideaId: string;
  initialVotes: {
    up: number;
    down: number;
    total: number;
  };
  userVote?: 'UP' | 'DOWN' | null;
  onVoteChange?: (newVotes: {
    up: number;
    down: number;
    total: number;
  }) => void;
}

export function IdeaVoting({
  ideaId,
  initialVotes,
  userVote: initialUserVote,
  onVoteChange,
}: IdeaVotingProps) {
  const { data: session } = useSession();
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(
    initialUserVote || null
  );
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteValue: 'UP' | 'DOWN') => {
    if (!session?.user || isVoting) return;

    try {
      setIsVoting(true);

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'IDEA',
          entityId: ideaId,
          value: voteValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVotes(data.votes);
        setUserVote(data.userVote);
        onVoteChange?.(data.votes);
      } else {
        throw new Error(data.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Vote error:', error);
      // TODO: Show error toast
    } finally {
      setIsVoting(false);
    }
  };

  const removeVote = async () => {
    if (!session?.user || isVoting || !userVote) return;

    try {
      setIsVoting(true);

      const response = await fetch('/api/votes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'IDEA',
          entityId: ideaId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVotes(data.votes);
        setUserVote(null);
        onVoteChange?.(data.votes);
      } else {
        throw new Error(data.error || 'Failed to remove vote');
      }
    } catch (error) {
      console.error('Remove vote error:', error);
      // TODO: Show error toast
    } finally {
      setIsVoting(false);
    }
  };

  const getButtonVariant = (voteType: 'UP' | 'DOWN') => {
    if (userVote === voteType) {
      return voteType === 'UP' ? 'default' : 'destructive';
    }
    return 'outline';
  };

  const getButtonClasses = (voteType: 'UP' | 'DOWN') => {
    const baseClasses = 'flex-1 flex items-center justify-center space-x-2';
    if (userVote === voteType) {
      return `${baseClasses} ${
        voteType === 'UP'
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-red-600 text-white hover:bg-red-700'
      }`;
    }
    return `${baseClasses} hover:bg-gray-50`;
  };

  if (!session?.user) {
    return (
      <div className="text-center text-sm text-gray-500">
        Sign in to vote on ideas
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Vote Buttons */}
      <div className="flex space-x-2">
        <Button
          variant={getButtonVariant('UP')}
          onClick={() => (userVote === 'UP' ? removeVote() : handleVote('UP'))}
          disabled={isVoting}
          className={getButtonClasses('UP')}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{votes.up}</span>
        </Button>

        <Button
          variant={getButtonVariant('DOWN')}
          onClick={() =>
            userVote === 'DOWN' ? removeVote() : handleVote('DOWN')
          }
          disabled={isVoting}
          className={getButtonClasses('DOWN')}
        >
          <ThumbsDown className="h-4 w-4" />
          <span>{votes.down}</span>
        </Button>
      </div>

      {/* Vote Summary */}
      <div className="text-center text-sm text-gray-600">
        {votes.total === 0 ? (
          'Be the first to vote'
        ) : (
          <>
            {votes.total} total vote{votes.total !== 1 ? 's' : ''}
            {userVote && (
              <span className="ml-2 text-xs">
                (You voted{' '}
                <span
                  className={
                    userVote === 'UP' ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {userVote === 'UP' ? 'up' : 'down'}
                </span>
                )
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
