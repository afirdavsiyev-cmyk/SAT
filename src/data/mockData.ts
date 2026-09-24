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
    explanation: `**Step 1: Rewrite the quadratic by completing the square**\nTo find the minimum value of $f(x) = x^2 - 6x + 13$, write it in vertex form:\n$$f(x) = (x^2 - 6x + 9) + 4 = (x - 3)^2 + 4$$\n\n**Step 2: Determine the minimum value**\nSince $(x - 3)^2 \\ge 0$ for all real numbers $x$, the squared term reaches its minimum of $0$ when $x = 3$.\n\n**Step 3: Evaluate at the vertex**\nSubstituting $x = 3$ gives $f(3) = (0)^2 + 4 = 4$.\n\n**Conclusion:**\nThe minimum value of $f(x)$ is $4$, which corresponds to Choice (B).`,
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
    explanation: `**Step 1: Understand conditions for infinitely many solutions**\nFor a linear system to have infinitely many solutions, the two equations must represent the exact same line, meaning corresponding coefficients and constant terms are strictly proportional.\n\n**Step 2: Compare equation coefficients**\nGiven the first equation $4x - 9y = 12$, multiply the entire equation by $3$:\n$$3(4x - 9y) = 3(12) \\implies 12x - 27y = 36$$\n\n**Step 3: Match with the second equation**\nComparing $12x - 27y = 36$ with $kx - 27y = 36$, we equate the coefficients of $x$:\n$$k = 12$$\n\n**Conclusion:**\nTherefore, $k = 12$, matching Choice (B).`,
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
    explanation: `**Step 1: Recall the standard equation of a circle**\nA circle with center $(h, k)$ and radius $r$ in the $xy$-plane has standard equation:\n$$(x - h)^2 + (y - k)^2 = r^2$$\n\n**Step 2: Substitute the given parameters**\nHere the center is $(h, k) = (2, -5)$ and radius is $r = 7$:\n$$(x - 2)^2 + (y - (-5))^2 = 7^2$$\n\n**Step 3: Simplify signs and exponents**\n$$(x - 2)^2 + (y + 5)^2 = 49$$\n\n**Conclusion:**\nThis matches Choice (A).`,
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
    explanation: `**Step 1: Identify complementary acute angles in a right triangle**\nIn right triangle $ABC$ with right angle at $C$, the acute angles $A$ and $B$ are complementary:\n$$A + B = 90^\\circ \\implies B = 90^\\circ - A$$\n\n**Step 2: Apply the cofunction identity**\nFor complementary angles, the sine of one angle equals the cosine of the other:\n$$\\cos(B) = \\cos(90^\\circ - A) = \\sin(A)$$\n\n**Step 3: Substitute the known value**\nSince $\\sin(A) = \\frac{5}{13}$, it follows immediately that:\n$$\\cos(B) = \\frac{5}{13}$$\n\n**Conclusion:**\nThe value of $\\cos(B)$ is $5/13$.`,
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
    explanation: `**Step 1: Factor out the common exponential term**\nIn the equation $3^{x+1} - 3^x = 162$, rewrite $3^{x+1}$ as $3^x \\cdot 3^1$:\n$$3^x(3^1 - 1) = 162 \\implies 2 \\cdot 3^x = 162$$\n\n**Step 2: Isolate the exponential base**\nDivide both sides by $2$:\n$$3^x = \\frac{162}{2} = 81$$\n\n**Step 3: Express $81$ as a power of $3$**\nSince $81 = 3^4$, equating exponents yields:\n$$x = 4$$\n\n**Conclusion:**\nThus, $x = 4$, which corresponds to Choice (B).`,
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
