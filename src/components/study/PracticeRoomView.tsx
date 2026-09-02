import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionItem } from '../../types/questionBank';
import { Question } from '../../types';
import { MathRenderer } from '../common/MathRenderer';
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

  // Attempts map per question ID
  const [attemptsMap, setAttemptsMap] = useState<Record<string, QuestionAttemptRecord>>({});

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

  // Mark for review toggle
  const handleToggleMarkForReview = () => {
    if (!currentQuestion) return;
    setAttemptsMap((prev) => {
      const existing = prev[currentQuestion.id];
      return {
        ...prev,
        [currentQuestion.id]: {
          isAnswered: existing?.isAnswered || false,
          isCorrect: existing?.isCorrect,
          selectedAnswer: existing?.selectedAnswer || '',
          attemptsCount: existing?.attemptsCount || 0,
          isMarkedForReview: !existing?.isMarkedForReview,
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
      setIsDiagnosticOpen(true);
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
      {/* Question Sub-Header: Badge Number, Mark for Review, Source & Action icons */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08] flex-wrap gap-y-2">
        
        <div className="flex items-center space-x-3">
          {/* Question Number Badge */}
          <div className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-slate-950 border border-emerald-200 dark:border-white/[0.12] text-slate-900 dark:text-white font-mono font-extrabold text-sm shadow-inner flex items-center space-x-1.5">
            <span className="text-emerald-600 dark:text-emerald-400">#</span>
            <span>{currentIndex + 1}</span>
          </div>

          {/* Mark for Review Toggle */}
          <button
            type="button"
            onClick={handleToggleMarkForReview}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 ${
              isMarked
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:border-amber-500/50 dark:text-amber-300 shadow-sm'
                : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.06]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400' : ''}`} />
            <span>Mark for Review</span>
          </button>
        </div>

        {/* Metadata Badges & Right Tools */}
        <div className="flex items-center space-x-2.5 text-xs text-slate-500 dark:text-slate-400">
          {isHighlightMode && (
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-[11px] font-bold flex items-center space-x-1 animate-pulse">
              <Highlighter className="w-3 h-3" />
              <span>Highlighter Active</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-[11px] font-mono text-slate-700 dark:text-slate-300">
            {currentQuestion.domain}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-slate-950 border border-emerald-200 dark:border-white/[0.06] text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
            {currentQuestion.difficulty}
          </span>
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

      {/* Question Stem Text with KaTeX (inherits crisp dark slate in light mode, white in dark mode) */}
      <div className="py-2 text-slate-900 dark:text-slate-100 text-lg leading-relaxed font-normal select-text">
        <MathRenderer content={currentQuestion.question} />
      </div>

      {/* ─── Answer Choices Area (Two-Step Flow) ─────────────────── */}
      <div className="space-y-4 pt-2">
        
        {/* Multiple Choice Format with Option Eliminator */}
        {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isEliminated = eliminatedOptions.includes(opt.id);
                const isOptionCorrect = opt.id === currentQuestion.correctAnswer;

                let cardClass = 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 dark:border-slate-800 dark:text-slate-200';
                let pillClass = 'bg-slate-200 text-slate-800 dark:bg-white/[0.08] dark:text-slate-300';

                if (isAnswered) {
                  if (isOptionCorrect) {
                    cardClass = 'bg-emerald-100 border-2 border-emerald-600 text-emerald-950 dark:bg-emerald-500/20 dark:border-emerald-500/60 dark:text-emerald-200 font-semibold shadow-sm';
                    pillClass = 'bg-emerald-600 text-white font-extrabold dark:bg-emerald-500 dark:text-slate-950';
                  } else if (isSelected && !isOptionCorrect) {
                    cardClass = 'bg-rose-100 border-2 border-rose-600 text-rose-950 dark:bg-rose-500/20 dark:border-rose-500/60 dark:text-rose-200 shadow-sm';
                    pillClass = 'bg-rose-600 text-white font-extrabold';
                  }
                } else if (isSelected) {
                  cardClass = 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 shadow-sm dark:bg-emerald-500/15 dark:border-emerald-400/80 dark:text-white ring-1 ring-emerald-500/30 font-semibold';
                  pillClass = 'bg-emerald-600 text-white font-extrabold dark:bg-emerald-400 dark:text-slate-950';
                }

                if (isEliminated && !isAnswered) {
                  cardClass = 'opacity-40 line-through bg-slate-100 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => !isEliminated && handleSelectOptionCard(opt.id)}
                    className={`p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer group active:scale-[0.99] select-text ${cardClass}`}
                  >
                    {/* Left: Option Letter Pill + Math Text */}
                    <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
                      <span className={`w-8 h-8 rounded-xl font-mono text-sm flex items-center justify-center transition-all flex-shrink-0 ${pillClass}`}>
                        {opt.id}
                      </span>

                      <div className="flex-1 text-base font-medium select-text text-slate-900 dark:text-slate-100">
                        <MathRenderer content={opt.text} inline />
                      </div>
                    </div>

                    {/* Right: Evaluated icon or Option Eliminator Button */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {isAnswered && isOptionCorrect && (
                        <span className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                          <Check className="w-5 h-5" />
                        </span>
                      )}
                      {isAnswered && isSelected && !isOptionCorrect && (
                        <span className="p-1 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400">
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
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-glow-emerald disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center space-x-2"
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
                onClick={() => setIsExplanationOpen(true)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.15] border border-slate-200 dark:border-white/[0.12] text-xs font-bold text-slate-800 dark:text-white transition-all flex items-center space-x-1.5 flex-shrink-0 shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-orange-600 dark:text-emerald-400" />
                <span>View Explanation</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 flex flex-col h-screen w-screen overflow-hidden select-none font-sans transition-colors duration-200">
      
      {/* ─── 1. TOP HEADER NAVIGATION BAR (STICKY TOP) ───────────────── */}
      <header className="sticky top-0 z-30 w-full bg-white/95 text-slate-800 border-b border-slate-200/90 dark:bg-[#090d16]/95 dark:text-slate-100 dark:border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 backdrop-blur shadow-sm dark:shadow-none transition-colors">
        
        {/* Left: Go Back + Directions Dropdown */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onGoBack}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.1] text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-all active:scale-95 flex items-center space-x-1.5 shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Go back</span>
          </button>

          <button
            onClick={() => setIsDirectionsOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center space-x-1.5"
          >
            <span>Directions</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Center: Active Stopwatch Timer (Isolated Leaf Component) */}
        <ExamTimer />

        {/* Right Utility Bar: Highlight, Calculator, Reference, More, Profile */}
        <div className="flex items-center space-x-2">
          
          {/* Highlight Button */}
          <button
            onClick={() => {
              setIsHighlightMode(!isHighlightMode);
              if (isHighlightMode) setFloatingHighlightMenu(null);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 ${
              isHighlightMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/60 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 dark:bg-white/[0.04] dark:text-slate-400 dark:border-white/[0.08] dark:hover:text-white'
            }`}
            title={isHighlightMode ? 'Highlighter Mode Active (Click to toggle off)' : 'Enable Highlighter Mode'}
          >
            <Highlighter className={`w-4 h-4 ${isHighlightMode ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden md:inline">Highlight</span>
          </button>

          {/* Calculator (Toggles Side-by-Side Split Panel) */}
          <button
            onClick={() => setIsSplitCalculatorOpen(!isSplitCalculatorOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 ${
              isSplitCalculatorOpen
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/50 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:border-white/[0.08] dark:text-slate-300 dark:hover:text-white'
            }`}
            title={isSplitCalculatorOpen ? 'Close calculator panel' : 'Open embedded split calculator'}
          >
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Calculator</span>
          </button>

          {/* Reference Sheet */}
          <button
            onClick={() => setIsReferenceOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center space-x-1.5"
            title="SAT Math Reference Sheet"
          >
            <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="hidden md:inline">Reference</span>
          </button>

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl p-2.5 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                <button
                  onClick={() => {
                    setIsDirectionsOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors flex items-center space-x-2"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Test Directions</span>
                </button>
                <button
                  onClick={() => {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      document.documentElement.requestFullscreen();
                    }
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors flex items-center space-x-2"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Toggle Fullscreen</span>
                </button>
                <button
                  onClick={() => {
                    handleRemixQuestion();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Reset Question Attempt</span>
                </button>
              </div>
            )}
          </div>

          {/* User Score Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
            <User className="w-3.5 h-3.5" />
            <span>{userProgress.mathScore}/800</span>
          </div>

          {/* Global Theme Switcher */}
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

      {/* ─── 3. BOTTOM DOCK & QUESTION NAVIGATOR GRID (STICKY BOTTOM) ─ */}
      <footer className="sticky bottom-0 z-30 w-full bg-white/95 text-slate-800 border-t border-slate-200/90 dark:bg-[#090d16]/95 dark:text-slate-100 dark:border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 backdrop-blur shadow-sm dark:shadow-none transition-colors">
        
        {/* Left: Floating Question Grid Trigger */}
        <button
          onClick={() => setIsGridModalOpen(true)}
          className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/[0.1] text-xs font-mono font-bold text-slate-900 dark:text-white transition-all active:scale-95 flex items-center space-x-2 shadow-sm"
          title="Open Question Grid Navigator"
        >
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{currentIndex + 1}</span>
          <span className="text-slate-500 dark:text-slate-400">of {questions.length}</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        </button>

        {/* Center & Right Actions: Ask AI, Masterclass, Remix, Explanation, Next */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Ask ScoreUP AI (Violet Button) */}
          <button
            onClick={() => setIsAiTutorOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-extrabold text-xs transition-all active:scale-95 flex items-center space-x-1.5 shadow-[0_0_18px_rgba(139,92,246,0.35)]"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask ScoreUP AI</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Masterclass Link/Modal */}
          <button
            onClick={() => setIsMasterclassOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center space-x-1.5 hidden md:flex shadow-sm"
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Masterclass</span>
          </button>

          {/* Remix / Reset */}
          <button
            onClick={handleRemixQuestion}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors shadow-sm"
            title="Remix / Reset attempt"
          >
            <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>

          {/* Explanation Toggle */}
          <button
            onClick={() => setIsExplanationOpen(!isExplanationOpen)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
              isExplanationOpen
                ? 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/50'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border-slate-200 dark:border-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">
              {isExplanationOpen ? 'Hide Explanation' : 'Explanation'}
            </span>
          </button>

          {/* Previous / Next Buttons */}
          <div className="flex items-center space-x-1 pl-1">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Previous Question (ArrowLeft)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-glow-emerald flex items-center space-x-1 active:scale-95"
              title="Next Question (ArrowRight)"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

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
