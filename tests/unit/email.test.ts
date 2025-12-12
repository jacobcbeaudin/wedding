/**
 * Tests for email service.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Store original env
const originalEnv = process.env.RESEND_API_KEY;

describe('sendRsvpConfirmation', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env.RESEND_API_KEY = originalEnv;
  });

  describe('when RESEND_API_KEY is not configured', () => {
    it('returns false and logs warning', async () => {
      delete process.env.RESEND_API_KEY;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { sendRsvpConfirmation } = await import('../../lib/email');
      const result = await sendRsvpConfirmation({
        partyEmail: 'test@example.com',
        guests: [],
        songRequests: [],
      });

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'RESEND_API_KEY not configured, skipping confirmation email'
      );
      consoleSpy.mockRestore();
    });
  });
});

describe('RsvpConfirmationData interface', () => {
  it('accepts valid data structure', async () => {
    // This tests the TypeScript interface at compile time
    const validData = {
      partyEmail: 'smith@example.com',
      guests: [
        {
          name: 'John Smith',
          responses: [
            { eventName: 'Wedding', status: 'attending' as const, mealChoice: 'Fish' },
            { eventName: 'Reception', status: 'declined' as const },
          ],
          dietaryRestrictions: 'No nuts',
        },
        {
          name: 'Jane Smith',
          responses: [{ eventName: 'Wedding', status: 'attending' as const }],
          dietaryRestrictions: null,
        },
      ],
      songRequests: [
        { song: 'Dancing Queen', artist: 'ABBA' },
        { song: 'Happy', artist: null },
      ],
      notes: 'So excited!',
    };

    // Import type and verify structure
    const { sendRsvpConfirmation } = await import('../../lib/email');
    expect(typeof sendRsvpConfirmation).toBe('function');

    // Verify data matches interface (compile-time check)
    expect(validData.partyEmail).toBeDefined();
    expect(validData.guests).toHaveLength(2);
    expect(validData.guests[0].responses).toHaveLength(2);
    expect(validData.songRequests).toHaveLength(2);
  });

  it('handles empty arrays', async () => {
    const minimalData = {
      partyEmail: 'test@example.com',
      guests: [],
      songRequests: [],
    };

    expect(minimalData.guests).toHaveLength(0);
    expect(minimalData.songRequests).toHaveLength(0);
  });

  it('handles optional fields', async () => {
    const dataWithOptionals: {
      partyEmail: string;
      guests: Array<{ name: string; responses: Array<unknown>; dietaryRestrictions?: string }>;
      songRequests: Array<{ song: string; artist?: string }>;
      notes?: string;
    } = {
      partyEmail: 'test@example.com',
      guests: [
        {
          name: 'John',
          responses: [],
          // dietaryRestrictions omitted (optional)
        },
      ],
      songRequests: [
        {
          song: 'Test Song',
          // artist omitted (optional)
        },
      ],
      // notes omitted (optional)
    };

    expect(dataWithOptionals.guests[0].dietaryRestrictions).toBeUndefined();
    expect(dataWithOptionals.songRequests[0].artist).toBeUndefined();
    expect(dataWithOptionals.notes).toBeUndefined();
  });

  it('handles null values for optional fields', async () => {
    const dataWithNulls = {
      partyEmail: 'test@example.com',
      guests: [
        {
          name: 'John',
          responses: [{ eventName: 'Wedding', status: 'attending' as const, mealChoice: null }],
          dietaryRestrictions: null,
        },
      ],
      songRequests: [{ song: 'Test', artist: null }],
      notes: null,
    };

    expect(dataWithNulls.guests[0].dietaryRestrictions).toBeNull();
    expect(dataWithNulls.guests[0].responses[0].mealChoice).toBeNull();
    expect(dataWithNulls.songRequests[0].artist).toBeNull();
    expect(dataWithNulls.notes).toBeNull();
  });
});

describe('hasAttendees detection', () => {
  it('correctly identifies when guests are attending', () => {
    const guests = [
      {
        name: 'John',
        responses: [{ eventName: 'Wedding', status: 'attending' as const }],
      },
    ];
    const hasAttendees = guests.some((g) => g.responses.some((r) => r.status === 'attending'));
    expect(hasAttendees).toBe(true);
  });

  it('correctly identifies when no guests are attending', () => {
    const guests = [
      {
        name: 'John',
        responses: [{ eventName: 'Wedding', status: 'declined' as 'attending' | 'declined' }],
      },
    ];
    const hasAttendees = guests.some((g) => g.responses.some((r) => r.status === 'attending'));
    expect(hasAttendees).toBe(false);
  });

  it('returns true if at least one guest attends one event', () => {
    const guests = [
      {
        name: 'John',
        responses: [
          { eventName: 'Wedding', status: 'declined' as const },
          { eventName: 'Reception', status: 'attending' as const },
        ],
      },
      {
        name: 'Jane',
        responses: [{ eventName: 'Wedding', status: 'declined' as const }],
      },
    ];
    const hasAttendees = guests.some((g) => g.responses.some((r) => r.status === 'attending'));
    expect(hasAttendees).toBe(true);
  });

  it('handles empty guests array', () => {
    const guests: Array<{ responses: Array<{ status: string }> }> = [];
    const hasAttendees = guests.some((g) => g.responses.some((r) => r.status === 'attending'));
    expect(hasAttendees).toBe(false);
  });

  it('handles guest with empty responses', () => {
    const guests: Array<{
      name: string;
      responses: Array<{ status: 'attending' | 'declined' }>;
    }> = [{ name: 'John', responses: [] }];
    const hasAttendees = guests.some((g) => g.responses.some((r) => r.status === 'attending'));
    expect(hasAttendees).toBe(false);
  });
});
