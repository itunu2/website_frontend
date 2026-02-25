import { type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  problem:
    "border border-danger/40 text-danger bg-danger/5",
  neutral:
    "border border-border-default text-text-secondary bg-bg-subtle",
  accent:
    "border border-accent-primary/40 text-accent-primary bg-accent-subtle",
} as const;

interface ChipProps {
  variant?: keyof typeof variantStyles;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export const Chip = ({
  variant = "neutral",
  className,
  style,
  children,
}: ChipProps) => {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] leading-none",
        variantStyles[variant],
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
};
