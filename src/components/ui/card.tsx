"use client";

import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const variantStyles = {
  default: "bg-bg-surface border border-border-default shadow-sm hover:shadow-md backdrop-blur-sm",
  elevated: "bg-bg-surface shadow-md hover:shadow-xl backdrop-blur-md",
  flat: "bg-bg-elevated hover:bg-bg-surface transition-colors",
  interactive: "bg-bg-surface border border-border-default shadow-md hover:shadow-xl hover:border-accent-primary cursor-pointer backdrop-blur-sm group",
  glass: "bg-bg-surface/80 backdrop-blur-xl border border-border-subtle shadow-lg hover:shadow-xl",
} as const;

interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: keyof typeof variantStyles;
  as?: "div" | "article" | "section" | "blockquote";
}

export const Card = forwardRef<HTMLElement, CardProps>(
  ({ variant = "default", as: Component = "div", className, children, ...props }, ref) => {
    const MotionComponent = motion[Component as "div"];
    
    const isInteractive = variant === "interactive";
    
    const motionProps: HTMLMotionProps<"div"> = isInteractive
      ? {
          whileHover: { y: -6, scale: 1.01 },
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        }
      : {};

    return (
      <MotionComponent
        ref={ref as any}
        className={cn(
          "rounded-xl p-6 md:p-8 transition-[box-shadow,border-color] duration-300 ease-out relative overflow-hidden",
          variantStyles[variant],
          className
        )}
        {...motionProps}
        {...(props as any)}
      >
        {/* Subtle gradient overlay for depth */}
        {variant === "glass" && (
          <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </MotionComponent>
    );
  },
);

Card.displayName = "Card";
