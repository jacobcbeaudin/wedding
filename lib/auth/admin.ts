/**
 * Admin authentication utilities.
 * Uses signed JWT tokens for secure session management.
 */

import { jwtVerify } from 'jose';

export const ADMIN_COOKIE_NAME = 'admin_session';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Get the JWT secret for signing/verifying admin tokens.
 * Falls back to ADMIN_PASSWORD if ADMIN_JWT_SECRET is not set.
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET or ADMIN_PASSWORD must be configured');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Verify an admin session token.
 * Returns true if the token is valid and not expired.
 */
export async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload.admin === true;
  } catch {
    // Token is invalid, expired, or signature doesn't match
    return false;
  }
}
