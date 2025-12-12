/**
 * Client-side auth utilities.
 * Simple functions for consistent error handling without hook complexity.
 */

export const AUTH_ERRORS = {
  RATE_LIMITED: 'Too many attempts. Please wait a moment and try again.',
  INCORRECT_PASSWORD: 'Incorrect password',
  GENERIC: 'Something went wrong. Please try again.',
} as const;

interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Check if user is authenticated.
 */
export async function checkSession(endpoint: string): Promise<boolean> {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.authenticated;
  } catch {
    return false;
  }
}

/**
 * Attempt login with password.
 */
export async function login(endpoint: string, password: string): Promise<AuthResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      return { success: true };
    }

    if (response.status === 429) {
      return { success: false, error: AUTH_ERRORS.RATE_LIMITED };
    }

    const data = await response.json();
    return { success: false, error: data.error || AUTH_ERRORS.INCORRECT_PASSWORD };
  } catch {
    return { success: false, error: AUTH_ERRORS.GENERIC };
  }
}

/**
 * Logout user.
 */
export async function logout(endpoint: string): Promise<void> {
  await fetch(endpoint, { method: 'POST' });
}
