"use client";

import { cn } from "@/lib/utils";

interface SectionCurveProps {
  /** CSS color or variable for the curve fill — should match the NEXT section's bg */
  fill?: string;
  /** Flip vertically for top-of-section usage */
  flip?: boolean;
  className?: string;
}

/**
 * Gentle concave curve placed between page sections
 * to create organic transitions instead of hard edges.
 */
export const SectionCurve = ({
  fill = "var(--bg-page)",
  flip = false,
  className,
}: SectionCurveProps) => (
  <div
    className={cn(
      "pointer-events-none -mb-px w-full overflow-hidden leading-[0]",
      flip && "rotate-180",
      className,
    )}
    aria-hidden
  >
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="block h-8 w-full md:h-12 lg:h-14"
    >
      <path
        d="M0,0 C480,58 960,58 1440,0 L1440,60 L0,60 Z"
        fill={fill}
      />
    </svg>
  </div>
);
