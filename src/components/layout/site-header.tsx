"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { callsToAction, navigation, siteIdentity } from "@/config/site";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

export const SiteHeader = () => {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  
  const headerOpacity = useTransform(
    scrollY,
    [0, 100],
    [0, 0.98]
  );
  
  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    [0, 1]
  );

  return (
    <motion.header 
      className="sticky top-0 z-50 backdrop-blur-md transition-colors duration-500"
      style={{ 
        backgroundColor: headerOpacity.get() > 0.5 ? 'var(--bg-surface)' : 'transparent',
        borderBottom: borderOpacity.get() > 0.5 ? '1px solid var(--border-default)' : '1px solid transparent',
      }}
    >
      <Container className="flex h-20 items-center justify-between">
        {/* Logo/Brand - Simplified */}
        <Link
          href="/"
          aria-label={`${siteIdentity.fullName} home`}
          className="group relative transition-opacity duration-300 hover:opacity-80"
        >
          <span className="font-display text-h4 font-semibold text-text-primary tracking-tight">
            {siteIdentity.fullName}
          </span>
        </Link>
        
        {/* Navigation */}
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
                    ? 'text-accent-primary bg-accent-subtle' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
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
        </div>
      </Container>
    </motion.header>
  );
};
