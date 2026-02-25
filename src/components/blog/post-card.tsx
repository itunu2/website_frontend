"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { ArrowRightIcon } from "@/components/ui/icons";
import { formatDate, estimateReadingTime } from "@/lib/blog-utils";
import type { BlogPost } from "@/lib/strapi/types";
import { siteRoutes } from "@/config/site";

interface PostCardProps {
  post: BlogPost;
  variant?: "featured" | "standard";
  showLabel?: string;
}

export const PostCard = ({ post, variant = "standard", showLabel }: PostCardProps) => {
  const isFeatured = variant === "featured";
  const postUrl = `${siteRoutes.blog}/${post.slug}`;
  const featuredImageData = post.featuredImage?.data;

  if (isFeatured) {
    return (
      <Card 
        as="article" 
        variant="elevated" 
        className="group overflow-hidden"
      >
        <Link 
          href={postUrl} 
          className="grid gap-0 md:grid-cols-5 md:gap-0"
        >
          {/* Image Section */}
          {featuredImageData && (
            <div className="relative aspect-4/3 w-full overflow-hidden md:col-span-3 md:aspect-auto md:min-h-[480px]">
              <div className="absolute inset-0 z-10 bg-linear-to-r from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <Image
                src={featuredImageData.attributes.url}
                alt={featuredImageData.attributes.alternativeText || post.title}
                fill
                className="object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                priority
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 60vw, 66vw"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="flex flex-col justify-center gap-4 bg-bg-dark p-6 sm:gap-6 sm:p-8 md:col-span-2 md:p-10 lg:p-12">
            {/* Category/Tag */}
            {post.tags && post.tags.length > 0 && (
              <p className="text-caption font-bold uppercase tracking-[0.25em] text-accent-primary">
                {showLabel ? `${showLabel} · ${post.tags[0]}` : post.tags[0]}
              </p>
            )}

            {/* Title */}
            <h2 className="font-display text-h2 leading-[1.1] text-bg-page transition-colors duration-200 group-hover:text-accent-primary sm:text-h1 lg:text-display">
              {post.title}
            </h2>

            {/* Description */}
            {post.description && (
              <p className="text-body-lg leading-[1.7] text-bg-page/60 line-clamp-3">
                {post.description}
              </p>
            )}

            <div className="flex flex-col gap-6">
              {/* Metadata */}
              <div className="flex items-center gap-3 text-body-sm font-medium text-bg-page/40">
                <time dateTime={post.publishedDate}>
                  {formatDate(post.publishedDate)}
                </time>
                <span className="text-bg-page/40">·</span>
                <span>{estimateReadingTime(post.content)}</span>
              </div>

              {/* Additional Tags */}
              {post.tags && post.tags.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(1, 4).map((tag) => (
                    <Tag key={tag} variant="dark">
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}

              {/* Read More Indicator */}
              <div className="flex items-center gap-2 text-body font-medium text-accent-primary transition-all duration-200 group-hover:gap-3">
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">Read the full story</span>
                <ArrowRightIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // Standard variant
  return (
    <Card as="article" variant="interactive" className="group flex h-full flex-col p-0!">
      <Link href={postUrl} className="flex h-full flex-col p-4 sm:p-6 md:p-7">
        {/* Fixed aspect ratio image - always same size */}
        {featuredImageData ? (
          <div className="relative mb-5 aspect-video w-full shrink-0 overflow-hidden rounded-lg">
            <div className="absolute inset-0 z-10 bg-linear-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Image
              src={featuredImageData.attributes.url}
              alt={featuredImageData.attributes.alternativeText || post.title}
              fill
              className="object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative mb-5 flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg-elevated">
            <svg
              className="h-16 w-16 text-text-tertiary opacity-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Content section with consistent spacing */}
        <div className="flex flex-1 flex-col text-left">
          {/* Tag - fixed height to prevent shifts */}
          <div className="mb-3 h-4">
            {post.tags && post.tags.length > 0 && (
              <p className="text-caption font-bold uppercase tracking-[0.25em] text-accent-primary">
                {post.tags[0]}
              </p>
            )}
          </div>

          {/* Title - clamped to 2 lines for consistency */}
          <h3 className="mb-3 font-display text-h3 leading-[1.2] text-text-primary transition-colors duration-200 group-hover:text-accent-primary line-clamp-2">
            {post.title}
          </h3>

          {/* Description - always 3 lines */}
          <p className="mb-4 min-h-18 text-body leading-normal text-text-secondary line-clamp-3">
            {post.description || "Read more to discover the full story..."}
          </p>

          {/* Metadata - pushed to bottom */}
          <div className="mt-auto flex items-center gap-2 text-body-sm font-medium text-text-tertiary">
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
            <span>·</span>
            <span>{estimateReadingTime(post.content)}</span>
          </div>

          {/* Optional tags - fixed height section */}
          <div className="mt-3 min-h-8">
            {post.tags && post.tags.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(1, 3).map((tag) => (
                  <Tag key={tag} variant="default">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};
