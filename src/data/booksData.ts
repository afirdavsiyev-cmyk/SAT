export interface BookItem {
  id: string;
  title: string;
  author: string;
  description: string;
  category: 'Practice' | 'Strategy' | 'Reference';
  fileUrl: string;
  coverGradient: string;
  tag: string;
}

export const BOOKS_LIBRARY: BookItem[] = [
  {
    id: 'math-book-1',
    title: 'SAT Math Guide 1.0',
    author: 'ScoreUP Academy',
    description: 'Core algebraic concepts, linear systems, and foundational problem-solving strategies for the Digital SAT.',
    category: 'Practice',
    fileUrl: '/books/Math Book 1.0.pdf',
    coverGradient: 'from-emerald-500/20 to-teal-500/20',
    tag: 'Foundation'
  },
  {
    id: 'math-book-2',
    title: 'SAT Math Advanced 2.0',
    author: 'ScoreUP Academy',
    description: 'Advanced quadratics, polynomial functions, circle theorems, and high-difficulty questions.',
    category: 'Practice',
    fileUrl: '/books/MathBook 2.0.pdf',
    coverGradient: 'from-cyan-500/20 to-blue-500/20',
    tag: 'Advanced'
  },
  {
    id: 'atlas-words',
    title: 'Atlas - Getting the Words Right',
    author: 'Reference Standard',
    description: 'Essential analytical terminology, precision problem wording, and test terminology handbook.',
    category: 'Strategy',
    fileUrl: '/books/Atlas-Getting the Words Right.pdf',
    coverGradient: 'from-amber-500/20 to-orange-500/20',
    tag: 'Resource'
  }
];
