import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_STORAGE_STATE = join(__dirname, 'tests/e2e/.auth/site.json');
const ADMIN_STORAGE_STATE = join(__dirname, 'tests/e2e/.auth/admin.json');

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  // Seed database before running tests
  globalSetup: './tests/e2e/global-setup.ts',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    // Setup project - authenticates and saves state
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    // Main tests - use site auth storage state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: SITE_STORAGE_STATE,
      },
      testIgnore: /admin\.spec\.ts|admin-api\.spec\.ts|auth\.setup\.ts/,
      dependencies: ['setup'],
    },
    // Admin tests - use admin auth storage state
    {
      name: 'admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: ADMIN_STORAGE_STATE,
      },
      testMatch: /admin\.spec\.ts|admin-api\.spec\.ts/,
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
