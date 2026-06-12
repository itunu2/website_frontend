"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

export default function CTA() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "var(--space-3) var(--space-4)",
    borderRadius: "var(--radius-sm)",
    border: "1px solid oklch(0.96 0.01 100 / 0.25)",
    background: "oklch(0.96 0.01 100 / 0.08)",
    color: "var(--text-inverse)",
    fontSize: "var(--text-sm)",
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <section className="cta-section" id="contact">
      <div className="section-wrap section-block">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-8)",
            alignItems: "start",
          }}
        >
          {/* Left: heading */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <h2
              style={{
                fontSize: "var(--text-2xl)",
                fontWeight: 800,
                lineHeight: 1.06,
                color: "var(--text-inverse)",
                marginBottom: "var(--space-5)",
              }}
            >
              Let&apos;s turn your content into a competitive advantage.
            </h2>
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "oklch(0.96 0.01 100 / 0.7)",
                lineHeight: 1.65,
                maxWidth: "48ch",
                marginBottom: "var(--space-5)",
              }}
            >
              Have a project in mind? Drop me a message and I&apos;ll get back to you
              within 24 hours.
            </p>

          </motion.div>

          {/* Right: contact form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            {status === "success" ? (
              <div
                style={{
                  padding: "var(--space-7)",
                  textAlign: "center",
                  color: "var(--accent-gold)",
                }}
              >
                <p style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-3)" }}>
                  Message sent!
                </p>
                <p style={{ fontSize: "var(--text-sm)", color: "oklch(0.96 0.01 100 / 0.7)" }}>
                  I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={inputStyle}
                />
                <textarea
                  placeholder="Tell me about your project..."
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                />
                {status === "error" && (
                  <p style={{ fontSize: "var(--text-xs)", color: "oklch(0.7 0.18 30)" }}>
                    {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn btn-secondary"
                  style={{ opacity: status === "loading" ? 0.7 : 1 }}
                >
                  {status === "loading" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
