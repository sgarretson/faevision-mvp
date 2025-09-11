'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Brain, CheckCircle, Clock } from 'lucide-react'

// ============================================================================
// F6: FRD MANAGEMENT DASHBOARD - Basic Implementation
// ============================================================================

interface FRDDocument {
  id: string
  title: string
  status: string
  aiGenerated: boolean
  solution: { title: string }
  creator: { name: string }
  createdAt: string
}

export default function FRDDashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [frdDocuments, setFrdDocuments] = useState<FRDDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchFRDDocuments()
    }
  }, [session])

  const fetchFRDDocuments = async () => {
    try {
      const response = await fetch('/api/frd')
      if (response.ok) {
        const data = await response.json()
        setFrdDocuments(data.frdDocuments || [])
      }
    } catch (error) {
      console.error('Error fetching FRDs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FRD Document Management</h1>
          <p className="text-gray-600">Functional Requirements Documents</p>
        </div>
        <Button onClick={() => router.push('/frd/create')}>Create FRD</Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total FRDs</p>
                <p className="text-2xl font-bold">{frdDocuments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold">
                  {frdDocuments.filter((f) => f.status === 'PUBLISHED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Review</p>
                <p className="text-2xl font-bold">
                  {frdDocuments.filter((f) => f.status === 'REVIEW').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Generated</p>
                <p className="text-2xl font-bold">
                  {frdDocuments.filter((f) => f.aiGenerated).length}
                </p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {frdDocuments.map((frd) => (
          <Card key={frd.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{frd.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{frd.status}</Badge>
                  {frd.aiGenerated && (
                    <Badge className="bg-purple-100 text-purple-800">
                      <Brain className="mr-1 h-3 w-3" />
                      AI Generated
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-gray-600">Solution: {frd.solution.title}</p>
              <p className="text-sm text-gray-500">
                Created by {frd.creator.name} on {new Date(frd.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {frdDocuments.length === 0 && (
        <div className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">No FRD documents found</h3>
          <p className="mb-6 text-gray-600">Get started by creating your first FRD document.</p>
          <Button onClick={() => router.push('/frd/create')}>Create First FRD</Button>
        </div>
      )}
    </div>
  )
}
