import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Brain,
  Calculator,
  Compass,
  Clock,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Flame,
  Star
} from 'lucide-react';
import { SATDomain, MistakeReason, QuestionAttempt } from '../../types/planner';
import { getStoredAdaptiveData, recordQuestionAttemptInEngine } from '../../utils/adaptivePlannerEngine';

interface DiagnosticMistakeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  domain?: SATDomain | string;
  subtopicId?: string;
  subtopicName?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  isCorrect?: boolean;
  timeSpentSeconds?: number;
  usedHint?: boolean;
  usedDesmos?: boolean;
  onLogged?: (attempt: QuestionAttempt) => void;
}

const MISTAKE_REASONS: {
  id: MistakeReason;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'concept_gap',
    title: 'Concept Gap',
    description: 'Didn\'t know the underlying mathematical formula or rule.',
    icon: <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
  },
  {
    id: 'wrong_formula',
    title: 'Formula Slip',
    description: 'Remembered or applied the wrong formula (e.g., vertex form or radians).',
    icon: <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
  },
  {
    id: 'calculation_slip',
    title: 'Calculation Slip',
    description: 'Understood the approach, but made a sign or arithmetic error.',
    icon: <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    id: 'misread_question',
    title: 'Misread Question',
    description: 'Solved for x instead of 2x + 1, or missed a domain constraint.',
    icon: <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
  },
  {
    id: 'time_panic',
    title: 'Time Pressure',
    description: 'Rushed or guessed quickly because the clock was running low.',
    icon: <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
  },
  {
    id: 'blind_guess',
    title: 'Blind Guess',
    description: 'Had no confident approach and selected a random choice.',
    icon: <HelpCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
  },
];

export const DiagnosticMistakeDrawer: React.FC<DiagnosticMistakeDrawerProps> = ({
  isOpen,
  onClose,
  questionId,
  domain = 'Algebra',
  subtopicId = 'alg-linear-one',
  subtopicName = 'Linear equations in one variable',
  difficulty = 'Medium',
  isCorrect = false,
  timeSpentSeconds = 48,
  usedHint = false,
  usedDesmos = false,
  onLogged,
}) => {
  const [selectedReason, setSelectedReason] = useState<MistakeReason>('calculation_slip');
  const [preConfidence, setPreConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Map incoming domain string to SATDomain
  const normalizedDomain: SATDomain = 
    domain === 'Advanced Math' ? 'Advanced Math'
    : domain === 'Problem-Solving & Data Analysis' || domain === 'Problem Solving' ? 'Problem Solving'
    : domain === 'Geometry & Trigonometry' || domain === 'Geometry & Trig' ? 'Geometry & Trig'
    : 'Algebra';

  // Condition checks for False Confidence vs Underconfidence
  const isFalseConfidence = !isCorrect && preConfidence >= 4;
  const isUnderconfidence = isCorrect && preConfidence <= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const attempt: QuestionAttempt = {
      questionId,
      domain: normalizedDomain,
      subtopicId,
      subtopicName,
      difficulty,
      correct: isCorrect,
      timeSpentSeconds,
      usedHint,
      usedDesmos,
      preConfidence,
      mistakeReason: !isCorrect ? selectedReason : undefined,
      timestamp: new Date().toISOString(),
    };

    const currentData = getStoredAdaptiveData();
    recordQuestionAttemptInEngine(currentData, attempt);

    if (onLogged) {
      onLogged(attempt);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-250"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl border ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-500/40 dark:text-emerald-400'
                : 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/40 dark:border-rose-500/40 dark:text-rose-400'
            }`}>
              {isCorrect ? <Sparkles className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {isCorrect ? 'Diagnostic Confidence Tracker' : 'Why Did You Miss This Question?'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {subtopicName} • {difficulty}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">

          {/* Alert: False Confidence or Underconfidence */}
          {isFalseConfidence && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-900 dark:text-rose-200 space-y-1 animate-in fade-in">
              <div className="flex items-center space-x-1.5 font-bold text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>False Confidence Detected ({preConfidence}/5)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-700 dark:text-rose-300">
                You felt highly confident, but missed the mark. College Board traps are engineered to look deceptively simple. Check for subtle algebraic sign reversals or question constraints!
              </p>
            </div>
          )}

          {isUnderconfidence && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 space-y-1 animate-in fade-in">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>Underconfidence Win ({preConfidence}/5)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-400">
                You got this correct despite low initial confidence! Your mathematical intuition is sharper than you think. Trust your first instinct!
              </p>
            </div>
          )}

          {/* 1. Confidence Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                How confident were you before checking?
              </label>
              <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {preConfidence === 1 ? '1 • Pure Guess'
                  : preConfidence === 2 ? '2 • Low Confidence'
                  : preConfidence === 3 ? '3 • Moderate'
                  : preConfidence === 4 ? '4 • Pretty Sure'
                  : '5 • 100% Certain'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPreConfidence(lvl as 1 | 2 | 3 | 4 | 5)}
                  className={`py-2 px-1 rounded-xl border font-mono text-xs font-extrabold flex flex-col items-center justify-center transition-all ${
                    preConfidence === lvl
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/25 dark:bg-emerald-500 dark:border-emerald-400 dark:text-slate-950'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400 dark:hover:border-emerald-500/50'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 mb-1 ${preConfidence >= lvl ? 'fill-current' : 'opacity-40'}`} />
                  <span>{lvl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Primary Mistake Reason Radio Grid (if incorrect) */}
          {!isCorrect && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Primary Reason for Miss</span>
                <span className="text-[10px] text-slate-500 font-mono">Updates Skill Mastery</span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                {MISTAKE_REASONS.map((r) => {
                  const isSelected = selectedReason === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedReason(r.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-500 dark:bg-emerald-950/40 dark:border-emerald-500 shadow-sm'
                          : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        {r.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${
                            isSelected ? 'text-emerald-950 dark:text-emerald-200' : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {r.title}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-emerald-600 bg-emerald-600 dark:border-emerald-400 dark:bg-emerald-400' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-950" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                          {r.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submission Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitted}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/25 dark:shadow-glow-emerald transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  <span>Diagnostic Logged to Adaptive Engine!</span>
                </>
              ) : (
                <>
                  <span>Save Diagnostic & Update Mastery</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
