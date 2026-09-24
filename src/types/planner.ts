export type SATDomain = 'Algebra' | 'Advanced Math' | 'Problem Solving' | 'Geometry & Trig';

export type MistakeReason = 
  | 'concept_gap' 
  | 'execution_block' 
  | 'wrong_formula' 
  | 'calculation_slip' 
  | 'misread_question' 
  | 'time_panic' 
  | 'blind_guess';

export type SkillStatus = 'Critical' | 'Weak' | 'Developing' | 'Strong' | 'Mastered';

export interface SubtopicSkill {
  id: string;
  name: string;
  domain: SATDomain;
  mastery: number; // 0 - 100
  accuracy: {
    easy: number;
    medium: number;
    hard: number;
  };
  avgSecondsPerQuestion: number;
  status: SkillStatus;
  totalAttempts?: number;
  lastPracticedDate?: string;
}

export interface QuestionAttempt {
  id?: string;
  questionId: string;
  domain: SATDomain;
  subtopicId: string;
  subtopicName?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  correct: boolean;
  timeSpentSeconds: number;
  usedHint: boolean;
  usedDesmos: boolean;
  preConfidence: 1 | 2 | 3 | 4 | 5;
  mistakeReason?: MistakeReason;
  timestamp: string;
}

export type ActionBlockType = 
  | 'error_review' 
  | 'concept_deepdive' 
  | 'targeted_drills' 
  | 'mixed_timed' 
  | 'simulation';

export interface ActionPlanBlock {
  type: ActionBlockType;
  title: string;
  durationMinutes: number;
  subtopicName: string;
  subtopicId?: string;
  questionCount: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  advice: string;
  completed?: boolean;
}

export interface DailyActionPlan {
  date: string;
  dayNumber: number;
  totalMinutes: number;
  prioritySubtopic: string;
  blocks: ActionPlanBlock[];
}

export type StrategyGoal = 'highest_possible' | 'efficient_target' | 'fast_bump';
export type PeakStudyTime = 'morning' | 'afternoon' | 'evening';
export type FrictionPoint = 
  | 'careless_slips' 
  | 'running_out_of_time' 
  | 'forgetting_formulas' 
  | 'hard_freeze' 
  | 'concept_gaps';

export interface AdaptivePlannerProfile {
  targetScore: number;
  targetExamDate: string;
  strategyGoal: StrategyGoal;
  baselineScore: number;
  dailyMinutes: number;
  daysPerWeek: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  peakTimeWindow: PeakStudyTime;
  frictionPoints: FrictionPoint[];
  lastUpdated: string;
}

export interface StoredAdaptivePlannerData {
  profile: AdaptivePlannerProfile;
  skills: SubtopicSkill[];
  attempts: QuestionAttempt[];
  todayPlan: DailyActionPlan;
  historyPlans?: DailyActionPlan[];
}

// ─── Dynamic Goal Pacing & Rest/Burnout Guard ─────────────────────────
export interface DynamicPacingMetrics {
  targetScore: number;
  baselineScore: number;
  scoreGap: number;
  daysUntilExam: number;
  effectiveStudyDays: number;
  dailyQuestionsRequired: number;
  dailyHoursRequired: number;
  weeklyStudyDaysCount: number;
  activeDaysOfWeek: string[];
  isRestDayToday: boolean;
  missedSessionsCount: number;
  rebalancedDeltaPerDay: number;
  recommendedDailyMinutes: number;
}

// ─── Automated Spaced Repetition ─────────────────────────────────────
export type SpacedRepetitionStage = 1 | 2 | 3 | 'graduated';

export interface SpacedRepetitionRecord {
  questionId: string;
  domain: SATDomain;
  subtopicName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  mistakeReason?: MistakeReason;
  addedDate: string; // ISO date 'YYYY-MM-DD'
  dueDate: string; // ISO date 'YYYY-MM-DD'
  stage: SpacedRepetitionStage; // 1 = +3d, 2 = +7d, 3 = +14d, 'graduated'
  consecutiveCorrect: number; // Graduated when consecutiveCorrect >= 2
  lastAttemptDate?: string;
  lastAttemptCorrect?: boolean;
  totalAttempts: number;
}

// ─── Auto-Generated 3-Block Daily Sprint Queue ────────────────────────
export type SprintBlockType = 'warmup' | 'core_focus' | 'speed_run';

export interface SprintBlockItem {
  type: SprintBlockType;
  title: string;
  badgeLabel: string;
  subtopicName: string;
  questionCount: number;
  estimatedMinutes: number;
  timeLimitSecondsPerQuestion?: number; // e.g. 75s for Speed Run
  advice: string;
  completed: boolean;
  questions: any[]; // QuestionItem[]
}

export interface DailySprintQueue {
  date: string;
  totalQuestions: number;
  totalEstimatedMinutes: number;
  targetScore: number;
  warmup: SprintBlockItem;
  coreFocus: SprintBlockItem;
  speedRun: SprintBlockItem;
}

// ─── Milestone & Full-Length Test Scheduling ──────────────────────────
export interface MilestoneExamSchedule {
  id: string;
  date: string; // 'YYYY-MM-DD'
  title: string;
  type: 'full_mock' | 'review_day';
  description: string;
  completed: boolean;
  score?: number;
  isUpcoming: boolean;
  isToday: boolean;
}

