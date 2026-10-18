import { Question, MathDomain, QuestionOption } from '../types';
import {
  GenerateQuestionInput,
  GeneratedQuestionResult,
  CustomPracticeTest,
} from '../types/admin';
import { saveCustomPracticeTest, sortQuestionsByDifficulty } from './customPracticeTestsService';
import { hasGroqApiKey, getTutorReplyDetailed } from './aiTutor';
import { hasValidApiKey, getGeminiClient } from '../lib/gemini';

export interface GenerateTestOptions {
  title?: string;
  difficulty?: 'Standard' | 'Hard' | '750+' | 'Adaptive';
  category?: 'official' | 'turbo_mock' | 'prediction' | 'diagnostic' | 'custom';
  totalQuestions?: number; // Defaults to 44 (22 M1 + 22 M2)
  moduleTimeMinutes?: number; // Defaults to 35
  focusDomains?: MathDomain[];
  customInstructions?: string;
  useLiveAI?: boolean;
  onProgress?: (progress: { current: number; total: number; message: string }) => void;
}

/**
 * Robust JSON Parser & Sanitizer for LLM outputs.
 * Handles markdown code fences, leading/trailing prose, trailing commas,
 * and fixes unescaped LaTeX backslashes without breaking valid JSON escape sequences.
 */
export function sanitizeAndParseAIJson<T = any>(rawText: string): T {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('sanitizeAndParseAIJson: rawText must be a non-empty string');
  }

  let text = rawText.trim();

  // 1. Strip markdown code fences if wrapped in ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    text = codeBlockMatch[1].trim();
  }

  // 2. Extract outermost JSON structure: { ... } or [ ... ]
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  let startIndex = -1;
  let isArray = false;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace;
    isArray = false;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
    isArray = true;
  }

  if (startIndex !== -1) {
    const endChar = isArray ? ']' : '}';
    const lastIndex = text.lastIndexOf(endChar);
    if (lastIndex > startIndex) {
      text = text.substring(startIndex, lastIndex + 1);
    }
  }

  // 3. Fast path: try standard JSON.parse
  try {
    return JSON.parse(text) as T;
  } catch {
    // Proceed to repair strategies
  }

  // 4. Strip trailing commas before closing braces/brackets
  text = text.replace(/,\s*([}\]])/g, '$1');

  // 5. Protect LaTeX commands from colliding with JSON escape characters
  // Known LaTeX commands starting with letters that might collide with valid JSON escape characters
  const latexCommands = [
    'frac', 'sqrt', 'left', 'right', 'cdot', 'begin', 'end',
    'alpha', 'beta', 'theta', 'pi', 'pm', 'approx', 'times',
    'div', 'sum', 'int', 'infty', 'leq', 'geq', 'neq', 'text',
    'mathbf', 'mathit', 'displaystyle', 'sim', 'circ', 'degree'
  ];

  for (const cmd of latexCommands) {
    const regex = new RegExp(`(?<!\\\\)\\\\${cmd}`, 'g');
    text = text.replace(regex, `\\\\${cmd}`);
  }

  // 6. Replace any remaining invalid backslashes not followed by valid JSON escape character
  // Valid JSON escape chars: " \ / b f n r t u
  text = text.replace(/(?<!\\)\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');

  // 7. Try parsing repaired JSON
  try {
    return JSON.parse(text) as T;
  } catch (repairedErr: any) {
    throw new Error(
      `Failed to parse sanitized AI JSON: ${repairedErr?.message || repairedErr}. Raw text:\n${rawText.slice(0, 200)}...`
    );
  }
}

/**
 * Validates a generated question against SAT formatting rules and LaTeX integrity.
 */
