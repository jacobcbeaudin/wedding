/**
 * Normalize a name for consistent database storage and lookup.
 * - Trims whitespace
 * - Lowercases for case-insensitive matching
 * - Removes extra internal whitespace
 * - Removes non-letter characters except spaces, hyphens, and apostrophes
 */
export function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .replace(/[^a-z\s\-']/gi, ''); // keep letters, spaces, hyphens, apostrophes
}

/**
 * Capitalize name properly for display (e.g., "mary-jane o'brien" -> "Mary-Jane O'Brien")
 */
export function capitalizeName(name: string): string {
  return name
    .split(/(\s+|-)/g)
    .map((part) => {
      if (part === ' ' || part === '-') return part;
      // Handle apostrophes: O'Brien -> O'Brien
      if (part.includes("'")) {
        const [before, after] = part.split("'");
        return capitalize(before) + "'" + capitalize(after);
      }
      return capitalize(part);
    })
    .join('');
}

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Sanitize free-text input (dietary restrictions, song requests)
 * - Trims whitespace
 * - Removes control characters
 * - Limits length
 */
export function sanitizeText(
  text: string | undefined,
  maxLength: number = 500
): string | undefined {
  if (!text) return undefined;

  return (
    text
      .trim()
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F]/g, '') // remove control characters
      .slice(0, maxLength)
  );
}
