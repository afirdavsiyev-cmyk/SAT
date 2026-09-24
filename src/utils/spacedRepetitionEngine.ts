import { SpacedRepetitionRecord, SpacedRepetitionStage, SATDomain, MistakeReason } from '../types/planner';
import { ALL_QUESTIONS } from '../data/questions';
import { getProgress } from '../services/userProgress';

export const SPACED_REPETITION_KEY = 'scoreup_spaced_repetition_queue';

// Helper: Format date as YYYY-MM-DD
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper: Add days to a date
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDateISO(d);
}

/**
 * Retrieve the full Spaced Repetition queue from localStorage.
 */
export function getSpacedRepetitionQueue(): SpacedRepetitionRecord[] {
  try {
    const raw = localStorage.getItem(SPACED_REPETITION_KEY);
    if (raw) {
      const parsed: SpacedRepetitionRecord[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed reading spaced repetition queue', e);
  }

  return seedInitialSpacedRepetitionQueue();
}

/**
 * Save the Spaced Repetition queue to localStorage and dispatch event.
 */
export function saveSpacedRepetitionQueue(queue: SpacedRepetitionRecord[]): void {
  try {
    localStorage.setItem(SPACED_REPETITION_KEY, JSON.stringify(queue));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('scoreup_spaced_repetition_updated', { detail: queue }));
    }
  } catch (e) {
    console.error('Failed saving spaced repetition queue', e);
  }
}

/**
 * Add or update a missed question into the spaced repetition queue.
 */
export function addMissedQuestionToSpacedRepetition(params: {
  questionId: string;
  domain?: SATDomain;
  subtopicName?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  mistakeReason?: MistakeReason;
}): SpacedRepetitionRecord {
  const queue = getSpacedRepetitionQueue();
  const todayStr = formatDateISO(new Date());

  const existingIdx = queue.findIndex((item) => item.questionId === params.questionId);

  if (existingIdx !== -1) {
    // If it was already in queue, re-trigger stage 1 (3 days) and reset consecutive correct
    const existing = queue[existingIdx];
    const updated: SpacedRepetitionRecord = {
      ...existing,
      mistakeReason: params.mistakeReason || existing.mistakeReason,
      dueDate: addDays(todayStr, 3),
      stage: 1,
      consecutiveCorrect: 0,
      totalAttempts: (existing.totalAttempts || 1) + 1,
      lastAttemptDate: todayStr,
      lastAttemptCorrect: false,
    };
    queue[existingIdx] = updated;
    saveSpacedRepetitionQueue(queue);
    return updated;
  }

  // Derive domain/subtopic/difficulty from ALL_QUESTIONS if not fully provided
  const metaQuestion = ALL_QUESTIONS.find((q) => q.id === params.questionId);
  const domain: SATDomain = params.domain || (metaQuestion?.domain?.includes('Advanced') ? 'Advanced Math' : metaQuestion?.domain?.includes('Problem') ? 'Problem Solving' : metaQuestion?.domain?.includes('Geometry') ? 'Geometry & Trig' : 'Algebra');
  const subtopicName = params.subtopicName || metaQuestion?.topic || 'Algebraic Core';
  const difficulty = params.difficulty || metaQuestion?.difficulty || 'Medium';

  const newRecord: SpacedRepetitionRecord = {
    questionId: params.questionId,
    domain,
    subtopicName,
    difficulty,
    mistakeReason: params.mistakeReason || 'calculation_slip',
    addedDate: todayStr,
    dueDate: addDays(todayStr, 3), // +3 days for initial review
    stage: 1,
    consecutiveCorrect: 0,
    totalAttempts: 1,
    lastAttemptDate: todayStr,
    lastAttemptCorrect: false,
  };

  queue.unshift(newRecord);
  saveSpacedRepetitionQueue(queue);
  return newRecord;
}

/**
 * Record an attempt on a spaced repetition question:
 * - If correct: increment consecutiveCorrect.
 *   - If consecutiveCorrect >= 2: graduate!
 *   - If consecutiveCorrect === 1: advance stage (stage 1 -> 2 at +7d, stage 2 -> 3 at +14d).
 * - If incorrect: reset consecutiveCorrect = 0, reset stage = 1 (+3d).
 */
export function recordSpacedRepetitionAttempt(
  questionId: string,
  isCorrect: boolean
): SpacedRepetitionRecord | null {
  const queue = getSpacedRepetitionQueue();
  const todayStr = formatDateISO(new Date());

  const idx = queue.findIndex((r) => r.questionId === questionId);
  if (idx === -1) {
    if (!isCorrect) {
      return addMissedQuestionToSpacedRepetition({ questionId });
    }
    return null;
  }

  const current = queue[idx];
  let nextStage: SpacedRepetitionStage = current.stage;
  let nextConsecutive = current.consecutiveCorrect;
  let nextDueDate = current.dueDate;

  if (isCorrect) {
    nextConsecutive += 1;
    if (nextConsecutive >= 2) {
      // Graduated! Answered correctly twice consecutively
      nextStage = 'graduated';
      nextDueDate = '9999-12-31';
    } else {
      // First consecutive correct answer: advance interval stage
      if (current.stage === 1) {
        nextStage = 2;
        nextDueDate = addDays(todayStr, 7); // Stage 2: 7 days
      } else if (current.stage === 2) {
        nextStage = 3;
        nextDueDate = addDays(todayStr, 14); // Stage 3: 14 days
      } else if (current.stage === 3) {
        // In stage 3 with 1 correct, next correct will graduate
        nextDueDate = addDays(todayStr, 14);
      }
    }
  } else {
    // Incorrect answer: reset consecutive correct and revert to stage 1 (+3 days)
    nextConsecutive = 0;
    nextStage = 1;
    nextDueDate = addDays(todayStr, 3);
  }

  const updated: SpacedRepetitionRecord = {
    ...current,
    stage: nextStage,
    consecutiveCorrect: nextConsecutive,
    dueDate: nextDueDate,
    lastAttemptDate: todayStr,
    lastAttemptCorrect: isCorrect,
    totalAttempts: (current.totalAttempts || 1) + 1,
  };

  queue[idx] = updated;
  saveSpacedRepetitionQueue(queue);
  return updated;
}

