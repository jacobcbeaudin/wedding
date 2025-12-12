'use client';

import { useState } from 'react';
import CoastalLayout from '@/components/CoastalLayout';
import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/components/providers/trpc-provider';
import { RsvpFormSkeleton } from '@/components/RsvpSkeleton';
import { MEAL_OPTIONS, MEAL_REQUIRED_EVENT } from '@/lib/config/meals';
import { MAX_SONG_REQUESTS } from '@/lib/config/rsvp';
import type {
  PartyWithDetails,
  GuestPublic,
  EventPublic,
  RsvpResponse,
} from '@/lib/validations/rsvp';

type RsvpStatus = 'attending' | 'declined';
type MealChoice = (typeof MEAL_OPTIONS)[number];

// Form state for each guest's RSVP per event
interface GuestEventRsvp {
  guestId: string;
  eventId: string;
  eventSlug: string;
  status: RsvpStatus | undefined;
  mealChoice: MealChoice | undefined;
}

// Form state for dietary restrictions per guest
interface GuestDietary {
  guestId: string;
  dietaryRestrictions: string;
}

// Form state for song requests (party-level)
interface SongRequest {
  song: string;
  artist: string;
}

export default function RSVP() {
  const { toast } = useToast();
  const [step, setStep] = useState<'lookup' | 'loading' | 'form' | 'confirmation'>('lookup');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [party, setParty] = useState<PartyWithDetails | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Form state
  const [rsvpSelections, setRsvpSelections] = useState<GuestEventRsvp[]>([]);
  const [dietaryInfo, setDietaryInfo] = useState<GuestDietary[]>([]);
  const [songRequests, setSongRequests] = useState<SongRequest[]>([]);
  const [notes, setNotes] = useState('');

  const lookupMutation = trpc.rsvp.lookup.useMutation({
    onSuccess: (data) => {
      const fetchedParty = data.party;
      setParty(fetchedParty);
      initializeFormState(fetchedParty);
      setStep('form');
    },
    onError: (err) => {
      setStep('lookup');
      setLookupError(
        err.message ||
          "We couldn't find your name. Please check the spelling matches your invitation."
      );
    },
  });

  const submitMutation = trpc.rsvp.submit.useMutation({
    onSuccess: (data) => {
      setParty(data.party);
      setStep('confirmation');
      toast({
        title: 'RSVP Submitted',
        description: "Thank you! We can't wait to celebrate with you.",
      });
    },
    onError: (err) => {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    },
  });

  const initializeFormState = (partyData: PartyWithDetails) => {
    // Initialize RSVP selections from existing data
    const initialRsvps: GuestEventRsvp[] = [];
    for (const { event, rsvps } of partyData.invitedEvents) {
      for (const guest of partyData.guests) {
        const existingRsvp = rsvps.find((r) => r.guestId === guest.id);
        initialRsvps.push({
          guestId: guest.id,
          eventId: event.id,
          eventSlug: event.slug,
          status:
            existingRsvp?.status === 'pending' || !existingRsvp
              ? undefined
              : (existingRsvp.status as RsvpStatus),
          mealChoice: existingRsvp?.mealChoice as MealChoice | undefined,
        });
      }
    }
    setRsvpSelections(initialRsvps);

    // Initialize dietary info
    const initialDietary: GuestDietary[] = partyData.guests.map((guest) => ({
      guestId: guest.id,
      dietaryRestrictions: guest.dietaryRestrictions || '',
    }));
    setDietaryInfo(initialDietary);

    // Initialize song requests from existing data
    const existingSongs = partyData.songRequests.map((sr) => ({
      song: sr.song,
      artist: sr.artist || '',
    }));
    setSongRequests(existingSongs.length > 0 ? existingSongs : [{ song: '', artist: '' }]);

    // Initialize notes
    setNotes(partyData.notes || '');
  };

  const handleLookup = () => {
    setLookupError('');
    setStep('loading');
    lookupMutation.mutate({ firstName, lastName });
  };

  const handleSubmitRSVP = () => {
    if (!party) return;
    setSubmitError('');

    // Validate all guests have responded to all events
    const incompleteRsvps = rsvpSelections.filter((r) => r.status === undefined);
    if (incompleteRsvps.length > 0) {
      setSubmitError('Please select a response for all guests and events.');
      return;
    }

    // Validate meal selection for attending wedding guests
    const missingMeals = rsvpSelections.filter(
      (r) => r.eventSlug === MEAL_REQUIRED_EVENT && r.status === 'attending' && !r.mealChoice
    );
    if (missingMeals.length > 0) {
      const guestNames = missingMeals
        .map((r) => {
          const guest = party.guests.find((g) => g.id === r.guestId);
          return guest ? formatGuestName(guest) : 'Guest';
        })
        .join(', ');
      setSubmitError(`Please select a meal for: ${guestNames}`);
      return;
    }

    // Format RSVPs for API
    const validRsvps: RsvpResponse[] = rsvpSelections.map((r) => ({
      guestId: r.guestId,
      eventId: r.eventId,
      status: r.status as RsvpStatus,
      mealChoice: r.mealChoice ?? null,
    }));

    // Format dietary updates (only non-empty)
    const dietaryUpdates = dietaryInfo.map((d) => ({
      guestId: d.guestId,
      dietaryRestrictions: d.dietaryRestrictions.trim() || null,
    }));

    // Format song requests (filter out empty ones)
    const validSongRequests = songRequests
      .filter((s) => s.song.trim() !== '')
      .map((s) => ({
        song: s.song.trim(),
        artist: s.artist.trim() || null,
      }));

    submitMutation.mutate({
      partyId: party.id,
      rsvps: validRsvps,
      dietaryUpdates,
      songRequests: validSongRequests,
      notes: notes.trim() || null,
    });
  };

  const updateRsvpSelection = (guestId: string, eventId: string, status: RsvpStatus) => {
    setRsvpSelections((prev) =>
      prev.map((r) =>
        r.guestId === guestId && r.eventId === eventId
          ? { ...r, status, mealChoice: status === 'declined' ? undefined : r.mealChoice }
          : r
      )
    );
  };

  const updateMealChoice = (guestId: string, eventId: string, meal: MealChoice) => {
    setRsvpSelections((prev) =>
      prev.map((r) =>
        r.guestId === guestId && r.eventId === eventId ? { ...r, mealChoice: meal } : r
      )
    );
  };

  const updateDietary = (guestId: string, value: string) => {
    setDietaryInfo((prev) =>
      prev.map((d) => (d.guestId === guestId ? { ...d, dietaryRestrictions: value } : d))
    );
  };

  const updateSongRequest = (index: number, field: 'song' | 'artist', value: string) => {
    setSongRequests((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addSongRequest = () => {
    if (songRequests.length < MAX_SONG_REQUESTS) {
      setSongRequests((prev) => [...prev, { song: '', artist: '' }]);
    }
  };

  const removeSongRequest = (index: number) => {
    setSongRequests((prev) => prev.filter((_, i) => i !== index));
  };

  const capitalizeName = (name: string) => {
    return name
      .split(/(\s+|-)/g)
      .map((part) => {
        if (part === ' ' || part === '-') return part;
        if (part.includes("'")) {
          const [before, after] = part.split("'");
          return (
            before.charAt(0).toUpperCase() +
            before.slice(1) +
            "'" +
            (after.charAt(0).toUpperCase() + after.slice(1))
          );
        }
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join('');
  };

  const formatGuestName = (guest: GuestPublic) =>
    `${capitalizeName(guest.firstName)} ${capitalizeName(guest.lastName)}`;

  const formatEventDate = (event: EventPublic) => {
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
  };

  // Loading screen
  if (step === 'loading') {
    return (
      <CoastalLayout>
        <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-20">
          <div className="mb-12 text-center">
            <h1 className="elegant-serif text-foreground mb-6 text-4xl font-light sm:text-5xl md:text-6xl">
              RSVP
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">Finding your invitation...</p>
          </div>

          <SectionDivider />

          <RsvpFormSkeleton />
        </div>
      </CoastalLayout>
    );
  }

  // Confirmation screen
  if (step === 'confirmation' && party) {
    return (
      <CoastalLayout>
        <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-20">
          <div className="mb-12 text-center">
            <h1 className="elegant-serif text-foreground mb-6 text-4xl font-light sm:text-5xl md:text-6xl">
              Thank You!
            </h1>
          </div>

          <Card className="coastal-shadow mx-auto max-w-2xl border-0 p-8 text-center sm:p-12">
            <div className="mb-6 text-5xl sm:text-6xl">&#10003;</div>
            <h2 className="elegant-serif text-primary mb-6 text-2xl sm:text-3xl">
              Your RSVP is Confirmed
            </h2>
            <p className="text-foreground mb-4 text-base sm:text-lg">
              We can&apos;t wait to celebrate with you on our special day.
            </p>
            <p className="text-muted-foreground mb-6 text-sm">Party: {party.name}</p>
            <Button
              variant="outline"
              onClick={() => {
                initializeFormState(party);
                setStep('form');
              }}
              data-testid="button-edit-rsvp"
            >
              Edit My RSVP
            </Button>
          </Card>
        </div>
      </CoastalLayout>
    );
  }

  // RSVP Form
  if (step === 'form' && party) {
    return (
      <CoastalLayout>
        <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-20">
          <div className="mb-12 text-center">
            <h1 className="elegant-serif text-foreground mb-6 text-4xl font-light sm:text-5xl md:text-6xl">
              RSVP
            </h1>
          </div>

          <SectionDivider />

          {/* Party Welcome */}
          <Card className="coastal-shadow mb-6 border-0 p-6 sm:mb-8 sm:p-8">
            <h2 className="elegant-serif text-primary mb-4 text-xl sm:text-2xl">
              Welcome, {party.name}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Please respond for each guest in your party.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {party.guests.map((guest) => (
                <span
                  key={guest.id}
                  className="bg-muted text-foreground rounded-full px-3 py-1 text-sm"
                >
                  {formatGuestName(guest)}
                  {guest.isPrimary && (
                    <span className="text-muted-foreground ml-1 text-xs">(primary)</span>
                  )}
                </span>
              ))}
            </div>
          </Card>

          {/* Events */}
          <Card className="coastal-shadow mb-6 border-0 p-6 sm:mb-8 sm:p-8">
            <h3 className="text-foreground mb-6 text-lg font-medium sm:text-xl">Your Events</h3>

            <div className="space-y-6 sm:space-y-8">
              {party.invitedEvents.map(({ event }) => (
                <div key={event.id} className="bg-muted/30 rounded-lg p-4 sm:p-6">
                  <div className="mb-4">
                    <h4 className="text-foreground text-base font-medium sm:text-lg">
                      {event.name}
                    </h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {formatEventDate(event)}
                    </p>
                    {event.location && (
                      <p className="text-muted-foreground text-xs sm:text-sm">{event.location}</p>
                    )}
                  </div>

                  {/* RSVP for each guest */}
                  <div className="space-y-3">
                    {party.guests.map((guest) => {
                      const rsvpState = rsvpSelections.find(
                        (r) => r.guestId === guest.id && r.eventId === event.id
                      );
                      const showMealSelection =
                        event.slug === MEAL_REQUIRED_EVENT && rsvpState?.status === 'attending';

                      return (
                        <div
                          key={`${guest.id}-${event.id}`}
                          className="bg-background/50 rounded-lg p-4"
                        >
                          <div className="mb-3">
                            <span className="text-foreground text-sm font-medium">
                              {formatGuestName(guest)}
                            </span>
                          </div>

                          {/* Modern toggle buttons for Accept/Decline */}
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => updateRsvpSelection(guest.id, event.id, 'attending')}
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
                              onClick={() => updateRsvpSelection(guest.id, event.id, 'declined')}
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
                                    onClick={() => updateMealChoice(guest.id, event.id, meal)}
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
              ))}
            </div>
          </Card>

          {/* Dietary Restrictions */}
          <Card className="coastal-shadow mb-6 border-0 p-6 sm:mb-8 sm:p-8">
            <h3 className="text-foreground mb-6 text-lg font-medium sm:text-xl">
              Dietary Restrictions
            </h3>
            <div className="space-y-4">
              {party.guests.map((guest) => {
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
                      onChange={(e) => updateDietary(guest.id, e.target.value)}
                      data-testid={`input-dietary-${guest.id}`}
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Song Requests */}
          <Card className="coastal-shadow mb-6 border-0 p-6 sm:mb-8 sm:p-8">
            <h3 className="text-foreground mb-6 text-lg font-medium sm:text-xl">Song Requests</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Any songs you&apos;d love to hear at the reception? (Max {MAX_SONG_REQUESTS})
            </p>
            <div className="space-y-4">
              {songRequests.map((sr, index) => (
                <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
                  <div className="flex-1">
                    <Label
                      htmlFor={`song-${index}`}
                      className="text-muted-foreground mb-1 block text-xs"
                    >
                      Song
                    </Label>
                    <Input
                      id={`song-${index}`}
                      placeholder="Song name..."
                      value={sr.song}
                      onChange={(e) => updateSongRequest(index, 'song', e.target.value)}
                      data-testid={`input-song-${index}`}
                    />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor={`artist-${index}`}
                      className="text-muted-foreground mb-1 block text-xs"
                    >
                      Artist (optional)
                    </Label>
                    <Input
                      id={`artist-${index}`}
                      placeholder="Artist name..."
                      value={sr.artist}
                      onChange={(e) => updateSongRequest(index, 'artist', e.target.value)}
                      data-testid={`input-artist-${index}`}
                    />
                  </div>
                  {songRequests.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSongRequest(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {songRequests.length < MAX_SONG_REQUESTS && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSongRequest}
                  className="mt-2"
                >
                  + Add Another Song
                </Button>
              )}
            </div>
          </Card>

          {/* Notes */}
          <Card className="coastal-shadow mb-6 border-0 p-6 sm:mb-8 sm:p-8">
            <h3 className="text-foreground mb-6 text-lg font-medium sm:text-xl">
              Message for the Couple
            </h3>
            <Textarea
              placeholder="Any message you'd like to share with us..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
              data-testid="input-notes"
            />
          </Card>

          {submitError && (
            <p className="text-destructive mb-6 text-center text-sm">{submitError}</p>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setStep('lookup');
                setParty(null);
                setFirstName('');
                setLastName('');
              }}
              disabled={submitMutation.isPending}
              data-testid="button-cancel"
              className="w-full sm:w-auto"
            >
              Start Over
            </Button>
            <Button
              onClick={handleSubmitRSVP}
              disabled={submitMutation.isPending}
              data-testid="button-submit-rsvp"
              className="w-full sm:w-auto"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit RSVP'}
            </Button>
          </div>
        </div>
      </CoastalLayout>
    );
  }

  // Lookup screen
  return (
    <CoastalLayout>
      <div className="container mx-auto max-w-4xl px-6 py-12 sm:py-20">
        <div className="mb-12 text-center">
          <h1 className="elegant-serif text-foreground mb-6 text-4xl font-light sm:text-5xl md:text-6xl">
            RSVP
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">We hope you can join us</p>
        </div>

        <SectionDivider />

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
                onChange={(e) => setFirstName(e.target.value)}
                disabled={lookupMutation.isPending}
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
                onChange={(e) => setLastName(e.target.value)}
                disabled={lookupMutation.isPending}
                data-testid="input-last-name"
              />
            </div>

            {lookupError && <p className="text-destructive text-sm">{lookupError}</p>}

            <Button
              onClick={handleLookup}
              disabled={!firstName || !lastName || lookupMutation.isPending}
              className="w-full"
              size="lg"
              data-testid="button-lookup-guest"
            >
              {lookupMutation.isPending ? 'Searching...' : 'Find My Invitation'}
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
      </div>
    </CoastalLayout>
  );
}
