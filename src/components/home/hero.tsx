"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { PaintedWord } from "@/components/ui/painted-word";
import { ScrollChevron } from "@/components/ui/scroll-chevron";
import { LogoMarquee } from "@/components/ui/logo-marquee";
import { heroContent, socialProofLogos } from "@/config/homepage";

const EASE = [0.16, 1, 0.3, 1] as const;

export const Hero = () => {
  const off = !!useReducedMotion();

  const reveal = (delay: number) =>
    off
      ? {}
      : {
          initial: { opacity: 0, y: 30 } as const,
          animate: { opacity: 1, y: 0 } as const,
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section className="relative flex min-h-[85svh] flex-col justify-center overflow-hidden bg-bg-page pt-16 pb-24 sm:pt-20 sm:pb-32 md:min-h-[94vh]">
      <Container className="relative z-10">
        <div className="max-w-[780px]">
          {/* Eyebrow */}
          <motion.p
            className="mb-6 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary md:mb-8"
            {...reveal(0)}
          >
            {heroContent.eyebrow}
          </motion.p>

          {/* Headline — large serif */}
          <motion.h1
            className="font-display text-display leading-[1.06] text-text-primary"
            {...reveal(0.06)}
          >
            {heroContent.headline}
            <br />
            <span className="inline-block mt-1">
              <PaintedWord variant="human">
                {heroContent.highlightWord}
              </PaintedWord>
              <span className="text-accent-primary">.</span>
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            className="mt-7 max-w-[520px] text-body-lg leading-[1.75] text-text-secondary md:mt-8"
            {...reveal(0.18)}
          >
            {heroContent.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            {...reveal(0.3)}
          >
            <Button href={heroContent.primaryCta.href} size="lg" variant="primary">
              {heroContent.primaryCta.label}
            </Button>
            <Button href={heroContent.secondaryCta.href} size="lg" variant="secondary">
              {heroContent.secondaryCta.label}
            </Button>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-32 left-1/2 hidden -translate-x-1/2 sm:block"
        {...reveal(0.5)}
      >
        <ScrollChevron />
      </motion.div>

      {/* Logo marquee */}
      <motion.div className="absolute inset-x-0 bottom-0 pb-5 md:pb-7" {...reveal(0.4)}>
        <LogoMarquee logos={socialProofLogos} label={heroContent.socialProofLabel} />
      </motion.div>
    </section>
  );
};
