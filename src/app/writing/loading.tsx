import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function WritingLoading() {
  return (
    <>
      {/* Hero Skeleton */}
      <Section className="bg-bg-elevated pt-24 pb-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Skeleton className="mx-auto mb-3 h-4 w-24" />
            <Skeleton className="mx-auto mb-6 h-12 w-72" />
            <Skeleton className="mx-auto h-6 w-full max-w-2xl" />
          </div>
        </Container>
      </Section>

      {/* Posts Grid Skeleton */}
      <Section className="bg-bg-page">
        <Container>
          {/* Tag Filter Skeleton */}
          <div className="mb-12 flex flex-wrap gap-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-24" />
          </div>

          {/* Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
