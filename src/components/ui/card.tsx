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
  disableHoverAnimation?: boolean;
}

export const Card = forwardRef<HTMLElement, CardProps>(
  ({ variant = "default", as: Component = "div", className, children, disableHoverAnimation = false, ...props }, ref) => {
    const MotionComponent = motion[Component as "div"];
    
    const isInteractive = variant === "interactive";
    const isElevated = variant === "elevated";
    
    // Smoother, more refined hover animations
    const getMotionProps = (): HTMLMotionProps<"div"> => {
      if (disableHoverAnimation) return {};
      
      if (isInteractive) {
        return {
          whileHover: { y: -4, scale: 1.005 },
          transition: { 
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8
          },
        };
      }
      
      if (isElevated) {
        return {
          whileHover: { y: -2 },
          transition: { 
            type: "spring",
            stiffness: 500,
            damping: 35,
            mass: 0.5
          },
        };
      }
      
      return {};
    };

    return (
      <MotionComponent
        ref={ref as any}
        className={cn(
          "rounded-xl p-6 md:p-8 transition-[box-shadow,border-color] duration-300 ease-out relative overflow-hidden",
          variantStyles[variant],
          className
        )}
        {...getMotionProps()}
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
