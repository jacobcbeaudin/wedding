'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GuestPublic, GuestDietary } from '@/lib/validations/rsvp';

interface DietarySectionProps {
  guests: GuestPublic[];
  dietaryInfo: GuestDietary[];
  onDietaryChange: (guestId: string, value: string) => void;
  formatGuestName: (guest: GuestPublic) => string;
}

export function DietarySection({
  guests,
  dietaryInfo,
  onDietaryChange,
  formatGuestName,
}: DietarySectionProps) {
  return (
    <Card className="coastal-shadow mb-6 border-0 p-6 sm:mb-8 sm:p-8">
      <h3 className="text-foreground mb-6 text-lg font-medium sm:text-xl">Dietary Restrictions</h3>
      <div className="space-y-4">
        {guests.map((guest) => {
          const dietary = dietaryInfo.find((d) => d.guestId === guest.id);
          return (
            <div key={guest.id}>
              <Label
                htmlFor={`dietary-${guest.id}`}
                className="text-foreground mb-2 block text-sm font-medium"
              >
                {formatGuestName(guest)}
              </Label>
              <Input
                id={`dietary-${guest.id}`}
                placeholder="Any dietary restrictions or allergies..."
                value={dietary?.dietaryRestrictions || ''}
                onChange={(e) => onDietaryChange(guest.id, e.target.value)}
                data-testid={`input-dietary-${guest.id}`}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
