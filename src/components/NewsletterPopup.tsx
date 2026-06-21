"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

const STORAGE_KEY = "newsletter-popup-dismissed";
const TRIGGER_DELAY = 60_000; // 60 seconds — enough time to read, not intrusive
const TRIGGER_SCROLL = 0.72; // 72% page scroll — user is genuinely engaged

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);

  const dismiss = useCallback(() => {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    // Don't show if dismissed in last 7 days
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed) {
        const daysSince = (Date.now() - Number(dismissed)) / (1000 * 60 * 60 * 24);
        if (daysSince < 7) return;
      }
    } catch {
      // localStorage unavailable
    }

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setShow(true);
    };

    // Time trigger
    const timer = setTimeout(trigger, TRIGGER_DELAY);

    // Scroll trigger
    const onScroll = () => {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= TRIGGER_SCROLL) {
        trigger();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            style={{
              position: "fixed",
              inset: 0,
              background: "oklch(0.15 0.02 90 / 0.55)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="newsletter-popup"
            style={{
              position: "fixed",
              bottom: "var(--space-6)",
              right: "var(--space-6)",
              width: "min(420px, calc(100vw - 32px))",
              background:
                "linear-gradient(165deg, oklch(0.97 0.01 94) 0%, oklch(0.94 0.015 100) 100%)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-soft)",
              boxShadow: "0 24px 60px oklch(0.2 0.03 90 / 0.22)",
              padding: "var(--space-6)",
              zIndex: 101,
            }}
          >
            <button
              onClick={dismiss}
              aria-label="Close newsletter popup"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-soft)",
                padding: 4,
              }}
            >
              <X size={18} />
            </button>

            <h3
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                fontFamily: "var(--font-display), sans-serif",
                color: "var(--text-strong)",
                marginBottom: "var(--space-3)",
                lineHeight: 1.2,
              }}
            >
              Stay in the loop
            </h3>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-soft)",
                lineHeight: 1.6,
                marginBottom: "var(--space-5)",
              }}
            >
              Get occasional essays on B2B writing, content strategy, and what
              actually works in SaaS marketing.
            </p>

            <NewsletterForm source="popup" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
