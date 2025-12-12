/**
 * tRPC initialization and base procedures.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
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
 * Checks for admin session cookie via context.
 */
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Admin authentication required',
    });
  }
  return next();
});

export { TRPCError };
