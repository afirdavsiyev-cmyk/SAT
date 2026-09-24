import React, { useState, useMemo } from 'react';
import {
  Clock,
  AlertTriangle,
  Zap,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Info,
  Filter,
  Eye,
  RotateCcw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { QuestionItem } from '../../types/questionBank';
import { ALL_QUESTIONS } from '../../data/questions';

export interface PacingScatterPlotProps {
  onStartPractice?: (questions: QuestionItem[], topicName: string) => void;
}

interface ScatterPoint {
  id: string;
  questionId: string;
  topic: string;
  domain: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeSpentSeconds: number;
  isCorrect: boolean;
  zone: 'rushed_error' | 'time_sink' | 'fast_accurate' | 'methodical';
  diagnosticTip: string;
}

export const PacingScatterPlot: React.FC<PacingScatterPlotProps> = ({
  onStartPractice,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null);

  // Realistic historical question attempts with timing and accuracy
  const sampleScatterData: ScatterPoint[] = useMemo(() => [
    // Rushed Errors (<40s, incorrect)
    {
      id: 'pt-1',
      questionId: 'alg-01',
      topic: 'Linear Equations in One Variable',
      domain: 'Algebra',
      difficulty: 'Easy',
      timeSpentSeconds: 22,
      isCorrect: false,
      zone: 'rushed_error',
      diagnosticTip: 'Rushed careless error on easy equation. Slow down by 15s to check distribution signs.',
    },
    {
      id: 'pt-2',
      questionId: 'adv-04',
      topic: 'Equivalent Expressions',
      domain: 'Advanced Math',
      difficulty: 'Medium',
      timeSpentSeconds: 28,
      isCorrect: false,
      zone: 'rushed_error',
      diagnosticTip: 'Misread the negative exponent. Re-read the stem before selecting an option.',
    },
    {
      id: 'pt-3',
      questionId: 'ps-02',
      topic: 'Percentages & Ratios',
      domain: 'Problem-Solving & Data Analysis',
      difficulty: 'Easy',
      timeSpentSeconds: 34,
      isCorrect: false,
      zone: 'rushed_error',
      diagnosticTip: 'Calculated original price instead of discount amount. Highlight the question prompt.',
    },

    // Time-Sinks (>90s, incorrect)
    {
      id: 'pt-4',
      questionId: 'adv-08',
      topic: 'Nonlinear Functions & Vertex Form',
      domain: 'Advanced Math',
      difficulty: 'Hard',
      timeSpentSeconds: 128,
      isCorrect: false,
      zone: 'time_sink',
      diagnosticTip: 'Spent over 2 minutes manipulating vertex algebra manually. Use Desmos slider to pinpoint roots in 25s.',
    },
    {
      id: 'pt-5',
      questionId: 'geo-03',
      topic: 'Circle Equations & Arc Theorems',
      domain: 'Geometry & Trigonometry',
      difficulty: 'Hard',
      timeSpentSeconds: 142,
      isCorrect: false,
      zone: 'time_sink',
      diagnosticTip: 'Got stuck completing the square for circle radius. If no formula is clear at 60s, flag and guess.',
    },
    {
      id: 'pt-6',
      questionId: 'alg-07',
      topic: 'Systems of Two Linear Equations',
      domain: 'Algebra',
      difficulty: 'Medium',
      timeSpentSeconds: 110,
      isCorrect: false,
      zone: 'time_sink',
      diagnosticTip: 'Arithmetic loop in 2-equation substitution. Use matrix/Desmos intersection for speed.',
    },
    {
      id: 'pt-7',
      questionId: 'ps-09',
      topic: 'Conditional Probability & Tables',
      domain: 'Problem-Solving & Data Analysis',
      difficulty: 'Hard',
      timeSpentSeconds: 115,
      isCorrect: false,
      zone: 'time_sink',
      diagnosticTip: 'Double counted row vs column total. Box the denominator condition first.',
    },

    // Fast & Accurate (<55s, correct)
    {
      id: 'pt-8',
      questionId: 'alg-02',
      topic: 'Linear Functions & Slopes',
      domain: 'Algebra',
      difficulty: 'Easy',
      timeSpentSeconds: 24,
      isCorrect: true,
      zone: 'fast_accurate',
      diagnosticTip: 'Banked time (+46s vs 70s target). Excellent visual slope reading.',
    },
    {
      id: 'pt-9',
      questionId: 'alg-03',
      topic: 'Linear Inequalities',
      domain: 'Algebra',
      difficulty: 'Medium',
      timeSpentSeconds: 38,
      isCorrect: true,
      zone: 'fast_accurate',
      diagnosticTip: 'Quick shading test point evaluation (+32s banked).',
    },
    {
      id: 'pt-10',
      questionId: 'adv-01',
      topic: 'Factoring Polynomials',
      domain: 'Advanced Math',
      difficulty: 'Easy',
      timeSpentSeconds: 32,
      isCorrect: true,
      zone: 'fast_accurate',
      diagnosticTip: 'Rapid recognition of difference of two squares.',
    },
    {
      id: 'pt-11',
      questionId: 'ps-05',
      topic: 'Mean and Median Spread',
      domain: 'Problem-Solving & Data Analysis',
      difficulty: 'Medium',
      timeSpentSeconds: 42,
      isCorrect: true,
      zone: 'fast_accurate',
      diagnosticTip: 'Correct outlier symmetry check without unnecessary manual calculations.',
    },
    {
      id: 'pt-12',
      questionId: 'geo-01',
      topic: 'Triangle Angle Theorems',
      domain: 'Geometry & Trigonometry',
      difficulty: 'Easy',
      timeSpentSeconds: 35,
      isCorrect: true,
      zone: 'fast_accurate',
      diagnosticTip: 'Spot-on exterior angle theorem application.',
    },
    {
      id: 'pt-13',
      questionId: 'adv-05',
      topic: 'Radical Expressions',
      domain: 'Advanced Math',
      difficulty: 'Medium',
      timeSpentSeconds: 48,
      isCorrect: true,
      zone: 'fast_accurate',
      diagnosticTip: 'Accurately isolated radical and checked for extraneous roots.',
    },

    // Methodical Solves (70s - 130s, correct)
    {
      id: 'pt-14',
      questionId: 'adv-09',
      topic: 'Quadratics & Discriminants',
      domain: 'Advanced Math',
      difficulty: 'Hard',
      timeSpentSeconds: 88,
      isCorrect: true,
      zone: 'methodical',
      diagnosticTip: 'Solved correctly, but required 88s. Try plugging b^2 - 4ac straight into Desmos.',
    },
    {
      id: 'pt-15',
      questionId: 'geo-04',
      topic: 'Radian Trigonometry & Right Triangles',
      domain: 'Geometry & Trigonometry',
      difficulty: 'Hard',
      timeSpentSeconds: 96,
      isCorrect: true,
      zone: 'methodical',
      diagnosticTip: 'Solid grasp of unit circle conversions. Pacing was measured and accurate.',
    },
    {
      id: 'pt-16',
      questionId: 'ps-08',
      topic: 'Scatterplots & Two-Variable Models',
      domain: 'Problem-Solving & Data Analysis',
      difficulty: 'Medium',
      timeSpentSeconds: 76,
      isCorrect: true,
      zone: 'methodical',
      diagnosticTip: 'Carefully parsed model slope context. Kept pace steady.',
    },
    {
      id: 'pt-17',
      questionId: 'alg-09',
      topic: 'Systems with Parameter Constants',
      domain: 'Algebra',
      difficulty: 'Hard',
      timeSpentSeconds: 104,
      isCorrect: true,
      zone: 'methodical',
      diagnosticTip: 'High-difficulty solve secured (+10 pts), but watch clock in Module 2.',
    },
  ], []);

  // Filter points based on selected domain and zone
  const filteredPoints = useMemo(() => {
    return sampleScatterData.filter((pt) => {
      const matchDomain = selectedDomain === 'all' || pt.domain === selectedDomain;
      const matchZone = selectedZone === 'all' || pt.zone === selectedZone;
      return matchDomain && matchZone;
    });
  }, [sampleScatterData, selectedDomain, selectedZone]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const total = sampleScatterData.length;
    const rushedErrors = sampleScatterData.filter((p) => p.zone === 'rushed_error');
    const timeSinks = sampleScatterData.filter((p) => p.zone === 'time_sink');
    const fastAccurate = sampleScatterData.filter((p) => p.zone === 'fast_accurate');
    const avgTime = Math.round(sampleScatterData.reduce((acc, p) => acc + p.timeSpentSeconds, 0) / total);

    const totalTimeSinkSeconds = timeSinks.reduce((acc, p) => acc + p.timeSpentSeconds, 0);
    const minutesLostToSinks = (totalTimeSinkSeconds / 60).toFixed(1);

    return {
      total,
      rushedCount: rushedErrors.length,
      timeSinkCount: timeSinks.length,
      fastCount: fastAccurate.length,
      avgTime,
      minutesLostToSinks,
      pacingScore: Math.round(((fastAccurate.length + 0.6 * (total - rushedErrors.length - timeSinks.length)) / total) * 100),
    };
  }, [sampleScatterData]);

  // SVG Chart Geometry
  // Canvas width: 680, height: 320
  // Plot area: x: 60 to 650 (width: 590), y: 30 to 260 (height: 230)
  // X: Time Spent (0 to 160 seconds)
  // Y: Result / Accuracy & Difficulty Band
  // - Top band: Correct (y: 60 to 130)
  // - Bottom band: Incorrect (y: 160 to 240)
  const chartWidth = 680;
  const chartHeight = 320;
  const plotLeft = 60;
  const plotRight = 650;
  const plotWidth = plotRight - plotLeft; // 590
  const plotTop = 30;
  const plotBottom = 260;
  const plotHeight = plotBottom - plotTop; // 230
  const maxTime = 160; // 0 to 160 seconds

  const getX = (seconds: number) => {
    const clamped = Math.min(maxTime, Math.max(0, seconds));
    return plotLeft + (clamped / maxTime) * plotWidth;
  };

  const getY = (pt: ScatterPoint) => {
    // Correct answers in top band (y: 60 - 120)
    // Incorrect answers in bottom band (y: 170 - 240)
    // Add jitter based on difficulty so points don't overlap completely
    const diffOffset = pt.difficulty === 'Hard' ? -15 : pt.difficulty === 'Medium' ? 0 : 15;
    if (pt.isCorrect) {
      return 85 + diffOffset;
    } else {
      return 205 + diffOffset;
    }
  };

  const target70X = getX(70); // 70-second target benchmark line
  const rushedCutoffX = getX(40); // 40-second cutoff for rushed errors
  const timeSinkCutoffX = getX(90); // 90-second cutoff for time sinks

  const handleReviewQuestion = (pt: ScatterPoint) => {
    const questionMatch = ALL_QUESTIONS.find((q) =>
      q.id.toLowerCase() === pt.questionId.toLowerCase() ||
      q.domain.toLowerCase().includes(pt.domain.toLowerCase())
    );

    const questionsToDrill = questionMatch
      ? [questionMatch]
      : ALL_QUESTIONS.filter((q) => q.domain.toLowerCase().includes(pt.domain.toLowerCase())).slice(0, 5);

    if (onStartPractice && questionsToDrill.length > 0) {
      onStartPractice(questionsToDrill, `Pacing Remediation: ${pt.topic}`);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1424] p-6 sm:p-7 shadow-sm transition-all space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-400 border border-sky-300 dark:border-sky-800/60">
              <Clock className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 font-mono">
              Speed & Precision Matrix
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Pacing Breakdown
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Scatter plot of <strong className="text-slate-900 dark:text-white">Time Spent vs. Accuracy</strong> to instantly flag "time-sink" traps and rushed mistakes.
          </p>
        </div>

        {/* Filter dropdown / toggles */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Domain Filter */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
          >
            <option value="all">All Domains</option>
            <option value="Algebra">Algebra</option>
            <option value="Advanced Math">Advanced Math</option>
            <option value="Problem-Solving & Data Analysis">Problem-Solving</option>
            <option value="Geometry & Trigonometry">Geometry & Trig</option>
          </select>

          {/* Zone Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setSelectedZone('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedZone === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Zones
            </button>
            <button
              type="button"
              onClick={() => setSelectedZone('time_sink')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedZone === 'time_sink'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Time-Sinks ({stats.timeSinkCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedZone('rushed_error')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedZone === 'rushed_error'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Rushed ({stats.rushedCount})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
            Avg Time / Question
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5 flex items-baseline space-x-1">
            <span>{stats.avgTime}s</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              (Target 70s)
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
          <span className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold block flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Time-Sink Questions</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-300 font-mono mt-0.5 flex items-baseline space-x-1">
            <span>{stats.timeSinkCount}</span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
              (-{stats.minutesLostToSinks} min lost)
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40">
          <span className="text-[11px] text-rose-800 dark:text-rose-400 font-semibold block flex items-center space-x-1">
            <TrendingDown className="w-3 h-3" />
            <span>Rushed Errors</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-rose-700 dark:text-rose-300 font-mono mt-0.5">
            {stats.rushedCount} questions
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold block flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Banked Speed Solves</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono mt-0.5">
            {stats.fastCount} questions
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Scatter Plot Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50/50 dark:from-[#0c1424] dark:to-[#080d17] p-2 sm:p-4">
        
        {/* SVG Canvas */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[580px] select-none"
          >
            <defs>
              {/* Quadrant gradient tints */}
              <linearGradient id="rushedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isDark ? '#ef4444' : '#fee2e2'} stopOpacity={isDark ? '0.15' : '0.6'} />
                <stop offset="100%" stopColor={isDark ? '#ef4444' : '#fee2e2'} stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="timeSinkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isDark ? '#f59e0b' : '#fef3c7'} stopOpacity={isDark ? '0.18' : '0.6'} />
                <stop offset="100%" stopColor={isDark ? '#f59e0b' : '#fef3c7'} stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="fastAccurateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isDark ? '#10b981' : '#dcfce7'} stopOpacity={isDark ? '0.12' : '0.5'} />
                <stop offset="100%" stopColor={isDark ? '#10b981' : '#dcfce7'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* 1. Shaded Quadrant Background Highlights */}
            {/* Zone A: Fast & Mastered (<55s, Correct) */}
            <rect
              x={plotLeft}
              y={plotTop}
              width={target70X - plotLeft}
              height={120}
              fill="url(#fastAccurateGradient)"
              rx="8"
            />

            {/* Zone B: Rushed Errors (<40s, Incorrect) */}
            <rect
              x={plotLeft}
              y={150}
              width={rushedCutoffX - plotLeft}
              height={plotBottom - 150}
              fill="url(#rushedGradient)"
              rx="8"
            />

            {/* Zone C: Time-Sinks (>90s, Incorrect) */}
            <rect
              x={timeSinkCutoffX}
              y={150}
              width={plotRight - timeSinkCutoffX}
              height={plotBottom - 150}
              fill="url(#timeSinkGradient)"
              rx="8"
            />

            {/* 2. Grid Lines and Labels */}
            {/* Horizontal Divider between Correct and Incorrect */}
            <line
              x1={plotLeft}
              y1={145}
              x2={plotRight}
              y2={145}
              stroke={isDark ? '#334155' : '#cbd5e1'}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Vertical 70s Target Pace Benchmark Line */}
            <line
              x1={target70X}
              y1={plotTop}
              x2={target70X}
              y2={plotBottom}
              stroke={isDark ? '#10b981' : '#059669'}
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
            <text
              x={target70X + 6}
              y={plotTop + 14}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              fill={isDark ? '#34d399' : '#047857'}
            >
              Benchmark: 70s / Q
            </text>

            {/* Vertical grid lines at 30s, 60s, 90s, 120s, 150s */}
            {[30, 60, 90, 120, 150].map((t) => {
              const xPos = getX(t);
              return (
                <g key={t}>
                  <line
                    x1={xPos}
                    y1={plotTop}
                    x2={xPos}
                    y2={plotBottom}
                    stroke={isDark ? '#1e293b' : '#f1f5f9'}
                    strokeWidth="1"
                  />
                  <text
                    x={xPos}
                    y={plotBottom + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fill={isDark ? '#94a3b8' : '#64748b'}
                  >
                    {t}s
                  </text>
                </g>
              );
            })}

            {/* X-Axis Main Line */}
            <line
              x1={plotLeft}
              y1={plotBottom}
              x2={plotRight}
              y2={plotBottom}
              stroke={isDark ? '#475569' : '#94a3b8'}
              strokeWidth="1.5"
            />
            <text
              x={(plotLeft + plotRight) / 2}
              y={plotBottom + 38}
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill={isDark ? '#cbd5e1' : '#475569'}
            >
              Time Spent per Question (Seconds)
            </text>

            {/* Y-Axis Section Bands and Text */}
            <text
              x={plotLeft - 10}
              y={85}
              textAnchor="end"
              fontSize="11"
              fontWeight="bold"
              fill={isDark ? '#34d399' : '#059669'}
            >
              CORRECT ✓
            </text>
            <text
              x={plotLeft - 10}
              y={210}
              textAnchor="end"
              fontSize="11"
              fontWeight="bold"
              fill={isDark ? '#f87171' : '#dc2626'}
            >
              MISSED ✗
            </text>

            {/* Quadrant Watermark Labels */}
            <text
              x={plotLeft + 12}
              y={170}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              fill={isDark ? '#f87171' : '#b91c1c'}
              opacity="0.85"
            >
              ⚡ RUSHED ERRORS (&lt;40s)
            </text>
            <text
              x={timeSinkCutoffX + 12}
              y={170}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              fill={isDark ? '#fbbf24' : '#b45309'}
              opacity="0.85"
            >
              ⏳ TIME-SINKS (&gt;90s)
            </text>
            <text
              x={plotLeft + 12}
              y={50}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
              fill={isDark ? '#34d399' : '#047857'}
              opacity="0.85"
            >
              🚀 FAST & ACCURATE
            </text>

            {/* 3. Render Plotted Points */}
            {filteredPoints.map((pt) => {
              const cx = getX(pt.timeSpentSeconds);
              const cy = getY(pt);
              const isHovered = hoveredPoint?.id === pt.id;

              // Color determination
              let pointColor = pt.isCorrect ? '#10b981' : '#ef4444';
              let haloColor = pt.zone === 'time_sink' ? '#f59e0b' : pt.zone === 'rushed_error' ? '#ef4444' : '#10b981';

              return (
                <g
                  key={pt.id}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onClick={() => setHoveredPoint(pt)}
                >
                  {/* Outer pulsing ring for flagged items */}
                  {(pt.zone === 'time_sink' || pt.zone === 'rushed_error') && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 14 : 10}
                      fill="none"
                      stroke={haloColor}
                      strokeWidth={isHovered ? 2 : 1.5}
                      strokeDasharray={pt.zone === 'time_sink' ? '3 2' : 'none'}
                      opacity={isHovered ? 1 : 0.6}
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Point Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 8 : 6}
                    fill={pointColor}
                    stroke={isDark ? '#0c1424' : '#ffffff'}
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Interactive Floating / Detail Card for Hovered or Selected Point */}
        {hoveredPoint ? (
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                  hoveredPoint.zone === 'time_sink'
                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
                    : hoveredPoint.zone === 'rushed_error'
                    ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                }`}>
                  {hoveredPoint.zone === 'time_sink' ? '⚠️ Time-Sink Question' : hoveredPoint.zone === 'rushed_error' ? '⚡ Rushed Miss' : '✓ Optimal Pace'}
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {hoveredPoint.topic}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  ({hoveredPoint.domain} • {hoveredPoint.difficulty})
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="font-bold text-slate-900 dark:text-white">
                  Time Spent: <strong className="text-sky-600 dark:text-sky-400">{hoveredPoint.timeSpentSeconds}s</strong>
                </span>
                <span className={hoveredPoint.timeSpentSeconds > 70 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                  {hoveredPoint.timeSpentSeconds > 70 ? `+${hoveredPoint.timeSpentSeconds - 70}s over benchmark` : `-${70 - hoveredPoint.timeSpentSeconds}s banked speed`}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                💡 <strong>Coach Diagnosis:</strong> {hoveredPoint.diagnosticTip}
              </p>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={() => handleReviewQuestion(hoveredPoint)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5 active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Practice Question</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center py-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            Hover over any dot on the scatter plot to inspect question timing, outcome, and coach recommendations.
          </div>
        )}

      </div>
    </div>
  );
};