export function validateGeneratedQuestion(q: Partial<Question>): GeneratedQuestionResult['validation'] {
  const latexErrors: string[] = [];

  const checkLatexDelimiters = (str?: string, fieldName: string = 'text') => {
    if (!str) return;
    // Count unescaped dollar signs
    const unescapedDollars = (str.match(/(?<!\\)\$/g) || []).length;
    if (unescapedDollars % 2 !== 0) {
      latexErrors.push(`Unmatched LaTeX dollar delimiter in ${fieldName}: odd number of $ found.`);
    }

    // Check for unmatched curly braces in LaTeX equations
    let depth = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '{' && (i === 0 || str[i - 1] !== '\\')) depth++;
      if (str[i] === '}' && (i === 0 || str[i - 1] !== '\\')) depth--;
      if (depth < 0) {
        latexErrors.push(`Unmatched closing curly brace '}' in ${fieldName}.`);
        break;
      }
    }
    if (depth > 0) {
      latexErrors.push(`Unclosed opening curly brace '{' in ${fieldName}.`);
    }
  };

  checkLatexDelimiters(q.prompt, 'prompt');
  checkLatexDelimiters(q.explanation, 'explanation');
  q.options?.forEach((opt) => checkLatexDelimiters(opt.text, `option ${opt.id}`));

  const hasExplanation = Boolean(q.explanation && q.explanation.trim().length >= 10);

  let hasOptionsIfMultipleChoice = true;
  let correctAnswerMatchesOptions = true;

  if (q.type === 'multiple_choice') {
    const validIds: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const optionIds = (q.options || []).map((o) => o.id);
    hasOptionsIfMultipleChoice =
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      validIds.every((id) => optionIds.includes(id));

    correctAnswerMatchesOptions =
      Boolean(q.correctAnswer) &&
      validIds.includes(q.correctAnswer as 'A' | 'B' | 'C' | 'D') &&
      (q.options || []).some((o) => o.id === q.correctAnswer);
  } else {
    correctAnswerMatchesOptions = Boolean(
      q.correctAnswer && String(q.correctAnswer).trim().length > 0
    );
  }

  const hasPrompt = Boolean(q.prompt && q.prompt.trim().length >= 5);
  const isValid =
    hasPrompt &&
    hasExplanation &&
    hasOptionsIfMultipleChoice &&
    correctAnswerMatchesOptions &&
    latexErrors.length === 0;

  return {
    isValid,
    latexErrors: latexErrors.length > 0 ? latexErrors : undefined,
    hasExplanation,
    hasOptionsIfMultipleChoice,
    correctAnswerMatchesOptions,
  };
}

/**
 * Curated, psychometrically calibrated fallback question generator.
 * Provides authentic College Board style questions across all 4 math domains,
 * difficulties (Easy, Medium, Hard), and formats (multiple-choice & student-produced).
 */
