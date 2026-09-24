/**
 * Leitner SRS Vocabulary Progress & Persistence Service
 * Manages spaced repetition states, review scheduling, and skip persistence in localStorage.
 */

export type VocabRating = 'hard' | 'medium' | 'easy';
export type VocabStatus = 'new' | 'hard' | 'medium' | 'easy' | 'skipped';

export interface VocabProgressRecord {
  termId: string;
  status: VocabStatus;
  lastReviewed: number;
  nextReviewDate: number | null;
  reviewCount: number;
  isMastered: boolean; // True for 'easy' and 'skipped' (do not show again)
}

const STORAGE_KEY = 'scoreup_vocab_progress_v2';

export const getVocabProgressMap = (): Record<string, VocabProgressRecord> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading vocab progress:', err);
    return {};
  }
};

const saveVocabProgressMap = (map: Record<string, VocabProgressRecord>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('scoreup_vocab_updated', { detail: map }));
  } catch (err) {
    console.error('Error saving vocab progress:', err);
  }
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Rate a card using Leitner SRS intervals:
 * - 'hard': repeat after 1 day
 * - 'medium': repeat after 3 days
 * - 'easy': mastered — do not show again
 */
export const rateVocabCard = (termId: string, rating: VocabRating): VocabProgressRecord => {
  const map = getVocabProgressMap();
  const existing = map[termId];
  const now = Date.now();
  const prevCount = existing ? existing.reviewCount : 0;

  let nextReviewDate: number | null = null;
  let isMastered = false;

  if (rating === 'hard') {
    nextReviewDate = now + 1 * ONE_DAY_MS;
    isMastered = false;
  } else if (rating === 'medium') {
    nextReviewDate = now + 3 * ONE_DAY_MS;
    isMastered = false;
  } else if (rating === 'easy') {
    nextReviewDate = null;
    isMastered = true;
  }

  const record: VocabProgressRecord = {
    termId,
    status: rating,
    lastReviewed: now,
    nextReviewDate,
    reviewCount: prevCount + 1,
    isMastered
  };

  map[termId] = record;
  saveVocabProgressMap(map);
  return record;
};

/**
 * Skip a card in Step 1 if the user already knows or has learned it:
 * Marks as skipped/mastered — do not show again.
 */
export const skipVocabCard = (termId: string): VocabProgressRecord => {
  const map = getVocabProgressMap();
  const existing = map[termId];
  const now = Date.now();
  const prevCount = existing ? existing.reviewCount : 0;

  const record: VocabProgressRecord = {
    termId,
    status: 'skipped',
    lastReviewed: now,
    nextReviewDate: null,
    reviewCount: prevCount + 1,
    isMastered: true
  };

  map[termId] = record;
  saveVocabProgressMap(map);
  return record;
};

/**
 * Reset a single card to new
 */
export const resetVocabCard = (termId: string) => {
  const map = getVocabProgressMap();
  delete map[termId];
  saveVocabProgressMap(map);
};

/**
 * Reset all vocabulary progress
 */
export const resetAllVocabProgress = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('scoreup_vocab_updated', { detail: {} }));
};

export interface VocabOverallStats {
  totalTerms: number;
  mastered: number; // easy + skipped
  dueForReview: number; // hard or medium where now >= nextReviewDate
  learningQueue: number; // new + due for review + hard/medium
  inProgress: number; // hard or medium
}

export const computeVocabStats = (allTermIds: string[]): VocabOverallStats => {
  const map = getVocabProgressMap();
  const now = Date.now();
  let mastered = 0;
  let dueForReview = 0;
  let inProgress = 0;

  allTermIds.forEach((id) => {
    const rec = map[id];
    if (!rec) {
      // brand new
    } else if (rec.isMastered) {
      mastered++;
    } else {
      inProgress++;
      if (rec.nextReviewDate && now >= rec.nextReviewDate) {
        dueForReview++;
      }
    }
  });

  return {
    totalTerms: allTermIds.length,
    mastered,
    dueForReview,
    learningQueue: allTermIds.length - mastered,
    inProgress
  };
};
