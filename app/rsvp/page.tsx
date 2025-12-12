'use client';

import { useState, useEffect } from 'react';
import CoastalLayout from '@/components/CoastalLayout';
import SectionDivider from '@/components/SectionDivider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRsvpForm } from '@/hooks/use-rsvp-form';
import { trpc } from '@/components/providers/trpc-provider';
import { RsvpFormSkeleton } from '@/components/RsvpSkeleton';
import { MEAL_REQUIRED_EVENT } from '@/lib/config/meals';
import {
  GuestLookupForm,
  RsvpEventCard,
  DietarySection,
  SongRequestsSection,
  RsvpConfirmation,
} from '@/components/rsvp';
import type { PartyWithDetails, RsvpResponse, RsvpStatus } from '@/lib/validations/rsvp';
import { formatGuestName } from '@/lib/utils/formatting';

export default function RSVP() {
  const { toast } = useToast();
  const [step, setStep] = useState<'lookup' | 'loading' | 'form' | 'confirmation'>('lookup');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [party, setParty] = useState<PartyWithDetails | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Form state from hook
  const {
    rsvpSelections,
    dietaryInfo,
    songRequests,
    notes,
    draftRestored,
    initializeFormState,
    updateRsvpSelection,
    updateMealChoice,
    updateDietary,
    updateSongRequest,
    addSongRequest,
    removeSongRequest,
    setNotes,
    saveDraft,
    clearDraft,
  } = useRsvpForm(party?.id ?? null);

  // Auto-save form state to localStorage when it changes
  useEffect(() => {
    if (!party || step !== 'form') return;
    saveDraft();
  }, [rsvpSelections, dietaryInfo, songRequests, notes, party, step, saveDraft]);

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
      clearDraft(); // Clear saved draft on success
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

          {/* Draft Restored Notice */}
          {draftRestored && (
            <div className="bg-primary/5 border-primary/20 mb-6 rounded-lg border p-4 text-sm">
              <p className="text-foreground">
                We restored your previous selections. You can continue where you left off.
              </p>
              <button
                type="button"
                className="text-primary hover:text-primary/80 mt-1 text-sm underline"
                onClick={() => {
                  clearDraft();
                  if (party) initializeFormState(party);
                }}
              >
                Start fresh instead
              </button>
            </div>
          )}

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
            <div className="bg-destructive/10 border-destructive/20 mb-6 rounded-lg border p-4">
              <p className="text-destructive text-sm font-medium">{submitError}</p>
            </div>
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
