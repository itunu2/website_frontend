import { env } from "@/config/env";
import { strapiFetch } from "@/lib/strapi/client";
import {
  isBlogPost,
  isPortfolioPost,
  type BlogPost,
  type BlogPostAttributes,
  type StrapiCollectionResponse,
  type StrapiPaginationMeta,
  type StrapiSingleResponse,
} from "@/lib/strapi/types";

const transformBlogPost = (entry: { id: number; attributes?: BlogPostAttributes | null } & Partial<BlogPostAttributes>): BlogPost => {
  const attributes = entry.attributes ?? undefined;

  const resolveField = <T>(field: keyof BlogPostAttributes, fallback: T): T => {
    if (attributes && field in attributes && attributes[field] !== undefined) {
      return attributes[field] as unknown as T;
    }
    if (field in entry && entry[field] !== undefined) {
      return entry[field] as unknown as T;
    }
    return fallback;
  };

  const tagsSource = resolveField<unknown>("tags", []);
  const rawFeaturedImage = resolveField<unknown>("featuredImage", undefined);

  // Normalize featuredImage: handle both flat and nested structures
  let featuredImage: BlogPostAttributes["featuredImage"] = undefined;
  if (rawFeaturedImage && typeof rawFeaturedImage === "object") {
    const imageObj = rawFeaturedImage as Record<string, unknown>;
    
    // Check if already in { data: { attributes } } format
    if ("data" in imageObj) {
      featuredImage = imageObj as BlogPostAttributes["featuredImage"];
    } 
    // Check if it's a flat structure with url field (from db.query)
    else if ("url" in imageObj) {
      const baseUrl = imageObj.url as string;
      const fullUrl = baseUrl.startsWith('http') ? baseUrl : `${env.client.NEXT_PUBLIC_STRAPI_BASE_URL}${baseUrl}`;
      
      const processFormats = (formats: unknown) => {
        if (!formats || typeof formats !== 'object') return undefined;
        const result: Record<string, { url: string; width?: number; height?: number; name?: string }> = {};
        for (const [key, value] of Object.entries(formats)) {
          if (value && typeof value === 'object' && 'url' in value) {
            const formatUrl = (value as { url: string }).url;
            result[key] = {
              ...(value as object),
              url: formatUrl.startsWith('http') ? formatUrl : `${env.client.NEXT_PUBLIC_STRAPI_BASE_URL}${formatUrl}`,
            } as { url: string; width?: number; height?: number; name?: string };
          }
        }
        return result;
      };
      
      featuredImage = {
        data: {
          id: (imageObj.id as number) ?? 0,
          attributes: {
            url: fullUrl,
            alternativeText: (imageObj.alternativeText as string | null) ?? null,
            caption: (imageObj.caption as string | null) ?? null,
            width: imageObj.width as number | undefined,
            height: imageObj.height as number | undefined,
            formats: processFormats(imageObj.formats),
          },
        },
      };
    }
  }

  return {
    id: entry.id,
    documentId: resolveField<string>("documentId", ""),
    title: resolveField<string>("title", ""),
    slug: resolveField<string>("slug", ""),
    description: resolveField<string>("description", ""),
    content: resolveField<string>("content", ""),
    tags: Array.isArray(tagsSource) ? (tagsSource as string[]) : [],
    status: resolveField<"draft" | "published">("status", "draft"),
    publishedDate: resolveField<string>("publishedDate", new Date(0).toISOString()),
    isFeatured: resolveField<boolean>("isFeatured", false),
    featuredImage,
    createdAt: resolveField<string>("createdAt", new Date(0).toISOString()),
    updatedAt: resolveField<string>("updatedAt", new Date(0).toISOString()),
    publishedAt: resolveField<string | undefined>("publishedAt", undefined),
  } satisfies BlogPost;
};

export interface BlogListParams {
  page?: number;
  pageSize?: number;
  tag?: string;
  featured?: boolean;
}

export interface BlogListResponse {
  posts: BlogPost[];
  meta: StrapiPaginationMeta;
}

