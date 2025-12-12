/**
 * RSVP router - handles party lookup and RSVP submission.
 * Relational model: parties → guests → rsvps, with events and invitations.
 */

import { eq, and, asc, inArray, sql } from 'drizzle-orm';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { router, publicProcedure, TRPCError } from '../init';
import {
  db,
  parties,
  guests,
  events,
  invitations,
  rsvps,
  rsvpHistory,
  songRequests,
} from '@/lib/db';
import {
  lookupGuestSchema,
  getPartySchema,
  submitRsvpSchema,
  type PartyWithDetails,
  type GuestPublic,
  type EventPublic,
  type RsvpPublic,
  type SongRequestPublic,
} from '@/lib/validations/rsvp';
import { RSVP_DEADLINE } from '@/lib/config/rsvp';
import { MEAL_REQUIRED_EVENT } from '@/lib/config/meals';
import { normalizeName, sanitizeText } from '@/lib/trpc/utils';
import { queueRsvpConfirmation } from '@/lib/email/queue';

// Rate limiter for RSVP submission - 10 submissions per minute per IP
const rsvpRatelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'wedding:rsvp',
    })
  : null;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Checks if RSVP deadline has passed.
 */
function checkDeadline(): void {
  if (RSVP_DEADLINE && new Date() > RSVP_DEADLINE) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'The RSVP deadline has passed.',
    });
  }
}

/**
 * Fetches a party with all related data for the RSVP form.
 */
async function fetchPartyWithDetails(partyId: string): Promise<PartyWithDetails> {
  // Fetch party
  const [party] = await db.select().from(parties).where(eq(parties.id, partyId)).limit(1);

  if (!party) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Party not found',
    });
  }

  // Fetch guests in this party (primary first)
  const partyGuests = await db
    .select()
    .from(guests)
    .where(eq(guests.partyId, partyId))
    .orderBy(asc(guests.isPrimary)); // false < true, so primary comes last with asc

  // Re-order so primary is first
  partyGuests.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));

  // Fetch all events this party is invited to
  const partyInvitations = await db
    .select({
      invitation: invitations,
      event: events,
    })
    .from(invitations)
    .innerJoin(events, eq(invitations.eventId, events.id))
    .where(eq(invitations.partyId, partyId))
    .orderBy(asc(events.displayOrder));

  // Fetch all RSVPs for guests in this party
  const guestIds = partyGuests.map((g) => g.id);
  const partyRsvps =
    guestIds.length > 0
      ? await db.select().from(rsvps).where(inArray(rsvps.guestId, guestIds))
      : [];

  // Fetch song requests for this party
  const partySongRequests = await db
    .select()
    .from(songRequests)
    .where(eq(songRequests.partyId, partyId));

  // Transform to response types
  const guestsPublic: GuestPublic[] = partyGuests.map((g) => ({
    id: g.id,
    firstName: g.firstName,
    lastName: g.lastName,
    isPrimary: g.isPrimary,
    isChild: g.isChild,
    dietaryRestrictions: g.dietaryRestrictions,
  }));

  const invitedEvents = partyInvitations.map(({ event }) => {
    const eventPublic: EventPublic = {
      id: event.id,
      slug: event.slug,
      name: event.name,
      date: event.date?.toISOString() ?? null,
      location: event.location,
      description: event.description,
      displayOrder: event.displayOrder,
    };

    const eventRsvps: RsvpPublic[] = partyRsvps
      .filter((r) => r.eventId === event.id)
      .map((r) => ({
        guestId: r.guestId,
        eventId: r.eventId,
        status: r.status,
        mealChoice: r.mealChoice,
      }));

    return { event: eventPublic, rsvps: eventRsvps };
  });

  const songRequestsPublic: SongRequestPublic[] = partySongRequests.map((s) => ({
    id: s.id,
    song: s.song,
    artist: s.artist,
  }));

  return {
    id: party.id,
    name: party.name,
    email: party.email,
    notes: party.notes,
    submittedAt: party.submittedAt?.toISOString() ?? null,
    guests: guestsPublic,
    invitedEvents,
    songRequests: songRequestsPublic,
  };
}

// ============================================================================
// ROUTER
// ============================================================================

