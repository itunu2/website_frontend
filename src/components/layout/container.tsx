import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends PropsWithChildren {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClassMap: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

export const Container = ({ size = "xl", className, children }: ContainerProps) => (
  <div className={cn("mx-auto w-full px-4 md:px-6 lg:px-8", sizeClassMap[size], className)}>
    {children}
  </div>
);
