"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface Logo {
  name: string;
  src: string;
  alt: string;
}

interface LogoMarqueeProps {
  logos: Logo[];
  label?: string;
  className?: string;
}

export const LogoMarquee = ({ logos, label, className }: LogoMarqueeProps) => {
  if (logos.length === 0) return null;

  // Deduplicate by name to prevent visual clones
  const unique = logos.filter(
    (l, i, arr) => arr.findIndex((x) => x.name === l.name) === i,
  );

  // Duplicate for seamless loop
  const duplicated = [...unique, ...unique];

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <p className="mb-5 text-center text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-text-tertiary">
          {label}
        </p>
      )}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div
          className="flex w-max items-center gap-12 hover:[animation-play-state:paused] sm:gap-16 md:gap-24"
          style={{ animation: "logo-marquee 42s linear infinite" }}
        >
          {duplicated.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex h-10 w-28 shrink-0 items-center justify-center sm:h-11 sm:w-32 md:h-12 md:w-36"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={128}
                height={44}
                className="h-full w-full object-contain opacity-40 grayscale transition-opacity duration-300 hover:opacity-60 dark:brightness-0 dark:invert"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
