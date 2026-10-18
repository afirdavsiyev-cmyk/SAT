import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  sanitizeAndParseAIJson,
  validateGeneratedQuestion,
  generateSingleQuestion,
  generateFullPracticeTest,
  getCalibratedFallbackQuestion,
} from './aiQuestionGenerator';
import { getCustomPracticeTestById } from './customPracticeTestsService';
import { Question } from '../types';

describe('aiQuestionGenerator - sanitizeAndParseAIJson', () => {
  it('parses clean JSON objects directly', () => {
    const raw = '{"prompt": "What is 2 + 2?", "ans": 4}';
    const result = sanitizeAndParseAIJson<{ prompt: string; ans: number }>(raw);
    expect(result.prompt).toBe('What is 2 + 2?');
    expect(result.ans).toBe(4);
  });

  it('strips markdown code fences (```json ... ```)', () => {
    const raw = '```json\n{\n  "title": "SAT Test",\n  "count": 44\n}\n```';
    const result = sanitizeAndParseAIJson<{ title: string; count: number }>(raw);
    expect(result.title).toBe('SAT Test');
    expect(result.count).toBe(44);
  });

  it('strips generic markdown code fences (``` ... ```)', () => {
    const raw = '```\n{\n  "status": "ready"\n}\n```';
    const result = sanitizeAndParseAIJson<{ status: string }>(raw);
    expect(result.status).toBe('ready');
  });

  it('extracts JSON when preceded and followed by conversational LLM text', () => {
    const raw = `Sure! Here is the requested SAT Math question formatted in JSON:
{
  "prompt": "If $x + 5 = 12$, what is $x$?",
  "correctAnswer": "7"
}
I hope this problem meets your test criteria!`;

    const result = sanitizeAndParseAIJson<{ prompt: string; correctAnswer: string }>(raw);
    expect(result.prompt).toBe('If $x + 5 = 12$, what is $x$?');
    expect(result.correctAnswer).toBe('7');
  });

  it('repairs trailing commas before closing braces and brackets', () => {
    const raw = `
{
  "items": [
    "item1",
    "item2",
  ],
  "difficulty": "Hard",
}`;
    const result = sanitizeAndParseAIJson<{ items: string[]; difficulty: string }>(raw);
    expect(result.items).toEqual(['item1', 'item2']);
    expect(result.difficulty).toBe('Hard');
  });

  it('repairs unescaped LaTeX backslashes without corrupting math', () => {
    // In raw LLM output, \sqrt and \frac often have single backslashes
    const raw = '{"prompt": "Calculate $\\frac{a}{b}$ and $\\sqrt{x^2 + 16}$."}';
    const result = sanitizeAndParseAIJson<{ prompt: string }>(raw);
    expect(result.prompt).toContain('frac{a}{b}');
    expect(result.prompt).toContain('sqrt{x^2 + 16}');
  });

  it('throws a meaningful error on empty or non-string input', () => {
    expect(() => sanitizeAndParseAIJson('')).toThrow();
    expect(() => sanitizeAndParseAIJson(null as any)).toThrow();
  });
});

describe('aiQuestionGenerator - validateGeneratedQuestion', () => {
  it('validates a correct multiple-choice question', () => {
    const q: Partial<Question> = {
      prompt: 'If $3x - 7 = 14$, what is the value of $x$?',
      type: 'multiple_choice',
      domain: 'Algebra',
      difficulty: 'Easy',
      options: [
        { id: 'A', text: '$5$' },
        { id: 'B', text: '$7$' },
        { id: 'C', text: '$9$' },
        { id: 'D', text: '$11$' },
      ],
      correctAnswer: 'B',
      explanation: 'Add 7 to both sides: $3x = 21$. Divide by 3: $x = 7$.',
    };

    const val = validateGeneratedQuestion(q);
    expect(val.isValid).toBe(true);
    expect(val.hasExplanation).toBe(true);
    expect(val.hasOptionsIfMultipleChoice).toBe(true);
    expect(val.correctAnswerMatchesOptions).toBe(true);
    expect(val.latexErrors).toBeUndefined();
  });

  it('validates a student-produced response question', () => {
    const q: Partial<Question> = {
      prompt: 'What is the positive solution to $x^2 - 49 = 0$?',
      type: 'student_produced',
      domain: 'Advanced Math',
      difficulty: 'Medium',
      correctAnswer: '7',
      explanation: '$$x^2 = 49 \\implies x = \\pm 7$$. Since $x > 0$, the solution is $7$.',
    };

    const val = validateGeneratedQuestion(q);
    expect(val.isValid).toBe(true);
    expect(val.correctAnswerMatchesOptions).toBe(true);
  });

  it('flags unclosed LaTeX dollar delimiter ($)', () => {
    const q: Partial<Question> = {
      prompt: 'If $3x - 7 = 14, what is $x$?', // 3 unescaped dollar signs!
      type: 'multiple_choice',
      options: [
        { id: 'A', text: '$5$' },
        { id: 'B', text: '$7$' },
        { id: 'C', text: '$9$' },
        { id: 'D', text: '$11$' },
      ],
      correctAnswer: 'B',
      explanation: 'Detailed explanation here with proper text.',
    };

    const val = validateGeneratedQuestion(q);
    expect(val.isValid).toBe(false);
    expect(val.latexErrors).toBeDefined();
    expect(val.latexErrors?.[0]).toContain('odd number of $');
  });

  it('flags unmatched curly braces in LaTeX formulas', () => {
    const q: Partial<Question> = {
      prompt: 'What is $\\frac{x}{2$?', // missing closing brace
      type: 'student_produced',
      correctAnswer: '4',
      explanation: 'Detailed explanation with valid length.',
    };

    const val = validateGeneratedQuestion(q);
    expect(val.isValid).toBe(false);
    expect(val.latexErrors).toBeDefined();
  });

  it('flags missing explanation or missing options in multiple choice', () => {
    const qNoExp: Partial<Question> = {
      prompt: 'If $x = 4$, what is $2x$?',
      type: 'multiple_choice',
      options: [
        { id: 'A', text: '$4$' },
        { id: 'B', text: '$8$' },
      ], // Only 2 options!
      correctAnswer: 'B',
      explanation: '', // Empty explanation
    };

    const val = validateGeneratedQuestion(qNoExp);
    expect(val.isValid).toBe(false);
    expect(val.hasExplanation).toBe(false);
    expect(val.hasOptionsIfMultipleChoice).toBe(false);
  });
});

