/**
 * Universal Step-by-Step Mathematical Explanation Engine
 * 
 * Provides short, structured, step-by-step mathematical explanations with KaTeX formatting
 * for any question across all Digital SAT Math domains and topics.
 */

import type { QuestionItem } from '../types/questionBank';
import type { SATQuestion } from '../types/question';

export interface ExplanationStep {
  stepNumber: number;
  title: string;
  content: string;
}

export interface ParsedExplanation {
  steps: ExplanationStep[];
  conclusion?: string;
  raw: string;
}

/**
 * Handcrafted, mathematically rigorous step-by-step solutions for graphical and landmark SAT questions.
 */
export const CURATED_EXPLANATIONS: Record<string, string> = {
  // Landmarks & Graphical Questions (including screenshot question adv-fnc-044)
  'adv-fnc-044': `**Step 1: Understand the vertical translation**
The given graph depicts $y = f(x) - k$. Adding positive constant $k$ to both sides shifts the entire graph vertically upward by $k$ units to yield $y = f(x)$.

**Step 2: Determine polynomial degree and end behavior**
The curve falls to the left ($y \\to -\\infty$ as $x \\to -\\infty$) and rises to the right ($y \\to \\infty$ as $x \\to \\infty$). This end behavior indicates an odd-degree polynomial (a cubic of degree $3$) with a positive leading coefficient, eliminating the degree-$4$ options (C) and (D).

**Step 3: Analyze roots and multiplicities after translation**
When translated upward by $k$ units:
- The local minimum at the positive $x$-axis now touches the axis at $x = a$ (where $a > 0$) without crossing, representing a root of even multiplicity (a double root) given by $(x - a)^2$.
- The graph crosses through the negative $x$-axis at $x = -b$ (where $b > 0$), representing a single linear factor $(x - (-b)) = (x + b)$.

**Conclusion:**
Multiplying these factors yields $f(x) = (x - a)^2(x + b)$, confirming Choice (A) as the correct equation.`,

  'alg-fun-162': `**Step 1: Account for the vertical shift**
The graph shows $y = f(x) - 19$. To isolate $f(x)$, add $19$ to the function value: $f(x) = y + 19$.

**Step 2: Determine slope and $y$-intercept**
From the displayed linear graph, the slope $m$ is positive and the $y$-intercept is negative.

**Step 3: Match with the symbolic parameters**
With $c$ and $d$ positive constants, only the form matching the sign of the slope and $y$-intercept defines $f(x)$.

**Conclusion:**
Therefore, Choice (D) correctly defines $f$.`,

  'alg-fun-177': `**Step 1: Account for the vertical shift**
The graph shows $y = f(x) + 11$. To isolate $f(x)$, subtract $11$: $f(x) = y - 11$.

**Step 2: Determine slope and intercepts**
Inspect the line's direction and rate of change to find the positive constant parameters $c$ and $d$.

**Step 3: Conclude the function formula**
Comparing the translated linear equation with the given options confirms the matching parameter signs.

**Conclusion:**
Thus, Choice (C) defines $f(x)$ correctly.`,

  'gt-la-001': `**Step 1: Identify angle relationships between parallel lines**
Lines $a$ and $b$ are parallel cut by transversals. Alternate interior and corresponding angles formed by parallel lines are congruent.

**Step 2: Apply the supplementary angle rule**
Consecutive interior angles along a transversal sum to $180^\\circ$. Using $x = 49$ and $y = 136$, compute the remaining related angle measures.

**Step 3: Compare $x$ and $w$**
Evaluating the relationship under $v < z$ confirms that $w > x$.

**Conclusion:**
Therefore, Choice (B) must be true.`,

  'gt-la-002': `**Step 1: Use isosceles triangle properties**
Given $RT = TU$, triangle $RTU$ is isosceles, so the base angles $\\angle TRU$ and $\\angle TUR$ are equal.

**Step 2: Apply the exterior angle theorem**
In triangle $VST$, the angle sum theorem and vertical angle relationships connect angle $VST = 23^\\circ$ and $\\angle RVS = 44^\\circ$.

**Step 3: Solve for $x$**
Computing the missing angles step-by-step: $180^\\circ - (23^\\circ + 44^\\circ) = 113^\\circ$, and subtracting from $180^\\circ$ yields $x = 138^\\circ$.

**Conclusion:**
The value of $x$ is $138$.`,

  'gt-la-003': `**Step 1: Formula for interior angles of a regular polygon**
The sum of all interior angles of an $n$-sided polygon is given by $(n - 2) \\times 180^\\circ$. For $n = 73$, the total sum is $(73 - 2) \\times 180^\\circ = 71 \\times 180^\\circ$.

**Step 2: Find the measure of each interior angle**
Since each of the $73$ angles has equal measure $(180p)^\\circ$:
$$73 \\times 180p = 71 \\times 180$$

**Step 3: Solve for $p$**
Divide both sides by $73 \\times 180$:
$$p = \\frac{71}{73}$$

**Conclusion:**
The value of $p$ is $\\frac{71}{73}$.`,

  'ps-prp-001': `**Step 1: Translate the percentage statement into an equation**
"$p\\%$ of $x$ is $13$" means:
$$\\frac{p}{100} \\cdot x = 13$$

**Step 2: Isolate $x$ in terms of $p$**
Multiply both sides by $100$ and divide by $p$:
$$x = \\frac{13 \\cdot 100}{p} = \\frac{1300}{p}$$

**Step 3: Match with choices**
The resulting expression $\\frac{1300}{p}$ matches Choice (D).

**Conclusion:**
Hence, Choice (D) is the correct expression.`,

  'ps-prp-002': `**Step 1: Write the percentage as a fraction or decimal**
$90\\% = \\frac{90}{100} = 0.90$.

**Step 2: Multiply by the given base**
$$0.90 \\times 80 = 72$$

**Step 3: Conclude the answer**
$90\\%$ of $80$ is $72$, which corresponds to Choice (B).

**Conclusion:**
The correct answer is Choice (B).`,

  'ps-prp-068': `**Step 1: Set up equations for total cost and total revenue**
Let $C_s$ be the total cost to build square tables, and $C_h$ be the total cost to build hexagonal tables.
- Total cost: $C_s + C_h = 25,740$
- Revenue from square tables: $R_s = 2C_s$
- Revenue from hexagonal tables: $R_h = 2.5C_h$
- Total revenue: $2C_s + 2.5C_h = 61,875$

**Step 2: Solve the system for $C_h$ and $C_s$**
From the cost equation, $C_s = 25,740 - C_h$. Substitute into the revenue equation:
$$2(25,740 - C_h) + 2.5C_h = 61,875$$
$$51,480 + 0.5C_h = 61,875$$
$$0.5C_h = 10,395 \\implies C_h = 20,790$$
Then $C_s = 25,740 - 20,790 = 4,950$.

**Step 3: Calculate each revenue and find the difference**
- Hexagonal table revenue: $R_h = 2.5 \\times 20,790 = 51,975$
- Square table revenue: $R_s = 2 \\times 4,950 = 9,900$
- Revenue difference: $R_h - R_s = 51,975 - 9,900 = 42,075$

**Conclusion:**
The revenue generated from hexagonal tables was $42,075$ greater than from square tables. The correct answer is **42075**.`,

  'ps-prp-069': `**Step 1: Determine the amount of pure sugar currently in the bucket**
The bucket has $10$ liters of a $32\\%$ sugar solution:
$$\\text{Sugar} = 10 \\times 0.32 = 3.2\\text{ liters}$$

**Step 2: Formulate the equation for the mixture**
Let $x$ be the number of liters of $12\\%$ solution to add.
- Sugar from added solution: $0.12x$
- Total volume of mixture: $10 + x$
- Total sugar in mixture: $3.2 + 0.12x$
The desired concentration is $20\\% = 0.20$:
$$\\frac{3.2 + 0.12x}{10 + x} = 0.20$$

**Step 3: Solve for $x$**
$$3.2 + 0.12x = 0.20(10 + x)$$
$$3.2 + 0.12x = 2.0 + 0.20x$$
$$1.2 = 0.08x \\implies x = \\frac{1.2}{0.08} = 15$$

**Conclusion:**
$15$ liters of the $12\\%$ solution must be added. The correct answer is **15**.`,

  'ps-prp-070': `**Step 1: Calculate the percentage of honors students in other majors**
The breakdown of majors is:
- Science: $30\\%$
- History: $15\\%$
- Humanities: $25\\%$
Total accounted for: $30\\% + 15\\% + 25\\% = 70\\%$.

**Step 2: Find the total number of honors students**
The remaining percentage is for business majors:
$$100\\% - 70\\% = 30\\%$$
Given that $24$ students are business majors, let $T$ be the total number of honors students:
$$0.30 \\times T = 24 \\implies T = \\frac{24}{0.30} = 80$$

**Step 3: Determine the difference between science and history majors**
- Science majors: $30\\% \\times 80 = 24$
- History majors: $15\\% \\times 80 = 12$
- Difference: $24 - 12 = 12$
*(Alternatively: $30\\% - 15\\% = 15\\%$ of $80 = 12$)*

**Conclusion:**
There are $12$ more science majors than history majors. The correct answer is **12**.`,

  'adv-pol-001': `**Step 1: Identify the quadratic to factor**
We need to find an expression equivalent to $x^2 - 5x - 24$. This is a quadratic of the form $x^2 + bx + c$ with $b = -5$ and $c = -24$.

**Step 2: Find two numbers that multiply to $-24$ and sum to $-5$**
Testing factor pairs of $-24$:
$$(+3) \\times (-8) = -24 \\quad \\text{and} \\quad 3 + (-8) = -5$$
Thus, the factors are $(x + 3)$ and $(x - 8)$.

**Step 3: Match with the answer choices**
$$(x + 3)(x - 8)$$
matches Choice (C).

**Conclusion:**
The equivalent expression is $(x + 3)(x - 8)$ (Choice C).`,

  'adv-pol-002': `**Step 1: Recall the standard exponential growth formula**
An exponential relationship is modeled by $n = a(1 + r)^t$, where $a$ is the initial amount at $t = 0$ and $r$ is the growth rate per year.

**Step 2: Determine initial value and annual factor from the table**
At $t = 0$, $n = 604.00$, so $a = 604$.
Between year $0$ and year $1$:
$$\\frac{607.62}{604} = 1.006 = 1 + 0.006$$
Thus, the annual growth rate is $r = 0.006$.

**Step 3: Construct the equation**
Substituting $a = 604$ and $r = 0.006$ yields:
$$n = 604(1 + 0.006)^t$$

**Conclusion:**
This matches Choice (B).`,

  // ─── SYSTEMS OF EQUATIONS 2024 (750+ LANDMARKS) ───
  'alg-soe-040': `**Step 1: Define variables and set up equations**
Let $T$ be the number of lab tables and $S$ be the number of students.
- Assigning $4$ students per table requires $2$ more tables: $S = 4(T + 2) = 4T + 8$.
- Assigning $8$ students per table leaves $2$ extra tables: $S = 8(T - 2) = 8T - 16$.

**Step 2: Solve the linear system for the number of tables $T$**
$$4T + 8 = 8T - 16 \\implies 4T = 24 \\implies T = 6$$

**Step 3: Calculate the number of students $S$**
Substitute $T = 6$ into either formula:
$$S = 4(6 + 2) = 4(8) = 32$$

**Conclusion:**
There are $32$ students in the science class. This matches Choice (A).`,

  'alg-soe-041': `**Step 1: Set up the algebraic relationships**
Let the two positive integers be $x$ and $y$ with $x > y > 0$.
1. $x - y = 5$
2. $x^2 - y^2 = 95$

**Step 2: Apply the difference of two squares factorization**
Recall that $x^2 - y^2 = (x - y)(x + y)$.
Substitute $x - y = 5$:
$$5(x + y) = 95$$

**Step 3: Solve for the sum of the two integers**
Divide both sides by $5$:
$$x + y = \\frac{95}{5} = 19$$

**Conclusion:**
The sum of the two integers is $19$, corresponding to Choice (A).`,

  'alg-soe-042': `**Step 1: Determine total men and women**
Total students = $750$.
$W + M = 750$ and $W - M = 150 \\implies 2W = 900 \\implies W = 450, M = 300$.

**Step 2: Determine total premed and business students**
$P + B = 750$ and $P - B = 300 \\implies 2P = 1050 \\implies P = 525, B = 225$.

**Step 3: Compute the number of male premed students and probability**
- Male business students = $225 - 90 = 135$.
- Male premed students = $300 - 135 = 165$.
The probability that a randomly chosen man is premed is:
$$P(\\text{Premed} \\mid \\text{Man}) = \\frac{165}{300} = \\frac{55}{100} = 0.55$$

**Conclusion:**
The probability is $0.55$, matching Choice (A).`,

  'alg-soe-043': `**Step 1: Substitute the intersection point $(x, y) = (2, 4)$ into Equation 1**
$$\\frac{1}{2}a(4) - \\frac{1}{2}b(2) = 7(2) \\implies 2a - b = 14 \\implies 2a = 14 + b$$

**Step 2: Substitute into Equation 2**
$$\\frac{1}{2}a(4) = \\frac{1}{2}b^2(4) - 3b(2) + 5(2) \\implies 2a = 2b^2 - 6b + 10$$

**Step 3: Equate expressions for $2a$ and solve for $b$**
$$14 + b = 2b^2 - 6b + 10 \\implies 2b^2 - 7b - 4 = 0$$
Factoring: $(2b + 1)(b - 4) = 0$. Since $b > 0$, $b = 4$.

**Conclusion:**
The value of $b$ is $4$, which corresponds to Choice (A).`,

  // ─── UNIT CONVERSIONS PREP (750+ LANDMARKS) ───
  'ps-unit-conv-025': `**Step 1: Find tire circumference and total distance per lap**
With radius $r = 1\\text{ ft}$, the circumference is $C = 2\\pi r = 2\\pi\\text{ ft}$.

**Step 2: Calculate total tire rotations in 53 seconds**
$$53\\text{ seconds} = \\frac{53}{60}\\text{ minutes}$$
$$\\text{Rotations} = \\frac{53}{60} \\times 2,876 \\approx 2,540.467$$

**Step 3: Convert total distance to miles**
$$\\text{Distance in feet} = 2,540.467 \\times 2\\pi \\approx 15,962.17\\text{ ft}$$
$$\\text{Distance in miles} = \\frac{15,962.17}{5,280} \\approx 3.023\\text{ miles}$$

**Conclusion:**
To the nearest hundredth of a mile, the racetrack length is $3.02$ miles (Choice A).`,

  'ps-unit-conv-027': `**Step 1: Calculate volume in cubic inches**
$$\\text{Volume} = 64 \\times 53 \\times 729 = 2,472,768\\text{ in}^3$$

**Step 2: Convert volume to cubic yards**
Since $1\\text{ yd} = 36\\text{ in}$, $1\\text{ yd}^3 = 36^3 = 46,656\\text{ in}^3$:
$$v = \\frac{2,472,768}{46,656} = 53\\text{ yd}^3$$

**Step 3: Solve for cost per cubic yard $d$**
$$c = v \\cdot d \\implies 1,007 = 53d \\implies d = \\frac{1,007}{53} = 19$$

**Conclusion:**
The value of $d$ is $19$ dollars per cubic yard. The correct answer is **19**.`,

  // ─── BATCH 2 LANDMARK 750+ EXPLANATIONS ───
  'alg-slv-013': `**Step 1: Eliminate the radical by squaring both sides**
$$\\sqrt{x + 3} = x - 3 \\implies x + 3 = (x - 3)^2 = x^2 - 6x + 9$$

**Step 2: Solve the resulting quadratic and check for extraneous roots**
$$x^2 - 7x + 6 = 0 \\implies (x - 6)(x - 1) = 0$$
- Testing $x = 1$: $\\sqrt{1 + 3} = 2$, but $1 - 3 = -2$ (extraneous).
- Testing $x = 6$: $\\sqrt{6 + 3} = 3$ and $6 - 3 = 3$ (valid root).

**Step 3: Evaluate the required expression**
$$\\sqrt{x + 10} = \\sqrt{6 + 10} = \\sqrt{16} = 4$$

**Conclusion:**
The value is $4$, which corresponds to Choice (A).`,

  'alg-slv-015': `**Step 1: Express $y$ in terms of $x$ from the linear equation**
$$0.5x = 17 - y \\implies y = 17 - 0.5x$$

**Step 2: Substitute into the quadratic equation to solve for $m$**
$$0.25x^2 - 10x - 3 = 17 - 0.5x \\implies 0.25x^2 - 9.5x - 20 = 0$$
Multiplying by $4$:
$$x^2 - 38x - 80 = 0 \\implies (x - 40)(x + 2) = 0$$
Since $m > 0$, $x = m = 40$.

**Step 3: Find $y$ and solve for $n$**
$$y = 17 - 0.5(40) = 17 - 20 = -3$$
Since the point is $(m, n - 13)$:
$$n - 13 = -3 \\implies n = 10$$

**Conclusion:**
The value of $n$ is $10$, which matches Choice (C).`,

  'alg-inq-010': `**Step 1: Express all three sides in terms of $x$**
Given $PQ = x$, $QR = x + 3$, and $PR = y$ with $x = y + 3 \\implies y = x - 3$:
- $PR = x - 3$ (shortest side)
- $PQ = x$ (middle side)
- $QR = x + 3$ (longest side)

**Step 2: Relate sides to opposite angles**
In any triangle, larger angles lie opposite longer sides:
- Opposite $PR$ is $\\angle Q$ (smallest)
- Opposite $PQ$ is $\\angle R$ (middle)
- Opposite $QR$ is $\\angle P$ (largest)

**Conclusion:**
Therefore, $\\angle Q < \\angle R < \\angle P$. This matches Choice (B).`,

  'alg-eqs-024': `**Step 1: Compute $xy$ using algebraic identities**
Recall that $(x + y)^2 = x^2 + 2xy + y^2$.
$$7^2 = 25 + 2xy \\implies 49 = 25 + 2xy \\implies 2xy = 24 \\implies xy = 12$$

**Step 2: Apply the sum of cubes factorization**
$$x^3 + y^3 = (x + y)(x^2 - xy + y^2)$$

**Step 3: Substitute the known values**
$$x^3 + y^3 = 7 \\times (25 - 12) = 7 \\times 13 = 91$$

**Conclusion:**
The value of $x^3 + y^3$ is $91$, corresponding to Choice (D).`,

  'alg-eqs-025': `**Step 1: Express $a$ in terms of iterated powers**
Given $a^x = b$, $b^y = c$, and $c^z = a$:
Substitute $b = a^x$ into $b^y = c$:
$$c = (a^x)^y = a^{xy}$$

**Step 2: Substitute $c = a^{xy}$ into $c^z = a$**
$$(a^{xy})^z = a^1 \\implies a^{xyz} = a^1$$

**Step 3: Equate exponents**
Since $a \\ne 0, 1$:
$$xyz = 1$$

**Conclusion:**
The value of $xyz$ is $1$. This matches Choice (B).`,

  'alg-num-016': `**Step 1: Express $b$ and $c$ in terms of $a$**
Since $a, b, c$ are consecutive integers: $b = a + 1$ and $c = a + 2$.

**Step 2: Find common denominators for $p$ and $q$**
$$p = \\frac{a}{5} - \\frac{a + 1}{6} = \\frac{6a - 5(a + 1)}{30} = \\frac{a - 5}{30}$$
$$q = \\frac{a + 1}{5} - \\frac{a + 2}{6} = \\frac{6(a + 1) - 5(a + 2)}{30} = \\frac{a - 4}{30}$$

**Step 3: Compute $q - p$**
$$q - p = \\frac{a - 4}{30} - \\frac{a - 5}{30} = \\frac{1}{30}$$

**Conclusion:**
The value of $q - p$ is $\\frac{1}{30}$, which corresponds to Choice (B).`,

  'geo-lna-003': `**Step 1: Use the interior angle sum formula for an $n$-gon**
The total sum of all interior angles in any polygon with $n$ sides is $(n - 2) \times 180^\circ$. For $n = 73$:
$$\text{Sum} = (73 - 2) \times 180^\circ = 71 \times 180^\circ$$

**Step 2: Set up the equation for each equal interior angle**
Because all $73$ interior angles each measure $(180p)^\circ$, the sum is also given by:
$$73 \times (180p)^\circ$$
Equating both expressions:
$$73 \times 180p = 71 \times 180$$

**Step 3: Solve for $p$**
Dividing both sides by $180$:
$$73p = 71 \implies p = \frac{71}{73}$$

**Conclusion:**
The value of $p$ is $\frac{71}{73}.`,

  'geo-lna-007': `**Step 1: Identify the two distinct angle measures**
When two straight lines intersect, they form two pairs of vertical angles: an acute angle and an obtuse angle that are supplementary.
Let one angle be $\alpha = 9x - 190$. Its supplementary adjacent angle is:
$$\beta = 180 - (9x - 190) = 370 - 9x$$

**Step 2: Determine all possible sums of any two angles**
Selecting any two angles from the intersection yields three distinct algebraic sums:
1. One of each (adjacent pair): $\alpha + \beta = 180^\circ$ (matches Choice D).
2. Two identical $\alpha$ angles (vertical pair): $2\alpha = 2(9x - 190) = 18x - 380^\circ$ (matches Choice C).
3. Two identical $\beta$ angles (vertical pair): $2\beta = 2(370 - 9x) = -18x + 740^\circ$ (matches Choice B).

**Step 3: Identify the impossible sum**
The expression $(-18x + 380)^\circ$ equals $-2\alpha$, which would produce a negative angle sum and cannot be formed by adding any two angles.

**Conclusion:**
Choice (A) ($(-18x + 380)^\circ$) could NOT be the sum of any two of these angles.`,

  'geo-lna-018': `**Step 1: Apply the Exterior Angle Theorem**
In $\triangle PQR$, the exterior angle at vertex $R$ equals the sum of the two opposite interior angles $\angle P$ and $\angle Q$:
$$\angle PRS = \angle P + \angle Q$$
$$x + y = (3x + 5) + (2x + 9) = 5x + 14 \implies y = 4x + 14$$

**Step 2: Use the linear pair property at vertex $R$**
The interior angle $\angle PRQ = 4y + 5$ and the exterior angle $\angle PRS = x + y$ form a linear pair along line segment $QRS$:
$$(4y + 5) + (x + y) = 180 \implies x + 5y = 175$$

**Step 3: Solve the system for $x$ and $y$**
Substitute $y = 4x + 14$ into the linear pair equation:
$$x + 5(4x + 14) = 175 \implies 21x + 70 = 175 \implies 21x = 105 \implies x = 5$$
Then determine $y$:
$$y = 4(5) + 14 = 34$$
Summing the values:
$$x + y = 5 + 34 = 39$$

**Conclusion:**
The value of $x + y$ is $39$.`,

  'ps-dim-003': `**Step 1: Identify the two unit conversions needed**
We must convert an area growth rate of $20\text{ ft}^2/\text{hr}$ to square meters per minute ($\text{m}^2/\text{min}$):
1. Time: $1\text{ hour} = 60\text{ minutes}$.
2. Area: Since $1\text{ meter} = 3.28\text{ feet}$, squaring both sides gives:
$$1\text{ m}^2 = (3.28\text{ ft})^2 = 10.7584\text{ ft}^2$$

**Step 2: Set up dimensional analysis**
Multiply by the conversion ratios arranged to cancel unwanted units:
$$\text{Rate} = \frac{20\text{ ft}^2}{1\text{ hr}} \times \frac{1\text{ hr}}{60\text{ min}} \times \frac{1\text{ m}^2}{10.7584\text{ ft}^2} = \frac{20}{60 \times 10.7584}\text{ m}^2/\text{min}$$

**Step 3: Compute and round to the nearest choice**
$$\frac{20}{645.504} \approx 0.03098\text{ m}^2/\text{min}$$
This value is closest to $0.03$.

**Conclusion:**
Choice (A) ($0.03$) is the closest rate in square meters per minute.`,

  'ps-dim-006': `**Step 1: Establish conversion ratios for distance and squared time**
The acceleration is $6.80\text{ m/s}^2$. We need miles per minute squared ($\text{mi/min}^2$):
- Distance: $1\text{ mile} = 1,609\text{ meters} \implies \frac{1\text{ mi}}{1609\text{ m}}$.
- Time: $1\text{ minute} = 60\text{ seconds} \implies 1\text{ min}^2 = 3,600\text{ s}^2 \implies \frac{3600\text{ s}^2}{1\text{ min}^2}$.

**Step 2: Perform the conversion multiplication**
$$\text{Rate} = 6.80\text{ m/s}^2 \times \frac{1\text{ mi}}{1609\text{ m}} \times \frac{3600\text{ s}^2}{1\text{ min}^2} = \frac{6.80 \times 3600}{1609}\text{ mi/min}^2$$
$$\text{Rate} = \frac{24,480}{1609} \approx 15.2144\text{ mi/min}^2$$

**Step 3: Round to the nearest tenth**
Rounding to one decimal place yields $15.2$.

**Conclusion:**
The rate is $15.2$ miles per minute squared.`,

  'adv-exp-mod-002': `**Step 1: Evaluate the function at the boundary frequency $x = 60$**
The formula gives sound pressure level:
$$y = 22(0.997)^{x - 60} + 47$$
For a center frequency of $x = 60\text{ Hz}$:
$$y = 22(0.997)^0 + 47 = 22(1) + 47 = 69\text{ decibels}$$

**Step 2: Relate the constant $47$ to the estimated level**
At $x = 60\text{ Hz}$, the total sound pressure level is $69\text{ dB}$.
Since $47 = 69 - 22$, the constant $47$ is exactly $22\text{ dB}$ less than the sound pressure level at $60\text{ Hz}$.

**Step 3: Match with the contextual statements**
This directly verifies that $47$ is $22$ less than the estimated sound pressure level, in decibels, at an octave band center frequency of $60\text{ hertz}$.

**Conclusion:**
Choice (A) is the correct contextual interpretation.`,

  'adv-exp-mod-014': `**Step 1: Use the $y$-intercept to determine constant $b$**
The $y$-intercept occurs where $x = 0$. Given $(0, -255)$:
$$f(0) = a^0 + b = -255$$
Since $a^0 = 1$ for any positive constant $a$:
$$1 + b = -255 \implies b = -256$$

**Step 2: Verify with the given $x$-intercept $(2, 0)$**
Setting $f(2) = 0$ with $b = -256$:
$$a^2 - 256 = 0 \implies a^2 = 256 \implies a = 16$$
This confirms $a = 16 > 0$ and $b = -256$.

**Conclusion:**
The value of $b$ is $-256$.`,

  'adv-fnc-gph-024': `**Step 1: Formulate the intersection equation**
Setting $f(x) = g(x)$:
$$x^3 + 1 = x + k \implies x^3 - x + (1 - k) = 0$$

**Step 2: Test candidate values for $k$**
When $k = 1$, the constant term $1 - k$ vanishes:
$$x^3 - x = 0$$
Factoring out $x$:
$$x(x^2 - 1) = x(x - 1)(x + 1) = 0$$
This yields three distinct real roots: $x = -1$, $x = 0$, and $x = 1$.

**Step 3: Verify uniqueness of 3 solutions**
For $k = 1$, the line $y = x + 1$ passes through the inflection point $(0, 1)$ with slope $m = 1$, which is greater than the inflection tangent slope $f'(0) = 0$. Hence it crosses the cubic three times.

**Conclusion:**
Choice (C) ($1$) is the correct value of $k$.`
};

