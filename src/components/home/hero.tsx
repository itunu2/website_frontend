"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { callsToAction, siteIdentity } from "@/config/site";

export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  return (
    <section 
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-bg-surface"
    >
      {/* Ambient background with noise texture */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <Container>
        <motion.div
          className="relative max-w-6xl mx-auto"
          style={{ opacity, scale, y }}
        >
          {/* Kinetic Typography Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left: Main headline - Asymmetric */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                <motion.span 
                  className="inline-block text-caption font-semibold text-accent-primary"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {siteIdentity.role}
                </motion.span>
                
                <h1 className="text-display font-bold text-text-primary">
                  <motion.span
                    className="block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {siteIdentity.fullName.split(" ")[0]}
                  </motion.span>
                  <motion.span
                    className="block text-accent-primary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {siteIdentity.fullName.split(" ")[1]}
                  </motion.span>
                </h1>
              </motion.div>

              <motion.p
                className="text-body-lg text-text-secondary leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                Essays, brand work, and editorial—writing that cuts through and connects.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button href={callsToAction.secondary.href} size="lg">
                  {callsToAction.secondary.label}
                </Button>
                <Button href={callsToAction.primary.href} size="lg" variant="secondary">
                  {callsToAction.primary.label}
                </Button>
              </motion.div>
            </div>

            {/* Right: Space for future content - removed confusing geometric element */}
            <div className="lg:col-span-5" />
          </div>
        </motion.div>
      </Container>

      {/* Scroll indicator with click handler */}
      <motion.button
        onClick={() => {
          const nextSection = document.getElementById('featured-writing');
          nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform duration-300"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
        aria-label="Scroll to content"
      >
        <div className="flex flex-col items-center gap-2 text-text-tertiary hover:text-accent-primary transition-colors">
          <span className="text-caption">Explore</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.button>
    </section>
  );
};
