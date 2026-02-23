import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { callsToAction, siteRoutes } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Itunu Adegbayi—her approach to writing, values, and the work that drives her.",
};

const values = [
  {
    id: 1,
    title: "Clarity",
    description:
      "Good writing makes complex ideas accessible. I believe in distilling thoughts to their essence without losing nuance or depth.",
  },
  {
    id: 2,
    title: "Craft",
    description:
      "Every sentence matters. I approach writing as both art and discipline—thoughtful, deliberate, and always in service of the story.",
  },
  {
    id: 3,
    title: "Connection",
    description:
      "The best writing doesn't just inform—it resonates. I write to create bridges between ideas, people, and possibilities.",
  },
  {
    id: 4,
    title: "Collaboration",
    description:
      "Great work emerges from dialogue. I partner with clients and editors to shape narratives that are both true to the vision and compelling to the audience.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-bg-elevated pt-24 pb-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Profile Picture */}
              <div className="shrink-0">
                <div className="relative w-48 h-56 md:w-56 md:h-64 rounded-2xl overflow-hidden shadow-xl ring-1 ring-border-default bg-bg-subtle">
                  <Image 
                    src="/itunu_picture.jpg" 
                    alt="Itunu Adegbayi"
                    width={224}
                    height={280}
                    className="w-full h-full object-cover object-center"
                    priority
                    quality={95}
                  />
                </div>
              </div>
              
              {/* Text Content */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-4 font-display text-h1 md:text-display font-bold text-text-primary leading-tight">
                  I write to connect ideas, people, and stories.
                </h1>
                <p className="text-body-lg text-text-secondary leading-relaxed">
                  A writer at the intersection of culture, strategy, and craft.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Story */}
      <Section className="bg-bg-page">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6 text-body-lg leading-relaxed text-text-secondary">
            <p>
              I&rsquo;ve spent years writing across editorial and brand contexts—working with
              publications, startups, creative studios, and nonprofits to shape narratives that
              resonate. From long-form essays to brand manifestos, I&rsquo;ve learned that good
              writing doesn&rsquo;t just communicate; it connects.
            </p>

            <p>
              My work has appeared in cultural publications, brand campaigns, and editorial platforms.
              I&rsquo;ve helped organizations find their voice, told stories that needed telling, and
              built content strategies that actually work. What ties it all together is a commitment to
              clarity, craft, and the belief that every story deserves to be told well.
            </p>

            <p>
              Before focusing full-time on writing, I explored intersections of culture, creativity,
              and technology. Those experiences shaped how I think about storytelling—not as a solo
              act, but as a collaborative practice rooted in listening, research, and deep thinking.
            </p>

            <p>
              Today, I write essays, create brand content, and work on editorial projects that matter
              to me. I&rsquo;m based in [location placeholder], but I work with clients and
              collaborators globally. When I&rsquo;m not writing, I&rsquo;m reading, thinking about
              the future of storytelling, or finding new ways to understand the world through words.
            </p>
          </div>
        </Container>
      </Section>

      {/* Values/Approach */}
      <Section className="bg-bg-elevated">
        <Container>
          <SectionHeading
            eyebrow="Philosophy"
            title="How I Work"
            description="The principles that guide my writing and collaboration."
            align="center"
          />

          <div className="grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <Card key={value.id} variant="elevated">
                <h3 className="mb-3 font-display text-h3 font-semibold text-text-primary">
                  {value.title}
                </h3>
                <p className="text-body text-text-secondary">{value.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-bg-elevated">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-display text-h2 font-semibold text-text-primary">
              Explore my work
            </h2>
            <p className="mb-8 text-body-lg text-text-secondary">
              Read selected essays and stories, or get in touch to discuss a project.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href={siteRoutes.writing} size="lg">
                View writing
              </Button>
              <Button href={callsToAction.primary.href} size="lg" variant="secondary">
                {callsToAction.primary.label}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
