import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../shared/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(),
        })),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(),
        })),
      })),
    })),
  },
}));

describe('router', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.SITE_PASSWORD = 'testpassword';
  });

  describe('auth.verify', () => {
    it('accepts correct password', async () => {
      const { router } = await import('../../shared/router');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      const result = await caller.auth.verify({ password: 'testpassword' });
      expect(result.success).toBe(true);
    });

    it('accepts password case-insensitively', async () => {
      const { router } = await import('../../shared/router');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      const result = await caller.auth.verify({ password: 'TESTPASSWORD' });
      expect(result.success).toBe(true);
    });

    it('rejects incorrect password', async () => {
      const { router } = await import('../../shared/router');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      await expect(caller.auth.verify({ password: 'wrong' })).rejects.toThrow('Incorrect password');
    });

    it('throws error when SITE_PASSWORD not configured', async () => {
      delete process.env.SITE_PASSWORD;
      const { router } = await import('../../shared/router');
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

      const { db } = await import('../../shared/db');
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockGuest]),
          }),
        }),
      } as never);

      const { router } = await import('../../shared/router');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      const result = await caller.rsvp.lookup({ firstName: 'John', lastName: 'Smith' });

      expect(result.guest.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(result.guest.firstName).toBe('john');
      expect((result.guest as Record<string, unknown>).adminNotes).toBeUndefined();
      expect((result.guest as Record<string, unknown>).createdAt).toBeUndefined();
    });

    it('throws NOT_FOUND when guest not found', async () => {
      const { db } = await import('../../shared/db');
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as never);

      const { router } = await import('../../shared/router');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      await expect(caller.rsvp.lookup({ firstName: 'Nobody', lastName: 'Here' })).rejects.toThrow(
        "We couldn't find your name"
      );
    });

    it('rejects invalid names with only special characters', async () => {
      const { router } = await import('../../shared/router');
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

      const { db } = await import('../../shared/db');
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockGuest]),
          }),
        }),
      } as never);

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedGuest]),
          }),
        }),
      } as never);

      const { router } = await import('../../shared/router');
      const caller = router.createCaller({ ip: '127.0.0.1' });

      const result = await caller.rsvp.submit({
        guestId,
        weddingStatus: 'attending',
      });

      expect(result.success).toBe(true);
      expect(result.guest.id).toBe(guestId);
    });

    it('throws NOT_FOUND for invalid guestId', async () => {
      const { db } = await import('../../shared/db');
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as never);

      const { router } = await import('../../shared/router');
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
