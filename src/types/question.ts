import {
  SAT_DOMAINS,
  SATDomainId,
  SATTopic,
  SAT_DOMAIN_TITLES
} from '../data/questionTaxonomy';

export { SAT_DOMAINS, SAT_DOMAIN_TITLES };
export type { SATDomainId, SATTopic };

/**
 * Core SAT Domain identifier type (matches SATDomainId)
 */
export type SATDomain = SATDomainId;

export interface SATQuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface SATQuestion {
  id: string;
  source: string;              // e.g. "March US 2024", "June 2025"
  domain: SATDomainId;
  topic: SATTopic;
  questionText: string;        // Text with KaTeX ($...$ or $$...$$)
  type: 'multiple_choice' | 'free_response';
  options?: SATQuestionOption[];
  correctAnswer: string;       // "A", "B", "C", "D" or numeric string "15"
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Display label metadata for SAT Domains (aligned with canonical taxonomy)
 */
export const SAT_DOMAIN_LABELS: Record<SATDomainId, string> = {
  algebra: 'Algebra',
  advanced_math: 'Advanced math',
  problem_solving: 'Problem solving',
  geometry_trig: 'Geometry and Trigonometry',
};

/**
 * Display label metadata for difficulty ratings
 */
export const SAT_DIFFICULTY_LABELS: Record<SATQuestion['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};
