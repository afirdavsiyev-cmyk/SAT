import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', inline = false }) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Normalize any escaped brackets \[ ... \] or \( ... \) to $$ ... $$ and $ ... $
    const normalizedContent = content
      .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
      .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');

    // Split by block math ($$...$$) first, then inline math ($...$)
    // Capturing group ensures delimiters and math content are preserved in tokens
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    const tokens = normalizedContent.split(mathRegex);

    return tokens.map((token, index) => {
      if (!token) return null;

      // Block Math: $$ ... $$
      if (token.startsWith('$$') && token.endsWith('$$') && token.length >= 4) {
        const formula = token.slice(2, -2).trim();
        try {
          const html = katex.renderToString(formula, {
            displayMode: true,
            throwOnError: false,
            output: 'html', // Clean HTML only: strictly prevents duplicate MathML raw string rendering
          });
          return (
            <div
              key={`block-math-${index}`}
              className="my-3 py-1 px-2 overflow-x-auto text-center font-normal text-slate-100"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <div key={`block-err-${index}`} className="my-2 p-2 rounded bg-slate-900 font-mono text-xs text-emerald-400 text-center">
              {formula}
            </div>
          );
        }
      }

      // Inline Math: $ ... $
      if (token.startsWith('$') && token.endsWith('$') && token.length >= 2) {
        const formula = token.slice(1, -1).trim();
        try {
          const html = katex.renderToString(formula, {
            displayMode: false,
            throwOnError: false,
            output: 'html', // Clean HTML only: strictly prevents duplicate MathML raw string rendering
          });
          return (
            <span
              key={`inline-math-${index}`}
              className="inline-block px-0.5 align-baseline text-slate-100 font-normal"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <code key={`inline-err-${index}`} className="px-1 py-0.5 bg-slate-900 rounded text-emerald-400 font-mono text-xs">
              {formula}
            </code>
          );
        }
      }

      // Regular prose/markdown text: process formatting like **bold**, `code`, and newlines
      return renderProseSegment(token, index);
    });
  }, [content]);

  if (inline) {
    return <span className={`inline-flex items-center flex-wrap gap-x-0.5 text-slate-200 ${className}`}>{renderedElements}</span>;
  }

  return (
    <div className={`text-slate-200 leading-relaxed text-[15px] space-y-1 ${className}`}>
      {renderedElements}
    </div>
  );
};

/**
 * Helper to parse bold, inline code, and line breaks in non-math text segments
 */
function renderProseSegment(text: string, keyPrefix: number) {
  // Split text by newlines to preserve paragraphs / line breaks
  const lines = text.split('\n');

  return (
    <React.Fragment key={`prose-${keyPrefix}`}>
      {lines.map((line, lineIdx) => {
        // Parse bold **...** and inline code `...`
        const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);

        const renderedLine = parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIdx} className="font-bold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={partIdx} className="px-1.5 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-teal-300 font-mono text-xs">
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
