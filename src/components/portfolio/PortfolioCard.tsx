"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/strapi/types";
import { env } from "@/config/env";

function resolveImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${env.client.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
}

function PlaceholderBg({ title }: { title: string }) {
  const palettes: [string, string][] = [
    ["oklch(0.81 0.08 112)", "oklch(0.74 0.11 100)"],
    ["oklch(0.80 0.08 86)", "oklch(0.74 0.10 78)"],
    ["oklch(0.77 0.07 130)", "oklch(0.71 0.10 118)"],
  ];
  const [from, to] = palettes[title.charCodeAt(0) % palettes.length];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(140deg, ${from} 0%, ${to} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: "3rem",
          fontWeight: 800,
          fontFamily: "var(--font-display), sans-serif",
          color: "oklch(1 0 0 / 0.2)",
          letterSpacing: "-0.04em",
          userSelect: "none",
        }}
      >
        {title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

// Tags used internally for routing — don't show as content labels
const INTERNAL_TAGS = new Set([
  "portfolio", "commission", "featured-work", "client-work",
]);

export default function PortfolioCard({
  post,
  index = 0,
}: {
  post: BlogPost;
  index?: number;
}) {
  const imageUrl = post.featuredImage?.data?.attributes?.url;
  const imageAlt = post.featuredImage?.data?.attributes?.alternativeText ?? post.title;
  const date = new Date(post.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const contentTags = post.tags?.filter((t) => !INTERNAL_TAGS.has(t)) ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
      style={{
        background:
          "linear-gradient(168deg, oklch(0.975 0.008 94) 0%, oklch(0.955 0.012 100) 100%)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-soft)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        transition:
          "box-shadow var(--duration-md) var(--ease-premium), border-color var(--duration-md)",
      }}
      onHoverStart={(e) => {
        const article = (e.target as HTMLElement).closest("article");
        if (article) {
          article.style.boxShadow = "var(--shadow-lift)";
          article.style.borderColor =
            "color-mix(in oklch, var(--accent-olive), transparent 60%)";
        }
      }}
      onHoverEnd={(e) => {
        const article = (e.target as HTMLElement).closest("article");
        if (article) {
          article.style.boxShadow = "";
          article.style.borderColor = "";
        }
      }}
    >
      <Link
        href={`/portfolio/${post.slug}`}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* Image — 3:2 ratio for editorial feel */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "3 / 2",
            overflow: "hidden",
            background: "var(--surface-soft)",
            flexShrink: 0,
          }}
        >
          {imageUrl ? (
            <Image
              src={resolveImageUrl(imageUrl)}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
              style={{
                objectFit: "cover",
                transition: "transform 0.5s var(--ease-premium)",
              }}
              className="post-card-image"
            />
          ) : (
            <PlaceholderBg title={post.title} />
          )}
        </div>

        {/* Content */}
        <div
          style={{
            padding: "var(--space-5)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
            flex: 1,
          }}
        >
          {/* Content-type tags */}
          {contentTags.length > 0 && (
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              {contentTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "var(--accent-deep)",
                    background:
                      "color-mix(in oklch, var(--accent-olive), white 82%)",
                    border:
                      "1px solid color-mix(in oklch, var(--accent-olive), white 64%)",
                    padding: "4px 10px",
                    borderRadius: "var(--radius-pill)",
                  }}
                >
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 800,
              lineHeight: 1.18,
              color: "var(--text-strong)",
              fontFamily: "var(--font-display), sans-serif",
            }}
          >
            {post.title}
          </h3>

          {/* Description — 2-line clamp */}
          {post.description && (
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-soft)",
                lineHeight: 1.62,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.description}
            </p>
          )}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
              paddingTop: "var(--space-4)",
              borderTop: "1px solid var(--border-soft)",
            }}
          >
            <span
              style={{ fontSize: "var(--text-xs)", color: "var(--text-soft)" }}
            >
              {date}
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                color: "var(--accent-olive)",
                letterSpacing: "0.02em",
              }}
            >
              View work →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
