/**
 * Tests for unified authentication utilities.
 *
 * Note: JWT token creation/verification tests are covered by E2E tests
 * due to vitest module isolation issues with the jose library.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Unified Auth', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('getJwtSecret', () => {
    it('uses dedicated secret env var when available', async () => {
      process.env.SITE_JWT_SECRET = 'jwt-secret';
      process.env.SITE_PASSWORD = 'site-password';

      const { SITE_AUTH, getJwtSecret } = await import('@/lib/auth');
      const secret = getJwtSecret(SITE_AUTH);
      expect(new TextDecoder().decode(secret)).toBe('jwt-secret');
    });

    it('falls back to password env var when secret not set', async () => {
      delete process.env.SITE_JWT_SECRET;
      process.env.SITE_PASSWORD = 'site-password';

      const { SITE_AUTH, getJwtSecret } = await import('@/lib/auth');
      const secret = getJwtSecret(SITE_AUTH);
      expect(new TextDecoder().decode(secret)).toBe('site-password');
    });

    it('throws error when neither env var is configured', async () => {
      delete process.env.SITE_JWT_SECRET;
      delete process.env.SITE_PASSWORD;

      const { SITE_AUTH, getJwtSecret } = await import('@/lib/auth');
      expect(() => getJwtSecret(SITE_AUTH)).toThrow(
        'SITE_JWT_SECRET or SITE_PASSWORD must be configured'
      );
    });
  });

  describe('verifyToken', () => {
    beforeEach(() => {
      process.env.SITE_PASSWORD = 'test-password';
    });

    it('returns false for empty token', async () => {
      const { SITE_AUTH, verifyToken } = await import('@/lib/auth');
      const isValid = await verifyToken('', SITE_AUTH);
      expect(isValid).toBe(false);
    });

    it('returns false for invalid token format', async () => {
      const { SITE_AUTH, verifyToken } = await import('@/lib/auth');
      const isValid = await verifyToken('not-a-valid-jwt', SITE_AUTH);
      expect(isValid).toBe(false);
    });
  });

  describe('auth configs', () => {
    it('exports site auth config with correct values', async () => {
      const { SITE_AUTH } = await import('@/lib/auth');
      expect(SITE_AUTH.cookieName).toBe('site_session');
      expect(SITE_AUTH.maxAge).toBe(60 * 60 * 24 * 30); // 30 days
      expect(SITE_AUTH.claimKey).toBe('authenticated');
    });

    it('exports admin auth config with correct values', async () => {
      const { ADMIN_AUTH } = await import('@/lib/auth');
      expect(ADMIN_AUTH.cookieName).toBe('admin_session');
      expect(ADMIN_AUTH.maxAge).toBe(60 * 60 * 24 * 7); // 7 days
      expect(ADMIN_AUTH.claimKey).toBe('admin');
    });
  });

  describe('backwards compatibility', () => {
    it('exports legacy constants', async () => {
      const { SITE_COOKIE_NAME, SITE_COOKIE_MAX_AGE, ADMIN_COOKIE_NAME } =
        await import('@/lib/auth');
      expect(SITE_COOKIE_NAME).toBe('site_session');
      expect(SITE_COOKIE_MAX_AGE).toBe(60 * 60 * 24 * 30);
      expect(ADMIN_COOKIE_NAME).toBe('admin_session');
    });
  });
});
