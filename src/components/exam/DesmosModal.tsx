import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { X, Calculator, ChevronDown, RotateCcw, Loader2, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export type CalculatorMode = 'graphing' | 'scientific' | 'four-function';

interface DesmosModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEquation?: string;
}

export const DesmosModal: React.FC<DesmosModalProps> = memo(({ isOpen, onClose, initialEquation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<any>(null);
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>('graphing');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  let currentAppDark = true;
  try {
    const themeContext = useTheme();
    currentAppDark = themeContext?.theme === 'dark';
  } catch {
    currentAppDark = document.documentElement.classList.contains('dark');
  }

  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(currentAppDark);

  useEffect(() => {
    setIsDarkTheme(currentAppDark);
    if (calculatorInstance.current?.updateSettings) {
      try {
        calculatorInstance.current.updateSettings({ invertedColors: currentAppDark });
      } catch (e) {
        // ignore
      }
    }
  }, [currentAppDark]);

  const initCalculator = useCallback(() => {
    if (!containerRef.current) return;

    if (calculatorInstance.current) {
      try {
        calculatorInstance.current.destroy?.();
      } catch (e) {
        // ignore
      }
      calculatorInstance.current = null;
    }

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

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
            invertedColors: isDarkTheme,
            fontSize: 14,
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
          setUseIframeFallback(false);
          instance = window.Desmos.GraphingCalculator(containerRef.current, {
            border: false,
            invertedColors: isDarkTheme,
            fontSize: 14,
          });
        } else {
          setUseIframeFallback(true);
          setIsLoading(false);
          return;
        }

        if (instance) {
          calculatorInstance.current = instance;
          setIsLoading(false);

          if (initialEquation && calculatorMode === 'graphing' && instance.setExpression) {
            try {
              instance.setExpression({ id: 'init', latex: initialEquation });
            } catch (err) {
              console.warn('Failed to set initial equation:', err);
            }
          }

          [50, 150, 300, 600].forEach((delay) => {
            setTimeout(() => {
              if (calculatorInstance.current?.resize) {
                calculatorInstance.current.resize();
              }
            }, delay);
          });
        }
      } catch (err) {
        console.error('Error instantiating modal Desmos calculator mode:', calculatorMode, err);
        setUseIframeFallback(true);
        setIsLoading(false);
      }
    } else {
      setUseIframeFallback(true);
      setIsLoading(false);
    }
  }, [calculatorMode, isDarkTheme, initialEquation]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    let pollInterval: any = null;

    if (window.Desmos?.GraphingCalculator) {
      setTimeout(() => {
        if (isMounted) initCalculator();
      }, 20);
    } else {
      let script = document.querySelector('script[src*="desmos.com/api"]') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
        script.async = true;
        document.head.appendChild(script);
      }

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
          setUseIframeFallback(true);
          setIsLoading(false);
        }
      }, 50);
    }

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isOpen, initCalculator, reloadKey]);

  useEffect(() => {
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
  }, []);

  const modeDisplayLabel: Record<CalculatorMode, string> = {
    'graphing': 'Graphing Calculator',
    'scientific': 'Scientific Calculator',
    'four-function': 'Four-Function Calculator',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Desmos Calculator"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                    className="flex items-center space-x-1.5 text-sm font-bold text-white hover:text-emerald-400 transition-colors focus:outline-none"
                  >
                    <span>{modeDisplayLabel[calculatorMode]}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isModeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isModeDropdownOpen && (
                    <div className="absolute left-0 top-full mt-2 w-52 rounded-xl bg-slate-800 border border-slate-700 shadow-xl z-50 overflow-hidden py-1">
                      {(['graphing', 'scientific', 'four-function'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => {
                            setCalculatorMode(mode);
                            setIsModeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                            calculatorMode === mode
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                              : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                          }`}
                        >
                          <span>{modeDisplayLabel[mode]}</span>
                          {calculatorMode === mode && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded uppercase">
                  Official Bluebook v1.9
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">College Board Digital SAT Environment</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reload Calculator"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {calculatorMode === 'graphing' && (
              <button
                type="button"
                onClick={() => {
                  if (calculatorInstance.current?.setBlank) {
                    calculatorInstance.current.setBlank();
                  }
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Clear expressions"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Full Width & Height Container for Official Desmos API */}
        <div className="flex-1 w-full h-full relative bg-slate-950 overflow-hidden flex items-center justify-center">
          {isLoading && !useIframeFallback && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xs select-none">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
              <span className="text-xs font-semibold text-slate-300">
                Loading Desmos {modeDisplayLabel[calculatorMode]}...
              </span>
            </div>
          )}

          {useIframeFallback ? (
            <iframe
              src={
                calculatorMode === 'scientific'
                  ? 'https://www.desmos.com/scientific?embed'
                  : calculatorMode === 'four-function'
                  ? 'https://www.desmos.com/fourfunction?embed'
                  : 'https://www.desmos.com/calculator?embed'
              }
              title={`Desmos ${modeDisplayLabel[calculatorMode]} Calculator`}
              className="w-full h-full border-0 bg-white"
            />
          ) : (
            <div
              ref={containerRef}
              className={`w-full h-full ${
                calculatorMode !== 'graphing'
                  ? 'p-4 max-w-xl max-h-[640px] flex items-center justify-center'
                  : 'absolute inset-0'
              }`}
            />
          )}
        </div>

      </div>
    </div>
  );
});
