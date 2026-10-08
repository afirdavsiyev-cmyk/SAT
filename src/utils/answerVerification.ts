/**
 * SAT Math Answer Verification Utility
 * 
 * Implements College Board Digital SAT evaluation standards for:
 * 1. Multiple Choice options (case-insensitive letter matching: A, B, C, D).
 * 2. Student-Produced Responses (Grid-Ins):
 *    - Fraction to decimal equivalence (e.g., 5/2 === 2.5, 1/4 === 0.25).
 *    - Decimal to fraction equivalence (e.g., 0.5 === 1/2).
 *    - Equivalent fractions (e.g., 10/4 === 5/2).
 *    - Negative fractions and decimals (e.g., -4/5 === -0.8).
 *    - Repeating decimals with standard SAT truncation/rounding (e.g., 1/3 === 0.333 or 0.3333).
 *    - Formatting flexibility (leading decimals like .5, spaces like " 5 / 2 ", currency/percent signs).
 *    - Compound answers in question data (e.g., "5/2, 2.5" or "5/2 or 2.5" or explicit acceptableAnswers arrays).
 */

export interface AnswerVerificationContext {
  options?: { id: string; text: string }[];
  acceptableAnswers?: string[];
  explanation?: string;
  type?: 'multiple_choice' | 'student_produced' | string;
}

/**
 * Parses a numeric value from string, handling fractions (a/b), decimals, integers,
 * and stripping superfluous symbols like $, %, °, commas, or parentheses.
 */
export function parseNumericValue(str: string | undefined | null): number | null {
  if (str === undefined || str === null) return null;
  let s = String(str).trim().toLowerCase();
  if (!s) return null;

  // Strip currency symbols, percent, degree signs, commas
  s = s.replace(/[\$€£%°,]/g, '').trim();

  // Strip wrapping parentheses: e.g. "(5/2)" -> "5/2"
  s = s.replace(/^\((.+)\)$/, '$1').trim();

  // Handle fraction syntax: "a/b"
  const fractionMatch = s.match(/^([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)$/);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    if (den !== 0 && !isNaN(num) && !isNaN(den)) {
      return num / den;
    }
    return null;
  }

  // Handle standard decimal or integer syntax: "2.5", ".5", "-.75", "45", "+3"
  const numMatch = s.match(/^[+-]?(?:\d+\.?\d*|\.\d+)$/);
  if (numMatch) {
    const val = parseFloat(s);
    if (!isNaN(val)) {
      return val;
    }
  }

  return null;
}

function countDecimalPlaces(str: string): number {
  const match = str.trim().match(/\.(\d+)/);
  return match ? match[1].length : 0;
}

/**
 * Checks whether two numbers are equivalent according to Digital SAT specifications,
 * including exact tolerance and repeating decimal truncation/rounding.
 */
export function areNumbersEquivalent(
  userNum: number,
  targetNum: number,
  userStr: string = '',
  targetStr: string = ''
): boolean {
  // 1. Direct floating point equality or close epsilon
  if (Math.abs(userNum - targetNum) < 1e-6) return true;
  if (Math.abs(userNum - targetNum) < 0.0001) return true;

  // 2. Relative error tolerance for repeating decimals (e.g. 0.333 vs 1/3)
  if (Math.abs(targetNum) > 0 && Math.abs(userNum - targetNum) / Math.abs(targetNum) < 0.002) {
    return true;
  }

  // 3. SAT grid-in repeating decimal rules:
  // A student may truncate or round a repeating fraction to the available decimal places (3 or 4 places).
  const decPlaces = Math.max(countDecimalPlaces(userStr), countDecimalPlaces(targetStr));
  if (decPlaces >= 3) {
    const targetRounded = Number(targetNum.toFixed(decPlaces));
    if (Math.abs(userNum - targetRounded) < 1e-5) return true;

    const factor = Math.pow(10, decPlaces);
    const targetTruncated = Math.trunc(targetNum * factor) / factor;
    if (Math.abs(userNum - targetTruncated) < 1e-5) return true;
  }

  return false;
}