export const rsvpRouter = router({
  /**
   * Look up a guest by name and return their party's full context.
   */
  lookup: publicProcedure.input(lookupGuestSchema).mutation(async ({ input }) => {
    const firstName = normalizeName(input.firstName);
    const lastName = normalizeName(input.lastName);

    if (!firstName || !lastName) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Please enter a valid first and last name.',
      });
    }

    // Find the guest using case-insensitive, accent-insensitive comparison
    // - lower() handles case: "John" matches "john"
    // - unaccent() handles accents: "José" matches "jose"
    // - This handles O'Brien, Mary-Jane, José, etc.
    // Requires: CREATE EXTENSION IF NOT EXISTS unaccent; (enabled on dev & prod)
    const [guest] = await db
      .select()
      .from(guests)
      .where(
        and(
          sql`lower(unaccent(${guests.firstName})) = ${firstName}`,
          sql`lower(unaccent(${guests.lastName})) = ${lastName}`
        )
      )
      .limit(1);

    if (!guest) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message:
          "We couldn't find your name on the guest list. Please check the spelling matches your invitation.",
      });
    }

    // Return the full party context
    const party = await fetchPartyWithDetails(guest.partyId);
    return { party };
  }),

  /**
   * Get a party by ID (for returning to edit RSVP).
   */
  getParty: publicProcedure.input(getPartySchema).query(async ({ input }) => {
    const party = await fetchPartyWithDetails(input.partyId);
    return { party };
  }),

  /**
   * Submit RSVPs for all guests in a party.
   * Uses batched database operations for efficiency.
   */
  submit: publicProcedure.input(submitRsvpSchema).mutation(async ({ input, ctx }) => {
    // Rate limit RSVP submissions (10 per minute per IP)
    if (rsvpRatelimit) {
      const { success } = await rsvpRatelimit.limit(ctx.ip);
      if (!success) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many submissions. Please wait a moment before trying again.',
        });
      }
    }

    // Check deadline
    checkDeadline();

    const { partyId, rsvps: rsvpInputs, dietaryUpdates, songRequests: songInputs, notes } = input;

    // Verify party exists
    const [party] = await db.select().from(parties).where(eq(parties.id, partyId)).limit(1);

    if (!party) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Party not found',
      });
    }

    // Get all guests in this party for validation
    const partyGuests = await db.select().from(guests).where(eq(guests.partyId, partyId));

    const partyGuestIds = new Set(partyGuests.map((g) => g.id));

    // Get all events this party is invited to
    const partyInvitations = await db
      .select({
        invitation: invitations,
        event: events,
      })
      .from(invitations)
      .innerJoin(events, eq(invitations.eventId, events.id))
      .where(eq(invitations.partyId, partyId));

    const invitedEventIds = new Set(partyInvitations.map((i) => i.invitation.eventId));
    const eventByIdMap = new Map(partyInvitations.map((i) => [i.event.id, i.event]));

    // Get existing RSVPs for history tracking
    const existingRsvps = await db
      .select()
      .from(rsvps)
      .where(inArray(rsvps.guestId, Array.from(partyGuestIds)));

    const existingRsvpMap = new Map(existingRsvps.map((r) => [`${r.guestId}-${r.eventId}`, r]));

    // Validate all inputs and collect batched operations
    const now = new Date();
    const historyRecords: Array<{
      rsvpId: string;
      previousStatus: 'pending' | 'attending' | 'declined';
      previousMealChoice: string | null;
      changedAt: Date;
    }> = [];
    const rsvpValues: Array<{
      guestId: string;
      eventId: string;
      status: 'attending' | 'declined';
      mealChoice: string | null;
      updatedAt: Date;
    }> = [];

    for (const rsvpInput of rsvpInputs) {
      // Validate guest belongs to this party
      if (!partyGuestIds.has(rsvpInput.guestId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Guest does not belong to this party',
        });
      }

      // Validate party is invited to this event
      if (!invitedEventIds.has(rsvpInput.eventId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Party is not invited to this event',
        });
      }

      // Validate meal choice for wedding event
      const event = eventByIdMap.get(rsvpInput.eventId);
      if (
        event?.slug === MEAL_REQUIRED_EVENT &&
        rsvpInput.status === 'attending' &&
        !rsvpInput.mealChoice
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Meal selection is required for attending guests',
        });
      }

      // Check for existing RSVP to log history
      const existingKey = `${rsvpInput.guestId}-${rsvpInput.eventId}`;
      const existingRsvp = existingRsvpMap.get(existingKey);

      if (
        existingRsvp &&
        (existingRsvp.status !== rsvpInput.status ||
          existingRsvp.mealChoice !== rsvpInput.mealChoice)
      ) {
        // Collect history record for batch insert
        historyRecords.push({
          rsvpId: existingRsvp.id,
          previousStatus: existingRsvp.status,
          previousMealChoice: existingRsvp.mealChoice,
          changedAt: now,
        });
      }

      // Collect RSVP for batch upsert
      rsvpValues.push({
        guestId: rsvpInput.guestId,
        eventId: rsvpInput.eventId,
        status: rsvpInput.status,
        mealChoice: rsvpInput.mealChoice ?? null,
        updatedAt: now,
      });
    }

    // Validate dietary updates
    for (const dietaryUpdate of dietaryUpdates) {
      if (!partyGuestIds.has(dietaryUpdate.guestId)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Guest does not belong to this party',
        });
      }
    }

    // Batch insert history records
    if (historyRecords.length > 0) {
      await db.insert(rsvpHistory).values(historyRecords);
    }

    // Batch upsert RSVPs - single query with multi-row VALUES
    if (rsvpValues.length > 0) {
      const rows = rsvpValues.map(
        (r) =>
          sql`(${r.guestId}::uuid, ${r.eventId}::uuid, ${r.status}::rsvp_status, ${r.mealChoice}, ${now})`
      );

      await db.execute(sql`
        INSERT INTO rsvps (guest_id, event_id, status, meal_choice, updated_at)
        VALUES ${sql.join(rows, sql`, `)}
        ON CONFLICT (guest_id, event_id) DO UPDATE SET
          status = EXCLUDED.status,
          meal_choice = EXCLUDED.meal_choice,
          updated_at = EXCLUDED.updated_at
      `);
    }

    // Batch update dietary restrictions using CASE WHEN
    if (dietaryUpdates.length > 0) {
      // Build a map of guestId -> sanitized dietary restrictions
      const dietaryMap = new Map(
        dietaryUpdates.map((d) => [
          d.guestId,
          sanitizeText(d.dietaryRestrictions ?? undefined, 500) ?? null,
        ])
      );

      // Update all guests in parallel
      await Promise.all(
        Array.from(dietaryMap.entries()).map(([guestId, restrictions]) =>
          db.update(guests).set({ dietaryRestrictions: restrictions }).where(eq(guests.id, guestId))
        )
      );
    }

    // Replace song requests for this party (batch insert)
    await db.delete(songRequests).where(eq(songRequests.partyId, partyId));

    if (songInputs.length > 0) {
      const songValues = songInputs.map((songInput) => ({
        partyId,
        song: sanitizeText(songInput.song, 200) ?? '',
        artist: sanitizeText(songInput.artist ?? undefined, 200) ?? null,
      }));
      await db.insert(songRequests).values(songValues);
    }

    // Update party submission timestamp and notes
    await db
      .update(parties)
      .set({
        submittedAt: now,
        notes: sanitizeText(notes ?? undefined, 500) ?? null,
      })
      .where(eq(parties.id, partyId));

    // Return updated party data
    const updatedParty = await fetchPartyWithDetails(partyId);

    // Queue confirmation email for background sending (non-blocking)
    queueRsvpConfirmation({
      partyId,
      partyEmail: party.email,
      guests: updatedParty.guests.map((guest) => ({
        name: `${guest.firstName} ${guest.lastName}`,
        responses: updatedParty.invitedEvents
          .map(({ event, rsvps: eventRsvps }) => {
            const rsvp = eventRsvps.find((r) => r.guestId === guest.id);
            if (!rsvp || rsvp.status === 'pending') return null;
            return {
              eventName: event.name,
              status: rsvp.status as 'attending' | 'declined',
              mealChoice: rsvp.mealChoice,
            };
          })
          .filter((r): r is NonNullable<typeof r> => r !== null),
        dietaryRestrictions: guest.dietaryRestrictions,
      })),
      songRequests: updatedParty.songRequests.map((s) => ({
        song: s.song,
        artist: s.artist,
      })),
      notes: updatedParty.notes,
    });

    return {
      success: true,
      party: updatedParty,
      message: 'Thank you! Your RSVP has been submitted.',
    };
  }),
});
