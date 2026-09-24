import { QuestionItem, QuestionDomain, DomainDirectoryCategory } from '../../types/questionBank';
import { SATQuestion } from '../../types/question';
import { getStepByStepExplanation } from '../../utils/stepByStepExplanationEngine';
import algebraQuestionsRaw from './algebra.json';
import advancedMathQuestionsRaw from './advanced-math.json';
import problemSolvingQuestionsRaw from './problem-solving.json';
import geometryTrigQuestionsRaw from './geometry-trig.json';

export const SAT_ALGEBRA_QUESTIONS = algebraQuestionsRaw as unknown as SATQuestion[];
export const SAT_ADVANCED_MATH_QUESTIONS = advancedMathQuestionsRaw as unknown as SATQuestion[];
export const SAT_PROBLEM_SOLVING_QUESTIONS = problemSolvingQuestionsRaw as unknown as SATQuestion[];
export const SAT_GEOMETRY_TRIG_QUESTIONS = geometryTrigQuestionsRaw as unknown as SATQuestion[];

export const ALGEBRA_QUESTIONS: QuestionItem[] = (algebraQuestionsRaw as unknown as SATQuestion[]).map((q) => ({
  id: q.id,
  source: q.source,
  domain: 'Algebra' as QuestionDomain,
  topic: q.topic,
  difficulty: (q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)) as 'Easy' | 'Medium' | 'Hard',
  question: q.questionText,
  questionText: q.questionText,
  type: q.type === 'free_response' ? 'student_produced' : 'multiple_choice',
  options: q.options,
  correctAnswer: q.correctAnswer,
  explanation: getStepByStepExplanation(q, 'Algebra'),
}));

export const ADVANCED_MATH_QUESTIONS: QuestionItem[] = (advancedMathQuestionsRaw as unknown as SATQuestion[]).map((q) => ({
  id: q.id,
  source: q.source,
  domain: 'Advanced Math' as QuestionDomain,
  topic: q.topic,
  difficulty: (q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)) as 'Easy' | 'Medium' | 'Hard',
  question: q.questionText,
  questionText: q.questionText,
  type: q.type === 'free_response' ? 'student_produced' : 'multiple_choice',
  options: q.options,
  correctAnswer: q.correctAnswer,
  explanation: getStepByStepExplanation(q, 'Advanced Math'),
}));

export const PROBLEM_SOLVING_QUESTIONS: QuestionItem[] = (problemSolvingQuestionsRaw as unknown as SATQuestion[]).map((q) => ({
  id: q.id,
  source: q.source,
  domain: 'Problem-Solving & Data Analysis' as QuestionDomain,
  topic: q.topic,
  difficulty: (q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)) as 'Easy' | 'Medium' | 'Hard',
  question: q.questionText,
  questionText: q.questionText,
  type: q.type === 'free_response' ? 'student_produced' : 'multiple_choice',
  options: q.options,
  correctAnswer: q.correctAnswer,
  explanation: getStepByStepExplanation(q, 'Problem-Solving & Data Analysis'),
}));

export const GEOMETRY_TRIG_QUESTIONS: QuestionItem[] = (geometryTrigQuestionsRaw as unknown as SATQuestion[]).map((q) => ({
  id: q.id,
  source: q.source,
  domain: 'Geometry & Trigonometry' as QuestionDomain,
  topic: q.topic,
  difficulty: (q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)) as 'Easy' | 'Medium' | 'Hard',
  question: q.questionText,
  questionText: q.questionText,
  type: q.type === 'free_response' ? 'student_produced' : 'multiple_choice',
  options: q.options,
  correctAnswer: q.correctAnswer,
  explanation: getStepByStepExplanation(q, 'Geometry & Trigonometry'),
}));

export const ALL_QUESTIONS: QuestionItem[] = [
  ...ALGEBRA_QUESTIONS,
  ...ADVANCED_MATH_QUESTIONS,
  ...PROBLEM_SOLVING_QUESTIONS,
  ...GEOMETRY_TRIG_QUESTIONS,
];