export function getCalibratedFallbackQuestion(input: GenerateQuestionInput, index: number = 1): Question {
  const { domain, difficulty, type } = input;
  const uid = `q_cal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Random variations to guarantee variety
  const randA = Math.floor(Math.random() * 5) + 2; // 2..6
  const randB = Math.floor(Math.random() * 8) + 3; // 3..10
  const randC = randA * randB;

  switch (domain) {
    case 'Algebra': {
      if (difficulty === 'Easy') {
        const xVal = randB;
        return {
          id: uid,
          number: index,
          section: 'math',
          module: 1,
          domain: 'Algebra',
          difficulty: 'Easy',
          type: 'multiple_choice',
          prompt: `If $${randA}x + ${randA * 3} = ${randA * (xVal + 3)}$, what is the value of $x$?`,
          options: [
            { id: 'A', text: `$${xVal - 2}$` },
            { id: 'B', text: `$${xVal}$` },
            { id: 'C', text: `$${xVal + 2}$` },
            { id: 'D', text: `$${xVal + 4}$` },
          ],
          correctAnswer: 'B',
          explanation: `**Step 1: Subtract ${randA * 3} from both sides**\n$$${randA}x = ${randA * xVal}$$\n\n**Step 2: Divide both sides by ${randA}**\n$$x = ${xVal}$$\n\n**Desmos Shortcut:**\nType \`${randA}x + ${randA * 3} = ${randA * (xVal + 3)}\` directly into Desmos and find the vertical intercept line at $x = ${xVal}$.`,
          desmosEquation: `${randA}x + ${randA * 3} = ${randA * (xVal + 3)}`,
          hint: `Subtract ${randA * 3} from both sides, then divide by ${randA}.`,
        };
      }
      if (difficulty === 'Medium') {
        return {
          id: uid,
          number: index,
          section: 'math',
          module: 1,
          domain: 'Algebra',
          difficulty: 'Medium',
          type: type === 'student_produced' ? 'student_produced' : 'multiple_choice',
          prompt: `A line in the $xy$-plane has a slope of $-\\frac{3}{4}$ and passes through the point $(8, -2)$. What is the $y$-intercept of the line?`,
          options:
            type === 'student_produced'
              ? undefined
              : [
                  { id: 'A', text: `$2$` },
                  { id: 'B', text: `$4$` },
                  { id: 'C', text: `$6$` },
                  { id: 'D', text: `$8$` },
                ],
          correctAnswer: type === 'student_produced' ? '4' : 'B',
          explanation: `**Step 1: Use slope-intercept form $y = mx + b$**\nSubstitute $m = -\\frac{3}{4}$, $x = 8$, and $y = -2$:\n$$-2 = -\\frac{3}{4}(8) + b$$\n\n**Step 2: Solve for $b$**\n$$-2 = -6 + b \\implies b = 4$$\n\n**Conclusion:** The $y$-intercept is $(0, 4)$, so $b = 4$.`,
          desmosEquation: 'y - (-2) = -3/4(x - 8)',
          hint: 'Use point-slope form $y - y_1 = m(x - x_1)$ and find where $x = 0$.',
        };
      }
      // Hard Algebra
      return {
        id: uid,
        number: index,
        section: 'math',
        module: 2,
        domain: 'Algebra',
        difficulty: 'Hard',
        type: type === 'student_produced' ? 'student_produced' : 'multiple_choice',
        prompt: `In the system of equations below, $a$ and $b$ are constants:\n$$\\begin{cases} 3x - 5y = 12 \\\\ ax + 15y = b \\end{cases}$$\nIf the system has infinitely many solutions, what is the value of $a + b$?`,
        options:
          type === 'student_produced'
            ? undefined
            : [
                { id: 'A', text: `$-45$` },
                { id: 'B', text: `$-27$` },
                { id: 'C', text: `$27$` },
                { id: 'D', text: `$45$` },
              ],
        correctAnswer: type === 'student_produced' ? '-45' : 'A',
        explanation: `**Step 1: Recognize condition for infinitely many solutions**\nFor two linear equations to have infinitely many solutions, they must be scalar multiples of each other:\n$$\\frac{a}{3} = \\frac{15}{-5} = \\frac{b}{12}$$\n\n**Step 2: Solve for the multiplier**\n$$\\frac{15}{-5} = -3$$\nTherefore:\n$$a = 3 \\times (-3) = -9$$\n$$b = 12 \\times (-3) = -36$$\n\n**Step 3: Evaluate $a + b$**\n$$a + b = (-9) + (-36) = -45$$`,
        desmosEquation: '3x - 5y = 12',
        hint: 'Multiply the first equation by $-3$ to match the $y$-coefficient in the second equation.',
      };
    }

    case 'Advanced Math': {
      if (difficulty === 'Easy') {
        return {
          id: uid,
          number: index,
          section: 'math',
          module: 1,
          domain: 'Advanced Math',
          difficulty: 'Easy',
          type: 'multiple_choice',
          prompt: `For the function $f(x) = 3x^2 - 5x + 7$, what is the value of $f(-2)$?`,
          options: [
            { id: 'A', text: `$9$` },
            { id: 'B', text: `$21$` },
            { id: 'C', text: `$25$` },
            { id: 'D', text: `$29$` },
          ],
          correctAnswer: 'D',
          explanation: `**Step 1: Substitute $x = -2$ into $f(x)$**\n$$f(-2) = 3(-2)^2 - 5(-2) + 7$$\n$$f(-2) = 3(4) + 10 + 7 = 12 + 10 + 7 = 29$$\n\n**Conclusion:** Choice (D) is correct.`,
          desmosEquation: 'f(x) = 3x^2 - 5x + 7',
          hint: 'Remember that $(-2)^2 = +4$ and $-5(-2) = +10$.',
        };
      }
      if (difficulty === 'Medium') {
        return {
          id: uid,
          number: index,
          section: 'math',
          module: 1,
          domain: 'Advanced Math',
          difficulty: 'Medium',
          type: type === 'student_produced' ? 'student_produced' : 'multiple_choice',
          prompt: `The equation $h(t) = -16t^2 + 64t + 80$ models the height $h$, in feet, of a ball $t$ seconds after being launched. What is the maximum height, in feet, reached by the ball?`,
          options:
            type === 'student_produced'
              ? undefined
              : [
                  { id: 'A', text: `$80$` },
                  { id: 'B', text: `$128$` },
                  { id: 'C', text: `$144$` },
                  { id: 'D', text: `$160$` },
                ],
          correctAnswer: type === 'student_produced' ? '144' : 'C',
          explanation: `**Step 1: Find the time of the vertex**\nFor a parabola $y = at^2 + bt + c$, the vertex occurs at $t = -\\frac{b}{2a}$:\n$$t = -\\frac{64}{2(-16)} = \\frac{64}{32} = 2\\text{ seconds}$$\n\n**Step 2: Evaluate maximum height at $t = 2$**\n$$h(2) = -16(2)^2 + 64(2) + 80 = -64 + 128 + 80 = 144\\text{ feet}$$\n\n**Desmos Shortcut:** Graph $y = -16x^2 + 64x + 80$ and click on the apex to read $(2, 144)$.`,
          desmosEquation: 'y = -16x^2 + 64x + 80',
          hint: 'Find the vertex using $t = -b/(2a)$, then evaluate $h(t)$.',
        };
      }
      // Hard Advanced Math
      return {
        id: uid,
        number: index,
        section: 'math',
        module: 2,
        domain: 'Advanced Math',
        difficulty: 'Hard',
        type: type === 'student_produced' ? 'student_produced' : 'multiple_choice',
        prompt: `If the quadratic equation $x^2 - 8x + c = 0$ has exactly one distinct real solution, what is the value of $c$?`,
        options:
          type === 'student_produced'
            ? undefined
            : [
                { id: 'A', text: `$8$` },
                { id: 'B', text: `$12$` },
                { id: 'C', text: `$16$` },
                { id: 'D', text: `$64$` },
              ],
        correctAnswer: type === 'student_produced' ? '16' : 'C',
        explanation: `**Step 1: Recall discriminant rule for one real solution**\nA quadratic equation $ax^2 + bx + c = 0$ has exactly one distinct real solution when its discriminant is zero:\n$$\\Delta = b^2 - 4ac = 0$$\n\n**Step 2: Substitute $a = 1$, $b = -8$**\n$$(-8)^2 - 4(1)(c) = 0$$\n$$64 - 4c = 0 \\implies 4c = 64 \\implies c = 16$$\n\n**Alternative method (Perfect Square):**\n$$(x - 4)^2 = x^2 - 8x + 16 \\implies c = 16$$`,
        desmosEquation: 'y = x^2 - 8x + 16',
        hint: 'Set the discriminant $b^2 - 4ac = 0$.',
      };
    }

    case 'Problem-Solving & Data Analysis': {
      if (difficulty === 'Easy') {
        return {
          id: uid,
          number: index,
          section: 'math',
          module: 1,
          domain: 'Problem-Solving & Data Analysis',
          difficulty: 'Easy',
          type: 'multiple_choice',
          prompt: `A store offers a $20\\%$ discount on a jacket originally priced at $\\$85$. What is the sale price of the jacket before tax?`,
          options: [
            { id: 'A', text: `$\\$17$` },
            { id: 'B', text: `$\\$65$` },
            { id: 'C', text: `$\\$68$` },
            { id: 'D', text: `$\\$72$` },
          ],
          correctAnswer: 'C',
          explanation: `**Step 1: Calculate discounted percentage**\nA $20\\%$ discount means the customer pays $100\\% - 20\\% = 80\\%$ of the original price.\n\n**Step 2: Multiply by original price**\n$$\\text{Sale Price} = 0.80 \\times 85 = 68$$\n\n**Conclusion:** The sale price is $\\$68$, matching Choice (C).`,
          hint: 'Multiply the original price by $0.80$.',
        };
      }
      if (difficulty === 'Medium') {
        return {
          id: uid,
          number: index,
          section: 'math',
          module: 1,
          domain: 'Problem-Solving & Data Analysis',
          difficulty: 'Medium',
          type: type === 'student_produced' ? 'student_produced' : 'multiple_choice',
          prompt: `In a research study of $120$ high school seniors, $72$ participate in school athletics and $48$ do not. Of those who participate in athletics, $18$ are enrolled in AP Calculus. What fraction of the students who participate in athletics are enrolled in AP Calculus?`,
          options:
            type === 'student_produced'
              ? undefined
              : [
                  { id: 'A', text: `$\\frac{3}{20}$` },
                  { id: 'B', text: `$\\frac{1}{4}$` },
                  { id: 'C', text: `$\\frac{3}{8}$` },
                  { id: 'D', text: `$\\frac{2}{5}$` },
                ],
          correctAnswer: type === 'student_produced' ? '1/4' : 'B',
          explanation: `**Step 1: Identify conditional universe**\nThe question specifies: "students who participate in athletics". The denominator is $72$.\n\n**Step 2: Identify favorable outcomes**\nNumber of athletic students enrolled in AP Calculus is $18$.\n\n**Step 3: Simplify fraction**\n$$\\frac{18}{72} = \\frac{1}{4} = 0.25$$\n\n**Conclusion:** The fraction is $\\frac{1}{4}$, matching Choice (B).`,
          hint: 'Conditional probability: divide $18$ by the total athletes ($72$).',
        };
      }
      // Hard
      return {
        id: uid,
        number: index,
        section: 'math',
        module: 2,
        domain: 'Problem-Solving & Data Analysis',
        difficulty: 'Hard',
        type: type === 'student_produced' ? 'student_produced' : 'multiple_choice',
        prompt: `An initial population of $250$ bacteria in a petri dish increases by $15\\%$ every $3$ hours. Which of the following functions best models the population $P(t)$ after $t$ hours?`,
        options:
          type === 'student_produced'
            ? undefined
            : [
                { id: 'A', text: `$P(t) = 250(1.15)^{3t}$` },
                { id: 'B', text: `$P(t) = 250(1.15)^{\\frac{t}{3}}$` },
                { id: 'C', text: `$P(t) = 250(0.85)^{\\frac{t}{3}}$` },
                { id: 'D', text: `$P(t) = 250(3)^{1.15t}$` },
              ],
        correctAnswer: 'B',
        explanation: `**Step 1: Standard exponential growth formula**\n$$P(t) = P_0 (1 + r)^{\\frac{t}{k}}$$\nwhere $P_0 = 250$, $r = 0.15$ (giving growth factor $1.15$), and doubling/growth period $k = 3$ hours.\n\n**Step 2: Verify exponent**\nWhen $t = 3$ hours, the growth factor should compound once: $\\frac{3}{3} = 1$.\nThis confirms $P(t) = 250(1.15)^{\\frac{t}{3}}$, matching Choice (B).`,
        hint: 'The time variable $t$ must be divided by $3$ so that one compounding period occurs every $3$ hours.',
      };
    }

    case 'Geometry & Trigonometry':
    default: {
      if (difficulty === 'Easy') {
        return {
          id: uid,
          number: index,
          section: 'math',
          module: 1,
          domain: 'Geometry & Trigonometry',
          difficulty: 'Easy',
          type: 'multiple_choice',
          prompt: `A right triangle has legs of lengths $6$ and $8$. What is the length of the hypotenuse?`,
          options: [
            { id: 'A', text: `$9$` },
            { id: 'B', text: `$10$` },
            { id: 'C', text: `$12$` },
            { id: 'D', text: `$14$` },
          ],
          correctAnswer: 'B',
          explanation: `**Step 1: Use the Pythagorean theorem**\n$$a^2 + b^2 = c^2$$\n$$6^2 + 8^2 = c^2 \\implies 36 + 64 = 100 \\implies c = \\sqrt{100} = 10$$\n\n**Shortcut:** This is a standard $3-4-5$ Pythagorean triple scaled by a factor of $2$: $2(3, 4, 5) = (6, 8, 10)$.`,
          hint: 'Recall the Pythagorean theorem $a^2 + b^2 = c^2$ or the $3-4-5$ triangle triple.',
        };
      }
      if (difficulty === 'Medium') {
        return {
          id: uid,
          number: index,
          section: 'math',
          module: 1,
          domain: 'Geometry & Trigonometry',
          difficulty: 'Medium',
          type: type === 'student_produced' ? 'student_produced' : 'multiple_choice',
          prompt: `In the $xy$-plane, a circle has equation $(x - 5)^2 + (y + 3)^2 = 49$. What is the area of the circle?`,
          options:
            type === 'student_produced'
              ? undefined
              : [
                  { id: 'A', text: `$7\\pi$` },
                  { id: 'B', text: `$14\\pi$` },
                  { id: 'C', text: `$49\\pi$` },
                  { id: 'D', text: `$98\\pi$` },
                ],
          correctAnswer: type === 'student_produced' ? '49pi' : 'C',
          explanation: `**Step 1: Identify standard circle equation**\n$$(x - h)^2 + (y - k)^2 = r^2$$\nHere, $r^2 = 49$, which gives radius $r = 7$.\n\n**Step 2: Compute circle area**\n$$\\text{Area} = \\pi r^2 = \\pi(49) = 49\\pi$$\n\n**Conclusion:** Choice (C) is correct.`,
          desmosEquation: '(x - 5)^2 + (y + 3)^2 = 49',
          hint: 'The right side of the circle equation $(x-h)^2 + (y-k)^2 = r^2$ directly represents $r^2$.',
        };
      }
      // Hard Geometry / Trig
      return {
        id: uid,
        number: index,
        section: 'math',
        module: 2,
        domain: 'Geometry & Trigonometry',
        difficulty: 'Hard',
        type: type === 'student_produced' ? 'student_produced' : 'multiple_choice',
        prompt: `In a right triangle with acute angles $A$ and $B$, $\\sin(A) = \\frac{5}{13}$. What is the value of $\\cos(B)$?`,
        options:
          type === 'student_produced'
            ? undefined
            : [
                { id: 'A', text: `$\\frac{5}{13}$` },
                { id: 'B', text: `$\\frac{12}{13}$` },
                { id: 'C', text: `$\\frac{5}{12}$` },
                { id: 'D', text: `$\\frac{13}{5}$` },
              ],
        correctAnswer: type === 'student_produced' ? '5/13' : 'A',
        explanation: `**Step 1: College Board Co-function Identity**\nFor any right triangle with acute angles $A$ and $B$, $A + B = 90^\\circ$ (they are complementary).\n\n**Step 2: Apply the identity**\n$$\\sin(A) = \\cos(90^\\circ - A) = \\cos(B)$$\nSince $\\sin(A) = \\frac{5}{13}$, it follows immediately that:\n$$\\cos(B) = \\frac{5}{13}$$\n\n**Conclusion:** Choice (A) is correct.`,
        hint: 'Use the co-function identity: $\\sin(A) = \\cos(B)$ when $A$ and $B$ are complementary angles in a right triangle.',
      };
    }
  }
}

