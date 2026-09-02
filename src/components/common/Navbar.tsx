import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Zap, Flame, Trophy, Compass, LayoutDashboard, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { SlidingTabGroup } from './SlidingTabGroup';
import { ThemeToggle } from './ThemeToggle';
import { ScoreUpLogo } from './ScoreUpLogo';

const NAV_ITEMS = [
  { label: 'Overview', icon: <Compass className="w-3.5 h-3.5" />, view: 'landing' as const },
  { label: 'Study', icon: <LayoutDashboard className="w-3.5 h-3.5" />, view: 'dashboard' as const },
  { label: 'Study Plan', icon: <Zap className="w-3.5 h-3.5" />, view: 'onboarding' as const },
  { label: 'Ranks', icon: <Trophy className="w-3.5 h-3.5" />, view: 'leaderboard' as const },
];

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const { activeUser, isAuthenticated, logout, openAuthModal, openOnboardingModal } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeIndex = NAV_ITEMS.findIndex((n) => n.view === currentView);
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  const handleTabChange = (idx: number) => {
    setCurrentView(NAV_ITEMS[idx].view);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/90 dark:bg-slate-950/85 border-b border-amber-900/10 dark:border-white/[0.07] transition-colors duration-200 shadow-sm dark:shadow-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ─── ScoreUp Brand Logo ────────────────────────────────────── */}
        <ScoreUpLogo onClick={() => setCurrentView('landing')} />

        {/* ─── Sliding Tab Navigation ────────────────────────────────── */}
        <SlidingTabGroup
          tabs={NAV_ITEMS}
          activeIndex={safeActiveIndex}
          onChange={handleTabChange}
          className="hidden md:flex"
          size="sm"
        />

        {/* ─── Right side badges & CTA ───────────────────────────────── */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0">

          {/* Telegram */}
          <a
            href="https://t.me/sat_ielts_dars"
            target="_blank"
            rel="noopener noreferrer"
            title="Join Telegram Channel"
            className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-[0.96] bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/30 hover:bg-sky-100 dark:hover:bg-sky-500/20 shadow-sm"
          >
            <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.07 9.75c-.15.7-.57.87-1.16.54l-3.15-2.32-1.52 1.46c-.17.17-.31.31-.64.31l.23-3.21 5.85-5.28c.25-.23-.06-.35-.39-.13l-7.23 4.55-3.11-.97c-.68-.21-.69-.68.14-1l12.16-4.69c.56-.21 1.06.14.89.99z" />
            </svg>
            <span>Telegram</span>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@ScoreUp_Academy_SAT"
            target="_blank"
            rel="noopener noreferrer"
            title="Free YouTube SAT Math Course"
            className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-[0.96] bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20 shadow-sm"
          >
            <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="hidden 2xl:inline">Free Course</span>
          </a>

          {/* User Profile Pill or Log In Button */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200/80 hover:border-orange-300 dark:border-slate-800 dark:hover:border-emerald-500/40 bg-white/80 dark:bg-slate-900/80 shadow-sm transition-all active:scale-95"
              >
                {activeUser.avatar ? (
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.firstName}
                    className="w-6 h-6 rounded-full object-cover border border-orange-500/30 dark:border-emerald-500/30"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 dark:from-emerald-500 dark:to-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    {activeUser.firstName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                  {activeUser.firstName}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Harmonized Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-amber-500/20 dark:border-emerald-500/20 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  {/* User Quick Info */}
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{activeUser.firstName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{activeUser.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-amber-600 dark:text-emerald-400 bg-amber-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                      <span>🎯 Target: {activeUser.targetScore}</span>
                      <span>🔥 {activeUser.streakDays} Days Active</span>
                    </div>
                  </div>

                  {/* Menu Actions */}
                  <div className="py-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        openOnboardingModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
                    >
                      <span>👤</span> Edit Profile & Goals
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setCurrentView('onboarding');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
                    >
                      <span>🎯</span> Retake Diagnostic / Roadmap
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        alert('Account & Study Settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
                    >
                      <span>⚙️</span> Account Settings
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        setCurrentView('landing');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors text-left"
                    >
                      <span>🚪</span> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                text-slate-700 hover:text-orange-600 bg-white/60 hover:bg-orange-50/80 border border-slate-200/80 hover:border-orange-300
                dark:text-slate-200 dark:hover:text-emerald-400 dark:bg-slate-900/60 dark:hover:bg-emerald-950/40 dark:border-slate-800 dark:hover:border-emerald-500/30
                shadow-sm active:scale-95"
            >
              Log In
            </button>
          )}

          {/* Streak pill */}
          <div
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs bg-amber-100/90 dark:bg-orange-500/10 text-amber-900 dark:text-orange-300 border border-amber-300 dark:border-orange-500/30 shadow-sm font-bold"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 dark:text-orange-500 dark:fill-orange-500" />
            <span className="font-extrabold">{activeUser.streakDays}d</span>
          </div>

          {/* Global Light / Dark Theme Toggle Switcher */}
          <ThemeToggle />

        </div>

      </div>
    </header>
  );
};

export default Navbar;
