"use client";

import { useEffect, useRef } from "react";

const PING_INTERVAL = 6 * 60 * 1000; // 6 minutes
const INITIAL_DELAY = 8_000;
const STALE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

/**
 * Supplementary client-side keep-alive for the Strapi backend.
 * The primary mechanism is a Vercel Cron job (vercel.json → /api/keep-alive every 5 min).
 * This component adds a secondary layer that pings while a user is actively browsing.
 */
export function StrapiKeepAlive() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPing = useRef(0);

  useEffect(() => {
    let mounted = true;

    const ping = async () => {
      if (!mounted) return;
      lastPing.current = Date.now();
      try {
        await fetch("/api/keep-alive", { cache: "no-store" });
      } catch {
        // Swallow — cron is the primary mechanism
      }
    };

    const schedule = (delay: number) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void ping().then(() => {
          if (mounted) schedule(PING_INTERVAL);
        });
      }, delay);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        const elapsed = Date.now() - lastPing.current;
        schedule(elapsed >= STALE_THRESHOLD ? 0 : Math.max(PING_INTERVAL - elapsed, 0));
      } else {
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }
      }
    };

    schedule(INITIAL_DELAY);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mounted = false;
      if (timer.current) clearTimeout(timer.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
