import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Flame,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface RecentTrendLineChartProps {
  currentAccuracy?: number;
  streakDays?: number;
}

interface DayTrendData {
  dayLabel: string;
  dateStr: string;
  accuracy: number; // 0 to 100
  questionsSolved: number;
  timeSpentMin: number;
  scoreTrajectoryDelta: number;
}

export const RecentTrendLineChart: React.FC<RecentTrendLineChartProps> = ({
  currentAccuracy = 84,
  streakDays = 5,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d'>('7d');
  const [hoveredPoint, setHoveredPoint] = useState<DayTrendData | null>(null);

  // 7-day rolling data points
  const sevenDayData: DayTrendData[] = useMemo(() => [
    { dayLabel: 'Day 1', dateStr: 'Sep 1', accuracy: 72, questionsSolved: 18, timeSpentMin: 25, scoreTrajectoryDelta: 5 },
    { dayLabel: 'Day 2', dateStr: 'Sep 2', accuracy: 75, questionsSolved: 24, timeSpentMin: 35, scoreTrajectoryDelta: 10 },
    { dayLabel: 'Day 3', dateStr: 'Sep 3', accuracy: 79, questionsSolved: 30, timeSpentMin: 40, scoreTrajectoryDelta: 15 },
    { dayLabel: 'Day 4', dateStr: 'Sep 4', accuracy: 76, questionsSolved: 22, timeSpentMin: 30, scoreTrajectoryDelta: 10 },
    { dayLabel: 'Day 5', dateStr: 'Sep 5', accuracy: 82, questionsSolved: 28, timeSpentMin: 45, scoreTrajectoryDelta: 20 },
    { dayLabel: 'Day 6', dateStr: 'Sep 6', accuracy: 85, questionsSolved: 32, timeSpentMin: 50, scoreTrajectoryDelta: 25 },
    { dayLabel: 'Day 7', dateStr: 'Today', accuracy: currentAccuracy || 88, questionsSolved: 26, timeSpentMin: 38, scoreTrajectoryDelta: 30 },
  ], [currentAccuracy]);

  const fourteenDayData: DayTrendData[] = useMemo(() => {
    return [
      { dayLabel: 'Aug 25', dateStr: 'Aug 25', accuracy: 68, questionsSolved: 15, timeSpentMin: 20, scoreTrajectoryDelta: 0 },
      { dayLabel: 'Aug 26', dateStr: 'Aug 26', accuracy: 70, questionsSolved: 18, timeSpentMin: 25, scoreTrajectoryDelta: 5 },
      { dayLabel: 'Aug 27', dateStr: 'Aug 27', accuracy: 69, questionsSolved: 16, timeSpentMin: 22, scoreTrajectoryDelta: 5 },
      { dayLabel: 'Aug 28', dateStr: 'Aug 28', accuracy: 72, questionsSolved: 20, timeSpentMin: 30, scoreTrajectoryDelta: 10 },
      { dayLabel: 'Aug 29', dateStr: 'Aug 29', accuracy: 74, questionsSolved: 22, timeSpentMin: 32, scoreTrajectoryDelta: 10 },
      { dayLabel: 'Aug 30', dateStr: 'Aug 30', accuracy: 71, questionsSolved: 18, timeSpentMin: 28, scoreTrajectoryDelta: 5 },
      { dayLabel: 'Aug 31', dateStr: 'Aug 31', accuracy: 73, questionsSolved: 24, timeSpentMin: 35, scoreTrajectoryDelta: 10 },
      ...sevenDayData,
    ];
  }, [sevenDayData]);

  const activeData = timeframe === '14d' ? fourteenDayData : sevenDayData;

  // Aggregate stats
  const rollingAverage = useMemo(() => {
    const sum = activeData.reduce((acc, d) => acc + d.accuracy, 0);
    return Math.round(sum / activeData.length);
  }, [activeData]);

  const netDelta = useMemo(() => {
    const first = activeData[0].accuracy;
    const last = activeData[activeData.length - 1].accuracy;
    return last - first;
  }, [activeData]);

  // Chart Geometry
  // Canvas width: 680, height: 260
  // Left: 45, right: 650 (width: 605), top: 30, bottom: 210 (height: 180)
  // Accuracy range: 50% to 100%
  const chartWidth = 680;
  const chartHeight = 260;
  const plotLeft = 45;
  const plotRight = 650;
  const plotTop = 25;
  const plotBottom = 210;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  const minAcc = 50;
  const maxAcc = 100;

  const getX = (index: number) => {
    return plotLeft + (index / (activeData.length - 1)) * plotWidth;
  };

  const getY = (accuracy: number) => {
    const clamped = Math.max(minAcc, Math.min(maxAcc, accuracy));
    return plotBottom - ((clamped - minAcc) / (maxAcc - minAcc)) * plotHeight;
  };

  // Build SVG smooth path using cubic beziers
  const pathD = useMemo(() => {
    if (activeData.length === 0) return '';
    const points = activeData.map((d, i) => ({ x: getX(i), y: getY(d.accuracy) }));

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const cx = (current.x + next.x) / 2;
      d += ` C ${cx} ${current.y}, ${cx} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }, [activeData]);

  // Gradient area underneath line
  const areaD = useMemo(() => {
    if (activeData.length === 0) return '';
    const firstX = getX(0);
    const lastX = getX(activeData.length - 1);
    return `${pathD} L ${lastX} ${plotBottom} L ${firstX} ${plotBottom} Z`;
  }, [pathD, activeData]);

  const target80Y = getY(80); // Benchmark line at 80%

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1424] p-6 sm:p-7 shadow-sm transition-all space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
              Confidence & Momentum
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Recent Trend
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Rolling 7-day accuracy line chart reinforcing student confidence and daily practice momentum.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs self-start md:self-center">
          <button
            type="button"
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              timeframe === '7d'
                ? 'bg-white dark:bg-emerald-500 text-emerald-700 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Rolling 7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('14d')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              timeframe === '14d'
                ? 'bg-white dark:bg-emerald-500 text-emerald-700 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            14 Days
          </button>
        </div>
      </div>

      {/* Momentum KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold block flex items-center space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Rolling Net Delta</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
            +{netDelta}% Upward
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
            Rolling Avg Accuracy
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            {rollingAverage}%
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
          <span className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold block flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Active Study Streak</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-300 font-mono mt-0.5">
            {streakDays} Days Flame
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/40">
          <span className="text-[11px] text-teal-800 dark:text-teal-400 font-semibold block flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Momentum State</span>
          </span>
          <div className="text-sm font-extrabold text-teal-800 dark:text-teal-300 font-mono mt-1 truncate">
            Peak Consistency 🚀
          </div>
        </div>
      </div>

      {/* SVG Line Chart Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50/50 dark:from-[#0c1424] dark:to-[#080d17] p-2 sm:p-4">
        
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[580px] select-none"
          >
            <defs>
              {/* Glowing gradient under the line */}
              <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={isDark ? '0.35' : '0.25'} />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>

              {/* Line gradient */}
              <linearGradient id="lineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines at 60%, 70%, 80%, 90%, 100% */}
            {[60, 70, 80, 90, 100].map((val) => {
              const yPos = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={plotLeft}
                    y1={yPos}
                    x2={plotRight}
                    y2={yPos}
                    stroke={isDark ? '#1e293b' : '#f1f5f9'}
                    strokeWidth="1"
                  />
                  <text
                    x={plotLeft - 8}
                    y={yPos + 3}
                    textAnchor="end"
                    fontSize="10"
                    fontFamily="monospace"
                    fill={isDark ? '#94a3b8' : '#64748b'}
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Benchmark line at 80% */}
            <line
              x1={plotLeft}
              y1={target80Y}
              x2={plotRight}
              y2={target80Y}
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            <text
              x={plotRight - 4}
              y={target80Y - 6}
              textAnchor="end"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              fill={isDark ? '#34d399' : '#059669'}
            >
              80% Benchmark Target
            </text>

            {/* Shaded Area under Curve */}
            <path
              d={areaD}
              fill="url(#accuracyGradient)"
            />

            {/* Main Polyline / Smooth Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#lineStrokeGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points on Line */}
            {activeData.map((d, idx) => {
              const cx = getX(idx);
              const cy = getY(d.accuracy);
              const isHovered = hoveredPoint?.dayLabel === d.dayLabel;

              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(d)}
                  onClick={() => setHoveredPoint(d)}
                >
                  {/* Outer glow ring on hover */}
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="10"
                      fill="#10b981"
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : 4.5}
                    fill={isDark ? '#0c1424' : '#ffffff'}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    className="transition-all duration-200"
                  />

                  {/* Day labels along X-axis */}
                  <text
                    x={cx}
                    y={plotBottom + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    fill={isHovered ? (isDark ? '#34d399' : '#059669') : (isDark ? '#94a3b8' : '#64748b')}
                  >
                    {d.dateStr}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover / Active Day Callout Card */}
        {hoveredPoint ? (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between flex-wrap gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 dark:text-white">
                📅 {hoveredPoint.dateStr} ({hoveredPoint.dayLabel})
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm">
                {hoveredPoint.accuracy}% Accuracy
              </span>
            </div>

            <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-400 text-[11px]">
              <span>Solved: <strong className="text-slate-900 dark:text-white">{hoveredPoint.questionsSolved} Qs</strong></span>
              <span>Time: <strong className="text-slate-900 dark:text-white">{hoveredPoint.timeSpentMin} mins</strong></span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                +{hoveredPoint.scoreTrajectoryDelta} pts Trajectory
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400 py-1.5 font-mono">
            Hover over any day point along the curve to inspect daily practice stats and score trajectory.
          </div>
        )}

      </div>
    </div>
  );
};
