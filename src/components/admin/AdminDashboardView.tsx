import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogOut,
  BarChart3,
  Users,
  Sparkles,
  FileText,
  AlertCircle,
  Loader2,
  ChevronRight,
  KeyRound,
  Clock,
} from 'lucide-react';
import {
  verifyAdminPasskey,
  getAdminSessionState,
  isAdminAuthenticated,
  logoutAdmin,
  getAdminLockoutStatus,
  recordAdminPasskeyFailure,
  AdminLockoutStatus,
} from '../../services/adminService';
import { getPendingDisputesCount } from '../../services/disputeService';
import { useApp } from '../../context/AppContext';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { AdminUsersAndBugsTab } from './AdminUsersAndBugsTab';
import { AdminQuestionGeneratorTab } from './AdminQuestionGeneratorTab';
import { AdminPracticeTestBuilderTab } from './AdminPracticeTestBuilderTab';
import { AdminSecuritySettingsTab } from './AdminSecuritySettingsTab';

export type AdminTab = 'analytics' | 'users_and_bugs' | 'question_generator' | 'test_builder' | 'settings';

export interface AdminDashboardViewProps {
  initialAuthenticated?: boolean;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  initialAuthenticated = false,
}) => {
  const { setCurrentView } = useApp();

  // If already verified through AdminPasskeyModal (or isAdminAuthenticated() is true), render dashboard immediately
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    initialAuthenticated || isAdminAuthenticated()
  );

  useEffect(() => {
    if (initialAuthenticated || isAdminAuthenticated()) {
      setIsAuthenticated(true);
    }
  }, [initialAuthenticated]);

  const [passkeyInput, setPasskeyInput] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [lockoutStatus, setLockoutStatus] = useState<AdminLockoutStatus>(() =>
    getAdminLockoutStatus()
  );

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [pendingDisputesCount, setPendingDisputesCount] = useState<number>(0);

  // Automatically log out when user navigates away from the Admin panel
  useEffect(() => {
    return () => {
      logoutAdmin();
    };
  }, []);

  // Sync lockout cooldown timer while on passkey gate
  useEffect(() => {
    if (isAuthenticated) return;
    const initial = getAdminLockoutStatus();
    setLockoutStatus(initial);

    const timer = setInterval(() => {
      const current = getAdminLockoutStatus();
      setLockoutStatus(current);
      if (!current.isLockedOut && initial.isLockedOut) {
        setAuthError('');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated]);

  const checkPendingDisputes = async () => {
    try {
      const count = await getPendingDisputesCount();
      setPendingDisputesCount(count);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkPendingDisputes();
      const handler = () => checkPendingDisputes();
      window.addEventListener('scoreup_disputes_updated', handler);
      return () => window.removeEventListener('scoreup_disputes_updated', handler);
    }
  }, [isAuthenticated]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 450);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutStatus.isLockedOut) {
      setAuthError(`Console locked. Try again in ${lockoutStatus.lockoutSeconds} seconds.`);
      triggerShake();
      return;
    }

    if (!passkeyInput.trim()) {
      setAuthError('Please enter the admin passkey.');
      triggerShake();
      return;
    }

    setIsVerifying(true);
    setAuthError('');

    try {
      const valid = await verifyAdminPasskey(passkeyInput);
      if (valid) {
        setIsAuthenticated(true);
        setPasskeyInput('');
      } else {
        const updated = recordAdminPasskeyFailure();
        setLockoutStatus(updated);
        triggerShake();

        if (updated.isLockedOut) {
          setAuthError(
            `Too many failed attempts. Console locked for ${updated.lockoutSeconds}s.`
          );
        } else {
          setAuthError(
            `Invalid admin passkey. (${updated.remainingAttempts} attempt${
              updated.remainingAttempts === 1 ? '' : 's'
            } remaining)`
          );
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Verification error occurred.');
      triggerShake();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setPasskeyInput('');
  };

  // ─────────────────────────────────────────────────────────────
  // 1. PASSKEY GATE SCREEN
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div
          className={`w-full max-w-md bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 ${
            isShaking ? 'animate-stealth-shake' : ''
          }`}
        >
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Admin & AI Studio Access
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Enter your administrative passkey to access curriculum tools, question generation, and cohort telemetry.
              </p>
            </div>
          </div>

          {/* Lockout Banner */}
          {lockoutStatus.isLockedOut ? (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5">
              <Clock className="w-4 h-4 shrink-0 animate-pulse text-rose-500" />
              <div>
                <span>Console locked out due to repeated failed attempts.</span>
                <div className="font-mono text-[11px] text-rose-500 font-bold mt-0.5">
                  Cooldown remaining: {lockoutStatus.lockoutSeconds}s
                </div>
              </div>
            </div>
          ) : authError ? (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          ) : null}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Admin Passkey</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {lockoutStatus.remainingAttempts} attempts remaining
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPasskey ? 'text' : 'password'}
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  disabled={lockoutStatus.isLockedOut || isVerifying}
                  placeholder="Enter administrative passkey..."
                  className="w-full pl-4 pr-11 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-mono disabled:opacity-50"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying || lockoutStatus.isLockedOut}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Passkey...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Studio</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </button>
            <span className="text-[10px] font-mono text-slate-400">Default: scoreup2026</span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
                ScoreUp Admin & AI Studio
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Staff Mode
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage platform psychometrics, triage dispute reports, and generate adaptive practice tests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors"
            title="Lock admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <span>Cohort Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('users_and_bugs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users_and_bugs'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-blue-500" />
          <span>Users & Disputes</span>
          {pendingDisputesCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-extrabold">
              {pendingDisputesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('question_generator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'question_generator'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>AI Question Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('test_builder')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'test_builder'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-teal-500" />
          <span>Practice Test Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span>Security & Passkey</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'analytics' && <AdminAnalyticsTab />}
        {activeTab === 'users_and_bugs' && <AdminUsersAndBugsTab />}
        {activeTab === 'question_generator' && <AdminQuestionGeneratorTab />}
        {activeTab === 'test_builder' && <AdminPracticeTestBuilderTab />}
        {activeTab === 'settings' && <AdminSecuritySettingsTab />}
      </div>
    </div>
  );
};

export default AdminDashboardView;
