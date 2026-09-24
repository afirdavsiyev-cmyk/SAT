import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Target,
  Clock,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Zap,
  TrendingUp,
  Layers,
  ChevronRight,
  Brain,
  Award,
  Flame,
  CheckSquare,
  BarChart3,
  Timer,
  RefreshCw,
  Sliders,
  Eye,
  Coffee,
  Check,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CalendarDays,
  ShieldCheck,
} from 'lucide-react';
import {
  SATDomain,
  SubtopicSkill,
  SkillStatus,
  SprintBlockItem,
  SpacedRepetitionRecord,
} from '../../types/planner';
import {
  getStoredAdaptiveData,
  saveStoredAdaptiveData,
  getRankedPrioritySkills,
} from '../../utils/adaptivePlannerEngine';
import {
  calculateDynamicPacingMetrics,
  generateMilestoneSchedule,
  resolveTargetDate,
} from '../../utils/dynamicPacingEngine';
import {
  getSpacedRepetitionQueue,
  getDueSpacedRepetitionQuestions,
  getGraduatedSpacedRepetitionQuestions,
  recordSpacedRepetitionAttempt,
  formatDateISO,
} from '../../utils/spacedRepetitionEngine';
import { generateDailySprintQueue } from '../../utils/dailySprintGenerator';
import { ALL_QUESTIONS } from '../../data/questions';

interface DailyPlanRoadmapViewProps {
  onStartDrill?: (params: {
    dayNumber?: number;
    dayLabel?: string;
    title: string;
    domain?: string;
    skillFocus?: string;
    questionCount: number;
    easyCount?: number;
    mediumCount?: number;
    hardCount?: number;
    targetMinutes?: number;
    advice?: string;
    type?: string;
    customQuestions?: any[];
  }) => void;
  onReconfigureWizard?: () => void;
}

