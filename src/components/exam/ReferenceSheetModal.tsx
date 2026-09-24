import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface ReferenceSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceSheetModal: React.FC<ReferenceSheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">SAT Math Reference Sheet</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Official College Board Standard Formulas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Close Formula Sheet"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2D Formulas Grid */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
            <span>2D Area & Circumference</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            
            {/* Circle */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
              <svg className="w-16 h-16 mb-2 stroke-emerald-600 dark:stroke-emerald-400 fill-transparent" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="36" strokeWidth="2" />
                <line x1="50" y1="50" x2="86" y2="50" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="3" fill="#10b981" />
                <text x="66" y="44" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="13" fontStyle="italic">r</text>
              </svg>
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Circle</span>
              <p className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">A = πr²</p>
              <p className="font-mono text-xs text-slate-600 dark:text-slate-300">C = 2πr</p>
            </div>

            {/* Rectangle */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
              <svg className="w-16 h-16 mb-2 stroke-emerald-600 dark:stroke-emerald-400 fill-transparent" viewBox="0 0 100 100">
                <rect x="15" y="25" width="70" height="50" rx="2" strokeWidth="2" />
                <text x="46" y="88" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="13" fontStyle="italic">l</text>
                <text x="90" y="54" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="13" fontStyle="italic">w</text>
              </svg>
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Rectangle</span>
              <p className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">A = lw</p>
            </div>

            {/* Triangle */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
              <svg className="w-16 h-16 mb-2 stroke-emerald-600 dark:stroke-emerald-400 fill-transparent" viewBox="0 0 100 100">
                <polygon points="15,75 85,75 60,25" strokeWidth="2" />
                <line x1="60" y1="25" x2="60" y2="75" strokeWidth="1.5" strokeDasharray="3 3" className="stroke-slate-400 dark:stroke-slate-500" />
                <text x="46" y="88" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="13" fontStyle="italic">b</text>
                <text x="64" y="52" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="13" fontStyle="italic">h</text>
              </svg>
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Triangle</span>
              <p className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">A = ½bh</p>
            </div>

            {/* Pythagorean Theorem */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
              <svg className="w-16 h-16 mb-2 stroke-emerald-600 dark:stroke-emerald-400 fill-transparent" viewBox="0 0 100 100">
                <polygon points="20,75 80,75 20,25" strokeWidth="2" />
                <polyline points="20,65 30,65 30,75" strokeWidth="1.5" className="stroke-slate-400 dark:stroke-slate-500" />
                <text x="46" y="88" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="13" fontStyle="italic">b</text>
                <text x="10" y="54" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="13" fontStyle="italic">a</text>
                <text x="54" y="44" className="fill-emerald-600 dark:fill-emerald-400 stroke-none font-bold" fontSize="13" fontStyle="italic">c</text>
              </svg>
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">Pythagorean</span>
              <p className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">c² = a² + b²</p>
            </div>

          </div>
        </div>

        {/* Special Triangles */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">Special Right Triangles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* 30-60-90 */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Special 30° – 60° – 90°</span>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">Side Ratio: x : x√3 : 2x</p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 mt-2 space-y-1 font-mono">
                  <li>• Short leg (opp 30°) = x</li>
                  <li>• Long leg (opp 60°) = x√3</li>
                  <li>• Hypotenuse = 2x</li>
                </ul>
              </div>
              <svg className="w-24 h-24 stroke-emerald-600 dark:stroke-emerald-400 fill-transparent flex-shrink-0" viewBox="0 0 100 100">
                <polygon points="25,80 85,80 25,25" strokeWidth="2" />
                <polyline points="25,70 35,70 35,80" strokeWidth="1.5" className="stroke-slate-400 dark:stroke-slate-500" />
                <text x="28" y="38" className="fill-emerald-600 dark:fill-emerald-400 stroke-none font-bold" fontSize="10">30°</text>
                <text x="65" y="76" className="fill-emerald-600 dark:fill-emerald-400 stroke-none font-bold" fontSize="10">60°</text>
                <text x="50" y="93" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="11">x√3</text>
                <text x="12" y="55" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="11">x</text>
                <text x="60" y="48" className="fill-emerald-600 dark:fill-emerald-400 stroke-none font-bold" fontSize="11">2x</text>
              </svg>
            </div>

            {/* 45-45-90 */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Special 45° – 45° – 90°</span>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">Side Ratio: s : s : s√2</p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 mt-2 space-y-1 font-mono">
                  <li>• Legs (opp 45°) = s</li>
                  <li>• Hypotenuse = s√2</li>
                </ul>
              </div>
              <svg className="w-24 h-24 stroke-emerald-600 dark:stroke-emerald-400 fill-transparent flex-shrink-0" viewBox="0 0 100 100">
                <polygon points="25,80 80,80 25,25" strokeWidth="2" />
                <polyline points="25,70 35,70 35,80" strokeWidth="1.5" className="stroke-slate-400 dark:stroke-slate-500" />
                <text x="28" y="40" className="fill-emerald-600 dark:fill-emerald-400 stroke-none font-bold" fontSize="10">45°</text>
                <text x="60" y="76" className="fill-emerald-600 dark:fill-emerald-400 stroke-none font-bold" fontSize="10">45°</text>
                <text x="50" y="93" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="11">s</text>
                <text x="14" y="55" className="fill-slate-600 dark:fill-slate-400 stroke-none" fontSize="11">s</text>
                <text x="58" y="48" className="fill-emerald-600 dark:fill-emerald-400 stroke-none font-bold" fontSize="11">s√2</text>
              </svg>
            </div>

          </div>
        </div>

        {/* 3D Volumes */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">3D Volume Formulas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3.5 text-center shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Rectangular Prism</span>
              <p className="font-mono text-sm font-extrabold text-emerald-700 dark:text-emerald-300">V = lwh</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3.5 text-center shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Right Cylinder</span>
              <p className="font-mono text-sm font-extrabold text-emerald-700 dark:text-emerald-300">V = πr²h</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3.5 text-center shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Sphere</span>
              <p className="font-mono text-sm font-extrabold text-emerald-700 dark:text-emerald-300">V = ⁴⁄₃πr³</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3.5 text-center shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Right Cone</span>
              <p className="font-mono text-sm font-extrabold text-emerald-700 dark:text-emerald-300">V = ⅓πr²h</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3.5 text-center shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Pyramid</span>
              <p className="font-mono text-sm font-extrabold text-emerald-700 dark:text-emerald-300">V = ⅓lwh</p>
            </div>
          </div>
        </div>

        {/* Circle & Angle Laws */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-4 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 shadow-sm">
          <p>• The number of degrees of arc in a circle is <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">360°</strong>.</p>
          <p>• The number of radians of arc in a circle is <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">2π</strong>.</p>
          <p>• The sum of the measures in degrees of the angles of a triangle is <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">180°</strong>.</p>
        </div>

      </div>
    </div>
  );
};
