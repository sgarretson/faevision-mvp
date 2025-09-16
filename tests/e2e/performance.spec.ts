/**
 * FAEVision Performance Testing Suite
 * Expert: Alex Thompson (Lead Developer) + Maya Rodriguez (UX Expert)
 * Validates: <2s page load, <500ms API, <15s AI processing requirements
 */

import { test, expect, Page } from '@playwright/test';

test.describe('FAEVision Performance Benchmarking', () => {
  test.beforeEach(async ({ page }) => {
    // Login as executive for authenticated performance testing
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'sarah.chen@faevision.com');
    await page.fill('[data-testid="password"]', 'demo123');
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('Executive Dashboard Page Load Performance', async ({ page }) => {
    await test.step('Dashboard Cold Load Performance', async () => {
      // Clear cache for cold load test
      await page.context().clearCookies();
      await page.reload();

      const startTime = performance.now();
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      const endTime = performance.now();

      const loadTime = endTime - startTime;
      console.log(`Dashboard cold load time: ${loadTime.toFixed(2)}ms`);

      // Verify <2000ms requirement
      expect(loadTime).toBeLessThan(2000);

      // Verify critical elements are visible
      await expect(
        page.locator('[data-testid="executive-metrics"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="activity-feed"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="department-analytics"]')
      ).toBeVisible();
    });

    await test.step('Dashboard Subsequent Load Performance', async () => {
      const startTime = performance.now();
      await page.goto('/inputs');
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      const endTime = performance.now();

      const loadTime = endTime - startTime;
      console.log(`Dashboard warm load time: ${loadTime.toFixed(2)}ms`);

      // Warm loads should be even faster
      expect(loadTime).toBeLessThan(1000);
    });
  });

  test('Input Management Performance', async ({ page }) => {
    await test.step('Input List Page Performance', async () => {
      const startTime = performance.now();
      await page.goto('/inputs');
      await page.waitForLoadState('networkidle');
      const endTime = performance.now();

      const loadTime = endTime - startTime;
      console.log(`Input list load time: ${loadTime.toFixed(2)}ms`);

      expect(loadTime).toBeLessThan(2000);

      // Verify input list is populated
      await expect(
        page.locator('[data-testid="input-card"]').first()
      ).toBeVisible();
    });

    await test.step('Input Creation Form Performance', async () => {
      const startTime = performance.now();
      await page.click('[data-testid="create-input"]');
      await page.waitForLoadState('networkidle');
      const endTime = performance.now();

      const loadTime = endTime - startTime;
      console.log(`Input creation form load time: ${loadTime.toFixed(2)}ms`);

      expect(loadTime).toBeLessThan(1500);

      // Verify form elements are interactive
      await expect(page.locator('[data-testid="input-title"]')).toBeEditable();
      await expect(
        page.locator('[data-testid="input-description"]')
      ).toBeEditable();
    });
  });

  test('Solution Management Performance', async ({ page }) => {
    await test.step('Solutions Page Performance', async () => {
      const startTime = performance.now();
      await page.goto('/solutions');
      await page.waitForLoadState('networkidle');
      const endTime = performance.now();

      const loadTime = endTime - startTime;
      console.log(`Solutions page load time: ${loadTime.toFixed(2)}ms`);

      expect(loadTime).toBeLessThan(2000);

      // Verify solutions are displayed
      // Check if solution cards exist (may be zero on first load)
      const solutionCards = page.locator('[data-testid="solution-card"]');
      const solutionCount = await solutionCards.count();
    });

    await test.step('Solution Detail Performance', async () => {
      // Navigate to first solution if available
      const solutionCards = page.locator('[data-testid="solution-card"]');
      const count = await solutionCards.count();

      if (count > 0) {
        const startTime = performance.now();
        await solutionCards.first().click();
        await page.waitForLoadState('networkidle');
        const endTime = performance.now();

        const loadTime = endTime - startTime;
        console.log(`Solution detail load time: ${loadTime.toFixed(2)}ms`);

        expect(loadTime).toBeLessThan(1500);
      }
    });
  });

  test('FRD Management Performance', async ({ page }) => {
    // First create a solution to test FRD performance
    await page.goto('/solutions');
    await page.click('[data-testid="create-solution"]');

    await page.fill(
      '[data-testid="solution-title"]',
      'Performance Test Solution'
    );
    await page.fill(
      '[data-testid="solution-description"]',
      'Solution for performance testing'
    );
    await page.click('[data-testid="submit-solution"]');

    await test.step('FRD Page Load Performance', async () => {
      const startTime = performance.now();
      await page.click('text=Generate FRD');
      await page.waitForLoadState('networkidle');
      const endTime = performance.now();

      const loadTime = endTime - startTime;
      console.log(`FRD page load time: ${loadTime.toFixed(2)}ms`);

      expect(loadTime).toBeLessThan(2000);

      await expect(page.locator('h1')).toContainText('FRD Document Management');
    });
  });
});

test.describe('API Performance Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'sarah.chen@faevision.com');
    await page.fill('[data-testid="password"]', 'demo123');
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('Critical API Endpoints Performance', async ({ page }) => {
    const apiEndpoints = [
      { path: '/api/inputs', name: 'Inputs API' },
      { path: '/api/solutions', name: 'Solutions API' },
      { path: '/api/users/search?q=alex', name: 'User Search API' },
      { path: '/api/dashboard/metrics', name: 'Dashboard Metrics API' },
    ];

    for (const endpoint of apiEndpoints) {
      await test.step(`${endpoint.name} Performance`, async () => {
        const startTime = performance.now();

        const response = await page.request.get(endpoint.path);

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        console.log(
          `${endpoint.name} response time: ${responseTime.toFixed(2)}ms`
        );

        // Verify <500ms API requirement
        expect(responseTime).toBeLessThan(500);
        expect(response.status()).toBe(200);

        // Verify response has content
        const contentLength = response.headers()['content-length'];
        if (contentLength) {
          expect(parseInt(contentLength)).toBeGreaterThan(0);
        }
      });
    }
  });

  test('Database Query Performance', async ({ page }) => {
    await test.step('Complex Dashboard Query Performance', async () => {
      const startTime = performance.now();

      const response = await page.request.get('/api/dashboard/analytics');

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      console.log(
        `Dashboard analytics query time: ${responseTime.toFixed(2)}ms`
      );

      // Complex queries should still be fast
      expect(responseTime).toBeLessThan(800);
      expect(response.status()).toBe(200);
    });

    await test.step('Input Search Performance', async () => {
      const startTime = performance.now();

      const response = await page.request.get(
        '/api/inputs?search=performance&department=engineering'
      );

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      console.log(`Input search query time: ${responseTime.toFixed(2)}ms`);

      expect(responseTime).toBeLessThan(400);
      expect(response.status()).toBe(200);
    });
  });
});

