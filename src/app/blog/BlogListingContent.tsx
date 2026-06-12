"use client";

import type { BlogPost, StrapiPaginationMeta } from "@/lib/strapi/types";
import PostCard from "@/components/blog/PostCard";
import TagFilter from "@/components/blog/TagFilter";
import Pagination from "@/components/blog/Pagination";

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
  return (
    <>
      <TagFilter tags={tags} activeTag={activeTag} basePath={basePath} />

      {posts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "var(--space-9) var(--space-5)",
            color: "var(--text-soft)",
          }}
        >
          <p style={{ fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-3)" }}>
            {activeTag ? `No posts tagged "${activeTag}" yet.` : "No posts published yet."}
          </p>
          <p style={{ fontSize: "var(--text-sm)" }}>
            Check back soon — new content is on the way.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "var(--space-5)",
          }}
        >
          {posts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              index={i}
              basePath={basePath}
            />
          ))}
        </div>
      )}

      <Pagination meta={meta} basePath={basePath} />
    </>
  );
}
