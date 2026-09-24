import { DailySprintQueue, SprintBlockItem, SubtopicSkill, DynamicPacingMetrics } from '../types/planner';
import { ALL_QUESTIONS } from '../data/questions';
import { QuestionItem } from '../types/questionBank';
import { getDueSpacedRepetitionQuestions, getSpacedRepetitionQueue, formatDateISO } from './spacedRepetitionEngine';
import { getProgress } from '../services/userProgress';

/**
 * Auto-assembles today's 3-block Daily Sprint Queue:
 * 1. Warmup: 3 quick review questions from previously missed topics & spaced repetition.
 * 2. Core Focus: 10–15 questions targeting student's lowest-mastery subtopic.
 * 3. Speed Run: 5 timed questions replicating hard Module 2 pacing (~75s/question).
 */
export function generateDailySprintQueue(params: {
  skills: SubtopicSkill[];
  pacing: DynamicPacingMetrics;
  todayDate?: string;
}): DailySprintQueue {
  const { skills, pacing } = params;
  const todayStr = params.todayDate || formatDateISO(new Date());

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. WARMUP BLOCK (Exactly 3 Questions)
  // ─────────────────────────────────────────────────────────────────────────────
  const dueSpacedRepetition = getDueSpacedRepetitionQuestions(todayStr);
  const userProgress = getProgress();
  const mistakeAttemptIds = Object.values(userProgress)
    .filter((a) => !a.isCorrect)
    .map((a) => a.questionId);

  const warmupQuestions: QuestionItem[] = [];
  const usedIds = new Set<string>();

  // Priority A: Due spaced repetition items (scheduled for 3d, 7d, 14d review)
  for (const sr of dueSpacedRepetition) {
    if (warmupQuestions.length >= 3) break;
    const q = ALL_QUESTIONS.find((item) => item.id === sr.questionId);
    if (q && !usedIds.has(q.id)) {
      warmupQuestions.push(q);
      usedIds.add(q.id);
    }
  }

  // Priority B: Previously missed questions from progress log
  for (const mistakeId of mistakeAttemptIds) {
    if (warmupQuestions.length >= 3) break;
    const q = ALL_QUESTIONS.find((item) => item.id === mistakeId);
    if (q && !usedIds.has(q.id)) {
      warmupQuestions.push(q);
      usedIds.add(q.id);
    }
  }

  // Priority C: Any item from the spaced repetition queue
  const allSr = getSpacedRepetitionQueue();
  for (const sr of allSr) {
    if (warmupQuestions.length >= 3) break;
    const q = ALL_QUESTIONS.find((item) => item.id === sr.questionId);
    if (q && !usedIds.has(q.id)) {
      warmupQuestions.push(q);
      usedIds.add(q.id);
    }
  }

  // Fallback: Foundational Easy/Medium questions if no mistakes exist yet
  if (warmupQuestions.length < 3) {
    const fallbackCandidates = ALL_QUESTIONS.filter((q) => q.difficulty === 'Medium' || q.difficulty === 'Easy');
    for (const q of fallbackCandidates) {
      if (warmupQuestions.length >= 3) break;
      if (!usedIds.has(q.id)) {
        warmupQuestions.push(q);
        usedIds.add(q.id);
      }
    }
  }

  const warmupBlock: SprintBlockItem = {
    type: 'warmup',
    title: 'Warmup & Error Log Reactivation',
    badgeLabel: dueSpacedRepetition.length > 0 
      ? `Spaced Repetition Due (${dueSpacedRepetition.length} Due)` 
      : 'Mistake Pattern Review',
    subtopicName: 'Missed & Flagged Question Vault',
    questionCount: warmupQuestions.length,
    estimatedMinutes: 5,
    advice: 'Re-activate neurological pathways on previously missed items. Read explanations actively before diving into new topics.',
    completed: false,
    questions: warmupQuestions,
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. CORE FOCUS BLOCK (10–15 Questions Targeting Lowest Mastery Subtopic)
  // ─────────────────────────────────────────────────────────────────────────────
  // Find student's lowest mastery subtopic from the 18-subtopic skill matrix
  const sortedSkills = [...skills].sort((a, b) => a.mastery - b.mastery);
  const lowestSkill = sortedSkills[0] || {
    id: 'adv-nonlinear-funcs',
    name: 'Nonlinear functions',
    domain: 'Advanced Math',
    mastery: 44,
  };

  // Target count: between 10 and 15 questions based on daily pacing requirement
  const targetCoreCount = Math.min(15, Math.max(10, pacing.dailyQuestionsRequired - 8));

  // Match questions for this subtopic or domain
  const matchingSubtopicQuestions = ALL_QUESTIONS.filter((q) => {
    if (usedIds.has(q.id)) return false;
    const topicMatch = q.topic && q.topic.toLowerCase().includes(lowestSkill.name.toLowerCase().split(' ')[0]);
    const domainMatch = q.domain && q.domain.toLowerCase().includes(lowestSkill.domain.toLowerCase());
    return topicMatch || domainMatch;
  });

  // Prefer Medium and Hard questions to raise mastery
  const coreQuestions: QuestionItem[] = [];
  const mediumHard = matchingSubtopicQuestions.filter((q) => q.difficulty === 'Medium' || q.difficulty === 'Hard');
  const pool = mediumHard.length >= targetCoreCount ? mediumHard : matchingSubtopicQuestions;

  for (const q of pool) {
    if (coreQuestions.length >= targetCoreCount) break;
    if (!usedIds.has(q.id)) {
      coreQuestions.push(q);
      usedIds.add(q.id);
    }
  }

  // If still below target, supplement from domain
  if (coreQuestions.length < targetCoreCount) {
    const supplement = ALL_QUESTIONS.filter((q) => !usedIds.has(q.id) && q.domain === lowestSkill.domain);
    for (const q of supplement) {
      if (coreQuestions.length >= targetCoreCount) break;
      coreQuestions.push(q);
      usedIds.add(q.id);
    }
  }

  const coreEstimatedMins = Math.round(coreQuestions.length * 1.8);

  const coreFocusBlock: SprintBlockItem = {
    type: 'core_focus',
    title: `Core Focus: ${lowestSkill.name}`,
    badgeLabel: `Lowest Mastery: ${lowestSkill.mastery}% (${lowestSkill.domain})`,
    subtopicName: lowestSkill.name,
    questionCount: coreQuestions.length,
    estimatedMinutes: coreEstimatedMins,
    advice: `Targeting your highest-yield deficit. Take your time to write out expressions and verify coefficients on Desmos.`,
    completed: false,
    questions: coreQuestions,
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. SPEED RUN BLOCK (5 Timed Questions Replicating Hard Module 2 Pacing)
  // ─────────────────────────────────────────────────────────────────────────────
  // Replicating hard Module 2 pacing: Upper-Medium and Hard across mixed domains
  const hardPool = ALL_QUESTIONS.filter(
    (q) => !usedIds.has(q.id) && (q.difficulty === 'Hard' || q.difficulty === 'Medium')
  );

  const speedRunQuestions: QuestionItem[] = [];
  for (const q of hardPool) {
    if (speedRunQuestions.length >= 5) break;
    speedRunQuestions.push(q);
    usedIds.add(q.id);
  }

  const speedRunBlock: SprintBlockItem = {
    type: 'speed_run',
    title: 'Timed Hard Module 2 Speed Run',
    badgeLabel: 'Module 2 High-Pressure Simulator (~75s/q)',
    subtopicName: 'Mixed Official College Board Domains',
    questionCount: speedRunQuestions.length,
    estimatedMinutes: 7,
    timeLimitSecondsPerQuestion: 75, // 75 seconds per question = strict 6m 15s module simulation
    advice: 'Hard Module 2 conditions: If you do not have a solution path within 30 seconds, immediately plug into Desmos or flag and move on.',
    completed: false,
    questions: speedRunQuestions,
  };

  const totalQuestions = warmupBlock.questionCount + coreFocusBlock.questionCount + speedRunBlock.questionCount;
  const totalEstimatedMinutes = warmupBlock.estimatedMinutes + coreFocusBlock.estimatedMinutes + speedRunBlock.estimatedMinutes;

  return {
    date: todayStr,
    totalQuestions,
    totalEstimatedMinutes,
    targetScore: pacing.targetScore,
    warmup: warmupBlock,
    coreFocus: coreFocusBlock,
    speedRun: speedRunBlock,
  };
}
