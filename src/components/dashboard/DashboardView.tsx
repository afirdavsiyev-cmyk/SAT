import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, PlayCircle, Flame, Trophy, Award, CheckCircle, Calculator, Sparkles, BookOpen } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { userProgress, studyPlan, setCurrentView } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner / Welcome Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/80 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800/40">
            <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            <span>{userProgress.streakDays}-Day Study Streak Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Welcome back, Math Scholar!</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Your target exam is <span className="text-emerald-400 font-semibold">{studyPlan?.targetDate || 'October 2026'}</span>. You are on track to reach your target score of <span className="text-emerald-400 font-semibold">{studyPlan?.targetScore || 800} / 800</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={() => setCurrentView('exam')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-sm shadow-glow-emerald hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            <PlayCircle className="w-5 h-5 fill-slate-950 stroke-emerald-400" />
            <span>Launch Bluebook Test</span>
          </button>

          <button
            onClick={() => setCurrentView('onboarding')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs"
          >
            Edit Study Roadmap
          </button>
        </div>
      </div>

      {/* Main Stats Grid (Readiness Meter + Scores + XP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Readiness Dial Card (Col 4) */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full flex justify-between items-center text-xs font-bold text-slate-400 mb-4">
            <span>Math Readiness Score</span>
            <span className="text-emerald-400 font-mono">Updated Today</span>
          </div>

          {/* Dial Visual */}
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * userProgress.mathScore) / 800}
                className="text-emerald-400 stroke-current transition-all duration-1000"
                fill="transparent"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white font-mono">{userProgress.mathScore}</span>
              <span className="text-xs text-slate-400 font-semibold mt-0.5">out of 800</span>
            </div>
          </div>

          <div className="w-full mt-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 text-[10px]">DIGITAL SAT MATH ESTIMATE</span>
              <span className="font-bold text-emerald-400 text-base">{userProgress.mathScore} / 800</span>
            </div>
          </div>
        </div>

        {/* Quick Stats & XP Progress (Col 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold">Total Solved</span>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white font-mono">{userProgress.totalQuestionsSolved}</div>
              <div className="text-xs text-emerald-400 mt-1 font-semibold">91.4% Math Accuracy</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold">Global XP</span>
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white font-mono">{userProgress.xp}</div>
              <div className="text-xs text-slate-400 mt-1">Level 14 Math Scholar</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold">Tests Completed</span>
              <Trophy className="w-5 h-5 text-teal-400" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white font-mono">{userProgress.completedTests} Exams</div>
              <div className="text-xs text-teal-400 mt-1 font-semibold">Desmos Shortcuts Ready</div>
            </div>
          </div>

          {/* Quick Action Drills */}
          <div className="sm:col-span-3 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Recommended Today's Practice Drills</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <div 
                onClick={() => setCurrentView('exam')}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-xs">Desmos Math Drill</span>
                </div>
                <p className="text-[11px] text-slate-400">10 Questions • Advanced Math & Parabolas</p>
              </div>

              <div 
                onClick={() => setCurrentView('exam')}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-xl bg-teal-950 text-teal-400 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-xs">Geometry & Trig Booster</span>
                </div>
                <p className="text-[11px] text-slate-400">8 Questions • Right Triangles & Circles</p>
              </div>

              <div 
                onClick={() => setCurrentView('exam')}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-xs">Preppy AI Tutor Session</span>
                </div>
                <p className="text-[11px] text-slate-400">Interactive step-by-step resolution</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Skill Mastery Breakdown (4 Official Math Domains) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">4 Official Digital SAT Math Domains</h3>
            <p className="text-xs text-slate-400">Mastery levels based on recent Bluebook test drill accuracy.</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/40">
            Digital SAT Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userProgress.skillBreakdown.map((skill, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-200">{skill.domain}</span>
                <span className="text-emerald-400 font-mono">{skill.mastery}% Mastery</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full border border-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    skill.mastery >= 90 ? 'bg-emerald-400' : 'bg-teal-400'
                  }`}
                  style={{ width: `${skill.mastery}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
