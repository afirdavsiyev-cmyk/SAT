import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', inline = false }) => {
  // Function to render math or parse strings containing $...$ or $$...$$
  const parsedContent = useMemo(() => {
    if (!content) return '';

    // Regex to split string by math delimiters $...$ or $$...$$
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
    const parts = content.split(mathRegex);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2);
        try {
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="my-2 block text-center" />;
        } catch {
          return <code key={index} className="text-emerald-400">{math}</code>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        try {
          const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="inline-block px-1" />;
        } catch {
          return <code key={index} className="text-emerald-400">{math}</code>;
        }
      }
      return <span key={index}>{part}</span>;
    });
  }, [content]);

  if (inline) {
    return <span className={`inline-flex items-center flex-wrap ${className}`}>{parsedContent}</span>;
  }

  return <div className={`leading-relaxed ${className}`}>{parsedContent}</div>;
};
