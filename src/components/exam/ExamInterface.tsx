import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BluebookHeader } from './BluebookHeader';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigator } from './QuestionNavigator';
import { DesmosModal } from './DesmosModal';
import { DesmosSplitPanel } from '../study/DesmosSplitPanel';
import { ReferenceSheetModal } from './ReferenceSheetModal';
import { ScratchpadCanvas } from './ScratchpadCanvas';
import { AITutorDrawer } from './AITutorDrawer';
import {
  ArrowLeft,
  ArrowRight,
  Grid,
  Send,
  Play,
  Pause,
  AlertTriangle,
  Loader2,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { playChime } from '../../services/audio';

export const ExamInterface: React.FC = () => {
  const {
    questions,
    finishExam,
    activeExamMode,
    currentModule,
    proceedToModule2,
    currentExamAnswers,
    markedForReview,
  } = useApp();

  const isFullExam = activeExamMode === 'full' && questions.length === 44;
  const moduleMinIndex = isFullExam ? (currentModule === 1 ? 0 : 22) : 0;
  const moduleMaxIndex = isFullExam ? (currentModule === 1 ? 21 : 43) : questions.length - 1;

  const [currentIndex, setCurrentIndex] = useState<number>(() => moduleMinIndex);

  // Sync index if module switches
  useEffect(() => {
    if (isFullExam) {
      if (currentModule === 1 && (currentIndex < 0 || currentIndex > 21)) {
        setCurrentIndex(0);
      } else if (currentModule === 2 && (currentIndex < 22 || currentIndex > 43)) {
        setCurrentIndex(22);
      }
    }
  }, [currentModule, isFullExam]);

  // Timer & Exam State
  const [secondsRemaining, setSecondsRemaining] = useState<number>(2100); // 35 minutes default
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTimeoutSubmitting, setIsTimeoutSubmitting] = useState<boolean>(false);
  const [timeoutMessage, setTimeoutMessage] = useState<string>('');
  const [show5MinBanner, setShow5MinBanner] = useState<boolean>(false);
  const [isIntermissionOpen, setIsIntermissionOpen] = useState<boolean>(false);

  // Ref flags to prevent double audio chime triggers
  const hasTriggered5Min = useRef<boolean>(false);
  const hasTriggered1Min = useRef<boolean>(false);
  const hasTriggeredTimeout = useRef<boolean>(false);

  // Split Panel & Modal States
  const [isSplitCalculatorOpen, setIsSplitCalculatorOpen] = useState<boolean>(false);
  const [calcWidthPercent, setCalcWidthPercent] = useState<number>(45);
  const [isDraggingDivider, setIsDraggingDivider] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const splitResizeFnRef = useRef<(() => void) | null>(null);

  const [isDesmosOpen, setIsDesmosOpen] = useState<boolean>(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);
  const [isScratchpadActive, setIsScratchpadActive] = useState<boolean>(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Real-time Countdown Engine & Audio Alert Triggers
  useEffect(() => {
    if (isPaused || isTimeoutSubmitting) return;

    const timerInterval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isPaused, isTimeoutSubmitting]);

  // Handle draggable divider between calculator and question
  useEffect(() => {
    if (!isDraggingDivider) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      let newPercent = (relativeX / rect.width) * 100;

      // Minimum widths
      const minCalcPercent = (320 / rect.width) * 100;
      const maxCalcPercent = ((rect.width - 340) / rect.width) * 100;

      newPercent = Math.max(minCalcPercent, Math.min(maxCalcPercent, newPercent));
      setCalcWidthPercent(newPercent);

      if (splitResizeFnRef.current) {
        splitResizeFnRef.current();
      }
    };

    const handleMouseUp = () => {
      setIsDraggingDivider(false);
      if (splitResizeFnRef.current) {
        splitResizeFnRef.current();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingDivider]);

  // Transition to Module 2 handler
  const handleProceedToModule2 = () => {
    proceedToModule2();
    setSecondsRemaining(2100);
    hasTriggered5Min.current = false;
    hasTriggered1Min.current = false;
    hasTriggeredTimeout.current = false;
    setCurrentIndex(22);
    setIsIntermissionOpen(false);
    playChime('timeout');
  };

  // Handle specific sound chimes & banners on time thresholds
  useEffect(() => {
    // 5-Minute Warning (at 300 seconds)
    if (secondsRemaining <= 300 && secondsRemaining > 290 && !hasTriggered5Min.current) {
      hasTriggered5Min.current = true;
      playChime('5min');
      setShow5MinBanner(true);
      setTimeout(() => setShow5MinBanner(false), 8000);
    }

    // 1-Minute Warning (at 60 seconds)
    if (secondsRemaining <= 60 && secondsRemaining > 50 && !hasTriggered1Min.current) {
      hasTriggered1Min.current = true;
      playChime('1min');
    }

    // Timeout (00:00)
    if (secondsRemaining === 0 && !hasTriggeredTimeout.current) {
      hasTriggeredTimeout.current = true;
      playChime('timeout');

      if (isFullExam && currentModule === 1) {
        setTimeoutMessage('Module 1 time has expired. Saving your answers and transitioning to Module 2...');
        setIsTimeoutSubmitting(true);

        const timeoutId = setTimeout(() => {
          setIsTimeoutSubmitting(false);
          handleProceedToModule2();
        }, 1800);
        return () => clearTimeout(timeoutId);
      } else {
        setTimeoutMessage('Time is up! Evaluating your responses and preparing score report...');
        setIsTimeoutSubmitting(true);

        const timeoutId = setTimeout(() => {
          finishExam();
        }, 1500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [secondsRemaining, isFullExam, currentModule, finishExam]);

  const handleNext = () => {
    if (isFullExam && currentModule === 1) {
      if (currentIndex < 21) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // At end of Module 1, show Intermission / Review Screen
        setIsIntermissionOpen(true);
      }
    } else {
      if (currentIndex < moduleMaxIndex) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > moduleMinIndex) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Module 1 question statistics for Intermission Screen
  const module1Questions = questions.slice(0, 22);
  const module1AnsweredCount = module1Questions.filter((q) => !!currentExamAnswers[q.id]).length;
  const module1UnansweredCount = 22 - module1AnsweredCount;
  const module1MarkedCount = module1Questions.filter((q) => markedForReview.includes(q.id)).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#070b12] dark:text-slate-100 flex flex-col justify-between h-screen overflow-hidden select-none transition-colors duration-200">
      
      {/* Top Header */}
      <BluebookHeader
        secondsRemaining={secondsRemaining}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onOpenDesmos={() => setIsSplitCalculatorOpen(!isSplitCalculatorOpen)}
        isSplitCalculatorOpen={isSplitCalculatorOpen}
        onOpenReference={() => setIsReferenceOpen(true)}
        onToggleScratchpad={() => setIsScratchpadActive(!isScratchpadActive)}
        onToggleAiTutor={() => setIsAiTutorOpen(!isAiTutorOpen)}
        isScratchpadActive={isScratchpadActive}
        isAiTutorOpen={isAiTutorOpen}
        currentQuestionId={currentQuestion.id}
      />

      {/* 5-Minute Warning Discreet Banner */}
      {show5MinBanner && (
        <div className="bg-amber-950/90 border-b border-amber-500/50 px-4 py-2 text-amber-300 text-xs font-bold flex items-center justify-between z-30 animate-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>5 minutes remaining in Section 2: Math (Module 1). Double-check your marked questions!</span>
          </div>
          <button onClick={() => setShow5MinBanner(false)} className="text-amber-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Split Canvas / Question View & Scratchpad Layer */}
      <div
        ref={splitContainerRef}
        className={`flex-1 flex flex-row overflow-hidden relative transition-all ${isPaused ? 'filter blur-md pointer-events-none' : ''}`}
      >
        <ScratchpadCanvas
          isActive={isScratchpadActive}
          onClose={() => setIsScratchpadActive(false)}
        />

        {/* Embedded Desmos Calculator Split Panel (Left) */}
        {isSplitCalculatorOpen && (
          <>
            <div
              style={{ width: `${calcWidthPercent}%`, minWidth: '320px' }}
              className="h-full flex-shrink-0 z-20"
            >
              <DesmosSplitPanel
                isOpen={isSplitCalculatorOpen}
                onClose={() => setIsSplitCalculatorOpen(false)}
                onPopOut={() => {
                  setIsSplitCalculatorOpen(false);
                  setIsDesmosOpen(true);
                }}
                onResizeCalculatorRef={(fn) => {
                  splitResizeFnRef.current = fn;
                }}
              />
            </div>

            {/* Draggable Resizing Center Divider */}
            <div
              onMouseDown={() => setIsDraggingDivider(true)}
              className="w-2.5 bg-slate-900 hover:bg-emerald-500/30 border-x border-slate-800 flex items-center justify-center cursor-col-resize select-none transition-colors group z-20 flex-shrink-0"
              title="Drag to resize calculator"
            >
              <div className="flex flex-col space-y-1 text-slate-500 group-hover:text-emerald-400 items-center">
                <div className="w-1 h-1 rounded-full bg-current" />
                <div className="w-1 h-1 rounded-full bg-current" />
                <div className="w-1 h-1 rounded-full bg-current" />
              </div>
            </div>
          </>
        )}

        {/* Active Question View (Right / Center) */}
        <div className="flex-1 h-full overflow-y-auto flex items-center justify-center py-6 px-4">
          <QuestionCard question={currentQuestion} />
        </div>
      </div>

      {/* Sleek Exam Paused Overlay Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              <Pause className="w-8 h-8 fill-emerald-400 stroke-none" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white">Exam Paused</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                The countdown timer is currently frozen. Question content is hidden while paused to maintain testing integrity.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-400">
              Time Remaining: {Math.floor(secondsRemaining / 60)}m {secondsRemaining % 60}s
            </div>

            <button
              onClick={() => setIsPaused(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950 stroke-none" />
              <span>Resume Exam</span>
            </button>
          </div>
        </div>
      )}

      {/* Timeout Auto-Submit Full-Screen Overlay */}
      {isTimeoutSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-center p-6 space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-rose-950 border border-rose-500/50 text-rose-400 flex items-center justify-center animate-bounce shadow-[0_0_35px_rgba(244,63,94,0.4)]">
            <AlertTriangle className="w-10 h-10 text-rose-400" />
          </div>

          <div className="space-y-2 max-w-md">
            <h2 className="text-3xl font-extrabold text-white">Time is Up!</h2>
            <p className="text-sm text-slate-300">
              {timeoutMessage || (isFullExam && currentModule === 1
                ? 'Module 1 countdown completed. Saving your answers and transitioning to Module 2...'
                : 'Countdown completed. Automatically evaluating your responses...')}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>{isFullExam && currentModule === 1 ? 'Loading Module 2...' : 'Redirecting to Official Score Report...'}</span>
          </div>
        </div>
      )}

      {/* Module 1 Intermission / Review Screen Modal */}
      {isIntermissionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/60 font-mono">
                  <span>Module 1 Complete</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Section 2: Math — Module 1 Review
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                  Check your work before moving on. Click any question number to review or edit your response. When you click <strong className="text-slate-700 dark:text-slate-200">Begin Module 2</strong>, your answers will be locked and you cannot return to Module 1.
                </p>
              </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center">
                <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold block">Answered</span>
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">{module1AnsweredCount} / 22</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Unanswered</span>
                <span className="text-xl font-extrabold text-slate-700 dark:text-slate-300">{module1UnansweredCount} / 22</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-center">
                <span className="text-xs text-amber-800 dark:text-amber-400 font-bold block">For Review</span>
                <span className="text-xl font-extrabold text-amber-700 dark:text-amber-300">{module1MarkedCount} / 22</span>
              </div>
            </div>

            {/* Questions Grid 1–22 */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Questions (Click to jump & review):
              </span>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-52 overflow-y-auto p-1">
                {module1Questions.map((q, idx) => {
                  const isAnswered = !!currentExamAnswers[q.id];
                  const isMarked = markedForReview.includes(q.id);

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsIntermissionOpen(false);
                      }}
                      className={`relative h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all border ${
                        isAnswered
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      } hover:scale-105 active:scale-95`}
                    >
                      <span>{idx + 1}</span>
                      {isMarked && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border border-slate-900 flex items-center justify-center shadow-sm">
                          <Bookmark className="w-1.5 h-1.5 fill-slate-950 text-slate-950" />
                        </span>
                      )}
                      {isAnswered && (
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[7px] font-bold border border-slate-900 shadow-sm">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsIntermissionOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Module 1 Questions</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToModule2}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white dark:text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Begin Module 2 (35:00)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modals & Slideout Drawers */}
      <DesmosModal
        isOpen={isDesmosOpen}
        onClose={() => setIsDesmosOpen(false)}
        initialEquation={currentQuestion.desmosEquation}
      />

      <ReferenceSheetModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      <AITutorDrawer
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        question={currentQuestion}
      />

      <QuestionNavigator
        questions={questions}
        currentIndex={currentIndex}
        onSelectQuestion={(idx) => setCurrentIndex(idx)}
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
      />

      {/* Docked Bottom Control Bar */}
      <footer
        className="px-6 py-3.5 flex items-center justify-between z-40 backdrop-blur-md bg-white/95 border-t border-slate-200 dark:bg-[#090d16]/95 dark:border-slate-800 transition-colors duration-200 shadow-sm dark:shadow-none"
      >
        {/* Left: Question Navigator Trigger */}
        <button
          onClick={() => setIsNavigatorOpen(true)}
          className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200 flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm"
        >
          <Grid className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            {isFullExam
              ? currentModule === 1
                ? `Question ${currentIndex + 1} of 22 (Module 1)`
                : `Question ${currentIndex - 21} of 22 (Module 2)`
              : `Question ${currentIndex + 1} of ${questions.length}`}
          </span>
        </button>

        {/* Right: Back, Next & Submit */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= moduleMinIndex}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
              currentIndex <= moduleMinIndex
                ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-800'
                : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {isFullExam && currentModule === 1 ? (
            currentIndex < 21 ? (
              <button
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-2.5 rounded-full text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsIntermissionOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-2.5 rounded-full text-xs flex items-center space-x-2 shadow-sm active:scale-95 transition-all"
              >
                <span>Review Module 1</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )
          ) : currentIndex < moduleMaxIndex ? (
            <button
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-2.5 rounded-full text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={finishExam}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-2.5 rounded-full text-xs flex items-center space-x-2 shadow-sm active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Section & Review</span>
            </button>
          )}
        </div>
      </footer>

    </div>
  );
};
