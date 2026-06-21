"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TagFilter({
  tags,
  activeTag,
  basePath,
}: {
  tags: string[];
  activeTag?: string;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = (tag?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    params.delete("page"); // reset to page 1
    router.push(`${basePath}?${params.toString()}`);
  };

  if (tags.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-2)",
        flexWrap: "wrap",
        marginBottom: "var(--space-6)",
      }}
    >
      <button
        onClick={() => handleTagClick(undefined)}
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          padding: "8px 16px",
          borderRadius: "var(--radius-pill)",
          border: "1px solid",
          cursor: "pointer",
          fontFamily: "var(--font-display), sans-serif",
          transition: "all var(--duration-fast)",
          background: !activeTag
            ? "color-mix(in oklch, var(--accent-olive), black 18%)"
            : "transparent",
          color: !activeTag ? "var(--text-inverse)" : "var(--text-default)",
          borderColor: !activeTag
            ? "transparent"
            : "var(--border-soft)",
        }}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "8px 16px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid",
            cursor: "pointer",
            fontFamily: "var(--font-display), sans-serif",
            transition: "all var(--duration-fast)",
            background:
              activeTag === tag
                ? "color-mix(in oklch, var(--accent-olive), black 18%)"
                : "transparent",
            color:
              activeTag === tag ? "var(--text-inverse)" : "var(--text-default)",
            borderColor:
              activeTag === tag ? "transparent" : "var(--border-soft)",
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
