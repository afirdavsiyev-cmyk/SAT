import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, PlayCircle, Star, CheckCircle, Calculator } from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';
import { HeroMoonSpotlight } from './HeroMoonSpotlight';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { Boxes } from '../ui/background-boxes';

export const HeroSection: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-x-clip bg-transparent">
      {/* Bright Theme Aceternity Background Boxes (Image 2 style integrated for bright theme) */}
      <div className="dark:hidden absolute inset-0 w-full h-full overflow-hidden pointer-events-auto z-0 select-none">
        <div 
          className="absolute inset-0 w-full h-full bg-white z-10 pointer-events-none"
          style={{
            maskImage: 'radial-gradient(ellipse at 50% 36%, transparent 10%, white 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 36%, transparent 10%, white 72%)',
          }}
        />
        <Boxes />
      </div>

      {/* Interactive Hanging Moon Mascot with Dynamic Flashlight Cursor Tracking */}
      <div className="absolute top-1 left-2 sm:left-8 z-20 pointer-events-none">
        <HeroMoonSpotlight />
      </div>

      {/* Glow Orbs background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-sky-500/12 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-100/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.15)] dark:shadow-[0_0_20px_rgba(16,185,129,0.15)] mb-8 animate-float">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>NEW: 2026/2027 Official Digital SAT Math Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1] font-sans">
          Feel like an SAT <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
            Math Master
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Train inside an exact replica of College Board's <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Bluebook test room</span> with built-in Desmos shortcuts, <span className="text-teal-700 dark:text-teal-300 font-semibold">ScoreUP AI</span> tutor, and step-by-step KaTeX math breakdowns.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 dark:text-slate-950 font-extrabold text-base shadow-[0_4px_14px_rgba(16,185,129,0.35)] dark:shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 group"
          >
            <PlayCircle className="w-5 h-5 fill-white stroke-emerald-600 dark:fill-slate-950 dark:stroke-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Start Practice</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setCurrentView('onboarding')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-white hover:bg-emerald-50/60 dark:hover:bg-slate-800/90 font-bold text-base transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(16,185,129,0.08)]"
          >
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Create Study Roadmap</span>
          </button>
        </div>

        {/* Micro Trust Indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>100% Free Practice Tests</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Desmos v1.9 Embedded API</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Official College Board Scoring</span>
          </div>
        </div>

        {/* ─── Interactive 3D Perspective Floating Preview Card (3D Card Style) ─── */}
        <CardContainer className="inter-var w-full mt-10">
          <CardBody className="bg-white/95 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.12] dark:bg-slate-950/90 dark:border-white/[0.2] border-black/[0.1] w-full max-w-4xl h-auto rounded-3xl p-6 sm:p-8 border shadow-xl transition-all text-left">
            
            {/* Header Bar */}
            <CardItem
              translateZ="40"
              className="w-full flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-6"
            >
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono ml-2">Section 2: Math (Module 1) • Question 1 of 5</span>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/50 px-3 py-1 rounded-full text-xs text-emerald-900 dark:text-emerald-300 font-medium">
                <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 dark:fill-emerald-500 dark:text-emerald-500" />
                <span>ScoreUP AI Active</span>
              </div>
            </CardItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <CardItem
                  translateZ="50"
                  className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-800/40 inline-block mb-3"
                >
                  Advanced Math
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="45"
                  className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed mb-4"
                >
                  Find the minimum value of the quadratic function below for all real numbers x:
                </CardItem>
                <CardItem
                  translateZ="75"
                  className="w-full p-4 bg-emerald-50/40 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-center mb-4 text-emerald-800 dark:text-emerald-300 shadow-sm"
                >
                  <MathRenderer content="$$f(x) = x^2 - 6x + 13$$" />
                </CardItem>
              </div>

              <CardItem
                translateZ="60"
                className="w-full bg-emerald-50/30 dark:bg-slate-900/60 rounded-2xl p-4 border border-emerald-500/20 dark:border-emerald-500/20 text-xs space-y-3"
              >
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="flex items-center space-x-1 text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ScoreUP AI Instant Solution</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Step-by-step</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  Complete the square to express f(x) in vertex form (x - h)² + k:
                </p>
                <CardItem
                  translateZ="90"
                  className="w-full p-2 bg-white dark:bg-slate-950 rounded-xl text-emerald-800 dark:text-emerald-300 text-center border border-slate-200 dark:border-slate-800/80 shadow-md"
                >
                  <MathRenderer content="$$f(x) = (x - 3)^2 + 4$$" />
                </CardItem>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Since (x - 3)² ≥ 0, the minimum value is f(3) = 4.
                </p>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>

      </div>
    </section>
  );
};
