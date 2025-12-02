import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Prose } from "@/components/ui/prose";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/strapi/blog";
import { parseMarkdown } from "@/lib/markdown";
import { siteRoutes } from "@/config/site";
import type { Metadata } from "next";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { posts } = await getBlogPosts({ pageSize: 100 });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const estimateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImageData = post.featuredImage?.data;

  return (
    <>
      {/* Header */}
      <Section className="bg-bg-elevated pt-24 pb-12">
        <Container>
          <article className="mx-auto max-w-3xl">
            {post.tags && post.tags.length > 0 && (
              <p className="mb-4 text-body-sm uppercase tracking-wider text-text-soft">
                {post.tags[0]}
              </p>
            )}

            <h1 className="mb-6 font-display text-display font-semibold text-text-primary">
              {post.title}
            </h1>

            {post.description && (
              <p className="mb-6 text-body-lg text-text-muted">{post.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-body-sm text-text-soft">
              <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
              <span>·</span>
              <span>{estimateReadingTime(post.content)}</span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
          </article>
        </Container>
      </Section>

      {/* Featured Image */}
      {featuredImageData && (
        <Section className="bg-bg-page pt-0">
          <Container>
            <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-2xl">
              <Image
                src={featuredImageData.attributes.url}
                alt={featuredImageData.attributes.alternativeText || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Container>
        </Section>
      )}

      {/* Content */}
      <Section className="bg-bg-page">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Prose>
              <div dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }} />
            </Prose>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <Section className="bg-bg-soft">
        <Container>
          <div className="mx-auto max-w-3xl border-t border-border-subtle pt-8">
            <div className="flex items-center justify-between">
              <Link
                href={siteRoutes.blog}
                className="text-body text-accent-primary transition-colors hover:text-accent-strong"
              >
                ← Back to blog
              </Link>

              <Button href={siteRoutes.contact} variant="secondary" size="sm">
                Get in touch
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
