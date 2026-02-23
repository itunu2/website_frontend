import { z } from "zod";

export const newsletterSourceValues = ["popup", "footer", "blog-cta", "home-cta"] as const;

export type NewsletterSource = (typeof newsletterSourceValues)[number];

export const newsletterSourceSchema = z.enum(newsletterSourceValues);
