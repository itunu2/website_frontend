import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { newsletterSourceSchema } from "@/lib/newsletter/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: newsletterSourceSchema,
});

const RATE_LIMIT_WINDOW_MINUTES = 60;
const RATE_LIMIT_MAX = 3;

export async function POST(request: NextRequest) {
  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { email, source } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const supabase = createServerSupabaseClient();

    // Rate limit: check recent signups from this email (works in serverless — no in-memory state)
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("email", normalizedEmail)
      .gte("updated_at", windowStart);

    if (count !== null && count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please try again later." },
        { status: 429 },
      );
    }

    // Upsert subscriber — match the actual Supabase table schema
    const { error: upsertError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email: normalizedEmail,
          source,
          status: "active",
          subscribed_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      );

    if (upsertError) {
      console.error("[subscribe] upsert failed:", upsertError.message);
      return NextResponse.json(
        { success: false, error: "Unable to save your subscription right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: "You're subscribed!" });
  } catch (err) {
    console.error("[subscribe] error:", err);
    return NextResponse.json(
      { success: false, error: "Subscription service is not configured yet." },
      { status: 500 },
    );
  }
}
