import React, { useMemo } from 'react';
import katex from 'katex';
import DOMPurify from 'dompurify';

/**
 * Renders a LaTeX expression with KaTeX and sanitizes the output with DOMPurify.
 * Enforces trust: false to prevent untrusted commands or macro injections.
 */
const renderSanitizedKaTeX = (expression: string, displayMode: boolean): string => {
  const rawHtml = katex.renderToString(expression, {
    displayMode,
    throwOnError: false,
    output: 'html',
    trust: false,
  });
  return DOMPurify.sanitize(rawHtml);
};

export interface KaTeXRendererProps {
  /** Text containing mixed prose and LaTeX math ($...$ or $$...$$) */
  text?: string;
  /** Alias for text */
  content?: string;
  /** Pure math expression to render directly without parsing delimiters */
  math?: string;
  /** String children can also be passed directly */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Force inline layout */
  inline?: boolean;
  /** Force display/block math mode when using the `math` prop */
  block?: boolean;
}

const LITERAL_DOLLAR_TOKEN = '___SCOREUP_LITERAL_DOLLAR___';

/**
 * KaTeX Math Renderer for ScoreUp
 * Parses mixed text containing inline ($...$ or \(...\)) and block ($$...$$ or \[...\]) LaTeX formulas.
 * Handles currency amounts ($50, $1,200), escaped dollars (\$), bold/code formatting, and line breaks.
 */
export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({
  text,
  content,
  math,
  children,
  className = '',
  inline = false,
  block = false,
}) => {
  // If a pure math string is provided directly via `math` prop
  if (math !== undefined) {
    try {
      const html = renderSanitizedKaTeX(math, block);

      if (block) {
        return (
          <div
            className={`my-3 py-1 overflow-x-auto text-center font-normal text-inherit ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }

      return (
        <span
          className={`inline-block px-0.5 align-baseline text-inherit font-normal ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      return (
        <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-rose-600 dark:text-rose-400 font-mono text-xs">
          {math}
        </code>
      );
    }
  }

  // Determine text content from text, content, or string children
  const rawText: string =
    text !== undefined
      ? text
      : content !== undefined
      ? content
      : typeof children === 'string'
      ? children
      : '';

  const renderedElements = useMemo(() => {
    if (!rawText) return null;

    // 1. Preserve explicitly escaped dollars: \$ -> token
    let sanitized = rawText.replace(/\\(\$)/g, LITERAL_DOLLAR_TOKEN);

    // 2. Preserve currency figures (e.g. "$45", "$1,200", "$3.50") not intended as math
    sanitized = sanitized.replace(
      /(^|[\s(])\$(\d+(?:[.,]\d+)*)(?=[\s.,;!?)]|$)/g,
      `$1${LITERAL_DOLLAR_TOKEN}$2`
    );

    // 3. Normalize LaTeX brackets \[ ... \] and \( ... \) to $$ ... $$ and $ ... $
    sanitized = sanitized
      .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
      .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');

    // 4. Tokenize by display math ($$...$$) first, then inline math ($...$)
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    const tokens = sanitized.split(mathRegex);

    return tokens.map((token, index) => {
      if (!token) return null;

      // ─── Block / Display Math: $$ ... $$ ─────────────────────────────
      if (token.startsWith('$$') && token.endsWith('$$') && token.length >= 4) {
        let formula = token.slice(2, -2).trim();
        formula = formula.replace(new RegExp(LITERAL_DOLLAR_TOKEN, 'g'), '\\$');
        try {
          const html = renderSanitizedKaTeX(formula, true);
          return (
            <div
              key={`block-math-${index}`}
              className="my-3 py-1.5 px-2 overflow-x-auto text-center font-normal text-inherit leading-normal"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <div
              key={`block-err-${index}`}
              className="my-2 p-2 rounded bg-rose-950/20 border border-rose-800/40 font-mono text-xs text-rose-300 text-center"
            >
              {formula}
            </div>
          );
        }
      }

      // ─── Inline Math: $ ... $ ────────────────────────────────────────
      if (token.startsWith('$') && token.endsWith('$') && token.length >= 2) {
        let formula = token.slice(1, -1).trim();

        // Check if token is only a currency amount wrapped in tokens
        if (formula.includes(LITERAL_DOLLAR_TOKEN)) {
          const textOnly = formula.replace(new RegExp(LITERAL_DOLLAR_TOKEN, 'g'), '$');
          return (
            <span key={`currency-${index}`} className="font-medium text-inherit">
              {textOnly}
            </span>
          );
        }

        // Avoid false positives: multiple space-separated words without any math operators
        const isSuspiciousProse =
          /\s{2,}/.test(formula) ||
          (formula.split(/\s+/).length > 3 && !/[\\_^{}=<>+\-*/]/.test(formula));

        if (isSuspiciousProse) {
          return renderProseSegment(formula, index);
        }

        try {
          const html = renderSanitizedKaTeX(formula, false);
          return (
            <span
              key={`inline-math-${index}`}
              className="inline-block px-0.5 align-baseline text-inherit font-normal"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <code
              key={`inline-err-${index}`}
              className="px-1 py-0.5 bg-rose-950/20 border border-rose-800/40 rounded text-rose-300 font-mono text-xs"
            >
              {formula}
            </code>
          );
        }
      }

      // ─── Regular Non-Math Prose Segment ──────────────────────────────
      return renderProseSegment(token, index);
    });
  }, [rawText]);

  if (inline) {
    return (
      <span className={`inline-flex items-center flex-wrap gap-x-0.5 text-inherit ${className}`}>
        {renderedElements}
      </span>
    );
  }

  return (
    <div className={`text-inherit leading-relaxed space-y-1 ${className}`}>
      {renderedElements}
    </div>
  );
};

/**
 * Parses bold markdown (**text**), inline code (`code`), and line breaks in non-math segments
 */
function renderProseSegment(text: string, keyPrefix: number) {
  // Restore escaped / currency dollar signs
  const cleanedText = text.replace(new RegExp(LITERAL_DOLLAR_TOKEN, 'g'), '$');
  const lines = cleanedText.split('\n');

  return (
    <React.Fragment key={`prose-${keyPrefix}`}>
      {lines.map((line, lineIdx) => {
        const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);

        const renderedLine = parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIdx} className="font-bold text-slate-900 dark:text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code
                key={partIdx}
                className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-teal-800 dark:text-teal-300 font-mono text-xs"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });

        return (
          <React.Fragment key={lineIdx}>
            {lineIdx > 0 && <br />}
            {renderedLine}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

// Interoperability alias
export const MathRenderer = KaTeXRenderer;
export default KaTeXRenderer;
