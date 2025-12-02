import { env } from "@/config/env";
import { generateRequestId, getRequestIdHeaderName } from "@/lib/request-id";
import { StrapiRequestError } from "@/lib/strapi/errors";

interface StrapiClientOptions {
  cache?: RequestCache;
  headers?: HeadersInit;
  next?: RevalidateConfig;
  revalidate?: number;
  requestId?: string;
  query?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

interface RevalidateConfig {
  revalidate?: number;
  tags?: string[];
}

const DEFAULT_TIMEOUT = 8000;
const MAX_RETRIES = 2;

export const buildStrapiURL = (path: string, query?: Record<string, string | number | boolean | undefined>) => {
  const cleanPath = path.startsWith("http") ? path : `${env.client.NEXT_PUBLIC_STRAPI_BASE_URL.replace(/\/$/, "")}${path}`;
  const url = new URL(cleanPath);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }

  return url;
};

export const strapiFetch = async <TResponse>(path: string, options: StrapiClientOptions = {}): Promise<TResponse> => {
  const url = buildStrapiURL(path, options.query);
  const requestId = options.requestId ?? generateRequestId();

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set(getRequestIdHeaderName(), requestId);

  if (typeof window === "undefined") {
    const token = env.server.STRAPI_BLOG_API_TOKEN;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= MAX_RETRIES) {
    const controller = options.signal ? null : new AbortController();
    const timeoutId = !options.signal
      ? setTimeout(() => controller?.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT)
      : null;

    try {
      const response = await fetch(url, {
        cache: options.cache ?? "force-cache",
        headers,
        method: "GET",
        next: options.revalidate ? { revalidate: options.revalidate, ...(options.next ?? {}) } : options.next,
        signal: options.signal ?? controller?.signal,
      });
      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await safeJson(response);
        throw new StrapiRequestError(
          `Strapi responded with status ${response.status}`,
          response.status,
          errorBody,
        );
      }

      const data: TResponse = await response.json();
      return data;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      lastError = error;
      const isAbortError = error instanceof DOMException && error.name === "AbortError";
      const isServerError = error instanceof StrapiRequestError && error.status >= 500;
      const isNetworkError = !(error instanceof StrapiRequestError);
      const shouldRetry = !options.signal && (isServerError || isNetworkError) && attempt < MAX_RETRIES;

      if (!shouldRetry || isAbortError) {
        break;
      }
      attempt += 1;
      await new Promise((resolve) => setTimeout(resolve, 150 * attempt));
    }
  }
  if (lastError instanceof StrapiRequestError) {
    throw lastError;
  }
  if (lastError instanceof DOMException && lastError.name === "AbortError") {
    throw new Error(`Strapi request to ${url.pathname} timed out`);
  }
  throw new Error(`Strapi request to ${url.pathname} failed: ${String(lastError)}`);
};

const safeJson = async (response: Response) => {
  try {
    return await response.json();
  } catch (error) {
    return { error: "Unable to parse JSON", details: String(error) };
  }
};
