"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { socialLinks } from "@/config/site";
import { cn } from "@/lib/utils";
import type { NewsletterSource } from "@/lib/newsletter/types";

interface NewsletterFormProps {
  source: NewsletterSource;
  className?: string;
  onSuccess?: () => void;
  buttonLabel?: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export const NewsletterForm = ({
  source,
  className,
  onSuccess,
  buttonLabel = "Subscribe",
}: NewsletterFormProps) => {
  const substackLink = socialLinks.find((link) => link.label === "Substack")?.href ?? "https://substack.com/@queenit";
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [showSubstackFallback, setShowSubstackFallback] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("loading");
    setMessage("");
    setShowSubstackFallback(false);

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
        substackSynced?: boolean;
      } | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error ?? "Something went wrong. Please try again.");
      }

      setSubmitState("success");
      if (payload?.substackSynced) {
        setMessage("You’re in. Please check your inbox for confirmation from Substack.");
        onSuccess?.();
      } else {
        setMessage("Saved successfully, but automatic Substack sync was blocked. Complete subscription on Substack.");
        setShowSubstackFallback(true);
      }
      setEmail("");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Unable to subscribe right now.";
      setSubmitState("error");
      setMessage(nextMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <div>
        <Label htmlFor={emailId} className="sr-only">
          Email address
        </Label>
        <Input
          id={emailId}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={submitState === "error"}
        />
      </div>

      <Button type="submit" size="sm" disabled={submitState === "loading"}>
        {submitState === "loading" ? "Subscribing..." : buttonLabel}
      </Button>

      <p
        className={cn(
          "min-h-5 text-body-sm",
          submitState === "success" && "text-success",
          submitState === "error" && "text-danger",
          submitState === "idle" && "text-text-tertiary",
        )}
        aria-live="polite"
      >
        {message || "Get essays and updates delivered to your inbox."}
      </p>

      {showSubstackFallback && (
        <a
          href={substackLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-body-sm font-medium text-accent-primary hover:text-accent-hover"
        >
          Complete subscription on Substack →
        </a>
      )}
    </form>
  );
};
