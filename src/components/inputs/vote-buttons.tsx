'use client'

import { useState, useEffect, useCallback } from 'react'
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VoteButtonsProps {
  inputId: string
  initialVoteCounts?: {
    up: number
    down: number
    total: number
  }
  initialUserVote?: 'UP' | 'DOWN' | null
  className?: string
}

interface VoteCounts {
  up: number
  down: number
  total: number
}

export function VoteButtons({
  inputId,
  initialVoteCounts = { up: 0, down: 0, total: 0 },
  initialUserVote = null,
  className,
}: VoteButtonsProps) {
  const [voteCounts, setVoteCounts] = useState<VoteCounts>(initialVoteCounts)
  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(initialUserVote)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVoteData = useCallback(async () => {
    try {
      const response = await fetch(`/api/votes?inputId=${inputId}`)
      const data = await response.json()

      if (response.ok) {
        setVoteCounts(data.voteCounts)
        setUserVote(data.userVote)
      }
    } catch (error) {
      console.error('Failed to fetch vote data:', error)
    }
  }, [inputId])

  // Fetch current vote data on mount
  useEffect(() => {
    fetchVoteData()
  }, [fetchVoteData])

  const handleVote = async (type: 'UP' | 'DOWN') => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)

    // Optimistic update
    const wasCurrentVote = userVote === type
    const oldVoteCounts = { ...voteCounts }
    const oldUserVote = userVote

    if (wasCurrentVote) {
      // Removing vote
      setUserVote(null)
      setVoteCounts((prev) => ({
        ...prev,
        [type.toLowerCase()]: Math.max(0, prev[type.toLowerCase() as keyof VoteCounts] - 1),
        total: Math.max(0, prev.total - 1),
      }))
    } else if (userVote) {
      // Changing vote
      setUserVote(type)
      setVoteCounts((prev) => ({
        ...prev,
        [userVote.toLowerCase()]: Math.max(0, prev[userVote.toLowerCase() as keyof VoteCounts] - 1),
        [type.toLowerCase()]: prev[type.toLowerCase() as keyof VoteCounts] + 1,
      }))
    } else {
      // New vote
      setUserVote(type)
      setVoteCounts((prev) => ({
        ...prev,
        [type.toLowerCase()]: prev[type.toLowerCase() as keyof VoteCounts] + 1,
        total: prev.total + 1,
      }))
    }

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputId,
          type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to vote')
      }

      // Update with actual data from server
      setVoteCounts(data.voteCounts)
      setUserVote(data.vote?.type || null)
    } catch (error) {
      console.error('Vote error:', error)

      // Revert optimistic update
      setVoteCounts(oldVoteCounts)
      setUserVote(oldUserVote)
      setError(error instanceof Error ? error.message : 'Failed to vote')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Up Vote Button */}
      <Button
        variant={userVote === 'UP' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleVote('UP')}
        disabled={isLoading}
        className={cn(
          'flex items-center space-x-1 transition-colors',
          userVote === 'UP' && 'bg-green-600 text-white hover:bg-green-700'
        )}
      >
        {isLoading && userVote === 'UP' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsUp className="h-4 w-4" />
        )}
        <span className="font-medium">{voteCounts.up}</span>
      </Button>

      {/* Down Vote Button */}
      <Button
        variant={userVote === 'DOWN' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleVote('DOWN')}
        disabled={isLoading}
        className={cn(
          'flex items-center space-x-1 transition-colors',
          userVote === 'DOWN' && 'bg-red-600 text-white hover:bg-red-700'
        )}
      >
        {isLoading && userVote === 'DOWN' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsDown className="h-4 w-4" />
        )}
        <span className="font-medium">{voteCounts.down}</span>
      </Button>

      {/* Total Vote Count */}
      {voteCounts.total > 0 && (
        <span className="ml-2 text-sm text-gray-500">
          {voteCounts.total} vote{voteCounts.total !== 1 ? 's' : ''}
        </span>
      )}

      {/* Error Display */}
      {error && <span className="ml-2 text-sm text-red-600">{error}</span>}
    </div>
  )
}
