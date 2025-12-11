/**
 * Seed script for wedding database.
 *
 * Run with: npm run db:seed
 *
 * This script:
 * 1. Clears all existing data
 * 2. Creates events (tea ceremony, welcome party, wedding)
 * 3. Creates parties with guests
 * 4. Creates invitations based on event categories
 */

import 'dotenv/config';
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

// ============================================================================
// GUEST LIST CONFIGURATION
// ============================================================================

type GuestInput = {
  firstName: string;
  lastName: string;
  isPrimary?: boolean;
  isChild?: boolean;
};

type PartyInput = {
  partyName: string;
  email: string;
  guests: GuestInput[];
  events: ('tea-ceremony' | 'welcome-party' | 'wedding')[];
};

// Organize your guest list by invite category
const guestList: {
  allEvents: PartyInput[]; // Tea ceremony + welcome + wedding (immediate family)
  welcomeAndWedding: PartyInput[]; // Welcome + wedding (everyone else)
} = {
  // ============================================================================
  // ALL EVENTS - Tea ceremony + welcome party + wedding (immediate family only)
  // ============================================================================
  allEvents: [
    // {
    //   partyName: "Mom & Dad Beaudin",
    //   email: "mom@email.com",
    //   guests: [
    //     { firstName: "Mom", lastName: "Beaudin", isPrimary: true },
    //     { firstName: "Dad", lastName: "Beaudin" },
    //   ],
    //   events: ["tea-ceremony", "welcome-party", "wedding"],
    // },
  ],

  // ============================================================================
  // WELCOME + WEDDING - Everyone else
  // ============================================================================
  welcomeAndWedding: [
    // Couple
    // {
    //   partyName: "Mike & Sarah Jones",
    //   email: "mike@email.com",
    //   guests: [
    //     { firstName: "Mike", lastName: "Jones", isPrimary: true },
    //     { firstName: "Sarah", lastName: "Jones" },
    //   ],
    //   events: ["welcome-party", "wedding"],
    // },
    // Single
    // {
    //   partyName: "Alex Chen",
    //   email: "alex@email.com",
    //   guests: [
    //     { firstName: "Alex", lastName: "Chen", isPrimary: true },
    //   ],
    //   events: ["welcome-party", "wedding"],
    // },
    // Family with kids
    // {
    //   partyName: "The Johnson Family",
    //   email: "tom@email.com",
    //   guests: [
    //     { firstName: "Tom", lastName: "Johnson", isPrimary: true },
    //     { firstName: "Lisa", lastName: "Johnson" },
    //     { firstName: "Emma", lastName: "Johnson", isChild: true },
    //   ],
    //   events: ["welcome-party", "wedding"],
    // },
  ],
};

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seed() {
  console.log('🌱 Starting seed...\n');

  // Clear existing data (order matters due to foreign keys)
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

  // Combine all parties
  const allParties = [...guestList.allEvents, ...guestList.welcomeAndWedding];

  if (allParties.length === 0) {
    console.log('⚠️  No guests configured. Edit scripts/seed.ts to add your guest list.\n');
    console.log('🌱 Seed complete (events only).\n');
    return;
  }

  // Create parties, guests, and invitations
  console.log('👥 Creating parties and guests...');
  let partyCount = 0;
  let guestCount = 0;
  let invitationCount = 0;

  for (const partyInput of allParties) {
    // Create party
    const [party] = await db
      .insert(parties)
      .values({
        name: partyInput.partyName,
        email: partyInput.email,
      })
      .returning();

    partyCount++;

    // Create guests for this party
    const guestValues = partyInput.guests.map((g, index) => ({
      partyId: party.id,
      firstName: g.firstName,
      lastName: g.lastName,
      isPrimary: g.isPrimary ?? index === 0, // First guest is primary by default
      isChild: g.isChild ?? false,
    }));

    await db.insert(guests).values(guestValues);
    guestCount += guestValues.length;

    // Create invitations for this party
    const invitationValues = partyInput.events.map((eventSlug) => ({
      partyId: party.id,
      eventId: eventMap.get(eventSlug)!,
    }));

    await db.insert(invitations).values(invitationValues);
    invitationCount += invitationValues.length;

    const guestNames = partyInput.guests.map((g) => g.firstName).join(', ');
    const eventNames = partyInput.events.join(', ');
    console.log(`   ✓ ${partyInput.partyName} (${guestNames}) → ${eventNames}`);
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
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
