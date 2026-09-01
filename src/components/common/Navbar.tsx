import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Flame, Trophy, Compass, LayoutDashboard, PlayCircle, Award } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, userProgress } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-glow-emerald group-hover:scale-105 transition-transform duration-300">
            <Zap className="w-6 h-6 text-slate-950 fill-slate-950 stroke-1" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                SAT Master
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md uppercase tracking-wider">
                Math 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-medium">Digital Bluebook Platform</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentView === 'landing' 
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setCurrentView('onboarding')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentView === 'onboarding' 
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Study Plan</span>
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentView === 'dashboard' 
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('exam')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentView === 'exam' 
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Bluebook Test</span>
          </button>

          <button
            onClick={() => setCurrentView('leaderboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              currentView === 'leaderboard' 
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Ranks</span>
          </button>
        </nav>

        {/* User Stats & Social Community Links */}
        <div className="flex items-center space-x-3">
          
          {/* Telegram Channel Button */}
          <a
            href="https://t.me/sat_ielts_dars"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-all text-xs font-bold"
            title="Join Telegram Channel"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.07 9.75c-.15.7-.57.87-1.16.54l-3.15-2.32-1.52 1.46c-.17.17-.31.31-.64.31l.23-3.21 5.85-5.28c.25-.23-.06-.35-.39-.13l-7.23 4.55-3.11-.97c-.68-.21-.69-.68.14-1l12.16-4.69c.56-.21 1.06.14.89.99z"/>
            </svg>
            <span>Telegram</span>
          </a>

          {/* YouTube Channel Button */}
          <a
            href="https://www.youtube.com/@ScoreUp_Academy_SAT"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-xs font-bold"
            title="Free YouTube SAT Math Course"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>Free YouTube Course</span>
          </a>

          {/* Streak pill */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse fill-orange-400" />
            <span className="font-bold text-white">{userProgress.streakDays}d</span>
          </div>

          {/* Action CTA */}
          <button
            onClick={() => setCurrentView('exam')}
            className="relative group overflow-hidden rounded-xl p-px font-semibold text-xs transition-all shadow-glow-emerald hover:shadow-glow-emerald-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 group-hover:opacity-90 transition-opacity"></span>
            <span className="relative block px-4 py-2 bg-slate-950 rounded-[11px] text-emerald-400 font-bold transition-all group-hover:bg-transparent group-hover:text-slate-950">
              Start Bluebook Test
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
