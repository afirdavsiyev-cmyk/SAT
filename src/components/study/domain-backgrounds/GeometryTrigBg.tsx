import React from 'react';

export const GeometryTrigBg: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center opacity-40 group-hover:opacity-75 transition-opacity">
      <svg
        className="w-full h-full stroke-emerald-600 dark:stroke-emerald-400 fill-none"
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

        {/* Inscribed Circle & Triangle */}
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
          <path d="M239,35 A16,6 0 0,1 271,35" strokeDasharray="2 2" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};

export default GeometryTrigBg;
