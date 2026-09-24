import React, { useState, useMemo } from 'react';
import { MathRenderer } from './MathRenderer';
import { parseExplanationSteps } from '../../utils/stepByStepExplanationEngine';
import {
  Sparkles,
  CheckCircle2,
  Calculator,
  Lightbulb,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export interface StepByStepExplanationViewProps {
  explanation: string;
  correctAnswer: string;
  options?: { id: string; text: string }[];
  topic?: string;
  difficulty?: string;
  desmosTip?: string;
  hint?: string;
  className?: string;
  showAiShortcut?: boolean;
  onAskAiTutor?: () => void;
}

export const StepByStepExplanationView: React.FC<StepByStepExplanationViewProps> = ({
  explanation,
  correctAnswer,
  options,
  topic,
  difficulty,
  desmosTip,
  hint,
  className = '',
  showAiShortcut = false,
  onAskAiTutor,
}) => {
  const [copied, setCopied] = useState(false);

  // Parse markdown explanation into individual logical steps
  const parsed = useMemo(() => {
    return parseExplanationSteps(explanation);
  }, [explanation]);

  // Find option text if multiple choice
  const correctOption = useMemo(() => {
    return options?.find((o) => o.id === correctAnswer);
  }, [options, correctAnswer]);

  const handleCopy = () => {
    if (!navigator.clipboard) return;
    const cleanText = explanation.replace(/\\\[/g, '').replace(/\\\]/g, '');
    navigator.clipboard.writeText(cleanText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`space-y-4 select-text ${className}`}>
      {/* ─── Step Overview & Actions Bar ────────────────────── */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {parsed.steps.length > 1 ? `${parsed.steps.length}-Step Solution Breakdown` : 'Mathematical Solution'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy explanation"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200/80 dark:border-white/[0.08]"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── Individual Structured Step Cards ─────────────────── */}
      <div className="space-y-3">
        {parsed.steps.map((step, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-4 transition-all bg-slate-50/90 dark:bg-[#0c121e]/80 border border-slate-200/90 dark:border-white/[0.08] shadow-sm hover:border-emerald-500/40 dark:hover:border-emerald-500/30 space-y-2.5"
          >
            {/* Step Header with Number Pill and Step Title */}
            <div className="flex items-center space-x-2.5">
              <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-500/30 font-mono text-[11px] font-extrabold shadow-sm">
                Step {step.stepNumber.toString().padStart(2, '0')}
              </span>
              <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                <MathRenderer content={step.title} inline />
              </h5>
            </div>

            {/* Step Mathematical Work / Content */}
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
              <MathRenderer content={step.content} />
            </div>
          </div>
        ))}
      </div>

      {/* ─── Conclusion & Correct Answer Confirmation Banner ──── */}
      <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-extrabold uppercase tracking-wider">
              Correct Answer Verification
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 text-xs font-mono font-extrabold shadow-sm">
            {options?.length ? `Choice (${correctAnswer})` : `Answer: ${correctAnswer}`}
          </span>
        </div>

        {correctOption && (
          <div className="text-xs sm:text-sm font-semibold pl-6 text-emerald-900 dark:text-emerald-200">
            <MathRenderer content={correctOption.text} />
          </div>
        )}

        {parsed.conclusion && (
          <div className="text-xs text-emerald-800/90 dark:text-emerald-300/90 pl-6 leading-relaxed pt-1 border-t border-emerald-200/80 dark:border-emerald-800/40">
            <MathRenderer content={parsed.conclusion} />
          </div>
        )}
      </div>

      {/* ─── Desmos Shortcut Strategy (if available) ─────────── */}
      {desmosTip && (
        <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-slate-950/70 border border-teal-200/90 dark:border-teal-800/40 space-y-2">
          <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <span>Desmos Shortcut Strategy</span>
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans pl-6">
            <MathRenderer content={desmosTip} />
          </div>
        </div>
      )}

      {/* ─── Key Concept Hint (if available) ──────────────────── */}
      {hint && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-500/30 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>Key Concept Intuition</span>
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-5.5">
            <MathRenderer content={hint} />
          </div>
        </div>
      )}

      {/* ─── Optional Socratic AI Tutor Launch Button ─────────── */}
      {showAiShortcut && onAskAiTutor && (
        <button
          type="button"
          onClick={onAskAiTutor}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-md hover:shadow-violet-500/25"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask ScoreUP AI about this step-by-step breakdown</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default StepByStepExplanationView;
