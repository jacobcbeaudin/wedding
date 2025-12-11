/**
 * Root tRPC router - combines all sub-routers.
 */

import { router } from './init';
import { authRouter } from './routers/auth';
import { rsvpRouter } from './routers/rsvp';

export const appRouter = router({
  auth: authRouter,
  rsvp: rsvpRouter,
});

export type AppRouter = typeof appRouter;
