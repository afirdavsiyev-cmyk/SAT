import React, { useMemo } from 'react';
import katex from 'katex';

export interface MathRendererProps {
  content?: string;
  text?: string;
  className?: string;
  inline?: boolean;
}

const LITERAL_DOLLAR_TOKEN = '___SAT_DOLLAR_CURRENCY___';

interface TableBlock {
  type: 'table';
  headers: string[];
  alignments: ('left' | 'center' | 'right')[];
  rows: string[][];
}

interface ProseBlock {
  type: 'prose';
  content: string;
}

type ParsedBlock = TableBlock | ProseBlock;

function isTableDelimiterRow(line: string): boolean {
  const trimmed = line.trim();
  return /^\|(\s*:?-{2,}:?\s*\|)+$/.test(trimmed);
}

/**
 * Splits text into blocks of prose and markdown tables.
 */
function parseBlocks(rawText: string): ParsedBlock[] {
  const lines = rawText.split('\n');
  const blocks: ParsedBlock[] = [];
  let currentProse: string[] = [];

  const flushProse = () => {
    if (currentProse.length > 0) {
      blocks.push({ type: 'prose', content: currentProse.join('\n') });
      currentProse = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';

    if (line.startsWith('|') && line.endsWith('|') && isTableDelimiterRow(nextLine)) {
      flushProse();

      const headers = line.slice(1, -1).split('|').map((c) => c.trim());
      const alignments = nextLine
        .slice(1, -1)
        .split('|')
        .map((c) => {
          const t = c.trim();
          const left = t.startsWith(':');
          const right = t.endsWith(':');
          if (left && right) return 'center' as const;
          if (right) return 'right' as const;
          return 'left' as const;
        });

      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length) {
        const rowLine = lines[j].trim();
        if (rowLine.startsWith('|') && rowLine.endsWith('|') && rowLine.length >= 2) {
          rows.push(rowLine.slice(1, -1).split('|').map((c) => c.trim()));
          j++;
        } else {
          break;
        }
      }

      blocks.push({
        type: 'table',
        headers,
        alignments,
        rows,
      });

      i = j - 1;
    } else {
      currentProse.push(lines[i]);
    }
  }

  flushProse();
  return blocks;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, text, className = '', inline = false }) => {
  const actualContent = text !== undefined ? text : content || '';

  const renderedElements = useMemo(() => {
    if (!actualContent) return null;

    let sanitized = actualContent;

    // 1. Unescape literal \n or \r\n (from double-escaped strings in data or JSON)
    // Guard against known LaTeX commands starting with 'n': \neq, \nabla, \notin, \nu, \natural, \nearrow, \nwarrow, \normalsize, \noindent, \newline, \not
    if (sanitized.includes('\\n') || sanitized.includes('\\r')) {
      sanitized = sanitized
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n(?!(eq|abla|otin|u(?![a-zA-Z])|atural|earrow|warrow|ormalsize|oindent|ewline|ot(?![a-zA-Z])))/g, '\n');
    }

    // 2. Preprocess explicitly escaped currency signs \$ -> placeholder token
    sanitized = sanitized.replace(/\\(\$)/g, LITERAL_DOLLAR_TOKEN);

    // 3. Normalize LaTeX display/inline brackets \[ ... \] and \( ... \) to $$ ... $$ and $ ... $
    sanitized = sanitized
      .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$')
      .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');

    // If inline mode requested, render prose content directly without block structures
    if (inline) {
      return renderProseContent(sanitized, 'inline');
    }

    // Parse block structures (Markdown tables vs prose blocks)
    const blocks = parseBlocks(sanitized);

    return blocks.map((block, blockIdx) => {
      if (block.type === 'table') {
        return (
          <div
            key={`table-${blockIdx}`}
            className="my-5 overflow-x-auto flex justify-center animate-fadeIn"
          >
            <div className="inline-block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1424] shadow-xs overflow-hidden max-w-full">
              <table className="border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
                    {block.headers.map((h, i) => (
                      <th
                        key={i}
                        className={`py-2.5 px-5 font-bold text-slate-900 dark:text-slate-100 border-r last:border-r-0 border-slate-200 dark:border-slate-800 tracking-wide ${
                          block.alignments[i] === 'center'
                            ? 'text-center'
                            : block.alignments[i] === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        <MathRenderer content={h} inline />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {block.rows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="hover:bg-emerald-50/25 dark:hover:bg-emerald-950/20 transition-colors"
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className={`py-2.5 px-5 text-slate-800 dark:text-slate-200 font-medium border-r last:border-r-0 border-slate-100 dark:border-slate-800/60 whitespace-nowrap ${
                            block.alignments[cellIdx] === 'center'
                              ? 'text-center'
                              : block.alignments[cellIdx] === 'right'
                              ? 'text-right'
                              : 'text-left'
                          }`}
                        >
                          <MathRenderer content={cell} inline />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      return (
        <div key={`prose-blk-${blockIdx}`} className="space-y-1">
          {renderProseContent(block.content, blockIdx)}
        </div>
      );
    });
  }, [actualContent, inline]);

  if (inline) {
    return <span className={`inline-flex items-center flex-wrap gap-x-0.5 text-inherit ${className}`}>{renderedElements}</span>;
  }

  return (
    <div className={`text-inherit leading-relaxed space-y-2 ${className}`}>
      {renderedElements}
    </div>
  );
};

function renderProseContent(content: string, blockKey: string | number) {
  let sanitized = content;

  // If an entire option or formula snippet has no $ delimiters, but contains raw LaTeX commands (e.g. \frac{w}{6}, \sqrt{x})
  if (!sanitized.includes('$') && /\\[a-zA-Z]+/.test(sanitized)) {
    sanitized = `$${sanitized}$`;
  }

  // Regex handling both $$...$$ and $...$ safely without dropping symbols:
  const tokens = sanitized.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

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
            key={`${blockKey}-block-math-${index}`}
            className="my-3 py-1 px-2 overflow-x-auto text-center font-normal text-inherit"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return (
          <div
            key={`${blockKey}-block-err-${index}`}
            className="my-2 p-2 rounded bg-slate-100 dark:bg-slate-900 font-mono text-xs text-emerald-700 dark:text-emerald-400 text-center"
          >
            {formula}
          </div>
        );
      }
    }

    // ─── Inline Math: $ ... $ ──────────────────────────────────────
    if (token.startsWith('$') && token.endsWith('$') && token.length >= 2) {
      let formula = token.slice(1, -1).trim();

      // If it was an escaped currency token
      if (formula.includes(LITERAL_DOLLAR_TOKEN)) {
        const textOnly = formula.replace(new RegExp(LITERAL_DOLLAR_TOKEN, 'g'), '$');
        return (
          <span key={`${blockKey}-currency-${index}`} className="font-medium text-inherit">
            {textOnly}
          </span>
        );
      }

      formula = formula.replace(new RegExp(LITERAL_DOLLAR_TOKEN, 'g'), '\\$');

      try {
        const html = katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false,
          output: 'html',
        });
        return (
          <span
            key={`${blockKey}-inline-math-${index}`}
            className="inline-block px-0.5 align-baseline text-inherit font-normal"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return (
          <code
            key={`${blockKey}-inline-err-${index}`}
            className="px-1 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-emerald-700 dark:text-emerald-400 font-mono text-xs"
          >
            {formula}
          </code>
        );
      }
    }

    // ─── Regular Prose Segment ─────────────────────────────────────
    return renderProseSegment(token, `${blockKey}-${index}`);
  });
}

/**
 * Helper to parse bold, inline code, images, and line breaks in non-math text segments,
 * while restoring any currency dollar symbols.
 */
function renderProseSegment(text: string, keyPrefix: string | number) {
  // Restore dollar sign placeholder
  const cleanedText = text.replace(new RegExp(LITERAL_DOLLAR_TOKEN, 'g'), '$');

  // Split text by newlines to preserve paragraphs / line breaks
  const lines = cleanedText.split('\n');

  return (
    <React.Fragment key={`prose-${keyPrefix}`}>
      {lines.map((line, lineIdx) => {
        // Parse bold **...**, inline code `...`, and images ![alt](url)
        const parts = line.split(/(\*\*.*?\*\*|`.*?`|!\[.*?\]\(.*?\))/g);

        const renderedLine = parts.map((part, partIdx) => {
          if (part.startsWith('![') && part.includes('](') && part.endsWith(')')) {
            const match = part.match(/^!\[(.*?)\]\((.*?)\)$/);
            if (match) {
              const alt = match[1];
              const src = match[2];
              return (
                <span key={partIdx} className="block my-3 text-center">
                  <img
                    src={src}
                    alt={alt}
                    className="inline-block max-w-full max-h-80 sm:max-h-96 rounded-2xl border border-white/10 shadow-lg bg-white p-2 object-contain"
                  />
                </span>
              );
            }
          }
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
                className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded text-teal-800 dark:text-teal-300 font-mono text-xs"
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

export const MathText = MathRenderer;
export const KaTeXRenderer = MathRenderer;
export default MathRenderer;
