import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, XCircle, RefreshCw, LayoutDashboard, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';

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
  const { questions, currentExamAnswers, markedForReview, resetExam, setCurrentView } = useApp();
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'marked'>('all');
  const [expandedSolutions, setExpandedSolutions] = useState<string[]>([]);

  // Calculate score stats
  let correctCount = 0;
  questions.forEach((q) => {
    if (currentExamAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const accuracy = Math.round((correctCount / questions.length) * 100) || 0;
  const estimatedMathScore = calculateMathEstimate(correctCount, questions.length);
  const earnedXP = correctCount > 0 ? Math.round((correctCount / questions.length) * 450) : 0;

  const toggleSolution = (qId: string) => {
    setExpandedSolutions((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const filteredQuestions = questions.filter((q) => {
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
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/40 p-8 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-bold border border-emerald-800/40">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Official Bluebook Score Report</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Section Completed!</h1>
          <p className="text-slate-300 text-sm">
            You solved {correctCount} out of {questions.length} questions correctly.
          </p>
        </div>

        {/* Big Score Box */}
        <div className="flex items-center space-x-6 bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
          <div className="text-center font-mono">
            <span className="text-xs text-slate-400 block font-semibold">MATH ESTIMATE</span>
            <span className="text-4xl font-extrabold text-emerald-400">{estimatedMathScore}</span>
            <span className="text-[10px] text-slate-500 block">out of 800</span>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="text-center font-mono">
            <span className="text-xs text-slate-400 block font-semibold">ACCURACY</span>
            <span className="text-4xl font-extrabold text-teal-400">{accuracy}%</span>
            <span className="text-[10px] text-emerald-400 block">+{earnedXP} XP Earned</span>
          </div>
        </div>

      </div>

      {/* Action Buttons & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold w-full sm:w-auto">
          {(['all', 'correct', 'incorrect', 'marked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f} ({f === 'all' ? questions.length : f === 'correct' ? correctCount : f === 'incorrect' ? questions.length - correctCount : markedForReview.length})
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => {
              resetExam();
              setCurrentView('exam');
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Exam</span>
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 hover:bg-emerald-400 transition-all shadow-glow-emerald"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
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
              className={`rounded-2xl border transition-all overflow-hidden ${
                isCorrect
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-slate-900/90 border-red-500/30'
              }`}
            >
              {/* Question Header Bar */}
              <div
                onClick={() => toggleSolution(q.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-white text-sm">Question #{q.number}</span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {q.domain}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1 line-clamp-2 overflow-hidden">
                      <MathRenderer content={q.prompt} inline />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono flex-shrink-0">
                  <div className={`px-2.5 py-1 rounded font-bold flex items-center space-x-1 ${isCorrect ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-red-950 text-red-300 border border-red-800/40'}`}>
                    <span>Your Ans:</span>
                    <span>{userAns ? <MathRenderer content={userAns} inline /> : 'Omitted'}</span>
                    <span className="opacity-60 ml-1">(Correct:</span>
                    <span><MathRenderer content={q.correctAnswer} inline /></span>
                    <span className="opacity-60">)</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Step-by-Step KaTeX Explanation (Expanded view) */}
              {isExpanded && (
                <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-4 text-xs sm:text-sm">
                  
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                      Full Question Prompt:
                    </span>
                    <MathRenderer content={q.prompt} />
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center space-x-2 text-teal-400 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Preppy AI Step-by-Step Resolution:</span>
                    </div>
                    <MathRenderer content={q.explanation} className="text-slate-300 leading-relaxed" />
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
