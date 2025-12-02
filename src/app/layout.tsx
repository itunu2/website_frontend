import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { siteIdentity } from "@/config/site";
import { env } from "@/config/env";
import { ThemeScript } from "@/components/theme/theme-script";
import { generateRequestId, getRequestIdHeaderName } from "@/lib/request-id";
import { RequestIdProvider } from "@/components/providers/request-id-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
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
  openGraph: {
    title: siteIdentity.fullName,
    description: siteIdentity.summary,
    url: env.client.NEXT_PUBLIC_SITE_URL,
    siteName: siteIdentity.fullName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteIdentity.fullName,
    description: siteIdentity.summary,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const requestHeaderName = getRequestIdHeaderName();
  const existingRequestId = headerList.get(requestHeaderName);
  const requestId = existingRequestId ?? generateRequestId();

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} bg-bg-page text-text-primary antialiased`}>
        <RequestIdProvider value={requestId}>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </RequestIdProvider>
      </body>
    </html>
  );
}
