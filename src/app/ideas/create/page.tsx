'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ManualIdeaForm } from '@/components/ideas/manual-idea-form';
import { ArrowLeft, Lightbulb, AlertCircle, Sparkles } from 'lucide-react';

/**
 * Manual Idea Creation Page
 *
 * Executive-friendly interface for creating strategic ideas manually.
 * Features AI enhancement suggestions and strategic context capture.
 *
 * Expert: Maya Rodriguez (UX Expert)
 * Support: Alex Thompson (Lead Developer), David Chen (Visual Designer)
 */

export default function CreateIdeaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleIdeaSubmitted = (ideaId: string) => {
    setSuccess('Idea created successfully!');
    // Redirect to the idea detail page after a brief delay
    setTimeout(() => {
      router.push(`/ideas/${ideaId}`);
    }, 1500);
  };

  const handleSubmissionStart = () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
  };

  const handleSubmissionError = (error: string) => {
    setError(error);
    setIsSubmitting(false);
  };

  // Handle loading authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please log in to create ideas.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Only executives can manually create ideas
  if (session?.user?.role !== 'EXECUTIVE' && session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/ideas">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Ideas
              </Button>
            </Link>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Only executives can manually create strategic ideas. Contact your
              administrator for access.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <Link href="/ideas">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Ideas
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-purple-100 to-blue-100 p-3">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Create Strategic Idea
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Capture innovative thinking and strategic opportunities with AI
              enhancement
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <Alert className="mb-6">
            <Sparkles className="h-4 w-4" />
            <AlertDescription className="font-medium text-green-800">
              {success} Redirecting to idea details...
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* AI Enhancement Notice */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  AI Enhancement Available
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Our AI will provide real-time suggestions for tagging,
                  categorization, and similar existing ideas to help strengthen
                  your strategic thinking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Idea Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>Strategic Idea Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ManualIdeaForm
              onSubmissionStart={handleSubmissionStart}
              onSubmissionError={handleSubmissionError}
              onIdeaCreated={handleIdeaSubmitted}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* Process Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                  1
                </div>
                <span className="text-sm text-gray-700">
                  Your idea will be enhanced with AI suggestions and saved as a
                  draft
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                  2
                </div>
                <span className="text-sm text-gray-700">
                  Team members can collaborate through voting and commenting
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                  3
                </div>
                <span className="text-sm text-gray-700">
                  Once approved, it can be converted into a comprehensive
                  solution
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
