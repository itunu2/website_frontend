import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export const BlogNewsletterCta = () => {
  return (
    <section className="rounded-2xl border border-border-default bg-bg-elevated p-6 md:p-8">
      <h2 className="mb-2 font-display text-h3 font-semibold text-text-primary">
        Enjoyed this piece?
      </h2>
      <p className="mb-5 text-body text-text-secondary">Get the next one straight to your inbox.</p>
      <NewsletterForm source="blog-cta" buttonLabel="Subscribe" />
    </section>
  );
};
