"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { scaleIn } from "@/lib/motion";
import type { NewsletterSource } from "@/lib/newsletter/types";

interface NewsletterFormProps {
  source: NewsletterSource;
  className?: string;
  onSuccess?: () => void;
  buttonLabel?: string;
  /** "stacked" stacks input above button (default); "inline" places them side-by-side on sm+ */
  layout?: "inline" | "stacked";
}

type SubmitState = "idle" | "loading" | "success" | "error";

export const NewsletterForm = ({
  source,
  className,
  onSuccess,
  buttonLabel = "Subscribe",
  layout = "stacked",
}: NewsletterFormProps) => {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState === "loading" || submitState === "success") return;
    setSubmitState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        message?: string;
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Something went wrong. Please try again.");
      }

      setSubmitState("success");
      setMessage(payload?.message ?? "You're in! Expect thoughtful updates soon.");
      onSuccess?.();
      setEmail("");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Unable to subscribe right now.";
      setSubmitState("error");
      setMessage(nextMessage);
    }
  };

  if (submitState === "success") {
    return (
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="show"
        className="flex items-start gap-3 rounded-lg border border-border-default bg-bg-surface px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
          <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-body-sm text-text-secondary">{message}</p>
      </motion.div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <label htmlFor={emailId} className="sr-only">
        Email address
      </label>

      <div
        className={cn(
          layout === "inline"
            ? "flex flex-col gap-2 sm:flex-row sm:items-center"
            : "space-y-3",
        )}
      >
        <div className={cn(layout === "inline" && "min-w-0 flex-1")}>
          <Input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (submitState === "error") setSubmitState("idle");
            }}
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={submitState === "loading"}
            error={submitState === "error"}
          />
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={submitState === "loading"}
          fullWidth={layout === "stacked"}
        >
          {submitState === "loading" ? "Subscribing…" : buttonLabel}
        </Button>
      </div>

      <p
        className={cn(
          "text-body-sm",
          submitState === "error" ? "text-danger" : "text-text-tertiary",
        )}
        aria-live="polite"
      >
        {submitState === "error"
          ? message
          : "No spam, ever. Unsubscribe at any time."}
      </p>
    </div>
  );
};
