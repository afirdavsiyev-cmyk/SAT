"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Pre-lit decorative boxes matching the Aceternity demo preview in Image 2
const INITIAL_COLORED_BOXES: Record<string, string> = {
  "28-17": "rgba(244, 63, 94, 0.70)",   // Rose / Pink
  "29-18": "rgba(168, 85, 247, 0.70)",  // Purple / Violet
  "30-17": "rgba(99, 102, 241, 0.65)",  // Indigo / Slate Blue
  "30-18": "rgba(14, 165, 233, 0.70)",  // Sky Blue
  "31-19": "rgba(16, 185, 129, 0.65)",  // Emerald Green
  "29-16": "rgba(245, 158, 11, 0.65)",  // Amber Gold
  "31-17": "rgba(6, 182, 212, 0.65)",   // Cyan
};

export const BoxesCore = ({ className, ...rest }: { className?: string; [key: string]: any }) => {
  // 60 rows x 40 cols centered layout gives edge-to-edge coverage while maintaining high-performance 60 FPS
  const rows = useMemo(() => new Array(60).fill(1), []);
  const cols = useMemo(() => new Array(40).fill(1), []);

  // Integrated vibrant palette matching Image 2 with ScoreUp brand tones
  const colors = useMemo(
    () => [
      "rgba(16, 185, 129, 0.75)",  // Emerald
      "rgba(14, 165, 233, 0.75)",  // Sky Blue
      "rgba(6, 182, 212, 0.75)",   // Cyan
      "rgba(168, 85, 247, 0.75)",  // Purple / Violet
      "rgba(244, 63, 94, 0.75)",   // Rose / Pink
      "rgba(245, 158, 11, 0.75)",  // Amber
      "rgba(99, 102, 241, 0.75)",  // Indigo
      "rgba(20, 184, 166, 0.75)",  // Teal
      "rgba(71, 85, 105, 0.65)",   // Slate
    ],
    []
  );

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-50%,-50%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 pointer-events-auto select-none",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`box-row-${i}`}
          className="w-16 h-8 border-l border-slate-300/80 dark:border-slate-800/80 relative flex-shrink-0"
        >
          {cols.map((_, j) => {
            const initialColor = INITIAL_COLORED_BOXES[`${i}-${j}`];
            return (
              <motion.div
                key={`box-col-${j}`}
                style={{
                  backgroundColor: initialColor || "transparent",
                }}
                whileHover={{
                  backgroundColor: getRandomColor(),
                  transition: { duration: 0 },
                }}
                animate={{
                  backgroundColor: initialColor || "transparent",
                  transition: { duration: 1.8 },
                }}
                className="w-16 h-8 border-r border-t border-slate-300/80 dark:border-slate-800/80 relative cursor-pointer"
              >
                {j % 2 === 1 && i % 2 === 1 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-400/80 dark:text-slate-700/60 stroke-[1px] pointer-events-none"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                ) : null}
              </motion.div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
export default Boxes;
