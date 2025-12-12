/**
 * tRPC initialization and base procedures.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // Hide unhandled errors (database failures, etc.) from the client.
    // Unhandled errors are wrapped by tRPC with:
    // - code: 'INTERNAL_SERVER_ERROR'
    // - cause: the original Error
    // Intentional TRPCErrors thrown without a cause are preserved.
    const isUnhandledError = error.code === 'INTERNAL_SERVER_ERROR' && error.cause instanceof Error;

    return {
      ...shape,
      message: isUnhandledError ? 'Something went wrong. Please try again later.' : shape.message,
      data: {
        ...shape.data,
        // Remove stack traces in production
        stack: process.env.NODE_ENV === 'development' ? shape.data?.stack : undefined,
      },
    };
  },
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
