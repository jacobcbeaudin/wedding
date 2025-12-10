import { initTRPC, TRPCError } from '@trpc/server';
import { eq, and } from 'drizzle-orm';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { db } from './db';
import { guests, lookupGuestSchema, submitRsvpSchema } from './schema';
import { normalizeName, sanitizeText } from './sanitize';
import { z } from 'zod';

export interface Context {
  ip: string;
}

const trpc = initTRPC.context<Context>().create();

const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: 'wedding:auth',
    })
  : null;

export const router = trpc.router({
  auth: trpc.router({
    verify: trpc.procedure
      .input(z.object({ password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        if (ratelimit) {
          const { success } = await ratelimit.limit(ctx.ip);
          if (!success) {
            throw new TRPCError({
              code: 'TOO_MANY_REQUESTS',
              message: 'Too many attempts. Please wait before trying again.',
            });
          }
        }

        const sitePassword = process.env.SITE_PASSWORD;
        if (!sitePassword) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Server configuration error',
          });
        }

        if (input.password.toLowerCase() !== sitePassword.toLowerCase()) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Incorrect password',
          });
        }

        return { success: true };
      }),
  }),

  rsvp: trpc.router({
    lookup: trpc.procedure.input(lookupGuestSchema).query(async ({ input }) => {
      const firstName = normalizeName(input.firstName);
      const lastName = normalizeName(input.lastName);

      if (!firstName || !lastName) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Please enter a valid first and last name.',
        });
      }

      const matchingGuests = await db
        .select()
        .from(guests)
        .where(and(eq(guests.firstName, firstName), eq(guests.lastName, lastName)))
        .limit(1);

      if (matchingGuests.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message:
            "We couldn't find your name on the guest list. Please check the spelling matches your invitation.",
        });
      }

      const guestRecord = matchingGuests[0];
      const guest = {
        id: guestRecord.id,
        firstName: guestRecord.firstName,
        lastName: guestRecord.lastName,
        email: guestRecord.email,
        invitedToTeaCeremony: guestRecord.invitedToTeaCeremony,
        invitedToWelcomeParty: guestRecord.invitedToWelcomeParty,
        invitedToWedding: guestRecord.invitedToWedding,
        teaCeremonyStatus: guestRecord.teaCeremonyStatus,
        welcomePartyStatus: guestRecord.welcomePartyStatus,
        weddingStatus: guestRecord.weddingStatus,
        dietaryRestrictions: guestRecord.dietaryRestrictions,
        songRequests: guestRecord.songRequests,
      };
      return { guest };
    }),

    submit: trpc.procedure.input(submitRsvpSchema).mutation(async ({ input }) => {
      const { guestId, ...rsvpInput } = input;

      const [guestRecord] = await db.select().from(guests).where(eq(guests.id, guestId)).limit(1);

      if (!guestRecord) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Guest not found',
        });
      }

      const updates: Record<string, unknown> = {
        updatedAt: new Date(),
        rsvpSubmittedAt: new Date(),
      };

      if (rsvpInput.teaCeremonyStatus !== undefined && guestRecord.invitedToTeaCeremony) {
        updates.teaCeremonyStatus = rsvpInput.teaCeremonyStatus;
      }

      if (rsvpInput.welcomePartyStatus !== undefined && guestRecord.invitedToWelcomeParty) {
        updates.welcomePartyStatus = rsvpInput.welcomePartyStatus;
      }

      if (rsvpInput.weddingStatus !== undefined && guestRecord.invitedToWedding) {
        updates.weddingStatus = rsvpInput.weddingStatus;
      }

      if (rsvpInput.dietaryRestrictions !== undefined) {
        updates.dietaryRestrictions = sanitizeText(rsvpInput.dietaryRestrictions, 500);
      }
      if (rsvpInput.songRequests !== undefined) {
        updates.songRequests = sanitizeText(rsvpInput.songRequests, 500);
      }

      const [updatedRecord] = await db
        .update(guests)
        .set(updates)
        .where(eq(guests.id, guestId))
        .returning();

      const guest = {
        id: updatedRecord.id,
        firstName: updatedRecord.firstName,
        lastName: updatedRecord.lastName,
        email: updatedRecord.email,
        invitedToTeaCeremony: updatedRecord.invitedToTeaCeremony,
        invitedToWelcomeParty: updatedRecord.invitedToWelcomeParty,
        invitedToWedding: updatedRecord.invitedToWedding,
        teaCeremonyStatus: updatedRecord.teaCeremonyStatus,
        welcomePartyStatus: updatedRecord.welcomePartyStatus,
        weddingStatus: updatedRecord.weddingStatus,
        dietaryRestrictions: updatedRecord.dietaryRestrictions,
        songRequests: updatedRecord.songRequests,
      };

      return {
        success: true,
        guest,
        message: 'Thank you! Your RSVP has been submitted.',
      };
    }),
  }),
});

export type AppRouter = typeof router;
