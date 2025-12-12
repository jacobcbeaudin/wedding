/**
 * Email queue endpoint - receives messages from QStash to send confirmation emails.
 * This allows non-blocking email sending in the RSVP flow.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { sendRsvpConfirmation, type RsvpConfirmationData } from '@/lib/email';
import { db } from '@/lib/db';
import { parties } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function handler(request: NextRequest) {
  try {
    const body = (await request.json()) as RsvpConfirmationData & { partyId: string };
    const { partyId, ...emailData } = body;

    const emailSent = await sendRsvpConfirmation(emailData);

    if (emailSent && partyId) {
      // Update party confirmation timestamp
      await db
        .update(parties)
        .set({ confirmationSentAt: new Date() })
        .where(eq(parties.id, partyId));
    }

    return NextResponse.json({ success: true, emailSent });
  } catch (error) {
    console.error('Failed to process email queue message:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

// Wrap handler with QStash signature verification if configured
const isQstashConfigured = !!(
  process.env.QSTASH_CURRENT_SIGNING_KEY && process.env.QSTASH_NEXT_SIGNING_KEY
);

export const POST = isQstashConfigured ? verifySignatureAppRouter(handler) : handler;
