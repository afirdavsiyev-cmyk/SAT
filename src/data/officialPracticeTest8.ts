import { Question } from '../types';

/**
 * Official Digital SAT Math Practice Test 8 (Official Turbo Test 23.11.2024)
 * Complete 44-Question Dataset
 * Module 1: Questions 1 – 22 (35 Minutes)
 * Module 2: Questions 23 – 44 (35 Minutes, Adaptive Track)
 */
export const OFFICIAL_PRACTICE_TEST_8_QUESTIONS: Question[] = [
  {
    "id": "pt8-m1-q01",
    "number": 1,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "The graph of the linear function $f$ is shown, where $y = f(x)$. What is the $y$-intercept of the graph of $f$?",
    "options": [
      {
        "id": "A",
        "text": "$(0, 6)$"
      },
      {
        "id": "B",
        "text": "$(0, 0)$"
      },
      {
        "id": "C",
        "text": "$(0, -6)$"
      },
      {
        "id": "D",
        "text": "$(-6, 0)$"
      }
    ],
    "correctAnswer": "C",
    "image": "/practice-tests/pt8_m1_q01_graph.png",
    "explanation": "**Step 1: Identify the $y$-intercept on the coordinate grid**\\nThe $y$-intercept is the point where the line intersects the vertical $y$-axis (where $x = 0$).\\nLooking at the graph, the line crosses the $y$-axis at $y = -6$.\\n\\n**Step 2: Write in coordinate form**\\n$$(0, -6)$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "y = -6",
    "hint": "Locate where the line crosses the vertical $y$-axis: at $(0, -6)$."
  },
  {
    "id": "pt8-m1-q02",
    "number": 2,
    "section": "math",
    "module": 1,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "Each rock in a collection of 70 rocks was classified as either igneous, metamorphic, or sedimentary, as shown in the frequency table.\\n\\n| Classification | Frequency |\\n| :--- | :--- |\\n| Igneous | 10 |\\n| Metamorphic | 38 |\\n| Sedimentary | 22 |\\n| Total | 70 |\\n\\nIf one of these rocks is selected at random, what is the probability of selecting a rock that is igneous?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{10}{70}$"
      },
      {
        "id": "B",
        "text": "$\\frac{10}{60}$"
      },
      {
        "id": "C",
        "text": "$\\frac{10}{38}$"
      },
      {
        "id": "D",
        "text": "$\\frac{10}{22}$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Calculate the probability**\\n$$\\text{Probability} = \\frac{\\text{Number of igneous rocks}}{\\text{Total number of rocks}} = \\frac{10}{70}$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "10 / 70",
    "hint": "Divide the number of igneous rocks (10) by the total number of rocks (70): $\\frac{10}{70}$."
  },
  {
    "id": "pt8-m1-q03",
    "number": 3,
    "section": "math",
    "module": 1,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "Each side of square A has a length of 13 inches. Each side of square A is multiplied by a scale factor of 3 to create square B. What is the length, in inches, of each side of square B?",
    "options": [
      {
        "id": "A",
        "text": "$10$"
      },
      {
        "id": "B",
        "text": "$16$"
      },
      {
        "id": "C",
        "text": "$39$"
      },
      {
        "id": "D",
        "text": "$169$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Apply the scale factor**\\n$$\\text{Side of square B} = 13 \\times 3 = 39\\text{ inches}$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "13 * 3",
    "hint": "Multiply the original side length of 13 inches by the scale factor of 3: $13 \\times 3 = 39$."
  },
  {
    "id": "pt8-m1-q04",
    "number": 4,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "The function $f(x) = \\frac{1}{9}(x - 6)^2 + 3$ gives a toy car's height above the ground $f(x)$, in inches, $x$ seconds after it started moving on an elevated track, where $0 \\le x \\le 10$. Which of the following is the best interpretation of the vertex of the graph of $y = f(x)$ in the $xy$-plane?",
    "options": [
      {
        "id": "A",
        "text": "The toy car's minimum height was 3 inches above the ground."
      },
      {
        "id": "B",
        "text": "The toy car's minimum height was 6 inches above the ground."
      },
      {
        "id": "C",
        "text": "The toy car's height was 3 inches above the ground when it started moving."
      },
      {
        "id": "D",
        "text": "The toy car's height was 6 inches above the ground when it started moving."
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Identify the vertex form**\\n$$f(x) = a(x - h)^2 + k$$\\nHere $a = \\frac{1}{9} > 0$, so the parabola opens upward, and the vertex $(h, k) = (6, 3)$ represents the minimum point.\\n\\n**Step 2: Interpret in context**\\nAt $x = 6$ seconds, the car achieves its minimum height of $3$ inches above the ground.\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "f(x) = (1/9)(x - 6)^2 + 3",
    "hint": "The vertex is $(6, 3)$, which gives the minimum height of 3 inches at 6 seconds."
  },
  {
    "id": "pt8-m1-q05",
    "number": 5,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "If $3x = 8$, what is the value of $21x$?",
    "options": [
      {
        "id": "A",
        "text": "$11$"
      },
      {
        "id": "B",
        "text": "$15$"
      },
      {
        "id": "C",
        "text": "$24$"
      },
      {
        "id": "D",
        "text": "$56$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Notice the relationship between $3x$ and $21x$**\\n$$21x = 7 \\times (3x)$$\\n\\n**Step 2: Substitute $3x = 8$**\\n$$21x = 7 \\times 8 = 56$$\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "desmosEquation": "7 * 8",
    "hint": "Multiply both sides of $3x = 8$ by 7 to get $21x = 56$."
  },
  {
    "id": "pt8-m1-q06",
    "number": 6,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "A car travels at a speed of at least 25 miles per hour but no more than 50 miles per hour for a certain part of a trip. Which inequality represents this situation, where $x$ is the speed of the car, in miles per hour, on this part of the trip?",
    "options": [
      {
        "id": "A",
        "text": "$x \\ge 25$"
      },
      {
        "id": "B",
        "text": "$x \\ge 50$"
      },
      {
        "id": "C",
        "text": "$25 \\le x \\le 50$"
      },
      {
        "id": "D",
        "text": "$x \\le 75$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Translate the verbal boundaries**\\n- \"At least 25\": $x \\ge 25$\\n- \"No more than 50\": $x \\le 50$\\n\\n**Step 2: Combine into a compound inequality**\\n$$25 \\le x \\le 50$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "25 <= x <= 50",
    "hint": "\"At least 25\" means $25 \\le x$, and \"no more than 50\" means $x \\le 50$. Combined: $25 \\le x \\le 50$."
  },
  {
    "id": "pt8-m1-q07",
    "number": 7,
    "section": "math",
    "module": 1,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "A list of 10 data values is shown:\\n$$10, 14, 22, 6, 24, 26, 14, 8, 8, 8$$\\nWhat is the mean of these data?",
    "options": [
      {
        "id": "A",
        "text": "$8$"
      },
      {
        "id": "B",
        "text": "$11$"
      },
      {
        "id": "C",
        "text": "$14$"
      },
      {
        "id": "D",
        "text": "$20$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Sum the 10 values**\\n$$\\text{Sum} = 10 + 14 + 22 + 6 + 24 + 26 + 14 + 8 + 8 + 8 = 140$$\\n\\n**Step 2: Divide by the number of values (10)**\\n$$\\text{Mean} = \\frac{140}{10} = 14$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "(10 + 14 + 22 + 6 + 24 + 26 + 14 + 8 + 8 + 8) / 10",
    "hint": "Add all 10 numbers to get 140, then divide by 10 to get 14."
  },
  {
    "id": "pt8-m1-q08",
    "number": 8,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "$$f(x) = 7x + 3$$\\nThe function $f$ gives the estimated height, in feet, of a willow tree $x$ years after its height was first measured. Which statement is the best interpretation of 3 in this context?",
    "options": [
      {
        "id": "A",
        "text": "The tree will be measured each year for 3 years."
      },
      {
        "id": "B",
        "text": "The tree is estimated to grow to a maximum height of 3 feet."
      },
      {
        "id": "C",
        "text": "The estimated height of the tree increased by 3 feet each year."
      },
      {
        "id": "D",
        "text": "The estimated height of the tree was 3 feet when it was first measured."
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Interpret the $y$-intercept of the linear model**\\nWhen $x = 0$ (the time when the tree was first measured), $f(0) = 7(0) + 3 = 3$ feet.\\n\\n**Conclusion:**\\nThe estimated initial height of the tree was 3 feet when first measured. Choice (D) is correct.",
    "desmosEquation": "f(x) = 7x + 3",
    "hint": "At $x = 0$ years, $f(0) = 3$, meaning initial height when first measured was 3 feet."
  },
  {
    "id": "pt8-m1-q09",
    "number": 9,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "Which expression is equivalent to $2x^3 + 8x^2y + xy^2 + 4y^3$?",
    "options": [
      {
        "id": "A",
        "text": "$(2x^3 + 4y)(x + y^2)$"
      },
      {
        "id": "B",
        "text": "$(2x^2 + y^2)(x + 4y)$"
      },
      {
        "id": "C",
        "text": "$(x^2 + y)(2x + 4y^2)$"
      },
      {
        "id": "D",
        "text": "$(2x^2 + y^3)(x + 4y)$"
      }
    ],
    "correctAnswer": "B",
    "explanation": "**Step 1: Factor by grouping**\\nGroup the first two terms and the last two terms:\\n$$(2x^3 + 8x^2y) + (xy^2 + 4y^3)$$\\n\\n**Step 2: Factor out the common monomial from each pair**\\n$$2x^2(x + 4y) + y^2(x + 4y)$$\\n\\n**Step 3: Factor out the common binomial $(x + 4y)$**\\n$$(2x^2 + y^2)(x + 4y)$$\\n\\n**Conclusion:**\\nChoice (B) is correct.",
    "desmosEquation": "2x^3 + 8x^2y + xy^2 + 4y^3",
    "hint": "Group terms: $2x^2(x + 4y) + y^2(x + 4y) = (2x^2 + y^2)(x + 4y)$."
  },
  {
    "id": "pt8-m1-q10",
    "number": 10,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Medium",
    "type": "student_produced",
    "prompt": "$$f(x) = x^3 + 8x + 17$$\\nFor the given function $f$, the graph of $y = f(x)$ in the $xy$-plane passes through the point $(0, b)$, where $b$ is a constant. What is the value of $b$?",
    "correctAnswer": "17",
    "explanation": "**Step 1: Substitute $x = 0$ into the function**\\n$$b = f(0) = (0)^3 + 8(0) + 17 = 17$$\\n\\n**Conclusion:**\\nThe value of $b$ is $17$.",
    "desmosEquation": "f(x) = x^3 + 8x + 17; f(0)",
    "hint": "The $y$-intercept $(0, b)$ is found by evaluating $f(0) = 17$."
  },
  {
    "id": "pt8-m1-q11",
    "number": 11,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "Scientists collected fallen acorns that each housed a colony of the ant species P. ohioensis and analyzed each colony's structure. For any of these colonies, if the colony has $x$ worker ants, the equation $y = 0.6x + 2.6$, where $20 \\le x \\le 110$, gives the predicted number of larvae, $y$, in the colony. If one of these colonies has 35 worker ants, which of the following is closest to the predicted number of larvae in the colony?",
    "options": [
      {
        "id": "A",
        "text": "$11$"
      },
      {
        "id": "B",
        "text": "$18$"
      },
      {
        "id": "C",
        "text": "$24$"
      },
      {
        "id": "D",
        "text": "$35$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Substitute $x = 35$ into the prediction equation**\\n$$y = 0.6(35) + 2.6 = 21 + 2.6 = 23.6$$\\n\\n**Step 2: Round to nearest whole integer**\\n$$23.6 \\approx 24$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "0.6 * 35 + 2.6",
    "hint": "Substitute $x = 35$: $0.6(35) + 2.6 = 21 + 2.6 = 23.6 \\approx 24$."
  },
  {
    "id": "pt8-m1-q12",
    "number": 12,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "$$b - 49 = \\frac{x}{y}$$\\nThe given equation relates the positive numbers $b$, $x$, and $y$. Which equation correctly expresses $x$ in terms of $b$ and $y$?",
    "options": [
      {
        "id": "A",
        "text": "$x = \\frac{b - 49}{y}$"
      },
      {
        "id": "B",
        "text": "$x = by - 49y$"
      },
      {
        "id": "C",
        "text": "$x = by - 49$"
      },
      {
        "id": "D",
        "text": "$x = \\frac{49b}{y}$"
      }
    ],
    "correctAnswer": "B",
    "explanation": "**Step 1: Multiply both sides by $y$**\\n$$x = y(b - 49)$$\\n\\n**Step 2: Distribute $y$**\\n$$x = by - 49y$$\\n\\n**Conclusion:**\\nChoice (B) is correct.",
    "desmosEquation": "x = y(b - 49)",
    "hint": "Multiply both sides by $y$: $x = y(b - 49) = by - 49y$."
  },
  {
    "id": "pt8-m1-q13",
    "number": 13,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "$$\\begin{cases} 2y = 5x + 16 \\\\ -2y = 7x - 22 \\end{cases}$$\\nThe solution to the given system of equations is $(x, y)$. What is the value of $24x$?",
    "options": [
      {
        "id": "A",
        "text": "$-12$"
      },
      {
        "id": "B",
        "text": "$6$"
      },
      {
        "id": "C",
        "text": "$12$"
      },
      {
        "id": "D",
        "text": "$24$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Add the two equations to eliminate $y$**\\n$$2y + (-2y) = (5x + 16) + (7x - 22)$$\\n$$0 = 12x - 6 \\implies 12x = 6$$\\n\\n**Step 2: Find $24x$**\\nSince $12x = 6$:\\n$$24x = 2 \\times (12x) = 2 \\times 6 = 12$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "2y = 5x + 16; -2y = 7x - 22",
    "hint": "Add the equations to eliminate $y$: $12x = 6$. Multiply by 2 to get $24x = 12$."
  },
  {
    "id": "pt8-m1-q14",
    "number": 14,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "student_produced",
    "prompt": "$$19.5x + 24.25y = 583$$\\nOdalys ordered mulch and river rock, which cost a total of $583, for her home. The given equation represents the relationship between the number of cubic yards of mulch, $x$, and the number of tons of river rock, $y$, Odalys ordered. How much more, in dollars, did a ton of river rock cost Odalys than a cubic yard of mulch?",
    "correctAnswer": "4.75",
    "explanation": "**Step 1: Read unit prices from the equation coefficients**\\n- Coefficient of $x$: cost per cubic yard of mulch = $19.50\\n- Coefficient of $y$: cost per ton of river rock = $24.25\\n\\n**Step 2: Find the difference**\\n$$24.25 - 19.50 = 4.75$$\\n\\n**Conclusion:**\\nA ton of river rock cost $4.75 more than a cubic yard of mulch.",
    "desmosEquation": "24.25 - 19.50",
    "hint": "Subtract the unit price of mulch ($19.50) from the unit price of river rock ($24.25): $24.25 - 19.50 = 4.75$."
  },
  {
    "id": "pt8-m1-q15",
    "number": 15,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "James purchased a certain baseball card on January 1. The function $f(x) = 55(1.04)^x$, where $0 \\le x \\le 10$, gives the predicted value, in dollars, of the baseball card $x$ years after James purchased it. What is the best interpretation of the statement \"$f(7)$ is approximately equal to 72\" in this context?",
    "options": [
      {
        "id": "A",
        "text": "When the baseball card's predicted value is approximately 72 dollars, it is 7% greater than the predicted value on January 1 of the previous year."
      },
      {
        "id": "B",
        "text": "When the baseball card's predicted value is approximately 72 dollars, it is 7 times the predicted value on January 1 of the previous year."
      },
      {
        "id": "C",
        "text": "From the day James purchased the baseball card to 7 years after James purchased the card, its predicted value increased by a total of approximately 72 dollars."
      },
      {
        "id": "D",
        "text": "7 years after James purchased the baseball card, its predicted value is approximately 72 dollars."
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Understand the input and output variables**\\n- Input $x = 7$: 7 years after the purchase date\\n- Output $f(7) \\approx 72$: the predicted value, in dollars, at that time\\n\\n**Conclusion:**\\nChoice (D) accurately states that 7 years after James purchased the card, its predicted value is approximately 72 dollars.",
    "desmosEquation": "f(x) = 55(1.04)^x; f(7)",
    "hint": "The input $x=7$ represents 7 years after purchase, and the output is the value ($72)."
  },
  {
    "id": "pt8-m1-q16",
    "number": 16,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "At what value of $x$ does the graph of $y = x^2 + 18x - 23$ reach its minimum in the $xy$-plane?",
    "options": [
      {
        "id": "A",
        "text": "$-9$"
      },
      {
        "id": "B",
        "text": "$-4$"
      },
      {
        "id": "C",
        "text": "$9$"
      },
      {
        "id": "D",
        "text": "$18$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Find the $x$-coordinate of the vertex**\\nFor a quadratic $y = ax^2 + bx + c$ with $a > 0$, the minimum occurs at:\\n$$x = -\\frac{b}{2a}$$\\nHere $a = 1$ and $b = 18$:\\n$$x = -\\frac{18}{2(1)} = -9$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "y = x^2 + 18x - 23",
    "hint": "Use $x = -b / (2a) = -18 / 2 = -9$."
  },
  {
    "id": "pt8-m1-q17",
    "number": 17,
    "section": "math",
    "module": 1,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "$$P(t) = 260(1.03)^{\\frac{3}{2}t}$$\\nThe function $P$ models the population, in thousands, of a certain city $t$ years after 2009. According to the model, the population is predicted to increase by $n\\%$ every 8 months. What is the value of $n$?",
    "options": [
      {
        "id": "A",
        "text": "$0.22$"
      },
      {
        "id": "B",
        "text": "$1.03$"
      },
      {
        "id": "C",
        "text": "$2$"
      },
      {
        "id": "D",
        "text": "$3$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Convert 8 months to years**\\n$$8\\text{ months} = \\frac{8}{12}\\text{ years} = \\frac{2}{3}\\text{ years}$$\\n\\n**Step 2: Evaluate the exponent over 8 months**\\nSubstitute $t = \\frac{2}{3}$ into the exponent $\\frac{3}{2}t$:\\n$$\\frac{3}{2} \\times \\frac{2}{3} = 1$$\\nSo after 8 months, the population is multiplied by $1.03^1 = 1.03$.\\n\\n**Step 3: Convert growth multiplier to percent increase**\\nA multiplier of $1.03$ represents a $3\\%$ increase, so $n = 3$.\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "desmosEquation": "P(t) = 260(1.03)^{(3/2)t}",
    "hint": "8 months is $\\frac{2}{3}$ year. The exponent $\\frac{3}{2} \\times \\frac{2}{3} = 1$, giving factor $1.03$, which is a $3\\%$ increase."
  },
  {
    "id": "pt8-m1-q18",
    "number": 18,
    "section": "math",
    "module": 1,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Medium",
    "type": "student_produced",
    "prompt": "How many centimeters are equivalent to 47 meters? (1 meter = 100 centimeters)",
    "correctAnswer": "4700",
    "explanation": "**Step 1: Convert meters to centimeters**\\n$$47\\text{ m} \\times 100\\frac{\\text{cm}}{\\text{m}} = 4,700\\text{ cm}$$\\n\\n**Conclusion:**\\nThe correct answer is $4700$.",
    "desmosEquation": "47 * 100",
    "hint": "Multiply 47 meters by 100 cm/meter to get 4,700 cm."
  },
  {
    "id": "pt8-m1-q19",
    "number": 19,
    "section": "math",
    "module": 1,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "Circle A has a radius of $3x$ and circle B has a radius of $135x$. The area of circle B is how many times the area of circle A?",
    "correctAnswer": "2025",
    "explanation": "**Step 1: Ratio of radii**\\n$$\\frac{r_B}{r_A} = \\frac{135x}{3x} = 45$$\\n\\n**Step 2: Ratio of areas is the square of the ratio of radii**\\n$$\\frac{\\text{Area}_B}{\\text{Area}_A} = \\left(\\frac{r_B}{r_A}\\right)^2 = 45^2 = 2,025$$\\n\\n**Conclusion:**\\nThe area of circle B is $2025$ times the area of circle A.",
    "desmosEquation": "(135 / 3)^2",
    "hint": "The ratio of radii is $135/3 = 45$. Area ratio is $45^2 = 2025$."
  },
  {
    "id": "pt8-m1-q20",
    "number": 20,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "The graph of a line in the $xy$-plane passes through the point $(1, 5)$ and crosses the $x$-axis at the point $(9, 0)$. The line crosses the $y$-axis at the point $(0, b)$. What is the value of $b$?",
    "correctAnswer": "5.625",
    "explanation": "**Step 1: Calculate the slope of the line**\\n$$m = \\frac{0 - 5}{9 - 1} = -\\frac{5}{8}$$\\n\\n**Step 2: Write the point-slope form and solve for $b$**\\n$$y - 0 = -\\frac{5}{8}(x - 9) \\implies y = -\\frac{5}{8}x + \\frac{45}{8}$$\\nAt $x = 0$, $b = \\frac{45}{8} = 5.625$.\\n\\n**Conclusion:**\\nThe value of $b$ is $5.625$ (or $45/8$).",
    "desmosEquation": "45 / 8",
    "hint": "Find slope $m = -5/8$, then evaluate $y$-intercept $b = -m(9) = \\frac{45}{8} = 5.625$."
  },
  {
    "id": "pt8-m1-q21",
    "number": 21,
    "section": "math",
    "module": 1,
    "domain": "Algebra",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "If $\\frac{x}{n} = 6.5$ and $\\frac{x}{4} = 26$, what is the value of $n$?",
    "correctAnswer": "16",
    "explanation": "**Step 1: Solve for $x$**\\n$$\\frac{x}{4} = 26 \\implies x = 26 \\times 4 = 104$$\\n\\n**Step 2: Solve for $n$**\\n$$\\frac{104}{n} = 6.5 \\implies n = \\frac{104}{6.5} = 16$$\\n\\n**Conclusion:**\\nThe value of $n$ is $16$.",
    "desmosEquation": "(26 * 4) / 6.5",
    "hint": "Find $x = 26 \\times 4 = 104$, then $n = 104 / 6.5 = 16$."
  },
  {
    "id": "pt8-m1-q22",
    "number": 22,
    "section": "math",
    "module": 1,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "For two acute angles, $\\angle Q$ and $\\angle R$, $\\cos(Q) = \\sin(R)$. The measures, in degrees, of $\\angle Q$ and $\\angle R$ are $x + 61$ and $4x + 4$, respectively. What is the value of $x$?",
    "options": [
      {
        "id": "A",
        "text": "$5$"
      },
      {
        "id": "B",
        "text": "$13$"
      },
      {
        "id": "C",
        "text": "$25$"
      },
      {
        "id": "D",
        "text": "$45$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Use the cofunction identity**\\nFor acute angles, $\\cos(Q) = \\sin(R)$ implies that $\\angle Q$ and $\\angle R$ are complementary:\\n$$Q + R = 90^\\circ$$\\n\\n**Step 2: Set up and solve the equation**\\n$$(x + 61) + (4x + 4) = 90$$\\n$$5x + 65 = 90 \\implies 5x = 25 \\implies x = 5$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "(90 - 65) / 5",
    "hint": "Acute angles with $\\cos(Q) = \\sin(R)$ add up to $90^\\circ$: $(x + 61) + (4x + 4) = 90$, so $5x = 25 \\implies x = 5$."
  },
  {
    "id": "pt8-m2-q23",
    "number": 23,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "Which expression is equivalent to $14(x^2 - 6)$?",
    "options": [
      {
        "id": "A",
        "text": "$14x^2 - 84$"
      },
      {
        "id": "B",
        "text": "$14x^2 - 20$"
      },
      {
        "id": "C",
        "text": "$12x^2 - 6$"
      },
      {
        "id": "D",
        "text": "$14x^2 + 84$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Distribute 14**\\n$$14(x^2 - 6) = 14x^2 - 14(6) = 14x^2 - 84$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "14 * 6",
    "hint": "Distribute 14: $14x^2 - 14(6) = 14x^2 - 84$."
  },
  {
    "id": "pt8-m2-q24",
    "number": 24,
    "section": "math",
    "module": 2,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "A scientist analyzed a soil sample with a mass of 900 grams and determined that it contained 189 grams of water. What is the percentage of water, by mass, in this soil sample?",
    "options": [
      {
        "id": "A",
        "text": "$9.9\\%$"
      },
      {
        "id": "B",
        "text": "$18.9\\%$"
      },
      {
        "id": "C",
        "text": "$21\\%$"
      },
      {
        "id": "D",
        "text": "$42\\%$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Calculate the percentage**\\n$$\\text{Percentage} = \\frac{189}{900} \\times 100\\% = \\frac{189}{9}\\% = 21\\%$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "(189 / 900) * 100",
    "hint": "Divide 189 by 900 and multiply by 100: $\\frac{189}{9} = 21\\%$."
  },
  {
    "id": "pt8-m2-q25",
    "number": 25,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "$$\\begin{cases} x + 5 = 11 \\\\ y = 3x^2 + 3 \\end{cases}$$\\nAt what point $(x, y)$ do the graphs of the equations in the given system intersect?",
    "options": [
      {
        "id": "A",
        "text": "$(6, 108)$"
      },
      {
        "id": "B",
        "text": "$(6, 111)$"
      },
      {
        "id": "C",
        "text": "$(11, 36)$"
      },
      {
        "id": "D",
        "text": "$(11, 366)$"
      }
    ],
    "correctAnswer": "B",
    "explanation": "**Step 1: Solve for $x$ in the first equation**\\n$$x + 5 = 11 \\implies x = 6$$\\n\\n**Step 2: Substitute $x = 6$ into the second equation**\\n$$y = 3(6)^2 + 3 = 3(36) + 3 = 108 + 3 = 111$$\\n\\n**Conclusion:**\\nThe intersection point is $(6, 111)$, matching Choice (B).",
    "desmosEquation": "3(6)^2 + 3",
    "hint": "Find $x = 6$, then $y = 3(6^2) + 3 = 108 + 3 = 111$."
  },
  {
    "id": "pt8-m2-q26",
    "number": 26,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "student_produced",
    "prompt": "If $\\frac{7}{4}p + 42 = 84$, what is the value of $7p$?",
    "correctAnswer": "168",
    "explanation": "**Step 1: Isolate the variable term**\\n$$\\frac{7}{4}p = 84 - 42 = 42$$\\n\\n**Step 2: Multiply both sides by 4 to get $7p$**\\n$$7p = 42 \\times 4 = 168$$\\n\\n**Conclusion:**\\nThe value of $7p$ is $168$.",
    "desmosEquation": "(84 - 42) * 4",
    "hint": "Subtract 42 to get $\\frac{7}{4}p = 42$, then multiply by 4 to get $7p = 168$."
  },
  {
    "id": "pt8-m2-q27",
    "number": 27,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Easy",
    "type": "multiple_choice",
    "prompt": "If $5(x + 4) = 4(x + 4) + 58$, what is the value of $x + 4$?",
    "options": [
      {
        "id": "A",
        "text": "$4$"
      },
      {
        "id": "B",
        "text": "$54$"
      },
      {
        "id": "C",
        "text": "$58$"
      },
      {
        "id": "D",
        "text": "$62$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Let $u = x + 4$**\\n$$5u = 4u + 58$$\\n\\n**Step 2: Subtract $4u$ from both sides**\\n$$u = 58$$\\n\\n**Conclusion:**\\nThe value of $x + 4$ is $58$, matching Choice (C).",
    "desmosEquation": "58",
    "hint": "Subtract $4(x + 4)$ from both sides to directly get $x + 4 = 58$."
  },
  {
    "id": "pt8-m2-q28",
    "number": 28,
    "section": "math",
    "module": 2,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "Circle N has a radius of 6 millimeters (mm). Circle M has an area of $121\\pi\\text{ mm}^2$. What is the total area, in $\\text{mm}^2$, of circles N and M?",
    "options": [
      {
        "id": "A",
        "text": "$127\\pi$"
      },
      {
        "id": "B",
        "text": "$133\\pi$"
      },
      {
        "id": "C",
        "text": "$145\\pi$"
      },
      {
        "id": "D",
        "text": "$157\\pi$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Calculate the area of Circle N**\\n$$\\text{Area}_N = \\pi r^2 = \\pi (6^2) = 36\\pi\\text{ mm}^2$$\\n\\n**Step 2: Add the two circle areas**\\n$$\\text{Total Area} = 36\\pi + 121\\pi = 157\\pi\\text{ mm}^2$$\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "desmosEquation": "36 + 121",
    "hint": "Area of Circle N is $\\pi(6^2) = 36\\pi$. Add $121\\pi$ to get $157\\pi$."
  },
  {
    "id": "pt8-m2-q29",
    "number": 29,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "What is the slope of the graph of $y = \\frac{1}{3}(2x + 12) + 7x$ in the $xy$-plane?",
    "options": [
      {
        "id": "A",
        "text": "$\\frac{7}{3}$"
      },
      {
        "id": "B",
        "text": "$\\frac{9}{3}$"
      },
      {
        "id": "C",
        "text": "$\\frac{23}{3}$"
      },
      {
        "id": "D",
        "text": "$\\frac{25}{3}$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Expand and collect $x$-terms**\\n$$y = \\frac{2}{3}x + 4 + 7x = \\left(\\frac{2}{3} + 7\\right)x + 4$$\\n$$\\frac{2}{3} + \\frac{21}{3} = \\frac{23}{3}$$\\n$$y = \\frac{23}{3}x + 4$$\\n\\n**Conclusion:**\\nThe slope is $\\frac{23}{3}$, matching Choice (C).",
    "desmosEquation": "2/3 + 7",
    "hint": "Expand: $\\frac{2}{3}x + 7x = \\frac{23}{3}x$, so the slope is $\\frac{23}{3}$."
  },
  {
    "id": "pt8-m2-q30",
    "number": 30,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "The function $f$ is defined by $f(x) = \\frac{x + 16}{5}$, and $f(a) = -19$, where $a$ is a constant. What is the value of $a$?",
    "options": [
      {
        "id": "A",
        "text": "$-111$"
      },
      {
        "id": "B",
        "text": "$-79$"
      },
      {
        "id": "C",
        "text": "$\\frac{79}{5}$"
      },
      {
        "id": "D",
        "text": "$-\\frac{3}{5}$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Set up the equation for $f(a)$**\\n$$\\frac{a + 16}{5} = -19$$\\n\\n**Step 2: Multiply by 5 and solve for $a$**\\n$$a + 16 = -19 \\times 5 = -95$$\\n$$a = -95 - 16 = -111$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "-19 * 5 - 16",
    "hint": "Multiply $-19$ by 5 to get $-95$, then subtract 16 to find $a = -111$."
  },
  {
    "id": "pt8-m2-q31",
    "number": 31,
    "section": "math",
    "module": 2,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "A data set of the orbital periods, rounded to the nearest whole number of Earth days, for 13 of Jupiter's moons is represented in the dot plot. An additional moon with an orbital period of 251 days is added to the original data set to create a new data set of 14 orbital periods. Which statement best compares the mean and median of the new data set to the mean and median of the original data set?",
    "options": [
      {
        "id": "A",
        "text": "The mean of the new data set is equal to the mean of the original data set, and the median of the new data set is equal to the median of the original data set."
      },
      {
        "id": "B",
        "text": "The mean of the new data set is equal to the mean of the original data set, and the median of the new data set is less than the median of the original data set."
      },
      {
        "id": "C",
        "text": "The mean of the new data set is less than the mean of the original data set, and the median of the new data set is less than the median of the original data set."
      },
      {
        "id": "D",
        "text": "The mean of the new data set is less than the mean of the original data set, and the median of the new data set is equal to the median of the original data set."
      }
    ],
    "correctAnswer": "D",
    "image": "/practice-tests/pt8_m2_q09_dotplot.png",
    "explanation": "**Step 1: Analyze the effect on the mean**\\nAll 13 original orbital periods lie between 720 and 732 days (with mean $\\approx 726$). Adding an extreme low outlier of 251 days significantly pulls the mean downward. Thus, the new mean is strictly less than the original mean.\\n\\n**Step 2: Analyze the effect on the median**\\n- For 13 moons, the median is the 7th value in sorted order, which is $726$.\\n- With 251 added at the far left (1st position), the new median is the average of the 7th and 8th values of the 14-item list. Since multiple values around the center are all 726, the 7th and 8th values are both 726, so the new median remains exactly 726.\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "hint": "Adding an extreme low value (251 vs ~726) decreases the mean, but the center clustered value (median) remains 726."
  },
  {
    "id": "pt8-m2-q32",
    "number": 32,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "For the linear function $p$, $p(c) = -2$, where $c$ is a constant, $p(5) = 34$, and the slope of the graph of $y = p(x)$ in the $xy$-plane is 6. For the linear function $t$, $t(c) = -4$ and $t(6) = 52$. What is the slope of the graph of $y = t(x)$ in the $xy$-plane?",
    "options": [
      {
        "id": "A",
        "text": "$-1$"
      },
      {
        "id": "B",
        "text": "$4$"
      },
      {
        "id": "C",
        "text": "$6$"
      },
      {
        "id": "D",
        "text": "$8$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Find the value of $c$ using the slope of $p$**\\n$$\\text{Slope of } p = \\frac{p(5) - p(c)}{5 - c} = 6$$\\n$$\\frac{34 - (-2)}{5 - c} = 6 \\implies \\frac{36}{5 - c} = 6 \\implies 5 - c = 6 \\implies c = -1$$\\n\\n**Step 2: Find the slope of linear function $t$**\\nSince $c = -1$, we have $t(-1) = -4$ and $t(6) = 52$:\\n$$\\text{Slope of } t = \\frac{t(6) - t(-1)}{6 - (-1)} = \\frac{52 - (-4)}{7} = \\frac{56}{7} = 8$$\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "desmosEquation": "(52 - (-4)) / (6 - (-1))",
    "hint": "Solve $\\frac{34 - (-2)}{5 - c} = 6$ to get $c = -1$. Then the slope of $t$ is $\\frac{52 - (-4)}{6 - (-1)} = \\frac{56}{7} = 8$."
  },
  {
    "id": "pt8-m2-q33",
    "number": 33,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "$$18x^2 - 24x + c = 0$$\\nIn the given equation, $c$ is a constant. The equation has exactly one solution. What is the value of $c$?",
    "correctAnswer": "8",
    "explanation": "**Step 1: Apply the discriminant condition for one solution**\\nA quadratic equation $ax^2 + bx + c = 0$ has exactly one real solution if and only if its discriminant $\\Delta = b^2 - 4ac = 0$.\\n\\n**Step 2: Solve for $c$**\\n$$(-24)^2 - 4(18)(c) = 0$$\\n$$576 - 72c = 0 \\implies 72c = 576 \\implies c = \\frac{576}{72} = 8$$\\n\\n**Conclusion:**\\nThe value of $c$ is $8$.",
    "desmosEquation": "24^2 / (4 * 18)",
    "hint": "Set discriminant $b^2 - 4ac = 0$: $576 - 72c = 0 \\implies c = 8$."
  },
  {
    "id": "pt8-m2-q34",
    "number": 34,
    "section": "math",
    "module": 2,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "A conservation specialist hung artificial nesting structures each in the shape of a right rectangular prism for a species of native owl. Each structure has a height of 11 inches. The length of each structure's base is $x$ inches, which is 1 inch more than the width of the structure's base. Which function $V$ gives the volume of each structure, in cubic inches, in terms of the length of the structure's base?",
    "options": [
      {
        "id": "A",
        "text": "$V(x) = 11x(x - 1)$"
      },
      {
        "id": "B",
        "text": "$V(x) = 11x(x + 1)$"
      },
      {
        "id": "C",
        "text": "$V(x) = x(x + 11)(x - 1)$"
      },
      {
        "id": "D",
        "text": "$V(x) = x(x + 11)(x + 1)$"
      }
    ],
    "correctAnswer": "A",
    "explanation": "**Step 1: Express dimensions in terms of $x$**\\n- Length: $x$\\n- Length is 1 inch more than width: $x = w + 1 \\implies w = x - 1$\\n- Height: $h = 11$\\n\\n**Step 2: Calculate volume**\\n$$V(x) = \\text{length} \\times \\text{width} \\times \\text{height} = x(x - 1)(11) = 11x(x - 1)$$\\n\\n**Conclusion:**\\nChoice (A) is correct.",
    "desmosEquation": "V(x) = 11x(x - 1)",
    "hint": "Length is $x$, width is $x - 1$, and height is 11. Volume is $11x(x - 1)$."
  },
  {
    "id": "pt8-m2-q35",
    "number": 35,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "$$\\frac{x + 1}{5x^2} = \\frac{k}{x}$$\\nIn the given equation, $k$ is a constant. The solution to the given equation is $\\frac{1}{224}$. What is the value of $k$?",
    "correctAnswer": "45",
    "explanation": "**Step 1: Simplify the equation for $x \\neq 0$**\\nMultiply both sides by $x$:\\n$$\\frac{x + 1}{5x} = k$$\\n\\n**Step 2: Substitute $x = \\frac{1}{224}$**\\nNumerator: $x + 1 = \\frac{1}{224} + 1 = \\frac{225}{224}$\\nDenominator: $5x = 5 \\times \\frac{1}{224} = \\frac{5}{224}$\\n\\n**Step 3: Evaluate $k$**\\n$$k = \\frac{\\frac{225}{224}}{\\frac{5}{224}} = \\frac{225}{5} = 45$$\\n\\n**Conclusion:**\\nThe value of $k$ is $45$.",
    "desmosEquation": "(1/224 + 1) / (5 * (1/224))",
    "hint": "Multiply by $x$ to get $k = \\frac{x + 1}{5x}$. For $x = 1/224$, $k = \\frac{225/224}{5/224} = 45$."
  },
  {
    "id": "pt8-m2-q36",
    "number": 36,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "The function $f$ is defined by $f(x) = -39x^2$. The function $g$ is a decreasing linear function. In the $xy$-plane, the graphs of $y = f(x)$ and $y = g(x)$ intersect at two points, $(h, j)$ and $(k, m)$, where $j > m$. When $g(x) < f(x)$, which of the following must also be true?",
    "options": [
      {
        "id": "A",
        "text": "$x > k$"
      },
      {
        "id": "B",
        "text": "$x < h$"
      },
      {
        "id": "C",
        "text": "$x > k$ or $x < h$"
      },
      {
        "id": "D",
        "text": "$h < x < k$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Order the $x$-coordinates $h$ and $k$**\\nSince $g$ is a decreasing linear function (negative slope), greater $y$-values correspond to smaller $x$-values.\\nGiven $j > m$, it follows that $h < k$.\\n\\n**Step 2: Determine where $g(x) < f(x)$**\\n$f(x) = -39x^2$ is a downward-opening parabola (concave down).\\nBetween its two intersection points with a line ($h < x < k$), a downward parabola lies above the secant line segment connecting $(h, j)$ and $(k, m)$ (or test any point: between roots of $f(x) - g(x) = 0$, the quadratic expression $-39x^2 - (mx + b)$ is positive, so $f(x) > g(x)$).\\nTherefore, $g(x) < f(x)$ precisely when $h < x < k$.\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "hint": "Since $g$ is decreasing and $j > m$, $h < k$. A concave-down quadratic lies above the line between its intersection points: $h < x < k$."
  },
  {
    "id": "pt8-m2-q37",
    "number": 37,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Medium",
    "type": "multiple_choice",
    "prompt": "One gallon of sealant costs $29 and will cover 300 square feet of a surface. A deck has a total surface area of $d$ square feet. Which equation represents the cost $c$, in dollars, of the sealant needed to cover the deck twice?",
    "options": [
      {
        "id": "A",
        "text": "$c = \\frac{300d}{29}$"
      },
      {
        "id": "B",
        "text": "$c = \\frac{600d}{29}$"
      },
      {
        "id": "C",
        "text": "$c = 29\\left(\\frac{d}{600}\\right)$"
      },
      {
        "id": "D",
        "text": "$c = 29\\left(\\frac{d}{150}\\right)$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Calculate total area to be covered**\\nCovering a deck with area $d$ twice requires covering $2d$ square feet.\\n\\n**Step 2: Calculate number of gallons needed**\\n$$\\text{Gallons} = \\frac{2d}{300} = \\frac{d}{150}$$\\n\\n**Step 3: Calculate total cost $c$**\\n$$c = 29 \\times \\text{Gallons} = 29\\left(\\frac{d}{150}\\right)$$\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "desmosEquation": "c = 29 * (d / 150)",
    "hint": "Covering twice requires $2d$ sq ft. Gallons needed is $\\frac{2d}{300} = \\frac{d}{150}$. Cost is $29(\\frac{d}{150})$."
  },
  {
    "id": "pt8-m2-q38",
    "number": 38,
    "section": "math",
    "module": 2,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Medium",
    "type": "student_produced",
    "prompt": "A triangular prism has a height of 9 centimeters (cm) and a volume of $234\\text{ cm}^3$. What is the area, in $\\text{cm}^2$, of the base of the prism? (The volume of a triangular prism is equal to $Bh$, where $B$ is the area of the base and $h$ is the height of the prism.)",
    "correctAnswer": "26",
    "explanation": "**Step 1: Use the prism volume formula**\\n$$V = Bh$$\\n$$234 = B \\times 9$$\\n\\n**Step 2: Solve for $B$**\\n$$B = \\frac{234}{9} = 26\\text{ cm}^2$$\\n\\n**Conclusion:**\\nThe base area is $26\\text{ cm}^2$.",
    "desmosEquation": "234 / 9",
    "hint": "Divide volume by height: $234 / 9 = 26$."
  },
  {
    "id": "pt8-m2-q39",
    "number": 39,
    "section": "math",
    "module": 2,
    "domain": "Problem-Solving & Data Analysis",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "An area of 56.00 square nautical miles is equivalent to $k$ square kilometers. To the nearest tenth, what is the value of $k$? (1 nautical mile = 1.852 kilometers)",
    "correctAnswer": "192.1",
    "explanation": "**Step 1: Find conversion factor for square nautical miles to square kilometers**\\n$$1\\text{ nautical mile}^2 = (1.852\\text{ km})^2 = 3.429904\\text{ km}^2$$\\n\\n**Step 2: Multiply by 56.00**\\n$$k = 56.00 \\times 3.429904 = 192.074624\\text{ km}^2$$\\n\\n**Step 3: Round to the nearest tenth**\\n$$192.074624 \\approx 192.1$$\\n\\n**Conclusion:**\\nThe value of $k$ is $192.1$.",
    "desmosEquation": "56 * 1.852^2",
    "hint": "Multiply 56 by $(1.852)^2$: $56 \\times 3.429904 \\approx 192.1$."
  },
  {
    "id": "pt8-m2-q40",
    "number": 40,
    "section": "math",
    "module": 2,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Hard",
    "type": "student_produced",
    "prompt": "A circle in the $xy$-plane has its center at $(-7, 3)$ and has a radius of 9. An equation of this circle is $x^2 + y^2 + ax + by + c = 0$, where $a, b$, and $c$ are constants. What is the value of $c$?",
    "correctAnswer": "-23",
    "explanation": "**Step 1: Write the standard equation of the circle**\\n$$(x - h)^2 + (y - k)^2 = r^2$$\\n$$(x + 7)^2 + (y - 3)^2 = 9^2 = 81$$\\n\\n**Step 2: Expand the equation**\\n$$(x^2 + 14x + 49) + (y^2 - 6y + 9) = 81$$\\n$$x^2 + y^2 + 14x - 6y + 58 = 81$$\\n\\n**Step 3: Subtract 81 to obtain general form**\\n$$x^2 + y^2 + 14x - 6y - 23 = 0$$\\nComparing to $x^2 + y^2 + ax + by + c = 0$ gives $c = -23$.\\n\\n**Conclusion:**\\nThe value of $c$ is $-23$.",
    "desmosEquation": "49 + 9 - 81",
    "hint": "Expand $(x+7)^2 + (y-3)^2 - 81 = 0$: constant term is $49 + 9 - 81 = -23$."
  },
  {
    "id": "pt8-m2-q41",
    "number": 41,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "$$\\begin{cases} y = x - c \\\\ y = -4(x - 6)^2 \\end{cases}$$\\nIn the given system of equations, $c$ is a constant. The system has two distinct real solutions. Which of the following could be the value of $c$?",
    "options": [
      {
        "id": "A",
        "text": "$1$"
      },
      {
        "id": "B",
        "text": "$5$"
      },
      {
        "id": "C",
        "text": "$\\frac{95}{16}$"
      },
      {
        "id": "D",
        "text": "$11$"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Set equations equal to each other**\\n$$-4(x^2 - 12x + 36) = x - c$$\\n$$-4x^2 + 48x - 144 = x - c \\implies 4x^2 - 47x + (144 - c) = 0$$\\n\\n**Step 2: Apply the discriminant condition for two distinct real solutions**\\n$$\\Delta = (-47)^2 - 4(4)(144 - c) > 0$$\\n$$2,209 - 16(144) + 16c > 0$$\\n$$2,209 - 2,304 + 16c > 0 \\implies 16c - 95 > 0 \\implies c > \\frac{95}{16} = 5.9375$$\\n\\n**Step 3: Evaluate the options**\\nAmong the options ($1, 5, \\frac{95}{16}, 11$), only $11 > 5.9375$.\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "desmosEquation": "47^2 - 16 * 144",
    "hint": "Find discriminant: $\\Delta = 16c - 95 > 0 \\implies c > 95/16 = 5.9375$. The only option greater than 5.9375 is 11."
  },
  {
    "id": "pt8-m2-q42",
    "number": 42,
    "section": "math",
    "module": 2,
    "domain": "Advanced Math",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "The functions $f$ and $g$ are defined by the equations shown, where $a$ and $b$ are integer constants, $a < b$ and $b < 0$. If $y = f(x)$ and $y = g(x)$ are graphed in the $xy$-plane, which of the following equations displays, as a constant or coefficient, the $y$-coordinate of the $y$-intercept of the graph of the corresponding function?\\n\\nI. $f(x) = a(4.2)^{x+b}$\\nII. $g(x) = a(4.2)^x + b$",
    "options": [
      {
        "id": "A",
        "text": "I only"
      },
      {
        "id": "B",
        "text": "II only"
      },
      {
        "id": "C",
        "text": "I and II"
      },
      {
        "id": "D",
        "text": "Neither I nor II"
      }
    ],
    "correctAnswer": "D",
    "explanation": "**Step 1: Evaluate the $y$-intercept for function I**\\nAt $x = 0$:\\n$$f(0) = a(4.2)^{0+b} = a(4.2)^b$$\\nNeither $a$ nor $b$ alone equals $a(4.2)^b$, so equation I does not display the $y$-intercept as a constant or coefficient.\\n\\n**Step 2: Evaluate the $y$-intercept for function II**\\nAt $x = 0$:\\n$$g(0) = a(4.2)^0 + b = a(1) + b = a + b$$\\nNeither $a$ nor $b$ alone equals $a + b$, so equation II does not display the $y$-intercept as a single constant or coefficient.\\n\\n**Conclusion:**\\nChoice (D) is correct.",
    "hint": "At $x = 0$, $f(0) = a(4.2)^b$ and $g(0) = a + b$. Neither equation displays its $y$-intercept as a single coefficient or constant."
  },
  {
    "id": "pt8-m2-q43",
    "number": 43,
    "section": "math",
    "module": 2,
    "domain": "Algebra",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "$$\\begin{cases} 5x + 4y = 3 \\\\ 15x + 12y = 9 \\end{cases}$$\\nFor each real number $r$, which of the following points lies on the graph of each equation in the $xy$-plane for the given system?",
    "options": [
      {
        "id": "A",
        "text": "$\\left(r, -\\frac{4r}{5} + \\frac{3}{5}\\right)$"
      },
      {
        "id": "B",
        "text": "$\\left(r, \\frac{5r}{4} + \\frac{3}{4}\\right)$"
      },
      {
        "id": "C",
        "text": "$\\left(-\\frac{4r}{5} + \\frac{3}{5}, r\\right)$"
      },
      {
        "id": "D",
        "text": "$\\left(\\frac{r}{3} + 3, -\\frac{r}{3} + 9\\right)$"
      }
    ],
    "correctAnswer": "C",
    "explanation": "**Step 1: Recognize dependent equations**\\nThe second equation is $3 \\times (5x + 4y = 3)$, so both equations represent the exact same line: $5x + 4y = 3$.\\n\\n**Step 2: Parametrize the line with $y = r$**\\nIf $y = r$:\\n$$5x + 4r = 3 \\implies 5x = -4r + 3 \\implies x = -\\frac{4r}{5} + \\frac{3}{5}$$\\n\\n**Step 3: Form coordinate point**\\n$$(x, y) = \\left(-\\frac{4r}{5} + \\frac{3}{5}, r\\right)$$\\n\\n**Conclusion:**\\nChoice (C) is correct.",
    "desmosEquation": "5x + 4y = 3",
    "hint": "Let $y = r$ and solve $5x + 4r = 3$ for $x$: $x = -\\frac{4r}{5} + \\frac{3}{5}$. Point is $(-\\frac{4r}{5} + \\frac{3}{5}, r)$."
  },
  {
    "id": "pt8-m2-q44",
    "number": 44,
    "section": "math",
    "module": 2,
    "domain": "Geometry & Trigonometry",
    "difficulty": "Hard",
    "type": "multiple_choice",
    "prompt": "In triangle $ABC$ and triangle $DEF$, sides $\\overline{AB}$ and $\\overline{DE}$ each have a side length of 10 inches, and angles $A$ and $D$ each have an angle measure of $40^\\circ$. Which of the following additional pieces of information is (are) sufficient to prove whether triangle $ABC$ is congruent to triangle $DEF$?\\n\\nI. The measures of angles $B$ and $C$ are equal.\\nII. The lengths of sides $\\overline{AC}$ and $\\overline{DF}$ are equal.\\nIII. The lengths of sides $\\overline{BC}$ and $\\overline{EF}$ are equal.",
    "options": [
      {
        "id": "A",
        "text": "I is sufficient, but II and III are not."
      },
      {
        "id": "B",
        "text": "II is sufficient, but I and III are not."
      },
      {
        "id": "C",
        "text": "III is sufficient, but I and II are not."
      },
      {
        "id": "D",
        "text": "II is sufficient and III is sufficient, but I is not."
      }
    ],
    "correctAnswer": "B",
    "explanation": "**Step 1: Test Condition I**\\nKnowing $\\angle B = \\angle C$ only tells us that $\\triangle ABC$ is isosceles with base angles $70^\\circ$. It provides no information about $\\triangle DEF$. Thus, I is NOT sufficient.\\n\\n**Step 2: Test Condition II**\\nWe are given $AB = DE = 10$ and $\\angle A = \\angle D = 40^\\circ$. If $AC = DF$, then two sides and their included angle are congruent ($AB = DE$, $\\angle A = \\angle D$, $AC = DF$). By the SAS Congruence Postulate, $\\triangle ABC \\cong \\triangle DEF$. Thus, II is sufficient.\\n\\n**Step 3: Test Condition III**\\nIf $BC = EF$, we have side $AB = DE$, non-included $\\angle A = \\angle D = 40^\\circ$, and opposite side $BC = EF$. This is the SSA (Side-Side-Angle) condition, which does not guarantee congruence because there can be two non-congruent triangles (the ambiguous case of the law of sines). Thus, III is NOT sufficient.\\n\\n**Conclusion:**\\nChoice (B) is correct.",
    "hint": "Condition II gives Side-Angle-Side (SAS) congruence ($AB=DE$, $\\angle A=\\angle D$, $AC=DF$), which is sufficient. III gives SSA, which is not."
  }
];

export function getPracticeTest8Module1(): Question[] {
  return OFFICIAL_PRACTICE_TEST_8_QUESTIONS.filter((q) => q.module === 1);
}

export function getPracticeTest8Module2(): Question[] {
  return OFFICIAL_PRACTICE_TEST_8_QUESTIONS.filter((q) => q.module === 2);
}

export function getPracticeTest8Full(): Question[] {
  return OFFICIAL_PRACTICE_TEST_8_QUESTIONS;
}
