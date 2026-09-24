import { Question } from '../types';

/**
 * Official Digital SAT Math Practice Test 7 (SAT Official Mock 1)
 * Complete 44-Question Dataset
 * Module 1: Questions 1 – 22 (35 Minutes)
 * Module 2: Questions 23 – 44 (35 Minutes, Adaptive Track)
 */
export const OFFICIAL_PRACTICE_TEST_7_QUESTIONS: Question[] = [
  {
    "id": "pt7-m1-q01",
    "number": 1,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "Which expression is equivalent to $6xy(2x^2 + 5y)$?",
    "options": [
      {
        "id": "A",
        "text": "$8xy + 11xy^2$"
      },
      {
        "id": "B",
        "text": "$12x^2y + 5y$"
      },
      {
        "id": "C",
        "text": "$12x^3y + 30xy$"
      },
      {
        "id": "D",
        "text": "$12x^3y + 30xy^2$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Distribute $6xy$ to each term inside the parentheses**\\n$$6xy(2x^2 + 5y) = (6xy)(2x^2) + (6xy)(5y)$$\\n\\n**Step 2: Multiply coefficients and add exponents for like variables**\\n$$(6 \\times 2)(x \\cdot x^2)(y) + (6 \\times 5)(x)(y \\cdot y) = 12x^3y + 30xy^2$$\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "desmosEquation": "6xy(2x^2 + 5y) - (12x^3y + 30xy^2) = 0",
    "hint": "Distribute $6xy$ into both terms: $(6xy)(2x^2) + (6xy)(5y) = 12x^3y + 30xy^2$."
  },
  {
    "id": "pt7-m1-q02",
    "number": 2,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "Which expression is equivalent to $7x^6 - 2x^5 + 9x^4$?",
    "options": [
      {
        "id": "A",
        "text": "$x^5(7x - 2)$"
      },
      {
        "id": "B",
        "text": "$x^4(7x^2 - 2x + 9)$"
      },
      {
        "id": "C",
        "text": "$9x^4(7x^2 - 2x + 1)$"
      },
      {
        "id": "D",
        "text": "$2x^5(-2x^2 + 9x + 1)$"
      }
    ],
    "correctAnswer": "B",
    "explanation": "**Step 1: Identify the greatest common factor**\\nEach term has at least $x^4$:\\n$$7x^6 = x^4(7x^2)$$\\n$$-2x^5 = x^4(-2x)$$\\n$$9x^4 = x^4(9)$$\\n\\n**Step 2: Factor out $x^4$**\\n$$7x^6 - 2x^5 + 9x^4 = x^4(7x^2 - 2x + 9)$$\\n\\n**Conclusion:**\\nChoice (B) is correct.",
    "desmosEquation": "7x^6 - 2x^5 + 9x^4",
    "hint": "Factor out the greatest common factor, $x^4$, from each term."
  },
  {
    "id": "pt7-m1-q03",
    "number": 3,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "The height of a certain vehicle is 61 inches. The vehicle's length is 3 times its height. Which of the following systems of equations represents this situation, where $x$ is the length of the vehicle, in inches, and $y$ is the height of the vehicle, in inches?",
    "options": [
      {
        "id": "A",
        "text": "$y = 3x$ and $x = 61$"
      },
      {
        "id": "B",
        "text": "$y = 3x$ and $y = 61$"
      },
      {
        "id": "C",
        "text": "$x = 3y$ and $x = 61$"
      },
      {
        "id": "D",
        "text": "$x = 3y$ and $y = 61$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Translate the vehicle statements into equations**\\n- $y$ represents the height: the height is 61 inches, so $y = 61$.\\n- $x$ represents the length: the length is 3 times the height, so $x = 3y$.\\n\\n**Conclusion:**\\nThe system is $x = 3y$ and $y = 61$, which matches Choice (D).",
    "desmosEquation": "x = 3y; y = 61",
    "hint": "Height is $y = 61$, and length is 3 times height, giving $x = 3y$."
  },
  {
    "id": "pt7-m1-q04",
    "number": 4,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "For the linear function $f$, the graph of $y = f(x)$ in the $xy$-plane has a slope of $-54$ and passes through the point $(0, 0)$. Which equation defines $f$?",
    "options": [
      {
        "id": "A",
        "text": "$f(x) = -54x$"
      },
      {
        "id": "B",
        "text": "$f(x) = -36x$"
      },
      {
        "id": "C",
        "text": "$f(x) = -18x$"
      },
      {
        "id": "D",
        "text": "$f(x) = -\\frac{54}{x}$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Use the slope-intercept form**\\n$$y = mx + b$$\\nWith slope $m = -54$ and $y$-intercept $(0, 0)$ so $b = 0$:\\n$$f(x) = -54x$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "f(x) = -54x",
    "hint": "A linear function with slope $m = -54$ passing through the origin $(0, 0)$ is $f(x) = -54x$."
  },
  {
    "id": "pt7-m1-q05",
    "number": 5,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "The function $g$ is defined by $g(x) = \\frac{5}{9}x - \\frac{7}{9}$. What is the value of $g(18)$?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{38}{9}$"
      },
      {
        "id": "B",
        "text": "$\\frac{52}{9}$"
      },
      {
        "id": "C",
        "text": "$\\frac{83}{9}$"
      },
      {
        "id": "D",
        "text": "$\\frac{97}{9}$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Substitute $x = 18$ into $g(x)$**\\n$$g(18) = \\frac{5}{9}(18) - \\frac{7}{9} = 5(2) - \\frac{7}{9} = 10 - \\frac{7}{9}$$\\n\\n**Step 2: Express 10 with denominator 9**\\n$$10 = \\frac{90}{9}$$\\n$$g(18) = \\frac{90 - 7}{9} = \\frac{83}{9}$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "g(x) = (5/9)x - 7/9; g(18)",
    "hint": "Evaluate $\\frac{5}{9}(18) - \\frac{7}{9} = 10 - \\frac{7}{9} = \\frac{83}{9}$."
  },
  {
    "id": "pt7-m1-q06",
    "number": 6,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Easy",
    "type": "student_produced",
    "prompt": "The function $f$ is defined by $f(x) = x^2 + x + 61$. What is the value of $f(2)$?",
    "correctAnswer": "67",
    "explanation": "**Step 1: Substitute $x = 2$ into $f(x)$**\\n$$f(2) = (2)^2 + (2) + 61 = 4 + 2 + 61 = 67$$\\n\\n**Conclusion:**\\nThe correct answer is $67$.",
    "desmosEquation": "f(x) = x^2 + x + 61; f(2)",
    "hint": "Substitute $2$ into the quadratic: $2^2 + 2 + 61 = 67$."
  },
  {
    "id": "pt7-m1-q07",
    "number": 7,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "$$f(x) = 5x + 7$$\\nThe function $f$ gives the estimated height, in feet, of a poplar tree $x$ years after its height was first measured. Which statement is the best interpretation of 7 in this context?",
    "options": [
      {
        "id": "A",
        "text": "The tree will be measured each year for 7 years."
      },
      {
        "id": "B",
        "text": "The tree is estimated to grow to a maximum height of 7 feet."
      },
      {
        "id": "C",
        "text": "The estimated height of the tree increased by 7 feet each year."
      },
      {
        "id": "D",
        "text": "The estimated height of the tree was 7 feet when it was first measured."
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Understand the constant term in a linear model**\\nIn $f(x) = 5x + 7$, $x = 0$ corresponds to the moment the tree was first measured. Evaluating at $x = 0$ gives $f(0) = 7$.\\n\\n**Step 2: Interpret in context**\\nTherefore, 7 is the estimated initial height (7 feet) of the tree when first measured.\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "desmosEquation": "f(x) = 5x + 7",
    "hint": "At $x = 0$ (when first measured), $f(0) = 7$ feet."
  },
  {
    "id": "pt7-m1-q08",
    "number": 8,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "student_produced",
    "prompt": "In the $xy$-plane, line $k$ has a slope of 5 and a $y$-intercept of $(0, -35)$. What is the $x$-coordinate of the $x$-intercept of line $k$?",
    "correctAnswer": "7",
    "explanation": "**Step 1: Write the equation of line $k$**\\n$$y = 5x - 35$$\\n\\n**Step 2: Find the $x$-intercept by setting $y = 0$**\\n$$0 = 5x - 35 \\implies 5x = 35 \\implies x = 7$$\\n\\n**Conclusion:**\\nThe $x$-coordinate of the $x$-intercept is $7$.",
    "desmosEquation": "y = 5x - 35",
    "hint": "Set $y = 0$ in $y = 5x - 35$ to get $5x = 35$, so $x = 7$."
  },
  {
    "id": "pt7-m1-q09",
    "number": 9,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Easy",
    "type": "student_produced",
    "prompt": "$$\\frac{27(k+6)}{3(k+6)}$$\\nThe given expression is equivalent to $c$, where $c$ is a constant and $k > -6$. What is the value of $c$?",
    "correctAnswer": "9",
    "explanation": "**Step 1: Simplify the rational expression**\\nSince $k > -6$, $k + 6 \\neq 0$, so we can cancel the common factor $(k + 6)$ from numerator and denominator:\\n$$\\frac{27(k+6)}{3(k+6)} = \\frac{27}{3} = 9$$\\n\\n**Conclusion:**\\nThe value of $c$ is $9$.",
    "desmosEquation": "27/3",
    "hint": "Cancel the common non-zero binomial factor $(k + 6)$ to leave $27/3 = 9$."
  },
  {
    "id": "pt7-m1-q10",
    "number": 10,
    "section": "math",
    "module": 1,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "The table gives the perimeters of similar triangles $TUV$ and $XYZ$, where $\\overline{TU}$ corresponds to $\\overline{XY}$. The length of $\\overline{TU}$ is 6.\\n\\n| Triangle | Perimeter |\\n| :--- | :--- |\\n| Triangle $TUV$ | 50 |\\n| Triangle $XYZ$ | 150 |\\n\\nWhat is the length of $\\overline{XY}$?",
    "options": [
      {
        "id": "A",
        "text": "$2$"
      },
      {
        "id": "B",
        "text": "$6$"
      },
      {
        "id": "C",
        "text": "$18$"
      },
      {
        "id": "D",
        "text": "$56$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Ratio of perimeters equals ratio of corresponding sides**\\nFor similar figures, the ratio of their perimeters equals the ratio of any pair of corresponding sides:\\n$$\\frac{\\text{Perimeter of } XYZ}{\\text{Perimeter of } TUV} = \\frac{XY}{TU}$$\\n$$\\frac{150}{50} = 3 = \\frac{XY}{6}$$\\n\\n**Step 2: Solve for $XY$**\\n$$XY = 3 \\times 6 = 18$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "150 / 50 * 6",
    "hint": "The scale factor of perimeters is $150/50 = 3$. Multiply $TU = 6$ by 3 to find $XY = 18$."
  },
  {
    "id": "pt7-m1-q11",
    "number": 11,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "If $9(7 - 8x) + 2 = 8(7 - 8x) + 17$, what is the value of $7 - 8x$?",
    "options": [
      {
        "id": "A",
        "text": "$-15$"
      },
      {
        "id": "B",
        "text": "$1$"
      },
      {
        "id": "C",
        "text": "$7$"
      },
      {
        "id": "D",
        "text": "$15$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Treat $(7 - 8x)$ as a single variable $u$**\\nLet $u = 7 - 8x$:\\n$$9u + 2 = 8u + 17$$\\n\\n**Step 2: Solve for $u$**\\n$$9u - 8u = 17 - 2 \\implies u = 15$$\\n\\n**Conclusion:**\\nThe value of $7 - 8x$ is $15$, matching Choice (D).",
    "desmosEquation": "9u + 2 = 8u + 17",
    "hint": "Subtract $8(7 - 8x)$ and $2$ from both sides to directly get $7 - 8x = 15$."
  },
  {
    "id": "pt7-m1-q12",
    "number": 12,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "$$\\begin{cases} x + 33 = y \\\\ (x + 33)^2 = y \\end{cases}$$\\nA solution to the given system of equations is $(x, y)$. What is a possible value of $x$?",
    "options": [
      {
        "id": "A",
        "text": "$-32$"
      },
      {
        "id": "B",
        "text": "$0$"
      },
      {
        "id": "C",
        "text": "$1$"
      },
      {
        "id": "D",
        "text": "$33$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Substitute $y = x + 33$ into the second equation**\\n$$(x + 33)^2 = x + 33$$\\n\\n**Step 2: Let $u = x + 33$**\\n$$u^2 = u \\implies u^2 - u = 0 \\implies u(u - 1) = 0$$\\nThus $u = 0$ or $u = 1$.\\n\\n**Step 3: Solve for $x$**\\n- If $x + 33 = 0 \\implies x = -33$\\n- If $x + 33 = 1 \\implies x = -32$\\n\\n**Conclusion:**\\nAmong the answer choices, $-32$ is Choice (A).",
    "desmosEquation": "(x + 33)^2 = x + 33",
    "hint": "Let $u = x + 33$. Then $u^2 = u$, so $u = 1$ or $u = 0$, giving $x = -32$ or $x = -33$."
  },
  {
    "id": "pt7-m1-q13",
    "number": 13,
    "section": "math",
    "module": 1,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "A circle in the $xy$-plane has the equation $(x - 14)^2 + (y - k)^2 = 36$. Which of the following gives the center of the circle and its radius?",
    "options": [
      {
        "id": "A",
        "text": "The center is at $(14, k)$ and the radius is $6$."
      },
      {
        "id": "B",
        "text": "The center is at $(k, 14)$ and the radius is $6$."
      },
      {
        "id": "C",
        "text": "The center is at $(k, 14)$ and the radius is $36$."
      },
      {
        "id": "D",
        "text": "The center is at $(14, k)$ and the radius is $36$."
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Identify standard circle form**\\n$$(x - h)^2 + (y - k)^2 = r^2$$\\nHere $h = 14$, $k = k$, and $r^2 = 36 \\implies r = \\sqrt{36} = 6$.\\n\\n**Step 2: Read center and radius**\\nCenter: $(14, k)$, Radius: $6$.\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "(x - 14)^2 + (y - 2)^2 = 36",
    "hint": "Standard circle equation has center $(h, k)$ and radius $r = \\sqrt{36} = 6$."
  },
  {
    "id": "pt7-m1-q14",
    "number": 14,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "The town of Fillmore is planning its annual fireworks show. The equation $y = -16(x - 6.8)^2 + 740$ gives the estimated height $y$, in feet, of a type of firework $x$ seconds after it is launched into the air. Which of the following is the best interpretation of the vertex of the graph of the equation in the $xy$-plane?",
    "options": [
      {
        "id": "A",
        "text": "This type of firework reaches an estimated maximum height of 740 feet 16 seconds after it is launched into the air."
      },
      {
        "id": "B",
        "text": "This type of firework reaches an estimated maximum height of 740 feet 6.8 seconds after it is launched into the air."
      },
      {
        "id": "C",
        "text": "This type of firework reaches an estimated maximum height of 16 feet 740 seconds after it is launched into the air."
      },
      {
        "id": "D",
        "text": "This type of firework reaches an estimated maximum height of 6.8 feet 740 seconds after it is launched into the air."
      }
    ],
    "correctAnswer": "B",
    "explanation": "**Step 1: Find the vertex from vertex form**\\n$$y = a(x - h)^2 + k$$\\nThe vertex is $(h, k) = (6.8, 740)$.\\n\\n**Step 2: Interpret coordinates**\\nSince $a = -16 < 0$, the parabola opens downward, so the vertex is the absolute maximum point.\\nAt $x = 6.8$ seconds, the maximum height is $y = 740$ feet.\\n\\n**Conclusion:**\\nChoice (B) is correct.",
    "desmosEquation": "y = -16(x - 6.8)^2 + 740",
    "hint": "Vertex $(h, k) = (6.8, 740)$ gives maximum height 740 feet at time 6.8 seconds."
  },
  {
    "id": "pt7-m1-q15",
    "number": 15,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "The graph of $y = f(x)$ is shown, where $f(x) = ax^3 + bx^2 + cx + d$ and $a, b, c$, and $d$ are constants. For how many distinct values of $x$ does $f(x) = 0$?",
    "options": [
      {
        "id": "A",
        "text": "One"
      },
      {
        "id": "B",
        "text": "Two"
      },
      {
        "id": "C",
        "text": "Three"
      },
      {
        "id": "D",
        "text": "Four"
      }
    ],
    "correctAnswer": "B",
    "image": "/practice-tests/pt7_m1_q15_cubic_graph.png",
    "explanation": "**Step 1: Understand $f(x) = 0$ on a graph**\\nThe solutions to $f(x) = 0$ correspond to the $x$-intercepts where the curve intersects or touches the $x$-axis.\\n\\n**Step 2: Inspect the graph**\\nThe curve crosses the $x$-axis at $x = -3$ and touches (is tangent to) the $x$-axis at $x = 1$.\\nThere are no other points of contact with the $x$-axis.\\n\\n**Conclusion:**\\nThere are exactly two distinct values of $x$ for which $f(x) = 0$. Choice (B) is correct.",
    "hint": "Count the distinct points where the curve touches or crosses the $x$-axis (at $x = -3$ and $x = 1$)."
  },
  {
    "id": "pt7-m1-q16",
    "number": 16,
    "section": "math",
    "module": 1,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "In the $xy$-plane, circle $M$ is the graph of the equation $(x - 3)^2 + (y - 6)^2 = 4$. Circle $P$ has the same center as circle $M$ but has a radius that is twice the radius of circle $M$. Which equation represents circle $P$?",
    "options": [
      {
        "id": "A",
        "text": "$(x - 3)^2 + (y - 6)^2 = 8$"
      },
      {
        "id": "B",
        "text": "$(x - 3)^2 + (y - 6)^2 = 16$"
      },
      {
        "id": "C",
        "text": "$(x - 6)^2 + (y - 12)^2 = 4$"
      },
      {
        "id": "D",
        "text": "$(x - 6)^2 + (y - 12)^2 = 16$"
      }
    ],
    "correctAnswer": "B",
    "explanation": "**Step 1: Find the radius of circle $M$**\\n$$r_M^2 = 4 \\implies r_M = 2$$\\n\\n**Step 2: Determine circle $P$**\\n- Same center: $(3, 6)$\\n- Radius twice as large: $r_P = 2 \\times 2 = 4$\\n- Equation of circle $P$: $(x - 3)^2 + (y - 6)^2 = 4^2 = 16$\\n\\n**Conclusion:**\\nChoice (B) is correct.",
    "desmosEquation": "(x - 3)^2 + (y - 6)^2 = 16",
    "hint": "Circle $M$ has radius $\\sqrt{4} = 2$. Circle $P$ has radius $2 \\times 2 = 4$, so $r^2 = 16$."
  },
  {
    "id": "pt7-m1-q17",
    "number": 17,
    "section": "math",
    "module": 1,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "In right triangle $ABC$, the measure of angle $B$ is $90^\\circ$, angle $C$ measures $58^\\circ$, and the length of hypotenuse $\\overline{AC}$ is 14. Which expression represents the length of line segment $\\overline{AB}$?",
    "options": [
      {
        "id": "A",
        "text": "$14\\sin 58^\\circ$"
      },
      {
        "id": "B",
        "text": "$\\frac{14}{\\sin 58^\\circ}$"
      },
      {
        "id": "C",
        "text": "$14\\cos 58^\\circ$"
      },
      {
        "id": "D",
        "text": "$\\frac{14}{\\cos 58^\\circ}$"
      }
    ],
    "correctAnswer": "A",
    "image": "/practice-tests/pt7_m1_q17_right_triangle.png",
    "explanation": "**Step 1: Set up the trigonometric ratio for angle $C$**\\n$$\\sin C = \\frac{\\text{Opposite}}{\\text{Hypotenuse}} = \\frac{AB}{AC}$$\\n\\n**Step 2: Substitute given values**\\n$$\\sin 58^\\circ = \\frac{AB}{14} \\implies AB = 14\\sin 58^\\circ$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "14 * sin(58 * pi / 180)",
    "hint": "$\\sin(58^\\circ) = \\text{opposite}/\\text{hypotenuse} = AB / 14$, so $AB = 14\\sin 58^\\circ$."
  },
  {
    "id": "pt7-m1-q18",
    "number": 18,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "The product of a positive number $x$ and the number that is 15 less than $x$ is equal to 286. What is the value of $x$?",
    "correctAnswer": "26",
    "explanation": "**Step 1: Set up the equation**\\n$$x(x - 15) = 286 \\implies x^2 - 15x - 286 = 0$$\\n\\n**Step 2: Factor the quadratic**\\nFind two numbers that multiply to $-286$ and add to $-15$: these are $-26$ and $+11$ ($26 \\times 11 = 286$):\\n$$(x - 26)(x + 11) = 0$$\\nSince $x$ is positive, $x = 26$.\\n\\n**Conclusion:**\\nThe correct answer is $26$.",
    "desmosEquation": "x(x - 15) = 286",
    "hint": "Solve $x(x - 15) = 286$. Factoring gives $(x - 26)(x + 11) = 0$, so $x = 26$."
  },
  {
    "id": "pt7-m1-q19",
    "number": 19,
    "section": "math",
    "module": 1,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "In the figure, $AC = CD$. The measure of angle $EBC$ is $29^\\circ$, and the measure of angle $ACD$ is $108^\\circ$. What is the value of $x$?",
    "correctAnswer": "65",
    "image": "/practice-tests/pt7_m1_q19_triangle_geometry.png",
    "explanation": "**Step 1: Find base angles of isosceles triangle $ACD$**\\nSince $AC = CD$, $\\triangle ACD$ is isosceles with $\\angle D = \\angle CAD$.\\n$$\\angle D = \\frac{180^\\circ - 108^\\circ}{2} = \\frac{72^\\circ}{2} = 36^\\circ$$\\n\\n**Step 2: Use triangle $BDE$**\\nIn $\\triangle BDE$, angle $D = 36^\\circ$ and angle $B = 29^\\circ$.\\nBy the Exterior Angle Theorem, angle $x^\\circ$ at vertex $E$ is exterior to $\\triangle BDE$:\\n$$x = \\angle D + \\angle B = 36^\\circ + 29^\\circ = 65^\\circ$$\\n\\n**Conclusion:**\\nThe value of $x$ is $65$.",
    "desmosEquation": "36 + 29",
    "hint": "Base angle $D = (180 - 108)/2 = 36^\\circ$. The exterior angle $x = \\angle D + \\angle B = 36 + 29 = 65$."
  },
  {
    "id": "pt7-m1-q20",
    "number": 20,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "The positive number $a$ is 2,800% of the number $c$, and $c$ is 25% of the number $b$. If $a - b = wc$, where $w$ is a constant, what is the value of $w$?",
    "correctAnswer": "24",
    "explanation": "**Step 1: Express $a$ and $b$ in terms of $c$**\\n- $a = 2,800\\% \\times c = 28c$\\n- $c = 25\\% \\times b = 0.25b \\implies b = \\frac{c}{0.25} = 4c$\\n\\n**Step 2: Substitute into $a - b = wc$**\\n$$28c - 4c = wc \\implies 24c = wc$$\\nSince $c > 0$, $w = 24$.\\n\\n**Conclusion:**\\nThe value of $w$ is $24$.",
    "desmosEquation": "28 - 4",
    "hint": "$a = 28c$ and $b = 4c$, so $a - b = 28c - 4c = 24c$, meaning $w = 24$."
  },
  {
    "id": "pt7-m1-q21",
    "number": 21,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "Line $j$ is defined by $4x + 5y = 55$. Line $k$ is parallel to line $j$ in the $xy$-plane. An equation of line $k$ is $24x + ry = 15$, where $r$ is a constant. If line $k$ passes through the point $(0, b)$, what is the value of $b$?",
    "correctAnswer": "0.5",
    "explanation": "**Step 1: Determine the slope of line $j$**\\n$$5y = -4x + 55 \\implies y = -\\frac{4}{5}x + 11$$\\nThe slope is $-\\frac{4}{5}$.\\n\\n**Step 2: Determine $r$ using the parallel condition**\\nLine $k$: $ry = -24x + 15 \\implies y = -\\frac{24}{r}x + \\frac{15}{r}$\\nSince lines are parallel:\\n$$-\\frac{24}{r} = -\\frac{4}{5} \\implies 4r = 120 \\implies r = 30$$\\n\\n**Step 3: Find $b$, the $y$-intercept of line $k$**\\n$$b = \\frac{15}{r} = \\frac{15}{30} = 0.5$$\\n\\n**Conclusion:**\\nThe value of $b$ is $0.5$ (or $1/2$).",
    "desmosEquation": "15 / 30",
    "hint": "Parallel lines have proportional coefficients: $24/4 = 6$, so $r = 5 \\times 6 = 30$. Then $b = 15/30 = 0.5$."
  },
  {
    "id": "pt7-m1-q22",
    "number": 22,
    "section": "math",
    "module": 1,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "The dot plot shows the distribution of capacity for a set of capacitors, set A, which a researcher used for a certain experiment. For another experiment, the researcher used a different set of capacitors, set B. Set B has the same number of capacitors as set A but the capacity of each capacitor of set B is 17 microfarads ($\\mu$F) greater than the capacity of each respective capacitor in set A. Which of the following is true about the capacities of the capacitors in set B?",
    "options": [
      {
        "id": "A",
        "text": "The mean capacity is $8\\,\\mu\\text{F}$, and the range of capacities is $12\\,\\mu\\text{F}$."
      },
      {
        "id": "B",
        "text": "The mean capacity is $8\\,\\mu\\text{F}$, and the range of capacities is $29\\,\\mu\\text{F}$."
      },
      {
        "id": "C",
        "text": "The mean capacity is $25\\,\\mu\\text{F}$, and the range of capacities is $12\\,\\mu\\text{F}$."
      },
      {
        "id": "D",
        "text": "The mean capacity is $25\\,\\mu\\text{F}$, and the range of capacities is $29\\,\\mu\\text{F}$."
      }
    ],
    "correctAnswer": "C",
    "image": "/practice-tests/pt7_m1_q22_dotplot.png",
    "explanation": "**Step 1: Calculate the mean and range for set A**\\nFrom the dot plot, the distribution is symmetric around 8 with values $2, 5, 8, 11, 14$:\\n$$\\text{Mean}_A = 8\\,\\mu\\text{F}$$\\n$$\\text{Range}_A = 14 - 2 = 12\\,\\mu\\text{F}$$\\n\\n**Step 2: Apply the constant shift of $+17\\,\\mu\\text{F}$**\\n- Mean increases by 17: $\\text{Mean}_B = 8 + 17 = 25\\,\\mu\\text{F}$\\n- Range is a measure of spread and is completely unchanged by adding a constant: $\\text{Range}_B = 12\\,\\mu\\text{F}$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "8 + 17",
    "hint": "Adding 17 to every data value increases the mean by 17 ($8 + 17 = 25$) but leaves the range unchanged at 12."
  },
  {
    "id": "pt7-m2-q23",
    "number": 23,
    "section": "math",
    "module": 2,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "The bar graph shows the distribution of flower type for the 700 flowers that a florist has in stock. For which two types of flowers is the total number of flowers of the two types exactly $\\frac{2}{5}$ of the florist's stock?",
    "options": [
      {
        "id": "A",
        "text": "Orchid and lily"
      },
      {
        "id": "B",
        "text": "Daisy and tulip"
      },
      {
        "id": "C",
        "text": "Tulip and sunflower"
      },
      {
        "id": "D",
        "text": "Daisy and orchid"
      }
    ],
    "correctAnswer": "A",
    "image": "/practice-tests/pt7_m2_q01_bargraph.png",
    "explanation": "**Step 1: Calculate $\\frac{2}{5}$ of total stock**\\n$$\\text{Target count} = \\frac{2}{5} \\times 700 = 280\\text{ flowers}$$\\n\\n**Step 2: Read frequencies from the bar graph**\\n- Daisy: 60\\n- Orchid: 100\\n- Tulip: 190\\n- Lily: 180\\n- Sunflower: 170\\n\\n**Step 3: Find the pair summing to 280**\\n$$\\text{Orchid} + \\text{Lily} = 100 + 180 = 280$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "(2/5) * 700",
    "hint": "$\\frac{2}{5} \\times 700 = 280$. Check which two flowers sum to 280: Orchid (100) + Lily (180) = 280."
  },
  {
    "id": "pt7-m2-q24",
    "number": 24,
    "section": "math",
    "module": 2,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "The scatterplot shows the relationship between two variables, $x$ and $y$, for data set A. A line of best fit for the data is also shown. Data set B is created by subtracting 11 units from the value of $y$ for each data point from data set A. Which of the following is closest to the $y$-coordinate of the $y$-intercept of the line of best fit for data set B?",
    "options": [
      {
        "id": "A",
        "text": "$62.75$"
      },
      {
        "id": "B",
        "text": "$51.75$"
      },
      {
        "id": "C",
        "text": "$40.75$"
      },
      {
        "id": "D",
        "text": "$29.75$"
      }
    ],
    "correctAnswer": "C",
    "image": "/practice-tests/pt7_m2_q02_scatterplot.png",
    "explanation": "**Step 1: Estimate the $y$-intercept of the line of best fit for data set A**\\nExtrapolating the line of best fit back to $x = 0$ gives approximately $y \\approx 51.75$.\\n\\n**Step 2: Shift the line for data set B**\\nSince data set B is formed by subtracting 11 from each $y$-value, every point on the line of best fit shifts vertically downward by 11 units:\\n$$y_{\\text{intercept}, B} = 51.75 - 11 = 40.75$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "51.75 - 11",
    "hint": "Subtract 11 from the original $y$-intercept ($51.75 - 11 = 40.75$)."
  },
  {
    "id": "pt7-m2-q25",
    "number": 25,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "If $4(2x + 11) - 2(2x - 5) = -9 + 13x$, what is the value of $12x$?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{7}{12}$"
      },
      {
        "id": "B",
        "text": "$7$"
      },
      {
        "id": "C",
        "text": "$84$"
      },
      {
        "id": "D",
        "text": "$91$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Expand the left side**\\n$$4(2x + 11) - 2(2x - 5) = 8x + 44 - 4x + 10 = 4x + 54$$\\n\\n**Step 2: Solve for $x$**\\n$$4x + 54 = -9 + 13x \\implies 54 + 9 = 13x - 4x \\implies 63 = 9x \\implies x = 7$$\\n\\n**Step 3: Calculate $12x$**\\n$$12x = 12(7) = 84$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "4(2x + 11) - 2(2x - 5) = -9 + 13x; 12x",
    "hint": "Solve for $x = 7$, then multiply by 12 to get $12 \\times 7 = 84$."
  },
  {
    "id": "pt7-m2-q26",
    "number": 26,
    "section": "math",
    "module": 2,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "An object has a mass of 308 grams and a volume of 28 cubic centimeters. What is the density, in grams per cubic centimeter, of the object?",
    "options": [
      {
        "id": "A",
        "text": "$11$"
      },
      {
        "id": "B",
        "text": "$280$"
      },
      {
        "id": "C",
        "text": "$336$"
      },
      {
        "id": "D",
        "text": "$8,624$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Use the density formula**\\n$$\\text{Density} = \\frac{\\text{Mass}}{\\text{Volume}} = \\frac{308\\text{ g}}{28\\text{ cm}^3} = 11\\text{ g/cm}^3$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "308 / 28",
    "hint": "Density equals mass divided by volume: $308 / 28 = 11$."
  },
  {
    "id": "pt7-m2-q27",
    "number": 27,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "In the $xy$-plane, which of the following does NOT contain any points that are part of the solution set to $3x - 7y > 21$?",
    "options": [
      {
        "id": "A",
        "text": "The region where $x < 0$ and $y > 0$"
      },
      {
        "id": "B",
        "text": "The region where $x < 0$ and $y < 0$"
      },
      {
        "id": "C",
        "text": "The region where $x > 0$ and $y > 0$"
      },
      {
        "id": "D",
        "text": "The $x$-axis"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Rewrite the inequality in slope-intercept form**\\n$$3x - 7y > 21 \\implies -7y > -3x + 21 \\implies y < \\frac{3}{7}x - 3$$\\n\\n**Step 2: Test Quadrant II ($x < 0$ and $y > 0$)**\\nIf $x < 0$, then $\\frac{3}{7}x < 0$, which means $\\frac{3}{7}x - 3 < -3$.\\nFor $y$ to be in the solution set, $y$ must be less than a negative number ($< -3$). But in Quadrant II, $y > 0$ (positive). A positive number can never be less than $-3$.\\nTherefore, there are no points in the region where $x < 0$ and $y > 0$.\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "3x - 7y > 21",
    "hint": "Solve for $y < \\frac{3}{7}x - 3$. When $x < 0$, the right side is always negative ($< -3$), so $y > 0$ is impossible."
  },
  {
    "id": "pt7-m2-q28",
    "number": 28,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "Which equation defines the linear function $f$ shown in the graph?",
    "options": [
      {
        "id": "A",
        "text": "$f(x) = -14x - 9$"
      },
      {
        "id": "B",
        "text": "$f(x) = -5x - 9$"
      },
      {
        "id": "C",
        "text": "$f(x) = -5x + 8$"
      },
      {
        "id": "D",
        "text": "$f(x) = -14x + 8$"
      }
    ],
    "correctAnswer": "A",
    "image": "/practice-tests/pt7_m2_q06_linear_graph.png",
    "explanation": "**Step 1: Identify key points on the line**\\nThe graph passes through $(-1, 5)$ and has an $x$-intercept at approximately $(-0.64, 0)$.\\n\\n**Step 2: Test $(-1, 5)$ in the options**\\n- (A) $f(-1) = -14(-1) - 9 = 14 - 9 = 5$ (Matches!)\\n- (B) $f(-1) = -5(-1) - 9 = 5 - 9 = -4 \\neq 5$\\n\\n**Conclusion:**\\nChoice (A) is the only equation that passes through $(-1, 5)$.",
    "desmosEquation": "y = -14x - 9",
    "hint": "Check which equation passes through $(-1, 5)$: $-14(-1) - 9 = 14 - 9 = 5$."
  },
  {
    "id": "pt7-m2-q29",
    "number": 29,
    "section": "math",
    "module": 2,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "In triangle $FGH$ and triangle $KLM$, the measures of angles $G$ and $L$ are each $30^\\circ$. The lengths of $\\overline{GH}$ and $\\overline{LM}$ are each 34 centimeters, and $\\frac{GH}{GF} = \\frac{LM}{LK}$. Which additional piece of information would be necessary to prove that triangle $FGH$ is congruent to triangle $KLM$?",
    "options": [
      {
        "id": "A",
        "text": "The lengths of $\\overline{FG}$ and $\\overline{KM}$ are each 17 centimeters."
      },
      {
        "id": "B",
        "text": "The measures of angles $H$ and $M$ are each $60^\\circ$."
      },
      {
        "id": "C",
        "text": "The measures of angles $F$ and $K$ are each $90^\\circ$."
      },
      {
        "id": "D",
        "text": "No additional information is necessary."
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Analyze the given conditions**\\n- $GH = LM = 34$\\n- $\\frac{GH}{GF} = \\frac{LM}{LK} \\implies \\frac{34}{GF} = \\frac{34}{LK} \\implies GF = LK$\\n- The included angle between side $GH$ and side $GF$ is $\\angle G = 30^\\circ$.\\n- The included angle between side $LM$ and side $LK$ is $\\angle L = 30^\\circ$.\\n\\n**Step 2: Apply the SAS Congruence Theorem**\\nSince two corresponding sides and their included angle are equal ($GH = LM$, $\\angle G = \\angle L$, and $GF = LK$), the triangles are congruent by SAS without needing any extra information.\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "hint": "Since $GH = LM$ and $GH/GF = LM/LK$, $GF = LK$. With included angle $G = L = 30^\\circ$, triangles are already congruent by SAS."
  },
  {
    "id": "pt7-m2-q30",
    "number": 30,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "$$\\begin{cases} y = 3x + 9 \\\\ 3y = 8x - 6 \\end{cases}$$\\nThe solution to the given system of equations is $(x, y)$. What is the value of $x - y$?",
    "options": [
      {
        "id": "A",
        "text": "$-123$"
      },
      {
        "id": "B",
        "text": "$-33$"
      },
      {
        "id": "C",
        "text": "$3$"
      },
      {
        "id": "D",
        "text": "$57$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Substitute $y = 3x + 9$ into $3y = 8x - 6$**\\n$$3(3x + 9) = 8x - 6 \\implies 9x + 27 = 8x - 6$$\\n$$9x - 8x = -6 - 27 \\implies x = -33$$\\n\\n**Step 2: Find $y$**\\n$$y = 3(-33) + 9 = -99 + 9 = -90$$\\n\\n**Step 3: Calculate $x - y$**\\n$$x - y = -33 - (-90) = -33 + 90 = 57$$\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "desmosEquation": "y = 3x + 9; 3y = 8x - 6; x - y",
    "hint": "Substitute $y = 3x + 9$ to get $x = -33$, then $y = -90$. Subtracting gives $-33 - (-90) = 57$."
  },
  {
    "id": "pt7-m2-q31",
    "number": 31,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Medium",
    "type": "student_produced",
    "prompt": "An exponential function $f$ is defined by $f(x) = c^x$, where $c$ is a constant greater than 1. If $f(6) = 9 \\cdot f(4)$, what is the value of $c$?",
    "correctAnswer": "3",
    "explanation": "**Step 1: Write $f(6)$ and $f(4)$ using $f(x) = c^x$**\\n$$c^6 = 9 \\cdot c^4$$\\n\\n**Step 2: Divide both sides by $c^4$**\\n$$c^2 = 9$$\\nSince $c > 1$, taking the principal square root gives $c = 3$.\\n\\n**Conclusion:**\\nThe value of $c$ is $3$.",
    "desmosEquation": "c^6 = 9 * c^4",
    "hint": "Divide $c^6 = 9c^4$ by $c^4$ to get $c^2 = 9$, so $c = 3$."
  },
  {
    "id": "pt7-m2-q32",
    "number": 32,
    "section": "math",
    "module": 2,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "In the right triangle shown, what is the value of $\\sin x^\\circ$?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{10}{73}$"
      },
      {
        "id": "B",
        "text": "$\\frac{\\sqrt{1,360}}{73}$"
      },
      {
        "id": "C",
        "text": "$\\frac{63}{73}$"
      },
      {
        "id": "D",
        "text": "$\\frac{73}{63}$"
      }
    ],
    "correctAnswer": "C",
    "image": "/practice-tests/pt7_m2_q10_triangle.png",
    "explanation": "**Step 1: Identify sides relative to angle $x^\\circ$**\\n- Opposite side: $63$\\n- Hypotenuse: $73$\\n\\n**Step 2: Apply the sine definition**\\n$$\\sin x^\\circ = \\frac{\\text{Opposite}}{\\text{Hypotenuse}} = \\frac{63}{73}$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "63 / 73",
    "hint": "$\\sin = \\text{opposite}/\\text{hypotenuse} = 63 / 73$."
  },
  {
    "id": "pt7-m2-q33",
    "number": 33,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "$$\\begin{cases} -x - wy = -337 \\\\ 2x - wy = 47 \\end{cases}$$\\nIn the given system of equations, $w$ is a constant. In the $xy$-plane, the graphs of these equations intersect at the point $(q, 19)$, where $q$ is a constant. What is the value of $w$?",
    "correctAnswer": "11",
    "explanation": "**Step 1: Substitute $y = 19$ and $x = q$ into both equations**\\n(1) $-q - 19w = -337 \\implies q + 19w = 337$\\n(2) $2q - 19w = 47$\\n\\n**Step 2: Add the two equations to eliminate $w$**\\n$$(q + 19w) + (2q - 19w) = 337 + 47 \\implies 3q = 384 \\implies q = 128$$\\n\\n**Step 3: Solve for $w$**\\n$$128 + 19w = 337 \\implies 19w = 209 \\implies w = 11$$\\n\\n**Conclusion:**\\nThe value of $w$ is $11$.",
    "desmosEquation": "(337 - 128) / 19",
    "hint": "Add $q + 19w = 337$ and $2q - 19w = 47$ to find $q = 128$, then solve $19w = 337 - 128 = 209$, so $w = 11$."
  },
  {
    "id": "pt7-m2-q34",
    "number": 34,
    "section": "math",
    "module": 2,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Medium",
    "type": "student_produced",
    "prompt": "The table shows the distribution of two types of trees at two different sites.\\n\\n| Type of Tree | Site A | Site B | Total |\\n| :--- | :--- | :--- | :--- |\\n| Red maple | 35 | 15 | 50 |\\n| Chestnut oak | 31 | 20 | 51 |\\n| Total | 66 | 35 | 101 |\\n\\nIf a tree represented in the table is selected at random, what is the probability of selecting a tree from site A, given that the tree is a red maple? (Express your answer as a decimal or fraction, not as a percent.)",
    "correctAnswer": "0.7",
    "explanation": "**Step 1: Identify conditional probability condition**\\nWe are given that the tree selected is a red maple. Looking at the \"Red maple\" row, the total number of red maples is 50.\\n\\n**Step 2: Find red maples at Site A**\\nThere are 35 red maples at Site A.\\n\\n**Step 3: Calculate probability**\\n$$P(\\text{Site A} \\mid \\text{Red maple}) = \\frac{35}{50} = \\frac{7}{10} = 0.7$$\\n\\n**Conclusion:**\\nThe correct answer is $0.7$ (or $7/10$).",
    "desmosEquation": "35 / 50",
    "hint": "Divide the number of Site A red maples (35) by the total number of red maples (50): $35/50 = 0.7$."
  },
  {
    "id": "pt7-m2-q35",
    "number": 35,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Medium",
    "type": "student_produced",
    "prompt": "A beaker containing a liquid is placed on a table. The function $g(t) = 295 + (361 - 295)(2.72)^{-0.07t}$ gives the approximate temperature, in kelvins, of the liquid $t$ minutes after the beaker was placed on the table. According to this function, what was the approximate temperature, in kelvins, of the liquid when the beaker was placed on the table?",
    "correctAnswer": "361",
    "explanation": "**Step 1: Evaluate the function at $t = 0$**\\nWhen the beaker is placed on the table, elapsed time is $t = 0$ minutes:\\n$$g(0) = 295 + (361 - 295)(2.72)^{-0.07(0)} = 295 + (361 - 295)(1) = 361$$\\n\\n**Conclusion:**\\nThe initial temperature of the liquid was $361$ kelvins.",
    "desmosEquation": "295 + (361 - 295) * (2.72)^0",
    "hint": "Set $t = 0$: any base raised to 0 equals 1, leaving $295 + (361 - 295) = 361$."
  },
  {
    "id": "pt7-m2-q36",
    "number": 36,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "For the exponential function $f$, the value of $f(1)$ is $k$, where $k$ is a constant. Which of the following equivalent forms of the function $f$ shows the value of $k$ as the coefficient or the base?",
    "options": [
      {
        "id": "A",
        "text": "$f(x) = 49(1.7)^{x+1}$"
      },
      {
        "id": "B",
        "text": "$f(x) = 85(1.7)^x$"
      },
      {
        "id": "C",
        "text": "$f(x) = 144.5(1.7)^{x-1}$"
      },
      {
        "id": "D",
        "text": "$f(x) = 245.65(1.7)^{x-2}$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Evaluate $f(1)$ in terms of the constant form**\\nWe want $f(1) = k$ to appear explicitly as the coefficient or base.\\nIn $f(x) = C \\cdot b^{x - 1}$, evaluating at $x = 1$ gives:\\n$$f(1) = C \\cdot b^{1 - 1} = C \\cdot b^0 = C$$\\nSo the coefficient $C$ directly equals $f(1) = k$.\\n\\n**Step 2: Check Choice (C)**\\nIn $f(x) = 144.5(1.7)^{x-1}$, $f(1) = 144.5$, which appears as the leading coefficient.\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "f(x) = 144.5(1.7)^{x-1}; f(1)",
    "hint": "When the exponent is $(x - 1)$, substituting $x = 1$ gives $b^0 = 1$, making the coefficient equal to $f(1)$."
  },
  {
    "id": "pt7-m2-q37",
    "number": 37,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "$$y = 9\\left(\\frac{a}{6}\\right)^{x+c} - b$$\\nHow many times does the graph of the given equation in the $xy$-plane cross the $x$-axis, where $a, b$, and $c$ are positive constants such that $a > 6$ and $b > c$?",
    "options": [
      {
        "id": "A",
        "text": "Zero"
      },
      {
        "id": "B",
        "text": "One"
      },
      {
        "id": "C",
        "text": "Two"
      },
      {
        "id": "D",
        "text": "Three"
      }
    ],
    "correctAnswer": "B",
    "explanation": "**Step 1: Analyze the exponential function**\\nSince $a > 6$, the base $\\frac{a}{6} > 1$. Therefore, $9\\left(\\frac{a}{6}\\right)^{x+c}$ is a strictly increasing function on $(-\\infty, \\infty)$.\\n\\n**Step 2: Determine range and $x$-intercepts**\\nAs $x \\to -\\infty$, $y \\to -b < 0$.\\nAs $x \\to +\\infty$, $y \\to +\\infty$.\\nSince the function is strictly increasing and continuous, it must cross $y = 0$ (the $x$-axis) exactly once by the Intermediate Value Theorem.\\n\\n**Conclusion:**\\nChoice (B) is correct.",
    "hint": "An exponential function of the form $A \\cdot B^{x+c} - b$ with base $> 1$ is strictly increasing from $-b$ to $\\infty$, crossing $y = 0$ exactly once."
  },
  {
    "id": "pt7-m2-q38",
    "number": 38,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "For a polynomial function $f$, the graph of $y = f(x)$ in the $xy$-plane contains the points $(-6, 0)$, $(7, 0)$, $(0, 0)$, and $(4, 0)$. Which of the following must be a factor of $f(x)$?",
    "options": [
      {
        "id": "A",
        "text": "$x^2 - 2x - 24$"
      },
      {
        "id": "B",
        "text": "$x^2 - x + 42$"
      },
      {
        "id": "C",
        "text": "$x^2 - 11x - 28$"
      },
      {
        "id": "D",
        "text": "$x^2 - 7x$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Identify the zeros of $f(x)$**\\nGiven $f(-6) = 0$, $f(7) = 0$, $f(0) = 0$, and $f(4) = 0$, the factors of $f(x)$ include $(x + 6)$, $(x - 7)$, $x$, and $(x - 4)$.\\n\\n**Step 2: Check products of pairs of factors**\\nMultiplying the factors $x$ and $(x - 7)$ gives:\\n$$x(x - 7) = x^2 - 7x$$\\nSince both $x$ and $(x - 7)$ are factors of $f(x)$, their product $x^2 - 7x$ must also be a factor of $f(x)$.\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "hint": "$x = 0$ and $x = 7$ are roots, so $x$ and $(x - 7)$ are factors. Their product is $x(x - 7) = x^2 - 7x$."
  },
  {
    "id": "pt7-m2-q39",
    "number": 39,
    "section": "math",
    "module": 2,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "In the given figure, $\\overline{NP}$ is the diameter of semicircle $O$. Angles $Q, R$, and $S$ are right angles, and point $P$ is the midpoint of $\\overline{NQ}$. If $PQ = 52$ feet and $NS = 18$ feet, the area of the figure can be expressed as $a\\pi + b$ square feet, where $a$ and $b$ are integers. What is the value of $a + b$?",
    "correctAnswer": "2210",
    "image": "/practice-tests/pt7_m2_q17_semicircle_geometry.png",
    "explanation": "**Step 1: Find dimensions of the semicircle**\\n$P$ is the midpoint of $NQ$ and $PQ = 52$, so diameter $NP = 52$ feet.\\nRadius $r = \\frac{52}{2} = 26$ feet.\\n$$\\text{Area of semicircle} = \\frac{1}{2}\\pi r^2 = \\frac{1}{2}\\pi (26^2) = \\frac{1}{2}\\pi (676) = 338\\pi\\text{ sq ft}$$\\nSo $a = 338$.\\n\\n**Step 2: Find area of rectangle $NQRS$**\\nLength $NQ = NP + PQ = 52 + 52 = 104$ feet.\\nHeight $NS = 18$ feet.\\n$$\\text{Area of rectangle} = 104 \\times 18 = 1,872\\text{ sq ft}$$\\nSo $b = 1,872$.\\n\\n**Step 3: Compute $a + b$**\\n$$a + b = 338 + 1,872 = 2,210$$\\n\\n**Conclusion:**\\nThe value of $a + b$ is $2210$.",
    "desmosEquation": "(1/2) * 26^2 + 104 * 18",
    "hint": "Semicircle area $= \\frac{1}{2}\\pi(26^2) = 338\\pi$, rectangle area $= 104 \\times 18 = 1872$. Sum $a + b = 338 + 1872 = 2210$."
  },
  {
    "id": "pt7-m2-q40",
    "number": 40,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "$$\\frac{1}{5xy} + xyz = \\frac{1}{4yz}$$\\nIn the given equation, $x, y$, and $z$ are positive numbers. Which expression is equivalent to $y$?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{5x - 4z}{20x^2z^2}$"
      },
      {
        "id": "B",
        "text": "$\\sqrt{\\frac{5x - 4z}{20x^2z^2}}$"
      },
      {
        "id": "C",
        "text": "$\\frac{1}{4xz^2 - 5x^2z}$"
      },
      {
        "id": "D",
        "text": "$\\sqrt{\\frac{1}{4xz^2 - 5x^2z}}$"
      }
    ],
    "correctAnswer": "B",
    "explanation": "**Step 1: Isolate the term containing $y$ in the numerator**\\n$$xyz = \\frac{1}{4yz} - \\frac{1}{5xy}$$\\n\\n**Step 2: Find a common denominator for the right side**\\n$$xyz = \\frac{5x - 4z}{20xyz}$$\\n\\n**Step 3: Multiply both sides by $y$ and divide by $xz$**\\n$$xy^2z = \\frac{5x - 4z}{20xz} \\implies y^2 = \\frac{5x - 4z}{20x^2z^2}$$\\n\\n**Step 4: Take the positive square root**\\n$$y = \\sqrt{\\frac{5x - 4z}{20x^2z^2}}$$\\n\\n**Conclusion:**\\nChoice (B) is correct.",
    "hint": "Subtract $\\frac{1}{5xy}$ from both sides, combine into $\\frac{5x - 4z}{20xyz}$, then multiply by $y$ to get $y^2 = \\frac{5x - 4z}{20x^2z^2}$."
  },
  {
    "id": "pt7-m2-q41",
    "number": 41,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "The equation $2|x - 5| = k$, where $k$ is a constant, has exactly one solution. Which of the following could be the value of $k$?",
    "options": [
      {
        "id": "A",
        "text": "$-5$ only"
      },
      {
        "id": "B",
        "text": "$-5$ or $5$"
      },
      {
        "id": "C",
        "text": "$0$ only"
      },
      {
        "id": "D",
        "text": "$5$ only"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Isolate the absolute value**\\n$$|x - 5| = \\frac{k}{2}$$\\n\\n**Step 2: Analyze the number of solutions based on $k$**\\n- If $\\frac{k}{2} < 0$ ($k < 0$), an absolute value cannot be negative, so there are 0 solutions.\\n- If $\\frac{k}{2} > 0$ ($k > 0$), $x - 5 = \\pm \\frac{k}{2}$, giving 2 distinct solutions.\\n- If $\\frac{k}{2} = 0$ ($k = 0$), $|x - 5| = 0 \\implies x = 5$, giving exactly 1 solution.\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "2|x - 5| = 0",
    "hint": "An absolute value equation $|x - a| = c$ has exactly one solution if and only if $c = 0$, so $k = 0$."
  },
  {
    "id": "pt7-m2-q42",
    "number": 42,
    "section": "math",
    "module": 2,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "The percent increase in mass of a certain red kangaroo from 80 days old to 160 days old was 676%. If this red kangaroo's mass was $k$ grams at 80 days old, which expression represents its mass, in grams, at 160 days old?",
    "options": [
      {
        "id": "A",
        "text": "$7.76k$"
      },
      {
        "id": "B",
        "text": "$6.76k$"
      },
      {
        "id": "C",
        "text": "$1.08k$"
      },
      {
        "id": "D",
        "text": "$0.08k$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Formula for percent increase**\\n$$\\text{New Mass} = \\text{Original Mass} + (\\text{Percent Increase} \\times \\text{Original Mass})$$\\n$$\\text{New Mass} = k + \\frac{676}{100}k = k + 6.76k = (1 + 6.76)k = 7.76k$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "1 + 6.76",
    "hint": "A 676% increase adds $6.76k$ to the initial mass $k$, giving $k + 6.76k = 7.76k$."
  },
  {
    "id": "pt7-m2-q43",
    "number": 43,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "The table shows three values of $x$ and their corresponding values of $g(x)$, where $g(x) = \\frac{f(x)}{x + 3}$ and $f$ is a linear function.\\n\\n| $x$ | $g(x)$ |\\n| :--- | :--- |\\n| $-21$ | $2$ |\\n| $-9$ | $0$ |\\n| $15$ | $4$ |\\n\\nWhat is the $y$-intercept of the graph of $y = f(x)$ in the $xy$-plane?",
    "options": [
      {
        "id": "A",
        "text": "$(0, -9)$"
      },
      {
        "id": "B",
        "text": "$(0, 3)$"
      },
      {
        "id": "C",
        "text": "$(0, 9)$"
      },
      {
        "id": "D",
        "text": "$(0, 27)$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Express $f(x)$ using $g(x)$**\\nSince $g(x) = \\frac{f(x)}{x + 3}$, we have $f(x) = g(x)(x + 3)$.\\n\\n**Step 2: Evaluate $f(x)$ at each given point**\\n- At $x = -21$: $f(-21) = 2(-21 + 3) = 2(-18) = -36$\\n- At $x = -9$: $f(-9) = 0(-9 + 3) = 0$\\n- At $x = 15$: $f(15) = 4(15 + 3) = 4(18) = 72$\\n\\n**Step 3: Find slope and $y$-intercept of linear function $f(x)$**\\n$$m = \\frac{0 - (-36)}{-9 - (-21)} = \\frac{36}{12} = 3$$\\nSince $f(-9) = 0$:\\n$$f(x) = 3(x + 9) = 3x + 27$$\\nAt $x = 0$, $f(0) = 27$.\\n\\n**Conclusion:**\\nThe $y$-intercept is $(0, 27)$, matching Choice (D).",
    "desmosEquation": "f(x) = 3x + 27; f(0)",
    "hint": "Use $f(x) = g(x)(x + 3)$ to find points on $f$: $(-9, 0)$ and $(15, 72)$. The slope is 3, so $f(x) = 3x + 27$."
  },
  {
    "id": "pt7-m2-q44",
    "number": 44,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "For groups of 25 or more people, a museum charges $28 per person for the first 25 people and $17 for each additional person. Which function $f$ gives the total charge, in dollars, for a tour group with $n$ people, where $n \\ge 25$?",
    "options": [
      {
        "id": "A",
        "text": "$f(n) = 17n + 275$"
      },
      {
        "id": "B",
        "text": "$f(n) = 17n + 28$"
      },
      {
        "id": "C",
        "text": "$f(n) = 17n + 700$"
      },
      {
        "id": "D",
        "text": "$f(n) = 45n - 425$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Set up the total cost expression**\\n- First 25 people: $25 \\times 28 = $700\\n- Additional people: $(n - 25)$ people at $17 each: $17(n - 25)$\\n\\n**Step 2: Simplify $f(n)$**\\n$$f(n) = 700 + 17(n - 25) = 700 + 17n - 425 = 17n + 275$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "f(n) = 17n + 275",
    "hint": "Base cost for first 25 is $25 \\times 28 = 700$. Add $17(n - 25)$ to get $17n + (700 - 425) = 17n + 275$."
  }
];

export function getPracticeTest7Module1(): Question[] {
  return OFFICIAL_PRACTICE_TEST_7_QUESTIONS.filter((q) => q.module === 1);
}

export function getPracticeTest7Module2(): Question[] {
  return OFFICIAL_PRACTICE_TEST_7_QUESTIONS.filter((q) => q.module === 2);
}

export function getPracticeTest7Full(): Question[] {
  return OFFICIAL_PRACTICE_TEST_7_QUESTIONS;
}
