import React from 'react';
import { VideoLesson } from '../../data/videoLessonsData';
import { KaTeXRenderer } from '../common/KaTeXRenderer';
import { Calculator, Sparkles, Lightbulb, Compass, Zap } from 'lucide-react';

interface GeometricWingsProps {
  lesson: VideoLesson;
}

export const LessonLeftWing: React.FC<GeometricWingsProps> = ({ lesson }) => {
  const formulas = lesson.theory?.formulas || [];

  return (
    <div className="hidden lg:flex flex-col justify-between w-56 xl:w-64 2xl:w-72 shrink-0 self-stretch min-h-[440px] max-h-[500px] p-4 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-lg shadow-emerald-500/5 transition-all space-y-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold border border-emerald-500/20">
          <Calculator className="w-3.5 h-3.5" />
          <span>GEOMETRIC MODELS</span>
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>

      {/* Domain-specific dynamic Geometric SVG Graphic */}
      <div className="relative w-full h-44 rounded-2xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 p-3 flex items-center justify-center overflow-hidden">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-15 dark:opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {lesson.domain === 'algebra' && (
          <svg className="w-full h-full text-emerald-600 dark:text-emerald-400" viewBox="0 0 160 120" fill="none">
            {/* Coordinate Axes */}
            <line x1="15" y1="95" x2="145" y2="95" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
            <line x1="30" y1="15" x2="30" y2="105" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
            {/* Slope Triangle */}
            <path d="M 45 80 L 115 80 L 115 35 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            <text x="75" y="90" fontSize="8" fill="currentColor" opacity="0.7">Δx</text>
            <text x="120" y="60" fontSize="8" fill="currentColor" opacity="0.7">Δy</text>
            {/* Main Linear Function Line */}
            <line x1="25" y1="95" x2="135" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Points on Line */}
            <circle cx="45" cy="80" r="3" fill="#10b981" />
            <circle cx="115" cy="35" r="3" fill="#10b981" />
            <text x="35" y="25" fontSize="9" fontWeight="bold" fill="currentColor">y = mx + b</text>
          </svg>
        )}

        {lesson.domain === 'advanced_math' && (
          <svg className="w-full h-full text-purple-600 dark:text-purple-400" viewBox="0 0 160 120" fill="none">
            {/* Coordinate Axes */}
            <line x1="10" y1="80" x2="150" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="80" y1="15" x2="80" y2="110" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            {/* Axis of Symmetry */}
            <line x1="80" y1="15" x2="80" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            {/* Parabola Curve */}
            <path d="M 25 15 Q 80 125 135 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Vertex Point */}
            <circle cx="80" cy="70" r="3.5" fill="#a855f7" />
            <text x="88" y="72" fontSize="8" fontWeight="bold" fill="currentColor">Vertex (h, k)</text>
            {/* Roots */}
            <circle cx="50" cy="80" r="2.5" fill="currentColor" opacity="0.8" />
            <circle cx="110" cy="80" r="2.5" fill="currentColor" opacity="0.8" />
            <text x="25" y="105" fontSize="8" fill="currentColor" opacity="0.8">y = a(x-h)² + k</text>
          </svg>
        )}

        {lesson.domain === 'geometry_trig' && (
          <svg className="w-full h-full text-teal-600 dark:text-teal-400" viewBox="0 0 160 120" fill="none">
            {/* Right Triangle */}
            <polygon points="30,95 130,95 130,25" stroke="currentColor" strokeWidth="2.2" fill="currentColor" fillOpacity="0.08" />
            {/* Right Angle Box */}
            <polyline points="120,95 120,85 130,85" stroke="currentColor" strokeWidth="1.2" />
            {/* Angle Theta Arc */}
            <path d="M 50 95 A 20 20 0 0 0 46 86" stroke="currentColor" strokeWidth="1.5" />
            <text x="54" y="90" fontSize="9" fill="currentColor">θ</text>
            {/* Side Labels */}
            <text x="75" y="107" fontSize="8" fill="currentColor" opacity="0.8">Adjacent (x)</text>
            <text x="135" y="65" fontSize="8" fill="currentColor" opacity="0.8">Opp (y)</text>
            <text x="65" y="50" fontSize="8" fontWeight="bold" fill="currentColor">Hyp (r)</text>
          </svg>
        )}

        {(lesson.domain === 'problem_solving' || lesson.domain === 'course_intro') && (
          <svg className="w-full h-full text-amber-600 dark:text-amber-400" viewBox="0 0 160 120" fill="none">
            {/* Scatterplot or Bell Curve */}
            <line x1="20" y1="100" x2="145" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="20" y1="15" x2="20" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            {/* Trendline */}
            <line x1="30" y1="85" x2="135" y2="25" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
            {/* Data Points */}
            <circle cx="40" cy="80" r="2.5" fill="currentColor" />
            <circle cx="55" cy="70" r="2.5" fill="currentColor" />
            <circle cx="70" cy="65" r="2.5" fill="currentColor" />
            <circle cx="85" cy="50" r="2.5" fill="currentColor" />
            <circle cx="105" cy="45" r="2.5" fill="currentColor" />
            <circle cx="120" cy="30" r="2.5" fill="currentColor" />
            <text x="35" y="25" fontSize="8" fontWeight="bold" fill="currentColor">Linear Model ŷ = mx + b</text>
          </svg>
        )}
      </div>

      {/* Formula Pills */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Core Formulas
        </span>
        <div className="space-y-2">
          {formulas.slice(0, 2).map((f, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 transition-all hover:border-emerald-500/40"
            >
              <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 truncate mb-1">
                {f.label}
              </div>
              <div className="text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto py-0.5">
                <KaTeXRenderer math={f.latex} inline={false} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick SAT Insight */}
      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed flex items-start space-x-2">
        <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <span>Use Desmos to verify graphs and intercept values without manual calculation errors.</span>
      </div>
    </div>
  );
};

export const LessonRightWing: React.FC<GeometricWingsProps> = ({ lesson }) => {
  const formulas = lesson.theory?.formulas || [];
  const secondaryFormula = formulas.length > 2 ? formulas[2] : (formulas[1] || formulas[0]);

  return (
    <div className="hidden lg:flex flex-col justify-between w-56 xl:w-64 2xl:w-72 shrink-0 self-stretch min-h-[440px] max-h-[500px] p-4 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-lg shadow-teal-500/5 transition-all space-y-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[11px] font-extrabold border border-teal-500/20">
          <Compass className="w-3.5 h-3.5" />
          <span>SAT QUICK CHEAT-SHEET</span>
        </span>
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
      </div>

      {/* Second Geometric Figure: 3D Wireframe / Circle / Angle Transversal */}
      <div className="relative w-full h-44 rounded-2xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 p-3 flex items-center justify-center overflow-hidden">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-15 dark:opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {lesson.domain === 'geometry_trig' ? (
          <svg className="w-full h-full text-emerald-600 dark:text-emerald-400" viewBox="0 0 160 120" fill="none">
            {/* Circle with Tangent & Radius */}
            <circle cx="75" cy="60" r="38" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
            <line x1="75" y1="60" x2="113" y2="60" stroke="currentColor" strokeWidth="2" />
            <line x1="113" y1="15" x2="113" y2="105" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Right Angle Symbol at Tangency */}
            <polyline points="107,60 107,54 113,54" stroke="currentColor" strokeWidth="1" />
            <circle cx="75" cy="60" r="3" fill="#10b981" />
            <circle cx="113" cy="60" r="3" fill="#10b981" />
            <text x="85" y="55" fontSize="8" fontWeight="bold" fill="currentColor">r ⊥ Tangent</text>
            <text x="35" y="112" fontSize="8" fill="currentColor">(x - h)² + (y - k)² = r²</text>
          </svg>
        ) : (
          <svg className="w-full h-full text-teal-600 dark:text-teal-400" viewBox="0 0 160 120" fill="none">
            {/* 3D Cylinder Wireframe */}
            <ellipse cx="80" cy="30" rx="45" ry="14" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
            <line x1="35" y1="30" x2="35" y2="90" stroke="currentColor" strokeWidth="2" />
            <line x1="125" y1="30" x2="125" y2="90" stroke="currentColor" strokeWidth="2" />
            <path d="M 35 90 A 45 14 0 0 0 125 90" stroke="currentColor" strokeWidth="2" />
            <path d="M 35 90 A 45 14 0 0 1 125 90" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            {/* Center Axis */}
            <line x1="80" y1="30" x2="80" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
            <text x="85" y="65" fontSize="8" fill="currentColor">h</text>
            <text x="50" y="27" fontSize="8" fill="currentColor">r</text>
            <text x="45" y="115" fontSize="9" fontWeight="bold" fill="currentColor">V = πr²h</text>
          </svg>
        )}
      </div>

      {/* Extra Formula or Desmos Tip */}
      {secondaryFormula && (
        <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
          <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
            {secondaryFormula.label}
          </div>
          <div className="text-xs font-mono text-slate-800 dark:text-slate-200 py-0.5 overflow-x-auto">
            <KaTeXRenderer math={secondaryFormula.latex} inline={false} />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            {secondaryFormula.description}
          </p>
        </div>
      )}

      {/* Desmos Power Tip */}
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
        <div className="flex items-center space-x-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
          <Zap className="w-3.5 h-3.5" />
          <span>DESMOS SPEED SHORTCUT</span>
        </div>
        <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed">
          {lesson.desmosTip || 'Graph equations directly to inspect roots and intersections in seconds.'}
        </p>
      </div>
    </div>
  );
};