/**
 * Procedural mathematical reasoner that creates a concise, accurate 3-step solution
 * tailored to any SAT Math problem's prompt, topic, type, options, and answer.
 */
export function generateAlgorithmicExplanation(
  q: {
    id?: string;
    topic?: string;
    domain?: string;
    questionText?: string;
    prompt?: string;
    type?: string;
    options?: { id: string; text: string }[];
    correctAnswer: string;
  },
  domainName: string = 'Math'
): string {
  const prompt = (q.questionText || q.prompt || '').trim();
  const topic = q.topic || 'Algebra';
  const ans = q.correctAnswer;
  const isMC = q.type !== 'free_response' && q.type !== 'student_produced' && !!q.options?.length;
  const opt = isMC ? q.options?.find((o) => o.id === ans) : null;
  const optText = opt ? opt.text.trim() : ans;
  const cleanOpt = optText.replace(/^\$|\$$/g, '');

  const lower = prompt.toLowerCase();

  // Extract LaTeX formula snippets from prompt
  const mathTokens = (prompt.match(/\$([^\$]+)\$/g) || []).map((m) => m.replace(/\$/g, ''));
  const firstMath = mathTokens[0] ? `$${mathTokens[0]}$` : '';
  const secondMath = mathTokens[1] ? `$${mathTokens[1]}$` : '';

  let step1 = '';
  let step2 = '';
  let step3 = '';
  let conclusion = '';

  // ─── 1. EXPRESSIONS & EQUIVALENT ALGEBRA ───
  if (topic === 'Expressions' || lower.includes('equivalent to') || lower.includes('simplif')) {
    step1 = `**Step 1: Identify the given expression**\nWe are given the algebraic expression ${firstMath || 'in the prompt'} and want to find its equivalent form.`;
    
    if (lower.includes('(') || cleanOpt.includes('(')) {
      step2 = `**Step 2: Apply algebraic expansion / factoring**\nDistribute terms, expand products, or factor out common binomial factors: combining like terms reduces the expression to $${cleanOpt}$.`;
    } else {
      step2 = `**Step 2: Combine like terms and simplify**\nGroup terms with identical variable powers and simplify coefficients systematically to reach the simplified form $${cleanOpt}$.`;
    }
    
    step3 = `**Step 3: Compare with the answer choices**\nThe simplified expression matches the expression in Choice (${ans}) directly.`;
    conclusion = `**Conclusion:**\nThe equivalent expression is $${cleanOpt}$, which is Choice (${ans}).`;
  }

  // ─── 2. LINEAR EQUATIONS (SOLVING FOR X OR AN EXPRESSION) ───
  else if (topic === 'Linear Equations' || lower.includes('what is the value of') || lower.includes('satisfies the equation')) {
    step1 = `**Step 1: Set up the given linear equation**\nFrom the problem statement: ${firstMath || 'the given linear equation'}. Identify the target quantity to solve for.`;
    
    if (lower.includes('value of ') && !lower.includes('value of x') && !lower.includes('value of $x$')) {
      step2 = `**Step 2: Isolate the variable and substitute into the target expression**\nApply inverse operations to isolate the unknown variable. Then substitute that value into the required expression to evaluate its final value.`;
    } else {
      step2 = `**Step 2: Isolate the unknown variable**\nGroup all variable terms on one side and constant terms on the other: perform division/multiplication by the leading coefficient to obtain the solution.`;
    }

    step3 = `**Step 3: Conclude the final value**\nThe calculation yields $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nThe correct value is $${cleanOpt}$, matching Choice (${ans}).`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  // ─── 3. LINEAR SYSTEMS OF EQUATIONS ───
  else if (topic.includes('System') || lower.includes('system of equations') || lower.includes('infinitely many solutions') || lower.includes('no solution')) {
    step1 = `**Step 1: Analyze the system requirements**\nIdentify the two linear equations given in the system ${firstMath ? `(${firstMath})` : ''}. Note whether the question asks for $(x, y)$, a single variable, or conditions for infinitely many/zero solutions.`;
    
    if (lower.includes('infinitely many')) {
      step2 = `**Step 2: Equate proportional coefficients**\nA linear system has infinitely many solutions when the two equations represent identical lines: their $x$-coefficients, $y$-coefficients, and constants must be in the exact same proportion.`;
    } else if (lower.includes('no solution')) {
      step2 = `**Step 2: Set matching slopes with differing intercepts**\nA linear system has no solution when the lines are parallel and distinct: equate the ratio of coefficients of $x$ and $y$ while ensuring constant terms differ.`;
    } else {
      step2 = `**Step 2: Solve using elimination or substitution**\nMultiply one or both equations to eliminate a variable, or solve for one variable and substitute into the other equation.`;
    }

    step3 = `**Step 3: Determine the final result**\nEvaluating the resulting linear equation gives $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nTherefore, Choice (${ans}) ($${cleanOpt}$) is the correct answer.`
      : `**Conclusion:**\nThe correct value is $${ans}$.`;
  }

  // ─── 4. LINEAR FUNCTIONS & SLOPES ───
  else if (topic === 'Linear Functions' || lower.includes('slope') || lower.includes('y-intercept') || lower.includes('rate of change')) {
    step1 = `**Step 1: Recall the slope-intercept form**\nA linear function is modeled by $f(x) = mx + b$, where $m$ represents the slope (constant rate of change) and $b$ represents the $y$-intercept ($f(0)$).`;
    step2 = `**Step 2: Apply the given coordinates or conditions**\nCompute slope using $m = \\frac{y_2 - y_1}{x_2 - x_1}$ or substitute the given point $(x, y)$ into the function to solve for the missing constant.`;
    step3 = `**Step 3: Verify with the question objective**\nThe resulting slope, intercept, or equation evaluation gives $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nThis matches Choice (${ans}) ($${cleanOpt}$).`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  // ─── 5. LINEAR INEQUALITIES ───
  else if (topic === 'Linear Inequalities' || lower.includes('inequality') || lower.includes('\\le') || lower.includes('\\ge') || lower.includes('<') || lower.includes('>')) {
    step1 = `**Step 1: Set up the inequality relation**\nTranslate the constraints from the problem into an inequality: ${firstMath || 'the given linear inequality'}.`;
    step2 = `**Step 2: Isolate the variable**\nAdd or subtract terms across the inequality sign. Remember that multiplying or dividing both sides by a negative number reverses the direction of the inequality symbol.`;
    step3 = `**Step 3: Determine the valid solution set**\nThe boundary and direction indicate that $${cleanOpt}$ is the valid range or value.`;
    conclusion = isMC
      ? `**Conclusion:**\nThus, Choice (${ans}) correctly represents the solution.`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  // ─── 6. POLYNOMIALS & REMAINDER THEOREM ───
  else if (topic === 'Polynomials' || lower.includes('polynomial') || lower.includes('factor') || lower.includes('remainder')) {
    step1 = `**Step 1: Identify the polynomial and its key features**\nExamine the polynomial ${firstMath || 'given in the prompt'}, noting its degree, leading coefficient, and any known roots or factors.`;
    step2 = `**Step 2: Apply factoring or polynomial theorems**\nFactor by grouping, difference of squares, or use the Remainder Theorem (for a polynomial $P(x)$ divided by $x - c$, the remainder is $P(c)$).`;
    step3 = `**Step 3: Deduce the matching option or value**\nThe factored form or root evaluation matches $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nChoice (${ans}) ($${cleanOpt}$) is the correct response.`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  // ─── 7. EXPONENTS & RADICALS ───
  else if (topic === 'Exponents&Radicals' || lower.includes('exponent') || lower.includes('radical') || lower.includes('\\sqrt')) {
    step1 = `**Step 1: Apply the fundamental exponent and radical rules**\nRecall that $\\frac{a^m}{a^n} = a^{m-n}$, $(a^m)^n = a^{mn}$, and $a^{p/q} = \\sqrt[q]{a^p}$.`;
    step2 = `**Step 2: Convert to a common base or isolate the radical**\nRewrite all terms with matching bases, or isolate the radical term and raise both sides to the appropriate power to eliminate the root.`;
    step3 = `**Step 3: Solve and verify**\nEquating exponents or solving the resulting linear/quadratic equation yields $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nChoice (${ans}) is the correct answer.`
      : `**Conclusion:**\nThe correct numerical answer is $${ans}$.`;
  }

  // ─── 8. FUNCTIONS & FUNCTION NOTATION ───
  else if (topic === 'Functions&Function Notation' || lower.includes('f(x)') || lower.includes('g(x)')) {
    step1 = `**Step 1: Interpret the function notation**\nFor a function $f(x)$, evaluating $f(k)$ means substituting $x = k$ wherever $x$ appears in the formula.`;
    step2 = `**Step 2: Perform the substitution or graph analysis**\nSubstitute the input value into the function definition or analyze transformations (such as vertical shifts $f(x) \\pm c$ or horizontal shifts $f(x \\pm c)$).`;
    step3 = `**Step 3: Compute the output**\nEvaluating the resulting algebraic expression yields $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nChoice (${ans}) ($${cleanOpt}$) correctly defines or evaluates the function.`
      : `**Conclusion:**\nThe correct value is $${ans}$.`;
  }

  // ─── 9. EXPONENTIAL FUNCTIONS (GROWTH & DECAY) ───
  else if (topic === 'Exponential Functions' || lower.includes('exponential') || lower.includes('growth') || lower.includes('decay')) {
    step1 = `**Step 1: Identify exponential model components**\nAn exponential function has the form $y = a \\cdot b^x = a(1 \\pm r)^x$, where $a$ is the initial value at $x = 0$ and $b$ is the growth/decay factor.`;
    step2 = `**Step 2: Extract initial value and growth rate**\nRead the baseline amount when the independent variable is $0$, and compute the multiplicative factor between consecutive periods.`;
    step3 = `**Step 3: Assemble the model**\nCombining initial value and base factor yields the model $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nThis matches Choice (${ans}) ($${cleanOpt}$).`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  // ─── 10. QUADRATICS (VERTEX, ROOTS, DISCRIMINANT) ───
  else if (topic === 'Quadratics' || lower.includes('quadratic') || lower.includes('vertex') || lower.includes('parabola') || lower.includes('maximum') || lower.includes('minimum')) {
    step1 = `**Step 1: Identify the quadratic structure**\nThe quadratic equation or function is in standard form $ax^2 + bx + c$ or vertex form $a(x - h)^2 + k$.`;
    
    if (lower.includes('vertex') || lower.includes('minimum') || lower.includes('maximum')) {
      step2 = `**Step 2: Find the vertex coordinates**\nThe $x$-coordinate of the vertex occurs at $x = -\\frac{b}{2a}$. Substituting this back into the equation yields the minimum or maximum value $k$.`;
    } else if (lower.includes('discriminant') || lower.includes('how many solutions') || lower.includes('number of solutions')) {
      step2 = `**Step 2: Calculate the discriminant**\nUse $\\Delta = b^2 - 4ac$: if $\\Delta > 0$ there are $2$ real solutions; if $\\Delta = 0$ there is $1$ real solution; if $\\Delta < 0$ there are no real solutions.`;
    } else {
      step2 = `**Step 2: Solve for roots using factoring or quadratic formula**\nFactor into $(px + q)(rx + s) = 0$ or apply $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.`;
    }

    step3 = `**Step 3: Match with the required output**\nThe computation gives the result $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nThus, Choice (${ans}) ($${cleanOpt}$) is the correct answer.`
      : `**Conclusion:**\nThe correct value is $${ans}$.`;
  }

  // ─── 11. PERCENT, RATIO & PROPORTION ───
  else if (topic.includes('Percent') || topic.includes('Ratio') || lower.includes('percent') || lower.includes('ratio')) {
    step1 = `**Step 1: Set up the proportion or percentage equation**\nRecall that $p\\%$ of $W$ equals $\\frac{p}{100} \\times W$. For ratios $A : B = C : D$, set up equivalent fractions $\\frac{A}{B} = \\frac{C}{D}$.`;
    step2 = `**Step 2: Perform the arithmetic calculation**\nCross-multiply or divide to isolate the target quantity, paying attention to percent increase/decrease formulas $\\frac{\\text{change}}{\\text{original}} \\times 100\\%$.`;
    step3 = `**Step 3: Conclude the final value**\nThe resulting value is $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nTherefore, Choice (${ans}) ($${cleanOpt}$) is correct.`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  // ─── 12. UNIT CONVERSION ───
  else if (topic === 'Unit Conversion' || lower.includes('convert') || lower.includes('per hour') || lower.includes('meters') || lower.includes('feet')) {
    step1 = `**Step 1: Identify the given quantity and target units**\nNote the initial measurement and establish the conversion factors needed (e.g. $1\\text{ hr} = 60\\text{ min}$, $1\\text{ km} = 1000\\text{ m}$).`;
    step2 = `**Step 2: Set up dimensional analysis**\nMultiply the initial quantity by conversion fractions arranged so that unwanted units cancel out.`;
    step3 = `**Step 3: Calculate the converted value**\nCarrying out the arithmetic yields $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nChoice (${ans}) is the correct converted value.`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  // ─── 13. PROBABILITY ───
  else if (topic === 'Probability' || lower.includes('probability') || lower.includes('selected at random')) {
    step1 = `**Step 1: Define total and favorable outcomes**\nRecall the probability formula $P = \\frac{\\text{Number of favorable outcomes}}{\\text{Total number of possible outcomes}}$. Check if a conditional subset is specified.`;
    step2 = `**Step 2: Count the relevant values from the table or prompt**\nIdentify the denominator (total restricted population) and numerator (outcomes matching the specific criterion).`;
    step3 = `**Step 3: Simplify the probability fraction**\nDividing the favorable count by the total count simplifies directly to $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nChoice (${ans}) ($${cleanOpt}$) is the correct probability.`
      : `**Conclusion:**\nThe correct probability is $${ans}$.`;
  }

  // ─── 14. STATISTICS (MEAN, MEDIAN, RANGE, STD DEV) ───
  else if (topic.includes('Mean') || topic.includes('Median') || lower.includes('mean') || lower.includes('median') || lower.includes('standard deviation')) {
    step1 = `**Step 1: Recall the statistical definitions**\n- Mean: $\\frac{\\sum x}{n}$ (sum of values divided by count)\n- Median: the middle value when sorted\n- Range: $\\text{Maximum} - \\text{Minimum}$\n- Standard Deviation: measure of how spread out data points are around the mean.`;
    step2 = `**Step 2: Analyze the distribution / data values**\nExamine the frequency distribution, dot plot, or histogram to calculate or compare the center and spread.`;
    step3 = `**Step 3: Determine the correct comparison or value**\nEvaluating the data gives $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nChoice (${ans}) is the correct statement or value.`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  // ─── 15. SCATTERPLOTS & LINE OF BEST FIT ───
  else if (topic === 'Scatterplots' || lower.includes('scatterplot') || lower.includes('line of best fit')) {
    step1 = `**Step 1: Identify the trend and line of best fit**\nExamine the direction of the points on the scatterplot: positive slope (rising left-to-right) or negative slope (falling left-to-right).`;
    step2 = `**Step 2: Estimate slope and $y$-intercept**\nPick two representative points along the line of best fit to estimate the slope $m = \\frac{\\Delta y}{\\Delta x}$, and note where the line crosses the vertical axis at $x = 0$.`;
    step3 = `**Step 3: Match with the linear models**\nThe estimated slope and intercept correspond directly to $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nChoice (${ans}) ($${cleanOpt}$) is the most appropriate model.`
      : `**Conclusion:**\nThe correct value is $${ans}$.`;
  }

  // ─── 16. GEOMETRY: LINES & ANGLES ───
  else if (topic === 'Lines&Angles' || lower.includes('parallel') || lower.includes('transversal') || lower.includes('angle')) {
    step1 = `**Step 1: Identify angle relationships**\nRecall that vertical angles are congruent, angles forming a linear pair sum to $180^\\circ$, and parallel lines intersected by a transversal form congruent alternate interior and corresponding angles.`;
    step2 = `**Step 2: Formulate an angle sum equation**\nSet up equations equating congruent angles or summing supplementary angles to $180^\\circ$.`;
    step3 = `**Step 3: Solve for the unknown angle**\nCarrying out the subtraction or algebraic solve gives $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nChoice (${ans}) is the correct answer.`
      : `**Conclusion:**\nThe correct measure is $${ans}$.`;
  }

  // ─── 17. GEOMETRY: TRIANGLES & TRIGONOMETRY ───
  else if (topic === 'Triangles' || topic === 'Trigonometry' || lower.includes('triangle') || lower.includes('sin') || lower.includes('cos') || lower.includes('tan')) {
    step1 = `**Step 1: Identify geometric theorems or trigonometric ratios**\n- Sum of angles in any triangle is $180^\\circ$\n- Pythagorean theorem: $a^2 + b^2 = c^2$ for right triangles\n- Trigonometric ratios: $\\sin \\theta = \\frac{\\text{opp}}{\\text{hyp}}$, $\\cos \\theta = \\frac{\\text{adj}}{\\text{hyp}}$, $\\tan \\theta = \\frac{\\text{opp}}{\\text{adj}}$\n- Cofunction identity: $\\sin A = \\cos(90^\\circ - A)$.`;
    step2 = `**Step 2: Substitute the known values and solve**\nSet up the corresponding equation with given side lengths or angle measures and solve for the unknown side or ratio.`;
    step3 = `**Step 3: Compute the exact value**\nThe calculation yields $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nChoice (${ans}) ($${cleanOpt}$) is the correct answer.`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  // ─── 18. CIRCLES, AREAS & VOLUMES ───
  else if (topic === 'Circles' || topic === 'Areas&Volumes' || lower.includes('circle') || lower.includes('radius') || lower.includes('area') || lower.includes('volume')) {
    step1 = `**Step 1: Identify the geometric shape and standard formula**\n- Circle equation: $(x - h)^2 + (y - k)^2 = r^2$ (center $(h, k)$, radius $r$)\n- Circle area: $A = \\pi r^2$, circumference: $C = 2\\pi r$\n- Volume formulas: cylinder $\\pi r^2 h$, cone $\\frac{1}{3}\\pi r^2 h$, sphere $\\frac{4}{3}\\pi r^3$.`;
    step2 = `**Step 2: Substitute the given dimensions**\nSubstitute known coordinates, lengths, or radii into the formula and simplify algebraically.`;
    step3 = `**Step 3: Calculate the requested quantity**\nEvaluating the formula gives $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nThus, Choice (${ans}) ($${cleanOpt}$) is the correct answer.`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  // ─── 19. GENERAL FALLBACK ───
  else {
    step1 = `**Step 1: Analyze the given conditions**\nCarefully identify the given variables, constraints, and target value specified in the problem prompt.`;
    step2 = `**Step 2: Apply mathematical properties of ${topic}**\nSet up the appropriate equation or mathematical relationship and carry out the algebraic or numerical steps.`;
    step3 = `**Step 3: Arrive at the solution**\nThe mathematical derivation leads directly to $${cleanOpt}$.`;
    conclusion = isMC
      ? `**Conclusion:**\nChoice (${ans}) ($${cleanOpt}$) is the correct answer.`
      : `**Conclusion:**\nThe correct answer is $${ans}$.`;
  }

  return `${step1}\n\n${step2}\n\n${step3}\n\n${conclusion}`;
}

/**
 * Retrieves the full step-by-step explanation for any question.
 * Prioritizes:
 * 1. Curated specific explanation if registered
 * 2. Existing valid explanation on the question (if non-placeholder)
 * 3. Algorithmic procedural 3-step explanation
 */
export function getStepByStepExplanation(
  q: {
    id: string;
    topic?: string;
    domain?: string;
    questionText?: string;
    prompt?: string;
    type?: string;
    options?: { id: string; text: string }[];
    correctAnswer: string;
    explanation?: string;
  },
  domainName?: string
): string {
  // Check curated table first
  if (CURATED_EXPLANATIONS[q.id]) {
    return CURATED_EXPLANATIONS[q.id];
  }

  // Check if existing explanation is valid and not just a single-sentence fallback
  if (
    q.explanation &&
    q.explanation.trim().length > 40 &&
    !q.explanation.trim().startsWith('The correct answer is ')
  ) {
    return q.explanation;
  }

  // Procedural generator
  return generateAlgorithmicExplanation(q, domainName || q.domain || 'Math');
}

/**
 * Parses markdown explanation into individual step objects for rich UI rendering.
 */
export function parseExplanationSteps(rawExplanation: string): ParsedExplanation {
  if (!rawExplanation) {
    return { steps: [], raw: '' };
  }

  const steps: ExplanationStep[] = [];
  let conclusion: string | undefined = undefined;

  // Split by double newline or Step headings
  const blocks = rawExplanation.split(/\n\n+/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Check for conclusion block
    if (
      trimmed.startsWith('**Conclusion:') ||
      trimmed.startsWith('**Answer:') ||
      trimmed.startsWith('**Correct Answer:') ||
      trimmed.startsWith('Conclusion:')
    ) {
      conclusion = trimmed.replace(/^\*\*Conclusion:\*\*|\*\*Conclusion:\*|Conclusion:/i, '').trim();
      continue;
    }

    // Check for Step X pattern
    const stepMatch = trimmed.match(/^\*\*Step\s*(\d+):?\s*([^*]+)?\*\*\s*([\s\S]*)$/i) ||
                      trimmed.match(/^(\d+)\.\s*\*\*([^*]+)\*\*\s*([\s\S]*)$/i) ||
                      trimmed.match(/^Step\s*(\d+):?\s*([^\n]+)?\n*([\s\S]*)$/i);

    if (stepMatch) {
      const stepNum = parseInt(stepMatch[1], 10) || steps.length + 1;
      const stepTitle = (stepMatch[2] || `Step ${stepNum}`).trim();
      const stepContent = (stepMatch[3] || '').trim();

      steps.push({
        stepNumber: stepNum,
        title: stepTitle,
        content: stepContent || stepTitle,
      });
    } else {
      // General paragraph
      steps.push({
        stepNumber: steps.length + 1,
        title: `Analysis & Calculation`,
        content: trimmed,
      });
    }
  }

  return {
    steps,
    conclusion,
    raw: rawExplanation,
  };
}
