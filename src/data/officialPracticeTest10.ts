import { Question } from '../types';

/**
 * Official Digital SAT Math Practice Test 10 (Mock Turbo 1)
 * Complete 44-Question Dataset
 * Module 1: Questions 1 – 22 (35 Minutes)
 * Module 2: Questions 23 – 44 (35 Minutes, Adaptive Track)
 */
export const OFFICIAL_PRACTICE_TEST_10_QUESTIONS: Question[] = [
  // ─────────────────────────────────────────────────────────────
  // MODULE 1 (Questions 1 to 22)
  // ─────────────────────────────────────────────────────────────
  {
    id: "pt10-m1-q01",
    number: 1,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "The graph of two linear equations is shown in the $xy$-plane. The lines intersect at the point $(x, y) = (-4, 2)$. What is the value of $y$?",
    options: [
      { id: "A", text: "$-4$" },
      { id: "B", text: "$-1$" },
      { id: "C", text: "$2$" },
      { id: "D", text: "$5$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Read the intersection point**\nThe solution to a system of linear equations is the intersection point of their graphs.\nThe intersection is at $(-4, 2)$, so $x = -4$ and $y = 2$.\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Identify the $y$-coordinate of the intersection point."
  },
  {
    id: "pt10-m1-q02",
    number: 2,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "The function $f$ is defined by $f(x) = 45x + 30$. What is the value of $f(x)$ when $x = 2$?",
    options: [
      { id: "A", text: "$77$" },
      { id: "B", text: "$90$" },
      { id: "C", text: "$120$" },
      { id: "D", text: "$150$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Substitute $x = 2$ into $f(x)$**\n$$f(2) = 45(2) + 30 = 90 + 30 = 120$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Evaluate $45(2) + 30$."
  },
  {
    id: "pt10-m1-q03",
    number: 3,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "In the $xy$-plane, the graph of $y = f(x)$ is a line that passes through $(0, 28)$ and has a slope of $5$. Which equation defines $f$?",
    options: [
      { id: "A", text: "$f(x) = 28x$" },
      { id: "B", text: "$f(x) = 28x + 5$" },
      { id: "C", text: "$f(x) = 5x$" },
      { id: "D", text: "$f(x) = 5x + 28$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Use slope-intercept form $y = mx + b$**\nGiven slope $m = 5$ and $y$-intercept $(0, 28)$ where $b = 28$:\n$$f(x) = 5x + 28$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Use $f(x) = mx + b$ with $m = 5$ and $b = 28$."
  },
  {
    id: "pt10-m1-q04",
    number: 4,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "The table shows three values of $x$ and their corresponding values of $y$:\n\n| $x$ | $y$ |\n| :--- | :--- |\n| 0 | 23 |\n| 1 | 24 |\n| 2 | 25 |\n\nThere is a linear relationship between $x$ and $y$. Which of the following equations represents this relationship?",
    options: [
      { id: "A", text: "$y = 23x$" },
      { id: "B", text: "$y = 25x + 2$" },
      { id: "C", text: "$y = 25x$" },
      { id: "D", text: "$y = x + 23$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Determine slope and intercept**\n- At $x = 0$, $y = 23$, so $y$-intercept $b = 23$.\n- Slope $m = \\frac{24 - 23}{1 - 0} = 1$.\n- Equation: $y = 1x + 23 = x + 23$.\n\n**Conclusion:** Choice (D) is correct.",
    hint: "The $y$-value starts at $23$ and increases by $1$ each time $x$ increases by $1$."
  },
  {
    id: "pt10-m1-q05",
    number: 5,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "An object was launched upward from a platform. The graph models the height above ground, $y$, in meters, of the object $x$ seconds after launch. The vertex of the parabola is at $(2, 45)$. For which of the following intervals of time was the height of the object increasing for the entire interval?",
    options: [
      { id: "A", text: "From $x = 0$ to $x = 2$" },
      { id: "B", text: "From $x = 0$ to $x = 4$" },
      { id: "C", text: "From $x = 2$ to $x = 3$" },
      { id: "D", text: "From $x = 3$ to $x = 4$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Identify interval of increase**\nThe parabolic trajectory reaches its peak at $x = 2$. Prior to the peak ($0 \\le x \\le 2$), the object is rising, so the height is increasing for the entire interval from $x = 0$ to $x = 2$.\n\n**Conclusion:** Choice (A) is correct.",
    hint: "The object rises until it reaches the peak at $x = 2$."
  },
  {
    id: "pt10-m1-q06",
    number: 6,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The relationship between variables $x$ and $y$ is defined by an exponential equation. When $x = 0$, $y = 40$, and for every increase in the value of $x$ by $1$, the corresponding value of $y$ increases by $20\\%$ of its previous value. Which equation represents this relationship?",
    options: [
      { id: "A", text: "$y = 40(1.20)^x$" },
      { id: "B", text: "$y = 40(1.02)^x$" },
      { id: "C", text: "$y = 20(1.40)^x$" },
      { id: "D", text: "$y = 20(1.04)^x$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Formulate exponential model**\nInitial value $a = 40$. Growth factor $b = 1 + 0.20 = 1.20$.\n$$y = 40(1.20)^x$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "A $20\\%$ increase means multiplying by $1.20$ for each unit step in $x$."
  },
  {
    id: "pt10-m1-q07",
    number: 7,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "The table shows the amount of time it took a participant in a study to complete each of 5 tasks: Task A (5 min), Task B (4 min), Task C (11 min), Task D (10 min), Task E (10 min). What was the mean time, in minutes, for this participant to complete a task?",
    options: [
      { id: "A", text: "$7$" },
      { id: "B", text: "$8$" },
      { id: "C", text: "$10$" },
      { id: "D", text: "$11$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Calculate the mean**\n$$\\text{Mean} = \\frac{5 + 4 + 11 + 10 + 10}{5} = \\frac{40}{5} = 8\\text{ minutes}$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Sum all $5$ values ($40$) and divide by $5$."
  },
  {
    id: "pt10-m1-q08",
    number: 8,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "The function $h$ is defined by $h(x) = 7|x|$. What is the value of $h(-5)$?",
    options: [
      { id: "A", text: "$-35$" },
      { id: "B", text: "$2$" },
      { id: "C", text: "$12$" },
      { id: "D", text: "$35$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Evaluate absolute value**\n$$|-5| = 5$$\n$$h(-5) = 7(5) = 35$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "The absolute value of $-5$ is $+5$."
  },
  {
    id: "pt10-m1-q09",
    number: 9,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The table shows the exponential relationship between the number of years, $x$, since Isela started training, and the estimated height $h(x)$, in meters, of her best pole vault: $(0, 1.46), (2, 2.32), (4, 3.68)$. Which of the following functions best represents this relationship, where $x \\le 4$?",
    options: [
      { id: "A", text: "$h(x) = 1.26(0.46)^x$" },
      { id: "B", text: "$h(x) = 1.26(1.46)^x$" },
      { id: "C", text: "$h(x) = 1.46(0.26)^x$" },
      { id: "D", text: "$h(x) = 1.46(1.26)^x$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Check initial value**\nAt $x = 0$, $h(0) = 1.46$. Only choices C and D have initial coefficient $1.46$.\n\n**Step 2: Check growth factor**\nFor $x = 2$:\n$$1.46(1.26)^2 = 1.46(1.5876) \\approx 2.32$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Check $h(0) = 1.46$ and verify that $1.46(1.26)^2 \\approx 2.32$."
  },
  {
    id: "pt10-m1-q10",
    number: 10,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A scatterplot shows the relationship between two variables, $x$ and $y$, along with a line of best fit. The line passes approximately through $(0, 11)$ and $(10, 4.1)$. Which of the following is closest to the slope of the line of best fit?",
    options: [
      { id: "A", text: "$10.95$" },
      { id: "B", text: "$0.69$" },
      { id: "C", text: "$-0.69$" },
      { id: "D", text: "$-10.95$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Calculate slope**\n$$m \\approx \\frac{4.1 - 11}{10 - 0} = \\frac{-6.9}{10} = -0.69$$\n\n**Conclusion:** Choice (C) is closest.",
    hint: "The line slants downward, so the slope must be negative: approximately $-0.69$."
  },
  {
    id: "pt10-m1-q11",
    number: 11,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "In the figure, line $q$ is parallel to line $r$, and both lines are intersected by line $s$. The interior alternate angle is $59^\\circ$, and angle $y^\\circ = 59^\\circ$. If $y = 2x + 9$, what is the value of $x$?",
    options: [
      { id: "A", text: "$25$" },
      { id: "B", text: "$34$" },
      { id: "C", text: "$56$" },
      { id: "D", text: "$66$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Set up equation from alternate interior angles**\nSince lines are parallel, $y = 59$.\n$$2x + 9 = 59 \\implies 2x = 50 \\implies x = 25$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Equate $2x + 9 = 59$ and solve for $x$."
  },
  {
    id: "pt10-m1-q12",
    number: 12,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Line $t$ in the $xy$-plane has a slope of $-\\frac{1}{2}$ and passes through the point $(8, 3)$. Which equation defines line $t$?",
    options: [
      { id: "A", text: "$y = 7x - \\frac{1}{2}$" },
      { id: "B", text: "$y = 8x + 3$" },
      { id: "C", text: "$y = -\\frac{x}{2} + 3$" },
      { id: "D", text: "$y = -\\frac{x}{2} + 7$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Use point-slope form**\n$$y - 3 = -\\frac{1}{2}(x - 8)$$\n$$y - 3 = -\\frac{x}{2} + 4 \\implies y = -\\frac{x}{2} + 7$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Use $y - y_1 = m(x - x_1)$ with $m = -1/2$ and $(x_1, y_1) = (8, 3)$."
  },
  {
    id: "pt10-m1-q13",
    number: 13,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "Given the equation $(x - 20)(x - 12)(x + 5)(x + 17) = 0$, what is one positive solution to the equation?",
    options: [
      { id: "A", text: "$20$" },
      { id: "B", text: "$15$" },
      { id: "C", text: "$18$" },
      { id: "D", text: "$30$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Find roots**\nSetting each factor to zero gives $x = 20, 12, -5, -17$.\nThe positive solutions are $20$ and $12$. Among the options, $20$ is listed.\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Set $x - 20 = 0$ to get $x = 20$."
  },
  {
    id: "pt10-m1-q14",
    number: 14,
    section: "math",
    module: 1,
    domain: "Geometry & Trigonometry",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "A right circular cone has a height of $12\\text{ centimeters (cm)}$ and a base with a radius of $4\\text{ cm}$. What is the volume, in $\\text{cm}^3$, of this cone?",
    options: [
      { id: "A", text: "$16\\pi$" },
      { id: "B", text: "$48\\pi$" },
      { id: "C", text: "$64\\pi$" },
      { id: "D", text: "$192\\pi$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Apply cone volume formula**\n$$V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi (4^2)(12) = \\frac{1}{3}\\pi (16)(12) = 64\\pi\\text{ cm}^3$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Use $V = \\frac{1}{3}\\pi r^2 h$ with $r = 4$ and $h = 12$."
  },
  {
    id: "pt10-m1-q15",
    number: 15,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "A linear model estimates the population of a city from 1992 to 2016. The model estimates the population was $51\\text{ thousand}$ in 1992, $225\\text{ thousand}$ in 2012, and $x\\text{ thousand}$ in 2016. To the nearest whole number, what is the value of $x$?",
    options: [
      { id: "A", text: "$258$" },
      { id: "B", text: "$259$" },
      { id: "C", text: "$260$" },
      { id: "D", text: "$261$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Find rate of population growth per year**\n$$\\text{Rate} = \\frac{225 - 51}{2012 - 1992} = \\frac{174}{20} = 8.7\\text{ thousand/year}$$\n\n**Step 2: Project to 2016 (4 years after 2012)**\n$$x = 225 + 8.7(4) = 225 + 34.8 = 259.8$$\nRounding to the nearest whole number gives $260$.\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Find the slope ($8.7\\text{k/yr}$) and add $4 \\times 8.7$ to $225$."
  },
  {
    id: "pt10-m1-q16",
    number: 16,
    section: "math",
    module: 1,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The equation $y = 500(3)^{2x}$ gives the estimated number of online newsletter subscribers at the end of every six-month period, $x$, starting from the end of January 1992, where $0 \\le x \\le 4$. Which statement is the best interpretation of the $y$-intercept of the graph in the $xy$-plane?",
    options: [
      { id: "A", text: "The estimated number of online newsletter subscribers at the end of the first six-month period was 500." },
      { id: "B", text: "The estimated number of online newsletter subscribers at the end of January 1992 was 500." },
      { id: "C", text: "The estimated number of online newsletter subscribers at the end of January 1993 was 1,500." },
      { id: "D", text: "The estimated number of online newsletter subscribers at the end of January 1992 was 1,500." }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Evaluate $y$-intercept**\nAt $x = 0$ (the end of January 1992):\n$$y = 500(3)^0 = 500$$\n\n**Conclusion:** Choice (B) is the correct interpretation.",
    hint: "The $y$-intercept occurs at $x = 0$, which corresponds to January 1992."
  },
  {
    id: "pt10-m1-q17",
    number: 17,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "The solution to the given system of equations is $(x, y)$:\n$$\\frac{x}{3} + 8(y - 16) = 27$$\n$$\\frac{x}{5} - 8(y - 16) = 45$$\nWhat is the value of $8x$?",
    options: [
      { id: "A", text: "$960$" },
      { id: "B", text: "$1,080$" },
      { id: "C", text: "$1,020$" },
      { id: "D", text: "$980$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Add the two equations**\nThe terms $+8(y - 16)$ and $-8(y - 16)$ cancel:\n$$\\frac{x}{3} + \\frac{x}{5} = 27 + 45 = 72$$\n$$\\frac{5x + 3x}{15} = 72 \\implies \\frac{8x}{15} = 72$$\n\n**Step 2: Solve directly for $8x$**\n$$8x = 72 \\times 15 = 1,080$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Add both equations to eliminate the $y$-term: $\\frac{8x}{15} = 72$."
  },
  {
    id: "pt10-m1-q18",
    number: 18,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "When several resistors are connected in series, the total resistance is the sum of their individual resistances. A circuit consists of $6$ resistors connected in series with positive resistances and total resistance $80\\text{ ohms}$. The total resistance of $2$ of these resistors is $60\\text{ ohms}$. Which inequality best represents all possible values of the resistance $x$, in ohms, of one of the other $4$ resistors?",
    options: [
      { id: "A", text: "$0 < x < 5$" },
      { id: "B", text: "$0 < x < 20$" },
      { id: "C", text: "$20 < x < 60$" },
      { id: "D", text: "$20 < x < 80$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Calculate remaining resistance**\nThe remaining $4$ resistors sum to $80 - 60 = 20\\text{ ohms}$.\n\n**Step 2: Determine bounds for one resistor**\nSince each resistor has a positive resistance ($> 0$), any single resistor $x$ must be greater than $0$, and because the other three resistors have positive resistance, $x$ must be strictly less than the total remainder of $20\\text{ ohms}$:\n$$0 < x < 20$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "The four resistors sum to $20$ ohms. Since all are positive, each must be between $0$ and $20$."
  },
  {
    id: "pt10-m1-q19",
    number: 19,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "Jasmin grows bean pods in her garden. This year, she harvested $490$ bean pods and saved $10\\%$ of them to plant next year. How many of the harvested bean pods did Jasmin save to plant next year?",
    options: [
      { id: "A", text: "$39$" },
      { id: "B", text: "$49$" },
      { id: "C", text: "$57$" },
      { id: "D", text: "$59$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Calculate percentage**\n$$490 \\times 0.10 = 49$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Find $10\\%$ of $490$."
  },
  {
    id: "pt10-m1-q20",
    number: 20,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "A family has money in an account for renting movies online. The function $f(m) = 24 - 6m$ gives the amount of money, in dollars, in the account after the family has rented $m$ movies. Which of the following represents the amount of money, in dollars, withdrawn from the account each time the family rents a movie?",
    options: [
      { id: "A", text: "$6m$" },
      { id: "B", text: "$6$" },
      { id: "C", text: "$24$" },
      { id: "D", text: "$24 - 6m$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Identify slope magnitude**\nThe rate of change is $-\\$6$ per movie rented, meaning $\\$6$ is withdrawn per movie.\n\n**Conclusion:** Choice (B) is correct.",
    hint: "The coefficient of $m$ is $-6$, representing a $\\$6$ cost per movie."
  },
  {
    id: "pt10-m1-q21",
    number: 21,
    section: "math",
    module: 1,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "If $9 - 6(3 - 4x) = 6 - 7(3 - 4x)$, what is the value of $3 - 4x$?",
    options: [
      { id: "A", text: "$-3$" },
      { id: "B", text: "$3$" },
      { id: "C", text: "$-6$" },
      { id: "D", text: "$6$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Substitute $u = 3 - 4x$**\n$$9 - 6u = 6 - 7u$$\n$$-6u + 7u = 6 - 9 \\implies u = -3$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Let $u = 3 - 4x$ and solve $9 - 6u = 6 - 7u$."
  },
  {
    id: "pt10-m1-q22",
    number: 22,
    section: "math",
    module: 1,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "On a plot of land, $52.0\\%$ of the square footage is farmland and the remaining square footage is pasture. There are buildings on exactly $21.5\\%$ of the square footage of the farmland, and there are buildings on exactly $14.0\\%$ of the square footage of the pasture. If there are buildings on exactly $p\\%$ of the square footage of the plot of land, what is the value of $p$?",
    options: [
      { id: "A", text: "$17.6$" },
      { id: "B", text: "$17.8$" },
      { id: "C", text: "$17.9$" },
      { id: "D", text: "$21.6$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Calculate weighted percentage**\n- Farmland: $52\\%$ of land, with $21.5\\%$ covered by buildings: $0.520 \\times 0.215 = 0.1118 = 11.18\\%$.\n- Pasture: $100\\% - 52\\% = 48\\%$ of land, with $14.0\\%$ covered by buildings: $0.480 \\times 0.140 = 0.0672 = 6.72\\%$.\n\n**Step 2: Total building coverage**\n$$p = 11.18 + 6.72 = 17.9$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Compute $0.52 \\times 21.5 + 0.48 \\times 14.0$."
  },

  // ─────────────────────────────────────────────────────────────
  // MODULE 2 (Questions 23 to 44)
  // ─────────────────────────────────────────────────────────────
  {
    id: "pt10-m2-q23",
    number: 23,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "Levi and Marissa each have stamp collections. The number of stamps in Levi's collection is $200\\%$ of the number of stamps in Marissa's collection. If there are $196$ stamps in Marissa's collection, how many stamps are in Levi's collection?",
    options: [
      { id: "A", text: "$98$" },
      { id: "B", text: "$196$" },
      { id: "C", text: "$392$" },
      { id: "D", text: "$588$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Calculate 200% of 196**\n$$2.00 \\times 196 = 392$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Multiply $196$ by $2$."
  },
  {
    id: "pt10-m2-q24",
    number: 24,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The graph of a linear equation and a quadratic is shown in the $xy$-plane. The parabola opens downward with vertex at $(0, 9)$ and passes through $(0, 9)$, where the horizontal line also intersects it. Which of the following is an intersection solution $(x, y)$ to the system?",
    options: [
      { id: "A", text: "$(-1, 5)$" },
      { id: "B", text: "$(0, 0)$" },
      { id: "C", text: "$(0, 9)$" },
      { id: "D", text: "$(1, 5)$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Identify intersection point**\nLooking at the graph, the line intersects the vertex of the parabola at $(0, 9)$.\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Find where the two curves touch at $(0, 9)$."
  },
  {
    id: "pt10-m2-q25",
    number: 25,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "An object moves at a speed of $\\frac{3}{52}\\text{ feet per second}$. What is this speed, in yards per second? ($3\\text{ feet} = 1\\text{ yard}$)",
    options: [
      { id: "A", text: "$\\frac{1}{52}$" },
      { id: "B", text: "$\\frac{9}{52}$" },
      { id: "C", text: "$6$" },
      { id: "D", text: "$52$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Convert feet to yards**\n$$\\frac{3}{52}\\text{ ft/s} \\times \\frac{1\\text{ yd}}{3\\text{ ft}} = \\frac{1}{52}\\text{ yd/s}$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Divide by $3$ since $3$ feet equals $1$ yard."
  },
  {
    id: "pt10-m2-q26",
    number: 26,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "Which expression is equivalent to $158t^3 - 36t^2u$?",
    options: [
      { id: "A", text: "$2t(79t^2 - 18u)$" },
      { id: "B", text: "$2t^2(79t - 18u)$" },
      { id: "C", text: "$2tu(79t^2 - 18)$" },
      { id: "D", text: "$2t^2u(79t - 18)$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Factor out greatest common factor**\nThe GCF of $158t^3$ and $36t^2u$ is $2t^2$:\n$$2t^2(79t - 18u)$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Factor out $2t^2$ from both terms."
  },
  {
    id: "pt10-m2-q27",
    number: 27,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Circle $K$ has a radius of $11\\text{ millimeters (mm)}$. Circle $L$ has an area of $144\\pi\\text{ mm}^2$. What is the total area, in $\\text{mm}^2$, of circles $K$ and $L$?",
    options: [
      { id: "A", text: "$23\\pi$" },
      { id: "B", text: "$46\\pi$" },
      { id: "C", text: "$92\\pi$" },
      { id: "D", text: "$265\\pi$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Find area of Circle K**\n$$A_K = \\pi (11^2) = 121\\pi\\text{ mm}^2$$\n\n**Step 2: Add area of Circle L**\n$$A_{\\text{total}} = 121\\pi + 144\\pi = 265\\pi\\text{ mm}^2$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Calculate $\\pi(11^2) = 121\\pi$ and add $144\\pi$."
  },
  {
    id: "pt10-m2-q28",
    number: 28,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "Which expression is equivalent to $2\\left(x - \\frac{7}{2}\\right)(x + 6)$?",
    options: [
      { id: "A", text: "$x^2 + 5x - 21$" },
      { id: "B", text: "$2x^2 - x - 21$" },
      { id: "C", text: "$2x^2 + 5x - 42$" },
      { id: "D", text: "$2x^2 - 42$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Distribute 2 into the first factor**\n$$2\\left(x - \\frac{7}{2}\\right) = (2x - 7)$$\n\n**Step 2: Expand $(2x - 7)(x + 6)$**\n$$= 2x^2 + 12x - 7x - 42 = 2x^2 + 5x - 42$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Multiply $2$ by $(x - 7/2)$ first to get $(2x - 7)$, then FOIL with $(x + 6)$."
  },
  {
    id: "pt10-m2-q29",
    number: 29,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "The function $f$ is defined by $f(x) = (-6)(4)^x + 35$. What is the $y$-intercept of the graph of $y = f(x)$ in the $xy$-plane?",
    options: [
      { id: "A", text: "$(0, 29)$" },
      { id: "B", text: "$(0, 4)$" },
      { id: "C", text: "$(0, 35)$" },
      { id: "D", text: "$(0, -6)$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Evaluate at $x = 0$**\n$$f(0) = -6(4^0) + 35 = -6(1) + 35 = 29$$\n\n**Conclusion:** The $y$-intercept is $(0, 29)$. Choice (A) is correct.",
    hint: "Substitute $x = 0$ to get $-6(1) + 35 = 29$."
  },
  {
    id: "pt10-m2-q30",
    number: 30,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Easy",
    type: "multiple_choice",
    prompt: "If $4x + 7 = 15$, what is the value of $8x - 3$?",
    options: [
      { id: "A", text: "$13$" },
      { id: "B", text: "$15$" },
      { id: "C", text: "$18$" },
      { id: "D", text: "$21$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Solve for $4x$**\n$$4x = 15 - 7 = 8$$\n\n**Step 2: Find $8x$**\n$$8x = 2(4x) = 2(8) = 16$$\n\n**Step 3: Evaluate $8x - 3$**\n$$16 - 3 = 13$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "Double $4x = 8$ to get $8x = 16$, then subtract $3$."
  },
  {
    id: "pt10-m2-q31",
    number: 31,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "Given the system of inequalities in the $xy$-plane:\n$$y < 24 - 8x$$\n$$\\frac{y}{8} > 9$$\nWhich inequality represents all $x$-values for all solutions $(x, y)$ that satisfy the system?",
    options: [
      { id: "A", text: "$x > 3$" },
      { id: "B", text: "$x < 3$" },
      { id: "C", text: "$x > -6$" },
      { id: "D", text: "$x < -6$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Simplify the second inequality**\n$$\\frac{y}{8} > 9 \\implies y > 72$$\n\n**Step 2: Combine with the first inequality**\n$$72 < y < 24 - 8x$$\n$$72 < 24 - 8x$$\n$$8x < 24 - 72 = -48 \\implies x < -6$$\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Substitute $y > 72$ into $y < 24 - 8x$ to solve $72 < 24 - 8x$."
  },
  {
    id: "pt10-m2-q32",
    number: 32,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "In the $xy$-plane, an equation of circle A is $(x - 4)^2 + (y - 2)^2 = 9$. Circle B has the same center as circle A but has a radius that is twice the radius of circle A. Which equation represents circle B?",
    options: [
      { id: "A", text: "$(x - 4)^2 + (y - 2)^2 = 18$" },
      { id: "B", text: "$(x - 4)^2 + (y - 2)^2 = 36$" },
      { id: "C", text: "$(x - 4)^2 + (y - 2)^2 = 54$" },
      { id: "D", text: "$(x - 4)^2 + (y - 2)^2 = 81$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Determine radius of circle A**\n$$r_A = \\sqrt{9} = 3$$\n\n**Step 2: Determine radius of circle B**\n$$r_B = 2(3) = 6$$\n\n**Step 3: Write equation**\n$$(x - 4)^2 + (y - 2)^2 = 6^2 = 36$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "The radius doubles from $3$ to $6$, so $r^2 = 36$."
  },
  {
    id: "pt10-m2-q33",
    number: 33,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "A park designer wants to find the length $x$, in feet, across a pond. In the figure, segments $PR$ and $ST$ intersect at $Q$, and $\\angle PTQ \\cong \\angle RSQ$. The lengths $PQ, TQ, QS,$ and $RS$ are $6,300\\text{ ft}, 10,800\\text{ ft}, 1,200\\text{ ft},$ and $1,800\\text{ ft}$, respectively. What is the value of $x$ (the length of $PT$)?",
    options: [
      { id: "A", text: "$9,600$" },
      { id: "B", text: "$11,200$" },
      { id: "C", text: "$16,200$" },
      { id: "D", text: "$10,800$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Establish triangle similarity**\n$\\angle PQT \\cong \\angle RQS$ (vertical angles) and $\\angle PTQ \\cong \\angle RSQ$ (given).\nBy AA similarity, $\\triangle PTQ \\sim \\triangle RSQ$.\n\n**Step 2: Set up proportion**\n$$\\frac{PT}{RS} = \\frac{TQ}{SQ}$$\n$$\\frac{x}{1,800} = \\frac{10,800}{1,200} = 9$$\n$$x = 9 \\times 1,800 = 16,200\\text{ feet}$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "The triangles are similar with scale factor $10,800 / 1,200 = 9$. Multiply $1,800$ by $9$."
  },
  {
    id: "pt10-m2-q34",
    number: 34,
    section: "math",
    module: 2,
    domain: "Geometry & Trigonometry",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "In triangle $XYZ$, the measure of angle $X$ is $53^\\circ$. The length of $XY$ is $24\\text{ units}$ and the length of $XZ$ is $18\\text{ units}$. What is the area, in square units, of triangle $XYZ$?",
    options: [
      { id: "A", text: "$432\\sin(53^\\circ)$" },
      { id: "B", text: "$216\\sin(53^\\circ)$" },
      { id: "C", text: "$456$" },
      { id: "D", text: "$288$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Apply sine area formula**\n$$\\text{Area} = \\frac{1}{2}ab\\sin(C) = \\frac{1}{2}(24)(18)\\sin(53^\\circ) = 216\\sin(53^\\circ)$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Use $\\text{Area} = \\frac{1}{2} b c \\sin(A)$."
  },
  {
    id: "pt10-m2-q35",
    number: 35,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "In the given system of equations, $a$ is a positive integer constant:\n$$y = -1.5$$\n$$y = x^2 + 4x + a$$\nThe system has no real solutions. What is the least possible value of $a$?",
    options: [
      { id: "A", text: "$1$" },
      { id: "B", text: "$2$" },
      { id: "C", text: "$3$" },
      { id: "D", text: "$4$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Set equations equal**\n$$x^2 + 4x + a = -1.5 \\implies x^2 + 4x + (a + 1.5) = 0$$\n\n**Step 2: Apply negative discriminant condition**\n$$\\Delta = 4^2 - 4(1)(a + 1.5) = 16 - 4a - 6 = 10 - 4a < 0$$\n$$4a > 10 \\implies a > 2.5$$\n\n**Step 3: Least positive integer**\nThe least integer greater than $2.5$ is $3$.\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Set discriminant $16 - 4(a + 1.5) < 0$, giving $a > 2.5$."
  },
  {
    id: "pt10-m2-q36",
    number: 36,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A partially filled container containing $26\\text{ milliliters}$ of water is placed under a leaky faucet that produces one $0.08$-milliliter drop of water every $8\\text{ seconds}$. Until the container is full, which of the following represents the volume $v$, in milliliters, of water in the container $t$ seconds after placement, where $t$ is a multiple of $8$?",
    options: [
      { id: "A", text: "$v = 0.01t + 26$" },
      { id: "B", text: "$v = 0.08t + 26$" },
      { id: "C", text: "$v = 0.64t + 26$" },
      { id: "D", text: "$v = 8t$" }
    ],
    correctAnswer: "A",
    explanation: "**Step 1: Find rate per second**\n$$\\text{Rate} = \\frac{0.08\\text{ mL}}{8\\text{ s}} = 0.01\\text{ mL/s}$$\n\n**Step 2: Add initial volume**\n$$v = 0.01t + 26$$\n\n**Conclusion:** Choice (A) is correct.",
    hint: "$0.08$ mL every $8$ seconds equals $0.01$ mL per second."
  },
  {
    id: "pt10-m2-q37",
    number: 37,
    section: "math",
    module: 2,
    domain: "Problem-Solving & Data Analysis",
    difficulty: "Medium",
    type: "multiple_choice",
    prompt: "A research manager selected 2 random samples of ovens to estimate preheat time. Based on the first sample, the estimated preheat time was $14.3\\text{ minutes}$ with a margin of error of $1\\text{ minute}$. Based on the second sample, the estimated time was $14.5\\text{ minutes}$ with a margin of error of $2.1\\text{ minutes}$. Assuming the margins of error were calculated the same way, which of the following best explains why the first sample obtained a smaller margin of error than the second sample?",
    options: [
      { id: "A", text: "The first sample contained fewer ovens than the second sample." },
      { id: "B", text: "The first sample contained more ovens than the second sample." },
      { id: "C", text: "The first sample took less time on average to preheat than the second sample." },
      { id: "D", text: "The first sample took more time on average to preheat than the second sample." }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Margin of error relation to sample size**\nMargin of error is inversely related to sample size: $\\text{MOE} \\propto \\frac{1}{\\sqrt{n}}$.\nA smaller margin of error results from a **larger sample size**.\n\n**Conclusion:** Choice (B) is correct.",
    hint: "A larger sample size yields a narrower margin of error."
  },
  {
    id: "pt10-m2-q38",
    number: 38,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "In the given equation, $r$ and $s$ are constants, and the equation has no solution:\n$$-\\frac{2}{19}rx + \\frac{s}{8} = 14 - \\frac{7}{57}x$$\nWhat is the value of $r$?",
    options: [
      { id: "A", text: "$\\frac{5}{6}$" },
      { id: "B", text: "$1$" },
      { id: "C", text: "$\\frac{7}{6}$" },
      { id: "D", text: "$\\frac{11}{6}$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Equate slopes for no solution**\n$$-\\frac{2}{19}r = -\\frac{7}{57}$$\n$$\\frac{2}{19}r = \\frac{7}{57}$$\n$$r = \\frac{7}{57} \\times \\frac{19}{2} = \\frac{7}{3 \\times 2} = \\frac{7}{6}$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Equate the coefficients of $x$ on both sides: $\\frac{2}{19}r = \\frac{7}{57}$."
  },
  {
    id: "pt10-m2-q39",
    number: 39,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "One solution to the given equation $-3x(x + 7) = 27$ can be written as $x = -\\frac{s + \\sqrt{t}}{2}$, where $s$ and $t$ are positive integers. What is the value of $\\frac{s}{t}$?",
    options: [
      { id: "A", text: "$\\frac{7}{85}$" },
      { id: "B", text: "$\\frac{7}{40}$" },
      { id: "C", text: "$\\frac{7}{13}$" },
      { id: "D", text: "$\\frac{14}{13}$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Rewrite in standard quadratic form**\n$$-3x^2 - 21x = 27 \\implies 3x^2 + 21x + 27 = 0 \\implies x^2 + 7x + 9 = 0$$\n\n**Step 2: Apply quadratic formula**\n$$x = \\frac{-7 \\pm \\sqrt{7^2 - 4(1)(9)}}{2} = \\frac{-7 \\pm \\sqrt{49 - 36}}{2} = -\\frac{7 \\mp \\sqrt{13}}{2}$$\nComparing with $-\\frac{s + \\sqrt{t}}{2}$, we have $s = 7$ and $t = 13$.\n$$\\frac{s}{t} = \\frac{7}{13}$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Divide by $3$ to get $x^2 + 7x + 9 = 0$, then find $\\sqrt{49 - 36} = \\sqrt{13}$."
  },
  {
    id: "pt10-m2-q40",
    number: 40,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "The equation $N(m) = 61(Q)^{\\frac{m}{4}}$ gives the predicted population, in thousands, of a bacteria colony $m$ minutes after measurement, where $Q > 1$. The predicted population increases by $p\\%$ every $120\\text{ seconds}$. What is the value of $p$ in terms of $Q$?",
    options: [
      { id: "A", text: "$100(Q^{\\frac{1}{2}} + 1)$" },
      { id: "B", text: "$100(Q^{30} + 1)$" },
      { id: "C", text: "$100(Q^{\\frac{1}{2}} - 1)$" },
      { id: "D", text: "$100(Q^{30} - 1)$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Convert 120 seconds to minutes**\n$$120\\text{ seconds} = 2\\text{ minutes}$$\n\n**Step 2: Find growth multiplier over 2 minutes**\n$$\\frac{N(m + 2)}{N(m)} = \\frac{Q^{\\frac{m + 2}{4}}}{Q^{\\frac{m}{4}}} = Q^{\\frac{2}{4}} = Q^{\\frac{1}{2}}$$\n\n**Step 3: Convert multiplier to percentage increase**\n$$p\\% = (Q^{\\frac{1}{2}} - 1) \\implies p = 100(Q^{\\frac{1}{2}} - 1)$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "In $2$ minutes, the exponent increases by $2/4 = 1/2$. The percent increase is $100(Q^{1/2} - 1)$."
  },
  {
    id: "pt10-m2-q41",
    number: 41,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "A quadratic function models the height, in feet, of an object above the ground in terms of time, in seconds, after launch. The object was launched from a height of $0\\text{ feet}$ and reached its maximum height of $1,936\\text{ feet}$ $11\\text{ seconds}$ after launch. Based on the model, what was the height, in feet, of the object $5\\text{ seconds}$ after launch?",
    options: [
      { id: "A", text: "$360$" },
      { id: "B", text: "$1,340$" },
      { id: "C", text: "$1,360$" },
      { id: "D", text: "$1,300$" }
    ],
    correctAnswer: "C",
    explanation: "**Step 1: Vertex form trajectory**\n$$h(t) = a(t - 11)^2 + 1,936$$\n$$h(0) = 0 \\implies 121a + 1,936 = 0 \\implies a = -16$$\n\n**Step 2: Evaluate at $t = 5\\text{ seconds}$**\n$$h(5) = -16(5 - 11)^2 + 1,936 = -16(-6)^2 + 1,936 = -16(36) + 1,936 = -576 + 1,936 = 1,360\\text{ feet}$$\n\n**Conclusion:** Choice (C) is correct.",
    hint: "Trajectory is $h(t) = -16(t - 11)^2 + 1,936$. Evaluate at $t = 5$."
  },
  {
    id: "pt10-m2-q42",
    number: 42,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "The function $p$ is defined by $p(x) = a((x + 5)^2 - b)((x + 5)^2 - c)$, where $a, b,$ and $c$ are constants. In the $xy$-plane, the graph of $y = p(x)$ passes through $(-6, 35)$ and $(0, 323)$. What is the value of $p(-10) + p(-4)$?",
    options: [
      { id: "A", text: "$323$" },
      { id: "B", text: "$358$" },
      { id: "C", text: "$288$" },
      { id: "D", text: "$-14$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Analyze symmetry around $x = -5$**\nNotice the expression depends entirely on $(x + 5)^2$:\n- For $x = 0$: $(0 + 5)^2 = 25$.\n- For $x = -10$: $(-10 + 5)^2 = 25$. Therefore, $p(-10) = p(0) = 323$.\n- For $x = -6$: $(-6 + 5)^2 = 1$.\n- For $x = -4$: $(-4 + 5)^2 = 1$. Therefore, $p(-4) = p(-6) = 35$.\n\n**Step 2: Calculate sum**\n$$p(-10) + p(-4) = 323 + 35 = 358$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "By symmetry of $(x + 5)^2$, $p(-10) = p(0) = 323$ and $p(-4) = p(-6) = 35$."
  },
  {
    id: "pt10-m2-q43",
    number: 43,
    section: "math",
    module: 2,
    domain: "Algebra",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "One of the equations in a system of two linear equations is $19(x - n) = 19y + 19n$, where $n$ is a non-zero constant. The system has no solution. Which equation could be the second equation in this system?",
    options: [
      { id: "A", text: "$2x - 2y = 4n$" },
      { id: "B", text: "$2x + 2y = 2n$" },
      { id: "C", text: "$2x + 2y = 4n$" },
      { id: "D", text: "$2x - 2y = 2n$" }
    ],
    correctAnswer: "D",
    explanation: "**Step 1: Simplify given equation**\n$$19x - 19n = 19y + 19n \\implies 19x - 19y = 38n \\implies x - y = 2n$$\n\n**Step 2: Parallel line with different constant**\n- Choice A: $2x - 2y = 4n \\implies x - y = 2n$ (infinitely many solutions).\n- Choice D: $2x - 2y = 2n \\implies x - y = n$.\nSince $n \\neq 0$, $x - y$ cannot equal both $2n$ and $n$, so the system has **no solution**.\n\n**Conclusion:** Choice (D) is correct.",
    hint: "Simplify to $x - y = 2n$. Choice D simplifies to $x - y = n$, which is parallel and distinct."
  },
  {
    id: "pt10-m2-q44",
    number: 44,
    section: "math",
    module: 2,
    domain: "Advanced Math",
    difficulty: "Hard",
    type: "multiple_choice",
    prompt: "In the given equation, $a$ and $k$ are constants, where $k > 5a$:\n$$(x - k)^2 = (k - 5a)(x - k)$$\nThe sum of the solutions to the equation is $3k + 21$. What is the value of $a$?",
    options: [
      { id: "A", text: "$\\frac{21}{5}$" },
      { id: "B", text: "$-\\frac{21}{5}$" },
      { id: "C", text: "$\\frac{3}{5}$" },
      { id: "D", text: "$-\\frac{3}{5}$" }
    ],
    correctAnswer: "B",
    explanation: "**Step 1: Solve equation**\n$$(x - k)^2 - (k - 5a)(x - k) = 0$$\n$$(x - k)[(x - k) - (k - 5a)] = 0$$\nRoots:\n$$x_1 = k, \\quad x_2 = 2k - 5a$$\n\n**Step 2: Sum of roots**\n$$x_1 + x_2 = k + (2k - 5a) = 3k - 5a$$\n\n**Step 3: Equate to given sum**\n$$3k - 5a = 3k + 21 \\implies -5a = 21 \\implies a = -\\frac{21}{5}$$\n\n**Conclusion:** Choice (B) is correct.",
    hint: "Factor out $(x - k)$ to find roots $k$ and $2k - 5a$. Set $3k - 5a = 3k + 21$."
  }
];

export function getPracticeTest10Module1(): Question[] {
  return OFFICIAL_PRACTICE_TEST_10_QUESTIONS.filter((q) => q.module === 1);
}

export function getPracticeTest10Module2(): Question[] {
  return OFFICIAL_PRACTICE_TEST_10_QUESTIONS.filter((q) => q.module === 2);
}

export function getPracticeTest10Full(): Question[] {
  return OFFICIAL_PRACTICE_TEST_10_QUESTIONS;
}
