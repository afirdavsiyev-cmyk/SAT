import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { getProgress, recordAttempt, getBookmarks, toggleBookmark, isBookmarked } from '../../services/userProgress';
import { QuestionItem } from '../../types/questionBank';
import { Question } from '../../types';
import { MathRenderer } from '../common/MathRenderer';
import { MathText } from '../common/MathText';
import { DesmosModal } from '../exam/DesmosModal';
import { ReferenceSheetModal } from '../exam/ReferenceSheetModal';
import { AITutorDrawer } from '../exam/AITutorDrawer';
import { PracticeRoomGridModal, QuestionAttemptRecord } from './PracticeRoomGridModal';
import { PracticeRoomDirectionsModal } from './PracticeRoomDirectionsModal';
import { DesmosSplitPanel } from './DesmosSplitPanel';
import { ExplanationSideDrawer } from './ExplanationSideDrawer';
import { DiagnosticMistakeDrawer } from './DiagnosticMistakeDrawer';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calculator,
  BookOpen,
  Highlighter,
  MoreVertical,
  Bookmark,
  Share2,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  PlayCircle,
  RotateCcw,
  FileText,
  Clock,
  User,
  Maximize2,
  Send,
  Check,
  X,
  ExternalLink,
  Bot,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

interface PracticeRoomViewProps {
  questions: QuestionItem[];
  selectedTopicName: string;
  onGoBack: () => void;
  initialIndex?: number;
}

interface FloatingHighlightMenuState {
  x: number;
  y: number;
  isExisting: boolean;
  targetElement?: HTMLElement;
  selectedRange?: Range;
}

const STORAGE_HIGHLIGHTS_KEY = 'sat_practice_highlights_v1';

// Isolated leaf timer component to completely prevent parent re-renders on timer ticks
const ExamTimer: React.FC = React.memo(() => {
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerHidden, setIsTimerHidden] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/[0.08] shadow-inner font-mono">
        <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        {!isTimerHidden ? (
          <span className="text-xs font-extrabold text-slate-900 dark:text-white tracking-widest">
            {formatTimer(timerSeconds)}
          </span>
        ) : (
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Timer Hidden</span>
        )}
      </div>

      <button
        onClick={() => setIsTimerHidden(!isTimerHidden)}
        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.06] text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        {isTimerHidden ? '▶ Show' : '|| Hide'}
      </button>
    </div>
  );
});

