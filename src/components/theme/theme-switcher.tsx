"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { themeMediaQuery, themeOptions, themeStorageKey, type ThemeMode } from "@/config/theme";

// Icon components
const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const AutoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === "light" || value === "dark" || value === "auto";

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "auto";
    }

    const stored = window.localStorage.getItem(themeStorageKey);
    return isThemeMode(stored) ? stored : "auto";
  });
  const modeRef = useRef<ThemeMode>("auto");

  const applyMode = useCallback(
    (nextMode: ThemeMode, { persist = true }: { persist?: boolean } = {}) => {
      if (typeof document === "undefined") {
        return;
      }

      const media = window.matchMedia(themeMediaQuery);
      const resolved = nextMode === "auto" ? (media.matches ? "dark" : "light") : nextMode;

      document.documentElement.dataset.theme = resolved;
      document.documentElement.dataset.themeMode = nextMode;

      if (persist) {
        window.localStorage.setItem(themeStorageKey, nextMode);
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    applyMode(mode);
  }, [applyMode, mode]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(themeStorageKey);
    if (isThemeMode(stored) && stored !== modeRef.current) {
      requestAnimationFrame(() => setMode(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia(themeMediaQuery);
    const handleChange = () => {
      if (modeRef.current === "auto") {
        applyMode("auto", { persist: false });
      }
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(handleChange);
    }

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", handleChange);
      } else if (typeof media.removeListener === "function") {
        media.removeListener(handleChange);
      }
    };
  }, [applyMode]);

  const icons = {
    auto: AutoIcon,
    light: SunIcon,
    dark: MoonIcon,
  };

  return (
    <div
      role="radiogroup"
      aria-label="Theme switcher"
      className={`inline-flex items-center gap-1 rounded-full border border-border-subtle bg-bg-surface p-1 shadow-sm transition-colors duration-300 ${className || ""}`}
    >
      {themeOptions.map((option) => {
        const Icon = icons[option.value];
        const isActive = mode === option.value;

        return (
          <motion.button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.ariaLabel}
            onClick={() => setMode(option.value)}
            className="relative rounded-full p-2 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  layoutId="theme-indicator"
                  className="absolute inset-0 rounded-full bg-bg-elevated"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.65, 0, 0.35, 1] }}
                />
              )}
            </AnimatePresence>
            <motion.span
              className="relative"
              animate={{
                color: isActive ? "var(--accent-primary)" : "var(--text-tertiary)",
              }}
              transition={{ duration: 0.15 }}
            >
              <Icon className="h-4 w-4" />
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
};
