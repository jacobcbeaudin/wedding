import { test, expect } from '@playwright/test';

test.describe('RSVP Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.setItem('wedding_authenticated', 'true');
    });
    await page.goto('/rsvp');
  });

  test('shows guest lookup form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Find Your Invitation' })).toBeVisible();
    await expect(page.getByTestId('input-first-name')).toBeVisible();
    await expect(page.getByTestId('input-last-name')).toBeVisible();
    await expect(page.getByTestId('button-lookup-guest')).toBeVisible();
  });

  test('lookup button is disabled without name', async ({ page }) => {
    await expect(page.getByTestId('button-lookup-guest')).toBeDisabled();

    // Fill only first name
    await page.getByTestId('input-first-name').fill('John');
    await expect(page.getByTestId('button-lookup-guest')).toBeDisabled();

    // Fill only last name
    await page.getByTestId('input-first-name').clear();
    await page.getByTestId('input-last-name').fill('Smith');
    await expect(page.getByTestId('button-lookup-guest')).toBeDisabled();

    // Fill both - should be enabled
    await page.getByTestId('input-first-name').fill('John');
    await expect(page.getByTestId('button-lookup-guest')).toBeEnabled();
  });

  test('shows error for guest not found', async ({ page }) => {
    await page.getByTestId('input-first-name').fill('Nonexistent');
    await page.getByTestId('input-last-name').fill('Person');
    await page.getByTestId('button-lookup-guest').click();

    // Should show error message
    await expect(page.getByText(/couldn't find/i)).toBeVisible();
  });

  test('shows contact info for help', async ({ page }) => {
    await expect(page.getByText(/Can't find your invitation/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /wedding@/i })).toBeVisible();
  });
});
