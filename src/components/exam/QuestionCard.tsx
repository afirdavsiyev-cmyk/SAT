import React, { useState } from 'react';
import { Question } from '../../types';
import { MathRenderer } from '../common/MathRenderer';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, EyeOff, Check } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { currentExamAnswers, setAnswer } = useApp();
  const [crossedOutOptions, setCrossedOutOptions] = useState<string[]>([]);

  const selectedAnswer = currentExamAnswers[question.id] || '';

  const toggleCrossOut = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCrossedOutOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full select-text">
      
      {/* ─── Main Question Container Card with Emerald Green Frame ─── */}
      <div className="border-2 border-emerald-500/30 dark:border-emerald-500/35 bg-white dark:bg-[#0c1424] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Domain Badge & Question Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 font-mono font-extrabold text-sm flex items-center justify-center shadow-sm">
              {question.number}
            </span>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-sans">
                Question {question.number}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                Domain: {question.domain} • {question.difficulty}
              </span>
            </div>
          </div>

          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800/40 font-bold">
            Bluebook Adaptive Format
          </span>
        </div>

        {/* Question Prompt with KaTeX (inherits full contrast in light/dark mode) */}
        <div className="text-slate-900 dark:text-white text-lg leading-relaxed font-normal py-2 select-text">
          <MathRenderer content={question.prompt} />
        </div>

        {/* Multiple Choice Options or Student-Produced Grid-in */}
        {question.type === 'multiple_choice' && question.options ? (
          <div className="space-y-3 pt-2">
            {question.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              const isCrossed = crossedOutOptions.includes(opt.id);

              let cardClass = 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 dark:bg-slate-900/60 dark:hover:bg-slate-850 dark:border-slate-800 dark:text-slate-100';
              let badgeClass = 'border-slate-300 bg-slate-200 text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200';

              if (isSelected) {
                cardClass = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-white shadow-sm font-semibold';
                badgeClass = 'border-emerald-500 bg-emerald-500 text-slate-950 font-extrabold shadow-sm';
              } else if (isCrossed) {
                cardClass = 'opacity-35 line-through bg-slate-100 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-900 text-slate-400 dark:text-slate-500';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => !isCrossed && setAnswer(question.id, opt.id)}
                  className={`p-4 sm:p-4.5 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-200 group active:scale-[0.99] select-text ${cardClass}`}
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
                    {/* Option Badge (A), (B), (C), (D) */}
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center font-semibold text-sm transition-all duration-200 flex-shrink-0 font-mono ${badgeClass}`}
                    >
                      {opt.id}
                    </div>

                    {/* Option Math Text */}
                    <div className="text-base font-medium select-text flex-1">
                      <MathRenderer content={opt.text} inline />
                    </div>
                  </div>

                  {/* Right Actions: Selected Check or Strikeout Eliminator Button */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {isSelected && (
                      <span className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    )}

                    {/* Bluebook Eliminator Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleCrossOut(opt.id, e)}
                      className={`p-1.5 rounded-lg border text-xs font-mono transition-all ${
                        isCrossed
                          ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40'
                          : 'bg-slate-100 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200'
                      }`}
                      title={isCrossed ? 'Restore choice' : 'Cross out choice'}
                    >
                      <span className="line-through font-bold">[{opt.id}]</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Student Produced Response input */
          <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl space-y-4 shadow-sm">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-400 block uppercase tracking-wider">
              Student-Produced Response (Grid-In):
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setAnswer(question.id, e.target.value)}
                placeholder="e.g. 5/13 or 0.384"
                className="w-full sm:w-64 p-3.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-mono text-base outline-none focus:border-emerald-500 transition-colors shadow-inner"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Accepts fractions or decimals</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
