'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const inputSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  type: z.enum(['PROBLEM', 'OPPORTUNITY', 'GENERAL']),
  department: z.string().optional(),
  issueType: z.enum(['PROCESS', 'TECHNOLOGY', 'COMMUNICATION', 'RESOURCE', 'OTHER']).optional(),
  rootCause: z.string().max(500, 'Root cause must be less than 500 characters').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

type InputFormData = z.infer<typeof inputSchema>

interface InputFormProps {
  onSuccess?: () => void
}

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Strategy',
  'Executive',
]

const ISSUE_TYPES = [
  { value: 'PROCESS', label: 'Process', description: 'Workflow or procedure issues' },
  { value: 'TECHNOLOGY', label: 'Technology', description: 'Technical or tool-related issues' },
  {
    value: 'COMMUNICATION',
    label: 'Communication',
    description: 'Communication or collaboration issues',
  },
  {
    value: 'RESOURCE',
    label: 'Resource',
    description: 'Resource allocation or availability issues',
  },
  { value: 'OTHER', label: 'Other', description: 'Other types of issues' },
]

export function InputForm({ onSuccess }: InputFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InputFormData>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      type: 'PROBLEM',
      priority: 'MEDIUM',
    },
  })

  const watchedType = watch('type')
  const watchedDepartment = watch('department')
  const watchedIssueType = watch('issueType')
  const watchedPriority = watch('priority')

  const onSubmit = async (data: InputFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/inputs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to create input')
        return
      }

      setSuccess(true)

      // Redirect to inputs list after success
      setTimeout(() => {
        router.push('/inputs')
        onSuccess?.()
      }, 2000)
    } catch (error) {
      console.error('Input creation error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Input Created Successfully!</span>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            Your input has been submitted and is now available for team review and collaboration.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Create New Strategic Input
        </CardTitle>
        <CardDescription>
          Submit a problem, opportunity, or general input for executive consideration and team
          collaboration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Brief, descriptive title for your input"
              className="text-lg"
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={watchedType}
              onChange={(e) =>
                setValue('type', e.target.value as 'PROBLEM' | 'OPPORTUNITY' | 'GENERAL')
              }
              className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <option value="PROBLEM">Problem - An issue that needs to be resolved</option>
              <option value="OPPORTUNITY">
                Opportunity - A potential improvement or enhancement
              </option>
              <option value="GENERAL">General - General feedback or observation</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Provide detailed description of your input. Include context, impact, and any relevant details."
              rows={6}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Strategic Tagging Section */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-lg font-semibold text-gray-900">Strategic Tagging</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Department */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Department</label>
                <select
                  value={watchedDepartment || ''}
                  onChange={(e) => setValue('department', e.target.value)}
                  className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Issue Type</label>
                <select
                  value={watchedIssueType || ''}
                  onChange={(e) =>
                    setValue(
                      'issueType',
                      e.target.value as
                        | 'PROCESS'
                        | 'TECHNOLOGY'
                        | 'COMMUNICATION'
                        | 'RESOURCE'
                        | 'OTHER'
                    )
                  }
                  className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <option value="">Select issue type</option>
                  {ISSUE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Root Cause */}
            <div className="space-y-2">
              <label htmlFor="rootCause" className="text-sm font-medium text-gray-700">
                Root Cause (Optional)
              </label>
              <Textarea
                id="rootCause"
                {...register('rootCause')}
                placeholder="Describe the underlying cause or contributing factors"
                rows={3}
                className="resize-none"
              />
              {errors.rootCause && (
                <p className="text-sm text-red-600">{errors.rootCause.message}</p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Priority Level</label>
              <select
                value={watchedPriority}
                onChange={(e) => setValue('priority', e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                className="border-input bg-background ring-offset-background focus:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <option value="LOW">Low - Minor impact, can be addressed later</option>
                <option value="MEDIUM">Medium - Moderate impact, should be addressed</option>
                <option value="HIGH">High - Significant impact, urgent attention needed</option>
              </select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating Input...' : 'Create Input'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
