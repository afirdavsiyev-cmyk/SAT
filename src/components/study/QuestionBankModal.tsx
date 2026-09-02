import React, { useState, useEffect } from 'react';
import { QuestionItem } from '../../types/questionBank';
import { MathRenderer } from '../common/MathRenderer';
import {
  X,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calculator,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Send,
  Bookmark,
  Award,
  Lightbulb
} from 'lucide-react';

interface QuestionBankModalProps {
  question: QuestionItem;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onRecordResult?: (questionId: string, isCorrect: boolean, selectedAnswer: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (questionId: string) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  question,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  hasPrevious = false,
  hasNext = false,
  onRecordResult,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [studentInput, setStudentInput] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption('');
    setStudentInput('');
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowHint(false);
  }, [question?.id]);

  // Keyboard shortcut support (Escape to close, Left/Right for pagination)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasNext, hasPrevious, onNext, onPrevious, onClose]);

  if (!isOpen || !question) return null;

  const handleCheckAnswer = () => {
    if (question.type === 'multiple_choice') {
      if (!selectedOption) return;
      const correct = selectedOption.trim().toUpperCase() === question.correctAnswer.trim().toUpperCase();
      setIsCorrect(correct);
      setIsSubmitted(true);
      setShowExplanation(true);
      if (onRecordResult) {
        onRecordResult(question.id, correct, selectedOption);
      }
    } else {
      if (!studentInput.trim()) return;
      // Normalize comparison for fractions, decimals, or simple numbers
      const userAns = studentInput.trim().toLowerCase().replace(/\s+/g, '');
      const correctAns = question.correctAnswer.trim().toLowerCase().replace(/\s+/g, '');
      
      let correct = userAns === correctAns;

      // Handle equivalent fractions / decimals (e.g. 5/13 or 0.3846)
      if (!correct && userAns.includes('/') && correctAns.includes('/')) {
        const [uNum, uDen] = userAns.split('/').map(Number);
        const [cNum, cDen] = correctAns.split('/').map(Number);
        if (uDen && cDen && Math.abs(uNum / uDen - cNum / cDen) < 0.0001) {
          correct = true;
        }
      }

      setIsCorrect(correct);
      setIsSubmitted(true);
      setShowExplanation(true);
      if (onRecordResult) {
        onRecordResult(question.id, correct, studentInput);
      }
    }
  };

  const handleReset = () => {
    setSelectedOption('');
    setStudentInput('');
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowHint(false);
  };

  const difficultyBadgeClasses = {
    Easy: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    Medium: 'bg-amber-950/80 text-amber-300 border-amber-800/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    Hard: 'bg-rose-950/80 text-rose-400 border-rose-800/60 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div
        className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl relative"
        style={{
          background: 'rgba(11, 17, 32, 0.95)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950/80 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0">
          
          {/* Left: Domain, Topic & Difficulty badges */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wide">
              {question.domain}
            </span>

            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase border ${difficultyBadgeClasses[question.difficulty]}`}>
              {question.difficulty}
            </span>

            <span className="text-[11px] text-slate-400 font-semibold hidden md:inline truncate max-w-[200px]">
              {question.topic}
            </span>
          </div>

          {/* Right: Bookmark, Prev/Next & Close */}
          <div className="flex items-center space-x-2">
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(question.id)}
                className={`p-2 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Save Question'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            )}

            <div className="flex items-center space-x-1 border-l border-white/[0.08] pl-2">
              <button
                type="button"
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Previous Question"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Next Question"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] text-slate-400 hover:text-white transition-all ml-1"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Question Source metadata banner */}
          <div className="flex items-center justify-between text-xs text-slate-400 bg-white/[0.02] border border-white/[0.05] px-3.5 py-2 rounded-xl">
            <span className="font-mono text-slate-300 font-semibold">{question.source}</span>
            <span className="font-mono text-[11px] text-slate-500">ID: {question.id.toUpperCase()}</span>
          </div>

          {/* Question Prompt with KaTeX */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-slate-100 text-base leading-relaxed shadow-inner">
            <MathRenderer content={question.question} />
          </div>

          {/* Interactive Response Area */}
          <div className="space-y-4">
            
            {/* Multiple Choice Options */}
            {question.type === 'multiple_choice' && question.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const isAnswerCorrect = opt.id === question.correctAnswer;
                  
                  let optionClass = 'bg-white/[0.04] border-white/[0.08] text-slate-200 hover:bg-white/[0.08] hover:border-white/[0.18]';
                  let badgeClass = 'bg-white/[0.08] text-slate-300';

                  if (isSubmitted) {
                    if (isAnswerCorrect) {
                      optionClass = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-semibold';
                      badgeClass = 'bg-emerald-500 text-slate-950 font-bold';
                    } else if (isSelected && !isAnswerCorrect) {
                      optionClass = 'bg-rose-500/20 border-rose-500/60 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.25)]';
                      badgeClass = 'bg-rose-500 text-white font-bold';
                    }
                  } else if (isSelected) {
                    optionClass = 'bg-emerald-500/15 border-emerald-400/60 text-emerald-300 shadow-[0_0_22px_rgba(16,185,129,0.25)] font-semibold';
                    badgeClass = 'bg-emerald-400 text-slate-950 font-bold';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center space-x-3 group active:scale-[0.98] ${optionClass}`}
                    >
                      <span className={`w-7 h-7 rounded-xl font-mono text-xs flex items-center justify-center transition-all flex-shrink-0 ${badgeClass}`}>
                        {opt.id}
                      </span>
                      <div className="flex-1 text-sm font-medium">
                        <MathRenderer content={opt.text} inline />
                      </div>
                      {isSubmitted && isAnswerCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isAnswerCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Student Produced Grid-In Input */}
            {question.type === 'student_produced' && (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3 overflow-hidden">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Enter your numerical or fractional answer:
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full mt-3">
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    placeholder="e.g. 15, 5/13, 0.75"
                    className="flex-1 min-w-0 px-4 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500 transition-all text-base disabled:opacity-75"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSubmitted) {
                        handleCheckAnswer();
                      }
                    }}
                  />
                  {!isSubmitted && (
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      Press Enter or "Check Answer"
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Feedback Banner (After checking answer) */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 animate-in fade-in duration-300 ${
                isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    {isCorrect ? 'Correct! Excellent work.' : 'Incorrect.'}
                  </h4>
                  <p className="text-xs opacity-90 mt-0.5">
                    {isCorrect
                      ? `Great job mastering this ${question.difficulty.toLowerCase()} ${question.domain} problem.`
                      : `The correct answer is ${question.correctAnswer}. Review the step-by-step resolution below.`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-xs font-bold text-white transition-colors flex items-center space-x-1.5 flex-shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Step-by-Step Explanation Accordion / Card */}
          {showExplanation && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center space-x-2 text-emerald-400">
                <BookOpen className="w-4 h-4" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                  Step-by-Step Solution & Explanation
                </h3>
              </div>

              <div className="text-sm text-slate-200 leading-relaxed border-t border-slate-800 pt-3">
                <MathRenderer content={question.explanation} />
              </div>

              {/* Desmos Tip Box (if present) */}
              {question.desmosTip && (
                <div className="p-4 rounded-xl bg-slate-950 border border-teal-800/40 text-xs text-teal-300 flex items-start space-x-3">
                  <Calculator className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                      Desmos Shortcut Tip:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{question.desmosTip}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Optional Hint Dropdown (Before submitting) */}
          {!isSubmitted && question.hint && (
            <div className="pt-1">
              {!showHint ? (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors font-semibold"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Need a hint? Click here</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 flex items-start space-x-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-300 mb-0.5">Hint:</span>
                    <MathRenderer content={question.hint} inline />
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-4 bg-slate-950/80 border-t border-white/[0.08] flex items-center justify-between flex-shrink-0">
          
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showExplanation ? 'Hide Explanation' : 'View Explanation'}</span>
          </button>

          <div className="flex items-center space-x-2">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={question.type === 'multiple_choice' ? !selectedOption : !studentInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Check Answer</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-glow-emerald hover:bg-emerald-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5"
              >
                <span>Next Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
