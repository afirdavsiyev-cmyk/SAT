import { Question, LeaderboardUser, Achievement, UserProgress } from '../types';

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    number: 1,
    section: 'math',
    module: 1,
    domain: 'Advanced Math',
    difficulty: 'Medium',
    prompt: 'The function $f$ is defined by $f(x) = x^2 - 6x + 13$. What is the minimum value of $f(x)$ for all real numbers $x$?',
    options: [
      { id: 'A', text: '$3$' },
      { id: 'B', text: '$4$' },
      { id: 'C', text: '$6$' },
      { id: 'D', text: '$13$' }
    ],
    correctAnswer: 'B',
    explanation: 'To find the minimum value of the quadratic function $f(x) = x^2 - 6x + 13$, rewrite it by completing the square:\n\n$$f(x) = (x^2 - 6x + 9) + 4 = (x - 3)^2 + 4$$\n\nSince $(x - 3)^2 \\ge 0$ for all real $x$, the minimum value of $f(x)$ occurs when $x = 3$, giving $f(3) = 4$.',
    type: 'multiple_choice',
    hint: 'Rewrite $x^2 - 6x + 13$ in vertex form $(x - h)^2 + k$ or find the vertex $x = -b / (2a)$.',
    desmosEquation: 'y = x^2 - 6x + 13'
  },
  {
    id: 'q2',
    number: 2,
    section: 'math',
    module: 1,
    domain: 'Algebra',
    difficulty: 'Hard',
    prompt: 'A system of linear equations is given below, where $k$ is a constant:\n$$\\begin{cases} 4x - 9y = 12 \\\\ kx - 27y = 36 \\end{cases}$$\nIf the system has infinitely many solutions, what is the value of $k$?',
    options: [
      { id: 'A', text: '$8$' },
      { id: 'B', text: '$12$' },
      { id: 'C', text: '$16$' },
      { id: 'D', text: '$36$' }
    ],
    correctAnswer: 'B',
    explanation: 'For a linear system to have infinitely many solutions, the two equations must represent the exact same line. Multiplying the first equation $4x - 9y = 12$ by $3$ gives:\n$$12x - 27y = 36$$\nComparing this with $kx - 27y = 36$, we find $k = 12$.',
    type: 'multiple_choice',
    hint: 'Infinitely many solutions means the coefficients of $x$, $y$, and the constant terms are proportional.',
    desmosEquation: '4x - 9y = 12'
  },
  {
    id: 'q3',
    number: 3,
    section: 'math',
    module: 1,
    domain: 'Problem-Solving & Data Analysis',
    difficulty: 'Easy',
    prompt: 'A circle in the $xy$-plane has center $(2, -5)$ and radius $r = 7$. Which of the following is the standard equation of the circle?',
    options: [
      { id: 'A', text: '$(x - 2)^2 + (y + 5)^2 = 49$' },
      { id: 'B', text: '$(x + 2)^2 + (y - 5)^2 = 49$' },
      { id: 'C', text: '$(x - 2)^2 + (y + 5)^2 = 7$' },
      { id: 'D', text: '$(x + 2)^2 + (y - 5)^2 = 14$' }
    ],
    correctAnswer: 'A',
    explanation: 'The standard equation of a circle with center $(h, k)$ and radius $r$ is:\n$$(x - h)^2 + (y - k)^2 = r^2$$\nSubstituting $(h, k) = (2, -5)$ and $r = 7$ yields:\n$$(x - 2)^2 + (y - (-5))^2 = 7^2 \\implies (x - 2)^2 + (y + 5)^2 = 49$$',
    type: 'multiple_choice',
    hint: 'Recall the formula $(x - h)^2 + (y - k)^2 = r^2$ and notice that $r^2 = 7^2 = 49$.'
  },
  {
    id: 'q4',
    number: 4,
    section: 'math',
    module: 1,
    domain: 'Geometry & Trigonometry',
    difficulty: 'Medium',
    prompt: 'In a right triangle $ABC$ with right angle at $C$, if $\\sin(A) = \\frac{5}{13}$, what is the value of $\\cos(B)$?',
    type: 'student_produced',
    correctAnswer: '5/13',
    explanation: 'In any right triangle where angle $C = 90^\\circ$, angles $A$ and $B$ are complementary ($A + B = 90^\\circ$). By the cofunction identity:\n$$\\cos(B) = \\cos(90^\\circ - A) = \\sin(A)$$\nSince $\\sin(A) = \\frac{5}{13}$, it follows immediately that $\\cos(B) = \\frac{5}{13}$.',
    hint: 'Remember the cofunction identity: $\\sin(A) = \\cos(90^\\circ - A) = \\cos(B)$.'
  },
  {
    id: 'q5',
    number: 5,
    section: 'math',
    module: 1,
    domain: 'Advanced Math',
    difficulty: 'Hard',
    prompt: 'If $3^{x+1} - 3^x = 162$, what is the value of $x$?',
    options: [
      { id: 'A', text: '$3$' },
      { id: 'B', text: '$4$' },
      { id: 'C', text: '$5$' },
      { id: 'D', text: '$6$' }
    ],
    correctAnswer: 'B',
    explanation: 'Factor out $3^x$ from the left side of the equation:\n$$3^{x+1} - 3^x = 3^x(3^1 - 1) = 2 \\cdot 3^x$$\nSet this equal to $162$:\n$$2 \\cdot 3^x = 162 \\implies 3^x = 81$$\nSince $81 = 3^4$, we obtain $x = 4$. Verifying: $3^{4+1} - 3^4 = 243 - 81 = 162$. Thus, the correct value of $x$ is $4$ (Choice B).',
    type: 'multiple_choice',
    hint: 'Factor out $3^x$ to get $3^x(3 - 1) = 2 \\cdot 3^x = 162$.'
  }
];

