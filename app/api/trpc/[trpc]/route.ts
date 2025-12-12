import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/router';
import { createContext } from '@/lib/trpc/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
    onError({ error, path }) {
      // Log all errors server-side for debugging
      console.error(`[tRPC Error] ${path}:`, error.message);
      if (error.cause) {
        console.error('[tRPC Cause]:', error.cause);
      }
    },
  });

export { handler as GET, handler as POST };
