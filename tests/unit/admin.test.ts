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

  describe('admin.login', () => {
    it('accepts correct admin password', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      const result = await caller.admin.login({ password: 'admin-secret-123' });
      expect(result.success).toBe(true);
    });

    it('rejects incorrect admin password', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.login({ password: 'wrong' })).rejects.toThrow(
        'Invalid admin password'
      );
    });

    it('is case-sensitive (unlike site password)', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.login({ password: 'ADMIN-SECRET-123' })).rejects.toThrow(
        'Invalid admin password'
      );
    });

    it('rejects empty password', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.login({ password: '' })).rejects.toThrow();
    });

    it('throws error when ADMIN_PASSWORD not configured', async () => {
      delete process.env.ADMIN_PASSWORD;
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.login({ password: 'test' })).rejects.toThrow(
        'Admin not configured'
      );
    });
  });

  describe('admin authentication on protected routes', () => {
    it('rejects requests without admin token', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.listParties({ adminToken: '' })).rejects.toThrow(
        'Invalid admin credentials'
      );
    });

    it('rejects requests with wrong admin token', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.listParties({ adminToken: 'wrong-token' })).rejects.toThrow(
        'Invalid admin credentials'
      );
    });

    it('rejects getDashboardStats without valid token', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.getDashboardStats({ adminToken: 'invalid' })).rejects.toThrow(
        'Invalid admin credentials'
      );
    });

    it('rejects listGuests without valid token', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.listGuests({ adminToken: 'invalid' })).rejects.toThrow(
        'Invalid admin credentials'
      );
    });

    it('rejects listEvents without valid token', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.listEvents({ adminToken: 'invalid' })).rejects.toThrow(
        'Invalid admin credentials'
      );
    });

    it('rejects listRsvps without valid token', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.listRsvps({ adminToken: 'invalid' })).rejects.toThrow(
        'Invalid admin credentials'
      );
    });

    it('rejects listSongRequests without valid token', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.listSongRequests({ adminToken: 'invalid' })).rejects.toThrow(
        'Invalid admin credentials'
      );
    });

    it('rejects createParty without valid token', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.createParty({
          adminToken: 'invalid',
          name: 'Test Party',
          email: 'test@example.com',
          notes: null,
        })
      ).rejects.toThrow('Invalid admin credentials');
    });

    it('rejects deleteParty without valid token', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.deleteParty({
          adminToken: 'invalid',
          id: '123e4567-e89b-12d3-a456-426614174000',
        })
      ).rejects.toThrow('Invalid admin credentials');
    });
  });

  describe('admin input validation', () => {
    it('rejects createParty with invalid email', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.createParty({
          adminToken: 'admin-secret-123',
          name: 'Test Party',
          email: 'not-an-email',
          notes: null,
        })
      ).rejects.toThrow();
    });

    it('rejects createParty with empty name', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.createParty({
          adminToken: 'admin-secret-123',
          name: '',
          email: 'test@example.com',
          notes: null,
        })
      ).rejects.toThrow();
    });

    it('rejects createGuest with invalid UUID for partyId', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.createGuest({
          adminToken: 'admin-secret-123',
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
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.createEvent({
          adminToken: 'admin-secret-123',
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
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.bulkInvite({
          adminToken: 'admin-secret-123',
          partyId: 'not-a-uuid',
          eventIds: [],
        })
      ).rejects.toThrow();
    });

    it('rejects bulkInvite with invalid eventIds', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.bulkInvite({
          adminToken: 'admin-secret-123',
          partyId: '123e4567-e89b-12d3-a456-426614174000',
          eventIds: ['not-a-uuid'],
        })
      ).rejects.toThrow();
    });

    it('rejects updateParty with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.updateParty({
          adminToken: 'admin-secret-123',
          id: 'not-a-uuid',
          name: 'Test Party',
          email: 'test@example.com',
          notes: null,
        })
      ).rejects.toThrow();
    });

    it('rejects updateGuest with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.updateGuest({
          adminToken: 'admin-secret-123',
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
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.updateEvent({
          adminToken: 'admin-secret-123',
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
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.deleteGuest({
          adminToken: 'admin-secret-123',
          id: 'not-a-uuid',
        })
      ).rejects.toThrow();
    });

    it('rejects deleteEvent with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.deleteEvent({
          adminToken: 'admin-secret-123',
          id: 'not-a-uuid',
        })
      ).rejects.toThrow();
    });

    it('rejects deleteSongRequest with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.deleteSongRequest({
          adminToken: 'admin-secret-123',
          id: 'not-a-uuid',
        })
      ).rejects.toThrow();
    });

    it('rejects createGuest with empty firstName', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.createGuest({
          adminToken: 'admin-secret-123',
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
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.createGuest({
          adminToken: 'admin-secret-123',
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
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.createEvent({
          adminToken: 'admin-secret-123',
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
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.createInvitation({
          adminToken: 'admin-secret-123',
          partyId: 'not-a-uuid',
          eventId: '123e4567-e89b-12d3-a456-426614174000',
        })
      ).rejects.toThrow();
    });

    it('rejects createInvitation with invalid eventId', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.createInvitation({
          adminToken: 'admin-secret-123',
          partyId: '123e4567-e89b-12d3-a456-426614174000',
          eventId: 'not-a-uuid',
        })
      ).rejects.toThrow();
    });

    it('rejects deleteInvitation with invalid UUID', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(
        caller.admin.deleteInvitation({
          adminToken: 'admin-secret-123',
          id: 'not-a-uuid',
        })
      ).rejects.toThrow();
    });
  });

  describe('admin token edge cases', () => {
    it('rejects null admin token', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      // @ts-expect-error Testing runtime behavior with null
      await expect(caller.admin.listParties({ adminToken: null })).rejects.toThrow();
    });

    it('rejects whitespace-only password for login', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      await expect(caller.admin.login({ password: '   ' })).rejects.toThrow(
        'Invalid admin password'
      );
    });

    it('does not trim password (exact match required)', async () => {
      const { appRouter } = await import('../../lib/trpc/router');
      const caller = appRouter.createCaller({ ip: '127.0.0.1' });

      // Password with leading/trailing spaces should not match
      await expect(caller.admin.login({ password: ' admin-secret-123 ' })).rejects.toThrow(
        'Invalid admin password'
      );
    });
  });
});
