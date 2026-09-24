import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export const CtaBanner: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="py-20 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal delay={0} threshold={0.1}>
          <CardContainer className="inter-var w-full">
            <CardBody className="relative group/card rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-emerald-500/10 via-white to-teal-500/10 dark:from-emerald-950 dark:via-slate-900 dark:to-teal-950 border border-emerald-500/30 dark:border-emerald-500/40 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.15] shadow-[0_4px_25px_rgba(16,185,129,0.12)] dark:shadow-glow-emerald overflow-hidden text-center w-full">
              
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-3xl mx-auto space-y-6">
                <CardItem
                  translateZ="50"
                  className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700/50 shadow-xs"
                >
                  <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 dark:fill-emerald-500 dark:text-emerald-500" />
                  <span>Ready for Test Day?</span>
                </CardItem>

                <CardItem
                  as="h2"
                  translateZ="65"
                  className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
                >
                  Start Practicing in the Official <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                    Digital Bluebook Room Now
                  </span>
                </CardItem>

                <CardItem
                  as="p"
                  translateZ="40"
                  className="text-slate-700 dark:text-slate-300 text-base max-w-xl mx-auto"
                >
                  Join over 42,000 students achieving their target scores. Unlimited adaptive math & reading modules with instant KaTeX solutions.
                </CardItem>

                <CardItem
                  translateZ="75"
                  className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
                >
                  <button
                    onClick={() => setCurrentView('exam')}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 dark:text-slate-950 font-extrabold text-base shadow-[0_4px_14px_rgba(16,185,129,0.35)] dark:shadow-glow-emerald hover:scale-105 transition-all flex items-center justify-center space-x-2"
                  >
                    <Zap className="w-5 h-5 fill-white stroke-emerald-600 dark:fill-slate-950 dark:stroke-emerald-400" />
                    <span>Launch Free Exam Room</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setCurrentView('onboarding')}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-950 border border-emerald-200 dark:border-slate-700 text-emerald-950 dark:text-slate-200 hover:text-emerald-900 dark:hover:text-white hover:border-emerald-500 hover:bg-emerald-50/50 font-bold text-base transition-all shadow-[0_4px_20px_rgba(16,185,129,0.06)]"
                  >
                    Build Adaptive Roadmap
                  </button>
                </CardItem>

                <CardItem
                  translateZ="35"
                  className="pt-4 flex items-center justify-center space-x-6 text-xs text-slate-600 dark:text-slate-400 font-medium"
                >
                  <span className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Instant Diagnostic Analysis</span>
                  </span>
                  <span>•</span>
                  <span>100% Free Access</span>
                </CardItem>
              </div>

            </CardBody>
          </CardContainer>
        </ScrollReveal>
      </div>
    </section>
  );
};
