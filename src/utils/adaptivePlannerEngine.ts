import {
  SATDomain,
  SubtopicSkill,
  QuestionAttempt,
  DailyActionPlan,
  ActionPlanBlock,
  AdaptivePlannerProfile,
  StoredAdaptivePlannerData,
  MistakeReason,
  SkillStatus
} from '../types/planner';

export const ADAPTIVE_STORAGE_KEY = 'sat_adaptive_planner_v2';

// ─── 1. Official 18 Subtopics Taxonomy Definition ─────────────────────────
export interface BaseTaxonomySkill {
  id: string;
  name: string;
  domain: SATDomain;
  defaultAvgSec: number;
}

export const OFFICIAL_18_SUBTOPICS: BaseTaxonomySkill[] = [
  // Algebra (~35% exam weight)
  { id: 'alg-linear-one', name: 'Linear equations in one variable', domain: 'Algebra', defaultAvgSec: 45 },
  { id: 'alg-linear-two', name: 'Linear equations in two variables', domain: 'Algebra', defaultAvgSec: 55 },
  { id: 'alg-linear-funcs', name: 'Linear functions', domain: 'Algebra', defaultAvgSec: 50 },
  { id: 'alg-systems', name: 'Systems of two linear equations in two variables', domain: 'Algebra', defaultAvgSec: 65 },
  { id: 'alg-inequalities', name: 'Linear inequalities in one or two variables', domain: 'Algebra', defaultAvgSec: 50 },

  // Advanced Math (~35% exam weight)
  { id: 'adv-equiv-expr', name: 'Equivalent expressions', domain: 'Advanced Math', defaultAvgSec: 60 },
  { id: 'adv-nonlinear-one', name: 'Nonlinear equations in one variable', domain: 'Advanced Math', defaultAvgSec: 75 },
  { id: 'adv-nonlinear-funcs', name: 'Nonlinear functions', domain: 'Advanced Math', defaultAvgSec: 80 },

  // Problem-Solving & Data Analysis (~15% exam weight)
  { id: 'ps-ratios', name: 'Ratios, rates, and proportional relationships', domain: 'Problem Solving', defaultAvgSec: 45 },
  { id: 'ps-percentages', name: 'Percentages', domain: 'Problem Solving', defaultAvgSec: 40 },
  { id: 'ps-one-var-data', name: 'One-variable data distributions and spread', domain: 'Problem Solving', defaultAvgSec: 55 },
  { id: 'ps-two-var-data', name: 'Two-variable data models and scatterplots', domain: 'Problem Solving', defaultAvgSec: 60 },
  { id: 'ps-probability', name: 'Probability and conditional probability', domain: 'Problem Solving', defaultAvgSec: 50 },
  { id: 'ps-inference', name: 'Inference from sample statistics', domain: 'Problem Solving', defaultAvgSec: 55 },

  // Geometry & Trigonometry (~15% exam weight)
  { id: 'geo-area-vol', name: 'Area and volume', domain: 'Geometry & Trig', defaultAvgSec: 65 },
  { id: 'geo-lines-triangles', name: 'Lines, angles, and triangles', domain: 'Geometry & Trig', defaultAvgSec: 50 },
  { id: 'geo-right-tri-trig', name: 'Right triangles and trigonometry', domain: 'Geometry & Trig', defaultAvgSec: 70 },
  { id: 'geo-circles', name: 'Circles and radian theorems', domain: 'Geometry & Trig', defaultAvgSec: 85 },
];

export const DOMAIN_WEIGHTS: Record<SATDomain, number> = {
  'Algebra': 0.35,
  'Advanced Math': 0.35,
  'Problem Solving': 0.15,
  'Geometry & Trig': 0.15,
};

// ─── 2. Status Evaluator Helper ──────────────────────────────────────────
export function getStatusFromMastery(mastery: number): SkillStatus {
  if (mastery < 40) return 'Critical';
  if (mastery < 60) return 'Weak';
  if (mastery < 75) return 'Developing';
  if (mastery < 90) return 'Strong';
  return 'Mastered';
}

