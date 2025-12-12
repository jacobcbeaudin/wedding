import { describe, it, expect } from 'vitest';
import { TRPCError } from '@trpc/server';

/**
 * Tests for the tRPC error formatter logic.
 *
 * The error formatter in lib/trpc/init.ts hides unhandled errors (database
 * failures, etc.) from clients while preserving user-friendly error messages.
 *
 * IMPORTANT: The errorFormatter only runs in HTTP context (via fetchRequestHandler),
 * NOT when using createCaller(). This is intentional per tRPC design.
 * See: https://github.com/trpc/trpc/issues/4120
 *
 * These tests verify the formatter logic directly. E2E tests verify the full
 * HTTP flow.
 */

// Recreate the error formatter logic from lib/trpc/init.ts for unit testing
function shouldHideError(error: TRPCError): boolean {
  // Hide unhandled errors: INTERNAL_SERVER_ERROR with a cause
  // Preserve intentional errors: any code without cause, or non-INTERNAL codes
  return error.code === 'INTERNAL_SERVER_ERROR' && error.cause instanceof Error;
}

function formatErrorMessage(error: TRPCError): string {
  return shouldHideError(error) ? 'Something went wrong. Please try again later.' : error.message;
}

describe('tRPC error formatter logic', () => {
  describe('unhandled error hiding', () => {
    it('hides database query errors (INTERNAL_SERVER_ERROR with cause)', () => {
      // Simulate how tRPC wraps unhandled errors
      const dbError = new Error(
        'Failed query: SELECT * FROM guests WHERE unaccent(first_name) = $1\nparams: test'
      );
      const wrappedError = new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: dbError.message,
        cause: dbError,
      });

      expect(shouldHideError(wrappedError)).toBe(true);
      expect(formatErrorMessage(wrappedError)).toBe(
        'Something went wrong. Please try again later.'
      );
    });

    it('hides connection errors', () => {
      const connError = new Error('ECONNREFUSED: Connection refused to localhost:5432');
      const wrappedError = new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: connError.message,
        cause: connError,
      });

      expect(shouldHideError(wrappedError)).toBe(true);
      const message = formatErrorMessage(wrappedError);
      expect(message).not.toContain('ECONNREFUSED');
      expect(message).not.toContain('5432');
    });

    it('hides missing extension errors', () => {
      const extError = new Error('function unaccent(character varying) does not exist');
      const wrappedError = new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: extError.message,
        cause: extError,
      });

      expect(shouldHideError(wrappedError)).toBe(true);
      expect(formatErrorMessage(wrappedError)).not.toContain('unaccent');
    });
  });

  describe('intentional error preservation', () => {
    it('preserves INTERNAL_SERVER_ERROR without cause (intentional)', () => {
      // Example: "Admin not configured" is intentionally thrown without cause
      const error = new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Admin not configured',
      });

      expect(shouldHideError(error)).toBe(false);
      expect(formatErrorMessage(error)).toBe('Admin not configured');
    });

    it('preserves NOT_FOUND messages', () => {
      const error = new TRPCError({
        code: 'NOT_FOUND',
        message: "We couldn't find your name on the guest list.",
      });

      expect(shouldHideError(error)).toBe(false);
      expect(formatErrorMessage(error)).toBe("We couldn't find your name on the guest list.");
    });

    it('preserves BAD_REQUEST messages', () => {
      const error = new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Please enter a valid first and last name.',
      });

      expect(shouldHideError(error)).toBe(false);
      expect(formatErrorMessage(error)).toBe('Please enter a valid first and last name.');
    });

    it('preserves FORBIDDEN messages', () => {
      const error = new TRPCError({
        code: 'FORBIDDEN',
        message: 'The RSVP deadline has passed.',
      });

      expect(shouldHideError(error)).toBe(false);
      expect(formatErrorMessage(error)).toBe('The RSVP deadline has passed.');
    });

    it('preserves UNAUTHORIZED messages', () => {
      const error = new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid admin credentials',
      });

      expect(shouldHideError(error)).toBe(false);
      expect(formatErrorMessage(error)).toBe('Invalid admin credentials');
    });

    it('preserves non-INTERNAL errors even with cause', () => {
      // Edge case: NOT_FOUND with a cause should still show message
      const originalError = new Error('DB returned null');
      const error = new TRPCError({
        code: 'NOT_FOUND',
        message: 'Guest not found',
        cause: originalError,
      });

      expect(shouldHideError(error)).toBe(false);
      expect(formatErrorMessage(error)).toBe('Guest not found');
    });
  });

  describe('sensitive data protection', () => {
    it('never exposes SQL queries in error messages', () => {
      const queries = [
        'SELECT id, party_id, first_name FROM guests',
        'INSERT INTO rsvps (guest_id, status) VALUES ($1, $2)',
        'UPDATE parties SET submitted_at = NOW()',
        'DELETE FROM song_requests WHERE party_id = $1',
      ];

      for (const query of queries) {
        const dbError = new Error(`Failed query: ${query}`);
        const wrappedError = new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: dbError.message,
          cause: dbError,
        });

        const message = formatErrorMessage(wrappedError);
        expect(message).not.toContain('SELECT');
        expect(message).not.toContain('INSERT');
        expect(message).not.toContain('UPDATE');
        expect(message).not.toContain('DELETE');
        expect(message).not.toContain('guests');
        expect(message).not.toContain('parties');
      }
    });

    it('never exposes connection strings', () => {
      const connStrings = [
        'postgres://user:password@localhost:5432/wedding',
        'postgresql://admin:secret@db.example.com/prod',
      ];

      for (const connStr of connStrings) {
        const connError = new Error(`Failed to connect: ${connStr}`);
        const wrappedError = new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: connError.message,
          cause: connError,
        });

        const message = formatErrorMessage(wrappedError);
        expect(message).not.toContain('postgres');
        expect(message).not.toContain('password');
        expect(message).not.toContain('secret');
        expect(message).not.toContain('5432');
      }
    });

    it('never exposes table/column names from database errors', () => {
      const dbErrors = [
        'column "dietary_restrictions" of relation "guests" does not exist',
        'relation "parties" does not exist',
        'duplicate key value violates unique constraint "rsvps_guest_id_event_id_key"',
      ];

      for (const errMsg of dbErrors) {
        const dbError = new Error(errMsg);
        const wrappedError = new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: dbError.message,
          cause: dbError,
        });

        const message = formatErrorMessage(wrappedError);
        expect(message).not.toContain('dietary_restrictions');
        expect(message).not.toContain('guests');
        expect(message).not.toContain('parties');
        expect(message).not.toContain('rsvps');
      }
    });
  });
});
