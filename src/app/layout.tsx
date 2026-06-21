import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import { StrapiKeepAlive } from "@/components/providers/StrapiKeepAlive";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Itunu Adegbayi — B2B Content Made Human",
  description:
    "I help B2B SaaS brands write content that buyers instantly understand, trust, and act on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body>
        {children}
        <StrapiKeepAlive />
      </body>
    </html>
  );
}
