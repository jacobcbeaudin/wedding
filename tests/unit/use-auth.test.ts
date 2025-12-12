/**
 * Tests for useAuth hook.
 * Covers session checking, login, logout, and error handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth, useSiteAuth, useAdminAuth } from '@/hooks/use-auth';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useAuth', () => {
  const defaultOptions = {
    sessionEndpoint: '/api/test/session',
    loginEndpoint: '/api/test/login',
    logoutEndpoint: '/api/test/logout',
  };

  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with isAuthenticated as null (loading)', () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authenticated: false }),
      });

      const { result } = renderHook(() => useAuth(defaultOptions));

      // Initial state before session check completes
      expect(result.current.isAuthenticated).toBe(null);
      expect(result.current.error).toBe('');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('session check on mount', () => {
    it('sets isAuthenticated to true when session is valid', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authenticated: true }),
      });

      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/test/session');
    });

    it('sets isAuthenticated to false when session is invalid', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authenticated: false }),
      });

      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });
    });

    it('sets isAuthenticated to false on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      // Session check returns not authenticated
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authenticated: false }),
      });
    });

    it('returns true and sets isAuthenticated on successful login', async () => {
      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      // Mock successful login
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('correct-password');
      });

      expect(loginResult!).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBe('');
      expect(result.current.isLoading).toBe(false);

      // Verify fetch was called correctly
      expect(mockFetch).toHaveBeenLastCalledWith('/api/test/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'correct-password' }),
      });
    });

    it('returns false and sets error on wrong password', async () => {
      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      // Mock failed login
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Incorrect password' }),
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('wrong-password');
      });

      expect(loginResult!).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Incorrect password');
      expect(result.current.isLoading).toBe(false);
    });

    it('uses default error message when API returns no error', async () => {
      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({}),
      });

      await act(async () => {
        await result.current.login('wrong-password');
      });

      expect(result.current.error).toBe('Incorrect password');
    });

    it('handles rate limiting (429) with specific message', async () => {
      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Rate limited' }),
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('password');
      });

      expect(loginResult!).toBe(false);
      expect(result.current.error).toBe('Too many attempts. Please wait a moment and try again.');
    });

    it('handles network error during login', async () => {
      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login('password');
      });

      expect(loginResult!).toBe(false);
      expect(result.current.error).toBe('Something went wrong. Please try again.');
    });

    it('sets isLoading during login request', async () => {
      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      // Create a promise we can control
      let resolveLogin: (value: unknown) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      mockFetch.mockReturnValueOnce(loginPromise);

      // Start login but don't await
      let loginResultPromise: Promise<boolean>;
      act(() => {
        loginResultPromise = result.current.login('password');
      });

      // Check loading state is true
      expect(result.current.isLoading).toBe(true);

      // Resolve the login
      await act(async () => {
        resolveLogin!({
          ok: true,
          json: async () => ({ success: true }),
        });
        await loginResultPromise;
      });

      // Loading should be false after completion
      expect(result.current.isLoading).toBe(false);
    });

    it('clears previous error on new login attempt', async () => {
      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      // First failed login
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Wrong password' }),
      });

      await act(async () => {
        await result.current.login('wrong');
      });

      expect(result.current.error).toBe('Wrong password');

      // Second login attempt - error should be cleared
      let resolveLogin: (value: unknown) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      mockFetch.mockReturnValueOnce(loginPromise);

      act(() => {
        result.current.login('correct');
      });

      // Error should be cleared when new login starts
      expect(result.current.error).toBe('');

      // Clean up
      await act(async () => {
        resolveLogin!({
          ok: true,
          json: async () => ({ success: true }),
        });
      });
    });
  });

  describe('logout', () => {
    it('calls logout endpoint and sets isAuthenticated to false', async () => {
      // Start authenticated
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authenticated: true }),
      });

      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      // Mock logout
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(mockFetch).toHaveBeenLastCalledWith('/api/test/logout', {
        method: 'POST',
      });
    });

    it('still sets isAuthenticated to false even without logout endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authenticated: true }),
      });

      const { result } = renderHook(() =>
        useAuth({
          sessionEndpoint: '/api/test/session',
          loginEndpoint: '/api/test/login',
          // No logoutEndpoint
        })
      );

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      // Should not have made a logout fetch call
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only session check
    });
  });

  describe('clearError', () => {
    it('clears the error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authenticated: false }),
      });

      const { result } = renderHook(() => useAuth(defaultOptions));

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      // Trigger an error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Some error' }),
      });

      await act(async () => {
        await result.current.login('wrong');
      });

      expect(result.current.error).toBe('Some error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe('');
    });
  });
});

describe('useSiteAuth', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('uses correct site auth endpoints', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: false }),
    });

    renderHook(() => useSiteAuth());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/session');
    });
  });
});

describe('useAdminAuth', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('uses correct admin auth endpoints', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: false }),
    });

    renderHook(() => useAdminAuth());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/session');
    });
  });
});
