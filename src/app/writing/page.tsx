import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPortfolioPosts, getAvailableTags } from "@/lib/strapi/blog";
import { PORTFOLIO_TAGS } from "@/lib/strapi/types";
import BlogListingContent from "@/app/blog/BlogListingContent";

export const metadata: Metadata = {
  title: "Writing Samples — Itunu Adegbayi",
  description:
    "A curated collection of B2B SaaS content, brand stories, case studies, and editorial work.",
};

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentTag = params.tag;
  const currentPage = Number(params.page) || 1;

  const [{ posts, meta }, allTags] = await Promise.all([
    getPortfolioPosts({ page: currentPage, pageSize: 12, tag: currentTag }),
    getAvailableTags(),
  ]);

  const portfolioTags = allTags.filter((tag) =>
    PORTFOLIO_TAGS.some((pt) => pt.toLowerCase() === tag.toLowerCase()),
  );

  return (
    <>
      <Navbar />
      <main className="section-wrap section-block">
        <header style={{ marginBottom: "var(--space-7)" }}>
          <span className="kicker" style={{ marginBottom: "var(--space-3)", display: "block" }}>
            Portfolio
          </span>
          <h1
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "var(--text-strong)",
              fontFamily: "var(--font-display), sans-serif",
              maxWidth: 600,
            }}
          >
            Writing that works
          </h1>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-soft)",
              marginTop: "var(--space-4)",
              maxWidth: "58ch",
              lineHeight: 1.7,
            }}
          >
            A curated collection of B2B SaaS content, brand stories, case
            studies, and editorial work I&apos;ve done for clients.
          </p>
        </header>

        <Suspense fallback={null}>
          <BlogListingContent
            posts={posts}
            meta={meta}
            tags={portfolioTags}
            activeTag={currentTag}
            basePath="/writing"
          />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
