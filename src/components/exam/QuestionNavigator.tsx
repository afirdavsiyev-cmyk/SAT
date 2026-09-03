import React from 'react';
import { Bookmark, Check, Grid, X } from 'lucide-react';
import { Question } from '../../types';
import { useApp } from '../../context/AppContext';

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  onSelectQuestion,
  isOpen,
  onClose
}) => {
  const { currentExamAnswers, markedForReview } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Question Navigator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Section 2: Math (Module 1)</p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 font-mono">
          <div className="flex items-center space-x-3 flex-wrap gap-y-1">
            <span className="text-slate-400 text-[11px] font-bold uppercase">Difficulty:</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-[#D1FAE5] dark:bg-emerald-950/60 border border-[#A7F3D0] dark:border-emerald-500/40" />
              <span className="text-[#047857] dark:text-emerald-400 text-[11px] font-bold">Easy</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-[#FEF3C7] dark:bg-amber-950/60 border border-[#FDE68A] dark:border-amber-500/40" />
              <span className="text-[#B45309] dark:text-amber-400 text-[11px] font-bold">Medium</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-[#FFE4E6] dark:bg-rose-950/60 border border-[#FECDD3] dark:border-rose-500/40" />
              <span className="text-[#E11D48] dark:text-rose-400 text-[11px] font-bold">Hard</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-wrap gap-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center">
                <Bookmark className="w-2 h-2 fill-slate-950 text-slate-950" />
              </span>
              <span>Review</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold border border-slate-900">✓</span>
              <span>Answered</span>
            </div>
          </div>
        </div>

        {/* Grid of questions */}
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5 max-h-[320px] overflow-y-auto p-1">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = !!currentExamAnswers[q.id];
            const isMarked = markedForReview.includes(q.id);

            // Base style derived from question difficulty
            const difficultyClasses: Record<string, string> = {
              easy: 'bg-[#D1FAE5] dark:bg-emerald-950/40 text-[#047857] dark:text-emerald-400 border-[#A7F3D0] dark:border-emerald-500/30',
              medium: 'bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-amber-400 border-[#FDE68A] dark:border-amber-500/30',
              hard: 'bg-[#FFE4E6] dark:bg-rose-950/40 text-[#E11D48] dark:text-rose-400 border-[#FECDD3] dark:border-rose-500/30'
            };
            const diffKey = (q.difficulty?.toLowerCase() || 'medium');
            const difficultyClass = difficultyClasses[diffKey] || difficultyClasses.medium;

            return (
              <button
                key={q.id || idx}
                type="button"
                onClick={() => {
                  onSelectQuestion(idx);
                  onClose();
                }}
                className={`relative h-11 rounded-2xl font-bold text-xs flex items-center justify-center transition-all duration-200 active:scale-95 border ${difficultyClass} ${
                  isCurrent
                    ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 scale-105 shadow-md z-10'
                    : 'hover:opacity-90 hover:scale-[1.02]'
                }`}
              >
                <span>{q.number || idx + 1}</span>

                {/* Bookmark indicator */}
                {isMarked && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-slate-900 flex items-center justify-center shadow-md">
                    <Bookmark className="w-2 h-2 fill-slate-950 text-slate-950" />
                  </span>
                )}

                {/* Answered indicator */}
                {isAnswered && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold border-2 border-slate-900 shadow-sm">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