// ─── 3. Seed Initial Subtopic Skills based on Baseline Score ───────────────
export function initializeSubtopicSkills(baselineScore: number = 720): SubtopicSkill[] {
  // Baseline mastery ratio (500 = 45%, 700 = 75%, 800 = 92%)
  const clampedBaseline = Math.min(800, Math.max(400, baselineScore));
  const baseMastery = Math.round(35 + ((clampedBaseline - 400) / 400) * 58);

  return OFFICIAL_18_SUBTOPICS.map((sub, idx) => {
    // Generate realistic organic variance across domains
    let domainOffset = 0;
    if (sub.domain === 'Algebra') domainOffset = 4;
    else if (sub.domain === 'Advanced Math') domainOffset = -3;
    else if (sub.domain === 'Problem Solving') domainOffset = 2;
    else if (sub.domain === 'Geometry & Trig') domainOffset = -5;

    // Additional subtopic difficulty adjustments (e.g. circles and nonlinear functions are harder)
    const specificOffset = (idx % 5 === 0 ? -6 : idx % 3 === 0 ? 3 : 0);
    const mastery = Math.max(28, Math.min(96, baseMastery + domainOffset + specificOffset));
    
    // Estimate baseline accuracy
    const easyAcc = Math.min(100, Math.max(50, Math.round(mastery * 1.15)));
    const medAcc = Math.min(100, Math.max(30, Math.round(mastery * 0.95)));
    const hardAcc = Math.min(100, Math.max(15, Math.round(mastery * 0.72)));

    return {
      id: sub.id,
      name: sub.name,
      domain: sub.domain,
      mastery,
      accuracy: {
        easy: easyAcc,
        medium: medAcc,
        hard: hardAcc,
      },
      avgSecondsPerQuestion: sub.defaultAvgSec,
      status: getStatusFromMastery(mastery),
      totalAttempts: 12 + (idx % 6) * 4,
      lastPracticedDate: new Date(Date.now() - (idx * 86400000)).toISOString(),
    };
  });
}

// ─── 4. Priority Calculation Formula ──────────────────────────────────────
/**
 * Priority Score:
 * Priority = (100 - Mastery) * DomainWeight * TargetGapRatio
 */
export function calculatePriorityScore(
  skill: SubtopicSkill,
  targetScore: number,
  baselineScore: number
): number {
  const gap = Math.max(0, targetScore - baselineScore);
  const targetGapRatio = Math.max(1.0, gap / 100);
  const domainWeight = DOMAIN_WEIGHTS[skill.domain] || 0.25;

  const rawPriority = (100 - skill.mastery) * domainWeight * targetGapRatio;
  return Number(rawPriority.toFixed(2));
}

