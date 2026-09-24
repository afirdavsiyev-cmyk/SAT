export interface LessonExercise {
  id: string;
  difficulty?: 'Easy' | 'Easy-Medium' | 'Medium' | 'Medium-Hard' | 'Hard';
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string; // e.g. "B"
  explanation: string;
  desmosShortcut?: string;
  hint?: string;
}

export interface LessonFormula {
  label: string;
  latex: string;
  description: string;
}

export interface LessonTheory {
  overview: string;
  formulas: LessonFormula[];
  coreRules: string[];
}

export interface LessonSummary {
  takeaways: string[];
  workflow: string[];
  timingTip: string;
}

export interface EnrichedLessonContent {
  detailedDescription: string;
  theory: LessonTheory;
  summary: LessonSummary;
  exercises: LessonExercise[];
}

export const ENRICHED_LESSON_DATA: Record<string, EnrichedLessonContent> = {
  'intro': {
    detailedDescription: 'An indispensable strategic roadmap for the Digital SAT Math section. Learn the inner mechanics of multistage adaptive testing, how the routing engine between Module 1 and Module 2 determines your ceiling score, and how to allocate time across 44 total questions.',
    theory: {
      overview: 'The Digital SAT Math test consists of two 35-minute modules with 22 questions each (44 total). Module 1 contains a mix of easy, medium, and hard questions. Your accuracy on Module 1 decides whether you are routed to the harder Module 2 (which unlocks scores up to 800) or the easier Module 2 (which caps your score around 590-600).',
      formulas: [
        { label: 'Time per Question', latex: 't = \\frac{35\\text{ min}}{22\\text{ questions}} \\approx 1.59\\text{ min/question}', description: 'Average pacing target of 95 seconds per problem.' },
        { label: 'Hard Module 2 Routing Target', latex: 'Score_{\\text{Mod 1}} \\ge 14\\text{ to }16 / 22', description: 'Threshold to guarantee routing into the higher scoring tier.' },
        { label: 'Section Score Scaling', latex: 'Total = \\text{Scaled}(\\text{Mod 1} + \\text{Mod 2}) \\in [200, 800]', description: 'Item Response Theory (IRT) based scoring model.' }
      ],
      coreRules: [
        'No penalty for guessing: Never leave a question blank on the Digital SAT.',
        'Desmos is available on every single question without restrictions.',
        'First 15 questions in each module are standard multiple choice; the final questions are Student-Produced Responses (grid-ins).',
        'Prioritize accuracy on Module 1 questions 1–18 before spending excessive time on 19–22.'
      ]
    },
    summary: {
      takeaways: [
        'Module 1 performance dictates your entire score ceiling—make zero careless errors on early questions.',
        'Desmos graphing calculator is your ultimate speed multiplier: use it for systems, roots, and function evaluations.',
        'Flag questions that take longer than 90 seconds and return after completing the rest of the module.'
      ],
      workflow: [
        'Step 1: First pass (Questions 1-15) - Solve quick linear/arithmetic questions in 45-60 seconds each.',
        'Step 2: Second pass (Questions 16-22) - Solve grid-ins and moderate algebra using Desmos verification.',
        'Step 3: Final 5 minutes - Review flagged questions and verify calculations.'
      ],
      timingTip: 'Bank 5-7 minutes of reserve time from easy questions in Module 1 to spend on complex Module 2 modeling items.'
    },
    exercises: [
      {
        id: 'intro-q1',
        question: 'On Module 1 of the Digital SAT Math section, a student answers 19 out of 22 questions correctly. Which of the following best describes the routing outcome for Module 2?',
        options: [
          { label: 'A', text: 'The student will receive the easier Module 2, capping their maximum possible score at 600.' },
          { label: 'B', text: 'The student will be routed to the harder Module 2, keeping the maximum score of 800 within reach.' },
          { label: 'C', text: 'The student automatically receives an 800 score regardless of Module 2 performance.' },
          { label: 'D', text: 'The routing is purely random and independent of Module 1 accuracy.' }
        ],
        correctAnswer: 'B',
        explanation: 'The College Board adaptive routing threshold for the harder Module 2 typically requires answering at least 14-16 questions correctly on Module 1. With 19 correct, the student easily qualifies for the harder Module 2.',
        desmosShortcut: 'Not applicable for policy questions. Always remember that 15+ correct on Module 1 is the golden gateway to an 700+ score.',
        hint: 'Think about the adaptive score routing threshold discussed in the orientation video.'
      },
      {
        id: 'intro-q2',
        question: 'A student has 35 minutes to complete 22 questions in Module 2. If they spend 45 seconds each on the first 10 questions, how much time remains on average for each of the remaining 12 questions?',
        options: [
          { label: 'A', text: '1 minute 45 seconds' },
          { label: 'B', text: '2 minutes 17 seconds' },
          { label: 'C', text: '2 minutes 30 seconds' },
          { label: 'D', text: '3 minutes 00 seconds' }
        ],
        correctAnswer: 'B',
        explanation: 'Total time = 35 minutes = 2,100 seconds. Time spent on first 10 questions = $10 \\times 45 = 450$ seconds. Remaining time = $2,100 - 450 = 1,650$ seconds for 12 questions. Average time per remaining question = $\\frac{1,650}{12} = 137.5$ seconds = 2 minutes 17.5 seconds.',
        desmosShortcut: 'Calculate in Desmos: (35 * 60 - 10 * 45) / 12 = 137.5 seconds -> 2 minutes 17.5 seconds.',
        hint: 'Convert all minutes to seconds first, subtract the time used, then divide by 12.'
      }
    ]
  },

  'lesson-1': {
    detailedDescription: 'Master the core algebraic formulas that appear on over 30% of the Digital SAT Math exam. Learn rapid formula recognition, coordinate geometry calculations, and how to avoid costly algebraic manipulation when direct formulas yield instant answers.',
    theory: {
      overview: 'Coordinate algebra on the Digital SAT revolves around linear representations: slope, intercepts, distances, and midpoints. Recognizing the fastest form to invoke (slope-intercept vs point-slope vs standard form) saves over a minute per question.',
      formulas: [
        { label: 'Slope of a Line', latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\Delta y}{\\Delta x}', description: 'Rate of change between any two points $(x_1, y_1)$ and $(x_2, y_2)$.' },
        { label: 'Slope-Intercept Form', latex: 'y = mx + b', description: '$m$ is the slope, $b$ is the $y$-intercept $(0, b)$.' },
        { label: 'Point-Slope Form', latex: 'y - y_1 = m(x - x_1)', description: 'Ideal when given a point $(x_1, y_1)$ and slope $m$.' },
        { label: 'Midpoint Formula', latex: 'M = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)', description: 'The exact center between two coordinate points.' },
        { label: 'Distance Formula', latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}', description: 'Pythagorean theorem applied to the coordinate plane.' }
      ],
      coreRules: [
        'Parallel lines have identical slopes: $m_1 = m_2$.',
        'Perpendicular lines have negative reciprocal slopes: $m_1 \\cdot m_2 = -1$ (or $m_2 = -\\frac{1}{m_1}$).',
        'Horizontal lines have slope $m = 0$ ($y = c$); vertical lines have undefined slope ($x = c$).',
        'Standard form $Ax + By = C$ has slope $m = -\\frac{A}{B}$ and $y$-intercept $b = \\frac{C}{B}$.'
      ]
    },
    summary: {
      takeaways: [
        'Identify given coordinates immediately and compute slope $m = \\Delta y / \\Delta x$ first.',
        'Use standard form shortcut: slope of $Ax + By = C$ is $-A/B$, avoiding manual isolation of $y$.',
        'Perpendicular slope is flipped and negated: if $m = \\frac{2}{3}$, perpendicular slope is $-\\frac{3}{2}$.'
      ],
      workflow: [
        'Step 1: Check what is given: two points, a point and slope, or an equation.',
        'Step 2: If finding perpendicular line, immediately flip and negate the slope to eliminate wrong options.',
        'Step 3: Plug in known point to solve for $b$, or enter into Desmos table to inspect regression.'
      ],
      timingTip: 'In Desmos, create a table with the two points and type $y_1 \\sim m x_1 + b$ for instant slope and intercept.'
    },
    exercises: [
      {
        id: 'l1-q1',
        question: 'Line $L$ passes through the points $(-2, 5)$ and $(4, -7)$. What is the slope of a line that is perpendicular to line $L$ in the $xy$-plane?',
        options: [
          { label: 'A', text: '$-2$' },
          { label: 'B', text: '$-\\frac{1}{2}$' },
          { label: 'C', text: '$\\frac{1}{2}$' },
          { label: 'D', text: '$2$' }
        ],
        correctAnswer: 'C',
        explanation: 'First, find the slope of line $L$: $m_L = \\frac{-7 - 5}{4 - (-2)} = \\frac{-12}{6} = -2$. The perpendicular slope is the negative reciprocal: $m_{\\perp} = -\\frac{1}{-2} = \\frac{1}{2}$.',
        desmosShortcut: 'Type the points into a table $x_1, y_1$: (-2, 5) and (4, -7). Run $y_1 \\sim m x_1 + b$ to see $m = -2$. Then $-1/m = 0.5 = 1/2$.',
        hint: 'Find the slope between the two points first, then take the negative reciprocal.'
      },
      {
        id: 'l1-q2',
        question: 'In the $xy$-plane, the line $3x - 4y = 24$ is parallel to the line $kx + 8y = 15$, where $k$ is a constant. What is the value of $k$?',
        options: [
          { label: 'A', text: '$-6$' },
          { label: 'B', text: '$-3$' },
          { label: 'C', text: '$3$' },
          { label: 'D', text: '$6$' }
        ],
        correctAnswer: 'A',
        explanation: 'For line $3x - 4y = 24$, the slope is $m_1 = -\\frac{A}{B} = -\\frac{3}{-4} = \\frac{3}{4}$. For line $kx + 8y = 15$, the slope is $m_2 = -\\frac{k}{8}$. Since the lines are parallel, $m_1 = m_2$: $\\frac{3}{4} = -\\frac{k}{8} \\implies -4k = 24 \\implies k = -6$.',
        desmosShortcut: 'Graph $3x - 4y = 24$. Add a slider for $k$ in $kx + 8y = 15$. Adjust $k$ until both lines are perfectly parallel; this occurs at $k = -6$.',
        hint: 'Use the standard form slope shortcut $m = -A/B$ for both linear equations.'
      }
    ]
  },

  'lesson-2': {
    detailedDescription: 'Deep dive into algebraic expressions, factoring identities, distributive properties, and spotting equivalent polynomials. Learn how the Digital SAT disguises simple terms and how to check equivalence in Desmos in under 15 seconds.',
    theory: {
      overview: 'Algebraic manipulation questions test your mastery of polynomial expansion, common factor extraction, difference of squares, and perfect square trinomials. When expressions look intimidating, factoring or testing test values ($x = 2$ or $x = 3$) instantly cuts through algebraic complexity.',
      formulas: [
        { label: 'Difference of Squares', latex: 'a^2 - b^2 = (a - b)(a + b)', description: 'Key factoring shortcut tested on virtually every SAT.' },
        { label: 'Square of a Binomial (+)', latex: '(a + b)^2 = a^2 + 2ab + b^2', description: 'Always includes the middle term $2ab$.' },
        { label: 'Square of a Binomial (-)', latex: '(a - b)^2 = a^2 - 2ab + b^2', description: 'Middle term has negative sign.' },
        { label: 'Distributive Property', latex: 'a(b + c) = ab + ac', description: 'Watch out for distributed negative signs.' }
      ],
      coreRules: [
        'Always distribute negative signs to EVERY term inside parentheses: $-(3x - 7) = -3x + 7$.',
        'Only combine LIKE terms (same variable and exact same exponent): $3x^2$ and $5x$ CANNOT be combined.',
        'To verify equivalence in Desmos: graph $y_1 = \\text{given expression}$ and $y_2 = \\text{option}$. If the graphs overlap everywhere, they are equivalent.'
      ]
    },
    summary: {
      takeaways: [
        'Recognize $a^2 - b^2 = (a-b)(a+b)$ immediately in both directions.',
        'Do not fall for the false identity $(a+b)^2 = a^2 + b^2$; the cross-term $2ab$ is vital.',
        'If manual algebra is tedious, substitute $x = 2$ into the original expression and test the four answer choices.'
      ],
      workflow: [
        'Step 1: Check for a greatest common factor (GCF) to pull out first.',
        'Step 2: Check for difference of squares or quadratic trinomial factoring.',
        'Step 3: Verify your result by expanding back or comparing graphs in Desmos.'
      ],
      timingTip: 'Testing $x = 2$ takes 15 seconds: evaluate original expression, evaluate options, match the values.'
    },
    exercises: [
      {
        id: 'l2-q1',
        question: 'Which of the following is equivalent to the expression $(3x^2 - 4x + 5) - (x^2 - 7x - 2)$?',
        options: [
          { label: 'A', text: '$2x^2 + 3x + 7$' },
          { label: 'B', text: '$2x^2 - 11x + 3$' },
          { label: 'C', text: '$2x^2 + 3x + 3$' },
          { label: 'D', text: '$4x^2 + 3x + 7$' }
        ],
        correctAnswer: 'A',
        explanation: 'Distribute the negative sign across the second parenthesis: $3x^2 - 4x + 5 - x^2 + 7x + 2$. Combine like terms: $(3x^2 - x^2) + (-4x + 7x) + (5 + 2) = 2x^2 + 3x + 7$.',
        desmosShortcut: 'Graph $y = (3x^2 - 4x + 5) - (x^2 - 7x - 2)$ and $y = 2x^2 + 3x + 7$. The two parabolas overlap identically.',
        hint: 'Be extremely careful with the double negative: $-(-7x) = +7x$ and $-(-2) = +2$.'
      },
      {
        id: 'l2-q2',
        question: 'If $16x^4 - 81 = (ax^2 + b)(cx^2 + d)$ for all real numbers $x$, where $a, b, c, d$ are positive integers, what is the value of $a + b + c + d$?',
        options: [
          { label: 'A', text: '$13$' },
          { label: 'B', text: '$26$' },
          { label: 'C', text: '$34$' },
          { label: 'D', text: '$97$' }
        ],
        correctAnswer: 'B',
        explanation: 'Notice that $16x^4 - 81$ is a difference of squares: $(4x^2)^2 - (9)^2 = (4x^2 + 9)(4x^2 - 9)$. Here $a = 4, b = 9, c = 4, d = -9$ (or $d = 9$). Since all are positive, $a = 4, b = 9, c = 4, d = 9$. Thus $a + b + c + d = 4 + 9 + 4 + 9 = 26$.',
        desmosShortcut: 'Expand $(4x^2+9)(4x^2-9) = 16x^4 - 81$. Both match identically.',
        hint: 'Use the difference of squares identity: $A^2 - B^2 = (A + B)(A - B)$ with $A = 4x^2$ and $B = 9$.'
      }
    ]
  },

  'lesson-3': {
    detailedDescription: 'Rapid solving strategies for single-variable and multi-step linear equations, clearing fractions, and translating complex word problems into precise equations.',
    theory: {
      overview: 'Linear equations are tested extensively in both straightforward solving and contextual modeling. The exam evaluates your speed in isolating variables, clearing multi-level fractions, and recognizing conditions for zero, one, or infinitely many solutions.',
      formulas: [
        { label: 'Linear Equation Form', latex: 'ax + b = cx + d', description: 'Isolate variables on one side, constants on the other.' },
        { label: 'Clearing Fractions', latex: '\\text{Multiply entire equation by } \\text{LCD}', description: 'Instantly eliminates all denominators in one step.' },
        { label: 'No Solution Condition', latex: 'ax + b = ax + c \\quad (b \\ne c)', description: 'Same coefficient of $x$, different constants.' },
        { label: 'Infinitely Many Solutions', latex: 'ax + b = ax + b', description: 'Identical expressions on both sides of the equals sign.' }
      ],
      coreRules: [
        'No Solution: slopes/coefficients of $x$ are EQUAL, but constant intercepts are DIFFERENT.',
        'Infinitely Many Solutions: both sides simplify to the exact same expression ($0 = 0$).',
        'One Solution: coefficients of $x$ are DIFFERENT ($a \\ne c$).',
        'Word translation: "twice the sum of $x$ and 4" is $2(x + 4)$, NOT $2x + 4$.'
      ]
    },
    summary: {
      takeaways: [
        'When fractions appear, immediately multiply the entire equation by the lowest common denominator.',
        'Look for the keyword "no solution" or "infinitely many solutions"—this tells you to equate coefficients.',
        'Enter any single-variable equation directly into Desmos: it will draw a vertical line at the exact value of $x$.'
      ],
      workflow: [
        'Step 1: Clear parentheses and multiply through by common denominator if needed.',
        'Step 2: Collect all variable terms to one side and constants to the other.',
        'Step 3: If asked for the value of an expression like $2x + 5$, look for a shortcut without solving for $x$ first.'
      ],
      timingTip: 'Direct typing in Desmos: typing $3(2x-5) + 4 = 19$ instantly yields the vertical line $x = 5$.'
    },
    exercises: [
      {
        id: 'l3-q1',
        question: 'In the equation $\\frac{2}{3}(6x - 9) + 5 = kx + 1$, where $k$ is a constant, the equation has no solutions. What is the value of $k$?',
        options: [
          { label: 'A', text: '$2$' },
          { label: 'B', text: '$4$' },
          { label: 'C', text: '$-1$' },
          { label: 'D', text: '$6$' }
        ],
        correctAnswer: 'B',
        explanation: 'Expand the left side: $\\frac{2}{3}(6x) - \\frac{2}{3}(9) + 5 = 4x - 6 + 5 = 4x - 1$. The equation becomes $4x - 1 = kx + 1$. For a linear equation to have NO solution, the variable coefficients must be equal ($k = 4$) while the constants are unequal ($-1 \\ne 1$). Thus, $k = 4$.',
        desmosShortcut: 'Graph $y = (2/3)(6x - 9) + 5$ and $y = kx + 1$ with a slider for $k$. When $k = 4$, the lines are parallel with no intersection points.',
        hint: 'Distribute the left side. For no solution, the coefficients of $x$ must be identical.'
      },
      {
        id: 'l3-q2',
        question: 'If $\\frac{x}{4} + \\frac{x}{6} = 15$, what is the value of $x$?',
        options: [
          { label: 'A', text: '$18$' },
          { label: 'B', text: '$24$' },
          { label: 'C', text: '$36$' },
          { label: 'D', text: '$42$' }
        ],
        correctAnswer: 'C',
        explanation: 'Multiply the entire equation by the common denominator 12: $12\\left(\\frac{x}{4}\\right) + 12\\left(\\frac{x}{6}\\right) = 12(15) \\implies 3x + 2x = 180 \\implies 5x = 180 \\implies x = 36$.',
        desmosShortcut: 'Type x/4 + x/6 = 15 into Desmos. A vertical line appears at x = 36.',
        hint: 'Multiply all terms by 12 to eliminate the fractions.'
      }
    ]
  },

  'lesson-4': {
    detailedDescription: 'Master 2-variable linear systems of equations. Learn substitution, elimination, and how to instantly solve any system in Desmos by typing both equations and clicking their intersection point.',
    theory: {
      overview: 'A system of two linear equations represents two lines in the $xy$-plane. The solution $(x, y)$ is the coordinates of their point of intersection. The Digital SAT frequently asks for $x + y$, $x - y$, or the value of a constant $k$ that yields no solution or infinitely many solutions.',
      formulas: [
        { label: 'Standard System', latex: '\\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases}', description: 'Two lines in standard form.' },
        { label: 'One Unique Solution', latex: '\\frac{a_1}{a_2} \\ne \\frac{b_1}{b_2}', description: 'Lines have different slopes and intersect at exactly 1 point.' },
        { label: 'No Solution (Parallel)', latex: '\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\ne \\frac{c_1}{c_2}', description: 'Lines have identical slopes but different $y$-intercepts.' },
        { label: 'Infinitely Many Solutions', latex: '\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}', description: 'Lines are identical (coincident).' }
      ],
      coreRules: [
        'In Desmos: Type both equations as they appear. Click the gray dot at the intersection to get $(x, y)$ instantly.',
        'If asked for $x + y$, try adding the two equations together before solving for variables individually.',
        'For "no solution" systems, the ratio of $x$-coefficients equals the ratio of $y$-coefficients.'
      ]
    },
    summary: {
      takeaways: [
        'Desmos renders linear systems effortlessly: graph both, tap intersection, read coordinates.',
        'When $a_1/a_2 = b_1/b_2$, lines are parallel: if constant ratios differ, 0 solutions; if equal, infinite solutions.',
        'Watch for prompt asking for an expression like $3x - 2y$ instead of just $x$.'
      ],
      workflow: [
        'Step 1: Check if the question asks for a specific variable or a combination like $x + y$.',
        'Step 2: If on test, type both equations into Desmos immediately.',
        'Step 3: Click the gray intersection dot and record the requested value.'
      ],
      timingTip: 'Desmos graphical intersection takes 10 seconds flat versus 60 seconds of manual substitution.'
    },
    exercises: [
      {
        id: 'l4-q1',
        question: 'Consider the system of equations:\n$$4x + 3y = 25$$\n$$2x - y = 5$$\nWhat is the value of $x + y$?',
        options: [
          { label: 'A', text: '$4$' },
          { label: 'B', text: '$7$' },
          { label: 'C', text: '$9$' },
          { label: 'D', text: '$11$' }
        ],
        correctAnswer: 'B',
        explanation: 'Multiply the second equation by 3: $6x - 3y = 15$. Add to the first equation: $(4x + 3y) + (6x - 3y) = 25 + 15 \\implies 10x = 40 \\implies x = 4$. Substitute $x = 4$ into $2x - y = 5$: $2(4) - y = 5 \\implies 8 - y = 5 \\implies y = 3$. Therefore, $x + y = 4 + 3 = 7$.',
        desmosShortcut: 'Type 4x + 3y = 25 and 2x - y = 5 into Desmos. Tap the intersection point (4, 3). Compute 4 + 3 = 7.',
        hint: 'Solve for x and y using elimination or graph both in Desmos.'
      },
      {
        id: 'l4-q2',
        question: 'In the system of equations below, $a$ is a constant. If the system has infinitely many solutions, what is the value of $a$?\n$$6x - 9y = 18$$\n$$2x - ay = 6$$',
        options: [
          { label: 'A', text: '$2$' },
          { label: 'B', text: '$3$' },
          { label: 'C', text: '$-3$' },
          { label: 'D', text: '$9$' }
        ],
        correctAnswer: 'B',
        explanation: 'Notice that dividing the first equation by 3 gives: $\\frac{6x}{3} - \\frac{9y}{3} = \\frac{18}{3} \\implies 2x - 3y = 6$. Comparing this with the second equation $2x - ay = 6$, we see that $a$ must equal $3$ for the two equations to be identical.',
        desmosShortcut: 'Equate the coefficient ratio: 6 / 2 = -9 / (-a) = 18 / 6. 3 = 9/a implies a = 3.',
        hint: 'Divide the top equation by 3 to make the x-coefficients match.'
      }
    ]
  },

  'lesson-5': {
    detailedDescription: 'Learn to interpret linear functions $f(x) = mx + b$ in real-world contexts, understanding the physical meaning of slope as unit rate and the $y$-intercept as initial baseline value.',
    theory: {
      overview: 'Digital SAT linear function word problems test conceptual interpretation over brute calculation. The test makers will give an equation modeling cost, temperature, or population and ask: "What does the number 45 mean in this context?"',
      formulas: [
        { label: 'Linear Function Model', latex: 'f(x) = mx + b', description: '$m = \\text{rate of change per unit of } x$, $b = \\text{initial value when } x = 0$.' },
        { label: 'Rate of Change / Slope', latex: 'm = \\frac{\\Delta \\text{Output}}{\\Delta \\text{Input}}', description: 'Keywords: "per", "each", "every", "rate of".' },
        { label: 'Vertical Intercept', latex: 'b = f(0)', description: 'Keywords: "initial fee", "starting amount", "flat base charge".' }
      ],
      coreRules: [
        'Slope $m$ ALWAYS attaches to the independent variable $x$ and represents rate of increase/decrease per unit.',
        'Intercept $b$ is a constant without a variable attached and represents the starting condition at time/distance 0.',
        'If slope is negative, the quantity is decreasing; if positive, the quantity is increasing.'
      ]
    },
    summary: {
      takeaways: [
        'Look at the variable: the number multiplying $x$ is ALWAYS the rate per unit.',
        'The standalone constant is ALWAYS the starting or baseline value when $x = 0$.',
        'Units check: if $f(x)$ is in dollars and $x$ is in hours, slope $m$ is dollars per hour.'
      ],
      workflow: [
        'Step 1: Identify which variable is input ($x$) and which is output ($f(x)$).',
        'Step 2: Match the question target: are they asking about the slope ($m$) or starting amount ($b$)?',
        'Step 3: Eliminate options that swap the roles of slope and intercept.'
      ],
      timingTip: 'Read the units in the prompt: "per [unit of x]" immediately signals the slope.'
    },
    exercises: [
      {
        id: 'l5-q1',
        question: 'A plumber charges a total fee modeled by $C(h) = 45h + 85$, where $C(h)$ is the total cost in dollars for a job that takes $h$ hours. What is the best interpretation of the number 85 in this model?',
        options: [
          { label: 'A', text: 'The hourly rate charged by the plumber.' },
          { label: 'B', text: 'The flat base service call fee before any hours are worked.' },
          { label: 'C', text: 'The maximum total number of hours for any job.' },
          { label: 'D', text: 'The total cost for an 85-hour job.' }
        ],
        correctAnswer: 'B',
        explanation: 'In $C(h) = 45h + 85$, $45$ is the rate per hour (slope) and $85$ is the constant term ($y$-intercept). When $h = 0$, $C(0) = 85$, which represents the initial base service fee before any work begins.',
        desmosShortcut: 'Evaluate C(0) = 85. When h = 0 hours, cost is $85.',
        hint: 'What is the cost when the number of hours h is 0?'
      },
      {
        id: 'l5-q2',
        question: 'The height in centimeters of a bamboo plant $t$ days after being planted is given by $H(t) = 3.2t + 14.5$. By how many centimeters does the bamboo plant grow each week?',
        options: [
          { label: 'A', text: '$3.2\\text{ cm}$' },
          { label: 'B', text: '$14.5\\text{ cm}$' },
          { label: 'C', text: '$22.4\\text{ cm}$' },
          { label: 'D', text: '$36.9\\text{ cm}$' }
        ],
        correctAnswer: 'C',
        explanation: 'The slope $3.2$ represents growth per day. One week contains $7$ days. Therefore, the weekly growth is $3.2 \\times 7 = 22.4$ cm.',
        desmosShortcut: 'Compute H(7) - H(0) in Desmos: (3.2*7 + 14.5) - 14.5 = 22.4 cm.',
        hint: 'The slope gives growth per DAY. The question asks for growth per WEEK (7 days).'
      }
    ]
  },

  'lesson-6': {
    detailedDescription: 'Master linear inequalities, system constraint modeling, shaded solution regions, and boundary line tests. Learn the golden rules of flipping inequality signs and testing coordinate points.',
    theory: {
      overview: 'Inequalities represent half-planes bounded by lines. Strict inequalities ($<, >$) use dashed boundary lines; non-strict inequalities ($\\le, \\ge$) use solid boundary lines. Digital SAT questions often ask whether a point $(x, y)$ satisfies a system of constraints.',
      formulas: [
        { label: 'Standard Inequality', latex: 'y \\le mx + b \\quad \\text{or} \\quad Ax + By > C', description: 'Shaded region representing all valid $(x, y)$ solutions.' },
        { label: 'Sign Flip Rule', latex: '-ax < b \\iff x > -\\frac{b}{a}', description: 'Multiplying or dividing by a negative flips the inequality direction.' },
        { label: 'System Feasible Region', latex: '\\begin{cases} y \\ge m_1 x + b_1 \\\\ y \\le m_2 x + b_2 \\end{cases}', description: 'The intersection where all shaded constraints overlap.' }
      ],
      coreRules: [
        'CRITICAL: Always flip the inequality sign whenever multiplying or dividing both sides by a NEGATIVE number.',
        'Test point technique: Substitute $(0,0)$ into the inequality to quickly verify which side of the line should be shaded.',
        'Solid line $\\le, \\ge$: points on boundary ARE included. Dashed line $<, >$: boundary points are NOT included.'
      ]
    },
    summary: {
      takeaways: [
        'Desmos graphs inequalities with automatic shading: type $y <= 2x + 5$ to see the solution region.',
        'When looking for valid integer solutions, plot the options as points to see if they lie within the overlap region.',
        'Beware of dividing by a negative coefficient!'
      ],
      workflow: [
        'Step 1: If solving algebraically, isolate $y$ and remember to flip the sign if dividing by a negative.',
        'Step 2: If graphing in Desmos, type all inequality constraints directly.',
        'Step 3: Check which candidate point $(x, y)$ falls into the darkest overlapping shaded region.'
      ],
      timingTip: 'Type multiple inequalities into Desmos; the overlapping shaded region is shown in combined color.'
    },
    exercises: [
      {
        id: 'l6-q1',
        question: 'Solve for $x$: $$-3(2x - 5) \\le 27$$ Which of the following represents all solutions?',
        options: [
          { label: 'A', text: '$x \\ge -2$' },
          { label: 'B', text: '$x \\le -2$' },
          { label: 'C', text: '$x \\ge 7$' },
          { label: 'D', text: '$x \\le -7$' }
        ],
        correctAnswer: 'A',
        explanation: 'Divide both sides by $-3$ (remembering to flip the inequality sign!): $2x - 5 \\ge \\frac{27}{-3} \\implies 2x - 5 \\ge -9$. Add 5 to both sides: $2x \\ge -4$. Divide by 2: $x \\ge -2$.',
        desmosShortcut: 'Type -3(2x - 5) <= 27 into Desmos. It shades the region x >= -2.',
        hint: 'Dividing by -3 reverses the inequality symbol from <= to >=.'
      },
      {
        id: 'l6-q2',
        question: 'Which of the following points $(x, y)$ is in the solution set of the system of inequalities below?\n$$y > 2x - 3$$\n$$x + y \\le 6$$',
        options: [
          { label: 'A', text: '$(4, 1)$' },
          { label: 'B', text: '$(1, 4)$' },
          { label: 'C', text: '$(5, 2)$' },
          { label: 'D', text: '$(0, -4)$' }
        ],
        correctAnswer: 'B',
        explanation: 'Test point $(1, 4)$: For first inequality: $4 > 2(1) - 3 \\implies 4 > -1$ (TRUE). For second inequality: $1 + 4 = 5 \\le 6$ (TRUE). Both constraints are satisfied.',
        desmosShortcut: 'Graph y > 2x - 3 and x + y <= 6 in Desmos. Plot each answer choice: (1, 4) clearly sits in the overlapping region.',
        hint: 'Plug in the (x, y) coordinates into both inequalities and check which one makes both true.'
      }
    ]
  }
};
