import React, { useState } from 'react';
import { Calculator, FileText, Clock, Bookmark, ChevronDown, Sparkles, Pencil, ArrowLeft, AlertTriangle, Pause, Play, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BluebookHeaderProps {
  secondsRemaining: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenDesmos: () => void;
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
  onOpenReference,
  onToggleScratchpad,
  onToggleAiTutor,
  isScratchpadActive,
  isAiTutorOpen,
  currentQuestionId
}) => {
  const { markedForReview, toggleMark, setCurrentView } = useApp();
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

  return (
    <header className="px-4 sm:px-6 py-2.5 flex items-center justify-between text-slate-100 select-none z-40 relative backdrop-blur-2xl bg-slate-950/80 border-b border-white/[0.07]"
      style={{ boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)' }}
    >
      {/* Left: Exit Exam & Section Info */}
      <div className="flex items-center space-x-3 sm:space-x-4">

        {/* Exit Exam — glass pill */}
        <button
          onClick={() => setCurrentView('dashboard')}
          className="glass-pill flex items-center space-x-1.5 text-slate-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold group"
          title="Exit Bluebook Exam Room"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
          <span>Exit Exam</span>
        </button>

        <div className="h-5 w-px bg-white/10 hidden sm:block" />

        <div className="flex flex-col">
          <span className="text-xs font-extrabold tracking-wide text-white uppercase">Section 2: Math</span>
          <span className="text-[11px] text-emerald-400 font-medium font-mono">Module 1 (Adaptive)</span>
        </div>

        {/* Directions — glass pill */}
        <button
          onClick={() => setShowDirections(!showDirections)}
          className="hidden md:flex items-center space-x-1 text-xs text-slate-300 hover:text-white glass-pill px-2.5 py-1 rounded-full"
        >
          <span>Directions</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {showDirections && (
          <div className="absolute top-14 left-4 glass-panel rounded-2xl p-4 text-xs text-slate-300 max-w-sm shadow-2xl z-50">
            <p className="font-bold text-white mb-1.5">Module Directions</p>
            <p className="leading-relaxed">
              For questions 1–22, solve each problem and select the best option or type your student-produced response. You may use the built-in Desmos calculator or reference sheet at any time.
            </p>
          </div>
        )}
      </div>

      {/* Middle: Timer */}
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-2 px-3.5 py-1 rounded-full transition-all duration-300 ${
          isLowTime
            ? 'bg-rose-950/80 border border-rose-500/70 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.35)] animate-pulse'
            : is5MinWarning
            ? 'bg-amber-950/80 border border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
            : 'glass-pill text-emerald-400'
        }`}>
          {isLowTime || is5MinWarning ? (
            <AlertTriangle className={`w-3.5 h-3.5 ${isLowTime ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
          ) : (
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          )}
          {showTimerDigits ? (
            <span className={`font-mono text-xs sm:text-sm font-bold ${isLowTime ? 'text-rose-400' : is5MinWarning ? 'text-amber-300' : 'text-emerald-400'}`}>
              {formatTime(secondsRemaining)}
            </span>
          ) : (
            <span className="text-xs font-mono text-slate-500 font-bold tracking-wider">Hidden</span>
          )}
        </div>

        {/* Hide/Show — glass pill */}
        <button
          onClick={() => setShowTimerDigits(!showTimerDigits)}
          className="glass-pill text-slate-400 hover:text-white p-1.5 sm:px-2.5 rounded-full flex items-center space-x-1 text-[11px] font-bold"
        >
          {showTimerDigits ? <EyeOff className="w-3.5 h-3.5 sm:hidden" /> : <Eye className="w-3.5 h-3.5 sm:hidden" />}
          <span className="hidden sm:inline">{showTimerDigits ? 'Hide' : 'Show'}</span>
        </button>

        {/* Pause/Resume — amber glass when paused */}
        <button
          onClick={onTogglePause}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
            isPaused
              ? 'bg-amber-500/90 text-slate-950 border border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.4)]'
              : 'glass-pill text-slate-300 hover:text-white'
          }`}
          style={{ transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)' }}
        >
          {isPaused
            ? <Play className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
            : <Pause className="w-3.5 h-3.5" />
          }
          <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
      </div>

      {/* Right: Tool Pills */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">

        {/* Desmos — glass pill */}
        <button
          onClick={onOpenDesmos}
          className="glass-pill flex items-center space-x-1.5 text-slate-200 hover:text-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold"
        >
          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Calculator</span>
        </button>

        {/* Reference Sheet — glass pill */}
        <button
          onClick={onOpenReference}
          className="glass-pill flex items-center space-x-1.5 text-slate-200 hover:text-teal-300 px-3 py-1.5 rounded-full text-xs font-bold"
        >
          <FileText className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden md:inline">Reference</span>
        </button>

        {/* Scratchpad — switches to emerald glass when active */}
        <button
          onClick={onToggleScratchpad}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            isScratchpadActive ? 'glass-pill-emerald text-emerald-200' : 'glass-pill text-slate-200 hover:text-white'
          }`}
          style={{ transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)' }}
        >
          <Pencil className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Scratchpad</span>
        </button>

        {/* Ask ScoreUP AI — switches to teal glass when open */}
        <button
          onClick={onToggleAiTutor}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            isAiTutorOpen ? 'glass-pill-teal text-teal-100' : 'glass-pill text-teal-300 hover:text-teal-200'
          }`}
          style={{ transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Ask ScoreUP AI</span>
        </button>

        {/* Mark for Review — amber tint when marked */}
        <button
          onClick={() => toggleMark(currentQuestionId)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold ${
            isMarked
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 backdrop-blur-xl shadow-[0_0_14px_rgba(234,179,8,0.25)]'
              : 'glass-pill text-slate-300 hover:text-yellow-300'
          }`}
          style={{ transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)' }}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          <span className="hidden sm:inline">{isMarked ? 'Marked' : 'Mark'}</span>
        </button>
      </div>
    </header>
  );
};
