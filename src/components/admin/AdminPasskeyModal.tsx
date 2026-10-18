import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  X,
  Clock,
} from 'lucide-react';
import {
  verifyAdminPasskey,
  getAdminLockoutStatus,
  recordAdminPasskeyFailure,
  AdminLockoutStatus,
} from '../../services/adminService';

interface AdminPasskeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

export const AdminPasskeyModal: React.FC<AdminPasskeyModalProps> = ({
  isOpen,
  onClose,
  onUnlocked,
}) => {
  const [passkeyInput, setPasskeyInput] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [lockoutStatus, setLockoutStatus] = useState<AdminLockoutStatus>(() =>
    getAdminLockoutStatus()
  );

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync lockout status and handle countdown timer
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  // Focus input and reset state on open
  useEffect(() => {
    if (isOpen) {
      setPasskeyInput('');
      setAuthError('');
      setIsShaking(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      setAuthError('Please enter the administrative passkey.');
      triggerShake();
      return;
    }

    setIsVerifying(true);
    setAuthError('');

    try {
      const isValid = await verifyAdminPasskey(passkeyInput);
      if (isValid) {
        setPasskeyInput('');
        onUnlocked();
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
            `Invalid administrative passkey. (${updated.remainingAttempts} attempt${
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-7 space-y-6 relative ${
          isShaking ? 'animate-stealth-shake' : ''
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2.5">
          <div className="w-13 h-13 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Staff Access Verification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Dual-factor sequence verified. Enter your administrative passkey to unlock the curriculum studio.
            </p>
          </div>
        </div>

        {/* Lockout Banner */}
        {lockoutStatus.isLockedOut ? (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5">
            <Clock className="w-4 h-4 shrink-0 animate-pulse text-rose-500" />
            <div>
              <span>Console locked out due to failed attempts.</span>
              <div className="font-mono text-[11px] text-rose-500 font-bold mt-0.5">
                Cooldown remaining: {lockoutStatus.lockoutSeconds}s
              </div>
            </div>
          </div>
        ) : authError ? (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        ) : null}

        {/* Unlock Form */}
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
                ref={inputRef}
                type={showPasskey ? 'text' : 'password'}
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                disabled={lockoutStatus.isLockedOut || isVerifying}
                placeholder="Enter administrative passkey..."
                className="w-full pl-4 pr-11 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-mono disabled:opacity-50"
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
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <span className="text-[10px] text-slate-400 font-mono">
            Protected with Web Crypto SHA-256
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminPasskeyModal;
