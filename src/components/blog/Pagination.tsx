"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { StrapiPaginationMeta } from "@/lib/strapi/types";

export default function Pagination({
  meta,
  basePath,
}: {
  meta: StrapiPaginationMeta;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { page, pageCount } = meta.pagination;

  if (pageCount <= 1) return null;

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    router.push(`${basePath}?${params.toString()}`);
  };

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    width: 42,
    height: 42,
    borderRadius: "var(--radius-pill)",
    border: "1px solid",
    borderColor: active ? "transparent" : "var(--border-soft)",
    background: active
      ? "color-mix(in oklch, var(--accent-olive), black 18%)"
      : "transparent",
    color: active ? "var(--text-inverse)" : "var(--text-default)",
    fontFamily: "var(--font-display), sans-serif",
    fontSize: "var(--text-sm)",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all var(--duration-fast)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "var(--space-2)",
        marginTop: "var(--space-7)",
      }}
    >
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        style={{
          ...buttonStyle(false),
          opacity: page <= 1 ? 0.4 : 1,
          cursor: page <= 1 ? "not-allowed" : "pointer",
        }}
      >
        ←
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          aria-current={p === page ? "page" : undefined}
          style={buttonStyle(p === page)}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => goToPage(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
        style={{
          ...buttonStyle(false),
          opacity: page >= pageCount ? 0.4 : 1,
          cursor: page >= pageCount ? "not-allowed" : "pointer",
        }}
      >
        →
      </button>
    </nav>
  );
}
