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
    const targetView = NAV_ITEMS[idx].view;
    if (targetView === 'landing') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    setCurrentView(targetView);
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-[9999] border-b border-slate-200/80 dark:border-white/[0.07] bg-white/95 dark:bg-[#070b12]/95 backdrop-blur-sm transition-colors duration-200 shadow-sm dark:shadow-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ─── ScoreUp Brand Logo ────────────────────────────────────── */}
        <ScoreUpLogo
          onClick={() => {
            if (currentView === 'landing') {
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            } else {
              setCurrentView('landing');
            }
          }}
        />

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
            className="hidden xl:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors shadow-sm"
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
            className="hidden xl:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors shadow-sm"
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
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 hover:border-emerald-500/40 transition-colors active:scale-95 shadow-sm"
              >
                {activeUser.avatar ? (
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.firstName}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500/30 dark:border-emerald-500/30"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
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
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-emerald-500/20 dark:border-emerald-500/20 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  {/* User Quick Info */}
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{activeUser.firstName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{activeUser.email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
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
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
                    >
                      <span>👤</span> Edit Profile & Goals
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setCurrentView('onboarding');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
                    >
                      <span>🎯</span> Retake Diagnostic / Roadmap
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        alert('Account & Study Settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
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
              className="px-4 py-2 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-900/90 border border-emerald-200/80 dark:border-emerald-500/30 hover:bg-emerald-100/80 dark:hover:bg-slate-800 transition-colors active:scale-95 shadow-sm"
            >
              Log In
            </button>
          )}

          {/* Streak pill */}
          <div
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-900 dark:text-emerald-300 shadow-sm"
          >
            <Flame className="w-4 h-4 text-emerald-600 fill-emerald-600 dark:text-emerald-400 dark:fill-emerald-400" />
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
