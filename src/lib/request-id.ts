import { env } from "@/config/env";

const FALLBACK_HEADER = "X-Request-ID";

export const getRequestIdHeaderName = (): string => {
  return env.client.NEXT_PUBLIC_REQUEST_ID_HEADER ?? FALLBACK_HEADER;
};

export const generateRequestId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const entropy = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `fallback-${entropy}`;
};