export const getBlogPosts = async (params: BlogListParams = {}): Promise<BlogListResponse> => {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? env.client.NEXT_PUBLIC_DEFAULT_PAGE_SIZE;

  const query: Record<string, string | number | boolean> = {
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "publishedDate:desc",
    populate: "featuredImage",
    "filters[status][$eq]": "published",
  };

  if (params.tag) {
    query["filters[tags][$containsi]"] = params.tag;
  }

  if (typeof params.featured === "boolean") {
    query["filters[isFeatured][$eq]"] = params.featured;
  }

  const response = await strapiFetch<StrapiCollectionResponse<BlogPostAttributes>>("/api/blog-posts", {
    query,
    cache: "force-cache",
    revalidate: env.client.NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS,
  });

  return {
    posts: response.data.map(transformBlogPost),
    meta: response.meta,
  };
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  if (!slug) return null;

  const response = await strapiFetch<StrapiSingleResponse<BlogPostAttributes>>(
    `/api/blog-posts/slug/${encodeURIComponent(slug)}`,
    {
      cache: "force-cache",
      revalidate: env.client.NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS,
      query: { populate: "featuredImage" },
    },
  );

  if (!response.data) {
    return null;
  }

  return transformBlogPost(response.data);
};

export const getAvailableTags = async (): Promise<string[]> => {
  const { posts } = await getBlogPosts({ page: 1, pageSize: 100 });
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b));
};

/**
 * Fetch portfolio/writing posts (filtered by portfolio tags on the client side)
 * These posts represent commissioned work, brand stories, and editorial features
 */
export const getPortfolioPosts = async (params: Omit<BlogListParams, "featured"> = {}): Promise<BlogListResponse> => {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? env.client.NEXT_PUBLIC_DEFAULT_PAGE_SIZE;

  // Fetch all published posts
  const query: Record<string, string | number | boolean> = {
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "publishedDate:desc",
    populate: "featuredImage",
    "filters[status][$eq]": "published",
  };

  // If a specific tag is provided, use backend filtering
  if (params.tag) {
    query["filters[tags][$containsi]"] = params.tag;
  }

  const response = await strapiFetch<StrapiCollectionResponse<BlogPostAttributes>>("/api/blog-posts", {
    query,
    cache: "force-cache",
    revalidate: env.client.NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS,
  });

  // Transform and filter for portfolio posts
  const allPosts = response.data.map(transformBlogPost);
  
  // If no specific tag filter, filter by portfolio tags on client side
  const posts = params.tag
    ? allPosts
    : allPosts.filter((post) => {
        if (isPortfolioPost(post) || post.isFeatured) {
          return true;
        }
        const hasTags = Array.isArray(post.tags) && post.tags.length > 0;
        return !hasTags;
      });

  return {
    posts,
    meta: response.meta,
  };
};

/**
 * Fetch blog/journal posts (filtered by blog tags on the client side)
 * These posts represent personal essays, thoughts, and reflections
 */
export const getBlogPostsOnly = async (params: Omit<BlogListParams, "featured"> = {}): Promise<BlogListResponse> => {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? env.client.NEXT_PUBLIC_DEFAULT_PAGE_SIZE;

  const query: Record<string, string | number | boolean> = {
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "publishedDate:desc",
    populate: "featuredImage",
    "filters[status][$eq]": "published",
  };

  // If a specific tag is provided, use backend filtering
  if (params.tag) {
    query["filters[tags][$containsi]"] = params.tag;
  }

  const response = await strapiFetch<StrapiCollectionResponse<BlogPostAttributes>>("/api/blog-posts", {
    query,
    cache: "force-cache",
    revalidate: env.client.NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS,
  });

  const allPosts = response.data.map(transformBlogPost);
  
  // If no specific tag filter, filter by blog tags on client side
  const posts = params.tag
    ? allPosts
    : allPosts.filter((post) => {
        if (isBlogPost(post)) {
          return true;
        }
        if (isPortfolioPost(post)) {
          return false;
        }
        return true;
      });

  return {
    posts,
    meta: response.meta,
  };
};

/**
 * Fetch related posts based on shared tags
 */
export const getRelatedPosts = async (currentPost: BlogPost, limit = 3): Promise<BlogPost[]> => {
  if (!currentPost.tags || !Array.isArray(currentPost.tags) || currentPost.tags.length === 0) {
    return [];
  }

  // Fetch posts that share at least one tag
  const { posts } = await getBlogPosts({ pageSize: 20 });
  
  return posts
    .filter((post) => {
      // Exclude the current post
      if (post.id === currentPost.id) return false;
      
      // Check for shared tags (case-insensitive)
      if (!post.tags || !Array.isArray(post.tags)) return false;
      
      return post.tags.some((tag) =>
        currentPost.tags.some((currentTag) => currentTag.toLowerCase() === tag.toLowerCase())
      );
    })
    .slice(0, limit);
};
