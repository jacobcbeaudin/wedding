import { test, expect, APIRequestContext } from '@playwright/test';
import 'dotenv/config';

/**
 * E2E tests for admin API error handling.
 *
 * These tests make direct API calls to verify NOT_FOUND errors
 * are returned when updating non-existent records.
 *
 * Admin authentication uses HttpOnly cookies set via /api/admin/login.
 */

const SITE_PASSWORD = process.env.SITE_PASSWORD || 'test';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test';
const NONEXISTENT_UUID = '00000000-0000-0000-0000-000000000000';

// Helper to extract cookie from Set-Cookie header
function extractCookie(setCookie: string | undefined, cookieName: string): string | null {
  if (!setCookie) return null;
  // Set-Cookie may be a single string or multiple cookies separated by comma
  const cookies = setCookie.split(/,(?=\s*\w+=)/);
  for (const cookie of cookies) {
    if (cookie.trim().startsWith(`${cookieName}=`)) {
      return cookie.split(';')[0].trim();
    }
  }
  return null;
}

// Helper to authenticate as admin and get both site + admin session cookies
async function authenticateAdmin(request: APIRequestContext): Promise<string> {
  // First, authenticate with site password
  const siteResponse = await request.post('/api/auth/login', {
    headers: { 'Content-Type': 'application/json' },
    data: { password: SITE_PASSWORD },
  });
  const siteCookie = extractCookie(siteResponse.headers()['set-cookie'], 'site_session');
  if (!siteCookie) {
    throw new Error('No site cookie returned from login');
  }

  // Then authenticate as admin
  const adminResponse = await request.post('/api/admin/login', {
    headers: { 'Content-Type': 'application/json' },
    data: { password: ADMIN_PASSWORD },
  });
  const adminCookie = extractCookie(adminResponse.headers()['set-cookie'], 'admin_session');
  if (!adminCookie) {
    throw new Error('No admin cookie returned from login');
  }

  // Return both cookies
  return `${siteCookie}; ${adminCookie}`;
}

// Helper to make tRPC mutation requests (POST) with auth cookie
async function trpcMutation(
  request: APIRequestContext,
  procedure: string,
  input: Record<string, unknown>,
  cookie?: string
) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (cookie) {
    headers['Cookie'] = cookie;
  }

  const response = await request.post(`/api/trpc/${procedure}`, {
    headers,
    data: { json: input },
  });
  return response;
}

// Helper to make tRPC query requests (GET) with auth cookie
async function trpcQuery(
  request: APIRequestContext,
  procedure: string,
  input: Record<string, unknown>,
  cookie?: string
) {
  const headers: Record<string, string> = {};
  if (cookie) {
    headers['Cookie'] = cookie;
  }

  const inputParam = encodeURIComponent(JSON.stringify({ json: input }));
  const response = await request.get(`/api/trpc/${procedure}?input=${inputParam}`, {
    headers,
  });
  return response;
}

