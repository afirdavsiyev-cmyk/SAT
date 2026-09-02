import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';
import { StudyPlanDay } from '../../types';
import {
  SATDomain,
  SubtopicSkill,
  DailyActionPlan,
  ActionPlanBlock,
  SkillStatus
} from '../../types/planner';
import {
  getStoredAdaptiveData,
  saveStoredAdaptiveData,
  getRankedPrioritySkills,
  generateDailyActionPlan
} from '../../utils/adaptivePlannerEngine';
import { ALL_QUESTIONS } from '../../data/questions';

interface DailyPlanRoadmapViewProps {
  onStartDrill?: (dayOrSubtopic: any) => void;
  onReconfigureWizard?: () => void;
}

export const DailyPlanRoadmapView: React.FC<DailyPlanRoadmapViewProps> = ({
  onStartDrill,
  onReconfigureWizard
}) => {
  const { studyPlan, setStudyPlan, setCurrentView, updatePlanner, userProgressState } = useApp();

  // Load adaptive planner data from engine
  const [plannerData, setPlannerData] = useState(() => getStoredAdaptiveData());
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<SATDomain | 'all'>('all');
  const [activeDrillBlockIndex, setActiveDrillBlockIndex] = useState<number | null>(null);

  const profile = plannerData.profile;
  const skills = plannerData.skills;
  const todayPlan = plannerData.todayPlan;

  // Ranked priority skills
  const rankedPriority = React.useMemo(() => {
    return getRankedPrioritySkills(skills, profile.targetScore, profile.baselineScore);
  }, [skills, profile]);

  // Handle launching today's primary session
  const handleLaunchSession = (block?: ActionPlanBlock) => {
    const targetSubtopicName = block?.subtopicName || todayPlan.prioritySubtopic;
    // Find matching questions for this subtopic or fallback to domain
    const matching = ALL_QUESTIONS.filter(
      (q) => (q.topic && q.topic.toLowerCase().includes(targetSubtopicName.toLowerCase())) ||
             (q.domain && q.domain.toLowerCase().includes(targetSubtopicName.toLowerCase()))
    );

    const questionsToPractice = matching.length > 0 ? matching : ALL_QUESTIONS.slice(0, 10);

    if (onStartDrill) {
      onStartDrill({
        dayNumber: todayPlan.dayNumber,
        dayLabel: `Today's Plan: ${targetSubtopicName}`,
        title: block?.title || `Adaptive Drill: ${targetSubtopicName}`,
        domain: block?.subtopicName || 'Algebra',
        skillFocus: block?.advice || 'Adaptive precision drill',
        questionCount: block?.questionCount || 10,
        easyCount: 2,
        mediumCount: 5,
        hardCount: 3,
        targetMinutes: block?.durationMinutes || 15,
        advice: block?.advice || 'Focus on step-by-step verification',
        type: 'drill',
        customQuestions: questionsToPractice,
      });
    } else {
      setCurrentView('exam');
    }
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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ─── Top Header Banner with Reconfigure Action ──────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-50/80 via-white to-amber-50/60 dark:from-slate-900/90 dark:via-slate-900 dark:to-emerald-950/80 border border-amber-900/10 dark:border-emerald-500/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60 text-xs font-bold shadow-sm">
            <Zap className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
            <span>5-LAYER ADAPTIVE STUDY PLANNER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Adaptive SAT Math Action Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Targeting <strong className="text-orange-600 dark:text-emerald-400 font-mono font-bold">{profile.targetScore} / 800</strong> by <span className="font-bold text-slate-800 dark:text-slate-100">{profile.targetExamDate}</span> • {profile.dailyMinutes}m daily target across {profile.daysPerWeek.length} active days.
          </p>
        </div>

        {/* Header Badges & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-950/80 border border-amber-900/10 dark:border-slate-800 text-left">
            <span className="text-[10px] text-slate-500 font-mono block">BASELINE GAP</span>
            <span className="text-base font-mono font-extrabold text-orange-600 dark:text-emerald-400">
              +{Math.max(0, profile.targetScore - profile.baselineScore)} Points
            </span>
          </div>

          <button
            type="button"
            onClick={onReconfigureWizard ? onReconfigureWizard : () => setCurrentView('onboarding')}
            className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-950/80 border border-amber-900/15 dark:border-slate-800 hover:border-orange-400 dark:hover:border-emerald-500/50 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-orange-800 dark:hover:text-emerald-300 transition-all flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reconfigure Wizard</span>
          </button>
        </div>
      </div>

      {/* ─── 1. TODAY'S ACTION PLAN BREAKDOWN ───────────────────────── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/90 border border-amber-900/10 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-orange-800 dark:text-emerald-400 bg-orange-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-orange-200 dark:border-emerald-800/60">
                DAY 1 ACTION PLAN
              </span>
              <span className="text-xs font-mono text-slate-500">
                {todayPlan.totalMinutes} Total Minutes
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Today's Prescriptive Schedule
            </h2>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => handleLaunchSession()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-extrabold text-xs shadow-md shadow-orange-500/25 dark:shadow-glow-emerald transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Start Today's Session</span>
          </button>
        </div>

        {/* 4 Multi-Component Schedule Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayPlan.blocks.map((block, idx) => (
            <div
              key={idx}
              onClick={() => handleLaunchSession(block)}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-amber-900/10 dark:border-slate-800 hover:border-orange-400 dark:hover:border-emerald-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold text-orange-700 dark:text-emerald-400 bg-orange-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                    {block.durationMinutes} MIN
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {block.questionCount} Questions
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-emerald-300 transition-colors">
                  {block.title}
                </h3>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {block.advice}
                </p>
              </div>

              {/* Difficulty Distribution Bar */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                  <span>Easy {block.difficultyDistribution.easy}%</span>
                  <span>Med {block.difficultyDistribution.medium}%</span>
                  <span>Hard {block.difficultyDistribution.hard}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${block.difficultyDistribution.easy}%` }} className="bg-emerald-500 h-full" />
                  <div style={{ width: `${block.difficultyDistribution.medium}%` }} className="bg-amber-500 h-full" />
                  <div style={{ width: `${block.difficultyDistribution.hard}%` }} className="bg-rose-500 h-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 2. TOP PRIORITY QUEUE ──────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-amber-50/40 dark:bg-slate-900/60 border border-amber-900/10 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-orange-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Algorithmic Priority Queue (Top 3 Target Subtopics)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Formula: (100 - Mastery) × DomainWeight × TargetGapRatio
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rankedPriority.slice(0, 3).map(({ skill, priorityScore }, idx) => (
            <div
              key={skill.id}
              onClick={() => handleLaunchSession({
                type: 'targeted_drills',
                title: `Target Drill: ${skill.name}`,
                durationMinutes: 15,
                subtopicName: skill.name,
                subtopicId: skill.id,
                questionCount: 6,
                difficultyDistribution: { easy: 20, medium: 50, hard: 30 },
                advice: `Priority score ${priorityScore}. Focus on mastering key steps.`,
              })}
              className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-amber-900/10 dark:border-slate-800 hover:border-orange-400 dark:hover:border-emerald-500 transition-all cursor-pointer group shadow-sm flex items-start justify-between"
            >
              <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                <div className="flex items-center space-x-1.5">
                  <span className="w-4 h-4 rounded-full bg-orange-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    {skill.domain}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-emerald-300 truncate">
                  {skill.name}
                </h4>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(skill.status, skill.mastery)}
                  <span className="text-[10px] font-mono text-slate-400">Score {priorityScore}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. DYNAMIC SKILL MAP MATRIX ────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Dynamic 18-Subtopic Skill Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time mastery status mapped directly across the official College Board® Digital SAT Math framework.
            </p>
          </div>

          {/* Domain Filter Tabs */}
          <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedDomainFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedDomainFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-orange-700 dark:text-emerald-300 shadow-sm'
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
                    ? 'bg-white dark:bg-slate-800 text-orange-700 dark:text-emerald-300 shadow-sm'
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
              onClick={() => handleLaunchSession({
                type: 'targeted_drills',
                title: `Skill Drill: ${skill.name}`,
                durationMinutes: 15,
                subtopicName: skill.name,
                subtopicId: skill.id,
                questionCount: 8,
                difficultyDistribution: { easy: 25, medium: 50, hard: 25 },
                advice: `Targeting mastery in ${skill.name}. Average speed: ${skill.avgSecondsPerQuestion}s/q.`,
              })}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-amber-900/10 dark:border-slate-800 hover:border-orange-400 dark:hover:border-emerald-500 transition-all cursor-pointer group shadow-sm hover:shadow-[0_4px_20px_rgba(234,88,12,0.08)] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    {skill.domain}
                  </span>
                  {getStatusBadge(skill.status, skill.mastery)}
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
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

    </div>
  );
};
