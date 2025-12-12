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

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test';
const STORAGE_STATE_DIR = join(__dirname, '.auth');

export const ADMIN_STORAGE_STATE = join(STORAGE_STATE_DIR, 'admin.json');

setup('authenticate as admin', async ({ page }) => {
  // Bypass site password
  await page.goto('/');
  await page.evaluate(() => {
    sessionStorage.setItem('wedding_authenticated', 'true');
  });

  // Go to admin login
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();

  // Login
  await page.getByLabel('Password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  // Wait for successful login
  await expect(page.getByRole('heading', { name: 'Wedding Admin' })).toBeVisible();

  // Save authentication state
  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});
