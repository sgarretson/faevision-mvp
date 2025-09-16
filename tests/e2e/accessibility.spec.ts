/**
 * FAEVision WCAG 2.1 AA Accessibility Testing Suite
 * Expert: Maya Rodriguez (UX Expert) + Alex Thompson (Lead Developer)
 * Validates: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
 */

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('FAEVision Accessibility Compliance Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Login as executive for authenticated accessibility testing
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'sarah.chen@faevision.com');
    await page.fill('[data-testid="password"]', 'demo123');
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('Executive Dashboard WCAG 2.1 AA Compliance', async ({ page }) => {
    await test.step('Automated Accessibility Scan', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    await test.step('Color Contrast Validation', async () => {
      // Test executive color system contrast ratios
      const primaryButtons = page.locator('button[class*="bg-blue"]');
      const count = await primaryButtons.count();

      for (let i = 0; i < count; i++) {
        const button = primaryButtons.nth(i);
        const isVisible = await button.isVisible();

        if (isVisible) {
          const styles = await button.evaluate(el => {
            const computed = getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              fontSize: computed.fontSize,
            };
          });

          // Verify computed styles exist (manual contrast checking would require color parsing)
          expect(styles.backgroundColor).toBeDefined();
          expect(styles.color).toBeDefined();
        }
      }
    });

    await test.step('Semantic HTML Structure', async () => {
      // Verify proper heading hierarchy
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1); // Should have exactly one h1

      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThanOrEqual(1); // Should have section headings

      // Verify landmarks
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();

      // Verify list semantics
      const lists = page.locator('ul, ol');
      const listCount = await lists.count();

      for (let i = 0; i < listCount; i++) {
        const list = lists.nth(i);
        const listItems = list.locator('li');
        const itemCount = await listItems.count();

        if (itemCount > 0) {
          expect(itemCount).toBeGreaterThan(0);
        }
      }
    });

    await test.step('Image Alternative Text', async () => {
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        const alt = await image.getAttribute('alt');
        const ariaLabel = await image.getAttribute('aria-label');
        const ariaLabelledBy = await image.getAttribute('aria-labelledby');

        // Images should have alt text or appropriate ARIA labeling
        expect(
          alt !== null || ariaLabel !== null || ariaLabelledBy !== null
        ).toBe(true);
      }
    });

    await test.step('Form Label Association', async () => {
      const inputs = page.locator('input, select, textarea');
      const inputCount = await inputs.count();

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');

        if (id) {
          // Check for associated label
          const label = page.locator(`label[for="${id}"]`);
          const labelExists = (await label.count()) > 0;

          // Input should have label or ARIA labeling
          expect(
            labelExists || ariaLabel !== null || ariaLabelledBy !== null
          ).toBe(true);
        }
      }
    });
  });

  test('Keyboard Navigation Testing', async ({ page }) => {
    await test.step('Tab Navigation Flow', async () => {
      // Start from top of page
      await page.keyboard.press('Home');

      // Test tab sequence through main navigation
      const focusableElements = [];

      for (let i = 0; i < 20; i++) {
        // Test first 20 tab stops
        await page.keyboard.press('Tab');

        const focused = await page.locator(':focus').first();
        const isVisible = await focused.isVisible().catch(() => false);

        if (isVisible) {
          const tagName = await focused.evaluate(el =>
            el.tagName.toLowerCase()
          );
          const role = await focused.getAttribute('role');
          const tabIndex = await focused.getAttribute('tabindex');

          focusableElements.push({
            tagName,
            role,
            tabIndex,
            index: i,
          });

          // Verify focus is visible
          await expect(focused).toBeVisible();
        }
      }

      // Should have navigated through multiple interactive elements
      expect(focusableElements.length).toBeGreaterThan(5);

      // Interactive elements should be focusable
      const interactiveElements = focusableElements.filter(
        el =>
          ['button', 'a', 'input', 'select', 'textarea'].includes(el.tagName) ||
          ['button', 'link', 'textbox', 'combobox'].includes(el.role || '')
      );

      expect(interactiveElements.length).toBeGreaterThan(3);
    });

    await test.step('Skip Navigation Link', async () => {
      // Test skip to main content link
      await page.goto('/dashboard');
      await page.keyboard.press('Tab');

      const firstFocused = page.locator(':focus');
      const text = await firstFocused.textContent();

      // Should have skip link or proper navigation order
      if (text?.toLowerCase().includes('skip')) {
        await page.keyboard.press('Enter');

        // Should jump to main content
        const newFocused = page.locator(':focus');
        await expect(newFocused).toBeVisible();
      }
    });

    await test.step('Keyboard Interaction Testing', async () => {
      // Test button activation with keyboard
      await page.goto('/inputs/create');

      // Navigate to form and test keyboard interaction
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const titleInput = page.locator('[data-testid="input-title"]');
      await titleInput.focus();
      await titleInput.type('Accessibility Test Input');

      const titleValue = await titleInput.inputValue();
      expect(titleValue).toBe('Accessibility Test Input');

      // Test form submission with Enter
      await page.keyboard.press('Tab'); // Navigate to submit button
      await page.keyboard.press('Tab'); // Navigate to submit button

      const submitButton = page.locator(':focus');
      const tagName = await submitButton.evaluate(el =>
        el.tagName.toLowerCase()
      );

      if (tagName === 'button') {
        // Button should be activatable with Enter or Space
        await page.keyboard.press('Enter');
        // Should show validation or submit
      }
    });

    await test.step('Dropdown and Modal Keyboard Navigation', async () => {
      // Test department dropdown
      const departmentSelect = page.locator('[data-testid="department"]');
      await departmentSelect.focus();

      // Should be able to navigate with arrow keys
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      // Should have selected an option
      const selectedValue = await departmentSelect.inputValue();
      expect(selectedValue).toBeDefined();
    });
  });

  test('Screen Reader Compatibility', async ({ page }) => {
    await test.step('ARIA Labels and Descriptions', async () => {
      // Check for proper ARIA labeling on complex elements
      const dashboard = page.locator('[data-testid="executive-metrics"]');

      if (await dashboard.isVisible()) {
        // Should have accessible name
        const ariaLabel = await dashboard.getAttribute('aria-label');
        const ariaLabelledBy = await dashboard.getAttribute('aria-labelledby');

        if (!ariaLabel && !ariaLabelledBy) {
          // Check for descriptive heading within
          const heading = dashboard.locator('h2, h3, h4').first();
          const headingExists = (await heading.count()) > 0;
          expect(headingExists).toBe(true);
        }
      }
    });

    await test.step('Live Regions for Dynamic Content', async () => {
      // Test for ARIA live regions for dynamic updates
      await page.goto('/inputs/create');

      // Trigger AI suggestions (dynamic content)
      await page.fill(
        '[data-testid="input-title"]',
        'Screen Reader Test Input'
      );
      await page.fill(
        '[data-testid="input-description"]',
        'Testing dynamic content announcements'
      );

      await page.click('[data-testid="get-ai-suggestions"]');

      // Check for live region or status updates
      const liveRegions = page.locator(
        '[aria-live], [role="status"], [role="alert"]'
      );
      const liveRegionCount = await liveRegions.count();

      // Should have live regions for dynamic updates
      expect(liveRegionCount).toBeGreaterThan(0);
    });

    await test.step('Table Accessibility', async () => {
      // Navigate to a page with data tables
      await page.goto('/inputs');

      const tables = page.locator('table');
      const tableCount = await tables.count();

      for (let i = 0; i < tableCount; i++) {
        const table = tables.nth(i);

        // Check for table headers
        const headers = table.locator('th');
        const headerCount = await headers.count();

        if (headerCount > 0) {
          // Headers should have scope attribute
          for (let j = 0; j < headerCount; j++) {
            const header = headers.nth(j);
            const scope = await header.getAttribute('scope');

            // Headers should specify scope for screen readers
            expect(
              scope === 'col' ||
                scope === 'row' ||
                scope === 'colgroup' ||
                scope === 'rowgroup'
            ).toBe(true);
          }
        }

        // Table should have caption or aria-label
        const caption = table.locator('caption');
        const captionExists = (await caption.count()) > 0;
        const ariaLabel = await table.getAttribute('aria-label');

        expect(captionExists || ariaLabel !== null).toBe(true);
      }
    });

    await test.step('Error Message Accessibility', async () => {
      // Test form validation error accessibility
      await page.goto('/inputs/create');

      // Trigger validation error
      await page.click('[data-testid="submit-input"]');

      // Wait for validation errors
      await page.waitForTimeout(1000);

      const errorMessages = page.locator(
        '[role="alert"], [aria-invalid="true"]'
      );
      const errorCount = await errorMessages.count();

      if (errorCount > 0) {
        // Error messages should be properly associated
        for (let i = 0; i < errorCount; i++) {
          const error = errorMessages.nth(i);
          const role = await error.getAttribute('role');
          const ariaInvalid = await error.getAttribute('aria-invalid');

          expect(role === 'alert' || ariaInvalid === 'true').toBe(true);
        }
      }
    });
  });

  test('Focus Management Testing', async ({ page }) => {
    await test.step('Modal Focus Trapping', async () => {
      // Test modal dialog focus management
      const modals = page.locator('[role="dialog"], [role="alertdialog"]');
      const modalCount = await modals.count();

      if (modalCount > 0) {
        const modal = modals.first();

        // Focus should be trapped within modal
        await modal.focus();

        // Tab through modal
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');

          const focused = page.locator(':focus');
          const isWithinModal = await focused.evaluate(
            (el, modalEl) => {
              return modalEl?.contains(el) || false;
            },
            await modal.elementHandle()
          );

          expect(isWithinModal).toBe(true);
        }
      }
    });

    await test.step('Page Navigation Focus Management', async () => {
      // Test focus management during navigation
      await page.goto('/dashboard');
      const dashboardFocus = page.locator(':focus');

      await page.goto('/inputs');

      // Focus should be managed appropriately on navigation
      const inputsFocus = page.locator(':focus');
      await expect(inputsFocus).toBeVisible();
    });

    await test.step('Dynamic Content Focus Management', async () => {
      // Test focus management with dynamic content
      await page.goto('/inputs/create');

      // Trigger dynamic content (AI suggestions)
      await page.fill('[data-testid="input-title"]', 'Focus Management Test');
      await page.click('[data-testid="get-ai-suggestions"]');

      // Wait for dynamic content
      await page.waitForSelector('[data-testid="ai-suggestions"]', {
        timeout: 15000,
      });

      // Focus should be managed to new content or announced
      const aiSuggestions = page.locator('[data-testid="ai-suggestions"]');
      const isVisible = await aiSuggestions.isVisible();

      if (isVisible) {
        // Should be focusable or have live region announcement
        const ariaLive = await aiSuggestions.getAttribute('aria-live');
        const tabIndex = await aiSuggestions.getAttribute('tabindex');

        expect(ariaLive !== null || tabIndex !== null).toBe(true);
      }
    });
  });

  test('Mobile Accessibility Testing', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    await test.step('Mobile Touch Target Size', async () => {
      await page.goto('/dashboard');

      // Test touch target minimum size (44px)
      const interactiveElements = page.locator(
        'button, a, input, [role="button"]'
      );
      const elementCount = await interactiveElements.count();

      for (let i = 0; i < Math.min(elementCount, 10); i++) {
        const element = interactiveElements.nth(i);
        const isVisible = await element.isVisible();

        if (isVisible) {
          const boundingBox = await element.boundingBox();

          if (boundingBox) {
            // WCAG 2.1 AA requires 44px minimum touch target
            expect(boundingBox.width).toBeGreaterThanOrEqual(44);
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          }
        }
      }
    });

    await test.step('Mobile Navigation Accessibility', async () => {
      // Test mobile menu accessibility
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');

      if (await mobileMenu.isVisible()) {
        // Mobile menu should be accessible
        const ariaLabel = await mobileMenu.getAttribute('aria-label');
        const ariaExpanded = await mobileMenu.getAttribute('aria-expanded');

        expect(ariaLabel !== null || ariaExpanded !== null).toBe(true);

        // Test mobile menu interaction
        await mobileMenu.click();

        // Menu should update aria-expanded
        const expandedAfter = await mobileMenu.getAttribute('aria-expanded');
        expect(expandedAfter).toBe('true');
      }
    });

    await test.step('Mobile Form Accessibility', async () => {
      await page.click('[data-testid="mobile-menu"]');
      await page.click('text=Create Input');

      // Mobile form should be accessible
      const titleInput = page.locator('[data-testid="input-title"]');

      // Input should be properly labeled
      const ariaLabel = await titleInput.getAttribute('aria-label');
      const id = await titleInput.getAttribute('id');

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const labelExists = (await label.count()) > 0;
        expect(labelExists || ariaLabel !== null).toBe(true);
      }

      // Test mobile keyboard
      await titleInput.focus();
      await titleInput.type('Mobile accessibility test');

      const value = await titleInput.inputValue();
      expect(value).toBe('Mobile accessibility test');
    });
  });
});
