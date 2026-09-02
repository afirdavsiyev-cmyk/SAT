import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StudySidebar, StudySidebarTab } from '../study/StudySidebar';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  Zap,
  PlayCircle,
  Flame,
  Trophy,
  Award,
  CheckCircle,
  Calculator,
  Sparkles,
  BookOpen,
  ArrowRight,
  FolderKanban,
  Target,
  FileText,
  Bookmark,
  BarChart3,
  Library,
  BookMarked,
  Download,
  ExternalLink,
  X,
  PanelLeftClose,
  PanelLeft,
  ArrowLeft,
  GraduationCap,
  Bell,
  Calendar
} from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';
import { mockQuestions } from '../../data/mockData';
import { BOOKS_LIBRARY, BookItem } from '../../data/booksData';
import { ScoreUpAITutorView } from '../study/ScoreUpAITutorView';
import { QuestionBankView } from '../study/QuestionBankView';
import { ScoreCalculatorView } from '../study/ScoreCalculatorView';
import { DailyPlanRoadmapView } from '../study/DailyPlanRoadmapView';
import { HeroExamCountdown } from '../study/HeroExamCountdown';
import { UserProgressState } from '../../types';
import { useStudyPlannerData, TodayDrillItem } from '../../hooks/useStudyPlannerData';
import { useAuth } from '../../context/AuthContext';

