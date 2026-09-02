import React from 'react';
import { QuestionDomain } from '../../types/questionBank';

interface DomainInteractiveCanvasProps {
  domain: QuestionDomain | string;
}

export const DomainInteractiveCanvas: React.FC<DomainInteractiveCanvasProps> = ({ domain }) => {
  // ─── 1. Algebra ─────────────────────────────────────────────────────────────
  if (domain === 'Algebra') {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-40 hover:opacity-75 transition-opacity">
        <svg
          className="w-full h-full stroke-orange-500 dark:stroke-emerald-400 fill-none"
          viewBox="0 0 300 50"
          preserveAspectRatio="none"
          strokeWidth="1.6"
        >
          {/* Subtle Grid Axes */}
          <line x1="0" y1="25" x2="300" y2="25" strokeDasharray="4 4" opacity="0.4" />
          <line x1="150" y1="0" x2="150" y2="50" strokeDasharray="4 4" opacity="0.4" />

          {/* Primary Linear Line */}
          <line x1="30" y1="42" x2="270" y2="8" strokeWidth="2" />

          {/* Intersecting Dashed Line */}
          <line x1="50" y1="8" x2="250" y2="42" strokeDasharray="3 3" opacity="0.6" />

          {/* Animated Pulsing Intersection Dot */}
          <circle
            cx="150"
            cy="25"
            r="4"
            className="fill-orange-500 dark:fill-emerald-400 animate-ping"
            style={{ transformOrigin: '150px 25px' }}
          />
          <circle cx="150" cy="25" r="3.5" className="fill-orange-500 dark:fill-emerald-400" />
        </svg>
      </div>
    );
  }

  // ─── 2. Geometry & Trigonometry ─────────────────────────────────────────────
  if (domain === 'Geometry & Trigonometry') {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-40 hover:opacity-75 transition-opacity">
        <svg
          className="w-full h-full stroke-orange-500 dark:stroke-emerald-400 fill-none animate-[pulse_4s_ease-in-out_infinite]"
          viewBox="0 0 300 50"
          preserveAspectRatio="xMidYMid meet"
          strokeWidth="1.6"
        >
          {/* Right triangle with right-angle mark and theta */}
          <g className="animate-domain-float" style={{ transformOrigin: '35px 25px' }}>
            <polygon points="15,40 60,40 15,10" />
            <rect x="15" y="32" width="7" height="8" />
            <path d="M47,40 A15,15 0 0,0 50,30" />
          </g>

          {/* Circle with Inscribed Triangle */}
          <g className="animate-domain-float-alt" style={{ transformOrigin: '110px 25px' }}>
            <circle cx="110" cy="25" r="18" />
            <polygon points="110,7 126,34 94,34" strokeDasharray="2 2" />
          </g>

          {/* 3D Wireframe Cube */}
          <g className="animate-domain-float" style={{ animationDuration: '10s', transformOrigin: '185px 25px' }}>
            <path d="M170,15 L185,7 L200,15 L185,23 Z" />
            <path d="M170,15 L170,35 L185,43 L185,23 Z" />
            <path d="M200,15 L200,35 L185,43" />
            <path d="M170,35 L185,27 L200,35" strokeDasharray="2 2" opacity="0.6" />
          </g>

          {/* Wireframe Cylinder */}
          <g className="animate-domain-float-alt" style={{ animationDuration: '12s', transformOrigin: '255px 25px' }}>
            <ellipse cx="255" cy="15" rx="16" ry="6" />
            <line x1="239" y1="15" x2="239" y2="35" />
            <line x1="271" y1="15" x2="271" y2="35" />
            <path d="M239,35 A16,6 0 0,0 271,35" />
            <path d="M239,35 A16,6 0 0,1 286,35" strokeDasharray="2 2" opacity="0.5" />
          </g>
        </svg>
      </div>
    );
  }

  // ─── 3. Advanced Math ───────────────────────────────────────────────────────
  if (domain === 'Advanced Math') {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-40 hover:opacity-75 transition-opacity">
        <svg
          className="w-full h-full stroke-orange-500 dark:stroke-emerald-400 fill-none"
          viewBox="0 0 300 50"
          preserveAspectRatio="none"
          strokeWidth="1.6"
        >
          {/* Sub-Axis */}
          <line x1="0" y1="36" x2="300" y2="36" strokeDasharray="4 4" opacity="0.3" />
          {/* Axis of Symmetry */}
          <line x1="150" y1="0" x2="150" y2="50" strokeDasharray="3 3" opacity="0.4" />

          {/* Smooth Sine/Parabolic Curve */}
          <g className="animate-domain-float" style={{ transformOrigin: '150px 20px' }}>
            <path d="M60,45 Q150,-8 240,45" strokeWidth="2" />
            {/* Pulsing Vertex Point */}
            <circle
              cx="150"
              cy="18"
              r="4"
              className="fill-orange-500 dark:fill-emerald-400 animate-ping opacity-60"
              style={{ transformOrigin: '150px 18px' }}
            />
            <circle cx="150" cy="18" r="3.5" className="fill-orange-500 dark:fill-emerald-400" />
            <circle cx="95" cy="36" r="2.5" />
            <circle cx="205" cy="36" r="2.5" />
          </g>

          {/* Flowing Exponential Curve */}
          <path
            d="M10,42 Q180,40 285,6"
            strokeDasharray="6 4"
            strokeWidth="1.5"
            className="animate-domain-dash"
          />
        </svg>
      </div>
    );
  }

  // ─── 4. Problem-Solving & Data Analysis ────────────────────────────────────
  if (domain === 'Problem-Solving & Data Analysis' || domain === 'Problem Solving') {
    return (
      <div className="w-full h-full flex items-center justify-center opacity-40 hover:opacity-75 transition-opacity">
        <svg
          className="w-full h-full stroke-orange-500 dark:stroke-emerald-400 fill-none"
          viewBox="0 0 300 50"
          preserveAspectRatio="none"
          strokeWidth="1.6"
        >
          {/* Baseline */}
          <line x1="10" y1="42" x2="290" y2="42" opacity="0.4" />

          {/* Bell Curve */}
          <g className="animate-domain-float" style={{ transformOrigin: '150px 25px' }}>
            <path
              d="M20,42 C80,42 110,40 135,16 C143,8 147,5 150,5 C153,5 157,8 165,16 C190,40 220,42 280,42"
              strokeWidth="2"
            />
            <line x1="150" y1="5" x2="150" y2="42" strokeDasharray="3 3" opacity="0.5" />
          </g>

          {/* Floating Scatter Points */}
          <circle cx="45" cy="36" r="2.5" className="fill-orange-500 dark:fill-emerald-400 animate-domain-float" style={{ animationDelay: '0s' }} />
          <circle cx="75" cy="32" r="2.5" className="fill-orange-500 dark:fill-emerald-400 animate-domain-float-alt" style={{ animationDelay: '1.2s' }} />
          <circle cx="105" cy="24" r="3" className="fill-orange-500 dark:fill-emerald-400 animate-domain-float" style={{ animationDelay: '2.5s' }} />
          <circle cx="130" cy="16" r="2.5" className="fill-orange-500 dark:fill-emerald-400 animate-domain-pulse" style={{ transformOrigin: '130px 16px' }} />
          <circle cx="170" cy="18" r="2.5" className="fill-orange-500 dark:fill-emerald-400 animate-domain-float" style={{ animationDelay: '0.8s' }} />
          <circle cx="195" cy="26" r="3" className="fill-orange-500 dark:fill-emerald-400 animate-domain-float-alt" style={{ animationDelay: '1.8s' }} />
          <circle cx="225" cy="33" r="2.5" className="fill-orange-500 dark:fill-emerald-400 animate-domain-float" style={{ animationDelay: '3.1s' }} />
          <circle cx="255" cy="38" r="2.5" className="fill-orange-500 dark:fill-emerald-400 animate-domain-pulse" style={{ transformOrigin: '255px 38px' }} />

          {/* Best-fit regression line */}
          <line
            x1="30"
            y1="39"
            x2="270"
            y2="12"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.7"
            className="animate-domain-dash"
          />
        </svg>
      </div>
    );
  }

  return null;
};

export default DomainInteractiveCanvas;
