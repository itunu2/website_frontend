import Link from "next/link";
import { Container } from "@/components/layout/container";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { footerCopy, navigation, siteIdentity, socialLinks } from "@/config/site";

const currentYear = new Date().getFullYear();

export const SiteFooter = () => {
  return (
    <footer className="relative bg-bg-dark text-bg-page">
      {/* Subtle separator — thin amber accent line */}
      <div className="mx-auto h-px w-full max-w-[1100px] bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" aria-hidden />
      <Container className="py-12 md:py-16">
        {/* Newsletter */}
        <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.07] p-4 sm:p-5 md:p-6">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:gap-8">
            <div className="md:flex-1">
              <p className="font-display text-h4 text-bg-page">Join my newsletter</p>
              <p className="mt-0.5 text-body-sm text-bg-page/60">Thoughtful writing on SaaS content strategy and storytelling, delivered to your inbox.</p>
            </div>
            <div className="md:w-80">
              <NewsletterForm source="footer" buttonLabel="Subscribe" layout="inline" dark />
            </div>
          </div>
        </div>

        {/* Monogram + Brand */}
        <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/15 bg-white/[0.07] shadow-sm">
            <span className="font-display text-h4 font-bold text-accent-primary">
              {siteIdentity.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <p className="font-display text-h4 text-bg-page">{siteIdentity.fullName}</p>
            <p className="text-body-sm text-bg-page/50">{siteIdentity.role}</p>
          </div>
        </div>

        {/* Hairline divider */}
        <div className="mb-6 h-px bg-white/10 sm:mb-8" />

        {/* Footer content grid */}
        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1.5">
            <p className="text-body-sm text-bg-page/60">{footerCopy.note}</p>
            <p className="text-body-sm text-bg-page/40">&copy; {currentYear} All rights reserved.</p>
          </div>
          
          <div className="flex flex-col gap-3 sm:gap-4 md:items-end">
            <div className="flex flex-wrap items-center gap-4 text-body-sm text-bg-page/70 sm:gap-6">
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
            <div className="flex flex-wrap gap-4 text-body-sm text-bg-page/40 sm:gap-6">
              {navigation.secondary.map((link) => (
                <Link key={link.href} href={link.href} className="transition-colors duration-150 hover:text-bg-page/80">
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
