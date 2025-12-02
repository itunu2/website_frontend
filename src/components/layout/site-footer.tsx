import Link from "next/link";
import { Container } from "@/components/layout/container";
import { footerCopy, navigation, siteIdentity, socialLinks } from "@/config/site";

const currentYear = new Date().getFullYear();

export const SiteFooter = () => {
  return (
    <footer className="border-t border-border-default bg-bg-elevated">
      <Container className="py-12 md:py-16">
        {/* Monogram + Brand */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border-default bg-bg-surface shadow-sm">
            <span className="font-display text-h4 font-bold text-accent-primary">
              {siteIdentity.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <p className="font-display text-h4 font-semibold text-text-primary">{siteIdentity.fullName}</p>
            <p className="text-body-sm text-text-tertiary">{siteIdentity.role}</p>
          </div>
        </div>

        {/* Hairline divider */}
        <div className="mb-8 h-px bg-border-default" />

        {/* Footer content grid */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-body-sm text-text-secondary">{footerCopy.note}</p>
            <p className="text-body-sm text-text-tertiary">&copy; {currentYear} All rights reserved.</p>
          </div>
          
          <div className="flex flex-col gap-4 md:items-end">
            <div className="flex flex-wrap items-center gap-6 text-body-sm text-text-secondary">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-label={link.ariaLabel ?? link.label}
                  className="transition-colors duration-150 hover:text-accent-primary"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 text-body-sm text-text-tertiary">
              {navigation.secondary.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors duration-150 hover:text-text-secondary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
