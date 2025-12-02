import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ProseProps = HTMLAttributes<HTMLDivElement>;

export const Prose = forwardRef<HTMLDivElement, ProseProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "prose prose-neutral max-w-none",
        // Base typography
        "text-body text-text-primary leading-relaxed",
        // Headings
        "prose-headings:font-display prose-headings:font-semibold prose-headings:text-text-primary",
        "prose-h1:text-h1 prose-h1:mb-6 prose-h1:mt-8",
        "prose-h2:text-h2 prose-h2:mb-4 prose-h2:mt-8",
        "prose-h3:text-h3 prose-h3:mb-3 prose-h3:mt-6",
        "prose-h4:text-h4 prose-h4:mb-2 prose-h4:mt-4",
        // Paragraphs
        "prose-p:mb-4 prose-p:max-w-[65ch]",
        // Links
        "prose-a:text-accent-primary prose-a:no-underline prose-a:transition-colors hover:prose-a:text-accent-strong",
        // Lists
        "prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6",
        "prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6",
        "prose-li:mb-2 prose-li:text-text-primary",
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-accent-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-text-muted prose-blockquote:my-6",
        // Code
        "prose-code:rounded prose-code:bg-bg-soft prose-code:px-1.5 prose-code:py-0.5 prose-code:text-body-sm prose-code:font-mono prose-code:text-accent-strong prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:rounded-xl prose-pre:bg-bg-elevated prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-6",
        "prose-pre:border prose-pre:border-border-subtle",
        // Images
        "prose-img:rounded-xl prose-img:my-8 prose-img:shadow-soft",
        // Horizontal rules
        "prose-hr:border-border-subtle prose-hr:my-8",
        // Strong and emphasis
        "prose-strong:font-semibold prose-strong:text-text-primary",
        "prose-em:italic prose-em:text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Prose.displayName = "Prose";
