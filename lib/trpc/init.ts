/**
 * tRPC initialization and base procedures.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Admin procedure with authentication middleware.
 * Validates adminToken before running the procedure.
 */
export const adminProcedure = t.procedure
  .input(z.object({ adminToken: z.string() }))
  .use(async ({ input, next }) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Admin not configured',
      });
    }
    if (input.adminToken !== adminPassword) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid admin credentials',
      });
    }
    return next();
  });

export { TRPCError };
