import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BluebookHeader } from './BluebookHeader';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigator } from './QuestionNavigator';
import { DesmosModal } from './DesmosModal';
import { ReferenceSheetModal } from './ReferenceSheetModal';
import { ScratchpadCanvas } from './ScratchpadCanvas';
import { AITutorDrawer } from './AITutorDrawer';
import { ArrowLeft, ArrowRight, Grid, Send, Play, Pause, AlertTriangle, Loader2 } from 'lucide-react';
import { playChime } from '../../services/audio';

export const ExamInterface: React.FC = () => {
  const { questions, finishExam } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Timer & Exam State
  const [secondsRemaining, setSecondsRemaining] = useState<number>(2100); // 35 minutes default
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTimeoutSubmitting, setIsTimeoutSubmitting] = useState<boolean>(false);
  const [show5MinBanner, setShow5MinBanner] = useState<boolean>(false);

  // Ref flags to prevent double audio chime triggers
  const hasTriggered5Min = useRef<boolean>(false);
  const hasTriggered1Min = useRef<boolean>(false);
  const hasTriggeredTimeout = useRef<boolean>(false);

  // Modal & Drawer States
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
      setIsTimeoutSubmitting(true);

      // Auto-submit after 1.5 seconds full-screen overlay
      const timeoutId = setTimeout(() => {
        finishExam();
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [secondsRemaining, finishExam]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Top Header */}
      <BluebookHeader
        secondsRemaining={secondsRemaining}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onOpenDesmos={() => setIsDesmosOpen(true)}
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

      {/* Main Question View & Scratchpad Layer (Blurs when paused) */}
      <div className={`flex-1 relative flex flex-col justify-center transition-all ${isPaused ? 'filter blur-md pointer-events-none' : ''}`}>
        <ScratchpadCanvas
          isActive={isScratchpadActive}
          onClose={() => setIsScratchpadActive(false)}
        />
        <QuestionCard question={currentQuestion} />
      </div>

      {/* Sleek Exam Paused Overlay Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,158,11,0.25)]">
              <Pause className="w-8 h-8 fill-amber-400 stroke-none" />
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

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Time is Up!</h2>
            <p className="text-sm text-slate-300">
              Module 1 countdown completed. Automatically evaluating your responses...
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Redirecting to Official Score Report...</span>
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
      <footer className="bg-slate-950/90 border-t border-slate-800/80 px-6 py-3.5 flex items-center justify-between z-40 backdrop-blur-xl">
        
        {/* Left: Question Navigator Trigger */}
        <button
          onClick={() => setIsNavigatorOpen(true)}
          className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 px-4 py-2 rounded-full text-xs font-bold text-slate-200 transition-all active:scale-95 shadow-sm"
        >
          <Grid className="w-4 h-4 text-emerald-400" />
          <span>Question {currentIndex + 1} of {questions.length}</span>
        </button>

        {/* Right: Back, Next & Submit Section */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95 ${
              currentIndex === 0
                ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed opacity-50'
                : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center space-x-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={finishExam}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-105 transition-all active:scale-95"
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
