import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PostCard } from "@/components/blog/post-card";
import { getBlogPosts } from "@/lib/strapi/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, essays, and stories by Itunu Adegbayi.",
};

export default async function BlogPage() {
  const { posts, meta } = await getBlogPosts({ pageSize: 12 });

  return (
    <>
      {/* Hero */}
      <Section className="bg-bg-elevated pt-24 pb-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-body-sm uppercase tracking-[0.4em] text-text-soft">Journal</p>
            <h1 className="mb-6 font-display text-display font-semibold text-text-primary">Blog</h1>
            <p className="text-body-lg text-text-muted">
              Thoughts, essays, and stories about culture, creativity, and craft.
            </p>
          </div>
        </Container>
      </Section>

      {/* Blog Posts */}
      <Section className="bg-bg-page">
        <Container>
          {posts.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {meta.pagination.pageCount > 1 && (
                <div className="mt-12 text-center text-body-sm text-text-muted">
                  Showing page {meta.pagination.page} of {meta.pagination.pageCount}
                </div>
              )}
            </>
          ) : (
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-body-lg text-text-muted">
                New posts coming soon. Check back for thoughts, essays, and stories.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
