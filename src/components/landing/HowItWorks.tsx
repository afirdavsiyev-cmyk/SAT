import React, { useState } from 'react';
import { Target, Cpu, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScrollReveal } from '../common/ScrollReveal';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export const HowItWorks: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeStep, setActiveStep] = useState<number>(1);
  const header = useScrollReveal({ threshold: 0.15 });

  const steps = [
    {
      step: 1,
      icon: <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: '1. Complete Adaptive Diagnostic',
      desc: 'Take a short 15-minute diagnostic test to pinpoint your current mastery level across Math (Algebra, Geometry, Advanced) and Reading & Writing.',
      highlight: 'Pinpoint weakness down to exact SAT topic domain',
      actionText: 'Start Diagnostic'
    },
    {
      step: 2,
      icon: <Cpu className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      title: '2. AI Guided Practice & Desmos Training',
      desc: 'Work through tailored drill modules. Receive step-by-step KaTeX math solutions and master Desmos calculator shortcuts for rapid speed.',
      highlight: 'Step-by-step hints powered by Preppy AI 24/7',
      actionText: 'Explore Drills'
    },
    {
      step: 3,
      icon: <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: '3. Crush Test Day in Bluebook Environment',
      desc: 'Practice under full timed exam conditions with College Board standard layouts, equation scratchpads, formula reference sheets, and score analytics.',
      highlight: '+140 points average score increase verified',
      actionText: 'Launch Bluebook Exam'
    }
  ];

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80 relative overflow-hidden transition-colors">
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mb-3 bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/50 px-3 py-1 rounded-full inline-block">
            Simple 3-Step Journey
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How SAT Master Prepares You
          </h3>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            From initial score diagnosis to test day mastery in three structured phases.
          </p>
        </div>

        {/* Timeline Grid — staggered 3D Perspective Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {steps.map((s) => (
            <ScrollReveal key={s.step} delay={s.step * 120} threshold={0.1} className="h-full">
              <CardContainer className="inter-var w-full h-full">
                <CardBody
                  className={`bg-white/95 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.15] dark:bg-slate-950/90 dark:border-white/[0.15] border-black/[0.08] w-full h-full rounded-3xl p-6 sm:p-8 border shadow-md hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between ${
                    activeStep === s.step
                      ? 'border-emerald-500/60 dark:border-emerald-500/60 shadow-[0_4px_25px_rgba(16,185,129,0.12)] dark:shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                      : 'hover:border-emerald-500/40 dark:hover:border-emerald-500/40'
                  }`}
                  onClick={() => setActiveStep(s.step)}
                >
                  <div>
                    {/* Top Row: Icon & Step Badge */}
                    <CardItem
                      translateZ="50"
                      className="w-full flex items-center justify-between mb-6"
                    >
                      <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 shadow-sm">
                        {s.icon}
                      </div>
                      <span className="text-xs font-extrabold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800/40 px-3 py-1 rounded-full">
                        STEP 0{s.step}
                      </span>
                    </CardItem>

                    {/* Title */}
                    <CardItem
                      as="h4"
                      translateZ="60"
                      className="text-xl font-bold text-slate-900 dark:text-white mb-3"
                    >
                      {s.title}
                    </CardItem>

                    {/* Description */}
                    <CardItem
                      as="p"
                      translateZ="40"
                      className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6"
                    >
                      {s.desc}
                    </CardItem>
                  </div>

                  <div>
                    {/* Highlight Pill */}
                    <CardItem
                      translateZ="65"
                      className="w-full flex items-center space-x-2 text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-500/30 dark:text-emerald-300 p-2.5 rounded-xl mb-4 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{s.highlight}</span>
                    </CardItem>

                    {/* Action Button */}
                    <CardItem
                      as="button"
                      translateZ="75"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (s.step === 1) setCurrentView('onboarding');
                        else if (s.step === 2) setCurrentView('dashboard');
                        else setCurrentView('exam');
                      }}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 group/btn active:scale-95 shadow-md shadow-emerald-500/20 dark:shadow-none"
                    >
                      <span>{s.actionText}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
