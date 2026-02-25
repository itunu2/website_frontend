import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const baseStyles =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-caption font-medium transition-[background-color,color,box-shadow] duration-150";

const variantStyles = {
  default: "bg-bg-elevated text-text-secondary",
  accent: "bg-accent-subtle text-accent-primary border border-border-accent/30",
  outline: "bg-transparent text-text-tertiary border border-border-default",
  dark: "bg-white/10 text-white/70 border border-white/10",
} as const;

interface BaseTagProps extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  variant?: keyof typeof variantStyles;
}

interface TagAsLinkProps extends BaseTagProps {
  href: string;
  onClick?: never;
}

interface TagAsButtonProps extends BaseTagProps {
  onClick: () => void;
  href?: never;
}

interface TagStaticProps extends BaseTagProps {
  href?: never;
  onClick?: never;
}

type TagProps = TagAsLinkProps | TagAsButtonProps | TagStaticProps;

export const Tag = forwardRef<HTMLElement, TagProps>(
  ({ variant = "default", className, children, href, onClick, ...props }, ref) => {
    const combinedClassName = cn(baseStyles, variantStyles[variant], className);

    if (href) {
      return (
        <Link href={href} className={combinedClassName} {...props}>
          {children}
        </Link>
      );
    }

    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={combinedClassName}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={combinedClassName} {...props}>
        {children}
      </span>
    );
  },
);

Tag.displayName = "Tag";
