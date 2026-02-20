"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PostCard } from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/strapi/types";

interface FeaturedWritingProps {
  posts: BlogPost[];
}

export const FeaturedWriting = ({ posts }: FeaturedWritingProps) => {
  if (posts.length === 0) {
    return null;
  }

  const displayPosts = posts.slice(0, 3);
  const isSinglePost = displayPosts.length === 1;

  return (
    <Section id="featured-writing" className="bg-bg-page">
      <Container size={isSinglePost ? "lg" : "xl"}>
        {/* Creative Header with Side-by-Side Layout */}
        <motion.div 
          className="mb-16 grid gap-12 lg:grid-cols-2 lg:gap-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left: Headline */}
          <div>
            <motion.span 
              className="mb-4 inline-block text-caption font-bold uppercase tracking-[0.2em] text-accent-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Latest Work
            </motion.span>
            <motion.h2 
              className="font-display text-display font-bold leading-tight text-text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Recent Writing
            </motion.h2>
          </div>
          
          {/* Right: Description + CTA */}
          <motion.div 
            className="flex flex-col justify-end gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-body-lg leading-[1.8] text-text-muted">
              Exploring the intersection of culture, creativity, and commerce through essays, brand narratives, and editorial investigations.
            </p>
            <div>
              <Button href="/writing" variant="secondary" size="md" className="group">
                <span>View All Writing</span>
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Dynamic Content Layout */}
        {isSinglePost ? (
          // Single Post: Featured Hero Layout
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <PostCard post={displayPosts[0]} variant="featured" showLabel="Featured" />
          </motion.div>
        ) : (
          // Multiple Posts: Masonry-style Grid
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
            {displayPosts.map((post, index) => {
              // Create an interesting asymmetric layout
              const gridClass = index === 0 
                ? "lg:col-span-7" 
                : index === 1 
                ? "lg:col-span-5" 
                : "lg:col-span-12";
              
              return (
                <motion.div
                  key={post.id}
                  className={gridClass}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                >
                  <PostCard 
                    post={post} 
                    variant={index === 0 ? "featured" : "standard"}
                    showLabel={index === 0 ? "Featured" : undefined}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
};
