import { describe, it, expect } from 'vitest';
import { OFFICIAL_PRACTICE_TEST_1_QUESTIONS, getPracticeTest1Module1, getPracticeTest1Module2 } from './officialPracticeTest1';
import { OFFICIAL_PRACTICE_TEST_2_QUESTIONS, getPracticeTest2Module1, getPracticeTest2Module2 } from './officialPracticeTest2';
import { OFFICIAL_PRACTICE_TEST_3_QUESTIONS, getPracticeTest3Module1, getPracticeTest3Module2 } from './officialPracticeTest3';
import { OFFICIAL_PRACTICE_TEST_4_QUESTIONS, getPracticeTest4Module1, getPracticeTest4Module2 } from './officialPracticeTest4';
import { OFFICIAL_PRACTICE_TEST_5_QUESTIONS, getPracticeTest5Module1, getPracticeTest5Module2 } from './officialPracticeTest5';
import { OFFICIAL_PRACTICE_TEST_6_QUESTIONS, getPracticeTest6Module1, getPracticeTest6Module2 } from './officialPracticeTest6';
import { OFFICIAL_PRACTICE_TEST_7_QUESTIONS, getPracticeTest7Module1, getPracticeTest7Module2 } from './officialPracticeTest7';
import { OFFICIAL_PRACTICE_TEST_8_QUESTIONS, getPracticeTest8Module1, getPracticeTest8Module2 } from './officialPracticeTest8';
import { OFFICIAL_PRACTICE_TEST_9_QUESTIONS, getPracticeTest9Module1, getPracticeTest9Module2 } from './officialPracticeTest9';
import { OFFICIAL_PRACTICE_TEST_10_QUESTIONS, getPracticeTest10Module1, getPracticeTest10Module2 } from './officialPracticeTest10';
import { OFFICIAL_PRACTICE_TEST_11_QUESTIONS, getPracticeTest11Module1, getPracticeTest11Module2 } from './officialPracticeTest11';
import { FULL_PRACTICE_TESTS } from './fullPracticeTestsData';
import { Question } from '../types';

describe('Official Practice Tests Integrity (Tests 1 to 11)', () => {
  const tests: { name: string; questions: Question[]; m1: () => Question[]; m2: () => Question[] }[] = [
    { name: 'PT1', questions: OFFICIAL_PRACTICE_TEST_1_QUESTIONS, m1: getPracticeTest1Module1, m2: getPracticeTest1Module2 },
    { name: 'PT2', questions: OFFICIAL_PRACTICE_TEST_2_QUESTIONS, m1: getPracticeTest2Module1, m2: getPracticeTest2Module2 },
    { name: 'PT3', questions: OFFICIAL_PRACTICE_TEST_3_QUESTIONS, m1: getPracticeTest3Module1, m2: getPracticeTest3Module2 },
    { name: 'PT4', questions: OFFICIAL_PRACTICE_TEST_4_QUESTIONS, m1: getPracticeTest4Module1, m2: getPracticeTest4Module2 },
    { name: 'PT5', questions: OFFICIAL_PRACTICE_TEST_5_QUESTIONS, m1: getPracticeTest5Module1, m2: getPracticeTest5Module2 },
    { name: 'PT6', questions: OFFICIAL_PRACTICE_TEST_6_QUESTIONS, m1: getPracticeTest6Module1, m2: getPracticeTest6Module2 },
    { name: 'PT7', questions: OFFICIAL_PRACTICE_TEST_7_QUESTIONS, m1: getPracticeTest7Module1, m2: getPracticeTest7Module2 },
    { name: 'PT8', questions: OFFICIAL_PRACTICE_TEST_8_QUESTIONS, m1: getPracticeTest8Module1, m2: getPracticeTest8Module2 },
    { name: 'PT9', questions: OFFICIAL_PRACTICE_TEST_9_QUESTIONS, m1: getPracticeTest9Module1, m2: getPracticeTest9Module2 },
    { name: 'PT10', questions: OFFICIAL_PRACTICE_TEST_10_QUESTIONS, m1: getPracticeTest10Module1, m2: getPracticeTest10Module2 },
    { name: 'PT11', questions: OFFICIAL_PRACTICE_TEST_11_QUESTIONS, m1: getPracticeTest11Module1, m2: getPracticeTest11Module2 },
  ];

  tests.forEach(({ name, questions, m1, m2 }) => {
    describe(`${name} Quality & Structure`, () => {
      it('has exactly 44 questions', () => {
        expect(questions).toHaveLength(44);
      });

      it('has exactly 22 questions in module 1 and 22 in module 2', () => {
        expect(m1()).toHaveLength(22);
        expect(m2()).toHaveLength(22);
      });

      it('has unique question IDs', () => {
        const ids = questions.map((q) => q.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(44);
      });

      it('has valid question structure, prompt, explanation, and answer options', () => {
        questions.forEach((q) => {
          expect(q.prompt).toBeTruthy();
          expect(q.correctAnswer).toBeTruthy();
          expect(q.explanation).toBeTruthy();
          expect(q.domain).toBeTruthy();

          if (q.type === 'multiple_choice') {
            expect(q.options).toBeDefined();
            expect(q.options!.length).toBeGreaterThanOrEqual(4);
            const optIds = q.options!.map((o) => o.id);
            expect(optIds).toContain(q.correctAnswer);
          }
        });
      });
    });
  });

  it('FULL_PRACTICE_TESTS contains all 11 registered mocks', () => {
    expect(FULL_PRACTICE_TESTS).toHaveLength(11);
    const ids = FULL_PRACTICE_TESTS.map((t) => t.id);
    for (let i = 1; i <= 11; i++) {
      expect(ids).toContain(`pt${i}`);
    }
  });
});
