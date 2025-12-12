import { useEffect, useCallback, useRef } from 'react';

const DRAFT_KEY_PREFIX = 'rsvp_draft_';
const SAVE_DELAY_MS = 1000;

interface RsvpDraft {
  rsvpSelections: unknown[];
  dietaryInfo: unknown[];
  songRequests: unknown[];
  notes: string;
  savedAt: number;
}

/**
 * Hook to auto-save and restore RSVP form drafts.
 * Saves to localStorage after changes, restores on mount.
 */
export function useRsvpDraft(partyId: string | null) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getDraftKey = useCallback(() => {
    return partyId ? `${DRAFT_KEY_PREFIX}${partyId}` : null;
  }, [partyId]);

  /**
   * Save draft to localStorage with debounce.
   */
  const saveDraft = useCallback(
    (data: Omit<RsvpDraft, 'savedAt'>) => {
      const key = getDraftKey();
      if (!key) return;

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save
      saveTimeoutRef.current = setTimeout(() => {
        try {
          const draft: RsvpDraft = {
            ...data,
            savedAt: Date.now(),
          };
          localStorage.setItem(key, JSON.stringify(draft));
        } catch {
          // localStorage might be full or disabled
        }
      }, SAVE_DELAY_MS);
    },
    [getDraftKey]
  );

  /**
   * Load draft from localStorage.
   * Returns null if no draft or draft is older than 24 hours.
   */
  const loadDraft = useCallback((): RsvpDraft | null => {
    const key = getDraftKey();
    if (!key) return null;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const draft = JSON.parse(stored) as RsvpDraft;

      // Expire drafts older than 24 hours
      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - draft.savedAt > maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      return draft;
    } catch {
      return null;
    }
  }, [getDraftKey]);

  /**
   * Clear draft from localStorage (call after successful submission).
   */
  const clearDraft = useCallback(() => {
    const key = getDraftKey();
    if (!key) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  }, [getDraftKey]);

  /**
   * Check if a draft exists.
   */
  const hasDraft = useCallback((): boolean => {
    return loadDraft() !== null;
  }, [loadDraft]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  };
}
