/**
 * Admin router - handles admin authentication and CRUD operations.
 */

import { z } from 'zod';
import { eq, desc, asc } from 'drizzle-orm';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { router, publicProcedure, adminProcedure, TRPCError } from '../init';
import { db } from '@/lib/db';
import { parties, guests, events, invitations, rsvps, songRequests } from '@/lib/db/schema';

// Rate limiter for admin login - stricter than site auth (3 attempts per minute)
const adminRatelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, '1 m'),
      analytics: true,
      prefix: 'wedding:admin',
    })
  : null;

export const adminRouter = router({
  // ============================================================================
  // AUTH
  // ============================================================================

  login: publicProcedure
    .input(z.object({ password: z.string().min(1, { error: 'Password is required' }) }))
    .mutation(async ({ input, ctx }) => {
      // Rate limit admin login attempts (3 per minute per IP)
      if (adminRatelimit) {
        const { success } = await adminRatelimit.limit(ctx.ip);
        if (!success) {
          throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many login attempts. Please wait before trying again.',
          });
        }
      }

      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Admin not configured',
        });
      }

      if (input.password !== adminPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid admin password',
        });
      }

      return { success: true };
    }),

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
    const [allParties, allGuests, allEvents, allRsvps, allSongRequests] = await Promise.all([
      db.query.parties.findMany(),
      db.query.guests.findMany(),
      db.query.events.findMany(),
      db.query.rsvps.findMany(),
      db.query.songRequests.findMany(),
    ]);

    const partiesWithSubmission = allParties.filter((p) => p.submittedAt);
    const attendingRsvps = allRsvps.filter((r) => r.status === 'attending');
    const declinedRsvps = allRsvps.filter((r) => r.status === 'declined');
    const pendingRsvps = allRsvps.filter((r) => r.status === 'pending');

    return {
      totalParties: allParties.length,
      partiesResponded: partiesWithSubmission.length,
      totalGuests: allGuests.length,
      totalEvents: allEvents.length,
      totalRsvps: allRsvps.length,
      attendingCount: attendingRsvps.length,
      declinedCount: declinedRsvps.length,
      pendingCount: pendingRsvps.length,
      songRequestCount: allSongRequests.length,
    };
  }),
});
