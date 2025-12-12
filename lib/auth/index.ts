/**
 * Unified authentication utilities.
 * Handles both site and admin authentication with shared logic.
 */

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Auth configurations
export interface AuthConfig {
  cookieName: string;
  maxAge: number;
  secretEnvVar: string;
  fallbackEnvVar: string;
  passwordEnvVar: string;
  rateLimitPrefix: string;
  rateLimitPerMinute: number;
  tokenClaim: Record<string, boolean>;
  tokenExpiry: string;
  claimKey: string;
}

export const SITE_AUTH: AuthConfig = {
  cookieName: 'site_session',
  maxAge: 60 * 60 * 24 * 30, // 30 days
  secretEnvVar: 'SITE_JWT_SECRET',
  fallbackEnvVar: 'SITE_PASSWORD',
  passwordEnvVar: 'SITE_PASSWORD',
  rateLimitPrefix: 'wedding:site:login',
  rateLimitPerMinute: 5,
  tokenClaim: { authenticated: true },
  tokenExpiry: '30d',
  claimKey: 'authenticated',
};

export const ADMIN_AUTH: AuthConfig = {
  cookieName: 'admin_session',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secretEnvVar: 'ADMIN_JWT_SECRET',
  fallbackEnvVar: 'ADMIN_PASSWORD',
  passwordEnvVar: 'ADMIN_PASSWORD',
  rateLimitPrefix: 'wedding:admin:login',
  rateLimitPerMinute: 3,
  tokenClaim: { admin: true },
  tokenExpiry: '7d',
  claimKey: 'admin',
};

// Re-export for backwards compatibility
export const SITE_COOKIE_NAME = SITE_AUTH.cookieName;
export const SITE_COOKIE_MAX_AGE = SITE_AUTH.maxAge;
export const ADMIN_COOKIE_NAME = ADMIN_AUTH.cookieName;
export const ADMIN_COOKIE_MAX_AGE = ADMIN_AUTH.maxAge;

/**
 * Get JWT secret for a given auth config.
 */
export function getJwtSecret(config: AuthConfig): Uint8Array {
  const secret = process.env[config.secretEnvVar] || process.env[config.fallbackEnvVar];
  if (!secret) {
    throw new Error(`${config.secretEnvVar} or ${config.fallbackEnvVar} must be configured`);
  }
  return new TextEncoder().encode(secret);
}

/**
 * Create a signed JWT token.
 */
export async function createToken(config: AuthConfig): Promise<string> {
  const secret = getJwtSecret(config);
  return new SignJWT(config.tokenClaim)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.tokenExpiry)
    .sign(secret);
}

/**
 * Verify a JWT token.
 */
export async function verifyToken(token: string, config: AuthConfig): Promise<boolean> {
  if (!token) return false;

  try {
    const secret = getJwtSecret(config);
    const { payload } = await jwtVerify(token, secret);
    return payload[config.claimKey] === true;
  } catch {
    return false;
  }
}

/**
 * Create rate limiter for an auth config.
 */
export function createRateLimiter(config: AuthConfig): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(config.rateLimitPerMinute, '1 m'),
    analytics: true,
    prefix: config.rateLimitPrefix,
  });
}

/**
 * Get client IP from request.
 */
export function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

/**
 * Handle login request for any auth type.
 */
export async function handleLogin(
  request: NextRequest,
  config: AuthConfig,
  rateLimiter: Ratelimit | null
): Promise<NextResponse> {
  try {
    // Rate limit
    const ip = getClientIp(request);
    if (rateLimiter) {
      const { success } = await rateLimiter.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: 'Too many attempts. Please wait before trying again.' },
          { status: 429 }
        );
      }
    }

    // Validate request
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Check password
    const expectedPassword = process.env[config.passwordEnvVar];
    if (!expectedPassword) {
      return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    if (password !== expectedPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Create token and set cookie
    const token = await createToken(config);
    const cookieStore = await cookies();
    cookieStore.set(config.cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: config.maxAge,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

/**
 * Handle logout request.
 */
export async function handleLogout(config: AuthConfig): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(config.cookieName);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

/**
 * Check session status.
 */
export async function handleSession(config: AuthConfig): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(config.cookieName)?.value;
    const authenticated = token ? await verifyToken(token, config) : false;
    return NextResponse.json({ authenticated });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

// Convenience function for tRPC context (verifies admin token)
export const verifyAdminToken = (token: string) => verifyToken(token, ADMIN_AUTH);
