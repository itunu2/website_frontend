import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PostCard } from "@/components/blog/post-card";
import { getBlogPosts } from "@/lib/strapi/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Selected works across essays, brand stories, and editorial features by Itunu Adegbayi.",
};

export default async function WritingPage() {
  const { posts } = await getBlogPosts({ pageSize: 12 });

  return (
    <>
      {/* Hero */}
      <Section className="bg-bg-elevated pt-24 pb-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-body-sm uppercase tracking-[0.4em] text-text-soft">Portfolio</p>
            <h1 className="mb-6 font-display text-display font-semibold text-text-primary">
              Selected Writing
            </h1>
            <p className="text-body-lg text-text-muted">
              Essays, brand stories, and editorial features exploring culture, strategy, and the human
              side of work.
            </p>
          </div>
        </Container>
      </Section>

      {/* Writing Grid */}
      <Section className="bg-bg-page">
        <Container>
          {posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-body-lg text-text-muted">
                New writing coming soon. Check back for essays, stories, and editorial features.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
