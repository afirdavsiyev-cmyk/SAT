import React, { useState, useMemo, useEffect } from 'react';
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
  ArrowLeft,
  FolderKanban,
  Target,
  FileText,
  Bookmark,
  BarChart3,
  Compass,
  Library,
  BookMarked,
  Download,
  ExternalLink,
  X,
  PanelLeftClose,
  PanelLeft,
  GraduationCap,
  Bell,
  Calendar,
  Search,
  RefreshCw
} from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';
import { mockQuestions } from '../../data/mockData';
import { ALL_QUESTIONS } from '../../data/questions';
import { QuestionItem } from '../../types/questionBank';
import { PracticeRoomView } from '../study/PracticeRoomView';
import { getProgress, getBookmarks, toggleBookmark } from '../../services/userProgress';
import { BOOKS_LIBRARY, BookItem } from '../../data/booksData';
import { ScoreUpAITutorView } from '../study/ScoreUpAITutorView';
import { QuestionBankView } from '../study/QuestionBankView';
import { ScoreCalculatorView } from '../study/ScoreCalculatorView';
import { DailyPlanRoadmapView } from '../study/DailyPlanRoadmapView';
import { VocabTerminologyView } from '../study/VocabTerminologyView';
import { MathDesmosView } from '../masterclass/MathDesmosView';
import { HeroExamCountdown } from '../study/HeroExamCountdown';
import { UserProgressState } from '../../types';
import { useStudyPlannerData, TodayDrillItem } from '../../hooks/useStudyPlannerData';
import { useAuth } from '../../context/AuthContext';
import { QuestionRushModal, RushConfig } from '../study/QuestionRushModal';
import { QuestionRushSessionView } from '../study/QuestionRushSessionView';
import { AnalyticsDashboardView } from '../analytics/AnalyticsDashboardView';
import { ExamSimulatorModal, ExamSimulatorTarget } from '../exam/ExamSimulatorModal';

