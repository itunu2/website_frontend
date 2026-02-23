"use client";

import { motion, useReducedMotion } from "framer-motion";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { fadeInUp } from "@/lib/motion";

export const BlogNewsletterCta = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      variants={shouldReduceMotion ? undefined : fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="rounded-xl border border-border-default bg-bg-surface p-6 shadow-sm md:p-8"
    >
      <h2 className="mb-2 font-display text-h3 font-semibold text-text-primary">
        Enjoyed this piece?
      </h2>
      <p className="mb-5 text-body text-text-secondary">
        Get the next essay straight to your inbox.
      </p>
      <NewsletterForm source="blog-cta" buttonLabel="Subscribe" layout="inline" />
    </motion.section>
  );
};
