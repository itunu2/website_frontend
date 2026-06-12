/* Strapi response types & tag-based content routing */

// ── Strapi API response shapes ──

export interface StrapiPaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// Strapi v5 can return either nested ({ id, attributes: { ... } }) or flat ({ id, title, ... })
// depending on whether the controller uses Entity Service or raw db.query.
export interface StrapiCollectionResponse<T> {
  data: Array<{ id: number; attributes?: T } & Partial<T>>;
  meta: StrapiPaginationMeta;
}

export interface StrapiSingleResponse<T> {
  data: ({ id: number; attributes?: T } & Partial<T>) | null;
  meta?: Record<string, unknown>;
}

export interface StrapiImageFormat {
  name?: string;
  url: string;
  width?: number;
  height?: number;
}

export interface StrapiImageAttributes {
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, StrapiImageFormat>;
}

export interface BlogPostAttributes {
  documentId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  status: "draft" | "published";
  publishedDate: string;
  isFeatured?: boolean;
  // Normalized form (after transform). Raw Strapi v5 may return flat or nested.
  featuredImage?: {
    data: { id: number; attributes: StrapiImageAttributes } | null;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BlogPost extends BlogPostAttributes {
  id: number;
}

// ── Tag-based content routing ──
// Blog and portfolio share the same Strapi content type (`blog-posts`).
// They are separated by tag conventions.

export const BLOG_TAGS = [
  "essay", "thoughts", "journal", "personal", "reflection", "opinion",
] as const;

export const PORTFOLIO_TAGS = [
  "portfolio", "commission", "brand-story", "editorial",
  "case-study", "featured-work", "client-work",
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];
export type PortfolioTag = (typeof PORTFOLIO_TAGS)[number];

export const hasAnyTag = (post: BlogPost, tags: readonly string[]): boolean => {
  if (!Array.isArray(post.tags)) return false;
  const lowerTags = tags.map((t) => t.toLowerCase());
  return post.tags.some((tag) => lowerTags.includes(tag.toLowerCase()));
};

export const isBlogPost = (post: BlogPost): boolean => hasAnyTag(post, BLOG_TAGS);
export const isPortfolioPost = (post: BlogPost): boolean => hasAnyTag(post, PORTFOLIO_TAGS);
