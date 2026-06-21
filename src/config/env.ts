import { z } from "zod";

/* ── Client env (parsed eagerly, safe for browser) ── */

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_STRAPI_BASE_URL: z.string().url().default("http://127.0.0.1:1337"),
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: z.coerce.number().int().min(1).max(50).default(6),
  NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS: z.coerce.number().int().min(0).max(3600).default(60),
});

const clientResult = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_STRAPI_BASE_URL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL,
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
  NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS: process.env.NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS,
});

if (!clientResult.success) {
  throw new Error(
    `Invalid client env:\n${clientResult.error.issues.map((i) => `  ${i.path}: ${i.message}`).join("\n")}`,
  );
}

/* ── Server env (parsed lazily on first access — never runs in browser) ── */

const serverSchema = z.object({
  STRAPI_BLOG_API_TOKEN: z.string().optional().default(""),
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  NEWSLETTER_ADMIN_TOKEN: z.string().min(1).optional(),
  NEWSLETTER_WEBHOOK_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_AUDIENCE_ID: z.string().optional(), // Deprecated — Resend moved to global contacts in 2025
  CONTACT_EMAIL_TO: z.string().email().optional(),
});

type ServerEnv = z.infer<typeof serverSchema>;
let _server: ServerEnv | null = null;

export const env = {
  client: clientResult.data,

  get server(): ServerEnv {
    if (typeof window !== "undefined") {
      throw new Error("Server env accessed on the client");
    }
    if (!_server) {
      const result = serverSchema.safeParse({
        STRAPI_BLOG_API_TOKEN: process.env.STRAPI_BLOG_API_TOKEN,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        NEWSLETTER_ADMIN_TOKEN: process.env.NEWSLETTER_ADMIN_TOKEN,
        NEWSLETTER_WEBHOOK_SECRET: process.env.NEWSLETTER_WEBHOOK_SECRET,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        CONTACT_EMAIL_TO: process.env.CONTACT_EMAIL_TO,
      });
      if (!result.success) {
        console.warn(
          `[env] Server env validation warnings:\n${result.error.issues.map((i) => `  ${i.path}: ${i.message}`).join("\n")}`,
        );
        // Return partial — individual services will throw clear errors when their required vars are missing
        _server = result.data as unknown as ServerEnv;
      } else {
        _server = result.data;
      }
    }
    return _server;
  },
};
