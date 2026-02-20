import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PostCard } from "@/components/blog/post-card";
import { TagFilter } from "@/components/blog/tag-filter";
import { Pagination } from "@/components/ui/pagination";
import { getBlogPostsOnly, getAvailableTags } from "@/lib/strapi/blog";
import { BLOG_TAGS } from "@/lib/strapi/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, essays, and stories by Itunu Adegbayi.",
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentTag = params.tag;

  // Fetch blog posts with pagination
  const { posts, meta } = await getBlogPostsOnly({
    page: currentPage,
    pageSize: 12,
    tag: currentTag,
  });

  // Get all available tags for filtering, filtered to blog tags
  const allTags = await getAvailableTags();
  const blogTags = allTags.filter((tag) =>
    BLOG_TAGS.some((bt) => bt.toLowerCase() === tag.toLowerCase())
  );

  return (
    <>
      {/* Hero */}
      <Section className="bg-bg-elevated pt-32 pb-20">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-body-sm font-semibold uppercase tracking-[0.4em] text-accent-primary">
              Journal
            </p>
            <h1 className="mb-6 font-display text-display font-semibold leading-tight text-text-primary">Blog</h1>
            <p className="text-body-lg leading-relaxed text-text-muted">
              Thoughts, essays, and stories about culture, creativity, and craft.
            </p>
          </div>
        </Container>
      </Section>

      {/* Blog Posts */}
      <Section className="bg-bg-page">
        <Container>
          {/* Tag Filter */}
          {blogTags.length > 0 && <TagFilter tags={blogTags} currentTag={currentTag} />}

          {posts.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={meta.pagination.page}
                totalPages={meta.pagination.pageCount}
                totalItems={meta.pagination.total}
              />
            </>
          ) : (
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-body-lg text-text-muted">
                {currentTag
                  ? `No posts found with the tag "${currentTag}". Try a different filter.`
                  : "New posts coming soon. Check back for thoughts, essays, and stories."}
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
