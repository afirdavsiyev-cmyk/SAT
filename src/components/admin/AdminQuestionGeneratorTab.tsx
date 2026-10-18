import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Layers,
  Code,
  FileCheck,
  PenTool,
} from 'lucide-react';
import { MathDomain, Question } from '../../types';
import { GeneratedQuestionResult } from '../../types/admin';
import { generateSingleQuestion } from '../../services/aiQuestionGenerator';
import { KaTeXRenderer } from '../common/KaTeXRenderer';
import { AdminManualQuestionCreator } from './AdminManualQuestionCreator';

export const AdminQuestionGeneratorTab: React.FC = () => {
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [domain, setDomain] = useState<MathDomain>('Algebra');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [type, setType] = useState<'multiple_choice' | 'student_produced'>('multiple_choice');
  const [topic, setTopic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [useLiveAI, setUseLiveAI] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedQuestionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateSingleQuestion({
        domain,
        difficulty,
        type,
        topic: topic.trim() || undefined,
        instructions: instructions.trim() || undefined,
        useLiveAI,
      });
      setGeneratedResult(res);
    } catch (err) {
      console.error('Failed to generate question:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyJson = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(JSON.stringify(generatedResult.question, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const question = generatedResult?.question;
  const validation = generatedResult?.validation;

  return (
    <div className="space-y-6">
      {/* Segmented Mode Selector: AI Auto-Generate vs Manual Question Creator */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setMode('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'ai'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>AI Auto-Generate</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'manual'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PenTool className="w-3.5 h-3.5 text-emerald-500" />
          <span>Manual Question Creator</span>
        </button>
      </div>

      {mode === 'manual' ? (
        <AdminManualQuestionCreator />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ─────────────────────────────────────────────────────────────
          LEFT PANEL: GENERATION CONTROLS (5 cols)
         ───────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-5 space-y-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                AI Question Studio
              </h3>
              <p className="text-[11px] text-slate-400">
                Psychometrically calibrated Digital SAT problem generator
              </p>
            </div>
          </div>

          {/* Domain Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Math Domain
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as MathDomain)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="Algebra">Algebra (Linear Equations & Models)</option>
              <option value="Advanced Math">Advanced Math (Nonlinear, Quadratics & Exponentials)</option>
              <option value="Problem-Solving & Data Analysis">
                Problem-Solving & Data Analysis (Stats & Rates)
              </option>
              <option value="Geometry & Trigonometry">
                Geometry & Trigonometry (Circles, Triangles, Radians)
              </option>
            </select>
          </div>

          {/* Difficulty & Type Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Difficulty Tier
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="Easy">Easy (Foundation / 400-580)</option>
                <option value="Medium">Medium (Target / 600-720)</option>
                <option value="Hard">Hard (Elite / 750-800)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Question Format
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'multiple_choice' | 'student_produced')}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="multiple_choice">Multiple Choice (4 Choices)</option>
                <option value="student_produced">Student Produced (Grid-in)</option>
              </select>
            </div>
          </div>

          {/* Specific Subtopic */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Specific Topic or Subtopic</span>
              <span className="text-[10px] text-slate-400 font-normal">Optional</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Systems with no solution, Vertex form, Circle radius"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Additional Authoring Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Custom Authoring Guidelines</span>
              <span className="text-[10px] text-slate-400 font-normal">Optional</span>
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Include a high-yield Desmos shortcut, ensure plausible distractors..."
              rows={2}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 resize-none"
            />
          </div>

          {/* Engine Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Live AI Model Dispatch
              </div>
              <div className="text-[10px] text-slate-400">
                {useLiveAI ? 'Groq / Gemini live neural generation' : 'ScoreUp Offline Math Engine'}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useLiveAI}
                onChange={(e) => setUseLiveAI(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Math Problem...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Digital SAT Question</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT PANEL: LIVE QUESTION PREVIEW & VALIDATION (7 cols)
         ───────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-7 space-y-4">
        {question ? (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Header & Badges */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  {question.domain}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {question.difficulty}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {question.type}
                </span>
              </div>

              {/* Validation Status */}
              <div className="flex items-center gap-1.5">
                {validation?.isValid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid SAT Format</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-500/20">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Validation Warnings</span>
                  </span>
                )}
              </div>
            </div>

            {/* Prompt Preview */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Question Prompt
              </label>
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-sm text-slate-900 dark:text-white leading-relaxed">
                <KaTeXRenderer text={question.prompt} />
              </div>
            </div>

            {/* Multiple Choice Options Preview */}
            {question.type === 'multiple_choice' && question.options && (
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Answer Options
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {question.options.map((opt) => {
                    const isCorrect = opt.id === question.correctAnswer;
                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                          isCorrect
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/40 text-slate-900 dark:text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs ${
                              isCorrect
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {opt.id}
                          </span>
                          <KaTeXRenderer text={opt.text} />
                        </div>
                        {isCorrect && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50">
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Student-Produced Response */}
            {question.type === 'student_produced' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Correct Numerical Answer
                </label>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {question.correctAnswer}
                </div>
              </div>
            )}

            {/* Step-by-Step KaTeX Explanation */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Official Step-by-Step Solution
              </label>
              <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                <KaTeXRenderer text={question.explanation} />
              </div>
            </div>

            {/* Desmos Equation & Hint */}
            {(question.desmosEquation || question.hint) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {question.desmosEquation && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-slate-500 text-[10px] uppercase flex items-center gap-1">
                      <Calculator className="w-3.5 h-3.5 text-blue-500" />
                      <span>Desmos Equation</span>
                    </div>
                    <code className="font-mono text-blue-600 dark:text-blue-400 text-[11px] block truncate">
                      {question.desmosEquation}
                    </code>
                  </div>
                )}
                {question.hint && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-slate-500 text-[10px] uppercase flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Socratic Hint</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">
                      <KaTeXRenderer text={question.hint} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">
                ID: {question.id}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-white dark:bg-[#0c131f] border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                No Question Generated Yet
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Select your target domain, difficulty, and format in the studio panel, then click
                "Generate Digital SAT Question".
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
      )}
    </div>
  );
};

export default AdminQuestionGeneratorTab;
