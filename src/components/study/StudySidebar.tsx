import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Bot,
  Calendar,
  BookOpen,
  Calculator,
  FolderKanban,
  Zap,
  Target,
  FileText,
  Bookmark,
  BarChart3,
  ArrowLeft,
  Settings,
  Flame,
  GraduationCap,
  Library,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Gauge
} from 'lucide-react';

export type StudySidebarTab =
  | 'home'
  | 'ai_tutor'
  | 'planner'
  | 'score_calculator'
  | 'masterclass_math'
  | 'books'
  | 'question_bank'
  | 'question_rush'
  | 'challenge'
  | 'tests'
  | 'vocab'
  | 'saved'
  | 'analytics';

interface StudySidebarProps {
  activeTab: StudySidebarTab;
  onSelectTab: (tab: StudySidebarTab) => void;
  onOpenAiTutor?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const StudySidebar: React.FC<StudySidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAiTutor,
  isCollapsed,
  onToggleCollapse
}) => {
  const { setCurrentView } = useApp();
  const { activeUser, logout, openOnboardingModal } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = activeUser.firstName || 'Student';
  const userEmail = activeUser.email || 'student@scoreup.app';
  const targetScore = activeUser.targetScore || '800';
  const streakDays = activeUser.streakDays || 4;

  const handleOpenEditProfile = () => {
    setIsProfileMenuOpen(false);
    openOnboardingModal();
  };

  const handleReconfigureRoadmap = () => {
    setIsProfileMenuOpen(false);
    setCurrentView('onboarding');
  };

  const handleOpenAccountSettings = () => {
    setIsProfileMenuOpen(false);
    alert('Account & Study Settings');
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    setCurrentView('landing');
  };

  return (
    <aside
      className={`h-full bg-white/95 dark:bg-[#090d16] border-r border-slate-200 dark:border-slate-800/80 backdrop-blur-2xl p-3 flex flex-col justify-between flex-shrink-0 z-20 select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Navigation Sections */}
      <div className="space-y-4">
        
        {/* Workspace Brand & Collapse Toggle */}
        <div className={`flex items-center pb-3 border-b border-slate-200 dark:border-white/[0.06] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div
            onClick={() => setCurrentView('landing')}
            className="flex items-center space-x-2.5 cursor-pointer group"
            title="SAT Master Study Hub (Click to return Home)"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.25)] dark:shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:scale-105 transition-transform flex-shrink-0 font-black text-base">
              S
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white block tracking-tight truncate">Study Hub</span>
                <span className="text-[10px] text-orange-600 dark:text-emerald-400 font-mono font-semibold">SAT Math 100%</span>
              </div>
            )}
          </div>

          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all duration-200 ${
              isCollapsed ? 'hidden' : 'flex items-center'
            }`}
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Focused Header Test Track Badge */}
        {!isCollapsed ? (
          <div className="bg-orange-100/70 border border-orange-300/60 text-orange-900 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-300 p-2.5 rounded-2xl flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 truncate">
              <span className="w-2 h-2 rounded-full bg-orange-500 dark:bg-emerald-400 animate-pulse flex-shrink-0"></span>
              <span className="text-xs font-extrabold tracking-wide truncate">Digital SAT</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-orange-800 dark:text-emerald-400 bg-orange-200/80 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded border border-orange-300 dark:border-emerald-700/50 uppercase flex-shrink-0">
              Active
            </span>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span className="text-[10px] font-mono font-extrabold text-orange-800 dark:text-emerald-400 bg-orange-100 border border-orange-300 dark:bg-emerald-950 dark:border-emerald-800/60 px-2 py-1 rounded-xl shadow-sm">
              SAT
            </span>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-17rem)] pr-0.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
          
          {/* Core Navigation */}
          <div className="space-y-1">
            <SidebarItem
              icon={<Home className="w-4 h-4" />}
              label="Home"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'home'}
              onClick={() => onSelectTab('home')}
            />
            <SidebarItem
              icon={<Bot className="w-4 h-4 text-orange-500 dark:text-emerald-400" />}
              label="ScoreUP AI"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'ai_tutor'}
              badge="Live"
              badgeColor="orange"
              onClick={() => {
                onSelectTab('ai_tutor');
                if (onOpenAiTutor) onOpenAiTutor();
              }}
            />
            <SidebarItem
              icon={<Calendar className="w-4 h-4 text-orange-500 dark:text-emerald-400" />}
              label="Study Planner"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'planner'}
              onClick={() => onSelectTab('planner')}
            />
          </div>

          {/* Masterclass Category */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 px-3 pt-1">
                Masterclass & Resources
              </div>
            )}
            <SidebarItem
              icon={<Gauge className="w-4 h-4 text-orange-500 dark:text-emerald-400" />}
              label="Score Calculator"
              isCollapsed={isCollapsed}
              badge="Beta"
              badgeColor="orange"
              isActive={activeTab === 'score_calculator'}
              onClick={() => onSelectTab('score_calculator')}
            />
            <SidebarItem
              icon={<Calculator className="w-4 h-4 text-orange-500 dark:text-emerald-400" />}
              label="Math & Desmos"
              isCollapsed={isCollapsed}
              badge="New"
              badgeColor="orange"
              isActive={activeTab === 'masterclass_math'}
              onClick={() => onSelectTab('masterclass_math')}
            />
            <SidebarItem
              icon={<Library className="w-4 h-4 text-amber-500 dark:text-amber-400" />}
              label="Books & Library"
              isCollapsed={isCollapsed}
              badge="PDFs"
              badgeColor="amber"
              isActive={activeTab === 'books'}
              onClick={() => onSelectTab('books')}
            />
          </div>

          {/* Practice Category */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 px-3 pt-1">
                Practice
              </div>
            )}
            <SidebarItem
              icon={<FolderKanban className="w-4 h-4 text-amber-500 dark:text-amber-400" />}
              label="Question Bank"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'question_bank'}
              onClick={() => onSelectTab('question_bank')}
            />
            <SidebarItem
              icon={<Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />}
              label="Question Rush"
              isCollapsed={isCollapsed}
              badge="Speed"
              badgeColor="amber"
              isActive={activeTab === 'question_rush'}
              onClick={() => onSelectTab('question_rush')}
            />
            <SidebarItem
              icon={<Target className="w-4 h-4 text-rose-500 dark:text-rose-400" />}
              label="Challenge (750+)"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'challenge'}
              onClick={() => onSelectTab('challenge')}
            />
            <SidebarItem
              icon={<FileText className="w-4 h-4 text-orange-500 dark:text-emerald-400" />}
              label="Full-Length Tests"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'tests'}
              onClick={() => onSelectTab('tests')}
            />
            <SidebarItem
              icon={<BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
              label="Vocab & Terminology"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'vocab'}
              onClick={() => onSelectTab('vocab')}
            />
          </div>

          {/* Progress Category */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 px-3 pt-1">
                Progress
              </div>
            )}
            <SidebarItem
              icon={<Bookmark className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />}
              label="Saved & Mistakes"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'saved'}
              onClick={() => onSelectTab('saved')}
            />
            <SidebarItem
              icon={<BarChart3 className="w-4 h-4 text-orange-500 dark:text-teal-400" />}
              label="Analytics"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'analytics'}
              onClick={() => onSelectTab('analytics')}
            />
          </div>

        </div>

      </div>

      {/* Sidebar Footer User Profile */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/[0.06] space-y-2 relative" ref={profileMenuRef}>
        
        {/* Floating Elevated Popover Menu above the badge */}
        {isProfileMenuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 dark:border-emerald-500/20 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-bottom-2">
            {/* User Quick Info */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-amber-600 dark:text-emerald-400 bg-amber-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                <span>🎯 Target: {targetScore}</span>
                <span>🔥 {streakDays} Days Active</span>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="py-1 space-y-0.5">
              <button 
                onClick={handleOpenEditProfile}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
              >
                <span>👤</span> Edit Profile & Goals
              </button>
              <button 
                onClick={handleReconfigureRoadmap}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
              >
                <span>🎯</span> Retake Diagnostic / Roadmap
              </button>
              <button 
                onClick={handleOpenAccountSettings}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
              >
                <span>⚙️</span> Account Settings
              </button>
            </div>

            {/* Sign Out */}
            <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors text-left"
              >
                <span>🚪</span> Log Out
              </button>
            </div>
          </div>
        )}

        {/* Profile Badge Card (Clickable to open popover) */}
        <div
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className={`p-2 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] flex items-center cursor-pointer hover:border-orange-300 dark:hover:border-emerald-500/40 transition-all ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title={`${displayName} • ${streakDays}d Streak (Click to manage)`}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            {activeUser.avatar ? (
              <img
                src={activeUser.avatar}
                alt={displayName}
                className="w-8 h-8 rounded-xl object-cover border border-orange-500/30 dark:border-emerald-500/30 flex-shrink-0"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-xl bg-orange-500 text-white dark:bg-emerald-500 dark:text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-[0_0_12px_rgba(234,88,12,0.4)] dark:shadow-[0_0_12px_rgba(16,185,129,0.4)] flex-shrink-0"
              >
                {displayName.charAt(0).toUpperCase() || '⚡'}
              </div>
            )}
            {!isCollapsed && (
              <div className="overflow-hidden min-w-0">
                <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                  {displayName}
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-slate-500 dark:text-slate-400">
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500 flex-shrink-0" />
                  <span className="text-orange-600 dark:text-emerald-400 font-bold truncate">
                    {streakDays}d streak
                  </span>
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsProfileMenuOpen(!isProfileMenuOpen);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-colors flex-shrink-0"
              title="Profile & Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed expand toggle button */}
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-full py-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.08] flex items-center justify-center transition-colors"
            title="Expand Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}
      </div>

    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeColor?: 'orange' | 'emerald' | 'teal' | 'amber' | 'sky';
  isCollapsed?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  badge,
  badgeColor = 'orange',
  isCollapsed,
  isActive,
  onClick
}) => {
  const badgeClasses = {
    orange: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/30',
    emerald: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
    teal: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30',
    amber: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30',
    sky: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30'
  };

  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full rounded-xl text-xs font-semibold flex items-center transition-all duration-200 group active:scale-[0.97] ${
        isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
      } ${
        isActive
          ? 'bg-orange-500/15 text-orange-700 border-l-4 border-orange-500 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-400 shadow-sm font-bold'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 border-l-4 border-transparent'
      }`}
    >
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5 truncate'}`}>
        <span className={`${isActive ? 'text-orange-600 dark:text-emerald-400 scale-105' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'} transition-transform duration-200 flex-shrink-0`}>
          {icon}
        </span>
        {!isCollapsed && <span className="truncate">{label}</span>}
      </div>

      {!isCollapsed && badge && (
        <span className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-full border flex-shrink-0 ${badgeClasses[badgeColor]}`}>
          {badge}
        </span>
      )}

      {isCollapsed && badge && (
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-emerald-400"></span>
      )}
    </button>
  );
};
