"use client";

import { motion } from "framer-motion";

/*
 * Decorative arrow — mathematically constructed plain SVG path.
 *
 * Construction method:
 * 1. Spine: single cubic Bézier from (300,20) to (160,410)
 *    with controls (320,150) and (180,280) for consistent curvature.
 * 2. Loop center: Bézier evaluated at t=0.45 → (255.3, 195.5).
 *    Entry at t=0.39, exit at t=0.51.
 * 3. Loop: two cubic arcs forming a small (~35px radius) counterclockwise
 *    ellipse, tangent-continuous at both join points.
 * 4. Pre/post-loop spine segments via de Casteljau split.
 * 5. Arrowhead rotated to match spine tangent at t=1 (99°).
 */

const ARROW_PATH = [
  "M 300 20",
  "C 307.8 70.7, 291.3 121.4, 267 172.1",
  "C 245.4 192.8, 214.6 198.1, 224.2 179.4",
  "C 233.9 160.8, 247 189.3, 242.9 218.9",
  "C 208.4 282.6, 169.8 346.3, 160 410",
].join(" ");

/* Arrowhead: filled triangle rotated to 99° (spine tangent at tip).
   40px long, 26px wide at base. */
const ARROWHEAD = "M 153.2 368.5 L 160 410 L 178.9 372.4 Z";

export default function HandDrawnArrow() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 430"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Main stroke with draw-on animation */}
      <motion.path
        d={ARROW_PATH}
        stroke="#1a1a1a"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{
          duration: 3.4,
          times: [0, 0.52, 0.76, 1],
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1.6,
        }}
      />

      {/* Solid filled arrowhead — fades in when stroke reaches tip */}
      <motion.path
        d={ARROWHEAD}
        fill="#1a1a1a"
        stroke="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{
          duration: 3.4,
          times: [0, 0.48, 0.54, 0.76, 1],
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1.6,
        }}
      />
    </svg>
  );
}
