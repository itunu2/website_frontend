"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Hand-drawn underline with animated stroke draw-in on scroll.
 * Uses stroke + dashoffset animation for a crafted reveal.
 */
const BRUSH_VARIANTS: Record<
  string,
  { path: string; path2?: string; viewBox: string; widthRatio: number; length: number; length2?: number }
> = {
  human: {
    viewBox: "0 0 200 18",
    path: "M2 12 C8 10, 18 5, 38 7 C58 9, 62 13, 85 10 C108 7, 118 4, 142 8 C166 12, 178 6, 198 9",
    path2: "M5 14 C25 11, 55 8, 90 11 C125 14, 155 7, 195 10",
    widthRatio: 1.1,
    length: 240,
    length2: 220,
  },
  convert: {
    viewBox: "0 0 180 18",
    path: "M2 11 C12 7, 28 14, 52 9 C76 4, 88 12, 115 8 C142 4, 158 10, 178 7",
    path2: "M6 13 C30 10, 60 7, 95 11 C130 15, 155 8, 175 10",
    widthRatio: 1.08,
    length: 210,
    length2: 195,
  },
  help: {
    viewBox: "0 0 110 18",
    path: "M2 11 C8 6, 22 14, 40 8 C58 2, 68 12, 85 7 C95 4, 102 10, 108 8",
    widthRatio: 1.14,
    length: 140,
  },
  rightPlace: {
    viewBox: "0 0 240 18",
    path: "M2 12 C15 6, 35 14, 65 8 C95 2, 110 13, 140 9 C170 5, 195 12, 220 7 C232 4, 236 10, 238 8",
    path2: "M8 14 C40 10, 80 6, 125 11 C170 16, 210 8, 235 10",
    widthRatio: 1.06,
    length: 280,
    length2: 260,
  },
  itunu: {
    viewBox: "0 0 100 18",
    path: "M2 11 C8 6, 18 14, 35 8 C52 2, 60 12, 78 7 C88 4, 94 10, 98 8",
    widthRatio: 1.16,
    length: 130,
  },
};

interface PaintedWordProps {
  variant: keyof typeof BRUSH_VARIANTS;
  children: ReactNode;
}

export const PaintedWord = ({ variant, children }: PaintedWordProps) => {
  const brush = BRUSH_VARIANTS[variant];
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  if (!brush) return <span>{children}</span>;

  return (
    <span ref={ref} className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <motion.svg
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        viewBox={brush.viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          width: `${brush.widthRatio * 100}%`,
          height: "0.32em",
          bottom: "-0.08em",
          position: "absolute",
        }}
      >
        {/* Primary stroke — thicker, more textured */}
        <motion.path
          d={brush.path}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ strokeDasharray: brush.length, strokeDashoffset: brush.length, opacity: 0 }}
          animate={
            isInView
              ? { strokeDashoffset: 0, opacity: 0.55 }
              : { strokeDashoffset: brush.length, opacity: 0 }
          }
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Secondary stroke — thinner, slightly offset, creates brush texture */}
        {brush.path2 && (
          <motion.path
            d={brush.path2}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: brush.length2 ?? brush.length, strokeDashoffset: brush.length2 ?? brush.length, opacity: 0 }}
            animate={
              isInView
                ? { strokeDashoffset: 0, opacity: 0.3 }
                : { strokeDashoffset: brush.length2 ?? brush.length, opacity: 0 }
            }
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </motion.svg>
    </span>
  );
};
