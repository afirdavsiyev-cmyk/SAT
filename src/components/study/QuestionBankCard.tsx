import React from 'react';
import { QuestionItem } from '../../types/questionBank';
import { MathRenderer } from '../common/MathRenderer';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Bookmark,
  ArrowRight,
  Calculator,
  Compass,
  Layers,
  HelpCircle
} from 'lucide-react';

interface QuestionBankCardProps {
  question: QuestionItem;
  onSolve: (question: QuestionItem) => void;
  isSolved?: boolean;
  isCorrect?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (questionId: string, e: React.MouseEvent) => void;
}

export const QuestionBankCard: React.FC<QuestionBankCardProps> = ({
  question,
  onSolve,
  isSolved = false,
  isCorrect = false,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  // Difficulty color styling
  const difficultyBadgeClasses = {
    Easy: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    Medium: 'bg-amber-950/80 text-amber-300 border-amber-800/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    Hard: 'bg-rose-950/80 text-rose-400 border-rose-800/60 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
  };

  const domainColorClasses: Record<string, string> = {
    'Algebra': 'text-emerald-400 border-emerald-800/40 bg-emerald-950/40',
    'Advanced Math': 'text-teal-300 border-teal-800/40 bg-teal-950/40',
    'Problem-Solving & Data Analysis': 'text-cyan-300 border-cyan-800/40 bg-cyan-950/40',
    'Geometry & Trigonometry': 'text-indigo-300 border-indigo-800/40 bg-indigo-950/40',
  };

  return (
    <div
      onClick={() => onSolve(question)}
      className="group relative rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
      style={{
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 8px 32px rgba(0, 0, 0, 0.35)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.35)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 12px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(16, 185, 129, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 8px 32px rgba(0, 0, 0, 0.35)';
      }}
    >
      {/* Top Header Row: Domain / Topic / Difficulty / Bookmark */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center flex-wrap gap-2">
            {/* Domain Pill */}
            <span
              className={`px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide rounded-xl border ${
                domainColorClasses[question.domain] || 'text-slate-300 border-slate-700 bg-slate-900'
              }`}
            >
              {question.domain}
            </span>

            {/* Difficulty Pill */}
            <span
              className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-lg border ${
                difficultyBadgeClasses[question.difficulty]
              }`}
            >
              {question.difficulty}
            </span>

            {/* Question Type Pill */}
            <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-lg hidden sm:inline-block">
              {question.type === 'multiple_choice' ? 'Multiple Choice' : 'Grid-In'}
            </span>
          </div>

          {/* Right Actions: Solved status & Bookmark */}
          <div className="flex items-center space-x-2">
            {isSolved && (
              <span
                className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono border ${
                  isCorrect
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                    : 'bg-rose-950/80 text-rose-400 border-rose-700/60'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Solved</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 text-rose-400" />
                    <span>Attempted</span>
                  </>
                )}
              </span>
            )}

            {onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => onToggleBookmark(question.id, e)}
                className={`p-1.5 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-white hover:bg-white/[0.08]'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Save Question'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Topic & Source line */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="font-semibold text-slate-300 truncate max-w-[280px]">
            {question.topic}
          </span>
          <span className="font-mono text-[10px] text-slate-500 flex-shrink-0">
            {question.id.toUpperCase()}
          </span>
        </div>

        {/* Question Prompt with KaTeX Math Rendering */}
        <div className="py-2 text-slate-100 text-sm leading-relaxed border-t border-white/[0.06]">
          <MathRenderer content={question.question} />
        </div>

        {/* Multiple Choice Options Preview (if MC) */}
        {question.options && question.options.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {question.options.map((opt) => (
              <div
                key={opt.id}
                className="px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs flex items-center space-x-2 text-slate-300 overflow-hidden"
              >
                <span className="w-4 h-4 rounded-md bg-white/[0.08] text-[10px] font-mono font-bold flex items-center justify-center text-slate-200 flex-shrink-0">
                  {opt.id}
                </span>
                <span className="truncate font-mono text-xs">
                  <MathRenderer content={opt.text} inline />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Source & Interactive CTA */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 truncate max-w-[220px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="truncate">{question.source}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSolve(question);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-bold transition-all flex items-center space-x-1.5 group-hover:border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.15)] active:scale-95"
        >
          <span>Solve</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
