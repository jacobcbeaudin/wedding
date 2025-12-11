/**
 * Database schema - Single source of truth for Drizzle ORM.
 * Relational model for wedding RSVP system.
 */

import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  uuid,
  boolean,
  timestamp,
  pgEnum,
  integer,
  unique,
} from 'drizzle-orm/pg-core';

// Enums
export const rsvpStatusEnum = pgEnum('rsvp_status', ['pending', 'attending', 'declined']);

// ============================================================================
// TABLES
// ============================================================================

/**
 * Parties - Households/groups that receive invitations together.
 */
export const parties = pgTable('parties', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  notes: text('notes'),
  submittedAt: timestamp('submitted_at'),
  confirmationSentAt: timestamp('confirmation_sent_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Guests - Individual people belonging to a party.
 */
export const guests = pgTable('guests', {
  id: uuid('id').primaryKey().defaultRandom(),
  partyId: uuid('party_id')
    .notNull()
    .references(() => parties.id, { onDelete: 'cascade' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  isPrimary: boolean('is_primary').notNull().default(false),
  isChild: boolean('is_child').notNull().default(false),
  dietaryRestrictions: text('dietary_restrictions'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Events - Wedding events (tea ceremony, welcome party, wedding, etc.)
 */
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  date: timestamp('date'),
  location: text('location'),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Invitations - Which parties are invited to which events.
 */
export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    partyId: uuid('party_id')
      .notNull()
      .references(() => parties.id, { onDelete: 'cascade' }),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [unique('invitation_unique').on(table.partyId, table.eventId)]
);

/**
 * RSVPs - Individual guest responses per event.
 */
export const rsvps = pgTable(
  'rsvps',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    guestId: uuid('guest_id')
      .notNull()
      .references(() => guests.id, { onDelete: 'cascade' }),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    status: rsvpStatusEnum('status').notNull().default('pending'),
    mealChoice: text('meal_choice'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [unique('rsvp_unique').on(table.guestId, table.eventId)]
);

/**
 * RSVP History - Audit log of RSVP changes.
 */
export const rsvpHistory = pgTable('rsvp_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  rsvpId: uuid('rsvp_id')
    .notNull()
    .references(() => rsvps.id, { onDelete: 'cascade' }),
  previousStatus: rsvpStatusEnum('previous_status').notNull(),
  previousMealChoice: text('previous_meal_choice'),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
});

/**
 * Song Requests - Songs requested by parties.
 */
export const songRequests = pgTable('song_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  partyId: uuid('party_id')
    .notNull()
    .references(() => parties.id, { onDelete: 'cascade' }),
  song: text('song').notNull(),
  artist: text('artist'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const partiesRelations = relations(parties, ({ many }) => ({
  guests: many(guests),
  invitations: many(invitations),
  songRequests: many(songRequests),
}));

export const guestsRelations = relations(guests, ({ one, many }) => ({
  party: one(parties, {
    fields: [guests.partyId],
    references: [parties.id],
  }),
  rsvps: many(rsvps),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  invitations: many(invitations),
  rsvps: many(rsvps),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  party: one(parties, {
    fields: [invitations.partyId],
    references: [parties.id],
  }),
  event: one(events, {
    fields: [invitations.eventId],
    references: [events.id],
  }),
}));

export const rsvpsRelations = relations(rsvps, ({ one, many }) => ({
  guest: one(guests, {
    fields: [rsvps.guestId],
    references: [guests.id],
  }),
  event: one(events, {
    fields: [rsvps.eventId],
    references: [events.id],
  }),
  history: many(rsvpHistory),
}));

export const rsvpHistoryRelations = relations(rsvpHistory, ({ one }) => ({
  rsvp: one(rsvps, {
    fields: [rsvpHistory.rsvpId],
    references: [rsvps.id],
  }),
}));

export const songRequestsRelations = relations(songRequests, ({ one }) => ({
  party: one(parties, {
    fields: [songRequests.partyId],
    references: [parties.id],
  }),
}));

// ============================================================================
// TYPES
// ============================================================================

export type Party = typeof parties.$inferSelect;
export type NewParty = typeof parties.$inferInsert;

export type Guest = typeof guests.$inferSelect;
export type NewGuest = typeof guests.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

export type Rsvp = typeof rsvps.$inferSelect;
export type NewRsvp = typeof rsvps.$inferInsert;

export type RsvpHistory = typeof rsvpHistory.$inferSelect;
export type NewRsvpHistory = typeof rsvpHistory.$inferInsert;

export type SongRequest = typeof songRequests.$inferSelect;
export type NewSongRequest = typeof songRequests.$inferInsert;

export type RsvpStatus = 'pending' | 'attending' | 'declined';
