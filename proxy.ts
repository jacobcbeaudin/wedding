import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SITE_AUTH } from '@/lib/auth';
import { jwtVerify } from 'jose';

/**
 * Verify site token in middleware context.
 * Note: We inline the verification here because middleware runs in Edge runtime
 * and some imports may not work correctly.
 */
async function verifySiteTokenMiddleware(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    const secret = process.env.SITE_JWT_SECRET || process.env.SITE_PASSWORD;
    if (!secret) return false;

    const secretBytes = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretBytes);
    return payload.authenticated === true;
  } catch {
    return false;
  }
}

/**
 * Proxy to protect API routes with site authentication.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - no site auth required
  const publicPaths = [
    '/api/auth/', // Site auth endpoints
    '/api/admin/', // Admin endpoints (have their own auth)
  ];

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Protected API routes - require site auth
  if (pathname.startsWith('/api/')) {
    const token = request.cookies.get(SITE_AUTH.cookieName)?.value;
    const isAuthenticated = token ? await verifySiteTokenMiddleware(token) : false;

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Site authentication required' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