test.describe('Admin API Error Handling', () => {
  test.describe('Update operations return NOT_FOUND for missing records', () => {
    test('updateParty returns NOT_FOUND for non-existent party', async ({ request }) => {
      const cookie = await authenticateAdmin(request);
      const response = await trpcMutation(
        request,
        'admin.updateParty',
        {
          id: NONEXISTENT_UUID,
          name: 'Updated Party',
          email: 'updated@example.com',
          notes: null,
        },
        cookie
      );

      // tRPC returns 404 for NOT_FOUND errors
      expect(response.status()).toBe(404);
      const body = await response.json();

      expect(body.error).toBeDefined();
      expect(body.error.json.message).toBe('Party not found');
      expect(body.error.json.data.code).toBe('NOT_FOUND');
    });

    test('updateGuest returns NOT_FOUND for non-existent guest', async ({ request }) => {
      const cookie = await authenticateAdmin(request);
      const response = await trpcMutation(
        request,
        'admin.updateGuest',
        {
          id: NONEXISTENT_UUID,
          firstName: 'John',
          lastName: 'Doe',
          isPrimary: false,
          isChild: false,
          dietaryRestrictions: null,
        },
        cookie
      );

      expect(response.status()).toBe(404);
      const body = await response.json();

      expect(body.error).toBeDefined();
      expect(body.error.json.message).toBe('Guest not found');
      expect(body.error.json.data.code).toBe('NOT_FOUND');
    });

    test('updateEvent returns NOT_FOUND for non-existent event', async ({ request }) => {
      const cookie = await authenticateAdmin(request);
      const response = await trpcMutation(
        request,
        'admin.updateEvent',
        {
          id: NONEXISTENT_UUID,
          slug: 'wedding',
          name: 'Wedding Ceremony',
          date: null,
          location: null,
          description: null,
          displayOrder: 0,
        },
        cookie
      );

      expect(response.status()).toBe(404);
      const body = await response.json();

      expect(body.error).toBeDefined();
      expect(body.error.json.message).toBe('Event not found');
      expect(body.error.json.data.code).toBe('NOT_FOUND');
    });
  });

  test.describe('Update operations succeed for existing records', () => {
    test('updateParty succeeds for existing party', async ({ request }) => {
      const cookie = await authenticateAdmin(request);

      // First, get an existing party
      const listResponse = await trpcQuery(request, 'admin.listParties', {}, cookie);
      expect(listResponse.status()).toBe(200);
      const listBody = await listResponse.json();

      expect(listBody.result?.data?.json).toBeDefined();

      const parties = listBody.result.data.json;
      if (parties.length === 0) {
        test.skip();
        return;
      }

      const existingParty = parties[0];

      // Update the existing party
      const response = await trpcMutation(
        request,
        'admin.updateParty',
        {
          id: existingParty.id,
          name: existingParty.name,
          email: existingParty.email,
          notes: existingParty.notes,
        },
        cookie
      );

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.error).toBeUndefined();
      expect(body.result?.data?.json).toBeDefined();
      expect(body.result.data.json.id).toBe(existingParty.id);
    });
  });

  test.describe('Authentication errors', () => {
    test.use({ storageState: { cookies: [], origins: [] } }); // Clear auth for these tests

    test('returns UNAUTHORIZED when not authenticated', async ({ request }) => {
      // Make request without any authentication cookie
      const response = await trpcMutation(request, 'admin.updateParty', {
        id: NONEXISTENT_UUID,
        name: 'Test',
        email: 'test@example.com',
        notes: null,
      });

      // Middleware returns 401 for missing site auth
      expect(response.status()).toBe(401);
      const body = await response.json();

      expect(body.error).toBe('Site authentication required');
    });

    test('returns admin UNAUTHORIZED with site auth but no admin auth', async ({ request }) => {
      // First, authenticate with site password only
      const siteResponse = await request.post('/api/auth/login', {
        headers: { 'Content-Type': 'application/json' },
        data: { password: SITE_PASSWORD },
      });
      const siteCookie = extractCookie(siteResponse.headers()['set-cookie'], 'site_session');

      // Make request with site auth but no admin auth
      const response = await trpcMutation(
        request,
        'admin.updateParty',
        {
          id: NONEXISTENT_UUID,
          name: 'Test',
          email: 'test@example.com',
          notes: null,
        },
        siteCookie || undefined
      );

      // tRPC returns 401 for admin UNAUTHORIZED errors
      expect(response.status()).toBe(401);
      const body = await response.json();

      expect(body.error).toBeDefined();
      expect(body.error.json.message).toBe('Admin authentication required');
      expect(body.error.json.data.code).toBe('UNAUTHORIZED');
    });

    test('login returns error for invalid password', async ({ request }) => {
      const response = await request.post('/api/admin/login', {
        headers: { 'Content-Type': 'application/json' },
        data: { password: 'wrong-password' },
      });

      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('Incorrect password');
    });

    test('login succeeds with correct password', async ({ request }) => {
      const response = await request.post('/api/admin/login', {
        headers: { 'Content-Type': 'application/json' },
        data: { password: ADMIN_PASSWORD },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);

      // Should set HttpOnly cookie with JWT token
      const setCookie = response.headers()['set-cookie'];
      expect(setCookie).toContain('admin_session=');
      expect(setCookie).toContain('HttpOnly');
      // JWT tokens start with 'eyJ' (base64 encoded '{"')
      expect(setCookie).toMatch(/admin_session=eyJ/);
    });

    test('session endpoint returns authenticated status', async ({ request }) => {
      const cookie = await authenticateAdmin(request);

      const response = await request.get('/api/admin/session', {
        headers: { Cookie: cookie },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.authenticated).toBe(true);
    });

    test('logout clears session', async ({ request }) => {
      const cookie = await authenticateAdmin(request);

      // Logout
      const logoutResponse = await request.post('/api/admin/logout', {
        headers: { Cookie: cookie },
      });
      expect(logoutResponse.status()).toBe(200);

      // Session should no longer be authenticated
      // Note: The cookie is cleared server-side, but we need a fresh request context
      const sessionResponse = await request.get('/api/admin/session');
      const body = await sessionResponse.json();
      expect(body.authenticated).toBe(false);
    });
  });
});
