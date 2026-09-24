import React, { useState } from 'react';
import { Calculator, FileText, Clock, Bookmark, ChevronDown, Sparkles, Pencil, ArrowLeft, AlertTriangle, Pause, Play, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';

interface BluebookHeaderProps {
  secondsRemaining: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenDesmos: () => void;
  isSplitCalculatorOpen?: boolean;
  onOpenReference: () => void;
  onToggleScratchpad: () => void;
  onToggleAiTutor: () => void;
  isScratchpadActive: boolean;
  isAiTutorOpen: boolean;
  currentQuestionId: string;
}

export const BluebookHeader: React.FC<BluebookHeaderProps> = ({
  secondsRemaining,
  isPaused,
  onTogglePause,
  onOpenDesmos,
  isSplitCalculatorOpen,
  onOpenReference,
  onToggleScratchpad,
  onToggleAiTutor,
  isScratchpadActive,
  isAiTutorOpen,
  currentQuestionId
}) => {
  const { markedForReview, toggleMark, setCurrentView, activeExamMode, currentModule } = useApp();
  const [showTimerDigits, setShowTimerDigits] = useState<boolean>(true);
  const [showDirections, setShowDirections] = useState<boolean>(false);

  const isMarked = markedForReview.includes(currentQuestionId);
  const is5MinWarning = secondsRemaining <= 300 && secondsRemaining > 60;
  const isLowTime = secondsRemaining <= 60;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const moduleTitle =
    activeExamMode === 'full'
      ? `Module ${currentModule} (Adaptive)`
      : activeExamMode === 'module1'
      ? 'Module 1 Diagnostic'
      : 'Module 2 (Hard 750+ Track)';

  const questionsRange =
    activeExamMode === 'full'
      ? currentModule === 1
        ? '1–22'
        : '23–44'
      : '1–22';

  return (
    <header className="px-4 sm:px-6 py-2.5 flex items-center justify-between text-slate-800 dark:text-slate-100 select-none z-40 relative backdrop-blur-md bg-white/95 border-b border-slate-200 dark:bg-[#090d16]/95 dark:border-slate-800 transition-colors duration-200 shadow-sm dark:shadow-none">
      
      {/* Left: Exit Exam & Section Info */}
      <div className="flex items-center space-x-3 sm:space-x-4">

        {/* Exit Exam */}
        <button
          onClick={() => setCurrentView('dashboard')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm group"
          title="Exit Bluebook Exam Room"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150 text-emerald-600 dark:text-emerald-400" />
          <span>Exit Exam</span>
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

        <div className="flex flex-col">
          <span className="text-xs font-extrabold tracking-wide text-slate-900 dark:text-white uppercase">Section 2: Math</span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold font-mono">{moduleTitle}</span>
        </div>

        {/* Directions */}
        <button
          onClick={() => setShowDirections(!showDirections)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 hidden md:flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm"
        >
          <span>Directions</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        </button>

        {showDirections && (
          <div className="absolute top-14 left-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl p-4 text-xs max-w-sm shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <p className="font-extrabold text-slate-900 dark:text-white mb-1.5 text-sm">Module Directions</p>
            <p className="leading-relaxed">
              For questions {questionsRange}, solve each problem and select the best option or type your student-produced response. You may use the built-in Desmos calculator or reference sheet at any time.
            </p>
          </div>
        )}
      </div>

      {/* Middle: Timer */}
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-2 px-3.5 py-1 rounded-full transition-all duration-300 font-bold ${
          isLowTime
            ? 'bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-500/70 shadow-sm animate-pulse'
            : is5MinWarning
            ? 'bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/60 shadow-sm'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 shadow-sm'
        }`}>
          {isLowTime || is5MinWarning ? (
            <AlertTriangle className={`w-3.5 h-3.5 ${isLowTime ? 'text-rose-600 dark:text-rose-400 animate-bounce' : 'text-amber-600 dark:text-amber-400'}`} />
          ) : (
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          )}
          {showTimerDigits ? (
            <span className={`font-mono text-xs sm:text-sm font-extrabold ${isLowTime ? 'text-rose-800 dark:text-rose-400' : is5MinWarning ? 'text-amber-800 dark:text-amber-300' : 'text-emerald-900 dark:text-emerald-300'}`}>
              {formatTime(secondsRemaining)}
            </span>
          ) : (
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold tracking-wider">Hidden</span>
          )}
        </div>

        {/* Hide/Show Timer */}
        <button
          onClick={() => setShowTimerDigits(!showTimerDigits)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:text-white dark:border-slate-700 p-1.5 sm:px-2.5 rounded-full flex items-center space-x-1 text-[11px] font-bold shadow-sm transition-colors"
        >
          {showTimerDigits ? <EyeOff className="w-3.5 h-3.5 sm:hidden" /> : <Eye className="w-3.5 h-3.5 sm:hidden" />}
          <span className="hidden sm:inline">{showTimerDigits ? 'Hide' : 'Show'}</span>
        </button>

        {/* Pause/Resume */}
        <button
          onClick={onTogglePause}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
            isPaused
              ? 'bg-emerald-600 text-white border border-emerald-500 font-extrabold shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
          }`}
        >
          {isPaused
            ? <Play className="w-3.5 h-3.5 fill-white stroke-none" />
            : <Pause className="w-3.5 h-3.5" />
          }
          <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
      </div>

      {/* Right: Tool Pills */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">

        {/* Desmos Calculator */}
        <button
          onClick={onOpenDesmos}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            isSplitCalculatorOpen
              ? 'bg-emerald-500 text-slate-950 border border-emerald-400 font-extrabold shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
          }`}
          title={isSplitCalculatorOpen ? 'Close split calculator' : 'Open embedded split calculator'}
        >
          <Calculator className={`w-3.5 h-3.5 ${isSplitCalculatorOpen ? 'text-slate-950' : 'text-emerald-600 dark:text-emerald-400'}`} />
          <span className="hidden md:inline">Calculator</span>
        </button>

        {/* Reference Sheet */}
        <button
          onClick={onOpenReference}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="hidden md:inline">Reference</span>
        </button>

        {/* Scratchpad */}
        <button
          onClick={onToggleScratchpad}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            isScratchpadActive
              ? 'bg-emerald-500 text-slate-950 border border-emerald-400 font-extrabold shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Scratchpad</span>
        </button>

        {/* Ask ScoreUP AI */}
        <button
          data-ai-tutor-toggle="true"
          onClick={onToggleAiTutor}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            isAiTutorOpen
              ? 'bg-teal-500 text-slate-950 font-extrabold'
              : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60 dark:hover:bg-teal-900/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Ask ScoreUP AI</span>
        </button>

        {/* Mark for Review */}
        <button
          onClick={() => toggleMark(currentQuestionId)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            isMarked
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400' : ''}`} />
          <span className="hidden sm:inline">{isMarked ? 'Marked' : 'Mark'}</span>
        </button>

        {/* Global Theme Toggle */}
        <ThemeToggle size="sm" />
      </div>
    </header>
  );
};
