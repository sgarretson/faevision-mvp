'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, Eye, Users, Clock, Target, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Solution {
  id: string
  title: string
  description: string
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  impact: 'LOW' | 'MEDIUM' | 'HIGH'
  estimatedHours?: number
  targetDate?: string
  createdAt: string
  creator: {
    id: string
    name: string
    email: string
    role: string
    department?: string
  }
  inputs: Array<{
    id: string
    title: string
    type: string
    priority: string
    department?: string
  }>
  _count: {
    tasks: number
    comments: number
  }
}

interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

const STATUS_COLORS = {
  PLANNING: 'bg-gray-100 text-gray-800',
  ACTIVE: 'bg-blue-100 text-blue-800',
  ON_HOLD: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-red-100 text-red-800',
}

const IMPACT_COLORS = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
}

const STATUS_ICONS = {
  PLANNING: '📝',
  ACTIVE: '🚀',
  ON_HOLD: '⏸️',
  COMPLETED: '✅',
  CANCELLED: '❌',
}

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [impactFilter, setImpactFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const fetchSolutions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (priorityFilter) params.append('priority', priorityFilter)
      if (impactFilter) params.append('impact', impactFilter)

      const response = await fetch(`/api/solutions?${params}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch solutions')
        return
      }

      setSolutions(data.solutions || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Fetch solutions error:', error)
      setError('Failed to load solutions')
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, priorityFilter, impactFilter])

  useEffect(() => {
    fetchSolutions()
  }, [fetchSolutions])

  const filteredSolutions = solutions.filter(
    (solution) =>
      !searchQuery ||
      solution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Solution Management</h1>
            <p className="mt-2 text-lg text-gray-600">
              Create and track solutions for strategic organizational challenges.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/solutions/create">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Solution
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
                    placeholder="Search solutions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 lg:w-48"
              >
                <option value="">All Statuses</option>
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 lg:w-48"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>

              {/* Impact Filter */}
              <select
                value={impactFilter}
                onChange={(e) => setImpactFilter(e.target.value)}
                className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 lg:w-48"
              >
                <option value="">All Impact Levels</option>
                <option value="LOW">Low Impact</option>
                <option value="MEDIUM">Medium Impact</option>
                <option value="HIGH">High Impact</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading solutions...</p>
          </div>
        )}

        {/* Solutions List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredSolutions.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="py-12 text-center">
                    <Target className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No solutions found</h3>
                    <p className="mt-2 text-gray-600">
                      {searchQuery || statusFilter || priorityFilter || impactFilter
                        ? 'Try adjusting your filters or search query.'
                        : 'Get started by creating your first solution from strategic inputs.'}
                    </p>
                    <div className="mt-6">
                      <Link href="/solutions/create">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create First Solution
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredSolutions.map((solution) => (
                <Card key={solution.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl" role="img" aria-label={solution.status}>
                            {STATUS_ICONS[solution.status]}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                              <Link href={`/solutions/${solution.id}`}>{solution.title}</Link>
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                              {solution.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Badge className={STATUS_COLORS[solution.status]}>
                            {solution.status}
                          </Badge>
                          <Badge className={PRIORITY_COLORS[solution.priority]}>
                            {solution.priority} Priority
                          </Badge>
                          <Badge className={IMPACT_COLORS[solution.impact]}>
                            {solution.impact} Impact
                          </Badge>
                          {solution.estimatedHours && (
                            <Badge variant="outline">{solution.estimatedHours}h estimated</Badge>
                          )}
                        </div>

                        {/* Connected Inputs */}
                        {solution.inputs.length > 0 && (
                          <div className="mt-3">
                            <p className="mb-1 text-xs text-gray-500">Connected Inputs:</p>
                            <div className="flex flex-wrap gap-1">
                              {solution.inputs.map((input) => (
                                <Badge key={input.id} variant="outline" className="text-xs">
                                  {input.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 text-sm text-gray-500">
                          Created by {solution.creator.name} on {formatDate(solution.createdAt)}
                          {solution.creator.department && ` • ${solution.creator.department}`}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center space-x-4 lg:ml-6 lg:mt-0">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{solution._count.tasks} tasks</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTimeAgo(solution.createdAt)}</span>
                          </div>
                        </div>

                        <Link href={`/solutions/${solution.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.hasMore && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => {
                // In a real app, this would load more data
                console.log('Load more solutions...')
              }}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
