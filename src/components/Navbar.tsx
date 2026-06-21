"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    !href.startsWith("/#") &&
    (pathname === href || pathname.startsWith(href + "/"));

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 84,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: "color-mix(in oklch, var(--surface-base), transparent 8%)",
        borderBottom: "1px solid var(--border-soft)",
      }}
    >
      <div
        className="section-wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* Brand mark */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "var(--accent-olive)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-inverse)",
              fontFamily: "var(--font-display)",
              fontSize: "0.95rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              transition: "transform 0.2s var(--ease-premium)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.transform = "scale(1.07)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
            }
          >
            IA
          </div>
          <span
            className="nav-brand-name"
            style={{
              fontSize: "1.7rem",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              lineHeight: 1,
              color: "var(--text-strong)",
            }}
          >
            Itunu Adegbayi
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 34 }}>
          {links.map((l) => {
            const active = isActive(l.href);
            const isHash = l.href.startsWith("/#");
            const isCtaLink = l.label === "Contact";

            const sharedStyle: React.CSSProperties = {
              fontFamily: "var(--font-display)",
              fontSize: "1.03rem",
              fontWeight: isCtaLink ? 700 : 500,
              color: isCtaLink
                ? "var(--accent-olive)"
                : active
                  ? "var(--text-strong)"
                  : "var(--text-default)",
              position: "relative",
              transition: "color 0.2s",
              paddingBottom: 2,
            };

            const content = (
              <>
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    style={{
                      position: "absolute",
                      bottom: -4,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: "var(--accent-olive)",
                      borderRadius: 999,
                    }}
                  />
                )}
              </>
            );

            if (isHash) {
              return (
                <a
                  key={l.label}
                  href={l.href}
                  style={sharedStyle}
                  className="nav-link"
                >
                  {content}
                </a>
              );
            }
            return (
              <Link key={l.label} href={l.href} style={sharedStyle} className="nav-link">
                {content}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          className="grid place-items-center md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{
            background: "transparent",
            border: "1px solid var(--border-soft)",
            cursor: "pointer",
            color: "var(--text-strong)",
            width: 44,
            height: 44,
            borderRadius: 999,
          }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              overflow: "hidden",
              position: "absolute",
              top: 84,
              left: 0,
              right: 0,
              background: "color-mix(in oklch, var(--surface-base), white 26%)",
              borderBottom: "1px solid var(--border-soft)",
              zIndex: 49,
              boxShadow: "0 8px 24px oklch(0.3 0.03 95 / 0.12)",
            }}
            className="md:hidden"
          >
            <div
              className="section-wrap"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-5)",
                paddingTop: "var(--space-6)",
                paddingBottom: "var(--space-6)",
              }}
            >
              {links.map((l) => {
                const isHash = l.href.startsWith("/#");
                if (isHash) {
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.28rem",
                        fontWeight: l.label === "Contact" ? 700 : 500,
                        color: "var(--text-strong)",
                      }}
                    >
                      {l.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.28rem",
                      fontWeight: l.label === "Contact" ? 700 : 500,
                      color: "var(--text-strong)",
                    }}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