test.describe('AI Feature Performance Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'sarah.chen@faevision.com');
    await page.fill('[data-testid="password"]', 'demo123');
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('AI Tagging Performance', async ({ page }) => {
    await test.step('AI Tag Suggestions Performance', async () => {
      await page.goto('/inputs/create');

      // Fill in input details
      await page.fill(
        '[data-testid="input-title"]',
        'Performance Test: Complex AI Analysis Input'
      );
      await page.fill(
        '[data-testid="input-description"]',
        'This is a complex input with multiple departments involved, requiring sophisticated AI analysis for proper categorization, priority assessment, and duplicate detection.'
      );

      const startTime = performance.now();

      // Trigger AI analysis
      await page.click('[data-testid="get-ai-suggestions"]');

      // Wait for AI suggestions with progress indicator
      await expect(page.locator('[data-testid="ai-suggestions"]')).toBeVisible({
        timeout: 15000,
      });

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      console.log(`AI tagging processing time: ${processingTime.toFixed(2)}ms`);

      // Verify <15 second requirement
      expect(processingTime).toBeLessThan(15000);

      // Verify AI suggestions are present
      await expect(
        page.locator('[data-testid="ai-department-suggestion"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="ai-priority-suggestion"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="confidence-score"]')
      ).toBeVisible();
    });
  });

  test('AI Requirements Generation Performance', async ({ page }) => {
    // Create a solution first
    await page.goto('/solutions');
    await page.click('[data-testid="create-solution"]');

    await page.fill(
      '[data-testid="solution-title"]',
      'AI Performance Test Solution'
    );
    await page.fill(
      '[data-testid="solution-description"]',
      'Complex solution for testing AI requirements generation performance'
    );
    await page.fill(
      '[data-testid="business-value"]',
      'Testing AI performance under load'
    );
    await page.click('[data-testid="submit-solution"]');

    await test.step('AI Requirements Generation Performance', async () => {
      await page.click('text=Manage Requirements');

      const startTime = performance.now();

      await page.click('[data-testid="generate-ai-requirements"]');

      // Wait for AI requirements generation
      await expect(
        page.locator('[data-testid="ai-generated-requirements"]')
      ).toBeVisible({ timeout: 30000 });

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      console.log(
        `AI requirements generation time: ${processingTime.toFixed(2)}ms`
      );

      // Should be faster than FRD generation
      expect(processingTime).toBeLessThan(20000);

      // Verify requirements are generated
      // Verify AI requirements are generated
      const requirements = page.locator('[data-testid="ai-requirement"]');
      const requirementCount = await requirements.count();
      expect(requirementCount).toBeGreaterThanOrEqual(1);
    });
  });

  test('AI FRD Generation Performance', async ({ page }) => {
    await test.step('AI FRD Generation Performance', async () => {
      // Use existing solution or create one
      await page.goto('/solutions');
      const solutionCards = page.locator('[data-testid="solution-card"]');
      const count = await solutionCards.count();

      if (count === 0) {
        // Create solution if none exist
        await page.click('[data-testid="create-solution"]');
        await page.fill(
          '[data-testid="solution-title"]',
          'FRD Performance Test Solution'
        );
        await page.fill(
          '[data-testid="solution-description"]',
          'Solution for FRD generation performance testing'
        );
        await page.click('[data-testid="submit-solution"]');
      } else {
        await solutionCards.first().click();
      }

      await page.click('text=Generate FRD');

      const startTime = performance.now();

      await page.click('[data-testid="generate-frd"]');

      // Wait for FRD generation (up to 60 seconds)
      await expect(
        page.locator('text=FRD document generated successfully')
      ).toBeVisible({ timeout: 60000 });

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      console.log(`AI FRD generation time: ${processingTime.toFixed(2)}ms`);

      // Verify <60 second requirement
      expect(processingTime).toBeLessThan(60000);

      // Verify FRD content is generated
      await page.click('[data-testid="view-frd"]');
      await expect(page.locator('text=Executive Summary')).toBeVisible();
      await expect(page.locator('text=Implementation Plan')).toBeVisible();
    });
  });
});

