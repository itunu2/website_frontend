"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { TestimonialCard } from "@/components/ui/testimonial-card";

const testimonials = [
  {
    id: 1,
    quote:
      "Working with Itunu transformed how we tell our story. Her clarity, craft, and ability to distill complex ideas into compelling narratives are exceptional.",
    attribution: "Sarah Chen",
    role: "Creative Director, Brand Studio",
  },
  {
    id: 2,
    quote:
      "Itunu's essays cut through noise with precision and heart. She writes with the kind of thoughtfulness that makes you stop and reconsider what you thought you knew.",
    attribution: "Marcus Johnson",
    role: "Editor, Cultural Review",
  },
  {
    id: 3,
    quote:
      "Her strategic approach to content is refreshing—equal parts creativity and rigor. She doesn't just write; she helps you understand what your story is and why it matters.",
    attribution: "Emily Rodriguez",
    role: "Founder, Impact Collective",
  },
];

export const Testimonials = () => {
  return (
    <Section id="testimonials" className="relative bg-bg-elevated overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/3 rounded-full blur-3xl" />
      
      <Container className="relative z-10">
        {/* Section Header - Left aligned */}
        <motion.div 
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block text-caption font-semibold text-accent-primary mb-3">
            Kind Words
          </span>
          <h2 className="text-h1 font-bold text-text-primary mb-4">
            What People Say
          </h2>
          <p className="text-body-lg text-text-secondary leading-relaxed">
            Feedback from collaborators, editors, and clients.
          </p>
        </motion.div>

        {/* Equal Height Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="flex h-full"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <TestimonialCard
                quote={testimonial.quote}
                attribution={testimonial.attribution}
                role={testimonial.role}
              />
            </motion.div>
          ))}
        </div>


      </Container>
    </Section>
  );
};
