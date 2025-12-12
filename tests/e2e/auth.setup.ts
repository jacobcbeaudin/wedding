/**
 * Playwright authentication setup.
 *
 * This file creates authenticated states that can be reused by tests.
 * This avoids hitting rate limits by logging in only once.
 */

import { test as setup, expect } from '@playwright/test';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_PASSWORD = process.env.SITE_PASSWORD || 'test';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test';
const STORAGE_STATE_DIR = join(__dirname, '.auth');

export const SITE_STORAGE_STATE = join(STORAGE_STATE_DIR, 'site.json');
export const ADMIN_STORAGE_STATE = join(STORAGE_STATE_DIR, 'admin.json');

setup('authenticate as site user', async ({ page }) => {
  // Authenticate with site password via API
  await page.request.post('/api/auth/login', {
    data: { password: SITE_PASSWORD },
  });

  // Navigate to verify auth works
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Save site authentication state
  await page.context().storageState({ path: SITE_STORAGE_STATE });
});

setup('authenticate as admin', async ({ page }) => {
  // Authenticate with site password via API (needed for cookie)
  await page.request.post('/api/auth/login', {
    data: { password: SITE_PASSWORD },
  });

  // Go to admin login
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();

  // Login
  await page.getByLabel('Password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for successful login
  await expect(page.getByRole('heading', { name: 'Wedding Admin' })).toBeVisible();

  // Save authentication state (includes both site and admin cookies)
  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});
