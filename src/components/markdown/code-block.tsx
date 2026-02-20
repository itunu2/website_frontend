"use client";

import { useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CodeBlockProps extends ComponentPropsWithoutRef<"pre"> {
  children?: ReactNode;
  className?: string;
}

export const CodeBlock = ({ children, className, ...props }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const extractTextContent = (node: ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractTextContent).join("");
    if (node && typeof node === "object" && "props" in node) {
      const element = node as { props: { children?: ReactNode } };
      return extractTextContent(element.props.children);
    }
    return "";
  };

  const handleCopy = async () => {
    const text = extractTextContent(children);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Silent fail - clipboard permission denied or not available
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="group/code relative my-8">
      <pre
        className={cn(
          "overflow-x-auto rounded-xl border border-border-subtle bg-bg-elevated p-6",
          "text-sm leading-relaxed shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "absolute right-3 top-3 rounded-lg border border-border-subtle bg-bg-surface px-3 py-1.5",
          "text-xs font-medium shadow-sm transition-all duration-200",
          "opacity-0 group-hover/code:opacity-100",
          "hover:border-accent-primary hover:bg-accent-primary hover:text-text-on-accent",
          "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
        )}
        aria-label={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <span className="flex items-center gap-1.5">
            <CheckIcon className="h-3.5 w-3.5" />
            Copied!
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <CopyIcon className="h-3.5 w-3.5" />
            Copy
          </span>
        )}
      </button>
    </div>
  );
};

const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
