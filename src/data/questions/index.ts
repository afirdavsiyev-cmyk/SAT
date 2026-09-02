import { QuestionItem, QuestionDomain, DomainDirectoryCategory } from '../../types/questionBank';
import algebraQuestions from './algebra.json';
import advancedMathQuestions from './advanced-math.json';
import problemSolvingQuestions from './problem-solving.json';
import geometryTrigQuestions from './geometry-trig.json';

export const ALGEBRA_QUESTIONS = algebraQuestions as QuestionItem[];
export const ADVANCED_MATH_QUESTIONS = advancedMathQuestions as QuestionItem[];
export const PROBLEM_SOLVING_QUESTIONS = problemSolvingQuestions as QuestionItem[];
export const GEOMETRY_TRIG_QUESTIONS = geometryTrigQuestions as QuestionItem[];

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
    subtitle: 'Linear equations, systems, inequalities, and functions',
    iconName: 'Calculator',
    skills: [
      {
        id: 'alg-linear-one',
        name: 'Linear equations in one variable',
        domain: 'Algebra',
        description: 'Single-variable linear equations, algebraic manipulation, and word problems.',
        totalOfficialCount: 159,
      },
      {
        id: 'alg-linear-two',
        name: 'Linear equations in two variables',
        domain: 'Algebra',
        description: 'Slope-intercept, standard form, perpendicular/parallel lines, and graphs.',
        totalOfficialCount: 124,
      },
      {
        id: 'alg-linear-funcs',
        name: 'Linear functions',
        domain: 'Algebra',
        description: 'Function notation, rate of change, intercepts, and linear models.',
        totalOfficialCount: 118,
      },
      {
        id: 'alg-systems',
        name: 'Systems of two linear equations in two variables',
        domain: 'Algebra',
        description: 'Simultaneous equations, infinite/no solution criteria, and intersections.',
        totalOfficialCount: 96,
      },
      {
        id: 'alg-inequalities',
        name: 'Linear inequalities in one or two variables',
        domain: 'Algebra',
        description: 'Inequality systems, half-planes, bounds, and feasible regions.',
        totalOfficialCount: 68,
      },
    ],
  },
  {
    domain: 'Advanced Math',
    title: 'Advanced Math',
    subtitle: 'Quadratics, polynomials, exponents, and nonlinear systems',
    iconName: 'Sparkles',
    skills: [
      {
        id: 'adv-equivalent',
        name: 'Equivalent expressions',
        domain: 'Advanced Math',
        description: 'Polynomial expansion, factoring, difference of squares, and rational forms.',
        totalOfficialCount: 142,
      },
      {
        id: 'adv-nonlinear-eqs',
        name: 'Nonlinear equations in one variable and systems of equations in two variables',
        domain: 'Advanced Math',
        description: 'Quadratic formula, extraneous solutions, and curve intersections.',
        totalOfficialCount: 135,
      },
      {
        id: 'adv-quadratics-exp',
        name: 'Quadratic and exponential functions',
        domain: 'Advanced Math',
        description: 'Vertex form, growth models, decay constants, and parabolas.',
        totalOfficialCount: 168,
      },
      {
        id: 'adv-polynomials',
        name: 'Polynomial factors & remainders',
        domain: 'Advanced Math',
        description: 'Factor theorem, roots, zeros, multiplicity, and polynomial division.',
        totalOfficialCount: 88,
      },
      {
        id: 'adv-exponents-radicals',
        name: 'Exponents & radicals',
        domain: 'Advanced Math',
        description: 'Rational exponents, radical operations, and exponential power laws.',
        totalOfficialCount: 112,
      },
    ],
  },
  {
    domain: 'Problem-Solving & Data Analysis',
    title: 'Problem-Solving and Data Analysis',
    subtitle: 'Ratios, percentages, statistics, probability, and models',
    iconName: 'BarChart3',
    skills: [
      {
        id: 'ps-ratios',
        name: 'Ratios, rates, proportional relationships, and units',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Unit conversion, speed/density rates, dimensional analysis, and proportions.',
        totalOfficialCount: 176,
      },
      {
        id: 'ps-percentages',
        name: 'Percentages',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Percent increase/decrease, compound growth, and base value calculation.',
        totalOfficialCount: 140,
      },
      {
        id: 'ps-one-var-data',
        name: 'One-variable data: distributions and measures of center and spread',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Mean, median, mode, range, standard deviation, and box plots.',
        totalOfficialCount: 104,
      },
      {
        id: 'ps-two-var-data',
        name: 'Two-variable data: models and scatterplots',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Scatter plots, best-fit regression lines, residuals, and correlation.',
        totalOfficialCount: 92,
      },
      {
        id: 'ps-probability',
        name: 'Probability and conditional probability',
        domain: 'Problem-Solving & Data Analysis',
        description: 'Two-way frequency tables, conditional probabilities, and mutually exclusive events.',
        totalOfficialCount: 84,
      },
    ],
  },
  {
    domain: 'Geometry & Trigonometry',
    title: 'Geometry and Trigonometry',
    subtitle: 'Triangles, circles, area/volume, and trigonometry',
    iconName: 'Compass',
    skills: [
      {
        id: 'geo-area-volume',
        name: 'Area and volume',
        domain: 'Geometry & Trigonometry',
        description: '2D composite polygons, 3D solids, cylinder/cone/sphere volume and surface area.',
        totalOfficialCount: 98,
      },
      {
        id: 'geo-lines-triangles',
        name: 'Lines, angles, and triangles',
        domain: 'Geometry & Trigonometry',
        description: 'Parallel lines, transversal angles, similarity, and congruence theorems.',
        totalOfficialCount: 110,
      },
      {
        id: 'geo-right-trig',
        name: 'Right triangles and trigonometry',
        domain: 'Geometry & Trigonometry',
        description: 'SOH-CAH-TOA, cofunction identities, radians, and unit circle basics.',
        totalOfficialCount: 128,
      },
      {
        id: 'geo-circles',
        name: 'Circles',
        domain: 'Geometry & Trigonometry',
        description: 'Standard circle equation, completing square for center/radius, arcs & sectors.',
        totalOfficialCount: 85,
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
