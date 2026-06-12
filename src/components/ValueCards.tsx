"use client";

import { motion } from "framer-motion";
import HandDrawnArrow from "./HandDrawnArrow";

const cards = [
  {
    title: "Clarity",
    body: "Buyers instantly understand what you do, who it serves, and why your offer is a better fit than alternatives.",
    outcome: "Stronger first impressions and fewer confusion-driven drop-offs.",
  },
  {
    title: "Relevance",
    body: "Your message aligns with buyer intent, search behavior, and objections so the right people feel seen immediately.",
    outcome: "Higher-quality traffic and discovery calls with real buying potential.",
  },
  {
    title: "Conversion",
    body: "Content and structure move prospects from interest to action, so your site contributes to pipeline, not just pageviews.",
    outcome: "A website that supports revenue conversations instead of passive browsing.",
  },
];

const noteClasses = ["value-note-a", "value-note-b", "value-note-c"];

export default function ValueCards() {
  return (
    <section id="value-cards" className="value-section">
      <div
        className="section-wrap section-block value-intro-grid"
        style={{ paddingBottom: "var(--space-6)" }}
      >
        <div>
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
              marginBottom: "var(--space-4)",
            }}
          >
            What&apos;s in it for you?
          </motion.h2>
        </div>
      </div>

      <div className="section-wrap value-stage" style={{ paddingBottom: "clamp(70px, 9vw, 124px)" }}>
        {cards.map((card, i) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.58, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`value-note ${noteClasses[i]}`}
          >
            <div className="value-note-top">
              <span className="value-index">0{i + 1}</span>
              <span className="value-badge">{card.title}</span>
            </div>

            <p className="value-note-body">{card.body}</p>

            <p className="value-outcome">
              <span>Business effect</span>
              <strong>{card.outcome}</strong>
            </p>
          </motion.article>
        ))}

      </div>

      {/* Decorative hand-drawn arrow: card-3 → loop → down into "How" */}
      <div
        className="value-arrow"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "clamp(30px, 4vw, 70px)",
          bottom: "clamp(-185px, -14vw, -130px)",
          width: "clamp(400px, 50vw, 720px)",
          height: "clamp(300px, 36vw, 520px)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <HandDrawnArrow />
      </div>
    </section>
  );
}