export const mockLeaderboardUsers: LeaderboardUser[] = [
  { id: 'u1', rank: 1, name: 'Alex Chen', avatar: '⚡', score: 800, xp: 14850, streak: 34, badge: 'Desmos Master' },
  { id: 'u2', rank: 2, name: 'Sarah Jenkins', avatar: '🌟', score: 790, xp: 13200, streak: 28, badge: 'Algebra Wizard' },
  { id: 'u3', rank: 3, name: 'Marcus Vance', avatar: '🔥', score: 780, xp: 12450, streak: 21, badge: 'Geometry Titan' },
  { id: 'u4', rank: 4, name: 'You (Student)', avatar: '🚀', score: 750, xp: 9850, streak: 12, badge: '750+ Scholar', isCurrentUser: true },
  { id: 'u5', rank: 5, name: 'Maya Patel', avatar: '🎯', score: 740, xp: 9400, streak: 15, badge: 'Perfect Attendance' },
  { id: 'u6', rank: 6, name: 'Liam O\'Connor', avatar: '💡', score: 730, xp: 8900, streak: 9, badge: 'Streak Demon' },
  { id: 'u7', rank: 7, name: 'Sophia Rodriguez', avatar: '✨', score: 710, xp: 8250, streak: 7, badge: 'Math Prodigy' }
];

export const initialUserProgress: UserProgress = {
  estimatedScore: 750,
  mathScore: 750,
  streakDays: 12,
  xp: 9850,
  totalQuestionsSolved: 485,
  accuracyRate: 91.4,
  completedTests: 6,
  skillBreakdown: [
    { domain: 'Algebra', mastery: 94 },
    { domain: 'Advanced Math', mastery: 86 },
    { domain: 'Problem-Solving & Data Analysis', mastery: 90 },
    { domain: 'Geometry & Trigonometry', mastery: 82 }
  ]
};

export const mockAchievements: Achievement[] = [
  { id: 'a1', title: 'Desmos Master', description: 'Solved 50 Math questions using graphing calculator shortcuts.', icon: '📈', unlocked: true, progress: 100 },
  { id: 'a2', title: '7-Day Blaze', description: 'Maintained a daily study streak for 7 consecutive days.', icon: '🔥', unlocked: true, progress: 100 },
  { id: 'a3', title: '750+ Math Club', description: 'Achieved an estimated math score above 750 in practice exams.', icon: '🏆', unlocked: true, progress: 100 },
  { id: 'a4', title: 'Algebra Titan', description: 'Mastered 90%+ of all SAT Algebra questions.', icon: '⚡', unlocked: true, progress: 100 },
  { id: 'a5', title: 'Night Owl Scholar', description: 'Completed a practice module after 10 PM.', icon: '🦉', unlocked: false, progress: 50 }
];
