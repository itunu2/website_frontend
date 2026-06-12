import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import { getBlogPosts, getBlogPostBySlug, getRelatedPosts } from "@/lib/strapi/blog";
import { env } from "@/config/env";
import PostCard from "@/components/blog/PostCard";

function resolveImageUrl(url: string): string {
  return url.startsWith("http")
    ? url
    : `${env.client.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
}

export async function generateStaticParams() {
  try {
    const { posts } = await getBlogPosts({ pageSize: 100 });
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const imageUrl = post.featuredImage?.data?.attributes?.url;

  return {
    title: `${post.title} — Itunu Adegbayi`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedDate,
      ...(imageUrl && { images: [{ url: resolveImageUrl(imageUrl) }] }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post, 3);
  const imageUrl = post.featuredImage?.data?.attributes?.url;
  const imageAlt =
    post.featuredImage?.data?.attributes?.alternativeText ?? post.title;
  const date = new Date(post.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />
      <article className="section-wrap" style={{ paddingTop: "var(--space-7)", paddingBottom: "var(--space-9)" }}>
        {/* Back link */}
        <Link
          href="/blog"
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--accent-olive)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: "var(--space-6)",
          }}
        >
          ← Back to blog
        </Link>

        {/* Header */}
        <header style={{ maxWidth: 760, marginBottom: "var(--space-7)" }}>
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                flexWrap: "wrap",
                marginBottom: "var(--space-4)",
              }}
            >
              {post.tags.map((tag) => (
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
                    borderRadius: "var(--radius-pill)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "var(--text-strong)",
              fontFamily: "var(--font-display), sans-serif",
              marginBottom: "var(--space-4)",
            }}
          >
            {post.title}
          </h1>

          {post.description && (
            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--text-soft)",
                lineHeight: 1.55,
                marginBottom: "var(--space-4)",
              }}
            >
              {post.description}
            </p>
          )}

          <time
            dateTime={post.publishedDate}
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-soft)",
              fontWeight: 600,
            }}
          >
            {date}
          </time>
        </header>

        {/* Featured image */}
        {imageUrl && (
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 900,
              aspectRatio: "16 / 9",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              marginBottom: "var(--space-7)",
              background: "var(--surface-soft)",
            }}
          >
            <Image
              src={resolveImageUrl(imageUrl)}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ maxWidth: 760 }}>
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section style={{ marginTop: "var(--space-9)", maxWidth: 900 }}>
            <h2
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: "var(--text-strong)",
                fontFamily: "var(--font-display), sans-serif",
                marginBottom: "var(--space-5)",
              }}
            >
              Related posts
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "var(--space-5)",
              }}
            >
              {relatedPosts.map((rp, i) => (
                <PostCard key={rp.id} post={rp} index={i} basePath="/blog" />
              ))}
            </div>
          </section>
        )}
      </article>
      <Footer />
    </>
  );
}
