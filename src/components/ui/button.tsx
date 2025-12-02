"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const baseStyles =
  "relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-accent disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent-primary text-white shadow-md hover:bg-accent-hover hover:shadow-xl active:shadow-sm",
  secondary:
    "border-2 border-border-strong bg-transparent text-text-primary shadow-sm hover:border-accent-primary hover:text-accent-primary hover:shadow-md hover:bg-accent-primary/5 active:shadow-sm",
  ghost: "text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 active:bg-accent-primary/10",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-6 py-3 text-body-sm",
  md: "px-8 py-3.5 text-body",
  lg: "px-10 py-4 text-body-lg",
};

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

interface ButtonAsLinkProps extends BaseButtonProps {
  href: string;
  asChild?: false;
}

interface ButtonStandardProps extends BaseButtonProps {
  href?: undefined;
}

type ButtonProps = ButtonStandardProps | ButtonAsLinkProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className, href, children, ...props }, ref) => {
    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && "w-full",
      className,
    );

    if (href) {
      return (
        <Link 
          className={combinedClassName} 
          href={href}
        >
          {children}
        </Link>
      );
    }

    return (
      <button 
        ref={ref} 
        className={combinedClassName} 
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export type { ButtonProps };
