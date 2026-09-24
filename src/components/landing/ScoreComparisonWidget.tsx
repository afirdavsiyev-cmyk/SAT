import React, { useState } from 'react';
import { TrendingUp, Sparkles, Clock, Target, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export const ScoreComparisonWidget: React.FC = () => {
  const { setCurrentView } = useApp();
  const [currentScore, setCurrentScore] = useState<number>(1180);
  const [weeklyHours, setWeeklyHours] = useState<number>(6);

  // Dynamic formula calculation
  const baseBoost = Math.round(weeklyHours * 22 + (1600 - currentScore) * 0.18);
  const predictedScore = Math.min(1600, currentScore + baseBoost);
  const percentileGain = Math.min(99, Math.round(55 + (predictedScore - 1000) * 0.075));

  return (
    <section id="estimator" className="py-24 relative overflow-hidden transition-colors">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mb-3 bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/50 px-3 py-1 rounded-full inline-block">
            Interactive AI Score Calculator
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Calculate Your Predicted SAT Score Gain
          </h3>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            See how targeted Bluebook & Desmos practice increases your score in real-time.
          </p>
        </div>

        {/* Calculator Main Box */}
        <CardContainer className="inter-var w-full max-w-4xl mx-auto">
          <CardBody className="w-full bg-white/95 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.12] dark:bg-slate-900/90 dark:border-white/[0.15] border-black/[0.08] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 rounded-3xl p-6 sm:p-10 shadow-[0_4px_25px_rgba(16,185,129,0.06)] border backdrop-blur-xl transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
              
              {/* Sliders Input Area (Col 7) */}
              <CardItem translateZ="45" className="lg:col-span-7 space-y-8 w-full">
                
                {/* Slider 1: Current Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Your Current / Baseline Score</span>
                    </label>
                    <span className="text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
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
                    className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span>900 Baseline</span>
                    <span>1200 Average</span>
                    <span>1520 High</span>
                  </div>
                </div>

                {/* Slider 2: Weekly Study Hours */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Weekly Practice Time</span>
                    </label>
                    <span className="text-xl font-extrabold font-mono text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-950 px-3 py-1 rounded-lg border border-teal-200 dark:border-teal-800/50">
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
                    className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span>2 hrs (Light)</span>
                    <span>6 hrs (Recommended)</span>
                    <span>15 hrs (Intense)</span>
                  </div>
                </div>

                {/* Micro Benefits */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Adaptive practice focuses 100% on weak math/reading skills</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Full test simulations with Desmos graphing acceleration</span>
                  </div>
                </div>

              </CardItem>

              {/* Results Output Panel (Col 5) */}
              <CardItem
                translateZ="75"
                className="lg:col-span-5 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-100 dark:to-slate-950/80 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 dark:border-emerald-500/30 text-center space-y-6 shadow-inner w-full"
              >
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Estimated Target Score</span>
                </div>

                <div className="space-y-1">
                  <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                      {predictedScore}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    +{baseBoost} Points Predicted Gain
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                    Top {100 - percentileGain}% of Test Takers
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setCurrentView('exam')}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 dark:from-emerald-500 dark:to-teal-500 dark:bg-emerald-500 dark:text-slate-950 font-extrabold text-sm dark:shadow-glow-emerald transition-all active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>Verify with Free Test</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardItem>

            </div>
          </CardBody>
        </CardContainer>

      </div>
    </section>
  );
};