export const PracticeRoomView: React.FC<PracticeRoomViewProps> = ({
  questions,
  selectedTopicName,
  onGoBack,
  initialIndex = 0,
}) => {
  const { userProgress, setUserProgress, recordPracticeQuestion } = useApp();
  const { theme, toggleTheme } = useTheme();

  // Active question index
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  // Staged answer selection (two-step flow)
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [gridInInput, setGridInInput] = useState<string>('');

  // Side drawer toggles
  const [isSplitCalculatorOpen, setIsSplitCalculatorOpen] = useState<boolean>(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [calcWidthPercent, setCalcWidthPercent] = useState<number>(45);
  const [isDraggingDivider, setIsDraggingDivider] = useState<boolean>(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const splitResizeFnRef = useRef<(() => void) | null>(null);

  // Highlighter Tool State & Persistence
  const [isHighlightMode, setIsHighlightMode] = useState<boolean>(false);
  const [floatingHighlightMenu, setFloatingHighlightMenu] = useState<FloatingHighlightMenuState | null>(null);
  const questionAreaRef = useRef<HTMLDivElement>(null);

  const [highlightsMap, setHighlightsMap] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HIGHLIGHTS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modal toggles
  const [isDesmosOpen, setIsDesmosOpen] = useState<boolean>(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState<boolean>(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState<boolean>(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [isMasterclassOpen, setIsMasterclassOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isMuteAiPopups, setIsMuteAiPopups] = useState<boolean>(false);
  const [showFirstTryStats, setShowFirstTryStats] = useState<boolean>(false);
  const [hideCorrectAnswers, setHideCorrectAnswers] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isBugReportOpen, setIsBugReportOpen] = useState<boolean>(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Attempts map per question ID (initialized from persistent global progress)
  const [attemptsMap, setAttemptsMap] = useState<Record<string, QuestionAttemptRecord>>(() => {
    const progress = getProgress();
    const bookmarks = new Set(getBookmarks());
    const initial: Record<string, QuestionAttemptRecord> = {};

    Object.values(progress).forEach((att) => {
      initial[att.questionId] = {
        isAnswered: true,
        isCorrect: att.isCorrect,
        selectedAnswer: att.selectedAnswer,
        attemptsCount: 1,
        isMarkedForReview: bookmarks.has(att.questionId),
        timeSpentSeconds: 30,
        eliminatedOptions: [],
      };
    });

    bookmarks.forEach((qid) => {
      if (!initial[qid]) {
        initial[qid] = {
          isAnswered: false,
          isCorrect: false,
          selectedAnswer: '',
          attemptsCount: 0,
          isMarkedForReview: true,
          timeSpentSeconds: 0,
          eliminatedOptions: [],
        };
      } else {
        initial[qid].isMarkedForReview = true;
      }
    });

    return initial;
  });

  // Sync state when global store updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      const progress = getProgress();
      setAttemptsMap((prev) => {
        const next = { ...prev };
        Object.values(progress).forEach((att) => {
          next[att.questionId] = {
            ...(next[att.questionId] || {
              attemptsCount: 1,
              timeSpentSeconds: 30,
              eliminatedOptions: [],
            }),
            isAnswered: true,
            isCorrect: att.isCorrect,
            selectedAnswer: att.selectedAnswer,
            isMarkedForReview: isBookmarked(att.questionId),
          };
        });
        return next;
      });
    };

    const handleBookmarksUpdate = () => {
      const bookmarks = new Set(getBookmarks());
      setAttemptsMap((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((qid) => {
          next[qid] = {
            ...next[qid],
            isMarkedForReview: bookmarks.has(qid),
          };
        });
        bookmarks.forEach((qid) => {
          if (!next[qid]) {
            next[qid] = {
              isAnswered: false,
              isCorrect: false,
              selectedAnswer: '',
              attemptsCount: 0,
              isMarkedForReview: true,
              timeSpentSeconds: 0,
              eliminatedOptions: [],
            };
          }
        });
        return next;
      });
    };

    window.addEventListener('scoreup_progress_updated', handleProgressUpdate);
    window.addEventListener('scoreup_bookmarks_updated', handleBookmarksUpdate);
    return () => {
      window.removeEventListener('scoreup_progress_updated', handleProgressUpdate);
      window.removeEventListener('scoreup_bookmarks_updated', handleBookmarksUpdate);
    };
  }, []);

  // Current active question
  const currentQuestion = questions[currentIndex] || questions[0];
  const currentRecord = currentQuestion ? attemptsMap[currentQuestion.id] : undefined;
  const isAnswered = !!currentRecord?.isAnswered;
  const isCorrect = currentRecord?.isCorrect;
  const isMarked = currentRecord?.isMarkedForReview;
  const eliminatedOptions = currentRecord?.eliminatedOptions || [];

  // Sync staged selection when active question changes
  useEffect(() => {
    if (currentQuestion) {
      const rec = attemptsMap[currentQuestion.id];
      if (rec?.isAnswered) {
        setSelectedOption(rec.selectedAnswer);
        setGridInInput(rec.selectedAnswer);
      } else {
        setSelectedOption('');
        setGridInInput('');
      }
      setFloatingHighlightMenu(null);
    }
  }, [currentIndex, currentQuestion?.id, attemptsMap]);

  // Restore saved highlights for active question on question change
  useEffect(() => {
    if (!currentQuestion || !questionAreaRef.current) return;

    const savedSnippets = highlightsMap[currentQuestion.id];
    if (!savedSnippets || savedSnippets.length === 0) return;

    const timer = setTimeout(() => {
      if (!questionAreaRef.current) return;
      savedSnippets.forEach((snippet) => {
        if (!snippet || snippet.trim().length < 2) return;
        highlightSnippetInElement(questionAreaRef.current!, snippet.trim(), currentQuestion.id);
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [currentIndex, currentQuestion?.id, highlightsMap]);

  // Handle draggable center divider
  useEffect(() => {
    if (!isDraggingDivider) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      let newPercent = (relativeX / rect.width) * 100;

      // Ensure minimum width: calc >= 320px, question pane >= 340px
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

  // Highlighter mouse up detection inside question stem/choices
  const handleQuestionAreaMouseUp = useCallback(() => {
    if (!isHighlightMode || !currentQuestion) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length === 0) return;

    const range = selection.getRangeAt(0);

    // Verify selection is within questionAreaRef
    if (questionAreaRef.current && questionAreaRef.current.contains(range.commonAncestorContainer)) {
      const rect = range.getBoundingClientRect();
      setFloatingHighlightMenu({
        x: rect.left + rect.width / 2,
        y: rect.top,
        isExisting: false,
        selectedRange: range.cloneRange(),
      });
    }
  }, [isHighlightMode, currentQuestion]);

  // Apply highlight to selected range
  const applyHighlight = useCallback(() => {
    if (!floatingHighlightMenu?.selectedRange || !currentQuestion) return;

    const range = floatingHighlightMenu.selectedRange;
    const textToSave = range.toString().trim();

    try {
      const mark = document.createElement('mark');
      mark.className = 'sat-highlight bg-amber-400/35 text-inherit rounded px-0.5 border-b-2 border-amber-400/70 shadow-sm cursor-pointer hover:bg-amber-400/50 transition-colors';
      mark.setAttribute('data-question-id', currentQuestion.id);

      mark.addEventListener('click', (e) => {
        e.stopPropagation();
        const r = mark.getBoundingClientRect();
        setFloatingHighlightMenu({
          x: r.left + r.width / 2,
          y: r.top,
          isExisting: true,
          targetElement: mark,
        });
      });

      range.surroundContents(mark);

      // Save snippet to state & localStorage
      if (textToSave) {
        setHighlightsMap((prev) => {
          const existingList = prev[currentQuestion.id] || [];
          if (!existingList.includes(textToSave)) {
            const nextMap = { ...prev, [currentQuestion.id]: [...existingList, textToSave] };
            localStorage.setItem(STORAGE_HIGHLIGHTS_KEY, JSON.stringify(nextMap));
            return nextMap;
          }
          return prev;
        });
      }

      window.getSelection()?.removeAllRanges();
      setFloatingHighlightMenu(null);
    } catch {
      setFloatingHighlightMenu(null);
    }
  }, [floatingHighlightMenu, currentQuestion]);

  // Remove existing highlight
  const removeHighlight = useCallback(() => {
    if (!floatingHighlightMenu?.targetElement || !currentQuestion) return;

    const target = floatingHighlightMenu.targetElement;
    const textRemoved = target.textContent?.trim() || '';

    const parent = target.parentNode;
    if (parent) {
      while (target.firstChild) {
        parent.insertBefore(target.firstChild, target);
      }
      parent.removeChild(target);
      parent.normalize();
    }

    // Remove snippet from persistence
    if (textRemoved) {
      setHighlightsMap((prev) => {
        const existingList = prev[currentQuestion.id] || [];
        const nextList = existingList.filter((s) => s !== textRemoved);
        const nextMap = { ...prev, [currentQuestion.id]: nextList };
        localStorage.setItem(STORAGE_HIGHLIGHTS_KEY, JSON.stringify(nextMap));
        return nextMap;
      });
    }

    setFloatingHighlightMenu(null);
  }, [floatingHighlightMenu, currentQuestion]);

  // Mark for review toggle (persisted globally)
  const handleToggleMarkForReview = () => {
    if (!currentQuestion) return;
    const isNowMarked = toggleBookmark(currentQuestion.id);
    setAttemptsMap((prev) => {
      const existing = prev[currentQuestion.id];
      return {
        ...prev,
        [currentQuestion.id]: {
          isAnswered: existing?.isAnswered || false,
          isCorrect: existing?.isCorrect || false,
          selectedAnswer: existing?.selectedAnswer || '',
          attemptsCount: existing?.attemptsCount || 0,
          isMarkedForReview: isNowMarked,
          timeSpentSeconds: existing?.timeSpentSeconds || 0,
          eliminatedOptions: existing?.eliminatedOptions || [],
        },
      };
    });
  };

  // Option eliminator toggle
  const handleToggleEliminateOption = (optId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentQuestion || isAnswered) return;

    setAttemptsMap((prev) => {
      const existing = prev[currentQuestion.id];
      const currentEliminated = existing?.eliminatedOptions || [];
      const nextEliminated = currentEliminated.includes(optId)
        ? currentEliminated.filter((id) => id !== optId)
        : [...currentEliminated, optId];

      return {
        ...prev,
        [currentQuestion.id]: {
          ...existing,
          eliminatedOptions: nextEliminated,
        },
      };
    });
  };

  // Step 1: Select Multiple Choice Option (Staged highlight only)
  const handleSelectOptionCard = (optId: string) => {
    if (isAnswered) return;
    setSelectedOption(optId);
  };

  // Step 2: Explicitly Check Answer on button click
  const handleCheckAnswer = () => {
    if (!currentQuestion || !selectedOption || isAnswered) return;
    const isAnswerCorrect = selectedOption.trim().toUpperCase() === currentQuestion.correctAnswer.trim().toUpperCase();

    // Persist attempt globally
    recordAttempt({
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      isCorrect: isAnswerCorrect,
      attemptedAt: Date.now(),
    });

    setAttemptsMap((prev) => {
      const existing = prev[currentQuestion.id];
      const prevAttempts = existing?.attemptsCount || 0;
      return {
        ...prev,
        [currentQuestion.id]: {
          isAnswered: true,
          isCorrect: isAnswerCorrect,
          selectedAnswer: selectedOption,
          attemptsCount: prevAttempts + 1,
          isMarkedForReview: existing?.isMarkedForReview || false,
          timeSpentSeconds: (existing?.timeSpentSeconds || 0) + 15,
          eliminatedOptions: existing?.eliminatedOptions || [],
        },
      };
    });

    if (recordPracticeQuestion) {
      recordPracticeQuestion(currentQuestion.domain, isAnswerCorrect);
    }
  };

  // Submit Grid-In Answer
  const handleSubmitGridInAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentQuestion || !gridInInput.trim() || isAnswered) return;

    const userAns = gridInInput.trim().toLowerCase().replace(/\s+/g, '');
    const correctAns = currentQuestion.correctAnswer.trim().toLowerCase().replace(/\s+/g, '');

    let isAnswerCorrect = userAns === correctAns;

    // Fraction equivalence check
    if (!isAnswerCorrect && userAns.includes('/') && correctAns.includes('/')) {
      const [uNum, uDen] = userAns.split('/').map(Number);
      const [cNum, cDen] = correctAns.split('/').map(Number);
      if (uDen && cDen && Math.abs(uNum / uDen - cNum / cDen) < 0.0001) {
        isAnswerCorrect = true;
      }
    }

    // Persist attempt globally
    recordAttempt({
      questionId: currentQuestion.id,
      selectedAnswer: gridInInput.trim(),
      isCorrect: isAnswerCorrect,
      attemptedAt: Date.now(),
    });

    setAttemptsMap((prev) => {
      const existing = prev[currentQuestion.id];
      const prevAttempts = existing?.attemptsCount || 0;
      return {
        ...prev,
        [currentQuestion.id]: {
          isAnswered: true,
          isCorrect: isAnswerCorrect,
          selectedAnswer: gridInInput.trim(),
          attemptsCount: prevAttempts + 1,
          isMarkedForReview: existing?.isMarkedForReview || false,
          timeSpentSeconds: (existing?.timeSpentSeconds || 0) + 20,
          eliminatedOptions: existing?.eliminatedOptions || [],
        },
      };
    });

    if (recordPracticeQuestion) {
      recordPracticeQuestion(currentQuestion.domain, isAnswerCorrect);
    }

    if (!isAnswerCorrect) {
      if (!isMuteAiPopups) {
        setIsDiagnosticOpen(true);
      }
    }
  };

  // Reset / Remix current question
  const handleRemixQuestion = () => {
    if (!currentQuestion) return;
    setAttemptsMap((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
    setSelectedOption('');
    setGridInInput('');
    setIsExplanationOpen(false);
  };

  // Fullscreen toggle handler
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    setIsMoreMenuOpen(false);
  };

  const toggleMuteAiPopups = () => {
    setIsMuteAiPopups((prev) => !prev);
    setIsMoreMenuOpen(false);
  };

  const toggleShowFirstTryStats = () => {
    setShowFirstTryStats((prev) => !prev);
    setIsMoreMenuOpen(false);
  };

  const toggleHideAnswers = () => {
    setHideCorrectAnswers((prev) => !prev);
    setIsMoreMenuOpen(false);
  };

  // Outside-click dismissal for More menu
  useEffect(() => {
    if (!isMoreMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isMoreMenuOpen]);

  // Keyboard Shortcuts: A, B, C, D to select, Enter to check/submit/next, Arrows for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const key = e.key.toUpperCase();

      if (currentQuestion?.type === 'multiple_choice' && !isAnswered) {
        if (['A', 'B', 'C', 'D'].includes(key)) {
          e.preventDefault();
          setSelectedOption(key);
          return;
        }
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isAnswered) {
          if (currentQuestion?.type === 'multiple_choice' && selectedOption) {
            handleCheckAnswer();
          } else if (currentQuestion?.type !== 'multiple_choice' && gridInInput.trim()) {
            handleSubmitGridInAnswer();
          }
        } else {
          setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, isAnswered, selectedOption, gridInInput, questions.length]);

  // Adapter for AITutorDrawer
  const aiTutorQuestionAdapter: Question | undefined = useMemo(() => {
    if (!currentQuestion) return undefined;
    return {
      id: currentQuestion.id,
      number: currentIndex + 1,
      section: 'math',
      module: currentQuestion.module || 1,
      domain: currentQuestion.domain,
      difficulty: currentQuestion.difficulty,
      prompt: currentQuestion.question,
      options: currentQuestion.options as any,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      type: currentQuestion.type,
      hint: currentQuestion.hint,
      desmosEquation: currentQuestion.desmosTip,
    };
  }, [currentQuestion, currentIndex]);

  if (!currentQuestion) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        No questions available for practice.
        <button onClick={onGoBack} className="block mt-4 text-emerald-600 dark:text-emerald-400 hover:underline mx-auto">
          Return to Question Bank
        </button>
      </div>
    );
  }

  // Render question card content (reused in single view or split pane)
  const renderQuestionCard = () => (
    <div
      ref={questionAreaRef}
      onMouseUp={handleQuestionAreaMouseUp}
      className={`rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all duration-200 bg-white dark:bg-[#0c1424] border-2 border-emerald-500/25 dark:border-emerald-500/35 text-slate-900 dark:text-slate-100 ${
        isHighlightMode ? 'cursor-text selection:bg-amber-400/40 selection:text-slate-900 ring-2 ring-amber-400/40' : ''
      }`}
    >
      {/* Question Sub-Header: Exam Source Badge, Difficulty, Mark for Review & Question ID */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800/80 flex-wrap gap-y-2">
        {/* Left Badges */}
        <div className="flex items-center gap-2">
          {currentQuestion.source && (
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200/80 dark:bg-emerald-950/70 dark:text-emerald-400 dark:border-emerald-500/30">
              {currentQuestion.source}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
            {currentQuestion.difficulty}
          </span>
          {isHighlightMode && (
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-[11px] font-bold flex items-center space-x-1 animate-pulse">
              <Highlighter className="w-3 h-3" />
              <span>Highlighter Active</span>
            </span>
          )}
          {showFirstTryStats && (
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-[11px] font-mono font-semibold flex items-center space-x-1">
              <span>First-Try: {currentRecord ? (currentRecord.attemptsCount === 1 && currentRecord.isCorrect ? '✓ Pass' : '✕ Miss') : 'Unattempted'}</span>
            </span>
          )}
        </div>

        {/* Right Controls: Mark for Review & Question ID */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleMarkForReview}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border shadow-sm ${
              isMarked
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700/60'
            }`}
            title={isMarked ? 'Remove review mark' : 'Mark this question for review'}
          >
            <svg className={`w-3.5 h-3.5 fill-current ${isMarked ? 'text-amber-500' : 'text-slate-400'}`} viewBox="0 0 24 24">
              <path d="M5 3v18l7-5 7 5V3z" />
            </svg>
            <span>Mark for Review</span>
          </button>
          <span className="text-[11px] font-mono text-slate-400">ID: {currentQuestion.id.toUpperCase()}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/study/question-bank?q=${currentQuestion.id}`);
              alert('Question link copied to clipboard!');
            }}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.03] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Copy Question Link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Question Stem Text with KaTeX (large font text-base sm:text-lg) */}
      <div className="py-3 text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-relaxed font-normal select-text">
        <MathText text={currentQuestion.questionText || currentQuestion.question} />
      </div>

      {/* ─── Answer Choices Area (Full-Width Cards) ─────────────────── */}
      <div className="space-y-4 pt-2">
        
        {/* Multiple Choice Format with Option Eliminator */}
        {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isEliminated = eliminatedOptions.includes(opt.id);
                const isOptionCorrect = opt.id === currentQuestion.correctAnswer;

                let cardClass =
                  'bg-white hover:bg-amber-50/50 hover:border-amber-300 border border-slate-200/90 text-slate-800 shadow-sm dark:bg-slate-900/60 dark:hover:bg-slate-800/80 dark:border-slate-800 dark:hover:border-emerald-500/40 dark:text-slate-200';
                let badgeClass =
                  'border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';

                if (isAnswered) {
                  if (isOptionCorrect) {
                    cardClass =
                      'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 dark:bg-emerald-500/20 dark:border-emerald-500 dark:text-emerald-200 font-semibold shadow-sm';
                    badgeClass =
                      'border-2 border-emerald-600 bg-emerald-600 text-white font-extrabold dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950';
                  } else if (isSelected && !isOptionCorrect) {
                    cardClass =
                      'bg-rose-50 border-2 border-rose-600 text-rose-950 dark:bg-rose-500/20 dark:border-rose-500 dark:text-rose-200 shadow-sm';
                    badgeClass =
                      'border-2 border-rose-600 bg-rose-600 text-white font-extrabold dark:border-rose-500 dark:bg-rose-500 dark:text-white';
                  }
                } else if (isSelected) {
                  // Amber outline in light mode, emerald outline in dark mode
                  cardClass =
                    'bg-amber-50/80 border-2 border-amber-500 text-amber-950 shadow-md ring-2 ring-amber-400/40 font-semibold dark:bg-emerald-500/15 dark:border-2 dark:border-emerald-500 dark:text-emerald-200 dark:ring-2 dark:ring-emerald-500/50 dark:shadow-[0_0_20px_rgba(16,185,129,0.2)]';
                  badgeClass =
                    'border-2 border-amber-500 bg-amber-500 text-white font-extrabold dark:border-emerald-500 dark:bg-emerald-500 dark:text-slate-950';
                }

                if (isEliminated && !isAnswered) {
                  cardClass =
                    'opacity-40 line-through bg-slate-100 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => !isEliminated && handleSelectOptionCard(opt.id)}
                    className={`w-full p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer group active:scale-[0.99] select-text ${cardClass}`}
                  >
                    {/* Left: Circular Letter Badge + Math Text */}
                    <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
                      <span className={`w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-all flex-shrink-0 ${badgeClass}`}>
                        ({opt.id})
                      </span>

                      <div className="flex-1 text-base font-medium select-text text-slate-900 dark:text-slate-100">
                        <MathText text={opt.text} inline />
                      </div>
                    </div>

                    {/* Right: Evaluated icon or Option Eliminator Button */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {isAnswered && isOptionCorrect && !hideCorrectAnswers && (
                        <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                          <Check className="w-5 h-5" />
                        </span>
                      )}
                      {isAnswered && isSelected && !isOptionCorrect && (
                        <span className="p-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400">
                          <X className="w-5 h-5" />
                        </span>
                      )}

                      {/* Option Eliminator Button */}
                      {!isAnswered && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleEliminateOption(opt.id, e)}
                          className={`p-1.5 rounded-lg border text-xs font-mono transition-all ${
                            isEliminated
                              ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40'
                              : 'bg-slate-100 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200'
                          }`}
                          title={isEliminated ? 'Restore choice' : 'Eliminate choice'}
                        >
                          <span className="line-through font-bold">[{opt.id}]</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Check Answer Button (Two-Step Flow) */}
            {!isAnswered && (
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={!selectedOption}
                  onClick={handleCheckAnswer}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 dark:text-slate-950 font-extrabold text-xs shadow-md disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Check Answer</span>
                </button>

                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium font-mono text-center sm:text-left">
                  {selectedOption ? `Selected: Choice (${selectedOption})` : 'Select an answer above to check'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Student-Produced Grid-In Format */}
        {currentQuestion.type === 'student_produced' && (
          <form onSubmit={handleSubmitGridInAnswer} className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/[0.08] space-y-4 overflow-hidden">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Enter your numerical or fractional answer:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full mt-3">
              <input
                type="text"
                disabled={isAnswered}
                value={gridInInput}
                onChange={(e) => setGridInInput(e.target.value)}
                placeholder="e.g. 15, 5/13, 0.75"
                className="flex-1 min-w-0 px-4 py-3 bg-white dark:bg-slate-950/60 border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500 transition-all text-base disabled:opacity-75 shadow-inner"
              />

              {!isAnswered && (
                <button
                  type="submit"
                  disabled={!gridInInput.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl whitespace-nowrap transition-colors flex-shrink-0 disabled:opacity-40 active:scale-95 shadow-glow-emerald"
                >
                  <Send className="w-4 h-4" />
                  <span>Check Answer</span>
                </button>
              )}
            </div>
          </form>
        )}

        {/* Result Feedback Banner (Revealed after checking) */}
        {isAnswered && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200 ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-500/50 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              )}
              <div>
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {isCorrect ? 'Correct! Outstanding work.' : `Incorrect. The correct answer is (${currentQuestion.correctAnswer}).`}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {isCorrect ? 'You earned +30 XP on this problem.' : 'Review the step-by-step breakdown to learn this concept.'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              {!isCorrect && (
                <button
                  type="button"
                  onClick={() => setIsDiagnosticOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 text-xs font-extrabold shadow-md shadow-orange-500/25 dark:shadow-glow-emerald transition-all active:scale-95 flex items-center space-x-1.5 flex-shrink-0"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Why Did You Miss It?</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.15] border border-slate-200 dark:border-white/[0.12] text-xs font-bold text-slate-800 dark:text-white transition-all flex items-center space-x-1.5 flex-shrink-0 shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
                <span>{isExplanationOpen ? 'Hide Explanation' : 'View Explanation'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Step-by-Step KaTeX Breakdown Panel */}
        {isExplanationOpen && (
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-slate-900/90 border border-amber-200 dark:border-emerald-500/40 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/80 dark:border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-emerald-400">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-emerald-400" />
                <span>Step-by-Step KaTeX Breakdown</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-mono font-bold border border-emerald-300 dark:border-emerald-800">
                Correct Answer: ({currentQuestion.correctAnswer})
              </span>
            </div>

            <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 select-text">
              <MathText text={currentQuestion.explanation} />
            </div>

            {currentQuestion.desmosTip && (
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-start space-x-2.5">
                <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Desmos Shortcut Tip:</span>
                  <MathText text={currentQuestion.desmosTip} />
                </div>
              </div>
            )}

            {currentQuestion.hint && (
              <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-xs text-teal-900 dark:text-teal-200 flex items-start space-x-2.5">
                <Lightbulb className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Official SAT Hint:</span>
                  <MathText text={currentQuestion.hint} />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setIsAiTutorOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 active:scale-95 transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask ScoreUP AI Tutor for More Help</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 flex flex-col h-screen w-screen overflow-hidden select-none font-sans transition-colors duration-200">
      
      {/* ─── 1. TOP HEADER NAVIGATION BAR (FULL BLUEBOOK) ─────────────── */}
      <header className="sticky top-0 z-30 w-full bg-white/95 text-slate-800 border-b border-slate-200/90 dark:bg-[#090d16]/95 dark:text-slate-100 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0 backdrop-blur shadow-sm dark:shadow-none transition-colors">
        
        {/* Left: Active Domain & Topic Pill */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-emerald-950/60 border border-amber-200/80 dark:border-emerald-800/60 text-xs font-mono font-bold text-amber-900 dark:text-emerald-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-emerald-400 animate-pulse" />
            <span>{currentQuestion.domain} • {currentQuestion.topic || selectedTopicName}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsDirectionsOpen(true)}
            className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors items-center space-x-1"
          >
            <span>Directions</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Right: Timer toggle, Formula sheet, Desmos Calculator, Exit to Study Hub */}
        <div className="flex items-center space-x-2">
          {/* Active Stopwatch Timer */}
          <ExamTimer />

          {/* Highlight Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsHighlightMode(!isHighlightMode);
              if (isHighlightMode) setFloatingHighlightMenu(null);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 shadow-sm ${
              isHighlightMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/60'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 dark:bg-white/[0.04] dark:text-slate-400 dark:border-white/[0.08] dark:hover:text-white'
            }`}
            title={isHighlightMode ? 'Highlighter Mode Active (Click to toggle off)' : 'Enable Highlighter Mode'}
          >
            <Highlighter className={`w-4 h-4 ${isHighlightMode ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden lg:inline">Highlight</span>
          </button>

          {/* Formula Sheet Button */}
          <button
            type="button"
            onClick={() => setIsReferenceOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center space-x-1.5 shadow-sm"
            title="SAT Math Formula Reference Sheet"
          >
            <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="hidden md:inline">Formula Sheet</span>
          </button>

          {/* Desmos Calculator Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsSplitCalculatorOpen(!isSplitCalculatorOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 shadow-sm ${
              isSplitCalculatorOpen
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/50'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:border-white/[0.08] dark:text-slate-300 dark:hover:text-white'
            }`}
            title={isSplitCalculatorOpen ? 'Close calculator drawer' : 'Open embedded Desmos calculator drawer'}
          >
            <Calculator className="w-4 h-4 text-amber-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Calculator</span>
          </button>

          {/* More Menu Trigger & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen((prev) => !prev)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                isMoreMenuOpen
                  ? 'bg-amber-100 text-amber-900 dark:bg-slate-800 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
              }`}
              title="More Options"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.75" />
                <circle cx="12" cy="12" r="1.75" />
                <circle cx="12" cy="19" r="1.75" />
              </svg>
              <span className="text-[10px] leading-tight">More</span>
            </button>

            {/* Dropdown Menu */}
            {isMoreMenuOpen && (
              <div 
                ref={moreMenuRef}
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-[#0e141c] border border-slate-200 dark:border-slate-800 shadow-[0_16px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.85)] p-2 z-50 flex flex-col gap-1 text-sm animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900 dark:text-slate-100"
              >
                {/* 1. Fullscreen */}
                <button
                  type="button"
                  onClick={toggleFullScreen}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium text-left w-full"
                >
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Fullscreen</span>
                </button>

                {/* 2. Mute AI Popups */}
                <button
                  type="button"
                  onClick={toggleMuteAiPopups}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium text-left w-full"
                >
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18.36 18.36A9 9 0 0 1 5.64 5.64M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{isMuteAiPopups ? 'Unmute AI popups' : 'Mute AI popups'}</span>
                </button>

                {/* 3. Show First-Try Stats */}
                <button
                  type="button"
                  onClick={toggleShowFirstTryStats}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium text-left w-full"
                >
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>{showFirstTryStats ? 'Hide first-try stats' : 'Show first-try stats'}</span>
                </button>

                {/* 4. Hide Correct Answers */}
                <button
                  type="button"
                  onClick={toggleHideAnswers}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium text-left w-full"
                >
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{hideCorrectAnswers ? 'Show correct answers' : 'Hide correct answers'}</span>
                </button>

                {/* 5. Keyboard Shortcuts */}
                <button
                  type="button"
                  onClick={() => { setIsMoreMenuOpen(false); setIsShortcutsOpen(true); }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium text-left w-full"
                >
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M18 12h.01M8 16h8"/>
                  </svg>
                  <span>Keyboard shortcuts</span>
                </button>

                {/* 6. Switch Theme */}
                <button
                  type="button"
                  onClick={() => { toggleTheme(); setIsMoreMenuOpen(false); }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium text-left w-full"
                >
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                  <span>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</span>
                </button>

                {/* Divider */}
                <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                {/* 7. Bug Report */}
                <button
                  type="button"
                  onClick={() => { setIsMoreMenuOpen(false); setIsBugReportOpen(true); }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-200 transition-colors text-xs font-medium text-left w-full"
                >
                  <svg className="w-4 h-4 text-rose-500 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Bug Report</span>
                </button>
              </div>
            )}
          </div>

          {/* Exit to Study Hub Button */}
          <button
            type="button"
            onClick={onGoBack}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.1] text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-all active:scale-95 flex items-center space-x-1.5 shadow-sm group"
            title="Exit to Study Hub"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-600 dark:text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Exit to Study Hub</span>
            <span className="sm:hidden">Exit</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle size="sm" />
        </div>
      </header>

      {/* ─── 2. MAIN 3-PANEL SPLIT VIEWPORT CANVAS ─────────────────────── */}
      <div
        ref={splitContainerRef}
        className="flex flex-row flex-1 h-[calc(100vh-128px)] overflow-hidden w-full relative select-none"
      >
        {/* Panel 1 (Left): Embedded Desmos Calculator (if active) */}
        {isSplitCalculatorOpen && (
          <>
            <div
              style={{ width: `${calcWidthPercent}%`, minWidth: '320px' }}
              className="h-full flex-shrink-0"
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

            {/* Center Draggable Resizing Divider */}
            <div
              onMouseDown={() => setIsDraggingDivider(true)}
              className="w-2.5 bg-slate-200 hover:bg-emerald-500/40 dark:bg-slate-900 dark:hover:bg-emerald-500/30 border-x border-slate-300 dark:border-slate-800/90 flex items-center justify-center cursor-col-resize select-none transition-colors group z-20 flex-shrink-0"
              title="Drag to resize calculator and question pane"
            >
              <div className="flex flex-col space-y-1 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 items-center">
                <div className="flex space-x-0.5">
                  <div className="w-1 h-1 rounded-full bg-current" />
                  <div className="w-1 h-1 rounded-full bg-current" />
                </div>
                <div className="flex space-x-0.5">
                  <div className="w-1 h-1 rounded-full bg-current" />
                  <div className="w-1 h-1 rounded-full bg-current" />
                </div>
                <div className="flex space-x-0.5">
                  <div className="w-1 h-1 rounded-full bg-current" />
                  <div className="w-1 h-1 rounded-full bg-current" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Panel 2 (Center/Right): Practice Question Stem & Interactive Option Cards */}
        <div
          className={`flex-1 h-full overflow-y-auto px-4 sm:px-8 py-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 ${
            !isSplitCalculatorOpen ? 'max-w-4xl mx-auto' : 'w-full'
          }`}
        >
          {renderQuestionCard()}
        </div>

        {/* Panel 3 (Right Slide-out Drawer): Step-by-Step Mathematical Explanation */}
        {isExplanationOpen && (
          <ExplanationSideDrawer
            isOpen={isExplanationOpen}
            onClose={() => setIsExplanationOpen(false)}
            question={currentQuestion}
            isCorrect={isCorrect}
            isAnswered={isAnswered}
            onAskAiTutor={() => setIsAiTutorOpen(true)}
          />
        )}

        {/* Post-Question Diagnostic Drawer: Why Did You Miss It? */}
        {isDiagnosticOpen && currentQuestion && (
          <DiagnosticMistakeDrawer
            isOpen={isDiagnosticOpen}
            onClose={() => setIsDiagnosticOpen(false)}
            questionId={currentQuestion.id}
            domain={currentQuestion.domain}
            subtopicName={currentQuestion.topic || selectedTopicName}
            difficulty={currentQuestion.difficulty}
            isCorrect={isCorrect}
            timeSpentSeconds={attemptsMap[currentQuestion.id]?.timeSpentSeconds || 35}
          />
        )}
      </div>

      {/* ─── FLOATING HIGHLIGHT QUICK ACTION POPUP ────────────────────── */}
      {floatingHighlightMenu && (
        <div
          style={{
            left: `${floatingHighlightMenu.x}px`,
            top: `${floatingHighlightMenu.y}px`,
          }}
          className="fixed -translate-x-1/2 -translate-y-full mb-2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/90 backdrop-blur-2xl shadow-2xl rounded-2xl p-1.5 flex items-center space-x-1 z-50 animate-in fade-in zoom-in-95 duration-150 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {!floatingHighlightMenu.isExisting ? (
            <button
              type="button"
              onClick={applyHighlight}
              className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 border border-amber-300 dark:border-amber-400/50 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Highlight</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={removeHighlight}
              className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 border border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-300 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
            >
              <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Remove</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setFloatingHighlightMenu(null)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── 3. BOTTOM NAVIGATION BAR (FULL BLUEBOOK) ───────────────── */}
      <footer className="sticky bottom-0 z-30 w-full bg-white/95 text-slate-800 border-t border-slate-200/90 dark:bg-[#090d16]/95 dark:text-slate-100 dark:border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 backdrop-blur shadow-sm dark:shadow-none transition-colors">
        
        {/* Footer Left Corner: Question Navigator Pill */}
        <button
          id="question-navigator-trigger"
          type="button"
          onClick={() => setIsGridModalOpen((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 hover:border-emerald-500/50 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all shadow-sm active:scale-95"
          title="Open Question Review Grid"
        >
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Question {currentIndex + 1}</span>
          <span className="text-slate-500 dark:text-slate-400">of {questions.length}</span>
          <svg
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isGridModalOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Center: "View Step-by-Step KaTeX Breakdown" collapsible solution button */}
        <button
          type="button"
          onClick={() => setIsExplanationOpen(!isExplanationOpen)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
            isExplanationOpen
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white dark:from-teal-500 dark:to-emerald-600 dark:text-slate-950 shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-slate-200 border border-slate-200 dark:border-white/[0.08]'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">View Step-by-Step KaTeX Breakdown</span>
          <span className="sm:hidden">KaTeX Solution</span>
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isExplanationOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Right: "Back", "Check Answer" / "Submit", "Next Question →" */}
        <div className="flex items-center space-x-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm flex items-center space-x-1 active:scale-95"
            title="Previous Question (ArrowLeft)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Check Answer / Submit Button (shown before answer is submitted) */}
          {!isAnswered && (
            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={currentQuestion.type === 'multiple_choice' ? !selectedOption : !gridInInput.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 dark:text-slate-950 font-extrabold text-xs shadow-md disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check Answer</span>
            </button>
          )}

          {/* Next Question Button */}
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIndex === questions.length - 1}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 dark:text-slate-950 font-extrabold text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md flex items-center space-x-1.5 active:scale-95"
            title="Next Question (ArrowRight)"
          >
            <span className="hidden sm:inline">Next Question</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* ─── MODALS & UTILITY PANELS ─────────────────────────────────── */}

      {/* Floating Desmos Calculator Modal (when popped out) */}
      <DesmosModal
        isOpen={isDesmosOpen}
        onClose={() => setIsDesmosOpen(false)}
      />

      {/* Reference Sheet Modal */}
      <ReferenceSheetModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      {/* Directions Modal */}
      <PracticeRoomDirectionsModal
        isOpen={isDirectionsOpen}
        onClose={() => setIsDirectionsOpen(false)}
      />

      {/* Floating Question Grid Navigator Modal */}
      <PracticeRoomGridModal
        isOpen={isGridModalOpen}
        onClose={() => setIsGridModalOpen(false)}
        questions={questions}
        currentIndex={currentIndex}
        onSelectIndex={(idx) => setCurrentIndex(idx)}
        attemptsMap={attemptsMap}
      />

      {/* ScoreUP AI Tutor Drawer */}
      <AITutorDrawer
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        question={aiTutorQuestionAdapter}
      />

      {/* Keyboard Shortcuts Dialog */}
      {isShortcutsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsShortcutsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0d131a] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base flex items-center space-x-2">
                <span>⌨️ Keyboard Shortcuts</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsShortcutsOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-sans">Select Option A, B, C, D</span>
                <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">A / B / C / D</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-sans">Check Answer / Next</span>
                <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">Enter ↵</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-sans">Previous / Next Question</span>
                <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">← / →</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsShortcutsOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bug Report Dialog */}
      {isBugReportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsBugReportOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0d131a] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-slate-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-base flex items-center space-x-2 text-rose-600 dark:text-rose-400">
                <span>Report an Issue</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBugReportOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Reporting an issue for Question ID:{' '}
              <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                {currentQuestion.id.toUpperCase()}
              </span>
            </p>

            <textarea
              placeholder="Describe what's wrong with this question (e.g., typo, incorrect answer key, rendering glitch)..."
              rows={4}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBugReportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Thank you for reporting! Our curriculum team has logged this item.');
                  setIsBugReportOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-400 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Masterclass Video / Concept Modal */}
      {isMasterclassOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
          onClick={() => setIsMasterclassOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl p-6 bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 shadow-2xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <PlayCircle className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">SAT Masterclass Video Lesson</h3>
              </div>
              <button
                onClick={() => setIsMasterclassOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Desmos Speed Strategies: {currentQuestion.topic}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Watch ScoreUP Academy's video walkthrough demonstrating how to solve {currentQuestion.topic} problems in under 30 seconds with graphing tricks.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-400 space-y-2">
                <div className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">Key Principle:</div>
                <p>Always inspect linear intercepts or system intersections before manual calculation.</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href="https://www.youtube.com/@ScoreUp_Academy_SAT"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <span>Open YouTube Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsMasterclassOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.08] dark:hover:bg-white/[0.15] text-slate-800 dark:text-white text-xs font-bold shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper to highlight a matching text snippet in DOM tree on restoration
function highlightSnippetInElement(root: HTMLElement, searchText: string, qId: string) {
  const existingMarks = root.querySelectorAll('mark.sat-highlight');
  for (let i = 0; i < existingMarks.length; i++) {
    if (existingMarks[i].textContent?.includes(searchText)) {
      return;
    }
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.parentElement?.tagName.toLowerCase() !== 'mark' && node.nodeValue?.includes(searchText)) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((node) => {
    const val = node.nodeValue || '';
    const idx = val.indexOf(searchText);
    if (idx !== -1) {
      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + searchText.length);

      const mark = document.createElement('mark');
      mark.className = 'sat-highlight bg-amber-400/35 text-inherit rounded px-0.5 border-b-2 border-amber-400/70 shadow-sm cursor-pointer hover:bg-amber-400/50 transition-colors';
      mark.setAttribute('data-question-id', qId);

      try {
        range.surroundContents(mark);
      } catch {
        // ignore crossing boundaries
      }
    }
  });
}
