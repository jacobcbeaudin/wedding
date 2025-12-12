'use client';

import { useState, useRef, useCallback } from 'react';
import { useRsvpDraft } from './use-rsvp-draft';
import { MAX_SONG_REQUESTS } from '@/lib/config/rsvp';
import type {
  PartyWithDetails,
  GuestEventRsvp,
  GuestDietary,
  SongRequestForm,
  RsvpStatus,
  MealChoice,
} from '@/lib/validations/rsvp';

export interface UseRsvpFormReturn {
  // Form state
  rsvpSelections: GuestEventRsvp[];
  dietaryInfo: GuestDietary[];
  songRequests: SongRequestForm[];
  notes: string;
  draftRestored: boolean;

  // Initialization
  initializeFormState: (partyData: PartyWithDetails) => void;
  isInitializing: boolean;

  // RSVP handlers
  updateRsvpSelection: (guestId: string, eventId: string, status: RsvpStatus) => void;
  updateMealChoice: (guestId: string, eventId: string, meal: MealChoice) => void;

  // Dietary handlers
  updateDietary: (guestId: string, value: string) => void;

  // Song handlers
  updateSongRequest: (index: number, field: 'song' | 'artist', value: string) => void;
  addSongRequest: () => void;
  removeSongRequest: (index: number) => void;

  // Notes handler
  setNotes: (notes: string) => void;

  // Draft handlers
  saveDraft: () => void;
  clearDraft: () => void;
}

export function useRsvpForm(partyId: string | null): UseRsvpFormReturn {
  const [rsvpSelections, setRsvpSelections] = useState<GuestEventRsvp[]>([]);
  const [dietaryInfo, setDietaryInfo] = useState<GuestDietary[]>([]);
  const [songRequests, setSongRequests] = useState<SongRequestForm[]>([]);
  const [notes, setNotes] = useState('');
  const [draftRestored, setDraftRestored] = useState(false);
  const isInitializingRef = useRef(false);

  const {
    saveDraft: saveDraftToStorage,
    loadDraft,
    clearDraft: clearDraftFromStorage,
  } = useRsvpDraft(partyId);

  const saveDraft = useCallback(() => {
    if (isInitializingRef.current || !partyId) return;
    saveDraftToStorage({
      rsvpSelections,
      dietaryInfo,
      songRequests,
      notes,
    });
  }, [rsvpSelections, dietaryInfo, songRequests, notes, partyId, saveDraftToStorage]);

  const clearDraft = useCallback(() => {
    clearDraftFromStorage();
  }, [clearDraftFromStorage]);

  const initializeFormState = useCallback(
    (partyData: PartyWithDetails) => {
      isInitializingRef.current = true;

      // Check for saved draft first
      const draft = loadDraft();
      if (draft && !partyData.submittedAt) {
        // Restore from draft if party hasn't submitted yet
        setRsvpSelections(draft.rsvpSelections as GuestEventRsvp[]);
        setDietaryInfo(draft.dietaryInfo as GuestDietary[]);
        setSongRequests(draft.songRequests as SongRequestForm[]);
        setNotes(draft.notes);
        setDraftRestored(true);
        isInitializingRef.current = false;
        return;
      }

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
      setDraftRestored(false);

      isInitializingRef.current = false;
    },
    [loadDraft]
  );

  const updateRsvpSelection = useCallback(
    (guestId: string, eventId: string, status: RsvpStatus) => {
      setRsvpSelections((prev) =>
        prev.map((r) =>
          r.guestId === guestId && r.eventId === eventId
            ? { ...r, status, mealChoice: status === 'declined' ? undefined : r.mealChoice }
            : r
        )
      );
    },
    []
  );

  const updateMealChoice = useCallback((guestId: string, eventId: string, meal: MealChoice) => {
    setRsvpSelections((prev) =>
      prev.map((r) =>
        r.guestId === guestId && r.eventId === eventId ? { ...r, mealChoice: meal } : r
      )
    );
  }, []);

  const updateDietary = useCallback((guestId: string, value: string) => {
    setDietaryInfo((prev) =>
      prev.map((d) => (d.guestId === guestId ? { ...d, dietaryRestrictions: value } : d))
    );
  }, []);

  const updateSongRequest = useCallback(
    (index: number, field: 'song' | 'artist', value: string) => {
      setSongRequests((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    },
    []
  );

  const addSongRequest = useCallback(() => {
    setSongRequests((prev) => {
      if (prev.length < MAX_SONG_REQUESTS) {
        return [...prev, { song: '', artist: '' }];
      }
      return prev;
    });
  }, []);

  const removeSongRequest = useCallback((index: number) => {
    setSongRequests((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    rsvpSelections,
    dietaryInfo,
    songRequests,
    notes,
    draftRestored,
    initializeFormState,
    isInitializing: isInitializingRef.current,
    updateRsvpSelection,
    updateMealChoice,
    updateDietary,
    updateSongRequest,
    addSongRequest,
    removeSongRequest,
    setNotes,
    saveDraft,
    clearDraft,
  };
}
