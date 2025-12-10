/**
 * tRPC context creation.
 */

import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export interface Context {
  ip: string;
}

export function createContext(opts: FetchCreateContextFnOptions): Context {
  const ip =
    opts.req.headers.get('x-forwarded-for')?.split(',')[0] ||
    opts.req.headers.get('x-real-ip') ||
    'unknown';

  return { ip };
}
