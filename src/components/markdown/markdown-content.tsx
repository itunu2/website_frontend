import React, { type ComponentPropsWithoutRef, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { env } from "@/config/env";
import { cn } from "@/lib/cn";
import { CodeBlock } from "./code-block";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "./table";

export interface MarkdownContentProps {
  content?: string | null;
  className?: string;
}

const resolveMediaUrl = (url?: string | null): string => {
  if (!url) {
    return "";
  }
  if (url.startsWith("http")) {
    return url;
  }
  return `${env.client.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
};

const headingBase = "font-display text-text-primary tracking-tight";

const components = {
  h1: ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1 {...props} className={cn(headingBase, "text-4xl md:text-5xl mb-8 mt-10", className)} />
  ),
  h2: ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 {...props} className={cn(headingBase, "text-3xl md:text-4xl mb-6 mt-10", className)} />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 {...props} className={cn(headingBase, "text-2xl md:text-3xl mb-4 mt-8", className)} />
  ),
  h4: ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4 {...props} className={cn(headingBase, "text-xl md:text-2xl mb-3 mt-6", className)} />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p {...props} className={cn("mb-6 text-body leading-[1.8] text-text-secondary", className)} />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props} className={cn("my-6 ml-6 list-disc space-y-3 text-text-secondary marker:text-accent-primary", className)} />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol {...props} className={cn("my-6 ml-6 list-decimal space-y-3 text-text-secondary marker:text-accent-primary marker:font-semibold", className)} />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li {...props} className={cn("leading-[1.8] pl-2", className)} />
  ),
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      {...props}
      className={cn(
        "my-10 border-l-4 border-accent-primary bg-bg-elevated px-6 py-5 italic text-text-secondary rounded-r-lg",
        className,
      )}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr {...props} className="my-10 border-border-subtle" />
  ),
  strong: ({ className, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong {...props} className={cn("font-bold text-text-primary", className)} />
  ),
  em: ({ className, ...props }: ComponentPropsWithoutRef<"em">) => (
    <em {...props} className={cn("italic text-text-secondary", className)} />
  ),
  a: ({ className, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-medium text-accent-primary underline decoration-accent-primary/30 underline-offset-2",
        "transition-all duration-200 hover:decoration-accent-primary hover:text-accent-hover",
        className,
      )}
    />
  ),
  img: ({ src, className, ...props }: ComponentPropsWithoutRef<"img">) => {
    const resolvedSrc = typeof src === "string" ? resolveMediaUrl(src) : undefined;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        src={resolvedSrc}
        className={cn("my-10 w-full rounded-xl border border-border-subtle shadow-md", className)}
        alt={props.alt ?? ""}
        loading="lazy"
      />
    );
  },
  code: ({ inline, className: codeClassName, children, ...props }: { inline?: boolean; className?: string; children?: ReactNode }) =>
    inline ? (
      <code className={cn("rounded-md bg-bg-elevated px-1.5 py-0.5 text-sm font-mono", codeClassName)} {...props}>
        {children}
      </code>
    ) : (
      <CodeBlock>
        <code className="font-mono" {...props}>{children}</code>
      </CodeBlock>
    ),
  table: (props: ComponentPropsWithoutRef<"table">) => <Table {...props} />,
  thead: (props: ComponentPropsWithoutRef<"thead">) => <TableHead {...props} />,
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => <TableBody {...props} />,
  tr: (props: ComponentPropsWithoutRef<"tr">) => <TableRow {...props} />,
  th: (props: ComponentPropsWithoutRef<"th">) => <TableHeader {...props} />,
  td: (props: ComponentPropsWithoutRef<"td">) => <TableCell {...props} />,
} satisfies Components;

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className }) => {
  if (!content) {
    return null;
  }

  return (
    <div
      className={cn(
        "prose prose-lg max-w-none text-text-primary prose-headings:font-display",
        "prose-headings:text-text-primary prose-p:text-text-secondary prose-li:text-text-secondary",
        "prose-strong:text-text-primary prose-code:text-text-primary",
        "prose-a:text-accent-primary prose-a:underline hover:prose-a:no-underline",
        "prose-img:rounded-lg prose-img:shadow-md",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
