import { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up | FAEVision',
  description: 'Create your FAEVision account',
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600">FAEVision</h1>
          <p className="mt-2 text-base text-neutral-700">
            Strategic Intelligence Platform
          </p>
          <h2 className="mt-6 text-lg font-semibold text-neutral-800">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
          <SignupForm />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-neutral-600 transition-colors hover:text-blue-600"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
