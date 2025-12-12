/**
 * Playwright global setup - seeds database before E2E tests run.
 *
 * This ensures tests have consistent data to work with.
 * Uses the CSV seed script which has test data in scripts/guests.csv
 */

import { execSync } from 'child_process';
import 'dotenv/config';

async function globalSetup() {
  console.log('\n🌱 Seeding database for E2E tests...\n');

  try {
    // Run the CSV seed script to reset and populate the database with test data
    execSync('npm run db:seed:csv', {
      stdio: 'inherit',
      env: { ...process.env },
    });

    console.log('\n✅ Database seeded successfully\n');
  } catch (error) {
    console.error('\n❌ Failed to seed database:', error);
    throw error;
  }
}

export default globalSetup;
