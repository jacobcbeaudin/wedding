/**
 * tRPC API Handler - All backend code inlined for Vercel compatibility.
 *
 * Vercel's serverless Node.js runtime has issues resolving TypeScript imports
 * from other files. Inlining everything into a single file avoids this problem.
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { initTRPC, TRPCError } from '@trpc/server';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql, eq, and } from 'drizzle-orm';
import { pgTable, text, varchar, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

// =============================================================================
// DATABASE SCHEMA
// =============================================================================

const rsvpStatusEnum = pgEnum('rsvp_status', ['pending', 'attending', 'declined']);

const guests = pgTable('guests', {
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

// =============================================================================
// DATABASE CONNECTION
// =============================================================================

const db = drizzle(neon(process.env.DATABASE_URL!), { schema: { guests } });

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

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

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z\s\-']/gi, '');
}

export function sanitizeText(
  text: string | undefined,
  maxLength: number = 500
): string | undefined {
  if (!text) return undefined;
  return (
    text
      .trim()
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .slice(0, maxLength)
  );
}

// =============================================================================
// TRPC ROUTER
// =============================================================================

interface Context {
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
    lookup: trpc.procedure.input(lookupGuestSchema).mutation(async ({ input }) => {
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
      return {
        guest: {
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
        },
      };
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

      return {
        success: true,
        guest: {
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
        },
        message: 'Thank you! Your RSVP has been submitted.',
      };
    }),
  }),
});

export type AppRouter = typeof router;

// Type for guest data returned to frontend (excludes admin-only fields)
export type GuestPublic = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  invitedToTeaCeremony: boolean;
  invitedToWelcomeParty: boolean;
  invitedToWedding: boolean;
  teaCeremonyStatus: 'pending' | 'attending' | 'declined';
  welcomePartyStatus: 'pending' | 'attending' | 'declined';
  weddingStatus: 'pending' | 'attending' | 'declined';
  dietaryRestrictions: string | null;
  songRequests: string | null;
};

// =============================================================================
// VERCEL HANDLER
// =============================================================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.headers['x-real-ip']?.toString() ||
    'unknown';

  const url = new URL(req.url!, `http://${req.headers.host}`);

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  const request = new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body,
  });

  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router,
    createContext: () => ({ ip }),
  });

  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const responseBody = await response.text();
  res.send(responseBody);
}
