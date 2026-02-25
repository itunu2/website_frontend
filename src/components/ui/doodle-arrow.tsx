"use client";

import { cn } from "@/lib/utils";

interface DoodleArrowProps {
  variant?: number;
  annotation?: string;
  className?: string;
}

/**
 * Hand-drawn style arrow with long, sweeping curves.
 * Points toward content to guide the user's eye.
 * Based on the design reference: long arc, smooth curvature, pointed tip.
 */
export const DoodleArrow = ({
  variant = 1,
  annotation,
  className,
}: DoodleArrowProps) => {
  const arrow = ARROWS[variant] ?? ARROWS[1];

  return (
    <span className={cn("pointer-events-none select-none inline-flex flex-col items-center", className)} aria-hidden>
      <svg
        width={arrow.width}
        height={arrow.height}
        viewBox={arrow.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main curve */}
        <path
          d={arrow.curve}
          stroke="var(--accent-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Arrowhead */}
        <path
          d={arrow.head}
          stroke="var(--accent-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {annotation && (
        <span className="mt-1 block font-accent text-[16px] leading-tight text-accent-primary">
          {annotation}
        </span>
      )}
    </span>
  );
};

interface ArrowDef {
  width: number;
  height: number;
  viewBox: string;
  curve: string;
  head: string;
}

const ARROWS: Record<number, ArrowDef> = {
  // Sweep from upper-left → lower-right (hero "start here.")
  1: {
    width: 100,
    height: 80,
    viewBox: "0 0 100 80",
    curve: "M12 8 C18 4, 28 6, 38 16 C48 26, 52 42, 64 52 C72 58, 80 62, 88 60",
    head: "M80 54 L88 60 L82 68",
  },
  // Sweep from upper-right → lower-left (pointing down-left)
  2: {
    width: 100,
    height: 80,
    viewBox: "0 0 100 80",
    curve: "M88 8 C82 4, 72 6, 62 16 C52 26, 48 42, 36 52 C28 58, 20 62, 12 60",
    head: "M20 54 L12 60 L18 68",
  },
  // Short upward curve → right (pain points annotation)
  3: {
    width: 80,
    height: 60,
    viewBox: "0 0 80 60",
    curve: "M8 52 C12 42, 20 32, 32 28 C44 24, 56 28, 68 22",
    head: "M62 16 L68 22 L62 28",
  },
  // Dashed spiral intro (decorative, services section)
  4: {
    width: 120,
    height: 100,
    viewBox: "0 0 120 100",
    curve: "M20 8 C8 8, 4 20, 12 28 C20 36, 36 32, 40 24 C44 16, 36 8, 28 12 C20 16, 24 28, 36 36 C48 44, 64 48, 80 56 C90 62, 98 70, 106 78",
    head: "M98 74 L106 78 L100 86",
  },
  // Gentle downward arc (about section)
  5: {
    width: 80,
    height: 50,
    viewBox: "0 0 80 50",
    curve: "M8 12 C20 8, 36 16, 48 24 C56 30, 64 36, 72 38",
    head: "M66 32 L72 38 L66 44",
  },
  // Vertical sweep down (CTA pointing down)
  6: {
    width: 60,
    height: 80,
    viewBox: "0 0 60 80",
    curve: "M30 8 C24 16, 20 28, 22 40 C24 52, 30 60, 34 68",
    head: "M28 62 L34 68 L40 62",
  },
};