export const DOMAIN_OPTIONS: { id: QuestionDomain | 'all'; label: string; count?: number }[] = [
  { id: 'all', label: 'All Domains' },
  { id: 'Algebra', label: 'Algebra' },
  { id: 'Advanced Math', label: 'Advanced Math' },
  { id: 'Problem-Solving & Data Analysis', label: 'Problem-Solving' },
  { id: 'Geometry & Trigonometry', label: 'Geometry & Trig' },
];

/**
 * Official College Board Digital SAT Math Taxonomy Tree
 */
export const OFFICIAL_DOMAIN_TAXONOMY: DomainDirectoryCategory[] = [
  {
    domain: 'Algebra',
    title: 'Algebra',
    subtitle: 'Expressions, linear equations, systems, functions, and inequalities',
    iconName: 'Calculator',
    skills: [
      {
        id: 'alg-expressions',
        name: 'Expressions',
        domain: 'Algebra',
        description: 'Algebraic terms, substitution, simplifying expressions, and word modeling.',
        totalOfficialCount: 94,
      },
      {
        id: 'alg-linear-eqs',
        name: 'Linear Equations',
        domain: 'Algebra',
        description: 'One-variable linear equations, absolute values, and single-solution criteria.',
        totalOfficialCount: 118,
      },
      {
        id: 'alg-systems',
        name: 'Linear System of Equations',
        domain: 'Algebra',
        description: 'Simultaneous linear equations, substitution, elimination, and solution types.',
        totalOfficialCount: 65,
      },
      {
        id: 'alg-functions',
        name: 'Linear Functions',
        domain: 'Algebra',
        description: 'Slope, rate of change, intercepts, function notation, and linear graphs.',
        totalOfficialCount: 72,
      },
      {
        id: 'alg-inequalities',
        name: 'Linear Inequalities',
        domain: 'Algebra',
        description: 'Single and two-variable linear inequalities, number line, and coordinate planes.',
        totalOfficialCount: 45,
      },
    ],
  },
  {
    domain: 'Advanced Math',
    title: 'Advanced math',
    subtitle: 'Polynomials, radicals, functions, exponentials, and quadratics',
    iconName: 'Sparkles',
    skills: [
      {
        id: 'adv-polynomials',
        name: 'Polynomials',
        domain: 'Advanced Math',
        description: 'Operations, factoring, roots, zeros, and polynomial remainder theorem.',
        totalOfficialCount: 88,
      },
      {
        id: 'adv-exponents-radicals',
        name: 'Exponents&Radicals',
        domain: 'Advanced Math',
        description: 'Exponent rules, rational exponents, radical equations, and fractional powers.',
        totalOfficialCount: 75,
      },
      {
        id: 'adv-functions-notation',
        name: 'Functions&Function Notation',
        domain: 'Advanced Math',
        description: 'Composite functions, transformations, evaluation, and domain/range.',
        totalOfficialCount: 60,
      },
      {
        id: 'adv-exponential-funcs',
        name: 'Exponential Functions',
        domain: 'Advanced Math',
        description: 'Exponential growth, decay, percentage rates, and asymptote behavior.',
        totalOfficialCount: 82,
      },
      {
        id: 'adv-quadratics',
        name: 'Quadratics',
        domain: 'Advanced Math',
        description: 'Factoring, quadratic formula, vertex form, discriminant, and parabolas.',
        totalOfficialCount: 110,
      },
    ],
  },
  {
    domain: 'Problem-Solving & Data Analysis',
    title: 'Problem solving',
    subtitle: 'Percentages, units, probability, statistics, and scatterplots',
    iconName: 'BarChart3',
    skills: [
      {
        id: 'ps-percent-ratio',
        name: 'Percent; Ratio&Proportion',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Ratios, proportions, percent increase/decrease, and mixture problems.',
        totalOfficialCount: 95,
      },
      {
        id: 'ps-unit-conversion',
        name: 'Unit Conversion',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Dimensional analysis, rates of change, multi-step metric and US conversions.',
        totalOfficialCount: 48,
      },
      {
        id: 'ps-probability',
        name: 'Probability',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Simple probability, conditional probability, and two-way tables.',
        totalOfficialCount: 52,
      },
      {
        id: 'ps-stats',
        name: 'Mean, Median, Mode, Range',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Central tendency, spread, standard deviation, and data set distributions.',
        totalOfficialCount: 70,
      },
      {
        id: 'ps-scatterplots',
        name: 'Scatterplots',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Line of best fit, correlation, trend lines, and regression modeling.',
        totalOfficialCount: 64,
      },
      {
        id: 'ps-research',
        name: 'Research organizing(Margin of Error; Outliers)',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Margin of error, sample size, population inferences, and outlier effects.',
        totalOfficialCount: 40,
      },
    ],
  },
  {
    domain: 'Geometry & Trigonometry',
    title: 'Geometry and Trigonometry',
    subtitle: 'Lines, angles, triangles, trigonometry, circles, area, and volume',
    iconName: 'Compass',
    skills: [
      {
        id: 'geo-lines-angles',
        name: 'Lines&Angles',
        domain: 'Geometry & Trigonometry',
        description: 'Parallel lines, transversals, vertical angles, and angle sum rules.',
        totalOfficialCount: 54,
      },
      {
        id: 'geo-triangles',
        name: 'Triangles',
        domain: 'Geometry & Trigonometry',
        description: 'Similar triangles, congruence, isosceles, and Pythagorean theorem.',
        totalOfficialCount: 68,
      },
      {
        id: 'geo-trigonometry',
        name: 'Trigonometry',
        domain: 'Geometry & Trigonometry',
        description: 'SOH CAH TOA, sine-cosine cofunction relationship, and unit circle radians.',
        totalOfficialCount: 72,
      },
      {
        id: 'geo-circles',
        name: 'Circles',
        domain: 'Geometry & Trigonometry',
        description: 'Circle equations, arc length, sector area, and inscribed angle theorems.',
        totalOfficialCount: 58,
      },
      {
        id: 'geo-areas-volumes',
        name: 'Areas&Volumes',
        domain: 'Geometry & Trigonometry',
        description: '2D plane figures, 3D solids, cylinder, sphere, and cone formulas.',
        totalOfficialCount: 66,
      },
    ],
  },
];

