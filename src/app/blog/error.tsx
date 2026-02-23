"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteRoutes } from "@/config/site";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
      console.error("Blog page error:", error);
    }
  }, [error]);

  return (
    <>
      <Section className="bg-bg-elevated pt-20 pb-14 md:pt-24 md:pb-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 font-display text-display font-semibold text-text-primary">
              Something went wrong
            </h1>
            <p className="mb-8 text-body-lg text-text-secondary">
              We encountered an error while loading the blog posts. This could be a temporary issue.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-bg-page">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button onClick={reset}>Try again</Button>
              <Button variant="secondary" href={siteRoutes.home}>
                Go home
              </Button>
            </div>

            {error.digest && (
              <p className="mt-6 text-body-sm text-text-tertiary">Error ID: {error.digest}</p>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
