import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPortfolioPosts, getAvailableTags } from "@/lib/strapi/blog";
import { PORTFOLIO_TAGS } from "@/lib/strapi/types";
import BlogListingContent from "@/app/blog/BlogListingContent";
import type { BlogPost } from "@/lib/strapi/types";
import { env } from "@/config/env";

export const metadata: Metadata = {
  title: "Portfolio — Itunu Adegbayi",
  description:
    "A curated collection of B2B SaaS content, brand stories, case studies, and editorial work.",
};

function resolveImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${env.client.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
}

function FeaturedCard({ post }: { post: BlogPost }) {
  const imageUrl = post.featuredImage?.data?.attributes?.url;
  const imageAlt = post.featuredImage?.data?.attributes?.alternativeText ?? post.title;
  const date = new Date(post.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/portfolio/${post.slug}`}
      className="portfolio-featured-card"
      style={{
        display: "grid",
        gridTemplateColumns: imageUrl ? "1fr 1fr" : "1fr",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border-soft)",
        background: "linear-gradient(160deg, oklch(0.97 0.01 94) 0%, oklch(0.94 0.016 100) 100%)",
        boxShadow: "var(--shadow-lift)",
        textDecoration: "none",
        marginBottom: "var(--space-8)",
        minHeight: 400,
        transition: "transform 0.3s var(--ease-premium), box-shadow 0.3s var(--ease-premium)",
      }}
    >
      {/* Text */}
      <div
        style={{
          padding: "clamp(32px, 4vw, 56px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              marginBottom: "var(--space-5)",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-inverse)",
                background: "var(--accent-olive)",
                padding: "5px 12px",
                borderRadius: 999,
              }}
            >
              Featured
            </span>
            {post.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--accent-deep)",
                  background: "color-mix(in oklch, var(--accent-gold), white 40%)",
                  border: "1px solid color-mix(in oklch, var(--accent-gold), black 12%)",
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h2
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "var(--text-strong)",
              fontFamily: "var(--font-display), sans-serif",
              marginBottom: "var(--space-4)",
            }}
          >
            {post.title}
          </h2>

          {post.description && (
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "var(--text-soft)",
                lineHeight: 1.65,
                maxWidth: "50ch",
              }}
            >
              {post.description}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "var(--space-6)",
            paddingTop: "var(--space-5)",
            borderTop: "1px solid var(--border-soft)",
          }}
        >
          <time
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-soft)",
              fontWeight: 600,
            }}
          >
            {date}
          </time>
          <span
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              color: "var(--accent-olive)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Read case study →
          </span>
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: "var(--surface-soft)",
          }}
        >
          <Image
            src={resolveImageUrl(imageUrl)}
            alt={imageAlt}
            fill
            sizes="(max-width: 860px) 100vw, 50vw"
            style={{ objectFit: "cover", transition: "transform 0.5s var(--ease-premium)" }}
            className="featured-card-img"
          />
        </div>
      )}
    </Link>
  );
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentTag = params.tag;
  const currentPage = Number(params.page) || 1;

  const [{ posts, meta }, allTags] = await Promise.all([
    getPortfolioPosts({ page: currentPage, pageSize: 60, tag: currentTag }),
    getAvailableTags(),
  ]);

  const portfolioTags = allTags.filter((tag) =>
    PORTFOLIO_TAGS.some((pt) => pt.toLowerCase() === tag.toLowerCase()),
  );

  const featuredPosts = !currentTag ? posts.filter((p) => p.isFeatured) : [];
  const gridPosts = !currentTag ? posts.filter((p) => !p.isFeatured) : posts;

  return (
    <>
      <Navbar />
      <main className="section-wrap section-block">
        <header style={{ marginBottom: "var(--space-8)", textAlign: "center" }}>
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
              maxWidth: 560,
              marginInline: "auto",
            }}
          >
            Work that moves the needle
          </h1>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-soft)",
              marginTop: "var(--space-4)",
              maxWidth: "56ch",
              lineHeight: 1.7,
              marginInline: "auto",
            }}
          >
            A curated collection of B2B SaaS content, brand stories, case
            studies, and editorial work crafted for clients who care about outcomes.
          </p>
        </header>

        {/* Featured showcase — only on unfiltered view */}
        {featuredPosts.length > 0 && (
          <section style={{ marginBottom: "var(--space-7)" }}>
            {featuredPosts.map((post) => (
              <FeaturedCard key={post.id} post={post} />
            ))}
          </section>
        )}

        {/* Grid section */}
        {(gridPosts.length > 0 || currentTag) && (
          <>
            {featuredPosts.length > 0 && (
              <h2
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  color: "var(--text-strong)",
                  fontFamily: "var(--font-display), sans-serif",
                  marginBottom: "var(--space-5)",
                }}
              >
                More work
              </h2>
            )}

            <Suspense fallback={null}>
              <BlogListingContent
                posts={gridPosts}
                meta={meta}
                tags={portfolioTags}
                activeTag={currentTag}
                basePath="/portfolio"
              />
            </Suspense>
          </>
        )}

        {posts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-9) var(--space-5)",
              color: "var(--text-soft)",
            }}
          >
            <p style={{ fontSize: "var(--text-lg)", fontWeight: 600, marginBottom: "var(--space-3)" }}>
              Portfolio pieces coming soon.
            </p>
            <p style={{ fontSize: "var(--text-sm)" }}>
              Check back shortly — new work is being added.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
