import { DynamicPacingMetrics, MilestoneExamSchedule, AdaptivePlannerProfile } from '../types/planner';
import { formatDateISO, addDays } from './spacedRepetitionEngine';

export const KNOWN_EXAM_DATES: Record<string, string> = {
  'October 2026': '2026-10-03T08:00:00',
  'November 2026': '2026-11-07T08:00:00',
  'December 2026': '2026-12-05T08:00:00',
  'March 2027': '2027-03-13T08:00:00',
  'May 2027': '2027-05-01T08:00:00',
  'June 2027': '2027-06-05T08:00:00',
};

/**
 * Resolve target exam date string to Date object
 */
export function resolveTargetDate(dateStr?: string | null): Date {
  if (!dateStr) return new Date('2026-10-03T08:00:00');
  if (KNOWN_EXAM_DATES[dateStr]) {
    return new Date(KNOWN_EXAM_DATES[dateStr]);
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  return new Date('2026-10-03T08:00:00');
}

/**
 * Calculate dynamic goal pacing metrics based on target score and countdown.
 */
export function calculateDynamicPacingMetrics(params: {
  targetScore: number;
  baselineScore: number;
  targetExamDate: string;
  daysPerWeek?: string[];
  missedDaysOverride?: number;
}): DynamicPacingMetrics {
  const targetScore = Math.min(800, Math.max(400, params.targetScore || 780));
  const baselineScore = Math.min(800, Math.max(400, params.baselineScore || 720));
  const scoreGap = Math.max(0, targetScore - baselineScore);

  const activeDays = params.daysPerWeek && params.daysPerWeek.length > 0
    ? params.daysPerWeek
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']; // Default: 5 days/week (Rest & Burnout Guard active)

  const weeklyStudyDaysCount = activeDays.length;

  // Countdown in days from today until exam
  const examDate = resolveTargetDate(params.targetExamDate);
  const now = new Date();
  const diffMs = examDate.getTime() - now.getTime();
  const daysUntilExam = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  // Effective study days factoring in rest days (e.g., 5/7 of the total calendar days)
  const studyDayRatio = weeklyStudyDaysCount / 7;
  const effectiveStudyDays = Math.max(1, Math.round(daysUntilExam * studyDayRatio));

  // Determine if today is a scheduled rest day
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDayName = dayNames[now.getDay()];
  const isRestDayToday = !activeDays.includes(todayDayName);

  // Total questions calibrated to achieve score delta:
  // Baseline: gaining 10 SAT Math points requires ~35 targeted practice questions.
  const baseQuestionsTarget = Math.max(120, Math.round(scoreGap * 3.6));

  // Rest & Burnout Guard calculation:
  // If student missed previous sessions, we don't let overdue tasks accumulate.
  // Instead, the backlog is smoothly re-spread across remaining effective study days.
  const simulatedMissedSessions = params.missedDaysOverride !== undefined ? params.missedDaysOverride : 1;
  const missedVolume = simulatedMissedSessions * 20; // 20 Qs per missed session
  const rebalancedDeltaPerDay = effectiveStudyDays > 0 
    ? Number((missedVolume / effectiveStudyDays).toFixed(1)) 
    : 0;

  // Total target questions including smoothly absorbed load
  const totalVolumeToPractice = baseQuestionsTarget + (simulatedMissedSessions > 0 ? missedVolume : 0);

  // Daily required volume:
  // Base daily questions = totalVolume / effectiveStudyDays
  // Clamped to realistic high-performance range (18 to 28 questions per day)
  const rawDailyCount = Math.ceil(totalVolumeToPractice / effectiveStudyDays);
  const dailyQuestionsRequired = Math.min(28, Math.max(18, rawDailyCount));

  // Daily hours required:
  // Average ~1.75 minutes per question + 5 min review overhead
  const recommendedDailyMinutes = Math.round(dailyQuestionsRequired * 1.75 + 5);
  const dailyHoursRequired = Number((recommendedDailyMinutes / 60).toFixed(1));

  return {
    targetScore,
    baselineScore,
    scoreGap,
    daysUntilExam,
    effectiveStudyDays,
    dailyQuestionsRequired,
    dailyHoursRequired,
    weeklyStudyDaysCount,
    activeDaysOfWeek: activeDays,
    isRestDayToday,
    missedSessionsCount: simulatedMissedSessions,
    rebalancedDeltaPerDay,
    recommendedDailyMinutes,
  };
}

/**
 * Generate Milestone Full-Length Practice Exams and Post-Test Review Days.
 * Blocks out full timed tests every alternating weekend (e.g. every ~14 days)
 * with the immediately following day designated as "Post-Test Review & Error Diagnostic".
 */
export function generateMilestoneSchedule(targetExamDate: string): MilestoneExamSchedule[] {
  const schedule: MilestoneExamSchedule[] = [];
  const today = new Date();
  const todayStr = formatDateISO(today);
  const examDate = resolveTargetDate(targetExamDate);

  const diffMs = examDate.getTime() - today.getTime();
  const totalDays = Math.max(14, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  // Alternating weekend offsets (e.g., Day 6, Day 20, Day 34, etc.)
  const milestoneIntervals = [6, 20, 34, 48, 62].filter((d) => d < totalDays);

  milestoneIntervals.forEach((offset, idx) => {
    const examDateObj = new Date(today);
    examDateObj.setDate(examDateObj.getDate() + offset);
    const examDateStr = formatDateISO(examDateObj);

    const reviewDateObj = new Date(examDateObj);
    reviewDateObj.setDate(reviewDateObj.getDate() + 1);
    const reviewDateStr = formatDateISO(reviewDateObj);

    const isMockToday = examDateStr === todayStr;
    const isReviewToday = reviewDateStr === todayStr;

    // 1. Full-Length Mock Exam Entry
    schedule.push({
      id: `milestone-exam-${idx + 1}`,
      date: examDateStr,
      title: `Milestone Mock Exam #${idx + 1}`,
      type: 'full_mock',
      description: 'Official 44-Question Full Adaptive Simulation (Module 1 + Hard Module 2 with strict timing).',
      completed: offset < 0,
      score: offset < 0 ? 740 + idx * 20 : undefined,
      isUpcoming: offset >= 0,
      isToday: isMockToday,
    });

    // 2. Built-in Post-Test Error Diagnostic & Review Day Entry
    schedule.push({
      id: `milestone-review-${idx + 1}`,
      date: reviewDateStr,
      title: `Post-Test Error Diagnostic #${idx + 1}`,
      type: 'review_day',
      description: 'Zero new question load. 100% deep-dive on exam misses, Desmos speed checks, and re-feeding mistakes into Spaced Repetition.',
      completed: offset < -1,
      isUpcoming: offset >= -1,
      isToday: isReviewToday,
    });
  });

  return schedule;
}
