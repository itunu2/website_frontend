"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { BlogPost } from "@/lib/strapi/types";
import { siteRoutes } from "@/config/site";

interface PostCardProps {
  post: BlogPost;
  variant?: "featured" | "standard";
  hoverable?: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const estimateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

export const PostCard = ({ post, variant = "standard" }: Omit<PostCardProps, 'hoverable'>) => {
  const isFeatured = variant === "featured";
  const postUrl = `${siteRoutes.blog}/${post.slug}`;
  const featuredImageData = post.featuredImage?.data;

  return (
    <Card as="article" variant="interactive" className="group flex-1 flex flex-col">
      <Link href={postUrl} className="flex flex-1 flex-col">
        {featuredImageData && (
          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={featuredImageData.attributes.url}
              alt={featuredImageData.attributes.alternativeText || post.title}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col">
          {post.tags && post.tags.length > 0 && (
            <p className="mb-2 text-caption font-medium uppercase tracking-wider text-accent-primary">
              {post.tags[0]}
            </p>
          )}

          <h3
            className={`mb-3 font-display font-semibold text-text-primary transition-colors duration-150 group-hover:text-accent-primary ${
              isFeatured ? "text-h2" : "text-h3"
            }`}
          >
            {post.title}
          </h3>

          {post.description && (
            <p className="mb-4 flex-1 text-body leading-relaxed text-text-secondary line-clamp-3">{post.description}</p>
          )}

          <div className="flex items-center gap-2 text-body-sm text-text-tertiary">
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
            <span>·</span>
            <span>{estimateReadingTime(post.content)}</span>
          </div>

          {post.tags && post.tags.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} variant="default">
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};
