import React, { useState, useEffect, useMemo, useRef } from 'react';
import { QuestionItem } from '../../types/questionBank';
import { Question } from '../../types';
import { RushConfig } from './QuestionRushModal';
import { MathRenderer } from '../common/MathRenderer';
import { DesmosSplitPanel } from './DesmosSplitPanel';
import { ReferenceSheetModal } from '../exam/ReferenceSheetModal';
import { ExplanationSideDrawer } from './ExplanationSideDrawer';
import { AITutorDrawer } from '../exam/AITutorDrawer';
import { PracticeRoomGridModal, QuestionAttemptRecord } from './PracticeRoomGridModal';
import { recordAttempt } from '../../services/userProgress';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  Flame,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calculator,
  BookOpen,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Highlighter,
  Bookmark,
  FileText,
  Bot,
  PlayCircle,
  Trophy,
  Columns,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface QuestionRushSessionViewProps {
  questions: QuestionItem[];
  config: RushConfig;
  onExit: () => void;
}

export const QuestionRushSessionView: React.FC<QuestionRushSessionViewProps> = ({
  questions,
  config,
  onExit,
}) => {
  const { recordPracticeQuestion } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [gridInInput, setGridInInput] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Flow & Gamification
  const [currentFlow, setCurrentFlow] = useState<'focused' | 'rush'>(config.flow);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Top Bar interactive controls
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isHighlightMode, setIsHighlightMode] = useState<boolean>(false);
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [strikethroughOptions, setStrikethroughOptions] = useState<Set<string>>(new Set());

  // Split Panel Desmos Calculator on the LEFT side of the question
  const [isLeftDesmosOpen, setIsLeftDesmosOpen] = useState<boolean>(false);
  const [calcWidthPercent, setCalcWidthPercent] = useState<number>(45);
  const [isDraggingDivider, setIsDraggingDivider] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const splitResizeFnRef = useRef<(() => void) | null>(null);

  // Utility modals & side drawers
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState<boolean>(false);
  const [attemptsMap, setAttemptsMap] = useState<Record<string, QuestionAttemptRecord>>({});

  // Pace time baseline (seconds per question)
  const paceSeconds = useMemo(() => {
    switch (config.pace) {
      case 'relaxed':
        return 90;
      case 'steady':
        return 75;
      case 'blitz':
        return 45;
      case 'standard':
      default:
        return 60;
    }
  }, [config.pace]);

  const [questionTimer, setQuestionTimer] = useState<number>(paceSeconds);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Adapter for AITutorDrawer which expects Question type
  const currentQuestionAdapter: Question | undefined = useMemo(() => {
    if (!currentQuestion) return undefined;
    return {
      id: currentQuestion.id,
      number: currentIndex + 1,
      section: 'math',
      module: 1,
      domain: (currentQuestion.domain as any) || 'Algebra',
      difficulty: currentQuestion.difficulty as any,
      prompt: currentQuestion.questionText || currentQuestion.question,
      options: currentQuestion.options?.map((o) => ({
        id: o.id as 'A' | 'B' | 'C' | 'D',
        text: o.text,
      })),
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      type: currentQuestion.type === 'student_produced' ? 'student_produced' : 'multiple_choice',
    };
  }, [currentQuestion, currentIndex]);

  // Format timer mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  // Timer per question (pauses when isTimerPaused is true)
  useEffect(() => {
    if (isCompleted || isAnswered || isTimerPaused) return;

    const interval = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isCompleted, isAnswered, isTimerPaused]);

  // Handle draggable center divider for left Desmos calculator
  useEffect(() => {
    if (!isDraggingDivider) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newWidth >= 25 && newWidth <= 75) {
        setCalcWidthPercent(newWidth);
        splitResizeFnRef.current?.();
      }
    };

    const handleMouseUp = () => {
      setIsDraggingDivider(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingDivider]);

  // Sync state per question change
  useEffect(() => {
    const rec = attemptsMap[currentQuestion?.id || ''];
    if (rec?.isAnswered) {
      setSelectedOption(rec.selectedAnswer);
      setGridInInput(rec.selectedAnswer);
      setIsAnswered(true);
      setIsCorrect(rec.isCorrect);
    } else {
      setSelectedOption('');
      setGridInInput('');
      setIsAnswered(false);
      setIsCorrect(false);
    }
    setStrikethroughOptions(new Set(rec?.eliminatedOptions || []));
    setQuestionTimer(paceSeconds);
    setIsExplanationOpen(false);
  }, [currentIndex, currentQuestion?.id, paceSeconds]);

  // Keyboard shortcut listener (1, 2, 3, 4 to select; Enter to submit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;

      // CRITICAL: Do NOT intercept keystrokes when typing inside inputs, textareas, or Desmos calculator
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
         target.tagName === 'TEXTAREA' ||
         target.isContentEditable ||
         target.closest?.('.dcg-calculator-api-container') ||
         target.closest?.('.dcg-container') ||
         target.closest?.('.dcg-mq-editable-field') ||
         target.closest?.('[contenteditable="true"]'))
      ) {
        return;
      }

      if (['1', '2', '3', '4'].includes(e.key) && currentQuestion?.type === 'multiple_choice' && currentQuestion.options) {
        const idx = parseInt(e.key, 10) - 1;
        const opt = currentQuestion.options[idx];
        if (opt && !isAnswered) {
          setSelectedOption(opt.id);
        }
      } else if (e.key === 'Enter') {
        if (!isAnswered) {
          handleSubmitAnswer();
        } else {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, isAnswered, isCompleted, selectedOption, gridInInput]);

  // Time ratio and color for top progress line
  const timeRatio = paceSeconds > 0 ? questionTimer / paceSeconds : 0;
  const progressColor = timeRatio > 0.5 ? 'bg-emerald-500' : timeRatio > 0.25 ? 'bg-amber-500' : 'bg-rose-500';

  // Toggle strikethrough
  const toggleStrikethrough = (optId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStrikethroughOptions((prev) => {
      const next = new Set(prev);
      if (next.has(optId)) {
        next.delete(optId);
      } else {
        next.add(optId);
      }
      return next;
    });
  };

  // Toggle mark for review
  const isCurrentMarked = markedForReview.has(currentQuestion?.id || '');
  const toggleMarkForReview = () => {
    if (!currentQuestion) return;
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  // Submit staged answer on user button click (no instant auto-check)
  const handleSubmitAnswer = (chosenAnswer?: string) => {
    if (isAnswered || !currentQuestion) return;

    const answerToCheck = chosenAnswer || (currentQuestion.type === 'multiple_choice' ? selectedOption : gridInInput.trim());
    if (!answerToCheck) return;

    const userAns = answerToCheck.trim().toLowerCase().replace(/\s+/g, '');
    const correctAns = currentQuestion.correctAnswer.trim().toLowerCase().replace(/\s+/g, '');

    let correct = userAns === correctAns;
    if (!correct && userAns.includes('/') && correctAns.includes('/')) {
      const [uNum, uDen] = userAns.split('/').map(Number);
      const [cNum, cDen] = correctAns.split('/').map(Number);
      if (uDen && cDen && Math.abs(uNum / uDen - cNum / cDen) < 0.0001) {
        correct = true;
      }
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    // Save attempt map
    setAttemptsMap((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        isAnswered: true,
        isCorrect: correct,
        selectedAnswer: answerToCheck,
        attemptsCount: (prev[currentQuestion.id]?.attemptsCount || 0) + 1,
        isMarkedForReview: markedForReview.has(currentQuestion.id),
        timeSpentSeconds: paceSeconds - questionTimer,
        eliminatedOptions: Array.from(strikethroughOptions),
      },
    }));

    // Save to user progress
    recordAttempt({
      questionId: currentQuestion.id,
      selectedAnswer: answerToCheck,
      isCorrect: correct,
      attemptedAt: Date.now(),
    });

    if (recordPracticeQuestion) {
      recordPracticeQuestion(currentQuestion.domain, correct);
    }

    if (correct) {
      setTotalCorrect((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      const starsEarned = questionTimer > paceSeconds * 0.5 ? 3 : 2;
      setStars((prev) => prev + starsEarned);
    } else {
      setStreak(0);
    }

    // Auto advance if option enabled
    if (correct && autoAdvance && currentFlow === 'rush') {
      setTimeout(() => {
        handleNextQuestion();
      }, 700);
    }
  };

  const handleNextQuestion = () => {
    setIsExplanationOpen(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption('');
      setGridInInput('');
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setIsCompleted(true);
    }
  };

  // Completion Summary Screen
  if (isCompleted) {
    const accuracy = questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d111b] text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-300 transition-colors">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#141a29] border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-yellow-500/20 text-yellow-500 dark:text-yellow-400 border border-yellow-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Question Rush Complete!</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Great practice! Here is your performance overview.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-black text-slate-900 dark:text-white">{accuracy}%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Accuracy</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-emerald-500" />
                <span>{bestStreak}</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Best Streak</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-black text-yellow-500 dark:text-yellow-400 flex items-center justify-center gap-1">
                <span>{stars}</span>
                <Star className="w-4 h-4 fill-yellow-500" />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Stars Earned</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 flex justify-between items-center">
            <span>Questions Answered</span>
            <span className="font-bold text-slate-900 dark:text-white">{totalCorrect} / {questions.length}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onExit}
              className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors border border-slate-200 dark:border-transparent"
            >
              Back to Hub
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedOption('');
                setGridInInput('');
                setIsAnswered(false);
                setIsCorrect(false);
                setStreak(0);
                setBestStreak(0);
                setStars(0);
                setTotalCorrect(0);
                setIsCompleted(false);
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-md"
            >
              Rush Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen bg-white dark:bg-[#090b10] text-slate-900 dark:text-white flex flex-col justify-between relative overflow-hidden transition-colors">
      
      {/* ─── TOP BAR (EXACT DESIGN MATCH) ─────────────────────────────── */}
      <header className="h-14 px-4 sm:px-6 bg-white dark:bg-[#090b10] flex items-center justify-between sticky top-0 z-30 select-none border-b border-slate-200 dark:border-slate-900 transition-colors">
        
        {/* Left Side: Back button, Streak, Correct ratio */}
        <div className="flex items-center space-x-5">
          {/* < Back */}
          <button
            onClick={onExit}
            className="flex items-center space-x-1 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Flame streak */}
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
            <Flame className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            <span>{streak} streak</span>
          </div>

          {/* Correct count */}
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{totalCorrect}/{questions.length} correct</span>
          </div>
        </div>

        {/* Center: Stars, Timer, Pause, Volume */}
        <div className="flex items-center space-x-3 px-3.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-[#141824]/90 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          {/* Stars */}
          <div className="flex items-center space-x-0.5 text-amber-500 dark:text-amber-400">
            {[1, 2, 3].map((starIndex) => (
              <Star
                key={starIndex}
                className={`w-3.5 h-3.5 ${
                  timeRatio * 3 >= starIndex - 0.5
                    ? 'fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Clock & Timer */}
          <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{formatTime(questionTimer)}</span>
          </div>

          {/* Pause / Play Button */}
          <button
            type="button"
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className={`p-1.5 rounded-lg transition-colors ${
              isTimerPaused
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/80'
            }`}
            title={isTimerPaused ? 'Resume Timer & Unblur Question' : 'Pause Timer (Blurs Question)'}
          >
            {isTimerPaused ? (
              <Play className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Pause className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          {/* Volume Mute toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors ${isMuted ? 'opacity-50' : ''}`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right Side: Flow Toggle Pill, Fast Forward, Toolbar Icons, ThemeToggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Focused / Rush pill */}
          <div className="flex items-center bg-slate-100 dark:bg-[#151a26] p-0.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <button
              onClick={() => setCurrentFlow('focused')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentFlow === 'focused'
                  ? 'bg-white text-slate-900 dark:bg-slate-700/80 dark:text-white font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Focused
            </button>
            <button
              onClick={() => setCurrentFlow('rush')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentFlow === 'rush'
                  ? 'bg-white text-slate-900 dark:bg-slate-700/80 dark:text-white font-bold shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Rush
            </button>
          </div>

          {/* Fast Forward / Quick Skip Button */}
          <button
            onClick={handleNextQuestion}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-[#0070f3] dark:hover:bg-[#0060df] text-white transition-all shadow-sm active:scale-95"
            title="Skip to next question"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Tools icon buttons */}
          <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
            {/* Highlighter */}
            <button
              onClick={() => setIsHighlightMode(!isHighlightMode)}
              className={`p-1.5 rounded-lg transition-colors ${
                isHighlightMode ? 'bg-amber-500/20 text-amber-500 dark:text-amber-400' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              title="Text Highlighter Mode"
            >
              <Highlighter className="w-4 h-4" />
            </button>

            {/* Left Desmos Calculator Toggle */}
            <button
              onClick={() => setIsLeftDesmosOpen(!isLeftDesmosOpen)}
              className={`p-1.5 rounded-lg transition-colors ${
                isLeftDesmosOpen ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              title="Open Desmos Calculator on Left Side"
            >
              <Calculator className="w-4 h-4" />
            </button>

            {/* Reference Sheet */}
            <button
              onClick={() => setIsReferenceOpen(true)}
              className="p-1.5 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
              title="SAT Math Reference Sheet"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Split Screen Toggle */}
            <button
              onClick={() => setIsLeftDesmosOpen(!isLeftDesmosOpen)}
              className={`p-1.5 rounded-lg transition-colors ${
                isLeftDesmosOpen ? 'text-emerald-600 dark:text-emerald-400' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              title="Split View (Desmos Grapher Left, Question Right)"
            >
              <Columns className="w-4 h-4" />
            </button>

            {/* ScoreUP AI Tutor Toggle */}
            <button
              type="button"
              data-ai-tutor-toggle="true"
              onClick={() => setIsAiTutorOpen(!isAiTutorOpen)}
              className={`p-1.5 rounded-lg transition-colors ${
                isAiTutorOpen ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              title="Open ScoreUP AI Tutor"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>

            {/* Dark & Bright Theme Toggle Button */}
            <ThemeToggle size="sm" className="ml-1" />
          </div>

        </div>
      </header>

      {/* ─── FULL-WIDTH SLIDING PROGRESS / TIMER BAR ─────────────────── */}
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 relative overflow-hidden transition-colors">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${progressColor}`}
          style={{ width: `${Math.max(0, Math.min(100, timeRatio * 100))}%` }}
        />
      </div>

      {/* ─── MAIN WORKSPACE (SPLIT LAYOUT WHEN DESMOS OPEN ON LEFT) ──── */}
      <div
        ref={splitContainerRef}
        className="flex flex-row flex-1 h-[calc(100vh-124px)] min-h-0 overflow-hidden w-full relative"
      >
        {/* LEFT SIDE: DESMOS GRAPHING CALCULATOR SPLIT PANEL */}
        {isLeftDesmosOpen && (
          <aside
            style={{ width: `${calcWidthPercent}%`, minWidth: '320px' }}
            className="h-full border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c101a] flex flex-col flex-shrink-0 relative select-auto z-10 transition-colors"
          >
            <DesmosSplitPanel
              isOpen={isLeftDesmosOpen}
              onClose={() => setIsLeftDesmosOpen(false)}
              onResizeCalculatorRef={(fn) => {
                splitResizeFnRef.current = fn;
              }}
            />
          </aside>
        )}

        {/* DRAGGABLE DIVIDER */}
        {isLeftDesmosOpen && (
          <div
            onMouseDown={() => setIsDraggingDivider(true)}
            className="w-2 hover:w-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-emerald-500 dark:hover:bg-emerald-500 cursor-col-resize transition-all z-20 flex items-center justify-center group flex-shrink-0 select-none"
            title="Drag to resize calculator and question pane"
          >
            <div className="w-0.5 h-8 bg-slate-400 dark:bg-slate-600 group-hover:bg-white rounded" />
          </div>
        )}

        {/* RIGHT (OR FULL) QUESTION VIEWPORT */}
        <main className="flex-1 h-full overflow-y-auto p-6 sm:p-10 flex flex-col justify-center relative select-text bg-white dark:bg-[#090b10] transition-colors">
          
          {/* PAUSED BLUR OVERLAY (BLURS QUESTION CONTENT WHEN PAUSED) */}
          {isTimerPaused && (
            <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/70 dark:bg-black/60 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <div className="p-8 rounded-3xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <Pause className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Session Paused</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Questions are hidden while paused to maintain timer fairness.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTimerPaused(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Practice</span>
                </button>
              </div>
            </div>
          )}

          {/* QUESTION CONTAINER */}
          <div className={`max-w-4xl w-full mx-auto transition-all duration-200 ${isTimerPaused ? 'filter blur-md pointer-events-none' : ''}`}>
            
            {/* Header: Question # and Mark for Review */}
            <div className="flex items-center justify-between pb-4">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>

              <button
                type="button"
                onClick={toggleMarkForReview}
                className={`flex items-center space-x-1.5 text-xs font-semibold transition-colors ${
                  isCurrentMarked ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isCurrentMarked ? 'fill-emerald-600 dark:fill-emerald-400' : ''}`} />
                <span>Mark for Review</span>
              </button>
            </div>

            {/* Question Prompt */}
            <div className="text-base sm:text-lg text-slate-900 dark:text-slate-200 font-normal leading-relaxed mb-6">
              <MathRenderer content={currentQuestion.questionText || currentQuestion.question} />
            </div>

            {/* Multiple Choice Options with Strikethrough Buttons */}
            {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const isCorrectOpt = opt.id === currentQuestion.correctAnswer;
                  const isStriked = strikethroughOptions.has(opt.id);

                  let optionBoxClasses = 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/20 text-slate-900 dark:border-slate-800 dark:bg-[#121622]/60 dark:hover:border-slate-700 dark:text-slate-200 shadow-sm';
                  if (isAnswered) {
                    if (isCorrectOpt) {
                      optionBoxClasses = 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionBoxClasses = 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300';
                    }
                  } else if (isSelected) {
                    optionBoxClasses = 'border-emerald-600 bg-emerald-50/60 text-slate-950 ring-2 ring-emerald-500/20 dark:border-white dark:bg-[#1a2133] dark:text-white dark:ring-1 dark:ring-white/20 shadow-md';
                  }

                  return (
                    <div
                      key={opt.id}
                      className="flex items-center space-x-3 group"
                    >
                      <button
                        type="button"
                        disabled={isAnswered}
                        onClick={() => {
                          // Select choice without instant auto-check
                          setSelectedOption(opt.id);
                        }}
                        className={`flex-1 p-4 rounded-2xl border text-left transition-all flex items-center space-x-3.5 ${optionBoxClasses} ${
                          isStriked ? 'opacity-40 line-through' : ''
                        }`}
                      >
                        <span className="w-7 h-7 rounded-full border border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {opt.id}
                        </span>
                        <div className="text-sm font-medium flex-1">
                          <MathRenderer content={opt.text} />
                        </div>
                      </button>

                      {/* Right circular strikethrough button matching screenshot */}
                      <button
                        type="button"
                        onClick={(e) => toggleStrikethrough(opt.id, e)}
                        className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                          isStriked
                            ? 'border-amber-500 text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 line-through'
                            : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 bg-slate-50 dark:border-slate-800 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:border-slate-700 dark:bg-[#121622]/60'
                        }`}
                        title="Eliminate option"
                      >
                        <span className="line-through">{opt.id}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 max-w-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Student-Produced Response:</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={isAnswered}
                    value={gridInInput}
                    onChange={(e) => setGridInInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSubmitAnswer();
                    }}
                    placeholder="e.g. 14, 3/4, 2.5"
                    className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                  {!isAnswered && (
                    <button
                      type="button"
                      onClick={() => handleSubmitAnswer()}
                      className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-white dark:text-slate-950 font-bold text-xs transition-colors shadow-sm"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Staged Check Answer Button if option is selected and not yet checked */}
            {!isAnswered && (selectedOption || gridInInput.trim()) && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSubmitAnswer()}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg flex items-center space-x-2 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check Answer</span>
                </button>
              </div>
            )}

            {/* Keyboard shortcut hint matching screenshot */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 font-mono">
              Tip: press <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-transparent px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">1</span> <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-transparent px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">2</span> <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-transparent px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">3</span> <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-transparent px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">4</span> to pick an answer, then <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-transparent px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">Enter</span> to check
            </div>

            {/* Feedback & KaTeX explanation */}
            {isAnswered && (
              <div className={`mt-6 p-5 rounded-2xl border transition-all ${
                isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-500/40 dark:text-emerald-300' : 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/30 dark:border-rose-500/40 dark:text-rose-300'
              }`}>
                <div className="flex items-center space-x-2 font-bold text-sm mb-1.5">
                  {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span>{isCorrect ? 'Correct!' : `Incorrect · Answer is ${currentQuestion.correctAnswer}`}</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                  <MathRenderer content={currentQuestion.explanation || ''} />
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ─── BOTTOM CONTROL BAR MATCHING SCREENSHOT ─────────────────── */}
      <footer className="h-16 px-4 sm:px-6 bg-white dark:bg-[#090b10] border-t border-slate-200 dark:border-slate-900 flex items-center justify-between sticky bottom-0 z-30 transition-colors">
        
        {/* Left: Question 1/20 pill */}
        <button
          id="question-navigator-trigger"
          type="button"
          onClick={() => setIsGridModalOpen(!isGridModalOpen)}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#141824] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2 transition-colors cursor-pointer"
        >
          <span>Question {currentIndex + 1} /{questions.length}</span>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform ${isGridModalOpen ? 'rotate-90' : '-rotate-90'}`} />
        </button>

        {/* Center/Right: Action Buttons */}
        <div className="flex items-center space-x-3">
          
          {/* ScoreUP AI Tutor */}
          <button
            type="button"
            data-ai-tutor-toggle="true"
            onClick={() => setIsAiTutorOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-semibold text-xs flex items-center space-x-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>ScoreUP AI Tutor</span>
          </button>

          {/* Explanation Button (opens side drawer) */}
          <button
            type="button"
            onClick={() => setIsExplanationOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#141824] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Explanation</span>
          </button>

          {/* Masterclass Button */}
          <a
            href="https://www.youtube.com/@ScoreUp_Academy_SAT"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-700/40 hover:bg-purple-100 dark:hover:bg-purple-800/40 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Masterclass</span>
          </a>

          {/* Next Question (when answered) */}
          {isAnswered && (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center space-x-1"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Rush'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* End Session Button */}
          <button
            type="button"
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-sm"
          >
            End Session
          </button>
        </div>
      </footer>

      {/* ─── SIDE DRAWERS & MODALS ───────────────────────────────────── */}
      
      {/* Explanation Side Drawer */}
      <ExplanationSideDrawer
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
        question={currentQuestion}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        onAskAiTutor={() => {
          setIsExplanationOpen(false);
          setIsAiTutorOpen(true);
        }}
      />

      {/* ScoreUP AI Personal Tutor Drawer */}
      <AITutorDrawer
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        question={currentQuestionAdapter}
      />

      {/* Question Navigator Grid Modal */}
      <PracticeRoomGridModal
        isOpen={isGridModalOpen}
        onClose={() => setIsGridModalOpen(false)}
        questions={questions}
        currentIndex={currentIndex}
        onSelectIndex={(idx) => {
          setCurrentIndex(idx);
          setIsGridModalOpen(false);
        }}
        attemptsMap={attemptsMap}
      />

      {/* Reference Sheet Modal */}
      <ReferenceSheetModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      {/* Floating ScoreUP AI Tutor Launcher Button */}
      {!isAiTutorOpen && (
        <button
          type="button"
          data-ai-tutor-toggle="true"
          onClick={() => setIsAiTutorOpen(true)}
          className="fixed bottom-20 right-6 z-40 p-3.5 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-xl hover:shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer border border-emerald-400/30"
          title="Open ScoreUP AI Tutor"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pr-0 group-hover:pr-1">
            ScoreUP AI Tutor
          </span>
        </button>
      )}
    </div>
  );
};
