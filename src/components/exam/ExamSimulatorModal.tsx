import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Clock,
  Calculator,
  BookOpen,
  Pencil,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  CheckCircle,
  Flag,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  PanelRightClose,
  PanelRightOpen,
  Award
} from 'lucide-react';
import { DesmosModal } from './DesmosModal';
import { ReferenceSheetModal } from './ReferenceSheetModal';
import { ScratchpadCanvas } from './ScratchpadCanvas';

export interface ExamSimulatorTarget {
  id: string;
  title: string;
  fileUrl: string;
  category?: string;
  badge?: string;
  difficulty?: string;
  durationMinutes?: number;
  totalQuestions?: number;
}

interface ExamSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamSimulatorTarget | null;
}

export const ExamSimulatorModal: React.FC<ExamSimulatorModalProps> = ({
  isOpen,
  onClose,
  exam
}) => {
  // Timer state: default 35 mins (2100 seconds) for Digital SAT Math Module
  const initialSeconds = (exam?.durationMinutes ? Math.min(exam.durationMinutes, 35) : 35) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isTimerHidden, setIsTimerHidden] = useState<boolean>(false);

  // Aux tools modals
  const [isDesmosOpen, setIsDesmosOpen] = useState(false);
  const [isRefSheetOpen, setIsRefSheetOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  // Answer Sheet state (Questions 1 through 22 by default)
  const questionCount = 22;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [isAnswerSheetOpen, setIsAnswerSheetOpen] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset timer and answers whenever a new exam is selected
  useEffect(() => {
    if (exam) {
      setSecondsRemaining(initialSeconds);
      setIsTimerRunning(true);
      setAnswers({});
      setFlagged(new Set());
      setIsFinished(false);
    }
  }, [exam, initialSeconds]);

  // Countdown effect
  useEffect(() => {
    if (!isOpen || !isTimerRunning || isFinished) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isTimerRunning, isFinished]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSelectAnswer = (qNum: number, choice: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qNum]: prev[qNum] === choice ? '' : choice
    }));
  };

  const toggleFlag = (qNum: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qNum)) next.delete(qNum);
      else next.add(qNum);
      return next;
    });
  };

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((a) => a && a.trim() !== '').length;
  }, [answers]);

  if (!isOpen || !exam) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/90 dark:bg-black/90 backdrop-blur-md text-slate-100 select-none overflow-hidden"
    >
      {/* ─── Top Header Bar (Bluebook Simulator) ─── */}
      <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#070b14] border-b border-slate-200 dark:border-emerald-500/20 flex items-center justify-between flex-shrink-0 text-slate-900 dark:text-white shadow-sm">
        {/* Title & Badge */}
        <div className="flex items-center space-x-3 truncate max-w-sm sm:max-w-md">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center font-black text-sm flex-shrink-0">
            SAT
          </div>
          <div className="truncate">
            <h2 className="text-xs sm:text-sm font-extrabold truncate" title={exam.title}>
              {exam.title}
            </h2>
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Section 2: Math</span>
              <span>•</span>
              <span>Module 1/2</span>
            </div>
          </div>
        </div>

        {/* Center: Official Bluebook Countdown Timer */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border shadow-inner font-mono transition-colors ${
              secondsRemaining < 300
                ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-emerald-500/30 text-slate-900 dark:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {!isTimerHidden ? (
              <span className="text-xs font-black tracking-widest">{formatTimer(secondsRemaining)}</span>
            ) : (
              <span className="text-xs font-bold text-slate-400">Hidden</span>
            )}
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <button
            onClick={() => setSecondsRemaining(initialSeconds)}
            title="Reset Timer"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsTimerHidden(!isTimerHidden)}
            title={isTimerHidden ? 'Show Timer' : 'Hide Timer'}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {isTimerHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Aux Tools & Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Desmos Calculator */}
          <button
            onClick={() => setIsDesmosOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/[0.08] text-xs font-bold flex items-center space-x-1.5 text-slate-700 dark:text-slate-200"
            title="Desmos Graphing Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Calculator</span>
          </button>

          {/* Reference Sheet */}
          <button
            onClick={() => setIsRefSheetOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/[0.08] text-xs font-bold flex items-center space-x-1.5 text-slate-700 dark:text-slate-200"
            title="SAT Reference Sheet"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Reference</span>
          </button>

          {/* Scratchpad */}
          <button
            onClick={() => setIsScratchpadOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/[0.08] text-xs font-bold flex items-center space-x-1.5 text-slate-700 dark:text-slate-200"
            title="Scratchpad Canvas"
          >
            <Pencil className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Scratchpad</span>
          </button>

          {/* Answer Sheet Toggle */}
          <button
            onClick={() => setIsAnswerSheetOpen(!isAnswerSheetOpen)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              isAnswerSheetOpen
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/[0.08]'
            }`}
            title="Toggle Digital Answer Sheet"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Answer Sheet ({answeredCount}/{questionCount})</span>
          </button>

          {/* Download / Open PDF */}
          <a
            href={encodeURI(exam.fileUrl)}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            title="Download / Open in New Tab"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 text-slate-700 dark:text-slate-300 transition-colors"
            title="Exit Exam Simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ─── Main Content Area: PDF Viewer + Collapsible Answer Sheet ─── */}
      <div className="flex-1 flex overflow-hidden bg-slate-200 dark:bg-[#040810] relative">
        {/* PDF Document Frame */}
        <div className="flex-1 h-full p-2 sm:p-3 overflow-hidden">
          <iframe
            src={encodeURI(exam.fileUrl)}
            title={exam.title}
            className="w-full h-full rounded-2xl border border-slate-300 dark:border-emerald-500/25 bg-white dark:bg-slate-900 shadow-2xl"
          />
        </div>

        {/* Scratchpad Overlay Canvas */}
        <ScratchpadCanvas
          isActive={isScratchpadOpen}
          onClose={() => setIsScratchpadOpen(false)}
        />

        {/* Collapsible Digital Answer Bubble Sheet */}
        {isAnswerSheetOpen && (
          <aside className="w-80 sm:w-96 h-full bg-white dark:bg-[#0a0f1d] border-l border-slate-200 dark:border-emerald-500/20 flex flex-col flex-shrink-0 z-10 shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Sheet Header */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-900 dark:text-white">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-extrabold text-xs tracking-wide uppercase">Digital Answer Sheet</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {answeredCount} of {questionCount} Answered
              </span>
            </div>

            {/* Answer Grid List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
              {Array.from({ length: questionCount }, (_, idx) => {
                const qNum = idx + 1;
                const isFlagged = flagged.has(qNum);
                const selected = answers[qNum] || '';
                const isAnswered = Boolean(selected);

                return (
                  <div
                    key={qNum}
                    className={`p-2.5 rounded-2xl border transition-all ${
                      isFlagged
                        ? 'bg-amber-50/80 border-amber-300 dark:bg-amber-950/30 dark:border-amber-500/40'
                        : isAnswered
                        ? 'bg-emerald-50/50 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-500/30'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-extrabold text-xs flex items-center justify-center">
                          {qNum}
                        </span>
                        {isAnswered && (
                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            Saved: {selected}
                          </span>
                        )}
                      </div>

                      {/* Flag for review button */}
                      <button
                        type="button"
                        onClick={() => toggleFlag(qNum)}
                        className={`p-1 rounded-lg text-xs font-mono transition-colors ${
                          isFlagged
                            ? 'text-amber-600 dark:text-amber-400 fill-current'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                        title="Mark for review"
                      >
                        <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* MCQ Options A, B, C, D */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectAnswer(qNum, opt)}
                          className={`py-1.5 rounded-xl font-mono text-xs font-black transition-all ${
                            selected === opt
                              ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                              : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {/* Student Produced Response input toggle */}
                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400 font-mono">Or numeric:</span>
                      <input
                        type="text"
                        placeholder="e.g. 5/13, 2.5"
                        value={selected && !['A', 'B', 'C', 'D'].includes(selected) ? selected : ''}
                        onChange={(e) => handleSelectAnswer(qNum, e.target.value)}
                        className="flex-1 px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sheet Footer: Completion Summary & Submit */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Flagged: {flagged.size}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {Math.round((answeredCount / questionCount) * 100)}% Complete
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsFinished(true);
                  alert(
                    `Great practice! You answered ${answeredCount} of ${questionCount} questions in ${exam.title}. Review your answers alongside the test document or check the answer key provided in the PDF!`
                  );
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Award className="w-4 h-4" />
                <span>Submit & Review Section</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Embedded Desmos Calculator Modal */}
      <DesmosModal
        isOpen={isDesmosOpen}
        onClose={() => setIsDesmosOpen(false)}
      />

      {/* SAT Reference Sheet Modal */}
      <ReferenceSheetModal
        isOpen={isRefSheetOpen}
        onClose={() => setIsRefSheetOpen(false)}
      />
    </div>
  );
};
