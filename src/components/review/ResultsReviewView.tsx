import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, XCircle, RefreshCw, LayoutDashboard, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';
import { StepByStepExplanationView } from '../common/StepByStepExplanationView';

export function calculateMathEstimate(correct: number, total: number): number {
  if (total === 0) return 200;
  if (correct === 0) return 200;
  if (correct === total) return 800;

  const accuracy = correct / total;
  // Scaled score between 200 and 800, rounded to nearest 10
  const rawScore = 200 + Math.round((accuracy * 600) / 10) * 10;
  return Math.min(800, Math.max(200, rawScore));
}

export const ResultsReviewView: React.FC = () => {
  const {
    questions,
    currentExamAnswers,
    markedForReview,
    setCurrentView,
    activeExamMode,
    activeExamId,
    startExam,
  } = useApp();
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'marked'>('all');
  const [moduleFilter, setModuleFilter] = useState<'all' | 'm1' | 'm2'>('all');
  const [expandedSolutions, setExpandedSolutions] = useState<string[]>([]);

  const isFullExam = questions.length === 44;

  // Calculate overall and module score stats
  let correctCount = 0;
  let module1Correct = 0;
  let module2Correct = 0;

  questions.forEach((q, idx) => {
    if (currentExamAnswers[q.id] === q.correctAnswer) {
      correctCount++;
      if (idx < 22) module1Correct++;
      else module2Correct++;
    }
  });

  const accuracy = Math.round((correctCount / questions.length) * 100) || 0;
  const estimatedMathScore = calculateMathEstimate(correctCount, questions.length);
  const earnedXP = correctCount > 0 ? Math.round((correctCount / questions.length) * (isFullExam ? 500 : 250)) : 0;

  const toggleSolution = (qId: string) => {
    setExpandedSolutions((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const filteredQuestions = questions.filter((q, idx) => {
    if (isFullExam) {
      if (moduleFilter === 'm1' && idx >= 22) return false;
      if (moduleFilter === 'm2' && idx < 22) return false;
    }

    const isCorrect = currentExamAnswers[q.id] === q.correctAnswer;
    const isMarked = markedForReview.includes(q.id);
    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    if (filter === 'marked') return isMarked;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Score Header Card */}
      <div className="rounded-3xl bg-white dark:bg-gradient-to-r dark:from-emerald-950 dark:via-slate-900 dark:to-slate-900 border-2 border-emerald-500/20 dark:border-emerald-500/40 p-8 shadow-xl shadow-emerald-500/5 dark:shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 transition-all">
        
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-800/40 text-xs font-bold">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Official Bluebook Score Report</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Section Completed!</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            You solved {correctCount} out of {questions.length} questions correctly.
          </p>
          {isFullExam && (
            <div className="flex items-center space-x-3 pt-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/60">
                Module 1: <strong>{module1Correct}/22</strong> Correct
              </span>
              <span className="px-3 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200/80 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800/60">
                Module 2: <strong>{module2Correct}/22</strong> Correct
              </span>
            </div>
          )}
        </div>

        {/* Big Score Box */}
        <div className="flex items-center space-x-6 bg-slate-50/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <div className="text-center font-mono">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">MATH ESTIMATE</span>
            <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">{estimatedMathScore}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">out of 800</span>
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div className="text-center font-mono">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">ACCURACY</span>
            <span className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">{accuracy}%</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">+{earnedXP} XP Earned</span>
          </div>
        </div>

      </div>

      {/* Action Buttons & Filters */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        
        {/* Module switcher if 44 questions */}
        {isFullExam && (
          <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100/90 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold w-fit shadow-sm overflow-x-auto max-w-full">
            <button
              onClick={() => setModuleFilter('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                moduleFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              All 44 Questions
            </button>
            <button
              onClick={() => setModuleFilter('m1')}
              className={`px-4 py-2 rounded-xl transition-all ${
                moduleFilter === 'm1'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              Module 1 (Q1–22 • {module1Correct}/22)
            </button>
            <button
              onClick={() => setModuleFilter('m2')}
              className={`px-4 py-2 rounded-xl transition-all ${
                moduleFilter === 'm2'
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              Module 2 (Q23–44 • {module2Correct}/22)
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex space-x-1 bg-slate-100/90 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold w-full sm:w-auto shadow-sm overflow-x-auto">
            {(['all', 'correct', 'incorrect', 'marked'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl uppercase tracking-wider transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {f} (
                {f === 'all'
                  ? filteredQuestions.length
                  : f === 'correct'
                  ? questions.filter((q) => currentExamAnswers[q.id] === q.correctAnswer).length
                  : f === 'incorrect'
                  ? questions.filter((q) => currentExamAnswers[q.id] !== q.correctAnswer).length
                  : markedForReview.length}
                )
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => startExam(activeExamMode || 'full', undefined, activeExamId)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Exam</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 hover:bg-emerald-400 transition-all shadow-glow-emerald active:scale-[0.98]"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>

      </div>

      {/* Question Item Breakdown List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const userAns = currentExamAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;
          const isExpanded = expandedSolutions.includes(q.id);

          return (
            <div
              key={q.id}
              className={`rounded-2xl border transition-all overflow-hidden shadow-sm ${
                isCorrect
                  ? 'bg-white border-slate-200 hover:border-emerald-300 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:border-slate-700'
                  : 'bg-white border-rose-200/90 hover:border-rose-300 dark:bg-slate-900/90 dark:border-red-500/30 dark:hover:border-red-500/50'
              }`}
            >
              {/* Question Header Bar */}
              <div
                onClick={() => toggleSolution(q.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">Question #{q.number}</span>
                      <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                        {q.domain}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 overflow-hidden">
                      <MathRenderer content={q.prompt} inline />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono flex-shrink-0">
                  <div className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 text-[11px] ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/40'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800/40'
                  }`}>
                    <span className="opacity-75">Your Ans:</span>
                    <span className="font-extrabold">{userAns ? <MathRenderer content={userAns} inline /> : 'Omitted'}</span>
                    <span className="opacity-50 ml-1">(Correct:</span>
                    <span className="font-extrabold"><MathRenderer content={q.correctAnswer} inline /></span>
                    <span className="opacity-50">)</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Step-by-Step KaTeX Explanation (Expanded view) */}
              {isExpanded && (
                <div className="p-6 bg-slate-50/70 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-4 text-xs sm:text-sm">
                  
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2">
                      Full Question Prompt:
                    </span>
                    <MathRenderer content={q.prompt} />
                    {q.image && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                        <div className="bg-white p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-full">
                          <img
                            src={q.image}
                            alt={`Question ${q.number} diagram`}
                            className="max-h-72 w-auto object-contain mx-auto rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <StepByStepExplanationView
                      explanation={q.explanation}
                      correctAnswer={q.correctAnswer}
                      options={q.options}
                      topic={q.domain}
                      difficulty={q.difficulty}
                      desmosTip={q.desmosEquation ? `Graph: ${q.desmosEquation}` : undefined}
                      hint={q.hint}
                    />
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
