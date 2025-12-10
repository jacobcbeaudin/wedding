import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '../../../api/trpc/[trpc]';

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});
