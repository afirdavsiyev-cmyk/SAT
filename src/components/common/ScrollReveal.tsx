import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Extra Tailwind classes applied to the wrapper div */
  className?: string;
  /** Delay in ms before the transition starts (for stagger effects) */
  delay?: number;
  /** Transition duration in ms */
  duration?: number;
  /** Whether the reveal fires once or on every entry */
  once?: boolean;
  /** Intersection threshold (0–1) */
  threshold?: number;
}

/**
 * Drop-in wrapper that reveals children with a fade + slide-up + scale animation
 * when they enter the viewport.
 *
 * Usage:
 *   <ScrollReveal delay={200}>
 *     <MyCard />
 *   </ScrollReveal>
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 700,
  once = true,
  threshold = 0.1,
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold, once });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.98)',
        transition: isVisible
          ? `opacity ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms,
             transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`
          : 'none',
        /* Prevent layout shift from opacity toggling causing repaints */
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
