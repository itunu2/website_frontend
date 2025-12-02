"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteRoutes } from "@/config/site";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

export const AboutTeaser = () => {
  return (
    <Section id="about-teaser" className="bg-bg-elevated">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Image + Heading */}
          <motion.div
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Profile Picture */}
            <div className="relative w-64 h-80 mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-xl ring-1 ring-border-default bg-bg-subtle">
              <Image 
                src="/itunu_picture.jpg" 
                alt="Itunu Adegbayi"
                width={256}
                height={320}
                className="w-full h-full object-cover object-center"
                quality={90}
              />
            </div>
            
            <div className="text-center lg:text-left">
              <span className="inline-block text-caption font-semibold text-accent-primary mb-3">
                Background
              </span>
              <h2 className="text-h1 font-bold text-text-primary mb-6">
                Writing at the intersection of culture and commerce
              </h2>
              <Button href={siteRoutes.about} variant="secondary" size="md">
                Full story
              </Button>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-6 text-body-lg leading-relaxed text-text-secondary">
              <p>
                Eight years working across editorial and brand contexts—from B2B startups to cultural magazines. My work sits at the intersection of strategy and craft.
              </p>

              <p>
                I approach writing structurally: understanding narrative architecture before choosing words. The goal is always clarity that resonates, not decoration that distracts.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};
