/**
 * Text sanitization utilities.
 */

/**
 * Normalize a name for case-insensitive comparison.
 * - Removes diacritical marks (accents): José → Jose, García → Garcia
 * - Lowercases: JOHN → john
 * - Collapses whitespace: "Mary  Jane" → "Mary Jane"
 * - Removes non-ASCII except hyphens and apostrophes
 *
 * TODO: May need to support Chinese names in future (would require
 * updating the regex to allow Unicode letter characters).
 */
export function normalizeName(name: string): string {
  return (
    name
      .trim()
      // NFD decomposition separates base char from combining marks: é → e + ́
      .normalize('NFD')
      // Remove combining diacritical marks (accents, umlauts, etc.)
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      // Only allow ASCII letters, spaces, hyphens, apostrophes
      .replace(/[^a-z\s\-']/gi, '')
  );
}

/**
 * Sanitize user-provided text by removing control characters
 * and trimming to max length.
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
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .slice(0, maxLength)
  );
}
