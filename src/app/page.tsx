import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAEVision | Strategic Intelligence Platform',
  description: 'Internal MVP for architecture and engineering firm operational excellence',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Hero Section */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="mb-6 text-balance text-6xl font-bold text-white">FAEVision</h1>
              <div className="mb-4 text-xl text-blue-100">Strategic Intelligence Platform</div>
              <div className="mx-auto max-w-3xl text-lg text-blue-200">
                Empowering architecture and engineering firms with collaborative strategic
                intelligence, executive decision-making tools, and operational excellence insights.
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mb-12 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-white">50+</div>
                <div className="text-blue-200">Executive Users</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-white">F1-F6</div>
                <div className="text-blue-200">Core Features</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-white">11-Week</div>
                <div className="text-blue-200">MVP Delivery</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                Executive Dashboard
              </Link>
              <Link
                href="/inputs"
                className="inline-flex items-center justify-center rounded-lg border border-white bg-transparent px-6 py-3 font-medium text-white transition-colors hover:bg-white hover:text-blue-600"
              >
                Strategic Inputs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-2xl font-bold text-neutral-900">Core Features Delivered</h2>
            <p className="mx-auto max-w-2xl text-base text-neutral-700">
              Sprint 1 MVP delivers three critical features for executive strategic intelligence
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* F1 Input Capture */}
            <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="mb-4 text-4xl">📝</div>
              <h3 className="mb-4 text-lg font-semibold text-neutral-800">F1: Input Capture</h3>
              <p className="mb-6 text-base text-neutral-700">
                Strategic input creation with comprehensive tagging, priority management, and
                executive-optimized workflows for operational insights.
              </p>
              <Link href="/inputs/create" className="inline-flex items-center justify-center rounded-lg border border-blue-500 bg-white px-6 py-3 font-medium text-blue-500 transition-colors hover:bg-blue-50">
                Create Input
              </Link>
            </div>

            {/* F2 Collaboration */}
            <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="mb-4 text-4xl">🗳️</div>
              <h3 className="mb-4 text-lg font-semibold text-neutral-800">F2: Collaboration</h3>
              <p className="mb-6 text-base text-neutral-700">
                Real-time voting, threaded commenting, @mentions, and activity feeds for executive
                team collaboration and consensus building.
              </p>
              <Link href="/inputs" className="inline-flex items-center justify-center rounded-lg border border-blue-500 bg-white px-6 py-3 font-medium text-blue-500 transition-colors hover:bg-blue-50">
                View Collaboration
              </Link>
            </div>

            {/* F3 Organization */}
            <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="mb-4 text-4xl">📊</div>
              <h3 className="mb-4 text-lg font-semibold text-neutral-800">F3: Organization</h3>
              <p className="mb-6 text-base text-neutral-700">
                Executive dashboard with comprehensive analytics, pattern recognition, and
                data-driven decision support for strategic oversight.
              </p>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-lg border border-blue-500 bg-white px-6 py-3 font-medium text-blue-500 transition-colors hover:bg-blue-50">
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Value Proposition */}
      <div className="bg-neutral-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-neutral-900">Built for Executive Excellence</h2>
              <div className="space-y-4 text-base text-neutral-700">
                <div className="flex items-start gap-3">
                  <div className="font-bold text-green-600">✓</div>
                  <div>
                    <strong>Strategic Intelligence:</strong> Comprehensive analytics and insights
                    for data-driven executive decision-making
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="font-bold text-green-600">✓</div>
                  <div>
                    <strong>Real-time Collaboration:</strong> Advanced voting, commenting, and team
                    engagement tools for consensus building
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="font-bold text-green-600">✓</div>
                  <div>
                    <strong>Mobile Executive:</strong> Responsive design optimized for executive
                    mobility and meeting-friendly workflows
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="font-bold text-green-600">✓</div>
                  <div>
                    <strong>Professional Security:</strong> Role-based access control and
                    enterprise-grade authentication systems
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-lg font-semibold text-neutral-800">Executive Demo Access</h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 text-sm font-medium text-neutral-600">Executive Account</div>
                  <div className="text-sm text-neutral-800">sarah.executive@faevision.com</div>
                </div>
                <div>
                  <div className="mb-1 text-sm font-medium text-neutral-600">Admin Account</div>
                  <div className="text-sm text-neutral-800">admin@faevision.com</div>
                </div>
                <div className="pt-4">
                  <Link href="/login" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
                    Executive Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
