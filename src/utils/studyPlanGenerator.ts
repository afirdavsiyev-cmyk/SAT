import { MathDomain, StudyPlan, StudyPlanWeek, StudyPlanDay } from '../types';

export interface PlanGeneratorParams {
  targetDate: string;
  targetScore: number;
  currentScore: number;
  baselineBand?: string;
  weakAreas: string[];
  dailyMinutes: number;
  pacePreference: 'confidence_first' | 'balanced' | 'aggressive_hard';
}

export function generatePrescriptiveStudyPlan(params: PlanGeneratorParams): StudyPlan {
  const {
    targetDate,
    targetScore,
    currentScore,
    baselineBand = '630–700 (Proficient)',
    weakAreas,
    dailyMinutes,
    pacePreference
  } = params;

  // Compute question counts based on dailyMinutes & pacePreference
  let totalQuestions = 15;
  let easy = 6;
  let medium = 6;
  let hard = 3;

  if (dailyMinutes === 30) {
    totalQuestions = 10;
    if (pacePreference === 'confidence_first') {
      easy = 6; medium = 3; hard = 1;
    } else if (pacePreference === 'aggressive_hard') {
      easy = 1; medium = 4; hard = 5;
    } else {
      easy = 4; medium = 4; hard = 2;
    }
  } else if (dailyMinutes === 45) {
    totalQuestions = 15;
    if (pacePreference === 'confidence_first') {
      easy = 8; medium = 5; hard = 2;
    } else if (pacePreference === 'aggressive_hard') {
      easy = 2; medium = 6; hard = 7;
    } else {
      easy = 6; medium = 6; hard = 3;
    }
  } else if (dailyMinutes === 60) {
    totalQuestions = 20;
    if (pacePreference === 'confidence_first') {
      easy = 10; medium = 7; hard = 3;
    } else if (pacePreference === 'aggressive_hard') {
      easy = 3; medium = 8; hard = 9;
    } else {
      easy = 8; medium = 8; hard = 4;
    }
  } else if (dailyMinutes === 90) {
    totalQuestions = 28;
    if (pacePreference === 'confidence_first') {
      easy = 14; medium = 10; hard = 4;
    } else if (pacePreference === 'aggressive_hard') {
      easy = 4; medium = 11; hard = 13;
    } else {
      easy = 10; medium = 12; hard = 6;
    }
  }

  const primaryWeak = weakAreas[0] || 'Algebra';
  const secondaryWeak = weakAreas[1] || 'Advanced Math';

  // ─── WEEK 1: Core Fundamentals & Primary Focus (e.g. Algebra) ───
  const week1Days: StudyPlanDay[] = [
    {
      dayNumber: 1,
      dayLabel: 'Day 1',
      title: 'Linear Equations in 1 & 2 Variables',
      domain: 'Algebra',
      skillFocus: 'Single-variable isolations, fractional coefficients & absolute values',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Start from Easy questions first to lock in algebraic fundamentals before attempting multi-step fractional coefficients.',
      type: 'drill',
      completed: true,
    },
    {
      dayNumber: 2,
      dayLabel: 'Day 2',
      title: 'Systems of Linear Equations & Desmos Intersections',
      domain: 'Algebra',
      skillFocus: 'Substitution, elimination, and instant coordinate clicking in Desmos',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Type both linear equations directly into Desmos and click the gray intersection point (x, y) to save ~45s per question.',
      type: 'drill',
      completed: true,
    },
    {
      dayNumber: 3,
      dayLabel: 'Day 3',
      title: 'Linear Inequalities & Constraint Word Problems',
      domain: 'Algebra',
      skillFocus: 'Boundary graphing, shaded regions, and inequality sign flips on negative divisions',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Underline boundary conditions like "at most" (≤) or "at least" (≥) and test the origin (0,0) to verify your inequality region.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 4,
      dayLabel: 'Day 4',
      title: 'Lines, Slopes & Perpendicular Relationships',
      domain: 'Algebra',
      skillFocus: 'Slope formula (y2-y1)/(x2-x1), parallel slopes, and negative reciprocal perpendicular lines',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Perpendicular lines have negative reciprocal slopes (m1 · m2 = -1). Parallel lines have equal slopes with different y-intercepts.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 5,
      dayLabel: 'Day 5',
      title: 'Linear Real-World Modeling & Unit Conversions',
      domain: 'Algebra',
      skillFocus: 'Rate × Time modeling, dimensional analysis, and multi-unit conversions',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Always write down unit fractions so miles/hour converts cleanly to feet/second before performing the final arithmetic.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 6,
      dayLabel: 'Day 6',
      title: 'Review Saved & Mistake Pattern Diagnostic',
      domain: 'Review & Error Diagnostic',
      skillFocus: 'Deep dive into all missed linear & algebraic questions from Days 1–5',
      questionCount: Math.round(totalQuestions * 0.8),
      easyCount: 2,
      mediumCount: Math.round(totalQuestions * 0.5),
      hardCount: Math.round(totalQuestions * 0.3),
      targetMinutes: Math.round(dailyMinutes * 0.75),
      advice: 'Re-solve all flagged and missed items from your error log without looking at hints. Note whether errors were conceptual or computational.',
      type: 'review',
      completed: false,
    },
    {
      dayNumber: 7,
      dayLabel: 'Day 7',
      title: 'Timed Linear Algebra Module Sprint Drill',
      domain: 'Adaptive Module Simulation',
      skillFocus: 'Full 15-question timed benchmark under strict official pacing conditions',
      questionCount: totalQuestions,
      easyCount: 4,
      mediumCount: 7,
      hardCount: 4,
      targetMinutes: Math.round(dailyMinutes * 0.7),
      advice: 'Simulate official testing: aim for under 75 seconds per question and flag any problem taking longer than 90s.',
      type: 'mock',
      completed: false,
    },
  ];

  // ─── WEEK 2: Advanced Math & Desmos Nonlinear Techniques ───
  const week2Days: StudyPlanDay[] = [
    {
      dayNumber: 1,
      dayLabel: 'Day 1',
      title: 'Quadratic Equations, Factoring & Discriminants',
      domain: 'Advanced Math',
      skillFocus: 'Factoring trinomials, quadratic formula, and discriminant (b² - 4ac) analysis',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Check the discriminant: if b² - 4ac > 0 there are 2 real roots; if = 0 there is 1 real root; if < 0 there are no real solutions.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 2,
      dayLabel: 'Day 2',
      title: 'Parabola Vertex Form & Maximum/Minimum Values',
      domain: 'Advanced Math',
      skillFocus: 'f(x) = a(x - h)² + k, line of symmetry x = -b/(2a), and extrema interpretation',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'In Desmos, type the function and tap the topmost or bottommost apex point to read the exact vertex coordinates (h, k).',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 3,
      dayLabel: 'Day 3',
      title: 'Polynomial Roots & Factor Theorem',
      domain: 'Advanced Math',
      skillFocus: 'Root multiplicity, synthetic division, and remainder theorem evaluations',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'If (x - c) is a factor of P(x), then P(c) = 0. Graph P(x) in Desmos to immediately spot all real x-intercepts.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 4,
      dayLabel: 'Day 4',
      title: 'Exponential Growth, Decay & Compound Interest',
      domain: 'Advanced Math',
      skillFocus: 'f(x) = a(1 ± r)^x, percentage changes over time intervals, and half-life decay',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Pay close attention to time increments: if interest compounds every 3 months, the exponent power must be written as x/3.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 5,
      dayLabel: 'Day 5',
      title: 'Radical & Rational Expressions & Extraneous Roots',
      domain: 'Advanced Math',
      skillFocus: 'Fractional exponents x^(a/b) = ᵇ√(xᵃ), simplifying rational expressions, and domain restrictions',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Always substitute solutions back into original denominators to catch extraneous roots that cause division by zero.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 6,
      dayLabel: 'Day 6',
      title: 'Desmos Regression & Mistake Journal Review',
      domain: 'Review & Error Diagnostic',
      skillFocus: 'Mastering table regressions: y1 ~ mx1 + b and y1 ~ a*x1^2 + b*x1 + c',
      questionCount: Math.round(totalQuestions * 0.8),
      easyCount: 2,
      mediumCount: Math.round(totalQuestions * 0.5),
      hardCount: Math.round(totalQuestions * 0.3),
      targetMinutes: Math.round(dailyMinutes * 0.75),
      advice: 'Practice typing regression formulas in Desmos to extract exact constants from tables without manual multi-variable substitution.',
      type: 'review',
      completed: false,
    },
    {
      dayNumber: 7,
      dayLabel: 'Day 7',
      title: 'Hard Module 2 Advanced Math Simulation',
      domain: 'Adaptive Module Simulation',
      skillFocus: '15 High-difficulty Level 4/5 questions under timed exam conditions',
      questionCount: totalQuestions,
      easyCount: 1,
      mediumCount: 6,
      hardCount: 8,
      targetMinutes: Math.round(dailyMinutes * 0.7),
      advice: 'Prioritize quick graphical Desmos setups for 750+ questions to leave adequate time for multi-step algebraic grid-ins.',
      type: 'mock',
      completed: false,
    },
  ];

  // ─── WEEK 3: Problem-Solving, Data & Geometry ───
  const week3Days: StudyPlanDay[] = [
    {
      dayNumber: 1,
      dayLabel: 'Day 1',
      title: 'Ratios, Rates, Proportions & Successive Percentages',
      domain: 'Problem-Solving & Data Analysis',
      skillFocus: 'Compound multiplier method (e.g. +20% then -15% = ×1.20 × 0.85), proportional scaling',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Never add percentages directly: a 20% increase followed by a 20% decrease returns 0.96 (a net 4% loss, not 0%).',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 2,
      dayLabel: 'Day 2',
      title: 'Two-Way Frequency Tables & Conditional Probability',
      domain: 'Problem-Solving & Data Analysis',
      skillFocus: 'Relative frequencies, marginal totals, and conditioned denominator subsets',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Carefully identify the condition phrase ("given that the student is a senior") to restrict the fraction denominator to that subgroup only.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 3,
      dayLabel: 'Day 3',
      title: 'Scatterplots, Best-Fit Lines & Residual Calculations',
      domain: 'Problem-Solving & Data Analysis',
      skillFocus: 'Linear/exponential models, residual = Actual - Predicted, and correlation interpretation',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Residual is always (Actual y-value - Model predicted y-value). Points lying above the trend line have positive residuals.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 4,
      dayLabel: 'Day 4',
      title: 'Circle Equations (x-h)² + (y-k)² = r² & Arc Lengths',
      domain: 'Geometry & Trigonometry',
      skillFocus: 'Completing the square to find center (h, k) and radius r; arc length s = r·θ (in radians)',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Complete the square on both x and y terms to find the radius r. In Desmos, type the general circle equation directly to see the circle graph.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 5,
      dayLabel: 'Day 5',
      title: 'Right Triangle Trigonometry & Similar Triangles',
      domain: 'Geometry & Trigonometry',
      skillFocus: 'SOH CAH TOA, sin(x) = cos(90° - x), special 30-60-90 & 45-45-90 right triangles, scale factors',
      questionCount: totalQuestions,
      easyCount: easy,
      mediumCount: medium,
      hardCount: hard,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Remember the complementary angle identity: sin(A) = cos(B) whenever A + B = 90°. For similar triangles with side scale k, area scales by k².',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 6,
      dayLabel: 'Day 6',
      title: 'Geometry Reference Sheet & Mistake Log Clearance',
      domain: 'Review & Error Diagnostic',
      skillFocus: 'Memorizing key cylinder/cone/sphere volume formulas and clearing missed geometry items',
      questionCount: Math.round(totalQuestions * 0.8),
      easyCount: 2,
      mediumCount: Math.round(totalQuestions * 0.5),
      hardCount: Math.round(totalQuestions * 0.3),
      targetMinutes: Math.round(dailyMinutes * 0.75),
      advice: 'Memorize radian conversions (π rad = 180°) and 3-4-5 / 5-12-13 Pythagorean triples so you never need to open the reference sheet.',
      type: 'review',
      completed: false,
    },
    {
      dayNumber: 7,
      dayLabel: 'Day 7',
      title: 'Mixed 4-Domain Timed Diagnostic Benchmark',
      domain: 'Adaptive Module Simulation',
      skillFocus: '20 Questions across all 4 official Digital SAT domains under timed conditions',
      questionCount: 20,
      easyCount: 5,
      mediumCount: 10,
      hardCount: 5,
      targetMinutes: Math.round(dailyMinutes * 0.8),
      advice: 'Test your multi-domain cognitive switching speed. Target a minimum 85% accuracy on Easy and Medium questions.',
      type: 'mock',
      completed: false,
    },
  ];

  // ─── WEEK 4: Full-Length Timed Simulation & Final 800 Polish ───
  const week4Days: StudyPlanDay[] = [
    {
      dayNumber: 1,
      dayLabel: 'Day 1',
      title: 'High-Yield Desmos Shortcut Drills',
      domain: 'Advanced Math',
      skillFocus: 'Slider manipulation, finding extrema, and solving polynomial-circle systems',
      questionCount: totalQuestions,
      easyCount: 3,
      mediumCount: 7,
      hardCount: 5,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Practice setting up sliders for unknown constants "k" or "c" to instantly visualize how many real intersections occur.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 2,
      dayLabel: 'Day 2',
      title: '750+ Trap Identification & Tricky Stems',
      domain: 'Algebra',
      skillFocus: 'Spotting "what is the value of 2x + 3" vs "what is x", reciprocal traps, and unit mismatches',
      questionCount: totalQuestions,
      easyCount: 2,
      mediumCount: 6,
      hardCount: 7,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'Always highlight what the question asks for. In 30% of hard questions, students solve for x when the prompt asks for 3x - 1.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 3,
      dayLabel: 'Day 3',
      title: 'Pacing Strategy: 60-Second Stalling Rule',
      domain: 'Problem-Solving & Data Analysis',
      skillFocus: 'Triage methodology, eliminating 2 impossible options, and bookmarking for Module review',
      questionCount: totalQuestions,
      easyCount: 4,
      mediumCount: 7,
      hardCount: 4,
      targetMinutes: Math.round(dailyMinutes * 0.65),
      advice: 'If you are stuck on a problem for >75s without a clear equation, eliminate 2 outlier options, mark a best guess, and bookmark it.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 4,
      dayLabel: 'Day 4',
      title: 'Pre-Test Confidence Booster: 100% Accuracy Set',
      domain: 'Algebra',
      skillFocus: 'Flawless execution on Easy & Medium fundamentals to lock in the 17+ Hard route qualification',
      questionCount: totalQuestions,
      easyCount: 10,
      mediumCount: 5,
      hardCount: 0,
      targetMinutes: Math.round(dailyMinutes * 0.55),
      advice: 'Target 100% precision. Remember: getting 17/22 correct in Module 1 is mandatory to route to the uncapped 800 Hard Module.',
      type: 'drill',
      completed: false,
    },
    {
      dayNumber: 5,
      dayLabel: 'Day 5',
      title: 'Comprehensive Formula Sheet & Shortcut Review',
      domain: 'Review & Error Diagnostic',
      skillFocus: 'Final recap of vertex forms, circle equations, exponent laws, and Desmos commands',
      questionCount: Math.round(totalQuestions * 0.7),
      easyCount: 3,
      mediumCount: 5,
      hardCount: 2,
      targetMinutes: Math.round(dailyMinutes * 0.6),
      advice: 'Review your personal cheat sheet. Solidify your mental checklist for both Module 1 and Module 2 test strategies.',
      type: 'review',
      completed: false,
    },
    {
      dayNumber: 6,
      dayLabel: 'Day 6',
      title: 'Mistake Vault 100% Clearance',
      domain: 'Review & Error Diagnostic',
      skillFocus: 'Final pass over all bookmarked items from Weeks 1–4',
      questionCount: Math.round(totalQuestions * 0.7),
      easyCount: 2,
      mediumCount: 5,
      hardCount: 3,
      targetMinutes: Math.round(dailyMinutes * 0.6),
      advice: 'Clear all saved bookmarks. Verify you can solve every single problem you previously struggled with within 60 seconds.',
      type: 'review',
      completed: false,
    },
    {
      dayNumber: 7,
      dayLabel: 'Day 7',
      title: 'Full-Length Official Bluebook Math Exam Simulation',
      domain: 'Adaptive Module Simulation',
      skillFocus: 'Complete 2-Module 44-question timed test under authentic College Board test conditions',
      questionCount: 44,
      easyCount: 12,
      mediumCount: 18,
      hardCount: 14,
      targetMinutes: 70,
      advice: 'Take both 35-minute modules with realistic timing and scoring. Review your final scaled score projection and score range.',
      type: 'mock',
      completed: false,
    },
  ];

  const weeklyRoadmap: StudyPlanWeek[] = [
    {
      week: 1,
      title: `Week 1: Foundations & ${primaryWeak} Focus`,
      focus: `${primaryWeak} & Desmos Fundamentals`,
      estimatedHrs: Math.round((dailyMinutes * 7) / 60),
      completed: true,
      days: week1Days,
    },
    {
      week: 2,
      title: `Week 2: ${secondaryWeak} & Nonlinear Mastery`,
      focus: `${secondaryWeak} & Regression`,
      estimatedHrs: Math.round((dailyMinutes * 7) / 60),
      completed: false,
      days: week2Days,
    },
    {
      week: 3,
      title: 'Week 3: Problem-Solving, Data & Geometry Drill',
      focus: 'Data Analysis, Angles & Circles',
      estimatedHrs: Math.round((dailyMinutes * 7) / 60),
      completed: false,
      days: week3Days,
    },
    {
      week: 4,
      title: 'Week 4: Full-Length Timed Simulation & 800 Polish',
      focus: 'Adaptive Simulation & Timing Triage',
      estimatedHrs: Math.round((dailyMinutes * 7) / 60),
      completed: false,
      days: week4Days,
    },
  ];

  return {
    targetDate,
    targetScore,
    currentScore,
    baselineBand,
    weakAreas,
    dailyTimeMinutes: dailyMinutes,
    pacePreference,
    weeklyRoadmap,
  };
}
