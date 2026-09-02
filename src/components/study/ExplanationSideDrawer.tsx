import React from 'react';
import { QuestionItem } from '../../types/questionBank';
import { MathRenderer } from '../common/MathRenderer';
import {
  X,
  FileText,
  Calculator,
  Bot,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface ExplanationSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuestionItem;
  isCorrect?: boolean;
  isAnswered?: boolean;
  onAskAiTutor: () => void;
}

export const ExplanationSideDrawer: React.FC<ExplanationSideDrawerProps> = ({
  isOpen,
  onClose,
  question,
  isCorrect,
  isAnswered,
  onAskAiTutor,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      className="w-full md:w-[440px] lg:w-[490px] xl:w-[540px] border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0c121e]/95 text-slate-900 dark:text-slate-100 backdrop-blur-xl h-full overflow-y-auto p-6 transition-all duration-300 flex-shrink-0 z-20 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right-4 duration-200"
    >
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Step-by-Step Explanation
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {question.topic}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.12] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/[0.08]"
            title="Close explanation (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Answer Status Pill */}
        {isAnswered && (
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-500/50 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              )}
              <span className="font-bold">
                {isCorrect
                  ? 'Your answer is correct!'
                  : `Correct Answer: (${question.correctAnswer})`}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 font-bold">
              {question.difficulty}
            </span>
          </div>
        )}

        {/* Mathematical Resolution Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center space-x-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Mathematical Solution</span>
          </h4>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-3 shadow-inner">
            <MathRenderer content={question.explanation} />
          </div>
        </div>

        {/* Desmos Speed Shortcut (if present) */}
        {question.desmosTip && (
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-slate-950/80 border border-teal-200 dark:border-teal-800/40 space-y-2">
            <div className="flex items-center space-x-2 text-teal-800 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Desmos Shortcut Strategy</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {question.desmosTip}
            </p>
          </div>
        )}

        {/* Question Hint (if present) */}
        {question.hint && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 space-y-1">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block">
              Key Concept Hint:
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <MathRenderer content={question.hint} inline />
            </p>
          </div>
        )}

      </div>

      {/* Footer AI Tutor Launch Shortcut */}
      <div className="pt-6 mt-6 border-t border-slate-200 dark:border-white/[0.08]">
        <button
          type="button"
          onClick={onAskAiTutor}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(139,92,246,0.35)]"
        >
          <Bot className="w-4 h-4" />
          <span>Ask ScoreUP AI about this solution</span>
        </button>
      </div>

    </aside>
  );
};
