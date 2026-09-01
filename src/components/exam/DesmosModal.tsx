import React, { useEffect, useRef } from 'react';
import { X, Calculator, Maximize2 } from 'lucide-react';

interface DesmosModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEquation?: string;
}

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (element: HTMLElement, options?: any) => any;
    };
  }
}

export const DesmosModal: React.FC<DesmosModalProps> = ({ isOpen, onClose, initialEquation = 'y = x^2 - 6x + 13' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    const initCalculator = () => {
      if (!containerRef.current) return;

      // If instance already exists, just trigger resize and set equation
      if (calculatorInstance.current) {
        calculatorInstance.current.resize();
        if (initialEquation) {
          calculatorInstance.current.setExpression({ id: 'init_eq', latex: initialEquation });
        }
        return;
      }

      // Initialize official Desmos Graphing Calculator directly
      if (window.Desmos && window.Desmos.GraphingCalculator) {
        try {
          const calculator = window.Desmos.GraphingCalculator(containerRef.current, {
            keypad: true,
            graphpaper: true,
            expressions: true,
            settingsMenu: true,
            zoomButtons: true,
            border: false,
          });

          calculatorInstance.current = calculator;

          if (initialEquation) {
            calculator.setExpression({ id: 'init_eq', latex: initialEquation });
          }

          // Trigger resize after DOM layout stabilization
          setTimeout(() => {
            if (calculatorInstance.current) {
              calculatorInstance.current.resize();
            }
          }, 100);
        } catch (err) {
          console.error('Error initializing official Desmos calculator:', err);
        }
      }
    };

    // Check if window.Desmos is loaded; if not, dynamically load script
    if (window.Desmos) {
      // Small timeout to allow container element to attach to DOM
      const timer = setTimeout(initCalculator, 50);
      return () => clearTimeout(timer);
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = () => {
        setTimeout(initCalculator, 50);
      };
      document.body.appendChild(script);
    }
  }, [isOpen, initialEquation]);

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
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-white text-base">Desmos Graphing Calculator</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded uppercase">
                  Official Bluebook v1.9
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">College Board Digital SAT Environment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Full Width & Height Container for Official Desmos API */}
        <div className="flex-1 w-full h-full relative bg-slate-950 overflow-hidden">
          <div
            id="desmos-calculator"
            ref={containerRef}
            className="w-full h-full absolute inset-0"
          />
        </div>

      </div>
    </div>
  );
};
