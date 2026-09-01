import React, { useState } from 'react';
import { TrendingUp, Sparkles, Clock, Target, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ScoreComparisonWidget: React.FC = () => {
  const { setCurrentView } = useApp();
  const [currentScore, setCurrentScore] = useState<number>(1180);
  const [weeklyHours, setWeeklyHours] = useState<number>(6);

  // Dynamic formula calculation
  const baseBoost = Math.round(weeklyHours * 22 + (1600 - currentScore) * 0.18);
  const predictedScore = Math.min(1600, currentScore + baseBoost);
  const percentileGain = Math.min(99, Math.round(55 + (predictedScore - 1000) * 0.075));

  return (
    <section id="estimator" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 bg-emerald-950/80 border border-emerald-800/50 px-3 py-1 rounded-full inline-block">
            Interactive AI Score Calculator
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Calculate Your Predicted SAT Score Gain
          </h3>
          <p className="mt-4 text-base text-slate-400">
            See how targeted Bluebook & Desmos practice increases your score in real-time.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders Input Area (Col 7) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Slider 1: Current Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>Your Current / Baseline Score</span>
                  </label>
                  <span className="text-xl font-extrabold font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800/50">
                    {currentScore}
                  </span>
                </div>
                <input
                  type="range"
                  min="900"
                  max="1520"
                  step="10"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>900 Baseline</span>
                  <span>1200 Average</span>
                  <span>1520 High</span>
                </div>
              </div>

              {/* Slider 2: Weekly Study Hours */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span>Weekly Practice Time</span>
                  </label>
                  <span className="text-xl font-extrabold font-mono text-teal-400 bg-teal-950 px-3 py-1 rounded-lg border border-teal-800/50">
                    {weeklyHours} hrs / week
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>2 hrs (Light)</span>
                  <span>6 hrs (Recommended)</span>
                  <span>15 hrs (Intense)</span>
                </div>
              </div>

              {/* Micro Benefits */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Adaptive practice focuses 100% on weak math/reading skills</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Includes full Desmos speed training modules</span>
                </div>
              </div>

            </div>

            {/* Prediction Output Box (Col 5) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950/90 to-slate-950 border border-emerald-500/40 rounded-2xl p-6 text-center relative overflow-hidden shadow-glow-emerald">
              <div className="absolute top-3 right-3 text-xs text-emerald-300 font-bold bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-700/50 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Predicted Result</span>
              </div>

              <div className="mt-4">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Predicted Score Gain</span>
                <div className="text-5xl font-extrabold text-white tracking-tight mt-1 mb-2 font-mono">
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    +{baseBoost} Pts
                  </span>
                </div>
              </div>

              {/* Score comparison pill */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 my-4 text-sm font-semibold">
                <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                  <span>Current: {currentScore}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Target: {predictedScore}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(predictedScore / 1600) * 100}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-300 mb-6 font-medium">
                Top <span className="text-emerald-400 font-bold">{100 - percentileGain}% Percentile</span> globally (~{percentileGain}th percentile).
              </div>

              <button
                onClick={() => setCurrentView('onboarding')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-sm shadow-glow-emerald hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                <span>Lock In Your Study Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
