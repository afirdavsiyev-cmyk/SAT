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
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded-md bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">1</div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded-md bg-emerald-50 dark:bg-slate-800 border border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] flex items-center justify-center">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span>Answered</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded-md bg-amber-50 dark:bg-yellow-500/20 border border-amber-300 dark:border-yellow-500 text-amber-600 dark:text-yellow-400 font-bold text-[10px] flex items-center justify-center">
              <Bookmark className="w-3 h-3 fill-amber-500 dark:fill-yellow-400" />
            </div>
            <span>Marked for Review</span>
          </div>
        </div>

        {/* Grid of questions */}
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5 max-h-[320px] overflow-y-auto p-1">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = !!currentExamAnswers[q.id];
            const isMarked = markedForReview.includes(q.id);

            return (
              <button
                key={q.id}
                onClick={() => {
                  onSelectQuestion(idx);
                  onClose();
                }}
                className={`relative h-11 rounded-2xl font-bold text-xs flex items-center justify-center transition-all duration-200 active:scale-95 ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 shadow-sm ring-2 ring-emerald-400 scale-105 font-extrabold'
                    : isAnswered
                    ? 'bg-emerald-50 dark:bg-slate-950 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{q.number}</span>

                {/* Bookmark indicator */}
                {isMarked && (
                  <Bookmark className="w-3.5 h-3.5 absolute top-1 right-1 fill-amber-500 text-amber-500 dark:fill-yellow-400 dark:text-yellow-400" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
