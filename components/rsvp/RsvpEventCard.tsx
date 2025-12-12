'use client';

import { Check, X, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MEAL_OPTIONS, MEAL_REQUIRED_EVENT } from '@/lib/config/meals';
import type { GuestPublic, EventPublic } from '@/lib/validations/rsvp';

type RsvpStatus = 'attending' | 'declined';
type MealChoice = (typeof MEAL_OPTIONS)[number];

interface GuestEventRsvp {
  guestId: string;
  eventId: string;
  eventSlug: string;
  status: RsvpStatus | undefined;
  mealChoice: MealChoice | undefined;
}

interface RsvpEventCardProps {
  event: EventPublic;
  guests: GuestPublic[];
  rsvpSelections: GuestEventRsvp[];
  onStatusChange: (guestId: string, eventId: string, status: RsvpStatus) => void;
  onMealChange: (guestId: string, eventId: string, meal: MealChoice) => void;
  formatGuestName: (guest: GuestPublic) => string;
}

function formatEventDate(event: EventPublic) {
  if (!event.date) return '';
  const date = new Date(event.date);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function RsvpEventCard({
  event,
  guests,
  rsvpSelections,
  onStatusChange,
  onMealChange,
  formatGuestName,
}: RsvpEventCardProps) {
  return (
    <div className="bg-muted/30 rounded-lg p-4 sm:p-6">
      <div className="mb-4">
        <h4 className="text-foreground text-base font-medium sm:text-lg">{event.name}</h4>
        <p className="text-muted-foreground text-xs sm:text-sm">{formatEventDate(event)}</p>
        {event.location && (
          <p className="text-muted-foreground text-xs sm:text-sm">{event.location}</p>
        )}
      </div>

      {/* RSVP for each guest */}
      <div className="space-y-3">
        {guests.map((guest) => {
          const rsvpState = rsvpSelections.find(
            (r) => r.guestId === guest.id && r.eventId === event.id
          );
          const showMealSelection =
            event.slug === MEAL_REQUIRED_EVENT && rsvpState?.status === 'attending';

          return (
            <div key={`${guest.id}-${event.id}`} className="bg-background/50 rounded-lg p-4">
              <div className="mb-3">
                <span className="text-foreground text-sm font-medium">
                  {formatGuestName(guest)}
                </span>
              </div>

              {/* Modern toggle buttons for Accept/Decline */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onStatusChange(guest.id, event.id, 'attending')}
                  data-testid={`radio-${event.slug}-${guest.id}-attending`}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                    rsvpState?.status === 'attending'
                      ? 'border-primary bg-primary text-primary-foreground coastal-shadow'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  <Check className="h-4 w-4" />
                  <span>Joyfully Accept</span>
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(guest.id, event.id, 'declined')}
                  data-testid={`radio-${event.slug}-${guest.id}-declined`}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                    rsvpState?.status === 'declined'
                      ? 'border-muted-foreground/50 bg-muted text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
                  )}
                >
                  <X className="h-4 w-4" />
                  <span>Regretfully Decline</span>
                </button>
              </div>

              {/* Meal Selection - elegant card buttons */}
              {showMealSelection && (
                <div className="border-border/50 mt-4 border-t pt-4">
                  <div className="text-muted-foreground mb-3 flex items-center gap-2 text-xs">
                    <Utensils className="h-3 w-3" />
                    <span className="italic">Select your entrée</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {MEAL_OPTIONS.map((meal) => (
                      <button
                        key={meal}
                        type="button"
                        onClick={() => onMealChange(guest.id, event.id, meal)}
                        data-testid={`radio-meal-${guest.id}-${meal.toLowerCase()}`}
                        className={cn(
                          'rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                          rsvpState?.mealChoice === meal
                            ? 'border-primary bg-primary/10 text-foreground coastal-shadow'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        )}
                      >
                        {meal}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
