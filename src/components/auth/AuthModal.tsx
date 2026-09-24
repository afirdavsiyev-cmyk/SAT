import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  initialMode,
}) => {
  const {
    isAuthModalOpen: contextIsOpen,
    closeAuthModal: contextCloseModal,
    authModalMode: contextMode,
    setAuthModalMode,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    loginWithTelegram,
  } = useAuth();

  const isModalOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const handleClose = propOnClose || contextCloseModal;

  const [localMode, setLocalMode] = useState<'login' | 'signup'>(
    initialMode || contextMode || 'login'
  );
  const mode = initialMode ? localMode : contextMode;
  const setMode = (m: 'login' | 'signup') => {
    setLocalMode(m);
    setAuthModalMode(m);
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleClose]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoadingProvider('email');

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        setSuccessMessage('Welcome back to ScoreUp!');
      } else {
        await signupWithEmail(name, email, password);
        setSuccessMessage('Account created successfully!');
      }
      setTimeout(() => {
        setSuccessMessage(null);
        handleClose();
      }, 750);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setLoadingProvider('google');
    try {
      await loginWithGoogle();
      setSuccessMessage('Signed in with Google!');
      setTimeout(() => {
        setSuccessMessage(null);
        handleClose();
      }, 750);
    } catch (err: any) {
      setErrorMessage('Failed to sign in with Google.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleTelegramLogin = () => {
    setErrorMessage(null);
    setLoadingProvider('telegram');
    loginWithTelegram();
    setSuccessMessage('Connecting to Telegram...');
    setTimeout(() => {
      setSuccessMessage(null);
      handleClose();
      setLoadingProvider(null);
    }, 900);
  };

  const modalNode = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      {/* Modal Window: Stop propagation so clicks inside don't close it */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-3xl bg-slate-900/95 dark:bg-slate-900/95 border border-slate-700/60 dark:border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-8 text-white overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20"
          title="Close dialog"
        >
          ✕
        </button>

        <div className="text-center mb-6 pt-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-lg mb-2.5 shadow-lg shadow-emerald-500/20">
            S
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Welcome to ScoreUp
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to track your 800 journey and personal roadmap
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl mb-5 border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loadingProvider !== null}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-md active:scale-95 disabled:opacity-60"
          >
            {loadingProvider === 'google' ? (
              <Sparkles className="w-4 h-4 animate-spin text-emerald-500" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={handleTelegramLogin}
            disabled={loadingProvider !== null}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#229ED9] hover:bg-[#1d8fc4] text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-60"
          >
            {loadingProvider === 'telegram' ? (
              <Sparkles className="w-4 h-4 animate-spin text-white" />
            ) : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
            )}
            <span>Telegram</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
            Or continue with email
          </span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@scoreup.app"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link has been dispatched to your email.')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loadingProvider !== null}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loadingProvider === 'email' ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Log In to ScoreUp' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Sign-In */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => {
              setEmail('demo.student@scoreup.app');
              setPassword('password123');
              loginWithEmail('demo.student@scoreup.app');
              setSuccessMessage('Logged in as Demo Student!');
              setTimeout(() => {
                setSuccessMessage(null);
                handleClose();
              }, 700);
            }}
            className="text-[11px] font-bold text-slate-400 hover:text-white transition-colors"
          >
            ⚡ Click here for Instant Demo Student Sign-In
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalNode, document.body)
    : modalNode;
};

export default AuthModal;
