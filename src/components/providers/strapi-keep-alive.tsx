"use client";

import { useEffect, useRef } from "react";

/**
 * Invisible client-side component that periodically pings /api/keep-alive
 * to keep the Strapi Render instance warm.
 *
 * - Pings every 6 minutes (within the 5-8 min target)
 * - Pauses when the tab is hidden (saves resources)
 * - Immediately pings when the tab becomes visible again (wakes backend fast)
 * - First ping fires 10 seconds after mount (lets the page finish loading)
 */

const PING_INTERVAL_MS = 6 * 60 * 1000; // 6 minutes
const INITIAL_DELAY_MS = 10_000; // 10 seconds after mount

export function StrapiKeepAlive() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPingRef = useRef<number>(0);

  useEffect(() => {
    let mounted = true;

    const ping = async () => {
      if (!mounted) return;
      const now = Date.now();
      lastPingRef.current = now;

      try {
        const res = await fetch("/api/keep-alive", { cache: "no-store" });
        const data = await res.json();
        console.log(
          `[StrapiKeepAlive] ${data.status} — ${
            data.strapi?.durationMs ?? data.durationMs ?? "?"
          }ms`,
          data
        );
      } catch (err) {
        console.warn("[StrapiKeepAlive] fetch failed", err);
      }
    };

    const schedule = (delayMs: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void ping().then(() => {
          if (mounted) schedule(PING_INTERVAL_MS);
        });
      }, delayMs);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Tab came back: if more than 5 min since last ping, ping immediately
        const elapsed = Date.now() - lastPingRef.current;
        const delay = elapsed >= 5 * 60 * 1000 ? 0 : PING_INTERVAL_MS - elapsed;
        schedule(Math.max(delay, 0));
      } else {
        // Tab hidden: stop pinging
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    // Start the first ping after a short delay
    schedule(INITIAL_DELAY_MS);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null; // invisible component
}
