import { describe, it, expect } from 'vitest';
import {
  lookupGuestSchema,
  getPartySchema,
  submitRsvpSchema,
  rsvpResponseSchema,
  dietaryUpdateSchema,
  songRequestSchema,
} from '../../lib/validations/rsvp';
import { MEAL_OPTIONS } from '../../lib/config/meals';
import { MAX_SONG_REQUESTS, MAX_NOTES_LENGTH } from '../../lib/config/rsvp';

describe('lookupGuestSchema', () => {
  it('accepts valid first and last name', () => {
    const result = lookupGuestSchema.safeParse({
      firstName: 'John',
      lastName: 'Smith',
    });
    expect(result.success).toBe(true);
  });

  it('trims whitespace from names', () => {
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

  it('rejects empty first name', () => {
    const result = lookupGuestSchema.safeParse({
      firstName: '',
      lastName: 'Smith',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty last name', () => {
    const result = lookupGuestSchema.safeParse({
      firstName: 'John',
      lastName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = lookupGuestSchema.safeParse({
      firstName: 'John',
    });
    expect(result.success).toBe(false);
  });
});

describe('getPartySchema', () => {
  it('accepts valid UUID', () => {
    const result = getPartySchema.safeParse({
      partyId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUID', () => {
    const result = getPartySchema.safeParse({
      partyId: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });
});

describe('rsvpResponseSchema', () => {
  const validGuestId = '550e8400-e29b-41d4-a716-446655440000';
  const validEventId = '550e8400-e29b-41d4-a716-446655440001';

  it('accepts valid attending response', () => {
    const result = rsvpResponseSchema.safeParse({
      guestId: validGuestId,
      eventId: validEventId,
      status: 'attending',
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid declined response', () => {
    const result = rsvpResponseSchema.safeParse({
      guestId: validGuestId,
      eventId: validEventId,
      status: 'declined',
    });
    expect(result.success).toBe(true);
  });

  it('accepts attending response with valid meal choice', () => {
    const result = rsvpResponseSchema.safeParse({
      guestId: validGuestId,
      eventId: validEventId,
      status: 'attending',
      mealChoice: MEAL_OPTIONS[0], // 'Fish'
    });
    expect(result.success).toBe(true);
  });

  it('accepts all valid meal choices', () => {
    for (const meal of MEAL_OPTIONS) {
      const result = rsvpResponseSchema.safeParse({
        guestId: validGuestId,
        eventId: validEventId,
        status: 'attending',
        mealChoice: meal,
      });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid meal choice', () => {
    const result = rsvpResponseSchema.safeParse({
      guestId: validGuestId,
      eventId: validEventId,
      status: 'attending',
      mealChoice: 'Pasta',
    });
    expect(result.success).toBe(false);
  });

  it('accepts null meal choice', () => {
    const result = rsvpResponseSchema.safeParse({
      guestId: validGuestId,
      eventId: validEventId,
      status: 'attending',
      mealChoice: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid status', () => {
    const result = rsvpResponseSchema.safeParse({
      guestId: validGuestId,
      eventId: validEventId,
      status: 'maybe',
    });
    expect(result.success).toBe(false);
  });

  it('rejects pending status (only attending/declined allowed)', () => {
    const result = rsvpResponseSchema.safeParse({
      guestId: validGuestId,
      eventId: validEventId,
      status: 'pending',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid guestId', () => {
    const result = rsvpResponseSchema.safeParse({
      guestId: 'not-a-uuid',
      eventId: validEventId,
      status: 'attending',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid eventId', () => {
    const result = rsvpResponseSchema.safeParse({
      guestId: validGuestId,
      eventId: 'not-a-uuid',
      status: 'attending',
    });
    expect(result.success).toBe(false);
  });
});

describe('dietaryUpdateSchema', () => {
  const validGuestId = '550e8400-e29b-41d4-a716-446655440000';

  it('accepts valid dietary update', () => {
    const result = dietaryUpdateSchema.safeParse({
      guestId: validGuestId,
      dietaryRestrictions: 'Vegetarian',
    });
    expect(result.success).toBe(true);
  });

  it('accepts null dietary restrictions', () => {
    const result = dietaryUpdateSchema.safeParse({
      guestId: validGuestId,
      dietaryRestrictions: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty string dietary restrictions', () => {
    const result = dietaryUpdateSchema.safeParse({
      guestId: validGuestId,
      dietaryRestrictions: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects dietary restrictions over 500 characters', () => {
    const result = dietaryUpdateSchema.safeParse({
      guestId: validGuestId,
      dietaryRestrictions: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid guestId', () => {
    const result = dietaryUpdateSchema.safeParse({
      guestId: 'not-a-uuid',
      dietaryRestrictions: 'Vegetarian',
    });
    expect(result.success).toBe(false);
  });
});

describe('songRequestSchema', () => {
  it('accepts valid song request', () => {
    const result = songRequestSchema.safeParse({
      song: 'Dancing Queen',
      artist: 'ABBA',
    });
    expect(result.success).toBe(true);
  });

  it('accepts song request without artist', () => {
    const result = songRequestSchema.safeParse({
      song: 'Dancing Queen',
    });
    expect(result.success).toBe(true);
  });

  it('accepts song request with null artist', () => {
    const result = songRequestSchema.safeParse({
      song: 'Dancing Queen',
      artist: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty song name', () => {
    const result = songRequestSchema.safeParse({
      song: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects song name over 200 characters', () => {
    const result = songRequestSchema.safeParse({
      song: 'x'.repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it('rejects artist over 200 characters', () => {
    const result = songRequestSchema.safeParse({
      song: 'Dancing Queen',
      artist: 'x'.repeat(201),
    });
    expect(result.success).toBe(false);
  });
});

describe('submitRsvpSchema', () => {
  const validPartyId = '550e8400-e29b-41d4-a716-446655440000';
  const validGuestId = '550e8400-e29b-41d4-a716-446655440001';
  const validEventId = '550e8400-e29b-41d4-a716-446655440002';

  it('accepts valid RSVP submission', () => {
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
    });
    expect(result.success).toBe(true);
  });

  it('accepts RSVP with meal choice', () => {
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [
        {
          guestId: validGuestId,
          eventId: validEventId,
          status: 'attending',
          mealChoice: 'Fish',
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('accepts RSVP with dietary updates', () => {
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
      dietaryUpdates: [{ guestId: validGuestId, dietaryRestrictions: 'Vegetarian' }],
    });
    expect(result.success).toBe(true);
  });

  it('accepts RSVP with song requests (party-level, no guestId)', () => {
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
      songRequests: [{ song: 'Dancing Queen', artist: 'ABBA' }],
    });
    expect(result.success).toBe(true);
  });

  it('accepts RSVP with notes', () => {
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
      notes: "Can't wait to celebrate with you!",
    });
    expect(result.success).toBe(true);
  });

  it('accepts RSVP with null notes', () => {
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
      notes: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty rsvps array', () => {
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid partyId', () => {
    const result = submitRsvpSchema.safeParse({
      partyId: 'not-a-uuid',
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
    });
    expect(result.success).toBe(false);
  });

  it(`rejects more than ${MAX_SONG_REQUESTS} song requests`, () => {
    const tooManySongs = Array(MAX_SONG_REQUESTS + 1)
      .fill(null)
      .map((_, i) => ({ song: `Song ${i}` }));

    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
      songRequests: tooManySongs,
    });
    expect(result.success).toBe(false);
  });

  it(`accepts exactly ${MAX_SONG_REQUESTS} song requests`, () => {
    const maxSongs = Array(MAX_SONG_REQUESTS)
      .fill(null)
      .map((_, i) => ({ song: `Song ${i}` }));

    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
      songRequests: maxSongs,
    });
    expect(result.success).toBe(true);
  });

  it(`rejects notes over ${MAX_NOTES_LENGTH} characters`, () => {
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
      notes: 'x'.repeat(MAX_NOTES_LENGTH + 1),
    });
    expect(result.success).toBe(false);
  });

  it('defaults dietaryUpdates to empty array', () => {
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dietaryUpdates).toEqual([]);
    }
  });

  it('defaults songRequests to empty array', () => {
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [{ guestId: validGuestId, eventId: validEventId, status: 'attending' }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.songRequests).toEqual([]);
    }
  });

  it('accepts multiple guests with different statuses', () => {
    const guestId2 = '550e8400-e29b-41d4-a716-446655440003';
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [
        { guestId: validGuestId, eventId: validEventId, status: 'attending' },
        { guestId: guestId2, eventId: validEventId, status: 'declined' },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('accepts multiple events for same guest', () => {
    const eventId2 = '550e8400-e29b-41d4-a716-446655440004';
    const result = submitRsvpSchema.safeParse({
      partyId: validPartyId,
      rsvps: [
        {
          guestId: validGuestId,
          eventId: validEventId,
          status: 'attending',
          mealChoice: 'Fish',
        },
        { guestId: validGuestId, eventId: eventId2, status: 'declined' },
      ],
    });
    expect(result.success).toBe(true);
  });
});
