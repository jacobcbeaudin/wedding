'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseAuthOptions {
  /** API endpoint for checking session status */
  sessionEndpoint: string;
  /** API endpoint for login */
  loginEndpoint: string;
  /** API endpoint for logout (optional) */
  logoutEndpoint?: string;
}

interface UseAuthReturn {
  /** null = loading, true = authenticated, false = not authenticated */
  isAuthenticated: boolean | null;
  /** Error message from last login attempt */
  error: string;
  /** Whether a login request is in progress */
  isLoading: boolean;
  /** Attempt to login with password */
  login: (password: string) => Promise<boolean>;
  /** Logout and clear session */
  logout: () => Promise<void>;
  /** Clear error message */
  clearError: () => void;
}

/**
 * Hook for managing authentication state.
 * Works with both site auth and admin auth.
 */
export function useAuth(options: UseAuthOptions): UseAuthReturn {
  const { sessionEndpoint, loginEndpoint, logoutEndpoint } = options;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(sessionEndpoint);
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkSession();
  }, [sessionEndpoint]);

  const login = useCallback(
    async (password: string): Promise<boolean> => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(loginEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });

        if (response.ok) {
          setIsAuthenticated(true);
          return true;
        }

        if (response.status === 429) {
          setError('Too many attempts. Please wait a moment and try again.');
        } else {
          const data = await response.json();
          setError(data.error || 'Incorrect password');
        }
        return false;
      } catch {
        setError('Something went wrong. Please try again.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [loginEndpoint]
  );

  const logout = useCallback(async () => {
    if (logoutEndpoint) {
      await fetch(logoutEndpoint, { method: 'POST' });
    }
    setIsAuthenticated(false);
  }, [logoutEndpoint]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    isAuthenticated,
    error,
    isLoading,
    login,
    logout,
    clearError,
  };
}

// Pre-configured hooks for common use cases
export function useSiteAuth() {
  return useAuth({
    sessionEndpoint: '/api/auth/session',
    loginEndpoint: '/api/auth/login',
    logoutEndpoint: '/api/auth/logout',
  });
}

export function useAdminAuth() {
  return useAuth({
    sessionEndpoint: '/api/admin/session',
    loginEndpoint: '/api/admin/login',
    logoutEndpoint: '/api/admin/logout',
  });
}
