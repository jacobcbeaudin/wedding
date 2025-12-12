/**
 * RSVP confirmation email template.
 */

export interface RsvpEmailData {
  hasAttendees: boolean;
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

function buildGuestRows(guests: RsvpEmailData['guests']): string {
  return guests
    .map((guest) => {
      const responseRows = guest.responses
        .map((r) => {
          const statusColor = r.status === 'attending' ? '#2d5a3d' : '#8b4513';
          const statusText = r.status === 'attending' ? 'Joyfully Attending' : 'Unable to Attend';
          const meal = r.mealChoice
            ? `<span style="color: #7a8b99; font-size: 13px;"> · ${r.mealChoice}</span>`
            : '';
          return `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0ebe6;">
                <span style="color: #5a6a7a;">${r.eventName}</span>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f0ebe6; text-align: right;">
                <span style="color: ${statusColor};">${statusText}</span>${meal}
              </td>
            </tr>
          `;
        })
        .join('');

      const dietary = guest.dietaryRestrictions
        ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #7a8b99; font-style: italic;">Dietary notes: ${guest.dietaryRestrictions}</p>`
        : '';

      return `
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; font-family: 'Georgia', serif; font-weight: normal; font-size: 18px; color: #2c3e50; letter-spacing: 0.5px;">${guest.name}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${responseRows}
          </table>
          ${dietary}
        </div>
      `;
    })
    .join('');
}

function buildSongSection(songRequests: RsvpEmailData['songRequests']): string {
  if (songRequests.length === 0) return '';

  const songItems = songRequests
    .map(
      (s) =>
        `<li style="padding: 6px 0; color: #5a6a7a;">${s.song}${s.artist ? ` <span style="color: #9aa5b0;">— ${s.artist}</span>` : ''}</li>`
    )
    .join('');

  return `
    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8e0d8;">
      <h2 style="font-family: 'Georgia', serif; font-weight: normal; font-size: 16px; color: #2c3e50; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 16px 0;">Song Requests</h2>
      <ul style="margin: 0; padding: 0; list-style: none;">
        ${songItems}
      </ul>
    </div>
  `;
}

function buildNotesSection(notes: string | null | undefined): string {
  if (!notes) return '';

  return `
    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8e0d8;">
      <h2 style="font-family: 'Georgia', serif; font-weight: normal; font-size: 16px; color: #2c3e50; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 16px 0;">Your Message</h2>
      <p style="margin: 0; color: #5a6a7a; font-style: italic; line-height: 1.6;">"${notes}"</p>
    </div>
  `;
}

export function buildRsvpConfirmationHtml(data: RsvpEmailData): string {
  const { hasAttendees, guests, songRequests, notes } = data;

  const guestRows = buildGuestRows(guests);
  const songSection = buildSongSection(songRequests);
  const notesSection = buildNotesSection(notes);

  const message = hasAttendees
    ? "Your presence means the world to us. We can't wait to celebrate with you!"
    : "We'll miss you on our special day, but you'll be in our hearts.";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #faf9f7;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
                <!-- Header -->
                <tr>
                  <td style="padding: 48px 40px 32px 40px; text-align: center; border-bottom: 1px solid #f0ebe6;">
                    <p style="margin: 0 0 8px 0; font-family: 'Georgia', serif; font-size: 13px; color: #a8bcca; letter-spacing: 3px; text-transform: uppercase;">RSVP Received</p>
                    <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 28px; font-weight: normal; color: #2c3e50;">Thank You</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 32px 40px; font-family: 'Georgia', serif; font-size: 15px; line-height: 1.6; color: #4a5568;">
                    <p style="margin: 0 0 24px 0; text-align: center; color: #7a8b99;">
                      ${message}
                    </p>

                    ${guestRows}
                    ${songSection}
                    ${notesSection}
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px 40px 40px; text-align: center; border-top: 1px solid #f0ebe6;">
                    <p style="margin: 0 0 16px 0; font-family: 'Georgia', serif; font-size: 13px; color: #9aa5b0;">
                      Need to make changes? You can update your RSVP anytime before the deadline.
                    </p>
                    <p style="margin: 0; font-family: 'Georgia', serif; font-size: 15px; color: #a8bcca; letter-spacing: 1px;">
                      With love,<br>
                      <span style="color: #2c3e50;">Caroline & Jake</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
