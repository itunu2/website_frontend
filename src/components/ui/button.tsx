"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ─── Design tokens ───────────────────────────────────────── */

const base =
  "relative inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-accent disabled:pointer-events-none disabled:opacity-50";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: [
    "bg-bg-dark text-white rounded-lg shadow-sm",
    "hover:-translate-y-0.5 hover:shadow-lg",
    "active:translate-y-0 active:shadow-xs",
  ].join(" "),
  secondary: [
    "rounded-lg border-[1.5px] border-text-primary/20 text-text-primary bg-transparent",
    "hover:bg-bg-dark hover:text-white hover:border-bg-dark hover:-translate-y-0.5 hover:shadow-md",
    "active:translate-y-0 active:shadow-xs",
  ].join(" "),
  accent: [
    "bg-accent-primary text-white rounded-lg shadow-sm",
    "hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-lg",
    "active:translate-y-0 active:shadow-xs",
  ].join(" "),
  ghost: [
    "rounded-lg text-text-secondary",
    "hover:text-accent-primary hover:bg-accent-subtle",
    "active:bg-accent-subtle/60",
  ].join(" "),
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-10 px-5 text-[0.8125rem] tracking-[0.01em]",
  md: "h-11 px-7 text-[0.875rem] tracking-[0.01em]",
  lg: "h-12 px-9 text-[0.9375rem] tracking-[0.01em]",
};

/* ─── Types ───────────────────────────────────────────────── */

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
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

/* ─── Component ───────────────────────────────────────────── */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className, href, children, ...props }, ref) => {
    const cls = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

    if (href) {
      return (
        <Link className={cls} href={href}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={cls} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export type { ButtonProps };
