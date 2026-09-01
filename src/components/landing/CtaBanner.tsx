import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export const CtaBanner: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal delay={0} threshold={0.1}>
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 shadow-glow-emerald overflow-hidden text-center">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-bold border border-emerald-700/50">
              <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>Ready for Test Day?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Start Practicing in the Official <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Digital Bluebook Room Now
              </span>
            </h2>

            <p className="text-slate-300 text-base max-w-xl mx-auto">
              Join over 42,000 students achieving their target scores. Unlimited adaptive math & reading modules with instant KaTeX solutions.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentView('exam')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-base shadow-glow-emerald hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5 fill-slate-950 stroke-emerald-400" />
                <span>Launch Free Exam Room</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentView('onboarding')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-950 border border-slate-700 text-slate-200 hover:text-white hover:border-emerald-500 font-bold text-base transition-all"
              >
                Build Adaptive Roadmap
              </button>
            </div>

            <div className="pt-4 flex items-center justify-center space-x-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Diagnostic Analysis</span>
              </span>
              <span>•</span>
              <span>100% Free Access</span>
            </div>
          </div>

        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
