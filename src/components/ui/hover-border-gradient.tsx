"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export interface HoverBorderGradientProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
  highlight?: string;
  innerMaskClassName?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export const HoverBorderGradient = React.forwardRef<HTMLElement, HoverBorderGradientProps>(
  function HoverBorderGradient(
    {
      children,
      containerClassName,
      className,
      as: Tag = "button",
      duration = 1,
      clockwise = true,
      highlight = "radial-gradient(75% 181.15942028985506% at 50% 50%, #10b981 0%, rgba(255, 255, 255, 0) 100%)",
      innerMaskClassName,
      ...props
    },
    ref
  ) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, rgba(16, 185, 129, 0.9) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, rgba(14, 165, 233, 0.9) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, rgba(16, 185, 129, 0.9) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.2% at 100% 50%, rgba(37, 99, 235, 0.9) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  useEffect(() => {
    if (hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);

  const elementProps: Record<string, any> = { ...props };
  if (Tag === "button" && !elementProps.type) {
    elementProps.type = "button";
  }

    return (
      <Tag
        ref={ref as any}
        onMouseEnter={(event: React.MouseEvent<HTMLElement>) => {
          setHovered(true);
          if (props.onMouseEnter) props.onMouseEnter(event);
        }}
        onMouseLeave={(event: React.MouseEvent<HTMLElement>) => {
          setHovered(false);
          if (props.onMouseLeave) props.onMouseLeave(event);
        }}
        className={cn(
          "relative inline-flex rounded-full border content-center bg-black/5 hover:bg-black/10 transition duration-500 dark:bg-white/10 dark:hover:bg-white/15 items-center flex-col flex-nowrap h-min justify-center overflow-hidden p-px decoration-clone border-slate-200/80 dark:border-white/10",
          containerClassName
        )}
        {...elementProps}
      >
        <div
          className={cn(
            "w-full text-slate-800 dark:text-white relative z-10 bg-transparent px-4 py-2 rounded-[inherit] transition-colors",
            className
          )}
        >
          {children}
        </div>
        <motion.div
          className={cn(
            "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit] pointer-events-none"
          )}
          style={{
            filter: "blur(2px)",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: hovered ? 1 : 0,
            background: hovered
              ? [movingMap[direction], highlight]
              : movingMap[direction],
          }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        />
        <div
          className={cn(
            "bg-white dark:bg-[#070b12] absolute z-[1] flex-none inset-[1.5px] rounded-[inherit] pointer-events-none transition-colors",
            innerMaskClassName
          )}
        />
      </Tag>
    );
  }
);
HoverBorderGradient.displayName = "HoverBorderGradient";
