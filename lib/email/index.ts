/**
 * Email service using Resend.
 */

import { Resend } from 'resend';
import { buildRsvpConfirmationHtml } from './templates/rsvp-confirmation';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface RsvpConfirmationData {
  partyEmail: string;
  guests: Array<{
    name: string;
    responses: Array<{
      eventName: string;
      status: 'attending' | 'declined';
      mealChoice?: string | null;
    }>;
    dietaryRestrictions?: string | null;
  }>;
  songRequests: Array<{
    song: string;
    artist?: string | null;
  }>;
  notes?: string | null;
}

/**
 * Sends RSVP confirmation email to the party.
 * Returns true if sent successfully, false if email is not configured.
 */
export async function sendRsvpConfirmation(data: RsvpConfirmationData): Promise<boolean> {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping confirmation email');
    return false;
  }

  const { partyEmail, guests, songRequests, notes } = data;

  const hasAttendees = guests.some((g) => g.responses.some((r) => r.status === 'attending'));

  const html = buildRsvpConfirmationHtml({
    hasAttendees,
    guests,
    songRequests,
    notes,
  });

  try {
    await resend.emails.send({
      from: 'Caroline & Jake <rsvp@mail.carolineandjake.com>',
      to: partyEmail,
      subject: 'RSVP Confirmation — Caroline & Jake',
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send RSVP confirmation email:', error);
    return false;
  }
}
