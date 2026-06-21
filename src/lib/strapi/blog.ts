import { env } from "@/config/env";
import { strapiFetch } from "@/lib/strapi/client";
import type {
  BlogPost,
  BlogPostAttributes,
  StrapiCollectionResponse,
  StrapiPaginationMeta,
  StrapiSingleResponse,
} from "@/lib/strapi/types";
import { isBlogPost, isPortfolioPost } from "@/lib/strapi/types";

// ── Transform ──

function resolveImageUrl(url: string): string {
  return url.startsWith("http")
    ? url
    : `${env.client.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`;
}

function transformBlogPost(
  entry: { id: number; attributes?: BlogPostAttributes | null } & Partial<BlogPostAttributes>,
): BlogPost {
  const a = entry.attributes;
  const get = <T>(key: keyof BlogPostAttributes, fallback: T): T => {
    const fromAttr = a?.[key];
    if (fromAttr !== undefined) return fromAttr as unknown as T;
    const fromEntry = (entry as Record<string, unknown>)[key];
    if (fromEntry !== undefined) return fromEntry as unknown as T;
    return fallback;
  };

  // Normalize featured image from either nested or flat shape (Strapi v5 inconsistency)
  let featuredImage: BlogPostAttributes["featuredImage"];
  const raw = get<unknown>("featuredImage", undefined);
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if ("data" in obj && obj.data && typeof obj.data === "object") {
      // Nested: { data: { id, attributes: { url, ... } } } OR { data: { id, url, ... } }
      const d = obj.data as Record<string, unknown>;
      if ("attributes" in d && d.attributes && typeof d.attributes === "object") {
        // Fully nested v4-style
        const attrs = d.attributes as Record<string, unknown>;
        featuredImage = {
          data: {
            id: (d.id as number) ?? 0,
            attributes: {
              url: resolveImageUrl(attrs.url as string),
              alternativeText: (attrs.alternativeText as string | null) ?? null,
              caption: (attrs.caption as string | null) ?? null,
              width: attrs.width as number | undefined,
              height: attrs.height as number | undefined,
            },
          },
        };
      } else if ("url" in d) {
        // data exists but is flat: { data: { id, url, ... } }
        featuredImage = {
          data: {
            id: (d.id as number) ?? 0,
            attributes: {
              url: resolveImageUrl(d.url as string),
              alternativeText: (d.alternativeText as string | null) ?? null,
              caption: (d.caption as string | null) ?? null,
              width: d.width as number | undefined,
              height: d.height as number | undefined,
            },
          },
        };
      }
    } else if ("url" in obj) {
      // Completely flat: { id, url, alternativeText, ... }
      featuredImage = {
        data: {
          id: (obj.id as number) ?? 0,
          attributes: {
            url: resolveImageUrl(obj.url as string),
            alternativeText: (obj.alternativeText as string | null) ?? null,
            caption: (obj.caption as string | null) ?? null,
            width: obj.width as number | undefined,
            height: obj.height as number | undefined,
          },
        },
      };
    }
  }

  const tagsRaw = get<unknown>("tags", []);

  return {
    id: entry.id,
    documentId: get("documentId", ""),
    title: get("title", ""),
    slug: get("slug", ""),
    description: get("description", ""),
    content: get("content", ""),
    tags: Array.isArray(tagsRaw) ? (tagsRaw as string[]) : [],
    status: get("status", "draft"),
    publishedDate: get("publishedDate", new Date(0).toISOString()),
    isFeatured: get("isFeatured", false),
    featuredImage,
    createdAt: get("createdAt", new Date(0).toISOString()),
    updatedAt: get("updatedAt", new Date(0).toISOString()),
    publishedAt: get("publishedAt", undefined),
  };
}

// ── Params & helpers ──

export interface BlogListParams {
  page?: number;
  pageSize?: number;
  tag?: string;
  featured?: boolean;
  q?: string;
}

export interface BlogListResponse {
  posts: BlogPost[];
  meta: StrapiPaginationMeta;
}

const emptyMeta = (page: number, pageSize: number): StrapiPaginationMeta => ({
  pagination: { page, pageSize, pageCount: 0, total: 0 },
});

const revalidate = env.client.NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS;

// ── Public API ──

