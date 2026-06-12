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
      style={{
        background:
          "linear-gradient(172deg, oklch(0.97 0.01 94) 0%, oklch(0.95 0.012 96) 100%)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-soft)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform var(--duration-md) var(--ease-premium), box-shadow var(--duration-md) var(--ease-premium)",
      }}
      whileHover={{ y: -4, boxShadow: "var(--shadow-lift)" }}
    >
      <Link
        href={`${basePath}/${post.slug}`}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* Image */}
        {imageUrl && (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              overflow: "hidden",
              background: "var(--surface-soft)",
            }}
          >
            <Image
              src={resolveImageUrl(imageUrl)}
              alt={imageAlt}
              fill
              sizes="(max-width: 620px) 100vw, (max-width: 1080px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

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
                    background:
                      "color-mix(in oklch, var(--accent-gold), white 40%)",
                    border:
                      "1px solid color-mix(in oklch, var(--accent-gold), black 12%)",
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

          {/* Date */}
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-soft)",
              marginTop: "auto",
              paddingTop: "var(--space-3)",
            }}
          >
            {date}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
