"use client";

import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export const Table = ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
  <div className="my-8 overflow-hidden rounded-xl border border-border-subtle shadow-sm">
    <div className="overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-left text-sm", className)}
        {...props}
      />
    </div>
  </div>
);

export const TableHead = ({ className, ...props }: ComponentPropsWithoutRef<"thead">) => (
  <thead className={cn("bg-bg-elevated", className)} {...props} />
);

export const TableBody = ({ className, ...props }: ComponentPropsWithoutRef<"tbody">) => (
  <tbody className={cn("divide-y divide-border-subtle bg-bg-surface", className)} {...props} />
);

export const TableRow = ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
  <tr className={cn("transition-colors hover:bg-bg-elevated", className)} {...props} />
);

export const TableHeader = ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
  <th
    className={cn(
      "px-6 py-4 font-semibold text-text-primary",
      "border-b border-border-subtle",
      className
    )}
    {...props}
  />
);

export const TableCell = ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
  <td
    className={cn(
      "px-6 py-4 text-text-secondary",
      className
    )}
    {...props}
  />
);