/**
 * Get items due today or overdue (stage !== 'graduated' and dueDate <= today)
 */
export function getDueSpacedRepetitionQuestions(todayDateStr?: string): SpacedRepetitionRecord[] {
  const todayStr = todayDateStr || formatDateISO(new Date());
  const queue = getSpacedRepetitionQueue();

  return queue
    .filter((item) => item.stage !== 'graduated' && item.dueDate <= todayStr)
    .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
}

/**
 * Get items currently graduating / graduated (answered correctly twice consecutively).
 */
export function getGraduatedSpacedRepetitionQuestions(): SpacedRepetitionRecord[] {
  const queue = getSpacedRepetitionQueue();
  return queue.filter((item) => item.stage === 'graduated');
}

/**
 * Seed initial realistic spaced repetition queue if empty.
 */
export function seedInitialSpacedRepetitionQueue(): SpacedRepetitionRecord[] {
  const today = new Date();
  const todayStr = formatDateISO(today);

  // Check if any mistakes already exist in getProgress()
  const progress = getProgress();
  const mistakeIds = Object.values(progress)
    .filter((a) => !a.isCorrect)
    .map((a) => a.questionId);

  // Pick realistic sample questions from ALL_QUESTIONS
  const candidateIds = mistakeIds.length >= 4 
    ? mistakeIds.slice(0, 8) 
    : [
        ALL_QUESTIONS[0]?.id || 'alg_q1',
        ALL_QUESTIONS[1]?.id || 'alg_q2',
        ALL_QUESTIONS[15]?.id || 'adv_q1',
        ALL_QUESTIONS[22]?.id || 'ps_q1',
        ALL_QUESTIONS[30]?.id || 'geo_q1',
      ];

  const seeded: SpacedRepetitionRecord[] = [
    {
      questionId: candidateIds[0],
      domain: 'Algebra',
      subtopicName: 'Systems of two linear equations',
      difficulty: 'Medium',
      mistakeReason: 'calculation_slip',
      addedDate: addDays(todayStr, -3),
      dueDate: todayStr, // Due today for 3-day review!
      stage: 1,
      consecutiveCorrect: 0,
      totalAttempts: 1,
      lastAttemptDate: addDays(todayStr, -3),
      lastAttemptCorrect: false,
    },
    {
      questionId: candidateIds[1],
      domain: 'Advanced Math',
      subtopicName: 'Nonlinear functions',
      difficulty: 'Hard',
      mistakeReason: 'concept_gap',
      addedDate: addDays(todayStr, -7),
      dueDate: todayStr, // Due today for 7-day review!
      stage: 2,
      consecutiveCorrect: 1,
      totalAttempts: 2,
      lastAttemptDate: addDays(todayStr, -7),
      lastAttemptCorrect: true,
    },
    {
      questionId: candidateIds[2],
      domain: 'Problem Solving',
      subtopicName: 'Ratios and rates',
      difficulty: 'Medium',
      mistakeReason: 'misread_question',
      addedDate: addDays(todayStr, -14),
      dueDate: todayStr, // Due today for 14-day review!
      stage: 3,
      consecutiveCorrect: 1,
      totalAttempts: 2,
      lastAttemptDate: addDays(todayStr, -14),
      lastAttemptCorrect: true,
    },
    {
      questionId: candidateIds[3] || candidateIds[0],
      domain: 'Geometry & Trig',
      subtopicName: 'Circles and radian theorems',
      difficulty: 'Hard',
      mistakeReason: 'wrong_formula',
      addedDate: addDays(todayStr, -2),
      dueDate: addDays(todayStr, 1), // Upcoming in 1 day
      stage: 1,
      consecutiveCorrect: 0,
      totalAttempts: 1,
      lastAttemptDate: addDays(todayStr, -2),
      lastAttemptCorrect: false,
    },
    {
      questionId: candidateIds[4] || candidateIds[1],
      domain: 'Algebra',
      subtopicName: 'Linear inequalities in two variables',
      difficulty: 'Medium',
      mistakeReason: 'time_panic',
      addedDate: addDays(todayStr, -21),
      dueDate: '9999-12-31',
      stage: 'graduated', // Successfully graduated (2 consecutive correct)
      consecutiveCorrect: 2,
      totalAttempts: 3,
      lastAttemptDate: addDays(todayStr, -7),
      lastAttemptCorrect: true,
    },
  ];

  try {
    localStorage.setItem(SPACED_REPETITION_KEY, JSON.stringify(seeded));
  } catch {
    // ignore
  }

  return seeded;
}
