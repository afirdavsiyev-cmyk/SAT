import { VocabTerm, VocabCategory } from './vocab/types';
import { ALGEBRA_VOCAB } from './vocab/algebra';
import { ADVANCED_MATH_VOCAB } from './vocab/advancedMath';
import { PROBLEM_SOLVING_VOCAB } from './vocab/problemSolving';
import { GEOMETRY_TRIG_VOCAB } from './vocab/geometryTrig';
import { GENERAL_MATH_LOGIC_VOCAB } from './vocab/generalMathLogic';

export * from './vocab/types';

export const VOCAB_CATEGORIES: VocabCategory[] = [
  'Algebra',
  'Advanced Math',
  'Problem-Solving and Data Analysis',
  'Geometry and Trigonometry',
  'General Math & Logic'
];

export const ALL_VOCAB_TERMS: VocabTerm[] = [
  ...ALGEBRA_VOCAB,
  ...ADVANCED_MATH_VOCAB,
  ...PROBLEM_SOLVING_VOCAB,
  ...GEOMETRY_TRIG_VOCAB,
  ...GENERAL_MATH_LOGIC_VOCAB
];

export const getVocabTermById = (id: string): VocabTerm | undefined => {
  return ALL_VOCAB_TERMS.find((term) => term.id === id);
};

export const getVocabByCategory = (category: VocabCategory): VocabTerm[] => {
  return ALL_VOCAB_TERMS.filter((term) => term.category === category);
};
