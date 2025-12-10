/**
 * RSVP configuration.
 */

/**
 * RSVP deadline - guests cannot submit after this date.
 * Set to null to disable deadline.
 */
export const RSVP_DEADLINE: Date | null = new Date('2026-08-15');

/**
 * Maximum song requests per party.
 */
export const MAX_SONG_REQUESTS = 3;

/**
 * Maximum character length for party notes.
 */
export const MAX_NOTES_LENGTH = 500;
