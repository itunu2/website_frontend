"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const services = [
  {
    id: 1,
    title: "Essays",
    description:
      "Long-form writing on culture, creativity, and ideas. Thoughtful, researched, personal.",
    number: "01",
  },
  {
    id: 2,
    title: "Brand Strategy",
    description:
      "Positioning, messaging, and voice development. Helping organizations clarify who they are and why it matters.",
    number: "02",
  },
  {
    id: 3,
    title: "Editorial",
    description:
      "Features, profiles, and reported pieces for publications. Stories that inform and connect.",
    number: "03",
  },
  {
    id: 4,
    title: "Content Systems",
    description:
      "Frameworks and processes for consistent, strategic communication at scale.",
    number: "04",
  },
];

export const WhatIWrite = () => {
  return (
    <Section id="what-i-write" className="bg-bg-surface">
      <Container>
        {/* Centered Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block text-caption font-semibold text-sage-primary mb-3">
            Services
          </span>
          <h2 className="text-h1 font-bold text-text-primary mb-4">
            What I Write
          </h2>
          <p className="text-body-lg text-text-secondary leading-relaxed">
            From personal essays to brand narratives, I work across formats and contexts.
          </p>
        </motion.div>

        {/* Refined Grid - Minimal Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="group h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <div className="relative h-full p-10 rounded-2xl bg-bg-surface border border-border-default hover:border-accent-primary/50 transition-all duration-400 flex flex-col">
                {/* Number indicator */}
                <div className="mb-6">
                  <span className="text-[4rem] font-bold text-accent-primary/10 leading-none select-none">
                    {service.number}
                  </span>
                </div>

                <h3 className="text-h3 font-bold text-text-primary mb-3 tracking-tight">
                  {service.title}
                </h3>
                
                <p className="text-body text-text-secondary leading-relaxed grow">
                  {service.description}
                </p>

                {/* Subtle hover indicator */}
                <div className="mt-8 h-0.5 w-12 bg-accent-primary/0 group-hover:bg-accent-primary group-hover:w-20 transition-all duration-400" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Diagonal separator for visual interest */}
        <div className="relative mt-24 mb-12">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border-default" style={{ transform: 'rotate(-0.5deg)' }} />
          </div>
        </div>
      </Container>
    </Section>
  );
};
