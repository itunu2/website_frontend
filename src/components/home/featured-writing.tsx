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

  return (
    <Section id="featured-writing" className="bg-bg-page">
      <Container>
        {/* Asymmetric Section Header with Slide-in Animation */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lg:col-span-5">
            <motion.span 
              className="inline-block text-caption font-semibold text-accent-primary mb-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Latest Work
            </motion.span>
            <motion.h2 
              className="text-h1 font-bold text-text-primary mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Recent Writing
            </motion.h2>
          </div>
          
          <motion.div 
            className="lg:col-span-7 flex items-end"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-body-lg text-text-secondary leading-relaxed">
              Exploring the intersection of culture, creativity, and commerce through essays, brand narratives, and editorial investigations.
            </p>
          </motion.div>
        </motion.div>

        {/* Bento Grid Layout - Asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {posts.map((post, index) => {
            // First post takes 2 columns on large screens
            const isHero = index === 0;
            const gridClass = isHero 
              ? "md:col-span-2 md:row-span-2" 
              : "";
            
            return (
              <motion.div
                key={post.id}
                className={gridClass}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <PostCard post={post} variant={isHero ? "featured" : "default"} />
              </motion.div>
            );
          })}
          
          {/* CTA Card - Refined */}
          <motion.a
            href="/writing"
            className="bg-accent-primary/5 p-10 rounded-2xl flex flex-col justify-between border border-accent-primary/10 hover:border-accent-primary/30 transition-colors duration-300 group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ 
              duration: 0.5, 
              delay: posts.length * 0.1,
              ease: [0.16, 1, 0.3, 1] 
            }}
          >
            <div>
              <h3 className="text-h3 font-bold text-text-primary mb-3">
                Full Archive
              </h3>
              <p className="text-text-secondary text-body leading-relaxed">
                Browse all essays, brand work, and editorial pieces.
              </p>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-accent-primary font-semibold group-hover:gap-3 transition-all duration-300">
              <span>View all</span>
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.a>
        </div>
      </Container>
    </Section>
  );
};
