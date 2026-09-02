import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content?: string;
  text?: string;
  className?: string;
  inline?: boolean;
}

const LITERAL_DOLLAR_TOKEN = '___SAT_DOLLAR_CURRENCY___';

export const MathRenderer: React.FC<MathRendererProps> = ({ content, text, className = '', inline = false }) => {
  const actualContent = text !== undefined ? text : content || '';

  const renderedElements = useMemo(() => {
    if (!actualContent) return null;

    // 1. Preprocess escaped currency signs \$ -> placeholder token
    let sanitized = actualContent.replace(/\\(\$)/g, LITERAL_DOLLAR_TOKEN);

    // 2. Preprocess standalone unescaped currency amounts e.g. "$45", "$1,200", "$3.50"
    // that are followed by spaces/punctuation without being actual LaTeX formulas
    sanitized = sanitized.replace(/(^|[\s(])\$(\d+(?:[.,]\d+)*)(?=[\s.,;!?)]|$)/g, `$1${LITERAL_DOLLAR_TOKEN}$2`);

    // 3. Normalize LaTeX display/inline brackets \[ ... \] and \( ... \) to $$ ... $$ and $ ... $
    sanitized = sanitized
      .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
      .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');

    // 4. Split by block math ($$...$$) first, then inline math ($...$)
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    const tokens = sanitized.split(mathRegex);

    return tokens.map((token, index) => {
      if (!token) return null;

      // ─── Block Math: $$ ... $$ ─────────────────────────────────────
      if (token.startsWith('$$') && token.endsWith('$$') && token.length >= 4) {
        let formula = token.slice(2, -2).trim();
        formula = formula.replace(new RegExp(LITERAL_DOLLAR_TOKEN, 'g'), '\\$');
        try {
          const html = katex.renderToString(formula, {
            displayMode: true,
            throwOnError: false,
            output: 'html',
          });
          return (
            <div
              key={`block-math-${index}`}
              className="my-3 py-1 px-2 overflow-x-auto text-center font-normal text-inherit"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <div key={`block-err-${index}`} className="my-2 p-2 rounded bg-slate-100 dark:bg-slate-900 font-mono text-xs text-emerald-700 dark:text-emerald-400 text-center">
              {formula}
            </div>
          );
        }
      }

      // ─── Inline Math: $ ... $ ──────────────────────────────────────
      if (token.startsWith('$') && token.endsWith('$') && token.length >= 2) {
        let formula = token.slice(1, -1).trim();

        // If it's simply a currency placeholder (e.g. $___SAT_DOLLAR_CURRENCY___45$)
        if (formula.includes(LITERAL_DOLLAR_TOKEN)) {
          const textOnly = formula.replace(new RegExp(LITERAL_DOLLAR_TOKEN, 'g'), '$');
          return <span key={`currency-${index}`} className="font-medium text-inherit">{textOnly}</span>;
        }

        // Safety check: If token contains multiple English words with spaces and no LaTeX math operators,
        // it was likely prose caught between accidental dollar delimiters
        const isSuspiciousProse =
          /\s{2,}/.test(formula) ||
          (formula.split(/\s+/).length > 3 && !/[\\_^{}=<>+\-*/]/.test(formula));

        if (isSuspiciousProse) {
          return renderProseSegment(formula, index);
        }

        try {
          const html = katex.renderToString(formula, {
            displayMode: false,
            throwOnError: false,
            output: 'html',
          });
          return (
            <span
              key={`inline-math-${index}`}
              className="inline-block px-0.5 align-baseline text-inherit font-normal"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <code key={`inline-err-${index}`} className="px-1 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-emerald-700 dark:text-emerald-400 font-mono text-xs">
              {formula}
            </code>
          );
        }
      }

      // ─── Regular Prose Segment ─────────────────────────────────────
      return renderProseSegment(token, index);
    });
  }, [content]);

  if (inline) {
    return <span className={`inline-flex items-center flex-wrap gap-x-0.5 text-inherit ${className}`}>{renderedElements}</span>;
  }

  return (
    <div className={`text-inherit leading-relaxed space-y-1 ${className}`}>
      {renderedElements}
    </div>
  );
};

/**
 * Helper to parse bold, inline code, and line breaks in non-math text segments,
 * while restoring any currency dollar symbols.
 */
function renderProseSegment(text: string, keyPrefix: number) {
  // Restore dollar sign placeholder
  const cleanedText = text.replace(new RegExp(LITERAL_DOLLAR_TOKEN, 'g'), '$');

  // Split text by newlines to preserve paragraphs / line breaks
  const lines = cleanedText.split('\n');

  return (
    <React.Fragment key={`prose-${keyPrefix}`}>
      {lines.map((line, lineIdx) => {
        // Parse bold **...** and inline code `...`
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
              <code key={partIdx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded text-teal-800 dark:text-teal-300 font-mono text-xs">
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
