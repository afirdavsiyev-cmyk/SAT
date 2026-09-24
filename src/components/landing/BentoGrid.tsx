import React, { useState } from 'react';
import { Calculator, Bot, Calendar, Flame, ChevronRight, CheckCircle, Sparkles, Trophy } from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';
import { ScrollReveal } from '../common/ScrollReveal';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export const BentoGrid: React.FC = () => {
  const [desmosTab, setDesmosTab] = useState<'graph' | 'table'>('graph');
  const [aiStep, setAiStep] = useState<number>(1);
  const [plannerDays, setPlannerDays] = useState<number>(45);

  // Header reveal
  const header = useScrollReveal({ threshold: 0.15 });

  return (
    <section id="features" className="py-24 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800/50 px-3 py-1 rounded-full inline-block mb-3">
            Architected For The 2026 Digital SAT
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Everything you need to score <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500 bg-clip-text text-transparent">
              1500+ on Test Day
            </span>
          </h3>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            Click and interact with our core features built specifically to mirror the official Digital SAT Bluebook environment.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Desmos Integrated Exam Room (Large - Col 7) */}
          <ScrollReveal className="lg:col-span-7 h-full" delay={100} threshold={0.1}>
            <BentoCard glowColor="emerald" className="h-full">
              <div className="w-full">
                <CardItem translateZ="50" className="w-full flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div className="flex space-x-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                    <button
                      onClick={() => setDesmosTab('graph')}
                      className={`px-3 py-1 rounded-md transition-all ${desmosTab === 'graph' ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Graphing View
                    </button>
                    <button
                      onClick={() => setDesmosTab('table')}
                      className={`px-3 py-1 rounded-md transition-all ${desmosTab === 'table' ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Shortcuts Table
                    </button>
                  </div>
                </CardItem>

                <CardItem
                  as="h4"
                  translateZ="60"
                  className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover/card:text-emerald-600 dark:group-hover/card:text-emerald-300 transition-colors"
                >
                  1. Official Desmos-Integrated Exam Room
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="40"
                  className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6"
                >
                  Direct integration with Desmos API v1.9. Master time-saving graphing tricks for quadratic systems, regression lines, and circle equations directly inside the Bluebook interface.
                </CardItem>
              </div>

              <CardItem
                translateZ="75"
                className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/90 p-4 font-mono text-xs overflow-hidden relative min-h-[200px]"
              >
                {desmosTab === 'graph' ? (
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">Equation 1: y = x^2 - 4x + 3</span>
                      <span className="text-teal-700 dark:text-teal-400 font-bold">Roots at x = 1, x = 3</span>
                    </div>
                    <div className="w-full h-36 bg-white dark:bg-slate-900/90 rounded-xl relative flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner">
                      <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
                      <div className="absolute w-full h-px bg-slate-300 dark:bg-slate-700 top-1/2"></div>
                      <div className="absolute h-full w-px bg-slate-300 dark:bg-slate-700 left-1/2"></div>
                      <svg className="w-full h-full absolute inset-0 text-emerald-500 dark:text-emerald-400" viewBox="0 0 300 120" fill="none">
                        <path d="M 30 10 Q 150 140 270 10" stroke="currentColor" strokeWidth="3" fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" />
                        <circle cx="90" cy="75" r="4" fill="#059669" className="fill-emerald-600 dark:fill-emerald-400" />
                        <circle cx="210" cy="75" r="4" fill="#059669" className="fill-emerald-600 dark:fill-emerald-400" />
                      </svg>
                      <div className="absolute bottom-2 right-2 bg-emerald-50 dark:bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-transparent">
                        Vertex: (2, -1)
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 w-full">
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mb-2 font-sans font-bold">Desmos SAT Shortcut Cheat Sheet:</div>
                    {[
                      { tip: 'Find Intersections', detail: 'Click graph overlap points directly' },
                      { tip: 'Regression', detail: 'Type y1 ~ m x1 + b' },
                      { tip: 'Min/Max Points', detail: 'Click parabola vertex for min/max' },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold">{row.tip}</span>
                        <span className="text-slate-600 dark:text-slate-400 font-sans">{row.detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardItem>
            </BentoCard>
          </ScrollReveal>

          {/* Bento Card 2: Preppy AI Tutor (Col 5) */}
          <ScrollReveal className="lg:col-span-5 h-full" delay={200} threshold={0.1}>
            <BentoCard glowColor="teal" className="h-full">
              <div className="w-full">
                <CardItem translateZ="50" className="w-full flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/50 text-teal-600 dark:text-teal-400 shadow-sm">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 rounded-full border border-teal-200 dark:border-teal-500/30">
                    24/7 AI Tutor
                  </span>
                </CardItem>

                <CardItem
                  as="h4"
                  translateZ="60"
                  className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover/card:text-teal-600 dark:group-hover/card:text-teal-300 transition-colors"
                >
                  2. ScoreUP AI Step-by-Step Tutor
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="40"
                  className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6"
                >
                  Stuck on a problem? Ask ScoreUP AI for instant targeted hints, Socratic questions, or step-by-step KaTeX math breakdowns.
                </CardItem>
              </div>

              <CardItem
                translateZ="75"
                className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
              >
                <div className="flex items-center justify-between text-xs w-full">
                  <span className="font-bold text-slate-800 dark:text-slate-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                    <span>Interactive Solution Step</span>
                  </span>
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((step) => (
                      <button
                        key={step}
                        onClick={() => setAiStep(step)}
                        className={`w-6 h-6 rounded-md text-xs font-bold transition-all ${aiStep === step ? 'bg-teal-600 text-white shadow-sm dark:bg-teal-500 dark:text-slate-950' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900/90 rounded-2xl text-xs space-y-3 border border-slate-200 dark:border-slate-800 shadow-sm">
                  {aiStep === 1 && (
                    <div className="space-y-2">
                      <p className="text-slate-800 dark:text-slate-300 font-semibold">Step 1: Identify given formula parameters</p>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/90 rounded-xl text-center space-y-1 font-mono text-xs border border-slate-200 dark:border-slate-800/80">
                        <p className="text-slate-700 dark:text-slate-300">Radius: <span className="text-teal-700 dark:text-emerald-400 font-bold">r = 7</span></p>
                        <p className="text-slate-700 dark:text-slate-300">Center: <span className="text-teal-700 dark:text-emerald-400 font-bold">(h, k) = (2, -5)</span></p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-sans">Target: Circle Standard Equation</p>
                      </div>
                    </div>
                  )}
                  {aiStep === 2 && (
                    <div className="space-y-2">
                      <p className="text-slate-800 dark:text-slate-300 font-semibold">Step 2: Plug into Circle Standard Equation</p>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/90 rounded-xl text-center border border-slate-200 dark:border-slate-800/80">
                        <MathRenderer content="$$(x - h)^2 + (y - k)^2 = r^2$$" />
                      </div>
                    </div>
                  )}
                  {aiStep === 3 && (
                    <div className="space-y-2">
                      <p className="text-slate-800 dark:text-slate-300 font-semibold">Step 3: Simplify signs and square radius</p>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/90 rounded-xl text-center text-teal-700 dark:text-emerald-400 font-bold border border-slate-200 dark:border-slate-800/80">
                        <MathRenderer content="$$(x - 2)^2 + (y + 5)^2 = 49$$" />
                      </div>
                    </div>
                  )}
                </div>
              </CardItem>
            </BentoCard>
          </ScrollReveal>

          {/* Bento Card 3: Adaptive Study Planner (Col 5) */}
          <ScrollReveal className="lg:col-span-5 h-full" delay={300} threshold={0.1}>
            <BentoCard glowColor="emerald" className="h-full">
              <div className="w-full">
                <CardItem translateZ="50" className="w-full flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">Countdown Engine</span>
                </CardItem>

                <CardItem
                  as="h4"
                  translateZ="60"
                  className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover/card:text-emerald-600 dark:group-hover/card:text-emerald-300 transition-colors"
                >
                  3. Adaptive Study Planner
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="40"
                  className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6"
                >
                  Set your target score & test date. Our diagnostic engine automatically creates a weekly roadmap tailored to your specific weak points.
                </CardItem>
              </div>

              <CardItem
                translateZ="75"
                className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Days to Exam:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{plannerDays} Days Left</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="90"
                  value={plannerDays}
                  onChange={(e) => setPlannerDays(Number(e.target.value))}
                  className="w-full accent-emerald-600 dark:accent-emerald-500 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm">
                    <span className="text-slate-500 block">Weekly Pace</span>
                    <span className="font-bold text-slate-900 dark:text-white">4.5 hrs / week</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm">
                    <span className="text-slate-500 block">Focus Topic</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Advanced Math</span>
                  </div>
                </div>
              </CardItem>
            </BentoCard>
          </ScrollReveal>

          {/* Bento Card 4: Leaderboard & Streak Tracker (Col 7) */}
          <ScrollReveal className="lg:col-span-7 h-full" delay={400} threshold={0.1}>
            <BentoCard glowColor="emerald" className="h-full">
              <div className="w-full">
                <CardItem translateZ="50" className="w-full flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <Flame className="w-6 h-6 fill-emerald-500 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" />
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1 rounded-full font-bold">
                    <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Global Top 5%</span>
                  </div>
                </CardItem>

                <CardItem
                  as="h4"
                  translateZ="60"
                  className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover/card:text-emerald-600 dark:group-hover/card:text-emerald-300 transition-colors"
                >
                  4. Real-Time Leaderboards & Daily Streaks
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="40"
                  className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6"
                >
                  Stay motivated by earning XP, unlocking badges like "Desmos Wizard", and competing with thousands of peers globally.
                </CardItem>
              </div>

              <CardItem
                translateZ="75"
                className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2"
              >
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/30 shadow-sm">
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 w-4">#1</span>
                    <span className="text-base">⚡</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Alex Chen</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">34-Day Streak • 1590 Est.</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800/40">
                    14,850 XP
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-bold text-slate-500 dark:text-slate-400 w-4">#4</span>
                    <span className="text-base">🚀</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">You (Student)</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">12-Day Streak • 1480 Est.</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                    9,850 XP
                  </span>
                </div>
              </CardItem>
            </BentoCard>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

// ─── Internal BentoCard component with 3D perspective card container ────────────────
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'emerald' | 'teal';
}

const glowMap: Record<string, string> = {
  emerald: 'hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-[0_4px_30px_rgba(16,185,129,0.12)] dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.15]',
  teal: 'hover:border-teal-500/40 dark:hover:border-teal-500/50 hover:shadow-[0_4px_30px_rgba(20,184,166,0.12)] dark:hover:shadow-2xl dark:hover:shadow-teal-500/[0.15]',
};

const BentoCard: React.FC<BentoCardProps> = ({ children, className = '', glowColor = 'emerald' }) => (
  <CardContainer className="inter-var w-full h-full">
    <CardBody
      className={`bg-white/95 relative group/card dark:hover:shadow-2xl dark:bg-slate-900/90 dark:border-white/[0.15] border-black/[0.08] rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between shadow-[0_4px_20px_rgba(16,185,129,0.06)] h-full w-full border ${glowMap[glowColor]} ${className}`}
    >
      {children}
    </CardBody>
  </CardContainer>
);
