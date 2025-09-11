import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | FAEVision',
  description: 'Sign in to your FAEVision account',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-executive-heading text-executive-blue">FAEVision</h1>
          <p className="text-executive-body mt-2">Strategic Intelligence Platform</p>
          <h2 className="text-executive-subheading mt-6">Sign in to your account</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-executive-blue transition-colors hover:text-executive-600"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="card-executive p-8">
          <LoginForm />
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
