import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteIdentity } from "@/config/site";
import { env } from "@/config/env";
import { ThemeScript } from "@/components/theme/theme-script";
import { generateRequestId } from "@/lib/request-id";
import { RequestIdProvider } from "@/components/providers/request-id-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NewsletterPopup } from "@/components/newsletter/newsletter-popup";
import { MotionRoot } from "@/components/motion/motion-root";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(env.client.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${siteIdentity.fullName} · ${siteIdentity.role}`,
    template: `%s · ${siteIdentity.fullName}`,
  },
  description: siteIdentity.summary,
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    shortcut: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  openGraph: {
    title: siteIdentity.fullName,
    description: siteIdentity.summary,
    url: env.client.NEXT_PUBLIC_SITE_URL,
    siteName: siteIdentity.fullName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteIdentity.fullName} — ${siteIdentity.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteIdentity.fullName,
    description: siteIdentity.summary,
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestId = generateRequestId();

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} bg-bg-page text-text-primary antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-accent-primary focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <RequestIdProvider value={requestId}>
          <MotionRoot>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main id="main-content" className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <NewsletterPopup />
          </MotionRoot>
        </RequestIdProvider>
      </body>
    </html>
  );
}
