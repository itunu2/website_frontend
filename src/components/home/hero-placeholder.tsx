import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { callsToAction, siteIdentity } from "@/config/site";

export const HeroPlaceholder = () => {
  return (
    <div className="bg-bg-elevated py-24 sm:py-32">
      <Container className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-body-sm uppercase tracking-[0.4em] text-text-tertiary">Editorial Website</p>
          <h1 className="text-display font-semibold text-text-primary">
            {siteIdentity.fullName} — {siteIdentity.role} shaping warm, modern narratives.
          </h1>
          <p className="text-body-lg text-text-secondary">
            Phase two establishes the design system foundation, routing shell, and API contracts so upcoming sections can
            focus purely on narrative craft.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href={callsToAction.primary.href}>{callsToAction.primary.label}</Button>
            <Button href={callsToAction.secondary.href} variant="secondary">
              {callsToAction.secondary.label}
            </Button>
          </div>
        </div>
        <div className="space-y-6 rounded-3xl border border-border-subtle bg-bg-surface/80 p-8 shadow-md">
          <p className="text-body text-text-secondary">
            Upcoming highlights:
          </p>
          <ul className="space-y-3 text-body text-text-primary">
            <li>• Featured writing carousel pulling from Strapi `isFeatured` flag.</li>
            <li>• Modular sections for values, testimonials, and case snippets.</li>
            <li>• Unified call-to-action surface tying every page back to contact.</li>
          </ul>
          <p className="text-body-sm text-text-tertiary">
            Copy is placeholder until editorial workshop; tokens & layout are final.
          </p>
        </div>
      </Container>
    </div>
  );
};
