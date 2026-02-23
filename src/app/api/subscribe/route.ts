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

const normalizeEmail = (email: string) => email.trim().toLowerCase();

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
    const normalizedEmail = normalizeEmail(email);

    const { error: upsertError } = await supabase.from("newsletter_subscribers").upsert(
      {
        email: normalizedEmail,
        source,
        status: "active",
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

    const { error: queuedUpdateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        substack_sync_queued_at: new Date().toISOString(),
      })
      .eq("email", normalizedEmail)
      .eq("substack_synced", false)
      .is("sync_batch_id", null);

    if (queuedUpdateError) {
      console.error("Failed to update newsletter queue timestamp", {
        email: normalizedEmail,
        error: queuedUpdateError.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "You're subscribed!",
      substackSynced: false,
      syncQueued: true,
    });
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
