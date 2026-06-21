"use client";

import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus, Minus } from "lucide-react";
import { forwardRef } from "react";

const services = [
  {
    title: "Long-form content",
    body: "In-depth blog posts, guides, and whitepapers that position your brand as a thought leader and drive organic traffic.",
  },
  {
    title: "Website copy",
    body: "Homepage, landing pages, and product pages written to convert visitors into leads and customers.",
  },
  {
    title: "Content strategy",
    body: "A complete content roadmap aligned with your buyer journey from awareness to decision.",
  },
  {
    title: "Case studies",
    body: "Compelling customer stories that showcase real results and build credibility with serious prospects.",
  },
  {
    title: "Email sequences",
    body: "Nurture sequences and lifecycle campaigns that move leads through your funnel with clarity and momentum.",
  },
  {
    title: "Thought leadership",
    body: "Founder and leadership content that builds authority while sounding distinctly human and credible.",
  },
];

const AccordionItem = forwardRef<
  HTMLDivElement,
  { value: string; title: string; body: string; isFirst: boolean }
>(({ value, title, body, isFirst }, ref) => (
  <Accordion.Item
    ref={ref}
    value={value}
    style={{
      borderBottom: "1px solid color-mix(in oklch, var(--text-strong), white 32%)",
      ...(isFirst
        ? { borderTop: "1px solid color-mix(in oklch, var(--text-strong), white 32%)" }
        : {}),
    }}
  >
    <Accordion.Header asChild>
      <h3 style={{ margin: 0 }}>
        <Accordion.Trigger className="accordion-trigger group">
          <span>{title}</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
            }}
          >
            <Plus size={22} strokeWidth={2.2} className="group-data-[state=open]:hidden" />
            <Minus size={22} strokeWidth={2.2} className="group-data-[state=closed]:hidden" />
          </span>
        </Accordion.Trigger>
      </h3>
    </Accordion.Header>
    <Accordion.Content className="accordion-content">
      <p
        style={{
          fontSize: "var(--text-base)",
          lineHeight: 1.68,
          color: "var(--text-default)",
          paddingBottom: "var(--space-5)",
          maxWidth: 620,
        }}
      >
        {body}
      </p>
    </Accordion.Content>
  </Accordion.Item>
));
AccordionItem.displayName = "AccordionItem";

export default function Services() {
  return (
    <section id="services" className="services-section">
      <div className="section-wrap services-grid section-block">
        <div>
          <motion.h2
            data-arrow-end="true"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{
              fontSize: "var(--text-3xl)",
              fontWeight: 800,
              lineHeight: 1.02,
              color: "var(--text-strong)",
            }}
          >
            How can I help
            <br />
            you?
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Accordion.Root type="single" collapsible>
            {services.map((s, i) => (
              <AccordionItem
                key={s.title}
                value={`item-${i}`}
                title={s.title}
                body={s.body}
                isFirst={i === 0}
              />
            ))}
          </Accordion.Root>
        </motion.div>
      </div>
    </section>
  );
}
