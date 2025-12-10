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

describe('normalizeName', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  });

  it('lowercases names', async () => {
    const { normalizeName } = await import('../../api/trpc/[trpc]');
    expect(normalizeName('JOHN')).toBe('john');
    expect(normalizeName('John')).toBe('john');
  });

  it('trims whitespace', async () => {
    const { normalizeName } = await import('../../api/trpc/[trpc]');
    expect(normalizeName('  john  ')).toBe('john');
  });

  it('collapses multiple spaces', async () => {
    const { normalizeName } = await import('../../api/trpc/[trpc]');
    expect(normalizeName('mary  jane')).toBe('mary jane');
  });

  it('preserves hyphens', async () => {
    const { normalizeName } = await import('../../api/trpc/[trpc]');
    expect(normalizeName('Mary-Jane')).toBe('mary-jane');
  });

  it('preserves apostrophes', async () => {
    const { normalizeName } = await import('../../api/trpc/[trpc]');
    expect(normalizeName("O'Brien")).toBe("o'brien");
  });

  it('removes special characters except allowed ones', async () => {
    const { normalizeName } = await import('../../api/trpc/[trpc]');
    expect(normalizeName('John@Smith')).toBe('johnsmith');
    expect(normalizeName('John123')).toBe('john');
    expect(normalizeName('John!')).toBe('john');
  });

  it('handles empty string', async () => {
    const { normalizeName } = await import('../../api/trpc/[trpc]');
    expect(normalizeName('')).toBe('');
  });
});

describe('sanitizeText', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  });

  it('trims whitespace', async () => {
    const { sanitizeText } = await import('../../api/trpc/[trpc]');
    expect(sanitizeText('  hello  ')).toBe('hello');
  });

  it('removes control characters', async () => {
    const { sanitizeText } = await import('../../api/trpc/[trpc]');
    expect(sanitizeText('hello\x00world')).toBe('helloworld');
    expect(sanitizeText('test\x1Fvalue')).toBe('testvalue');
  });

  it('truncates to max length', async () => {
    const { sanitizeText } = await import('../../api/trpc/[trpc]');
    expect(sanitizeText('hello world', 5)).toBe('hello');
  });

  it('returns undefined for undefined input', async () => {
    const { sanitizeText } = await import('../../api/trpc/[trpc]');
    expect(sanitizeText(undefined)).toBeUndefined();
  });

  it('returns empty string for whitespace-only input', async () => {
    const { sanitizeText } = await import('../../api/trpc/[trpc]');
    expect(sanitizeText('   ')).toBe('');
  });

  it('defaults to 500 character limit', async () => {
    const { sanitizeText } = await import('../../api/trpc/[trpc]');
    const longText = 'x'.repeat(600);
    expect(sanitizeText(longText)?.length).toBe(500);
  });
});
