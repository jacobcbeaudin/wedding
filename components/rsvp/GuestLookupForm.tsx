'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GuestLookupFormProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string;
}

export function GuestLookupForm({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
  isLoading,
  error,
}: GuestLookupFormProps) {
  return (
    <Card className="coastal-shadow mx-auto max-w-2xl border-0 p-6 sm:p-10">
      <h2 className="elegant-serif text-primary mb-6 text-center text-2xl sm:text-3xl">
        Find Your Invitation
      </h2>

      <p className="text-muted-foreground mb-6 text-center text-sm sm:mb-8 sm:text-base">
        Please enter your name as it appears on your invitation
      </p>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label htmlFor="first-name" className="mb-2 block text-sm font-medium sm:text-base">
            First Name
          </Label>
          <Input
            id="first-name"
            placeholder="Enter your first name..."
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            disabled={isLoading}
            data-testid="input-first-name"
          />
        </div>

        <div>
          <Label htmlFor="last-name" className="mb-2 block text-sm font-medium sm:text-base">
            Last Name
          </Label>
          <Input
            id="last-name"
            placeholder="Enter your last name..."
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            disabled={isLoading}
            data-testid="input-last-name"
          />
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <Button
          onClick={onSubmit}
          disabled={!firstName || !lastName || isLoading}
          className="w-full"
          size="lg"
          data-testid="button-lookup-guest"
        >
          {isLoading ? 'Searching...' : 'Find My Invitation'}
        </Button>
      </div>

      <div className="bg-muted/30 mt-6 rounded p-4 text-center sm:mt-8 sm:p-6">
        <p className="text-muted-foreground text-xs sm:text-sm">
          Can&apos;t find your invitation? Contact us at{' '}
          <a href="mailto:wedding@carolineandjake.com" className="text-primary underline">
            wedding@carolineandjake.com
          </a>
        </p>
      </div>
    </Card>
  );
}
