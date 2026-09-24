import React, { useState, useEffect, useRef } from 'react';
import { QuestionItem } from '../../types/questionBank';

export interface QuestionAttemptRecord {
  isAnswered: boolean;
  isCorrect: boolean;
  selectedAnswer: string;
  attemptsCount: number;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
  eliminatedOptions: string[];
  wasPreviouslyMissed?: boolean;
  previousAnswer?: string;
}

interface PracticeRoomGridModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  attemptsMap: Record<string, QuestionAttemptRecord>;
}

export const PracticeRoomGridModal: React.FC<PracticeRoomGridModalProps> = ({
  isOpen,
  onClose,
  questions,
  currentIndex,
  onSelectIndex,
  attemptsMap,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [groupByAnswered, setGroupByAnswered] = useState(false);

  // Outside click dismissal: close when clicking outside popover and trigger button
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const trigger = document.getElementById('question-navigator-trigger');
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        (!trigger || !trigger.contains(event.target as Node))
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter or group questions
  const displayedQuestionIndices = questions.map((_, idx) => idx);
  if (groupByAnswered) {
    displayedQuestionIndices.sort((a, b) => {
      const recA = attemptsMap[questions[a].id]?.isAnswered ? 1 : 0;
      const recB = attemptsMap[questions[b].id]?.isAnswered ? 1 : 0;
      return recB - recA; // answered first
    });
  }

  return (
    <div
      ref={popoverRef}
      className="fixed bottom-16 left-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-[#0d131a] border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150 select-none text-slate-900 dark:text-slate-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Question Bank</h3>
          <span className="text-xs text-slate-500 font-mono">
            ({currentIndex + 1} of {questions.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGroupByAnswered((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
              groupByAnswered
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/60'
                : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900 dark:border-slate-700/60 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
            }`}
          >
            Group Answered
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Navigator"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Legend Row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pb-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" /> Easy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" /> Medium
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400" /> Hard
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> For Review
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> Mistake Retry
        </span>
      </div>

      {/* Compact Scrollable Question Matrix */}
      <div className="max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        <div className="grid grid-cols-6 gap-2">
          {displayedQuestionIndices.map((origIdx) => {
            const q = questions[origIdx];
            const record = attemptsMap[q.id];
            const isCurrent = origIdx === currentIndex;
            const isMarked = record?.isMarkedForReview || (q as any)?.isMarked;
            const isAnswered = record?.isAnswered;
            const isCorrect = record?.isCorrect;

            const diffClasses = {
              easy: 'bg-[#D1FAE5] dark:bg-emerald-950/40 text-[#047857] dark:text-emerald-400 border-[#A7F3D0] dark:border-emerald-500/30 hover:bg-[#A7F3D0]/60 dark:hover:bg-emerald-900/50',
              medium: 'bg-[#FEF3C7] dark:bg-amber-950/40 text-[#B45309] dark:text-amber-400 border-[#FDE68A] dark:border-amber-500/30 hover:bg-[#FDE68A]/60 dark:hover:bg-amber-900/50',
              hard: 'bg-[#FFE4E6] dark:bg-rose-950/40 text-[#E11D48] dark:text-rose-400 border-[#FECDD3] dark:border-rose-500/30 hover:bg-[#FECDD3]/60 dark:hover:bg-rose-900/50',
            }[(q.difficulty?.toLowerCase() || 'medium') as 'easy' | 'medium' | 'hard'] || 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';

            return (
              <button
                key={q.id || origIdx}
                type="button"
                onClick={() => {
                  onSelectIndex(origIdx);
                  onClose();
                }}
                className={`relative h-10 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${diffClasses} ${
                  isCurrent
                    ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 font-black scale-105 shadow-md z-10'
                    : 'active:scale-95'
                }`}
                title={`Question ${origIdx + 1} (${(q.difficulty || 'medium').toUpperCase()})${record?.wasPreviouslyMissed ? ' - Previously Missed' : ''}`}
              >
                <span>{origIdx + 1}</span>

                {/* Bookmark Indicator */}
                {isMarked && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-950 shadow-sm" />
                )}

                {/* Mistake Retry Indicator */}
                {record?.wasPreviouslyMissed && !isAnswered && (
                  <span
                    className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-950 shadow-sm"
                    title="Previously missed - retry chance"
                  />
                )}

                {/* Answer Status Indicator */}
                {isAnswered && (
                  <span
                    className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full flex items-center justify-center text-[7px] font-bold text-white border border-slate-950 ${
                      isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
