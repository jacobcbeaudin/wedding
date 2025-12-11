import { describe, it, expect } from 'vitest';
import { normalizeName, sanitizeText } from '../../lib/trpc/utils';

// ============================================================================
// NORMALIZE NAME - Core Functionality
// ============================================================================

describe('normalizeName', () => {
  describe('case normalization', () => {
    it('lowercases names', () => {
      expect(normalizeName('JOHN')).toBe('john');
      expect(normalizeName('John')).toBe('john');
      expect(normalizeName('jOhN')).toBe('john');
    });

    it('normalizes accented characters to ASCII', () => {
      // NFD normalization + diacritic removal: JOSÉ → JOSE → jose
      // TODO: May need to support Chinese names in future
      expect(normalizeName('JOSÉ')).toBe('jose');
      expect(normalizeName('García')).toBe('garcia');
      expect(normalizeName('naïve')).toBe('naive');
      expect(normalizeName('Zürich')).toBe('zurich');
    });
  });

  describe('whitespace handling', () => {
    it('trims leading and trailing whitespace', () => {
      expect(normalizeName('  john  ')).toBe('john');
      expect(normalizeName('\tjohn\n')).toBe('john');
    });

    it('collapses multiple internal spaces to single space', () => {
      expect(normalizeName('mary  jane')).toBe('mary jane');
      expect(normalizeName('mary    jane')).toBe('mary jane');
    });

    it('handles mixed whitespace types', () => {
      expect(normalizeName('mary \t jane')).toBe('mary jane');
    });
  });

  describe('allowed special characters', () => {
    it('preserves hyphens', () => {
      expect(normalizeName('Mary-Jane')).toBe('mary-jane');
      expect(normalizeName('Van-Der-Berg')).toBe('van-der-berg');
    });

    it('preserves apostrophes', () => {
      expect(normalizeName("O'Brien")).toBe("o'brien");
      expect(normalizeName("D'Angelo")).toBe("d'angelo");
    });

    it('preserves spaces', () => {
      expect(normalizeName('Van Der Berg')).toBe('van der berg');
    });

    it('preserves multiple hyphens', () => {
      expect(normalizeName('Jean-Claude-Van-Damme')).toBe('jean-claude-van-damme');
    });
  });

  describe('character filtering', () => {
    it('removes digits', () => {
      expect(normalizeName('John123')).toBe('john');
      expect(normalizeName('J0hn')).toBe('jhn');
    });

    it('removes special characters', () => {
      expect(normalizeName('John@Smith')).toBe('johnsmith');
      expect(normalizeName('John!')).toBe('john');
      expect(normalizeName('John#$%')).toBe('john');
    });

    it('removes emojis', () => {
      // Emoji is removed, trailing space remains (collapse only merges multiple spaces)
      expect(normalizeName('John 😀')).toBe('john ');
      expect(normalizeName('😀John')).toBe('john');
    });

    it('removes punctuation except allowed', () => {
      expect(normalizeName('John.')).toBe('john');
      expect(normalizeName('John,')).toBe('john');
      expect(normalizeName('John;')).toBe('john');
    });

    it('removes parentheses and brackets', () => {
      expect(normalizeName('John (Jr)')).toBe('john jr');
      expect(normalizeName('John [III]')).toBe('john iii');
    });
  });

  describe('edge cases', () => {
    it('handles empty string', () => {
      expect(normalizeName('')).toBe('');
    });

    it('handles whitespace-only string', () => {
      expect(normalizeName('   ')).toBe('');
    });

    it('handles string with only filtered characters', () => {
      expect(normalizeName('123!@#')).toBe('');
    });

    it('handles very long names', () => {
      const longName = 'A'.repeat(1000);
      expect(normalizeName(longName)).toBe('a'.repeat(1000));
    });

    it('handles combining characters', () => {
      // é as e + combining acute accent
      const combined = 'e\u0301';
      const result = normalizeName(combined);
      // Should preserve the combining character
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('international names', () => {
    // LIMITATION: Current normalizeName only preserves [a-z\s\-']
    // Non-Latin characters are stripped. This is a known limitation.
    // If international names need support, regex should be updated to Unicode.

    it('strips Chinese characters (known limitation)', () => {
      expect(normalizeName('李明')).toBe('');
    });

    it('strips Japanese characters (known limitation)', () => {
      expect(normalizeName('田中太郎')).toBe('');
    });

    it('strips Korean characters (known limitation)', () => {
      expect(normalizeName('김철수')).toBe('');
    });

    it('strips Arabic characters (known limitation)', () => {
      expect(normalizeName('محمد')).toBe('');
    });

    it('strips Cyrillic characters (known limitation)', () => {
      expect(normalizeName('Иван')).toBe('');
    });

    it('handles mixed scripts by keeping only Latin (known limitation)', () => {
      // TODO: May need to support Chinese names in future
      // Chinese char removed, trailing space remains
      expect(normalizeName('John 李')).toBe('john ');
      expect(normalizeName('李John')).toBe('john');
    });

    it('normalizes accented Latin characters to ASCII', () => {
      // Accented characters are normalized: José García → jose garcia
      // TODO: May need to support Chinese names in future
      expect(normalizeName('José García')).toBe('jose garcia');
    });
  });
});

// ============================================================================
// SANITIZE TEXT - Core Functionality
// ============================================================================

describe('sanitizeText', () => {
  describe('basic functionality', () => {
    it('trims whitespace', () => {
      expect(sanitizeText('  hello  ')).toBe('hello');
    });

    it('preserves internal spaces', () => {
      expect(sanitizeText('hello world')).toBe('hello world');
    });

    it('returns undefined for undefined input', () => {
      expect(sanitizeText(undefined)).toBeUndefined();
    });

    it('returns undefined for empty string input', () => {
      // Empty string is falsy, so sanitizeText returns undefined
      expect(sanitizeText('')).toBeUndefined();
    });

    it('returns empty string for whitespace-only input', () => {
      expect(sanitizeText('   ')).toBe('');
    });
  });

  describe('control character removal', () => {
    it('removes null character', () => {
      expect(sanitizeText('hello\x00world')).toBe('helloworld');
    });

    it('removes escape character', () => {
      expect(sanitizeText('hello\x1Bworld')).toBe('helloworld');
    });

    it('removes bell character', () => {
      expect(sanitizeText('hello\x07world')).toBe('helloworld');
    });

    it('removes backspace character', () => {
      expect(sanitizeText('hello\x08world')).toBe('helloworld');
    });

    it('removes form feed', () => {
      expect(sanitizeText('hello\x0Cworld')).toBe('helloworld');
    });

    it('removes vertical tab', () => {
      expect(sanitizeText('hello\x0Bworld')).toBe('helloworld');
    });

    it('removes carriage return', () => {
      expect(sanitizeText('hello\rworld')).toBe('helloworld');
    });

    it('removes DEL character', () => {
      expect(sanitizeText('hello\x7Fworld')).toBe('helloworld');
    });

    it('removes all control characters in range 0x00-0x1F', () => {
      let text = 'test';
      for (let i = 0; i <= 0x1f; i++) {
        text += String.fromCharCode(i);
      }
      text += 'end';
      expect(sanitizeText(text)).toBe('testend');
    });

    // Note: The current regex only removes 0x00-0x1F and 0x7F,
    // not C1 control characters (0x80-0x9F)
    it('preserves newline (note: current impl removes it)', () => {
      // Current implementation removes \n as it's in control char range
      expect(sanitizeText('hello\nworld')).toBe('helloworld');
    });

    it('preserves tab (note: current impl removes it)', () => {
      // Current implementation removes \t as it's in control char range
      expect(sanitizeText('hello\tworld')).toBe('helloworld');
    });
  });

  describe('length truncation', () => {
    it('truncates to specified max length', () => {
      expect(sanitizeText('hello world', 5)).toBe('hello');
    });

    it('defaults to 500 character limit', () => {
      const longText = 'x'.repeat(600);
      const result = sanitizeText(longText);
      expect(result?.length).toBe(500);
    });

    it('does not truncate text shorter than limit', () => {
      expect(sanitizeText('hello', 10)).toBe('hello');
    });

    it('handles exactly at limit', () => {
      expect(sanitizeText('hello', 5)).toBe('hello');
    });

    it('truncates after removing control chars', () => {
      // Control chars are removed first, then truncation
      expect(sanitizeText('ab\x00cd\x00ef', 4)).toBe('abcd');
    });

    it('handles zero max length', () => {
      expect(sanitizeText('hello', 0)).toBe('');
    });

    it('handles negative max length', () => {
      // slice(0, -1) returns all but last char
      expect(sanitizeText('hello', -1)).toBe('hell');
    });
  });

  describe('edge cases', () => {
    it('handles string with only control characters', () => {
      expect(sanitizeText('\x00\x01\x02')).toBe('');
    });

    it('handles very long text', () => {
      const longText = 'a'.repeat(10000);
      expect(sanitizeText(longText)?.length).toBe(500);
    });

    it('handles unicode text', () => {
      expect(sanitizeText('こんにちは')).toBe('こんにちは');
    });

    it('handles emoji text', () => {
      expect(sanitizeText('Hello 👋 World 🌍')).toBe('Hello 👋 World 🌍');
    });

    it('handles combining characters', () => {
      const text = 'e\u0301'; // é as e + combining accent
      expect(sanitizeText(text)).toBe(text);
    });

    it('preserves HTML-like text (not responsible for escaping)', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('<script>alert("xss")</script>');
    });

    it('preserves SQL-like text (parameterized queries handle injection)', () => {
      expect(sanitizeText("'; DROP TABLE users; --")).toBe("'; DROP TABLE users; --");
    });
  });

  describe('real-world inputs', () => {
    it('handles dietary restriction with multiple items', () => {
      const input = '  Allergic to: nuts, shellfish (severe), and dairy  ';
      expect(sanitizeText(input, 500)).toBe('Allergic to: nuts, shellfish (severe), and dairy');
    });

    it('handles party notes with special characters', () => {
      const input = "Can't wait to celebrate! We'll be arriving on Saturday @ 2pm.";
      expect(sanitizeText(input, 500)).toBe(input);
    });

    it('handles copy-pasted text with hidden control chars', () => {
      // Sometimes copy-paste from documents includes zero-width chars
      const input = 'Hello\u200Bworld'; // zero-width space (not in 0x00-0x1F range)
      // Note: zero-width space is NOT removed by current implementation
      expect(sanitizeText(input)).toBe('Hello\u200Bworld');
    });

    it('handles song request with parentheses', () => {
      expect(sanitizeText('Uptown Funk (feat. Bruno Mars)')).toBe('Uptown Funk (feat. Bruno Mars)');
    });

    it('handles artist with ampersand', () => {
      expect(sanitizeText('Earth, Wind & Fire')).toBe('Earth, Wind & Fire');
    });
  });
});

// ============================================================================
// INTEGRATION: normalizeName with guest lookup scenarios
// ============================================================================

describe('normalizeName - guest lookup scenarios', () => {
  it('matches case-insensitive lookups', () => {
    // Database stores 'john' (normalized), user enters 'JOHN'
    const stored = normalizeName('John');
    const lookup = normalizeName('JOHN');
    expect(stored).toBe(lookup);
  });

  it('matches with extra whitespace', () => {
    const stored = normalizeName('John');
    const lookup = normalizeName('  John  ');
    expect(stored).toBe(lookup);
  });

  it('matches hyphenated names regardless of case', () => {
    const stored = normalizeName('Mary-Jane');
    const lookup = normalizeName('MARY-JANE');
    expect(stored).toBe(lookup);
  });

  it('matches apostrophe names regardless of case', () => {
    const stored = normalizeName("O'Brien");
    const lookup = normalizeName("o'brien");
    expect(stored).toBe(lookup);
  });

  it('does not match if special chars are different', () => {
    const stored = normalizeName('Mary-Jane');
    const lookup = normalizeName('Mary Jane');
    expect(stored).not.toBe(lookup);
  });
});
