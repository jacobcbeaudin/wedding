import { describe, it, expect } from 'vitest';
import { lookupGuestSchema, submitRsvpSchema } from '../../shared/schema';

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

describe('submitRsvpSchema', () => {
  it('accepts valid RSVP submission', () => {
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      weddingStatus: 'attending',
      dietaryRestrictions: 'Vegetarian',
      songRequests: 'Dancing Queen',
    });
    expect(result.success).toBe(true);
  });

  it('accepts minimal RSVP with just guestId', () => {
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUID for guestId', () => {
    const result = submitRsvpSchema.safeParse({
      guestId: 'not-a-uuid',
      weddingStatus: 'attending',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid RSVP status', () => {
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      weddingStatus: 'maybe',
    });
    expect(result.success).toBe(false);
  });

  it('accepts attending status', () => {
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      teaCeremonyStatus: 'attending',
      welcomePartyStatus: 'attending',
      weddingStatus: 'attending',
    });
    expect(result.success).toBe(true);
  });

  it('accepts declined status', () => {
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      teaCeremonyStatus: 'declined',
      welcomePartyStatus: 'declined',
      weddingStatus: 'declined',
    });
    expect(result.success).toBe(true);
  });

  it('rejects dietary restrictions over 500 characters', () => {
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      dietaryRestrictions: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('rejects song requests over 500 characters', () => {
    const result = submitRsvpSchema.safeParse({
      guestId: '550e8400-e29b-41d4-a716-446655440000',
      songRequests: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