export async function getBlogPosts(params: BlogListParams = {}): Promise<BlogListResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? env.client.NEXT_PUBLIC_DEFAULT_PAGE_SIZE;

  const query: Record<string, string | number | boolean> = {
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "publishedDate:desc",
    populate: "featuredImage",
    "filters[status][$eq]": "published",
  };
  if (params.tag) query["filters[tags][$containsi]"] = params.tag;
  if (typeof params.featured === "boolean") query["filters[isFeatured][$eq]"] = params.featured;

  try {
    const res = await strapiFetch<StrapiCollectionResponse<BlogPostAttributes>>(
      "/api/blog-posts",
      { query, cache: "force-cache", revalidate },
    );
    return { posts: res.data.map(transformBlogPost), meta: res.meta };
  } catch (err) {
    console.error("[strapi] getBlogPosts failed:", err);
    return { posts: [], meta: emptyMeta(page, pageSize) };
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!slug) return null;
  try {
    const res = await strapiFetch<StrapiSingleResponse<BlogPostAttributes>>(
      `/api/blog-posts/slug/${encodeURIComponent(slug)}`,
      { query: { populate: "featuredImage" }, cache: "force-cache", revalidate },
    );
    return res.data ? transformBlogPost(res.data) : null;
  } catch (err) {
    console.error("[strapi] getBlogPostBySlug failed:", { slug, err });
    return null;
  }
}

export async function getPortfolioPosts(
  params: Omit<BlogListParams, "featured"> = {},
): Promise<BlogListResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? env.client.NEXT_PUBLIC_DEFAULT_PAGE_SIZE;

  const query: Record<string, string | number | boolean> = {
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "publishedDate:desc",
    populate: "featuredImage",
    "filters[status][$eq]": "published",
  };
  if (params.tag) query["filters[tags][$containsi]"] = params.tag;
  if (params.q) query["_q"] = params.q;

  try {
    const res = await strapiFetch<StrapiCollectionResponse<BlogPostAttributes>>(
      "/api/blog-posts",
      { query, cache: "no-store", revalidate },
    );
    const all = res.data.map(transformBlogPost);
    // Portfolio page: tag filter narrows to portfolio-tagged posts; no filter shows everything
    const posts = params.tag ? all.filter((p) => isPortfolioPost(p)) : all;
    return { posts, meta: res.meta };
  } catch (err) {
    console.error("[strapi] getPortfolioPosts failed:", err);
    return { posts: [], meta: emptyMeta(page, pageSize) };
  }
}

export async function getBlogPostsOnly(
  params: Omit<BlogListParams, "featured"> = {},
): Promise<BlogListResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? env.client.NEXT_PUBLIC_DEFAULT_PAGE_SIZE;

  const query: Record<string, string | number | boolean> = {
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
    "sort[0]": "publishedDate:desc",
    populate: "featuredImage",
    "filters[status][$eq]": "published",
  };
  if (params.tag) query["filters[tags][$containsi]"] = params.tag;
  if (params.q) query["_q"] = params.q;

  try {
    const res = await strapiFetch<StrapiCollectionResponse<BlogPostAttributes>>(
      "/api/blog-posts",
      { query, cache: params.q ? "no-store" : "force-cache", revalidate },
    );
    const all = res.data.map(transformBlogPost);
    const posts = params.tag
      ? all
      : all.filter((p) => isBlogPost(p) || !isPortfolioPost(p));
    return { posts, meta: res.meta };
  } catch (err) {
    console.error("[strapi] getBlogPostsOnly failed:", err);
    return { posts: [], meta: emptyMeta(page, pageSize) };
  }
}

export async function getAvailableTags(): Promise<string[]> {
  const { posts } = await getBlogPosts({ page: 1, pageSize: 100 });
  return Array.from(new Set(posts.flatMap((p) => p.tags))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export async function getRelatedPosts(
  currentPost: BlogPost,
  limit = 3,
): Promise<BlogPost[]> {
  if (!currentPost.tags?.length) return [];
  try {
    const { posts } = await getBlogPosts({ pageSize: 20 });
    return posts
      .filter(
        (p) =>
          p.id !== currentPost.id &&
          p.tags?.some((t) =>
            currentPost.tags.some((ct) => ct.toLowerCase() === t.toLowerCase()),
          ),
      )
      .slice(0, limit);
  } catch {
    return [];
  }
}
