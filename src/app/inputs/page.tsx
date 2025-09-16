'use client';

// Force dynamic rendering to prevent build-time database calls
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input';
import {
  Plus,
  MessageSquare,
  Eye,
  Filter,
  Search,
  AlertCircle,
} from 'lucide-react';
import { InputsBulkSelection } from '@/components/inputs/inputs-bulk-selection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VoteButtons } from '@/components/inputs/vote-buttons';

interface InputItem {
  id: string;
  title: string;
  description: string;
  type: 'PROBLEM' | 'OPPORTUNITY' | 'GENERAL';
  status: 'NEW' | 'DISCUSSING' | 'ORGANIZED' | 'IN_SOLUTION' | 'ARCHIVED';
  department?: string;
  issueType?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  creator?: {
    id: string;
    name?: string;
    email: string;
    role: string;
    department?: string;
  } | null;
  _count: {
    comments: number;
    votes: number;
  };
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-800',
  DISCUSSING: 'bg-yellow-100 text-yellow-800',
  ORGANIZED: 'bg-purple-100 text-purple-800',
  IN_SOLUTION: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
};

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-red-100 text-red-800',
};

const TYPE_ICONS = {
  PROBLEM: '🚨',
  OPPORTUNITY: '💡',
  GENERAL: '💭',
};

export default function InputsPage() {
  const { data: session, status } = useSession();
  const [inputs, setInputs] = useState<InputItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchInputs = useCallback(async () => {
    // Don't fetch if not authenticated
    if (status !== 'authenticated' || !session) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);
      if (departmentFilter) params.append('department', departmentFilter);

      const response = await fetch(`/api/inputs?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch inputs');
        return;
      }

      setInputs(data.inputs || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Fetch inputs error:', error);
      setError('Failed to load inputs');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, typeFilter, departmentFilter, session, status]);

  useEffect(() => {
    fetchInputs();
  }, [fetchInputs]);

  const filteredInputs = inputs.filter(
    input =>
      !searchQuery ||
      (input.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (input.description || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle loading authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Authenticating...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to view strategic inputs.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Strategic Inputs
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              View and collaborate on strategic inputs across the organization.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/inputs/create">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create New Input
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Search inputs..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 lg:w-48"
              >
                <option value="">All Statuses</option>
                <option value="NEW">New</option>
                <option value="DISCUSSING">Discussing</option>
                <option value="ORGANIZED">Organized</option>
                <option value="IN_SOLUTION">In Solution</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 lg:w-48"
              >
                <option value="">All Types</option>
                <option value="PROBLEM">Problems</option>
                <option value="OPPORTUNITY">Opportunities</option>
                <option value="GENERAL">General</option>
              </select>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 lg:w-48"
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Strategy">Strategy</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading inputs...</p>
          </div>
        )}

        {/* Inputs List with Bulk Selection */}
        {!isLoading && <InputsBulkSelection inputs={filteredInputs} />}

        {/* Fallback for Empty State */}
        {!isLoading && filteredInputs.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="py-12 text-center">
                <Filter className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No inputs found
                </h3>
                <p className="mt-2 text-gray-600">
                  {searchQuery || statusFilter || typeFilter || departmentFilter
                    ? 'Try adjusting your filters or search query.'
                    : 'Get started by creating your first strategic input.'}
                </p>
                <div className="mt-6">
                  <Link href="/inputs/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Input
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination && pagination.hasMore && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would load more data
                console.log('Load more inputs...');
              }}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
