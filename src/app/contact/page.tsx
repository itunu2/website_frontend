import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import ContactForm from "@/components/contact/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Itunu Adegbayi to discuss writing projects and collaborations.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-bg-elevated pt-24 pb-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 font-display text-display font-semibold text-text-primary">
              Let&rsquo;s create something together
            </h1>
            <p className="text-body-lg text-text-muted">
              Whether for a project, collaboration, or conversation, I&rsquo;d love to hear from you.
            </p>
          </div>
        </Container>
      </Section>

      {/* Form */}
      <ContactForm />
    </>
  );
}
