"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { env } from "@/config/env";

function resolveImgUrl(src: string | Blob | undefined): string {
  if (!src || typeof src !== "string") return "";
  if (src.startsWith("http") || src.startsWith("//")) return src;
  return `${env.client.NEXT_PUBLIC_STRAPI_BASE_URL}${src}`;
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // ── Headings ────────────────────────────────────────────────────────
          h1: ({ children }) => (
            <h1
              style={{
                fontSize: "var(--text-2xl)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "var(--text-strong)",
                marginTop: "var(--space-9)",
                marginBottom: "var(--space-5)",
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                lineHeight: 1.18,
                color: "var(--text-strong)",
                marginTop: "var(--space-8)",
                marginBottom: "var(--space-4)",
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                lineHeight: 1.25,
                color: "var(--text-strong)",
                marginTop: "var(--space-7)",
                marginBottom: "var(--space-3)",
              }}
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                lineHeight: 1.3,
                color: "var(--text-strong)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: "var(--space-6)",
                marginBottom: "var(--space-2)",
              }}
            >
              {children}
            </h4>
          ),

          // ── Body text ────────────────────────────────────────────────────────
          p: ({ children }) => (
            <p
              style={{
                fontSize: "var(--text-base)",
                lineHeight: 1.82,
                color: "var(--text-default)",
                marginBottom: "var(--space-5)",
              }}
            >
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: 700, color: "var(--text-strong)" }}>
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em
              style={{
                fontStyle: "italic",
                color: "color-mix(in oklch, var(--text-default), var(--accent-deep) 14%)",
              }}
            >
              {children}
            </em>
          ),
          del: ({ children }) => (
            <del style={{ color: "var(--text-soft)", textDecorationColor: "var(--text-soft)" }}>
              {children}
            </del>
          ),

          // ── Lists ─────────────────────────────────────────────────────────────
          // Important: do NOT set display:grid/flex on ul/ol — it strips list-item markers
          ul: ({ children }) => (
            <ul
              style={{
                paddingLeft: "var(--space-6)",
                marginBottom: "var(--space-5)",
                listStyleType: "disc",
              }}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              style={{
                paddingLeft: "var(--space-6)",
                marginBottom: "var(--space-5)",
                listStyleType: "decimal",
              }}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              style={{
                fontSize: "var(--text-base)",
                lineHeight: 1.72,
                color: "var(--text-default)",
                display: "list-item",
                marginBottom: "var(--space-2)",
              }}
            >
              {children}
            </li>
          ),

          // ── Blockquote ────────────────────────────────────────────────────────
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "3px solid var(--accent-olive)",
                paddingLeft: "var(--space-6)",
                paddingBlock: "var(--space-2)",
                margin: "var(--space-7) 0",
                fontStyle: "italic",
                color: "var(--text-soft)",
                background:
                  "color-mix(in oklch, var(--surface-soft), transparent 55%)",
                borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
              }}
            >
              {children}
            </blockquote>
          ),

          // ── Links ─────────────────────────────────────────────────────────────
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
                textDecorationColor:
                  "color-mix(in oklch, var(--accent-olive), transparent 58%)",
              }}
            >
              {children}
            </a>
          ),

          // ── Code ──────────────────────────────────────────────────────────────
          // `pre` wraps block code fences (``` ... ```)
          pre: ({ children }) => (
            <pre
              style={{
                background: "var(--surface-ink)",
                color: "var(--text-inverse)",
                padding: "var(--space-5)",
                borderRadius: "var(--radius-sm)",
                overflowX: "auto",
                margin: "var(--space-6) 0",
                fontSize: "0.875rem",
                lineHeight: 1.68,
                fontFamily: "ui-monospace, 'Cascadia Code', Menlo, monospace",
              }}
            >
              {children}
            </pre>
          ),
          // `code` handles inline code; inside a `pre` it just passes through
          code: ({ className, children }) => {
            // Inside a pre block — return plain code so pre handles all styling
            if (className) {
              return (
                <code
                  className={className}
                  style={{ fontFamily: "inherit", fontSize: "inherit" }}
                >
                  {children}
                </code>
              );
            }
            // Inline code
            return (
              <code
                style={{
                  background:
                    "color-mix(in oklch, var(--surface-soft), var(--surface-moss) 22%)",
                  padding: "2px 7px",
                  borderRadius: 5,
                  fontSize: "0.9em",
                  fontWeight: 500,
                  fontFamily: "ui-monospace, 'Cascadia Code', Menlo, monospace",
                }}
              >
                {children}
              </code>
            );
          },

          // ── HR ────────────────────────────────────────────────────────────────
          hr: () => (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--border-soft)",
                margin: "var(--space-8) 0",
              }}
            />
          ),

          // ── Images ────────────────────────────────────────────────────────────
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveImgUrl(src)}
              alt={alt ?? ""}
              loading="lazy"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "var(--radius-sm)",
                margin: "var(--space-6) 0",
                display: "block",
                border: "1px solid var(--border-soft)",
              }}
            />
          ),

          // ── Tables ───────────────────────────────────────────────────────────
          table: ({ children }) => (
            <div
              style={{
                overflowX: "auto",
                margin: "var(--space-6) 0",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-soft)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "var(--text-sm)",
                }}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead
              style={{
                background:
                  "color-mix(in oklch, var(--surface-soft), var(--surface-moss) 14%)",
              }}
            >
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th
              style={{
                textAlign: "left",
                padding: "var(--space-3) var(--space-4)",
                borderBottom: "2px solid var(--border-strong)",
                fontWeight: 700,
                fontSize: "var(--text-xs)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-strong)",
                whiteSpace: "nowrap",
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderBottom: "1px solid var(--border-soft)",
                verticalAlign: "top",
                lineHeight: 1.6,
              }}
            >
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
