/**
 * Validation schemas for RSVP API.
 * Shared between client and server for type safety.
 */

import { z } from 'zod';
import { MEAL_OPTIONS } from '@/lib/config/meals';
import { MAX_SONG_REQUESTS, MAX_NOTES_LENGTH } from '@/lib/config/rsvp';

// ============================================================================
// INPUT SCHEMAS
// ============================================================================

/**
 * Schema for looking up a guest by name.
 */
export const lookupGuestSchema = z.object({
  firstName: z.string({ error: 'First name is required' }).min(1).trim(),
  lastName: z.string({ error: 'Last name is required' }).min(1).trim(),
});

/**
 * Schema for fetching a party by ID.
 */
export const getPartySchema = z.object({
  partyId: z.uuid({ error: 'Invalid party ID' }),
});

/**
 * Schema for a single RSVP response.
 * mealChoice is required for wedding event when attending (validated at API layer).
 */
export const rsvpResponseSchema = z.object({
  guestId: z.uuid({ error: 'Invalid guest ID' }),
  eventId: z.uuid({ error: 'Invalid event ID' }),
  status: z.enum(['attending', 'declined']),
  mealChoice: z.enum(MEAL_OPTIONS).nullable().optional(),
});

/**
 * Schema for dietary restriction update.
 */
export const dietaryUpdateSchema = z.object({
  guestId: z.uuid({ error: 'Invalid guest ID' }),
  dietaryRestrictions: z.string().max(500).nullable(),
});

/**
 * Schema for a song request (party-level).
 */
export const songRequestSchema = z.object({
  song: z.string({ error: 'Song name is required' }).min(1).max(200),
  artist: z.string().max(200).nullable().optional(),
});

/**
 * Schema for submitting RSVPs for a party.
 */
export const submitRsvpSchema = z.object({
  partyId: z.uuid({ error: 'Invalid party ID' }),
  rsvps: z.array(rsvpResponseSchema).min(1, { error: 'At least one RSVP is required' }),
  dietaryUpdates: z.array(dietaryUpdateSchema).optional().default([]),
  songRequests: z
    .array(songRequestSchema)
    .max(MAX_SONG_REQUESTS, { error: `Maximum ${MAX_SONG_REQUESTS} song requests allowed` })
    .optional()
    .default([]),
  notes: z.string().max(MAX_NOTES_LENGTH).nullable().optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LookupGuestInput = z.infer<typeof lookupGuestSchema>;
export type GetPartyInput = z.infer<typeof getPartySchema>;
export type RsvpResponse = z.infer<typeof rsvpResponseSchema>;
export type DietaryUpdate = z.infer<typeof dietaryUpdateSchema>;
export type SongRequestInput = z.infer<typeof songRequestSchema>;
export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;

// ============================================================================
// OUTPUT TYPES (for API responses)
// ============================================================================

export type GuestPublic = {
  id: string;
  firstName: string;
  lastName: string;
  isPrimary: boolean;
  isChild: boolean;
  dietaryRestrictions: string | null;
};

export type EventPublic = {
  id: string;
  slug: string;
  name: string;
  date: string | null;
  location: string | null;
  description: string | null;
  displayOrder: number;
};

export type RsvpPublic = {
  guestId: string;
  eventId: string;
  status: 'pending' | 'attending' | 'declined';
  mealChoice: string | null;
};

export type SongRequestPublic = {
  id: string;
  song: string;
  artist: string | null;
};

export type PartyWithDetails = {
  id: string;
  name: string;
  email: string;
  notes: string | null;
  submittedAt: string | null;
  guests: GuestPublic[];
  invitedEvents: {
    event: EventPublic;
    rsvps: RsvpPublic[];
  }[];
  songRequests: SongRequestPublic[];
};
