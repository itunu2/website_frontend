"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { socialLinks } from "@/config/site";

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Note: Implement form submission endpoint when ready
    // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formState) })
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitStatus("success");
    setFormState({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Section className="bg-bg-page">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" required>
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" required>
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="message" required>
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell me about your project..."
                    rows={6}
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="rounded-xl bg-success/10 p-4 text-body-sm text-success">
                    Thanks for reaching out! I&rsquo;ll get back to you within 48 hours.
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="rounded-xl bg-danger/10 p-4 text-body-sm text-danger">
                    Something went wrong. Please try again or email me directly.
                  </div>
                )}

                <Button type="submit" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send message"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 font-display text-h3 font-semibold text-text-primary">
                Other ways to connect
              </h2>
              <div className="space-y-3 text-body text-text-muted">
                {socialLinks.map((link) => (
                  <div key={link.label}>
                    <a
                      href={link.href}
                      className="text-accent-primary transition-colors hover:text-accent-strong"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                      aria-label={link.ariaLabel}
                    >
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <Card variant="flat">
              <h3 className="mb-3 font-display text-h4 font-semibold text-text-primary">
                Response time
              </h3>
              <p className="text-body-sm text-text-secondary">
                I typically respond to inquiries within 48 hours. For urgent matters, email is best.
              </p>
            </Card>

            <Card variant="flat">
              <h3 className="mb-3 font-display text-h4 font-semibold text-text-primary">
                What to include
              </h3>
              <p className="text-body-sm text-text-secondary">
                Tell me about your project, timeline, and what kind of writing you need. The more
                context, the better I can help.
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
