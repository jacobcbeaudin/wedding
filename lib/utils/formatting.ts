/**
 * Name formatting utilities.
 */

import type { GuestPublic } from '@/lib/validations/rsvp';

/**
 * Capitalize a name, handling spaces, hyphens, and apostrophes.
 * Examples:
 *   "john" -> "John"
 *   "mary-jane" -> "Mary-Jane"
 *   "o'brien" -> "O'Brien"
 */
export function capitalizeName(name: string): string {
  return name
    .split(/(\s+|-)/g)
    .map((part) => {
      if (part === ' ' || part === '-') return part;
      if (part.includes("'")) {
        const [before, after] = part.split("'");
        return (
          before.charAt(0).toUpperCase() +
          before.slice(1) +
          "'" +
          (after.charAt(0).toUpperCase() + after.slice(1))
        );
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
}

/**
 * Format a guest's full name with proper capitalization.
 */
export function formatGuestName(guest: GuestPublic): string {
  return `${capitalizeName(guest.firstName)} ${capitalizeName(guest.lastName)}`;
}
