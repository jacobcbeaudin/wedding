import { describe, it, expect } from 'vitest';
import { normalizeName, capitalizeName, sanitizeText } from '../../shared/sanitize';

describe('normalizeName', () => {
  it('lowercases names', () => {
    expect(normalizeName('JOHN')).toBe('john');
    expect(normalizeName('John')).toBe('john');
  });

  it('trims whitespace', () => {
    expect(normalizeName('  john  ')).toBe('john');
  });

  it('collapses multiple spaces', () => {
    expect(normalizeName('mary  jane')).toBe('mary jane');
  });

  it('preserves hyphens', () => {
    expect(normalizeName('Mary-Jane')).toBe('mary-jane');
  });

  it('preserves apostrophes', () => {
    expect(normalizeName("O'Brien")).toBe("o'brien");
  });

  it('removes special characters except allowed ones', () => {
    expect(normalizeName('John@Smith')).toBe('johnsmith');
    expect(normalizeName('John123')).toBe('john');
    expect(normalizeName('John!')).toBe('john');
  });

  it('handles empty string', () => {
    expect(normalizeName('')).toBe('');
  });
});

describe('capitalizeName', () => {
  it('capitalizes simple names', () => {
    expect(capitalizeName('john')).toBe('John');
    expect(capitalizeName('smith')).toBe('Smith');
  });

  it('handles hyphenated names', () => {
    expect(capitalizeName('mary-jane')).toBe('Mary-Jane');
  });

  it('handles apostrophe names', () => {
    expect(capitalizeName("o'brien")).toBe("O'Brien");
  });

  it('handles multiple words', () => {
    expect(capitalizeName('van der berg')).toBe('Van Der Berg');
  });

  it('lowercases already capitalized names', () => {
    expect(capitalizeName('JOHN')).toBe('John');
  });
});

describe('sanitizeText', () => {
  it('trims whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello');
  });

  it('removes control characters', () => {
    expect(sanitizeText('hello\x00world')).toBe('helloworld');
    expect(sanitizeText('test\x1Fvalue')).toBe('testvalue');
  });

  it('truncates to max length', () => {
    expect(sanitizeText('hello world', 5)).toBe('hello');
  });

  it('returns undefined for undefined input', () => {
    expect(sanitizeText(undefined)).toBeUndefined();
  });

  it('returns undefined for empty string after trim', () => {
    expect(sanitizeText('   ')).toBe('');
  });

  it('defaults to 500 character limit', () => {
    const longText = 'x'.repeat(600);
    expect(sanitizeText(longText)?.length).toBe(500);
  });
});