export const DashboardView: React.FC = () => {
  const { userProgress, userProgressState, studyPlan, setCurrentView, questions } = useApp();
  const { activeUser } = useAuth();
  const plannerData = useStudyPlannerData();
  const [activeTab, setActiveTab] = useState<StudySidebarTab>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedBookModal, setSelectedBookModal] = useState<BookItem | null>(null);

  const studentFirstName = activeUser.firstName || 'Student';
  const studentTargetScore = activeUser.targetScore || `${plannerData.targetMath}`;
  const studentMainReason = activeUser.mainReason || 'Get into my dream university';
  const studentMotivation = activeUser.biggestMotivation || 'My dream university';

  const displayedScore = activeUser.currentEstimatedMath || activeUser.baselineScore || 650;
  const readinessScore = displayedScore;
  const maxScore = 800;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayedScore / maxScore) * circumference;

  const accuracyText = plannerData.totalSolved > 0
    ? `${((plannerData.totalCorrect / plannerData.totalSolved) * 100).toFixed(1)}% Math Accuracy`
    : '0% Accuracy';

  const scholarLevel = Math.floor(plannerData.globalXP / 700) + 1;

  const handleLaunchDrill = (drill: TodayDrillItem) => {
    if (drill.type === 'concept_deepdive') {
      setActiveTab('masterclass_math');
    } else if (drill.type === 'mixed_timed') {
      setActiveTab('question_bank');
    } else {
      setActiveTab('planner');
    }
  };

  // Weakest Domain Drill identification
  const domainList = useMemo(() => [
    { name: 'Algebra', key: 'algebra' as const, title: 'Linear Algebra Precision Drill', subtitle: '10 Questions • Systems & Inequalities', icon: Calculator },
    { name: 'Advanced Math', key: 'advancedMath' as const, title: 'Advanced Math & Nonlinear Drill', subtitle: '10 Questions • Vertex Forms & Roots', icon: Target },
    { name: 'Problem-Solving & Data Analysis', key: 'problemSolving' as const, title: 'Problem-Solving & Data Booster', subtitle: '10 Questions • Rates & Two-Way Tables', icon: BarChart3 },
    { name: 'Geometry & Trigonometry', key: 'geometryTrig' as const, title: 'Geometry & Trig Booster', subtitle: '8 Questions • Circles & Right Triangles', icon: BookOpen },
  ], []);

  const sortedDomains = useMemo(() => {
    return [...domainList].sort(
      (a, b) => userProgressState.stats.domainMastery[a.key] - userProgressState.stats.domainMastery[b.key]
    );
  }, [domainList, userProgressState.stats.domainMastery]);

  const weakestDomainItem = sortedDomains[0] || domainList[0];

  // Today's Prescriptive Plan Item
  const todayScheduledDay = studyPlan?.weeklyRoadmap?.[0]?.days?.[(userProgressState.planner.currentDay || 1) - 1] || studyPlan?.weeklyRoadmap?.[0]?.days?.[0];

  return (
    <div className="h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#070b12] text-slate-900 dark:text-slate-100 relative overflow-hidden select-none transition-colors duration-200">
      
      {/* Minimal Study Hub Header Bar */}
      <header className="h-14 bg-white/90 dark:bg-[#0c121e]/80 border-b border-amber-900/10 dark:border-slate-800/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0 transition-colors duration-200 shadow-sm dark:shadow-none">
        
        {/* Left: Sidebar Toggle + Title & Track Badge */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl bg-amber-50/80 dark:bg-white/[0.05] hover:bg-amber-100/80 dark:hover:bg-white/[0.1] border border-amber-900/15 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeft className="w-4 h-4 text-amber-600 dark:text-emerald-400" /> : <PanelLeftClose className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/15 to-orange-500/10 dark:from-emerald-500/25 dark:to-emerald-950/40 border border-amber-500/30 dark:border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <span className="font-black text-sm text-amber-600 dark:text-emerald-400">S</span>
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight hidden sm:inline">SAT Study Hub</span>
            <span className="text-[10px] font-mono font-bold text-amber-900 dark:text-emerald-400 bg-amber-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-emerald-800/60">
              Digital SAT
            </span>
          </div>
        </div>

        {/* Right: Quick Stats, Notifications & Exit to Overview Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Streak Indicator Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-100/90 dark:bg-orange-500/10 border border-amber-300 dark:border-orange-500/30 text-xs font-bold text-amber-900 dark:text-orange-300 shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 dark:fill-orange-500 dark:text-orange-500" />
            <span>{plannerData.streakDays}d Streak</span>
          </div>

          {/* User Score Badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-emerald-500/10 border border-amber-300/70 dark:border-emerald-500/30 text-xs font-mono font-bold text-amber-900 dark:text-emerald-400 shadow-sm">
            <span>Score: {plannerData.currentEstimatedMath}/800</span>
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle size="sm" />

          {/* Exit to Overview Button */}
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/[0.06] hover:bg-amber-50/60 dark:hover:bg-white/[0.12] border border-amber-900/15 dark:border-white/[0.1] text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-[0_2px_8px_rgba(245,158,11,0.04)]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-600 dark:text-emerald-400" />
            <span>Exit to Overview</span>
          </button>

        </div>
      </header>

      {/* Main App Workspace Shell (Sidebar + Content Area) */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        
        {/* OnePrep-style Study Hub Sidebar (Left Column) */}
        <StudySidebar
          activeTab={activeTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenAiTutor={() => setActiveTab('ai_tutor')}
        />

        {/* Main Workspace Content Area (Right Column) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8 transition-all duration-300">

          {/* ─── TAB 1: HOME (Study Dashboard Overview) ─────────────────── */}
          {activeTab === 'home' && (
            <div className="max-w-6xl mx-auto space-y-8">
              
              {/* Top Banner / Welcome Card with High-Impact Hero Countdown */}
              <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/15 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/80 border border-amber-500/30 dark:border-emerald-500/40 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-[0_4px_25px_rgba(245,158,11,0.08)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.14)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all">
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 z-10">
                  
                  {/* Left: Heading & Target Info */}
                  <div className="space-y-2.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border-amber-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 text-xs font-bold border">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 dark:bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-emerald-500"></span>
                        </span>
                        <span>{userProgressState.stats.streakDays}-Day Study Streak Active</span>
                      </div>

                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-100/90 text-orange-900 border-orange-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30 text-xs font-bold border">
                        <Target className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
                        <span>{studentTargetScore} Target Track</span>
                      </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      Welcome back, {studentFirstName}!
                    </h1>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      Target exam: <span className="text-orange-800 dark:text-emerald-400 font-bold">{plannerData.targetExamDate}</span> • Goal: <span className="text-orange-800 dark:text-emerald-400 font-bold">{studentTargetScore} / 800</span>
                    </p>

                    {/* Student Goal Badge */}
                    <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-950/70 border border-amber-900/10 dark:border-white/[0.08] text-xs text-slate-700 dark:text-slate-300 shadow-xs">
                      <span className="font-bold text-orange-600 dark:text-emerald-400">
                        {studentFirstName}'s Goal:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {studentMainReason}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">•</span>
                      <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
                        Driven by: <strong className="text-slate-700 dark:text-slate-200">{studentMotivation}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Right: Dedicated Large Countdown Timer Display */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto">
                    <HeroExamCountdown targetDate={plannerData.targetExamDate} />
                  </div>
                </div>

                {/* Bottom Row: Quick Action CTA Buttons */}
                <div className="pt-4 border-t border-amber-900/10 dark:border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-emerald-500 animate-pulse"></span>
                    <span>Adaptive SAT curriculum synced to your target countdown</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setCurrentView('exam')}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 dark:text-slate-950 font-extrabold text-sm shadow-[0_4px_14px_rgba(245,158,11,0.35)] dark:shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
                    >
                      <PlayCircle className="w-5 h-5 fill-white stroke-orange-600 dark:fill-slate-950 dark:stroke-emerald-400" />
                      <span>Launch Bluebook Test</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('planner')}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-900/15 dark:border-emerald-500/40 text-amber-950 dark:text-slate-300 hover:text-amber-950 dark:hover:text-white hover:bg-amber-50/50 font-bold text-xs transition-all active:scale-95 shadow-[0_4px_20px_rgba(245,158,11,0.06)]"
                    >
                      View Study Roadmap
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Stats Grid (Readiness Meter + Scores + XP) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Readiness Dial Card (Col 4) */}
                <div className="lg:col-span-4 bg-white dark:bg-[#0c1424] border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-500/40 dark:hover:border-emerald-500/60 rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-[0_4px_20px_rgba(245,158,11,0.06)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                  <div className="w-full flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
                    <span>Math Readiness Score</span>
                    <span className="text-orange-600 dark:text-emerald-400 font-mono font-bold">
                      {plannerData.testsCompleted > 0 ? 'Exam Scaled' : 'Adaptive Calibrated'}
                    </span>
                  </div>

                  {/* Dial Visual */}
                  <div className="relative w-44 h-44 flex items-center justify-center my-2">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 180 180">
                      <circle
                        cx="90"
                        cy="90"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-amber-100 dark:text-slate-800"
                        fill="transparent"
                      />
                      <circle
                        cx="90"
                        cy="90"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-orange-500 dark:text-emerald-400 stroke-current transition-all duration-1000"
                        fill="transparent"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">{displayedScore}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">out of 800</span>
                    </div>
                  </div>

                  <div className="w-full mt-4 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-slate-950 border border-amber-900/10 dark:border-slate-800 flex justify-between items-center shadow-inner">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">DIGITAL SAT MATH ESTIMATE</span>
                      <span className="font-bold text-orange-700 dark:text-emerald-400 text-base">{displayedScore} / {activeUser.targetScore || 800}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats & XP Progress (Col 8) */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="bg-white dark:bg-[#0c1424] border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-500/40 dark:hover:border-emerald-500/60 rounded-3xl p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(245,158,11,0.06)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="text-xs font-bold">Total Solved</span>
                      <CheckCircle className="w-5 h-5 text-orange-500 dark:text-emerald-400" />
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{plannerData.totalSolved}</div>
                      <div className="text-xs text-orange-700 dark:text-emerald-400 mt-1 font-semibold">{accuracyText}</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0c1424] border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-500/40 dark:hover:border-emerald-500/60 rounded-3xl p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(245,158,11,0.06)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="text-xs font-bold">Global XP</span>
                      <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{plannerData.globalXP}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Level {scholarLevel} Math Scholar</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0c1424] border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-500/40 dark:hover:border-emerald-500/60 rounded-3xl p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(245,158,11,0.06)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="text-xs font-bold">Tests Completed</span>
                      <Trophy className="w-5 h-5 text-orange-500 dark:text-teal-400" />
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{plannerData.testsCompleted} Exams</div>
                      <div className="text-xs text-orange-700 dark:text-teal-400 mt-1 font-semibold">Official Adaptive Engine</div>
                    </div>
                  </div>

                  {/* Dynamic Recommended Today's Practice Drills */}
                  <div className="sm:col-span-3 bg-white dark:bg-[#0c1424] border border-amber-900/10 dark:border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-[0_4px_20px_rgba(245,158,11,0.06)] transition-all">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-orange-500 dark:text-emerald-400" />
                      <span>Recommended Today's Practice Drills</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {plannerData.todaysDrills.map((drill, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleLaunchDrill(drill)}
                          className="flex-1 p-4 rounded-xl bg-orange-50/60 dark:bg-slate-900/60 border border-orange-200/80 dark:border-emerald-500/20 hover:border-orange-400 dark:hover:border-emerald-500/50 cursor-pointer transition-all group shadow-sm hover:shadow"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-700 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                              {drill.icon}
                            </span>
                            <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                              {drill.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {drill.questionCount} Questions • {drill.subtopicName} • ~{drill.estimatedMinutes}m
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Skill Mastery Breakdown (4 Official Math Domains) */}
              <div className="bg-white dark:bg-[#0c1424] border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-500/40 dark:hover:border-emerald-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_4px_20px_rgba(245,158,11,0.06)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">4 Official Digital SAT Math Domains</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Real-time mastery levels calculated from your adaptive subtopic skill matrix.</p>
                  </div>
                  <span className="text-xs font-mono text-orange-900 dark:text-emerald-400 font-bold bg-orange-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-orange-300 dark:border-emerald-800/40">
                    Digital SAT Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { domain: 'Algebra', mastery: plannerData.domainMastery.algebra },
                    { domain: 'Advanced Math', mastery: plannerData.domainMastery.advancedMath },
                    { domain: 'Problem-Solving & Data Analysis', mastery: plannerData.domainMastery.problemSolving },
                    { domain: 'Geometry & Trigonometry', mastery: plannerData.domainMastery.geometryTrig },
                  ].map((skill, idx) => {
                    const getBarColor = (val: number) => {
                      if (val < 50) return 'bg-rose-500';
                      if (val < 70) return 'bg-amber-500';
                      return 'bg-orange-600 dark:bg-emerald-400';
                    };

                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-800 dark:text-slate-200">{skill.domain}</span>
                          <span className="text-orange-700 dark:text-emerald-400 font-mono font-bold">{skill.mastery}% Mastery</span>
                        </div>
                        <div className="w-full bg-orange-100/60 dark:bg-slate-950 h-2.5 rounded-full border border-amber-900/10 dark:border-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getBarColor(skill.mastery)}`}
                            style={{ width: `${skill.mastery}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ─── TAB 2: SCOREUP AI TUTOR (Full-Canvas Center View) ─────── */}
          {activeTab === 'ai_tutor' && (
            <div className="h-full">
              <ScoreUpAITutorView />
            </div>
          )}

          {/* ─── TAB 3: STUDY PLANNER ───────────────────────────────────── */}
          {activeTab === 'planner' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <DailyPlanRoadmapView
                onStartDrill={(day) => {
                  if (day.type === 'mock') {
                    setCurrentView('exam');
                  } else {
                    setActiveTab('question_bank');
                  }
                }}
              />
            </div>
          )}

          {/* ─── TAB: SCORE CALCULATOR ──────────────────────────────────── */}
          {activeTab === 'score_calculator' && (
            <ScoreCalculatorView />
          )}

          {/* ─── TAB 3: MASTERCLASS - MATH & DESMOS ──────────────────────── */}
          {activeTab === 'masterclass_math' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-white to-amber-500/10 dark:from-emerald-950 dark:via-slate-900 dark:to-slate-900 border border-orange-500/30 dark:border-emerald-500/40 space-y-3 shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.1)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50 text-xs font-bold">
                  <Calculator className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
                  <span>DESMOS MASTERCLASS</span>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Digital SAT Desmos Speed Mastery</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Learn how to solve 60%+ of Digital SAT Math questions in seconds using regression, vertex finders, and system intersections directly in Desmos.
                </p>
              </div>

              {/* Framed Technique Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-400 dark:hover:border-emerald-500/60 space-y-3 shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
                    <span>1. Instant System Intersections</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Type both linear or quadratic equations directly into Desmos. Tap the intersection point $(x, y)$ to retrieve exact solution coordinates without manual elimination.
                  </p>
                  <div className="p-3 border-orange-200 bg-orange-50/50 text-orange-950 dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-300 rounded-xl font-mono text-xs border">
                    y = 2x + 5<br />
                    y = -x + 11 → Intersect at (2, 9)
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-400 dark:hover:border-emerald-500/60 space-y-3 shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
                    <span>2. Linear & Quadratic Regression</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    When given a data table, type <code className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded text-xs font-bold border">y1 ~ m x1 + b</code> or <code className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded text-xs font-bold border">y1 ~ a x1^2 + b x1 + c</code> for instant curve fitting and parameter extraction.
                  </p>
                  <div className="p-3 border-orange-200 bg-orange-50/50 text-orange-950 dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-300 rounded-xl font-mono text-xs border">
                    y1 ~ m x1 + b → slope m and y-intercept b calculated
                  </div>
                </div>
              </div>

              {/* Framed YouTube Banner */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-400 dark:hover:border-emerald-500/60 flex items-center justify-between shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Watch Free Desmos Video Walkthroughs on YouTube</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">ScoreUp Academy official SAT preparation channel.</p>
                </div>
                <a
                  href="https://www.youtube.com/@ScoreUp_Academy_SAT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <span>Open YouTube Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* ─── TAB 5: QUESTION BANK ───────────────────────────────────── */}
          {activeTab === 'question_bank' && (
            <QuestionBankView />
          )}

          {/* ─── TAB 6: QUESTION RUSH ───────────────────────────────────── */}
          {activeTab === 'question_rush' && (
            <div className="max-w-4xl mx-auto text-center space-y-6 py-8">
              <div className="p-8 rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-emerald-500/30 dark:border-emerald-500/40 hover:border-emerald-500/60 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-500/40 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mx-auto shadow-sm dark:shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                  <Zap className="w-8 h-8 fill-yellow-400 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Question Rush (Speed Drill)</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2">
                    Solve as many rapid math problems as you can before the 60-second timer expires. Earn 2x XP multipliers!
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('exam')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl hover:scale-105 transition-all"
                >
                  Start 60s Question Rush
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB 7: CHALLENGE 750+ ─────────────────────────────────── */}
          {activeTab === 'challenge' && (
            <div className="max-w-4xl mx-auto text-center space-y-6 py-8">
              <div className="p-8 rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-emerald-500/30 dark:border-emerald-500/40 hover:border-emerald-500/60 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-sm dark:shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">750+ Challenge Question Vault</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2">
                    Hardest questions curated from 2026/2027 official Digital SAT test specifications.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('exam')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-sm shadow-xl hover:scale-105 transition-all"
                >
                  Launch Hard Math Module
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB 8: FULL-LENGTH TESTS ───────────────────────────────── */}
          {activeTab === 'tests' && (
            <div className="max-w-4xl mx-auto space-y-6 py-4">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-100/90 via-white to-teal-50 dark:from-emerald-950 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/30 dark:border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                <div className="space-y-2 text-center sm:text-left">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Official Bluebook Exam Simulation</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md">
                    Section 2 Math Practice Exam with official 35-minute timer, embedded Desmos calculator, reference sheet, and scratchpad.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('exam')}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all flex items-center space-x-2 flex-shrink-0 shadow-glow-emerald"
                >
                  <PlayCircle className="w-5 h-5 fill-slate-950 stroke-emerald-400" />
                  <span>Launch Practice Test 1</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB 9: VOCAB FLASHCARDS ────────────────────────────────── */}
          {activeTab === 'vocab' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Digital SAT Key Terms & Flashcards</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { term: 'Complementary Angles', def: 'Two angles whose measures sum to 90 degrees. Key identity: sin(A) = cos(90° - A) = cos(B).' },
                  { term: 'Vertex Form', def: 'f(x) = a(x - h)² + k, where (h, k) represents the maximum or minimum vertex coordinate.' },
                  { term: 'Infinitely Many Solutions', def: 'Occurs when two linear equations are linearly dependent (coefficients and constants are in identical ratios).' },
                  { term: 'Circle Standard Equation', def: '(x - h)² + (y - k)² = r², where (h, k) is the center and r is the radius.' }
                ].map((c, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-emerald-500/30 dark:border-emerald-500/40 hover:border-emerald-500/60 space-y-2 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{c.term}</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{c.def}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TAB 10: SAVED & MISTAKES ───────────────────────────────── */}
          {activeTab === 'saved' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Saved Questions & Mistake Log</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Review marked items from your previous Bluebook exam sessions.</p>
              <div className="p-6 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-emerald-500/30 dark:border-emerald-500/40 text-center text-xs text-slate-500 dark:text-slate-400 shadow-sm">
                No bookmarked mistakes currently. Complete an exam module to automatically track missed items!
              </div>
            </div>
          )}

          {/* ─── TAB 11: ANALYTICS ─────────────────────────────────────── */}
          {activeTab === 'analytics' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Performance Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white/95 dark:bg-slate-900/80 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/40 hover:border-emerald-500/60 space-y-1 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Average Accuracy</span>
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{userProgress.accuracyRate}%</div>
                </div>
                <div className="p-5 bg-white/95 dark:bg-slate-900/80 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/40 hover:border-emerald-500/60 space-y-1 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total Solved</span>
                  <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">{userProgressState.stats.totalQuestionsSolved}</div>
                </div>
                <div className="p-5 bg-white/95 dark:bg-slate-900/80 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/40 hover:border-emerald-500/60 space-y-1 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Estimated Math</span>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{readinessScore} / 800</div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 12: BOOKS & CURRICULUM PDF VIEWER ──────────────────── */}
          {activeTab === 'books' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">SAT Math Digital Library</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Official textbooks, College Board question banks, and masterclass prep manuals.</p>
                </div>
                <span className="text-xs font-mono text-orange-800 dark:text-emerald-400 font-bold bg-orange-100 border border-orange-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 px-3 py-1.5 rounded-full">
                  {BOOKS_LIBRARY.length} Textbooks Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {BOOKS_LIBRARY.map((book) => {
                  const encodedUrl = encodeURI(book.fileUrl);
                  return (
                    <div
                      key={book.id}
                      className="bg-white dark:bg-[#0c1424] border border-amber-900/10 dark:border-emerald-500/40 hover:border-orange-400 dark:hover:border-emerald-500/60 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${
                            book.category === 'Practice'
                              ? 'text-orange-700 bg-orange-50 border-orange-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800/60'
                              : book.category === 'Strategy'
                              ? 'text-orange-700 bg-orange-50 border-orange-200 dark:text-teal-400 dark:bg-teal-950/50 dark:border-teal-800/60'
                              : 'text-amber-800 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/50 dark:border-amber-800/60'
                          }`}>
                            {book.category}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{book.tag}</span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-orange-600 dark:group-hover:text-emerald-400 transition-colors">
                            {book.title}
                          </h4>
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-mono mt-0.5">{book.author}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                            {book.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
                        {/* In-App Reading Button */}
                        <button
                          onClick={() => setSelectedBookModal(book)}
                          className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-sm dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Read in App</span>
                        </button>

                        {/* Download / Open New Tab Button */}
                        <a
                          href={encodedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="w-full py-2 rounded-xl bg-white dark:bg-slate-950 border border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-950/40 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <Download className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
                          <span>Download / New Tab</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Frosted Glass In-App PDF Reader Modal */}
      {selectedBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-b border-emerald-500/20 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{selectedBookModal.title}</h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-mono">Author: {selectedBookModal.author}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={encodeURI(selectedBookModal.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  onClick={() => setSelectedBookModal(null)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                  title="Close PDF Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body iframe */}
            <div className="flex-1 p-2 sm:p-4 bg-slate-100 dark:bg-slate-950">
              <iframe
                src={encodeURI(selectedBookModal.fileUrl)}
                title={selectedBookModal.title}
                className="w-full h-[78vh] rounded-2xl border border-emerald-500/25 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-inner"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
