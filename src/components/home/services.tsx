"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { PaintedWord } from "@/components/ui/painted-word";
import { servicesContent } from "@/config/homepage";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Accordion row with number ─────────────────────────────── */
const AccordionRow = ({
  service,
  isOpen,
  onToggle,
  index,
  off,
}: {
  service: (typeof servicesContent.items)[number];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  off: boolean;
}) => (
  <motion.div
    className="border-b border-border-default"
    initial={off ? undefined : { opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
  >
    <button
      type="button"
      onClick={onToggle}
      className="group flex w-full items-center gap-4 py-4 text-left sm:gap-5 sm:py-5 md:py-6"
      aria-expanded={isOpen}
    >
      {/* Number */}
      <span className="text-[0.75rem] font-semibold tabular-nums tracking-[0.06em] text-text-tertiary transition-colors duration-200 group-hover:text-accent-primary">
        {service.number}
      </span>

      {/* Title */}
      <span className="flex-1 font-display text-[1.0625rem] leading-snug text-text-primary transition-colors duration-200 group-hover:text-accent-primary md:text-[1.1875rem]">
        {service.title}
      </span>

      {/* Toggle icon */}
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm leading-none transition-all duration-300 ${
          isOpen
            ? "rotate-45 border-accent-primary bg-accent-primary text-white"
            : "border-border-default text-text-tertiary group-hover:border-accent-primary group-hover:text-accent-primary"
        }`}
        aria-hidden
      >
        +
      </span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="overflow-hidden"
        >
          <p className="pb-6 pl-[calc(0.75rem+1.25rem+0.75rem)] pr-8 text-[0.9375rem] leading-relaxed text-text-secondary md:pl-[calc(0.75rem+1.25rem+1.25rem)]">
            {service.description}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

/* ── Section ───────────────────────────────────────────────── */
export const Services = () => {
  const [openId, setOpenId] = useState<number | null>(1);
  const off = !!useReducedMotion();

  return (
    <section
      id="services"
      className="section-edge-top relative bg-bg-elevated py-12 sm:py-20 md:py-32"
      style={{ "--edge-from": "var(--bg-page)" } as React.CSSProperties}
    >
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — heading + supporting content */}
          <motion.div
            className="lg:col-span-5"
            initial={off ? undefined : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <h2 className="font-display text-h2 leading-tight text-text-primary sm:text-h1 md:text-display">
              {servicesContent.headline}{" "}
              <PaintedWord variant="help">{servicesContent.highlightWord}</PaintedWord>{" "}
              You?
            </h2>

            <p className="mt-4 max-w-[400px] text-[0.9375rem] leading-[1.75] text-text-secondary sm:mt-5 sm:text-[1.0625rem]">
              I specialise in B2B SaaS and Martech content that drives pipeline,
              not just page views. Here&apos;s what that looks like in practice.
            </p>

            {/* Mini stats — fills the left column */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-6">
              {[
                { stat: "7+", label: "Years of experience" },
                { stat: "50+", label: "SaaS brands served" },
                { stat: "34%", label: "Avg. conversion lift" },
                { stat: "2x", label: "Pipeline acceleration" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={off ? undefined : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
                >
                  <span className="block font-display text-[1.5rem] text-accent-primary sm:text-[1.75rem] md:text-[2rem]">
                    {s.stat}
                  </span>
                  <span className="mt-1 block text-[0.75rem] font-medium uppercase tracking-[0.08em] text-text-tertiary">
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — accordion */}
          <div className="lg:col-span-7">
            <div className="border-t border-border-default">
              {servicesContent.items.map((service, i) => (
                <AccordionRow
                  key={service.id}
                  service={service}
                  isOpen={openId === service.id}
                  onToggle={() =>
                    setOpenId((prev) =>
                      prev === service.id ? null : service.id,
                    )
                  }
                  index={i}
                  off={off}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
