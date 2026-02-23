import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url({ message: "NEXT_PUBLIC_SITE_URL must be a valid URL" })
    .default("http://localhost:3000"),
  NEXT_PUBLIC_STRAPI_BASE_URL: z
    .string()
    .url({ message: "NEXT_PUBLIC_STRAPI_BASE_URL must be a valid URL" })
    .default("http://127.0.0.1:1337"),
  NEXT_PUBLIC_REQUEST_ID_HEADER: z
    .string()
    .min(1, "NEXT_PUBLIC_REQUEST_ID_HEADER cannot be empty")
    .default("X-Request-ID"),
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: z
    .coerce.number()
    .int()
    .min(1)
    .max(50)
    .default(6),
  NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS: z
    .coerce.number()
    .int()
    .min(0)
    .max(3600)
    .default(60),
});

const serverSchema = z.object({
  STRAPI_BLOG_API_TOKEN: z.string().min(1).optional(),
  SUPABASE_URL: z.string().url({ message: "SUPABASE_URL must be a valid URL" }).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NEWSLETTER_ADMIN_TOKEN: z.string().min(1).optional(),
  NEWSLETTER_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEWSLETTER_RATE_LIMIT_PER_HOUR: z.coerce.number().int().min(1).max(100).default(3),
});

type ClientEnv = z.infer<typeof clientSchema>;
type ServerEnv = z.infer<typeof serverSchema>;

const parse = <T>(schema: z.ZodTypeAny, input: Record<string, unknown>): T => {
  const result = schema.safeParse(input);
  if (!result.success) {
    const errorMessages = result.error.issues
      .map((issue: z.ZodIssue) => `${issue.path.join(".") || ""}${issue.message ? `: ${issue.message}` : ""}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${errorMessages}`);
  }
  return result.data as T;
};

const clientEnv = parse<ClientEnv>(clientSchema, {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_STRAPI_BASE_URL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL,
  NEXT_PUBLIC_REQUEST_ID_HEADER: process.env.NEXT_PUBLIC_REQUEST_ID_HEADER,
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
  NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS: process.env.NEXT_PUBLIC_STRAPI_REVALIDATE_SECONDS,
});

let serverEnv: ServerEnv | null = null;

export const env = {
  client: clientEnv,
  get server(): ServerEnv {
    if (typeof window !== "undefined") {
      throw new Error("Attempted to access server environment variables on the client");
    }

    if (!serverEnv) {
      serverEnv = parse<ServerEnv>(serverSchema, {
        STRAPI_BLOG_API_TOKEN: process.env.STRAPI_BLOG_API_TOKEN,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        NEWSLETTER_ADMIN_TOKEN: process.env.NEWSLETTER_ADMIN_TOKEN,
        NEWSLETTER_WEBHOOK_SECRET: process.env.NEWSLETTER_WEBHOOK_SECRET,
        NEWSLETTER_RATE_LIMIT_PER_HOUR: process.env.NEWSLETTER_RATE_LIMIT_PER_HOUR,
      });
    }

    return serverEnv;
  },
};
