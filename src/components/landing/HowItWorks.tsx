import React, { useState } from 'react';
import { Target, Cpu, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../common/ScrollReveal';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const HowItWorks: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeStep, setActiveStep] = useState<number>(1);
  const header = useScrollReveal({ threshold: 0.15 });

  const steps = [
    {
      step: 1,
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      title: '1. Complete Adaptive Diagnostic',
      desc: 'Take a short 15-minute diagnostic test to pinpoint your current mastery level across Math (Algebra, Geometry, Advanced) and Reading & Writing.',
      highlight: 'Pinpoint weakness down to exact SAT topic domain',
      actionText: 'Start Diagnostic'
    },
    {
      step: 2,
      icon: <Cpu className="w-6 h-6 text-teal-400" />,
      title: '2. AI Guided Practice & Desmos Training',
      desc: 'Work through tailored drill modules. Receive step-by-step KaTeX math solutions and master Desmos calculator shortcuts for rapid speed.',
      highlight: 'Step-by-step hints powered by Preppy AI 24/7',
      actionText: 'Explore Drills'
    },
    {
      step: 3,
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: '3. Crush Test Day in Bluebook Environment',
      desc: 'Practice under full timed exam conditions with College Board standard layouts, equation scratchpads, formula reference sheets, and score analytics.',
      highlight: '+140 points average score increase verified',
      actionText: 'Launch Bluebook Exam'
    }
  ];

  return (
    <section className="py-24 bg-slate-900/40 border-y border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div
          ref={header.ref}
          className="text-center max-w-3xl mx-auto mb-16"
          style={{
            opacity: header.isVisible ? 1 : 0,
            transform: header.isVisible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.98)',
            transition: 'opacity 700ms cubic-bezier(0.25,0.46,0.45,0.94), transform 700ms cubic-bezier(0.25,0.46,0.45,0.94)',
            willChange: 'opacity, transform',
          }}
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 bg-emerald-950/80 border border-emerald-800/50 px-3 py-1 rounded-full inline-block">
            Simple 3-Step Journey
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How SAT Master Prepares You
          </h3>
          <p className="mt-4 text-base text-slate-400">
            From initial score diagnosis to test day mastery in three structured phases.
          </p>
        </div>

        {/* Timeline Grid — staggered */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <ScrollReveal key={s.step} delay={s.step * 120} threshold={0.1}>
              <div
                onClick={() => setActiveStep(s.step)}
                className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer border flex flex-col justify-between h-full ${
                  activeStep === s.step
                    ? 'bg-slate-900 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.12)]'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-emerald-500/30 hover:-translate-y-0.5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm">
                      {s.icon}
                    </div>
                    <span className="text-xs font-extrabold font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/40">
                      STEP 0{s.step}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-3">{s.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">{s.desc}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-800/30 mb-4">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{s.highlight}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (s.step === 1) setCurrentView('onboarding');
                      else if (s.step === 2) setCurrentView('dashboard');
                      else setCurrentView('exam');
                    }}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-emerald-500 text-white hover:text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 group active:scale-95"
                  >
                    <span>{s.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
