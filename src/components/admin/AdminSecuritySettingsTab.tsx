import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Command,
  FileCode,
  Check,
} from 'lucide-react';
import {
  changeAdminPasskey,
  hasCustomAdminPasskey,
  resetAdminPasskeyToDefault,
} from '../../services/adminService';

export const AdminSecuritySettingsTab: React.FC = () => {
  const [hasCustom, setHasCustom] = useState<boolean>(() => hasCustomAdminPasskey());

  // Form states
  const [oldPasskey, setOldPasskey] = useState('');
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');

  // Visibility states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Status message states
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChangePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!oldPasskey) {
      setErrorMessage('Please enter your current administrative passkey.');
      return;
    }

    if (!newPasskey || newPasskey.trim().length < 4) {
      setErrorMessage('New passkey must be at least 4 characters long.');
      return;
    }

    if (newPasskey !== confirmPasskey) {
      setErrorMessage('New passkey and confirmation do not match.');
      return;
    }

    setIsUpdating(true);
    try {
      const success = await changeAdminPasskey(oldPasskey, newPasskey);
      if (success) {
        setHasCustom(true);
        setSuccessMessage('Admin passkey successfully updated! Your new passkey is now active.');
        setOldPasskey('');
        setNewPasskey('');
        setConfirmPasskey('');
      } else {
        setErrorMessage('Current passkey is incorrect. Passkey change rejected.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update passkey.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetToDefault = () => {
    if (
      !confirm(
        'Are you sure you want to revert to the default developer passkey (scoreup2026)?'
      )
    ) {
      return;
    }

    resetAdminPasskeyToDefault();
    setHasCustom(false);
    setSuccessMessage('Passkey reverted to system default ("scoreup2026").');
    setErrorMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          HEADER & STATUS OVERVIEW
         ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Security & Passkey Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage cryptographic access credentials and stealth activation shortcuts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasCustom ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Custom Passkey Active</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Default Dev Passkey (scoreup2026)</span>
            </span>
          )}
        </div>
      </div>

      {/* Feedback Messages */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-emerald-600 hover:text-emerald-800 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="text-rose-600 hover:text-rose-800 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CHANGE PASSKEY FORM CARD
         ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Update Administrative Passkey</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Securely changes the passkey using Web Crypto SHA-256 local storage hash.
            </p>
          </div>
          {hasCustom && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Revert back to default passkey scoreup2026"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          )}
        </div>

        <form onSubmit={handleChangePasskey} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Passkey */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Passkey
              </label>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  value={oldPasskey}
                  onChange={(e) => setOldPasskey(e.target.value)}
                  placeholder="Enter current passkey..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showOld ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* New Passkey */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                New Passkey
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPasskey}
                  onChange={(e) => setNewPasskey(e.target.value)}
                  placeholder="Minimum 4 characters..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Passkey */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Confirm New Passkey
              </label>
              <input
                type={showNew ? 'text' : 'password'}
                value={confirmPasskey}
                onChange={(e) => setConfirmPasskey(e.target.value)}
                placeholder="Re-enter new passkey..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isUpdating ? 'Updating Passkey...' : 'Save New Passkey'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          STEALTH ACCESS REFERENCE CARD
         ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0c131f]/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <Command className="w-4 h-4 text-emerald-500" />
          <span>Stealth Administrative Access Routes</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The Admin & AI Studio is completely hidden from regular student navigation and profile menus. Use either method below to open this console:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
              <span>Global Keyboard Shortcut</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">Recommended</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold">
                Ctrl
              </kbd>
              <span className="text-slate-400 text-xs">+</span>
              <kbd className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold">
                Shift
              </kbd>
              <span className="text-slate-400 text-xs">+</span>
              <kbd className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold">
                A
              </kbd>
            </div>
            <p className="text-[10px] text-slate-400">
              (Use <kbd className="font-mono">Cmd + Shift + A</kbd> on macOS).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
              Browser URL Hash Route
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
              /#/admin
            </div>
            <p className="text-[10px] text-slate-400">
              Typing or appending <code className="font-mono">/#/admin</code> directly in the browser address bar triggers this console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecuritySettingsTab;