describe('aiQuestionGenerator - single question generation', () => {
  it('generates a valid calibrated question for Algebra Easy', async () => {
    const result = await generateSingleQuestion({
      domain: 'Algebra',
      difficulty: 'Easy',
      type: 'multiple_choice',
      useLiveAI: false,
    });

    expect(result.question).toBeDefined();
    expect(result.question.domain).toBe('Algebra');
    expect(result.question.difficulty).toBe('Easy');
    expect(result.question.options?.length).toBe(4);
    expect(result.validation.isValid).toBe(true);
  });

  it('generates a valid calibrated question for Advanced Math Hard (SPR)', async () => {
    const result = await generateSingleQuestion({
      domain: 'Advanced Math',
      difficulty: 'Hard',
      type: 'student_produced',
      useLiveAI: false,
    });

    expect(result.question).toBeDefined();
    expect(result.question.domain).toBe('Advanced Math');
    expect(result.question.difficulty).toBe('Hard');
    expect(result.question.type).toBe('student_produced');
    expect(result.question.correctAnswer).toBeDefined();
    expect(result.validation.isValid).toBe(true);
  });

  it('generates questions across all 4 math domains', async () => {
    const domains = [
      'Algebra',
      'Advanced Math',
      'Problem-Solving & Data Analysis',
      'Geometry & Trigonometry',
    ] as const;

    for (const d of domains) {
      const result = await generateSingleQuestion({
        domain: d,
        difficulty: 'Medium',
        type: 'multiple_choice',
        useLiveAI: false,
      });
      expect(result.question.domain).toBe(d);
      expect(result.validation.isValid).toBe(true);
    }
  });
});

describe('aiQuestionGenerator - full practice test generation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('generates and saves a psychometrically calibrated custom test with progress reporting', async () => {
    const progressUpdates: number[] = [];

    const test = await generateFullPracticeTest({
      title: 'October 2026 Diagnostic Mock',
      difficulty: 'Standard',
      totalQuestions: 6, // 3 in M1, 3 in M2 for test speed
      moduleTimeMinutes: 10,
      useLiveAI: false,
      onProgress: (prog) => {
        progressUpdates.push(prog.current);
      },
    });

    expect(test.id).toBeDefined();
    expect(test.title).toBe('October 2026 Diagnostic Mock');
    expect(test.totalQuestions).toBe(6);
    expect(test.module1Questions.length).toBe(3);
    expect(test.module2Questions.length).toBe(3);

    // Check Module 1 questions are numbered sequentially 1, 2, 3
    expect(test.module1Questions[0].number).toBe(1);
    expect(test.module1Questions[1].number).toBe(2);
    expect(test.module1Questions[2].number).toBe(3);

    // Check Module 2 questions are numbered sequentially 4, 5, 6
    expect(test.module2Questions[0].number).toBe(4);
    expect(test.module2Questions[1].number).toBe(5);
    expect(test.module2Questions[2].number).toBe(6);

    // Progress updates should have recorded progress
    expect(progressUpdates.length).toBeGreaterThan(0);

    // Check that it was saved to the datastore
    const retrieved = await getCustomPracticeTestById(test.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(test.id);
    expect(retrieved?.totalQuestions).toBe(6);
  });
});
