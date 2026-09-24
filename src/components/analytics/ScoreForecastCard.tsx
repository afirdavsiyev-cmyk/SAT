import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  ShieldCheck,
  Info,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Flame,
  Award
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ScoreForecastCardProps {
  currentScore?: number;
  targetScore?: number;
  onUpdateTargetScore?: (newTarget: number) => void;
}

export const ScoreForecastCard: React.FC<ScoreForecastCardProps> = ({
  currentScore = 650,
  targetScore: initialTarget = 750,
  onUpdateTargetScore,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedConfidence, setSelectedConfidence] = useState<'standard' | 'extended'>('standard');
  const [activeTarget, setActiveTarget] = useState<number>(initialTarget);

  // Calculate score band based on College Board official SEM (Standard Error of Measurement)
  // Standard (SEM ~20 pts) -> 630 - 670 for a 650 baseline
  // Extended (SEM ~35 pts) -> 615 - 685
  const sem = selectedConfidence === 'standard' ? 20 : 35;
  const lowerBand = Math.max(200, Math.round(currentScore - sem));
  const upperBand = Math.min(800, Math.round(currentScore + sem));

  const targetDelta = activeTarget - currentScore;
  const isTargetAchieved = targetDelta <= 0;

  // Scale percentage helper for the 200 - 800 SAT Math track
  const getPercentOnScale = (score: number) => {
    const clamped = Math.max(200, Math.min(800, score));
    return ((clamped - 200) / 600) * 100;
  };

  const lowerPercent = getPercentOnScale(lowerBand);
  const upperPercent = getPercentOnScale(upperBand);
  const currentPercent = getPercentOnScale(currentScore);
  const targetPercent = getPercentOnScale(activeTarget);

  const handleTargetChange = (val: number) => {
    setActiveTarget(val);
    if (onUpdateTargetScore) {
      onUpdateTargetScore(val);
    }
  };

  const TARGET_PRESETS = [700, 720, 750, 780, 800];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 dark:border-emerald-500/30 bg-white/95 dark:bg-[#0c1424]/95 backdrop-blur-sm p-6 sm:p-7 shadow-sm dark:shadow-[0_4px_24px_rgba(16,185,129,0.06)] transition-all">
      {/* Background Decorative Ambient Gradient */}
      <div className="pointer-events-none absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-gradient-to-tr from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
              Predictive Performance
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Score Forecast
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Shows a realistic scoring band rather than a static single number, factoring in College Board adaptive testing variance.
          </p>
        </div>

        {/* Confidence Interval Selector */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setSelectedConfidence('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedConfidence === 'standard'
                ? 'bg-white dark:bg-emerald-500 text-emerald-700 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ±20 SEM Band
          </button>
          <button
            type="button"
            onClick={() => setSelectedConfidence('extended')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedConfidence === 'extended'
                ? 'bg-white dark:bg-emerald-500 text-emerald-700 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ±35 Wide Band
          </button>
        </div>
      </div>

      {/* Main Score Range Readout Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        
        {/* Left Column: Big Range Band Callout */}
        <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-900/90 dark:via-[#0f172a] dark:to-emerald-950/20 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Projected Math Range
              </span>
              <span className="inline-flex items-center space-x-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60">
                <ShieldCheck className="w-3 h-3" />
                <span>95% Confidence Interval</span>
              </span>
            </div>

            {/* The Big Range Display: 630 — 670 */}
            <div className="flex items-baseline space-x-2.5 pt-1">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {lowerBand}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                —
              </span>
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                {upperBand}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 pl-1">
                / 800
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
              Centered at estimated base <strong className="text-slate-900 dark:text-white font-mono">{currentScore}</strong> with a <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{sem * 2} pt</span> variance spread.
            </p>
          </div>

          {/* Target Delta Card */}
          <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                isTargetAchieved
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-800'
              }`}>
                {isTargetAchieved ? <Award className="w-4 h-4" /> : <Target className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  Target Score ({activeTarget})
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                  {isTargetAchieved ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                      <span>Target Surpassed (+{Math.abs(targetDelta)} pts)</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 dark:text-amber-400 flex items-center space-x-1">
                      <span>Target Gap: -{targetDelta} pts to goal</span>
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                Reachability
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                {targetDelta <= 40 ? 'High (1–2 weeks)' : targetDelta <= 80 ? 'Moderate (3–4 weeks)' : 'Ambitious Target'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual SAT Scale & Target Selector */}
        <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          
          {/* Visual SAT Math Scale (200 - 800) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                SAT Math Scale Continuum
              </span>
              <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                Range: 200 – 800
              </span>
            </div>

            {/* Custom Interactive Scale Track */}
            <div className="relative pt-6 pb-4">
              {/* Target Marker Flag Above Track */}
              <div
                className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-all duration-300 pointer-events-none"
                style={{ left: `${targetPercent}%` }}
              >
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-black bg-amber-500 text-slate-950 shadow-sm">
                  Goal {activeTarget}
                </span>
                <div className="w-0.5 h-2 bg-amber-500" />
              </div>

              {/* Main Track Background */}
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
                {/* 500 Baseline Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-700"
                  style={{ left: `${getPercentOnScale(500)}%` }}
                />

                {/* Range Card Highlighted Band (e.g. 630 to 670) */}
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-300"
                  style={{
                    left: `${lowerPercent}%`,
                    width: `${Math.max(4, upperPercent - lowerPercent)}%`,
                  }}
                />
              </div>

              {/* Center Estimated Score Pointer */}
              <div
                className="absolute top-5 transform -translate-x-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-md transition-all duration-300 pointer-events-none"
                style={{ left: `${currentPercent}%` }}
              />

              {/* Scale Tick Labels */}
              <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-2 px-0.5">
                <span>200</span>
                <span>400</span>
                <span>500</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{lowerBand}–{upperBand}</span>
                <span>700</span>
                <span>800</span>
              </div>
            </div>
          </div>

          {/* Quick Target Score Adjuster Presets */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Adjust Target Math Score:</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {activeTarget}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {TARGET_PRESETS.map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => handleTargetChange(score)}
                  className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    activeTarget === score
                      ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* Educational Tip */}
          <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start space-x-2">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Primary User Value:</strong> Instead of obsessing over a static number, lifting your lower band to <strong>{Math.min(800, lowerBand + 30)}</strong> ensures high-floor consistency on test day.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
