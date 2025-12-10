/**
 * Database schema for Drizzle Kit migrations.
 *
 * NOTE: This schema is duplicated in api/trpc/[trpc].ts for Vercel compatibility.
 * Keep both in sync when making schema changes.
 */

import { sql } from 'drizzle-orm';
import { pgTable, text, varchar, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const rsvpStatusEnum = pgEnum('rsvp_status', ['pending', 'attending', 'declined']);

export const guests = pgTable('guests', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  invitedToTeaCeremony: boolean('invited_to_tea_ceremony').notNull().default(false),
  invitedToWelcomeParty: boolean('invited_to_welcome_party').notNull().default(true),
  invitedToWedding: boolean('invited_to_wedding').notNull().default(true),
  teaCeremonyStatus: rsvpStatusEnum('tea_ceremony_status').notNull().default('pending'),
  welcomePartyStatus: rsvpStatusEnum('welcome_party_status').notNull().default('pending'),
  weddingStatus: rsvpStatusEnum('wedding_status').notNull().default('pending'),
  dietaryRestrictions: text('dietary_restrictions'),
  songRequests: text('song_requests'),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  rsvpSubmittedAt: timestamp('rsvp_submitted_at'),
});
