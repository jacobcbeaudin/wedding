/**
 * tRPC context creation.
 */

import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth/admin';

export interface Context {
  ip: string;
  isAdmin: boolean;
}

/**
 * Parse cookies from header string.
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  return Object.fromEntries(
    cookieHeader
      .split('; ')
      .filter(Boolean)
      .map((c) => {
        const [key, ...rest] = c.split('=');
        return [key, rest.join('=')];
      })
  );
}

/**
 * Create context for tRPC requests.
 * Verifies admin JWT token if present.
 */
export async function createContext(opts: FetchCreateContextFnOptions): Promise<Context> {
  const ip =
    opts.req.headers.get('x-forwarded-for')?.split(',')[0] ||
    opts.req.headers.get('x-real-ip') ||
    'unknown';

  // Parse admin session token from cookie
  const cookieHeader = opts.req.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const adminToken = cookies[ADMIN_COOKIE_NAME] || '';

  // Verify JWT token
  const isAdmin = adminToken ? await verifyAdminToken(adminToken) : false;

  return { ip, isAdmin };
}
