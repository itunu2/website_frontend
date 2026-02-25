"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { PaintedWord } from "@/components/ui/painted-word";
import { painPointsContent } from "@/config/homepage";

const EASE = [0.16, 1, 0.3, 1] as const;

export const PainPoints = () => {
  const off = !!useReducedMotion();

  return (
    <section
      id="pain-points"
      className="section-edge-top relative bg-bg-surface py-12 sm:py-20 md:py-32"
      style={{ "--edge-from": "var(--bg-page)" } as React.CSSProperties}
    >
      <Container>
        {/* Headline */}
        <motion.div
          className="mb-10 max-w-[600px] sm:mb-16 md:mb-24"
          initial={off ? undefined : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <h2 className="font-display text-h2 leading-tight text-text-primary sm:text-h1 md:text-display">
            {painPointsContent.headline}{" "}
            <PaintedWord variant="rightPlace">{painPointsContent.highlightWord}</PaintedWord>.
          </h2>
        </motion.div>

        {/* Alternating zigzag items */}
        <div className="space-y-8 sm:space-y-14 md:space-y-20">
          {painPointsContent.items.map((item, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={item.id}
                className={`grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-12 ${
                  isEven ? "" : "md:text-right"
                }`}
                initial={off ? undefined : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: 0.06,
                  ease: EASE,
                }}
              >
                {/* Number — alternates side */}
                <div
                  className={`flex items-start md:col-span-3 ${
                    isEven ? "md:order-1" : "md:order-2 md:justify-end"
                  }`}
                >
                  <span className="font-display text-[3.5rem] leading-none text-accent-primary/10 sm:text-[5rem] md:text-[7rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content — alternates side */}
                <div
                  className={`md:col-span-9 ${
                    isEven
                      ? "md:order-2 md:border-l md:border-border-default md:pl-10"
                      : "md:order-1 md:border-r md:border-border-default md:pr-10 md:text-left"
                  }`}
                >
                  <h3 className="font-display text-[1.25rem] leading-[1.2] text-text-primary sm:text-[1.5rem] md:text-[1.875rem]">
                    {item.headline}
                  </h3>
                  <p className="mt-3 max-w-[520px] text-[0.9375rem] leading-[1.75] text-text-secondary sm:mt-4 sm:text-[1.0625rem]">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
