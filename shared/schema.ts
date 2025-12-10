import { sql } from 'drizzle-orm';
import { pgTable, text, varchar, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// RSVP status enum
export const rsvpStatusEnum = pgEnum('rsvp_status', ['pending', 'attending', 'declined']);

// Guests - one row per individual person invited
export const guests = pgTable('guests', {
  id: varchar('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  // Name as it appears on invitation (used for lookup)
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),

  // Contact info (optional)
  email: text('email'),
  phone: text('phone'),

  // Which events this guest is invited to
  invitedToTeaCeremony: boolean('invited_to_tea_ceremony').notNull().default(false),
  invitedToWelcomeParty: boolean('invited_to_welcome_party').notNull().default(true),
  invitedToWedding: boolean('invited_to_wedding').notNull().default(true),

  // RSVP responses for each event
  teaCeremonyStatus: rsvpStatusEnum('tea_ceremony_status').notNull().default('pending'),
  welcomePartyStatus: rsvpStatusEnum('welcome_party_status').notNull().default('pending'),
  weddingStatus: rsvpStatusEnum('wedding_status').notNull().default('pending'),

  // Guest details
  dietaryRestrictions: text('dietary_restrictions'),
  songRequests: text('song_requests'),

  // Admin notes (not visible to guest)
  adminNotes: text('admin_notes'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  rsvpSubmittedAt: timestamp('rsvp_submitted_at'),
});

export const insertGuestSchema = createInsertSchema(guests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rsvpSubmittedAt: true,
});

export type InsertGuest = z.infer<typeof insertGuestSchema>;
export type Guest = typeof guests.$inferSelect;

// Public guest data returned to frontend (excludes admin-only fields)
export type GuestPublic = Omit<Guest, 'adminNotes' | 'createdAt' | 'updatedAt' | 'rsvpSubmittedAt'>;

// Zod schemas for API validation
export const lookupGuestSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
});

export const submitRsvpSchema = z.object({
  guestId: z.string().uuid(),
  teaCeremonyStatus: z.enum(['attending', 'declined']).optional(),
  welcomePartyStatus: z.enum(['attending', 'declined']).optional(),
  weddingStatus: z.enum(['attending', 'declined']).optional(),
  dietaryRestrictions: z.string().max(500).optional(),
  songRequests: z.string().max(500).optional(),
});

export type LookupGuestInput = z.infer<typeof lookupGuestSchema>;
export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;
