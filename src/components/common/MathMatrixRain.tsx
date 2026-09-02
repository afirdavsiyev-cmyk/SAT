import React, { useEffect, useRef } from 'react';

const MATH_CHARS = '0123456789+-×÷=≠≈√πθ∑∫∂∞%xyzn²³Δ∠';

interface MathMatrixRainProps {
  className?: string;
  fontSize?: number;
  fps?: number;
}

export const MathMatrixRain: React.FC<MathMatrixRainProps> = ({
  className = '',
  fontSize = 14,
  fps = 22,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;
    const fpsInterval = 1000 / fps;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let columns = Math.floor(width / fontSize);
    let drops: number[] = [];
    let speeds: number[] = [];

    const initGrid = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = [];
      speeds = [];

      for (let i = 0; i < columns; i++) {
        // Stagger drops across vertical height and above viewport
        drops[i] = Math.floor(Math.random() * -80);
        // Slower ambient speed (advance 0.28 to 0.48 rows per tick)
        speeds[i] = 0.28 + Math.random() * 0.20;
      }
    };

    initGrid();

    const handleResize = () => {
      initGrid();
    };

    window.addEventListener('resize', handleResize);

    const checkIsDark = () => document.documentElement.classList.contains('dark');
    let isDark = checkIsDark();

    const observer = new MutationObserver(() => {
      isDark = checkIsDark();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const draw = () => {
      // Trailing fade wipe layer
      ctx.globalAlpha = 1;
      ctx.fillStyle = isDark
        ? 'rgba(7, 11, 18, 0.12)'
        : 'rgba(250, 247, 242, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Defined, crisp typography
      ctx.font = isDark
        ? `14px "JetBrains Mono", "KaTeX_Main", monospace`
        : `500 13px "JetBrains Mono", "KaTeX_Main", monospace`;

      const screenCenter = width / 2;
      const centerZoneWidth = Math.min(width * 0.60, 800); // Center zone under headlines

      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const isCenterZone = Math.abs(x - screenCenter) < centerZoneWidth / 2;

        const char = MATH_CHARS[Math.floor(Math.random() * MATH_CHARS.length)];
        const rowPos = drops[i];
        const y = Math.floor(rowPos) * fontSize;

        if (y > 0 && y < height + fontSize * 2) {
          if (isDark) {
            // Dark Mode
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(110, 231, 183, 0.6)';
            ctx.globalAlpha = isCenterZone ? 0.65 : 1;
            ctx.fillStyle = '#a7f3d0'; // Glowing lead character
            ctx.fillText(char, x, y);

            // Stream drops
            ctx.shadowBlur = 0;
            ctx.globalAlpha = isCenterZone ? 0.35 : 0.65;
            ctx.fillStyle = isCenterZone ? '#10b981' : '#34d399';
          } else {
            // Light Mode: Soft warm amber glyphs with 0.06 subtle opacity (#ea580c / #d97706)
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 0.06;
            ctx.fillStyle = isCenterZone ? '#d97706' : '#ea580c';
            ctx.fillText(char, x, y);
          }
        }

        // Reset drop to top with randomized delay when it passes viewport bottom
        if (y > height && Math.random() > 0.985) {
          drops[i] = 0;
        }

        drops[i] += speeds[i];
      }
    };

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = currentTime - lastTime;
      if (elapsed > fpsInterval) {
        lastTime = currentTime - (elapsed % fpsInterval);
        draw();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [fontSize, fps]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 opacity-80 dark:opacity-30 select-none ${className}`}
    />
  );
};
