/**
 * Root tRPC router - combines all sub-routers.
 */

import { router } from './init';
import { authRouter } from './routers/auth';
import { rsvpRouter } from './routers/rsvp';
import { adminRouter } from './routers/admin';

export const appRouter = router({
  auth: authRouter,
  rsvp: rsvpRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
