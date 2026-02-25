import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/post-card";
import { getBlogPostBySlug, getBlogPosts, getRelatedPosts } from "@/lib/strapi/blog";
import { MarkdownContent } from "@/components/markdown/markdown-content";
import { BlogNewsletterCta } from "@/components/newsletter/blog-newsletter-cta";
import { siteRoutes } from "@/config/site";
import type { Metadata } from "next";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const { posts } = await getBlogPosts({ pageSize: 100 });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
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
  const relatedPosts = await getRelatedPosts(post, 3);

  return (
    <>
      {/* Header */}
      <Section className="bg-bg-elevated pt-20 pb-10 md:pt-24 md:pb-12">
        <Container>
          <article className="mx-auto max-w-3xl">
            {post.tags && post.tags.length > 0 && (
              <p className="mb-4 text-body-sm uppercase tracking-wider text-text-tertiary">
                {post.tags[0]}
              </p>
            )}

            <h1 className="mb-6 font-display text-display text-text-primary">
              {post.title}
            </h1>

            {post.description && (
              <p className="mb-6 text-body-lg text-text-secondary">{post.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-body-sm text-text-tertiary">
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
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"
              />
            </div>
          </Container>
        </Section>
      )}

      {/* Content */}
      <Section className="bg-bg-page">
        <Container>
          <div className="mx-auto max-w-3xl">
            <MarkdownContent content={post.content} />
            <div className="mt-12">
              <BlogNewsletterCta />
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section className="bg-bg-page border-t border-border-subtle">
          <Container>
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-8 text-h3 font-semibold text-text-primary">Related Posts</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <PostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Footer Navigation */}
      <Section className="bg-bg-elevated">
        <Container>
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-body-sm text-text-secondary">
                <li>
                  <Link href={siteRoutes.home} className="hover:text-accent-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href={siteRoutes.blog} className="hover:text-accent-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>/</li>
                <li className="text-text-primary">{post.title}</li>
              </ol>
            </nav>

            <div className="border-t border-border-subtle pt-8">
              <div className="flex items-center justify-between">
                <Link
                  href={siteRoutes.blog}
                  className="text-body text-accent-primary transition-colors hover:text-accent-hover"
                >
                  ← Back to blog
                </Link>

                <Button href={siteRoutes.contact} variant="secondary" size="sm">
                  Get in touch
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
