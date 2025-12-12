'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PartyWithDetails } from '@/lib/validations/rsvp';

interface RsvpConfirmationProps {
  party: PartyWithDetails;
  onEditRsvp: () => void;
}

export function RsvpConfirmation({ party, onEditRsvp }: RsvpConfirmationProps) {
  return (
    <Card className="coastal-shadow mx-auto max-w-2xl border-0 p-8 text-center sm:p-12">
      <div className="mb-6 text-5xl sm:text-6xl">&#10003;</div>
      <h2 className="elegant-serif text-primary mb-6 text-2xl sm:text-3xl">
        Your RSVP is Confirmed
      </h2>
      <p className="text-foreground mb-4 text-base sm:text-lg">
        We can&apos;t wait to celebrate with you on our special day.
      </p>
      <p className="text-muted-foreground mb-6 text-sm">Party: {party.name}</p>
      <Button variant="outline" onClick={onEditRsvp} data-testid="button-edit-rsvp">
        Edit My RSVP
      </Button>
    </Card>
  );
}
