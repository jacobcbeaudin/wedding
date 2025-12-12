/**
 * Admin router - handles admin CRUD operations.
 * Authentication is handled via HttpOnly session cookies.
 */

import { z } from 'zod';
import { eq, desc, asc, sql } from 'drizzle-orm';
import { router, adminProcedure, TRPCError } from '../init';
import { db } from '@/lib/db';
import { parties, guests, events, invitations, rsvps, songRequests } from '@/lib/db/schema';

export const adminRouter = router({
  // ============================================================================
  // PARTIES
  // ============================================================================

  listParties: adminProcedure.query(async () => {
    const result = await db.query.parties.findMany({
      orderBy: [asc(parties.name)],
      with: {
        guests: true,
        invitations: {
          with: {
            event: true,
          },
        },
      },
    });

    return result;
  }),

  createParty: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.email(),
        notes: z.string().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const [party] = await db
        .insert(parties)
        .values({
          name: input.name,
          email: input.email,
          notes: input.notes,
        })
        .returning();

      return party;
    }),

  updateParty: adminProcedure
    .input(
      z.object({
        id: z.uuid(),
        name: z.string().min(1),
        email: z.email(),
        notes: z.string().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const [party] = await db
        .update(parties)
        .set({
          name: input.name,
          email: input.email,
          notes: input.notes,
        })
        .where(eq(parties.id, input.id))
        .returning();

      if (!party) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Party not found',
        });
      }

      return party;
    }),

  deleteParty: adminProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ input }) => {
    await db.delete(parties).where(eq(parties.id, input.id));
    return { success: true };
  }),

  // ============================================================================
  // GUESTS
  // ============================================================================

  listGuests: adminProcedure.query(async () => {
    const result = await db.query.guests.findMany({
      orderBy: [asc(guests.lastName), asc(guests.firstName)],
      with: {
        party: true,
        rsvps: {
          with: {
            event: true,
          },
        },
      },
    });

    return result;
  }),

  createGuest: adminProcedure
    .input(
      z.object({
        partyId: z.uuid(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        isPrimary: z.boolean().default(false),
        isChild: z.boolean().default(false),
        dietaryRestrictions: z.string().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const [guest] = await db
        .insert(guests)
        .values({
          partyId: input.partyId,
          firstName: input.firstName,
          lastName: input.lastName,
          isPrimary: input.isPrimary,
          isChild: input.isChild,
          dietaryRestrictions: input.dietaryRestrictions,
        })
        .returning();

      return guest;
    }),

  updateGuest: adminProcedure
    .input(
      z.object({
        id: z.uuid(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        isPrimary: z.boolean(),
        isChild: z.boolean(),
        dietaryRestrictions: z.string().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const [guest] = await db
        .update(guests)
        .set({
          firstName: input.firstName,
          lastName: input.lastName,
          isPrimary: input.isPrimary,
          isChild: input.isChild,
          dietaryRestrictions: input.dietaryRestrictions,
        })
        .where(eq(guests.id, input.id))
        .returning();

      if (!guest) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Guest not found',
        });
      }

      return guest;
    }),

  deleteGuest: adminProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ input }) => {
    await db.delete(guests).where(eq(guests.id, input.id));
    return { success: true };
  }),

  // ============================================================================
  // EVENTS
  // ============================================================================

  listEvents: adminProcedure.query(async () => {
    const result = await db.query.events.findMany({
      orderBy: [asc(events.displayOrder)],
    });

    return result;
  }),

  createEvent: adminProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        name: z.string().min(1),
        date: z.string().nullable(),
        location: z.string().nullable(),
        description: z.string().nullable(),
        displayOrder: z.int().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const [event] = await db
        .insert(events)
        .values({
          slug: input.slug,
          name: input.name,
          date: input.date ? new Date(input.date) : null,
          location: input.location,
          description: input.description,
          displayOrder: input.displayOrder,
        })
        .returning();

      return event;
    }),

  updateEvent: adminProcedure
    .input(
      z.object({
        id: z.uuid(),
        slug: z.string().min(1),
        name: z.string().min(1),
        date: z.string().nullable(),
        location: z.string().nullable(),
        description: z.string().nullable(),
        displayOrder: z.int(),
      })
    )
    .mutation(async ({ input }) => {
      const [event] = await db
        .update(events)
        .set({
          slug: input.slug,
          name: input.name,
          date: input.date ? new Date(input.date) : null,
          location: input.location,
          description: input.description,
          displayOrder: input.displayOrder,
        })
        .where(eq(events.id, input.id))
        .returning();

      if (!event) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        });
      }

      return event;
    }),

  deleteEvent: adminProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ input }) => {
    await db.delete(events).where(eq(events.id, input.id));
    return { success: true };
  }),

  // ============================================================================
  // INVITATIONS
  // ============================================================================

  listInvitations: adminProcedure.query(async () => {
    const result = await db.query.invitations.findMany({
      with: {
        party: true,
        event: true,
      },
    });

    return result;
  }),

  createInvitation: adminProcedure
    .input(
      z.object({
        partyId: z.uuid(),
        eventId: z.uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const [invitation] = await db
        .insert(invitations)
        .values({
          partyId: input.partyId,
          eventId: input.eventId,
        })
        .returning();

      return invitation;
    }),

  deleteInvitation: adminProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ input }) => {
    await db.delete(invitations).where(eq(invitations.id, input.id));
    return { success: true };
  }),

  bulkInvite: adminProcedure
    .input(
      z.object({
        partyId: z.uuid(),
        eventIds: z.array(z.uuid()),
      })
    )
    .mutation(async ({ input }) => {
      // Delete existing invitations for this party
      await db.delete(invitations).where(eq(invitations.partyId, input.partyId));

      // Create new invitations
      if (input.eventIds.length > 0) {
        await db.insert(invitations).values(
          input.eventIds.map((eventId) => ({
            partyId: input.partyId,
            eventId,
          }))
        );
      }

      return { success: true };
    }),

  // ============================================================================
  // RSVPS
  // ============================================================================

  listRsvps: adminProcedure.query(async () => {
    const result = await db.query.rsvps.findMany({
      orderBy: [desc(rsvps.updatedAt)],
      with: {
        guest: {
          with: {
            party: true,
          },
        },
        event: true,
      },
    });

    return result;
  }),

  // ============================================================================
  // SONG REQUESTS
  // ============================================================================

  listSongRequests: adminProcedure.query(async () => {
    const result = await db.query.songRequests.findMany({
      orderBy: [desc(songRequests.createdAt)],
      with: {
        party: true,
      },
    });

    return result;
  }),

  deleteSongRequest: adminProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(songRequests).where(eq(songRequests.id, input.id));
      return { success: true };
    }),

  // ============================================================================
  // DASHBOARD STATS
  // ============================================================================

  getDashboardStats: adminProcedure.query(async () => {
    // Use COUNT queries instead of loading all records for efficiency
    const [partyCounts, guestCount, eventCount, rsvpCounts, songRequestCount] = await Promise.all([
      // Count parties and parties with submissions
      db
        .select({
          total: sql<number>`count(*)::int`,
          responded: sql<number>`count(*) filter (where ${parties.submittedAt} is not null)::int`,
        })
        .from(parties),
      // Count guests
      db.select({ count: sql<number>`count(*)::int` }).from(guests),
      // Count events
      db.select({ count: sql<number>`count(*)::int` }).from(events),
      // Count RSVPs by status
      db
        .select({
          total: sql<number>`count(*)::int`,
          attending: sql<number>`count(*) filter (where ${rsvps.status} = 'attending')::int`,
          declined: sql<number>`count(*) filter (where ${rsvps.status} = 'declined')::int`,
          pending: sql<number>`count(*) filter (where ${rsvps.status} = 'pending')::int`,
        })
        .from(rsvps),
      // Count song requests
      db.select({ count: sql<number>`count(*)::int` }).from(songRequests),
    ]);

    return {
      totalParties: partyCounts[0]?.total ?? 0,
      partiesResponded: partyCounts[0]?.responded ?? 0,
      totalGuests: guestCount[0]?.count ?? 0,
      totalEvents: eventCount[0]?.count ?? 0,
      totalRsvps: rsvpCounts[0]?.total ?? 0,
      attendingCount: rsvpCounts[0]?.attending ?? 0,
      declinedCount: rsvpCounts[0]?.declined ?? 0,
      pendingCount: rsvpCounts[0]?.pending ?? 0,
      songRequestCount: songRequestCount[0]?.count ?? 0,
    };
  }),
});
