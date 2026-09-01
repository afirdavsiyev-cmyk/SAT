import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  PanelLeft
} from 'lucide-react';

export type StudySidebarTab =
  | 'home'
  | 'ai_tutor'
  | 'planner'
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
  const { setCurrentView, userProgress, studyPlan } = useApp();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <aside
      className={`h-full bg-slate-950/90 border-r border-slate-800/80 backdrop-blur-2xl p-3 flex flex-col justify-between flex-shrink-0 z-20 select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Navigation Sections */}
      <div className="space-y-4">
        
        {/* Workspace Brand & Collapse Toggle */}
        <div className={`flex items-center pb-3 border-b border-white/[0.06] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div
            onClick={() => setCurrentView('landing')}
            className="flex items-center space-x-2.5 cursor-pointer group"
            title="SAT Master Study Hub (Click to return Home)"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-sm text-white block tracking-tight truncate">Study Hub</span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">SAT Math 100%</span>
              </div>
            )}
          </div>

          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200 ${
              isCollapsed ? 'hidden' : 'flex items-center'
            }`}
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Focused Header Test Track Badge */}
        {!isCollapsed ? (
          <div className="bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-800/50 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              <span className="text-xs font-extrabold text-white tracking-wide truncate">Digital SAT 2026</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700/50 uppercase flex-shrink-0">
              Active
            </span>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span className="text-[10px] font-mono font-extrabold text-emerald-400 bg-emerald-950 border border-emerald-800/60 px-2 py-1 rounded-xl shadow-glow-emerald">
              SAT
            </span>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-17rem)] pr-0.5 scrollbar-thin scrollbar-thumb-slate-800">
          
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
              icon={<Bot className="w-4 h-4 text-emerald-400" />}
              label="ScoreUP AI"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'ai_tutor'}
              badge="Live"
              badgeColor="emerald"
              onClick={() => {
                onSelectTab('ai_tutor');
                if (onOpenAiTutor) onOpenAiTutor();
              }}
            />
            <SidebarItem
              icon={<Calendar className="w-4 h-4 text-emerald-400" />}
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
              icon={<Calculator className="w-4 h-4 text-emerald-400" />}
              label="Math & Desmos"
              isCollapsed={isCollapsed}
              badge="New"
              badgeColor="emerald"
              isActive={activeTab === 'masterclass_math'}
              onClick={() => onSelectTab('masterclass_math')}
            />
            <SidebarItem
              icon={<Library className="w-4 h-4 text-amber-400" />}
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
              icon={<FolderKanban className="w-4 h-4 text-amber-400" />}
              label="Question Bank"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'question_bank'}
              onClick={() => onSelectTab('question_bank')}
            />
            <SidebarItem
              icon={<Zap className="w-4 h-4 text-yellow-400" />}
              label="Question Rush"
              isCollapsed={isCollapsed}
              badge="Speed"
              badgeColor="amber"
              isActive={activeTab === 'question_rush'}
              onClick={() => onSelectTab('question_rush')}
            />
            <SidebarItem
              icon={<Target className="w-4 h-4 text-rose-400" />}
              label="Challenge (750+)"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'challenge'}
              onClick={() => onSelectTab('challenge')}
            />
            <SidebarItem
              icon={<FileText className="w-4 h-4 text-emerald-400" />}
              label="Full-Length Tests"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'tests'}
              onClick={() => onSelectTab('tests')}
            />
            <SidebarItem
              icon={<BookOpen className="w-4 h-4 text-indigo-400" />}
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
              icon={<Bookmark className="w-4 h-4 text-yellow-400" />}
              label="Saved & Mistakes"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'saved'}
              onClick={() => onSelectTab('saved')}
            />
            <SidebarItem
              icon={<BarChart3 className="w-4 h-4 text-teal-400" />}
              label="Analytics"
              isCollapsed={isCollapsed}
              isActive={activeTab === 'analytics'}
              onClick={() => onSelectTab('analytics')}
            />
          </div>

        </div>

      </div>

      {/* Sidebar Footer User Profile */}
      <div className="pt-3 border-t border-white/[0.06] space-y-2">
        <div className={`p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-2.5">
            <div
              className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-[0_0_12px_rgba(16,185,129,0.4)] flex-shrink-0 cursor-pointer"
              title={`Alex Chen • ${userProgress.streakDays}d Streak`}
            >
              ⚡
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="font-extrabold text-xs text-white truncate">Alex Chen</div>
                <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                  <Flame className="w-3 h-3 text-orange-400 fill-orange-400 flex-shrink-0" />
                  <span className="text-orange-300 font-bold truncate">{userProgress.streakDays}d streak</span>
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setShowSettingsModal(!showSettingsModal)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors flex-shrink-0"
              title="Study Hub Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed expand toggle button */}
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-full py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition-colors"
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
  badgeColor?: 'emerald' | 'teal' | 'amber' | 'sky';
  isCollapsed?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  badge,
  badgeColor = 'emerald',
  isCollapsed,
  isActive,
  onClick
}) => {
  const badgeClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    teal: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    sky: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
  };

  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full rounded-xl text-xs font-semibold flex items-center transition-all duration-200 group active:scale-[0.97] ${
        isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
      } ${
        isActive
          ? 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] font-bold'
          : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
      }`}
    >
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2.5 truncate'}`}>
        <span className={`${isActive ? 'text-emerald-400 scale-105' : 'text-slate-400 group-hover:text-slate-200'} transition-transform duration-200 flex-shrink-0`}>
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
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
      )}
    </button>
  );
};
