import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Target,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Zap,
  ArrowRight,
  Info,
  Check,
  Flame,
  ShieldCheck,
  Layers
} from 'lucide-react';

type RoutingMode = 'auto' | 'force_hard' | 'force_easy';

export const ScoreCalculatorView: React.FC = () => {
  // Module 1 correct answers (0 - 22)
  const [m1Correct, setM1Correct] = useState<number>(18);

  // Module 2 correct answers (0 - 22)
  const [m2Correct, setM2Correct] = useState<number>(17);

  // Routing mode override
  const [routingMode, setRoutingMode] = useState<RoutingMode>('auto');

  // Determine effective route (Threshold: >= 17)
  const isHardRoute = useMemo(() => {
    if (routingMode === 'force_hard') return true;
    if (routingMode === 'force_easy') return false;
    return m1Correct >= 17;
  }, [m1Correct, routingMode]);

  // Authentic Digital SAT Math IRT-approximate Scoring Algorithm
  const { estimatedScore, scoreRange, percentile, tierInfo } = useMemo(() => {
    let score = 200;

    if (!isHardRoute) {
      // ─── EASY MODULE 2 ROUTE (Score Capped ~590–610) ───
      // Base floor 200
      // M1 (0 to 16) + Easy M2 (0 to 22)
      const m1Points = m1Correct * 12.8;
      const m2Points = m2Correct * 9.0;
      const rawCalculated = 200 + m1Points + m2Points;

      // Hard ceiling at 600
      score = Math.min(600, Math.round(rawCalculated / 10) * 10);
      score = Math.max(200, score);
    } else {
      // ─── HARD MODULE 2 ROUTE (Uncapped up to 800) ───
      // Perfect (22 M1 + 22 M2) = 800
      const totalMisses = (22 - m1Correct) + (22 - m2Correct);

      if (totalMisses === 0) {
        score = 800;
      } else if (totalMisses === 1) {
        score = 790;
      } else if (totalMisses === 2) {
        score = 770;
      } else if (totalMisses === 3) {
        score = 750;
      } else if (totalMisses === 4) {
        score = 730;
      } else if (totalMisses === 5) {
        score = 710;
      } else if (totalMisses === 6) {
        score = 690;
      } else if (totalMisses === 7) {
        score = 670;
      } else if (totalMisses === 8) {
        score = 650;
      } else if (totalMisses === 9) {
        score = 630;
      } else if (totalMisses === 10) {
        score = 610;
      } else {
        const raw = 800 - totalMisses * 21;
        score = Math.max(480, Math.round(raw / 10) * 10);
      }
    }

    // Realistic score range
    const lower = Math.max(200, score - 20);
    const upper = Math.min(800, score + (score === 800 ? 0 : 20));

    // Percentile estimation
    let pct = '50th';
    if (score >= 780) pct = '99th+';
    else if (score >= 750) pct = '98th';
    else if (score >= 700) pct = '94th';
    else if (score >= 650) pct = '86th';
    else if (score >= 600) pct = '74th';
    else if (score >= 550) pct = '59th';
    else if (score >= 500) pct = '44th';
    else pct = '25th';

    // College target tier details
    let tier = {
      title: 'Foundational / High-Growth Zone',
      badge: 'Level 1 Scholar',
      color: 'text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800',
      description: 'Focus on core linear algebra, Desmos fundamentals, and single-variable equations to bridge the 600 mark.',
    };

    if (score >= 750) {
      tier = {
        title: 'Ivy League & Top 10 Benchmark',
        badge: '800-Level Elite',
        color: 'text-orange-800 dark:text-emerald-300 border-orange-300 dark:border-emerald-500/40 bg-orange-50 dark:bg-emerald-950/60',
        description: 'Competitive for MIT, Harvard, Stanford, and Caltech. Excellent mastery of difficult circle theorems and quadratics.',
      };
    } else if (score >= 700) {
      tier = {
        title: 'Top 30 National Universities',
        badge: 'High Distinction',
        color: 'text-amber-800 dark:text-teal-300 border-amber-300 dark:border-teal-500/40 bg-amber-50 dark:bg-teal-950/60',
        description: 'Strong candidate for NYU, UCLA, Michigan, and Georgia Tech. Refine 750+ tricky problem-solving drills.',
      };
    } else if (score >= 650) {
      tier = {
        title: 'State Flagship & Top 50 Competitive',
        badge: 'Proficient Scholar',
        color: 'text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40 bg-cyan-50 dark:bg-cyan-950/60',
        description: 'Above national average. Target pacing strategies and Desmos shortcut techniques to break 700+.',
      };
    } else if (score >= 580) {
      tier = {
        title: 'College Readiness Benchmark',
        badge: 'Developing Mastery',
        color: 'text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/60',
        description: 'Solid foundation. Prioritize hitting at least 17/22 in Module 1 to unlock the uncapped Hard Module 2.',
      };
    }

    return {
      estimatedScore: score,
      scoreRange: `${lower} – ${upper}`,
      percentile: pct,
      tierInfo: tier,
    };
  }, [m1Correct, m2Correct, isHardRoute]);

  // Presets for quick what-if testing
  const handleApplyPreset = (m1: number, m2: number, mode: RoutingMode = 'auto') => {
    setM1Correct(m1);
    setM2Correct(m2);
    setRoutingMode(mode);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 select-none pb-12">
      
      {/* ─── Top Header Banner ────────────────────────────────────────── */}
      <div className="rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-orange-500/10 via-white to-amber-500/10 dark:from-slate-900/90 dark:via-slate-900 dark:to-emerald-950/80 border-2 border-orange-500/25 dark:border-emerald-500/35 shadow-sm hover:shadow-[0_4px_25px_rgba(234,88,12,0.12)] transition-all">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border-orange-300 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-bold border shadow-sm">
            <Calculator className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
            <span>AUTHENTIC 2026/2027 DIGITAL SAT SCORING ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Digital SAT Math Score Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            Simulate realistic College Board® multi-stage adaptive scoring with real-time routing thresholds, IRT scaling, and score range projections.
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={() => handleApplyPreset(18, 17, 'auto')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-900/15 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:bg-orange-50/50 transition-all shadow-sm flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* ─── Main Grid: Controller Sliders (Left 7 cols) & Score Dial (Right 5 cols) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Module 1 & 2 Sliders */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Module 1 Controller Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c1424] border-2 border-amber-900/15 dark:border-emerald-500/35 space-y-5 shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)] transition-all">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-800 border-orange-300 dark:bg-emerald-950/40 dark:text-emerald-400 border font-extrabold flex items-center justify-center text-sm font-mono shadow-sm">
                  M1
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Module 1 (Standard Routing)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">22 Questions Total • Mixed Difficulty</p>
                </div>
              </div>

              {/* Routing status pill */}
              <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono flex items-center space-x-1.5 border shadow-sm ${
                m1Correct >= 17
                  ? 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/60'
              }`}>
                {m1Correct >= 17 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
                    <span>Hard Module 2 Unlocked (17+ Goal)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Easy Module 2 Route (&lt;17 Correct)</span>
                  </>
                )}
              </div>
            </div>

            {/* Slider & Stepper */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Correct Answers:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xl font-black text-orange-700 dark:text-emerald-400 bg-orange-100/70 dark:bg-emerald-950/80 px-3 py-0.5 rounded-xl border border-orange-300 dark:border-emerald-700/60">
                    {m1Correct} / 22
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">
                    ({22 - m1Correct} missed)
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="22"
                value={m1Correct}
                onChange={(e) => setM1Correct(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-600 dark:accent-emerald-400"
              />

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-slate-500">
                <span>0 (Min)</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">16 (Easy Cap)</span>
                <span className="text-orange-600 dark:text-emerald-400 font-bold">17 (Hard Threshold)</span>
                <span>22 (Perfect)</span>
              </div>
            </div>

            {/* Quick Stepper Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {m1Correct >= 17 ? (
                  <span className="text-orange-700 dark:text-emerald-400 font-semibold">✓ Hitting ≥ 17 unlocks the 800 ceiling</span>
                ) : (
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">⚠ Needs {17 - m1Correct} more correct to qualify for Hard route</span>
                )}
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setM1Correct((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center active:scale-95 transition-all"
                  title="Subtract 1 correct"
                >
                  -
                </button>
                <button
                  onClick={() => setM1Correct((prev) => Math.min(22, prev + 1))}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center active:scale-95 transition-all"
                  title="Add 1 correct"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Module 2 Controller Card */}
          <div className={`p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0c1424] border-2 space-y-5 shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)] transition-all ${
            isHardRoute
              ? 'border-orange-500/35 dark:border-emerald-500/40'
              : 'border-amber-500/35 dark:border-amber-500/40'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-800 border-orange-300 dark:bg-emerald-950/40 dark:text-emerald-400 border font-extrabold flex items-center justify-center text-sm font-mono shadow-sm">
                  M2
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isHardRoute ? 'Module 2 (Hard Adaptive Route)' : 'Module 2 (Easy Adaptive Route)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isHardRoute ? 'Uncapped Potential (Scores up to 800)' : 'Capped Potential (Max Score ~590–610)'}
                  </p>
                </div>
              </div>

              {/* Mode Override Dropdown / Segmented Toggle */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 text-xs font-bold">
                {[
                  { id: 'auto' as const, label: 'Auto' },
                  { id: 'force_hard' as const, label: 'Force Hard' },
                  { id: 'force_easy' as const, label: 'Force Easy' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setRoutingMode(mode.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      routingMode === mode.id
                        ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider & Stepper */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Correct Answers in Module 2:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xl font-black text-orange-700 dark:text-emerald-400 bg-orange-100/70 dark:bg-emerald-950/80 px-3 py-0.5 rounded-xl border border-orange-300 dark:border-emerald-700/60">
                    {m2Correct} / 22
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">
                    ({22 - m2Correct} missed)
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="22"
                value={m2Correct}
                onChange={(e) => setM2Correct(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-600 dark:accent-emerald-400"
              />

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-slate-500">
                <span>0 (Min)</span>
                <span>11 (50%)</span>
                <span>{isHardRoute ? '22 (Perfect 800)' : '22 (Max Easy ~600)'}</span>
              </div>
            </div>

            {/* Quick Stepper Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isHardRoute ? (
                  <span>Each question in Hard M2 is worth approx. <strong className="text-orange-700 dark:text-emerald-400">+10 to +20 points</strong></span>
                ) : (
                  <span className="text-amber-700 dark:text-amber-400">Easy Module 2 questions are scaled with a lower maximum ceiling</span>
                )}
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setM2Correct((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center active:scale-95 transition-all"
                  title="Subtract 1 correct"
                >
                  -
                </button>
                <button
                  onClick={() => setM2Correct((prev) => Math.min(22, prev + 1))}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center active:scale-95 transition-all"
                  title="Add 1 correct"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Quick Scenario Preset Chips */}
          <div className="p-5 rounded-2xl bg-amber-50/30 dark:bg-slate-900/60 border border-amber-900/10 dark:border-slate-800 space-y-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              ⚡ Quick Simulation Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '🏆 Perfect 800 (22+22)', m1: 22, m2: 22 },
                { label: '⭐ Ivy League 780 (22+21)', m1: 22, m2: 21 },
                { label: '🎯 750 Milestone (20+19)', m1: 20, m2: 19 },
                { label: '📈 700 Benchmark (18+17)', m1: 18, m2: 17 },
                { label: '⚖️ Borderline M1 (17+17)', m1: 17, m2: 17 },
                { label: '🚫 Easy Route Cap (16+22)', m1: 16, m2: 22 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p.m1, p.m2, 'auto')}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-emerald-950/40 border border-amber-900/10 dark:border-slate-700 hover:border-orange-400 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-800 dark:hover:text-emerald-300 transition-all active:scale-95 shadow-sm"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Real-Time Score Dashboard & Odometer */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Dial & Score Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1424] border-2 border-amber-900/15 dark:border-emerald-500/40 flex flex-col items-center text-center space-y-6 shadow-[0_4px_20px_rgba(245,158,11,0.06)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.12)] dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all">
            
            <div className="w-full flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Target className="w-4 h-4 text-orange-600 dark:text-emerald-400" />
                <span>Estimated Scaled Score</span>
              </span>
              <span className="font-mono text-orange-800 dark:text-emerald-400 bg-orange-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-orange-300 dark:border-emerald-800 font-bold">
                {percentile} Percentile
              </span>
            </div>

            {/* Circular Gauge Visual */}
            <div className="relative w-52 h-52 flex items-center justify-center my-1">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background track */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-amber-100 dark:text-slate-800"
                  fill="transparent"
                />
                {/* Animated fill circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * (estimatedScore - 200)) / 600}
                  className="text-orange-500 dark:text-emerald-400 stroke-current transition-all duration-700 ease-out"
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Score Numbers */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
                <span className="text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {estimatedScore}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Out of 800
                </span>
              </div>
            </div>

            {/* Score Range Pill */}
            <div className="w-full p-3 rounded-2xl bg-orange-50/80 dark:bg-emerald-950/60 border border-orange-300 dark:border-emerald-700/60 flex items-center justify-between text-xs font-mono shadow-sm">
              <span className="text-slate-600 dark:text-slate-400 font-medium">PREDICTED SCORE RANGE</span>
              <span className="font-extrabold text-orange-950 dark:text-emerald-300 text-sm">
                {scoreRange}
              </span>
            </div>

            {/* Target Tier Card */}
            <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                  {tierInfo.title}
                </h4>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${tierInfo.color}`}>
                  {tierInfo.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {tierInfo.description}
              </p>
            </div>

            {/* Total Questions Breakdown */}
            <div className="w-full grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">TOTAL CORRECT</span>
                <span className="text-base font-bold text-orange-600 dark:text-emerald-400">
                  {m1Correct + m2Correct} / 44
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">TOTAL MISSED</span>
                <span className="text-base font-bold text-rose-600 dark:text-rose-400">
                  {44 - (m1Correct + m2Correct)} Questions
                </span>
              </div>
            </div>

          </div>

          {/* Key Strategic Insights Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1424] border border-amber-900/10 dark:border-slate-800 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-600 dark:text-emerald-400" />
              <span>Digital SAT Scoring Rules</span>
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-orange-600 dark:text-emerald-400 font-bold">•</span>
                <span><strong>17 / 22 in Module 1 is critical:</strong> Routing to Hard M2 is required to achieve any score above 600.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-600 dark:text-emerald-400 font-bold">•</span>
                <span><strong>No penalty for guessing:</strong> Always input an answer for all 44 multiple-choice and grid-in questions.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-600 dark:text-emerald-400 font-bold">•</span>
                <span><strong>Pretest Questions:</strong> Each module contains 2 unscored experimental questions that don't affect your scaled score.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
