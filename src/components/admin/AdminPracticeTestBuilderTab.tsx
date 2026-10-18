import React, { useState, useEffect } from 'react';
import {
  FileText,
  Play,
  Download,
  Trash2,
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  RefreshCw,
  Code,
  Copy,
  Check,
} from 'lucide-react';
import { CustomPracticeTest } from '../../types/admin';
import {
  getAllCustomPracticeTests,
  deleteCustomPracticeTest,
  exportTestToTypeScript,
} from '../../services/customPracticeTestsService';
import { generateFullPracticeTest } from '../../services/aiQuestionGenerator';
import { useApp } from '../../context/AppContext';
import { AdminManualTestImporter } from './AdminManualTestImporter';

export const AdminPracticeTestBuilderTab: React.FC = () => {
  const { startExam, setCurrentView } = useApp();

  const [builderMode, setBuilderMode] = useState<'ai' | 'importer'>('ai');
  const [tests, setTests] = useState<CustomPracticeTest[]>([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);

  // Builder form state
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Standard' | 'Hard' | '750+' | 'Adaptive'>('Standard');
  const [totalQuestions, setTotalQuestions] = useState<number>(44);
  const [moduleTimeMinutes, setModuleTimeMinutes] = useState<number>(35);
  const [useLiveAI, setUseLiveAI] = useState(false); // default to fast calibrated engine for full mocks

  // Generation progress
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{
    current: number;
    total: number;
    message: string;
  } | null>(null);

  const [copiedTestId, setCopiedTestId] = useState<string | null>(null);

  const loadTests = async () => {
    setIsLoadingTests(true);
    try {
      const data = await getAllCustomPracticeTests();
      setTests(data);
    } catch (err) {
      console.error('Failed to load custom practice tests:', err);
    } finally {
      setIsLoadingTests(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleGenerateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationProgress({
      current: 0,
      total: totalQuestions,
      message: 'Initializing psychometric blueprint and domain distribution...',
    });

    try {
      await generateFullPracticeTest({
        title:
          title.trim() ||
          `ScoreUp Digital SAT Mock (${difficulty} • ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`,
        difficulty,
        totalQuestions,
        moduleTimeMinutes,
        useLiveAI,
        onProgress: (prog) => {
          setGenerationProgress(prog);
        },
      });

      setTitle('');
      await loadTests();
    } catch (err) {
      console.error('Failed to generate full practice test:', err);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom practice test?')) return;
    try {
      await deleteCustomPracticeTest(id);
      await loadTests();
    } catch (err) {
      console.error('Failed to delete test:', err);
    }
  };

  const handleExportTs = (test: CustomPracticeTest) => {
    const code = exportTestToTypeScript(test);
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = (test.title || 'custom_test')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
    a.download = `${safeTitle}.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyTs = (test: CustomPracticeTest) => {
    const code = exportTestToTypeScript(test);
    navigator.clipboard.writeText(code);
    setCopiedTestId(test.id);
    setTimeout(() => setCopiedTestId(null), 2000);
  };

  const handleLaunchExam = (test: CustomPracticeTest) => {
    const allQuestions = [...(test.module1Questions || []), ...(test.module2Questions || [])];
    startExam('full', allQuestions, test.id);
    setCurrentView('exam');
  };

  return (
    <div className="space-y-6">
      {/* Segmented Mode Selector: AI Auto-Assemble vs Manual / JSON Test Importer */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setBuilderMode('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            builderMode === 'ai'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span>AI Auto-Assemble</span>
        </button>

        <button
          type="button"
          onClick={() => setBuilderMode('importer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            builderMode === 'importer'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-blue-500" />
          <span>Manual / JSON Test Importer</span>
        </button>
      </div>

      {builderMode === 'importer' ? (
        <AdminManualTestImporter onTestSaved={loadTests} />
      ) : (
        /* ─────────────────────────────────────────────────────────────
           PRACTICE TEST BUILDER FORM
           ───────────────────────────────────────────────────────────── */
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Full-Length Digital SAT Practice Test Generator
            </h3>
            <p className="text-[11px] text-slate-400">
              Generates two-module exam with psychometric difficulty pacing and College Board domain weights.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateTest} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Title */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Exam Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. October 2026 ScoreUp High-Yield Prediction Mock"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Psychometric Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as 'Standard' | 'Hard' | '750+' | 'Adaptive')
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="Standard">Standard Official Bluebook</option>
                <option value="Hard">Adaptive Hard Module</option>
                <option value="750+">750+ Elite Challenge</option>
                <option value="Adaptive">Fully Calibrated Adaptive</option>
              </select>
            </div>

            {/* Total Questions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Total Questions (M1 + M2)
              </label>
              <select
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value={44}>44 Questions (Official SAT Full 2-Module)</option>
                <option value={22}>22 Questions (Half Mock - 11 M1 + 11 M2)</option>
                <option value={10}>10 Questions (Quick Diagnostic Mock)</option>
              </select>
            </div>
          </div>

          {/* Engine Mode & Submit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLiveAI}
                  onChange={(e) => setUseLiveAI(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {useLiveAI
                  ? 'Use Live AI Generation (Groq/Gemini)'
                  : 'Fast Psychometric Engine (Instant generation)'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Full Exam ({generationProgress?.current || 0}/{totalQuestions})...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Assemble & Save Full Practice Test</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Generation Progress Bar */}
        {isGenerating && generationProgress && (
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-500/20 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-teal-800 dark:text-teal-300">
              <span>{generationProgress.message}</span>
              <span className="font-mono">
                {Math.round((generationProgress.current / generationProgress.total) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-teal-100 dark:bg-teal-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal-500 transition-all duration-300"
                style={{
                  width: `${Math.round((generationProgress.current / generationProgress.total) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CUSTOM PRACTICE TESTS POOL TABLE
         ───────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-white dark:bg-[#0c131f] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Generated Practice Tests ({tests.length})
            </h3>
          </div>
          <button
            onClick={loadTests}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh tests list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTests ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {tests.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No custom practice tests generated yet. Use the builder above to assemble your first exam!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-900/40">
                  <th className="p-4">Practice Test Title</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Questions Breakdown</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {tests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{test.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {test.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                        {test.difficulty}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {test.totalQuestions} Questions
                      </span>
                      <div className="text-[10px] text-slate-400">
                        M1: {test.module1Questions?.length || 0} • M2: {test.module2Questions?.length || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {test.durationMinutes || 70} mins
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleLaunchExam(test)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                          title="Take this exam in Bluebook interface"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Take</span>
                        </button>
                        <button
                          onClick={() => handleExportTs(test)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                          title="Download TypeScript file for src/data/"
                        >
                          <Download className="w-3 h-3" />
                          <span>.ts</span>
                        </button>
                        <button
                          onClick={() => handleCopyTs(test)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                          title="Copy TypeScript source code"
                        >
                          {copiedTestId === test.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteTest(test.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete test"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPracticeTestBuilderTab;
