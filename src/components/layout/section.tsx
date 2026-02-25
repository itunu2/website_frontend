import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends PropsWithChildren {
  id?: string;
  className?: string;
}

export const Section = ({
  id,
  className,
  children,
}: SectionProps) => (
  <section
    id={id}
    className={cn("py-12 sm:py-16 md:py-20 lg:py-24", className)}
  >
    {children}
  </section>
);
