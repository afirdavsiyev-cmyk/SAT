import React from 'react';
import { X, BookOpen, CheckCircle, Calculator, AlertCircle, Sparkles } from 'lucide-react';

interface PracticeRoomDirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PracticeRoomDirectionsModal: React.FC<PracticeRoomDirectionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh] relative bg-slate-900/95 border border-slate-700/80 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Digital SAT Math Directions</h3>
              <p className="text-xs text-slate-400">Official Bluebook & OnePrep Test Specification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-200 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Section 1: Overview */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
            <h4 className="font-extrabold text-emerald-300 text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>General Instructions</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The questions in this section address a number of important math skills. Use of a calculator is permitted for all questions. Reference formulas can be viewed at any time using the <strong>Reference</strong> button in the top navigation bar.
            </p>
          </div>

          {/* Section 2: Multiple Choice vs Student-Produced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                Multiple-Choice Questions
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select the single best answer choice from the four options provided. You can use the option eliminator tool on the right of any choice to cross out incorrect answers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                Student-Produced Responses (Grid-In)
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your exact numerical or fractional answer. You may enter integers (e.g. <code className="text-teal-300 font-mono">15</code>), fractions (e.g. <code className="text-teal-300 font-mono">5/13</code>), or decimals (e.g. <code className="text-teal-300 font-mono">3.75</code>).
              </p>
            </div>
          </div>

          {/* Section 3: Calculator & Desmos Shortcut Rules */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-teal-800/40 space-y-2">
            <div className="flex items-center space-x-2 text-teal-400">
              <Calculator className="w-4 h-4" />
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Desmos Graphing Calculator Rules
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The built-in Desmos graphing calculator is identical to the official Bluebook test environment. You can plot systems of equations, compute regressions (<code className="text-teal-300 font-mono">y1 ~ mx1 + b</code>), and retrieve vertex coordinates with a single tap.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 transition-colors shadow-glow-emerald"
          >
            Got it, return to practice
          </button>
        </div>

      </div>
    </div>
  );
};
