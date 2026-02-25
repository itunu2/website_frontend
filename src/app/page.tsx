import { Hero } from "@/components/home/hero";
import { PainPoints } from "@/components/home/pain-points";
import { ValueProposition } from "@/components/home/value-proposition";
import { Services } from "@/components/home/services";
import { AboutTeaser } from "@/components/home/about-teaser";
import { CTABand } from "@/components/home/cta-band";
import { TestimonialQuote } from "@/components/home/testimonial-quote";
import { testimonials } from "@/config/homepage";

export default function Home() {
  return (
    <>
      <Hero />
      <TestimonialQuote {...testimonials[0]} variant="cream" />
      <PainPoints />
      <ValueProposition />
      <TestimonialQuote {...testimonials[1]} variant="white" />
      <Services />
      <AboutTeaser />
      <TestimonialQuote {...testimonials[2]} variant="cream" />
      <CTABand />
    </>
  );
}
