import React from 'react';
import { useApp } from '../../context/AppContext';
import { Boxes } from '../ui/background-boxes';
import { MathMatrixRain } from './MathMatrixRain';

export const MathBackground: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Light Ambient Glow Backdrop - Pure White with Soft Radiant Depth */}
      <div 
        className="absolute inset-0 pointer-events-none dark:hidden z-0 bg-white"
        style={{
          background: 'radial-gradient(120% 80% at 50% 15%, #FFFFFF 0%, rgba(240, 253, 250, 0.4) 45%, #FFFFFF 100%)',
        }}
        aria-hidden="true"
      />

      {/* 2. Softened Ambient Orbs - Airy Translucent Emerald & Sky Tones */}
      {/* Top-center Glow (Emerald Green) */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[130px] opacity-35 dark:opacity-70 bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(16,185,129,0.14)_0%,rgba(6,78,59,0)_70%)] pointer-events-none"
      />
      
      {/* Bottom-right Glow (Sky Blue) */}
      <div 
        className="absolute -bottom-40 -right-20 w-[700px] h-[600px] rounded-full blur-[140px] opacity-30 dark:opacity-60 bg-[radial-gradient(circle,rgba(2,132,199,0.07)_0%,transparent_75%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.09)_0%,rgba(15,23,42,0)_75%)] pointer-events-none"
      />

      {/* Top-right Ambient Aura (Sapphire Blue - Softened) */}
      <div 
        className="absolute -top-16 right-1/4 w-[650px] h-[500px] rounded-full blur-[140px] opacity-25 bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_70%)] dark:hidden pointer-events-none"
      />

      {/* Top-left Subtle Glow (Emerald Green - Softened) */}
      <div 
        className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25 dark:opacity-50 bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(16,185,129,0.07)_0%,transparent_70%)] pointer-events-none"
      />

      {/* 3. Bright Theme Background Boxes for non-landing views (Landing handles its own high-fidelity interactive Boxes in HeroSection) */}
      {currentView !== 'landing' && (
        <div className="dark:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 w-full h-full bg-white z-10 pointer-events-none"
            style={{
              maskImage: 'radial-gradient(ellipse at 50% 30%, transparent 15%, white 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, transparent 15%, white 80%)',
            }}
          />
          <Boxes />
        </div>
      )}

      {/* 4. Dark Theme Only: Ambient Slow Math Matrix Rain Canvas */}
      <div className="hidden dark:block">
        <MathMatrixRain fontSize={14} fps={22} />
      </div>

      {/* 5. Subtle Floating Math Geometry Wireframes & Curves (Hero Margins) */}
      {/* Left Margin: Floating Parabola & Axes (Emerald Green) */}
      <svg 
        className="absolute top-[520px] left-4 lg:left-12 w-64 h-64 text-emerald-600/10 dark:text-emerald-400/10 animate-float pointer-events-none" 
        viewBox="0 0 200 200" 
        fill="none"
      >
        <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 20 20 Q 100 180 180 20" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="3" fill="#059669" className="fill-emerald-600 dark:fill-emerald-400" opacity="0.3" />
        <text x="105" y="95" fill="#059669" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10" opacity="0.25" fontFamily="monospace">(0,0)</text>
      </svg>

      {/* Right Margin: Floating Polyhedron Geometry Wireframe - displayed in dark mode */}
      <svg 
        className="absolute top-36 right-4 lg:right-12 w-72 h-72 text-teal-600/10 dark:text-teal-400/15 animate-float hidden dark:block pointer-events-none" 
        style={{ animationDelay: '2s' }}
        viewBox="0 0 200 200" 
        fill="none"
      >
        <polygon points="100,20 170,70 170,140 100,190 30,140 30,70" stroke="currentColor" strokeWidth="1.2" />
        <line x1="100" y1="20" x2="100" y2="190" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="30" y1="70" x2="170" y2="140" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="170" y1="70" x2="30" y2="140" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="105" r="4" fill="#0d9488" className="fill-teal-500 dark:fill-teal-400" opacity="0.3" />
      </svg>

      {/* Mid-Page Floating Sine Wave */}
      <svg 
        className="absolute top-[65%] left-10 w-96 h-32 text-blue-500/8 dark:text-emerald-400/5 animate-pulse pointer-events-none" 
        viewBox="0 0 300 100" 
        fill="none"
      >
        <path d="M 0 50 Q 75 0 150 50 T 300 50" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default MathBackground;
