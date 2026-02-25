"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { PaintedWord } from "@/components/ui/painted-word";
import { aboutTeaserContent } from "@/config/homepage";

const EASE = [0.16, 1, 0.3, 1] as const;

export const AboutTeaser = () => {
  const off = !!useReducedMotion();

  return (
    <section
      id="about-teaser"
      className="section-edge-top relative bg-bg-surface py-12 sm:py-20 md:py-32"
      style={{ "--edge-from": "var(--bg-elevated)" } as React.CSSProperties}
    >
      <Container>
        {/* ── Eyebrow ── */}
        <motion.span
          className="mb-5 block text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
          initial={off ? undefined : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Get to Know Me
        </motion.span>

        {/* ── Big headline — full width, dominant ── */}
        <motion.h2
          className="mb-8 max-w-[740px] font-display text-h2 leading-tight text-text-primary sm:mb-12 sm:text-h1 md:mb-16 md:text-display"
          initial={off ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {aboutTeaserContent.label}{" "}
          <br className="hidden md:block" />
          <PaintedWord variant="human">{aboutTeaserContent.headline}</PaintedWord>
        </motion.h2>

        {/* ── Photo + Narrative side by side ── */}
        <div className="grid grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Photo */}
          <motion.div
            className="lg:col-span-5"
            initial={off ? undefined : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[340px]">
              {/* Warm backdrop glow */}
              <div className="absolute inset-0 translate-y-[5%] scale-[0.85] rounded-full bg-accent-primary/[0.06] blur-3xl" aria-hidden />
              <div className="absolute inset-0 translate-y-[10%] scale-[0.65] rounded-full bg-bg-warm/40 blur-2xl" aria-hidden />
              {/* Portrait with soft edge fade */}
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/itunu_picture.PNG"
                  alt="Itunu Adegbayi"
                  width={340}
                  height={453}
                  className="h-full w-full object-contain object-top drop-shadow-[0_8px_24px_rgba(28,25,23,0.08)]"
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 340px"
                  quality={92}
                  priority
                  style={{
                    maskImage: "radial-gradient(ellipse 76% 72% at 50% 40%, black 62%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 76% 72% at 50% 40%, black 62%, transparent 100%)",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Narrative */}
          <motion.div
            className="lg:col-span-7"
            initial={off ? undefined : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {/* Pull-quote — first paragraph */}
            <blockquote className="border-l-2 border-accent-primary/50 pl-4 sm:pl-5">
              <p className="font-display text-[1.0625rem] italic leading-[1.65] text-text-primary/85 sm:text-[1.1875rem] md:text-[1.3125rem]">
                {aboutTeaserContent.paragraphs[0]}
              </p>
            </blockquote>

            {/* Remaining paragraphs */}
            <div className="mt-5 space-y-4 sm:mt-7 sm:space-y-5">
              {aboutTeaserContent.paragraphs.slice(1).map((p, i) => (
                <motion.p
                  key={i}
                  className="text-[0.9375rem] leading-[1.75] text-text-secondary sm:text-[1.0625rem]"
                  initial={off ? undefined : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: EASE }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Sign-off */}
            <motion.p
              className="mt-6 font-display text-[1.5rem] leading-tight text-accent-primary sm:mt-8 sm:text-[1.75rem] md:text-[2rem]"
              initial={off ? undefined : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
            >
              {aboutTeaserContent.signoff}
            </motion.p>

            <p className="mt-3 text-[0.9375rem] text-text-secondary sm:mt-4 sm:text-[1.0625rem]">
              {aboutTeaserContent.linkPrefix}{" "}
              <Link
                href={aboutTeaserContent.linkHref}
                className="font-semibold text-accent-primary underline decoration-accent-primary/30 underline-offset-4 transition-colors hover:decoration-accent-primary"
              >
                {aboutTeaserContent.linkText}
              </Link>
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
