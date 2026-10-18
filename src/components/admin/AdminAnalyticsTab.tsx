import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  Flame,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  RefreshCw,
  Gauge,
  Layers,
  Database,
  ShieldAlert,
} from 'lucide-react';
import { AdminCohortAnalytics } from '../../types/admin';
import { getAdminCohortAnalytics, exportSystemDiagnosticDump } from '../../services/adminService';

export const AdminAnalyticsTab: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminCohortAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminCohortAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load cohort analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExportDump = async () => {
    setIsExporting(true);
    try {
      const dump = await exportSystemDiagnosticDump();
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scoreup-diagnostic-dump-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export diagnostic dump:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading && !analytics) {
    return (
      <div className="py-24 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Synthesizing cohort telemetry and psychometric analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Cohort Analytics & Psychometric Overview</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time platform student performance, domain calibration, and operational health.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportDump}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export Diagnostics Dump'}</span>
          </button>
        </div>
      </div>

      {/* Key Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Students */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              {analytics?.totalStudents || 0}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Total Students
            </div>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {analytics?.activeToday || 0} active today
          </div>
        </div>

        {/* Avg Math Score */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              {analytics?.averageScore || 650}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Avg Math Score
            </div>
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
            Target 800 gap: {800 - (analytics?.averageScore || 650)} pts
          </div>
        </div>

        {/* Avg Streak */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              {analytics?.averageStreak || 1}d
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Avg Active Streak
            </div>
          </div>
          <div className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
            Daily retention index
          </div>
        </div>

        {/* Total Questions Solved */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              {analytics?.totalQuestionsAttempted || 0}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Problems Solved
            </div>
          </div>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
            Cohort accuracy: {analytics?.averageAccuracy || 0}%
          </div>
        </div>

        {/* Pending Disputes */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              {analytics?.pendingDisputesCount || 0}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Open Disputes
            </div>
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
            Needs review triage
          </div>
        </div>

        {/* Custom Tests Built */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              {analytics?.totalCustomTests || 0}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Custom Tests
            </div>
          </div>
          <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
            Generated mock pools
          </div>
        </div>
      </div>

      {/* Domain Mastery & Score Distribution Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Mastery Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>Domain Mastery Calibration</span>
            </div>
            <span className="text-[11px] text-slate-400">College Board Taxonomy</span>
          </div>

          <div className="space-y-4 pt-1">
            {analytics?.domainMasteryAverages.map((dm) => (
              <div key={dm.domain} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {dm.domain}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {dm.averageMastery}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dm.averageMastery >= 75
                        ? 'bg-emerald-500'
                        : dm.averageMastery >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, dm.averageMastery))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scaled Score Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>Score Band Distribution</span>
            </div>
            <span className="text-[11px] text-slate-400">Total: {analytics?.totalStudents || 0} students</span>
          </div>

          <div className="space-y-3 pt-1">
            {analytics?.scoreDistribution.map((bucket) => {
              const total = analytics.totalStudents || 1;
              const percent = Math.round((bucket.count / total) * 100);
              return (
                <div key={bucket.range} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {bucket.range}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {bucket.count} student{bucket.count !== 1 ? 's' : ''} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${Math.max(4, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsTab;
