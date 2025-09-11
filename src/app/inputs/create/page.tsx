import { Suspense } from 'react'
import { InputForm } from '@/components/inputs/input-form'

export default function CreateInputPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Strategic Input Creation</h1>
          <p className="mt-2 text-lg text-gray-600">
            Create a new strategic input for executive consideration and team collaboration.
          </p>
        </div>

        <Suspense fallback={<div className="py-12 text-center">Loading...</div>}>
          <InputForm />
        </Suspense>
      </div>
    </div>
  )
}
