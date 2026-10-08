import { Question } from '../types';

/**
 * Official Digital SAT Math Practice Test 11 (Turbo Prep Test 1)
 * Complete 44-Question Dataset
 * Module 1: Questions 1 – 22 (35 Minutes)
 * Module 2: Questions 23 – 44 (35 Minutes, Adaptive Track)
 */
export const OFFICIAL_PRACTICE_TEST_11_QUESTIONS: Question[] = [
  // ─────────────────────────────────────────────────────────────
  // MODULE 1 (Questions 1 to 22)
  // ─────────────────────────────────────────────────────────────
  {
    id: "pt11-m1-q01",
    number: 1,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "$(x + 7)$ is a factor of the quadratic function $y = f(x)$, and $x = k$ is a positive zero of the function. If the minimum of the function is $\\left(\\frac{63}{8}, m\\right)$, what is the value of $k$?",
    options: [
      { id: "A", text: "$\\frac{91}{4}$" },
      { id: "B", text: "$\\frac{91}{2}$" },
      { id: "C", text: "$\\frac{91}{8}$" },
      { id: "D", text: "$\\frac{91}{16}$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Identify zeros of the quadratic function**\nSince $(x + 7)$ is a factor, one zero is $x_1 = -7$. The other zero is $x_2 = k$.\n\n**Step 2: Relate zeros to the vertex $x$-coordinate**\nFor any parabola, the $x$-coordinate of the vertex (minimum) is the midpoint of its zeros:\n$$x_v = \\frac{x_1 + x_2}{2}$$\n$$\\frac{-7 + k}{2} = \\frac{63}{8}$$\n\n**Step 3: Solve for $k$**\n$$-7 + k = 2 \\times \\frac{63}{8} = \\frac{63}{4}$$\n$$k = \\frac{63}{4} + 7 = \\frac{63}{4} + \\frac{28}{4} = \\frac{91}{4}$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "The vertex $x$-coordinate $\\frac{63}{8}$ is the midpoint of $-7$ and $k$."
  },
  {
    id: "pt11-m1-q02",
    number: 2,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "For two acute angles, $\\angle A$ and $\\angle B$, $\\cos A = \\sin B$. The measures, in degrees, of $\\angle A$ and $\\angle B$ are $(13x + 10)^\\circ$ and $(48 + 3x)^\\circ$, respectively. What is the value of $x$?",
    options: [
      { id: "A", text: "$2$" },
      { id: "B", text: "$4$" },
      { id: "C", text: "$5$" },
      { id: "D", text: "$3$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Use complementary angle identity**\nIf $\\cos A = \\sin B$ for acute angles $A$ and $B$, then $A + B = 90^\\circ$.\n\n**Step 2: Set up equation**\n$$(13x + 10) + (48 + 3x) = 90$$\n$$16x + 58 = 90$$\n$$16x = 32 \\implies x = 2$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Recall that $\\cos A = \\sin B$ implies $A + B = 90^\\circ$."
  },
  {
    id: "pt11-m1-q03",
    number: 3,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A baseball coach charges each athlete $\\$150$ for the first month and $\\$95$ for each additional month. Which of the following functions correctly represents the total revenue $R(m)$, in dollars, for $m$ months and $n$ athletes, where $m$ and $n$ are positive integers?",
    options: [
      { id: "A", text: "$R(m) = 95mn + 55$" },
      { id: "B", text: "$R(m) = 95mn + 150$" },
      { id: "C", text: "$R(m) = 95mn + 55n$" },
      { id: "D", text: "$R(m) = 95mn + 150n$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Calculate cost per athlete for $m$ months**\nFor 1 athlete, the cost is $\\$150$ for month 1 plus $\\$95$ for each of the remaining $(m - 1)$ months:\n$$\\text{Cost per athlete} = 150 + 95(m - 1) = 150 + 95m - 95 = 95m + 55$$\n\n**Step 2: Multiply by $n$ athletes**\n$$R(m) = n(95m + 55) = 95mn + 55n$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Each athlete pays $150 + 95(m - 1) = 95m + 55$. Multiply by $n$."
  },
  {
    id: "pt11-m1-q04",
    number: 4,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "Consider the given system of equations:\n$$\\begin{cases} y = -3x^2 - 58 \\\\ y = px - 46 \\end{cases}$$\nIn the given system, $p$ is a constant. The graphs of the equations intersect at exactly one point $(x, y)$ in the $xy$-plane. Which of the following could be the value of $x$?",
    options: [
      { id: "A", text: "$-2$" },
      { id: "B", text: "$-4$" },
      { id: "C", text: "$12$" },
      { id: "D", text: "$16$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Set the two equations equal**\n$$-3x^2 - 58 = px - 46$$\n$$-3x^2 - px - 12 = 0 \\implies 3x^2 + px + 12 = 0$$\n\n**Step 2: Use condition for exactly one intersection**\nThe discriminant must be zero:\n$$\\Delta = p^2 - 4(3)(12) = p^2 - 144 = 0 \\implies p = \\pm 12$$\n\n**Step 3: Find the $x$-coordinate of the intersection**\nFor a quadratic with $\\Delta = 0$, the single root is:\n$$x = -\\frac{b}{2a} = -\\frac{p}{2(3)} = -\\frac{p}{6}$$\n- If $p = 12$, $x = -\\frac{12}{6} = -2$.\n- If $p = -12$, $x = -\\frac{-12}{6} = 2$.\n\nAmong the options, $-2$ is present.\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Set $3x^2 + px + 12 = 0$. Exactly one intersection means discriminant $p^2 - 144 = 0$."
  },
  {
    id: "pt11-m1-q05",
    number: 5,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The function $f$ is defined by $f(x) = -7x + b$. Which of the following gives the equation for the function $f(x) + 20$, given that the point $(-4, 0)$ lies on the graph of $f(x) - 20$?",
    options: [
      { id: "A", text: "$f(x) + 20 = -7x - 28$" },
      { id: "B", text: "$f(x) + 20 = -7x - 8$" },
      { id: "C", text: "$f(x) + 20 = -7x + 8$" },
      { id: "D", text: "$f(x) + 20 = -7x + 12$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Use the given point $(-4, 0)$ on $f(x) - 20$**\n$$f(-4) - 20 = 0 \\implies f(-4) = 20$$\n\n**Step 2: Substitute into $f(x) = -7x + b$**\n$$-7(-4) + b = 20$$\n$$28 + b = 20 \\implies b = -8$$\nSo $f(x) = -7x - 8$.\n\n**Step 3: Find $f(x) + 20$**\n$$f(x) + 20 = (-7x - 8) + 20 = -7x + 12$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "First find $b$ by setting $f(-4) - 20 = 0$."
  },
  {
    id: "pt11-m1-q06",
    number: 6,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The positive number $a$ is $480\\%$ of the number $b$, and $a$ is $70\\%$ of the number $c$. If $c$ is $p\\%$ of $b$, which of the following is closest to the value of $p$?",
    options: [
      { id: "A", text: "$267$" },
      { id: "B", text: "$336$" },
      { id: "C", text: "$550$" },
      { id: "D", text: "$685$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Translate relations into equations**\n$$a = 4.80b$$\n$$a = 0.70c$$\n\n**Step 2: Equate expressions for $a$**\n$$0.70c = 4.80b \\implies c = \\frac{4.80}{0.70}b = \\frac{48}{7}b \\approx 6.8571b$$\n\n**Step 3: Convert to percentage**\n$$c = p\\% \\times b \\implies p = 6.8571 \\times 100 \\approx 685.71 \\approx 685$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Set $0.70c = 4.80b$ and solve for $\\frac{c}{b} \\times 100$."
  },
  {
    id: "pt11-m1-q07",
    number: 7,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "The exponential function $f(x) = a^x - b$, where $a$ and $b$ are positive constants, passes through the points $(c, 8)$ and $(2c, 350)$. What is a possible value of $b$?",
    options: [
      { id: "A", text: "$11$" },
      { id: "B", text: "$12$" },
      { id: "C", text: "$6$" },
      { id: "D", text: "$14$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Set up equations from the given points**\nFrom $(c, 8)$:\n$$a^c - b = 8 \\implies a^c = b + 8$$\nFrom $(2c, 350)$:\n$$a^{2c} - b = 350 \\implies a^{2c} = b + 350$$\n\n**Step 2: Relate $a^{2c}$ and $(a^c)^2$**\n$$a^{2c} = (a^c)^2 = (b + 8)^2$$\n$$(b + 8)^2 = b + 350$$\n$$b^2 + 16b + 64 = b + 350$$\n$$b^2 + 15b - 286 = 0$$\n\n**Step 3: Factor the quadratic**\n$$(b + 26)(b - 11) = 0$$\nSince $b$ is positive, $b = 11$.\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Note that $a^{2c} = (a^c)^2$, so $(b + 8)^2 = b + 350$."
  },
  {
    id: "pt11-m1-q08",
    number: 8,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "The table gives information about two similar cylinders:\n\n| Cylinder | Volume | Surface Area |\n| :--- | :--- | :--- |\n| A | $1,296\\pi$ | $k\\pi$ |\n| B | $162,000\\pi$ | $j\\pi$ |\n\nIf the radius of cylinder A is $9\\text{ cm}$, what is the value of $j - k$? (Note: $\\text{Volume} = \\pi r^2 h$, $\\text{Surface area} = 2\\pi r^2 + 2\\pi r h$)",
    options: [
      { id: "A", text: "$10,800$" },
      { id: "B", text: "$9,400$" },
      { id: "C", text: "$11,200$" },
      { id: "D", text: "$11,600$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Find linear scale factor**\nFor similar solids, the ratio of volumes is the cube of the scale factor $s$:\n$$s^3 = \\frac{V_B}{V_A} = \\frac{162,000\\pi}{1,296\\pi} = 125 \\implies s = 5$$\n\n**Step 2: Find dimensions and surface area of cylinder A**\n$$V_A = \\pi r_A^2 h_A = \\pi (9^2) h_A = 81\\pi h_A = 1,296\\pi \\implies h_A = 16$$\n$$\\text{Surface Area}_A = 2\\pi r_A^2 + 2\\pi r_A h_A = 2\\pi(81) + 2\\pi(9)(16) = 162\\pi + 288\\pi = 450\\pi$$\nThus, $k = 450$.\n\n**Step 3: Find surface area of cylinder B**\nThe ratio of surface areas is $s^2 = 5^2 = 25$:\n$$j = 25 \\times k = 25 \\times 450 = 11,250$$\n\n**Step 4: Compute $j - k$**\n$$j - k = 11,250 - 450 = 10,800$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "The volume ratio is $125 = s^3 \\implies s = 5$. Surface area scale factor is $s^2 = 25$."
  },
  {
    id: "pt11-m1-q09",
    number: 9,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "For the function $f$, for every increase of $2$ in the value of $x$, the value of $f(x)$ increases by a factor of $c$, where $c$ is a constant. Which of the following forms of function $f$ displays the value of $c$ as the base or coefficient?",
    options: [
      { id: "A", text: "$f(x) = 56(2)^{6x}$" },
      { id: "B", text: "$f(x) = 56(8)^{2x}$" },
      { id: "C", text: "$f(x) = 56(64)^x$" },
      { id: "D", text: "$f(x) = 56(4,096)^{x/2}$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Understand exponential growth with step size**\nWhen a function increases by a constant factor $c$ for every increase of $k$ units in $x$, the function can be expressed in the form:\n$$f(x) = a \\cdot c^{x/k}$$\nHere, for an increase of $2$ in $x$, the exponent is $\\frac{x}{2}$.\n\n**Step 2: Compare equivalent forms**\nAll four choices are algebraically equivalent:\n$$56(2)^{6x} = 56(8)^{2x} = 56(64)^x = 56(4,096)^{x/2}$$\nIn the form $f(x) = 56(4,096)^{x/2}$, the base is $4,096$, which explicitly displays the factor by which the function increases when $x$ increases by $2$.\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Look for the form where the exponent has the step size in its denominator."
  },
  {
    id: "pt11-m1-q10",
    number: 10,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The quadratic equation $ax^2 + 200x + c = 0$ has at least one real solution. What is the greatest possible value of $ac$?",
    options: [
      { id: "A", text: "$10,000$" },
      { id: "B", text: "$10,001$" },
      { id: "C", text: "$9,999$" },
      { id: "D", text: "$11,000$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Discriminant condition for real solutions**\nA quadratic equation $ax^2 + bx + c = 0$ has at least one real solution if and only if its discriminant is greater than or equal to zero:\n$$\\Delta = b^2 - 4ac \\ge 0$$\n\n**Step 2: Substitute $b = 200$**\n$$200^2 - 4ac \\ge 0$$\n$$40,000 - 4ac \\ge 0$$\n$$4ac \\le 40,000$$\n$$ac \\le 10,000$$\n\n**Conclusion:** The greatest possible value of $ac$ is $10,000$. Choice (A) is correct.",
    hint: "Set the discriminant $\\Delta = b^2 - 4ac \\ge 0$ with $b = 200$."
  },
  {
    id: "pt11-m1-q11",
    number: 11,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A regular polygon has exactly $97$ sides. If the measure of each of the $97$ interior angles of this polygon is $(180p)^\\circ$, what is the value of $p$?",
    options: [
      { id: "A", text: "$\\frac{95}{97}$" },
      { id: "B", text: "$\\frac{97}{95}$" },
      { id: "C", text: "$\\frac{91}{97}$" },
      { id: "D", text: "$\\frac{85}{97}$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Formula for interior angle of regular polygon**\nFor an $n$-sided regular polygon, each interior angle measures:\n$$\\theta = \\frac{(n - 2) \\times 180^\\circ}{n}$$\n\n**Step 2: Substitute $n = 97$**\n$$\\theta = \\frac{97 - 2}{97} \\times 180^\\circ = \\frac{95}{97} \\times 180^\\circ = \\left(180 \\times \\frac{95}{97}\\right)^\\circ$$\n\n**Step 3: Identify $p$**\nComparing to $(180p)^\\circ$, we have $p = \\frac{95}{97}$.\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Each interior angle is $\\frac{(n-2) \\cdot 180^\\circ}{n}$. Here $n = 97$."
  },
  {
    id: "pt11-m1-q12",
    number: 12,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A certain town has an area of $5.48$ square miles. Which of the following is closest to the area, in square yards, of this town? ($1\\text{ mile} = 1,760\\text{ yards}$)",
    options: [
      { id: "A", text: "$552$" },
      { id: "B", text: "$964$" },
      { id: "C", text: "$9,645$" },
      { id: "D", text: "$16,974,848$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Convert square miles to square yards**\nSince $1\\text{ mile} = 1,760\\text{ yards}$:\n$$1\\text{ square mile} = (1,760)^2\\text{ square yards} = 3,097,600\\text{ square yards}$$\n\n**Step 2: Multiply by $5.48$**\n$$\\text{Area} = 5.48 \\times 3,097,600 = 16,974,848\\text{ square yards}$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Remember to square the conversion factor: $1\\text{ sq mi} = 1,760^2\\text{ sq yd}$."
  },
  {
    id: "pt11-m1-q13",
    number: 13,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "One of the two equations in a system of linear equations is given:\n$$7x = 105y - 133$$\nThe system has no solution. Which equation could be the second equation in this system?",
    options: [
      { id: "A", text: "$x = 15y$" },
      { id: "B", text: "$\\frac{1}{7}x = 15y$" },
      { id: "C", text: "$x = 15y - 19$" },
      { id: "D", text: "$\\frac{1}{7}x = 15y - 19$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Simplify the given equation**\nDivide both sides by $7$:\n$$x = 15y - 19$$\n\n**Step 2: Condition for no solution**\nA system of linear equations has no solution if the two lines are parallel with different $y$-intercepts.\n- The first line has slope related by $x = 15y - 19$, or $y = \\frac{1}{15}x + \\frac{19}{15}$.\n- The equation $x = 15y$ has the same slope ($\\frac{1}{15}$) and a different constant term ($0 \\ne -19$).\nTherefore, the lines are parallel and distinct, resulting in no solution.\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Divide by 7 to get $x = 15y - 19$. A parallel line with a different intercept gives no solution."
  },
  {
    id: "pt11-m1-q14",
    number: 14,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "In right triangle $ABC$, the sum of the measures of acute angle $A$ and acute angle $B$ is $90^\\circ$. The value of $\\sin(A)$ is $\\frac{2\\sqrt{7}}{8}$. What is the value of $\\cos(B)$?",
    options: [
      { id: "A", text: "$\\frac{2\\sqrt{7}}{8}$" },
      { id: "B", text: "$\\frac{2\\sqrt{7}}{4}$" },
      { id: "C", text: "$\\frac{4\\sqrt{2}}{8}$" },
      { id: "D", text: "$\\frac{8}{2\\sqrt{7}}$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Use complementary angle cofunction identity**\nFor any two complementary angles where $A + B = 90^\\circ$:\n$$\\cos(B) = \\sin(A)$$\n\n**Step 2: Evaluate**\n$$\\cos(B) = \\sin(A) = \\frac{2\\sqrt{7}}{8}$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "For complementary angles, $\\cos(B) = \\sin(A)$."
  },
  {
    id: "pt11-m1-q15",
    number: 15,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "What is the value of $\\frac{k}{25}$ if the given equation has only one solution?\n$$25|x - 4| = k$$",
    options: [
      { id: "A", text: "$-5$ only" },
      { id: "B", text: "$5$ only" },
      { id: "C", text: "$5$ or $-5$" },
      { id: "D", text: "$0$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Analyze the absolute value equation**\n$$|x - 4| = \\frac{k}{25}$$\n- If $\\frac{k}{25} > 0$, there are two distinct solutions ($x - 4 = \\pm \\frac{k}{25}$).\n- If $\\frac{k}{25} < 0$, there are no real solutions.\n- If $\\frac{k}{25} = 0$, there is exactly one solution ($x = 4$).\n\n**Step 2: Determine $\\frac{k}{25}$**\nFor exactly one solution, we must have $\\frac{k}{25} = 0$.\n\n**Conclusion:** Choice (D) is correct.",
    hint: "An absolute value equation $|expression| = c$ has exactly one solution if and only if $c = 0$."
  },
  {
    id: "pt11-m1-q16",
    number: 16,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "In the given system of equations, $k$ is a constant:\n$$\\begin{cases} \\frac{3}{8}x + \\frac{7}{5}y = \\frac{9}{7} - \\frac{7}{5}y \\\\ \\frac{5}{4}x + \\frac{9}{4} = ky + \\frac{4}{3} \\end{cases}$$\nIf the system has no solution, what is the value of $k$?",
    options: [
      { id: "A", text: "$-\\frac{28}{3}$" },
      { id: "B", text: "$-\\frac{26}{3}$" },
      { id: "C", text: "$-\\frac{19}{3}$" },
      { id: "D", text: "$-\\frac{14}{3}$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Simplify both equations to standard form $Ax + By = C$**\nEquation 1:\n$$\\frac{3}{8}x + \\frac{14}{5}y = \\frac{9}{7}$$\n\nEquation 2:\n$$\\frac{5}{4}x - ky = \\frac{4}{3} - \\frac{9}{4} = -\\frac{11}{12}$$\n\n**Step 2: Condition for parallel lines (no solution)**\nThe ratio of the coefficients of $x$ and $y$ must be equal:\n$$\\frac{A_1}{A_2} = \\frac{B_1}{B_2}$$\n$$\\frac{3/8}{5/4} = \\frac{14/5}{-k}$$\n$$\\frac{3}{8} \\times \\frac{4}{5} = \\frac{3}{10}$$\n$$\\frac{3}{10} = \\frac{14/5}{-k} \\implies -k \\left(\\frac{3}{10}\\right) = \\frac{14}{5}$$\n$$-k = \\frac{14}{5} \\times \\frac{10}{3} = \\frac{28}{3} \\implies k = -\\frac{28}{3}$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Set the ratios of $x$ and $y$ coefficients equal: $\\frac{3/8}{5/4} = \\frac{14/5}{-k}$."
  },
  {
    id: "pt11-m1-q17",
    number: 17,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "In the $xy$-plane, the graph of the given equation is a circle:\n$$(x + 7)^2 + (y - 11)^2 = 25$$\nWhich of the following points lies on this circle?",
    options: [
      { id: "A", text: "$(-7, 11)$" },
      { id: "B", text: "$(11, -7)$" },
      { id: "C", text: "$(\\sqrt{11} + 7, \\sqrt{14} - 11)$" },
      { id: "D", text: "$(\\sqrt{11} - 7, \\sqrt{14} + 11)$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Test point D**\nSubstitute $x = \\sqrt{11} - 7$ and $y = \\sqrt{14} + 11$ into the circle equation:\n$$((\\sqrt{11} - 7) + 7)^2 + ((\\sqrt{14} + 11) - 11)^2$$\n$$= (\\sqrt{11})^2 + (\\sqrt{14})^2 = 11 + 14 = 25$$\nThis satisfies the equation $25 = 25$.\n\n**Step 2: Check other points**\n- Point A: $(-7+7)^2 + (11-11)^2 = 0 \\ne 25$ (this is the center, not on the circle).\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Substitute the coordinates into $(x + 7)^2 + (y - 11)^2$ and check if the sum equals $25$."
  },
  {
    id: "pt11-m1-q18",
    number: 18,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The area of a triangle is equal to $x^2$ square inches. The base of the triangle is $(5 + 2x)$ inches, and the height of the triangle is $(x - 2)$ inches. What is the value of $x$?",
    options: [
      { id: "A", text: "$2.5$" },
      { id: "B", text: "$2.7$" },
      { id: "C", text: "$5$" },
      { id: "D", text: "$10$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Set up the area equation**\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}$$\n$$x^2 = \\frac{1}{2}(2x + 5)(x - 2)$$\n\n**Step 2: Multiply by $2$ and expand**\n$$2x^2 = (2x + 5)(x - 2)$$\n$$2x^2 = 2x^2 - 4x + 5x - 10$$\n$$2x^2 = 2x^2 + x - 10$$\n\n**Step 3: Solve for $x$**\nSubtract $2x^2$ from both sides:\n$$0 = x - 10 \\implies x = 10$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Set $x^2 = \\frac{1}{2}(2x + 5)(x - 2)$ and simplify."
  },
  {
    id: "pt11-m1-q19",
    number: 19,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A circle in the $xy$-plane has its center at $(3, -7)$ and a radius of $12$. An equation of this circle is $x^2 + y^2 + ax + by + c = 0$, where $a$, $b$, and $c$ are constants. What is the value of $c$?",
    options: [
      { id: "A", text: "$-86$" },
      { id: "B", text: "$-94$" },
      { id: "C", text: "$-88$" },
      { id: "D", text: "$-96$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Write standard equation of the circle**\n$$(x - h)^2 + (y - k)^2 = r^2$$\n$$(x - 3)^2 + (y - (-7))^2 = 12^2$$\n$$(x - 3)^2 + (y + 7)^2 = 144$$\n\n**Step 2: Expand to general form**\n$$(x^2 - 6x + 9) + (y^2 + 14y + 49) = 144$$\n$$x^2 + y^2 - 6x + 14y + 58 = 144$$\n$$x^2 + y^2 - 6x + 14y - 86 = 0$$\n\n**Step 3: Identify $c$**\n$$c = 58 - 144 = -86$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Expand $(x - 3)^2 + (y + 7)^2 = 144$. The constant term is $9 + 49 - 144$."
  },
  {
    id: "pt11-m1-q20",
    number: 20,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Sphere A has a radius of $7x$ and sphere B has a radius of $91x$, where $x$ is a positive constant. The volume of sphere B is how many times the volume of sphere A?",
    options: [
      { id: "A", text: "$2,197$" },
      { id: "B", text: "$2,226$" },
      { id: "C", text: "$2,464$" },
      { id: "D", text: "$2,187$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Find the ratio of the radii**\n$$\\frac{r_B}{r_A} = \\frac{91x}{7x} = 13$$\n\n**Step 2: Relate volume ratio to linear scale factor**\nFor any two spheres, the volume ratio is the cube of the radius ratio:\n$$\\frac{V_B}{V_A} = \\left(\\frac{r_B}{r_A}\\right)^3 = 13^3$$\n$$13^3 = 169 \\times 13 = 2,197$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "The ratio of radii is $\\frac{91x}{7x} = 13$. The volume ratio is $13^3$."
  },
  {
    id: "pt11-m1-q21",
    number: 21,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "One gallon of resin costs $\\$79$ and will cover $48$ square feet of a countertop. The countertops in a given room have a total surface area of $k$ square feet. Which equation represents the cost $C$, in dollars, of resin needed to cover the countertops twice?",
    options: [
      { id: "A", text: "$C = \\frac{79k}{48}$" },
      { id: "B", text: "$C = \\frac{96k}{48}$" },
      { id: "C", text: "$C = 79\\left(\\frac{k}{24}\\right)$" },
      { id: "D", text: "$C = 79\\left(\\frac{k}{96}\\right)$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Find total area to cover**\nSince the countertops must be covered twice, the total area to cover is $2k$ square feet.\n\n**Step 2: Find gallons of resin required**\n$$\\text{Gallons} = \\frac{2k}{48} = \\frac{k}{24}$$\n\n**Step 3: Calculate total cost**\nAt $\\$79$ per gallon:\n$$C = 79 \\times \\left(\\frac{k}{24}\\right)$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Covering twice requires $2k$ sq ft. Gallons needed is $\\frac{2k}{48} = \\frac{k}{24}$."
  },
  {
    id: "pt11-m1-q22",
    number: 22,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "For each real number $t$, which of the following points lies on the graph of each equation in the $xy$-plane for the given system?\n$$\\begin{cases} 10x + 8y = 15 \\\\ 25x + 20y = 37.5 \\end{cases}$$",
    options: [
      { id: "A", text: "$\\left(t, -\\frac{5}{4}t + \\frac{15}{8}\\right)$" },
      { id: "B", text: "$\\left(t, \\frac{4}{5}t + \\frac{15}{8}\\right)$" },
      { id: "C", text: "$\\left(-\\frac{5}{4}t + \\frac{1}{2}, t\\right)$" },
      { id: "D", text: "$\\left(\\frac{2}{5}t + 10, -\\frac{2}{5}t + 25\\right)$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Notice the two equations represent the same line**\nMultiplying $10x + 8y = 15$ by $2.5$:\n$$25x + 20y = 37.5$$\nThus, both equations represent the identical line.\n\n**Step 2: Express $y$ in terms of $x$**\n$$8y = -10x + 15$$\n$$y = -\\frac{10}{8}x + \\frac{15}{8} = -\\frac{5}{4}x + \\frac{15}{8}$$\n\n**Step 3: Parametrize with $x = t$**\n$$(x, y) = \\left(t, -\\frac{5}{4}t + \\frac{15}{8}\\right)$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Solve $10x + 8y = 15$ for $y$ in terms of $x$ to find $y = -\\frac{5}{4}x + \\frac{15}{8}$."
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 2 (Questions 23 to 44)
  // ─────────────────────────────────────────────────────────────
  {
    id: "pt11-m2-q23",
    number: 23,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A researcher selected two random samples of employees in a large company to estimate the percentage of employees that planned to vote in favor of a new division. Based on the first sample, the researcher estimated that $68\\%$ of the employees would vote in favor, with an associated margin of error of $9.7\\%$. Based on the second sample, the researcher estimated that $84\\%$ of the employees would vote in favor, with an associated margin of error of $6.7\\%$. Assuming the margins of error were calculated in the same way, which of the following best explains why the second sample obtained a smaller margin of error than the first sample?",
    options: [
      { id: "A", text: "The first sample contained fewer employees than the second sample." },
      { id: "B", text: "The first sample contained more employees than the second sample." },
      { id: "C", text: "The first sample contained a lower percentage of residents that planned to vote in favor." },
      { id: "D", text: "The first sample contained a higher percentage of residents that planned to vote in favor." }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Recall the relationship between sample size and margin of error**\nThe margin of error of a sample proportion is inversely proportional to the square root of the sample size $n$:\n$$\\text{Margin of Error} \\approx z^* \\sqrt{\\frac{\\hat{p}(1 - \\hat{p})}{n}}$$\nAs the sample size increases, the standard error decreases, which results in a smaller margin of error.\n\n**Step 2: Compare sample sizes**\nSince the second sample has a smaller margin of error ($6.7\\%$ vs $9.7\\%$), the second sample must have had a larger sample size ($n_2 > n_1$). Equivalently, the first sample contained fewer employees than the second sample.\n\n**Conclusion:** Choice (A) is correct.",
    hint: "A larger sample size yields a smaller margin of error."
  },
  {
    id: "pt11-m2-q24",
    number: 24,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "The function $f$ is defined by $f(x) = a^x + b$, where $a$ and $b$ are constants. In the $xy$-plane, the graph of $y = f(x)$ has an $x$-intercept at $(3, 0)$ and a $y$-intercept at $(0, -342)$. What is the value of $a + b$?",
    options: [
      { id: "A", text: "$-336$" },
      { id: "B", text: "$-330$" },
      { id: "C", text: "$-342$" },
      { id: "D", text: "$-348$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Use the $y$-intercept $(0, -342)$**\n$$f(0) = a^0 + b = 1 + b = -342$$\n$$b = -342 - 1 = -343$$\n\n**Step 2: Use the $x$-intercept $(3, 0)$**\n$$f(3) = a^3 + b = 0$$\n$$a^3 - 343 = 0 \\implies a^3 = 343 \\implies a = 7$$\n\n**Step 3: Calculate $a + b$**\n$$a + b = 7 + (-343) = -336$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Use $f(0) = 1 + b = -342$ to find $b$, then $a^3 + b = 0$ to find $a$."
  },
  {
    id: "pt11-m2-q25",
    number: 25,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "$684$ is $p\\%$ greater than $9$. What is the value of $p$?",
    options: [
      { id: "A", text: "$7,500$" },
      { id: "B", text: "$7,800$" },
      { id: "C", text: "$8,100$" },
      { id: "D", text: "$8,400$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Set up the percent increase equation**\n$$684 = 9 \\left(1 + \\frac{p}{100}\\right)$$\n\n**Step 2: Solve for $1 + \\frac{p}{100}$**\n$$\\frac{684}{9} = 76$$\n$$1 + \\frac{p}{100} = 76$$\n$$\\frac{p}{100} = 75 \\implies p = 7,500$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Percent increase formula: $\\frac{684 - 9}{9} \\times 100$."
  },
  {
    id: "pt11-m2-q26",
    number: 26,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "Two numbers $a$ and $b$ are each greater than zero, and the fifth root of $a$ is equal to the cube root of $b$. For what value of $x$ is $a^{8x - 4}$ equal to $b$?",
    options: [
      { id: "A", text: "$\\frac{23}{40}$" },
      { id: "B", text: "$\\frac{17}{40}$" },
      { id: "C", text: "$\\frac{11}{40}$" },
      { id: "D", text: "$\\frac{27}{40}$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Express the relation between $a$ and $b$**\n$$\\sqrt[5]{a} = \\sqrt[3]{b} \\implies a^{1/5} = b^{1/3}$$\nCube both sides:\n$$b = \\left(a^{1/5}\\right)^3 = a^{3/5}$$\n\n**Step 2: Set $a^{8x - 4} = b$**\n$$a^{8x - 4} = a^{3/5}$$\nSince $a > 0$ and $a \\ne 1$, equate exponents:\n$$8x - 4 = \\frac{3}{5}$$\n$$8x = 4 + \\frac{3}{5} = \\frac{23}{5}$$\n$$x = \\frac{23}{40}$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Express $b$ in terms of $a$: $b = a^{3/5}$, then equate exponents $8x - 4 = \\frac{3}{5}$."
  },
  {
    id: "pt11-m2-q27",
    number: 27,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "For the given system of equations, what is the value of $7(j - k)$?\n$$\\begin{cases} (j - k) - 16(m + l) = 689 \\\\ (j - k) + 12(m + l) = 1235 \\end{cases}$$",
    options: [
      { id: "A", text: "$7,007$" },
      { id: "B", text: "$8,011$" },
      { id: "C", text: "$7,784$" },
      { id: "D", text: "$8,240$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Let $U = j - k$ and $V = m + l$**\nRewrite the linear system in terms of $U$ and $V$:\n$$\\begin{cases} U - 16V = 689 \\\\ U + 12V = 1235 \\end{cases}$$\n\n**Step 2: Eliminate $U$ to find $V$**\nSubtract equation 1 from equation 2:\n$$(U + 12V) - (U - 16V) = 1235 - 689$$\n$$28V = 546 \\implies V = \\frac{546}{28} = 19.5$$\n\n**Step 3: Solve for $U = j - k$**\n$$U = 689 + 16(19.5) = 689 + 312 = 1,001$$\n\n**Step 4: Compute $7(j - k)$**\n$$7(j - k) = 7 \\times 1,001 = 7,007$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Treat $(j - k)$ and $(m + l)$ as single variables $U$ and $V$."
  },
  {
    id: "pt11-m2-q28",
    number: 28,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A model initially estimates that there are $24,000$ bacteria on a petri dish. $14$ days later, the model estimates that there are $96,000$ bacteria on the petri dish. Assuming exponential growth, the formula $N = a(2)^{xt}$ gives the estimated number of bacteria on the petri dish, where $a$ and $x$ are constants and $N$ is the number of bacteria on the petri dish $t$ days after the initial measurement. What is the value of $x$?",
    options: [
      { id: "A", text: "$\\frac{1}{14}$" },
      { id: "B", text: "$\\frac{1}{7}$" },
      { id: "C", text: "$7$" },
      { id: "D", text: "$14$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Determine initial constant $a$**\nAt $t = 0$, $N = 24,000$:\n$$a(2)^0 = 24,000 \\implies a = 24,000$$\n\n**Step 2: Use data point at $t = 14$**\n$$N(14) = 24,000(2)^{14x} = 96,000$$\nDivide by $24,000$:\n$$2^{14x} = \\frac{96,000}{24,000} = 4$$\n\n**Step 3: Solve for $x$**\nSince $4 = 2^2$:\n$$14x = 2 \\implies x = \\frac{2}{14} = \\frac{1}{7}$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Set $24,000(2)^{14x} = 96,000$, so $2^{14x} = 4 = 2^2$."
  },
  {
    id: "pt11-m2-q29",
    number: 29,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "How many liters of a $30\\%$ chlorine solution must be added to $12$ liters of a $10\\%$ chlorine solution to obtain a $15\\%$ chlorine solution?",
    options: [
      { id: "A", text: "$4$" },
      { id: "B", text: "$400$" },
      { id: "C", text: "$0.4$" },
      { id: "D", text: "$40$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Set up the mixture equation**\nLet $x$ be the number of liters of $30\\%$ solution added:\n$$\\text{Pure chlorine} = 0.30x + 0.10(12)$$\n$$\\text{Total volume} = x + 12$$\n$$\\text{Target concentration} = 15\\% = 0.15$$\n\n**Step 2: Form equation and solve**\n$$0.30x + 0.10(12) = 0.15(x + 12)$$\n$$0.30x + 1.2 = 0.15x + 1.8$$\n$$0.15x = 0.6$$\n$$x = \\frac{0.6}{0.15} = 4$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Equate the total pure chlorine: $0.30x + 0.10(12) = 0.15(x + 12)$."
  },
  {
    id: "pt11-m2-q30",
    number: 30,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "In the $xy$-plane, there are three points $A$, $B$, and $C$. Point $A$ has coordinates $(1, 0)$, point $B$ has coordinates $(0, 0)$, and point $C$ has coordinates $(-1, 0)$. Which of the following gives a possible angle measure, in radians, of $\\angle ABC$?",
    options: [
      { id: "A", text: "$\\frac{456\\pi}{6}$" },
      { id: "B", text: "$\\frac{459\\pi}{6}$" },
      { id: "C", text: "$\\frac{462\\pi}{6}$" },
      { id: "D", text: "$\\frac{463\\pi}{6}$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Determine the geometric angle $\\angle ABC$**\nPoint $B$ is the origin $(0, 0)$. Ray $BA$ points along the positive $x$-axis in direction $(1, 0)$. Ray $BC$ points along the negative $x$-axis in direction $(-1, 0)$.\nThe two rays form a straight line, so the angle measure is $\\pi$ radians ($180^\\circ$).\n\n**Step 2: Identify coterminal angles**\nAny coterminal angle must be of the form $\\pi + 2\\pi k = (2k + 1)\\pi$ for an integer $k$ (an odd multiple of $\\pi$).\n\n**Step 3: Test the options**\n- Choice A: $\\frac{456\\pi}{6} = 76\\pi$ (even multiple of $\\pi$).\n- Choice B: $\\frac{459\\pi}{6} = 76.5\\pi$.\n- Choice C: $\\frac{462\\pi}{6} = 77\\pi$ (odd multiple of $\\pi$, coterminal to $\\pi$).\n- Choice D: $\\frac{463\\pi}{6} \\approx 77.17\\pi$.\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Rays from $(0, 0)$ to $(1, 0)$ and $(-1, 0)$ form a straight line of $\\pi$ radians. Look for an odd multiple of $\\pi$."
  },
  {
    id: "pt11-m2-q31",
    number: 31,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "Two datasets, A and B, have $56$ values in total. The average of all $56$ values combined is $193$. Dataset A contains $32$ values with an average of $208$. What is the average of dataset B?",
    options: [
      { id: "A", text: "$173$" },
      { id: "B", text: "$175$" },
      { id: "C", text: "$178$" },
      { id: "D", text: "$181$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Calculate total sum of all values**\n$$\\text{Total Sum} = 56 \\times 193 = 10,808$$\n\n**Step 2: Calculate sum of dataset A**\n$$\\text{Sum}_A = 32 \\times 208 = 6,656$$\n\n**Step 3: Find sum and count of dataset B**\n$$\\text{Count}_B = 56 - 32 = 24$$\n$$\\text{Sum}_B = 10,808 - 6,656 = 4,152$$\n\n**Step 4: Compute average of dataset B**\n$$\\text{Average}_B = \\frac{4,152}{24} = 173$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Subtract the sum of dataset A from the combined total sum, then divide by $24$."
  },
  {
    id: "pt11-m2-q32",
    number: 32,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "Lines $k$ and $l$ are perpendicular. If the points $(4, m)$ and $(9, m + 3)$ lie on line $k$, and line $k$ and line $l$ intersect at $(9, m + 3)$, which of the following points can lie on line $l$?",
    options: [
      { id: "A", text: "$(m - 6, -4)$" },
      { id: "B", text: "$(m + 9, 24)$" },
      { id: "C", text: "$(21, m - 17)$" },
      { id: "D", text: "$(24, m + 12)$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Find slope of line $k$**\n$$m_k = \\frac{(m + 3) - m}{9 - 4} = \\frac{3}{5}$$\n\n**Step 2: Find slope of perpendicular line $l$**\n$$m_l = -\\frac{1}{m_k} = -\\frac{5}{3}$$\n\n**Step 3: Write equation for line $l$**\nLine $l$ passes through $(9, m + 3)$ with slope $-\\frac{5}{3}$:\n$$y - (m + 3) = -\\frac{5}{3}(x - 9)$$\n\n**Step 4: Test point C $(21, m - 17)$**\nSubstitute $x = 21$:\n$$y - (m + 3) = -\\frac{5}{3}(21 - 9) = -\\frac{5}{3}(12) = -20$$\n$$y = m + 3 - 20 = m - 17$$\nThis matches $(21, m - 17)$ exactly.\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Slope of $k$ is $\\frac{3}{5}$, so slope of $l$ is $-\\frac{5}{3}$. Use point-slope form with $(9, m + 3)$."
  },
  {
    id: "pt11-m2-q33",
    number: 33,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "Dataset A consists of $37$ different values that have a minimum of $230$, a maximum of $278$, a mean of $254$, and a standard deviation of $9$. The values $230$ and $278$ are removed from dataset A to create dataset B. Which of the following statements is true?",
    options: [
      { id: "A", text: "Both the mean and standard deviation of dataset B are less than those in dataset A." },
      { id: "B", text: "Both the mean and standard deviation of dataset B are greater than those in dataset A." },
      { id: "C", text: "The standard deviation of dataset B is less than the standard deviation in dataset A, but the mean of both datasets is the same." },
      { id: "D", text: "The standard deviation of dataset B is greater than the standard deviation in dataset A, but the mean of both datasets is the same." }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Effect on mean**\nThe two removed values are $230$ and $278$. Their average is:\n$$\\frac{230 + 278}{2} = \\frac{508}{2} = 254$$\nSince the average of the removed values is exactly equal to the mean of dataset A ($254$), removing them does not change the mean. The mean of dataset B is still $254$.\n\n**Step 2: Effect on standard deviation**\nThe removed values $230$ and $278$ are the minimum and maximum of the dataset, located furthest from the mean ($|230 - 254| = 24$ and $|278 - 254| = 24$, both well beyond the standard deviation of $9$). Removing the most extreme values reduces the spread of the data, so the standard deviation decreases.\n\n**Conclusion:** Choice (C) is correct.",
    hint: "The average of the removed values $\\frac{230+278}{2} = 254$ equals the mean, so the mean is unchanged. Removing extremes decreases standard deviation."
  },
  {
    id: "pt11-m2-q34",
    number: 34,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "If $a > 0$, $x^2 + y^2 = a$, and $xy = a - 10$, what is $(x + y)^2$ in terms of $a$?",
    options: [
      { id: "A", text: "$a - 20$" },
      { id: "B", text: "$2a - 10$" },
      { id: "C", text: "$2a - 20$" },
      { id: "D", text: "$3a - 20$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Expand $(x + y)^2$**\n$$(x + y)^2 = x^2 + 2xy + y^2 = (x^2 + y^2) + 2(xy)$$\n\n**Step 2: Substitute the given expressions**\n$$(x^2 + y^2) + 2(xy) = a + 2(a - 10)$$\n$$= a + 2a - 20 = 3a - 20$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Expand $(x + y)^2 = (x^2 + y^2) + 2xy$ and substitute $a$ and $a - 10$."
  },
  {
    id: "pt11-m2-q35",
    number: 35,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Rectangle A has a width of $50\\text{ feet}$ and a length of $45\\text{ feet}$ and is located inside rectangle B. A uniform border of width $x$ feet separates the sides of rectangle A from rectangle B on all sides. If the area of rectangle B is $2,646\\text{ square feet}$, what is the value of $x$?",
    options: [
      { id: "A", text: "$2$" },
      { id: "B", text: "$1$" },
      { id: "C", text: "$3$" },
      { id: "D", text: "$4$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Set up dimensions of rectangle B**\nThe border extends by $x$ feet on each side, so:\n$$\\text{Width}_B = 50 + 2x$$\n$$\\text{Length}_B = 45 + 2x$$\n\n**Step 2: Write area equation**\n$$(50 + 2x)(45 + 2x) = 2,646$$\n$$2,250 + 100x + 90x + 4x^2 = 2,646$$\n$$4x^2 + 190x - 396 = 0$$\n$$2x^2 + 95x - 198 = 0$$\n\n**Step 3: Solve quadratic equation**\n$$(2x - 4)(x + 49.5) = 0$$\n$$2x - 4 = 0 \\implies x = 2$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "The outer dimensions are $(50 + 2x)$ and $(45 + 2x)$. Set their product equal to $2,646$."
  },
  {
    id: "pt11-m2-q36",
    number: 36,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The function $f$ is defined by $f(x) = 200(b)^x$. When $x$ increases by $1$, $f(x)$ increases by $c\\%$. Which of the following expresses $c$ in terms of $b$?",
    options: [
      { id: "A", text: "$c = \\frac{200b}{100}$" },
      { id: "B", text: "$c = \\frac{2b}{100}$" },
      { id: "C", text: "$c = (b + 1)100$" },
      { id: "D", text: "$c = (b - 1)100$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Find the multiplier when $x$ increases by $1$**\n$$f(x + 1) = 200(b)^{x + 1} = b \\cdot 200(b)^x = b \\cdot f(x)$$\n\n**Step 2: Relate multiplier to percentage increase**\nAn increase of $c\\%$ means multiplying by $\\left(1 + \\frac{c}{100}\\right)$:\n$$b = 1 + \\frac{c}{100}$$\n$$\\frac{c}{100} = b - 1 \\implies c = (b - 1)100$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Growth factor $b = 1 + \\frac{c}{100} \\implies c = 100(b - 1)$."
  },
  {
    id: "pt11-m2-q37",
    number: 37,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "A $34$-pound dog eats two types of canned food: chicken and beef. The recommended amount of chicken food is $1.25$ cans per $16$ pounds a dog weighs per day. The recommended amount of beef food is $0.85$ cans per $23$ pounds a dog weighs per day. If $c$ is the number of cans of chicken food and $b$ is the number of cans of beef food the $34$-pound dog eats in a given day, which equation describes all possible values of $c$ and $b$?",
    options: [
      { id: "A", text: "$\\frac{1.25}{16}c + \\frac{0.85}{23}b = 34$" },
      { id: "B", text: "$\\frac{16}{1.25}c + \\frac{23}{0.85}b = 34$" },
      { id: "C", text: "$\\frac{1.25}{16}b + \\frac{0.85}{23}c = 34$" },
      { id: "D", text: "$\\frac{16}{1.25}b + \\frac{23}{0.85}c = 34$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Find pounds supported per can**\n- For chicken: $1.25$ cans supports $16$ pounds $\\implies 1$ can supports $\\frac{16}{1.25}$ pounds.\n- For beef: $0.85$ cans supports $23$ pounds $\\implies 1$ can supports $\\frac{23}{0.85}$ pounds.\n\n**Step 2: Total weight supported**\nIf the dog consumes $c$ cans of chicken and $b$ cans of beef, the total weight supported is:\n$$\\left(\\frac{16}{1.25}\\right)c + \\left(\\frac{23}{0.85}\\right)b = 34$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Each can of chicken covers $\\frac{16}{1.25}$ pounds; each can of beef covers $\\frac{23}{0.85}$ pounds."
  },
  {
    id: "pt11-m2-q38",
    number: 38,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A quadratic function models the height, in feet, of an object above the ground in terms of time $t$, in seconds, after the object is launched. The model indicates the object was launched from the ground ($0$ feet) and reaches its maximum height of $576$ feet above the ground $12$ seconds after being launched. Based on the model, what is the height, in feet, of the object above the ground $16$ seconds after being launched?",
    options: [
      { id: "A", text: "$384$" },
      { id: "B", text: "$432$" },
      { id: "C", text: "$480$" },
      { id: "D", text: "$512$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Write vertex form of quadratic function**\nThe vertex is at $(12, 576)$:\n$$h(t) = a(t - 12)^2 + 576$$\n\n**Step 2: Find $a$ using launch point $(0, 0)$**\n$$h(0) = a(0 - 12)^2 + 576 = 0$$\n$$144a + 576 = 0 \\implies 144a = -576 \\implies a = -4$$\nSo $h(t) = -4(t - 12)^2 + 576$.\n\n**Step 3: Evaluate at $t = 16$**\n$$h(16) = -4(16 - 12)^2 + 576 = -4(4^2) + 576 = -4(16) + 576 = -64 + 576 = 512$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Use vertex form $h(t) = a(t - 12)^2 + 576$, find $a = -4$ using $h(0) = 0$, then find $h(16)$."
  },
  {
    id: "pt11-m2-q39",
    number: 39,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "A small business owner budgets $\\$3,600$ to purchase timber each year. The owner must purchase a minimum of $345$ slats of timber each year to maintain discounted pricing. If the owner pays $\\$7.25$ to purchase each slat of pine pulpwood and $\\$24.75$ to purchase each slat of pine sawtimber, what is the maximum number of slats of pine sawtimber the owner can purchase to stay within the budget and maintain the discounted pricing?",
    options: [
      { id: "A", text: "$62$" },
      { id: "B", text: "$64$" },
      { id: "C", text: "$66$" },
      { id: "D", text: "$68$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Set up system of inequalities**\nLet $p$ be slats of pulpwood and $s$ be slats of sawtimber:\n$$p + s \\ge 345$$\n$$7.25p + 24.75s \\le 3,600$$\n\n**Step 2: Maximize $s$ by minimizing total slats**\nTo maximize $s$, set $p + s = 345 \\implies p = 345 - s$:\n$$7.25(345 - s) + 24.75s \\le 3,600$$\n$$2,501.25 - 7.25s + 24.75s \\le 3,600$$\n$$2,501.25 + 17.5s \\le 3,600$$\n$$17.5s \\le 3,600 - 2,501.25 = 1,098.75$$\n$$s \\le \\frac{1,098.75}{17.5} \\approx 62.78$$\n\n**Step 3: Greatest integer**\nThe maximum whole number of slats of pine sawtimber is $62$.\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Substitute $p = 345 - s$ into $7.25p + 24.75s \\le 3,600$ to find $s \\le 62.78$."
  },
  {
    id: "pt11-m2-q40",
    number: 40,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A $180$-gram metal alloy is $50\\%$ aluminum by mass. It was created by mixing a metal alloy that is $30\\%$ aluminum with a second metal alloy made up of $60\\%$ aluminum. What is the mass, in grams, of the second metal alloy?",
    options: [
      { id: "A", text: "$120$" },
      { id: "B", text: "$140$" },
      { id: "C", text: "$160$" },
      { id: "D", text: "$180$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Set up mixture equation**\nLet $x$ be the mass of the second alloy ($60\\%$ aluminum). The first alloy ($30\\%$ aluminum) has mass $180 - x$:\n$$0.30(180 - x) + 0.60x = 0.50(180)$$\n\n**Step 2: Solve for $x$**\n$$54 - 0.30x + 0.60x = 90$$\n$$0.30x = 90 - 54 = 36$$\n$$x = \\frac{36}{0.30} = 120$$\n\n**Conclusion:** The mass of the second metal alloy is $120\\text{ grams}$. Choice (A) is correct.",
    hint: "Set $0.30(180 - x) + 0.60x = 0.50(180)$ and solve for $x$."
  },
  {
    id: "pt11-m2-q41",
    number: 41,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "In a right triangle, the hypotenuse is $64$. One acute angle measures $60^\\circ$ and the other acute angle measures $x^\\circ$. What is the value of $\\cos(x^\\circ)$?",
    options: [
      { id: "A", text: "$\\frac{\\sqrt{3}}{2}$" },
      { id: "B", text: "$\\frac{1}{2}$" },
      { id: "C", text: "$\\frac{2\\sqrt{3}}{3}$" },
      { id: "D", text: "$2$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Find angle $x$**\nIn a right triangle, the two acute angles sum to $90^\\circ$:\n$$x^\\circ = 90^\\circ - 60^\\circ = 30^\\circ$$\n\n**Step 2: Evaluate $\\cos(30^\\circ)$**\n$$\\cos(30^\\circ) = \\frac{\\sqrt{3}}{2}$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "The other angle is $90^\\circ - 60^\\circ = 30^\\circ$. Recall $\\cos(30^\\circ) = \\frac{\\sqrt{3}}{2}$."
  },
  {
    id: "pt11-m2-q42",
    number: 42,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "The table shows the distribution of $88$ basketball players and their positions on a basketball club:\n\n| Position | Frequency |\n| :--- | :--- |\n| Point guard | $26$ |\n| Shooting guard | $16$ |\n| Small forward | $11$ |\n| Power forward or center | $35$ |\n\nIf one of the $88$ players is selected at random, the probability of selecting a player who is categorized as a power forward, given that the player is not categorized as a shooting guard, is $\\frac{3}{12}$. How many of these players are categorized as a center?",
    options: [
      { id: "A", text: "$17$" },
      { id: "B", text: "$21$" },
      { id: "C", text: "$24$" },
      { id: "D", text: "$27$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Find number of players not categorized as a shooting guard**\n$$\\text{Non-shooting guards} = 88 - 16 = 72$$\n\n**Step 2: Use given conditional probability to find number of power forwards**\n$$P(\\text{Power forward} \\mid \\text{not Shooting guard}) = \\frac{3}{12} = \\frac{1}{4}$$\n$$\\text{Power forwards} = \\frac{1}{4} \\times 72 = 18$$\n\n**Step 3: Determine number of centers**\nThe combined category \"Power forward or center\" has $35$ players:\n$$\\text{Centers} = 35 - 18 = 17$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Non-shooting guards total $72$. Power forwards $= \\frac{3}{12} \\times 72 = 18$. Subtract from $35$."
  },
  {
    id: "pt11-m2-q43",
    number: 43,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "A quadratic function models the height, in feet, of an object above the ground in terms of time $t$, in seconds, after the object is launched off an elevated surface. The model indicates that at a time of $9$ seconds, the object is $294$ feet above the ground. At a time of $13$ seconds, the object is $310$ feet above the ground. If the object was at a height of $24$ feet when it was launched ($t = 0$), what is the height, in feet, of the object above the ground $18$ seconds after being launched?",
    options: [
      { id: "A", text: "$96$" },
      { id: "B", text: "$192$" },
      { id: "C", text: "$222$" },
      { id: "D", text: "$240$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Set up standard quadratic equation**\nLet $h(t) = at^2 + bt + c$.\nGiven $h(0) = 24$, we have $c = 24$.\n\n**Step 2: Set up equations for $t = 9$ and $t = 13$**\n$$h(9) = a(9^2) + b(9) + 24 = 294 \\implies 81a + 9b = 270 \\implies 9a + b = 30$$\n$$h(13) = a(13^2) + b(13) + 24 = 310 \\implies 169a + 13b = 286 \\implies 13a + b = 22$$\n\n**Step 3: Solve for $a$ and $b$**\nSubtract $(9a + b = 30)$ from $(13a + b = 22)$:\n$$4a = -8 \\implies a = -2$$\n$$b = 30 - 9(-2) = 30 + 18 = 48$$\nSo $h(t) = -2t^2 + 48t + 24$.\n\n**Step 4: Evaluate at $t = 18$**\n$$h(18) = -2(18^2) + 48(18) + 24$$\n$$h(18) = -2(324) + 864 + 24 = -648 + 888 = 240$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Find $h(t) = -2t^2 + 48t + 24$ using the given points $(0, 24)$, $(9, 294)$, and $(13, 310)$."
  },
  {
    id: "pt11-m2-q44",
    number: 44,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "A pyramid has a square base with an area of $324\\text{ square meters}$. What is the surface area, in square meters, of one of the triangular faces if the pyramid has a volume of $4,320\\text{ cubic meters}$?",
    options: [
      { id: "A", text: "$369$" },
      { id: "B", text: "$361$" },
      { id: "C", text: "$321$" },
      { id: "D", text: "$324$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Find dimensions of the square base**\nBase area $B = s^2 = 324 \\implies s = \\sqrt{324} = 18\\text{ m}$.\n\n**Step 2: Find vertical height $h$ from volume**\n$$\\text{Volume} = \\frac{1}{3} B h = \\frac{1}{3}(324)h = 108h$$\n$$108h = 4,320 \\implies h = \\frac{4,320}{108} = 40\\text{ m}$$\n\n**Step 3: Find slant height $l$ of triangular faces**\nThe distance from the center of the base to the midpoint of each side is $\\frac{s}{2} = \\frac{18}{2} = 9\\text{ m}$.\nBy the Pythagorean theorem:\n$$l = \\sqrt{h^2 + \\left(\\frac{s}{2}\\right)^2} = \\sqrt{40^2 + 9^2} = \\sqrt{1600 + 81} = \\sqrt{1681} = 41\\text{ m}$$\n\n**Step 4: Compute area of one triangular face**\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{slant height} = \\frac{1}{2} \\times 18 \\times 41 = 9 \\times 41 = 369\\text{ m}^2$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Base side is $\\sqrt{324} = 18$, height is $\\frac{4320 \\times 3}{324} = 40$. Slant height is $\\sqrt{40^2 + 9^2} = 41$."
  }
];

export function getPracticeTest11Module1(): Question[] {
  return OFFICIAL_PRACTICE_TEST_11_QUESTIONS.filter((q) => q.module === 1);
}

export function getPracticeTest11Module2(): Question[] {
  return OFFICIAL_PRACTICE_TEST_11_QUESTIONS.filter((q) => q.module === 2);
}

export function getPracticeTest11Full(): Question[] {
  return OFFICIAL_PRACTICE_TEST_11_QUESTIONS;
}
