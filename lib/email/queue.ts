/**
 * Email queue using Upstash QStash for background processing.
 * Falls back to direct sending if QStash is not configured.
 */

import { Client } from '@upstash/qstash';
import { sendRsvpConfirmation, type RsvpConfirmationData } from './index';
import { db } from '@/lib/db';
import { parties } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Initialize QStash client if configured
const qstash = process.env.QSTASH_TOKEN ? new Client({ token: process.env.QSTASH_TOKEN }) : null;

// Get the base URL for the email endpoint
function getEmailEndpointUrl(): string {
  // Use VERCEL_URL in production, fallback to localhost for development
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/email/send-confirmation`;
}

interface QueueEmailParams extends RsvpConfirmationData {
  partyId: string;
}

/**
 * Queue an RSVP confirmation email for background sending.
 * Uses QStash if configured, otherwise sends directly.
 */
export async function queueRsvpConfirmation(params: QueueEmailParams): Promise<void> {
  const { partyId, ...emailData } = params;

  if (qstash) {
    // Queue via QStash for background processing
    try {
      await qstash.publishJSON({
        url: getEmailEndpointUrl(),
        body: { partyId, ...emailData },
        retries: 3,
      });
    } catch (error) {
      console.error('Failed to queue email via QStash:', error);
      // Don't throw - email sending should not fail the RSVP
    }
  } else {
    // Fallback: send directly (non-blocking)
    sendRsvpConfirmation(emailData)
      .then(async (emailSent) => {
        if (emailSent) {
          await db
            .update(parties)
            .set({ confirmationSentAt: new Date() })
            .where(eq(parties.id, partyId));
        }
      })
      .catch((error) => {
        console.error('Failed to send confirmation email:', error);
      });
  }
}