/**
 * Returns all unique topics available for a specific domain or across all questions.
 */
export function getAvailableTopics(domain: QuestionDomain | 'all' = 'all'): string[] {
  const dataset = domain === 'all' 
    ? ALL_QUESTIONS 
    : ALL_QUESTIONS.filter((q) => q.domain === domain);
  
  const topics = new Set<string>();
  dataset.forEach((q) => {
    if (q.topic) {
      topics.add(q.topic);
    }
  });

  return Array.from(topics).sort();
}

/**
 * Retrieve a question item by unique ID.
 */
export function getQuestionById(id: string): QuestionItem | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

/**
 * Returns questions for one or more topic names.
 */
export function getQuestionsByTopics(topics: string[]): QuestionItem[] {
  if (!topics.length) return ALL_QUESTIONS;
  const topicSet = new Set(topics);
  return ALL_QUESTIONS.filter((q) => topicSet.has(q.topic));
}

/**
 * Returns question counts per domain.
 */
export function getDomainCounts(): Record<string, number> {
  const counts: Record<string, number> = {
    all: ALL_QUESTIONS.length,
    'Algebra': ALGEBRA_QUESTIONS.length,
    'Advanced Math': ADVANCED_MATH_QUESTIONS.length,
    'Problem-Solving & Data Analysis': PROBLEM_SOLVING_QUESTIONS.length,
    'Geometry & Trigonometry': GEOMETRY_TRIG_QUESTIONS.length,
  };
  return counts;
}