export function getRankedPrioritySkills(
  skills: SubtopicSkill[],
  targetScore: number,
  baselineScore: number
): { skill: SubtopicSkill; priorityScore: number }[] {
  return skills
    .map((skill) => ({
      skill,
      priorityScore: calculatePriorityScore(skill, targetScore, baselineScore),
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

// ─── 5. Dynamic Difficulty Allocation Formula ─────────────────────────────
/**
 * Dynamic difficulty distribution:
 * If easy accuracy > 90%: 15% easy, 60% medium, 25% hard.
 * If overall accuracy < 60%: 50% easy, 35% medium, 15% hard.
 * Otherwise: 30% easy, 50% medium, 20% hard.
 */
export function calculateDifficultyDistribution(
  skill: SubtopicSkill
): { easy: number; medium: number; hard: number } {
  const easyAccuracy = skill.accuracy.easy;
  const avgAccuracy = Math.round((skill.accuracy.easy + skill.accuracy.medium + skill.accuracy.hard) / 3);

  if (easyAccuracy > 90) {
    return { easy: 15, medium: 60, hard: 25 };
  } else if (avgAccuracy < 60) {
    return { easy: 50, medium: 35, hard: 15 };
  } else {
    return { easy: 30, medium: 50, hard: 20 };
  }
}

// ─── 6. Multi-Component Daily Action Plan Generator ───────────────────────
/**
 * Multi-component formula:
 * - 5m: Review 2-3 previously missed questions
 * - 15m: Target #1 Priority weak subtopic (adaptive difficulty)
 * - 15m: High-yield medium/hard practice
 * - 10m: Timed mixed speed-drill
 * (Scales proportionately with user's daily study minutes)
 */
export function generateDailyActionPlan(
  profile: AdaptivePlannerProfile,
  skills: SubtopicSkill[],
  missedAttemptsCount: number = 3
): DailyActionPlan {
  const totalMin = profile.dailyMinutes || 45;
  const timeScale = totalMin / 45;

  // Find ranked skills
  const ranked = getRankedPrioritySkills(skills, profile.targetScore, profile.baselineScore);
  const primaryWeak = ranked[0]?.skill || skills[0];
  const secondaryHighYield = ranked[1]?.skill || skills[1];

  const primaryDiff = calculateDifficultyDistribution(primaryWeak);
  const secondaryDiff = calculateDifficultyDistribution(secondaryHighYield);

  // Scaled block minutes
  const reviewMin = Math.max(3, Math.round(5 * timeScale));
  const weakMin = Math.max(5, Math.round(15 * timeScale));
  const highYieldMin = Math.max(5, Math.round(15 * timeScale));
  const speedDrillMin = Math.max(2, totalMin - (reviewMin + weakMin + highYieldMin));

  const blocks: ActionPlanBlock[] = [
    {
      type: 'error_review',
      title: 'Error Log Diagnostic Review',
      durationMinutes: reviewMin,
      subtopicName: 'Missed Question Bank',
      questionCount: Math.min(5, Math.max(2, Math.round(3 * timeScale))),
      difficultyDistribution: { easy: 20, medium: 50, hard: 30 },
      advice: 'Review flagged mistake reasons (careless slips, concept gaps) before starting today\'s drills.',
    },
    {
      type: 'targeted_drills',
      title: `Priority Focus: ${primaryWeak.name}`,
      durationMinutes: weakMin,
      subtopicName: primaryWeak.name,
      subtopicId: primaryWeak.id,
      questionCount: Math.round(6 * timeScale),
      difficultyDistribution: primaryDiff,
      advice: `Targeting your #1 weakness in ${primaryWeak.domain}. Focus on algebraic consistency and step-by-step verification.`,
    },
    {
      type: 'concept_deepdive',
      title: `High-Yield Deepdive: ${secondaryHighYield.name}`,
      durationMinutes: highYieldMin,
      subtopicName: secondaryHighYield.name,
      subtopicId: secondaryHighYield.id,
      questionCount: Math.round(5 * timeScale),
      difficultyDistribution: secondaryDiff,
      advice: `High College Board frequency. Apply Desmos shortcuts and isolate coefficients quickly.`,
    },
    {
      type: 'mixed_timed',
      title: 'Timed Mixed Speed Sprint',
      durationMinutes: speedDrillMin,
      subtopicName: 'Mixed Official Domains',
      questionCount: Math.round(4 * timeScale),
      difficultyDistribution: { easy: 25, medium: 50, hard: 25 },
      advice: 'Simulates Module 2 clock pressure: allocate ~60-80s per question and flag tricky problems.',
    },
  ];

  return {
    date: new Date().toISOString().split('T')[0],
    dayNumber: 1,
    totalMinutes: totalMin,
    prioritySubtopic: primaryWeak.name,
    blocks,
  };
}

// ─── 7. Attempt Feedback Loop & Subtopic Mastery Recalculation ────────────
export function recordQuestionAttemptInEngine(
  data: StoredAdaptivePlannerData,
  attempt: QuestionAttempt
): StoredAdaptivePlannerData {
  const updatedAttempts = [attempt, ...data.attempts].slice(0, 200); // retain last 200 attempts

  // Find corresponding skill by subtopicId or domain
  const skillIndex = data.skills.findIndex(
    (s) => s.id === attempt.subtopicId || s.name.toLowerCase() === (attempt.subtopicName || '').toLowerCase()
  );

  let updatedSkills = [...data.skills];

  if (skillIndex !== -1) {
    const currentSkill = updatedSkills[skillIndex];
    const isCorrect = attempt.correct;
    
    // Mastery adjustment calculation
    let delta = 0;
    if (isCorrect) {
      // Reward correct answer based on difficulty and confidence
      const diffMultiplier = attempt.difficulty === 'Hard' ? 4.5 : attempt.difficulty === 'Medium' ? 3.0 : 1.5;
      delta = diffMultiplier;
      // Underconfidence bonus (confidence 1-2 but correct) -> positive reinforcement
      if (attempt.preConfidence <= 2) delta += 1.0;
    } else {
      // Penalty based on mistake reason
      let mistakePenalty = -3.5;
      if (attempt.mistakeReason === 'concept_gap') mistakePenalty = -4.5;
      else if (attempt.mistakeReason === 'calculation_slip') mistakePenalty = -2.0;
      else if (attempt.mistakeReason === 'time_panic') mistakePenalty = -2.5;
      else if (attempt.mistakeReason === 'misread_question') mistakePenalty = -2.0;

      // False confidence penalty (5/5 confidence but wrong) -> high alertness
      if (attempt.preConfidence >= 4) {
        mistakePenalty -= 1.5;
      }
      delta = mistakePenalty;
    }

    const newMastery = Math.min(99, Math.max(15, Math.round(currentSkill.mastery + delta)));

    // Update accuracy metrics
    const diffKey = attempt.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
    const curDiffAcc = currentSkill.accuracy[diffKey];
    const updatedDiffAcc = Math.round(curDiffAcc * 0.85 + (isCorrect ? 100 : 0) * 0.15);

    const updatedSkill: SubtopicSkill = {
      ...currentSkill,
      mastery: newMastery,
      status: getStatusFromMastery(newMastery),
      accuracy: {
        ...currentSkill.accuracy,
        [diffKey]: updatedDiffAcc,
      },
      totalAttempts: (currentSkill.totalAttempts || 0) + 1,
      lastPracticedDate: new Date().toISOString(),
    };

    updatedSkills[skillIndex] = updatedSkill;
  }

  // Regenerate updated daily plan with the new priority queue
  const updatedPlan = generateDailyActionPlan(data.profile, updatedSkills, updatedAttempts.filter((a) => !a.correct).length);

  const nextData: StoredAdaptivePlannerData = {
    ...data,
    skills: updatedSkills,
    attempts: updatedAttempts,
    todayPlan: updatedPlan,
  };

  saveStoredAdaptiveData(nextData);
  return nextData;
}

// ─── 8. LocalStorage Persistence Bridge ───────────────────────────────────
export function getStoredAdaptiveData(): StoredAdaptivePlannerData {
  try {
    const raw = localStorage.getItem(ADAPTIVE_STORAGE_KEY);
    if (raw) {
      const parsed: StoredAdaptivePlannerData = JSON.parse(raw);
      if (parsed.skills && parsed.skills.length > 0 && parsed.profile) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading stored adaptive planner data', e);
  }

  // Fallback initialize
  const defaultProfile: AdaptivePlannerProfile = {
    targetScore: 800,
    targetExamDate: 'October 2026',
    strategyGoal: 'highest_possible',
    baselineScore: 720,
    dailyMinutes: 45,
    daysPerWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    peakTimeWindow: 'afternoon',
    frictionPoints: ['careless_slips', 'running_out_of_time'],
    lastUpdated: new Date().toISOString(),
  };

  const skills = initializeSubtopicSkills(defaultProfile.baselineScore);
  const todayPlan = generateDailyActionPlan(defaultProfile, skills, 2);

  const initialData: StoredAdaptivePlannerData = {
    profile: defaultProfile,
    skills,
    attempts: [],
    todayPlan,
  };

  saveStoredAdaptiveData(initialData);
  return initialData;
}

export function saveStoredAdaptiveData(data: StoredAdaptivePlannerData): void {
  try {
    localStorage.setItem(ADAPTIVE_STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem('scoreup_planner_state', JSON.stringify(data));
    localStorage.setItem('scoreup_user_roadmap', JSON.stringify(data.todayPlan));

    // Also sync exam target date for HeroExamCountdown and top bar
    if (data.profile?.targetExamDate) {
      localStorage.setItem('study_planner_target_date', data.profile.targetExamDate);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('study_planner_updated', { detail: data }));
    }
  } catch (e) {
    console.error('Error saving stored adaptive planner data', e);
  }
}
