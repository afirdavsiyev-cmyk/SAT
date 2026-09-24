import React, { useState, useMemo } from 'react';
import {
  Brain,
  Clock,
  Calculator,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Play
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { QuestionItem } from '../../types/questionBank';
import { ALL_QUESTIONS } from '../../data/questions';

export interface ErrorDiagnosticsDonutProps {
  onStartPractice?: (questions: QuestionItem[], topicName: string) => void;
}

type MistakeCategory = 'concept' | 'pacing' | 'calculation';

interface MistakeCauseDetail {
  id: MistakeCategory;
  name: string;
  count: number;
  percentage: number;
  scoreImpactPoints: number;
  color: string;
  darkColor: string;
  accentBg: string;
  borderClass: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  rootCause: string;
  actionablePrescription: string;
  desmosTip: string;
  exampleTopics: string[];
}

export const ErrorDiagnosticsDonut: React.FC<ErrorDiagnosticsDonutProps> = ({
  onStartPractice,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<MistakeCategory | 'all'>('all');
  const [hoveredSlice, setHoveredSlice] = useState<MistakeCategory | null>(null);

  // Mistake diagnostics data
  const mistakeData: Record<MistakeCategory, MistakeCauseDetail> = useMemo(() => ({
    concept: {
      id: 'concept',
      name: 'Concept Gap',
      count: 12,
      percentage: 38,
      scoreImpactPoints: 45,
      color: '#8b5cf6', // purple-500
      darkColor: '#a78bfa', // purple-400
      accentBg: 'bg-purple-50 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
      borderClass: 'border-purple-500/30 dark:border-purple-500/40 hover:border-purple-500/60',
      icon: Brain,
      description: 'Did not know the underlying mathematical rule, theorem, or formula required for the solution.',
      rootCause: 'Weakness in curriculum edge cases: circle formulas, vertex form conversion, or conditional probability denominators.',
      actionablePrescription: 'Review the SAT Reference Sheet & targeted textbook notes before drill blocks. Flashcard memorize radian trig identities.',
      desmosTip: 'Desmos graphs can bypass algebraic memorization for ~60% of concept questions (e.g. roots and intersections).',
      exampleTopics: ['Circle center-radius form', 'Nonlinear quadratics', 'Conditional probability'],
    },
    pacing: {
      id: 'pacing',
      name: 'Pacing & Pressure',
      count: 8,
      percentage: 25,
      scoreImpactPoints: 30,
      color: '#0ea5e9', // sky-500
      darkColor: '#38bdf8', // sky-400
      accentBg: 'bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
      borderClass: 'border-sky-500/30 dark:border-sky-500/40 hover:border-sky-500/60',
      icon: Clock,
      description: 'Ran short on clock time, rushed through options, or made blind guesses under Module 2 pressure.',
      rootCause: 'Getting trapped on questions 13–18 in Module 2 for >90 seconds, causing panic on the final 4 questions.',
      actionablePrescription: 'Enforce the strict 70-second rule: if you have no confident attack path within 45s, flag, guess, and advance.',
      desmosTip: 'Type expressions straight into Desmos table view rather than working out long arithmetic by hand.',
      exampleTopics: ['Multi-step word models', 'Linear systems with parameters', 'Outlier data questions'],
    },
    calculation: {
      id: 'calculation',
      name: 'Calculation & Slips',
      count: 12,
      percentage: 37,
      scoreImpactPoints: 45,
      color: '#10b981', // emerald-500
      darkColor: '#34d399', // emerald-400
      accentBg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      borderClass: 'border-emerald-500/30 dark:border-emerald-500/40 hover:border-emerald-500/60',
      icon: Calculator,
      description: 'Understood the correct concept, but made a sign error, arithmetic slip, or misread the question prompt.',
      rootCause: 'Solving for x instead of 2x + 1, negative sign distribution errors, or rushing arithmetic without scratchpad verification.',
      actionablePrescription: 'Always underline what the question is asking for. Substitute solutions back into original expressions.',
      desmosTip: 'Always do calculations inside the Desmos calculator panel instead of mental math under test conditions.',
      exampleTopics: ['Distribution across parentheses', 'Negative exponents', 'Prompt misread (x vs 2x+3)'],
    },
  }), []);

  const totalMistakes = useMemo(() => {
    return Object.values(mistakeData).reduce((sum, item) => sum + item.count, 0);
  }, [mistakeData]);

  const totalPointsLost = useMemo(() => {
    return Object.values(mistakeData).reduce((sum, item) => sum + item.scoreImpactPoints, 0);
  }, [mistakeData]);

  // Donut chart geometry
  // Radius: 65, circumference: 2 * PI * 65 ≈ 408.4
  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray and offsets for the 3 slices
  const slices = useMemo(() => {
    const list: {
      category: MistakeCategory;
      detail: MistakeCauseDetail;
      dashArray: string;
      dashOffset: number;
    }[] = [];

    let accumulatedPercentage = 0;
    const order: MistakeCategory[] = ['calculation', 'concept', 'pacing'];

    order.forEach((cat) => {
      const detail = mistakeData[cat];
      const strokeLength = (detail.percentage / 100) * circumference;
      const spaceLength = circumference - strokeLength;
      // SVG stroke-dashoffset starts from 12 o'clock (-90 deg rotation)
      const offset = -((accumulatedPercentage / 100) * circumference);

      list.push({
        category: cat,
        detail,
        dashArray: `${strokeLength} ${spaceLength}`,
        dashOffset: offset,
      });

      accumulatedPercentage += detail.percentage;
    });

    return list;
  }, [mistakeData, circumference]);

  const displayedCategory = hoveredSlice
    ? mistakeData[hoveredSlice]
    : activeCategory !== 'all'
    ? mistakeData[activeCategory]
    : null;

  const handleLaunchCategoryDrill = (category: MistakeCategory) => {
    const categoryDetail = mistakeData[category];
    // Find questions corresponding to example topics
    const matched = ALL_QUESTIONS.filter((q) =>
      categoryDetail.exampleTopics.some((topic) =>
        (q.topic && q.topic.toLowerCase().includes(topic.toLowerCase())) ||
        (q.question && q.question.toLowerCase().includes(topic.toLowerCase()))
      )
    ).slice(0, 8);

    const questionsToDrill = matched.length > 0 ? matched : ALL_QUESTIONS.slice(0, 8);

    if (onStartPractice && questionsToDrill.length > 0) {
      onStartPractice(questionsToDrill, `Remediation Drill: ${categoryDetail.name}`);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1424] p-6 sm:p-7 shadow-sm transition-all space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-400 border border-purple-300 dark:border-purple-800/60">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 font-mono">
              Root-Cause Forensics
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Error Log Diagnostics
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Donut chart of mistake causes (<strong className="text-purple-600 dark:text-purple-400">Concept</strong> vs. <strong className="text-sky-600 dark:text-sky-400">Pacing</strong> vs. <strong className="text-emerald-600 dark:text-emerald-400">Calculation</strong>) revealing <span className="underline decoration-emerald-500">why</span> points are being lost.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs self-start md:self-center">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Causes
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('concept')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeCategory === 'concept'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Concept
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('pacing')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeCategory === 'pacing'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pacing
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('calculation')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeCategory === 'calculation'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Calculation
          </button>
        </div>
      </div>

      {/* Main Grid: Left Donut Chart & Right Diagnostic Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Interactive Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <div className="relative w-56 h-56 flex items-center justify-center">
            
            {/* SVG Donut */}
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 160 160"
            >
              {/* Background Track Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={isDark ? '#1e293b' : '#e2e8f0'}
                strokeWidth="18"
              />

              {/* Dynamic Slices */}
              {slices.map(({ category, detail, dashArray, dashOffset }) => {
                const isSelected = activeCategory === category || activeCategory === 'all';
                const isHovered = hoveredSlice === category;
                const strokeColor = isDark ? detail.darkColor : detail.color;

                return (
                  <circle
                    key={category}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={strokeColor}
                    strokeWidth={isHovered ? 23 : 18}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="butt"
                    className="cursor-pointer transition-all duration-300"
                    opacity={isSelected ? 1 : 0.25}
                    onMouseEnter={() => setHoveredSlice(category)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => setActiveCategory(activeCategory === category ? 'all' : category)}
                  />
                );
              })}
            </svg>

            {/* Donut Center Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
              {displayedCategory ? (
                <>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {displayedCategory.name}
                  </span>
                  <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                    {displayedCategory.percentage}%
                  </span>
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-semibold">
                    -{displayedCategory.scoreImpactPoints} pts lost
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Total Mistakes
                  </span>
                  <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                    {totalMistakes}
                  </span>
                  <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-semibold">
                    ~{totalPointsLost} pts at stake
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Interactive Legend Below Donut */}
          <div className="flex items-center justify-center flex-wrap gap-3 pt-3">
            {Object.values(mistakeData).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCategory(activeCategory === item.id ? 'all' : item.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-mono transition-all border ${
                  activeCategory === item.id
                    ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 shadow-sm font-bold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: isDark ? item.darkColor : item.color }}
                />
                <span>{item.name} ({item.percentage}%)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Diagnostic Analysis & Action Plans */}
        <div className="lg:col-span-7 space-y-3">
          {Object.values(mistakeData)
            .filter((item) => activeCategory === 'all' || activeCategory === item.id)
            .map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border ${item.borderClass} bg-slate-50 dark:bg-slate-900/60 shadow-sm transition-all space-y-2.5`}
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.accentBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.name} ({item.percentage}%)
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {item.count} logged errors • ~{item.scoreImpactPoints} pts lost
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLaunchCategoryDrill(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs shadow-sm transition-all flex items-center space-x-1 active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Drill Weaknesses</span>
                    </button>
                  </div>

                  {/* Root Cause & Prescription Box */}
                  <div className="text-xs space-y-1.5 pt-1 text-slate-700 dark:text-slate-300">
                    <p className="leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Why Points Are Lost:</strong> {item.rootCause}
                    </p>
                    <p className="leading-relaxed bg-white/70 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                      🎯 <strong className="text-emerald-700 dark:text-emerald-400">Score Recovery Fix:</strong> {item.actionablePrescription}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

      </div>
    </div>
  );
};
