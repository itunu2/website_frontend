import type { NextRequest } from "next/server";
import { env } from "@/config/env";

const readBearerToken = (request: NextRequest) => {
  const authorizationHeader = request.headers.get("authorization");
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
};

export const isNewsletterAdminAuthorized = (request: NextRequest) => {
  const configuredToken = env.server.NEWSLETTER_ADMIN_TOKEN;
  if (!configuredToken) {
    return false;
  }

  const providedToken = readBearerToken(request);
  return Boolean(providedToken && providedToken === configuredToken);
};

export const isNewsletterWebhookAuthorized = (request: NextRequest) => {
  const configuredSecret = env.server.NEWSLETTER_WEBHOOK_SECRET;
  if (!configuredSecret) {
    return false;
  }

  const providedSecret = request.headers.get("x-newsletter-webhook-secret");
  return Boolean(providedSecret && providedSecret === configuredSecret);
};
