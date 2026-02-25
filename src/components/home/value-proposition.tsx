"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { PaintedWord } from "@/components/ui/painted-word";
import { valuePropositionContent } from "@/config/homepage";

const EASE = [0.16, 1, 0.3, 1] as const;

export const ValueProposition = () => {
  const off = !!useReducedMotion();

  return (
    <section
      id="value-proposition"
      className="section-edge-top relative bg-bg-page py-12 sm:py-20 md:py-32"
      style={{ "--edge-from": "var(--bg-surface)" } as React.CSSProperties}
    >
      <Container>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-20">
          {/* Left — headline + accent rule */}
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-28"
            initial={off ? undefined : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2 className="font-display text-h2 leading-tight text-text-primary sm:text-h1 md:text-display">
              {valuePropositionContent.headline}{" "}
              <PaintedWord variant="convert">{valuePropositionContent.highlightWord}</PaintedWord>.
            </h2>
            <div className="mt-6 h-px w-16 bg-accent-primary/40" aria-hidden />
          </motion.div>

          {/* Right — prose */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {valuePropositionContent.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  className="max-w-[560px] text-[0.9375rem] leading-[1.8] text-text-secondary sm:text-[1.0625rem]"
                  initial={off ? undefined : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + i * 0.1,
                    ease: EASE,
                  }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
