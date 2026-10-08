import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface MoonSpotlightProps {
  className?: string;
}

const HeroMoonSpotlightComponent: React.FC<MoonSpotlightProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Shoulder pivot socket at astronaut's right arm joint
  const SHOULDER_X = 148;
  const SHOULDER_Y = 204;

  const containerRef = useRef<HTMLDivElement>(null);
  const armGroupRef = useRef<SVGGElement>(null);
  const shoulderSocketRef = useRef<SVGCircleElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const containerRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  // Angle and position tracking refs for continuous buttery-smooth interpolation
  const currentAngleRef = useRef(18); // Default rest angle pointing smoothly towards headline
  const targetAngleRef = useRef(18);
  const targetPosRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth * 0.55 : 600, y: 350 });
  const currentGlowPosRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth * 0.55 : 600, y: 350 });

  useEffect(() => {
    let animId: number | null = null;
    let isLoopRunning = false;
    let isVisible = !document.hidden;
    let isIntersecting = true;

    // Cache container rect on resize/scroll to avoid layout thrashing (getBoundingClientRect) on mousemove
    const updateContainerRect = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        containerRectRef.current = {
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
        };
      }
    };

    // Shortest angular path difference (O(1), immune to infinite loops at backward 180° boundary)
    const shortestAngleDiff = (target: number, current: number) => {
      let diff = (target - current) % 360;
      if (diff < -180) diff += 360;
      else if (diff > 180) diff -= 360;
      return diff;
    };

    const wakeUpLoop = () => {
      if (!isLoopRunning && isVisible && isIntersecting) {
        isLoopRunning = true;
        animId = requestAnimationFrame(renderLoop);
      }
    };

    const updateTargetFromCoord = (clientX: number, clientY: number) => {
      targetPosRef.current = { x: clientX, y: clientY };

      let rect = containerRectRef.current;
      if (!rect) {
        updateContainerRect();
        rect = containerRectRef.current;
      }
      if (!rect) return;

      // Calculate shoulder joint coordinates from container rect and fixed SVG proportions
      const originX = rect.left + (SHOULDER_X / 360) * rect.width;
      const originY = rect.top + (SHOULDER_Y / 360) * rect.height;

      const dx = clientX - originX;
      const dy = clientY - originY;
      const dist = Math.hypot(dx, dy);

      // Deadzone only when cursor is right at the shoulder pivot (< 10px)
      if (dist > 10) {
        // Full 360-degree rotation: flashlight spins to follow cursor everywhere, including behind the cosmonaut
        targetAngleRef.current = (Math.atan2(dy, dx) * 180) / Math.PI;
      }

      wakeUpLoop();
    };

    const onMouseMove = (e: MouseEvent) => {
      updateTargetFromCoord(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        updateTargetFromCoord(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    // Physics render loop with smooth inertia damping and automatic idle sleep
    const renderLoop = () => {
      if (!isVisible || !isIntersecting) {
        isLoopRunning = false;
        return;
      }

      // 1. Smoothly interpolate arm angle
      const angleDiff = shortestAngleDiff(targetAngleRef.current, currentAngleRef.current);
      currentAngleRef.current += angleDiff * 0.085;

      // Keep angle bounded within [-360, 360] to prevent overflow, without any singularity at ±180°
      if (currentAngleRef.current > 360) currentAngleRef.current -= 360;
      else if (currentAngleRef.current < -360) currentAngleRef.current += 360;

      if (armGroupRef.current) {
        const deg = currentAngleRef.current.toFixed(2);
        armGroupRef.current.style.transform = `rotate(${deg}deg)`;
        armGroupRef.current.setAttribute('transform', `rotate(${deg}, ${SHOULDER_X}, ${SHOULDER_Y})`);
      }

      // 2. Smoothly interpolate ambient spotlight glow on GPU
      const glowDiffX = targetPosRef.current.x - currentGlowPosRef.current.x;
      const glowDiffY = targetPosRef.current.y - currentGlowPosRef.current.y;
      currentGlowPosRef.current.x += glowDiffX * 0.12;
      currentGlowPosRef.current.y += glowDiffY * 0.12;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentGlowPosRef.current.x.toFixed(1)}px, ${currentGlowPosRef.current.y.toFixed(1)}px, 0)`;
      }

      // Automatic idle detection: when rotation and glow have settled, sleep loop to save 100% CPU
      const isSettled = Math.abs(angleDiff) < 0.03 && Math.abs(glowDiffX) < 0.25 && Math.abs(glowDiffY) < 0.25;
      if (isSettled) {
        isLoopRunning = false;
        animId = null;
        return;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    // Pause when browser tab is hidden
    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        updateContainerRect();
        wakeUpLoop();
      } else if (animId) {
        cancelAnimationFrame(animId);
        isLoopRunning = false;
      }
    };

    // Pause when Hero section is scrolled out of viewport
    let observer: IntersectionObserver | null = null;
    if (containerRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            updateContainerRect();
            wakeUpLoop();
          } else if (animId) {
            cancelAnimationFrame(animId);
            isLoopRunning = false;
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    // Cache initial container bounds
    updateContainerRect();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('resize', updateContainerRect, { passive: true });
    window.addEventListener('scroll', updateContainerRect, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Initial render tick
    wakeUpLoop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchMove);
      window.removeEventListener('resize', updateContainerRect);
      window.removeEventListener('scroll', updateContainerRect);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (observer) observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      isLoopRunning = false;
    };
  }, [isDark]);

  return (
    <>
      {/* ─── Cursor Spotlight Ambient Reveal Effect (GPU-accelerated) ───── */}
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[550px] h-[550px] -ml-[275px] -mt-[275px] rounded-full pointer-events-none z-10 will-change-transform"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(16,185,129,0.09) 0%, rgba(16,185,129,0.03) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 45%, transparent 70%)',
          transform: `translate3d(${currentGlowPosRef.current.x}px, ${currentGlowPosRef.current.y}px, 0)`,
        }}
        aria-hidden="true"
      />

      {/* ─── Hanging Chunky Moon & Chibi Astronaut Assembly ─────────────── */}
      <div ref={containerRef} className={`relative select-none pointer-events-none w-52 h-52 sm:w-64 sm:h-64 ${className}`}>
        <svg
          viewBox="0 0 360 360"
          className="w-full h-full overflow-visible pointer-events-none"
          style={{ overflow: 'visible' }}
          aria-label="ScoreUp Chibi Cosmonaut Moon Mascot"
        >
          <defs>
            {/* Volumetric Beam Linear Gradient */}
            <linearGradient id="astroBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity={isDark ? "0.55" : "0.35"} />
              <stop offset="35%" stopColor="#10B981" stopOpacity={isDark ? "0.22" : "0.15"} />
              <stop offset="70%" stopColor="#10B981" stopOpacity={isDark ? "0.06" : "0.04"} />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>

            {/* Core Intense Beam */}
            <linearGradient id="astroCoreBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? "#D1FAE5" : "#10B981"} stopOpacity={isDark ? "0.85" : "0.6"} />
              <stop offset="25%" stopColor="#10B981" stopOpacity={isDark ? "0.4" : "0.25"} />
              <stop offset="65%" stopColor="#10B981" stopOpacity={isDark ? "0.12" : "0.08"} />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>

            {/* Light Mode Buttery Yellow Moon Surface Gradient */}
            <linearGradient id="moonBodyGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FED766" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Dark Mode Glowing Emerald-Cyan Moon Gradient */}
            <linearGradient id="moonBodyGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="45%" stopColor="#059669" />
              <stop offset="100%" stopColor="#022C22" />
            </linearGradient>

            {/* Lens Glow Filter */}
            <filter id="lensGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>
          </defs>

          {/* Gentle Pendulum Sway Assembly */}
          <g className="animate-moon-swing" style={{ transformOrigin: '199px 0px' }}>

            {/* ── 1. Vertical Black Suspension Cables ──────────────────────── */}
            {/* Left Cable dropping from top navbar to top horn */}
            <line
              x1="108"
              y1="0"
              x2="108"
              y2="100"
              stroke="#1A1A1A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Right Cable dropping from top navbar to moon top crest (safely behind flashlight beam) */}
            <line
              x1="184"
              y1="0"
              x2="184"
              y2="66"
              stroke="#1A1A1A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* ── 2. Background Space Sparkles / Star Dots ─────────────────── */}
            <g opacity="0.8">
              <circle cx="45" cy="80" r="2.5" fill="#FFFFFF" className="animate-pulse" />
              <circle cx="320" cy="95" r="3" fill="#FFFFFF" className="animate-pulse" />
              <circle cx="35" cy="190" r="2" fill="#FFFFFF" opacity="0.6" />
              <circle cx="280" cy="275" r="2.5" fill="#FFFFFF" opacity="0.75" />
              <path
                d="M 330,165 L 332,170 L 337,172 L 332,174 L 330,179 L 328,174 L 323,172 L 328,170 Z"
                fill="#FFFFFF"
                opacity="0.85"
                className="animate-pulse"
              />
              <path
                d="M 40,140 L 41.5,144 L 46,145.5 L 41.5,147 L 40,151 L 38.5,147 L 34,145.5 L 38.5,144 Z"
                fill="#FFFFFF"
                opacity="0.8"
                className="animate-pulse"
              />
            </g>

            {/* ── 3. Crescent Moon Body & Shading ──────────────────────────── */}
            <g id="crescent-moon">
              {/* Outer Golden Amber Moon Body */}
              <path
                d="M 184,65 
                   C 145,65 105,85 80,125 
                   C 48,172 50,238 85,282 
                   C 122,326 195,330 250,298 
                   C 290,270 308,225 306,176 
                   C 300,205 275,245 240,268 
                   C 195,292 145,275 120,240 
                   C 98,205 105,155 125,118 
                   C 138,95 160,75 184,65 Z"
                fill={isDark ? 'url(#moonBodyGradDark)' : 'url(#moonBodyGradLight)'}
                stroke="#1A1A1A"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Inner Rim Creamy Highlight Band */}
              <path
                d="M 184,65 
                   C 160,75 138,95 125,118 
                   C 105,155 98,205 120,240 
                   C 145,275 195,292 240,268 
                   C 275,245 300,205 306,176 
                   C 290,208 262,238 225,255 
                   C 182,272 142,250 122,212 
                   C 108,175 118,128 144,98 
                   C 158,82 170,72 184,65 Z"
                fill={isDark ? '#34D399' : '#FEF3C7'}
                opacity={isDark ? '0.4' : '0.85'}
              />
              {/* Contour separation line */}
              <path
                d="M 184,65 
                   C 170,72 158,82 144,98 
                   C 118,128 108,175 122,212 
                   C 142,250 182,272 225,255 
                   C 262,238 290,208 306,176"
                stroke="#1A1A1A"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Top Horn Twin Black Stripes */}
              <path d="M 94,92 C 108,102 125,108 138,105" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 86,104 C 100,114 118,120 132,117" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" fill="none" />

              {/* Right Horn Twin Black Stripes */}
              <path d="M 280,202 C 288,214 298,218 305,214" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 270,214 C 278,226 288,230 297,226" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </g>

            {/* ── 4. Chibi Cosmonaut Character (Exact Reference Replica) ───── */}
            <g id="chibi-astronaut">

              {/* Left Arm Resting on the Right Moon Horn */}
              <g id="left-arm">
                {/* Arm sleeve */}
                <path
                  d="M 232,208 C 252,214 268,218 280,214"
                  stroke="#FFFFFF"
                  strokeWidth="16"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 232,208 C 252,214 268,218 280,214"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Glove resting over horn rim */}
                <circle cx="282" cy="214" r="9" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="4" />
                {/* Fingers gripping moon */}
                <path d="M 276,208 C 280,203 286,204 288,210" stroke="#1A1A1A" strokeWidth="3.5" fill="#FFFFFF" strokeLinecap="round" />
                <path d="M 283,210 C 290,208 293,214 290,220" stroke="#1A1A1A" strokeWidth="3.5" fill="#FFFFFF" strokeLinecap="round" />
                <path d="M 280,218 C 286,218 288,224 283,227" stroke="#1A1A1A" strokeWidth="3.5" fill="#FFFFFF" strokeLinecap="round" />
              </g>

              {/* Plump Suit Torso */}
              <path
                d="M 155,200 
                   C 145,215 148,255 175,262 
                   C 200,266 230,262 240,225 
                   C 242,205 235,198 220,195 Z"
                fill="#FFFFFF"
                stroke="#1A1A1A"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              {/* Soft grey shadow on suit flank */}
              <path
                d="M 156,215 C 150,235 156,255 178,262 C 168,255 164,235 168,215 Z"
                fill="#E2E8F0"
              />

              {/* Sitting Legs & Forward-Dangling Boots (Reference Style) */}
              <g id="sitting-legs">
                {/* Left Leg (viewer's left) */}
                <path
                  d="M 165,248 C 155,255 155,275 175,278 C 190,278 195,265 190,250 Z"
                  fill="#FFFFFF"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                {/* Ankle cuff */}
                <rect x="162" y="274" width="22" height="9" rx="3" fill="#E2E8F0" stroke="#1A1A1A" strokeWidth="3.5" />
                {/* Boot */}
                <path
                  d="M 158,284 C 158,278 190,278 194,284 C 196,295 194,308 178,308 C 160,308 158,298 158,284 Z"
                  fill="#FFFFFF"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                {/* Grey sole tread */}
                <path
                  d="M 158,298 C 162,306 186,306 192,298"
                  stroke="#1A1A1A"
                  strokeWidth="3.5"
                  fill="#94A3B8"
                />

                {/* Right Leg (viewer's right) */}
                <path
                  d="M 198,250 C 196,265 202,278 218,276 C 234,274 235,258 226,248 Z"
                  fill="#FFFFFF"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                {/* Ankle cuff */}
                <rect x="204" y="273" width="22" height="9" rx="3" fill="#E2E8F0" stroke="#1A1A1A" strokeWidth="3.5" />
                {/* Boot */}
                <path
                  d="M 200,283 C 200,277 232,277 238,283 C 242,295 238,308 222,308 C 204,308 200,296 200,283 Z"
                  fill="#FFFFFF"
                  stroke="#1A1A1A"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                {/* Grey sole tread */}
                <path
                  d="M 200,297 C 204,305 228,305 236,297"
                  stroke="#1A1A1A"
                  strokeWidth="3.5"
                  fill="#94A3B8"
                />
              </g>

              {/* Waistband with vertical lines */}
              <rect x="182" y="242" width="36" height="9" rx="3" fill="#E2E8F0" stroke="#1A1A1A" strokeWidth="3" />
              <line x1="194" y1="243" x2="194" y2="250" stroke="#1A1A1A" strokeWidth="2" />
              <line x1="206" y1="243" x2="206" y2="250" stroke="#1A1A1A" strokeWidth="2" />

              {/* Chest Control Box */}
              <rect
                x="184"
                y="212"
                width="32"
                height="28"
                rx="6"
                fill="#FFFFFF"
                stroke="#1A1A1A"
                strokeWidth="4"
              />
              {/* Red circular button */}
              <circle cx="204" cy="220" r="5" fill="#EF4444" stroke="#1A1A1A" strokeWidth="2" />
              <circle cx="202.5" cy="218.5" r="1.5" fill="#FFFFFF" />
              {/* Green rectangular button */}
              <rect x="190" y="226" width="13" height="8" rx="2" fill="#10B981" stroke="#1A1A1A" strokeWidth="2" />

              {/* Ribbed Accordion Neck Hose / Collar */}
              <path
                d="M 162,192 C 172,198 215,198 226,190"
                stroke="#FFFFFF"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 162,192 C 172,198 215,198 226,190"
                stroke="#1A1A1A"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <line x1="174" y1="187" x2="173" y2="198" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
              <line x1="188" y1="189" x2="188" y2="200" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
              <line x1="202" y1="189" x2="202" y2="200" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
              <line x1="215" y1="186" x2="216" y2="197" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />

              {/* Curved Corrugated Shoulder Straps */}
              <path d="M 152,198 C 154,188 165,192 168,206" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M 152,198 C 154,188 165,192 168,206" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 226,204 C 230,192 242,196 244,212" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M 226,204 C 230,192 242,196 244,212" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Large Oversized Spherical Helmet */}
              {/* Helmet Shell */}
              <ellipse
                cx="195"
                cy="148"
                rx="55"
                ry="53"
                fill="#FFFFFF"
                stroke="#1A1A1A"
                strokeWidth="5"
              />

              {/* Left Ear Audio Pod */}
              <rect x="135" y="132" width="16" height="34" rx="8" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="4.5" />
              <line x1="143" y1="140" x2="143" y2="158" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />

              {/* Right Ear Audio Pod */}
              <rect x="240" y="130" width="15" height="32" rx="7.5" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="4.5" />
              <line x1="247" y1="138" x2="247" y2="154" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />

              {/* Outer Visor Grey Rim Bezel */}
              <ellipse
                cx="198"
                cy="149"
                rx="46"
                ry="43"
                fill="#E2E8F0"
                stroke="#1A1A1A"
                strokeWidth="4"
              />

              {/* Dark Charcoal Reflective Visor */}
              <ellipse
                cx="199"
                cy="149"
                rx="42"
                ry="39"
                fill="#1C1D21"
                stroke="#1A1A1A"
                strokeWidth="2"
              />

              {/* Visor Gloss Reflections (Exact Reference Replica) */}
              {/* Upper-Left Crescent Gloss */}
              <path
                d="M 168,136 
                   C 170,122 182,116 198,116 
                   C 214,116 226,124 231,135 
                   C 222,126 210,121 198,121 
                   C 184,121 174,126 168,136 Z"
                fill="#FFFFFF"
                opacity="0.38"
              />

              {/* Lower-Right Signature Glossy Pill Reflection */}
              <ellipse
                cx="224"
                cy="164"
                rx="7.5"
                ry="13"
                transform="rotate(-30, 224, 164)"
                fill="#FFFFFF"
                opacity="0.9"
              />
              {/* Secondary circular spot */}
              <circle cx="235" cy="176" r="4.5" fill="#FFFFFF" opacity="0.9" />
              {/* Subtle bottom edge reflection line */}
              <path
                d="M 204,182 C 218,183 230,178 236,170"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.3"
              />
            </g>

            {/* Invisible Shoulder Anchor for coordinate measurement */}
            <circle
              ref={shoulderSocketRef}
              cx={SHOULDER_X}
              cy={SHOULDER_Y}
              r="1"
              opacity="0"
              pointerEvents="none"
            />

            {/* ── 5. Dynamic Flashlight Interactive Arm (Viewer's Left) ─────── */}
            <g
              ref={armGroupRef}
              transform={`rotate(18, ${SHOULDER_X}, ${SHOULDER_Y})`}
              style={{
                transformOrigin: `${SHOULDER_X}px ${SHOULDER_Y}px`,
                transformBox: 'view-box',
                transform: 'rotate(18deg)',
                willChange: 'transform',
              }}
            >
              {/* Padded white astronaut arm sleeve connecting to glove */}
              <path
                d={`M ${SHOULDER_X} ${SHOULDER_Y - 10} 
                   L ${SHOULDER_X + 22} ${SHOULDER_Y - 7} 
                   L ${SHOULDER_X + 22} ${SHOULDER_Y + 11} 
                   L ${SHOULDER_X} ${SHOULDER_Y + 10} Z`}
                fill="#FFFFFF"
                stroke="#1A1A1A"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Sleeve crease */}
              <line
                x1={SHOULDER_X + 10}
                y1={SHOULDER_Y - 6}
                x2={SHOULDER_X + 11}
                y2={SHOULDER_Y + 10}
                stroke="#CBD5E1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Round Circular Shoulder Joint Ball (Centered at Pivot SHOULDER_X, SHOULDER_Y) */}
              <circle
                cx={SHOULDER_X}
                cy={SHOULDER_Y}
                r="13"
                fill="#FFFFFF"
                stroke="#1A1A1A"
                strokeWidth="4.5"
              />
              {/* Soft contour shading inside circular shoulder */}
              <path
                d={`M ${SHOULDER_X - 8} ${SHOULDER_Y + 4} A 9 9 0 0 0 ${SHOULDER_X + 5} ${SHOULDER_Y + 8}`}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* White astronaut glove */}
              <circle
                cx={SHOULDER_X + 26}
                cy={SHOULDER_Y + 3}
                r="8"
                fill="#FFFFFF"
                stroke="#1A1A1A"
                strokeWidth="3.5"
              />
              <path
                d={`M ${SHOULDER_X + 24} ${SHOULDER_Y - 2} C ${SHOULDER_X + 28} ${SHOULDER_Y - 4} ${SHOULDER_X + 32} ${SHOULDER_Y} ${SHOULDER_X + 30} ${SHOULDER_Y + 4}`}
                stroke="#1A1A1A"
                strokeWidth="3"
                fill="#FFFFFF"
                strokeLinecap="round"
              />

              {/* Flashlight Lantern Tool */}
              <path
                d={`M ${SHOULDER_X + 28} ${SHOULDER_Y - 4} 
                   L ${SHOULDER_X + 44} ${SHOULDER_Y - 7} 
                   L ${SHOULDER_X + 48} ${SHOULDER_Y - 9} 
                   L ${SHOULDER_X + 48} ${SHOULDER_Y + 13} 
                   L ${SHOULDER_X + 44} ${SHOULDER_Y + 11} 
                   L ${SHOULDER_X + 28} ${SHOULDER_Y + 8} Z`}
                fill="#1E293B"
                stroke="#1A1A1A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Glowing Yellow Lens Ring directly at nozzle tip (SHOULDER_X + 48) */}
              <ellipse
                cx={SHOULDER_X + 48}
                cy={SHOULDER_Y + 2}
                rx="2"
                ry="11"
                fill="#FDE047"
                stroke="#F59E0B"
                strokeWidth="1.5"
              />

              {/* Lens Flare Glow */}
              <circle
                cx={SHOULDER_X + 48}
                cy={SHOULDER_Y + 2}
                r="7"
                fill={isDark ? '#10B981' : '#F59E0B'}
                opacity="0.85"
                filter="url(#lensGlow)"
              />
              <circle cx={SHOULDER_X + 48} cy={SHOULDER_Y + 2} r="2.5" fill="#FFFFFF" opacity="0.95" />

              {/* Volumetric Light Cone directly from Lens Ring (0px gap) */}
              <polygon
                points={`${SHOULDER_X + 48},${SHOULDER_Y - 9} ${SHOULDER_X + 48},${SHOULDER_Y + 13} 950,${SHOULDER_Y + 175} 950,${SHOULDER_Y - 110}`}
                fill="url(#astroBeamGrad)"
                className="pointer-events-none"
              />

              {/* Focused Core Beam */}
              <polygon
                points={`${SHOULDER_X + 48},${SHOULDER_Y - 3} ${SHOULDER_X + 48},${SHOULDER_Y + 7} 850,${SHOULDER_Y + 65} 850,${SHOULDER_Y - 45}`}
                fill="url(#astroCoreBeamGrad)"
                className="pointer-events-none"
              />
            </g>

          </g>
        </svg>
      </div>
    </>
  );
};

export const HeroMoonSpotlight = React.memo(HeroMoonSpotlightComponent);
export default HeroMoonSpotlight;
