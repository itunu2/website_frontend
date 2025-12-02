import { env } from "@/config/env";
import { strapiFetch } from "@/lib/strapi/client";
import type {
  BlogPost,
  BlogPostAttributes,
  StrapiCollectionResponse,
  StrapiPaginationMeta,
  StrapiSingleResponse,
} from "@/lib/strapi/types";

const transformBlogPost = (entry: { id: number; attributes: BlogPostAttributes }): BlogPost => ({
  id: entry.id,
  ...entry.attributes,
});

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
    revalidate: 60,
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
      revalidate: 120,
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
