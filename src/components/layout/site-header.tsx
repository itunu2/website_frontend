"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { callsToAction, navigation, siteIdentity } from "@/config/site";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

export const SiteHeader = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <motion.header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ backgroundColor, borderBottom: "1px solid", borderBottomColor }}
    >
      <Container className="flex h-20 items-center justify-between">
        {/* Logo/Brand */}
        <Link
          href="/"
          aria-label={`${siteIdentity.fullName} home`}
          className="transition-opacity duration-300 hover:opacity-80"
        >
          <span className="font-display text-h4 font-semibold text-text-primary tracking-tight">
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
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <AnimatePresence initial={false} mode="wait">
              {mobileMenuOpen ? (
                <motion.svg
                  key="close"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.15 }}
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
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.15 }}
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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border-default md:hidden"
            style={{ backgroundColor }}
          >
            <Container className="flex flex-col gap-1 py-4">
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
