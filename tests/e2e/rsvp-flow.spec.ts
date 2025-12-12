import { test, expect } from '@playwright/test';

/**
 * Comprehensive RSVP flow E2E tests.
 *
 * Uses test data from scripts/guests.csv:
 * - Robert Beaudin (Mom & Dad Beaudin) - allEvents (tea-ceremony, welcome-party, wedding)
 * - Mike Jones (Mike & Sarah Jones) - welcomeAndWedding
 * - Alex Kim (single guest) - welcomeAndWedding
 *
 * Note: Tests use role-based and text-based selectors instead of data-testid
 * for dynamic elements (meal buttons, dietary inputs) since those use UUIDs.
 */

test.describe('RSVP Complete Flow', () => {
  // Run serially to avoid race conditions with parallel DB access
  test.describe.configure({ mode: 'serial' });

  // Auth handled via storage state from setup

  test.describe('Guest Lookup', () => {
    test('finds guest by exact name', async ({ page }) => {
      await page.goto('/rsvp');

      await page.getByTestId('input-first-name').fill('Robert');
      await page.getByTestId('input-last-name').fill('Beaudin');
      await page.getByTestId('button-lookup-guest').click();

      // Should show party RSVP form - use heading for specificity
      await expect(page.getByRole('heading', { name: 'Welcome, Mom & Dad Beaudin' })).toBeVisible();
    });

    test('finds guest case-insensitively', async ({ page }) => {
      await page.goto('/rsvp');

      await page.getByTestId('input-first-name').fill('ROBERT');
      await page.getByTestId('input-last-name').fill('beaudin');
      await page.getByTestId('button-lookup-guest').click();

      await expect(page.getByRole('heading', { name: 'Welcome, Mom & Dad Beaudin' })).toBeVisible();
    });

    test('shows error for non-existent guest', async ({ page }) => {
      await page.goto('/rsvp');

      await page.getByTestId('input-first-name').fill('Nobody');
      await page.getByTestId('input-last-name').fill('Here');
      await page.getByTestId('button-lookup-guest').click();

      await expect(page.getByText(/couldn't find/i)).toBeVisible();
    });
  });

  test.describe('RSVP Submission', () => {
    test('submits RSVP with declined status for single guest', async ({ page }) => {
      await page.goto('/rsvp');

      await page.getByTestId('input-first-name').fill('Alex');
      await page.getByTestId('input-last-name').fill('Kim');
      await page.getByTestId('button-lookup-guest').click();

      // Should show party welcome heading
      await expect(page.getByRole('heading', { name: /Welcome, Alex Kim/i })).toBeVisible();

      // Decline all events using button role
      const declineButtons = page.getByRole('button', { name: 'Regretfully Decline' });
      const count = await declineButtons.count();
      for (let i = 0; i < count; i++) {
        await declineButtons.nth(i).click();
      }

      // Submit
      await page.getByTestId('button-submit-rsvp').click();

      // Should show confirmation
      await expect(page.getByRole('heading', { name: /RSVP is Confirmed/i })).toBeVisible();
    });

    test('shows family members correctly', async ({ page }) => {
      await page.goto('/rsvp');

      await page.getByTestId('input-first-name').fill('Tom');
      await page.getByTestId('input-last-name').fill('Johnson');
      await page.getByTestId('button-lookup-guest').click();

      // Should show family welcome heading
      await expect(
        page.getByRole('heading', { name: /Welcome, The Johnson Family/i })
      ).toBeVisible();
      // Guest names appear in multiple places - check the guest tags area
      const guestTags = page.locator('.flex.flex-wrap.gap-2');
      await expect(guestTags.getByText('Tom Johnson')).toBeVisible();
      await expect(guestTags.getByText('Lisa Johnson')).toBeVisible();
      await expect(guestTags.getByText('Emma Johnson')).toBeVisible();
      await expect(guestTags.getByText('Oliver Johnson')).toBeVisible();
    });

    test('shows meal selection when attending wedding', async ({ page }) => {
      await page.goto('/rsvp');

      await page.getByTestId('input-first-name').fill('Jordan');
      await page.getByTestId('input-last-name').fill('Taylor');
      await page.getByTestId('button-lookup-guest').click();

      await expect(page.getByRole('heading', { name: /Welcome, Jordan Taylor/i })).toBeVisible();

      // Accept all events
      const acceptButtons = page.getByRole('button', { name: 'Joyfully Accept' });
      const count = await acceptButtons.count();
      for (let i = 0; i < count; i++) {
        await acceptButtons.nth(i).click();
      }

      // Should see meal selection (Fish, Beef, Vegetarian buttons)
      await expect(page.getByRole('button', { name: 'Fish' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Beef' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Vegetarian' })).toBeVisible();

      // Select a meal
      await page.getByRole('button', { name: 'Fish' }).click();

      // Submit
      await page.getByTestId('button-submit-rsvp').click();
      await expect(page.getByRole('heading', { name: /RSVP is Confirmed/i })).toBeVisible();
    });
  });

  test.describe('Song Requests', () => {
    test('can add song requests', async ({ page }) => {
      await page.goto('/rsvp');

      await page.getByTestId('input-first-name').fill('Chris');
      await page.getByTestId('input-last-name').fill('Anderson');
      await page.getByTestId('button-lookup-guest').click();

      // Wait for form to load
      await expect(page.getByRole('heading', { name: /Welcome, Chris Anderson/i })).toBeVisible();

      // Decline events (to avoid meal selection complexity)
      const declineButtons = page.getByRole('button', { name: 'Regretfully Decline' });
      const count = await declineButtons.count();
      for (let i = 0; i < count; i++) {
        await declineButtons.nth(i).click();
      }

      // Add first song
      await page.getByTestId('input-song-0').fill('Bohemian Rhapsody');
      await page.getByTestId('input-artist-0').fill('Queen');

      // Add second song
      await page.getByRole('button', { name: '+ Add Another Song' }).click();
      await page.getByTestId('input-song-1').fill('Sweet Caroline');

      // Submit
      await page.getByTestId('button-submit-rsvp').click();
      await expect(page.getByRole('heading', { name: /RSVP is Confirmed/i })).toBeVisible();
    });
  });

  test.describe('Edit Flow', () => {
    test('can edit existing RSVP', async ({ page }) => {
      await page.goto('/rsvp');

      // First submission
      await page.getByTestId('input-first-name').fill('Rachel');
      await page.getByTestId('input-last-name').fill('Green');
      await page.getByTestId('button-lookup-guest').click();

      // Wait for form to load
      await expect(page.getByRole('heading', { name: /Welcome, Rachel Green/i })).toBeVisible();

      // Decline all events first
      const declineButtons = page.getByRole('button', { name: 'Regretfully Decline' });
      const declineCount = await declineButtons.count();
      for (let i = 0; i < declineCount; i++) {
        await declineButtons.nth(i).click();
      }

      await page.getByTestId('button-submit-rsvp').click();
      await expect(page.getByRole('heading', { name: /RSVP is Confirmed/i })).toBeVisible();

      // Click edit button
      await page.getByTestId('button-edit-rsvp').click();

      // Should be back to form
      await expect(page.getByRole('heading', { name: /Welcome, Rachel Green/i })).toBeVisible();
      await expect(page.getByTestId('button-submit-rsvp')).toBeVisible();
    });
  });

  test.describe('Validation', () => {
    test('shows validation error without selections', async ({ page }) => {
      await page.goto('/rsvp');

      await page.getByTestId('input-first-name').fill('David');
      await page.getByTestId('input-last-name').fill('Chen');
      await page.getByTestId('button-lookup-guest').click();

      await expect(
        page.getByRole('heading', { name: /Welcome, David & Emily Chen/i })
      ).toBeVisible();

      // Click submit without selecting any options - should show error
      await page.getByTestId('button-submit-rsvp').click();
      await expect(page.getByText(/Please select a response/i)).toBeVisible();
    });
  });
});
