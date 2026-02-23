import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/config/env";
import { newsletterSourceSchema } from "@/lib/newsletter/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const subscribeBodySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: newsletterSourceSchema,
});

const WINDOW_MS = 60 * 60 * 1000;

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const getClientIp = (request: NextRequest) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
};

const isRateLimited = (ipAddress: string, limitPerHour: number) => {
  const now = Date.now();
  const current = rateLimitBuckets.get(ipAddress);

  if (!current || now >= current.resetAt) {
    rateLimitBuckets.set(ipAddress, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return false;
  }

  if (current.count >= limitPerHour) {
    return true;
  }

  current.count += 1;
  rateLimitBuckets.set(ipAddress, current);
  return false;
};

const syncToSubstack = async (email: string) => {
  const endpoint = env.server.SUBSTACK_SUBSCRIBE_ENDPOINT;
  if (!endpoint) {
    return false;
  }

  const endpointCandidates = (() => {
    try {
      const parsed = new URL(endpoint);
      const normalized = new URL(endpoint);
      if (parsed.pathname === "/api/v1/free-signup") {
        normalized.pathname = "/api/v1/free";
      }

      return Array.from(new Set([normalized.toString(), endpoint]));
    } catch {
      return [endpoint];
    }
  })();

  for (const candidate of endpointCandidates) {
    try {
      const jsonResponse = await fetch(candidate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(7000),
        cache: "no-store",
      });

      if (jsonResponse.ok) {
        return true;
      }

      const formResponse = await fetch(candidate, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "*/*",
        },
        body: new URLSearchParams({ email }).toString(),
        signal: AbortSignal.timeout(7000),
        cache: "no-store",
      });

      if (formResponse.ok) {
        return true;
      }

      console.error("Substack subscribe failed", {
        endpoint: candidate,
        jsonStatus: jsonResponse.status,
        formStatus: formResponse.status,
      });
    } catch (error) {
      console.error("Substack subscribe request error", {
        endpoint: candidate,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return false;
};

export async function POST(request: NextRequest) {
  const requestBody = await request.json().catch(() => null);
  const parsedBody = subscribeBodySchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        success: false,
        error: parsedBody.error.issues[0]?.message ?? "Invalid request body",
      },
      { status: 400 },
    );
  }

  const ipAddress = getClientIp(request);
  const limitPerHour = env.server.NEWSLETTER_RATE_LIMIT_PER_HOUR;
  if (isRateLimited(ipAddress, limitPerHour)) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many subscription attempts. Please try again later.",
      },
      { status: 429 },
    );
  }

  try {
    const supabase = createServerSupabaseClient();
    const { email, source } = parsedBody.data;

    const { error: upsertError } = await supabase.from("newsletter_subscribers").upsert(
      {
        email: email.toLowerCase(),
        source,
        status: "active",
        subscribed_at: new Date().toISOString(),
      },
      {
        onConflict: "email",
      },
    );

    if (upsertError) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to save your subscription right now.",
        },
        { status: 500 },
      );
    }

    const substackSynced = await syncToSubstack(email.toLowerCase());

    if (substackSynced) {
      await supabase
        .from("newsletter_subscribers")
        .update({ substack_synced: true })
        .eq("email", email.toLowerCase());
    }

    return NextResponse.json({ success: true, substackSynced });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Subscription service is not configured yet.",
      },
      { status: 500 },
    );
  }
}
