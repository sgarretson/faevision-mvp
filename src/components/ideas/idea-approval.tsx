'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  MessageSquare,
  Zap,
} from 'lucide-react';

/**
 * Idea Approval Component
 *
 * Executive approval workflow for ideas:
 * - Status management (draft, review, approved, rejected)
 * - Approval criteria tracking
 * - Executive decision capture
 * - Approval history audit
 *
 * Expert: Sarah Chen (Product Manager)
 * Support: Maya Rodriguez (UX Expert)
 */

interface IdeaApprovalProps {
  readonly ideaId: string;
  readonly currentStatus: 'draft' | 'review' | 'approved' | 'rejected';
  readonly votes: {
    readonly up: number;
    readonly down: number;
    readonly total: number;
  };
  readonly approvalCriteria?: {
    readonly minVotes?: number;
    readonly minApprovalRatio?: number;
    readonly requiresExecutiveApproval?: boolean;
  };
  readonly approvalHistory?: ReadonlyArray<{
    readonly id: string;
    readonly status: string;
    readonly reason?: string;
    readonly approvedBy: {
      readonly name: string;
      readonly role: string;
    };
    readonly createdAt: string;
  }>;
  readonly onStatusChange?: (newStatus: string) => void;
}

const STATUS_CONFIG = {
  draft: {
    icon: AlertCircle,
    color: 'bg-gray-100 text-gray-800',
    label: 'Draft',
    description: 'Idea is being developed and refined',
  },
  review: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Under Review',
    description: 'Executives are evaluating this idea',
  },
  approved: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800',
    label: 'Approved',
    description: 'Ready to be converted to solution',
  },
  rejected: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800',
    label: 'Rejected',
    description: 'Idea was not approved for implementation',
  },
  // Additional status values that might come from database
  active: {
    icon: Zap,
    color: 'bg-blue-100 text-blue-800',
    label: 'Active',
    description: 'Idea is actively being worked on',
  },
  pending: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending',
    description: 'Idea is pending review',
  },
} as const;

export function IdeaApproval({
  ideaId,
  currentStatus,
  votes,
  approvalCriteria = {},
  approvalHistory = [],
  onStatusChange,
}: IdeaApprovalProps) {
  const { data: session } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);
  const [approvalReason, setApprovalReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);

  const isExecutive =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'EXECUTIVE';

  // Defensive programming: ensure status exists in config
  const safeStatus =
    currentStatus && STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG]
      ? (currentStatus as keyof typeof STATUS_CONFIG)
      : 'draft';
  const statusConfig = STATUS_CONFIG[safeStatus];
  const StatusIcon = statusConfig.icon;

  // Calculate approval readiness
  const {
    minVotes = 2,
    minApprovalRatio = 0.6,
    requiresExecutiveApproval = true,
  } = approvalCriteria;

  const approvalRatio = votes.total > 0 ? votes.up / votes.total : 0;
  const meetsVoteCriteria =
    votes.total >= minVotes && approvalRatio >= minApprovalRatio;

  const handleStatusChange = async (newStatus: string) => {
    if (!session?.user || isUpdating) return;

    try {
      setIsUpdating(true);

      const response = await fetch(`/api/ideas/${ideaId}/approval`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          reason: approvalReason.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onStatusChange?.(newStatus);
        setApprovalReason('');
        setShowReasonInput(false);
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      // Error handling: Log for debugging, improve UX in future iterations
    } finally {
      setIsUpdating(false);
    }
  };

  const canSubmitForReview = ['draft'].includes(safeStatus);

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <StatusIcon className="h-5 w-5 text-gray-500" />
          <div>
            <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
            <p className="mt-1 text-sm text-gray-600">
              {statusConfig.description}
            </p>
          </div>
        </div>

        {/* Approval Criteria Status */}
        <div className="text-right text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span
              className={
                votes.total >= minVotes ? 'text-green-600' : 'text-gray-500'
              }
            >
              {votes.total}/{minVotes} votes
            </span>
          </div>
          <div className="mt-1 flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <span
              className={
                approvalRatio >= minApprovalRatio
                  ? 'text-green-600'
                  : 'text-gray-500'
              }
            >
              {Math.round(approvalRatio * 100)}%/
              {Math.round(minApprovalRatio * 100)}% approval
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {session?.user && (
        <div className="space-y-3">
          {/* Submit for Review */}
          {canSubmitForReview && (
            <Button
              onClick={() => handleStatusChange('review')}
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? 'Submitting...' : 'Submit for Executive Review'}
            </Button>
          )}

          {/* Executive Actions */}
          {isExecutive && currentStatus === 'review' && (
            <div className="space-y-2">
              {/* Approval Readiness Check */}
              {!meetsVoteCriteria && (
                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Approval Criteria Not Met:</strong>
                    {votes.total < minVotes &&
                      ` Need ${minVotes - votes.total} more votes.`}
                    {approvalRatio < minApprovalRatio &&
                      ` Need ${Math.round(minApprovalRatio * 100)}% approval ratio.`}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    if (meetsVoteCriteria) {
                      handleStatusChange('approved');
                    } else {
                      setShowReasonInput(true);
                    }
                  }}
                  disabled={isUpdating}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? 'Approving...' : 'Approve Idea'}
                </Button>

                <Button
                  onClick={() => {
                    setShowReasonInput(true);
                  }}
                  disabled={isUpdating}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  Reject Idea
                </Button>
              </div>
            </div>
          )}

          {/* Reason Input */}
          {showReasonInput && (
            <div className="space-y-3 rounded-md bg-gray-50 p-4">
              <Textarea
                placeholder="Provide reason for your decision (optional)..."
                value={approvalReason}
                onChange={e => setApprovalReason(e.target.value)}
                rows={3}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleStatusChange('approved')}
                  disabled={isUpdating}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve with Reason
                </Button>
                <Button
                  onClick={() => handleStatusChange('rejected')}
                  disabled={isUpdating}
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Reject with Reason
                </Button>
                <Button
                  onClick={() => {
                    setShowReasonInput(false);
                    setApprovalReason('');
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approval History */}
      {approvalHistory.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="mb-2 text-sm font-medium text-gray-900">
            Approval History
          </h4>
          <div className="space-y-2">
            {approvalHistory.map(entry => (
              <div key={entry.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {entry.status} by {entry.approvedBy.name}
                  </span>
                  <span className="text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {entry.reason && (
                  <p className="mt-1 italic text-gray-600">"{entry.reason}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
