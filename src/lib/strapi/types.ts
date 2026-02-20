export interface StrapiPaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiCollectionResponse<T> {
  data: Array<{ id: number; attributes: T }>;
  meta: StrapiPaginationMeta;
}

export interface StrapiSingleResponse<T> {
  data: { id: number; attributes: T } | null;
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
  featuredImage?: {
    data: {
      id: number;
      attributes: StrapiImageAttributes;
    } | null;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface BlogPost extends BlogPostAttributes {
  id: number;
}

// Tag conventions for content categorization
export const BLOG_TAGS = ["essay", "thoughts", "journal", "personal", "reflection", "opinion"] as const;
export const PORTFOLIO_TAGS = [
  "portfolio",
  "commission",
  "brand-story",
  "editorial",
  "case-study",
  "featured-work",
  "client-work",
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];
export type PortfolioTag = (typeof PORTFOLIO_TAGS)[number];

// Helper to determine if a post has blog or portfolio tags
export const hasAnyTag = (post: BlogPost, tags: readonly string[]): boolean => {
  if (!post.tags || !Array.isArray(post.tags)) {
    return false;
  }
  return post.tags.some((tag) => tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
};

export const isBlogPost = (post: BlogPost): boolean => hasAnyTag(post, BLOG_TAGS);
export const isPortfolioPost = (post: BlogPost): boolean => hasAnyTag(post, PORTFOLIO_TAGS);
