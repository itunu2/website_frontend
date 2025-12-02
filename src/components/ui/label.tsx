import { forwardRef } from "react";
import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("block text-body-sm font-medium text-text-primary mb-2", className)}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
    );
  },
);

Label.displayName = "Label";
