import React from 'react';

export const AdvancedMathBg: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center opacity-40 group-hover:opacity-75 transition-opacity">
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

        {/* Parabola: y = a(x-h)^2 + k */}
        <g className="animate-domain-float" style={{ transformOrigin: '150px 20px' }}>
          <path d="M60,45 Q150,-8 240,45" strokeWidth="2" />
          {/* Vertex point with pulsing glow */}
          <circle
            cx="150"
            cy="18"
            r="4.5"
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
};

export default AdvancedMathBg;
