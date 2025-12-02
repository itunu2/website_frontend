import { Hero } from "@/components/home/hero";
import { FeaturedWriting } from "@/components/home/featured-writing";
import { WhatIWrite } from "@/components/home/what-i-write";
import { Testimonials } from "@/components/home/testimonials";
import { AboutTeaser } from "@/components/home/about-teaser";
import { FinalCTA } from "@/components/home/final-cta";
import { getBlogPosts } from "@/lib/strapi/blog";

export default async function Home() {
  // Fetch featured posts from Strapi
  const { posts: featuredPosts } = await getBlogPosts({ featured: true, pageSize: 3 });

  // If no featured posts, fetch latest 3
  const displayPosts =
    featuredPosts.length > 0 ? featuredPosts : (await getBlogPosts({ pageSize: 3 })).posts;

  return (
    <>
      <Hero />
      <FeaturedWriting posts={displayPosts} />
      <WhatIWrite />
      <Testimonials />
      <AboutTeaser />
      <FinalCTA />
    </>
  );
}
