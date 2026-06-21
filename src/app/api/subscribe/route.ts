import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { newsletterSourceSchema } from "@/lib/newsletter/types";
import { Resend } from "resend";

const bodySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: newsletterSourceSchema,
});

async function saveToSupabase(email: string, source: string): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email, source, status: "active", subscribed_at: new Date().toISOString() },
      { onConflict: "email" },
    );

  if (error) console.error("[subscribe] supabase upsert failed:", error.message);
}

async function saveToResend(email: string): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const resend = new Resend(resendKey);
  // Resend moved to global contacts in 2025 — no audienceId needed
  const result = await resend.contacts.create({ email, unsubscribed: false });
  if (result.error) console.error("[subscribe] resend contacts failed:", result.error.message);
}

async function isRateLimited(email: string): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = createServerSupabaseClient();

  const windowStart = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true })
    .eq("email", email)
    .gte("updated_at", windowStart);

  return count !== null && count >= 3;
}

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

  // Rate limit check
  try {
    if (await isRateLimited(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please try again later." },
        { status: 429 },
      );
    }
  } catch {
    // If rate limit check fails, proceed anyway
  }

  const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const hasResend = !!process.env.RESEND_API_KEY;

  if (!hasSupabase && !hasResend) {
    return NextResponse.json(
      { success: false, error: "Unable to subscribe right now. Please try again later." },
      { status: 503 },
    );
  }

  // Save to both simultaneously — neither failure blocks the other
  await Promise.allSettled([
    saveToSupabase(normalizedEmail, source),
    saveToResend(normalizedEmail),
  ]);

  return NextResponse.json({ success: true, message: "You're subscribed!" });
}
