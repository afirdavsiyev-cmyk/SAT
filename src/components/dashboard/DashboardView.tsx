import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudySidebar, StudySidebarTab } from '../study/StudySidebar';
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
  Bell
} from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';
import { mockQuestions } from '../../data/mockData';
import { BOOKS_LIBRARY, BookItem } from '../../data/booksData';
import { ScoreUpAITutorView } from '../study/ScoreUpAITutorView';

export const DashboardView: React.FC = () => {
  const { userProgress, studyPlan, setCurrentView, questions } = useApp();
  const [activeTab, setActiveTab] = useState<StudySidebarTab>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [selectedBookModal, setSelectedBookModal] = useState<BookItem | null>(null);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden select-none">
      
      {/* Minimal Study Hub Header Bar */}
      <header className="h-14 bg-slate-950/90 border-b border-white/[0.08] backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0">
        
        {/* Left: Sidebar Toggle + Title & Track Badge */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeft className="w-4 h-4 text-emerald-400" /> : <PanelLeftClose className="w-4 h-4 text-slate-300" />}
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-sm tracking-tight hidden sm:inline">SAT Study Hub</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
              Digital SAT 2026
            </span>
          </div>
        </div>

        {/* Right: Quick Stats, Notifications & Exit to Overview Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Streak Indicator Pill */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-950/50 border border-orange-800/40 text-xs font-bold text-orange-300">
            <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            <span>{userProgress.streakDays}d Streak</span>
          </div>

          {/* User Score Badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-xs font-mono font-bold text-emerald-400">
            <span>Score: {userProgress.mathScore}/800</span>
          </div>

          {/* Exit to Overview Button */}
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-bold text-slate-200 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
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
              
              {/* Top Banner / Welcome Card */}
              <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/80 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
                <div className="space-y-2 max-w-xl z-10">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800/40">
                    <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                    <span>{userProgress.streakDays}-Day Study Streak Active</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Welcome to your Study Hub
                  </h1>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Your target exam is <span className="text-emerald-400 font-semibold">{studyPlan?.targetDate || 'October 2026'}</span>. You are on track to achieve your goal of <span className="text-emerald-400 font-semibold">{studyPlan?.targetScore || 800} / 800</span>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto">
                  <button
                    onClick={() => setCurrentView('exam')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
                  >
                    <PlayCircle className="w-5 h-5 fill-slate-950 stroke-emerald-400" />
                    <span>Launch Bluebook Test</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('planner')}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all active:scale-95"
                  >
                    View Study Roadmap
                  </button>
                </div>
              </div>

              {/* Main Stats Grid (Readiness Meter + Scores + XP) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Readiness Dial Card (Col 4) */}
                <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between items-center text-center backdrop-blur-xl">
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
                      <div className="text-xs text-emerald-400 mt-1 font-semibold">{userProgress.accuracyRate}% Math Accuracy</div>
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

                  {/* Recommended Today's Practice Drills */}
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
                        onClick={() => setActiveTab('ai_tutor')}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-white text-xs">ScoreUP AI Tutor Session</span>
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
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Adaptive Study Roadmap</h2>
                  <p className="text-xs text-slate-400 mt-1">Countdown to {studyPlan?.targetDate || 'October 2026'} Exam Date</p>
                </div>
                <button
                  onClick={() => setCurrentView('onboarding')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Reconfigure Roadmap Wizard
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Current Daily Goal</span>
                  <div className="text-2xl font-bold text-white font-mono">{studyPlan?.dailyTimeMinutes || 45} mins / day</div>
                </div>
                <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Target Score</span>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">{studyPlan?.targetScore || 800} / 800</div>
                </div>
                <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Roadmap Weeks</span>
                  <div className="text-2xl font-bold text-teal-400 font-mono">{studyPlan?.weeklyRoadmap?.length || 4} Weeks Active</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Milestone Schedule</h3>
                {studyPlan?.weeklyRoadmap?.map((week) => (
                  <div
                    key={week.week}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                        W{week.week}
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{week.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Focus: {week.focus} • {week.estimatedHrs} hrs expected</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      week.completed ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}>
                      {week.completed ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TAB 3: MASTERCLASS - MATH & DESMOS ──────────────────────── */}
          {activeTab === 'masterclass_math' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-bold border border-emerald-700/50">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>DESMOS MASTERCLASS</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">Digital SAT Desmos Speed Mastery</h2>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Learn how to solve 60%+ of Digital SAT Math questions in seconds using regression, vertex finders, and system intersections directly in Desmos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center space-x-2">
                    <span>1. Instant System Intersections</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Type both linear or quadratic equations directly into Desmos. Tap the intersection point $(x, y)$ to retrieve exact solution coordinates without manual elimination.
                  </p>
                  <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300">
                    y = 2x + 5<br />
                    y = -x + 11 → Intersect at (2, 9)
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center space-x-2">
                    <span>2. Linear & Quadratic Regression</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When given a data table, type <code className="text-teal-300">y1 ~ m x1 + b</code> or <code className="text-teal-300">y1 ~ a x1^2 + b x1 + c</code> for instant curve fitting and parameter extraction.
                  </p>
                  <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-teal-300">
                    y1 ~ m x1 + b → slope m and y-intercept b calculated
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Watch Free Desmos Video Walkthroughs on YouTube</h4>
                  <p className="text-xs text-slate-400">ScoreUp Academy official SAT preparation channel.</p>
                </div>
                <a
                  href="https://www.youtube.com/@ScoreUp_Academy_SAT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <span>Open YouTube Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* ─── TAB 4: BOOKS & LIBRARY ─────────────────────────────────── */}
          {activeTab === 'books' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-900 border border-amber-500/30 space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-900/60 text-amber-300 text-xs font-bold border border-amber-700/50">
                  <Library className="w-3.5 h-3.5" />
                  <span>OFFICIAL DIGITAL SAT MATH LIBRARY</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">Recommended SAT Math Prep Books & PDFs</h2>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Access full Digital SAT Math guidebooks, problem sets, and analytical handbooks. Read directly inside our frosted glass PDF reader or download.
                </p>
              </div>

              {/* Book Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BOOKS_LIBRARY.map((book) => {
                  const encodedUrl = encodeURI(book.fileUrl);

                  return (
                    <div
                      key={book.id}
                      className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-2xl bg-amber-950/80 text-amber-400 border border-amber-800/50 group-hover:scale-105 transition-transform">
                            <BookMarked className="w-6 h-6" />
                          </div>
                          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                            {book.tag}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">{book.title}</h3>
                        <p className="text-xs text-amber-400 font-mono font-semibold">Author: {book.author}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {book.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 space-y-2">
                        {/* Read in App Button */}
                        <button
                          onClick={() => setSelectedBookModal(book)}
                          className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(245,158,11,0.25)] active:scale-[0.98]"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Read in App</span>
                        </button>

                        {/* Download / Open New Tab Button */}
                        <a
                          href={encodedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="w-full py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download / New Tab</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── TAB 5: QUESTION BANK ───────────────────────────────────── */}
          {activeTab === 'question_bank' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Digital SAT Question Bank</h2>
                  <p className="text-xs text-slate-400 mt-1">Browse and filter verified practice questions by domain</p>
                </div>
                
                {/* Domain Filter */}
                <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
                  {['all', 'Algebra', 'Advanced Math', 'Problem-Solving & Data Analysis', 'Geometry & Trigonometry'].map((dom) => (
                    <button
                      key={dom}
                      onClick={() => setSelectedDomainFilter(dom)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        selectedDomainFilter === dom
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {dom === 'all' ? 'All Domains' : dom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question List Cards */}
              <div className="space-y-4">
                {questions
                  .filter((q) => selectedDomainFilter === 'all' || q.domain === selectedDomainFilter)
                  .map((q) => (
                    <div key={q.id} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                            #{q.number}
                          </span>
                          <span className="text-xs font-bold text-white">{q.domain}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {q.difficulty}
                          </span>
                        </div>
                        <button
                          onClick={() => setCurrentView('exam')}
                          className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
                        >
                          Solve in Bluebook
                        </button>
                      </div>
                      <div className="text-xs text-slate-200 leading-relaxed">
                        <MathRenderer content={q.prompt} inline />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ─── TAB 6: QUESTION RUSH ───────────────────────────────────── */}
          {activeTab === 'question_rush' && (
            <div className="max-w-4xl mx-auto text-center space-y-6 py-8">
              <div className="w-16 h-16 rounded-3xl bg-yellow-950 border border-yellow-500/40 text-yellow-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <Zap className="w-8 h-8 fill-yellow-400" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-white">Question Rush (Speed Drill)</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
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
          )}

          {/* ─── TAB 7: CHALLENGE 750+ ─────────────────────────────────── */}
          {activeTab === 'challenge' && (
            <div className="max-w-4xl mx-auto text-center space-y-6 py-8">
              <div className="w-16 h-16 rounded-3xl bg-rose-950 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-white">750+ Challenge Question Vault</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
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
          )}

          {/* ─── TAB 8: FULL-LENGTH TESTS ───────────────────────────────── */}
          {activeTab === 'tests' && (
            <div className="max-w-4xl mx-auto space-y-6 py-4">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <h2 className="text-2xl font-extrabold text-white">Official Bluebook Exam Simulation</h2>
                  <p className="text-xs text-slate-300 max-w-md">
                    Section 2 Math Practice Exam with official 35-minute timer, embedded Desmos calculator, reference sheet, and scratchpad.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('exam')}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-sm hover:bg-emerald-400 transition-all flex items-center space-x-2 flex-shrink-0 shadow-glow-emerald"
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
              <h2 className="text-2xl font-extrabold text-white">Digital SAT Key Terms & Flashcards</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { term: 'Complementary Angles', def: 'Two angles whose measures sum to 90 degrees. Key identity: sin(A) = cos(90° - A) = cos(B).' },
                  { term: 'Vertex Form', def: 'f(x) = a(x - h)² + k, where (h, k) represents the maximum or minimum vertex coordinate.' },
                  { term: 'Infinitely Many Solutions', def: 'Occurs when two linear equations are linearly dependent (coefficients and constants are in identical ratios).' },
                  { term: 'Circle Standard Equation', def: '(x - h)² + (y - k)² = r², where (h, k) is the center and r is the radius.' }
                ].map((c, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <span className="font-extrabold text-emerald-400 text-sm">{c.term}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{c.def}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TAB 10: SAVED & MISTAKES ───────────────────────────────── */}
          {activeTab === 'saved' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-extrabold text-white">Saved Questions & Mistake Log</h2>
              <p className="text-xs text-slate-400">Review marked items from your previous Bluebook exam sessions.</p>
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-400">
                No bookmarked mistakes currently. Complete an exam module to automatically track missed items!
              </div>
            </div>
          )}

          {/* ─── TAB 11: ANALYTICS ─────────────────────────────────────── */}
          {activeTab === 'analytics' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <h2 className="text-2xl font-extrabold text-white">Performance Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Average Accuracy</span>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono">{userProgress.accuracyRate}%</div>
                </div>
                <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Total Solved</span>
                  <div className="text-3xl font-extrabold text-teal-400 font-mono">{userProgress.totalQuestionsSolved}</div>
                </div>
                <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Estimated Math</span>
                  <div className="text-3xl font-extrabold text-white font-mono">{userProgress.mathScore} / 800</div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Frosted Glass In-App PDF Reader Modal */}
      {selectedBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/50">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">{selectedBookModal.title}</h3>
                  <p className="text-xs text-amber-400 font-mono">Author: {selectedBookModal.author}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={encodeURI(selectedBookModal.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  onClick={() => setSelectedBookModal(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Close PDF Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body iframe */}
            <div className="flex-1 p-2 sm:p-4 bg-slate-950">
              <iframe
                src={encodeURI(selectedBookModal.fileUrl)}
                title={selectedBookModal.title}
                className="w-full h-[78vh] rounded-2xl border border-slate-800 bg-slate-900 shadow-inner"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
