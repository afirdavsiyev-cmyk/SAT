import React from 'react';

export const ProblemSolvingBg: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center opacity-40 group-hover:opacity-75 transition-opacity">
      <svg
        className="w-full h-full stroke-emerald-600 dark:stroke-emerald-400 fill-none"
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

        {/* Animated Floating Scatter Points */}
        <circle cx="45" cy="36" r="2.5" className="fill-emerald-600 dark:fill-emerald-400 animate-domain-float" style={{ animationDelay: '0s' }} />
        <circle cx="75" cy="32" r="2.5" className="fill-emerald-600 dark:fill-emerald-400 animate-domain-float-alt" style={{ animationDelay: '1.2s' }} />
        <circle cx="105" cy="24" r="3" className="fill-emerald-600 dark:fill-emerald-400 animate-domain-float" style={{ animationDelay: '2.5s' }} />
        <circle cx="130" cy="16" r="2.5" className="fill-emerald-600 dark:fill-emerald-400 animate-domain-pulse" style={{ transformOrigin: '130px 16px' }} />
        <circle cx="170" cy="18" r="2.5" className="fill-emerald-600 dark:fill-emerald-400 animate-domain-float" style={{ animationDelay: '0.8s' }} />
        <circle cx="195" cy="26" r="3" className="fill-emerald-600 dark:fill-emerald-400 animate-domain-float-alt" style={{ animationDelay: '1.8s' }} />
        <circle cx="225" cy="33" r="2.5" className="fill-emerald-600 dark:fill-emerald-400 animate-domain-float" style={{ animationDelay: '3.1s' }} />
        <circle cx="255" cy="38" r="2.5" className="fill-emerald-600 dark:fill-emerald-400 animate-domain-pulse" style={{ transformOrigin: '255px 38px' }} />

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
};

export default ProblemSolvingBg;
