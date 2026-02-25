import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends PropsWithChildren {
  className?: string;
  /** @deprecated Ignored — single width container. Kept for backward compat. */
  size?: string;
}

/**
 * Single-width container — 1100px max, consistent padding.
 * Override with className when needed (e.g. max-w-3xl for narrow sections).
 */
export const Container = ({ className, children }: ContainerProps) => (
  <div className={cn("mx-auto w-full max-w-[1100px] px-6 md:px-8", className)}>
    {children}
  </div>
);
