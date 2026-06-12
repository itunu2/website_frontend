"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "clamp(620px, 80vh, 880px)",
      }}
    >
      <div
        className="section-wrap hero-grid section-block"
        style={{
          paddingTop: "clamp(110px, 12vw, 180px)",
          paddingBottom: "clamp(72px, 8vw, 110px)",
        }}
      >
        {/* Left column */}
        <div className="hero-text">
          <motion.h1
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            style={{
              fontSize: "var(--text-hero)",
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
              color: "var(--text-strong)",
            }}
          >
            B2B Content
            <br />
            Made Human
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 400,
              lineHeight: 1.66,
              maxWidth: 550,
              marginTop: "var(--space-6)",
              color: "var(--text-default)",
            }}
          >
            I help B2B SaaS brands write content that buyers instantly
            understand, trust, and act on.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease }}
            className="hero-actions"
            style={{
              display: "flex",
              gap: "var(--space-5)",
              marginTop: "var(--space-7)",
              flexWrap: "wrap",
            }}
          >
            <Link href="/#services" className="btn btn-primary">
              See my work
            </Link>
            <Link href="/#contact" className="btn btn-secondary">
              Let&apos;s talk
            </Link>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="hero-image" style={{ display: "flex", justifyContent: "center" }}>
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.15, ease }}
            className="hero-circle"
          >
            <div className="hero-photo-wrap">
              <Image
                src="/images/itunu-hero-nobg.png"
                alt="Itunu Adegbayi, B2B content strategist"
                fill
                sizes="(max-width: 860px) 76vw, 470px"
                priority
                style={{
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
