import { Question } from '../types';

/**
 * Official Digital SAT Math Practice Test 9 (BK Practice Test 6)
 * Complete 44-Question Dataset
 * Module 1: Questions 1 – 22 (35 Minutes)
 * Module 2: Questions 23 – 44 (35 Minutes, Adaptive Track)
 */
export const OFFICIAL_PRACTICE_TEST_9_QUESTIONS: Question[] = [
  // ─────────────────────────────────────────────────────────────
  // MODULE 1 (Questions 1 to 22)
  // ─────────────────────────────────────────────────────────────
  {
    id: "pt9-m1-q01",
    number: 1,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "Which expression is equivalent to $(2x^2 + x - 9) + (x^2 + 6x + 1)$?",
    options: [
      { id: "A", text: "$2x^2 + 7x + 10$" },
      { id: "B", text: "$2x^2 + 6x - 8$" },
      { id: "C", text: "$3x^2 + 7x - 10$" },
      { id: "D", text: "$3x^2 + 7x - 8$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Combine like terms**\n$$(2x^2 + x^2) + (x + 6x) + (-9 + 1)$$\n\n**Step 2: Simplify coefficients**\n$$= 3x^2 + 7x - 8$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Combine the $x^2$ terms, the $x$ terms, and the constants."
  },
  {
    id: "pt9-m1-q02",
    number: 2,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "John paid a total of $\\$165$ for a microscope by making a down payment of $\\$37$ plus $p$ monthly payments of $\\$16$ each. Which of the following equations represents this situation?",
    options: [
      { id: "A", text: "$16p - 37 = 165$" },
      { id: "B", text: "$37p - 16 = 165$" },
      { id: "C", text: "$16p + 37 = 165$" },
      { id: "D", text: "$37p + 16 = 165$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Identify fixed and recurring costs**\nThe down payment is a fixed one-time payment of $\\$37$. Each of the $p$ monthly payments is $\\$16$, totaling $16p$.\n\n**Step 2: Set equal to total cost**\n$$16p + 37 = 165$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "The monthly payments total $16p$. Add the initial down payment of $37$ to get $165$."
  },
  {
    id: "pt9-m1-q03",
    number: 3,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "The given equation relates the positive numbers $m, n,$ and $p$:\n$$7m = 2(n + p)$$\nWhich equation correctly gives $m$ in terms of $n$ and $p$?",
    options: [
      { id: "A", text: "$m = \\frac{2(n + p)}{7}$" },
      { id: "B", text: "$m = 2(n + p)$" },
      { id: "C", text: "$m = 2(n + p) - 7$" },
      { id: "D", text: "$m = 2 - n - p - 7$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Isolate $m$**\nDivide both sides of the equation by $7$:\n$$m = \\frac{2(n + p)}{7}$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Divide both sides by $7$."
  },
  {
    id: "pt9-m1-q04",
    number: 4,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "The function $g$ is defined by $g(x) = \\sqrt{8x + 1}$. What is the value of $g(3)$?",
    options: [
      { id: "A", text: "$\\frac{5}{8}$" },
      { id: "B", text: "$\\frac{25}{8}$" },
      { id: "C", text: "$5$" },
      { id: "D", text: "$25$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Substitute $x = 3$**\n$$g(3) = \\sqrt{8(3) + 1} = \\sqrt{24 + 1} = \\sqrt{25} = 5$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Substitute $3$ in place of $x$ and take the principal square root."
  },
  {
    id: "pt9-m1-q05",
    number: 5,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "The table gives the distribution of votes for a new school mascot and grade level for $80$ students:\n\n| Mascot | Sixth | Seventh | Eighth | Total |\n| :--- | :--- | :--- | :--- | :--- |\n| Badger | 4 | 9 | 9 | 22 |\n| Lion | 9 | 2 | 9 | 20 |\n| Longhorn | 4 | 6 | 4 | 14 |\n| Tiger | 6 | 9 | 9 | 24 |\n| Total | 23 | 26 | 31 | 80 |\n\nIf one of these students is selected at random, what is the probability of selecting a student whose vote for new mascot was for a lion?",
    options: [
      { id: "A", text: "$\\frac{1}{9}$" },
      { id: "B", text: "$\\frac{1}{5}$" },
      { id: "C", text: "$\\frac{1}{4}$" },
      { id: "D", text: "$\\frac{2}{3}$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Find total lion votes**\nFrom the table, $20$ total students voted for Lion.\n\n**Step 2: Divide by overall total**\n$$P(\\text{Lion}) = \\frac{20}{80} = \\frac{1}{4}$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Divide the total row count for Lion ($20$) by the total number of students ($80$)."
  },
  {
    id: "pt9-m1-q06",
    number: 6,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Medium",
    type: "student_produced",
    prompt: "A student council group is selling school posters for a fundraiser. They use the function $p(x) = 5x - 220$ to determine their profit $p(x)$, in dollars, for selling $x$ school posters. In order to earn a profit of $\\$900$, how many school posters must they sell?",
    correctAnswer: "224",
    explanation: "**Step 1: Set profit function equal to 900**\n$$5x - 220 = 900$$\n\n**Step 2: Solve for $x$**\n$$5x = 1120 \\implies x = \\frac{1120}{5} = 224$$\n\n**Conclusion:** They must sell $224$ posters.",
    hint: "Set $5x - 220 = 900$ and solve for $x$."
  },
  {
    id: "pt9-m1-q07",
    number: 7,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "In a scatterplot, a negative linear relationship is observed with points near $(0, 10), (1, 8.2), (2, 6.3), (3, 4.4), (4, 2.5), (5, 0.6)$. Which of the following equations is the most appropriate linear model for the data shown in the scatterplot?",
    options: [
      { id: "A", text: "$y = -1.9x - 10.1$" },
      { id: "B", text: "$y = -1.9x + 10.1$" },
      { id: "C", text: "$y = 1.9x - 10.1$" },
      { id: "D", text: "$y = 1.9x + 10.1$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Analyze slope and intercept**\nThe line falls from left to right, indicating a negative slope ($m \\approx -1.9$).\nThe vertical intercept occurs near $y = 10.1$.\n\n**Step 2: Select matching model**\n$$y = -1.9x + 10.1$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "The line goes downward (negative slope) and starts around $10$ on the vertical axis."
  },
  {
    id: "pt9-m1-q08",
    number: 8,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Medium",
    type: "student_produced",
    prompt: "The solution to the given system of equations is $(x, y)$:\n$$3x + 6 = 4y$$\n$$3x + 4 = 2y$$\nWhat is the value of $y$?",
    correctAnswer: "1",
    explanation: "**Step 1: Subtract the second equation from the first**\n$$(3x + 6) - (3x + 4) = 4y - 2y$$\n$$2 = 2y \\implies y = 1$$\n\n**Conclusion:** The value of $y$ is $1$.",
    hint: "Subtract the second equation from the first to eliminate $3x$."
  },
  {
    id: "pt9-m1-q09",
    number: 9,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Easy",
    type: "student_produced",
    prompt: "A frequency table summarizes $57$ data values in a data set: value 6 (freq 3), value 7 (freq 3), value 8 (freq 8), value 9 (freq 8), value 10 (freq 9), value 11 (freq 11), value 12 (freq 9), value 13 (freq 0), value 14 (freq 6). What is the maximum data value in the data set?",
    correctAnswer: "14",
    explanation: "**Step 1: Identify the largest value with non-zero frequency**\nThe values in the table range from $6$ to $14$. The value $14$ has a frequency of $6$.\nTherefore, the maximum data value in the data set is $14$.",
    hint: "Look at the 'Data value' column for the largest number that actually occurs."
  },
  {
    id: "pt9-m1-q10",
    number: 10,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Circle $K$ has a radius of $4\\text{ millimeters (mm)}$. Circle $L$ has an area of $100\\pi\\text{ mm}^2$. What is the total area, in $\\text{mm}^2$, of circles $K$ and $L$?",
    options: [
      { id: "A", text: "$14\\pi$" },
      { id: "B", text: "$28\\pi$" },
      { id: "C", text: "$56\\pi$" },
      { id: "D", text: "$116\\pi$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Find the area of circle $K$**\n$$A_K = \\pi r^2 = \\pi (4^2) = 16\\pi\\text{ mm}^2$$\n\n**Step 2: Add the area of circle $L$**\n$$A_{\\text{total}} = 16\\pi + 100\\pi = 116\\pi\\text{ mm}^2$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Use $A = \\pi r^2$ for Circle $K$, then add $100\\pi$."
  },
  {
    id: "pt9-m1-q11",
    number: 11,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "If $9(4 - 3x) + 2 = 8(4 - 3x) + 18$, what is the value of $4 - 3x$?",
    options: [
      { id: "A", text: "$-16$" },
      { id: "B", text: "$-4$" },
      { id: "C", text: "$4$" },
      { id: "D", text: "$16$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Treat $u = 4 - 3x$ as a single variable**\n$$9u + 2 = 8u + 18$$\n\n**Step 2: Solve for $u$**\n$$9u - 8u = 18 - 2 \\implies u = 16$$\n\n**Conclusion:** The value of $4 - 3x$ is $16$. Choice (D) is correct.",
    hint: "Let $u = 4 - 3x$ and solve $9u + 2 = 8u + 18$."
  },
  {
    id: "pt9-m1-q12",
    number: 12,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Triangle $FGH$ is similar to triangle $JKL$, where angle $F$ corresponds to angle $J$ and angles $G$ and $K$ are right angles. If $\\sin(F) = \\frac{308}{317}$, what is the value of $\\sin(J)$?",
    options: [
      { id: "A", text: "$\\frac{75}{317}$" },
      { id: "B", text: "$\\frac{308}{317}$" },
      { id: "C", text: "$\\frac{317}{308}$" },
      { id: "D", text: "$\\frac{317}{75}$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Properties of similar triangles**\nCorresponding angles in similar triangles are congruent: $\\angle F \\cong \\angle J$.\n\n**Step 2: Trigonometric ratio invariance**\n$$\\sin(J) = \\sin(F) = \\frac{308}{317}$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Similar triangles have equal trigonometric ratios for corresponding angles."
  },
  {
    id: "pt9-m1-q13",
    number: 13,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A wire with a length of $106\\text{ inches}$ is cut into two parts. One part has a length of $x\\text{ inches}$, and the other part has a length of $y\\text{ inches}$. The value of $x$ is $6$ more than $4$ times the value of $y$. What is the value of $x$?",
    options: [
      { id: "A", text: "$25$" },
      { id: "B", text: "$28$" },
      { id: "C", text: "$56$" },
      { id: "D", text: "$86$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Set up the system of equations**\n$$x + y = 106$$\n$$x = 4y + 6$$\n\n**Step 2: Substitute $x$ into the first equation**\n$$(4y + 6) + y = 106 \\implies 5y + 6 = 106 \\implies 5y = 100 \\implies y = 20$$\n\n**Step 3: Solve for $x$**\n$$x = 4(20) + 6 = 86$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Substitute $x = 4y + 6$ into $x + y = 106$."
  },
  {
    id: "pt9-m1-q14",
    number: 14,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "A certain township consists of a $5$-hectare industrial park and a $24$-hectare neighborhood. The total number of trees in the township is $4,529$. The equation $5x + 24y = 4,529$ represents this situation. Which of the following is the best interpretation of $x$ in this context?",
    options: [
      { id: "A", text: "The average number of trees per hectare in the industrial park" },
      { id: "B", text: "The average number of trees per hectare in the neighborhood" },
      { id: "C", text: "The total number of trees in the industrial park" },
      { id: "D", text: "The total number of trees in the neighborhood" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Analyze units**\nThe industrial park has an area of $5\\text{ hectares}$. Since $5x$ contributes to the total tree count, $x$ must have units of $\\frac{\\text{trees}}{\\text{hectare}}$ in the industrial park.\n\n**Conclusion:** Choice (A) is correct.",
    hint: "$5$ is the number of hectares in the industrial park, so $x$ is the rate of trees per hectare."
  },
  {
    id: "pt9-m1-q15",
    number: 15,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Which expression is equivalent to $a^{\\frac{11}{12}}$, where $a > 0$?",
    options: [
      { id: "A", text: "$\\sqrt[12]{a^{132}}$" },
      { id: "B", text: "$\\sqrt[144]{a^{132}}$" },
      { id: "C", text: "$\\sqrt[121]{a^{132}}$" },
      { id: "D", text: "$\\sqrt[11]{a^{132}}$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Convert radical to fractional exponent**\n$$\\sqrt[144]{a^{132}} = a^{\\frac{132}{144}}$$\n\n**Step 2: Simplify the fraction**\n$$\\frac{132}{144} = \\frac{132 \\div 12}{144 \\div 12} = \\frac{11}{12}$$\n\n**Conclusion:** Choice (B) is equivalent to $a^{\\frac{11}{12}}$.",
    hint: "Rewrite $\\sqrt[144]{a^{132}}$ as $a^{132/144}$ and simplify the fraction."
  },
  {
    id: "pt9-m1-q16",
    number: 16,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "student_produced",
    prompt: "The function $f$ is defined by $f(x) = (x - 6)(x - 2)(x + 6)$. In the $xy$-plane, the graph of $y = g(x)$ is the result of translating the graph of $y = f(x)$ up $4$ units. What is the value of $g(0)$?",
    correctAnswer: "76",
    explanation: "**Step 1: Evaluate $f(0)$**\n$$f(0) = (0 - 6)(0 - 2)(0 + 6) = (-6)(-2)(6) = 12 \\times 6 = 72$$\n\n**Step 2: Apply vertical translation**\n$$g(x) = f(x) + 4 \\implies g(0) = 72 + 4 = 76$$\n\n**Conclusion:** The value of $g(0)$ is $76$.",
    hint: "Find $f(0)$ by multiplying $(-6)(-2)(6)$, then add $4$."
  },
  {
    id: "pt9-m1-q17",
    number: 17,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Hard",
    type: "student_produced",
    prompt: "The solution to the given system of equations is $(x, y)$:\n$$y = 4x + 1$$\n$$4y = 15x - 8$$\nWhat is the value of $x - y$?",
    correctAnswer: "35",
    explanation: "**Step 1: Substitute $y$ into the second equation**\n$$4(4x + 1) = 15x - 8$$\n$$16x + 4 = 15x - 8 \\implies x = -12$$\n\n**Step 2: Solve for $y$**\n$$y = 4(-12) + 1 = -48 + 1 = -47$$\n\n**Step 3: Calculate $x - y$**\n$$x - y = -12 - (-47) = -12 + 47 = 35$$\n\n**Conclusion:** The value of $x - y$ is $35$.",
    hint: "Substitute $y = 4x + 1$ into $4y = 15x - 8$ to find $x = -12$ and $y = -47$."
  },
  {
    id: "pt9-m1-q18",
    number: 18,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The function $f$ models the number of coupons a company sent to their customers at the end of each year:\n$$f(t) = 8,000(0.65)^t$$\nwhere $t$ represents the number of years since the end of 1998, and $0 \\le t \\le 5$. Which of the following is the best interpretation of the $y$-intercept of the graph of $y = f(t)$ in this context?",
    options: [
      { id: "A", text: "The minimum estimated number of coupons the company sent to their customers during the 5 years was 1,428." },
      { id: "B", text: "The minimum estimated number of coupons the company sent to their customers during the 5 years was 8,000." },
      { id: "C", text: "The estimated number of coupons the company sent to their customers at the end of 1998 was 1,428." },
      { id: "D", text: "The estimated number of coupons the company sent to their customers at the end of 1998 was 8,000." }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Find the $y$-intercept**\nAt $t = 0$ (the end of 1998), $f(0) = 8,000(0.65)^0 = 8,000$.\n\n**Conclusion:** Choice (D) correctly identifies the initial coupon count at the end of 1998 as $8,000$.",
    hint: "The $y$-intercept occurs at $t = 0$, which corresponds to the base year 1998."
  },
  {
    id: "pt9-m1-q19",
    number: 19,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A landscaper uses a hose that puts $88x\\text{ ounces}$ of water in a bucket in $5y\\text{ minutes}$. Which expression represents the number of ounces of water the hose puts in the bucket in $9y\\text{ minutes}$ at this rate?",
    options: [
      { id: "A", text: "$\\frac{9x}{440}$" },
      { id: "B", text: "$\\frac{440x}{9}$" },
      { id: "C", text: "$\\frac{5x}{792}$" },
      { id: "D", text: "$\\frac{792x}{5}$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Find water delivery rate per minute**\n$$\\text{Rate} = \\frac{88x}{5y}\\text{ oz/min}$$\n\n**Step 2: Multiply by $9y\\text{ minutes}$**\n$$\\text{Total} = \\left(\\frac{88x}{5y}\\right) \\times 9y = \\frac{88 \\times 9 \\times x}{5} = \\frac{792x}{5}$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Divide $88x$ by $5y$ to find the rate per minute, then multiply by $9y$."
  },
  {
    id: "pt9-m1-q20",
    number: 20,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "student_produced",
    prompt: "What is the smallest solution to the given equation?\n$$\\sqrt{(x - 2)^2} = \\sqrt{3x + 34}$$",
    correctAnswer: "-3",
    explanation: "**Step 1: Square both sides**\n$$(x - 2)^2 = 3x + 34$$\n$$x^2 - 4x + 4 = 3x + 34$$\n$$x^2 - 7x - 30 = 0$$\n$$(x - 10)(x + 3) = 0 \\implies x = 10 \\text{ or } x = -3$$\n\n**Step 2: Check for extraneous solutions**\n- For $x = -3$: $\\sqrt{(-3 - 2)^2} = \\sqrt{25} = 5$, and $\\sqrt{3(-3) + 34} = \\sqrt{25} = 5$ (Valid!)\n- For $x = 10$: $\\sqrt{(10 - 2)^2} = 8$, and $\\sqrt{3(10) + 34} = \\sqrt{64} = 8$ (Valid!)\n\n**Step 3: Smallest solution**\nThe smallest solution is $-3$.",
    hint: "Expand $(x - 2)^2 = 3x + 34$ and factor the resulting quadratic."
  },
  {
    id: "pt9-m1-q21",
    number: 21,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "Triangle $XYZ$ is similar to triangle $RST$ such that $X, Y,$ and $Z$ correspond to $R, S,$ and $T$, respectively. The measure of $\\angle Z$ is $20^\\circ$ and $2XY = RS$. What is the measure of $\\angle T$?",
    options: [
      { id: "A", text: "$2^\\circ$" },
      { id: "B", text: "$10^\\circ$" },
      { id: "C", text: "$20^\\circ$" },
      { id: "D", text: "$40^\\circ$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Properties of similar triangles**\nWhile side lengths scale, corresponding angle measures remain identical.\nSince $Z$ corresponds to $T$:\n$$\\angle T = \\angle Z = 20^\\circ$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Angle measures do NOT change when triangles are scaled."
  },
  {
    id: "pt9-m1-q22",
    number: 22,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "The function $f$ is defined by $f(x) = 9(4)^x$. If $g(x) = f(x + 2)$, which of the following equations defines the function $g$?",
    options: [
      { id: "A", text: "$g(x) = 18(4)^x$" },
      { id: "B", text: "$g(x) = 144(4)^x$" },
      { id: "C", text: "$g(x) = 18(8)^x$" },
      { id: "D", text: "$g(x) = 81(16)^x$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Substitute $x + 2$ into $f$**\n$$g(x) = 9(4)^{x + 2} = 9(4^x \\cdot 4^2) = 9 \\cdot 16 \\cdot (4)^x = 144(4)^x$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Use exponent rules: $4^{x+2} = 4^x \\cdot 4^2 = 16 \\cdot 4^x$."
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 2 (Questions 23 to 44)
  // ─────────────────────────────────────────────────────────────
  {
    id: "pt9-m2-q23",
    number: 23,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Easy",
    type: "student_produced",
    prompt: "What is the median of the data set shown?\n$$73, 74, 75, 77, 79, 82, 84, 85, 91$$",
    correctAnswer: "79",
    explanation: "**Step 1: Find the middle value**\nThere are $9$ values in ascending order. The median is the $\\frac{9 + 1}{2} = 5$th value.\nThe 5th value is $79$.",
    hint: "Count to the middle (5th) value in the ordered list."
  },
  {
    id: "pt9-m2-q24",
    number: 24,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "Right triangles $LMN$ and $PQR$ are similar, where $L$ and $M$ correspond to $P$ and $Q$, respectively. Angle $M$ has a measure of $53^\\circ$. What is the measure of angle $Q$?",
    options: [
      { id: "A", text: "$37^\\circ$" },
      { id: "B", text: "$53^\\circ$" },
      { id: "C", text: "$127^\\circ$" },
      { id: "D", text: "$143^\\circ$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Corresponding angles in similar triangles**\nSince $\\triangle LMN \\sim \\triangle PQR$ and $M$ corresponds to $Q$:\n$$\\angle Q = \\angle M = 53^\\circ$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Corresponding angles of similar triangles are equal."
  },
  {
    id: "pt9-m2-q25",
    number: 25,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "The table shows three values of $x$ and their corresponding values of $y$ for the equation $y = 4(2)^x + 3$:\n\n| $x$ | $y$ |\n| :--- | :--- |\n| 1 | 11 |\n| 2 | 19 |\n| 3 | $a$ |\n\nIn the table, $a$ is a constant. What is the value of $a$?",
    options: [
      { id: "A", text: "$67$" },
      { id: "B", text: "$35$" },
      { id: "C", text: "$32$" },
      { id: "D", text: "$27$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Evaluate at $x = 3$**\n$$y = 4(2^3) + 3 = 4(8) + 3 = 32 + 3 = 35$$\n\n**Conclusion:** $a = 35$, corresponding to Choice (B).",
    hint: "Substitute $x = 3$ into $y = 4(2^x) + 3$."
  },
  {
    id: "pt9-m2-q26",
    number: 26,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "How many solutions does the given equation have?\n$$66x = 66x$$",
    options: [
      { id: "A", text: "Exactly one" },
      { id: "B", text: "Exactly two" },
      { id: "C", text: "Infinitely many" },
      { id: "D", text: "Zero" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Analyze identity**\nSubtracting $66x$ from both sides yields $0 = 0$, which is true for all real values of $x$.\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Any number times $66$ equals itself times $66$."
  },
  {
    id: "pt9-m2-q27",
    number: 27,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "A model predicts that the population of Bergen was $15,000$ in 2005. The model also predicts that each year for the next $5$ years, the population $p$ increased by $4\\%$ of the previous year's population. Which equation best represents this model, where $x$ is the number of years after 2005, for $x \\le 5$?",
    options: [
      { id: "A", text: "$p = 0.96(15,000)^x$" },
      { id: "B", text: "$p = 1.04(15,000)^x$" },
      { id: "C", text: "$p = 15,000(0.96)^x$" },
      { id: "D", text: "$p = 15,000(1.04)^x$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Set up exponential growth**\nInitial value $a = 15,000$. Growth rate $r = 0.04$, so base $= 1 + 0.04 = 1.04$.\n$$p = 15,000(1.04)^x$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "A $4\\%$ increase corresponds to multiplying by $1.04$ each year."
  },
  {
    id: "pt9-m2-q28",
    number: 28,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The function $h$ is defined by $h(x) = 4x + 28$. The graph of $y = h(x)$ in the $xy$-plane has an $x$-intercept at $(a, 0)$ and a $y$-intercept at $(0, b)$, where $a$ and $b$ are constants. What is the value of $a + b$?",
    options: [
      { id: "A", text: "$21$" },
      { id: "B", text: "$28$" },
      { id: "C", text: "$32$" },
      { id: "D", text: "$35$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Find $x$-intercept**\n$$4a + 28 = 0 \\implies 4a = -28 \\implies a = -7$$\n\n**Step 2: Find $y$-intercept**\n$$b = h(0) = 4(0) + 28 = 28$$\n\n**Step 3: Calculate $a + b$**\n$$a + b = -7 + 28 = 21$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Set $h(x) = 0$ to find $a = -7$, and evaluate $h(0)$ to find $b = 28$."
  },
  {
    id: "pt9-m2-q29",
    number: 29,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Which expression is equivalent to $\\frac{8x(x - 7) - 3(x - 7)}{2x - 14}$, where $x > 7$?",
    options: [
      { id: "A", text: "$\\frac{x - 7}{5}$" },
      { id: "B", text: "$\\frac{8x - 3}{2}$" },
      { id: "C", text: "$\\frac{8x^2 - 3x - 14}{2x - 14}$" },
      { id: "D", text: "$\\frac{8x^2 - 3x - 77}{2x - 14}$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Factor the numerator**\n$$8x(x - 7) - 3(x - 7) = (8x - 3)(x - 7)$$\n\n**Step 2: Factor the denominator**\n$$2x - 14 = 2(x - 7)$$\n\n**Step 3: Cancel $(x - 7)$**\n$$\\frac{(8x - 3)(x - 7)}{2(x - 7)} = \\frac{8x - 3}{2}$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Factor out $(x - 7)$ in the numerator and $2$ in the denominator."
  },
  {
    id: "pt9-m2-q30",
    number: 30,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Circle A has a radius of $3n$ and circle B has a radius of $129n$, where $n$ is a positive constant. The area of circle B is how many times the area of circle A?",
    options: [
      { id: "A", text: "$43$" },
      { id: "B", text: "$86$" },
      { id: "C", text: "$129$" },
      { id: "D", text: "$1,849$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Find the linear ratio**\n$$\\frac{r_B}{r_A} = \\frac{129n}{3n} = 43$$\n\n**Step 2: Square the linear ratio for area**\n$$\\frac{\\text{Area}_B}{\\text{Area}_A} = (43)^2 = 1,849$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "The area ratio is the square of the radius ratio: $(129/3)^2 = 43^2$."
  },
  {
    id: "pt9-m2-q31",
    number: 31,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "student_produced",
    prompt: "A circle has center $O$, and points $R$ and $S$ lie on the circle. In triangle $ORS$, the measure of $\\angle ROS$ is $88^\\circ$. What is the measure of $\\angle RSO$, in degrees? (Disregard the degree symbol when entering your answer.)",
    correctAnswer: "46",
    explanation: "**Step 1: Triangle $ORS$ is isosceles**\nBoth $OR$ and $OS$ are radii of the circle, so $OR = OS$. Thus, the base angles are equal: $\\angle RSO = \\angle SRO$.\n\n**Step 2: Solve for base angle**\n$$180^\\circ - 88^\\circ = 92^\\circ$$\n$$\\angle RSO = \\frac{92^\\circ}{2} = 46^\\circ$$\n\n**Conclusion:** The measure of $\\angle RSO$ is $46^\\circ$.",
    hint: "Because $OR$ and $OS$ are radii, the triangle is isosceles. Base angles are $(180 - 88)/2$."
  },
  {
    id: "pt9-m2-q32",
    number: 32,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A business owner plans to purchase the same model of chair for each of the $81$ employees. The total budget to spend on these chairs is $\\$14,000$, which includes a $7\\%$ sales tax. Which of the following is closest to the maximum possible price per chair, before sales tax, the business owner could pay based on this budget?",
    options: [
      { id: "A", text: "$\\$148.15$" },
      { id: "B", text: "$\\$161.53$" },
      { id: "C", text: "$\\$172.84$" },
      { id: "D", text: "$\\$184.94$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Remove the 7% sales tax**\n$$\\text{Pre-tax budget} = \\frac{14,000}{1.07} \\approx \\$13,084.11$$\n\n**Step 2: Divide by 81 chairs**\n$$\\text{Price per chair} = \\frac{13,084.11}{81} \\approx \\$161.53$$\n\n**Conclusion:** Choice (B) is closest.",
    hint: "Divide $14,000$ by $1.07$ first, then divide by $81$."
  },
  {
    id: "pt9-m2-q33",
    number: 33,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Hard",
    type: "student_produced",
    prompt: "A right triangle has legs with lengths of $24\\text{ centimeters}$ and $21\\text{ centimeters}$. If the length of this triangle's hypotenuse, in centimeters, can be written in the form $3\\sqrt{d}$, where $d$ is an integer, what is the value of $d$?",
    correctAnswer: "113",
    explanation: "**Step 1: Apply Pythagorean theorem**\n$$c = \\sqrt{24^2 + 21^2} = \\sqrt{576 + 441} = \\sqrt{1017}$$\n\n**Step 2: Simplify radical**\n$$\\sqrt{1017} = \\sqrt{9 \\times 113} = 3\\sqrt{113}$$\n\n**Step 3: Identify $d$**\n$$d = 113$$",
    hint: "Calculate $\\sqrt{24^2 + 21^2} = \\sqrt{1017}$ and factor out $9$."
  },
  {
    id: "pt9-m2-q34",
    number: 34,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "The positive number $a$ is $230\\%$ of the number $b$, and $a$ is $60\\%$ of the number $c$. If $c$ is $p\\%$ of $b$, which of the following is closest to the value of $p$?",
    options: [
      { id: "A", text: "$138$" },
      { id: "B", text: "$217$" },
      { id: "C", text: "$283$" },
      { id: "D", text: "$383$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Set up equations**\n$$a = 2.30b$$\n$$a = 0.60c$$\n\n**Step 2: Relate $c$ to $b$**\n$$0.60c = 2.30b \\implies c = \\frac{2.30}{0.60}b = \\frac{23}{6}b \\approx 3.8333b$$\n\n**Step 3: Convert to percentage**\n$$p\\% = 383.33\\% \\implies p \\approx 383$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Equate $0.60c = 2.30b$, so $c = (2.30/0.60)b$."
  },
  {
    id: "pt9-m2-q35",
    number: 35,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "For $x > 0$, the function $f$ is defined as follows: $f(x)$ equals $201\\%$ of $x$. Which of the following could describe this function?",
    options: [
      { id: "A", text: "Decreasing exponential" },
      { id: "B", text: "Decreasing linear" },
      { id: "C", text: "Increasing exponential" },
      { id: "D", text: "Increasing linear" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Write equation**\n$$f(x) = 2.01x$$\n\n**Step 2: Identify function type**\nThis is of the form $f(x) = mx$ with constant slope $m = 2.01 > 0$, representing an **increasing linear** function.\n\n**Conclusion:** Choice (D) is correct.",
    hint: "$f(x) = 2.01x$ has a constant positive rate of change."
  },
  {
    id: "pt9-m2-q36",
    number: 36,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Hard",
    type: "student_produced",
    prompt: "A line in the $xy$-plane passes through the points $(k, 13)$ and $(k + 7, -15)$. The $y$-intercept of the line is $(k - 5, b)$, where $k$ and $b$ are constants. What is the value of $b$?",
    correctAnswer: "33",
    explanation: "**Step 1: Calculate slope of the line**\n$$m = \\frac{-15 - 13}{(k + 7) - k} = \\frac{-28}{7} = -4$$\n\n**Step 2: Use point-slope form with $(k, 13)$**\n$$y - 13 = -4(x - k)$$\n\n**Step 3: Evaluate at $x = k - 5$**\n$$b - 13 = -4((k - 5) - k) = -4(-5) = 20$$\n$$b = 13 + 20 = 33$$\n\n**Conclusion:** The value of $b$ is $33$.",
    hint: "Find slope $m = -28/7 = -4$. Then from $x = k$ to $x = k - 5$, $x$ decreases by $5$, so $y$ increases by $(-4)(-5) = 20$."
  },
  {
    id: "pt9-m2-q37",
    number: 37,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "Keenan made $32\\text{ cups}$ of vegetable broth. Keenan then filled $x$ small jars and $y$ large jars with all the vegetable broth he made. The equation $3x + 5y = 32$ represents this situation. Which is the best interpretation of $5y$ in this context?",
    options: [
      { id: "A", text: "The number of large jars Keenan filled" },
      { id: "B", text: "The number of small jars Keenan filled" },
      { id: "C", text: "The total number of cups of vegetable broth in the large jars" },
      { id: "D", text: "The total number of cups of vegetable broth in the small jars" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Interpret terms**\n$y$ is the number of large jars, and each large jar holds $5\\text{ cups}$. Therefore, $5y$ represents the total number of cups of vegetable broth in all the large jars combined.\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Each large jar holds $5$ cups, so $5y$ is the total volume in all $y$ large jars."
  },
  {
    id: "pt9-m2-q38",
    number: 38,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "One of the two equations in a system of linear equations is given: $3x = 36y - 45$. The system has no solution. Which equation could be the second equation in this system?",
    options: [
      { id: "A", text: "$x = 4y$" },
      { id: "B", text: "$\\frac{1}{3}x = 4y$" },
      { id: "C", text: "$x = 12y - 15$" },
      { id: "D", text: "$\\frac{1}{3}x = 12y - 15$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Simplify given equation**\nDivide by $3$:\n$$x = 12y - 15 \\implies x - 12y = -15$$\n\n**Step 2: Look for parallel line with different constant**\nFor choice B: $\\frac{1}{3}x = 4y \\implies x = 12y \\implies x - 12y = 0$.\nSince $x - 12y$ cannot simultaneously equal $0$ and $-15$, this system has **no solution**.\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Divide the given equation by $3$ to get $x = 12y - 15$. Choice B gives $x = 12y$ with no solution."
  },
  {
    id: "pt9-m2-q39",
    number: 39,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Which of the following are solutions to the given equation, where $a$ is a constant and $a > 30$?\n$$x - 29 = (x - a)(x - 29)$$\nI. $a$\nII. $a + 1$\nIII. $29$",
    options: [
      { id: "A", text: "I and II only" },
      { id: "B", text: "I and III only" },
      { id: "C", text: "II and III only" },
      { id: "D", text: "I, II, and III" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Move all terms to one side**\n$$(x - a)(x - 29) - (x - 29) = 0$$\n\n**Step 2: Factor out $(x - 29)$**\n$$(x - 29)[(x - a) - 1] = 0$$\n$$(x - 29)(x - a - 1) = 0$$\n\n**Step 3: Find roots**\n$$x = 29 \\quad \\text{or} \\quad x = a + 1$$\n\nThus, statements II and III are solutions.\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Factor out $(x - 29)$ to get $(x - 29)(x - a - 1) = 0$."
  },
  {
    id: "pt9-m2-q40",
    number: 40,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "One gallon of stain will cover $170\\text{ square feet}$ of a surface. A yard has a total fence area of $w\\text{ square feet}$. Which equation represents the total amount of stain $S$, in gallons, needed to stain the fence in this yard twice?",
    options: [
      { id: "A", text: "$S = \\frac{w}{170}$" },
      { id: "B", text: "$S = 170w$" },
      { id: "C", text: "$S = 340w$" },
      { id: "D", text: "$S = \\frac{w}{85}$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Calculate total area to stain**\nStaining $w\\text{ sq ft}$ twice means covering $2w\\text{ sq ft}$.\n\n**Step 2: Divide by coverage per gallon**\n$$S = \\frac{2w}{170} = \\frac{w}{85}$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Total coverage needed is $2w$. Divide by $170$ to get $2w/170 = w/85$."
  },
  {
    id: "pt9-m2-q41",
    number: 41,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "In the $xy$-plane, the graph of the equation $y = -x^2 + 9x - 100$ intersects the horizontal line $y = c$ at exactly one point. What is the value of $c$?",
    options: [
      { id: "A", text: "$-\\frac{481}{4}$" },
      { id: "B", text: "$-100$" },
      { id: "C", text: "$-\\frac{319}{4}$" },
      { id: "D", text: "$-\\frac{9}{2}$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Intersecting at one point means the vertex**\nA horizontal line intersects a parabola at exactly one point at its vertex.\n$$x_v = -\\frac{b}{2a} = -\\frac{9}{2(-1)} = \\frac{9}{2}$$\n\n**Step 2: Evaluate $y$ at $x_v$**\n$$c = -\\left(\\frac{9}{2}\\right)^2 + 9\\left(\\frac{9}{2}\\right) - 100 = -\\frac{81}{4} + \\frac{162}{4} - \\frac{400}{4} = \\frac{81 - 400}{4} = -\\frac{319}{4}$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Find the maximum $y$-value at $x = 9/2$."
  },
  {
    id: "pt9-m2-q42",
    number: 22,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "student_produced",
    prompt: "The quadratic function $g$ models the depth, in meters, below the surface of the water of a seal $t\\text{ minutes}$ after the seal entered the water during a dive. The function estimates that the seal reached its maximum depth of $302.4\\text{ meters}$ $6\\text{ minutes}$ after it entered the water and then returned to the surface of the water $12\\text{ minutes}$ after entering. Based on the function, what was the estimated depth, to the nearest meter, of the seal $10\\text{ minutes}$ after it entered the water?",
    correctAnswer: "168",
    explanation: "**Step 1: Write vertex form equation**\n$$g(t) = a(t - 6)^2 + 302.4$$\n\n**Step 2: Use $g(12) = 0$ to find $a$**\n$$a(12 - 6)^2 + 302.4 = 0 \\implies 36a = -302.4 \\implies a = -8.4$$\n\n**Step 3: Calculate depth at $t = 10\\text{ minutes}$**\n$$g(10) = -8.4(10 - 6)^2 + 302.4 = -8.4(16) + 302.4 = -134.4 + 302.4 = 168\\text{ meters}$$\n\n**Conclusion:** The depth was $168$ meters.",
    hint: "Set up $g(t) = a(t - 6)^2 + 302.4$, solve $36a + 302.4 = 0$ for $a = -8.4$, then evaluate at $t = 10$."
  },
  {
    id: "pt9-m2-q43",
    number: 43,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "The area of a rectangular region is increasing at a rate of $250\\text{ square feet per hour}$. Which of the following is closest to this rate in square meters per minute? (Use $1\\text{ meter} = 3.28\\text{ feet}$.)",
    options: [
      { id: "A", text: "$0.39$" },
      { id: "B", text: "$1.27$" },
      { id: "C", text: "$13.67$" },
      { id: "D", text: "$23.24$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Convert square feet to square meters**\n$$1\\text{ m}^2 = (3.28\\text{ ft})^2 = 10.7584\\text{ ft}^2$$\n$$250\\text{ ft}^2 = \\frac{250}{10.7584} \\approx 23.2376\\text{ m}^2$$\n\n**Step 2: Convert hours to minutes**\n$$\\text{Rate per minute} = \\frac{23.2376}{60} \\approx 0.3873\\text{ m}^2/\\text{min} \\approx 0.39$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Divide $250$ by $(3.28)^2 \\times 60$."
  },
  {
    id: "pt9-m2-q44",
    number: 44,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "In the given pair of equations, $a$ and $b$ are constants:\n$$5x + 7y = 1$$\n$$ax + by = 1$$\nThe graph of this pair of equations in the $xy$-plane is a pair of perpendicular lines. Which of the following pairs of equations also represents a pair of perpendicular lines?",
    options: [
      { id: "A", text: "$10x + 7y = 1$ and $ax - 2by = 1$" },
      { id: "B", text: "$10x + 7y = 1$ and $ax + 2by = 1$" },
      { id: "C", text: "$10x + 7y = 1$ and $2ax + by = 1$" },
      { id: "D", text: "$5x - 7y = 1$ and $ax + by = 1$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Perpendicular condition**\nThe slopes are $m_1 = -\\frac{5}{7}$ and $m_2 = -\\frac{a}{b}$. For perpendicular lines:\n$$m_1 m_2 = -1 \\implies \\left(-\\frac{5}{7}\\right)\\left(-\\frac{a}{b}\\right) = -1 \\implies \\frac{5a}{7b} = -1$$\n\n**Step 2: Test choice A**\nFirst line: slope $M_1 = -\\frac{10}{7}$.\nSecond line: slope $M_2 = -\\frac{a}{-2b} = \\frac{a}{2b}$.\nProduct of slopes:\n$$M_1 M_2 = \\left(-\\frac{10}{7}\\right)\\left(\\frac{a}{2b}\\right) = -\\frac{10a}{14b} = -\\frac{5a}{7b} = -(-1) = 1 \\neq -1$$\nWait! Let's check perpendicularity: $M_1 M_2 = -1$.\nSince $\\frac{5a}{7b} = -1$, $-\\frac{5a}{7b} = 1$.\nWait! In Choice A: $ax - 2by = 1 \\implies 2by = ax - 1 \\implies y = \\frac{a}{2b}x - \\frac{1}{2b}$, slope is $\\frac{a}{2b}$.\nProduct $= (-\\frac{10}{7})(\\frac{a}{2b}) = -\\frac{5a}{7b} = -(-1) = 1$. Not $-1$.\nWhat about Choice B? $ax + 2by = 1 \\implies$ slope is $-\\frac{a}{2b}$.\nProduct $= (-\\frac{10}{7})(-\\frac{a}{2b}) = \\frac{5a}{7b} = -1$! Exactly $-1$!\nTherefore, Choice (B) is perpendicular!\nLet's verify: $M_1 M_2 = (-\\frac{10}{7})(-\\frac{a}{2b}) = \\frac{5a}{7b} = -1$.\n\n**Conclusion:** Choice (B) is the pair of perpendicular lines.",
    hint: "Calculate the product of the slopes using the given condition $5a/(7b) = -1$."
  }
];

export function getPracticeTest9Module1(): Question[] {
  return OFFICIAL_PRACTICE_TEST_9_QUESTIONS.filter((q) => q.module === 1);
}

export function getPracticeTest9Module2(): Question[] {
  return OFFICIAL_PRACTICE_TEST_9_QUESTIONS.filter((q) => q.module === 2);
}

export function getPracticeTest9Full(): Question[] {
  return OFFICIAL_PRACTICE_TEST_9_QUESTIONS;
}