export const DashboardView: React.FC = () => {
  const { userProgress, userProgressState, studyPlan, setCurrentView, questions, startExam, mockExamResults, reviewExam } = useApp();
  const { activeUser } = useAuth();
  const plannerData = useStudyPlannerData();
  const [activeTab, setActiveTab] = useState<StudySidebarTab>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedBookModal, setSelectedBookModal] = useState<BookItem | null>(null);

  // Active Practice Room session state for saved items & mistakes
  const [practiceSession, setPracticeSession] = useState<{
    questions: QuestionItem[];
    topicName: string;
    initialIndex: number;
  } | null>(null);

  // Question Rush 5-step modal and active session state
  const [isRushModalOpen, setIsRushModalOpen] = useState<boolean>(false);
  const [rushSession, setRushSession] = useState<{
    config: RushConfig;
    questions: QuestionItem[];
  } | null>(null);

  // Saved & Mistake Log state
  const [savedSubtab, setSavedSubtab] = useState<'bookmarks' | 'mistakes'>('bookmarks');
  const [progressState, setProgressState] = useState(() => getProgress());
  const [bookmarksState, setBookmarksState] = useState(() => getBookmarks());

  // Active Full Exam Simulator Modal State
  const [activeExamSimulator, setActiveExamSimulator] = useState<ExamSimulatorTarget | null>(null);

  const hardQuestions = useMemo(() => ALL_QUESTIONS.filter((q) => q.difficulty === 'Hard'), []);

  const hardByDomain = useMemo(() => ({
    algebra: hardQuestions.filter((q) => q.domain === 'Algebra'),
    advancedMath: hardQuestions.filter((q) => q.domain === 'Advanced Math'),
    problemSolving: hardQuestions.filter((q) => q.domain === 'Problem-Solving & Data Analysis'),
    geometryTrig: hardQuestions.filter((q) => q.domain === 'Geometry & Trigonometry'),
  }), [hardQuestions]);

  useEffect(() => {
    const handleProgressUpdate = () => {
      setProgressState(getProgress());
    };
    const handleBookmarksUpdate = () => {
      setBookmarksState(getBookmarks());
    };
    window.addEventListener('scoreup_progress_updated', handleProgressUpdate);
    window.addEventListener('scoreup_bookmarks_updated', handleBookmarksUpdate);
    return () => {
      window.removeEventListener('scoreup_progress_updated', handleProgressUpdate);
      window.removeEventListener('scoreup_bookmarks_updated', handleBookmarksUpdate);
    };
  }, []);

  const bookmarkedQuestions = useMemo(() => {
    const set = new Set(bookmarksState);
    return ALL_QUESTIONS.filter((q) => set.has(q.id));
  }, [bookmarksState]);

  const mistakeQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter((q) => {
      const att = progressState[q.id];
      return att && !att.isCorrect;
    });
  }, [progressState]);

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

  if (practiceSession && practiceSession.questions.length > 0) {
    return (
      <PracticeRoomView
        questions={practiceSession.questions}
        selectedTopicName={practiceSession.topicName}
        initialIndex={practiceSession.initialIndex}
        onGoBack={() => setPracticeSession(null)}
      />
    );
  }

  if (rushSession && rushSession.questions.length > 0) {
    return (
      <QuestionRushSessionView
        questions={rushSession.questions}
        config={rushSession.config}
        onExit={() => setRushSession(null)}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#070b12] text-slate-900 dark:text-slate-100 relative overflow-hidden select-none transition-colors duration-200">
      
      {/* Minimal Study Hub Header Bar */}
      <header className="h-14 bg-white/95 dark:bg-[#0c121e]/90 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0 transition-colors duration-200 shadow-sm dark:shadow-none">
        
        {/* Left: Sidebar Toggle + Title & Track Badge */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/90 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 active:scale-95 flex items-center justify-center transition-colors shadow-sm"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeft className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> : <PanelLeftClose className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 dark:from-emerald-500/25 dark:to-emerald-950/40 border border-emerald-500/30 dark:border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <span className="font-black text-sm text-emerald-700 dark:text-emerald-400">S</span>
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight hidden sm:inline">SAT Study Hub</span>
            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-emerald-900 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/40">
              Digital SAT
            </div>
          </div>
        </div>

        {/* Right: Quick Stats, Notifications & Exit to Overview Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Streak Indicator Pill */}
          <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" />
            <span>{plannerData.streakDays}d Streak</span>
          </div>

          {/* User Score Badge */}
          <div className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-900 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 shadow-sm">
            <span>Score: {plannerData.currentEstimatedMath}/800</span>
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle size="sm" />

          {/* Exit to Overview Button */}
          <button
            type="button"
            onClick={() => setCurrentView('landing')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
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
              <div className="rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/15 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/80 border border-emerald-500/30 dark:border-emerald-500/40 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-[0_4px_25px_rgba(16,185,129,0.08)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.14)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all">
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 z-10">
                  
                  {/* Left: Heading & Target Info */}
                  <div className="space-y-2.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 text-xs font-bold border">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-500"></span>
                        </span>
                        <span>{userProgressState.stats.streakDays}-Day Study Streak Active</span>
                      </div>

                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-100/90 text-teal-900 border-teal-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30 text-xs font-bold border">
                        <Target className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
                        <span>{studentTargetScore} Target Track</span>
                      </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      Welcome back, {studentFirstName}!
                    </h1>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      Target exam: <span className="text-emerald-800 dark:text-emerald-400 font-bold">{plannerData.targetExamDate}</span> • Goal: <span className="text-emerald-800 dark:text-emerald-400 font-bold">{studentTargetScore} / 800</span>
                    </p>

                    {/* Student Goal Badge */}
                    <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-950/70 border border-slate-200 dark:border-white/[0.08] text-xs text-slate-700 dark:text-slate-300 shadow-xs">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
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
                <div className="pt-4 border-t border-slate-200 dark:border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-500 animate-pulse"></span>
                    <span>Adaptive SAT curriculum synced to your target countdown</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => startExam('full')}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 dark:text-slate-950 font-extrabold text-sm shadow-[0_4px_14px_rgba(16,185,129,0.35)] dark:shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
                    >
                      <PlayCircle className="w-5 h-5 fill-white stroke-emerald-600 dark:fill-slate-950 dark:stroke-emerald-400" />
                      <span>Launch Bluebook Test</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('planner')}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/40 text-emerald-950 dark:text-slate-300 hover:text-emerald-900 dark:hover:text-white hover:bg-emerald-50/50 font-bold text-xs transition-all active:scale-95 shadow-[0_4px_20px_rgba(16,185,129,0.06)]"
                    >
                      View Study Roadmap
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Stats Grid (Readiness Meter + Scores + XP) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Readiness Dial Card (Col 4) */}
                <div className="lg:col-span-4 bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-emerald-500/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/60 rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-[0_4px_20px_rgba(16,185,129,0.06)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                  <div className="w-full flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
                    <span>Math Readiness Score</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
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
                        className="text-emerald-100 dark:text-slate-800"
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
                        className="text-emerald-600 dark:text-emerald-400 stroke-current transition-all duration-1000"
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
                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-inner">
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">DIGITAL SAT MATH ESTIMATE</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 text-base">{displayedScore} / {activeUser.targetScore || 800}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats & XP Progress (Col 8) */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-emerald-500/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/60 rounded-3xl p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(16,185,129,0.06)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="text-xs font-bold">Total Solved</span>
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{plannerData.totalSolved}</div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-semibold">{accuracyText}</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-emerald-500/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/60 rounded-3xl p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(16,185,129,0.06)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="text-xs font-bold">Global XP</span>
                      <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{plannerData.globalXP}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Level {scholarLevel} Math Scholar</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-emerald-500/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/60 rounded-3xl p-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(16,185,129,0.06)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="text-xs font-bold">Tests Completed</span>
                      <Trophy className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{plannerData.testsCompleted} Exams</div>
                      <div className="text-xs text-teal-700 dark:text-teal-400 mt-1 font-semibold">Official Adaptive Engine</div>
                    </div>
                  </div>

                  {/* Dynamic Recommended Today's Practice Drills */}
                  <div className="sm:col-span-3 bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-[0_4px_20px_rgba(16,185,129,0.06)] transition-all">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Recommended Today's Practice Drills</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {plannerData.todaysDrills.map((drill, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleLaunchDrill(drill)}
                          className="flex-1 p-4 rounded-xl bg-emerald-50/60 dark:bg-slate-900/60 border border-emerald-200/80 dark:border-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/50 cursor-pointer transition-all group shadow-sm hover:shadow"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                              {drill.icon}
                            </span>
                            <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
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
              <div className="bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-emerald-500/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_4px_20px_rgba(16,185,129,0.06)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.12)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">4 Official Digital SAT Math Domains</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Real-time mastery levels calculated from your adaptive subtopic skill matrix.</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-900 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800/40">
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
                      return 'bg-emerald-600 dark:bg-emerald-400';
                    };

                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-800 dark:text-slate-200">{skill.domain}</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{skill.mastery}% Mastery</span>
                        </div>
                        <div className="w-full bg-emerald-100/60 dark:bg-slate-950 h-2.5 rounded-full border border-slate-200 dark:border-slate-800 overflow-hidden">
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
                  } else if (day.customQuestions && day.customQuestions.length > 0) {
                    setPracticeSession({
                      questions: day.customQuestions,
                      topicName: day.title || day.domain || "Today's Daily Sprint",
                      initialIndex: 0,
                    });
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
            <MathDesmosView />
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
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Question Rush</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2">
                    Sharpen your reflexes with focused or high-energy speed drills across all official math topics and 750+ challenge questions.
                  </p>
                </div>

                <button
                  onClick={() => setIsRushModalOpen(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 mx-auto"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Start Question Rush</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── TAB 7: CHALLENGE 750+ ─────────────────────────────────── */}
          {activeTab === 'challenge' && (
            <div className="max-w-6xl mx-auto space-y-8 py-4 animate-fadeIn">
              {/* Hero Banner */}
              <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent border border-rose-500/30 shadow-sm backdrop-blur-sm">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>750+ Score Elite Vault</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      750+ Challenge Question Vault
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-xl">
                      Curated repository of the hardest Digital SAT Math questions, multi-step problem sets, and elite mock exams designed to break past the 750 score ceiling into an 800.
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => {
                        const sample = [...hardQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
                        setPracticeSession({
                          questions: sample,
                          topicName: '750+ Sprint Drill (10 Hard Questions)',
                          initialIndex: 0,
                        });
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Start 750+ Sprint (10 Qs)</span>
                    </button>

                    <button
                      onClick={() => {
                        setPracticeSession({
                          questions: hardQuestions,
                          topicName: '750+ Master Pool (All Hard Questions)',
                          initialIndex: 0,
                        });
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 font-extrabold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Award className="w-4 h-4" />
                      <span>Practice All 750+ Bank ({hardQuestions.length})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive 750+ Domain Mastery Drills Grid (100% Question Bank Style, No PDF files) */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Target className="w-5 h-5 text-rose-500" />
                    <span>750+ Domain Mastery Drills</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    High-yield, 100% interactive question bank drills for each domain. Instant KaTeX step-by-step explanations and score tracking.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'algebra',
                      title: 'Algebra 750+ Elite Drill',
                      domain: 'Algebra',
                      questions: hardByDomain.algebra,
                      icon: <Calculator className="w-5 h-5 text-rose-500" />,
                      topics: 'Nonlinear equations, absolute value systems, multi-step inequalities',
                    },
                    {
                      id: 'adv_math',
                      title: 'Advanced Math 750+ Elite Drill',
                      domain: 'Advanced Math',
                      questions: hardByDomain.advancedMath,
                      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
                      topics: 'Complex quadratics, polynomial transformations, exponential modeling',
                    },
                    {
                      id: 'problem_solving',
                      title: 'Problem-Solving 750+ Elite Drill',
                      domain: 'Problem-Solving & Data Analysis',
                      questions: hardByDomain.problemSolving,
                      icon: <BarChart3 className="w-5 h-5 text-amber-500" />,
                      topics: 'Multi-step percent mixtures, ratios, margin of error, data distributions',
                    },
                    {
                      id: 'geometry_trig',
                      title: 'Geometry & Trig 750+ Elite Drill',
                      domain: 'Geometry & Trigonometry',
                      questions: hardByDomain.geometryTrig,
                      icon: <Compass className="w-5 h-5 text-teal-500" />,
                      topics: 'Circle theorems, 3D volume optimizations, trigonometric identities',
                    },
                  ].map((drill) => (
                    <div
                      key={drill.id}
                      className="p-5 rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-rose-500/30 hover:border-rose-500/60 flex flex-col justify-between shadow-sm hover:shadow-[0_4px_20px_rgba(244,63,94,0.08)] transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                              {drill.icon}
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                              {drill.domain}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-500/40">
                            {drill.questions.length} Hard Qs
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-rose-500 transition-colors">
                            {drill.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {drill.topics}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => {
                            setPracticeSession({
                              questions: drill.questions,
                              topicName: `${drill.title} (${drill.questions.length} Questions)`,
                              initialIndex: 0,
                            });
                          }}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Start Interactive Drill ({drill.questions.length} Qs)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 8: FULL-LENGTH TESTS ───────────────────────────────── */}
          {activeTab === 'tests' && (
            <div className="max-w-6xl mx-auto space-y-6 py-4 animate-fadeIn">
              {/* Header Hero Banner */}
              <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 shadow-sm backdrop-blur-sm">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Official Digital SAT Testing Center</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Full-Length Interactive Practice Tests
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-xl">
                      Experience realistic Digital SAT testing with our interactive exam engine featuring authentic 35-minute module timing, integrated Desmos graphing calculator, scratchpad, digital reference sheet, and immediate scoring breakdown.
                    </p>
                  </div>

                  {/* Interactive Practice Tests Quick Launch */}
                  {(() => {
                    const pt1Result = mockExamResults['pt1_full'] || mockExamResults['pt1'] || mockExamResults['full'];
                    const pt2Result = mockExamResults['pt2_full'] || mockExamResults['pt2'];
                    const pt3Result = mockExamResults['pt3_full'] || mockExamResults['pt3'];
                    const pt4Result = mockExamResults['pt4_full'] || mockExamResults['pt4'];
                    const pt5Result = mockExamResults['pt5_full'] || mockExamResults['pt5'];
                    const pt6Result = mockExamResults['pt6_full'] || mockExamResults['pt6'];
                    const pt7Result = mockExamResults['pt7_full'] || mockExamResults['pt7'];
                    const pt8Result = mockExamResults['pt8_full'] || mockExamResults['pt8'];
                    const pt9Result = mockExamResults['pt9_full'] || mockExamResults['pt9'];
                    const pt10Result = mockExamResults['pt10_full'] || mockExamResults['pt10'];
                    const pt11Result = mockExamResults['pt11_full'] || mockExamResults['pt11'];
                    const latestResult = pt11Result ? { id: 'pt11', name: 'Test 11', result: pt11Result }
                      : pt10Result ? { id: 'pt10', name: 'Test 10', result: pt10Result }
                      : pt9Result ? { id: 'pt9', name: 'Test 9', result: pt9Result }
                      : pt8Result ? { id: 'pt8', name: 'Test 8', result: pt8Result }
                      : pt7Result ? { id: 'pt7', name: 'Test 7', result: pt7Result }
                      : pt6Result ? { id: 'pt6', name: 'Test 6', result: pt6Result }
                      : pt5Result ? { id: 'pt5', name: 'Test 5', result: pt5Result }
                      : pt4Result ? { id: 'pt4', name: 'Test 4', result: pt4Result }
                      : pt3Result ? { id: 'pt3', name: 'Test 3', result: pt3Result }
                      : pt2Result ? { id: 'pt2', name: 'Test 2', result: pt2Result }
                      : pt1Result ? { id: 'pt1', name: 'Test 1', result: pt1Result }
                      : null;

                    if (latestResult) {
                      return (
                        <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 dark:text-emerald-400 block">
                              {latestResult.name} Completed • {latestResult.result.score}/800
                            </span>
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">
                              M1: {latestResult.result.module1Correct}/22 • M2: {latestResult.result.module2Correct}/22
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => reviewExam('full', latestResult.id)}
                              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white dark:text-slate-950 font-extrabold text-xs transition-all flex items-center space-x-2 shadow-glow-emerald active:scale-95"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Review {latestResult.name}</span>
                            </button>
                            <button
                              onClick={() => startExam('full', undefined, latestResult.id)}
                              className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-extrabold text-xs transition-all flex items-center space-x-1.5 active:scale-95 shadow-sm"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Retake</span>
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <button
                        onClick={() => startExam('full', undefined, 'pt1')}
                        className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white dark:text-slate-950 font-extrabold text-xs transition-all flex items-center space-x-2.5 shadow-glow-emerald active:scale-95 flex-shrink-0"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Start Official Practice Test 1</span>
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* ─── SECTION 1: 8 OFFICIAL FULL-LENGTH PRACTICE EXAMS (44 Qs) ─── */}
              {(() => {
                const pt1Res = mockExamResults['pt1_full'] || mockExamResults['pt1'] || mockExamResults['full'];
                const pt2Res = mockExamResults['pt2_full'] || mockExamResults['pt2'];
                const pt3Res = mockExamResults['pt3_full'] || mockExamResults['pt3'];
                const pt4Res = mockExamResults['pt4_full'] || mockExamResults['pt4'];
                const pt5Res = mockExamResults['pt5_full'] || mockExamResults['pt5'];
                const pt6Res = mockExamResults['pt6_full'] || mockExamResults['pt6'];
                const pt7Res = mockExamResults['pt7_full'] || mockExamResults['pt7'];
                const pt8Res = mockExamResults['pt8_full'] || mockExamResults['pt8'];
                const pt9Res = mockExamResults['pt9_full'] || mockExamResults['pt9'];
                const pt10Res = mockExamResults['pt10_full'] || mockExamResults['pt10'];
                const pt11Res = mockExamResults['pt11_full'] || mockExamResults['pt11'];

                const tests = [
                  {
                    id: 'pt1',
                    title: 'Official Practice Test 1 (Full Exam)',
                    source: 'College Board Practice Test 1',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module official exam simulation featuring authentic 35-minute module pacing, Desmos calculator, and 200–800 scoring.',
                    result: pt1Res,
                  },
                  {
                    id: 'pt2',
                    title: 'Official Practice Test 2 (Full Exam)',
                    source: 'Official Mock (BK-5)',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module official exam simulation from official practice set with exponential functions, geometry solids, and algebra models.',
                    result: pt2Res,
                  },
                  {
                    id: 'pt3',
                    title: 'Official Practice Test 3 (Full Exam)',
                    source: 'Official Mock (BK-6)',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module official exam simulation from official practice set with similar triangles, quadratic dive models, and unit rates.',
                    result: pt3Res,
                  },
                  {
                    id: 'pt4',
                    title: 'Official Practice Test 4 (Full Exam)',
                    source: 'Official Mock (BK-7)',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module official exam simulation with scatterplots, cubic polynomials, dot plots, circle tangents, and rational expressions.',
                    result: pt4Res,
                  },
                  {
                    id: 'pt5',
                    title: 'Official Practice Test 5 (Full Exam)',
                    source: 'Official Mock (Test 4 Math)',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module official exam simulation with parabola equations, linear systems, inequality graphs, and circle geometry.',
                    result: pt5Res,
                  },
                  {
                    id: 'pt6',
                    title: 'Official Practice Test 6 (Full Exam)',
                    source: 'College Board Practice Test 4',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module official exam simulation featuring authentic tablet depreciation models, projectile motion graphs, and scatterplots.',
                    result: pt6Res,
                  },
                  {
                    id: 'pt7',
                    title: 'Official Practice Test 7 (Full Exam)',
                    source: 'Official Mock (Mock 1)',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module official exam simulation with right triangle trigonometry, capacitor dot plots, and polynomial systems.',
                    result: pt7Res,
                  },
                  {
                    id: 'pt8',
                    title: 'Official Practice Test 8 (Full Exam)',
                    source: 'Official Mock (Turbo Test)',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module official exam simulation with orbital periods dot plots, linear systems, and geometric congruence proofs.',
                    result: pt8Res,
                  },
                  {
                    id: 'pt9',
                    title: 'Official Practice Test 9 (Full Exam)',
                    source: 'Official Mock (BK-Practise-Test-6)',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module official exam simulation featuring circle equations, quadratic models, system of inequalities, and solid geometry.',
                    result: pt9Res,
                  },
                  {
                    id: 'pt10',
                    title: 'Official Practice Test 10 (Full Exam)',
                    source: 'Official Mock (Mock Turbo 1)',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module authentic December Math Mock Turbo 1 with absolute value systems, polynomial factorization, and right-triangle trigonometry.',
                    result: pt10Res,
                  },
                  {
                    id: 'pt11',
                    title: 'Official Practice Test 11 (Full Exam)',
                    source: 'Official Mock (SAT Turbo Prep Test 1)',
                    questions: 44,
                    duration: '70 Min • 2 Modules',
                    description: 'Full 2-module authentic SAT Turbo Prep Test 1 with pyramid geometry, exponential growth models, and statistical margin of error analysis.',
                    result: pt11Res,
                  },
                ];

                return (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                          Official Full-Length Practice Exams
                        </h3>
                        <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                          11 Full Mocks Available
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Complete 44-question two-module Digital SAT Math mock simulations with authentic Bluebook intermission and scoring breakdown.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tests.map((t) => (
                        <div
                          key={t.id}
                          className={`p-5 rounded-3xl bg-white dark:bg-[#0c1424] border ${
                            t.result ? 'border-emerald-500/60 ring-1 ring-emerald-500/20' : 'border-emerald-500/30 hover:border-emerald-500'
                          } flex flex-col justify-between shadow-sm transition-all group`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800/60">
                                  {t.source}
                                </span>
                                {t.result && (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 flex items-center space-x-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>Finished</span>
                                  </span>
                                )}
                              </div>
                              {t.result ? (
                                <span className="text-[11px] font-mono font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                                  {t.result.score} / 800
                                </span>
                              ) : (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Interactive</span>
                              )}
                            </div>

                            <div>
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-emerald-500 transition-colors">
                                {t.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                                <span>{t.duration}</span>
                                <span>•</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.questions} Questions</span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                {t.description}
                              </p>
                            </div>

                            {/* Finished Exam Results Box */}
                            {t.result && (
                              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex flex-col space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-slate-600 dark:text-slate-400">Overall Result:</span>
                                  <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 text-sm">
                                    {t.result.score} / 800
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-emerald-200/50 dark:border-emerald-800/40">
                                  <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl p-2 text-center border border-emerald-100 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">1st Module</span>
                                    <span className="text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
                                      {t.result.module1Correct} / 22
                                    </span>
                                  </div>
                                  <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl p-2 text-center border border-emerald-100 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">2nd Module</span>
                                    <span className="text-xs font-mono font-extrabold text-teal-700 dark:text-teal-300">
                                      {t.result.module2Correct} / 22
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                            {t.result ? (
                              <div className="grid grid-cols-2 gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => reviewExam('full', t.id)}
                                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white dark:text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Review</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => startExam('full', undefined, t.id)}
                                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  <span>Retake</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startExam('full', undefined, t.id)}
                                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white dark:text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                              >
                                <PlayCircle className="w-4 h-4" />
                                <span>Launch Full Exam →</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ─── SECTION 2: TARGETED MODULE SIMULATORS & DIAGNOSTICS (22 Qs) ─── */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Targeted Module Simulators & Diagnostics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Timed 35-minute single module simulations for diagnostic benchmarking or high-difficulty 750+ mastery.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Module 1 Diagnostic Simulator */}
                  <div className={`p-5 rounded-3xl bg-white dark:bg-[#0c1424] border ${mockExamResults['module1'] ? 'border-cyan-500/60 ring-1 ring-cyan-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/60'} flex flex-col justify-between shadow-sm transition-all group`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase text-cyan-700 bg-cyan-50 border border-cyan-200 dark:text-cyan-400 dark:bg-cyan-950/50 dark:border-cyan-800/60">
                            Module 1 Diagnostic
                          </span>
                          {mockExamResults['module1'] && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                              <span>Finished</span>
                            </span>
                          )}
                        </div>
                        {mockExamResults['module1'] ? (
                          <span className="text-[11px] font-mono font-extrabold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-200 dark:border-cyan-800/60">
                            {mockExamResults['module1'].score} / 800
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">35 Min</span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-emerald-500 transition-colors">
                          Standard Section 2 Math Module
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                          <span>35 Min • Module 1</span>
                          <span>•</span>
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">22 Questions</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                          Standard Digital SAT Math module covering easy, medium, and hard benchmark questions across all four domains.
                        </p>
                      </div>

                      {mockExamResults['module1'] && (
                        <div className="p-3 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/80 dark:border-cyan-800/50 flex flex-col space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-600 dark:text-slate-400">Overall Result:</span>
                            <span className="font-mono font-black text-cyan-700 dark:text-cyan-400">
                              {mockExamResults['module1'].score} / 800
                            </span>
                          </div>
                          <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl p-2 text-center border border-cyan-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">1st Module Result</span>
                            <span className="text-xs font-mono font-extrabold text-cyan-700 dark:text-cyan-300">
                              {mockExamResults['module1'].correctCount} / 22 Correct
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                      {mockExamResults['module1'] ? (
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => reviewExam('module1')}
                            className="py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => startExam('module1')}
                            className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Retake</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startExam('module1')}
                          className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-extrabold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Start Module 1 (22 Qs) →</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Adaptive Module 2 Hard 750+ Track */}
                  <div className={`p-5 rounded-3xl bg-white dark:bg-[#0c1424] border ${mockExamResults['module2'] ? 'border-rose-500/60 ring-1 ring-rose-500/20' : 'border-rose-300 dark:border-rose-500/40 hover:border-rose-500'} flex flex-col justify-between shadow-sm transition-all group`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase text-rose-700 bg-rose-50 border border-rose-200 dark:text-rose-400 dark:bg-rose-950/50 dark:border-rose-800/60">
                            Hard Module 2 Track
                          </span>
                          {mockExamResults['module2'] && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                              <span>Finished</span>
                            </span>
                          )}
                        </div>
                        {mockExamResults['module2'] ? (
                          <span className="text-[11px] font-mono font-extrabold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800/60">
                            {mockExamResults['module2'].score} / 800
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-500 font-mono font-bold">750+ Target</span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-rose-500 transition-colors">
                          Adaptive Module 2 (Hard Route)
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                          <span>35 Min • Module 2</span>
                          <span>•</span>
                          <span className="text-rose-600 dark:text-rose-400 font-bold">22 Hard Questions</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                          The high-difficulty module unlocked when scoring 16+ on Module 1. Prepares students for highest-tier 750-800 scores.
                        </p>
                      </div>

                      {mockExamResults['module2'] && (
                        <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/50 flex flex-col space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-600 dark:text-slate-400">Score Result:</span>
                            <span className="font-mono font-black text-rose-700 dark:text-rose-400">
                              {mockExamResults['module2'].score} / 800
                            </span>
                          </div>
                          <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl p-2 text-center border border-rose-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">2nd Module Result</span>
                            <span className="text-xs font-mono font-extrabold text-rose-700 dark:text-rose-300">
                              {mockExamResults['module2'].correctCount} / 22 Correct
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                      {mockExamResults['module2'] ? (
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => reviewExam('module2')}
                            className="py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => startExam('module2')}
                            className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Retake</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startExam('module2')}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Start Hard Module 2 (22 Qs) →</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 9: VOCAB FLASHCARDS & TERMINOLOGY ─────────────────── */}
          {activeTab === 'vocab' && (
            <VocabTerminologyView />
          )}

          {/* ─── TAB 10: SAVED & MISTAKES ───────────────────────────────── */}
          {activeTab === 'saved' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Saved Questions & Mistake Log</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review your bookmarked problems and practice questions you missed.</p>
                </div>

                {/* Subtab Switcher */}
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSavedSubtab('bookmarks')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      savedSubtab === 'bookmarks'
                        ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Bookmarks ({bookmarkedQuestions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSavedSubtab('mistakes')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      savedSubtab === 'mistakes'
                        ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Mistake Log ({mistakeQuestions.length})
                  </button>
                </div>
              </div>

              {/* Subtab 1: Bookmarks */}
              {savedSubtab === 'bookmarks' && (
                <div>
                  {bookmarkedQuestions.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-emerald-500/30 dark:border-emerald-500/40 text-center space-y-3 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                        🔖
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">No Bookmarked Questions Yet</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        While practicing in the Bluebook Practice Room or browsing the Question Bank, toggle "Mark for Review" to save items here for targeted revision.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('question_bank')}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white dark:from-emerald-500 dark:to-teal-500 dark:text-slate-950 font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
                      >
                        Explore Question Bank →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Showing {bookmarkedQuestions.length} saved item{bookmarkedQuestions.length > 1 ? 's' : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setPracticeSession({
                              questions: bookmarkedQuestions,
                              topicName: 'Saved Bookmarks Practice',
                              initialIndex: 0,
                            });
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-sm transition-all"
                        >
                          Practice All Bookmarks ({bookmarkedQuestions.length}) →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {bookmarkedQuestions.map((q) => (
                          <div
                            key={q.id}
                            className="p-4 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-emerald-500/60 transition-colors"
                          >
                            <div className="space-y-1.5 flex-1 pr-4">
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1 text-[11px] font-mono">
                                <span className="px-2 py-0.5 rounded-md font-bold uppercase bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/30">
                                  {q.domain}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 font-medium">
                                  {q.topic}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {q.difficulty}
                                </span>
                                <span className="text-slate-400">ID: {q.id.toUpperCase()}</span>
                              </div>
                              <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 font-medium">
                                {q.question}
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setPracticeSession({
                                    questions: [q],
                                    topicName: `Saved: ${q.topic}`,
                                    initialIndex: 0,
                                  });
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
                              >
                                Practice →
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleBookmark(q.id)}
                                className="p-1.5 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                                title="Remove bookmark"
                              >
                                <Bookmark className="w-4 h-4 fill-current" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Subtab 2: Mistake Log */}
              {savedSubtab === 'mistakes' && (
                <div>
                  {mistakeQuestions.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-emerald-500/30 dark:border-emerald-500/40 text-center space-y-3 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-xl">
                        🎯
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Zero Logged Mistakes</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Any question you get wrong during Bluebook practice sessions will automatically appear here for targeted review and remediation.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('question_bank')}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white dark:from-emerald-500 dark:to-teal-500 dark:text-slate-950 font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
                      >
                        Start Practicing Now →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {mistakeQuestions.length} missed question{mistakeQuestions.length > 1 ? 's' : ''} to remediate
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setPracticeSession({
                              questions: mistakeQuestions,
                              topicName: 'Mistakes Remediation Session',
                              initialIndex: 0,
                            });
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs shadow-sm transition-all"
                        >
                          Retry All Missed Questions ({mistakeQuestions.length}) →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {mistakeQuestions.map((q) => {
                          const att = progressState[q.id];
                          return (
                            <div
                              key={q.id}
                              className="p-4 rounded-2xl bg-white dark:bg-[#0c1424] border border-rose-300 dark:border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-rose-500/60 transition-colors"
                            >
                              <div className="space-y-1.5 flex-1 pr-4">
                                <div className="flex items-center space-x-2 flex-wrap gap-y-1 text-[11px] font-mono">
                                  <span className="px-2 py-0.5 rounded-md font-bold uppercase bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-500/30">
                                    Missed
                                  </span>
                                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                                    {q.domain} • {q.topic}
                                  </span>
                                  <span className="text-slate-400">ID: {q.id.toUpperCase()}</span>
                                </div>
                                <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 font-medium">
                                  {q.question}
                                </p>
                                <div className="text-[11px] font-mono flex items-center space-x-3">
                                  <span className="text-rose-600 dark:text-rose-400 font-bold">Your answer: {att?.selectedAnswer || 'N/A'}</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Correct key: {q.correctAnswer}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPracticeSession({
                                      questions: [q],
                                      topicName: `Remediate: ${q.topic}`,
                                      initialIndex: 0,
                                    });
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all"
                                >
                                  Retry Now →
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ─── TAB 11: ANALYTICS ─────────────────────────────────────── */}
          {activeTab === 'analytics' && (
            <AnalyticsDashboardView
              onStartPractice={(questions, topicName) => {
                setPracticeSession({
                  questions,
                  topicName,
                  initialIndex: 0,
                });
              }}
            />
          )}

          {/* ─── TAB 12: BOOKS & CURRICULUM PDF VIEWER ──────────────────── */}
          {activeTab === 'books' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">SAT Math Digital Library</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Official textbooks, College Board question banks, and masterclass prep manuals.</p>
                </div>
                <span className="text-xs font-mono text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60 px-3 py-1.5 rounded-full">
                  {BOOKS_LIBRARY.length} Textbooks Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {BOOKS_LIBRARY.map((book) => {
                  const encodedUrl = encodeURI(book.fileUrl);
                  return (
                    <div
                      key={book.id}
                      className="bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-emerald-500/40 hover:border-emerald-400 dark:hover:border-emerald-500/60 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${
                            book.category === 'Practice'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800/60'
                              : book.category === 'Strategy'
                              ? 'text-teal-700 bg-teal-50 border-teal-200 dark:text-teal-400 dark:bg-teal-950/50 dark:border-teal-800/60'
                              : 'text-amber-800 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/50 dark:border-amber-800/60'
                          }`}>
                            {book.category}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{book.tag}</span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {book.title}
                          </h4>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">{book.author}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                            {book.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
                        {/* In-App Reading Button */}
                        <button
                          onClick={() => setSelectedBookModal(book)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-95"
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
                          className="w-full py-2 rounded-xl bg-white dark:bg-slate-950 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-950/40 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{selectedBookModal.title}</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono">Author: {selectedBookModal.author}</p>
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
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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

      {/* 5-Step Question Rush Setup Modal */}
      <QuestionRushModal
        isOpen={isRushModalOpen}
        onClose={() => setIsRushModalOpen(false)}
        answeredQuestionIds={new Set(Object.keys(progressState))}
        onStartRush={(config, rushQuestions) => {
          setIsRushModalOpen(false);
          setRushSession({
            config,
            questions: rushQuestions,
          });
        }}
      />

      {/* Full Digital SAT Exam Simulator Modal */}
      <ExamSimulatorModal
        isOpen={Boolean(activeExamSimulator)}
        onClose={() => setActiveExamSimulator(null)}
        exam={activeExamSimulator}
      />

    </div>
  );
};
