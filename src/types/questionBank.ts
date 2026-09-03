export type QuestionDomain =
  | 'Algebra'
  | 'Advanced Math'
  | 'Problem-Solving & Data Analysis'
  | 'Geometry & Trigonometry';

export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export type QuestionType = 'multiple_choice' | 'student_produced';

export interface QuestionOptionItem {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface QuestionItem {
  id: string;
  source: string;
  domain: QuestionDomain;
  topic: string;
  difficulty: QuestionDifficulty;
  question: string; // LaTeX KaTeX formatted prompt
  questionText?: string;
  type: QuestionType;
  options?: QuestionOptionItem[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  desmosTip?: string;
  module?: 1 | 2;
}

export interface QuestionBankFilters {
  domain: QuestionDomain | 'all';
  topic: string | 'all';
  difficulty: QuestionDifficulty | 'all';
  searchQuery: string;
  type: QuestionType | 'all';
}

export interface SkillDirectoryItem {
  id: string;
  name: string;
  domain: QuestionDomain;
  description: string;
  totalOfficialCount: number; // Official pool count in College Board question bank
}

export interface DomainDirectoryCategory {
  domain: QuestionDomain;
  title: string;
  subtitle: string;
  iconName: string;
  skills: SkillDirectoryItem[];
}
