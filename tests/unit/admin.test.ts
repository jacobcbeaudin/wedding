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

describe('admin router', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.ADMIN_PASSWORD = 'admin-secret-123';
    process.env.SITE_PASSWORD = 'testpassword';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  });

  describe('admin authentication via context', () => {
    it('rejects requests when isAdmin is false', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(caller.admin.listParties()).rejects.toThrow('Admin authentication required');
    });

    it('rejects getDashboardStats when not admin', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(caller.admin.getDashboardStats()).rejects.toThrow(
        'Admin authentication required'
      );
    });

    it('rejects listGuests when not admin', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(caller.admin.listGuests()).rejects.toThrow('Admin authentication required');
    });

    it('rejects listEvents when not admin', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(caller.admin.listEvents()).rejects.toThrow('Admin authentication required');
    });

    it('rejects listRsvps when not admin', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(caller.admin.listRsvps()).rejects.toThrow('Admin authentication required');
    });

    it('rejects listSongRequests when not admin', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(caller.admin.listSongRequests()).rejects.toThrow(
        'Admin authentication required'
      );
    });

    it('rejects createParty when not admin', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(
        caller.admin.createParty({
          name: 'Test Party',
          email: 'test@example.com',
          notes: null,
        })
      ).rejects.toThrow('Admin authentication required');
    });

    it('rejects deleteParty when not admin', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: false });

      await expect(
        caller.admin.deleteParty({
          id: '123e4567-e89b-12d3-a456-426614174000',
        })
      ).rejects.toThrow('Admin authentication required');
    });
  });

  describe('admin input validation (when authenticated)', () => {
    it('rejects createParty with invalid email', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.createParty({
          name: 'Test Party',
          email: 'not-an-email',
          notes: null,
        })
      ).rejects.toThrow();
    });

    it('rejects createParty with empty name', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.createParty({
          name: '',
          email: 'test@example.com',
          notes: null,
        })
      ).rejects.toThrow();
    });

    it('rejects createGuest with invalid UUID for partyId', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.createGuest({
          partyId: 'not-a-uuid',
          firstName: 'John',
          lastName: 'Doe',
          isPrimary: false,
          isChild: false,
          dietaryRestrictions: null,
        })
      ).rejects.toThrow();
    });

    it('rejects createEvent with empty slug', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.createEvent({
          slug: '',
          name: 'Wedding',
          date: null,
          location: null,
          description: null,
          displayOrder: 0,
        })
      ).rejects.toThrow();
    });

    it('rejects bulkInvite with invalid partyId', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.bulkInvite({
          partyId: 'not-a-uuid',
          eventIds: [],
        })
      ).rejects.toThrow();
    });

    it('rejects bulkInvite with invalid eventIds', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.bulkInvite({
          partyId: '123e4567-e89b-12d3-a456-426614174000',
          eventIds: ['not-a-uuid'],
        })
      ).rejects.toThrow();
    });

    it('rejects updateParty with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.updateParty({
          id: 'not-a-uuid',
          name: 'Test Party',
          email: 'test@example.com',
          notes: null,
        })
      ).rejects.toThrow();
    });

    it('rejects updateGuest with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.updateGuest({
          id: 'not-a-uuid',
          firstName: 'John',
          lastName: 'Doe',
          isPrimary: false,
          isChild: false,
          dietaryRestrictions: null,
        })
      ).rejects.toThrow();
    });

    it('rejects updateEvent with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.updateEvent({
          id: 'not-a-uuid',
          slug: 'wedding',
          name: 'Wedding',
          date: null,
          location: null,
          description: null,
          displayOrder: 0,
        })
      ).rejects.toThrow();
    });

    it('rejects deleteGuest with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.deleteGuest({
          id: 'not-a-uuid',
        })
      ).rejects.toThrow();
    });

    it('rejects deleteEvent with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.deleteEvent({
          id: 'not-a-uuid',
        })
      ).rejects.toThrow();
    });

    it('rejects deleteSongRequest with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.deleteSongRequest({
          id: 'not-a-uuid',
        })
      ).rejects.toThrow();
    });

    it('rejects createGuest with empty firstName', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.createGuest({
          partyId: '123e4567-e89b-12d3-a456-426614174000',
          firstName: '',
          lastName: 'Doe',
          isPrimary: false,
          isChild: false,
          dietaryRestrictions: null,
        })
      ).rejects.toThrow();
    });

    it('rejects createGuest with empty lastName', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.createGuest({
          partyId: '123e4567-e89b-12d3-a456-426614174000',
          firstName: 'John',
          lastName: '',
          isPrimary: false,
          isChild: false,
          dietaryRestrictions: null,
        })
      ).rejects.toThrow();
    });

    it('rejects createEvent with empty name', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.createEvent({
          slug: 'wedding',
          name: '',
          date: null,
          location: null,
          description: null,
          displayOrder: 0,
        })
      ).rejects.toThrow();
    });

    it('rejects createInvitation with invalid partyId', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.createInvitation({
          partyId: 'not-a-uuid',
          eventId: '123e4567-e89b-12d3-a456-426614174000',
        })
      ).rejects.toThrow();
    });

    it('rejects createInvitation with invalid eventId', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.createInvitation({
          partyId: '123e4567-e89b-12d3-a456-426614174000',
          eventId: 'not-a-uuid',
        })
      ).rejects.toThrow();
    });

    it('rejects deleteInvitation with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1', isAdmin: true });

      await expect(
        caller.admin.deleteInvitation({
          id: 'not-a-uuid',
        })
      ).rejects.toThrow();
    });
  });
});
