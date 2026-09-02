import React, { useState } from 'react';
import { X, Bookmark, Check, HelpCircle, Layers } from 'lucide-react';
import { QuestionItem } from '../../types/questionBank';

export interface QuestionAttemptRecord {
  isAnswered: boolean;
  isCorrect: boolean;
  selectedAnswer: string;
  attemptsCount: number;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
  eliminatedOptions: string[];
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
  const [groupByAnswered, setGroupByAnswered] = useState(false);

  if (!isOpen) return null;

  // Compute status counts
  let correctCount = 0;
  let incorrectCount = 0;
  let reviewCount = 0;
  let answeredCount = 0;

  questions.forEach((q) => {
    const record = attemptsMap[q.id];
    if (record?.isAnswered) {
      answeredCount++;
      if (record.isCorrect) correctCount++;
      else incorrectCount++;
    }
    if (record?.isMarkedForReview) {
      reviewCount++;
    }
  });

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] relative"
        style={{
          background: 'rgba(11, 17, 32, 0.96)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Question Navigator</h3>
              <p className="text-xs text-slate-400 font-mono">
                {answeredCount} of {questions.length} Answered • {reviewCount} Marked for Review
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Group Answered Toggle */}
            <label className="hidden sm:flex items-center space-x-2 text-xs text-slate-300 cursor-pointer bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.08]">
              <input
                type="checkbox"
                checked={groupByAnswered}
                onChange={(e) => setGroupByAnswered(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0 accent-emerald-500 cursor-pointer"
              />
              <span className="font-semibold text-[11px]">Group Answered</span>
            </label>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Legend Bar */}
        <div className="px-5 py-3 bg-slate-950/50 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center space-x-4 flex-wrap gap-y-1.5">
            {/* Correct */}
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
              <span className="text-slate-300 text-[11px]">Correct ({correctCount})</span>
            </div>

            {/* Incorrect */}
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
                ✕
              </span>
              <span className="text-slate-300 text-[11px]">Incorrect ({incorrectCount})</span>
            </div>

            {/* For Review */}
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center text-[10px]">
                <Bookmark className="w-2.5 h-2.5 fill-slate-950" />
              </span>
              <span className="text-slate-300 text-[11px]">For Review ({reviewCount})</span>
            </div>

            {/* Unanswered */}
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-white/[0.08] border border-white/[0.15]" />
              <span className="text-slate-400 text-[11px]">Unanswered</span>
            </div>
          </div>
        </div>

        {/* Scrollable Question Number Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[55vh] scrollbar-thin scrollbar-thumb-slate-800">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5">
            {displayedQuestionIndices.map((origIdx) => {
              const q = questions[origIdx];
              const record = attemptsMap[q.id];
              const isCurrent = origIdx === currentIndex;
              const isAnswered = record?.isAnswered;
              const isCorrect = record?.isCorrect;
              const isMarked = record?.isMarkedForReview;
              const hasMultipleAttempts = (record?.attemptsCount || 0) > 1;

              // Determine pill styling
              let pillStyle = 'bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.09]';
              let badgeIndicator: React.ReactNode = null;

              if (isAnswered) {
                if (isCorrect) {
                  if (hasMultipleAttempts) {
                    // Correct after previous incorrect attempts
                    pillStyle = 'bg-amber-500/25 border-amber-500/60 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)] font-bold';
                  } else {
                    // Correct on first attempt
                    pillStyle = 'bg-emerald-500/25 border-emerald-500/60 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)] font-bold';
                  }
                } else {
                  // Incorrect
                  pillStyle = 'bg-rose-500/25 border-rose-500/60 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.25)] font-bold';
                }
              }

              if (isCurrent) {
                pillStyle += ' ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 font-extrabold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    onSelectIndex(origIdx);
                    onClose();
                  }}
                  className={`relative aspect-square rounded-2xl border flex flex-col items-center justify-center text-sm font-mono transition-all duration-150 active:scale-90 group ${pillStyle}`}
                >
                  <span>{origIdx + 1}</span>

                  {/* Top-Right Review Bookmark Flag */}
                  {isMarked && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                      <Bookmark className="w-2.5 h-2.5 fill-slate-950" />
                    </span>
                  )}

                  {/* Bottom Status Dot */}
                  {isAnswered && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        isCorrect ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
          <span>Click any question number to jump immediately.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
