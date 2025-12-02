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
