"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 5, suffix: "+", line1: "Years of", line2: "Experience" },
  { value: 200, suffix: "+", line1: "Projects", line2: "Completed" },
  { value: 90, suffix: "%", line1: "Clients", line2: "Return" },
];

export default function Stats() {
  return (
    <section>
      <div
        className="section-wrap section-block"
        style={{
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: 800,
            lineHeight: 1.06,
            color: "var(--text-strong)",
            marginBottom: "var(--space-8)",
          }}
        >
          The numbers add up in your favour
        </motion.h2>

        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--grid-gap-md)",
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="stat-item"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-4)",
                padding: "var(--space-5)",
              }}
            >
              <span
                style={{
                  fontSize: "var(--text-stat)",
                  fontWeight: 800,
                  color: "var(--accent-olive)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.03em",
                }}
              >
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </span>

              <span
                className="stat-label"
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  color: "var(--text-strong)",
                  lineHeight: 1.3,
                  textAlign: "left",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {s.line1}
                <br />
                {s.line2}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
