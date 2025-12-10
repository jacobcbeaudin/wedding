import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock database modules to allow importing from the handler
vi.mock('drizzle-orm/neon-http', () => ({
  drizzle: vi.fn(() => ({})),
}));
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => vi.fn()),
}));
vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: vi.fn(),
}));
vi.mock('@upstash/redis', () => ({
  Redis: { fromEnv: vi.fn() },
}));

describe('lookupGuestSchema', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  });

  it('accepts valid first and last name', async () => {
    const { lookupGuestSchema } = await import('../../api/trpc/[trpc]');
    const result = lookupGuestSchema.safeParse({
      firstName: 'John',
      lastName: 'Smith',
    });
    expect(result.success).toBe(true);
  });

  it('trims whitespace from names', async () => {
    const { lookupGuestSchema } = await import('../../api/trpc/[trpc]');
    const result = lookupGuestSchema.safeParse({
      firstName: '  John  ',
      lastName: '  Smith  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe('John');
      expect(result.data.lastName).toBe('Smith');
    }
  });

  it('rejects empty first name', async () => {
    const { lookupGuestSchema } = await import('../../api/trpc/[trpc]');
    const result = lookupGuestSchema.safeParse({
      firstName: '',
      lastName: 'Smith',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty last name', async () => {
    const { lookupGuestSchema } = await import('../../api/trpc/[trpc]');
    const result = lookupGuestSchema.safeParse({
      firstName: 'John',
      lastName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', async () => {
    const { lookupGuestSchema } = await import('../../api/trpc/[trpc]');
    const result = lookupGuestSchema.safeParse({
      firstName: 'John',
    });
    expect(result.success).toBe(false);
  });
});

describe('submitRsvpSchema', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  });

  it('accepts valid RSVP submission', async () => {
    const { submitRsvpSchema } = await import('../../api/trpc/[trpc]');
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      weddingStatus: 'attending',
      dietaryRestrictions: 'Vegetarian',
      songRequests: 'Dancing Queen',
    });
    expect(result.success).toBe(true);
  });

  it('accepts minimal RSVP with just guestId', async () => {
    const { submitRsvpSchema } = await import('../../api/trpc/[trpc]');
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUID for guestId', async () => {
    const { submitRsvpSchema } = await import('../../api/trpc/[trpc]');
    const result = submitRsvpSchema.safeParse({
      guestId: 'not-a-uuid',
      weddingStatus: 'attending',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid RSVP status', async () => {
    const { submitRsvpSchema } = await import('../../api/trpc/[trpc]');
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      weddingStatus: 'maybe',
    });
    expect(result.success).toBe(false);
  });

  it('accepts attending status', async () => {
    const { submitRsvpSchema } = await import('../../api/trpc/[trpc]');
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      teaCeremonyStatus: 'attending',
      welcomePartyStatus: 'attending',
      weddingStatus: 'attending',
    });
    expect(result.success).toBe(true);
  });

  it('accepts declined status', async () => {
    const { submitRsvpSchema } = await import('../../api/trpc/[trpc]');
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      teaCeremonyStatus: 'declined',
      welcomePartyStatus: 'declined',
      weddingStatus: 'declined',
    });
    expect(result.success).toBe(true);
  });

  it('rejects dietary restrictions over 500 characters', async () => {
    const { submitRsvpSchema } = await import('../../api/trpc/[trpc]');
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      dietaryRestrictions: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('rejects song requests over 500 characters', async () => {
    const { submitRsvpSchema } = await import('../../api/trpc/[trpc]');
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      songRequests: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
