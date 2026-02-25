"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { callsToAction, navigation, siteIdentity } from "@/config/site";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

export const SiteHeader = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 60], [0, 0.97]);
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  const backgroundColor = useMotionTemplate`rgba(var(--bg-surface-rgb), ${bgOpacity})`;
  const borderBottomColor = useMotionTemplate`rgba(var(--border-default-rgb), ${borderOpacity})`;

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) { document.body.style.overflow = ""; return; }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileMenuOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ backgroundColor, borderBottom: "1px solid", borderBottomColor }}
    >
      <Container className="flex h-14 items-center justify-between sm:h-[4.25rem]">
        {/* Brand — serif display */}
        <Link
          href="/"
          aria-label={`${siteIdentity.fullName} home`}
          className="group max-w-[calc(100vw-9rem)] transition-opacity duration-200 hover:opacity-75 sm:max-w-none"
        >
          <span className="block truncate font-display text-[1.125rem] tracking-[-0.01em] text-text-primary sm:text-[1.3125rem]">
            {siteIdentity.fullName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary" className="hidden items-center gap-x-1 md:flex">
          {navigation.primary.slice(1).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative px-3.5 py-2 text-[0.875rem] font-medium tracking-[0.005em] transition-colors duration-200
                  ${isActive
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                  }
                `}
              >
                {item.label}
                {/* Underline indicator */}
                <span
                  className={`
                    absolute inset-x-3.5 -bottom-px h-[2px] rounded-full bg-accent-primary transition-transform duration-300 origin-left
                    ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                  `}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions — tight cluster */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          <Link
            href={callsToAction.primary.href}
            className="hidden items-center rounded-full bg-accent-primary px-5 py-2 text-[0.8125rem] font-semibold text-white shadow-sm transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-accent-hover hover:shadow-md active:translate-y-0 sm:inline-flex"
          >
            {callsToAction.primary.label}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary md:hidden"
            onClick={() => setMobileMenuOpen((p) => !p)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-haspopup="menu"
          >
            <AnimatePresence initial={false} mode="wait">
              {mobileMenuOpen ? (
                <motion.svg
                  key="close"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.12 }}
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="open"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.12 }}
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"
                >
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </Container>

      {/* Mobile panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[calc(100svh-3.5rem)] overflow-y-auto border-t border-border-default md:hidden sm:max-h-[calc(100svh-4.25rem)]"
            style={{ backgroundColor }}
          >
            <Container className="flex flex-col gap-1 py-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
              {navigation.primary.slice(1).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      rounded-lg px-4 py-3 text-[0.9375rem] font-medium transition-colors duration-200
                      ${isActive
                        ? "text-accent-primary"
                        : "text-text-secondary hover:text-text-primary"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-3 border-t border-border-subtle pt-3">
                <Link
                  href={callsToAction.primary.href}
                  className="flex w-full items-center justify-center rounded-full bg-accent-primary px-5 py-2.5 text-[0.875rem] font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
                >
                  {callsToAction.primary.label}
                </Link>
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
