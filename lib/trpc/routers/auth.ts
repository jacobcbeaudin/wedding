/**
 * Auth router - handles password verification.
 */

import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { router, publicProcedure, TRPCError } from '../init';

const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: 'wedding:auth',
    })
  : null;

export const authRouter = router({
  verify: publicProcedure
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
});
