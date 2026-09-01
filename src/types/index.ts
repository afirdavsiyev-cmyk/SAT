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

export interface StudyPlan {
  targetDate: string;
  targetScore: number;
  currentScore: number;
  weakAreas: string[];
  dailyTimeMinutes: number;
  weeklyRoadmap: {
    week: number;
    title: string;
    focus: string;
    estimatedHrs: number;
    completed: boolean;
  }[];
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
