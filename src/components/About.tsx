"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const paragraphs = [
  "Hi, I am Itunu.",
  "In five years of writing for B2B SaaS brands, I have learned one thing: buyers do not trust jargon, they trust clarity.",
  "I built my process around buyer psychology, sharp positioning, and conversion-focused writing, so your message sounds credible and easy to act on.",
  "From website copy to strategy and thought leadership, I help businesses close the gap between what their product does and what buyers need to hear.",
  "If you want content that feels human, earns trust, and drives action, we should work together.",
];

export default function About() {
  return (
    <section id="about">
      <div className="section-wrap about-grid section-block">
        <div style={{ maxWidth: 650 }}>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "var(--text-strong)",
              marginBottom: "var(--space-6)",
            }}
          >
            I write for people first,
            <br />
            robots second
          </motion.h2>

          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.04, duration: 0.42 }}
              style={{
                fontSize: "var(--text-base)",
                lineHeight: 1.72,
                color: "var(--text-default)",
                marginBottom: "var(--space-5)",
              }}
            >
              {p}
            </motion.p>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24, duration: 0.45 }}
            style={{ marginTop: "var(--space-6)" }}
          >
            <Link href="/#contact" className="btn btn-secondary">
              Let&apos;s talk
            </Link>
          </motion.div>
        </div>

        <div
          className="about-img-col"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="about-photo"
            style={{
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              width: "100%",
              maxWidth: 510,
              aspectRatio: "5/6",
              position: "relative",
              boxShadow: "var(--shadow-lift)",
              border: "1px solid var(--border-soft)",
            }}
          >
            <Image
              src="/images/itunu-about.jpg"
              alt="Itunu Adegbayi, B2B content strategist and writer"
              fill
              sizes="(max-width: 1080px) 86vw, 510px"
              style={{
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
