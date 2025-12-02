"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeInUp, viewportOnce } from "@/lib/motion";

/**
 * Animated container that fades in and slides up on scroll
 * Use for section-level entrances
 */
export const AnimatedSection = ({
  children,
  className,
  delay = 0,
  ...props
}: HTMLMotionProps<"section"> & { delay?: number }) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
};

/**
 * Animated div with fade + slide up
 * Use for individual elements
 */
export const AnimatedDiv = ({
  children,
  className,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
