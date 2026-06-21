"use client";

import NewsletterForm from "@/components/NewsletterForm";
import NewsletterPopup from "@/components/NewsletterPopup";

const currentYear = new Date().getFullYear();

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/itunu-adegbayi",
    ariaLabel: "Connect on LinkedIn",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/itunu_adegbayi/",
    ariaLabel: "Follow on Instagram",
  },
  {
    label: "Substack",
    href: "https://substack.com/@queenit",
    ariaLabel: "Read Itunu's Substack",
  },
];

export default function Footer() {
  return (
    <>
      <footer className="footer-shell">
        <div
          className="section-wrap"
          style={{
            paddingTop: "var(--space-7)",
            paddingBottom: "var(--space-6)",
          }}
        >
          {/* Newsletter row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-7)",
              alignItems: "start",
              paddingBottom: "var(--space-6)",
              borderBottom: "1px solid var(--border-soft)",
              marginBottom: "var(--space-5)",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  fontFamily: "var(--font-display), sans-serif",
                  color: "var(--text-strong)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Join the newsletter
              </h3>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-soft)",
                  marginBottom: "var(--space-4)",
                  maxWidth: "42ch",
                  lineHeight: 1.6,
                }}
              >
                Occasional essays on B2B writing, content strategy, and what
                actually works.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "100%", maxWidth: 400 }}>
                <NewsletterForm source="footer" />
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "var(--space-5)",
            }}
          >
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-soft)",
              }}
            >
              © {currentYear} Itunu Adegbayi. Crafted for serious B2B growth.
            </span>

            <div
              style={{
                display: "flex",
                gap: "var(--space-5)",
                flexWrap: "wrap",
              }}
            >
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={link.ariaLabel}
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--text-strong)",
                    transition: "opacity var(--duration-fast)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.62")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <NewsletterPopup />
    </>
  );
}
