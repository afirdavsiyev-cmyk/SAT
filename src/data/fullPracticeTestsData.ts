// Auto-generated Full Practice Tests Registry
export interface FullPracticeTestItem {
  id: string;
  title: string;
  filename: string;
  fileUrl: string;
  category: 'official' | 'turbo_mock' | 'prediction' | 'diagnostic';
  badge: string;
  difficulty: 'Standard' | 'Hard' | '750+';
  durationMinutes: number;
  moduleTimeMinutes: number;
  totalQuestions: number;
  sizeMB: number;
  description: string;
}

export const FULL_PRACTICE_TESTS: FullPracticeTestItem[] = [];
