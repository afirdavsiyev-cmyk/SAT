import React, { useState } from 'react';
import { LessonExercise } from '../../data/videoLessonsData';
import { KaTeXRenderer } from '../common/KaTeXRenderer';
import { CheckCircle2, XCircle, HelpCircle, Sparkles, RotateCcw, Lightbulb } from 'lucide-react';
import { isAnswerEquivalent } from '../../utils/answerVerification';

interface LessonPracticeTasksProps {
  exercises: LessonExercise[];
  lessonTitle: string;
}

export const LessonPracticeTasks: React.FC<LessonPracticeTasksProps> = ({ exercises, lessonTitle }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedTasks, setSubmittedTasks] = useState<Record<string, boolean>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});

  const handleSelectOption = (exerciseId: string, optionLabel: string) => {
    if (submittedTasks[exerciseId]) return; // locked once checked until reset
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: optionLabel }));
  };

  const handleCheckAnswer = (exerciseId: string) => {
    if (!selectedAnswers[exerciseId]) return;
    setSubmittedTasks(prev => ({ ...prev, [exerciseId]: true }));
  };

  const handleResetTask = (exerciseId: string) => {
    setSubmittedTasks(prev => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
    setSelectedAnswers(prev => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
  };

  const toggleHint = (exerciseId: string) => {
    setShowHints(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const completedCount = Object.keys(submittedTasks).filter(
    id => {
      const ex = exercises.find(e => e.id === id);
      return submittedTasks[id] && !!ex && isAnswerEquivalent(selectedAnswers[id], ex.correctAnswer, ex as any);
    }
  ).length;

  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
        No interactive practice tasks currently assigned for this lesson.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive SAT Practice Tasks</span>
          </div>
          <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white">
            Apply What You Learned: {lessonTitle}
          </h3>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {completedCount} of {exercises.length} Completed
          </span>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-6">
        {exercises.map((task, index) => {
          const selected = selectedAnswers[task.id];
          const isSubmitted = submittedTasks[task.id];
          const isCorrect = isSubmitted && isAnswerEquivalent(selected, task.correctAnswer, task as any);
          const isWrong = isSubmitted && !isCorrect;

          return (
            <div
              key={task.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all shadow-sm ${
                isCorrect
                  ? 'border-emerald-500/60 shadow-emerald-500/10'
                  : isWrong
                  ? 'border-rose-500/60 shadow-rose-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black">
                    TASK #{index + 1}
                  </span>
                  {task.difficulty && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      task.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' :
                      task.difficulty === 'Easy-Medium' ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/30' :
                      task.difficulty === 'Medium' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' :
                      task.difficulty === 'Medium-Hard' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30' :
                      'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
                    }`}>
                      {task.difficulty}
                    </span>
                  )}
                </div>

                {task.hint && (
                  <button
                    onClick={() => toggleHint(task.id)}
                    className="flex items-center space-x-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHints[task.id] ? 'Hide Hint' : 'Need a Hint?'}</span>
                  </button>
                )}
              </div>

              {/* Hint Box (if toggled) */}
              {showHints[task.id] && task.hint && (
                <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <strong>Hint: </strong> {task.hint}
                </div>
              )}

              {/* Question Text */}
              <div className="text-sm md:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed mb-5">
                <KaTeXRenderer text={task.question} />
              </div>

              {/* Options List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {task.options.map(opt => {
                  const isThisSelected = selected === opt.label;
                  const isThisCorrect = isAnswerEquivalent(opt.label, task.correctAnswer, task as any);

                  let optStyles = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-500';

                  if (isSubmitted) {
                    if (isThisCorrect) {
                      optStyles = 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isThisSelected && !isThisCorrect) {
                      optStyles = 'bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-200';
                    } else {
                      optStyles = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-500';
                    }
                  } else if (isThisSelected) {
                    optStyles = 'bg-emerald-500/10 border-emerald-600 text-emerald-900 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/30';
                  }

                  return (
                    <button
                      key={opt.label}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(task.id, opt.label)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start space-x-3 transition-all cursor-pointer disabled:cursor-default ${optStyles}`}
                    >
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        isThisSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {opt.label}
                      </span>
                      <div className="text-xs md:text-sm font-medium flex-1 pt-0.5">
                        <KaTeXRenderer text={opt.text} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons & Feedback */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                {!isSubmitted ? (
                  <button
                    onClick={() => handleCheckAnswer(task.id)}
                    disabled={!selected}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-500 transition-all shadow-md shadow-emerald-500/20"
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    {isCorrect ? (
                      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Correct! Fantastic work.</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <XCircle className="w-4 h-4" />
                        <span>Incorrect. Review the solution below.</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleResetTask(task.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Step-by-Step Solution Breakdown (shown upon submit) */}
              {isSubmitted && (
                <div className="mt-5 p-4 md:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-3 animate-fadeIn">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <HelpCircle className="w-4 h-4 text-emerald-500" />
                    <span>Detailed Step-by-Step Solution</span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <KaTeXRenderer text={task.explanation} />
                  </div>

                  {task.desmosShortcut && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="font-bold flex items-center space-x-1.5 text-amber-700 dark:text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Desmos Verification Method:</span>
                      </div>
                      <p>{task.desmosShortcut}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
