/**
 * Tests for email template generation.
 */

import { describe, it, expect } from 'vitest';
import {
  buildRsvpConfirmationHtml,
  type RsvpEmailData,
} from '../../lib/email/templates/rsvp-confirmation';

describe('buildRsvpConfirmationHtml', () => {
  const baseData: RsvpEmailData = {
    hasAttendees: true,
    guests: [],
    songRequests: [],
    notes: null,
  };

  describe('message based on attendance', () => {
    it('shows attending message when hasAttendees is true', () => {
      const html = buildRsvpConfirmationHtml({ ...baseData, hasAttendees: true });
      expect(html).toContain('Your presence means the world to us');
      expect(html).toContain("can't wait to celebrate with you");
    });

    it('shows declined message when hasAttendees is false', () => {
      const html = buildRsvpConfirmationHtml({ ...baseData, hasAttendees: false });
      expect(html).toContain("We'll miss you on our special day");
      expect(html).toContain('in our hearts');
    });
  });

  describe('guest rows', () => {
    it('renders guest name', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        guests: [
          {
            name: 'John Smith',
            responses: [{ eventName: 'Wedding', status: 'attending' }],
          },
        ],
      });
      expect(html).toContain('John Smith');
    });

    it('renders event name and status', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        guests: [
          {
            name: 'Test Guest',
            responses: [
              { eventName: 'Wedding Ceremony', status: 'attending' },
              { eventName: 'Reception', status: 'declined' },
            ],
          },
        ],
      });
      expect(html).toContain('Wedding Ceremony');
      expect(html).toContain('Reception');
      expect(html).toContain('Joyfully Attending');
      expect(html).toContain('Unable to Attend');
    });

    it('renders meal choice when provided', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        guests: [
          {
            name: 'Test Guest',
            responses: [{ eventName: 'Wedding', status: 'attending', mealChoice: 'Fish' }],
          },
        ],
      });
      expect(html).toContain('Fish');
    });

    it('does not render meal when not provided', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        guests: [
          {
            name: 'Test Guest',
            responses: [{ eventName: 'Wedding', status: 'attending', mealChoice: null }],
          },
        ],
      });
      // Should not have the meal separator dot
      expect(html).not.toContain(' · null');
    });

    it('renders dietary restrictions when provided', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        guests: [
          {
            name: 'Test Guest',
            responses: [],
            dietaryRestrictions: 'Gluten-free, no shellfish',
          },
        ],
      });
      expect(html).toContain('Dietary notes:');
      expect(html).toContain('Gluten-free, no shellfish');
    });

    it('does not render dietary section when null', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        guests: [
          {
            name: 'Test Guest',
            responses: [],
            dietaryRestrictions: null,
          },
        ],
      });
      expect(html).not.toContain('Dietary notes:');
    });

    it('renders multiple guests', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        guests: [
          { name: 'John Smith', responses: [] },
          { name: 'Jane Smith', responses: [] },
          { name: 'Junior Smith', responses: [] },
        ],
      });
      expect(html).toContain('John Smith');
      expect(html).toContain('Jane Smith');
      expect(html).toContain('Junior Smith');
    });
  });

  describe('song requests section', () => {
    it('renders song requests when provided', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        songRequests: [
          { song: 'Bohemian Rhapsody', artist: 'Queen' },
          { song: 'Dancing Queen', artist: 'ABBA' },
        ],
      });
      expect(html).toContain('Song Requests');
      expect(html).toContain('Bohemian Rhapsody');
      expect(html).toContain('Queen');
      expect(html).toContain('Dancing Queen');
      expect(html).toContain('ABBA');
    });

    it('renders song without artist when artist is null', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        songRequests: [{ song: 'Happy', artist: null }],
      });
      expect(html).toContain('Happy');
      expect(html).not.toContain('— null');
    });

    it('does not render song section when empty', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        songRequests: [],
      });
      expect(html).not.toContain('Song Requests');
    });
  });

  describe('notes section', () => {
    it('renders notes when provided', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        notes: 'So excited to celebrate with you both!',
      });
      expect(html).toContain('Your Message');
      expect(html).toContain('So excited to celebrate with you both!');
    });

    it('does not render notes section when null', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        notes: null,
      });
      expect(html).not.toContain('Your Message');
    });

    it('does not render notes section when undefined', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        notes: undefined,
      });
      expect(html).not.toContain('Your Message');
    });
  });

  describe('email structure', () => {
    it('includes DOCTYPE and html structure', () => {
      const html = buildRsvpConfirmationHtml(baseData);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html>');
      expect(html).toContain('</html>');
    });

    it('includes viewport meta tag', () => {
      const html = buildRsvpConfirmationHtml(baseData);
      expect(html).toContain('name="viewport"');
    });

    it('includes header with title', () => {
      const html = buildRsvpConfirmationHtml(baseData);
      expect(html).toContain('RSVP Received');
      expect(html).toContain('Thank You');
    });

    it('includes footer with edit reminder', () => {
      const html = buildRsvpConfirmationHtml(baseData);
      expect(html).toContain('Need to make changes?');
      expect(html).toContain('update your RSVP');
    });

    it('includes sign-off', () => {
      const html = buildRsvpConfirmationHtml(baseData);
      expect(html).toContain('With love');
      expect(html).toContain('Caroline & Jake');
    });

    it('uses table-based layout for email compatibility', () => {
      const html = buildRsvpConfirmationHtml(baseData);
      expect(html).toContain('role="presentation"');
      expect(html).toContain('<table');
    });
  });

  describe('styling', () => {
    it('uses inline styles', () => {
      const html = buildRsvpConfirmationHtml(baseData);
      expect(html).toContain('style="');
    });

    it('uses attending color for attending status', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        guests: [
          {
            name: 'Test',
            responses: [{ eventName: 'Wedding', status: 'attending' }],
          },
        ],
      });
      expect(html).toContain('#2d5a3d'); // Green for attending
    });

    it('uses declined color for declined status', () => {
      const html = buildRsvpConfirmationHtml({
        ...baseData,
        guests: [
          {
            name: 'Test',
            responses: [{ eventName: 'Wedding', status: 'declined' }],
          },
        ],
      });
      expect(html).toContain('#8b4513'); // Brown for declined
    });
  });
});
