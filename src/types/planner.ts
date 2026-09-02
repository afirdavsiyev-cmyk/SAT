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
