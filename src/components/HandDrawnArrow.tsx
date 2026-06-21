"use client";

import React, { useRef, useLayoutEffect, useState, useCallback } from "react";
import { motion, type Transition } from "framer-motion";

// ── Arrowhead geometry ─────────────────────────────────────────────────
const OVERLAP = 9;   // base sits OVERLAP px behind end-point, hides seam
const TIP_LEN = 26;  // arrowhead length (forward along tangent)
const HALF_W  = 13;  // arrowhead half-width at base (perpendicular)

// ── Timing — single source of truth ───────────────────────────────────
const DRAW_DURATION  = 0.75; // seconds; head delay is always derived from this
const HOLD_DURATION  = 0.50;
const ERASE_DURATION = 0.50;
const TOTAL          = DRAW_DURATION + HOLD_DURATION + ERASE_DURATION; // 1.75
const REPEAT_DELAY   = 0.75;

// Head starts at drawDuration - 0.12 so it pops in as the stroke completes
const HEAD_DELAY = DRAW_DURATION - 0.12; // 0.63 — always derived, never hardcoded

// Normalise seconds → fraction of TOTAL
const n = (s: number): number => +(s / TOTAL).toFixed(5);

// Stroke keyframe positions (4 keyframes)
const T_DRAW = n(DRAW_DURATION);
const T_HOLD = n(DRAW_DURATION + HOLD_DURATION);

// Head keyframe positions (6 keyframes each)
const T_HEAD_START  = n(HEAD_DELAY);
const T_OPAC_END    = n(HEAD_DELAY + 0.10);  // opacity finishes over 0.10 s
const T_SCALE_END   = n(HEAD_DELAY + 0.18);  // scale finishes over 0.18 s (overshoot)
const T_ERASE_START = T_HOLD;
const T_HEAD_GONE   = n(DRAW_DURATION + HOLD_DURATION + 0.10); // fades in first 0.10 s of erase

// ── Path generator ─────────────────────────────────────────────────────
interface Pt { x: number; y: number }

function buildPathD({ x: sx, y: sy }: Pt, { x: ex, y: ey }: Pt): string {
  const dx = ex - sx;
  const dy = ey - sy;
  const f  = (v: number) => v.toFixed(2);
  const pt = (x: number, y: number) => `${f(x)},${f(y)}`;
  return [
    `M ${pt(sx, sy)}`,
    `C ${pt(sx - dx*0.45, sy + dy*0.25)},${pt(sx + dx*0.15, sy + dy*0.40)},${pt(sx + dx*0.30, sy + dy*0.48)}`,
    `C ${pt(sx + dx*0.42, sy + dy*0.54)},${pt(sx + dx*0.55, sy + dy*0.46)},${pt(sx + dx*0.50, sy + dy*0.38)}`,
    `C ${pt(sx + dx*0.45, sy + dy*0.30)},${pt(sx + dx*0.20, sy + dy*0.36)},${pt(sx + dx*0.30, sy + dy*0.55)}`,
    `C ${pt(sx + dx*0.40, sy + dy*0.75)},${pt(sx + dx*0.70, sy + dy*0.85)},${pt(ex, ey)}`,
  ].join(" ");
}

// ── Arrowhead easing: overshoot on grow, fast easeIn on shrink ─────────
const SCALE_EASE = [
  "linear",
  [0.34, 1.4, 0.64, 1] as [number, number, number, number],
  "linear",
  "easeIn",
  "linear",
];

// ── State shape ────────────────────────────────────────────────────────
interface HeadGeo {
  relPoints: string; // polygon points centred at (0,0) = anchor
  tx: number;
  ty: number;
}

interface Layout {
  viewBox: string;
  pathD:   string;
  head:    HeadGeo | null;
}

