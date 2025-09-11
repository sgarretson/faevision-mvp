import { Metadata } from 'next'
import Link from 'next/link'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up | FAEVision',
  description: 'Create your FAEVision account',
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-executive-heading text-executive-blue">FAEVision</h1>
          <p className="text-executive-body mt-2">Strategic Intelligence Platform</p>
          <h2 className="text-executive-subheading mt-6">Create your account</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-executive-blue transition-colors hover:text-executive-600"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="card-executive p-8">
          <SignupForm />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-neutral-600 transition-colors hover:text-executive-blue"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
