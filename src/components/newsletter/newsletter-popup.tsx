"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { scaleIn, fadeIn } from "@/lib/motion";

const DISMISS_KEY = "itunus-newsletter-dismissed-at";
const SUBSCRIBED_KEY = "itunus-newsletter-subscribed";
const DISMISS_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hasTriggeredRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const closePopup = useCallback((remember = true) => {
    if (remember) window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setIsOpen(false);
  }, []);

  /* --- Trigger logic --- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(SUBSCRIBED_KEY)) return;

    const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) ?? 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_WINDOW_MS) return;

    const trigger = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      setIsOpen(true);
    };

    const timer = window.setTimeout(trigger, 30_000);

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.5) trigger();
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  /* --- Keyboard + focus trap --- */
  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closePopup]);

  /* --- Body scroll lock --- */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSuccess = () => {
    window.localStorage.setItem(SUBSCRIBED_KEY, "1");
    window.setTimeout(() => closePopup(false), 1600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={shouldReduceMotion ? undefined : fadeIn}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => closePopup()}
            aria-hidden="true"
          />

          {/*
           * Mobile  → anchored near bottom, full-width, rounded-t-xl
           * Desktop → centered card, max-w-sm, rounded-xl
           */}
          <motion.div
            key="dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Join the newsletter"
            variants={shouldReduceMotion ? undefined : scaleIn}
            initial="hidden"
            animate="show"
            exit="hidden"
            className={[
              /* Shared */
              "fixed z-50 bg-bg-surface border border-border-default shadow-xl",
              /* Mobile: near-bottom, full width with side gutters */
              "bottom-4 left-4 right-4 rounded-xl p-5",
              /* sm+: centered floating card */
              "sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2",
              "sm:-translate-x-1/2 sm:-translate-y-1/2",
              "sm:w-full sm:max-w-sm sm:p-6",
            ].join(" ")}
          >
            {/* Close button — matches ghost Button styles */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => closePopup()}
              aria-label="Close newsletter popup"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M2.5 2.5l11 11M13.5 2.5l-11 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>

            <h2 className="mb-1.5 pr-8 font-display text-h3 font-semibold text-text-primary">
              Stay in the loop
            </h2>
            <p className="mb-5 text-body-sm text-text-secondary">
              New essays, stories, and ideas straight to your inbox.
            </p>

            <NewsletterForm
              source="popup"
              onSuccess={handleSuccess}
              buttonLabel="Subscribe"
              layout="stacked"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
