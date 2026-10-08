import { describe, it, expect } from 'vitest';
import {
  isAnswerEquivalent,
  parseNumericValue,
  areNumbersEquivalent
} from './answerVerification';

describe('answerVerification utility', () => {
  describe('parseNumericValue', () => {
    it('parses integers and decimals', () => {
      expect(parseNumericValue('45')).toBe(45);
      expect(parseNumericValue('2.5')).toBe(2.5);
      expect(parseNumericValue('.5')).toBe(0.5);
      expect(parseNumericValue('-0.75')).toBe(-0.75);
      expect(parseNumericValue('-.75')).toBe(-0.75);
    });

    it('parses fractions', () => {
      expect(parseNumericValue('5/2')).toBe(2.5);
      expect(parseNumericValue(' 5 / 2 ')).toBe(2.5);
      expect(parseNumericValue('-3/4')).toBe(-0.75);
      expect(parseNumericValue('1/4')).toBe(0.25);
      expect(parseNumericValue('10/4')).toBe(2.5);
    });

    it('strips extraneous symbols like currency, %, degrees, parentheses', () => {
      expect(parseNumericValue('$11.70')).toBe(11.7);
      expect(parseNumericValue('88°')).toBe(88);
      expect(parseNumericValue('(5/2)')).toBe(2.5);
      expect(parseNumericValue('25%')).toBe(25);
    });

    it('returns null for non-numeric strings', () => {
      expect(parseNumericValue('A')).toBeNull();
      expect(parseNumericValue('')).toBeNull();
      expect(parseNumericValue('abc')).toBeNull();
    });
  });

  describe('isAnswerEquivalent - Digital SAT Student-Produced Responses', () => {
    it('recognizes 5/2 as equivalent to 2.5 (the user reported bug)', () => {
      expect(isAnswerEquivalent('5/2', '2.5')).toBe(true);
      expect(isAnswerEquivalent('2.5', '5/2')).toBe(true);
      expect(isAnswerEquivalent(' 5 / 2 ', '2.5')).toBe(true);
    });

    it('recognizes fraction to decimal equivalences', () => {
      expect(isAnswerEquivalent('1/2', '0.5')).toBe(true);
      expect(isAnswerEquivalent('0.5', '1/2')).toBe(true);
      expect(isAnswerEquivalent('.5', '1/2')).toBe(true);
      expect(isAnswerEquivalent('1/4', '0.25')).toBe(true);
      expect(isAnswerEquivalent('0.25', '1/4')).toBe(true);
      expect(isAnswerEquivalent('-4/5', '-0.8')).toBe(true);
      expect(isAnswerEquivalent('11/4', '2.75')).toBe(true);
    });

    it('recognizes equivalent unreduced and reduced fractions', () => {
      expect(isAnswerEquivalent('10/4', '5/2')).toBe(true);
      expect(isAnswerEquivalent('2/4', '1/2')).toBe(true);
    });

    it('recognizes repeating decimal rounding and truncation per SAT grid rules', () => {
      // 1/3 can be 0.333, 0.3333, .333
      expect(isAnswerEquivalent('0.333', '1/3')).toBe(true);
      expect(isAnswerEquivalent('.333', '1/3')).toBe(true);
      expect(isAnswerEquivalent('0.3333', '1/3')).toBe(true);
      expect(isAnswerEquivalent('1/3', '0.333')).toBe(true);

      // 2/3 can be 0.666, 0.667, 0.6667
      expect(isAnswerEquivalent('0.666', '2/3')).toBe(true);
      expect(isAnswerEquivalent('0.667', '2/3')).toBe(true);
      expect(isAnswerEquivalent('.667', '2/3')).toBe(true);

      // 4/7 can be 0.571
      expect(isAnswerEquivalent('0.571', '4/7')).toBe(true);
      expect(isAnswerEquivalent('29/3', '9.667')).toBe(true);
    });

    it('handles compound correctAnswer strings in dataset', () => {
      expect(isAnswerEquivalent('5/2', '5/2, 2.5')).toBe(true);
      expect(isAnswerEquivalent('2.5', '5/2, 2.5')).toBe(true);
      expect(isAnswerEquivalent('5/2', '2.5 or 5/2')).toBe(true);
      expect(isAnswerEquivalent('2.5', '2.5 or 5/2')).toBe(true);
    });

    it('extracts acceptable answers mentioned in explanation', () => {
      const explanation = 'The slope m is 5/2 (or 2.5). Both 5/2 and 2.5 are acceptable student-produced responses.';
      expect(isAnswerEquivalent('5/2', '2.5', { explanation })).toBe(true);
      expect(isAnswerEquivalent('2.5', '2.5', { explanation })).toBe(true);
    });

    it('uses acceptableAnswers array when provided', () => {
      expect(isAnswerEquivalent('5/2', '2.5', { acceptableAnswers: ['5/2', '2.5'] })).toBe(true);
    });

    it('correctly rejects wrong answers', () => {
      expect(isAnswerEquivalent('5/2', '2.6')).toBe(false);
      expect(isAnswerEquivalent('3', '4')).toBe(false);
      expect(isAnswerEquivalent('A', 'B')).toBe(false);
      expect(isAnswerEquivalent('', '2.5')).toBe(false);
      expect(isAnswerEquivalent(undefined, '2.5')).toBe(false);
      expect(isAnswerEquivalent('5/2', undefined)).toBe(false);
    });
  });

  describe('isAnswerEquivalent - Multiple Choice Options', () => {
    it('matches case-insensitive option letters', () => {
      expect(isAnswerEquivalent('A', 'A')).toBe(true);
      expect(isAnswerEquivalent('a', 'A')).toBe(true);
      expect(isAnswerEquivalent('(B)', 'B')).toBe(true);
      expect(isAnswerEquivalent('Choice C', 'C')).toBe(true);
      expect(isAnswerEquivalent('A', 'B')).toBe(false);
    });

    it('matches option text when options context is provided', () => {
      const options = [
        { id: 'A', text: '78.2' },
        { id: 'B', text: '80.5' }
      ];
      expect(isAnswerEquivalent('78.2', 'A', { options })).toBe(true);
    });
  });
});
