import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Flame, Trophy, Compass, LayoutDashboard, PlayCircle } from 'lucide-react';
import { SlidingTabGroup } from './SlidingTabGroup';

const NAV_ITEMS = [
  { label: 'Overview', icon: <Compass className="w-3.5 h-3.5" />, view: 'landing' as const },
  { label: 'Study', icon: <LayoutDashboard className="w-3.5 h-3.5" />, view: 'dashboard' as const },
  { label: 'Study Plan', icon: <Zap className="w-3.5 h-3.5" />, view: 'onboarding' as const },
  { label: 'Bluebook Test', icon: <PlayCircle className="w-3.5 h-3.5" />, view: 'exam' as const },
  { label: 'Ranks', icon: <Trophy className="w-3.5 h-3.5" />, view: 'leaderboard' as const },
];

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, userProgress } = useApp();

  const activeIndex = NAV_ITEMS.findIndex((n) => n.view === currentView);
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  const handleTabChange = (idx: number) => {
    setCurrentView(NAV_ITEMS[idx].view);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-slate-950/75 border-b border-white/[0.07]"
      style={{ boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ─── Logo ─────────────────────────────────────────────────── */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform duration-300">
            <Zap className="w-5 h-5 text-slate-950 fill-slate-950 stroke-1" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                SAT Master
              </span>
              {/* MATH 2026 badge — frosted glass */}
              <span
                className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-full backdrop-blur-xl"
                style={{
                  background: 'rgba(16, 185, 129, 0.18)',
                  border: '1px solid rgba(52, 211, 153, 0.40)',
                  color: '#6ee7b7',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 14px rgba(16,185,129,0.2)',
                }}
              >
                Math 2026
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">Digital Bluebook Platform</p>
          </div>
        </div>

        {/* ─── Sliding Tab Navigation ────────────────────────────────── */}
        <SlidingTabGroup
          tabs={NAV_ITEMS}
          activeIndex={safeActiveIndex}
          onChange={handleTabChange}
          className="hidden md:flex"
          size="sm"
        />

        {/* ─── Right side badges & CTA ───────────────────────────────── */}
        <div className="flex items-center space-x-2 flex-shrink-0">

          {/* Telegram — sky frosted glass pill */}
          <a
            href="https://t.me/sat_ielts_dars"
            target="_blank"
            rel="noopener noreferrer"
            title="Join Telegram Channel"
            className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-[0.96]"
            style={{
              background: 'rgba(14,165,233,0.13)',
              border: '1px solid rgba(56,189,248,0.35)',
              color: '#7dd3fc',
              backdropFilter: 'blur(16px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 0 12px rgba(14,165,233,0.15)',
              transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.07 9.75c-.15.7-.57.87-1.16.54l-3.15-2.32-1.52 1.46c-.17.17-.31.31-.64.31l.23-3.21 5.85-5.28c.25-.23-.06-.35-.39-.13l-7.23 4.55-3.11-.97c-.68-.21-.69-.68.14-1l12.16-4.69c.56-.21 1.06.14.89.99z" />
            </svg>
            <span>Telegram</span>
          </a>

          {/* YouTube — red frosted glass pill */}
          <a
            href="https://www.youtube.com/@ScoreUp_Academy_SAT"
            target="_blank"
            rel="noopener noreferrer"
            title="Free YouTube SAT Math Course"
            className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-[0.96]"
            style={{
              background: 'rgba(239,68,68,0.13)',
              border: '1px solid rgba(252,165,165,0.30)',
              color: '#fca5a5',
              backdropFilter: 'blur(16px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 0 12px rgba(239,68,68,0.15)',
              transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="hidden 2xl:inline">Free Course</span>
          </a>

          {/* Streak pill — orange frosted glass */}
          <div
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs"
            style={{
              background: 'rgba(251,146,60,0.13)',
              border: '1px solid rgba(251,146,60,0.30)',
              backdropFilter: 'blur(16px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 0 10px rgba(251,146,60,0.12)',
            }}
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="font-extrabold text-orange-300">{userProgress.streakDays}d</span>
          </div>

          {/* Start Bluebook Test CTA — emerald glass pill */}
          <button
            onClick={() => setCurrentView('exam')}
            className="glass-pill-emerald flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-extrabold text-emerald-100 flex-shrink-0"
            style={{ transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)' }}
          >
            <PlayCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Start Bluebook Test</span>
            <span className="sm:hidden">Test</span>
          </button>
        </div>

      </div>
    </header>
  );
};
