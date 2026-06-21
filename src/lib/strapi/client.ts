import { env } from "@/config/env";
import { StrapiRequestError } from "@/lib/strapi/errors";

interface FetchOptions {
  query?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
  revalidate?: number;
  next?: NextFetchRequestConfig;
  timeoutMs?: number;
  signal?: AbortSignal;
}

const DEFAULT_TIMEOUT = 8_000;
const MAX_RETRIES = 2;

export function buildStrapiURL(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): URL {
  const base = env.client.NEXT_PUBLIC_STRAPI_BASE_URL.replace(/\/$/, "");
  const url = new URL(path.startsWith("http") ? path : `${base}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url;
}

export async function strapiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = buildStrapiURL(path, options.query);

  const headers: HeadersInit = {
    Accept: "application/json",
    "X-Request-ID": crypto.randomUUID(),
  };

  // Attach API token server-side only
  if (typeof window === "undefined") {
    try {
      const token = env.server.STRAPI_BLOG_API_TOKEN;
      if (token) headers["Authorization"] = `Bearer ${token}`;
    } catch {
      // Server env not configured — proceed without auth (will fail on protected endpoints)
    }
  }

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= MAX_RETRIES) {
    const controller = options.signal ? null : new AbortController();
    const timer = controller
      ? setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT)
      : null;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers,
        cache: options.cache ?? "force-cache",
        next: options.revalidate
          ? { revalidate: options.revalidate, ...options.next }
          : options.next,
        signal: options.signal ?? controller?.signal,
      });

      if (timer) clearTimeout(timer);

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new StrapiRequestError(
          `Strapi ${res.status} on ${url.pathname}`,
          res.status,
          body,
        );
      }

      return (await res.json()) as T;
    } catch (error) {
      if (timer) clearTimeout(timer);
      lastError = error;

      const isAbort = error instanceof DOMException && error.name === "AbortError";
      if (isAbort && options.signal) break; // caller-initiated abort — don't retry

      const isRetryable =
        (error instanceof StrapiRequestError && error.status >= 500) ||
        !(error instanceof StrapiRequestError);

      if (isRetryable && attempt < MAX_RETRIES) {
        attempt++;
        await new Promise((r) => setTimeout(r, 200 * attempt));
        continue;
      }
      break;
    }
  }

  if (lastError instanceof StrapiRequestError) throw lastError;
  if (lastError instanceof DOMException && lastError.name === "AbortError") {
    throw new Error(`Strapi request to ${url.pathname} timed out`);
  }
  throw new Error(`Strapi request to ${url.pathname} failed: ${String(lastError)}`);
}
