import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Clock,
  AlertCircle,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  Share2,
  RefreshCw,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { ScoreForecastCard } from './ScoreForecastCard';
import { DomainSkillAccordion } from './DomainSkillAccordion';
import { PacingScatterPlot } from './PacingScatterPlot';
import { ErrorDiagnosticsDonut } from './ErrorDiagnosticsDonut';
import { RecentTrendLineChart } from './RecentTrendLineChart';
import { QuestionItem } from '../../types/questionBank';
import { useApp } from '../../context/AppContext';
import { useStudyPlannerData } from '../../hooks/useStudyPlannerData';
import { useAuth } from '../../context/AuthContext';

export interface AnalyticsDashboardViewProps {
  onStartPractice?: (questions: QuestionItem[], topicName: string) => void;
}

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  onStartPractice,
}) => {
  const { userProgress, userProgressState } = useApp();
  const { activeUser } = useAuth();
  const plannerData = useStudyPlannerData();

  const [activeSubSection, setActiveSubSection] = useState<'all' | 'forecast' | 'domains' | 'pacing' | 'errors' | 'trends'>('all');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const displayedScore = activeUser.currentEstimatedMath || plannerData.currentEstimatedMath || userProgress.mathScore || 650;
  const targetMath = activeUser.targetScore
    ? (typeof activeUser.targetScore === 'number' ? activeUser.targetScore : parseInt(String(activeUser.targetScore), 10) || 750)
    : plannerData.targetMath || 750;

  const handleRefresh = () => {
    setIsRefreshing(true);
    plannerData.refetch();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60 shadow-sm">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
              Digital SAT Math Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Performance Analytics & Diagnostic Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time scoring band projections, domain mastery drill-downs, pacing scatter matrices, and mistake cause diagnostics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start md:self-center">
          <button
            type="button"
            onClick={handleRefresh}
            className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500 shadow-sm transition-all active:scale-95 ${
              isRefreshing ? 'animate-spin text-emerald-600' : ''
            }`}
            title="Refresh Analytics Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <div className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital SAT Adaptive v2.4</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Pills */}
      <div className="flex items-center overflow-x-auto space-x-2 py-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setActiveSubSection('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
            activeSubSection === 'all'
              ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          All Insights Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveSubSection('forecast')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
            activeSubSection === 'forecast'
              ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          1. Score Forecast
        </button>
        <button
          type="button"
          onClick={() => setActiveSubSection('domains')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
            activeSubSection === 'domains'
              ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          2. Domain & Skill Breakdown
        </button>
        <button
          type="button"
          onClick={() => setActiveSubSection('pacing')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
            activeSubSection === 'pacing'
              ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          3. Pacing Breakdown
        </button>
        <button
          type="button"
          onClick={() => setActiveSubSection('errors')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
            activeSubSection === 'errors'
              ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          4. Error Log Diagnostics
        </button>
        <button
          type="button"
          onClick={() => setActiveSubSection('trends')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
            activeSubSection === 'trends'
              ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-slate-950 dark:border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          5. Recent Trend
        </button>
      </div>

      {/* ─── SECTION 1: SCORE FORECAST ─── */}
      {(activeSubSection === 'all' || activeSubSection === 'forecast') && (
        <section id="section-forecast">
          <ScoreForecastCard
            currentScore={displayedScore}
            targetScore={targetMath}
          />
        </section>
      )}

      {/* ─── SECTION 2: DOMAIN & SKILL BREAKDOWN ─── */}
      {(activeSubSection === 'all' || activeSubSection === 'domains') && (
        <section id="section-domains">
          <DomainSkillAccordion
            onStartPractice={onStartPractice}
            domainMastery={plannerData.domainMastery}
          />
        </section>
      )}

      {/* ─── SECTION 3: PACING BREAKDOWN ─── */}
      {(activeSubSection === 'all' || activeSubSection === 'pacing') && (
        <section id="section-pacing">
          <PacingScatterPlot
            onStartPractice={onStartPractice}
          />
        </section>
      )}

      {/* ─── SECTION 4: ERROR LOG DIAGNOSTICS ─── */}
      {(activeSubSection === 'all' || activeSubSection === 'errors') && (
        <section id="section-errors">
          <ErrorDiagnosticsDonut
            onStartPractice={onStartPractice}
          />
        </section>
      )}

      {/* ─── SECTION 5: RECENT TREND ─── */}
      {(activeSubSection === 'all' || activeSubSection === 'trends') && (
        <section id="section-trends">
          <RecentTrendLineChart
            currentAccuracy={userProgress.accuracyRate || 85}
            streakDays={plannerData.streakDays || 5}
          />
        </section>
      )}

    </div>
  );
};
