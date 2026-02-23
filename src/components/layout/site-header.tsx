"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { callsToAction, navigation, siteIdentity } from "@/config/site";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

export const SiteHeader = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.97]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  // Reactive background & border using CSS RGB variables
  const backgroundColor = useMotionTemplate`rgba(var(--bg-surface-rgb), ${bgOpacity})`;
  const borderBottomColor = useMotionTemplate`rgba(var(--border-default-rgb), ${borderOpacity})`;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <motion.header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ backgroundColor, borderBottom: "1px solid", borderBottomColor }}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        {/* Logo/Brand */}
        <Link
          href="/"
          aria-label={`${siteIdentity.fullName} home`}
          className="max-w-[calc(100vw-9rem)] transition-opacity duration-300 hover:opacity-80 sm:max-w-none"
        >
          <span className="block truncate font-display text-body font-semibold text-text-primary tracking-tight sm:text-h4">
            {siteIdentity.fullName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-x-2 md:flex">
          {navigation.primary.slice(1).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-4 py-2 text-body-sm font-medium rounded-lg transition-all duration-300
                  ${isActive
                    ? "text-accent-primary bg-accent-subtle"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                  }
                `}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 bg-accent-subtle rounded-lg -z-10"
                    transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Button
            href={callsToAction.primary.href}
            size="sm"
            variant="primary"
            className="hidden sm:inline-flex"
          >
            {callsToAction.primary.label}
          </Button>

          {/* Mobile hamburger */}
          <button
            className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-haspopup="menu"
          >
            <AnimatePresence initial={false} mode="wait">
              {mobileMenuOpen ? (
                <motion.svg
                  key="close"
                  initial={shouldReduceMotion ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={shouldReduceMotion ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: 45 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="open"
                  initial={shouldReduceMotion ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={shouldReduceMotion ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -45 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </Container>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-border-default md:hidden sm:max-h-[calc(100svh-5rem)]"
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
                      rounded-lg px-4 py-3 text-body font-medium transition-colors duration-200
                      ${isActive
                        ? "bg-accent-subtle text-accent-primary"
                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-3 border-t border-border-subtle pt-3">
                <Button
                  href={callsToAction.primary.href}
                  size="sm"
                  variant="primary"
                  fullWidth
                >
                  {callsToAction.primary.label}
                </Button>
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
