import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Bypass password protection by setting session storage
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.setItem('wedding_authenticated', 'true');
    });
    await page.reload();
  });

  test('can navigate to all main pages', async ({ page }) => {
    // Home
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Our Story
    await page.goto('/story');
    await expect(page.getByRole('heading', { name: /our story/i })).toBeVisible();

    // Events
    await page.goto('/events');
    await expect(page.getByRole('heading', { name: /event schedule/i })).toBeVisible();

    // Venue
    await page.goto('/venue');
    await expect(page.getByRole('heading', { name: /venue/i })).toBeVisible();

    // RSVP
    await page.goto('/rsvp');
    await expect(page.getByRole('heading', { name: /rsvp/i })).toBeVisible();

    // Registry
    await page.goto('/registry');
    await expect(page.getByRole('heading', { name: /registry/i })).toBeVisible();

    // FAQ
    await page.goto('/faq');
    await expect(page.getByRole('heading', { name: /frequently asked questions/i })).toBeVisible();
  });

  test('navigation links work correctly', async ({ page }) => {
    await page.goto('/');

    // Click RSVP in nav (exact match to avoid "RSVP NOW" button)
    await page.getByRole('link', { name: 'RSVP', exact: true }).click();
    await expect(page).toHaveURL('/rsvp');

    // Click Registry in nav
    await page.getByRole('link', { name: 'Registry', exact: true }).click();
    await expect(page).toHaveURL('/registry');
  });
});
