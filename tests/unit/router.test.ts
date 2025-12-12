import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database at the module level
vi.mock('drizzle-orm/neon-http', () => ({
  drizzle: vi.fn(() => ({})),
}));

vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => vi.fn()),
}));

// Mock @upstash/ratelimit to disable rate limiting in tests
vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: vi.fn(),
}));

vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: vi.fn(),
  },
}));

describe('router', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.SITE_PASSWORD = 'testpassword';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  });

  describe('auth.verify', () => {
    it('accepts correct password', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      const result = await caller.auth.verify({ password: 'testpassword' });
      expect(result.success).toBe(true);
    });

    it('rejects password with wrong case', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(caller.auth.verify({ password: 'TESTPASSWORD' })).rejects.toThrow(
        'Incorrect password'
      );
    });

    it('rejects password with mixed case', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(caller.auth.verify({ password: 'TestPassword' })).rejects.toThrow(
        'Incorrect password'
      );
    });

    it('rejects incorrect password', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(caller.auth.verify({ password: 'wrong' })).rejects.toThrow('Incorrect password');
    });

    it('rejects empty password', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      // Zod validation requires min(1)
      await expect(caller.auth.verify({ password: '' })).rejects.toThrow();
    });

    it('throws error when SITE_PASSWORD not configured', async () => {
      delete process.env.SITE_PASSWORD;
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(caller.auth.verify({ password: 'test' })).rejects.toThrow(
        'Server configuration error'
      );
    });

    it('does not trim password whitespace (strict matching)', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      // Password is 'testpassword', input with whitespace should fail
      await expect(caller.auth.verify({ password: ' testpassword ' })).rejects.toThrow(
        'Incorrect password'
      );
    });

    it('handles special characters in password', async () => {
      vi.resetModules();
      process.env.SITE_PASSWORD = 'test@123!';
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      const result = await caller.auth.verify({ password: 'test@123!' });
      expect(result.success).toBe(true);
    });

    it('handles unicode in password', async () => {
      vi.resetModules();
      process.env.SITE_PASSWORD = 'пароль';
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      const result = await caller.auth.verify({ password: 'пароль' });
      expect(result.success).toBe(true);
    });
  });

  // Note: RSVP router tests require full database integration.
  // The drizzle ORM chain is too complex to mock at the unit level.
  // See tests/e2e/ for full RSVP flow testing with a real database.
});
