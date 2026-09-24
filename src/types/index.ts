export type AppView = 'landing' | 'onboarding' | 'dashboard' | 'exam' | 'review' | 'leaderboard';

export type MathDomain = 
  | 'Algebra'
  | 'Advanced Math'
  | 'Problem-Solving & Data Analysis'
  | 'Geometry & Trigonometry';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  number: number;
  section: 'math';
  module: 1 | 2;
  domain: MathDomain;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prompt: string; // supports LaTeX formatted with $...$ or $$...$$
  options?: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  type: 'multiple_choice' | 'student_produced';
  hint?: string;
  desmosEquation?: string;
  image?: string;
}

export interface UserAnswers {
  [questionId: string]: string;
}

export interface UserProgress {
  estimatedScore: number; // SAT Math Score out of 800 (or Total 1600 equivalent)
  mathScore: number;
  streakDays: number;
  xp: number;
  totalQuestionsSolved: number;
  accuracyRate: number;
  completedTests: number;
  skillBreakdown: {
    domain: MathDomain;
    mastery: number; // 0-100
  }[];
}

export interface ExamHistoryEntry {
  date: string;
  score: number;
  module1Correct: number;
  module2Correct: number;
  module2Type: 'easy' | 'hard';
}

export interface MockExamResult {
  mode: 'full' | 'module1' | 'module2';
  testId?: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  module1Correct: number;
  module1Total: number;
  module2Correct: number;
  module2Total: number;
  answers: Record<string, string>;
  markedForReview: string[];
}

export interface UserProgressState {
  planner: {
    targetExamDate: string; // e.g. "October 2026"
    targetScore: number;    // e.g. 800
    baselineScore: number;  // e.g. 720
    dailyGoalMinutes: number; // e.g. 45
    weakDomains: string[];  // e.g. ["Advanced Math", "Geometry & Trigonometry"]
    currentDay: number;     // e.g. 1
  };
  stats: {
    streakDays: number;
    totalQuestionsSolved: number;
    totalQuestionsCorrect: number;
    globalXP: number;
    completedExamsCount: number;
    domainMastery: {
      algebra: number;             // percentage (0 - 100)
      advancedMath: number;        // percentage
      problemSolving: number;     // percentage
      geometryTrig: number;        // percentage
    };
    examHistory: ExamHistoryEntry[];
  };
}

export interface StudyPlanDay {
  dayNumber: number; // 1 - 7
  dayLabel: string; // e.g. "Day 1", "Day 2", etc.
  title: string;
  domain: string;
  skillFocus: string;
  questionCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  targetMinutes: number;
  advice: string;
  type: 'drill' | 'review' | 'mock';
  completed?: boolean;
}

export interface StudyPlanWeek {
  week: number;
  title: string;
  focus: string;
  estimatedHrs: number;
  completed: boolean;
  days: StudyPlanDay[];
}

export interface StudyPlan {
  targetDate: string;
  targetScore: number;
  currentScore: number;
  baselineBand?: string;
  weakAreas: string[];
  dailyTimeMinutes: number;
  pacePreference?: string;
  weeklyRoadmap: StudyPlanWeek[];
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  score: number;
  xp: number;
  streak: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0 - 100
}

export * from './question';

