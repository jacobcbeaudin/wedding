import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * E2E tests for admin API error handling.
 *
 * These tests make direct API calls to verify NOT_FOUND errors
 * are returned when updating non-existent records.
 */

const ADMIN_TOKEN = process.env.ADMIN_PASSWORD || 'test';
const NONEXISTENT_UUID = '00000000-0000-0000-0000-000000000000';

// Helper to make tRPC mutation requests (POST)
async function trpcMutation(
  request: APIRequestContext,
  procedure: string,
  input: Record<string, unknown>
) {
  const response = await request.post(`/api/trpc/${procedure}`, {
    headers: { 'Content-Type': 'application/json' },
    data: { json: input },
  });
  return response;
}

// Helper to make tRPC query requests (GET)
async function trpcQuery(
  request: APIRequestContext,
  procedure: string,
  input: Record<string, unknown>
) {
  const inputParam = encodeURIComponent(JSON.stringify({ json: input }));
  const response = await request.get(`/api/trpc/${procedure}?input=${inputParam}`);
  return response;
}

test.describe('Admin API Error Handling', () => {
  test.describe('Update operations return NOT_FOUND for missing records', () => {
    test('updateParty returns NOT_FOUND for non-existent party', async ({ request }) => {
      const response = await trpcMutation(request, 'admin.updateParty', {
        adminToken: ADMIN_TOKEN,
        id: NONEXISTENT_UUID,
        name: 'Updated Party',
        email: 'updated@example.com',
        notes: null,
      });

      // tRPC returns 404 for NOT_FOUND errors
      expect(response.status()).toBe(404);
      const body = await response.json();

      expect(body.error).toBeDefined();
      expect(body.error.json.message).toBe('Party not found');
      expect(body.error.json.data.code).toBe('NOT_FOUND');
    });

    test('updateGuest returns NOT_FOUND for non-existent guest', async ({ request }) => {
      const response = await trpcMutation(request, 'admin.updateGuest', {
        adminToken: ADMIN_TOKEN,
        id: NONEXISTENT_UUID,
        firstName: 'John',
        lastName: 'Doe',
        isPrimary: false,
        isChild: false,
        dietaryRestrictions: null,
      });

      expect(response.status()).toBe(404);
      const body = await response.json();

      expect(body.error).toBeDefined();
      expect(body.error.json.message).toBe('Guest not found');
      expect(body.error.json.data.code).toBe('NOT_FOUND');
    });

    test('updateEvent returns NOT_FOUND for non-existent event', async ({ request }) => {
      const response = await trpcMutation(request, 'admin.updateEvent', {
        adminToken: ADMIN_TOKEN,
        id: NONEXISTENT_UUID,
        slug: 'wedding',
        name: 'Wedding Ceremony',
        date: null,
        location: null,
        description: null,
        displayOrder: 0,
      });

      expect(response.status()).toBe(404);
      const body = await response.json();

      expect(body.error).toBeDefined();
      expect(body.error.json.message).toBe('Event not found');
      expect(body.error.json.data.code).toBe('NOT_FOUND');
    });
  });

  test.describe('Update operations succeed for existing records', () => {
    test('updateParty succeeds for existing party', async ({ request }) => {
      // First, get an existing party
      const listResponse = await trpcQuery(request, 'admin.listParties', {
        adminToken: ADMIN_TOKEN,
      });
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
      const response = await trpcMutation(request, 'admin.updateParty', {
        adminToken: ADMIN_TOKEN,
        id: existingParty.id,
        name: existingParty.name,
        email: existingParty.email,
        notes: existingParty.notes,
      });

      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.error).toBeUndefined();
      expect(body.result?.data?.json).toBeDefined();
      expect(body.result.data.json.id).toBe(existingParty.id);
    });
  });

  test.describe('Authentication errors', () => {
    test('returns UNAUTHORIZED for invalid admin token', async ({ request }) => {
      const response = await trpcMutation(request, 'admin.updateParty', {
        adminToken: 'wrong-token',
        id: NONEXISTENT_UUID,
        name: 'Test',
        email: 'test@example.com',
        notes: null,
      });

      // tRPC returns 401 for UNAUTHORIZED errors
      expect(response.status()).toBe(401);
      const body = await response.json();

      expect(body.error).toBeDefined();
      expect(body.error.json.message).toBe('Invalid admin credentials');
      expect(body.error.json.data.code).toBe('UNAUTHORIZED');
    });
  });
});
