/**
 * Seed script that imports guests from CSV.
 *
 * Run with: npm run db:seed:csv
 *
 * CSV format (see guests.example.csv):
 * partyName,email,category,firstName,lastName,isPrimary,isChild
 *
 * Categories:
 * - allEvents: tea-ceremony + welcome-party + wedding
 * - welcomeAndWedding: welcome-party + wedding
 */

import 'dotenv/config';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import {
  parties,
  guests,
  events,
  invitations,
  rsvps,
  rsvpHistory,
  songRequests,
} from '../lib/db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// ============================================================================
// EVENTS CONFIGURATION
// ============================================================================

const EVENTS = [
  {
    slug: 'tea-ceremony',
    name: 'Tea Ceremony',
    date: new Date('2026-09-13T10:00:00'),
    location: 'TBD',
    description: 'Traditional tea ceremony with immediate family',
    displayOrder: 1,
  },
  {
    slug: 'welcome-party',
    name: 'Welcome Party',
    date: new Date('2026-09-13T18:00:00'),
    location: 'TBD',
    description: 'Casual welcome gathering for out-of-town guests',
    displayOrder: 2,
  },
  {
    slug: 'wedding',
    name: 'Wedding Ceremony & Reception',
    date: new Date('2026-09-14T16:00:00'),
    location: 'TBD',
    description: 'Wedding ceremony followed by dinner and dancing',
    displayOrder: 3,
  },
];

const CATEGORY_EVENTS: Record<string, string[]> = {
  allEvents: ['tea-ceremony', 'welcome-party', 'wedding'],
  welcomeAndWedding: ['welcome-party', 'wedding'],
};

// ============================================================================
// CSV PARSING
// ============================================================================

interface CsvRow {
  partyName: string;
  email: string;
  category: string;
  firstName: string;
  lastName: string;
  isPrimary: string;
  isChild: string;
}

function parseCSV(content: string): CsvRow[] {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    return row as unknown as CsvRow;
  });
}

function groupByParty(rows: CsvRow[]): Map<string, CsvRow[]> {
  const groups = new Map<string, CsvRow[]>();
  for (const row of rows) {
    const existing = groups.get(row.partyName) || [];
    existing.push(row);
    groups.set(row.partyName, existing);
  }
  return groups;
}

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seedFromCsv() {
  // Get CSV path from command line or use default
  const csvPath = process.argv[2] || join(__dirname, 'guests.csv');

  console.log('🌱 Starting seed from CSV...\n');
  console.log(`📄 Reading: ${csvPath}\n`);

  // Read and parse CSV
  let csvContent: string;
  try {
    csvContent = readFileSync(csvPath, 'utf-8');
  } catch {
    console.error(`❌ Could not read CSV file: ${csvPath}`);
    console.error('   Make sure the file exists or provide a path as argument.');
    console.error('   Example: npm run db:seed:csv ./my-guests.csv');
    process.exit(1);
  }

  const rows = parseCSV(csvContent);
  const partiesMap = groupByParty(rows);

  console.log(`   Found ${rows.length} guests in ${partiesMap.size} parties\n`);

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await db.delete(rsvpHistory);
  await db.delete(songRequests);
  await db.delete(rsvps);
  await db.delete(invitations);
  await db.delete(guests);
  await db.delete(parties);
  await db.delete(events);
  console.log('   Done.\n');

  // Create events
  console.log('📅 Creating events...');
  const createdEvents = await db.insert(events).values(EVENTS).returning();
  const eventMap = new Map(createdEvents.map((e) => [e.slug, e.id]));
  for (const event of createdEvents) {
    console.log(`   ✓ ${event.name} (${event.slug})`);
  }
  console.log();

  // Create parties, guests, and invitations
  console.log('👥 Creating parties and guests...');
  let partyCount = 0;
  let guestCount = 0;
  let invitationCount = 0;

  for (const [partyName, partyRows] of partiesMap) {
    const firstRow = partyRows[0];
    const category = firstRow.category;
    const eventSlugs = CATEGORY_EVENTS[category];

    if (!eventSlugs) {
      console.warn(`   ⚠️  Unknown category "${category}" for party "${partyName}"`);
      continue;
    }

    // Create party
    const [party] = await db
      .insert(parties)
      .values({
        name: partyName,
        email: firstRow.email,
      })
      .returning();

    partyCount++;

    // Create guests
    const guestValues = partyRows.map((row) => ({
      partyId: party.id,
      firstName: row.firstName,
      lastName: row.lastName,
      isPrimary: row.isPrimary.toLowerCase() === 'true',
      isChild: row.isChild.toLowerCase() === 'true',
    }));

    await db.insert(guests).values(guestValues);
    guestCount += guestValues.length;

    // Create invitations
    const invitationValues = eventSlugs.map((slug) => ({
      partyId: party.id,
      eventId: eventMap.get(slug)!,
    }));

    await db.insert(invitations).values(invitationValues);
    invitationCount += invitationValues.length;

    const guestNames = partyRows.map((r) => r.firstName).join(', ');
    console.log(`   ✓ ${partyName} (${guestNames}) → ${eventSlugs.join(', ')}`);
  }

  console.log();
  console.log('📊 Summary:');
  console.log(`   Events: ${createdEvents.length}`);
  console.log(`   Parties: ${partyCount}`);
  console.log(`   Guests: ${guestCount}`);
  console.log(`   Invitations: ${invitationCount}`);
  console.log();
  console.log('🌱 Seed complete!\n');
}

// Run seed
seedFromCsv()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
