import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PostCard } from "@/components/blog/post-card";
import { TagFilter } from "@/components/blog/tag-filter";
import { Pagination } from "@/components/ui/pagination";
import { getPortfolioPosts, getAvailableTags } from "@/lib/strapi/blog";
import { PORTFOLIO_TAGS } from "@/lib/strapi/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Selected works across essays, brand stories, and editorial features by Itunu Adegbayi.",
};

interface WritingPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function WritingPage({ searchParams }: WritingPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const currentTag = params.tag;

  // Fetch portfolio posts with pagination
  const { posts, meta } = await getPortfolioPosts({
    page: currentPage,
    pageSize: 11, // 1 featured + 10 regular posts
    tag: currentTag,
  });

  // Get all available tags for filtering, filtered to portfolio tags
  const allTags = await getAvailableTags();
  const portfolioTags = allTags.filter((tag) =>
    PORTFOLIO_TAGS.some((pt) => pt.toLowerCase() === tag.toLowerCase())
  );

  // Split posts into featured and regular
  const featuredPost = currentPage === 1 && posts.length > 0 ? posts[0] : null;
  const regularPosts = currentPage === 1 && posts.length > 0 ? posts.slice(1) : posts;

  return (
    <>
      {/* Hero */}
      <Section className="bg-bg-elevated pt-32 pb-20">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-body-sm font-semibold uppercase tracking-[0.4em] text-accent-primary">
              Portfolio
            </p>
            <h1 className="mb-6 font-display text-display font-semibold leading-tight text-text-primary">
              Selected Writing
            </h1>
            <p className="text-body-lg leading-relaxed text-text-muted">
              Essays, brand stories, and editorial features exploring culture, strategy, and the human
              side of work.
            </p>
          </div>
        </Container>
      </Section>

      {/* Featured Post Section - Only on first page */}
      {featuredPost && currentPage === 1 && (
        <Section className="bg-bg-page pt-16 pb-8">
          <Container size="lg">
            <PostCard post={featuredPost} variant="featured" showLabel="Featured Work" />
          </Container>
        </Section>
      )}

      {/* Portfolio Grid */}
      <Section className="bg-bg-page">
        <Container>
          {/* Tag Filter */}
          {portfolioTags.length > 0 && <TagFilter tags={portfolioTags} currentTag={currentTag} />}

          {regularPosts.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post) => (
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
          ) : posts.length === 0 ? (
            <div className="mx-auto max-w-2xl py-12 text-center">
              <p className="text-body-lg text-text-muted">
                {currentTag
                  ? `No writing found with the tag "${currentTag}". Try a different filter.`
                  : "New writing coming soon. Check back for essays, stories, and editorial features."}
              </p>
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
