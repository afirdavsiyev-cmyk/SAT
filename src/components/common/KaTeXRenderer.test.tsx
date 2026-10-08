import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { KaTeXRenderer } from './KaTeXRenderer';

describe('KaTeXRenderer Component - Security & Sanitization', () => {
  it('renders standard inline math expressions safely', () => {
    const { container } = render(<KaTeXRenderer text="Find the value of $x^2 + 5x + 6 = 0$." />);
    expect(container.querySelector('.katex')).not.toBeNull();
    expect(container.textContent).toContain('Find the value of');
  });

  it('renders block math expressions with KaTeX markup', () => {
    const { container } = render(<KaTeXRenderer text="Solve: $$\\int_0^1 x^2 dx$$" />);
    expect(container.querySelector('.katex-display')).not.toBeNull();
  });

  it('preserves currency formatting ($100, $5.50) without treating it as math', () => {
    const { container } = render(<KaTeXRenderer text="The cost is $100 per ticket." />);
    expect(container.textContent).toContain('$100');
    expect(container.querySelector('.katex')).toBeNull();
  });

  it('sanitizes and strips malicious HTML / script payloads using DOMPurify', () => {
    // Attempting XSS injection through formula / props
    const { container } = render(
      <KaTeXRenderer math="x + <img src=x onerror=alert(1)>" />
    );

    // img with onerror or script must not be rendered into DOM
    expect(container.querySelector('img[onerror]')).toBeNull();
    expect(container.querySelector('script')).toBeNull();
  });

  it('renders direct math expression prop safely with displayMode', () => {
    const { container } = render(<KaTeXRenderer math="f(x) = \\sin(x)" block={true} />);
    expect(container.querySelector('.katex-display')).not.toBeNull();
  });
});
