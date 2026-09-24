import React from 'react';

export const AlgebraBg: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center opacity-40 group-hover:opacity-75 transition-opacity">
      <svg
        className="w-full h-full stroke-emerald-600 dark:stroke-emerald-400 fill-none"
        viewBox="0 0 300 50"
        preserveAspectRatio="none"
        strokeWidth="1.6"
      >
        {/* Coordinate Axes */}
        <line x1="0" y1="25" x2="300" y2="25" strokeDasharray="4 4" opacity="0.4" />
        <line x1="150" y1="0" x2="150" y2="50" strokeDasharray="4 4" opacity="0.4" />

        {/* Primary Linear Line with Animated Flow Dashes */}
        <line
          x1="30"
          y1="42"
          x2="270"
          y2="8"
          strokeWidth="2"
          strokeDasharray="8 5"
          className="animate-domain-dash"
        />

        {/* Intersecting Second Line */}
        <line
          x1="50"
          y1="8"
          x2="250"
          y2="42"
          strokeDasharray="4 3"
          opacity="0.6"
          className="animate-domain-dash-fast"
        />

        {/* Animated Pulsing Intersection Point */}
        <circle
          cx="150"
          cy="25"
          r="5"
          className="fill-emerald-600 dark:fill-emerald-400 animate-ping opacity-60"
          style={{ transformOrigin: '150px 25px' }}
        />
        <circle cx="150" cy="25" r="3.5" className="fill-emerald-600 dark:fill-emerald-400" />
      </svg>
    </div>
  );
};

export default AlgebraBg;
