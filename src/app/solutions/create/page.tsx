import { Suspense } from 'react'
import { SolutionForm } from '@/components/solutions/solution-form'

export default function CreateSolutionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Strategic Solution</h1>
          <p className="mt-2 text-lg text-gray-600">
            Transform strategic inputs into actionable solutions with clear execution plans.
          </p>
        </div>

        <Suspense fallback={<div className="py-12 text-center">Loading...</div>}>
          <SolutionForm />
        </Suspense>
      </div>
    </div>
  )
}
