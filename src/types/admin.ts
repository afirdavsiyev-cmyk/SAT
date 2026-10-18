import { Question, MathDomain } from './index';

export type DisputeReason =
  | 'incorrect_answer'
  | 'typo_or_formatting'
  | 'ambiguous_prompt'
  | 'explanation_unclear'
  | 'broken_latex'
  | 'other';

export type DisputeStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';

export interface AdminSessionState {
  isAuthenticated: boolean;
  authenticatedAt?: number;
  sessionExpiry?: number;
  role?: 'admin' | 'superadmin';
  lastActive?: number;
}

export interface StudentAdminProfile {
  id: string;
  email: string;
  firstName: string;
  targetScore: string | number;
  baselineScore: number;
  currentEstimatedMath: number;
  streakDays: number;
  totalQuestionsSolved: number;
  totalQuestionsCorrect: number;
  accuracy: number;
  lastActive?: string | number;
  joinedAt?: string | number;
  provider?: string;
  onboardingCompleted?: boolean;
}

export interface DomainMasteryStat {
  domain: MathDomain;
  averageMastery: number;
}

export interface ScoreDistributionBucket {
  range: string;
  count: number;
}

export interface AdminCohortAnalytics {
  totalStudents: number;
  activeToday: number;
  averageScore: number;
  averageStreak: number;
  totalQuestionsAttempted: number;
  averageAccuracy: number;
  domainMasteryAverages: DomainMasteryStat[];
  scoreDistribution: ScoreDistributionBucket[];
  pendingDisputesCount: number;
  totalCustomTests: number;
}

export interface QuestionDisputeReport {
  id: string;
  questionId: string;
  studentEmail?: string;
  studentName?: string;
  reason: DisputeReason;
  description: string;
  suggestedCorrection?: string;
  status: DisputeStatus;
  createdAt: number;
  resolvedAt?: number;
  adminNotes?: string;
  questionSnapshot?: Partial<Question>;
}

export interface GenerateQuestionInput {
  domain: MathDomain;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'multiple_choice' | 'student_produced';
  topic?: string;
  targetPacingSeconds?: number;
  instructions?: string;
  temperature?: number;
  useLiveAI?: boolean;
}

export interface GeneratedQuestionResult {
  question: Question;
  validation: {
    isValid: boolean;
    latexErrors?: string[];
    hasExplanation: boolean;
    hasOptionsIfMultipleChoice: boolean;
    correctAnswerMatchesOptions: boolean;
  };
  rawResponse?: string;
  createdAt: number;
}

export interface CustomPracticeTest {
  id: string;
  title: string;
  description?: string;
  category?: 'official' | 'turbo_mock' | 'prediction' | 'diagnostic' | 'custom';
  badge?: string;
  difficulty: 'Standard' | 'Hard' | '750+' | 'Adaptive' | 'Mixed';
  durationMinutes: number;
  moduleTimeMinutes: number;
  totalQuestions: number;
  module1Questions: Question[];
  module2Questions: Question[];
  createdAt: number;
  updatedAt: number;
  author?: string;
  isPublished?: boolean;
  tags?: string[];
}

export interface SystemDiagnosticDump {
  timestamp: string;
  appVersion: string;
  environment: string;
  storageUsage: {
    localStorageKeyCount: number;
    scoreupKeysCount: number;
    estimatedSizeBytes: number;
  };
  analytics: AdminCohortAnalytics;
  disputesSummary: {
    total: number;
    pending: number;
    inReview: number;
    resolved: number;
    rejected: number;
  };
  customTestsCount: number;
  browser: {
    userAgent: string;
    language: string;
    onLine: boolean;
    hasIndexedDB: boolean;
  };
  disputes: QuestionDisputeReport[];
  customTests: Omit<CustomPracticeTest, 'module1Questions' | 'module2Questions'>[];
}
