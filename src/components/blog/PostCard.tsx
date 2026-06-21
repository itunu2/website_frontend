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

/* Deterministic gradient placeholder — varies per post title initial */
function PlaceholderBg({ title }: { title: string }) {
  const palettes = [
    ["oklch(0.88 0.06 112)", "oklch(0.82 0.09 100)"],
    ["oklch(0.88 0.06 86)", "oklch(0.83 0.08 78)"],
    ["oklch(0.85 0.05 130)", "oklch(0.79 0.08 118)"],
  ];
  const idx = title.charCodeAt(0) % palettes.length;
  const [from, to] = palettes[idx];

  return (
    <div
      className="post-card-placeholder"
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
          fontSize: "2.4rem",
          fontWeight: 800,
          fontFamily: "var(--font-display), sans-serif",
          color: "oklch(1 0 0 / 0.25)",
          userSelect: "none",
          letterSpacing: "-0.03em",
        }}
      >
        {title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export default function PostCard({
  post,
  index = 0,
  basePath = "/blog",
}: {
  post: BlogPost;
  index?: number;
  basePath?: string;
}) {
  const imageUrl = post.featuredImage?.data?.attributes?.url;
  const imageAlt =
    post.featuredImage?.data?.attributes?.alternativeText ?? post.title;
  const date = new Date(post.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -5, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
      style={{
        background:
          "linear-gradient(172deg, oklch(0.97 0.01 94) 0%, oklch(0.95 0.012 96) 100%)",
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
        (e.target as HTMLElement).closest("article")!.style.boxShadow =
          "var(--shadow-lift)";
        (e.target as HTMLElement).closest("article")!.style.borderColor =
          "color-mix(in oklch, var(--accent-olive), transparent 72%)";
      }}
      onHoverEnd={(e) => {
        (e.target as HTMLElement).closest("article")!.style.boxShadow = "";
        (e.target as HTMLElement).closest("article")!.style.borderColor = "";
      }}
    >
      <Link
        href={`${basePath}/${post.slug}`}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* Image / placeholder */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            background: "var(--surface-soft)",
          }}
        >
          {imageUrl ? (
            <Image
              src={resolveImageUrl(imageUrl)}
              alt={imageAlt}
              fill
              sizes="(max-width: 620px) 100vw, (max-width: 1080px) 50vw, 33vw"
              style={{
                objectFit: "cover",
                transition: "transform 0.45s var(--ease-premium)",
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
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              {post.tags.slice(0, 3).map((tag) => (
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

          {/* Title */}
          <h3
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 700,
              lineHeight: 1.25,
              color: "var(--text-strong)",
              fontFamily: "var(--font-display), sans-serif",
            }}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.description && (
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-soft)",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.description}
            </p>
          )}

          {/* Footer row */}
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
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-soft)",
              }}
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
              Read →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
