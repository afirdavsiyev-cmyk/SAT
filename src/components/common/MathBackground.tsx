import React from 'react';
import { MathMatrixRain } from './MathMatrixRain';

export const MathBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 0. Ambient Slow Math Matrix Waterfall Canvas */}
      <MathMatrixRain fontSize={14} fps={22} />

      {/* 1. Glowing Ambient Orbs */}
      {/* Top-center Glow */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-70 bg-[radial-gradient(circle,rgba(251,146,60,0.16)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(16,185,129,0.14)_0%,rgba(6,78,59,0)_70%)]"
      />
      
      {/* Bottom-right Glow */}
      <div 
        className="absolute -bottom-40 -right-20 w-[700px] h-[600px] rounded-full blur-[140px] opacity-60 bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,transparent_75%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.09)_0%,rgba(15,23,42,0)_75%)]"
      />

      {/* Top-left Subtle Glow */}
      <div 
        className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-50 bg-[radial-gradient(circle,rgba(234,88,12,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(16,185,129,0.07)_0%,transparent_70%)]"
      />

      {/* 2. SVG Cartesian Coordinate Grid with Masking */}
      <div 
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23ea580c' stroke-width='0.75'/%3E%3C/svg%3E")`,
          maskImage: 'radial-gradient(circle at 50% 25%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 25%, black 20%, transparent 80%)'
        }}
      />

      {/* 3. Floating Math Geometry Wireframes & Curves (Hero Margins) */}
      
      {/* Left Margin: Floating Parabola & Axes */}
      <svg 
        className="absolute top-28 left-4 lg:left-12 w-64 h-64 text-orange-600/10 dark:text-emerald-400/10 animate-float" 
        viewBox="0 0 200 200" 
        fill="none"
      >
        <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 20 20 Q 100 180 180 20" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="3" fill="#ea580c" className="fill-orange-600 dark:fill-emerald-400" opacity="0.4" />
        <text x="105" y="95" fill="#ea580c" className="fill-orange-600 dark:fill-emerald-400" fontSize="10" opacity="0.3" fontFamily="monospace">(0,0)</text>
      </svg>

      {/* Right Margin: Floating Polyhedron Geometry Wireframe */}
      <svg 
        className="absolute top-36 right-4 lg:right-12 w-72 h-72 text-amber-600/10 dark:text-teal-400/10 animate-float"
        style={{ animationDelay: '2s' }}
        viewBox="0 0 200 200" 
        fill="none"
      >
        <polygon points="100,20 170,70 170,140 100,190 30,140 30,70" stroke="currentColor" strokeWidth="1.2" />
        <line x1="100" y1="20" x2="100" y2="190" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="30" y1="70" x2="170" y2="140" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="170" y1="70" x2="30" y2="140" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="105" r="4" fill="#f59e0b" className="fill-amber-500 dark:fill-teal-400" opacity="0.3" />
      </svg>

      {/* Mid-Page Floating Sine Wave */}
      <svg 
        className="absolute top-[65%] left-10 w-96 h-32 text-orange-600/5 dark:text-emerald-400/5 animate-pulse"
        viewBox="0 0 300 100" 
        fill="none"
      >
        <path d="M 0 50 Q 75 0 150 50 T 300 50" stroke="currentColor" strokeWidth="2" />
      </svg>

    </div>
  );
};
