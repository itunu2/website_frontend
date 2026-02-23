"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { callsToAction } from "@/config/site";
import { staggerContainer, staggerItem } from "@/lib/motion";

export const FinalCTA = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section id="final-cta" className="relative overflow-hidden bg-bg-elevated">
      {/* Subtle texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--text-primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--text-primary) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />
      
      <Container size="lg">
        <motion.div
          className="relative mx-auto max-w-4xl"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Message */}
            <div>
              <motion.h2
                className="text-h1 font-bold mb-4 text-text-primary"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
              >
                Ready to elevate your narrative?
              </motion.h2>
              <motion.p 
                className="text-body-lg text-text-secondary leading-relaxed"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.3 }}
              >
                From brand positioning to editorial features, let's create something that resonates. I typically respond within 24 hours.
              </motion.p>
            </div>

            {/* Right: CTA */}
            <motion.div
              className="flex flex-col gap-4"
              initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.4 }}
            >
              <Button 
                href={callsToAction.primary.href} 
                size="lg"
                variant="primary"
              >
                Get in touch
              </Button>
              <Button 
                href="/writing" 
                size="lg"
                variant="secondary"
              >
                View my work
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};
