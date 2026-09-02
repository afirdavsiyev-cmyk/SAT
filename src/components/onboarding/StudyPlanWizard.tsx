import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Target,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Zap,
  ShieldAlert,
  Award,
  BarChart3,
  Brain,
  AlertTriangle,
  RotateCcw,
  Check,
  Flame,
  Layers,
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import {
  StrategyGoal,
  PeakStudyTime,
  FrictionPoint,
  AdaptivePlannerProfile,
  SATDomain
} from '../../types/planner';
import {
  initializeSubtopicSkills,
  generateDailyActionPlan,
  saveStoredAdaptiveData,
  getStoredAdaptiveData,
  calculatePriorityScore
} from '../../utils/adaptivePlannerEngine';
import { generatePrescriptiveStudyPlan } from '../../utils/studyPlanGenerator';
import { ALL_QUESTIONS } from '../../data/questions';
import { generateAdaptiveRoadmap } from '../../services/geminiService';
import { MathRenderer } from '../common/MathRenderer';

export type QuestionFormat = 'multiple_choice' | 'student_produced';

export const StudyPlanWizard: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { setStudyPlan, setCurrentView, updatePlanner, userProgressState } = useApp();

  const [step, setStep] = useState<number>(1);

  // ─── Step 1: Goal & Deadline States ──────────────────────────────────────
  const [targetScoreBand, setTargetScoreBand] = useState<string>('750–800');
  const [targetScore, setTargetScore] = useState<number>(800);
  const [targetExamDate, setTargetExamDate] = useState<string>(() => {
    return userProgressState.planner.targetExamDate || 'October 2026';
  });
  const [strategyGoal, setStrategyGoal] = useState<StrategyGoal>('highest_possible');

  // ─── Step 2: Baseline Calibration States ─────────────────────────────────
  const [calibrationMode, setCalibrationMode] = useState<'score' | 'diagnostic'>('score');
  const [baselineScore, setBaselineScore] = useState<number>(() => {
    return userProgressState.planner.baselineScore || 680;
  });
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<string, string>>({});
  const [diagnosticSubmitted, setDiagnosticSubmitted] = useState<boolean>(false);
  const [diagnosticScoreCalc, setDiagnosticScoreCalc] = useState<number | null>(null);

  // ─── Step 3: Realistic Constraints States ────────────────────────────────
  const [dailyMinutes, setDailyMinutes] = useState<number>(45);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ]);
  const [peakTimeWindow, setPeakTimeWindow] = useState<PeakStudyTime>('afternoon');

  // ─── Step 4: Primary Friction Points States ──────────────────────────────
  const [selectedFrictions, setSelectedFrictions] = useState<FrictionPoint[]>([
    'careless_slips',
    'running_out_of_time'
  ]);

  // ─── Step 5: Generating Custom Roadmap States ────────────────────────────
  const [genProgress, setGenProgress] = useState<number>(0);
  const [genStatusText, setGenStatusText] = useState<string>('Analyzing 18 official SAT subtopics...');
  const [geminiRoadmapModel, setGeminiRoadmapModel] = useState<string>('gemini-3.8-flash');

  const testDates = [
    'October 2026',
    'November 2026',
    'December 2026',
    'March 2027',
    'May 2027',
    'June 2027'
  ];

  const scoreBands = [
    { label: '500–600', score: 580, desc: 'Foundation Builder (Focus on core Algebra basics)' },
    { label: '600–650', score: 630, desc: 'Competitive Standard (Solid algebra & linear modeling)' },
    { label: '650–700', score: 680, desc: 'Top 50 Benchmark (Quadratic functions & Desmos speed)' },
    { label: '700–750', score: 730, desc: 'High Distinction (Advanced nonlinear & circle theorems)' },
    { label: '750–800', score: 800, desc: 'Ivy League & MIT Benchmark (Eliminate all trap questions)' },
  ];

  const strategyGoals = [
    {
      id: 'highest_possible' as StrategyGoal,
      title: 'Highest Possible Score',
      badge: 'Aggressive 800 Elite',
      desc: 'Heavy dosage of hard Level 4–5 trap problems, circle theorems, and polynomial roots.',
      icon: <Award className="w-5 h-5 text-orange-600 dark:text-emerald-400" />
    },
    {
      id: 'efficient_target' as StrategyGoal,
      title: 'Efficient Target Mastery',
      badge: 'Balanced High-Yield',
      desc: 'Focuses strictly on the highest-frequency topics to hit your target score with minimal wasted time.',
      icon: <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
    },
    {
      id: 'fast_bump' as StrategyGoal,
      title: 'Fast Score Bump',
      badge: 'Quick +80pt Sprint',
      desc: 'Focuses on rapid Desmos shortcuts and eliminating careless calculation slips for an upcoming test.',
      icon: <Flame className="w-5 h-5 text-rose-600 dark:text-rose-400" />
    },
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const timePills = [15, 30, 45, 60, 90];

  const frictionOptions: { id: FrictionPoint; title: string; desc: string; icon: string }[] = [
    {
      id: 'careless_slips',
      title: 'Careless Calculation Slips',
      desc: 'Sign errors, arithmetic mistakes, or answering for x instead of 2x + 1.',
      icon: '✏️'
    },
    {
      id: 'running_out_of_time',
      title: 'Running Out of Time',
      desc: 'Getting stuck on difficult questions and having to rush the last 5 problems.',
      icon: '⏱️'
    },
    {
      id: 'forgetting_formulas',
      title: 'Forgetting Formulas',
      desc: 'Blanking on circle equations, vertex forms, or trigonometry identities.',
      icon: '📐'
    },
    {
      id: 'hard_freeze',
      title: 'Hard Question Freeze',
      desc: 'Freezing when encountering unfamiliar, multi-step Module 2 hard problems.',
      icon: '🧊'
    },
    {
      id: 'concept_gaps',
      title: 'Specific Concept Gaps',
      desc: 'Missing core understanding in nonlinear systems, radian measure, or statistics.',
      icon: '🧠'
    },
  ];

  // 15-question mini diagnostic sample questions from ALL_QUESTIONS
  const diagnosticSampleQuestions = React.useMemo(() => {
    const alg = ALL_QUESTIONS.filter((q) => q.domain === 'Algebra').slice(0, 5);
    const adv = ALL_QUESTIONS.filter((q) => q.domain === 'Advanced Math').slice(0, 5);
    const ps = ALL_QUESTIONS.filter((q) => q.domain === 'Problem-Solving & Data Analysis').slice(0, 3);
    const geo = ALL_QUESTIONS.filter((q) => q.domain === 'Geometry & Trigonometry').slice(0, 2);
    return [...alg, ...adv, ...ps, ...geo];
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.length > 1 ? prev.filter((d) => d !== day) : prev
        : [...prev, day]
    );
  };

  const toggleFriction = (point: FrictionPoint) => {
    setSelectedFrictions((prev) =>
      prev.includes(point)
        ? prev.length > 1 ? prev.filter((p) => p !== point) : prev
        : [...prev, point]
    );
  };

  const handleAnswerChange = (qId: string, val: string) => {
    setDiagnosticAnswers((prev) => ({
      ...prev,
      [qId]: val,
    }));
  };

  const getDifficultyBadge = (diff: string) => {
    if (diff === 'Easy') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400';
    }
    if (diff === 'Hard') {
      return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400';
    }
    return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400';
  };

  // Diagnostic mini submit
  const handleScoreDiagnostic = () => {
    let correctCount = 0;
    diagnosticSampleQuestions.forEach((q, idx) => {
      const userAns = diagnosticAnswers[q.id] || diagnosticAnswers[idx];
      if (!userAns) return;
      const cleanUser = userAns.trim().toLowerCase().replace(/\s+/g, '');
      const cleanCorrect = q.correctAnswer.trim().toLowerCase().replace(/\s+/g, '');

      let isCorrect = cleanUser === cleanCorrect;

      // Fraction equivalence check (e.g. 3/4 vs 0.75)
      if (!isCorrect && cleanUser.includes('/') && cleanCorrect.includes('/')) {
        const [uNum, uDen] = cleanUser.split('/').map(Number);
        const [cNum, cDen] = cleanCorrect.split('/').map(Number);
        if (uDen && cDen && Math.abs(uNum / uDen - cNum / cDen) < 0.0001) {
          isCorrect = true;
        }
      } else if (!isCorrect && (cleanUser.includes('/') || cleanCorrect.includes('/'))) {
        try {
          const uParts = cleanUser.split('/').map(Number);
          const cParts = cleanCorrect.split('/').map(Number);
          const uVal = cleanUser.includes('/') ? uParts[0] / uParts[1] : parseFloat(cleanUser);
          const cVal = cleanCorrect.includes('/') ? cParts[0] / cParts[1] : parseFloat(cleanCorrect);
          if (!isNaN(uVal) && !isNaN(cVal) && Math.abs(uVal - cVal) < 0.0001) {
            isCorrect = true;
          }
        } catch {}
      }

      if (isCorrect) {
        correctCount++;
      }
    });

    // Score conversion: 0/15 -> 400, 15/15 -> 800
    const calculated = Math.min(800, Math.max(400, Math.round(400 + (correctCount / 15) * 400)));
    setDiagnosticScoreCalc(calculated);
    setBaselineScore(calculated);
    setDiagnosticSubmitted(true);
  };

  // Step 5: Animation & Live Gemini Roadmap Runner
  useEffect(() => {
    if (step === 5) {
      setGenProgress(20);
      setGenStatusText('Querying Gemini 3.8 Flash Psychometric Engine...');

      let isMounted = true;

      generateAdaptiveRoadmap({
        targetScore,
        targetDate: targetExamDate,
        dailyMinutes,
        baselineScore,
        frictionPoints: selectedFrictions,
      }).then((geminiRes) => {
        if (!isMounted) return;
        setGeminiRoadmapModel(geminiRes.usedModel);
        setGenProgress(80);
        setGenStatusText(`Gemini ${geminiRes.usedModel} finalized psychometric domain ratings & daily allocations...`);

        setTimeout(() => {
          if (!isMounted) return;
          setGenProgress(100);
          setGenStatusText('Adaptive Study Roadmap Ready!');
          handleFinalizePlan();
        }, 800);
      }).catch((err) => {
        console.warn('Gemini roadmap generation error, using deterministic engine fallback', err);
        if (!isMounted) return;
        setGenProgress(100);
        setGenStatusText('Adaptive Study Roadmap Ready!');
        handleFinalizePlan();
      });

      return () => {
        isMounted = false;
      };
    }
  }, [step]);

  const handleFinalizePlan = () => {
    // 1. Build profile
    const profile: AdaptivePlannerProfile = {
      targetScore,
      targetExamDate,
      strategyGoal,
      baselineScore,
      dailyMinutes,
      daysPerWeek: selectedDays,
      peakTimeWindow,
      frictionPoints: selectedFrictions,
      lastUpdated: new Date().toISOString(),
    };

    // 2. Initialize skills & plan with Priority Engine
    const skills = initializeSubtopicSkills(baselineScore);
    const todayPlan = generateDailyActionPlan(profile, skills, 2);

    saveStoredAdaptiveData({
      profile,
      skills,
      attempts: [],
      todayPlan,
    });

    // 3. Update AppContext states
    updatePlanner({
      targetScore,
      targetExamDate,
      baselineScore,
      dailyGoalMinutes: dailyMinutes,
      weakDomains: ['Advanced Math', 'Algebra'],
      currentDay: 1,
    });

    const legacyPlan = generatePrescriptiveStudyPlan({
      targetDate: targetExamDate,
      targetScore,
      currentScore: baselineScore,
      baselineBand: targetScoreBand,
      weakAreas: ['Algebra', 'Advanced Math'],
      dailyMinutes,
      pacePreference: strategyGoal === 'highest_possible' ? 'aggressive_hard' : strategyGoal === 'fast_bump' ? 'confidence_first' : 'balanced',
    });

    setStudyPlan(legacyPlan);
  };

  const handleCompleteAndGo = () => {
    if (onComplete) {
      onComplete();
    } else {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center select-none animate-in fade-in duration-300">
      
      {/* ─── Compact Wizard Progress Header ─────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-emerald-400 bg-orange-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-orange-200 dark:border-emerald-800/60">
              STEP {step} OF 5
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {step === 1 && 'Goal & Exam Deadline'}
              {step === 2 && 'Baseline Math Calibration'}
              {step === 3 && 'Realistic Study Constraints'}
              {step === 4 && 'Primary Friction Points'}
              {step === 5 && 'Generating Custom Roadmap'}
            </span>
          </div>

          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {step * 20}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 dark:from-emerald-500 dark:to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${step * 20}%` }}
          />
        </div>
      </div>

      {/* ─── STEP 1: GOAL & DEADLINE ────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6 bg-white dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-slate-800 shadow-sm animate-in fade-in">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60 text-xs font-bold shadow-sm mb-2">
              <Target className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
              <span>DIGITAL SAT MATH TARGET</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              What is your target SAT Math score?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Select your goal band, target test date, and preparation strategy.
            </p>
          </div>

          {/* Score Band Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scoreBands.map((band) => {
              const isSelected = targetScoreBand === band.label;
              return (
                <div
                  key={band.label}
                  onClick={() => {
                    setTargetScoreBand(band.label);
                    setTargetScore(band.score);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-50/90 border-orange-500 shadow-md shadow-orange-500/15 dark:bg-emerald-950/50 dark:border-emerald-400'
                      : 'bg-slate-50/70 dark:bg-slate-950/60 border-amber-900/10 dark:border-slate-800 hover:border-orange-400 dark:hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-extrabold text-slate-900 dark:text-white">
                      {band.label}
                    </span>
                    <span className={`w-3 h-3 rounded-full ${isSelected ? 'bg-orange-600 dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                    {band.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Target Exam Date Picker */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
              <span>Target Official Test Date (2026 / 2027)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {testDates.map((date) => {
                const isSelected = targetExamDate === date;
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setTargetExamDate(date)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20 dark:bg-emerald-500 dark:border-emerald-400 dark:text-slate-950'
                        : 'bg-slate-50 dark:bg-slate-950/70 border-amber-900/10 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-400'
                    }`}
                  >
                    {date}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strategy Goal */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Preparation Strategy Focus
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {strategyGoals.map((strat) => {
                const isSelected = strategyGoal === strat.id;
                return (
                  <div
                    key={strat.id}
                    onClick={() => setStrategyGoal(strat.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-orange-50/90 border-orange-500 dark:bg-emerald-950/50 dark:border-emerald-400 shadow-sm'
                        : 'bg-slate-50/70 dark:bg-slate-950/60 border-amber-900/10 dark:border-slate-800 hover:border-orange-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1.5">
                      {strat.icon}
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {strat.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-orange-700 dark:text-emerald-400 bg-orange-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      {strat.badge}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {strat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-extrabold text-xs shadow-md shadow-orange-500/25 dark:shadow-glow-emerald flex items-center space-x-2 transition-all active:scale-95"
            >
              <span>Continue to Baseline Calibration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 2: BASELINE CALIBRATION ───────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-6 bg-white dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-slate-800 shadow-sm animate-in fade-in">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60 text-xs font-bold shadow-sm mb-2">
              <Brain className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
              <span>BASELINE CALIBRATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Where is your math baseline right now?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Either input a recent SAT/PSAT score, or calibrate via our rapid 15-question adaptive sample.
            </p>
          </div>

          {/* Option A vs Option B Toggle */}
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCalibrationMode('score')}
              className={`py-3 rounded-xl text-xs font-bold transition-all ${
                calibrationMode === 'score'
                  ? 'bg-white dark:bg-slate-800 text-orange-700 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Option A: Enter Past SAT / Practice Score
            </button>
            <button
              type="button"
              onClick={() => setCalibrationMode('diagnostic')}
              className={`py-3 rounded-xl text-xs font-bold transition-all ${
                calibrationMode === 'diagnostic'
                  ? 'bg-white dark:bg-slate-800 text-orange-700 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Option B: 15-Question Mini Diagnostic
            </button>
          </div>

          {/* Option A: Score Input Slider */}
          {calibrationMode === 'score' && (
            <div className="p-6 rounded-2xl bg-amber-50/40 dark:bg-slate-950/60 border border-amber-900/10 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Current SAT Math Score:
                </span>
                <span className="text-2xl font-mono font-extrabold text-orange-600 dark:text-emerald-400">
                  {baselineScore} / 800
                </span>
              </div>

              <input
                type="range"
                min="400"
                max="800"
                step="10"
                value={baselineScore}
                onChange={(e) => setBaselineScore(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-600 dark:accent-emerald-400"
              />

              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>400 (Starting)</span>
                <span>600 (National Avg)</span>
                <span>700 (Proficient)</span>
                <span>800 (Elite)</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-900/10 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-orange-600 dark:text-emerald-400 flex-shrink-0" />
                <span>
                  Projected Gain Needed: <strong className="text-orange-600 dark:text-emerald-400">+{Math.max(0, targetScore - baselineScore)} points</strong> to hit your target of {targetScore}.
                </span>
              </div>
            </div>
          )}

          {/* Option B: 15-Question Mini Diagnostic */}
          {calibrationMode === 'diagnostic' && (
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Official 15-Question Skill Distribution
                  </h4>
                  <p className="text-[11px] text-slate-500">5 Algebra • 5 Adv Math • 3 Problem-Solving • 2 Geometry & Trig</p>
                </div>

                {diagnosticScoreCalc && (
                  <span className="text-xs font-mono font-bold text-orange-700 dark:text-emerald-400 bg-orange-100 dark:bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-emerald-700/60 shadow-sm w-fit">
                    Calibrated Score: {diagnosticScoreCalc} / 800
                  </span>
                )}
              </div>

              {/* Sample question list with KaTeX rendering, multiple-choice options and student-produced inputs */}
              <div className="max-h-[520px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {diagnosticSampleQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl space-y-3 transition-all shadow-sm hover:shadow-md"
                  >
                    {/* Top Badges Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Q{idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold font-mono uppercase text-slate-500">
                          {q.domain}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getDifficultyBadge(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {q.type === 'student_produced' ? 'Grid-In' : 'Multiple Choice'}
                        </span>
                      </div>
                    </div>

                    {/* Question Prompt with full KaTeX rendering */}
                    <div className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-normal">
                      <MathRenderer content={q.question} />
                    </div>

                    {/* Input Section Discriminator */}
                    {q.type === 'student_produced' ? (
                      /* Student-Produced Response / Grid-In Input */
                      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Student-Produced Response:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            pattern="[0-9/.-]*"
                            placeholder="Enter answer (e.g. 15 or 3/4)"
                            value={diagnosticAnswers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="w-48 px-4 py-2.5 rounded-xl font-mono text-base font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all shadow-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Multiple-Choice Options with Full Option Text & Equations */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                        {q.options?.map((opt, i) => {
                          const letter = ['A', 'B', 'C', 'D'][i] || opt.id;
                          const isSelected = diagnosticAnswers[q.id] === letter;
                          return (
                            <button
                              key={letter}
                              type="button"
                              onClick={() => handleAnswerChange(q.id, letter)}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-left font-medium transition-all ${
                                isSelected
                                  ? 'bg-orange-500/10 border-orange-500 text-orange-950 dark:bg-emerald-500/15 dark:border-emerald-400 dark:text-emerald-300 ring-1 ring-orange-500 dark:ring-emerald-400'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-orange-300 dark:hover:border-emerald-500/40'
                              }`}
                            >
                              <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                isSelected 
                                  ? 'bg-orange-600 text-white dark:bg-emerald-500 dark:text-slate-950' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}>
                                {letter}
                              </span>
                              <span className="text-sm flex-1">
                                <MathRenderer content={opt.text} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-mono">
                  {Object.keys(diagnosticAnswers).filter((k) => diagnosticAnswers[k]?.trim()).length} of 15 Answered
                </span>
                <button
                  type="button"
                  onClick={handleScoreDiagnostic}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Score My Diagnostic
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-extrabold text-xs shadow-md shadow-orange-500/25 dark:shadow-glow-emerald flex items-center space-x-2 transition-all active:scale-95"
            >
              <span>Set Study Constraints</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 3: REALISTIC CONSTRAINTS ──────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6 bg-white dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-slate-800 shadow-sm animate-in fade-in">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60 text-xs font-bold shadow-sm mb-2">
              <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
              <span>TIME & PACE CONSTRAINTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              How much time can you realistically invest?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Consistent daily practice outperforms weekend cramming on the Digital SAT.
            </p>
          </div>

          {/* Daily Study Time Pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Daily Practice Target
            </label>
            <div className="grid grid-cols-5 gap-2">
              {timePills.map((m) => {
                const isSelected = dailyMinutes === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDailyMinutes(m)}
                    className={`py-3 px-2 rounded-2xl border font-mono text-sm font-extrabold transition-all text-center ${
                      isSelected
                        ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20 dark:bg-emerald-500 dark:border-emerald-400 dark:text-slate-950'
                        : 'bg-slate-50 dark:bg-slate-950/70 border-amber-900/10 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-400'
                    }`}
                  >
                    {m}m
                  </button>
                );
              })}
            </div>
          </div>

          {/* Days Available Per Week (Mon-Sun) */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Active Days Available Per Week ({selectedDays.length} days selected)
            </label>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {daysOfWeek.map((d) => {
                const isSelected = selectedDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-orange-100 text-orange-900 border-orange-400 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Peak Study Time Window */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Peak Study Focus Window
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'morning' as PeakStudyTime, title: 'Morning', desc: 'Fresh focus before school' },
                { id: 'afternoon' as PeakStudyTime, title: 'Afternoon', desc: 'Post-school study block' },
                { id: 'evening' as PeakStudyTime, title: 'Evening', desc: 'Deep quiet night sessions' },
              ].map((w) => {
                const isSelected = peakTimeWindow === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setPeakTimeWindow(w.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-orange-50 border-orange-500 text-orange-900 dark:bg-emerald-950/50 dark:border-emerald-400 dark:text-emerald-200 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-amber-900/10 dark:border-slate-800 hover:border-orange-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">{w.title}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{w.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-extrabold text-xs shadow-md shadow-orange-500/25 dark:shadow-glow-emerald flex items-center space-x-2 transition-all active:scale-95"
            >
              <span>Identify Friction Points</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 4: PRIMARY FRICTION POINTS ────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6 bg-white dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-amber-900/10 dark:border-slate-800 shadow-sm animate-in fade-in">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60 text-xs font-bold shadow-sm mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
              <span>ERROR VULNERABILITY ANALYSIS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              What causes you to lose the most points?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Select all common failure points so the Priority Engine can calibrate targeted drills.
            </p>
          </div>

          {/* Friction Checklist */}
          <div className="space-y-2.5">
            {frictionOptions.map((opt) => {
              const isSelected = selectedFrictions.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleFriction(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                    isSelected
                      ? 'bg-orange-50/90 border-orange-500 shadow-sm dark:bg-emerald-950/40 dark:border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-amber-900/10 dark:border-slate-800 hover:border-orange-400'
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{opt.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isSelected ? 'text-orange-950 dark:text-emerald-200' : 'text-slate-900 dark:text-white'
                      }`}>
                        {opt.title}
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected
                          ? 'border-orange-600 bg-orange-600 dark:border-emerald-400 dark:bg-emerald-400'
                          : 'border-slate-300 dark:border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white dark:text-slate-950" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(5)}
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-extrabold text-xs shadow-md shadow-orange-500/25 dark:shadow-glow-emerald flex items-center space-x-2 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Adaptive Roadmap</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 5: GENERATING CUSTOM ROADMAP ──────────────────────────── */}
      {step === 5 && (
        <div className="space-y-6 bg-white dark:bg-slate-900/80 p-8 sm:p-12 rounded-3xl border border-amber-900/10 dark:border-slate-800 shadow-xl text-center animate-in zoom-in-95 duration-300">
          
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 dark:from-emerald-500 dark:to-teal-600 flex items-center justify-center text-white shadow-xl shadow-orange-500/25 dark:shadow-glow-emerald">
            {genProgress < 100 ? (
              <Sparkles className="w-8 h-8 animate-spin" />
            ) : (
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            )}
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {genProgress < 100 ? 'Synthesizing Your Adaptive Engine' : 'Roadmap Configured & Active!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 min-h-[40px] font-mono leading-relaxed">
              {genStatusText}
            </p>
            <div className="flex justify-center pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-emerald-950/60 text-orange-700 dark:text-emerald-400 border border-orange-300 dark:border-emerald-800/60 text-[11px] font-mono font-bold shadow-sm">
                <span>⚡ Powered by Gemini</span>
                <span className="font-extrabold capitalize">{geminiRoadmapModel.replace('gemini-', '')}</span>
              </span>
            </div>
          </div>

          {/* Dynamic Progress Meter */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 dark:from-emerald-500 dark:to-teal-400 transition-all duration-500"
                style={{ width: `${genProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>Goal: {targetScore} / 800</span>
              <span>Baseline: {baselineScore}</span>
              <span>Pace: {dailyMinutes}m/day</span>
            </div>
          </div>

          {/* Final CTA once complete */}
          {genProgress >= 100 && (
            <div className="pt-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <button
                type="button"
                onClick={handleCompleteAndGo}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 dark:text-slate-950 font-black text-sm shadow-xl shadow-orange-500/25 dark:shadow-glow-emerald transition-all active:scale-95 inline-flex items-center space-x-2.5"
              >
                <span>Launch Adaptive Planner Dashboard</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