/**
 * Generates a single Digital SAT Math question using live AI (Groq or Gemini)
 * with automatic fallback to psychometrically calibrated templates.
 */
export async function generateSingleQuestion(
  input: GenerateQuestionInput
): Promise<GeneratedQuestionResult> {
  const { domain, difficulty, type, topic, instructions, targetPacingSeconds } = input;

  const systemInstruction = `You are an elite Digital SAT Math Psychometric Assessment Author.
Generate authentic, College Board standard SAT math questions formatted strictly as JSON.
Guidelines:
1. All math must be formatted in KaTeX ($...$ for inline, $$...$$ for block).
2. Multiple choice questions MUST have exactly 4 choices (A, B, C, D) with plausible distractors.
3. Student produced response questions MUST have a clear numerical or fractional answer.
4. Explanations must be step-by-step with KaTeX formulas, Desmos calculator shortcuts, and common trap alerts.
5. Return ONLY a single JSON object with no additional markdown text outside the JSON.`;

  const prompt = `Generate a Digital SAT Math Question:
- Domain: ${domain}
- Difficulty: ${difficulty}
- Question Type: ${type}
- Specific Topic / Subtopic: ${topic || 'Standard Digital SAT Math'}
- Target Pacing: ~${targetPacingSeconds || (difficulty === 'Easy' ? 45 : difficulty === 'Medium' ? 75 : 105)} seconds
${instructions ? `- Additional Instructions: ${instructions}` : ''}

Respond with this exact JSON schema:
{
  "prompt": "Question text using KaTeX $...$",
  "type": "${type}",
  "domain": "${domain}",
  "difficulty": "${difficulty}",
  "options": [
    { "id": "A", "text": "Choice A" },
    { "id": "B", "text": "Choice B" },
    { "id": "C", "text": "Choice C" },
    { "id": "D", "text": "Choice D" }
  ],
  "correctAnswer": "A",
  "explanation": "Step-by-step markdown with KaTeX equations",
  "hint": "Concise Socratic hint",
  "desmosEquation": "optional Desmos graphable equation"
}`;

  let rawResponse: string | undefined;

  // 1. Try Groq (Qwen / Llama) if configured and not explicitly disabled
  if (input.useLiveAI !== false && hasGroqApiKey()) {
    try {
      const messages = [
        { role: 'system' as const, content: systemInstruction },
        { role: 'user' as const, content: prompt },
      ];
      const res = await getTutorReplyDetailed(messages);
      if (res && res.content) {
        rawResponse = res.content;
      }
    } catch (err) {
      console.warn('[AI Question Generator] Groq call failed, attempting Gemini:', err);
    }
  }

  // 2. Try Gemini if Groq did not succeed
  if (input.useLiveAI !== false && !rawResponse && hasValidApiKey()) {
    try {
      const client = getGeminiClient();
      const model = client.getGenerativeModel({
        model: 'gemini-3.6-flash',
        systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: input.temperature ?? 0.3,
          maxOutputTokens: 1800,
          responseMimeType: 'application/json',
        },
      });

      const res = await model.generateContent(prompt);
      const text = (await res.response).text();
      if (text && text.trim().length > 0) {
        rawResponse = text.trim();
      }
    } catch (err) {
      console.warn('[AI Question Generator] Gemini call failed:', err);
    }
  }

  // 3. If raw response is available, attempt sanitize and validation
  if (rawResponse) {
    try {
      const parsed = sanitizeAndParseAIJson<Partial<Question>>(rawResponse);
      const validation = validateGeneratedQuestion(parsed);

      if (validation.isValid) {
        const question: Question = {
          id: `q_ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          number: 1,
          section: 'math',
          module: 1,
          domain: (parsed.domain as MathDomain) || domain,
          difficulty: (parsed.difficulty as 'Easy' | 'Medium' | 'Hard') || difficulty,
          type: (parsed.type as 'multiple_choice' | 'student_produced') || type,
          prompt: parsed.prompt || '',
          options: parsed.options as QuestionOption[],
          correctAnswer: String(parsed.correctAnswer || 'A'),
          explanation: parsed.explanation || '',
          hint: parsed.hint,
          desmosEquation: parsed.desmosEquation,
        };

        return {
          question,
          validation,
          rawResponse,
          createdAt: Date.now(),
        };
      }
    } catch (parseErr) {
      console.warn('[AI Question Generator] Failed to parse AI response, utilizing calibrated fallback:', parseErr);
    }
  }

  // 4. Calibrated psychometric fallback
  const fallbackQuestion = getCalibratedFallbackQuestion(input, 1);
  const fallbackValidation = validateGeneratedQuestion(fallbackQuestion);

  return {
    question: fallbackQuestion,
    validation: fallbackValidation,
    rawResponse: rawResponse || 'Generated via ScoreUp Psychometric Math Engine',
    createdAt: Date.now(),
  };
}

/**
 * Digital SAT Math Blueprint Definition.
 * Calibrated against College Board section weights and psychometric pacing.
 */
interface SlotBlueprint {
  module: 1 | 2;
  number: number;
  domain: MathDomain;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'multiple_choice' | 'student_produced';
}

function buildPsychometricBlueprint(
  totalQuestions: number = 44,
  testDifficulty: 'Standard' | 'Hard' | '750+' | 'Adaptive' = 'Standard',
  focusDomains?: MathDomain[]
): { module1Slots: SlotBlueprint[]; module2Slots: SlotBlueprint[] } {
  const m1Count = Math.ceil(totalQuestions / 2);
  const m2Count = Math.floor(totalQuestions / 2);

  const defaultDomainCycle: MathDomain[] = focusDomains && focusDomains.length > 0
    ? focusDomains
    : [
        'Algebra',
        'Advanced Math',
        'Algebra',
        'Advanced Math',
        'Problem-Solving & Data Analysis',
        'Geometry & Trigonometry',
        'Algebra',
        'Advanced Math',
        'Geometry & Trigonometry',
        'Problem-Solving & Data Analysis',
      ];

  const buildSlots = (count: number, moduleNum: 1 | 2): SlotBlueprint[] => {
    return Array.from({ length: count }, (_, idx) => {
      const qNum = idx + 1;
      const domain = defaultDomainCycle[idx % defaultDomainCycle.length];

      // Question format: last 20% of module are student-produced responses
      const isSpr = qNum > Math.floor(count * 0.8);
      const type: 'multiple_choice' | 'student_produced' = isSpr ? 'student_produced' : 'multiple_choice';

      let difficulty: 'Easy' | 'Medium' | 'Hard';

      if (moduleNum === 1) {
        // Module 1 (Routing Baseline): 35% Easy, 45% Medium, 20% Hard
        if (qNum <= Math.floor(count * 0.35)) {
          difficulty = 'Easy';
        } else if (qNum <= Math.floor(count * 0.8)) {
          difficulty = 'Medium';
        } else {
          difficulty = 'Hard';
        }
      } else {
        // Module 2 (Adaptive Route)
        if (testDifficulty === '750+' || testDifficulty === 'Hard') {
          // Hard adaptive route: 15% Easy, 35% Medium, 50% Hard
          if (qNum <= Math.floor(count * 0.15)) {
            difficulty = 'Easy';
          } else if (qNum <= Math.floor(count * 0.5)) {
            difficulty = 'Medium';
          } else {
            difficulty = 'Hard';
          }
        } else {
          // Standard route: 25% Easy, 50% Medium, 25% Hard
          if (qNum <= Math.floor(count * 0.25)) {
            difficulty = 'Easy';
          } else if (qNum <= Math.floor(count * 0.75)) {
            difficulty = 'Medium';
          } else {
            difficulty = 'Hard';
          }
        }
      }

      return {
        module: moduleNum,
        number: qNum,
        domain,
        difficulty,
        type,
      };
    });
  };

  return {
    module1Slots: buildSlots(m1Count, 1),
    module2Slots: buildSlots(m2Count, 2),
  };
}

/**
 * Generates a complete, psychometrically calibrated Digital SAT Math Practice Test.
 * Automatically saves the test to IndexedDB / localStorage datastore.
 */
export async function generateFullPracticeTest(
  options: GenerateTestOptions = {}
): Promise<CustomPracticeTest> {
  const {
    title = `Digital SAT Math Practice Test (${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`,
    difficulty = 'Standard',
    category = 'custom',
    totalQuestions = 44,
    moduleTimeMinutes = 35,
    focusDomains,
    customInstructions,
    onProgress,
  } = options;

  const blueprint = buildPsychometricBlueprint(totalQuestions, difficulty, focusDomains);
  const totalSlots = blueprint.module1Slots.length + blueprint.module2Slots.length;

  let completedCount = 0;

  const generateFromSlot = async (slot: SlotBlueprint): Promise<Question> => {
    onProgress?.({
      current: completedCount,
      total: totalSlots,
      message: `Generating Module ${slot.module} Question ${slot.number} (${slot.domain} • ${slot.difficulty})...`,
    });

    const res = await generateSingleQuestion({
      domain: slot.domain,
      difficulty: slot.difficulty,
      type: slot.type,
      instructions: customInstructions,
      useLiveAI: options.useLiveAI,
    });

    completedCount++;

    return {
      ...res.question,
      module: slot.module,
      number: slot.number,
    };
  };

  // Generate Module 1 questions
  const rawM1: Question[] = [];
  for (const slot of blueprint.module1Slots) {
    const q = await generateFromSlot(slot);
    rawM1.push(q);
  }

  // Generate Module 2 questions
  const rawM2: Question[] = [];
  for (const slot of blueprint.module2Slots) {
    const q = await generateFromSlot(slot);
    rawM2.push(q);
  }

  // Sort each module by difficulty progression (Easy -> Medium -> Hard)
  const module1Questions = sortQuestionsByDifficulty(rawM1).map((q, idx) => ({
    ...q,
    module: 1 as const,
    number: idx + 1,
  }));

  const m1Length = module1Questions.length;
  const module2Questions = sortQuestionsByDifficulty(rawM2).map((q, idx) => ({
    ...q,
    module: 2 as const,
    number: m1Length + idx + 1,
  }));

  const practiceTest: CustomPracticeTest = {
    id: `custom_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title,
    description: `Complete ${totalSlots}-question Digital SAT Math exam calibrated with College Board domain weights and adaptive difficulty pacing.`,
    category,
    badge: difficulty === '750+' ? '750+ Elite' : 'Psychometrically Calibrated',
    difficulty,
    durationMinutes: moduleTimeMinutes * 2,
    moduleTimeMinutes,
    totalQuestions: totalSlots,
    module1Questions,
    module2Questions,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPublished: true,
  };

  // Save to datastore
  await saveCustomPracticeTest(practiceTest);

  onProgress?.({
    current: totalSlots,
    total: totalSlots,
    message: `Practice test "${title}" successfully generated and saved!`,
  });

  return practiceTest;
}
