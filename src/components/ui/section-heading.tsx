import type { HTMLAttributes } from "react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  ...props
}: SectionHeadingProps) => {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-4xl",
        className,
      )}
      {...props}
    >
      {eyebrow && (
        <p className="mb-3 text-caption font-medium uppercase tracking-wider text-accent-primary">{eyebrow}</p>
      )}
      <h2 className="mb-4 font-display text-h2 text-text-primary">{title}</h2>
      {description && <p className="text-body-lg leading-relaxed text-text-secondary">{description}</p>}
    </div>
  );
};
