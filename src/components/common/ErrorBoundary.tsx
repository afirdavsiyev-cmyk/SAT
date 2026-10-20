import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  name?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[ErrorBoundary] Caught error in ${this.props.name || 'Component'}:`, error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  public resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error || new Error('Unknown error'), this.resetErrorBoundary);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default high-contrast, theme-aware fallback UI
      return (
        <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-100 my-3 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {this.props.name ? `${this.props.name} encountered an issue` : 'Something went wrong rendering this component'}
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                {this.state.error?.message || 'An unexpected rendering error occurred. You can retry to reload the component.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={this.resetErrorBoundary}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 font-semibold text-xs transition-colors shadow-sm active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Specialized lightweight Error Boundary for math rendering regions.
 * Falls back to showing raw formula text safely instead of breaking layout.
 */
export const MathErrorBoundary: React.FC<{
  children: ReactNode;
  fallbackText?: string;
}> = ({ children, fallbackText }) => {
  return (
    <ErrorBoundary
      name="KaTeX Math"
      fallback={
        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
          {fallbackText || 'Formula preview unavailable'}
        </span>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
