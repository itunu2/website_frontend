import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const baseStyles =
  "w-full rounded-xl border border-border-strong bg-bg-surface px-4 py-3 text-body text-text-primary transition-colors placeholder:text-text-tertiary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 disabled:cursor-not-allowed disabled:opacity-60 resize-y min-h-[120px]";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ error, className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(baseStyles, error && "border-danger focus:border-danger", className)}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
