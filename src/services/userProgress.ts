export interface QuestionAttempt {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  attemptedAt: number;
}

const SOLVED_STORAGE_KEY = 'scoreup_solved_questions';
const BOOKMARKS_STORAGE_KEY = 'scoreup_bookmarked_questions';

export const getProgress = (): Record<string, QuestionAttempt> => {
  try {
    const data = localStorage.getItem(SOLVED_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const recordAttempt = (attempt: QuestionAttempt) => {
  const current = getProgress();
  current[attempt.questionId] = attempt;
  try {
    localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save attempt to localStorage', e);
  }
  window.dispatchEvent(new Event('scoreup_progress_updated'));
};

export const getBookmarks = (): string[] => {
  try {
    const data = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const isBookmarked = (questionId: string): boolean => {
  return getBookmarks().includes(questionId);
};

export const toggleBookmark = (questionId: string): boolean => {
  const current = getBookmarks();
  const exists = current.includes(questionId);
  const updated = exists ? current.filter((id) => id !== questionId) : [...current, questionId];
  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save bookmarks to localStorage', e);
  }
  window.dispatchEvent(new Event('scoreup_bookmarks_updated'));
  return !exists;
};

export const getMistakes = (): QuestionAttempt[] => {
  const progress = getProgress();
  return Object.values(progress).filter((att) => !att.isCorrect);
};

export const clearProgress = () => {
  try {
    localStorage.removeItem(SOLVED_STORAGE_KEY);
    localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('scoreup_progress_updated'));
  window.dispatchEvent(new Event('scoreup_bookmarks_updated'));
};
