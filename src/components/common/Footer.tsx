import React from 'react';
import { Zap, Shield, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 pt-16 pb-12 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-glow-emerald">
                <Zap className="w-5 h-5 text-slate-950 fill-slate-950 stroke-1" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SAT Master
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier AI-powered Digital SAT Math preparation platform. Built with authentic College Board Bluebook test room, Desmos integration, and KaTeX step-by-step resolution.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Updated for 2026/2027 Digital SAT Math</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => setCurrentView('landing')} className="hover:text-emerald-400 transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('onboarding')} className="hover:text-emerald-400 transition-colors">
                  Adaptive Study Plan
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('exam')} className="hover:text-emerald-400 transition-colors">
                  Bluebook Exam Room
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">Desmos Shortcuts</a></li>
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">KaTeX Math Formula Sheet</a></li>
              <li><a href="#estimator" className="hover:text-emerald-400 transition-colors">Score Estimator Widget</a></li>
              <li><button onClick={() => setCurrentView('leaderboard')} className="hover:text-emerald-400 transition-colors">Global Ranks & Badges</button></li>
            </ul>
          </div>

          {/* Community Social Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Official Channels</h4>
            <p className="text-xs text-slate-400 mb-3">Join our community channels for daily practice questions & free video courses.</p>
            <div className="space-y-2">
              
              {/* Telegram Channel */}
              <a
                href="https://t.me/sat_ielts_dars"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-sky-950/60 border border-sky-800/40 text-sky-300 hover:text-white hover:bg-sky-900/60 transition-all text-xs font-bold"
              >
                <svg className="w-4 h-4 fill-current text-sky-400" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.07 9.75c-.15.7-.57.87-1.16.54l-3.15-2.32-1.52 1.46c-.17.17-.31.31-.64.31l.23-3.21 5.85-5.28c.25-.23-.06-.35-.39-.13l-7.23 4.55-3.11-.97c-.68-.21-.69-.68.14-1l12.16-4.69c.56-.21 1.06.14.89.99z"/>
                </svg>
                <span>Telegram Channel</span>
              </a>

              {/* YouTube Channel */}
              <a
                href="https://www.youtube.com/@ScoreUp_Academy_SAT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-red-950/60 border border-red-800/40 text-red-300 hover:text-white hover:bg-red-900/60 transition-all text-xs font-bold"
              >
                <svg className="w-4 h-4 fill-current text-red-400" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>ScoreUp Academy YouTube</span>
              </a>

            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© 2026 SAT Master Inc. Not affiliated with College Board (SAT® is a registered trademark).</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5" />
              <span>SSL 256-Bit Security</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
