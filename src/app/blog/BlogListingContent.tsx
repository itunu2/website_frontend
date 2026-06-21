"use client";

import { useState, useMemo } from "react";
import type { BlogPost, StrapiPaginationMeta } from "@/lib/strapi/types";
import PostCard from "@/components/blog/PostCard";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import TagFilter from "@/components/blog/TagFilter";
import Pagination from "@/components/blog/Pagination";
import SearchBar from "@/components/SearchBar";

export default function BlogListingContent({
  posts,
  meta,
  tags,
  activeTag,
  basePath,
}: {
  posts: BlogPost[];
  meta: StrapiPaginationMeta;
  tags: string[];
  activeTag?: string;
  basePath: string;
}) {
  const isPortfolio = basePath === "/portfolio";
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }, [posts, query]);

  const isSearching = query.trim().length > 0;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-4)",
          marginBottom: "var(--space-5)",
        }}
      >
        <TagFilter tags={tags} activeTag={activeTag} basePath={basePath} />
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={isPortfolio ? "Search portfolio…" : "Search articles…"}
        />
      </div>

      {filteredPosts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "var(--space-9) var(--space-5)",
            color: "var(--text-soft)",
          }}
        >
          <p style={{ fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-3)" }}>
            {isSearching
              ? `No results for "${query.trim()}".`
              : activeTag
              ? `No posts tagged "${activeTag}" yet.`
              : "No posts published yet."}
          </p>
          <p style={{ fontSize: "var(--text-sm)" }}>
            {isSearching ? "Try a different keyword." : "Check back soon — new content is on the way."}
          </p>
        </div>
      ) : (
        <>
          {isSearching && (
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-soft)",
                marginBottom: "var(--space-4)",
              }}
            >
              {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""} for &ldquo;{query.trim()}&rdquo;
            </p>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${isPortfolio ? "300px" : "280px"}, 1fr))`,
              gap: "var(--space-5)",
            }}
          >
            {filteredPosts.map((post, i) =>
              isPortfolio ? (
                <PortfolioCard key={post.id} post={post} index={i} />
              ) : (
                <PostCard key={post.id} post={post} index={i} basePath={basePath} />
              ),
            )}
          </div>
        </>
      )}

      {/* Hide pagination when actively searching — all matches shown in-place */}
      {!isSearching && <Pagination meta={meta} basePath={basePath} />}
    </>
  );
}
