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
    <header className="bg-slate-950/90 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between text-slate-100 select-none z-40 relative backdrop-blur-xl">
      
      {/* Left: Exit Exam & Section Info */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        
        {/* Exit Exam Pill Button */}
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-red-950/80 hover:text-red-300 hover:border-red-500/50 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 group"
          title="Exit Bluebook Exam Room"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Exit Exam</span>
        </button>

        <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

        <div className="flex flex-col">
          <span className="text-xs font-extrabold tracking-wide text-white uppercase font-sans">
            Section 2: Math
          </span>
          <span className="text-[11px] text-emerald-400 font-medium font-mono">
            Module 1 (Adaptive)
          </span>
        </div>

        <button
          onClick={() => setShowDirections(!showDirections)}
          className="hidden md:flex items-center space-x-1 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full active:scale-95 transition-all"
        >
          <span>Directions</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {showDirections && (
          <div className="absolute top-14 left-4 bg-slate-900 border border-slate-700/80 rounded-2xl p-4 text-xs text-slate-300 max-w-sm shadow-2xl z-50 backdrop-blur-xl">
            <p className="font-bold text-white mb-1.5">Module Directions</p>
            <p className="leading-relaxed">
              For questions 1–22, solve each problem and select the best option or type your student-produced response. You may use the built-in Desmos calculator or reference sheet at any time.
            </p>
          </div>
        )}
      </div>

      {/* Middle: Timer & Pause Controls */}
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-2 border px-3.5 py-1 rounded-full transition-all duration-300 ${
          isLowTime 
            ? 'bg-rose-950/90 border-rose-500/80 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.35)]' 
            : is5MinWarning
            ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
            : 'bg-slate-900/90 border-slate-800 text-emerald-400'
        }`}>
          {isLowTime || is5MinWarning ? (
            <AlertTriangle className={`w-3.5 h-3.5 ${isLowTime ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
          ) : (
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          )}
          
          {showTimerDigits ? (
            <span className={`font-mono text-xs sm:text-sm font-bold ${isLowTime ? 'text-rose-400 animate-pulse' : is5MinWarning ? 'text-amber-300' : 'text-emerald-400'}`}>
              {formatTime(secondsRemaining)}
            </span>
          ) : (
            <span className="text-xs font-mono text-slate-500 font-bold tracking-wider">Hidden</span>
          )}
        </div>

        {/* Hide/Show Toggle */}
        <button
          onClick={() => setShowTimerDigits(!showTimerDigits)}
          className="text-[11px] font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 p-1.5 sm:px-2.5 rounded-full transition-all active:scale-95 flex items-center space-x-1"
          title={showTimerDigits ? 'Hide Timer Digits' : 'Show Timer Digits'}
        >
          {showTimerDigits ? <EyeOff className="w-3.5 h-3.5 sm:hidden" /> : <Eye className="w-3.5 h-3.5 sm:hidden" />}
          <span className="hidden sm:inline">{showTimerDigits ? 'Hide' : 'Show'}</span>
        </button>

        {/* Pause/Resume Toggle */}
        <button
          onClick={onTogglePause}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold border transition-all active:scale-95 ${
            isPaused
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
          title={isPaused ? 'Resume Test' : 'Pause Test'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-slate-950 stroke-none" /> : <Pause className="w-3.5 h-3.5 text-slate-300" />}
          <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
      </div>

      {/* Right Tools (Calculator, Reference, Scratchpad, AI Tutor, Mark) */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        
        {/* Desmos Button */}
        <button
          onClick={onOpenDesmos}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-emerald-950 hover:border-emerald-500/50 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
        >
          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Calculator</span>
        </button>

        {/* Reference Sheet */}
        <button
          onClick={onOpenReference}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
        >
          <FileText className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden md:inline">Reference</span>
        </button>

        {/* Scratchpad Canvas Toggle */}
        <button
          onClick={onToggleScratchpad}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
            isScratchpadActive
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
          }`}
        >
          <Pencil className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Scratchpad</span>
        </button>

        {/* Preppy AI Tutor Toggle */}
        <button
          onClick={onToggleAiTutor}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
            isAiTutorOpen
              ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)]'
              : 'bg-teal-950/80 hover:bg-teal-900 border-teal-800/60 text-teal-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span className="hidden md:inline">Ask Preppy AI</span>
        </button>

        {/* Mark for Review */}
        <button
          onClick={() => toggleMark(currentQuestionId)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
            isMarked
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          <span className="hidden sm:inline">{isMarked ? 'Marked' : 'Mark'}</span>
        </button>

      </div>
    </header>
  );
};
