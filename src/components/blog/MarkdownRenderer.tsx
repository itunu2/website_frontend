"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 800, marginTop: "var(--space-7)", marginBottom: "var(--space-4)", lineHeight: 1.15 }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginTop: "var(--space-7)", marginBottom: "var(--space-4)", lineHeight: 1.2 }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginTop: "var(--space-6)", marginBottom: "var(--space-3)", lineHeight: 1.25 }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ fontSize: "var(--text-base)", lineHeight: 1.78, marginBottom: "var(--space-5)", color: "var(--text-default)", maxWidth: "68ch" }}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: "var(--space-5)", marginBottom: "var(--space-5)", display: "grid", gap: "var(--space-2)" }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ paddingLeft: "var(--space-5)", marginBottom: "var(--space-5)", display: "grid", gap: "var(--space-2)" }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ fontSize: "var(--text-base)", lineHeight: 1.72, color: "var(--text-default)" }}>
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "3px solid var(--accent-olive)",
                paddingLeft: "var(--space-5)",
                margin: "var(--space-6) 0",
                fontStyle: "italic",
                color: "var(--text-soft)",
              }}
            >
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                color: "var(--accent-olive)",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                textDecorationColor: "color-mix(in oklch, var(--accent-olive), transparent 60%)",
              }}
            >
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre
                  style={{
                    background: "var(--surface-ink)",
                    color: "var(--text-inverse)",
                    padding: "var(--space-5)",
                    borderRadius: "var(--radius-sm)",
                    overflow: "auto",
                    margin: "var(--space-5) 0",
                    fontSize: "0.88rem",
                    lineHeight: 1.65,
                  }}
                >
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code
                style={{
                  background: "var(--surface-soft)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: "0.9em",
                  fontWeight: 500,
                }}
              >
                {children}
              </code>
            );
          },
          hr: () => (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--border-soft)",
                margin: "var(--space-7) 0",
              }}
            />
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ""}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "var(--radius-sm)",
                margin: "var(--space-5) 0",
              }}
            />
          ),
          table: ({ children }) => (
            <div style={{ overflowX: "auto", margin: "var(--space-5) 0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-sm)" }}>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th style={{ textAlign: "left", padding: "var(--space-3) var(--space-4)", borderBottom: "2px solid var(--border-strong)", fontWeight: 700, fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--border-soft)" }}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
