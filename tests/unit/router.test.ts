import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database at the module level
const mockSelect = vi.fn();
const mockUpdate = vi.fn();

const mockDb = {
  select: mockSelect,
  update: mockUpdate,
};

// Mock drizzle-orm/neon-http to return our mock db
vi.mock('drizzle-orm/neon-http', () => ({
  drizzle: vi.fn(() => mockDb),
}));

// Mock @neondatabase/serverless
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
      const { router } = await import('../../api/trpc/[trpc]');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      const result = await caller.auth.verify({ password: 'testpassword' });
      expect(result.success).toBe(true);
    });

    it('accepts password case-insensitively', async () => {
      const { router } = await import('../../api/trpc/[trpc]');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      const result = await caller.auth.verify({ password: 'TESTPASSWORD' });
      expect(result.success).toBe(true);
    });

    it('rejects incorrect password', async () => {
      const { router } = await import('../../api/trpc/[trpc]');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      await expect(caller.auth.verify({ password: 'wrong' })).rejects.toThrow('Incorrect password');
    });

    it('throws error when SITE_PASSWORD not configured', async () => {
      delete process.env.SITE_PASSWORD;
      const { router } = await import('../../api/trpc/[trpc]');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      await expect(caller.auth.verify({ password: 'test' })).rejects.toThrow(
        'Server configuration error'
      );
    });
  });

  describe('rsvp.lookup', () => {
    it('returns guest when found', async () => {
      const mockGuest = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        firstName: 'john',
        lastName: 'smith',
        email: 'john@example.com',
        phone: null,
        invitedToTeaCeremony: false,
        invitedToWelcomeParty: true,
        invitedToWedding: true,
        teaCeremonyStatus: 'pending',
        welcomePartyStatus: 'pending',
        weddingStatus: 'pending',
        dietaryRestrictions: null,
        songRequests: null,
        adminNotes: 'VIP',
        createdAt: new Date(),
        updatedAt: new Date(),
        rsvpSubmittedAt: null,
      };

      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockGuest]),
          }),
        }),
      });

      const { router } = await import('../../api/trpc/[trpc]');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      const result = await caller.rsvp.lookup({ firstName: 'John', lastName: 'Smith' });

      expect(result.guest.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(result.guest.firstName).toBe('john');
      expect((result.guest as Record<string, unknown>).adminNotes).toBeUndefined();
      expect((result.guest as Record<string, unknown>).createdAt).toBeUndefined();
    });

    it('throws NOT_FOUND when guest not found', async () => {
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const { router } = await import('../../api/trpc/[trpc]');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      await expect(caller.rsvp.lookup({ firstName: 'Nobody', lastName: 'Here' })).rejects.toThrow(
        "We couldn't find your name"
      );
    });

    it('rejects invalid names with only special characters', async () => {
      const { router } = await import('../../api/trpc/[trpc]');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      await expect(caller.rsvp.lookup({ firstName: '!!!', lastName: '@@@' })).rejects.toThrow(
        'valid first and last name'
      );
    });
  });

  describe('rsvp.submit', () => {
    it('updates guest RSVP status', async () => {
      const guestId = '550e8400-e29b-41d4-a716-446655440000';
      const mockGuest = {
        id: guestId,
        firstName: 'john',
        lastName: 'smith',
        email: null,
        phone: null,
        invitedToTeaCeremony: false,
        invitedToWelcomeParty: true,
        invitedToWedding: true,
        teaCeremonyStatus: 'pending',
        welcomePartyStatus: 'pending',
        weddingStatus: 'pending',
        dietaryRestrictions: null,
        songRequests: null,
        adminNotes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        rsvpSubmittedAt: null,
      };

      const updatedGuest = {
        ...mockGuest,
        weddingStatus: 'attending',
        updatedAt: new Date(),
        rsvpSubmittedAt: new Date(),
      };

      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockGuest]),
          }),
        }),
      });

      mockUpdate.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedGuest]),
          }),
        }),
      });

      const { router } = await import('../../api/trpc/[trpc]');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      const result = await caller.rsvp.submit({
        guestId,
        weddingStatus: 'attending',
      });

      expect(result.success).toBe(true);
      expect(result.guest.id).toBe(guestId);
    });

    it('throws NOT_FOUND for invalid guestId', async () => {
      mockSelect.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const { router } = await import('../../api/trpc/[trpc]');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.rsvp.submit({
          guestId: '00000000-0000-0000-0000-000000000000',
          weddingStatus: 'attending',
        })
      ).rejects.toThrow('Guest not found');
    });
  });
});