// ── Component ──────────────────────────────────────────────────────────
export default function HandDrawnArrow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef   = useRef<SVGPathElement>(null);
  const [layout, setLayout] = useState<Layout>({ viewBox: "0 0 0 0", pathD: "", head: null });

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    const measure   = measureRef.current;
    if (!container || !measure) return;

    const startEl = document.querySelector<HTMLElement>("[data-arrow-start]");
    const endEl   = document.querySelector<HTMLElement>("[data-arrow-end]");
    if (!startEl || !endEl) return;

    const cRect     = container.getBoundingClientRect();
    const startRect = startEl.getBoundingClientRect();
    const endRect   = endEl.getBoundingClientRect();

    // Start: bottom-left corner of the third value card, +8 px inset
    const S: Pt = {
      x: startRect.left   - cRect.left + 8,
      y: startRect.bottom - cRect.top  + 8,
    };
    // End: 24 px above heading top, 30% across heading width
    const E: Pt = {
      x: endRect.left - cRect.left + endRect.width * 0.30,
      y: endRect.top  - cRect.top  - 24,
    };

    const W     = container.clientWidth;
    const H     = container.clientHeight;
    const pathD = buildPathD(S, E);

    // Imperatively update the hidden measurement path, then read geometry.
    // This avoids a two-render-pass cycle (no need to wait for React to commit).
    measure.setAttribute("d", pathD);
    const len = measure.getTotalLength();

    let head: HeadGeo | null = null;
    if (len > 0) {
      const anchor = measure.getPointAtLength(len - OVERLAP);
      const back   = measure.getPointAtLength(Math.max(0, len - OVERLAP - 4));
      const angle  = Math.atan2(anchor.y - back.y, anchor.x - back.x);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const f   = (v: number) => v.toFixed(2);
      head = {
        relPoints: [
          `${f(cos * TIP_LEN)},${f(sin * TIP_LEN)}`,   // tip (forward)
          `${f(-sin * HALF_W)},${f(cos * HALF_W)}`,    // base-L
          `${f(sin * HALF_W)},${f(-cos * HALF_W)}`,    // base-R
        ].join(" "),
        tx: +anchor.x.toFixed(2),
        ty: +anchor.y.toFixed(2),
      };
    }

    setLayout({ viewBox: `0 0 ${W} ${H}`, pathD, head });
  }, []);

  useLayoutEffect(() => {
    recalculate();

    let debounceId: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(debounceId);
      debounceId = setTimeout(recalculate, 100);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(debounceId);
    };
  }, [recalculate]);

  const { viewBox, pathD, head } = layout;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="value-arrow"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      {/* 0×0 SVG used only for getTotalLength() / getPointAtLength() */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", overflow: "hidden", visibility: "hidden" }}
      >
        <path ref={measureRef} d="" fill="none" stroke="none" />
      </svg>

      {/* Animated arrow — only rendered once DOM layout is known */}
      {pathD && (
        <svg
          width="100%"
          height="100%"
          viewBox={viewBox}
          fill="none"
          style={{ display: "block", overflow: "visible" }}
        >
          {/*
            strokeLinecap="butt" — eliminates the round dot that appears at
            pathLength=0 (butt caps have zero overhang, so a zero-length path
            renders nothing). Opacity steps to 0 at cycle end as extra guard.
          */}
          <motion.path
            key={pathD}
            d={pathD}
            stroke="var(--text-strong)"
            strokeWidth="9"
            strokeLinecap="butt"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity:    [1, 1, 1, 1, 0], // step-to-0 at cycle end, invisible during repeatDelay
            }}
            transition={{
              pathLength: {
                duration:    TOTAL,
                times:       [0, T_DRAW, T_HOLD, 1],
                ease:        "easeInOut",
                repeat:      Infinity,
                repeatDelay: REPEAT_DELAY,
              },
              opacity: {
                duration:    TOTAL,
                times:       [0, T_DRAW, T_HOLD, 0.999, 1], // near-instant step at cycle end
                ease:        "linear",
                repeat:      Infinity,
                repeatDelay: REPEAT_DELAY,
              },
            } as Transition}
          />

          {/* Arrowhead — outer <g> translates to the anchor; inner motion.g scales from there */}
          {head && (
            <g transform={`translate(${head.tx}, ${head.ty})`}>
              <motion.g
                key={pathD}
                style={{ transformOrigin: "0px 0px" }}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0, 0],
                  scale:   [0.2, 0.2, 1, 1, 0.2, 0.2],
                }}
                transition={{
                  duration:    TOTAL,
                  repeat:      Infinity,
                  repeatDelay: REPEAT_DELAY,
                  opacity: {
                    times: [0, T_HEAD_START, T_OPAC_END, T_ERASE_START, T_HEAD_GONE, 1],
                    ease:  "linear",
                  },
                  scale: {
                    times: [0, T_HEAD_START, T_SCALE_END, T_ERASE_START, T_HEAD_GONE, 1],
                    ease:  SCALE_EASE,
                  },
                } as Transition}
              >
                <polygon
                  points={head.relPoints}
                  fill="var(--text-strong)"
                  stroke="none"
                />
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </div>
  );
}
