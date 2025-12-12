'use client';

import { useState } from 'react';
import CoastalLayout from '@/components/CoastalLayout';
import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/components/providers/trpc-provider';
import { RsvpFormSkeleton } from '@/components/RsvpSkeleton';
import { MEAL_OPTIONS, MEAL_REQUIRED_EVENT } from '@/lib/config/meals';
import { MAX_SONG_REQUESTS } from '@/lib/config/rsvp';
import {
  GuestLookupForm,
  RsvpEventCard,
  DietarySection,
  SongRequestsSection,
  RsvpConfirmation,
} from '@/components/rsvp';
import type { PartyWithDetails, GuestPublic, RsvpResponse } from '@/lib/validations/rsvp';

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

// Helper to format guest names
function capitalizeName(name: string) {
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
}

function formatGuestName(guest: GuestPublic) {
  return `${capitalizeName(guest.firstName)} ${capitalizeName(guest.lastName)}`;
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

          <RsvpConfirmation
            party={party}
            onEditRsvp={() => {
              initializeFormState(party);
              setStep('form');
            }}
          />
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
                <RsvpEventCard
                  key={event.id}
                  event={event}
                  guests={party.guests}
                  rsvpSelections={rsvpSelections}
                  onStatusChange={updateRsvpSelection}
                  onMealChange={updateMealChoice}
                  formatGuestName={formatGuestName}
                />
              ))}
            </div>
          </Card>

          {/* Dietary Restrictions */}
          <DietarySection
            guests={party.guests}
            dietaryInfo={dietaryInfo}
            onDietaryChange={updateDietary}
            formatGuestName={formatGuestName}
          />

          {/* Song Requests */}
          <SongRequestsSection
            songRequests={songRequests}
            onSongChange={updateSongRequest}
            onAddSong={addSongRequest}
            onRemoveSong={removeSongRequest}
          />

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

        <GuestLookupForm
          firstName={firstName}
          lastName={lastName}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onSubmit={handleLookup}
          isLoading={lookupMutation.isPending}
          error={lookupError}
        />
      </div>
    </CoastalLayout>
  );
}