export const DailyPlanRoadmapView: React.FC<DailyPlanRoadmapViewProps> = ({
  onStartDrill,
  onReconfigureWizard,
}) => {
  const { setCurrentView } = useApp();

  // Load adaptive planner data from engine
  const [plannerData, setPlannerData] = useState(() => getStoredAdaptiveData());
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<SATDomain | 'all'>('all');
  const [activeTabSection, setActiveTabSection] = useState<'sprint' | 'spaced_repetition' | 'milestones' | 'skills'>('sprint');
  
  // Rest & Burnout Guard settings (e.g., weekly study days: default 5 days/week)
  const [activeDaysOfWeek, setActiveDaysOfWeek] = useState<string[]>(() => {
    return plannerData.profile?.daysPerWeek && plannerData.profile.daysPerWeek.length > 0
      ? plannerData.profile.daysPerWeek
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  });
  const [simulatedMissedSessions, setSimulatedMissedSessions] = useState<number>(1);
  const [isQuestionInspectorOpen, setIsQuestionInspectorOpen] = useState<boolean>(false);
  const [inspectingBlockType, setInspectingBlockType] = useState<'warmup' | 'core_focus' | 'speed_run' | 'all'>('all');

  // Spaced Repetition queue state
  const [spacedRepetitionList, setSpacedRepetitionList] = useState<SpacedRepetitionRecord[]>(() => getSpacedRepetitionQueue());

  useEffect(() => {
    const handleSrUpdate = () => {
      setSpacedRepetitionList(getSpacedRepetitionQueue());
    };
    window.addEventListener('scoreup_spaced_repetition_updated', handleSrUpdate);
    return () => window.removeEventListener('scoreup_spaced_repetition_updated', handleSrUpdate);
  }, []);

  const profile = plannerData.profile;
  const skills = plannerData.skills;

  // Compute live dynamic pacing metrics
  const pacingMetrics = useMemo(() => {
    return calculateDynamicPacingMetrics({
      targetScore: profile.targetScore || 780,
      baselineScore: profile.baselineScore || 720,
      targetExamDate: profile.targetExamDate || 'October 2026',
      daysPerWeek: activeDaysOfWeek,
      missedDaysOverride: simulatedMissedSessions,
    });
  }, [profile, activeDaysOfWeek, simulatedMissedSessions]);

  // Auto-generate the 3-block Daily Sprint Queue
  const dailySprint = useMemo(() => {
    return generateDailySprintQueue({
      skills,
      pacing: pacingMetrics,
    });
  }, [skills, pacingMetrics]);

  // Generate milestone exam schedule (alternating weekends + review days)
  const milestoneSchedule = useMemo(() => {
    return generateMilestoneSchedule(profile.targetExamDate || 'October 2026');
  }, [profile.targetExamDate]);

  // Ranked priority skills
  const rankedPriority = useMemo(() => {
    return getRankedPrioritySkills(skills, profile.targetScore, profile.baselineScore);
  }, [skills, profile]);

  // Spaced repetition due and graduated items
  const dueItems = useMemo(() => {
    return getDueSpacedRepetitionQuestions();
  }, [spacedRepetitionList]);

  const graduatedItems = useMemo(() => {
    return getGraduatedSpacedRepetitionQuestions();
  }, [spacedRepetitionList]);

  // Handle launching a specific block into Practice Room
  const handleLaunchBlock = (block: SprintBlockItem) => {
    if (onStartDrill) {
      onStartDrill({
        dayNumber: 1,
        dayLabel: `Sprint: ${block.title}`,
        title: block.title,
        domain: block.subtopicName,
        skillFocus: block.advice,
        questionCount: block.questionCount,
        targetMinutes: block.estimatedMinutes,
        advice: block.advice,
        type: block.type === 'speed_run' ? 'timed_drill' : 'drill',
        customQuestions: block.questions,
      });
    } else {
      setCurrentView('exam');
    }
  };

  // Handle launching the complete daily sprint (all 3 blocks combined)
  const handleLaunchFullSprint = () => {
    const allQuestions = [
      ...dailySprint.warmup.questions,
      ...dailySprint.coreFocus.questions,
      ...dailySprint.speedRun.questions,
    ];

    if (onStartDrill) {
      onStartDrill({
        dayNumber: 1,
        dayLabel: "Today's Complete Daily Sprint",
        title: `Full Daily Sprint: Target ${profile.targetScore}+`,
        domain: dailySprint.coreFocus.subtopicName,
        skillFocus: 'Warmup (3) + Core Focus (12) + Speed Run (5)',
        questionCount: allQuestions.length,
        targetMinutes: dailySprint.totalEstimatedMinutes,
        advice: 'Paced daily sprint designed to bridge your score gap with zero decision fatigue.',
        type: 'drill',
        customQuestions: allQuestions,
      });
    } else {
      setCurrentView('exam');
    }
  };

  // Launch a milestone full-length mock exam
  const handleLaunchMilestoneExam = (item: any) => {
    if (onStartDrill) {
      onStartDrill({
        dayNumber: 99,
        dayLabel: item.title,
        title: item.title,
        domain: 'Full SAT Simulation',
        questionCount: 44,
        targetMinutes: 70,
        type: 'mock',
        advice: 'Full timed 44-question Digital SAT Math exam.',
      });
    } else {
      setCurrentView('exam');
    }
  };

  // Toggle study days for Burnout Guard
  const toggleStudyDay = (day: string) => {
    const updated = activeDaysOfWeek.includes(day)
      ? activeDaysOfWeek.filter((d) => d !== day)
      : [...activeDaysOfWeek, day];
    
    // Ensure at least 3 days are selected
    if (updated.length >= 3) {
      setActiveDaysOfWeek(updated);
      const updatedProfile = { ...profile, daysPerWeek: updated };
      saveStoredAdaptiveData({ ...plannerData, profile: updatedProfile });
    }
  };

  // Preset selection helper
  const applyDaysPreset = (count: number) => {
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    if (count === 4) days = ['Mon', 'Tue', 'Thu', 'Fri'];
    if (count === 6) days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (count === 7) days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    setActiveDaysOfWeek(days);
    const updatedProfile = { ...profile, daysPerWeek: days };
    saveStoredAdaptiveData({ ...plannerData, profile: updatedProfile });
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status: SkillStatus, mastery: number) => {
    switch (status) {
      case 'Critical':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 dark:text-rose-300 dark:bg-rose-950/60 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>CRITICAL ({mastery}%)</span>
          </span>
        );
      case 'Weak':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 dark:text-amber-300 dark:bg-amber-950/60 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>WEAK ({mastery}%)</span>
          </span>
        );
      case 'Developing':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-yellow-800 bg-yellow-50 border border-yellow-200 dark:text-yellow-300 dark:bg-yellow-950/60 dark:border-yellow-800">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <span>DEVELOPING ({mastery}%)</span>
          </span>
        );
      case 'Strong':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 dark:text-sky-300 dark:bg-sky-950/60 dark:border-sky-800">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>STRONG ({mastery}%)</span>
          </span>
        );
      case 'Mastered':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>MASTERED ({mastery}%)</span>
          </span>
        );
    }
  };

  const domains: SATDomain[] = ['Algebra', 'Advanced Math', 'Problem Solving', 'Geometry & Trig'];
  const filteredSkills = selectedDomainFilter === 'all'
    ? skills
    : skills.filter((s) => s.domain === selectedDomainFilter);

  // Inspector questions list
  const inspectorQuestions = useMemo(() => {
    if (inspectingBlockType === 'warmup') return dailySprint.warmup.questions;
    if (inspectingBlockType === 'core_focus') return dailySprint.coreFocus.questions;
    if (inspectingBlockType === 'speed_run') return dailySprint.speedRun.questions;
    return [
      ...dailySprint.warmup.questions,
      ...dailySprint.coreFocus.questions,
      ...dailySprint.speedRun.questions,
    ];
  }, [dailySprint, inspectingBlockType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* ─── 1. DYNAMIC GOAL PACING & DECISION FATIGUE ELIMINATOR BANNER ─── */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute right-24 -bottom-16 w-80 h-80 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-mono font-bold tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>DECISION FATIGUE ELIMINATOR • DYNAMIC PACING ACTIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              What Exact Questions Do I Need to Solve Today?
            </h1>

            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Targeting <strong className="text-white font-mono font-black">{profile.targetScore}+ / 800</strong> by{' '}
              <span className="font-bold underline decoration-amber-400 decoration-2">{profile.targetExamDate}</span>.
              Based on your countdown and {activeDaysOfWeek.length}-day weekly pacing, your exact daily target is{' '}
              <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">
                {dailySprint.totalQuestions} questions ({dailySprint.totalEstimatedMinutes} mins)
              </span>.
            </p>

            {/* Live Dynamic Pacing Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-sm border border-white/10">
                <span className="text-[10px] text-emerald-200 font-mono uppercase block">Countdown</span>
                <span className="text-lg font-mono font-black text-white">{pacingMetrics.daysUntilExam} Days</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-sm border border-white/10">
                <span className="text-[10px] text-emerald-200 font-mono uppercase block">Effective Study Days</span>
                <span className="text-lg font-mono font-black text-white">{pacingMetrics.effectiveStudyDays} Days</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-sm border border-white/10">
                <span className="text-[10px] text-emerald-200 font-mono uppercase block">Score Gap</span>
                <span className="text-lg font-mono font-black text-amber-300">+{pacingMetrics.scoreGap} Pts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-sm border border-white/10">
                <span className="text-[10px] text-emerald-200 font-mono uppercase block">Required Velocity</span>
                <span className="text-lg font-mono font-black text-emerald-300">{pacingMetrics.dailyQuestionsRequired} Qs / {pacingMetrics.dailyHoursRequired}h</span>
              </div>
            </div>
          </div>

          {/* Primary 1-Click Launch Button & Wizard Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 w-full lg:w-auto flex-shrink-0">
            <button
              type="button"
              onClick={handleLaunchFullSprint}
              className="px-6 py-4 rounded-2xl bg-white text-slate-950 hover:bg-emerald-50 font-black text-sm shadow-xl shadow-black/20 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-2 group"
            >
              <PlayCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Launch Today's Sprint ({dailySprint.totalQuestions} Qs)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsQuestionInspectorOpen(!isQuestionInspectorOpen)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white transition-all flex items-center justify-center space-x-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-300" />
                <span>{isQuestionInspectorOpen ? 'Hide Question Tray' : 'Inspect Exact Qs'}</span>
              </button>

              <button
                type="button"
                onClick={onReconfigureWizard ? onReconfigureWizard : () => setCurrentView('onboarding')}
                className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white transition-all flex items-center justify-center"
                title="Reconfigure Target & Date"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── REST & BURNOUT GUARD NOTIFICATION (If today is a rest day) ─── */}
      {pacingMetrics.isRestDayToday && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/40 dark:border-amber-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wide">
                Rest & Burnout Guard Active: Scheduled Recovery Day
              </h3>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Students retain 30% more when taking structured rest days. You have 0 overdue backlogs—your workload is balanced.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleLaunchBlock(dailySprint.warmup)}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all whitespace-nowrap self-end sm:self-center"
          >
            Optional: 3-Q Warmup
          </button>
        </div>
      )}

      {/* ─── SUB-NAVIGATION TABS (Sprint, Spaced Repetition, Milestones, Skills) ─── */}
      <div className="flex items-center space-x-1 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTabSection('sprint')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTabSection === 'sprint'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Daily 3-Block Sprint Queue</span>
        </button>

        <button
          onClick={() => setActiveTabSection('spaced_repetition')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTabSection === 'spaced_repetition'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Automated Spaced Repetition</span>
          {dueItems.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] flex items-center justify-center">
              {dueItems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTabSection('milestones')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTabSection === 'milestones'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Milestone Full-Length Exams</span>
        </button>

        <button
          onClick={() => setActiveTabSection('skills')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTabSection === 'skills'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>18-Subtopic Skill Matrix</span>
        </button>
      </div>

      {/* ─── SECTION 1: AUTO-GENERATED 3-BLOCK DAILY SPRINT QUEUE ─────── */}
      {activeTabSection === 'sprint' && (
        <div className="space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  TODAY'S 3-STAGE QUEUE
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {dailySprint.totalQuestions} Questions • {dailySprint.totalEstimatedMinutes} Minutes Total
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                Auto-Assembled Daily Sprint
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsQuestionInspectorOpen(!isQuestionInspectorOpen)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isQuestionInspectorOpen ? 'Close Question View' : 'Inspect Exact Questions'}</span>
                {isQuestionInspectorOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* 3 AUTO-ASSEMBLED SPRINT BLOCKS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* ─── BLOCK 1: WARMUP (3 QUICK REVIEW QUESTIONS) ───────── */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800">
                    <RefreshCw className="w-3 h-3" />
                    <span>WARMUP</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {dailySprint.warmup.questionCount} Questions • ~{dailySprint.warmup.estimatedMinutes}m
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {dailySprint.warmup.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {dailySprint.warmup.advice}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Source:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{dailySprint.warmup.badgeLabel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Target Interval:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">3d • 7d • 14d Spaced Repetition</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setInspectingBlockType('warmup');
                    setIsQuestionInspectorOpen(true);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview 3 Qs</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchBlock(dailySprint.warmup)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Start Warmup</span>
                </button>
              </div>
            </div>

            {/* ─── BLOCK 2: CORE FOCUS (10–15 QUESTIONS ON LOWEST MASTERY) ─── */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border-2 border-emerald-500/50 dark:border-emerald-500/50 shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4 group relative">
              <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm">
                HIGHEST POINT YIELD
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                    <Target className="w-3 h-3 text-amber-600" />
                    <span>CORE FOCUS</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {dailySprint.coreFocus.questionCount} Questions • ~{dailySprint.coreFocus.estimatedMinutes}m
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {dailySprint.coreFocus.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {dailySprint.coreFocus.advice}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold">Deficit Focus:</span>
                    <span className="text-slate-600 dark:text-slate-400">{dailySprint.coreFocus.badgeLabel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold">Target Mastery Lift:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">+12% Mastery</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setInspectingBlockType('core_focus');
                    setIsQuestionInspectorOpen(true);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview {dailySprint.coreFocus.questionCount} Qs</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchBlock(dailySprint.coreFocus)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Start Core Focus</span>
                </button>
              </div>
            </div>

            {/* ─── BLOCK 3: SPEED RUN (5 TIMED QUESTIONS REPLICATING MODULE 2) ─── */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                    <Timer className="w-3 h-3 text-rose-500" />
                    <span>SPEED RUN</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {dailySprint.speedRun.questionCount} Questions • ~{dailySprint.speedRun.estimatedMinutes}m
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {dailySprint.speedRun.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {dailySprint.speedRun.advice}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Pacing Constraint:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">75s / Question</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Difficulty Mix:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">Hard Module 2 Adaptive</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setInspectingBlockType('speed_run');
                    setIsQuestionInspectorOpen(true);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview 5 Qs</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchBlock(dailySprint.speedRun)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-500/20 transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Start Speed Run</span>
                </button>
              </div>
            </div>

          </div>

          {/* ─── INTERACTIVE QUESTION INSPECTOR TRAY (Eliminates Decision Fatigue) ─── */}
          {isQuestionInspectorOpen && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Today's Exact Question Queue ({inspectorQuestions.length} Questions Ready)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pre-assembled based on your lowest mastery subtopic and spaced repetition intervals. Zero guesswork.
                  </p>
                </div>

                <div className="flex items-center space-x-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setInspectingBlockType('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${inspectingBlockType === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    All ({dailySprint.totalQuestions})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectingBlockType('warmup')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${inspectingBlockType === 'warmup' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    Warmup (3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectingBlockType('core_focus')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${inspectingBlockType === 'core_focus' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    Core Focus ({dailySprint.coreFocus.questionCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectingBlockType('speed_run')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${inspectingBlockType === 'speed_run' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    Speed Run (5)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {inspectorQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                          {q.domain}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        q.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                      {q.question || q.questionText}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <span>{q.topic || 'Algebraic Equations'}</span>
                      <span>ID: {q.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── REST & BURNOUT GUARD CONTROLS CARD ─────────────────────── */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Rest & Burnout Guard
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Set your weekly study days. If you miss a session, workload is automatically redistributed across remaining days so overdue tasks never pile up.
                  </p>
                </div>
              </div>

              {/* Weekly Preset Buttons */}
              <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => applyDaysPreset(5)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeDaysOfWeek.length === 5 ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  5 Days (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => applyDaysPreset(6)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeDaysOfWeek.length === 6 ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  6 Days (Intensive)
                </button>
                <button
                  type="button"
                  onClick={() => applyDaysPreset(4)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeDaysOfWeek.length === 4 ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  4 Days (Paced)
                </button>
              </div>
            </div>

            {/* Day Selector Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-mono text-slate-400 mr-2">Active Study Days:</span>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const isActive = activeDaysOfWeek.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleStudyDay(day)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Live Recalculation Alert */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">
                  <strong>Automatic Study Load Recalculation:</strong> {pacingMetrics.missedSessionsCount} missed session{pacingMetrics.missedSessionsCount > 1 ? 's' : ''} smoothly absorbed across remaining {pacingMetrics.effectiveStudyDays} study days (+{pacingMetrics.rebalancedDeltaPerDay} Qs/day). Zero crushing overdue backlog.
                </span>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setSimulatedMissedSessions((prev) => (prev > 0 ? 0 : 2))}
                  className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 underline hover:opacity-80"
                >
                  {simulatedMissedSessions > 0 ? 'Clear Missed Days' : 'Simulate Missed Day'}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ─── SECTION 2: AUTOMATED SPACED REPETITION FOR SAVED & MISTAKES ── */}
      {activeTabSection === 'spaced_repetition' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    EBBINGHAUS FORGETTING CURVE ENGINE
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Automated Spaced Repetition for Saved & Mistakes
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Every missed or saved question is automatically re-fed into your daily Warmup block after <strong>3 days</strong>, <strong>7 days</strong>, and <strong>14 days</strong>. Questions permanently graduate once answered correctly twice consecutively.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleLaunchBlock(dailySprint.warmup)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Review Due Now ({dueItems.length})</span>
                </button>
              </div>
            </div>

            {/* Spaced Repetition 3-Stage Pipeline Visualizer */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">STAGE 1</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">+3 Days</span>
                </div>
                <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
                  {spacedRepetitionList.filter((r) => r.stage === 1).length} Questions
                </div>
                <p className="text-[10px] text-slate-400">First memory consolidation check</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">STAGE 2</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">+7 Days</span>
                </div>
                <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
                  {spacedRepetitionList.filter((r) => r.stage === 2).length} Questions
                </div>
                <p className="text-[10px] text-slate-400">Medium-term retention verification</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">STAGE 3</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">+14 Days</span>
                </div>
                <div className="text-lg font-mono font-black text-slate-900 dark:text-white">
                  {spacedRepetitionList.filter((r) => r.stage === 3).length} Questions
                </div>
                <p className="text-[10px] text-slate-400">Long-term retrieval under exam clock</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-800 dark:text-emerald-400">GRADUATED</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">2/2 Correct</span>
                </div>
                <div className="text-lg font-mono font-black text-emerald-700 dark:text-emerald-300">
                  {graduatedItems.length} Mastered
                </div>
                <p className="text-[10px] text-emerald-800/70 dark:text-emerald-400/70">Cleared from mistake schedule</p>
              </div>
            </div>
          </div>

          {/* Spaced Repetition Items Due Today */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Due Today for Review ({dueItems.length})</span>
            </h3>

            {dueItems.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">All Mistakes Caught Up!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You have reviewed all due questions for today. Any newly missed questions during practice will automatically be queued here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dueItems.map((item) => {
                  const metaQ = ALL_QUESTIONS.find((q) => q.id === item.questionId);
                  return (
                    <div
                      key={item.questionId}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all space-y-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
                          Stage {item.stage} Review (+{item.stage === 1 ? '3' : item.stage === 2 ? '7' : '14'} Days)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Consecutive: {item.consecutiveCorrect}/2
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.subtopicName}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                          {metaQ?.question || metaQ?.questionText || `Question ID: ${item.questionId}`}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-mono text-slate-400">
                          Mistake: {item.mistakeReason ? item.mistakeReason.replace('_', ' ') : 'Calculation error'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (metaQ) {
                              handleLaunchBlock({
                                type: 'warmup',
                                title: `Spaced Review: ${item.subtopicName}`,
                                badgeLabel: `Stage ${item.stage}`,
                                subtopicName: item.subtopicName,
                                questionCount: 1,
                                estimatedMinutes: 2,
                                advice: 'Re-test this previously missed concept.',
                                completed: false,
                                questions: [metaQ],
                              });
                            }
                          }}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                        >
                          <span>Review Now</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── SECTION 3: MILESTONE & FULL-LENGTH TEST SCHEDULING ──────── */}
      {activeTabSection === 'milestones' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60">
                    ALTERNATING WEEKEND PROTOCOL
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Milestone & Full-Length Practice Exam Schedule
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                  Full 44-question timed exams are automatically blocked out on alternating weekends. The following day is reserved exclusively as a built-in <strong>Post-Test Error Review Day</strong> with zero new question volume.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentView('exam')}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-all active:scale-95 flex items-center space-x-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Launch 44-Q Full Mock Exam</span>
              </button>
            </div>

            {/* Milestone Timeline List */}
            <div className="space-y-3 pt-2">
              {milestoneSchedule.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    item.type === 'full_mock'
                      ? 'bg-slate-50/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-emerald-500'
                      : 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-200/70 dark:border-teal-900/50'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-mono text-xs font-black ${
                      item.type === 'full_mock'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-600 text-white'
                    }`}>
                      {item.type === 'full_mock' ? 'MOCK' : 'REV'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                          {item.date}
                        </span>
                        {item.isToday && (
                          <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-md bg-emerald-500 text-white">
                            SCHEDULED TODAY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    {item.type === 'full_mock' ? (
                      <button
                        type="button"
                        onClick={() => handleLaunchMilestoneExam(item)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 text-xs font-bold transition-all flex items-center space-x-1.5"
                      >
                        <span>Start Mock Exam</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-950 border border-teal-200 dark:border-teal-800">
                        Built-in Review Day
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 4: 18-SUBTOPIC SKILL MATRIX ──────────────────────── */}
      {activeTabSection === 'skills' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Dynamic 18-Subtopic Skill Matrix
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live mastery status across the official College Board® Digital SAT Math framework.
              </p>
            </div>

            {/* Domain Filter Tabs */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
              <button
                onClick={() => setSelectedDomainFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedDomainFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All Domains
              </button>
              {domains.map((dom) => (
                <button
                  key={dom}
                  onClick={() => setSelectedDomainFilter(dom)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                    selectedDomainFilter === dom
                      ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          {/* Subtopic Skill Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => {
                  const matching = ALL_QUESTIONS.filter(
                    (q) => (q.topic && q.topic.toLowerCase().includes(skill.name.toLowerCase().split(' ')[0])) ||
                           (q.domain && q.domain.toLowerCase().includes(skill.domain.toLowerCase()))
                  );
                  handleLaunchBlock({
                    type: 'core_focus',
                    title: `Skill Drill: ${skill.name}`,
                    badgeLabel: `${skill.mastery}% Mastery`,
                    subtopicName: skill.name,
                    questionCount: Math.min(10, matching.length || 8),
                    estimatedMinutes: 15,
                    advice: `Targeting mastery in ${skill.name}. Average speed: ${skill.avgSecondsPerQuestion}s/q.`,
                    completed: false,
                    questions: matching.slice(0, 10),
                  });
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer group shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      {skill.domain}
                    </span>
                    {getStatusBadge(skill.status, skill.mastery)}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {skill.name}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2">
                    <span>Pacing: ~{skill.avgSecondsPerQuestion}s/q</span>
                    <span>{skill.totalAttempts || 14} attempts</span>
                  </div>
                </div>

                {/* Accuracy Mini Meter */}
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>E: {skill.accuracy.easy}%</span>
                    <span>M: {skill.accuracy.medium}%</span>
                    <span>H: {skill.accuracy.hard}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        skill.mastery >= 90 ? 'bg-emerald-500'
                        : skill.mastery >= 75 ? 'bg-sky-500'
                        : skill.mastery >= 60 ? 'bg-yellow-500'
                        : skill.mastery >= 40 ? 'bg-amber-500'
                        : 'bg-rose-500'
                      }`}
                      style={{ width: `${skill.mastery}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
