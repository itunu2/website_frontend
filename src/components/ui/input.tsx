import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const baseStyles =
  "w-full rounded-xl border border-border-strong bg-bg-surface px-4 py-3 text-base text-text-primary transition-colors placeholder:text-text-tertiary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(baseStyles, error && "border-danger focus:border-danger", className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
