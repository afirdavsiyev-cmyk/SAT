import React, { useState } from 'react';
import { Question } from '../../types';
import { MathRenderer } from '../common/MathRenderer';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, EyeOff } from 'lucide-react';

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
    <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-8 select-text">
      
      {/* Domain Badge & Question Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <span className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800/50 text-emerald-400 font-mono font-extrabold text-sm flex items-center justify-center shadow-glow-emerald">
            {question.number}
          </span>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200 font-sans">
              Question {question.number}
            </span>
            <span className="text-[11px] text-slate-400 block font-mono">
              Domain: {question.domain} • {question.difficulty}
            </span>
          </div>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
          Bluebook Adaptive Format
        </span>
      </div>

      {/* Question Prompt with KaTeX */}
      <div className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        <MathRenderer content={question.prompt} />
      </div>

      {/* Multiple Choice Options or Student-Produced Grid-in */}
      {question.type === 'multiple_choice' && question.options ? (
        <div className="space-y-3 pt-2">
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt.id;
            const isCrossed = crossedOutOptions.includes(opt.id);

            return (
              <div
                key={opt.id}
                onClick={() => !isCrossed && setAnswer(question.id, opt.id)}
                className={`p-4 sm:p-4.5 rounded-2xl cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'glass-choice-selected'
                    : isCrossed
                    ? 'opacity-35 bg-slate-950/40 border border-slate-900 line-through'
                    : 'glass-choice'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Selection Radio Circle */}
                  <div
                    className={`w-7 h-7 rounded-xl font-mono font-bold text-xs flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      isSelected
                        ? 'bg-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                        : 'glass-pill text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {opt.id}
                  </div>
                  <div className={`text-sm font-semibold ${isSelected ? 'text-emerald-100' : 'text-slate-100'}`} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                    <MathRenderer content={opt.text} inline />
                  </div>
                </div>

                {/* Strikethrough option tool (Bluebook feature) */}
                <div className="flex items-center space-x-2">
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-in fade-in duration-200" />}
                  <button
                    onClick={(e) => toggleCrossOut(opt.id, e)}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Cross out option"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Student Produced Response input */
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl space-y-4 shadow-xl">
          <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
            Student-Produced Response (Grid-In):
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              placeholder="e.g. 5/13 or 0.384"
              className="w-full sm:w-64 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-white font-mono text-base outline-none focus:border-emerald-500 transition-colors shadow-inner"
            />
            <span className="text-xs text-slate-500 font-mono">Accepts fractions or decimals</span>
          </div>
        </div>
      )}

    </div>
  );
};