/**
 * Core validation function to determine if a student's answer is equivalent to the correct answer.
 */
export function isAnswerEquivalent(
  userRaw: string | undefined | null,
  correctRaw: string | undefined | null,
  context?: AnswerVerificationContext
): boolean {
  if (userRaw === undefined || userRaw === null) return false;
  if (correctRaw === undefined || correctRaw === null) return false;

  const userClean = String(userRaw).trim();
  const correctClean = String(correctRaw).trim();
  if (!userClean || !correctClean) return false;

  // Gather all acceptable candidates
  const candidatePool: string[] = [correctClean];

  if (context?.acceptableAnswers && Array.isArray(context.acceptableAnswers)) {
    candidatePool.push(...context.acceptableAnswers.map((a) => String(a).trim()));
  }

  // Auto-extract explicitly stated acceptable alternatives from explanation text if present
  // e.g. "Both 5/2 and 2.5 are acceptable" or "Either 3 or 4 is acceptable"
  if (context?.explanation) {
    const exp = context.explanation;
    const bothMatch = exp.match(/both\s+([$\d\.\/\-]+)\s+and\s+([$\d\.\/\-]+)\s+are\s+acceptable/i);
    if (bothMatch) {
      candidatePool.push(bothMatch[1].replace(/\$/g, ''), bothMatch[2].replace(/\$/g, ''));
    }
    const eitherMatch = exp.match(/either\s+([$\d\.\/\-]+)\s+or\s+([$\d\.\/\-]+)\s+is\s+acceptable/i);
    if (eitherMatch) {
      candidatePool.push(eitherMatch[1].replace(/\$/g, ''), eitherMatch[2].replace(/\$/g, ''));
    }
  }

  // Split any compound candidate: "5/2, 2.5" or "5/2 or 2.5" or "2.5; 5/2"
  const allCandidates = new Set<string>();
  for (const item of candidatePool) {
    const segments = item.split(/(?:,\s*|\s+or\s+|;\s*)/i).map((s) => s.trim()).filter(Boolean);
    for (const seg of segments) {
      allCandidates.add(seg);
    }
  }

  const userUpper = userClean.toUpperCase();
  const userNum = parseNumericValue(userClean);

  for (const candidate of allCandidates) {
    const candUpper = candidate.toUpperCase();

    // 1. Direct string match (case-insensitive)
    if (userClean.toLowerCase() === candidate.toLowerCase()) {
      return true;
    }

    // 2. Multiple choice letter matching (A, B, C, D)
    if (/^[A-D]$/.test(userUpper) && /^[A-D]$/.test(candUpper)) {
      if (userUpper === candUpper) return true;
    }

    // Handle "(A)" or "Choice A"
    const userLetterMatch = userClean.match(/^(?:\(?([A-D])\)?|Choice\s+([A-D]))$/i);
    const candLetterMatch = candidate.match(/^(?:\(?([A-D])\)?|Choice\s+([A-D]))$/i);
    const userLetter = userLetterMatch ? (userLetterMatch[1] || userLetterMatch[2]).toUpperCase() : null;
    const candLetter = candLetterMatch ? (candLetterMatch[1] || candLetterMatch[2]).toUpperCase() : null;
    if (userLetter && candLetter && userLetter === candLetter) {
      return true;
    }

    // Check if user selected or entered option text matching the correct option
    if (context?.options && Array.isArray(context.options)) {
      const targetOpt = context.options.find((o) => o.id === candidate || (candLetter && o.id === candLetter));
      if (targetOpt && targetOpt.text.trim().toLowerCase() === userClean.toLowerCase()) {
        return true;
      }
    }

    // 3. Numeric & Fraction Equivalence
    const candNum = parseNumericValue(candidate);
    if (userNum !== null && candNum !== null) {
      if (areNumbersEquivalent(userNum, candNum, userClean, candidate)) {
        return true;
      }
    }
  }

  return false;
}
