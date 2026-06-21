import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogPostsOnly, getAvailableTags } from "@/lib/strapi/blog";
import { BLOG_TAGS } from "@/lib/strapi/types";
import BlogListingContent from "./BlogListingContent";

export const metadata: Metadata = {
  title: "Blog — Itunu Adegbayi",
  description:
    "Thoughts on B2B content, SaaS marketing, and the craft of writing that converts.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentTag = params.tag;
  const currentPage = Number(params.page) || 1;

  const [{ posts, meta }, allTags] = await Promise.all([
    getBlogPostsOnly({ page: currentPage, pageSize: 60, tag: currentTag }),
    getAvailableTags(),
  ]);

  const blogTags = allTags.filter((tag) =>
    BLOG_TAGS.some((bt) => bt.toLowerCase() === tag.toLowerCase()),
  );

  return (
    <>
      <Navbar />
      <main className="section-wrap section-block">
        <header style={{ marginBottom: "var(--space-8)", textAlign: "center" }}>
          <span className="kicker" style={{ marginBottom: "var(--space-3)", display: "block" }}>
            Blog
          </span>
          <h1
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "var(--text-strong)",
              fontFamily: "var(--font-display), sans-serif",
              maxWidth: 560,
              marginInline: "auto",
            }}
          >
            Writing about what I know
          </h1>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-soft)",
              marginTop: "var(--space-4)",
              maxWidth: "54ch",
              lineHeight: 1.7,
              marginInline: "auto",
            }}
          >
            Thoughts on B2B content strategy, SaaS marketing, and the craft of
            writing that actually converts.
          </p>
        </header>

        <Suspense fallback={null}>
          <BlogListingContent
            posts={posts}
            meta={meta}
            tags={blogTags}
            activeTag={currentTag}
            basePath="/blog"
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
