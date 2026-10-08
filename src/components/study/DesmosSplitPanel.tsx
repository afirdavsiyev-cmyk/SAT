import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import {
  X,
  ExternalLink,
  ChevronDown,
  Calculator,
  RotateCcw,
  Sun,
  Moon,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  // Safe theme detection from App ThemeContext with fallback to HTML class
  let currentAppDark = true;
  try {
    const themeContext = useTheme();
    currentAppDark = themeContext?.theme === 'dark';
  } catch {
    currentAppDark = document.documentElement.classList.contains('dark');
  }

  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(currentAppDark);

  // Sync with system or app theme changes
  useEffect(() => {
    setIsDarkTheme(currentAppDark);
  }, [currentAppDark]);

  // Keep callback reference stable so it never triggers calculator re-instantiation
  const onResizeCalculatorRefRef = useRef(onResizeCalculatorRef);
  useEffect(() => {
    onResizeCalculatorRefRef.current = onResizeCalculatorRef;
  }, [onResizeCalculatorRef]);

  // Dynamically update Desmos settings (color inversion) without rebuilding the calculator
  useEffect(() => {
    if (calculatorInstance.current?.updateSettings) {
      try {
        calculatorInstance.current.updateSettings({ invertedColors: isDarkTheme });
      } catch (err) {
        console.warn('Error updating Desmos settings:', err);
      }
    }
  }, [isDarkTheme]);

  // Initialize or re-instantiate calculator with resilient polling & iframe fallback
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    const initCalculator = () => {
      if (!isMounted || !containerRef.current) return;

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
      try {
        if (!window.Desmos) {
          setUseIframeFallback(true);
          setIsLoading(false);
          return;
        }

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
            invertedColors: isDarkTheme,
            fontSize: 13,
          });
        } else if (calculatorMode === 'scientific' && window.Desmos.ScientificCalculator) {
          setUseIframeFallback(false);
          instance = window.Desmos.ScientificCalculator(containerRef.current, {
            border: false,
            invertedColors: isDarkTheme,
          });
        } else if (calculatorMode === 'four-function' && window.Desmos.FourFunctionCalculator) {
          setUseIframeFallback(false);
          instance = window.Desmos.FourFunctionCalculator(containerRef.current, {
            border: false,
            invertedColors: isDarkTheme,
          });
        } else if (window.Desmos.GraphingCalculator) {
          // If requested mode is unavailable, fallback to standard graphing
          setUseIframeFallback(false);
          instance = window.Desmos.GraphingCalculator(containerRef.current, {
            border: false,
            invertedColors: isDarkTheme,
            fontSize: 13,
          });
        } else {
          setUseIframeFallback(true);
          setIsLoading(false);
          return;
        }

        if (instance && isMounted) {
          calculatorInstance.current = instance;
          setIsLoading(false);

          // Connect external resize trigger
          if (onResizeCalculatorRefRef.current) {
            onResizeCalculatorRefRef.current(() => {
              if (calculatorInstance.current?.resize) {
                calculatorInstance.current.resize();
              }
            });
          }

          // Trigger multiple layout resize passes to guarantee perfect fit
          [50, 150, 300, 600, 1000].forEach((delay) => {
            setTimeout(() => {
              if (isMounted && calculatorInstance.current?.resize) {
                calculatorInstance.current.resize();
              }
            }, delay);
          });
        }
      } catch (err) {
        console.error('Error instantiating Desmos calculator mode:', calculatorMode, err);
        if (isMounted) {
          setUseIframeFallback(true);
          setIsLoading(false);
        }
      }
    };

    let pollInterval: any = null;

    if (window.Desmos?.GraphingCalculator) {
      // Desmos is already in memory
      setTimeout(initCalculator, 20);
    } else {
      // Ensure Desmos script is in DOM
      let script = document.querySelector('script[src*="desmos.com/api"]') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
        script.async = true;
        document.head.appendChild(script);
      }

      // Poll until window.Desmos.GraphingCalculator is available (up to 3.5s)
      const startTime = Date.now();
      pollInterval = setInterval(() => {
        if (!isMounted) {
          clearInterval(pollInterval);
          return;
        }
        if (window.Desmos?.GraphingCalculator) {
          clearInterval(pollInterval);
          initCalculator();
        } else if (Date.now() - startTime > 3500) {
          clearInterval(pollInterval);
          console.warn('Desmos API script timed out; rendering embedded iframe fallback');
          setUseIframeFallback(true);
          setIsLoading(false);
        }
      }, 50);
    }

    const handleWindowResize = () => {
      if (calculatorInstance.current?.resize) {
        calculatorInstance.current.resize();
      }
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
      window.removeEventListener('resize', handleWindowResize);
      if (calculatorInstance.current) {
        try {
          calculatorInstance.current.destroy?.();
        } catch (e) {
          // ignore
        }
        calculatorInstance.current = null;
      }
    };
  }, [isOpen, calculatorMode, reloadKey]);

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
    <div className="h-full w-full flex flex-col bg-white dark:bg-[#0c101a] border-r border-slate-200 dark:border-slate-800 overflow-hidden relative select-auto">
      
      {/* ─── Header Bar Above Desmos ───────────────────────────────── */}
      <div className="h-12 bg-white/95 dark:bg-[#0e1320] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between flex-shrink-0 z-20 select-none">
        
        {/* Left: Title + Mode Dropdown */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-slate-900 dark:text-white font-extrabold text-xs tracking-wide">
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Calculator</span>
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
              <div className="absolute left-0 top-full mt-1.5 w-44 rounded-2xl p-1.5 bg-white/95 dark:bg-[#141a29] border border-slate-200 dark:border-slate-700 backdrop-blur-sm shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-0.5">
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

        {/* Right Actions: Theme/Contrast, Reload, Clear, Pop Out, Close */}
        <div className="flex items-center space-x-1">
          {/* Reload / Re-sync button */}
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
            title="Reload Calculator"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Color / Contrast Mode Toggle (Dark vs Light) */}
          <button
            type="button"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
            title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme (Reverse Contrast)'}
          >
            {isDarkTheme ? (
              <Sun className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>

          {calculatorMode === 'graphing' && (
            <button
              type="button"
              onClick={handleClearExpressions}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
              title="Clear expressions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {onPopOut && (
            <button
              type="button"
              onClick={onPopOut}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-[11px] font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center space-x-1 transition-colors shadow-sm"
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
      <div className={`flex-1 w-full relative overflow-hidden ${isDarkTheme ? 'bg-[#111111]' : 'bg-white'}`}>
        {/* Loading Spinner Indicator */}
        {isLoading && !useIframeFallback && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-[#0c101a]/90 backdrop-blur-xs select-none">
            <Loader2 className="w-7 h-7 text-emerald-500 animate-spin mb-2" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Initializing Desmos {modeDisplayLabel[calculatorMode]} Calculator...
            </span>
          </div>
        )}

        {/* Native Desmos Container */}
        <div
          ref={containerRef}
          className={`absolute inset-0 w-full h-full select-auto ${useIframeFallback ? 'hidden' : 'block'}`}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Fallback iframe with ?embed parameter */}
        {useIframeFallback && (
          <iframe
            src={
              calculatorMode === 'scientific'
                ? 'https://www.desmos.com/scientific?embed'
                : calculatorMode === 'four-function'
                ? 'https://www.desmos.com/fourfunction?embed'
                : 'https://www.desmos.com/calculator?embed'
            }
            title={`Desmos ${modeDisplayLabel[calculatorMode]} Calculator`}
            className={`w-full h-full border-0 ${
              isDarkTheme ? 'filter invert-[0.88] hue-rotate-180 contrast-[1.05]' : 'bg-white'
            }`}
          />
        )}
      </div>

    </div>
  );
});
