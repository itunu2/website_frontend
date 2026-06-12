"use client";

import { useState, type FormEvent } from "react";
import type { NewsletterSource } from "@/lib/newsletter/types";

export default function NewsletterForm({
  source,
  dark = false,
}: {
  source: NewsletterSource;
  dark?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <p
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          color: dark ? "var(--accent-gold)" : "var(--accent-olive)",
        }}
      >
        ✓ {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Your email"
          required
          aria-label="Email address"
          style={{
            flex: "1 1 200px",
            minHeight: 46,
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-pill)",
            border: `1px solid ${dark ? "oklch(0.96 0.01 100 / 0.25)" : "var(--border-soft)"}`,
            background: dark ? "oklch(0.96 0.01 100 / 0.08)" : "var(--surface-base)",
            color: dark ? "var(--text-inverse)" : "var(--text-strong)",
            fontSize: "var(--text-sm)",
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-primary"
          style={{
            minHeight: 46,
            padding: "var(--space-2) var(--space-5)",
            opacity: status === "loading" ? 0.7 : 1,
          }}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p style={{ fontSize: "var(--text-xs)", color: "oklch(0.6 0.18 25)" }}>
          {message}
        </p>
      )}
    </form>
  );
}