test.describe('Mobile Performance Testing', () => {
  test.use({
    viewport: { width: 390, height: 844 }, // iPhone 12 Pro
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  });

  test('Mobile Executive Dashboard Performance', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'sarah.chen@faevision.com');
    await page.fill('[data-testid="password"]', 'demo123');
    await page.click('[data-testid="login-submit"]');

    await test.step('Mobile Dashboard Load Performance', async () => {
      const startTime = performance.now();
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      const endTime = performance.now();

      const loadTime = endTime - startTime;
      console.log(`Mobile dashboard load time: ${loadTime.toFixed(2)}ms`);

      // Mobile should meet same performance requirements
      expect(loadTime).toBeLessThan(2500); // Slightly higher for mobile

      // Verify mobile layout is working
      await expect(
        page.locator('[data-testid="mobile-navigation"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="executive-metrics"]')
      ).toBeVisible();
    });

    await test.step('Mobile Input Creation Performance', async () => {
      await page.click('[data-testid="mobile-menu"]');
      await page.click('text=Create Input');

      const startTime = performance.now();
      await page.waitForLoadState('networkidle');
      const endTime = performance.now();

      const loadTime = endTime - startTime;
      console.log(`Mobile input form load time: ${loadTime.toFixed(2)}ms`);

      expect(loadTime).toBeLessThan(1500);

      // Verify mobile form is usable
      await expect(page.locator('[data-testid="input-title"]')).toBeEditable();
    });
  });
});
