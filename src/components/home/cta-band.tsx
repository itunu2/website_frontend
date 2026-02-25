"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ctaBandContent } from "@/config/homepage";

const EASE = [0.16, 1, 0.3, 1] as const;

export const CTABand = () => {
  const off = !!useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-bg-dark py-14 sm:py-24 md:py-36">
      {/* Background depth layers */}
      {/* Subtle amber radial glow — top center */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 opacity-[0.06]"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--accent-primary), transparent 70%)",
        }}
        aria-hidden
      />
      {/* Vignette — bottom edges */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
        aria-hidden
      />
      {/* Grain overlay on dark */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
        aria-hidden
      />

      <Container className="relative z-10 max-w-[680px] text-center">
        {/* Headline */}
        <motion.h2
          className="font-display text-h2 leading-tight text-bg-page sm:text-h1 md:text-display"
          initial={off ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {ctaBandContent.headline}
        </motion.h2>

        {/* Body */}
        <motion.p
          className="mx-auto mt-5 max-w-md text-[0.9375rem] leading-[1.75] text-bg-page/60 sm:mt-6 sm:text-[1.0625rem]"
          initial={off ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          {ctaBandContent.body}
        </motion.p>

        {/* CTA — amber, bold, lifted */}
        <motion.div
          className="mt-8 sm:mt-10"
          initial={off ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        >
          <Button
            href={ctaBandContent.buttonHref}
            variant="accent"
            size="lg"
          >
            {ctaBandContent.buttonLabel}
          </Button>
        </motion.div>

        {/* Subtle amber rule — signals finality */}
        <motion.div
          className="mx-auto mt-10 h-px w-16 bg-accent-primary/25 sm:mt-16"
          initial={off ? undefined : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          aria-hidden
        />
      </Container>
    </section>
  );
};
