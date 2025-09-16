import { defineConfig, devices } from '@playwright/test';

/**
 * FAEVision E2E Testing Configuration
 * Expert: Alex Thompson (Lead Developer)
 * Features: Executive workflow testing, performance benchmarking, accessibility validation
 */

export default defineConfig({
  testDir: './tests/e2e',

  // Test execution configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Test timeouts
  timeout: 30000, // 30 seconds default
  expect: { timeout: 5000 }, // 5 seconds for assertions

  // Reporting
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['github'], // GitHub Actions integration
  ],

  outputDir: 'test-results/',

  // Global test configuration
  use: {
    // Base URL for all tests
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Browser configuration
    trace: 'on-first-retry', // Capture trace for debugging
    screenshot: 'only-on-failure', // Screenshots for failed tests
    video: 'retain-on-failure', // Video recording for failures

    // Executive-focused testing settings
    actionTimeout: 10000, // 10 seconds for actions
    navigationTimeout: 15000, // 15 seconds for navigation

    // Performance testing settings
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  // Test projects for different environments and devices
  projects: [
    // Desktop Executive Testing
    {
      name: 'Desktop Chrome - Executive Workflow',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }, // Executive desktop setup
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write'], // For copy/paste testing
        },
      },
    },

    {
      name: 'Desktop Safari - Executive Workflow',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'Desktop Firefox - Executive Workflow',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile Executive Testing
    {
      name: 'Mobile Chrome - Executive Mobile',
      use: {
        ...devices['Pixel 5'],
        contextOptions: {
          geolocation: { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
          permissions: ['geolocation'],
        },
      },
    },

    {
      name: 'Mobile Safari - Executive Mobile',
      use: { ...devices['iPhone 12'] },
    },

    // Tablet Executive Testing
    {
      name: 'Tablet - Executive Tablet',
      use: { ...devices['iPad Pro'] },
    },

    // Performance Testing Project
    {
      name: 'Performance Testing',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--enable-features=NetworkService',
            '--enable-network-service',
            '--force-device-scale-factor=1',
          ],
        },
      },
      testMatch: '**/performance.spec.ts',
    },

    // Accessibility Testing Project
    {
      name: 'Accessibility Testing',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: {
          reducedMotion: 'reduce', // Test with reduced motion
          forcedColors: 'none',
        },
      },
      testMatch: '**/accessibility.spec.ts',
    },
  ],

  // Development server setup
  webServer: {
    command: process.env.CI ? 'npm run build && npm run start' : 'npm run dev',
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes for server startup
    env: {
      NODE_ENV: 'test',
      DATABASE_URL:
        process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || '',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'test-secret',
      NEXTAUTH_URL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    },
  },

  // Global setup and teardown
  globalSetup: require.resolve('./tests/setup/global-setup.ts'),
  globalTeardown: require.resolve('./tests/setup/global-teardown.ts'),
});
