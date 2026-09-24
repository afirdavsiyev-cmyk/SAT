import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { X, Calculator, ChevronDown, RotateCcw } from 'lucide-react';
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
          });
        } else if (calculatorMode === 'scientific') {
          if (window.Desmos.ScientificCalculator) {
            setUseIframeFallback(false);
            instance = window.Desmos.ScientificCalculator(containerRef.current, {
              border: false,
              invertedColors: isDarkTheme,
            });
          } else {
            setUseIframeFallback(true);
          }
        } else if (calculatorMode === 'four-function') {
          if (window.Desmos.FourFunctionCalculator) {
            setUseIframeFallback(false);
            instance = window.Desmos.FourFunctionCalculator(containerRef.current, {
              border: false,
              invertedColors: isDarkTheme,
            });
          } else {
            setUseIframeFallback(true);
          }
        }

        if (instance) {
          calculatorInstance.current = instance;
          setTimeout(() => {
            if (calculatorInstance.current?.resize) {
              calculatorInstance.current.resize();
            }
          }, 100);
        }
      } catch (err) {
        console.error('Error instantiating modal Desmos calculator mode:', calculatorMode, err);
        setUseIframeFallback(true);
      }
    } else {
      setUseIframeFallback(true);
    }
  }, [calculatorMode, isDarkTheme]);

  useEffect(() => {
    if (!isOpen) return;

    if (window.Desmos) {
      initCalculator();
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = () => {
        initCalculator();
      };
      script.onerror = () => {
        setUseIframeFallback(true);
      };
      document.body.appendChild(script);
    }
  }, [isOpen, initCalculator]);

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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 select-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-3.5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h3 className="font-extrabold text-white text-base">Desmos Calculator</h3>
                
                {/* Mode Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-bold text-slate-200 hover:text-white flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <span>{modeDisplayLabel[calculatorMode]}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isModeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isModeDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-44 rounded-2xl p-1.5 bg-slate-900/95 border border-slate-700/80 backdrop-blur-sm shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150 space-y-0.5">
                      {(['graphing', 'scientific', 'four-function'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => handleSelectMode(mode)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                            calculatorMode === mode
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
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
