import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import {
  X,
  ExternalLink,
  ChevronDown,
  Calculator,
  RotateCcw,
} from 'lucide-react';

export type CalculatorMode = 'graphing' | 'scientific' | 'four-function';

interface DesmosSplitPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPopOut?: () => void;
  onResizeCalculatorRef?: (resizeFn: () => void) => void;
}

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (element: HTMLElement, options?: any) => any;
      ScientificCalculator?: (element: HTMLElement, options?: any) => any;
      FourFunctionCalculator?: (element: HTMLElement, options?: any) => any;
    };
  }
}

export const DesmosSplitPanel: React.FC<DesmosSplitPanelProps> = memo(({
  isOpen,
  onClose,
  onPopOut,
  onResizeCalculatorRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<any>(null);
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>('graphing');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  // Initialize or re-instantiate calculator ONLY when mode changes or when first opened
  useEffect(() => {
    if (!isOpen) return;

    const init = () => {
      if (!containerRef.current) return;

      // 1. Destroy existing calculator instance cleanly if mode changed
      if (calculatorInstance.current) {
        try {
          calculatorInstance.current.destroy?.();
        } catch (e) {
          console.warn('Error destroying Desmos instance:', e);
        }
        calculatorInstance.current = null;
      }

      // 2. Reset DOM container contents
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // 3. Re-instantiate selected calculator mode
      if (window.Desmos) {
        try {
          let instance: any = null;

          if (calculatorMode === 'graphing' && window.Desmos.GraphingCalculator) {
            setUseIframeFallback(false);
            instance = window.Desmos.GraphingCalculator(containerRef.current, {
              keypad: true,
              graphpaper: true,
              expressions: true,
              settingsMenu: true,
              zoomButtons: true,
              border: false,
            });
          } else if (calculatorMode === 'scientific') {
            if (window.Desmos.ScientificCalculator) {
              setUseIframeFallback(false);
              instance = window.Desmos.ScientificCalculator(containerRef.current, {
                border: false,
              });
            } else {
              setUseIframeFallback(true);
            }
          } else if (calculatorMode === 'four-function') {
            if (window.Desmos.FourFunctionCalculator) {
              setUseIframeFallback(false);
              instance = window.Desmos.FourFunctionCalculator(containerRef.current, {
                border: false,
              });
            } else {
              setUseIframeFallback(true);
            }
          }

          if (instance) {
            calculatorInstance.current = instance;

            if (onResizeCalculatorRef) {
              onResizeCalculatorRef(() => {
                if (calculatorInstance.current?.resize) {
                  calculatorInstance.current.resize();
                }
              });
            }

            setTimeout(() => {
              if (calculatorInstance.current?.resize) {
                calculatorInstance.current.resize();
              }
            }, 100);
          }
        } catch (err) {
          console.error('Error instantiating Desmos calculator mode:', calculatorMode, err);
          setUseIframeFallback(true);
        }
      } else {
        setUseIframeFallback(true);
      }
    };

    if (window.Desmos) {
      init();
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = () => {
        init();
      };
      script.onerror = () => {
        setUseIframeFallback(true);
      };
      document.body.appendChild(script);
    }

    return () => {
      if (calculatorInstance.current) {
        try {
          calculatorInstance.current.destroy?.();
        } catch (e) {
          // ignore
        }
        calculatorInstance.current = null;
      }
    };
  }, [isOpen, calculatorMode, onResizeCalculatorRef]);

  const handleClearExpressions = useCallback(() => {
    if (calculatorInstance.current?.setBlank) {
      calculatorInstance.current.setBlank();
    }
  }, []);

  const handleSelectMode = (mode: CalculatorMode) => {
    setCalculatorMode(mode);
    setIsModeDropdownOpen(false);
  };

  const modeDisplayLabel: Record<CalculatorMode, string> = {
    'graphing': 'Graphing',
    'scientific': 'Scientific',
    'four-function': 'Four-Function',
  };

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/90 overflow-hidden relative select-none">
      
      {/* ─── Header Bar Above Desmos ───────────────────────────────── */}
      <div className="h-12 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between flex-shrink-0 z-20">
        
        {/* Left: Title + Mode Dropdown */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 text-slate-900 dark:text-white font-extrabold text-xs tracking-wide">
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Calculator</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] border border-slate-200 dark:border-white/[0.1] text-[11px] font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <span>{modeDisplayLabel[calculatorMode]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isModeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isModeDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-44 rounded-2xl p-1.5 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 backdrop-blur-2xl shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-0.5">
                {(['graphing', 'scientific', 'four-function'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSelectMode(mode)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                      calculatorMode === mode
                        ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{modeDisplayLabel[mode]}</span>
                    {calculatorMode === mode && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Clear, Pop Out, Close */}
        <div className="flex items-center space-x-1">
          {calculatorMode === 'graphing' && (
            <button
              type="button"
              onClick={handleClearExpressions}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              title="Clear expressions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {onPopOut && (
            <button
              type="button"
              onClick={onPopOut}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-[11px] font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center space-x-1 transition-colors shadow-sm"
              title="Pop out to floating window"
            >
              <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Pop Out</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            title="Close calculator panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ─── Desmos Container Body ──────────────────────────────────── */}
      <div className="flex-1 w-full h-[calc(100%-48px)] relative bg-white dark:bg-slate-950 overflow-hidden flex items-center justify-center">
        {useIframeFallback ? (
          <iframe
            src={
              calculatorMode === 'scientific'
                ? 'https://www.desmos.com/scientific'
                : calculatorMode === 'four-function'
                ? 'https://www.desmos.com/fourfunction'
                : 'https://www.desmos.com/calculator'
            }
            title={`Desmos ${modeDisplayLabel[calculatorMode]} Calculator`}
            className="w-full h-full border-0 bg-white"
          />
        ) : (
          <div
            ref={containerRef}
            className={`w-full h-full ${
              calculatorMode !== 'graphing'
                ? 'p-2 sm:p-4 flex items-center justify-center'
                : 'absolute inset-0'
            }`}
          />
        )}
      </div>

    </div>
  );
});
