"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";

const EASE = [0.16, 1, 0.3, 1] as const;

interface TestimonialQuoteProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  variant?: "cream" | "white";
}

export const TestimonialQuote = ({
  quote,
  name,
  title,
  company,
  variant = "cream",
}: TestimonialQuoteProps) => {
  const off = !!useReducedMotion();
  const bg = variant === "cream" ? "bg-bg-page" : "bg-bg-surface";

  return (
    <section className={`${bg} py-8 sm:py-12 md:py-20`}>
      <Container className="max-w-[740px]">
        <motion.figure
          className="relative"
          initial={off ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          {/* Accent bar + quote */}
          <div className="flex gap-4 sm:gap-6 md:gap-8">
            <div className="mt-1 hidden w-px shrink-0 bg-accent-primary/30 sm:block" aria-hidden />
            <div>
              {/* Quote text */}
              <blockquote className="font-display text-[1.125rem] leading-[1.6] text-text-primary sm:text-[1.25rem] md:text-[1.5rem] md:leading-[1.55]">
                &ldquo;{quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <figcaption className="mt-5">
                <span className="block font-accent text-[1.25rem] text-accent-primary">
                  {name}
                </span>
                <span className="mt-1 block text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-text-tertiary">
                  {title}, {company}
                </span>
              </figcaption>
            </div>
          </div>
        </motion.figure>
      </Container>
    </section>
  );
};
