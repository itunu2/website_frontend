"use client";

import { useEffect, useRef, useState } from "react";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

const DISMISS_KEY = "itunus-newsletter-dismissed-at";
const DISMISS_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const dismissedAtRaw = window.localStorage.getItem(DISMISS_KEY);
    const dismissedAt = dismissedAtRaw ? Number(dismissedAtRaw) : 0;

    if (dismissedAt && Date.now() - dismissedAt < DISMISS_WINDOW_MS) {
      return;
    }

    const openIfNeeded = () => {
      if (hasTriggeredRef.current) {
        return;
      }
      hasTriggeredRef.current = true;
      setIsOpen(true);
    };

    const timer = window.setTimeout(openIfNeeded, 30000);

    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        return;
      }

      const progress = window.scrollY / scrollHeight;
      if (progress >= 0.5) {
        openIfNeeded();
      }
    };

    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) {
        openIfNeeded();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const now = Date.now();
        window.localStorage.setItem(DISMISS_KEY, String(now));
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const closePopup = () => {
    const now = Date.now();
    window.localStorage.setItem(DISMISS_KEY, String(now));
    setIsOpen(false);
  };

  const handleSuccess = () => {
    window.setTimeout(() => {
      closePopup();
    }, 1400);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-bg-page/70 md:hidden" onClick={closePopup} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Join newsletter"
        className="fixed right-4 bottom-4 z-50 w-[min(92vw,24rem)] rounded-xl border border-border-default bg-bg-surface p-5 shadow-xl"
      >
        <button
          type="button"
          onClick={closePopup}
          className="absolute top-3 right-3 rounded-md px-2 py-1 text-text-tertiary transition-colors hover:text-text-primary"
          aria-label="Close newsletter popup"
        >
          ×
        </button>

        <h2 className="mb-2 pr-6 font-display text-h3 font-semibold text-text-primary">Join the mailing list</h2>
        <p className="mb-4 text-body-sm text-text-secondary">
          Get new essays, stories, and thoughtful updates in your inbox.
        </p>

        <NewsletterForm source="popup" onSuccess={handleSuccess} buttonLabel="Join" />
      </aside>
    </>
  );
};
