import { test, expect } from '@playwright/test';

test.describe('Password Protection', () => {
  test.beforeEach(async ({ context }) => {
    // Clear session storage before each test
    await context.clearCookies();
  });

  test('shows password screen on first visit', async ({ page }) => {
    await page.goto('/');

    // Should see password form
    await expect(page.getByText('Welcome to our wedding website!')).toBeVisible();
    await expect(page.getByTestId('input-password')).toBeVisible();
    await expect(page.getByTestId('button-submit-password')).toBeVisible();
  });

  test('shows error for incorrect password', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('input-password').fill('wrongpassword');
    await page.getByTestId('button-submit-password').click();

    await expect(page.getByTestId('text-password-error')).toBeVisible();
    await expect(page.getByTestId('text-password-error')).toContainText('Incorrect password');
  });

  test('allows access with correct password', async ({ page }) => {
    await page.goto('/');

    // Enter correct password (from SITE_PASSWORD env var)
    await page.getByTestId('input-password').fill(process.env.SITE_PASSWORD || 'testpassword');
    await page.getByTestId('button-submit-password').click();

    // Should see main site content (navigation, etc.)
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('remembers authentication in session', async ({ page }) => {
    await page.goto('/');

    // Authenticate
    await page.getByTestId('input-password').fill(process.env.SITE_PASSWORD || 'testpassword');
    await page.getByTestId('button-submit-password').click();
    await expect(page.getByRole('navigation')).toBeVisible();

    // Navigate away and back
    await page.goto('/rsvp');
    await page.goto('/');

    // Should still be authenticated (no password prompt)
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByTestId('input-password')).not.toBeVisible();
  });
});
