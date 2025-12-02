/**
 * Animation variants and utilities for Framer Motion
 * Following luxury 2025 design system motion principles
 */

import type { Variants, Transition } from "framer-motion";

// Easing curves
export const ease = {
  out: [0.33, 1, 0.68, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
} as const;

// Durations (in seconds)
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.22,
  slow: 0.32,
  slower: 0.5,
} as const;

// Fade + Translate Up (entrance animation)
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: ease.out,
    },
  },
};

// Fade In (simple)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: ease.out,
    },
  },
};

// Scale + Fade (for modals, cards)
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: ease.out,
    },
  },
};

// Stagger container for children
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger item (use with staggerContainer)
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: ease.out,
    },
  },
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -24,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slow,
      ease: ease.out,
    },
  },
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 24,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slow,
      ease: ease.out,
    },
  },
};

// Card hover animation props
export const cardHover = {
  whileHover: {
    y: -4,
    boxShadow: "var(--shadow-lift)",
    transition: {
      duration: duration.fast,
      ease: ease.out,
    },
  },
  whileTap: {
    scale: 0.98,
  },
};

// Button hover animation props
export const buttonHover = {
  whileHover: {
    scale: 1.02,
    boxShadow: "var(--shadow-lg)",
    transition: {
      duration: duration.fast,
      ease: ease.out,
    },
  },
  whileTap: {
    scale: 0.98,
  },
};

// Link underline animation
export const linkUnderline = {
  rest: {
    width: "0%",
  },
  hover: {
    width: "100%",
    transition: {
      duration: duration.normal,
      ease: ease.out,
    },
  },
};

// Viewport scroll trigger options
export const viewportOnce = {
  once: true,
  amount: 0.3,
  margin: "0px 0px -100px 0px",
} as const;

export const viewportDefault = {
  once: false,
  amount: 0.3,
} as const;

// Transition presets
export const transition = {
  fast: {
    duration: duration.fast,
    ease: ease.out,
  } as Transition,
  normal: {
    duration: duration.normal,
    ease: ease.out,
  } as Transition,
  slow: {
    duration: duration.slow,
    ease: ease.out,
  } as Transition,
  bounce: {
    duration: duration.normal,
    ease: ease.bounce,
  } as Transition,
};
